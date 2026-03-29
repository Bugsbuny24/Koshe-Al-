"""AdNet core models: standalone advertiser campaigns, ads, wallets, earnings."""
import uuid
import enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, ForeignKey, JSON, Text, Boolean, Numeric, Integer, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase


class CreativeType(str, enum.Enum):
    text = "text"
    image = "image"
    native = "native"
    banner = "banner"


class CampaignStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    ENDED = "ENDED"


class Campaign(UUIDBase):
    __tablename__ = "campaigns"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    landing_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    status: Mapped[CampaignStatus] = mapped_column(
        SAEnum(CampaignStatus, name="campaignstatus"), nullable=False, default=CampaignStatus.DRAFT
    )
    total_budget: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    daily_budget: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    pricing_model: Mapped[str] = mapped_column(String(10), nullable=False)  # CPM or CPC
    bid_amount: Mapped[Decimal] = mapped_column(Numeric(10, 4), nullable=False)
    start_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    target_countries: Mapped[list | None] = mapped_column(JSON, nullable=True)
    target_devices: Mapped[list | None] = mapped_column(JSON, nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    spent_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0"))
    impressions_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    clicks_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    ads: Mapped[list["Ad"]] = relationship("Ad", back_populates="campaign")


class Ad(UUIDBase):
    __tablename__ = "ads"

    campaign_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False, index=True
    )
    headline: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    cta: Mapped[str] = mapped_column(String(100), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    creative_type: Mapped[CreativeType] = mapped_column(SAEnum(CreativeType, name="creative_type"), nullable=False, default=CreativeType.text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    campaign: Mapped["Campaign"] = relationship("Campaign", back_populates="ads")


class AdvertiserWallet(UUIDBase):
    __tablename__ = "advertiser_wallets"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True
    )
    balance: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0"))
    total_deposited: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0"))
    total_spent: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0"))

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    transactions: Mapped[list["AdvertiserTransaction"]] = relationship(
        "AdvertiserTransaction", back_populates="wallet"
    )


class AdvertiserTransaction(UUIDBase):
    __tablename__ = "advertiser_transactions"

    wallet_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("advertiser_wallets.id"), nullable=False, index=True
    )
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True
    )
    tx_type: Mapped[str] = mapped_column(String(50), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 6), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    reference_id: Mapped[str | None] = mapped_column(String(255), nullable=True)

    wallet: Mapped["AdvertiserWallet"] = relationship("AdvertiserWallet", back_populates="transactions")


class PublisherEarning(UUIDBase):
    __tablename__ = "publisher_earnings"

    publisher_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("publisher_profiles.id"), nullable=False, index=True
    )
    slot_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("ad_slots.id"), nullable=False
    )
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True
    )
    event_type: Mapped[str] = mapped_column(String(20), nullable=False)  # "impression" or "click"
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 6), nullable=False)
    reference_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
