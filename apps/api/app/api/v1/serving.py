"""Ad serving engine: selection, impression tracking, click tracking, conversion."""
import uuid
import base64
import hashlib
import json
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
from app.models.publisher import AdSlot, Placement, PublisherProfile, PublisherStatus
from app.models.delivery import (
    LiveCampaign, LiveCampaignStatus, PricingModel,
    AdImpression, AdClick, ConversionEvent, BudgetLedger, PacingCounter,
)
from app.models.generation import GeneratedAdSet, GeneratedAdVariant
from app.models.adnet import (
    Campaign, CampaignStatus, Ad,
    AdvertiserWallet, AdvertiserTransaction, PublisherEarning,
)

router = APIRouter(tags=["serving"])
logger = structlog.get_logger()

# Scoring weights for ad candidate selection
_SCORE_WEIGHT_BID = 10       # bid amount contribution
_SCORE_WEIGHT_BUDGET = 20    # budget remaining ratio contribution
_SCORE_WEIGHT_NOISE = 5      # randomness to prevent winner-lock


# ── Response schemas ──────────────────────────────────────────────────────────

class ServedAdResponse(BaseModel):
    campaign_id: str
    ad_set_id: Optional[str]
    ad_id: Optional[str]
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
    slot_key: Optional[str] = None,
    slot_id: Optional[uuid.UUID] = None,  # backward compat
    site_id: Optional[uuid.UUID] = None,
    page_url: Optional[str] = None,
    session_id: Optional[str] = None,
    country: Optional[str] = None,
    device: Optional[str] = None,
    request: Request = None,
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    # 1. Validate slot (by slot_key preferred, fall back to slot_id)
    if slot_key:
        result = await db.execute(
            select(AdSlot).where(AdSlot.slot_key == slot_key, AdSlot.is_active == True)
        )
        slot = result.scalar_one_or_none()
        if not slot:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found or inactive")
        resolved_slot_id = slot.id

        # Verify publisher is approved (single join query)
        result = await db.execute(
            select(PublisherProfile)
            .join(Placement, Placement.publisher_id == PublisherProfile.id)
            .where(Placement.id == slot.placement_id)
        )
        pub_profile = result.scalar_one_or_none()
        if not pub_profile or pub_profile.status != PublisherStatus.APPROVED:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No eligible ad available")

        # ── New Campaign flow ──────────────────────────────────────────────
        conditions = [
            Campaign.is_active == True,
            Campaign.status == CampaignStatus.ACTIVE,
            Campaign.spent_amount < Campaign.total_budget,
        ]
        conditions.append(
            (Campaign.start_at.is_(None)) | (Campaign.start_at <= now)
        )
        conditions.append(
            (Campaign.end_at.is_(None)) | (Campaign.end_at >= now)
        )

        result = await db.execute(select(Campaign).where(and_(*conditions)))
        candidates: list[Campaign] = list(result.scalars().all())

        # Country/device targeting + daily budget filter
        eligible_campaigns = []
        for c in candidates:
            if country and c.target_countries:
                if country not in c.target_countries:
                    continue
            if device and c.target_devices:
                if device not in c.target_devices:
                    continue
            # Enforce daily_budget
            if c.daily_budget is not None:
                today_spend = await _get_today_spend(db, c.id)
                if today_spend >= c.daily_budget:
                    continue
            eligible_campaigns.append(c)

        if not eligible_campaigns:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No eligible ad available")

        # Score candidates: bid * 10 + budget_remaining_ratio * 20 + random * 5
        scored = []
        for c in eligible_campaigns:
            remaining = float(c.total_budget) - float(c.spent_amount)
            budget_ratio = min(remaining / max(float(c.total_budget), 1.0), 1.0)
            score = (
                float(c.bid_amount) * _SCORE_WEIGHT_BID
                + budget_ratio * _SCORE_WEIGHT_BUDGET
                + random.random() * _SCORE_WEIGHT_NOISE
            )
            scored.append((c, score))
        scored.sort(key=lambda x: x[1], reverse=True)
        selected_campaign = scored[0][0]

        # Pick an active ad from the campaign
        result = await db.execute(
            select(Ad).where(Ad.campaign_id == selected_campaign.id, Ad.is_active == True).limit(1)
        )
        selected_ad = result.scalar_one_or_none()
        if not selected_ad:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active ad creatives for campaign")

        # Build new-style click token (base64-encoded JSON)
        token_payload = {
            "type": "new",
            "campaign_id": str(selected_campaign.id),
            "ad_id": str(selected_ad.id),
            "slot_id": str(resolved_slot_id),
            "landing_url": selected_campaign.landing_url,
        }
        click_token = base64.urlsafe_b64encode(
            json.dumps(token_payload).encode()
        ).decode()

        slot_format = slot.format.value if slot.format else "BANNER"
        return ServedAdResponse(
            campaign_id=str(selected_campaign.id),
            ad_set_id=None,
            ad_id=str(selected_ad.id),
            headline=selected_ad.headline,
            body_text=selected_ad.body,
            cta=selected_ad.cta,
            image_url=selected_ad.image_url,
            click_url=f"/api/v1/track/click/{click_token}",
            impression_url="/api/v1/track/impression",
            format=slot_format,
            tracking_data={
                "campaign_id": str(selected_campaign.id),
                "ad_id": str(selected_ad.id),
                "slot_id": str(resolved_slot_id),
                "slot_key": slot_key,
                "click_token": click_token,
            },
        )

    if not slot_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="slot_key or slot_id is required")

    # ── Legacy LiveCampaign flow ───────────────────────────────────────────
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
        (LiveCampaign.start_date.is_(None)) | (LiveCampaign.start_date <= now)
    )
    conditions.append(
        (LiveCampaign.end_date.is_(None)) | (LiveCampaign.end_date >= now)
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
        # Enforce daily budget cap
        if campaign.daily_budget_cap is not None:
            today_spend = await _get_today_spend(db, campaign.id)
            if today_spend >= campaign.daily_budget_cap:
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
        ad_id=None,
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

    # IP hash
    client_ip = request.client.host if request.client else "unknown"
    ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()[:32]

    # Try new Campaign model first
    result = await db.execute(
        select(Campaign).where(Campaign.id == data.campaign_id)
    )
    new_campaign = result.scalar_one_or_none()

    if new_campaign:
        # Verify slot
        result = await db.execute(select(AdSlot).where(AdSlot.id == data.slot_id))
        slot = result.scalar_one_or_none()
        if not slot:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")

        if not new_campaign.is_active or new_campaign.status != CampaignStatus.ACTIVE:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not active")

        # Calculate cost based on pricing model
        cost = Decimal("0")
        if new_campaign.pricing_model == "CPM":
            cost = new_campaign.bid_amount / Decimal("1000")

        # Publisher earnings using slot.revenue_share_percent
        publisher_earnings = cost * slot.revenue_share_percent / Decimal("100")

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
        await db.flush()

        # Debit advertiser wallet
        result = await db.execute(
            select(AdvertiserWallet).where(AdvertiserWallet.user_id == new_campaign.user_id)
        )
        wallet = result.scalar_one_or_none()
        if wallet and cost > 0:
            if wallet.balance < cost:
                # Insufficient funds — mark campaign as ended
                new_campaign.status = CampaignStatus.ENDED
                new_campaign.is_active = False
                logger.warning("Insufficient wallet balance, pausing campaign", campaign_id=str(new_campaign.id))
            else:
                wallet.balance = wallet.balance - cost
                wallet.total_spent = wallet.total_spent + cost
                db.add(AdvertiserTransaction(
                    wallet_id=wallet.id,
                    campaign_id=new_campaign.id,
                    tx_type="spend_impression",
                    amount=-cost,
                    description=f"CPM impression on slot {data.slot_id}",
                    reference_id=str(impression.id),
                ))

        # Update campaign stats
        new_campaign.spent_amount = new_campaign.spent_amount + cost
        new_campaign.impressions_count = new_campaign.impressions_count + 1
        if new_campaign.spent_amount >= new_campaign.total_budget:
            new_campaign.status = CampaignStatus.ENDED
            new_campaign.is_active = False
            logger.info("Campaign budget exhausted", campaign_id=str(new_campaign.id))

        # Create publisher earning record
        result = await db.execute(
            select(Placement).where(Placement.id == slot.placement_id)
        )
        placement = result.scalar_one_or_none()
        if placement and publisher_earnings > 0:
            db.add(PublisherEarning(
                publisher_id=placement.publisher_id,
                slot_id=slot.id,
                campaign_id=new_campaign.id,
                event_type="impression",
                amount=publisher_earnings,
                reference_id=str(impression.id),
            ))

        await db.flush()
        logger.info("Impression tracked (new campaign)", campaign_id=str(new_campaign.id), cost=str(cost))
        return ImpressionResponse(impression_id=str(impression.id), recorded=True)

    # Fall back to legacy LiveCampaign
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
    now = datetime.now(timezone.utc)

    # Try to decode as new-style base64 JSON token
    try:
        padded = click_token + "=" * (-len(click_token) % 4)
        decoded = json.loads(base64.urlsafe_b64decode(padded.encode()).decode())
    except Exception:
        decoded = None

    if decoded and decoded.get("type") == "new":
        campaign_id_str = decoded.get("campaign_id")
        ad_id_str = decoded.get("ad_id")
        slot_id_str = decoded.get("slot_id")
        landing_url = decoded.get("landing_url", "#")

        try:
            campaign_id = uuid.UUID(campaign_id_str)
            slot_id = uuid.UUID(slot_id_str)
        except (TypeError, ValueError):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid click token data")

        result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
        new_campaign = result.scalar_one_or_none()

        if new_campaign and new_campaign.pricing_model == "CPC":
            cost = new_campaign.bid_amount
            result = await db.execute(select(AdSlot).where(AdSlot.id == slot_id))
            slot = result.scalar_one_or_none()
            publisher_earnings = Decimal("0")
            if slot:
                publisher_earnings = cost * slot.revenue_share_percent / Decimal("100")

            # Debit advertiser wallet
            result = await db.execute(
                select(AdvertiserWallet).where(AdvertiserWallet.user_id == new_campaign.user_id)
            )
            wallet = result.scalar_one_or_none()
            if wallet:
                if wallet.balance >= cost:
                    wallet.balance = wallet.balance - cost
                    wallet.total_spent = wallet.total_spent + cost
                    db.add(AdvertiserTransaction(
                        wallet_id=wallet.id,
                        campaign_id=new_campaign.id,
                        tx_type="spend_click",
                        amount=-cost,
                        description=f"CPC click token {click_token[:20]}",
                        reference_id=click_token[:255],
                    ))
                else:
                    logger.warning("Insufficient wallet balance for click", campaign_id=campaign_id_str)

            # Update campaign stats
            new_campaign.spent_amount = new_campaign.spent_amount + cost
            new_campaign.clicks_count = new_campaign.clicks_count + 1
            if new_campaign.spent_amount >= new_campaign.total_budget:
                new_campaign.status = CampaignStatus.ENDED
                new_campaign.is_active = False

            # Publisher earning
            if slot and publisher_earnings > 0:
                result = await db.execute(
                    select(Placement).where(Placement.id == slot.placement_id)
                )
                placement = result.scalar_one_or_none()
                if placement:
                    db.add(PublisherEarning(
                        publisher_id=placement.publisher_id,
                        slot_id=slot.id,
                        campaign_id=new_campaign.id,
                        event_type="click",
                        amount=publisher_earnings,
                        reference_id=click_token[:255],
                    ))
        elif new_campaign:
            # CPM campaign — track click count only
            new_campaign.clicks_count = new_campaign.clicks_count + 1

        await db.flush()
        logger.info("Click tracked (new campaign)", campaign_id=campaign_id_str, landing_url=landing_url)
        return RedirectResponse(url=landing_url, status_code=302)

    # ── Legacy: look up AdClick record by token ────────────────────────────
    result = await db.execute(
        select(AdClick).where(AdClick.click_token == click_token)
    )
    click = result.scalar_one_or_none()
    if not click:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid click token")

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
    # Try LiveCampaign first
    result = await db.execute(
        select(LiveCampaign).where(LiveCampaign.id == data.campaign_id)
    )
    campaign = result.scalar_one_or_none()

    if not campaign:
        # Fall back to new Campaign model
        result = await db.execute(
            select(Campaign).where(Campaign.id == data.campaign_id)
        )
        new_campaign = result.scalar_one_or_none()
        if not new_campaign:
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
    logger.info("Conversion tracked", campaign_id=str(data.campaign_id), event_type=data.event_type)
    return {"conversion_id": str(conversion.id), "recorded": True}
