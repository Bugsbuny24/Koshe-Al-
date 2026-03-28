"""Publisher-side domain models: profiles, sites, apps, placements, ad slots."""
import uuid
import enum
from sqlalchemy import String, ForeignKey, JSON, Text, Boolean, Numeric, Integer, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase


class PublisherStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"


class SlotFormat(str, enum.Enum):
    BANNER = "BANNER"
    NATIVE_CARD = "NATIVE_CARD"
    PROMOTED_LISTING = "PROMOTED_LISTING"
    FEED_CARD = "FEED_CARD"


class PublisherProfile(UUIDBase):
    __tablename__ = "publisher_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    website_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[PublisherStatus] = mapped_column(
        SAEnum(PublisherStatus), nullable=False, default=PublisherStatus.PENDING
    )
    revenue_share_pct: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=70.0)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    sites: Mapped[list["PublisherSite"]] = relationship("PublisherSite", back_populates="publisher")
    apps: Mapped[list["PublisherApp"]] = relationship("PublisherApp", back_populates="publisher")


class PublisherSite(UUIDBase):
    __tablename__ = "publisher_sites"

    publisher_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("publisher_profiles.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    allowed_categories: Mapped[list | None] = mapped_column(JSON, nullable=True)

    publisher: Mapped["PublisherProfile"] = relationship("PublisherProfile", back_populates="sites")
    placements: Mapped[list["Placement"]] = relationship("Placement", back_populates="site")


class PublisherApp(UUIDBase):
    __tablename__ = "publisher_apps"

    publisher_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("publisher_profiles.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    bundle_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    platform: Mapped[str] = mapped_column(String(50), nullable=False)  # ios, android, web
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    publisher: Mapped["PublisherProfile"] = relationship("PublisherProfile", back_populates="apps")
    placements: Mapped[list["Placement"]] = relationship("Placement", back_populates="app")


class Placement(UUIDBase):
    __tablename__ = "placements"

    publisher_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("publisher_profiles.id"), nullable=False, index=True)
    site_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("publisher_sites.id"), nullable=True)
    app_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("publisher_apps.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    page_path: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    context_tags: Mapped[list | None] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    publisher: Mapped["PublisherProfile"] = relationship("PublisherProfile")
    site: Mapped["PublisherSite | None"] = relationship("PublisherSite", back_populates="placements")
    app: Mapped["PublisherApp | None"] = relationship("PublisherApp", back_populates="placements")
    slots: Mapped[list["AdSlot"]] = relationship("AdSlot", back_populates="placement")


class AdSlot(UUIDBase):
    __tablename__ = "ad_slots"

    placement_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("placements.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    format: Mapped[SlotFormat] = mapped_column(SAEnum(SlotFormat), nullable=False)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    allowed_formats: Mapped[list | None] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    placement: Mapped["Placement"] = relationship("Placement", back_populates="slots")
