"""AdNet advertiser and publisher earnings APIs."""
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import structlog

from app.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.adnet import (
    Campaign, CampaignStatus, Ad,
    AdvertiserWallet, AdvertiserTransaction, PublisherEarning,
)
from app.models.publisher import PublisherProfile

router = APIRouter(tags=["adnet"])
logger = structlog.get_logger()


# ── Schemas ────────────────────────────────────────────────────────────────────

class CampaignCreate(BaseModel):
    title: str
    landing_url: str
    total_budget: Decimal
    daily_budget: Optional[Decimal] = None
    pricing_model: str = "CPM"
    bid_amount: Decimal
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    target_countries: Optional[List[str]] = None
    target_devices: Optional[List[str]] = None
    category: Optional[str] = None
    status: CampaignStatus = CampaignStatus.DRAFT


class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    landing_url: Optional[str] = None
    total_budget: Optional[Decimal] = None
    daily_budget: Optional[Decimal] = None
    pricing_model: Optional[str] = None
    bid_amount: Optional[Decimal] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    target_countries: Optional[List[str]] = None
    target_devices: Optional[List[str]] = None
    category: Optional[str] = None
    status: Optional[CampaignStatus] = None
    is_active: Optional[bool] = None


class CampaignResponse(BaseModel):
    id: str
    user_id: str
    title: str
    landing_url: str
    status: CampaignStatus
    total_budget: Decimal
    daily_budget: Optional[Decimal]
    pricing_model: str
    bid_amount: Decimal
    start_at: Optional[datetime]
    end_at: Optional[datetime]
    target_countries: Optional[List[str]]
    target_devices: Optional[List[str]]
    category: Optional[str]
    is_active: bool
    spent_amount: Decimal
    impressions_count: int
    clicks_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AdCreate(BaseModel):
    headline: str
    body: str
    cta: str
    image_url: Optional[str] = None
    creative_type: str = "text"


class AdUpdate(BaseModel):
    headline: Optional[str] = None
    body: Optional[str] = None
    cta: Optional[str] = None
    image_url: Optional[str] = None
    creative_type: Optional[str] = None
    is_active: Optional[bool] = None


class AdResponse(BaseModel):
    id: str
    campaign_id: str
    headline: str
    body: str
    cta: str
    image_url: Optional[str]
    creative_type: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class WalletResponse(BaseModel):
    id: str
    user_id: str
    balance: Decimal
    total_deposited: Decimal
    total_spent: Decimal
    transactions: List[dict]


class DepositRequest(BaseModel):
    amount: Decimal


class EarningResponse(BaseModel):
    id: str
    publisher_id: str
    slot_id: str
    campaign_id: Optional[str]
    event_type: str
    amount: Decimal
    reference_id: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class EarningsTotals(BaseModel):
    total_earned: float
    impression_earnings: float
    click_earnings: float
    count: int


class EarningsListResponse(BaseModel):
    earnings: List[EarningResponse]
    totals: EarningsTotals


# ── Helpers ────────────────────────────────────────────────────────────────────

