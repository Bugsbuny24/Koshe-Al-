"""Initial migration

Revision ID: 0001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union
import uuid
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enums
    job_status_enum = postgresql.ENUM("PENDING", "PROCESSING", "COMPLETED", "FAILED", name="jobstatus", create_type=False)
    job_status_enum.create(op.get_bind(), checkfirst=True)

    campaign_objective_enum = postgresql.ENUM(
        "TRAFFIC", "LEADS", "SALES", "ENGAGEMENT", "AWARENESS",
        name="campaignobjective", create_type=False
    )
    campaign_objective_enum.create(op.get_bind(), checkfirst=True)

    tone_enum = postgresql.ENUM(
        "PROFESSIONAL", "PREMIUM", "CASUAL", "AGGRESSIVE", "EDUCATIONAL",
        name="toneofvoice", create_type=False
    )
    tone_enum.create(op.get_bind(), checkfirst=True)

    # Users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"])

    # Workspaces
    op.create_table(
        "workspaces",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(255), nullable=False, unique=True),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_workspaces_slug", "workspaces", ["slug"])

    # Workspace Members
    op.create_table(
        "workspace_members",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("role", sa.String(50), nullable=False, server_default="member"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    # Brands
    op.create_table(
        "brands",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("website_url", sa.String(2048), nullable=True),
        sa.Column("logo_url", sa.String(2048), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_brands_workspace_id", "brands", ["workspace_id"])

    # Products
    op.create_table(
        "products",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("brand_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("brands.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price_point", sa.String(100), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_products_brand_id", "products", ["brand_id"])

    # Audiences
    op.create_table(
        "audiences",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("age_range", sa.String(50), nullable=True),
        sa.Column("gender", sa.String(50), nullable=True),
        sa.Column("interests", sa.JSON(), nullable=True),
        sa.Column("locations", sa.JSON(), nullable=True),
        sa.Column("languages", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_audiences_workspace_id", "audiences", ["workspace_id"])

    # Campaign Briefs
    op.create_table(
        "campaign_briefs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("brand_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("brands.id"), nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("products.id"), nullable=True),
        sa.Column("audience_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("audiences.id"), nullable=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("product_description", sa.Text(), nullable=True),
        sa.Column("website_url", sa.String(2048), nullable=True),
        sa.Column("country_region", sa.String(255), nullable=True),
        sa.Column("language", sa.String(100), nullable=True),
        sa.Column("objective", sa.Enum("TRAFFIC", "LEADS", "SALES", "ENGAGEMENT", "AWARENESS", name="campaignobjective"), nullable=False),
        sa.Column("tone", sa.Enum("PROFESSIONAL", "PREMIUM", "CASUAL", "AGGRESSIVE", "EDUCATIONAL", name="toneofvoice"), nullable=False),
        sa.Column("ad_formats", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("offer", sa.Text(), nullable=True),
        sa.Column("budget_range", sa.String(255), nullable=True),
        sa.Column("landing_page_angle", sa.Text(), nullable=True),
        sa.Column("cta_preference", sa.String(255), nullable=True),
        sa.Column("special_notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_campaign_briefs_workspace_id", "campaign_briefs", ["workspace_id"])

    # Generation Jobs
    op.create_table(
        "generation_jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("campaign_brief_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("campaign_briefs.id"), nullable=False),
        sa.Column("status", sa.Enum("PENDING", "PROCESSING", "COMPLETED", "FAILED", name="jobstatus"), nullable=False, server_default="PENDING"),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_generation_jobs_workspace_id", "generation_jobs", ["workspace_id"])

    # Generated Ad Sets
    op.create_table(
        "generated_ad_sets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("generation_job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("generation_jobs.id"), nullable=False, unique=True),
        sa.Column("campaign_brief_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("campaign_briefs.id"), nullable=False),
        sa.Column("raw_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    # Generated Ad Variants
    op.create_table(
        "generated_ad_variants",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("ad_set_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("generated_ad_sets.id"), nullable=False),
        sa.Column("ad_format", sa.String(50), nullable=False),
        sa.Column("variant_type", sa.String(100), nullable=False),
        sa.Column("content", sa.JSON(), nullable=False),
        sa.Column("is_favorite", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_generated_ad_variants_ad_set_id", "generated_ad_variants", ["ad_set_id"])

    # Export Bundles
    op.create_table(
        "export_bundles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("ad_set_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("generated_ad_sets.id"), nullable=False),
        sa.Column("format", sa.String(20), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_export_bundles_ad_set_id", "export_bundles", ["ad_set_id"])

    # Usage Logs
    op.create_table(
        "usage_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("action", sa.String(255), nullable=False),
        sa.Column("resource_id", sa.String(255), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_usage_logs_workspace_id", "usage_logs", ["workspace_id"])

    # API Usage Counters
    op.create_table(
        "api_usage_counters",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("period", sa.String(50), nullable=False),
        sa.Column("generation_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_api_usage_counters_workspace_id", "api_usage_counters", ["workspace_id"])


def downgrade() -> None:
    op.drop_table("api_usage_counters")
    op.drop_table("usage_logs")
    op.drop_table("export_bundles")
    op.drop_table("generated_ad_variants")
    op.drop_table("generated_ad_sets")
    op.drop_table("generation_jobs")
    op.drop_table("campaign_briefs")
    op.drop_table("audiences")
    op.drop_table("products")
    op.drop_table("brands")
    op.drop_table("workspace_members")
    op.drop_table("workspaces")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS jobstatus")
    op.execute("DROP TYPE IF EXISTS campaignobjective")
    op.execute("DROP TYPE IF EXISTS toneofvoice")
