"""Delivery / ad-network domain models: live campaigns, impressions, clicks, budget, pacing."""
import uuid
import enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, ForeignKey, JSON, Text, Boolean, Numeric, Integer, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase


class PricingModel(str, enum.Enum):
    CPM = "CPM"   # cost per mille (1000 impressions)
    CPC = "CPC"   # cost per click


class LiveCampaignStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    EXHAUSTED = "EXHAUSTED"
    ENDED = "ENDED"
    REJECTED = "REJECTED"


class LiveCampaign(UUIDBase):
    __tablename__ = "live_campaigns"

    campaign_brief_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("campaign_briefs.id"), nullable=False, index=True)
    ad_set_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("generated_ad_sets.id"), nullable=True)
    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[LiveCampaignStatus] = mapped_column(
        SAEnum(LiveCampaignStatus), nullable=False, default=LiveCampaignStatus.PENDING_APPROVAL
    )
    pricing_model: Mapped[PricingModel] = mapped_column(SAEnum(PricingModel), nullable=False, default=PricingModel.CPM)
    cpm_rate: Mapped[Decimal] = mapped_column(Numeric(10, 4), nullable=False, default=Decimal("5.00"))
    cpc_rate: Mapped[Decimal] = mapped_column(Numeric(10, 4), nullable=False, default=Decimal("0.50"))

    # Budget
    total_budget: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    spent_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    daily_budget_cap: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)

    # Targeting
    target_categories: Mapped[list | None] = mapped_column(JSON, nullable=True)
    target_formats: Mapped[list | None] = mapped_column(JSON, nullable=True)
    target_regions: Mapped[list | None] = mapped_column(JSON, nullable=True)

    # Scheduling
    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Caps / controls
    frequency_cap_per_session: Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    priority: Mapped[int] = mapped_column(Integer, nullable=False, default=5)  # 1-10

    # Approval
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    workspace: Mapped["Workspace"] = relationship("Workspace")
    campaign_brief: Mapped["CampaignBrief"] = relationship("CampaignBrief")
    ad_set: Mapped["GeneratedAdSet | None"] = relationship("GeneratedAdSet")
    impressions: Mapped[list["AdImpression"]] = relationship("AdImpression", back_populates="campaign")
    clicks: Mapped[list["AdClick"]] = relationship("AdClick", back_populates="campaign")
    budget_ledger_entries: Mapped[list["BudgetLedger"]] = relationship("BudgetLedger", back_populates="campaign")
    delivery_rules: Mapped[list["DeliveryRule"]] = relationship("DeliveryRule", back_populates="campaign")


class DeliveryRule(UUIDBase):
    __tablename__ = "delivery_rules"

    campaign_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=False, index=True)
    rule_type: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "category_whitelist", "region_filter"
    rule_value: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    campaign: Mapped["LiveCampaign"] = relationship("LiveCampaign", back_populates="delivery_rules")


class AdImpression(UUIDBase):
    __tablename__ = "ad_impressions"

    campaign_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=False, index=True)
    slot_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("ad_slots.id"), nullable=False, index=True)
    ad_set_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("generated_ad_sets.id"), nullable=True)
    session_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    site_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    cost: Mapped[Decimal] = mapped_column(Numeric(10, 6), nullable=False, default=Decimal("0.00"))
    publisher_earnings: Mapped[Decimal] = mapped_column(Numeric(10, 6), nullable=False, default=Decimal("0.00"))
    served_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ip_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)

    campaign: Mapped["LiveCampaign"] = relationship("LiveCampaign", back_populates="impressions")
    slot: Mapped["AdSlot"] = relationship("AdSlot")


class AdClick(UUIDBase):
    __tablename__ = "ad_clicks"

    impression_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("ad_impressions.id"), nullable=True)
    campaign_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=False, index=True)
    slot_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("ad_slots.id"), nullable=False)
    click_token: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    destination_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    cost: Mapped[Decimal] = mapped_column(Numeric(10, 6), nullable=False, default=Decimal("0.00"))
    publisher_earnings: Mapped[Decimal] = mapped_column(Numeric(10, 6), nullable=False, default=Decimal("0.00"))
    clicked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ip_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)

    campaign: Mapped["LiveCampaign"] = relationship("LiveCampaign", back_populates="clicks")
    slot: Mapped["AdSlot"] = relationship("AdSlot")


class ConversionEvent(UUIDBase):
    __tablename__ = "conversion_events"

    campaign_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=False, index=True)
    click_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("ad_clicks.id"), nullable=True)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False, default="conversion")
    value: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    conversion_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    converted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class BudgetLedger(UUIDBase):
    __tablename__ = "budget_ledgers"

    campaign_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=False, index=True)
    entry_type: Mapped[str] = mapped_column(String(50), nullable=False)  # "reserve", "spend_impression", "spend_click", "refund"
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 6), nullable=False)
    reference_id: Mapped[str | None] = mapped_column(String(255), nullable=True)  # impression or click ID
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)

    campaign: Mapped["LiveCampaign"] = relationship("LiveCampaign", back_populates="budget_ledger_entries")


class PacingCounter(UUIDBase):
    __tablename__ = "pacing_counters"

    campaign_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=False, unique=True)
    date_bucket: Mapped[str] = mapped_column(String(20), nullable=False)  # YYYY-MM-DD
    impressions_today: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    clicks_today: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    spend_today: Mapped[Decimal] = mapped_column(Numeric(12, 6), nullable=False, default=Decimal("0.00"))
