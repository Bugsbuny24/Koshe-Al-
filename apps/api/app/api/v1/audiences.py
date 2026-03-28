import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, get_current_workspace
from app.models.user import User, Workspace
from app.schemas.brand import AudienceCreate, AudienceUpdate, AudienceResponse
from app.services.brand_service import AudienceService

router = APIRouter(prefix="/audiences", tags=["audiences"])


@router.get("", response_model=List[AudienceResponse])
async def list_audiences(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await AudienceService.get_audiences(db, workspace.id)


@router.post("", response_model=AudienceResponse, status_code=status.HTTP_201_CREATED)
async def create_audience(
    data: AudienceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await AudienceService.create_audience(db, data, workspace.id)


@router.get("/{audience_id}", response_model=AudienceResponse)
async def get_audience(
    audience_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await AudienceService.get_audience(db, audience_id, workspace.id)


@router.put("/{audience_id}", response_model=AudienceResponse)
async def update_audience(
    audience_id: uuid.UUID,
    data: AudienceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await AudienceService.update_audience(db, audience_id, data, workspace.id)


@router.delete("/{audience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audience(
    audience_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    await AudienceService.delete_audience(db, audience_id, workspace.id)
