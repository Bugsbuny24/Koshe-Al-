import uuid
import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.dependencies import get_db, get_current_user, get_current_workspace, rate_limiter
from app.models.user import User, Workspace
from app.schemas.generation import (
    GenerationJobCreate, GenerationJobResponse,
    GeneratedAdSetResponse, AdVariantResponse, AdVariantUpdate, RegenerateSectionRequest,
)
from app.services.generation_service import GenerationService
from app.config import settings

router = APIRouter(tags=["generation"])
logger = structlog.get_logger()


def _try_enqueue_celery(job_id: str):
    """Try to enqueue to Celery; return True on success, False on failure."""
    try:
        from app.tasks.generation_tasks import run_generation_job
        run_generation_job.apply_async(args=[job_id], countdown=0)
        return True
    except Exception as e:
        logger.warning("Could not enqueue Celery task, will run synchronously", error=str(e))
        return False


@router.post("/generation/jobs", response_model=GenerationJobResponse, status_code=status.HTTP_201_CREATED)
async def create_generation_job(
    data: GenerationJobCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
    _: None = Depends(rate_limiter(settings.RATE_LIMIT_GENERATION_PER_MINUTE)),
):
    job = await GenerationService.create_job(db, data, workspace.id)
    await db.commit()
    await db.refresh(job)

    job_id = str(job.id)
    enqueued = _try_enqueue_celery(job_id)

    if not enqueued:
        # Run synchronously in background
        async def run_sync():
            from app.tasks.generation_tasks import run_generation_job_sync
            try:
                await run_generation_job_sync(job_id)
            except Exception as e:
                logger.error("Sync generation failed", error=str(e))

        asyncio.create_task(run_sync())

    # Re-fetch job to return latest state
    await db.refresh(job)
    return job


@router.get("/generation/jobs/{job_id}", response_model=GenerationJobResponse)
async def get_generation_job(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await GenerationService.get_job(db, job_id, workspace.id)


@router.get("/generated-ad-sets/{ad_set_id}", response_model=GeneratedAdSetResponse)
async def get_ad_set(
    ad_set_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await GenerationService.get_ad_set(db, ad_set_id, workspace.id)


@router.post("/generated-ad-sets/{ad_set_id}/regenerate-section", response_model=GenerationJobResponse, status_code=status.HTTP_201_CREATED)
async def regenerate_section(
    ad_set_id: uuid.UUID,
    data: RegenerateSectionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    ad_set = await GenerationService.get_ad_set(db, ad_set_id, workspace.id)

    from app.schemas.generation import GenerationJobCreate
    job = await GenerationService.create_job(
        db,
        GenerationJobCreate(campaign_brief_id=ad_set.campaign_brief_id),
        workspace.id,
    )
    await db.commit()
    await db.refresh(job)

    job_id = str(job.id)
    enqueued = _try_enqueue_celery(job_id)
    if not enqueued:
        async def run_sync():
            from app.tasks.generation_tasks import run_generation_job_sync
            try:
                await run_generation_job_sync(job_id)
            except Exception as e:
                logger.error("Sync regeneration failed", error=str(e))
        asyncio.create_task(run_sync())

    return job


@router.post("/generated-ad-variants/{variant_id}/favorite", response_model=AdVariantResponse)
async def toggle_favorite(
    variant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await GenerationService.toggle_favorite(db, variant_id, workspace.id)


@router.patch("/generated-ad-variants/{variant_id}", response_model=AdVariantResponse)
async def update_variant(
    variant_id: uuid.UUID,
    data: AdVariantUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    return await GenerationService.update_variant(db, variant_id, data, workspace.id)
