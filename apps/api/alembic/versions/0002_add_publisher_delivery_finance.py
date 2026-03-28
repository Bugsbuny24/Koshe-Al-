"""Add publisher, delivery, finance, moderation models + user roles

Revision ID: 0002
Revises: 0001
Create Date: 2024-01-02 00:00:00.000000
"""
from typing import Sequence, Union
import uuid
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── New enums ──────────────────────────────────────────────────────────

    userrole_enum = postgresql.ENUM(
        "SUPER_ADMIN", "OPS_MANAGER", "ADVERTISER", "PUBLISHER",
        name="userrole", create_type=False
    )
    userrole_enum.create(op.get_bind(), checkfirst=True)

    publisherstatus_enum = postgresql.ENUM(
        "PENDING", "APPROVED", "REJECTED", "SUSPENDED",
        name="publisherstatus", create_type=False
    )
    publisherstatus_enum.create(op.get_bind(), checkfirst=True)

    slotformat_enum = postgresql.ENUM(
        "BANNER", "NATIVE_CARD", "PROMOTED_LISTING", "FEED_CARD",
        name="slotformat", create_type=False
    )
    slotformat_enum.create(op.get_bind(), checkfirst=True)

    livecampaignstatus_enum = postgresql.ENUM(
        "DRAFT", "PENDING_APPROVAL", "APPROVED", "ACTIVE",
        "PAUSED", "EXHAUSTED", "ENDED", "REJECTED",
        name="livecampaignstatus", create_type=False
    )
    livecampaignstatus_enum.create(op.get_bind(), checkfirst=True)

    pricingmodel_enum = postgresql.ENUM(
        "CPM", "CPC",
        name="pricingmodel", create_type=False
    )
    pricingmodel_enum.create(op.get_bind(), checkfirst=True)

    invoicestatus_enum = postgresql.ENUM(
        "PENDING", "PAID", "VOID",
        name="invoicestatus", create_type=False
    )
    invoicestatus_enum.create(op.get_bind(), checkfirst=True)

    moderationdecision_enum = postgresql.ENUM(
        "PENDING", "APPROVED", "REJECTED", "NEEDS_REVISION",
        name="moderationdecision", create_type=False
    )
    moderationdecision_enum.create(op.get_bind(), checkfirst=True)

    moderationitemtype_enum = postgresql.ENUM(
        "CAMPAIGN", "PUBLISHER", "CREATIVE",
        name="moderationitemtype", create_type=False
    )
    moderationitemtype_enum.create(op.get_bind(), checkfirst=True)

    # ── Add role column to users ───────────────────────────────────────────
    op.add_column(
        "users",
        sa.Column(
            "role",
            sa.Enum("SUPER_ADMIN", "OPS_MANAGER", "ADVERTISER", "PUBLISHER", name="userrole"),
            nullable=False,
            server_default="ADVERTISER",
        ),
    )

    # ── Publisher tables ───────────────────────────────────────────────────

    op.create_table(
        "publisher_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, unique=True),
        sa.Column("company_name", sa.String(255), nullable=False),
        sa.Column("website_url", sa.String(2048), nullable=True),
        sa.Column("contact_email", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "status",
            sa.Enum("PENDING", "APPROVED", "REJECTED", "SUSPENDED", name="publisherstatus"),
            nullable=False,
            server_default="PENDING",
        ),
        sa.Column("revenue_share_pct", sa.Numeric(5, 2), nullable=False, server_default="70.00"),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "publisher_sites",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("publisher_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("publisher_profiles.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("domain", sa.String(255), nullable=False),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("allowed_categories", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_publisher_sites_publisher_id", "publisher_sites", ["publisher_id"])

    op.create_table(
        "publisher_apps",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("publisher_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("publisher_profiles.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("bundle_id", sa.String(255), nullable=True),
        sa.Column("platform", sa.String(50), nullable=False),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_publisher_apps_publisher_id", "publisher_apps", ["publisher_id"])

    op.create_table(
        "placements",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("publisher_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("publisher_profiles.id"), nullable=False),
        sa.Column("site_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("publisher_sites.id"), nullable=True),
        sa.Column("app_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("publisher_apps.id"), nullable=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("page_path", sa.String(1024), nullable=True),
        sa.Column("context_tags", sa.JSON(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_placements_publisher_id", "placements", ["publisher_id"])

    op.create_table(
        "ad_slots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("placement_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("placements.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column(
            "format",
            sa.Enum("BANNER", "NATIVE_CARD", "PROMOTED_LISTING", "FEED_CARD", name="slotformat"),
            nullable=False,
        ),
        sa.Column("width", sa.Integer(), nullable=True),
        sa.Column("height", sa.Integer(), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("allowed_formats", sa.JSON(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ad_slots_placement_id", "ad_slots", ["placement_id"])

    # ── Live campaign / delivery tables ────────────────────────────────────

    op.create_table(
        "live_campaigns",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("campaign_brief_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("campaign_briefs.id"), nullable=False),
        sa.Column("ad_set_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("generated_ad_sets.id"), nullable=True),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "DRAFT", "PENDING_APPROVAL", "APPROVED", "ACTIVE",
                "PAUSED", "EXHAUSTED", "ENDED", "REJECTED",
                name="livecampaignstatus",
            ),
            nullable=False,
            server_default="PENDING_APPROVAL",
        ),
        sa.Column(
            "pricing_model",
            sa.Enum("CPM", "CPC", name="pricingmodel"),
            nullable=False,
            server_default="CPM",
        ),
        sa.Column("cpm_rate", sa.Numeric(10, 4), nullable=False, server_default="5.0000"),
        sa.Column("cpc_rate", sa.Numeric(10, 4), nullable=False, server_default="0.5000"),
        sa.Column("total_budget", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
        sa.Column("spent_amount", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
        sa.Column("daily_budget_cap", sa.Numeric(12, 2), nullable=True),
        sa.Column("target_categories", sa.JSON(), nullable=True),
        sa.Column("target_formats", sa.JSON(), nullable=True),
        sa.Column("target_regions", sa.JSON(), nullable=True),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("end_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("frequency_cap_per_session", sa.Integer(), nullable=False, server_default="3"),
        sa.Column("priority", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("is_approved", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_live_campaigns_campaign_brief_id", "live_campaigns", ["campaign_brief_id"])
    op.create_index("ix_live_campaigns_workspace_id", "live_campaigns", ["workspace_id"])

    op.create_table(
        "delivery_rules",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=False),
        sa.Column("rule_type", sa.String(100), nullable=False),
        sa.Column("rule_value", sa.JSON(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_delivery_rules_campaign_id", "delivery_rules", ["campaign_id"])

    op.create_table(
        "ad_impressions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=False),
        sa.Column("slot_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("ad_slots.id"), nullable=False),
        sa.Column("ad_set_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("generated_ad_sets.id"), nullable=True),
        sa.Column("session_id", sa.String(255), nullable=True),
        sa.Column("site_url", sa.String(2048), nullable=True),
        sa.Column("cost", sa.Numeric(10, 6), nullable=False, server_default="0.000000"),
        sa.Column("publisher_earnings", sa.Numeric(10, 6), nullable=False, server_default="0.000000"),
        sa.Column("served_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ip_hash", sa.String(64), nullable=True),
        sa.Column("user_agent_hash", sa.String(64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ad_impressions_campaign_id", "ad_impressions", ["campaign_id"])
    op.create_index("ix_ad_impressions_slot_id", "ad_impressions", ["slot_id"])

    op.create_table(
        "ad_clicks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("impression_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("ad_impressions.id"), nullable=True),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=False),
        sa.Column("slot_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("ad_slots.id"), nullable=False),
        sa.Column("click_token", sa.String(255), nullable=False, unique=True),
        sa.Column("destination_url", sa.String(2048), nullable=False),
        sa.Column("cost", sa.Numeric(10, 6), nullable=False, server_default="0.000000"),
        sa.Column("publisher_earnings", sa.Numeric(10, 6), nullable=False, server_default="0.000000"),
        sa.Column("clicked_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ip_hash", sa.String(64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ad_clicks_campaign_id", "ad_clicks", ["campaign_id"])
    op.create_index("ix_ad_clicks_click_token", "ad_clicks", ["click_token"])

    op.create_table(
        "conversion_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=False),
        sa.Column("click_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("ad_clicks.id"), nullable=True),
        sa.Column("event_type", sa.String(100), nullable=False, server_default="conversion"),
        sa.Column("value", sa.Numeric(12, 2), nullable=True),
        sa.Column("conversion_data", sa.JSON(), nullable=True),
        sa.Column("converted_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_conversion_events_campaign_id", "conversion_events", ["campaign_id"])

    op.create_table(
        "budget_ledgers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=False),
        sa.Column("entry_type", sa.String(50), nullable=False),
        sa.Column("amount", sa.Numeric(12, 6), nullable=False),
        sa.Column("reference_id", sa.String(255), nullable=True),
        sa.Column("description", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_budget_ledgers_campaign_id", "budget_ledgers", ["campaign_id"])

    op.create_table(
        "pacing_counters",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=False, unique=True),
        sa.Column("date_bucket", sa.String(20), nullable=False),
        sa.Column("impressions_today", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("clicks_today", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("spend_today", sa.Numeric(12, 6), nullable=False, server_default="0.000000"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    # ── Finance tables ─────────────────────────────────────────────────────

    op.create_table(
        "advertiser_invoices",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("workspaces.id"), nullable=False),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=True),
        sa.Column("invoice_number", sa.String(100), nullable=False, unique=True),
        sa.Column("gross_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("platform_fee", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
        sa.Column("ad_budget_allocated", sa.Numeric(12, 2), nullable=False),
        sa.Column(
            "status",
            sa.Enum("PENDING", "PAID", "VOID", name="invoicestatus"),
            nullable=False,
            server_default="PENDING",
        ),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_advertiser_invoices_workspace_id", "advertiser_invoices", ["workspace_id"])

    op.create_table(
        "publisher_payouts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("publisher_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("publisher_profiles.id"), nullable=False),
        sa.Column("period_start", sa.DateTime(timezone=True), nullable=False),
        sa.Column("period_end", sa.DateTime(timezone=True), nullable=False),
        sa.Column("gross_earnings", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
        sa.Column("platform_share", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
        sa.Column("publisher_share", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
        sa.Column("impressions_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("clicks_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_publisher_payouts_publisher_id", "publisher_payouts", ["publisher_id"])

    op.create_table(
        "spend_reservations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=False, unique=True),
        sa.Column("reserved_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("actual_spend", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
        sa.Column("released_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    # ── Moderation tables ──────────────────────────────────────────────────

    op.create_table(
        "moderation_reviews",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column(
            "item_type",
            sa.Enum("CAMPAIGN", "PUBLISHER", "CREATIVE", name="moderationitemtype"),
            nullable=False,
        ),
        sa.Column("item_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("reviewer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column(
            "decision",
            sa.Enum("PENDING", "APPROVED", "REJECTED", "NEEDS_REVISION", name="moderationdecision"),
            nullable=False,
            server_default="PENDING",
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_moderation_reviews_item_id", "moderation_reviews", ["item_id"])

    op.create_table(
        "policy_flags",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("item_type", sa.String(100), nullable=False),
        sa.Column("item_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("flag_type", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_resolved", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("resolved_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_policy_flags_item_id", "policy_flags", ["item_id"])

    op.create_table(
        "fraud_signals",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("live_campaigns.id"), nullable=True),
        sa.Column("slot_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("ad_slots.id"), nullable=True),
        sa.Column("signal_type", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("signal_data", sa.JSON(), nullable=True),
        sa.Column("is_reviewed", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("fraud_signals")
    op.drop_table("policy_flags")
    op.drop_table("moderation_reviews")
    op.drop_table("spend_reservations")
    op.drop_table("publisher_payouts")
    op.drop_table("advertiser_invoices")
    op.drop_table("pacing_counters")
    op.drop_table("budget_ledgers")
    op.drop_table("conversion_events")
    op.drop_table("ad_clicks")
    op.drop_table("ad_impressions")
    op.drop_table("delivery_rules")
    op.drop_table("live_campaigns")
    op.drop_table("ad_slots")
    op.drop_table("placements")
    op.drop_table("publisher_apps")
    op.drop_table("publisher_sites")
    op.drop_table("publisher_profiles")

    op.drop_column("users", "role")

    op.execute("DROP TYPE IF EXISTS userrole")
    op.execute("DROP TYPE IF EXISTS publisherstatus")
    op.execute("DROP TYPE IF EXISTS slotformat")
    op.execute("DROP TYPE IF EXISTS livecampaignstatus")
    op.execute("DROP TYPE IF EXISTS pricingmodel")
    op.execute("DROP TYPE IF EXISTS invoicestatus")
    op.execute("DROP TYPE IF EXISTS moderationdecision")
    op.execute("DROP TYPE IF EXISTS moderationitemtype")