def _require_advertiser(user: User) -> None:
    if user.role not in (UserRole.ADVERTISER, UserRole.SUPER_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Advertiser role required")


def _require_publisher(user: User) -> None:
    if user.role not in (UserRole.PUBLISHER, UserRole.SUPER_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Publisher role required")


def _campaign_to_response(c: Campaign) -> CampaignResponse:
    return CampaignResponse(
        id=str(c.id),
        user_id=str(c.user_id),
        title=c.title,
        landing_url=c.landing_url,
        status=c.status,
        total_budget=c.total_budget,
        daily_budget=c.daily_budget,
        pricing_model=c.pricing_model,
        bid_amount=c.bid_amount,
        start_at=c.start_at,
        end_at=c.end_at,
        target_countries=c.target_countries,
        target_devices=c.target_devices,
        category=c.category,
        is_active=c.is_active,
        spent_amount=c.spent_amount,
        impressions_count=c.impressions_count,
        clicks_count=c.clicks_count,
        created_at=c.created_at,
        updated_at=c.updated_at,
    )


def _ad_to_response(a: Ad) -> AdResponse:
    return AdResponse(
        id=str(a.id),
        campaign_id=str(a.campaign_id),
        headline=a.headline,
        body=a.body,
        cta=a.cta,
        image_url=a.image_url,
        creative_type=a.creative_type,
        is_active=a.is_active,
        created_at=a.created_at,
    )


async def _get_campaign_for_user(
    campaign_id: uuid.UUID, user: User, db: AsyncSession
) -> Campaign:
    result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    if user.role != UserRole.SUPER_ADMIN and campaign.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return campaign


# ── Campaign endpoints ─────────────────────────────────────────────────────────

@router.get("/advertiser/campaigns", response_model=List[CampaignResponse])
async def list_campaigns(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    if current_user.role == UserRole.SUPER_ADMIN:
        result = await db.execute(select(Campaign))
    else:
        result = await db.execute(
            select(Campaign).where(Campaign.user_id == current_user.id)
        )
    campaigns = result.scalars().all()
    return [_campaign_to_response(c) for c in campaigns]


@router.post("/advertiser/campaigns", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    payload: CampaignCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    if payload.pricing_model not in ("CPM", "CPC"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="pricing_model must be CPM or CPC")
    campaign = Campaign(
        user_id=current_user.id,
        title=payload.title,
        landing_url=payload.landing_url,
        status=payload.status,
        total_budget=payload.total_budget,
        daily_budget=payload.daily_budget,
        pricing_model=payload.pricing_model,
        bid_amount=payload.bid_amount,
        start_at=payload.start_at,
        end_at=payload.end_at,
        target_countries=payload.target_countries,
        target_devices=payload.target_devices,
        category=payload.category,
    )
    db.add(campaign)
    await db.flush()
    logger.info("Campaign created", campaign_id=str(campaign.id))
    return _campaign_to_response(campaign)


@router.get("/advertiser/campaigns/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    campaign = await _get_campaign_for_user(campaign_id, current_user, db)
    return _campaign_to_response(campaign)


@router.put("/advertiser/campaigns/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(
    campaign_id: uuid.UUID,
    payload: CampaignUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    campaign = await _get_campaign_for_user(campaign_id, current_user, db)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(campaign, field, value)
    await db.flush()
    return _campaign_to_response(campaign)


@router.delete("/advertiser/campaigns/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_campaign(
    campaign_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    campaign = await _get_campaign_for_user(campaign_id, current_user, db)
    await db.delete(campaign)
    await db.flush()


# ── Ad endpoints ───────────────────────────────────────────────────────────────

@router.get("/advertiser/campaigns/{campaign_id}/ads", response_model=List[AdResponse])
async def list_ads(
    campaign_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    await _get_campaign_for_user(campaign_id, current_user, db)
    result = await db.execute(select(Ad).where(Ad.campaign_id == campaign_id))
    ads = result.scalars().all()
    return [_ad_to_response(a) for a in ads]


@router.post("/advertiser/campaigns/{campaign_id}/ads", response_model=AdResponse, status_code=status.HTTP_201_CREATED)
async def create_ad(
    campaign_id: uuid.UUID,
    payload: AdCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    await _get_campaign_for_user(campaign_id, current_user, db)
    ad = Ad(
        campaign_id=campaign_id,
        headline=payload.headline,
        body=payload.body,
        cta=payload.cta,
        image_url=payload.image_url,
        creative_type=payload.creative_type,
    )
    db.add(ad)
    await db.flush()
    logger.info("Ad created", ad_id=str(ad.id), campaign_id=str(campaign_id))
    return _ad_to_response(ad)


@router.put("/advertiser/ads/{ad_id}", response_model=AdResponse)
async def update_ad(
    ad_id: uuid.UUID,
    payload: AdUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    result = await db.execute(select(Ad).where(Ad.id == ad_id))
    ad = result.scalar_one_or_none()
    if not ad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ad not found")
    await _get_campaign_for_user(ad.campaign_id, current_user, db)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(ad, field, value)
    await db.flush()
    return _ad_to_response(ad)


@router.delete("/advertiser/ads/{ad_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ad(
    ad_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    result = await db.execute(select(Ad).where(Ad.id == ad_id))
    ad = result.scalar_one_or_none()
    if not ad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ad not found")
    await _get_campaign_for_user(ad.campaign_id, current_user, db)
    await db.delete(ad)
    await db.flush()


# ── Wallet endpoints ───────────────────────────────────────────────────────────

@router.get("/advertiser/wallet", response_model=WalletResponse)
async def get_wallet(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    result = await db.execute(
        select(AdvertiserWallet).where(AdvertiserWallet.user_id == current_user.id)
    )
    wallet = result.scalar_one_or_none()
    if not wallet:
        # Auto-create empty wallet
        wallet = AdvertiserWallet(user_id=current_user.id)
        db.add(wallet)
        await db.flush()

    result = await db.execute(
        select(AdvertiserTransaction)
        .where(AdvertiserTransaction.wallet_id == wallet.id)
        .order_by(AdvertiserTransaction.created_at.desc())
        .limit(50)
    )
    txns = result.scalars().all()

    return WalletResponse(
        id=str(wallet.id),
        user_id=str(wallet.user_id),
        balance=wallet.balance,
        total_deposited=wallet.total_deposited,
        total_spent=wallet.total_spent,
        transactions=[
            {
                "id": str(t.id),
                "tx_type": t.tx_type,
                "amount": float(t.amount),
                "description": t.description,
                "reference_id": t.reference_id,
                "created_at": t.created_at.isoformat(),
            }
            for t in txns
        ],
    )


@router.post("/advertiser/wallet/deposit", response_model=WalletResponse)
async def deposit_funds(
    payload: DepositRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_advertiser(current_user)
    if payload.amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Deposit amount must be positive")

    result = await db.execute(
        select(AdvertiserWallet).where(AdvertiserWallet.user_id == current_user.id)
    )
    wallet = result.scalar_one_or_none()
    if not wallet:
        wallet = AdvertiserWallet(user_id=current_user.id)
        db.add(wallet)
        await db.flush()

    wallet.balance = wallet.balance + payload.amount
    wallet.total_deposited = wallet.total_deposited + payload.amount

    txn = AdvertiserTransaction(
        wallet_id=wallet.id,
        tx_type="deposit",
        amount=payload.amount,
        description=f"Manual deposit of ${payload.amount}",
    )
    db.add(txn)
    await db.flush()
    logger.info("Wallet deposit", user_id=str(current_user.id), amount=str(payload.amount))

    return WalletResponse(
        id=str(wallet.id),
        user_id=str(wallet.user_id),
        balance=wallet.balance,
        total_deposited=wallet.total_deposited,
        total_spent=wallet.total_spent,
        transactions=[
            {
                "id": str(txn.id),
                "tx_type": txn.tx_type,
                "amount": float(txn.amount),
                "description": txn.description,
                "reference_id": txn.reference_id,
                "created_at": txn.created_at.isoformat(),
            }
        ],
    )


# ── Publisher earnings ─────────────────────────────────────────────────────────

@router.get("/publisher/earnings", response_model=EarningsListResponse)
async def list_publisher_earnings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _require_publisher(current_user)

    result = await db.execute(
        select(PublisherProfile).where(PublisherProfile.user_id == current_user.id)
    )
    pub_profile = result.scalar_one_or_none()

    if current_user.role == UserRole.SUPER_ADMIN:
        result = await db.execute(
            select(PublisherEarning).order_by(PublisherEarning.created_at.desc()).limit(200)
        )
    elif not pub_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publisher profile not found")
    else:
        result = await db.execute(
            select(PublisherEarning)
            .where(PublisherEarning.publisher_id == pub_profile.id)
            .order_by(PublisherEarning.created_at.desc())
            .limit(200)
        )

    earnings = result.scalars().all()
    earning_responses = [
        EarningResponse(
            id=str(e.id),
            publisher_id=str(e.publisher_id),
            slot_id=str(e.slot_id),
            campaign_id=str(e.campaign_id) if e.campaign_id else None,
            event_type=e.event_type,
            amount=e.amount,
            reference_id=e.reference_id,
            created_at=e.created_at,
        )
        for e in earnings
    ]

    total_earned = sum(float(e.amount) for e in earnings)
    impression_earnings = sum(float(e.amount) for e in earnings if e.event_type == "impression")
    click_earnings = sum(float(e.amount) for e in earnings if e.event_type == "click")

    return EarningsListResponse(
        earnings=earning_responses,
        totals=EarningsTotals(
            total_earned=total_earned,
            impression_earnings=impression_earnings,
            click_earnings=click_earnings,
            count=len(earnings),
        ),
    )
