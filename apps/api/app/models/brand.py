import uuid
from sqlalchemy import String, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase


class Brand(UUIDBase):
    __tablename__ = "brands"

    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    website_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="brands")
    products: Mapped[list["Product"]] = relationship("Product", back_populates="brand")
    campaign_briefs: Mapped[list] = relationship("CampaignBrief", back_populates="brand")


class Product(UUIDBase):
    __tablename__ = "products"

    brand_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("brands.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price_point: Mapped[str | None] = mapped_column(String(100), nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)

    brand: Mapped["Brand"] = relationship("Brand", back_populates="products")
    campaign_briefs: Mapped[list] = relationship("CampaignBrief", back_populates="product")


class Audience(UUIDBase):
    __tablename__ = "audiences"

    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    age_range: Mapped[str | None] = mapped_column(String(50), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(50), nullable=True)
    interests: Mapped[list | None] = mapped_column(JSON, nullable=True)
    locations: Mapped[list | None] = mapped_column(JSON, nullable=True)
    languages: Mapped[list | None] = mapped_column(JSON, nullable=True)

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="audiences")
    campaign_briefs: Mapped[list] = relationship("CampaignBrief", back_populates="audience")
