"""Admin / ops APIs: campaign activation, publisher approval, moderation queue, finance overview."""
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from pydantic import BaseModel
import structlog

from app.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.delivery import LiveCampaign, LiveCampaignStatus, AdImpression, AdClick, BudgetLedger
from app.models.publisher import PublisherProfile, PublisherStatus, AdSlot, Placement
from app.models.generation import GeneratedAdSet
from app.models.finance import ModerationReview, ModerationDecision, ModerationItemType, AdvertiserInvoice
from app.models.campaign import CampaignBrief

router = APIRouter(prefix="/admin", tags=["admin"])
logger = structlog.get_logger()


# ── Auth guard ─────────────────────────────────────────────────────────────────

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in (UserRole.SUPER_ADMIN, UserRole.OPS_MANAGER):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


# ── Response schemas ──────────────────────────────────────────────────────────

class CampaignAdminResponse(BaseModel):
    id: uuid.UUID
    name: str
    status: str
    pricing_model: str
    total_budget: float
    spent_amount: float
    is_approved: bool
    approved_at: Optional[datetime]
    rejection_reason: Optional[str]
    workspace_id: uuid.UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class PublisherAdminResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_name: str
    contact_email: str
    status: str
    revenue_share_pct: float
    rejection_reason: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ModerationQueueItem(BaseModel):
    id: uuid.UUID
    item_type: str
    item_id: uuid.UUID
    decision: str
    notes: Optional[str]
    reviewed_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class NetworkOverview(BaseModel):
    total_campaigns: int
    active_campaigns: int
    pending_campaigns: int
    total_impressions: int
    total_clicks: int
    total_spend: float
    total_publishers: int
    approved_publishers: int
    pending_publishers: int


# ── Campaign management ────────────────────────────────────────────────────────

@router.get("/campaigns", response_model=List[CampaignAdminResponse])
async def list_all_campaigns(
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = select(LiveCampaign)
    if status_filter:
        try:
            s = LiveCampaignStatus(status_filter.upper())
            query = query.where(LiveCampaign.status == s)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status_filter}")
    result = await db.execute(query.order_by(LiveCampaign.created_at.desc()))
    return result.scalars().all()


