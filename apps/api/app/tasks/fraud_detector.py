"""Fraud detection Celery periodic task — runs every 10 minutes.

Detects click flooding, orphan clicks, session impression bombing,
and CTR anomalies. Flags fraud signals and optionally pauses campaigns.
Sends aggregated signals to Gemini for coordinated attack analysis.
"""
import asyncio
import json
from datetime import datetime, timedelta, timezone

import httpx
import structlog

from app.tasks.celery_app import celery_app

logger = structlog.get_logger()

_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
_GEMINI_MODEL = "gemini-1.5-flash"

# Severity constants
_HIGH = 8
_MEDIUM = 5
_LOW = 2


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


async def _call_gemini_fraud_analysis(signals: list[dict]) -> dict | None:
    """Send collected signals to Gemini for coordinated attack analysis."""
    from app.config import settings

    if not settings.GEMINI_API_KEY or not signals:
        return None

    prompt = f"""You are an ad fraud detection system. Analyze these fraud signals detected in the last 10 minutes and determine if there is a coordinated attack pattern.

Fraud signals:
{json.dumps(signals, indent=2)}

Return ONLY valid JSON, no markdown, no explanation:
{{
  "is_coordinated": <bool>,
  "affected_campaign_ids": [<list of campaign_id strings>],
  "recommended_action": "<brief recommended action>"
}}"""

    url = f"{_GEMINI_BASE_URL}/{_GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 512},
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
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
        logger.warning("Gemini fraud analysis call failed", error=str(e))
        return None


async def _signal_already_exists(db, signal_type: str, campaign_id=None, slot_id=None) -> bool:
    """Check if a similar signal was recorded in the last 2 hours."""
    from app.models.finance import FraudSignal
    from sqlalchemy import select, and_

    cutoff = datetime.now(timezone.utc) - timedelta(hours=2)
    conditions = [
        FraudSignal.signal_type == signal_type,
        FraudSignal.created_at >= cutoff,
    ]
    if campaign_id is not None:
        conditions.append(FraudSignal.campaign_id == campaign_id)
    if slot_id is not None:
        conditions.append(FraudSignal.slot_id == slot_id)

    result = await db.execute(select(FraudSignal).where(and_(*conditions)).limit(1))
    return result.scalar_one_or_none() is not None


