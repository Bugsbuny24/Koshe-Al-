"""Ad serving engine: selection, impression tracking, click tracking, conversion."""
import uuid
import hashlib
import secrets
import random
from datetime import datetime, timezone
from typing import Optional
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from pydantic import BaseModel
import structlog

from app.dependencies import get_db
from app.models.publisher import AdSlot, Placement
from app.models.delivery import (
    LiveCampaign, LiveCampaignStatus, PricingModel,
    AdImpression, AdClick, ConversionEvent, BudgetLedger, PacingCounter,
)
from app.models.generation import GeneratedAdSet, GeneratedAdVariant

router = APIRouter(tags=["serving"])
logger = structlog.get_logger()


# ── Response schemas ──────────────────────────────────────────────────────────

class ServedAdResponse(BaseModel):
    campaign_id: str
    ad_set_id: Optional[str]
    headline: str
    body_text: str
    cta: str
    image_url: Optional[str]
    click_url: str
    impression_url: str
    format: str
    tracking_data: dict


class ImpressionRequest(BaseModel):
    campaign_id: uuid.UUID
    slot_id: uuid.UUID
    session_id: Optional[str] = None
    site_url: Optional[str] = None


class ImpressionResponse(BaseModel):
    impression_id: str
    recorded: bool


class ConversionRequest(BaseModel):
    campaign_id: uuid.UUID
    click_token: Optional[str] = None
    event_type: str = "conversion"
    value: Optional[float] = None
    conversion_data: Optional[dict] = None


# ── Ad selection helpers ───────────────────────────────────────────────────────

def _score_campaign(campaign: LiveCampaign, today_spend: Decimal, random_factor: float) -> float:
    """Simple scoring: priority + budget remaining + recency + randomness."""
    remaining = float(campaign.total_budget) - float(campaign.spent_amount)
    budget_score = min(remaining / max(float(campaign.total_budget), 1.0), 1.0) * 30
    priority_score = campaign.priority * 10  # 10-100
    noise = random_factor * 5  # up to 5 points of noise
    return priority_score + budget_score + noise


def _extract_creative_content(ad_set: GeneratedAdSet) -> dict:
    """Extract a headline/body/CTA from the ad set's raw_json or variants."""
    raw = ad_set.raw_json or {}

    # Try structured fields first
    headline = (
        raw.get("primary_headline")
        or (raw.get("alternate_headlines", [None])[0])
        or "Discover something amazing"
    )
    body = raw.get("short_text") or raw.get("long_text") or "Learn more about this offer."
    cta = raw.get("cta") or "Learn More"
    image_brief = raw.get("image_brief") or ""

    return {
        "headline": headline,
        "body_text": body,
        "cta": cta,
        "image_url": None,  # placeholder until asset upload is implemented
        "image_brief": image_brief,
    }


async def _check_frequency_cap(
    db: AsyncSession,
    campaign_id: uuid.UUID,
    session_id: Optional[str],
    cap: int,
) -> bool:
    """Return True if under frequency cap, False if exceeded."""
    if not session_id:
        return True  # no session tracking possible
    result = await db.execute(
        select(func.count(AdImpression.id)).where(
            and_(
                AdImpression.campaign_id == campaign_id,
                AdImpression.session_id == session_id,
            )
        )
    )
    count = result.scalar_one() or 0
    return count < cap


async def _get_today_spend(db: AsyncSession, campaign_id: uuid.UUID) -> Decimal:
    result = await db.execute(
        select(PacingCounter).where(PacingCounter.campaign_id == campaign_id)
    )
    counter = result.scalar_one_or_none()
    if not counter:
        return Decimal("0")
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if counter.date_bucket != today_str:
        return Decimal("0")
    return Decimal(str(counter.spend_today))


# ── Ad serving endpoint ────────────────────────────────────────────────────────

