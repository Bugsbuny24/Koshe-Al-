import uuid
import enum
from datetime import datetime
from sqlalchemy import String, ForeignKey, JSON, Text, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase
from app.models.campaign import Platform


class JobStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class GenerationJob(UUIDBase):
    __tablename__ = "generation_jobs"

    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    campaign_brief_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("campaign_briefs.id"), nullable=False)
    status: Mapped[JobStatus] = mapped_column(SAEnum(JobStatus), nullable=False, default=JobStatus.PENDING)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="generation_jobs")
    campaign_brief: Mapped["CampaignBrief"] = relationship("CampaignBrief", back_populates="generation_jobs")
    generated_ad_set: Mapped["GeneratedAdSet"] = relationship("GeneratedAdSet", back_populates="generation_job", uselist=False)


class GeneratedAdSet(UUIDBase):
    __tablename__ = "generated_ad_sets"

    generation_job_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("generation_jobs.id"), unique=True, nullable=False)
    campaign_brief_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("campaign_briefs.id"), nullable=False)
    raw_json: Mapped[dict] = mapped_column(JSON, nullable=False)

    generation_job: Mapped["GenerationJob"] = relationship("GenerationJob", back_populates="generated_ad_set")
    campaign_brief: Mapped["CampaignBrief"] = relationship("CampaignBrief", back_populates="generated_ad_sets")
    variants: Mapped[list["GeneratedAdVariant"]] = relationship("GeneratedAdVariant", back_populates="ad_set")
    export_bundles: Mapped[list["ExportBundle"]] = relationship("ExportBundle", back_populates="ad_set")


class GeneratedAdVariant(UUIDBase):
    __tablename__ = "generated_ad_variants"

    ad_set_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("generated_ad_sets.id"), nullable=False, index=True)
    platform: Mapped[Platform] = mapped_column(SAEnum(Platform), nullable=False)
    variant_type: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    ad_set: Mapped["GeneratedAdSet"] = relationship("GeneratedAdSet", back_populates="variants")


class ExportBundle(UUIDBase):
    __tablename__ = "export_bundles"

    ad_set_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("generated_ad_sets.id"), nullable=False, index=True)
    format: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    ad_set: Mapped["GeneratedAdSet"] = relationship("GeneratedAdSet", back_populates="export_bundles")
