"""Remove external platform integrations and migrate to ad formats

Revision ID: 0003
Revises: 0002
Create Date: 2024-01-03 00:00:00.000000

Drops the oauth_states, platform_connections tables and the platform enum.
Renames campaign_briefs.platforms -> ad_formats.
Replaces generated_ad_variants.platform (enum) -> ad_format (varchar).
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop external platform integration tables
    op.execute("DROP TABLE IF EXISTS oauth_states CASCADE")
    op.execute("DROP TABLE IF EXISTS platform_connections CASCADE")

    # Rename campaign_briefs.platforms -> ad_formats (JSON column, data preserved)
    op.execute(
        "ALTER TABLE campaign_briefs RENAME COLUMN platforms TO ad_formats"
    )

    # Replace generated_ad_variants.platform (enum) with ad_format (varchar)
    # Step 1: Add new string column
    op.add_column(
        "generated_ad_variants",
        sa.Column("ad_format", sa.String(50), nullable=True),
    )
    # Step 2: Migrate existing values (map old platform enum values to new format names)
    op.execute("""
        UPDATE generated_ad_variants
        SET ad_format = CASE
            WHEN platform::text = 'GOOGLE' THEN 'BANNER'
            WHEN platform::text = 'META' THEN 'NATIVE_CARD'
            WHEN platform::text = 'TIKTOK' THEN 'VIDEO'
            ELSE 'BANNER'
        END
    """)
    # Step 3: Set not null
    op.alter_column("generated_ad_variants", "ad_format", nullable=False)
    # Step 4: Drop old enum column
    op.drop_column("generated_ad_variants", "platform")

    # Drop the platform enum type
    op.execute("DROP TYPE IF EXISTS platform")


def downgrade() -> None:
    # This migration is intentionally not fully reversible.
    # Downgrade restores the column names but cannot recreate external platform tables
    # with original data.

    # Restore generated_ad_variants.platform column (as varchar to avoid re-creating the enum)
    op.add_column(
        "generated_ad_variants",
        sa.Column("platform", sa.String(50), nullable=True),
    )
    op.execute("""
        UPDATE generated_ad_variants SET platform = ad_format
    """)
    op.alter_column("generated_ad_variants", "platform", nullable=False)
    op.drop_column("generated_ad_variants", "ad_format")

    # Rename campaign_briefs.ad_formats -> platforms
    op.execute(
        "ALTER TABLE campaign_briefs RENAME COLUMN ad_formats TO platforms"
    )
