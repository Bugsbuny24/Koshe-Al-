import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, get_current_workspace
from app.models.user import User, Workspace
from app.schemas.brand import BrandCreate, BrandUpdate, BrandResponse
from app.services.brand_service import BrandService

router = APIRouter(prefix="/brands", tags=["brands"])


@router.get("", response_model=List[BrandResponse])
async def list_brands(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await BrandService.get_brands(db, workspace.id)


@router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
async def create_brand(
    data: BrandCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await BrandService.create_brand(db, data, workspace.id)


@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(
    brand_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await BrandService.get_brand(db, brand_id, workspace.id)


@router.put("/{brand_id}", response_model=BrandResponse)
async def update_brand(
    brand_id: uuid.UUID,
    data: BrandUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await BrandService.update_brand(db, brand_id, data, workspace.id)


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(
    brand_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    await BrandService.delete_brand(db, brand_id, workspace.id)
