import uuid
import asyncio
from datetime import datetime, timezone
import structlog

from app.tasks.celery_app import celery_app

logger = structlog.get_logger()


def run_async(coro):
    """Run async code in a sync context (Celery task)."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            raise RuntimeError("Event loop is closed")
        return loop.run_until_complete(coro)
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(coro)
        finally:
            loop.close()


async def _execute_generation(job_id: str):
    from app.database import AsyncSessionLocal
    from app.models.generation import GenerationJob, GeneratedAdSet, GeneratedAdVariant, JobStatus
    from app.models.campaign import CampaignBrief, AdFormat
    from app.ai.gemini_provider import GeminiProvider
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload

    async with AsyncSessionLocal() as db:
        try:
            # Fetch job
            result = await db.execute(
                select(GenerationJob).where(GenerationJob.id == uuid.UUID(job_id))
            )
            job = result.scalar_one_or_none()
            if not job:
                logger.error("Job not found", job_id=job_id)
                return

            # Update to PROCESSING
            job.status = JobStatus.PROCESSING
            job.started_at = datetime.now(timezone.utc)
            await db.flush()

            # Fetch campaign brief with relations
            result = await db.execute(
                select(CampaignBrief)
                .where(CampaignBrief.id == job.campaign_brief_id)
                .options(
                    selectinload(CampaignBrief.brand),
                    selectinload(CampaignBrief.product),
                    selectinload(CampaignBrief.audience),
                )
            )
            brief = result.scalar_one_or_none()
            if not brief:
                raise ValueError("Campaign brief not found")

            # Generate ads
            provider = GeminiProvider()
            output = await provider.generate_ads(brief)
            raw_json = output.model_dump(exclude_none=True)

            # Save GeneratedAdSet
            ad_set = GeneratedAdSet(
                generation_job_id=job.id,
                campaign_brief_id=job.campaign_brief_id,
                raw_json=raw_json,
            )
            db.add(ad_set)
            await db.flush()
            await db.refresh(ad_set)

            # Create variants for each ad format
            ad_formats = brief.ad_formats or []
            variants = []

            if output.banner_ads and (AdFormat.BANNER.value in ad_formats or "BANNER" in ad_formats):
                b = output.banner_ads
                variants.append(GeneratedAdVariant(
                    ad_set_id=ad_set.id,
                    ad_format=AdFormat.BANNER.value,
                    variant_type="full_set",
                    content=b.model_dump(),
                ))
                for i, headline in enumerate(b.headlines):
                    variants.append(GeneratedAdVariant(
                        ad_set_id=ad_set.id,
                        ad_format=AdFormat.BANNER.value,
                        variant_type="headline",
                        content={"text": headline, "index": i},
                    ))

            if output.native_card_ads and (AdFormat.NATIVE_CARD.value in ad_formats or "NATIVE_CARD" in ad_formats):
                n = output.native_card_ads
                variants.append(GeneratedAdVariant(
                    ad_set_id=ad_set.id,
                    ad_format=AdFormat.NATIVE_CARD.value,
                    variant_type="full_set",
                    content=n.model_dump(),
                ))
                for i, text in enumerate(n.body_texts):
                    variants.append(GeneratedAdVariant(
                        ad_set_id=ad_set.id,
                        ad_format=AdFormat.NATIVE_CARD.value,
                        variant_type="body_text",
                        content={"text": text, "index": i},
                    ))

            if output.promoted_listing_ads and (AdFormat.PROMOTED_LISTING.value in ad_formats or "PROMOTED_LISTING" in ad_formats):
                p = output.promoted_listing_ads
                variants.append(GeneratedAdVariant(
                    ad_set_id=ad_set.id,
                    ad_format=AdFormat.PROMOTED_LISTING.value,
                    variant_type="full_set",
                    content=p.model_dump(),
                ))

            if output.feed_card_ads and (AdFormat.FEED_CARD.value in ad_formats or "FEED_CARD" in ad_formats):
                f = output.feed_card_ads
                variants.append(GeneratedAdVariant(
                    ad_set_id=ad_set.id,
                    ad_format=AdFormat.FEED_CARD.value,
                    variant_type="full_set",
                    content=f.model_dump(),
                ))
                for i, text in enumerate(f.body_texts):
                    variants.append(GeneratedAdVariant(
                        ad_set_id=ad_set.id,
                        ad_format=AdFormat.FEED_CARD.value,
                        variant_type="body_text",
                        content={"text": text, "index": i},
                    ))

            if output.video_ads and (AdFormat.VIDEO.value in ad_formats or "VIDEO" in ad_formats):
                v = output.video_ads
                variants.append(GeneratedAdVariant(
                    ad_set_id=ad_set.id,
                    ad_format=AdFormat.VIDEO.value,
                    variant_type="full_set",
                    content=v.model_dump(),
                ))
                for i, hook in enumerate(v.hooks):
                    variants.append(GeneratedAdVariant(
                        ad_set_id=ad_set.id,
                        ad_format=AdFormat.VIDEO.value,
                        variant_type="hook",
                        content={"text": hook, "index": i},
                    ))

            for v in variants:
                db.add(v)

            # Update job to COMPLETED
            job.status = JobStatus.COMPLETED
            job.completed_at = datetime.now(timezone.utc)
            await db.commit()
            logger.info("Generation job completed", job_id=job_id, ad_set_id=str(ad_set.id))

        except Exception as e:
            logger.error("Generation job failed", job_id=job_id, error=str(e))
            try:
                result = await db.execute(
                    select(GenerationJob).where(GenerationJob.id == uuid.UUID(job_id))
                )
                job = result.scalar_one_or_none()
                if job:
                    job.status = JobStatus.FAILED
                    job.error_message = str(e)
                    job.completed_at = datetime.now(timezone.utc)
                    await db.commit()
            except Exception as inner_e:
                logger.error("Failed to update job status", error=str(inner_e))
            raise


@celery_app.task(name="app.tasks.generation_tasks.run_generation_job", bind=True, max_retries=0)
def run_generation_job(self, job_id: str):
    """Celery task to run a generation job."""
    logger.info("Starting generation job", job_id=job_id)
    run_async(_execute_generation(job_id))


async def run_generation_job_sync(job_id: str):
    """Run generation job synchronously (when Celery is not available)."""
    await _execute_generation(job_id)