@router.get("/serve/ad", response_model=ServedAdResponse)
async def serve_ad(
    slot_id: uuid.UUID,
    site_id: Optional[uuid.UUID] = None,
    page_url: Optional[str] = None,
    session_id: Optional[str] = None,
    request: Request = None,
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    # 1. Validate slot
    result = await db.execute(
        select(AdSlot).where(AdSlot.id == slot_id, AdSlot.is_active == True)
    )
    slot = result.scalar_one_or_none()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found or inactive")

    # 2. Find eligible active campaigns
    conditions = [
        LiveCampaign.status == LiveCampaignStatus.ACTIVE,
        LiveCampaign.is_approved == True,
        LiveCampaign.spent_amount < LiveCampaign.total_budget,
    ]
    # Date filters
    conditions.append(
        (LiveCampaign.start_date == None) | (LiveCampaign.start_date <= now)
    )
    conditions.append(
        (LiveCampaign.end_date == None) | (LiveCampaign.end_date >= now)
    )

    result = await db.execute(
        select(LiveCampaign).where(and_(*conditions))
    )
    candidates: list[LiveCampaign] = list(result.scalars().all())

    if not candidates:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No eligible ad available")

    # 3. Category / format filtering
    slot_category = slot.category
    slot_format = slot.format.value if slot.format else None

    eligible = []
    for campaign in candidates:
        # Category match (if campaign specifies target categories)
        if campaign.target_categories and slot_category:
            if slot_category not in campaign.target_categories:
                continue
        # Format match (if campaign specifies target formats)
        if campaign.target_formats and slot_format:
            if slot_format not in campaign.target_formats:
                continue
        eligible.append(campaign)

    if not eligible:
        # Fall back to all candidates if no category/format match
        eligible = candidates

    # 4. Frequency cap check
    checked = []
    for campaign in eligible:
        if await _check_frequency_cap(db, campaign.id, session_id, campaign.frequency_cap_per_session):
            checked.append(campaign)

    if not checked:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Frequency cap reached for all eligible campaigns",
        )

    # 5. Score and select
    today_spends = {}
    for campaign in checked:
        today_spends[campaign.id] = await _get_today_spend(db, campaign.id)

    scored = [
        (campaign, _score_campaign(campaign, today_spends[campaign.id], random.random()))
        for campaign in checked
    ]
    scored.sort(key=lambda x: x[1], reverse=True)
    selected_campaign = scored[0][0]

    # 6. Get creative
    creative_content = {
        "headline": "Discover our offer",
        "body_text": "Click to learn more.",
        "cta": "Learn More",
        "image_url": None,
    }
    if selected_campaign.ad_set_id:
        result = await db.execute(
            select(GeneratedAdSet).where(GeneratedAdSet.id == selected_campaign.ad_set_id)
        )
        ad_set = result.scalar_one_or_none()
        if ad_set:
            creative_content = _extract_creative_content(ad_set)

    # 7. Build click token + tracking URLs
    click_token = secrets.token_urlsafe(32)

    # Landing page from campaign brief (fetched lazily from brief)
    destination_url = "#"  # default; real URL comes from campaign brief
    from app.models.campaign import CampaignBrief
    result = await db.execute(
        select(CampaignBrief).where(CampaignBrief.id == selected_campaign.campaign_brief_id)
    )
    brief = result.scalar_one_or_none()
    if brief and brief.website_url:
        destination_url = brief.website_url

    # Pre-create click record (pending actual click)
    ip_hash = None
    if request:
        client_ip = request.client.host if request.client else "unknown"
        ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()[:32]

    click_record = AdClick(
        campaign_id=selected_campaign.id,
        slot_id=slot_id,
        click_token=click_token,
        destination_url=destination_url,
        cost=Decimal("0"),  # charged on actual click
        publisher_earnings=Decimal("0"),
        clicked_at=now,
        ip_hash=ip_hash,
    )
    db.add(click_record)
    await db.flush()

    return ServedAdResponse(
        campaign_id=str(selected_campaign.id),
        ad_set_id=str(selected_campaign.ad_set_id) if selected_campaign.ad_set_id else None,
        headline=creative_content["headline"],
        body_text=creative_content["body_text"],
        cta=creative_content["cta"],
        image_url=creative_content.get("image_url"),
        click_url=f"/api/v1/track/click/{click_token}",
        impression_url="/api/v1/track/impression",
        format=slot_format or "BANNER",
        tracking_data={
            "campaign_id": str(selected_campaign.id),
            "slot_id": str(slot_id),
            "click_token": click_token,
        },
    )


# ── Impression tracking ────────────────────────────────────────────────────────

