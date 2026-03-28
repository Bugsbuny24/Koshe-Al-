import uuid
from datetime import datetime, timezone
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
import structlog

from app.models.generation import GenerationJob, GeneratedAdSet, GeneratedAdVariant, JobStatus
from app.models.campaign import CampaignBrief
from app.schemas.generation import GenerationJobCreate, AdVariantUpdate

logger = structlog.get_logger()


class GenerationService:
    @staticmethod
    async def create_job(db: AsyncSession, data: GenerationJobCreate, workspace_id: uuid.UUID) -> GenerationJob:
        # Verify campaign brief belongs to workspace
        result = await db.execute(
            select(CampaignBrief).where(
                CampaignBrief.id == data.campaign_brief_id,
                CampaignBrief.workspace_id == workspace_id,
            )
        )
        brief = result.scalar_one_or_none()
        if not brief:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign brief not found")

        job = GenerationJob(
            workspace_id=workspace_id,
            campaign_brief_id=data.campaign_brief_id,
            status=JobStatus.PENDING,
        )
        db.add(job)
        await db.flush()
        await db.refresh(job)
        return job

    @staticmethod
    async def get_job(db: AsyncSession, job_id: uuid.UUID, workspace_id: uuid.UUID) -> GenerationJob:
        result = await db.execute(
            select(GenerationJob).where(
                GenerationJob.id == job_id,
                GenerationJob.workspace_id == workspace_id,
            )
        )
        job = result.scalar_one_or_none()
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Generation job not found")
        return job

    @staticmethod
    async def get_ad_set(db: AsyncSession, ad_set_id: uuid.UUID, workspace_id: uuid.UUID) -> GeneratedAdSet:
        result = await db.execute(
            select(GeneratedAdSet)
            .join(GenerationJob)
            .where(
                GeneratedAdSet.id == ad_set_id,
                GenerationJob.workspace_id == workspace_id,
            )
            .options(selectinload(GeneratedAdSet.variants))
        )
        ad_set = result.scalar_one_or_none()
        if not ad_set:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ad set not found")
        return ad_set

    @staticmethod
    async def toggle_favorite(db: AsyncSession, variant_id: uuid.UUID, workspace_id: uuid.UUID) -> GeneratedAdVariant:
        result = await db.execute(
            select(GeneratedAdVariant)
            .join(GeneratedAdSet)
            .join(GenerationJob)
            .where(
                GeneratedAdVariant.id == variant_id,
                GenerationJob.workspace_id == workspace_id,
            )
        )
        variant = result.scalar_one_or_none()
        if not variant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Variant not found")
        variant.is_favorite = not variant.is_favorite
        await db.flush()
        await db.refresh(variant)
        return variant

    @staticmethod
    async def update_variant(db: AsyncSession, variant_id: uuid.UUID, data: AdVariantUpdate, workspace_id: uuid.UUID) -> GeneratedAdVariant:
        result = await db.execute(
            select(GeneratedAdVariant)
            .join(GeneratedAdSet)
            .join(GenerationJob)
            .where(
                GeneratedAdVariant.id == variant_id,
                GenerationJob.workspace_id == workspace_id,
            )
        )
        variant = result.scalar_one_or_none()
        if not variant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Variant not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(variant, key, value)
        await db.flush()
        await db.refresh(variant)
        return variant

    @staticmethod
    async def get_jobs_for_brief(db: AsyncSession, brief_id: uuid.UUID, workspace_id: uuid.UUID) -> List[GenerationJob]:
        result = await db.execute(
            select(GenerationJob).where(
                GenerationJob.campaign_brief_id == brief_id,
                GenerationJob.workspace_id == workspace_id,
            )
        )
        return list(result.scalars().all())
