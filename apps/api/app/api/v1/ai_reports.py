"""AI-powered reporting assistant endpoints."""
import json
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import httpx
import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.adnet import Campaign, Ad
from app.models.delivery import AdImpression, AdClick, LiveCampaign, LiveCampaignStatus
from app.models.publisher import AdSlot, Placement, PublisherProfile, PublisherStatus
from app.config import settings

router = APIRouter(prefix="/ai", tags=["ai_reports"])
logger = structlog.get_logger()

_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
_GEMINI_MODEL = "gemini-1.5-flash"


# ── Schemas ────────────────────────────────────────────────────────────────────

class CampaignAIReportRequest(BaseModel):
    campaign_id: str
    period_days: int = 7


class PublisherAIReportRequest(BaseModel):
    publisher_id: str
    period_days: int = 7


class AIChatRequest(BaseModel):
    message: str
    context: Optional[str] = None  # "network", "campaign:{id}", "publisher:{id}"


class CampaignAIReportResponse(BaseModel):
    summary: str
    recommendations: list[str]
    risk_level: str  # "low" | "medium" | "high"
    risk_factors: list[str]
    prediction: str
    metrics_snapshot: dict[str, Any]


class PublisherAIReportResponse(BaseModel):
    summary: str
    recommendations: list[str]
    risk_level: str
    risk_factors: list[str]
    prediction: str
    metrics_snapshot: dict[str, Any]


class AIChatResponse(BaseModel):
    reply: str


# ── Gemini helper ──────────────────────────────────────────────────────────────

async def _call_gemini(prompt: str, max_tokens: int = 1024) -> str | None:
    """Call Gemini and return raw text. Returns None on failure."""
    if not settings.GEMINI_API_KEY:
        return None

    url = f"{_GEMINI_BASE_URL}/{_GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": max_tokens},
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        logger.warning("Gemini AI report call failed", error=str(e))
        return None


def _strip_json_fences(text: str) -> str:
    """Strip markdown code fences from Gemini response."""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
    if text.endswith("```"):
        text = text.rsplit("```", 1)[0]
    return text.strip()


def _default_campaign_report(metrics: dict) -> dict:
    """Return a safe fallback report when Gemini is unavailable."""
    return {
        "summary": "AI analysis is currently unavailable. Review metrics manually.",
        "recommendations": [
            "Monitor CTR and adjust bids if below industry average (0.5%)",
            "Check daily budget pacing to avoid early exhaustion",
            "Review ad creatives if impressions are high but CTR is low",
        ],
        "risk_level": "medium",
        "risk_factors": ["AI analysis unavailable"],
        "prediction": "Unable to generate prediction without AI analysis.",
        "metrics_snapshot": metrics,
    }


def _default_publisher_report(metrics: dict) -> dict:
    return {
        "summary": "AI analysis is currently unavailable. Review metrics manually.",
        "recommendations": [
            "Add more ad slots in high-traffic placements to increase fill rate",
            "Diversify slot formats to attract more campaign types",
            "Ensure site content matches advertiser categories for better matching",
        ],
        "risk_level": "low",
        "risk_factors": ["AI analysis unavailable"],
        "prediction": "Unable to generate prediction without AI analysis.",
        "metrics_snapshot": metrics,
    }


# ── Endpoint 1: Campaign AI Report ────────────────────────────────────────────