@router.post("/track/impression", response_model=ImpressionResponse)
async def track_impression(
    data: ImpressionRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    result = await db.execute(
        select(LiveCampaign).where(LiveCampaign.id == data.campaign_id)
    )
    campaign = result.scalar_one_or_none()
    if not campaign or campaign.status != LiveCampaignStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not active")

    # Verify slot
    result = await db.execute(select(AdSlot).where(AdSlot.id == data.slot_id))
    slot = result.scalar_one_or_none()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")

    # Calculate cost
    cost = Decimal("0")
    publisher_earnings = Decimal("0")
    if campaign.pricing_model == PricingModel.CPM:
        cost = campaign.cpm_rate / Decimal("1000")
        # Get publisher revenue share
        result = await db.execute(
            select(Placement).where(Placement.id == slot.placement_id)
        )
        placement = result.scalar_one_or_none()
        if placement:
            from app.models.publisher import PublisherProfile
            result = await db.execute(
                select(PublisherProfile).where(PublisherProfile.id == placement.publisher_id)
            )
            pub_profile = result.scalar_one_or_none()
            if pub_profile:
                publisher_earnings = cost * Decimal(str(pub_profile.revenue_share_pct)) / Decimal("100")

    # IP hash
    client_ip = request.client.host if request.client else "unknown"
    ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()[:32]

    impression = AdImpression(
        campaign_id=data.campaign_id,
        slot_id=data.slot_id,
        session_id=data.session_id,
        site_url=data.site_url,
        cost=cost,
        publisher_earnings=publisher_earnings,
        served_at=now,
        ip_hash=ip_hash,
    )
    db.add(impression)

    # Deduct budget
    campaign.spent_amount = campaign.spent_amount + cost

    # Budget ledger entry
    ledger = BudgetLedger(
        campaign_id=campaign.id,
        entry_type="spend_impression",
        amount=cost,
        reference_id=str(impression.id),
        description=f"CPM impression on slot {data.slot_id}",
    )
    db.add(ledger)

    # Check budget exhaustion
    if campaign.spent_amount >= campaign.total_budget:
        campaign.status = LiveCampaignStatus.EXHAUSTED
        logger.info("Campaign budget exhausted", campaign_id=str(campaign.id))

    # Update pacing counter
    today_str = now.strftime("%Y-%m-%d")
    result = await db.execute(
        select(PacingCounter).where(PacingCounter.campaign_id == campaign.id)
    )
    counter = result.scalar_one_or_none()
    if counter and counter.date_bucket == today_str:
        counter.impressions_today += 1
        counter.spend_today = Decimal(str(counter.spend_today)) + cost
    else:
        new_counter = PacingCounter(
            campaign_id=campaign.id,
            date_bucket=today_str,
            impressions_today=1,
            spend_today=cost,
        )
        if counter:
            await db.delete(counter)
        db.add(new_counter)

    await db.flush()
    logger.info("Impression tracked", campaign_id=str(campaign.id), cost=str(cost))
    return ImpressionResponse(impression_id=str(impression.id), recorded=True)


# ── Click tracking ─────────────────────────────────────────────────────────────

@router.get("/track/click/{click_token}")
async def track_click(
    click_token: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AdClick).where(AdClick.click_token == click_token)
    )
    click = result.scalar_one_or_none()
    if not click:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid click token")

    now = datetime.now(timezone.utc)

    # Get campaign
    result = await db.execute(
        select(LiveCampaign).where(LiveCampaign.id == click.campaign_id)
    )
    campaign = result.scalar_one_or_none()

    if campaign and campaign.pricing_model == PricingModel.CPC:
        cost = campaign.cpc_rate
        # Get publisher share from slot -> placement -> publisher_profile
        result = await db.execute(select(AdSlot).where(AdSlot.id == click.slot_id))
        slot = result.scalar_one_or_none()
        publisher_earnings = Decimal("0")
        if slot:
            result = await db.execute(select(Placement).where(Placement.id == slot.placement_id))
            placement = result.scalar_one_or_none()
            if placement:
                from app.models.publisher import PublisherProfile
                result = await db.execute(
                    select(PublisherProfile).where(PublisherProfile.id == placement.publisher_id)
                )
                pub_profile = result.scalar_one_or_none()
                if pub_profile:
                    publisher_earnings = cost * Decimal(str(pub_profile.revenue_share_pct)) / Decimal("100")

        click.cost = cost
        click.publisher_earnings = publisher_earnings
        click.clicked_at = now

        campaign.spent_amount = campaign.spent_amount + cost

        ledger = BudgetLedger(
            campaign_id=campaign.id,
            entry_type="spend_click",
            amount=cost,
            reference_id=str(click.id),
            description=f"CPC click token {click_token}",
        )
        db.add(ledger)

        if campaign.spent_amount >= campaign.total_budget:
            campaign.status = LiveCampaignStatus.EXHAUSTED

        # Pacing
        today_str = now.strftime("%Y-%m-%d")
        result = await db.execute(
            select(PacingCounter).where(PacingCounter.campaign_id == campaign.id)
        )
        counter = result.scalar_one_or_none()
        if counter and counter.date_bucket == today_str:
            counter.clicks_today += 1
            counter.spend_today = Decimal(str(counter.spend_today)) + cost
        else:
            new_counter = PacingCounter(
                campaign_id=campaign.id,
                date_bucket=today_str,
                clicks_today=1,
                spend_today=cost,
            )
            if counter:
                await db.delete(counter)
            db.add(new_counter)

    await db.flush()
    logger.info("Click tracked", click_token=click_token, destination=click.destination_url)
    return RedirectResponse(url=click.destination_url, status_code=302)


# ── Conversion tracking ────────────────────────────────────────────────────────

@router.post("/track/conversion", status_code=status.HTTP_201_CREATED)
async def track_conversion(
    data: ConversionRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(LiveCampaign).where(LiveCampaign.id == data.campaign_id)
    )
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    click_id = None
    if data.click_token:
        result = await db.execute(
            select(AdClick).where(AdClick.click_token == data.click_token)
        )
        click = result.scalar_one_or_none()
        if click:
            click_id = click.id

    conversion = ConversionEvent(
        campaign_id=data.campaign_id,
        click_id=click_id,
        event_type=data.event_type,
        value=Decimal(str(data.value)) if data.value else None,
        conversion_data=data.conversion_data,
        converted_at=datetime.now(timezone.utc),
    )
    db.add(conversion)
    await db.flush()
    logger.info("Conversion tracked", campaign_id=str(campaign.id), event_type=data.event_type)
    return {"conversion_id": str(conversion.id), "recorded": True}
