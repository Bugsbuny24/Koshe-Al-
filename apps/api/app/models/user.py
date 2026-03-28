import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.models.base import UUIDBase


class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    OPS_MANAGER = "OPS_MANAGER"
    ADVERTISER = "ADVERTISER"
    PUBLISHER = "PUBLISHER"


class User(UUIDBase):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), nullable=False, default=UserRole.ADVERTISER)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    workspaces: Mapped[list["Workspace"]] = relationship("Workspace", back_populates="owner")
    workspace_memberships: Mapped[list["WorkspaceMember"]] = relationship("WorkspaceMember", back_populates="user")


class Workspace(UUIDBase):
    __tablename__ = "workspaces"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    owner_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    owner: Mapped["User"] = relationship("User", back_populates="workspaces")
    members: Mapped[list["WorkspaceMember"]] = relationship("WorkspaceMember", back_populates="workspace")
    brands: Mapped[list] = relationship("Brand", back_populates="workspace")
    audiences: Mapped[list] = relationship("Audience", back_populates="workspace")
    campaign_briefs: Mapped[list] = relationship("CampaignBrief", back_populates="workspace")
    generation_jobs: Mapped[list] = relationship("GenerationJob", back_populates="workspace")
    platform_connections: Mapped[list] = relationship("PlatformConnection", back_populates="workspace")
    usage_logs: Mapped[list] = relationship("UsageLog", back_populates="workspace")
    api_usage_counters: Mapped[list] = relationship("ApiUsageCounter", back_populates="workspace")


class WorkspaceMember(UUIDBase):
    __tablename__ = "workspace_members"

    workspace_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="member")

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="members")
    user: Mapped["User"] = relationship("User", back_populates="workspace_memberships")
