"""Add AI modules: ai_optimization_logs table, severity column on fraud_signals.

Revision ID: 0006
Revises: 0004
Create Date: 2024-01-06 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0006"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── ai_optimization_logs ───────────────────────────────────────────────
    op.create_table(
        "ai_optimization_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "campaign_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("campaigns.id"),
            nullable=True,
        ),
        sa.Column(
            "live_campaign_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("live_campaigns.id"),
            nullable=True,
        ),
        sa.Column("action", sa.String(50), nullable=False),
        sa.Column("bid_adjustment_pct", sa.Numeric(6, 2), nullable=True),
        sa.Column("budget_adjustment_pct", sa.Numeric(6, 2), nullable=True),
        sa.Column("reasoning", sa.Text(), nullable=True),
        sa.Column("gemini_raw_response", postgresql.JSONB(), nullable=True),
    )
    op.create_index("ix_ai_optimization_logs_campaign_id", "ai_optimization_logs", ["campaign_id"])
    op.create_index("ix_ai_optimization_logs_live_campaign_id", "ai_optimization_logs", ["live_campaign_id"])

    # ── fraud_signals: add severity column ────────────────────────────────
    op.add_column(
        "fraud_signals",
        sa.Column(
            "severity",
            sa.Integer(),
            nullable=False,
            server_default="5",
        ),
    )


def downgrade() -> None:
    op.drop_column("fraud_signals", "severity")
    op.drop_index("ix_ai_optimization_logs_live_campaign_id", table_name="ai_optimization_logs")
    op.drop_index("ix_ai_optimization_logs_campaign_id", table_name="ai_optimization_logs")
    op.drop_table("ai_optimization_logs")
