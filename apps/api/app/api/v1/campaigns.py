import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, get_current_workspace
from app.models.user import User, Workspace
from app.schemas.campaign import CampaignBriefCreate, CampaignBriefUpdate, CampaignBriefResponse
from app.services.campaign_service import CampaignService

router = APIRouter(prefix="/campaign-briefs", tags=["campaigns"])


@router.get("", response_model=List[CampaignBriefResponse])
async def list_briefs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await CampaignService.get_briefs(db, workspace.id)


@router.post("", response_model=CampaignBriefResponse, status_code=status.HTTP_201_CREATED)
async def create_brief(
    data: CampaignBriefCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await CampaignService.create_brief(db, data, workspace.id)


@router.get("/{brief_id}", response_model=CampaignBriefResponse)
async def get_brief(
    brief_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await CampaignService.get_brief(db, brief_id, workspace.id)


@router.put("/{brief_id}", response_model=CampaignBriefResponse)
async def update_brief(
    brief_id: uuid.UUID,
    data: CampaignBriefUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await CampaignService.update_brief(db, brief_id, data, workspace.id)


@router.delete("/{brief_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brief(
    brief_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    await CampaignService.delete_brief(db, brief_id, workspace.id)
