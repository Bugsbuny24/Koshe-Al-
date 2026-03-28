import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase
from app.models.campaign import Platform


class PlatformConnection(UUIDBase):
    __tablename__ = "platform_connections"

    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    platform: Mapped[Platform] = mapped_column(SAEnum(Platform), nullable=False)
    access_token_encrypted: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    refresh_token_encrypted: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    connected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="platform_connections")


class OAuthState(UUIDBase):
    __tablename__ = "oauth_states"

    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    platform: Mapped[Platform] = mapped_column(SAEnum(Platform), nullable=False)
    state_token: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
