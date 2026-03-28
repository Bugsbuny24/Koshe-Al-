"""Finance and moderation domain models."""
import uuid
import enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, ForeignKey, JSON, Text, Boolean, Numeric, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase


class InvoiceStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    VOID = "VOID"


class ModerationDecision(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    NEEDS_REVISION = "NEEDS_REVISION"


class ModerationItemType(str, enum.Enum):
    CAMPAIGN = "CAMPAIGN"
    PUBLISHER = "PUBLISHER"
    CREATIVE = "CREATIVE"


# ─── Finance ────────────────────────────────────────────────────────────────

class AdvertiserInvoice(UUIDBase):
    __tablename__ = "advertiser_invoices"

    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=True)
    invoice_number: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    gross_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    platform_fee: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    ad_budget_allocated: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(SAEnum(InvoiceStatus), nullable=False, default=InvoiceStatus.PENDING)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class PublisherPayout(UUIDBase):
    __tablename__ = "publisher_payouts"

    publisher_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("publisher_profiles.id"), nullable=False, index=True)
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    gross_earnings: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    platform_share: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    publisher_share: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    impressions_count: Mapped[int] = mapped_column(nullable=False, default=0)
    clicks_count: Mapped[int] = mapped_column(nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class SpendReservation(UUIDBase):
    __tablename__ = "spend_reservations"

    campaign_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=False, unique=True)
    reserved_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    actual_spend: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


# ─── Moderation ──────────────────────────────────────────────────────────────

class ModerationReview(UUIDBase):
    __tablename__ = "moderation_reviews"

    item_type: Mapped[ModerationItemType] = mapped_column(SAEnum(ModerationItemType), nullable=False)
    item_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False, index=True)
    reviewer_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    decision: Mapped[ModerationDecision] = mapped_column(
        SAEnum(ModerationDecision), nullable=False, default=ModerationDecision.PENDING
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    reviewer: Mapped["User | None"] = relationship("User", foreign_keys=[reviewer_id])


class PolicyFlag(UUIDBase):
    __tablename__ = "policy_flags"

    item_type: Mapped[str] = mapped_column(String(100), nullable=False)
    item_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False, index=True)
    flag_type: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    resolved_by: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)


class FraudSignal(UUIDBase):
    __tablename__ = "fraud_signals"

    campaign_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=True)
    slot_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("ad_slots.id"), nullable=True)
    signal_type: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    signal_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    is_reviewed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # TODO: Add ML-based fraud scoring in future version