@router.post("/campaigns/{campaign_id}/activate", response_model=CampaignAdminResponse)
async def activate_campaign(
    campaign_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(LiveCampaign).where(LiveCampaign.id == campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    if campaign.status not in (LiveCampaignStatus.APPROVED, LiveCampaignStatus.PAUSED, LiveCampaignStatus.PENDING_APPROVAL):
        raise HTTPException(status_code=400, detail=f"Cannot activate campaign with status {campaign.status}")

    campaign.status = LiveCampaignStatus.ACTIVE
    campaign.is_approved = True
    campaign.approved_at = datetime.now(timezone.utc)
    campaign.rejection_reason = None
    await db.flush()
    await db.refresh(campaign)

    # Add moderation record
    review = ModerationReview(
        item_type=ModerationItemType.CAMPAIGN,
        item_id=campaign_id,
        reviewer_id=admin.id,
        decision=ModerationDecision.APPROVED,
        notes="Activated by admin",
        reviewed_at=datetime.now(timezone.utc),
    )
    db.add(review)

    logger.info("Campaign activated", campaign_id=str(campaign_id), admin=str(admin.id))
    return campaign


@router.post("/campaigns/{campaign_id}/pause", response_model=CampaignAdminResponse)
async def pause_campaign(
    campaign_id: uuid.UUID,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(LiveCampaign).where(LiveCampaign.id == campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    campaign.status = LiveCampaignStatus.PAUSED
    await db.flush()
    await db.refresh(campaign)
    logger.info("Campaign paused", campaign_id=str(campaign_id))
    return campaign


@router.post("/campaigns/{campaign_id}/reject", response_model=CampaignAdminResponse)
async def reject_campaign(
    campaign_id: uuid.UUID,
    reason: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(LiveCampaign).where(LiveCampaign.id == campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    campaign.status = LiveCampaignStatus.REJECTED
    campaign.rejection_reason = reason

    review = ModerationReview(
        item_type=ModerationItemType.CAMPAIGN,
        item_id=campaign_id,
        reviewer_id=admin.id,
        decision=ModerationDecision.REJECTED,
        notes=reason,
        reviewed_at=datetime.now(timezone.utc),
    )
    db.add(review)
    await db.flush()
    await db.refresh(campaign)
    return campaign


# ── Publisher management ───────────────────────────────────────────────────────

@router.get("/publishers", response_model=List[PublisherAdminResponse])
async def list_all_publishers(
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = select(PublisherProfile)
    if status_filter:
        try:
            s = PublisherStatus(status_filter.upper())
            query = query.where(PublisherProfile.status == s)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status_filter}")
    result = await db.execute(query.order_by(PublisherProfile.created_at.desc()))
    return result.scalars().all()


@router.post("/publishers/{publisher_id}/approve", response_model=PublisherAdminResponse)
async def approve_publisher(
    publisher_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(PublisherProfile).where(PublisherProfile.id == publisher_id))
    publisher = result.scalar_one_or_none()
    if not publisher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publisher not found")
    publisher.status = PublisherStatus.APPROVED
    publisher.rejection_reason = None

    review = ModerationReview(
        item_type=ModerationItemType.PUBLISHER,
        item_id=publisher_id,
        reviewer_id=admin.id,
        decision=ModerationDecision.APPROVED,
        reviewed_at=datetime.now(timezone.utc),
    )
    db.add(review)
    await db.flush()
    await db.refresh(publisher)
    logger.info("Publisher approved", publisher_id=str(publisher_id))
    return publisher


@router.post("/publishers/{publisher_id}/reject", response_model=PublisherAdminResponse)
async def reject_publisher(
    publisher_id: uuid.UUID,
    reason: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(PublisherProfile).where(PublisherProfile.id == publisher_id))
    publisher = result.scalar_one_or_none()
    if not publisher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publisher not found")
    publisher.status = PublisherStatus.REJECTED
    publisher.rejection_reason = reason

    review = ModerationReview(
        item_type=ModerationItemType.PUBLISHER,
        item_id=publisher_id,
        reviewer_id=admin.id,
        decision=ModerationDecision.REJECTED,
        notes=reason,
        reviewed_at=datetime.now(timezone.utc),
    )
    db.add(review)
    await db.flush()
    await db.refresh(publisher)
    return publisher


# ── Moderation queue ───────────────────────────────────────────────────────────

@router.get("/moderation", response_model=List[ModerationQueueItem])
async def get_moderation_queue(
    decision: Optional[str] = "PENDING",
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = select(ModerationReview)
    if decision:
        try:
            d = ModerationDecision(decision.upper())
            query = query.where(ModerationReview.decision == d)
        except ValueError:
            pass
    result = await db.execute(query.order_by(ModerationReview.created_at.desc()))
    return result.scalars().all()


# ── Network overview ───────────────────────────────────────────────────────────

@router.get("/overview", response_model=NetworkOverview)
async def get_network_overview(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    total_campaigns = (await db.execute(select(func.count(LiveCampaign.id)))).scalar_one() or 0
    active_campaigns = (
        await db.execute(
            select(func.count(LiveCampaign.id)).where(LiveCampaign.status == LiveCampaignStatus.ACTIVE)
        )
    ).scalar_one() or 0
    pending_campaigns = (
        await db.execute(
            select(func.count(LiveCampaign.id)).where(
                LiveCampaign.status == LiveCampaignStatus.PENDING_APPROVAL
            )
        )
    ).scalar_one() or 0
    total_impressions = (await db.execute(select(func.count(AdImpression.id)))).scalar_one() or 0
    total_clicks = (await db.execute(select(func.count(AdClick.id)))).scalar_one() or 0
    total_spend_result = await db.execute(select(func.sum(LiveCampaign.spent_amount)))
    total_spend = float(total_spend_result.scalar_one() or 0)
    total_publishers = (await db.execute(select(func.count(PublisherProfile.id)))).scalar_one() or 0
    approved_publishers = (
        await db.execute(
            select(func.count(PublisherProfile.id)).where(PublisherProfile.status == PublisherStatus.APPROVED)
        )
    ).scalar_one() or 0
    pending_publishers = (
        await db.execute(
            select(func.count(PublisherProfile.id)).where(PublisherProfile.status == PublisherStatus.PENDING)
        )
    ).scalar_one() or 0

    return NetworkOverview(
        total_campaigns=total_campaigns,
        active_campaigns=active_campaigns,
        pending_campaigns=pending_campaigns,
        total_impressions=total_impressions,
        total_clicks=total_clicks,
        total_spend=total_spend,
        total_publishers=total_publishers,
        approved_publishers=approved_publishers,
        pending_publishers=pending_publishers,
    )


# ── Finance overview ───────────────────────────────────────────────────────────

class FinanceOverview(BaseModel):
    total_invoiced: float
    total_budgets: float
    total_spent: float
    total_remaining: float
    platform_revenue_estimate: float


@router.get("/finance", response_model=FinanceOverview)
async def get_finance_overview(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    total_invoiced_result = await db.execute(select(func.sum(AdvertiserInvoice.gross_amount)))
    total_invoiced = float(total_invoiced_result.scalar_one() or 0)

    total_budgets_result = await db.execute(select(func.sum(LiveCampaign.total_budget)))
    total_budgets = float(total_budgets_result.scalar_one() or 0)

    total_spent_result = await db.execute(select(func.sum(LiveCampaign.spent_amount)))
    total_spent = float(total_spent_result.scalar_one() or 0)

    # Platform earns the difference not going to publishers (30% platform share typical)
    platform_revenue = total_spent * 0.30

    return FinanceOverview(
        total_invoiced=total_invoiced,
        total_budgets=total_budgets,
        total_spent=total_spent,
        total_remaining=total_budgets - total_spent,
        platform_revenue_estimate=platform_revenue,
    )


# ── Live campaigns management ──────────────────────────────────────────────────

@router.post("/campaigns", status_code=status.HTTP_201_CREATED)
async def create_live_campaign_from_brief(
    brief_id: uuid.UUID,
    ad_set_id: Optional[uuid.UUID] = None,
    total_budget: float = 100.0,
    pricing_model: str = "CPM",
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Admin creates a live campaign from an approved campaign brief."""
    result = await db.execute(select(CampaignBrief).where(CampaignBrief.id == brief_id))
    brief = result.scalar_one_or_none()
    if not brief:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign brief not found")

    from app.models.delivery import PricingModel
    try:
        pm = PricingModel(pricing_model.upper())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid pricing model. Use CPM or CPC.")

    campaign = LiveCampaign(
        campaign_brief_id=brief_id,
        ad_set_id=ad_set_id,
        workspace_id=brief.workspace_id,
        name=brief.name,
        pricing_model=pm,
        total_budget=Decimal(str(total_budget)),
        status=LiveCampaignStatus.PENDING_APPROVAL,
    )
    db.add(campaign)
    await db.flush()
    await db.refresh(campaign)
    logger.info("Live campaign created", campaign_id=str(campaign.id), admin=str(admin.id))
    return {"id": str(campaign.id), "name": campaign.name, "status": campaign.status.value}
