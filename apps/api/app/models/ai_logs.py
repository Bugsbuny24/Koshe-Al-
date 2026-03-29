"""AI optimization logs model."""
import uuid
from decimal import Decimal
from sqlalchemy import String, ForeignKey, Text, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import UUIDBase


class AiOptimizationLog(UUIDBase):
    __tablename__ = "ai_optimization_logs"

    campaign_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True, index=True
    )
    live_campaign_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("live_campaigns.id"), nullable=True, index=True
    )
    action: Mapped[str] = mapped_column(String(50), nullable=False)
    bid_adjustment_pct: Mapped[Decimal | None] = mapped_column(Numeric(6, 2), nullable=True)
    budget_adjustment_pct: Mapped[Decimal | None] = mapped_column(Numeric(6, 2), nullable=True)
    reasoning: Mapped[str | None] = mapped_column(Text, nullable=True)
    gemini_raw_response: Mapped[dict | None] = mapped_column(JSON, nullable=True)