async def _run_fraud_detection():
    from app.database import AsyncSessionLocal
    from app.models.finance import FraudSignal
    from app.models.delivery import AdClick, AdImpression, LiveCampaign, LiveCampaignStatus
    from sqlalchemy import select, func, and_, text

    async with AsyncSessionLocal() as db:
        now = datetime.now(timezone.utc)
        one_hour_ago = now - timedelta(hours=1)
        thirty_min_ago = now - timedelta(minutes=30)

        collected_signals: list[dict] = []

        # ── RULE 1: Click flooding (>50 clicks from same IP in 1 hour) ───
        try:
            click_flood_query = (
                select(AdClick.ip_hash, func.count(AdClick.id).label("click_count"))
                .where(
                    and_(
                        AdClick.clicked_at > one_hour_ago,
                        AdClick.ip_hash.isnot(None),
                    )
                )
                .group_by(AdClick.ip_hash)
                .having(func.count(AdClick.id) > 50)
            )
            result = await db.execute(click_flood_query)
            flood_rows = result.all()

            for row in flood_rows:
                ip_hash, click_count = row.ip_hash, row.click_count
                if not await _signal_already_exists(db, "click_flood"):
                    signal = FraudSignal(
                        signal_type="click_flood",
                        severity=_HIGH,
                        description=f"IP {ip_hash[:8]}... generated {click_count} clicks in 1 hour",
                        signal_data={"ip_hash": ip_hash, "click_count": click_count},
                    )
                    db.add(signal)
                    collected_signals.append(
                        {"type": "click_flood", "severity": _HIGH, "ip_hash": ip_hash, "click_count": click_count}
                    )
                    logger.warning("Fraud: click flooding detected", ip_hash=ip_hash[:8], count=click_count)
        except Exception as e:
            logger.error("Fraud rule 1 failed", error=str(e))

        # ── RULE 2: Orphan clicks (clicks without impressions) ───────────
        try:
            orphan_query = text("""
                SELECT c.campaign_id, COUNT(*) as orphan_clicks
                FROM ad_clicks c
                LEFT JOIN ad_impressions i
                    ON i.campaign_id = c.campaign_id
                    AND i.session_id IS NOT NULL
                WHERE c.clicked_at > :cutoff
                    AND i.id IS NULL
                GROUP BY c.campaign_id
                HAVING COUNT(*) > 20
            """)
            result = await db.execute(orphan_query, {"cutoff": one_hour_ago})
            orphan_rows = result.all()

            for row in orphan_rows:
                campaign_id = row.campaign_id
                orphan_clicks = row.orphan_clicks
                if not await _signal_already_exists(db, "orphan_click", campaign_id=campaign_id):
                    signal = FraudSignal(
                        campaign_id=campaign_id,
                        signal_type="orphan_click",
                        severity=_MEDIUM,
                        description=f"{orphan_clicks} clicks without matching impressions in 1 hour",
                        signal_data={"campaign_id": str(campaign_id), "orphan_clicks": orphan_clicks},
                    )
                    db.add(signal)
                    collected_signals.append(
                        {"type": "orphan_click", "severity": _MEDIUM, "campaign_id": str(campaign_id), "orphan_clicks": orphan_clicks}
                    )
                    logger.warning("Fraud: orphan clicks detected", campaign_id=str(campaign_id), count=orphan_clicks)
        except Exception as e:
            logger.error("Fraud rule 2 failed", error=str(e))

        # ── RULE 3: Session impression bombing (>100 impressions in 30 min) ─
        try:
            session_bomb_query = (
                select(AdImpression.session_id, func.count(AdImpression.id).label("imp_count"))
                .where(
                    and_(
                        AdImpression.served_at > thirty_min_ago,
                        AdImpression.session_id.isnot(None),
                    )
                )
                .group_by(AdImpression.session_id)
                .having(func.count(AdImpression.id) > 100)
            )
            result = await db.execute(session_bomb_query)
            bomb_rows = result.all()

            for row in bomb_rows:
                session_id, imp_count = row.session_id, row.imp_count
                if not await _signal_already_exists(db, "session_bomb"):
                    signal = FraudSignal(
                        signal_type="session_bomb",
                        severity=_HIGH,
                        description=f"Session {session_id[:8]}... had {imp_count} impressions in 30 minutes",
                        signal_data={"session_id": session_id, "imp_count": imp_count},
                    )
                    db.add(signal)
                    collected_signals.append(
                        {"type": "session_bomb", "severity": _HIGH, "session_id": session_id, "imp_count": imp_count}
                    )
                    logger.warning("Fraud: session impression bombing", session_id=session_id[:8], count=imp_count)
        except Exception as e:
            logger.error("Fraud rule 3 failed", error=str(e))

        # ── RULE 4: CTR anomaly (>50% CTR on any slot in last 1 hour) ────
        try:
            slot_imp_query = (
                select(AdImpression.slot_id, func.count(AdImpression.id).label("imp_count"))
                .where(AdImpression.served_at > one_hour_ago)
                .group_by(AdImpression.slot_id)
            )
            slot_click_query = (
                select(AdClick.slot_id, func.count(AdClick.id).label("click_count"))
                .where(AdClick.clicked_at > one_hour_ago)
                .group_by(AdClick.slot_id)
            )

            imp_result = await db.execute(slot_imp_query)
            click_result = await db.execute(slot_click_query)

            imp_by_slot = {row.slot_id: row.imp_count for row in imp_result.all()}
            click_by_slot = {row.slot_id: row.click_count for row in click_result.all()}

            for slot_id, click_count in click_by_slot.items():
                imp_count = imp_by_slot.get(slot_id, 0)
                if imp_count == 0:
                    continue
                ctr = click_count / imp_count
                if ctr > 0.5:
                    if not await _signal_already_exists(db, "ctr_anomaly", slot_id=slot_id):
                        signal = FraudSignal(
                            slot_id=slot_id,
                            signal_type="ctr_anomaly",
                            severity=_HIGH,
                            description=f"Slot CTR of {ctr:.1%} is anomalously high (threshold: 50%)",
                            signal_data={"slot_id": str(slot_id), "ctr": ctr, "impressions": imp_count, "clicks": click_count},
                        )
                        db.add(signal)
                        collected_signals.append(
                            {"type": "ctr_anomaly", "severity": _HIGH, "slot_id": str(slot_id), "ctr": ctr}
                        )
                        logger.warning("Fraud: CTR anomaly on slot", slot_id=str(slot_id), ctr=ctr)
        except Exception as e:
            logger.error("Fraud rule 4 failed", error=str(e))

        await db.flush()

        # ── Auto-pause campaigns for HIGH severity signals ────────────────
        high_severity_campaign_ids = set()
        for sig in collected_signals:
            if sig.get("severity", 0) >= _HIGH:
                cid = sig.get("campaign_id")
                if cid:
                    high_severity_campaign_ids.add(cid)

        for campaign_id_str in high_severity_campaign_ids:
            try:
                import uuid
                cid = uuid.UUID(campaign_id_str)
                result = await db.execute(
                    select(LiveCampaign).where(LiveCampaign.id == cid)
                )
                lc = result.scalar_one_or_none()
                if lc and lc.status == LiveCampaignStatus.ACTIVE:
                    lc.status = LiveCampaignStatus.PAUSED
                    logger.warning("Fraud: auto-paused campaign due to HIGH severity signal", campaign_id=campaign_id_str)
            except Exception as e:
                logger.error("Failed to auto-pause campaign", campaign_id=campaign_id_str, error=str(e))

        # ── Gemini coordinated attack analysis ────────────────────────────
        if collected_signals:
            try:
                gemini_result = await _call_gemini_fraud_analysis(collected_signals)
                if gemini_result and gemini_result.get("is_coordinated"):
                    affected_ids = gemini_result.get("affected_campaign_ids", [])
                    logger.warning(
                        "Fraud: coordinated attack detected by Gemini",
                        affected_campaigns=affected_ids,
                        action=gemini_result.get("recommended_action"),
                    )
                    for campaign_id_str in affected_ids:
                        try:
                            import uuid
                            cid = uuid.UUID(campaign_id_str)
                            result = await db.execute(
                                select(LiveCampaign).where(LiveCampaign.id == cid)
                            )
                            lc = result.scalar_one_or_none()
                            if lc and lc.status == LiveCampaignStatus.ACTIVE:
                                lc.status = LiveCampaignStatus.PAUSED
                                logger.warning(
                                    "Fraud: Gemini-recommended pause",
                                    campaign_id=campaign_id_str,
                                )
                        except Exception as e:
                            logger.error("Failed to pause Gemini-flagged campaign", campaign_id=campaign_id_str, error=str(e))
            except Exception as e:
                logger.error("Gemini fraud analysis failed", error=str(e))

        await db.commit()
        logger.info("Fraud detector: run complete", signals_found=len(collected_signals))


@celery_app.task(name="app.tasks.fraud_detector.detect_fraud", bind=True, max_retries=0)
def detect_fraud(self):
    """Periodic task: detect ad fraud across the network."""
    logger.info("Fraud detector task started")
    run_async(_run_fraud_detection())