@router.post("/reports/campaign", response_model=CampaignAIReportResponse)
async def campaign_ai_report(
    body: CampaignAIReportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate an AI-powered performance report for a campaign."""
    try:
        campaign_uuid = uuid.UUID(body.campaign_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid campaign_id")

    result = await db.execute(select(Campaign).where(Campaign.id == campaign_uuid))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    period_days = max(1, min(90, body.period_days))
    since = datetime.now(timezone.utc) - timedelta(days=period_days)

    # Gather impression/click metrics for the period
    impressions_result = await db.execute(
        select(func.count(AdImpression.id)).where(
            and_(AdImpression.campaign_id == campaign_uuid, AdImpression.served_at >= since)
        )
    )
    total_impressions = impressions_result.scalar_one() or 0

    clicks_result = await db.execute(
        select(func.count(AdClick.id)).where(
            and_(AdClick.campaign_id == campaign_uuid, AdClick.clicked_at >= since)
        )
    )
    total_clicks = clicks_result.scalar_one() or 0
    ctr = total_clicks / total_impressions if total_impressions > 0 else 0.0

    # Top 3 ads by CTR (approximate by clicks count from campaign)
    top_ads_result = await db.execute(
        select(Ad).where(Ad.campaign_id == campaign_uuid, Ad.is_active == True).limit(3)
    )
    top_ads = top_ads_result.scalars().all()
    top_ads_data = [{"headline": ad.headline, "cta": ad.cta} for ad in top_ads]

    metrics = {
        "period_days": period_days,
        "total_impressions": total_impressions,
        "total_clicks": total_clicks,
        "ctr": round(ctr, 4),
        "total_spend": float(campaign.spent_amount),
        "remaining_budget": float(campaign.total_budget - campaign.spent_amount),
        "spend_ratio": round(float(campaign.spent_amount) / float(campaign.total_budget), 4) if campaign.total_budget > 0 else 0,
        "bid_amount": float(campaign.bid_amount),
        "top_ads": top_ads_data,
        "status": campaign.status.value,
        "is_active": campaign.is_active,
    }

    prompt = f"""You are an advertising performance analyst. Analyze this campaign's metrics and return a structured JSON report.

Campaign: "{campaign.title}"
Period: last {period_days} days
Metrics:
- Total impressions: {total_impressions:,}
- Total clicks: {total_clicks:,}
- CTR: {ctr:.4f} ({ctr*100:.2f}%)
- Total spend: ${float(campaign.spent_amount):.2f}
- Remaining budget: ${float(campaign.total_budget - campaign.spent_amount):.2f}
- Spend ratio: {metrics['spend_ratio']:.2%}
- Top ads: {top_ads_data}

Return ONLY valid JSON, no markdown, no explanation:
{{
  "summary": "<2-sentence performance summary>",
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
  "risk_level": "<low|medium|high>",
  "risk_factors": ["<factor 1>", "<factor 2>"],
  "prediction": "<predicted performance for next 7 days if no changes>"
}}"""

    raw = await _call_gemini(prompt, max_tokens=1024)
    if not raw:
        fallback = _default_campaign_report(metrics)
        return CampaignAIReportResponse(**fallback)

    try:
        parsed = json.loads(_strip_json_fences(raw))
        return CampaignAIReportResponse(
            summary=parsed.get("summary", ""),
            recommendations=parsed.get("recommendations", [])[:3],
            risk_level=parsed.get("risk_level", "medium"),
            risk_factors=parsed.get("risk_factors", []),
            prediction=parsed.get("prediction", ""),
            metrics_snapshot=metrics,
        )
    except Exception as e:
        logger.warning("Failed to parse campaign AI report JSON", error=str(e))
        fallback = _default_campaign_report(metrics)
        return CampaignAIReportResponse(**fallback)


# ── Endpoint 2: Publisher AI Report ───────────────────────────────────────────

@router.post("/reports/publisher", response_model=PublisherAIReportResponse)
async def publisher_ai_report(
    body: PublisherAIReportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate an AI-powered performance report for a publisher."""
    try:
        publisher_uuid = uuid.UUID(body.publisher_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid publisher_id")

    result = await db.execute(select(PublisherProfile).where(PublisherProfile.id == publisher_uuid))
    publisher = result.scalar_one_or_none()
    if not publisher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publisher not found")

    period_days = max(1, min(90, body.period_days))
    since = datetime.now(timezone.utc) - timedelta(days=period_days)

    # Fetch all active slots for this publisher
    slots_result = await db.execute(
        select(AdSlot)
        .join(Placement, Placement.id == AdSlot.placement_id)
        .where(Placement.publisher_id == publisher_uuid, AdSlot.is_active == True)
    )
    slots = slots_result.scalars().all()
    slot_ids = [s.id for s in slots]
    total_active_slots = len(slots)

    # Impressions per slot to calculate fill rate
    slots_with_impressions = 0
    total_impressions = 0
    total_earnings = 0.0

    if slot_ids:
        imp_result = await db.execute(
            select(AdImpression.slot_id, func.count(AdImpression.id).label("imp_count"))
            .where(
                and_(
                    AdImpression.slot_id.in_(slot_ids),
                    AdImpression.served_at >= since,
                )
            )
            .group_by(AdImpression.slot_id)
        )
        imp_by_slot = {row.slot_id: row.imp_count for row in imp_result.all()}
        slots_with_impressions = len(imp_by_slot)
        total_impressions = sum(imp_by_slot.values())

        earnings_result = await db.execute(
            select(func.sum(AdImpression.publisher_earnings)).where(
                and_(
                    AdImpression.slot_id.in_(slot_ids),
                    AdImpression.served_at >= since,
                )
            )
        )
        total_earnings = float(earnings_result.scalar_one() or 0)

    fill_rate = slots_with_impressions / total_active_slots if total_active_slots > 0 else 0.0

    # Top earning slots by publisher_earnings
    top_slots_data: list[dict] = []
    if slot_ids:
        top_slot_result = await db.execute(
            select(
                AdImpression.slot_id,
                func.sum(AdImpression.publisher_earnings).label("earnings"),
                func.count(AdImpression.id).label("impressions"),
            )
            .where(
                and_(AdImpression.slot_id.in_(slot_ids), AdImpression.served_at >= since)
            )
            .group_by(AdImpression.slot_id)
            .order_by(func.sum(AdImpression.publisher_earnings).desc())
            .limit(3)
        )
        for row in top_slot_result.all():
            slot_obj = next((s for s in slots if s.id == row.slot_id), None)
            top_slots_data.append({
                "slot_id": str(row.slot_id),
                "slot_name": slot_obj.name if slot_obj else "Unknown",
                "earnings": float(row.earnings or 0),
                "impressions": row.impressions,
            })

    metrics = {
        "period_days": period_days,
        "total_active_slots": total_active_slots,
        "slots_with_impressions": slots_with_impressions,
        "fill_rate": round(fill_rate, 4),
        "total_impressions": total_impressions,
        "total_earnings": round(total_earnings, 2),
        "top_slots": top_slots_data,
        "publisher_company": publisher.company_name,
    }

    prompt = f"""You are an ad network performance analyst for publishers. Analyze this publisher's metrics and return a structured JSON report.

Publisher: "{publisher.company_name}"
Period: last {period_days} days
Metrics:
- Total active slots: {total_active_slots}
- Slots with impressions: {slots_with_impressions}
- Fill rate: {fill_rate:.2%}
- Total impressions: {total_impressions:,}
- Total earnings: ${total_earnings:.2f}
- Top earning slots: {top_slots_data}

Return ONLY valid JSON, no markdown, no explanation:
{{
  "summary": "<2-sentence performance summary>",
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
  "risk_level": "<low|medium|high>",
  "risk_factors": ["<factor 1>", "<factor 2>"],
  "prediction": "<predicted performance for next 7 days if no changes>"
}}"""

    raw = await _call_gemini(prompt, max_tokens=1024)
    if not raw:
        fallback = _default_publisher_report(metrics)
        return PublisherAIReportResponse(**fallback)

    try:
        parsed = json.loads(_strip_json_fences(raw))
        return PublisherAIReportResponse(
            summary=parsed.get("summary", ""),
            recommendations=parsed.get("recommendations", [])[:3],
            risk_level=parsed.get("risk_level", "low"),
            risk_factors=parsed.get("risk_factors", []),
            prediction=parsed.get("prediction", ""),
            metrics_snapshot=metrics,
        )
    except Exception as e:
        logger.warning("Failed to parse publisher AI report JSON", error=str(e))
        fallback = _default_publisher_report(metrics)
        return PublisherAIReportResponse(**fallback)


# ── Endpoint 3: Admin AI Chat ──────────────────────────────────────────────────

from app.models.user import UserRole


def _require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in (UserRole.SUPER_ADMIN, UserRole.OPS_MANAGER):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


@router.post("/reports/chat", response_model=AIChatResponse)
async def ai_admin_chat(
    body: AIChatRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(_require_admin),
):
    """Freeform AI chat for admins with network-wide context."""
    # Build network context
    total_campaigns = (await db.execute(select(func.count(Campaign.id)))).scalar_one() or 0
    active_live_campaigns = (
        await db.execute(
            select(func.count(LiveCampaign.id)).where(LiveCampaign.status == LiveCampaignStatus.ACTIVE)
        )
    ).scalar_one() or 0

    total_impressions = (await db.execute(select(func.count(AdImpression.id)))).scalar_one() or 0
    total_clicks = (await db.execute(select(func.count(AdClick.id)))).scalar_one() or 0

    total_spend_result = await db.execute(select(func.sum(Campaign.spent_amount)))
    total_spend = float(total_spend_result.scalar_one() or 0)

    approved_publishers = (
        await db.execute(
            select(func.count(PublisherProfile.id)).where(PublisherProfile.status == PublisherStatus.APPROVED)
        )
    ).scalar_one() or 0

    network_context = (
        f"Network overview: {total_campaigns} total campaigns, "
        f"{active_live_campaigns} active live campaigns, "
        f"{total_impressions:,} total impressions, "
        f"{total_clicks:,} total clicks, "
        f"${total_spend:.2f} total spend, "
        f"{approved_publishers} approved publishers."
    )

    # Build additional context if specified
    extra_context = ""
    if body.context:
        extra_context = f"\nAdditional context scope: {body.context}"

    prompt = f"""You are AdGenius AI, an intelligent assistant for an advertising network platform. Answer the admin's question based on the network data provided.

{network_context}{extra_context}

Admin question: {body.message}

Provide a helpful, concise, and actionable response."""

    raw = await _call_gemini(prompt, max_tokens=1024)
    if not raw:
        return AIChatResponse(reply="AI assistant is currently unavailable. Please try again later.")

    return AIChatResponse(reply=raw)
