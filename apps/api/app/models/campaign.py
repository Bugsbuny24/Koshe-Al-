import uuid
import enum
from sqlalchemy import String, ForeignKey, JSON, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase


class AdFormat(str, enum.Enum):
    BANNER = "BANNER"
    NATIVE_CARD = "NATIVE_CARD"
    PROMOTED_LISTING = "PROMOTED_LISTING"
    FEED_CARD = "FEED_CARD"
    VIDEO = "VIDEO"


class CampaignObjective(str, enum.Enum):
    TRAFFIC = "TRAFFIC"
    LEADS = "LEADS"
    SALES = "SALES"
    ENGAGEMENT = "ENGAGEMENT"
    AWARENESS = "AWARENESS"


class ToneOfVoice(str, enum.Enum):
    PROFESSIONAL = "PROFESSIONAL"
    PREMIUM = "PREMIUM"
    CASUAL = "CASUAL"
    AGGRESSIVE = "AGGRESSIVE"
    EDUCATIONAL = "EDUCATIONAL"


class CampaignBrief(UUIDBase):
    __tablename__ = "campaign_briefs"

    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    brand_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("brands.id"), nullable=False)
    product_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)
    audience_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("audiences.id"), nullable=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    product_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    website_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    country_region: Mapped[str | None] = mapped_column(String(255), nullable=True)
    language: Mapped[str | None] = mapped_column(String(100), nullable=True)
    objective: Mapped[CampaignObjective] = mapped_column(SAEnum(CampaignObjective), nullable=False)
    tone: Mapped[ToneOfVoice] = mapped_column(SAEnum(ToneOfVoice), nullable=False)
    ad_formats: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    offer: Mapped[str | None] = mapped_column(Text, nullable=True)
    budget_range: Mapped[str | None] = mapped_column(String(255), nullable=True)
    landing_page_angle: Mapped[str | None] = mapped_column(Text, nullable=True)
    cta_preference: Mapped[str | None] = mapped_column(String(255), nullable=True)
    special_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="campaign_briefs")
    brand: Mapped["Brand"] = relationship("Brand", back_populates="campaign_briefs")
    product: Mapped["Product"] = relationship("Product", back_populates="campaign_briefs")
    audience: Mapped["Audience"] = relationship("Audience", back_populates="campaign_briefs")
    generation_jobs: Mapped[list] = relationship("GenerationJob", back_populates="campaign_brief")
    generated_ad_sets: Mapped[list] = relationship("GeneratedAdSet", back_populates="campaign_brief")
