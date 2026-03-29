"""Campaign optimizer Celery periodic task — runs every 15 minutes.

Fetches active campaigns and live campaigns, queries Gemini for bid/budget
recommendations, applies adjustments, and logs every run to ai_optimization_logs.
"""
import asyncio
import json
from datetime import datetime, timezone
from decimal import Decimal

import httpx
import structlog

from app.tasks.celery_app import celery_app

logger = structlog.get_logger()

_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
_GEMINI_MODEL = "gemini-1.5-flash"

BID_MIN = Decimal("0.01")
BID_MAX = Decimal("50.00")
DAILY_BUDGET_MIN = Decimal("1.00")


def run_async(coro):
    """Run async code in Celery sync task."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            raise RuntimeError("closed")
        return loop.run_until_complete(coro)
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(coro)
        finally:
            loop.close()


async def _call_gemini_optimizer(campaign_data: dict) -> dict | None:
    """Call Gemini for optimization recommendations. Returns parsed JSON or None."""
    from app.config import settings

    if not settings.GEMINI_API_KEY:
        return None

    prompt = f"""You are an ad campaign optimizer. Analyze this campaign's performance metrics and recommend bid/budget adjustments.

Campaign data:
- Campaign ID: {campaign_data.get("campaign_id")}
- Impressions (24h): {campaign_data.get("impressions_count", 0)}
- Clicks (24h): {campaign_data.get("clicks_count", 0)}
- CTR: {campaign_data.get("ctr", 0):.4f}
- Current bid: ${campaign_data.get("bid_amount", 0)}
- Total budget: ${campaign_data.get("total_budget", 0)}
- Spent amount: ${campaign_data.get("spent_amount", 0)}
- Spend ratio: {campaign_data.get("spend_ratio", 0):.4f}
- Daily budget: {campaign_data.get("daily_budget")}
- Today spend: ${campaign_data.get("today_spend", 0)}
- Daily spend ratio: {campaign_data.get("daily_spend_ratio", 0):.4f}

Rules:
- bid_adjustment_pct must be between -20 and +20
- daily_budget_adjustment_pct must be between -15 and +15
- action must be one of: increase_bid, decrease_bid, pause, no_change
- Only recommend pause if performance is extremely poor (CTR near 0 and budget burning fast)

