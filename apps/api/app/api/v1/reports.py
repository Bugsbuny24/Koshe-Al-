"""Reporting APIs for advertiser, publisher, and admin views."""
import uuid
from typing import List, Optional
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from pydantic import BaseModel
import structlog

from app.dependencies import get_db, get_current_user, get_current_workspace
from app.models.user import User, UserRole, Workspace
from app.models.delivery import LiveCampaign, AdImpression, AdClick, LiveCampaignStatus
from app.models.publisher import PublisherProfile, AdSlot, Placement, PublisherSite

router = APIRouter(prefix="/reports", tags=["reports"])
logger = structlog.get_logger()


# ── Schemas ────────────────────────────────────────────────────────────────────

class CampaignMetrics(BaseModel):
    campaign_id: str
    campaign_name: str
    status: str
    impressions: int
    clicks: int
    ctr: float
    total_budget: float
    spent_amount: float
    remaining_budget: float
    pricing_model: str


class AdvertiserReportResponse(BaseModel):
    workspace_id: str
    period: str
    campaigns: List[CampaignMetrics]
    totals: dict


class SlotMetrics(BaseModel):
    slot_id: str
    slot_name: str
    impressions: int
    clicks: int
    ctr: float
    earnings: float


class PublisherReportResponse(BaseModel):
    publisher_id: str
    period: str
    slots: List[SlotMetrics]
    totals: dict


class AdminNetworkReport(BaseModel):
    period: str
    total_impressions: int
    total_clicks: int
    overall_ctr: float
    total_spend: float
    top_campaigns: List[CampaignMetrics]


# ── Advertiser report ──────────────────────────────────────────────────────────

@router.get("/advertiser", response_model=AdvertiserReportResponse)
async def advertiser_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    result = await db.execute(
        select(LiveCampaign).where(LiveCampaign.workspace_id == workspace.id)
    )
    campaigns = result.scalars().all()

    metrics = []
    total_impressions = 0
    total_clicks = 0
    total_spend = 0.0
    total_budget = 0.0

    for campaign in campaigns:
        imp_result = await db.execute(
            select(func.count(AdImpression.id)).where(AdImpression.campaign_id == campaign.id)
        )
        impressions = imp_result.scalar_one() or 0

        click_result = await db.execute(
            select(func.count(AdClick.id)).where(AdClick.campaign_id == campaign.id)
        )
        clicks = click_result.scalar_one() or 0

        ctr = (clicks / impressions * 100) if impressions > 0 else 0.0
        spent = float(campaign.spent_amount)
        budget = float(campaign.total_budget)

        metrics.append(CampaignMetrics(
            campaign_id=str(campaign.id),
            campaign_name=campaign.name,
            status=campaign.status.value,
            impressions=impressions,
            clicks=clicks,
            ctr=round(ctr, 2),
            total_budget=budget,
            spent_amount=spent,
            remaining_budget=max(budget - spent, 0.0),
            pricing_model=campaign.pricing_model.value,
        ))
        total_impressions += impressions
        total_clicks += clicks
        total_spend += spent
        total_budget += budget

    return AdvertiserReportResponse(
        workspace_id=str(workspace.id),
        period="all_time",
        campaigns=metrics,
        totals={
            "impressions": total_impressions,
            "clicks": total_clicks,
            "ctr": round((total_clicks / total_impressions * 100) if total_impressions > 0 else 0, 2),
            "total_spend": round(total_spend, 2),
            "total_budget": round(total_budget, 2),
            "remaining_budget": round(max(total_budget - total_spend, 0), 2),
        },
    )


# ── Publisher report ───────────────────────────────────────────────────────────

