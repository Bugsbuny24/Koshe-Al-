"""Add adnet core tables: campaigns, ads, advertiser wallets, transactions, publisher earnings.
Also adds slot_key and revenue_share_percent to ad_slots, and is_verified to publisher_sites.

Revision ID: 0004
Revises: 0003
Create Date: 2024-01-04 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

_CREATIVE_TYPE_VALUES = ("text", "image", "native", "banner")

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── creative_type enum ─────────────────────────────────────────────────
    creative_type_enum = postgresql.ENUM(*_CREATIVE_TYPE_VALUES, name="creative_type", create_type=False)
    creative_type_enum.create(op.get_bind(), checkfirst=True)

    # ── campaigns ──────────────────────────────────────────────────────────
    op.create_table(
        "campaigns",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("user_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("landing_url", sa.String(2048), nullable=False),
        sa.Column(
            "status",
            sa.Enum("DRAFT", "ACTIVE", "PAUSED", "ENDED", name="campaignstatus"),
            nullable=False,
            server_default="DRAFT",
        ),
        sa.Column("total_budget", sa.Numeric(12, 2), nullable=False),
        sa.Column("daily_budget", sa.Numeric(12, 2), nullable=True),
        sa.Column("pricing_model", sa.String(10), nullable=False),
        sa.Column("bid_amount", sa.Numeric(10, 4), nullable=False),
        sa.Column("start_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("end_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("target_countries", sa.JSON(), nullable=True),
        sa.Column("target_devices", sa.JSON(), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("spent_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("impressions_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("clicks_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_index("ix_campaigns_user_id", "campaigns", ["user_id"])

    # ── ads ────────────────────────────────────────────────────────────────
    op.create_table(
        "ads",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("campaign_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("campaigns.id"), nullable=False),
        sa.Column("headline", sa.String(255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("cta", sa.String(100), nullable=False),
        sa.Column("image_url", sa.String(2048), nullable=True),
        sa.Column("creative_type", sa.Enum(*_CREATIVE_TYPE_VALUES, name="creative_type", create_type=False), nullable=False, server_default="text"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )
    op.create_index("ix_ads_campaign_id", "ads", ["campaign_id"])

    # ── advertiser_wallets ─────────────────────────────────────────────────
    op.create_table(
        "advertiser_wallets",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("user_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, unique=True),
        sa.Column("balance", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("total_deposited", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("total_spent", sa.Numeric(12, 2), nullable=False, server_default="0"),
    )

    # ── advertiser_transactions ────────────────────────────────────────────
    op.create_table(
        "advertiser_transactions",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("wallet_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("advertiser_wallets.id"), nullable=False),
        sa.Column("campaign_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("campaigns.id"), nullable=True),
        sa.Column("tx_type", sa.String(50), nullable=False),
        sa.Column("amount", sa.Numeric(12, 6), nullable=False),
        sa.Column("description", sa.String(500), nullable=True),
        sa.Column("reference_id", sa.String(255), nullable=True),
    )
    op.create_index("ix_advertiser_transactions_wallet_id", "advertiser_transactions", ["wallet_id"])

    # ── publisher_earnings ─────────────────────────────────────────────────
    op.create_table(
        "publisher_earnings",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("publisher_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("publisher_profiles.id"), nullable=False),
        sa.Column("slot_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("ad_slots.id"), nullable=False),
        sa.Column("campaign_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("campaigns.id"), nullable=True),
        sa.Column("event_type", sa.String(20), nullable=False),
        sa.Column("amount", sa.Numeric(10, 6), nullable=False),
        sa.Column("reference_id", sa.String(255), nullable=True),
    )
    op.create_index("ix_publisher_earnings_publisher_id", "publisher_earnings", ["publisher_id"])

    # ── ad_slots: add slot_key and revenue_share_percent ──────────────────
    op.add_column(
        "ad_slots",
        sa.Column(
            "slot_key",
            sa.String(255),
            nullable=False,
            server_default=sa.text("gen_random_uuid()::text"),
        ),
    )
    op.create_unique_constraint("uq_ad_slots_slot_key", "ad_slots", ["slot_key"])
    op.create_index("ix_ad_slots_slot_key", "ad_slots", ["slot_key"])

    op.add_column(
        "ad_slots",
        sa.Column(
            "revenue_share_percent",
            sa.Numeric(5, 2),
            nullable=False,
            server_default="70.0",
        ),
    )

    # ── publisher_sites: add is_verified ──────────────────────────────────
    op.add_column(
        "publisher_sites",
        sa.Column(
            "is_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )


def downgrade() -> None:
    op.drop_column("publisher_sites", "is_verified")
    op.drop_index("ix_ad_slots_slot_key", table_name="ad_slots")
    op.drop_constraint("uq_ad_slots_slot_key", "ad_slots", type_="unique")
    op.drop_column("ad_slots", "revenue_share_percent")
    op.drop_column("ad_slots", "slot_key")

    op.drop_index("ix_publisher_earnings_publisher_id", table_name="publisher_earnings")
    op.drop_table("publisher_earnings")
    op.drop_index("ix_advertiser_transactions_wallet_id", table_name="advertiser_transactions")
    op.drop_table("advertiser_transactions")
    op.drop_table("advertiser_wallets")
    op.drop_index("ix_ads_campaign_id", table_name="ads")
    op.drop_table("ads")
    op.drop_index("ix_campaigns_user_id", table_name="campaigns")
    op.drop_table("campaigns")
    op.execute("DROP TYPE IF EXISTS campaignstatus")
    op.execute("DROP TYPE IF EXISTS creative_type")
