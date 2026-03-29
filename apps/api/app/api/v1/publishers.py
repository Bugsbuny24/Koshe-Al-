"""Publisher-side APIs: profiles, sites, apps, placements, ad slots."""
import uuid
import secrets
from typing import List, Optional
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, Field
import structlog

from app.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.publisher import (
    PublisherProfile, PublisherSite, PublisherApp, Placement, AdSlot,
    PublisherStatus, SlotFormat,
)

router = APIRouter(prefix="/publishers", tags=["publishers"])
logger = structlog.get_logger()


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class PublisherProfileCreate(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255)
    website_url: Optional[str] = None
    contact_email: str
    description: Optional[str] = None


class PublisherProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    website_url: Optional[str] = None
    contact_email: Optional[str] = None
    description: Optional[str] = None


class PublisherProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_name: str
    website_url: Optional[str]
    contact_email: str
    description: Optional[str]
    status: PublisherStatus
    revenue_share_pct: float
    rejection_reason: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SiteCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    domain: str = Field(..., min_length=1, max_length=255)
    category: Optional[str] = None
    description: Optional[str] = None
    allowed_categories: Optional[List[str]] = None


class SiteUpdate(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    allowed_categories: Optional[List[str]] = None


class SiteResponse(BaseModel):
    id: uuid.UUID
    publisher_id: uuid.UUID
    name: str
    domain: str
    category: Optional[str]
    description: Optional[str]
    is_active: bool
    allowed_categories: Optional[List[str]]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AppCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    bundle_id: Optional[str] = None
    platform: str = Field(..., pattern="^(ios|android|web)$")
    category: Optional[str] = None
    description: Optional[str] = None


class AppUpdate(BaseModel):
    name: Optional[str] = None
    bundle_id: Optional[str] = None
    platform: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class AppResponse(BaseModel):
    id: uuid.UUID
    publisher_id: uuid.UUID
    name: str
    bundle_id: Optional[str]
    platform: str
    category: Optional[str]
    description: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PlacementCreate(BaseModel):
    site_id: Optional[uuid.UUID] = None
    app_id: Optional[uuid.UUID] = None
    name: str = Field(..., min_length=1, max_length=255)
    page_path: Optional[str] = None
    context_tags: Optional[List[str]] = None


class PlacementUpdate(BaseModel):
    name: Optional[str] = None
    page_path: Optional[str] = None
    context_tags: Optional[List[str]] = None
    is_active: Optional[bool] = None


class PlacementResponse(BaseModel):
    id: uuid.UUID
    publisher_id: uuid.UUID
    site_id: Optional[uuid.UUID]
    app_id: Optional[uuid.UUID]
    name: str
    page_path: Optional[str]
    context_tags: Optional[List[str]]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SlotCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    format: SlotFormat
    slot_key: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    category: Optional[str] = None
    revenue_share_percent: Optional[float] = None
    allowed_formats: Optional[List[str]] = None


class SlotUpdate(BaseModel):
    name: Optional[str] = None
    format: Optional[SlotFormat] = None
    slot_key: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None
    revenue_share_percent: Optional[float] = None
    allowed_formats: Optional[List[str]] = None


class SlotResponse(BaseModel):
    id: uuid.UUID
    placement_id: uuid.UUID
    name: str
    format: SlotFormat
    slot_key: Optional[str]
    width: Optional[int]
    height: Optional[int]
    category: Optional[str]
    revenue_share_percent: Optional[float]
    allowed_formats: Optional[List[str]]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Helpers ────────────────────────────────────────────────────────────────────

async def _require_publisher_profile(user: User, db: AsyncSession) -> PublisherProfile:
    result = await db.execute(
        select(PublisherProfile).where(PublisherProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publisher profile not found")
    return profile


# ── Publisher profile ──────────────────────────────────────────────────────────

@router.post("/profile", response_model=PublisherProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_publisher_profile(
    data: PublisherProfileCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only allow PUBLISHER role or any role to self-register
    result = await db.execute(
        select(PublisherProfile).where(PublisherProfile.user_id == current_user.id)
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Publisher profile already exists")

    profile = PublisherProfile(
        user_id=current_user.id,
        company_name=data.company_name,
        website_url=data.website_url,
        contact_email=data.contact_email,
        description=data.description,
    )
    db.add(profile)
    await db.flush()
    await db.refresh(profile)
    logger.info("Publisher profile created", publisher_id=str(profile.id))
    return profile


@router.get("/profile", response_model=PublisherProfileResponse)
async def get_publisher_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await _require_publisher_profile(current_user, db)


@router.patch("/profile", response_model=PublisherProfileResponse)
async def update_publisher_profile(
    data: PublisherProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    await db.flush()
    await db.refresh(profile)
    return profile


# ── Sites ──────────────────────────────────────────────────────────────────────

@router.get("/sites", response_model=List[SiteResponse])
async def list_sites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(PublisherSite).where(PublisherSite.publisher_id == profile.id)
    )
    return result.scalars().all()


@router.post("/sites", response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
async def create_site(
    data: SiteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    site = PublisherSite(publisher_id=profile.id, **data.model_dump())
    db.add(site)
    await db.flush()
    await db.refresh(site)
    return site


@router.get("/sites/{site_id}", response_model=SiteResponse)
async def get_site(
    site_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(PublisherSite).where(
            PublisherSite.id == site_id, PublisherSite.publisher_id == profile.id
        )
    )
    site = result.scalar_one_or_none()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")
    return site


@router.patch("/sites/{site_id}", response_model=SiteResponse)
async def update_site(
    site_id: uuid.UUID,
    data: SiteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(PublisherSite).where(
            PublisherSite.id == site_id, PublisherSite.publisher_id == profile.id
        )
    )
    site = result.scalar_one_or_none()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(site, field, value)
    await db.flush()
    await db.refresh(site)
    return site


@router.delete("/sites/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_site(
    site_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(PublisherSite).where(
            PublisherSite.id == site_id, PublisherSite.publisher_id == profile.id
        )
    )
    site = result.scalar_one_or_none()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")
    await db.delete(site)


# ── Apps ───────────────────────────────────────────────────────────────────────

@router.get("/apps", response_model=List[AppResponse])
async def list_apps(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(PublisherApp).where(PublisherApp.publisher_id == profile.id)
    )
    return result.scalars().all()


@router.post("/apps", response_model=AppResponse, status_code=status.HTTP_201_CREATED)
async def create_app(
    data: AppCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    app = PublisherApp(publisher_id=profile.id, **data.model_dump())
    db.add(app)
    await db.flush()
    await db.refresh(app)
    return app


@router.patch("/apps/{app_id}", response_model=AppResponse)
async def update_app(
    app_id: uuid.UUID,
    data: AppUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(PublisherApp).where(
            PublisherApp.id == app_id, PublisherApp.publisher_id == profile.id
        )
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="App not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(app, field, value)
    await db.flush()
    await db.refresh(app)
    return app


@router.delete("/apps/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_app(
    app_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(PublisherApp).where(
            PublisherApp.id == app_id, PublisherApp.publisher_id == profile.id
        )
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="App not found")
    await db.delete(app)


# ── Placements ─────────────────────────────────────────────────────────────────

@router.get("/placements", response_model=List[PlacementResponse])
async def list_placements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(Placement).where(Placement.publisher_id == profile.id)
    )
    return result.scalars().all()


@router.post("/placements", response_model=PlacementResponse, status_code=status.HTTP_201_CREATED)
async def create_placement(
    data: PlacementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    placement = Placement(publisher_id=profile.id, **data.model_dump())
    db.add(placement)
    await db.flush()
    await db.refresh(placement)
    return placement


@router.get("/placements/{placement_id}", response_model=PlacementResponse)
async def get_placement(
    placement_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(Placement).where(
            Placement.id == placement_id, Placement.publisher_id == profile.id
        )
    )
    placement = result.scalar_one_or_none()
    if not placement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Placement not found")
    return placement


@router.patch("/placements/{placement_id}", response_model=PlacementResponse)
async def update_placement(
    placement_id: uuid.UUID,
    data: PlacementUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(Placement).where(
            Placement.id == placement_id, Placement.publisher_id == profile.id
        )
    )
    placement = result.scalar_one_or_none()
    if not placement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Placement not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(placement, field, value)
    await db.flush()
    await db.refresh(placement)
    return placement


# ── Ad Slots ──────────────────────────────────────────────────────────────────

@router.get("/placements/{placement_id}/slots", response_model=List[SlotResponse])
async def list_slots(
    placement_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    # Verify placement belongs to publisher
    result = await db.execute(
        select(Placement).where(
            Placement.id == placement_id, Placement.publisher_id == profile.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Placement not found")
    result = await db.execute(
        select(AdSlot).where(AdSlot.placement_id == placement_id)
    )
    return result.scalars().all()


@router.post("/placements/{placement_id}/slots", response_model=SlotResponse, status_code=status.HTTP_201_CREATED)
async def create_slot(
    placement_id: uuid.UUID,
    data: SlotCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(Placement).where(
            Placement.id == placement_id, Placement.publisher_id == profile.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Placement not found")
    slot_data = data.model_dump()
    if not slot_data.get("slot_key"):
        slot_data["slot_key"] = secrets.token_urlsafe(12)
    slot = AdSlot(placement_id=placement_id, **slot_data)
    db.add(slot)
    try:
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="slot_key already exists")
    await db.refresh(slot)
    return slot


@router.patch("/slots/{slot_id}", response_model=SlotResponse)
async def update_slot(
    slot_id: uuid.UUID,
    data: SlotUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    # Security: verify slot belongs to this publisher via placement chain
    result = await db.execute(
        select(AdSlot).join(Placement).where(
            AdSlot.id == slot_id, Placement.publisher_id == profile.id
        )
    )
    slot = result.scalar_one_or_none()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(slot, field, value)
    await db.flush()
    await db.refresh(slot)
    return slot


@router.delete("/slots/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_slot(
    slot_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = await _require_publisher_profile(current_user, db)
    result = await db.execute(
        select(AdSlot).join(Placement).where(
            AdSlot.id == slot_id, Placement.publisher_id == profile.id
        )
    )
    slot = result.scalar_one_or_none()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
    await db.delete(slot)