@router.get("/publisher", response_model=PublisherReportResponse)
async def publisher_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PublisherProfile).where(PublisherProfile.user_id == current_user.id)
    )
    publisher = result.scalar_one_or_none()
    if not publisher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publisher profile not found")

    # Get all slots belonging to this publisher via placements
    result = await db.execute(
        select(AdSlot).join(Placement).where(Placement.publisher_id == publisher.id)
    )
    slots = result.scalars().all()

    slot_metrics = []
    total_impressions = 0
    total_clicks = 0
    total_earnings = 0.0

    for slot in slots:
        imp_result = await db.execute(
            select(func.count(AdImpression.id)).where(AdImpression.slot_id == slot.id)
        )
        impressions = imp_result.scalar_one() or 0

        click_result = await db.execute(
            select(func.count(AdClick.id)).where(AdClick.slot_id == slot.id)
        )
        clicks = click_result.scalar_one() or 0

        earnings_result = await db.execute(
            select(func.sum(AdImpression.publisher_earnings)).where(AdImpression.slot_id == slot.id)
        )
        imp_earnings = float(earnings_result.scalar_one() or 0)

        click_earnings_result = await db.execute(
            select(func.sum(AdClick.publisher_earnings)).where(AdClick.slot_id == slot.id)
        )
        click_earnings = float(click_earnings_result.scalar_one() or 0)

        earnings = imp_earnings + click_earnings
        ctr = (clicks / impressions * 100) if impressions > 0 else 0.0

        slot_metrics.append(SlotMetrics(
            slot_id=str(slot.id),
            slot_name=slot.name,
            impressions=impressions,
            clicks=clicks,
            ctr=round(ctr, 2),
            earnings=round(earnings, 4),
        ))
        total_impressions += impressions
        total_clicks += clicks
        total_earnings += earnings

    return PublisherReportResponse(
        publisher_id=str(publisher.id),
        period="all_time",
        slots=slot_metrics,
        totals={
            "impressions": total_impressions,
            "clicks": total_clicks,
            "ctr": round((total_clicks / total_impressions * 100) if total_impressions > 0 else 0, 2),
            "total_earnings": round(total_earnings, 4),
        },
    )


# ── Admin network report ───────────────────────────────────────────────────────

@router.get("/admin", response_model=AdminNetworkReport)
async def admin_network_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in (UserRole.SUPER_ADMIN, UserRole.OPS_MANAGER):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    total_impressions = (await db.execute(select(func.count(AdImpression.id)))).scalar_one() or 0
    total_clicks = (await db.execute(select(func.count(AdClick.id)))).scalar_one() or 0
    total_spend_result = await db.execute(select(func.sum(LiveCampaign.spent_amount)))
    total_spend = float(total_spend_result.scalar_one() or 0)
    overall_ctr = round((total_clicks / total_impressions * 100) if total_impressions > 0 else 0, 2)

    # Top campaigns by spend
    result = await db.execute(
        select(LiveCampaign).order_by(LiveCampaign.spent_amount.desc()).limit(10)
    )
    top_campaigns_raw = result.scalars().all()
    top_campaigns = []
    for campaign in top_campaigns_raw:
        imp_result = await db.execute(
            select(func.count(AdImpression.id)).where(AdImpression.campaign_id == campaign.id)
        )
        impressions = imp_result.scalar_one() or 0
        click_result = await db.execute(
            select(func.count(AdClick.id)).where(AdClick.campaign_id == campaign.id)
        )
        clicks = click_result.scalar_one() or 0
        ctr = round((clicks / impressions * 100) if impressions > 0 else 0, 2)
        spent = float(campaign.spent_amount)
        budget = float(campaign.total_budget)
        top_campaigns.append(CampaignMetrics(
            campaign_id=str(campaign.id),
            campaign_name=campaign.name,
            status=campaign.status.value,
            impressions=impressions,
            clicks=clicks,
            ctr=ctr,
            total_budget=budget,
            spent_amount=spent,
            remaining_budget=max(budget - spent, 0),
            pricing_model=campaign.pricing_model.value,
        ))

    return AdminNetworkReport(
        period="all_time",
        total_impressions=total_impressions,
        total_clicks=total_clicks,
        overall_ctr=overall_ctr,
        total_spend=total_spend,
        top_campaigns=top_campaigns,
    )