Return ONLY valid JSON, no markdown, no explanation:
{{
  "bid_adjustment_pct": <float -20 to +20>,
  "daily_budget_adjustment_pct": <float -15 to +15>,
  "reasoning": "<concise reason>",
  "action": "<increase_bid|decrease_bid|pause|no_change>"
}}"""

    url = f"{_GEMINI_BASE_URL}/{_GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 512},
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()

        text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        if text.startswith("```"):
            text = text.split("```", 2)[1]
            if text.startswith("json"):
                text = text[4:]
        if text.endswith("```"):
            text = text.rsplit("```", 1)[0]
        return json.loads(text.strip())
    except Exception as e:
        logger.warning("Gemini optimizer call failed", error=str(e))
        return None


async def _optimize_campaigns():
    from app.database import AsyncSessionLocal
    from app.models.adnet import Campaign, CampaignStatus
    from app.models.delivery import LiveCampaign, LiveCampaignStatus, PacingCounter
    from app.models.finance import FraudSignal
    from app.models.ai_logs import AiOptimizationLog
    from sqlalchemy import select, and_
    from sqlalchemy.ext.asyncio import AsyncSession

    async with AsyncSessionLocal() as db:
        # ── Process adnet Campaigns ───────────────────────────────────────
        result = await db.execute(
            select(Campaign).where(
                and_(
                    Campaign.status == CampaignStatus.ACTIVE,
                    Campaign.is_active == True,
                )
            )
        )
        campaigns = result.scalars().all()
        logger.info("Optimizer: processing campaigns", count=len(campaigns))

        for campaign in campaigns:
            try:
                ctr = (
                    campaign.clicks_count / campaign.impressions_count
                    if campaign.impressions_count > 0
                    else 0.0
                )
                spend_ratio = (
                    float(campaign.spent_amount) / float(campaign.total_budget)
                    if campaign.total_budget > 0
                    else 0.0
                )

                # Today's spend from PacingCounter (not available for adnet campaigns directly)
                today_spend = Decimal("0")
                daily_spend_ratio = 0.0

                campaign_data = {
                    "campaign_id": str(campaign.id),
                    "impressions_count": campaign.impressions_count,
                    "clicks_count": campaign.clicks_count,
                    "ctr": ctr,
                    "bid_amount": float(campaign.bid_amount),
                    "total_budget": float(campaign.total_budget),
                    "spent_amount": float(campaign.spent_amount),
                    "spend_ratio": spend_ratio,
                    "daily_budget": float(campaign.daily_budget) if campaign.daily_budget else None,
                    "today_spend": float(today_spend),
                    "daily_spend_ratio": daily_spend_ratio,
                }

                gemini_result = await _call_gemini_optimizer(campaign_data)

                if not gemini_result:
                    log = AiOptimizationLog(
                        campaign_id=campaign.id,
                        action="no_change",
                        reasoning="Gemini unavailable — no adjustment made",
                        gemini_raw_response=None,
                    )
                    db.add(log)
                    continue

                action = gemini_result.get("action", "no_change")
                bid_adj_pct = float(gemini_result.get("bid_adjustment_pct", 0))
                budget_adj_pct = float(gemini_result.get("daily_budget_adjustment_pct", 0))
                reasoning = gemini_result.get("reasoning", "")

                # Clamp adjustments
                bid_adj_pct = max(-20.0, min(20.0, bid_adj_pct))
                budget_adj_pct = max(-15.0, min(15.0, budget_adj_pct))

                if action == "pause":
                    campaign.is_active = False
                    signal = FraudSignal(
                        campaign_id=None,
                        slot_id=None,
                        signal_type="ai_optimizer_pause",
                        severity=5,
                        description=reasoning,
                        signal_data={"campaign_id": str(campaign.id)},
                    )
                    db.add(signal)
                else:
                    # Apply bid adjustment
                    if bid_adj_pct != 0:
                        new_bid = campaign.bid_amount * Decimal(str(1 + bid_adj_pct / 100))
                        campaign.bid_amount = max(BID_MIN, min(BID_MAX, new_bid))

                    # Apply daily budget adjustment
                    if budget_adj_pct != 0 and campaign.daily_budget is not None:
                        new_daily = campaign.daily_budget * Decimal(str(1 + budget_adj_pct / 100))
                        campaign.daily_budget = max(DAILY_BUDGET_MIN, new_daily)

                log = AiOptimizationLog(
                    campaign_id=campaign.id,
                    action=action,
                    bid_adjustment_pct=Decimal(str(round(bid_adj_pct, 2))),
                    budget_adjustment_pct=Decimal(str(round(budget_adj_pct, 2))),
                    reasoning=reasoning,
                    gemini_raw_response=gemini_result,
                )
                db.add(log)
                logger.info(
                    "Optimizer: campaign adjusted",
                    campaign_id=str(campaign.id),
                    action=action,
                    bid_adj_pct=bid_adj_pct,
                )

            except Exception as e:
                logger.error("Optimizer: failed to process campaign", campaign_id=str(campaign.id), error=str(e))

        # ── Process LiveCampaigns ─────────────────────────────────────────
        live_result = await db.execute(
            select(LiveCampaign).where(LiveCampaign.status == LiveCampaignStatus.ACTIVE)
        )
        live_campaigns = live_result.scalars().all()
        logger.info("Optimizer: processing live campaigns", count=len(live_campaigns))

        for lc in live_campaigns:
            try:
                # Get pacing counter for today's spend
                pc_result = await db.execute(
                    select(PacingCounter).where(PacingCounter.campaign_id == lc.id)
                )
                pacing = pc_result.scalar_one_or_none()
                today_spend = Decimal("0")
                daily_spend_ratio = 0.0
                if pacing:
                    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
                    if pacing.date_bucket == today_str:
                        today_spend = Decimal(str(pacing.spend_today))
                    if lc.daily_budget_cap and lc.daily_budget_cap > 0:
                        daily_spend_ratio = float(today_spend) / float(lc.daily_budget_cap)

                # Approximate CTR from PacingCounter
                impressions_today = pacing.impressions_today if pacing else 0
                clicks_today = pacing.clicks_today if pacing else 0
                ctr = clicks_today / impressions_today if impressions_today > 0 else 0.0

                spend_ratio = (
                    float(lc.spent_amount) / float(lc.total_budget)
                    if lc.total_budget > 0
                    else 0.0
                )

                # Use cpm_rate or cpc_rate as the "bid"
                current_bid = float(lc.cpm_rate if lc.pricing_model.value == "CPM" else lc.cpc_rate)

                campaign_data = {
                    "campaign_id": str(lc.id),
                    "impressions_count": impressions_today,
                    "clicks_count": clicks_today,
                    "ctr": ctr,
                    "bid_amount": current_bid,
                    "total_budget": float(lc.total_budget),
                    "spent_amount": float(lc.spent_amount),
                    "spend_ratio": spend_ratio,
                    "daily_budget": float(lc.daily_budget_cap) if lc.daily_budget_cap else None,
                    "today_spend": float(today_spend),
                    "daily_spend_ratio": daily_spend_ratio,
                }

                gemini_result = await _call_gemini_optimizer(campaign_data)

                if not gemini_result:
                    log = AiOptimizationLog(
                        live_campaign_id=lc.id,
                        action="no_change",
                        reasoning="Gemini unavailable — no adjustment made",
                        gemini_raw_response=None,
                    )
                    db.add(log)
                    continue

                action = gemini_result.get("action", "no_change")
                bid_adj_pct = float(gemini_result.get("bid_adjustment_pct", 0))
                budget_adj_pct = float(gemini_result.get("daily_budget_adjustment_pct", 0))
                reasoning = gemini_result.get("reasoning", "")

                bid_adj_pct = max(-20.0, min(20.0, bid_adj_pct))
                budget_adj_pct = max(-15.0, min(15.0, budget_adj_pct))

                if action == "pause":
                    lc.status = LiveCampaignStatus.PAUSED
                    signal = FraudSignal(
                        campaign_id=lc.id,
                        slot_id=None,
                        signal_type="ai_optimizer_pause",
                        severity=5,
                        description=reasoning,
                        signal_data={"live_campaign_id": str(lc.id)},
                    )
                    db.add(signal)
                else:
                    multiplier = Decimal(str(1 + bid_adj_pct / 100))
                    if lc.pricing_model.value == "CPM":
                        new_rate = lc.cpm_rate * multiplier
                        lc.cpm_rate = max(Decimal("0.01"), min(Decimal("50.00"), new_rate))
                    else:
                        new_rate = lc.cpc_rate * multiplier
                        lc.cpc_rate = max(Decimal("0.001"), min(Decimal("50.00"), new_rate))

                    if budget_adj_pct != 0 and lc.daily_budget_cap is not None:
                        new_daily = lc.daily_budget_cap * Decimal(str(1 + budget_adj_pct / 100))
                        lc.daily_budget_cap = max(DAILY_BUDGET_MIN, new_daily)

                log = AiOptimizationLog(
                    live_campaign_id=lc.id,
                    action=action,
                    bid_adjustment_pct=Decimal(str(round(bid_adj_pct, 2))),
                    budget_adjustment_pct=Decimal(str(round(budget_adj_pct, 2))),
                    reasoning=reasoning,
                    gemini_raw_response=gemini_result,
                )
                db.add(log)
                logger.info(
                    "Optimizer: live campaign adjusted",
                    live_campaign_id=str(lc.id),
                    action=action,
                )

            except Exception as e:
                logger.error(
                    "Optimizer: failed to process live campaign",
                    live_campaign_id=str(lc.id),
                    error=str(e),
                )

        await db.commit()
        logger.info("Optimizer: run complete")


@celery_app.task(name="app.tasks.campaign_optimizer.optimize_all_campaigns", bind=True, max_retries=0)
def optimize_all_campaigns(self):
    """Periodic task: optimize all active campaigns via Gemini AI."""
    logger.info("Campaign optimizer task started")
    run_async(_optimize_campaigns())
