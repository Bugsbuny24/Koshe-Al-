import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.campaign import CampaignBrief
from app.models.brand import Brand
from app.schemas.campaign import CampaignBriefCreate, CampaignBriefUpdate


class CampaignService:
    @staticmethod
    async def get_briefs(db: AsyncSession, workspace_id: uuid.UUID) -> List[CampaignBrief]:
        result = await db.execute(
            select(CampaignBrief).where(CampaignBrief.workspace_id == workspace_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_brief(db: AsyncSession, brief_id: uuid.UUID, workspace_id: uuid.UUID) -> CampaignBrief:
        result = await db.execute(
            select(CampaignBrief).where(
                CampaignBrief.id == brief_id,
                CampaignBrief.workspace_id == workspace_id,
            )
        )
        brief = result.scalar_one_or_none()
        if not brief:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign brief not found")
        return brief

    @staticmethod
    async def create_brief(db: AsyncSession, data: CampaignBriefCreate, workspace_id: uuid.UUID) -> CampaignBrief:
        # Verify brand belongs to workspace
        result = await db.execute(
            select(Brand).where(Brand.id == data.brand_id, Brand.workspace_id == workspace_id)
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")

        platforms = [p.value if hasattr(p, "value") else p for p in data.platforms]
        brief_data = data.model_dump(exclude={"platforms"})
        brief = CampaignBrief(**brief_data, platforms=platforms, workspace_id=workspace_id)
        db.add(brief)
        await db.flush()
        await db.refresh(brief)
        return brief

    @staticmethod
    async def update_brief(db: AsyncSession, brief_id: uuid.UUID, data: CampaignBriefUpdate, workspace_id: uuid.UUID) -> CampaignBrief:
        brief = await CampaignService.get_brief(db, brief_id, workspace_id)
        update_data = data.model_dump(exclude_unset=True)
        if "platforms" in update_data and update_data["platforms"] is not None:
            update_data["platforms"] = [p.value if hasattr(p, "value") else p for p in update_data["platforms"]]
        for key, value in update_data.items():
            setattr(brief, key, value)
        await db.flush()
        await db.refresh(brief)
        return brief

    @staticmethod
    async def delete_brief(db: AsyncSession, brief_id: uuid.UUID, workspace_id: uuid.UUID) -> None:
        brief = await CampaignService.get_brief(db, brief_id, workspace_id)
        await db.delete(brief)
