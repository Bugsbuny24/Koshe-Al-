"""
Seed demo data for AdGenius Network.
Run: python seed.py

Demo credentials:
  Admin:      admin@adgenius.ai / admin1234
  Advertiser: advertiser@adgenius.ai / adv12345
  Publisher:  publisher@adgenius.ai / pub12345
"""
import asyncio
import sys
import os
import secrets
from decimal import Decimal

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from app.config import settings
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.brand import Brand, Product, Audience
from app.models.campaign import CampaignBrief, CampaignObjective, ToneOfVoice, AdFormat
from app.models.generation import GenerationJob, GeneratedAdSet, GeneratedAdVariant, JobStatus
from app.models.publisher import (
    PublisherProfile, PublisherSite, Placement, AdSlot, SlotFormat, PublisherStatus,
)
from app.models.delivery import (
    LiveCampaign, LiveCampaignStatus, PricingModel,
    AdImpression, AdClick, BudgetLedger, PacingCounter,
)
from app.models.finance import AdvertiserInvoice, InvoiceStatus
from app.services.auth_service import hash_password
from app.ai.mock_data import get_mock_output
from datetime import datetime, timezone
import uuid


async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with SessionLocal() as db:
        # Check if already seeded
        result = await db.execute(select(User).where(User.email == "admin@adgenius.ai"))
        if result.scalar_one_or_none():
            print("Demo data already seeded.")
            return

        print("Seeding AdGenius Network demo data...")

        # ── Admin user ──────────────────────────────────────────────────────
        admin_user = User(
            email="admin@adgenius.ai",
            hashed_password=hash_password("admin1234"),
            full_name="Super Admin",
            role=UserRole.SUPER_ADMIN,
            is_active=True,
        )
        db.add(admin_user)
        await db.flush()

        admin_workspace = Workspace(
            name="AdGenius HQ",
            slug="adgenius-hq",
            owner_id=admin_user.id,
        )
        db.add(admin_workspace)
        await db.flush()
        db.add(WorkspaceMember(workspace_id=admin_workspace.id, user_id=admin_user.id, role="owner"))

        # ── Advertiser user ─────────────────────────────────────────────────
        adv_user = User(
            email="advertiser@adgenius.ai",
            hashed_password=hash_password("adv12345"),
            full_name="Alex Advertiser",
            role=UserRole.ADVERTISER,
            is_active=True,
        )
        db.add(adv_user)
        await db.flush()

        adv_workspace = Workspace(
            name="TechCorp Workspace",
            slug="techcorp-workspace",
            owner_id=adv_user.id,
        )
        db.add(adv_workspace)
        await db.flush()
        db.add(WorkspaceMember(workspace_id=adv_workspace.id, user_id=adv_user.id, role="owner"))

        # ── Publisher user ──────────────────────────────────────────────────
        pub_user = User(
            email="publisher@adgenius.ai",
            hashed_password=hash_password("pub12345"),
            full_name="Paula Publisher",
            role=UserRole.PUBLISHER,
            is_active=True,
        )
        db.add(pub_user)
        await db.flush()

        pub_workspace = Workspace(
            name="MediaHub Workspace",
            slug="mediahub-workspace",
            owner_id=pub_user.id,
        )
        db.add(pub_workspace)
        await db.flush()
        db.add(WorkspaceMember(workspace_id=pub_workspace.id, user_id=pub_user.id, role="owner"))

        # ── Advertiser: Brand, Product, Audience ────────────────────────────
        brand = Brand(
            workspace_id=adv_workspace.id,
            name="TechCorp",
            description="A leading technology company building innovative SaaS products for modern teams.",
            website_url="https://techcorp.example.com",
            logo_url="https://techcorp.example.com/logo.png",
        )
        db.add(brand)
        await db.flush()

        product = Product(
            brand_id=brand.id,
            name="TechCorp Pro",
            description="The all-in-one productivity suite for growing businesses. AI-powered, easy to use.",
            price_point="$49/month",
            category="SaaS / Productivity",
        )
        db.add(product)
        await db.flush()

        audience = Audience(
            workspace_id=adv_workspace.id,
            name="Young Professionals 25-35",
            age_range="25-35",
            gender="All",
            interests=["technology", "productivity", "startup culture", "business growth"],
            locations=["United States", "United Kingdom", "Canada"],
            languages=["English"],
        )
        db.add(audience)
        await db.flush()

        # ── Campaign brief ──────────────────────────────────────────────────
        brief = CampaignBrief(
            workspace_id=adv_workspace.id,
            brand_id=brand.id,
            product_id=product.id,
            audience_id=audience.id,
            name="TechCorp Pro - Q1 Launch Campaign",
            product_description="TechCorp Pro is an AI-powered productivity suite that helps teams collaborate, automate workflows, and ship faster. Trusted by 10,000+ companies.",
            website_url="https://techcorp.example.com/pro",
            country_region="United States",
            language="English",
            objective=CampaignObjective.LEADS,
            tone=ToneOfVoice.PROFESSIONAL,
            ad_formats=[AdFormat.BANNER.value, AdFormat.NATIVE_CARD.value],
            offer="Start free for 30 days, no credit card required",
            budget_range="$5,000 - $10,000/month",
            landing_page_angle="Free trial with instant value",
            cta_preference="Start Free Trial",
            special_notes="Emphasize AI features and time-saving benefits.",
        )
        db.add(brief)
        await db.flush()

        # ── AI generation job & ad set ──────────────────────────────────────
        job = GenerationJob(
            workspace_id=adv_workspace.id,
            campaign_brief_id=brief.id,
            status=JobStatus.COMPLETED,
            started_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc),
        )
        db.add(job)
        await db.flush()

        mock_output = get_mock_output(brief)
        raw_json = mock_output.model_dump(exclude_none=True)

        ad_set = GeneratedAdSet(
            generation_job_id=job.id,
            campaign_brief_id=brief.id,
            raw_json=raw_json,
        )
        db.add(ad_set)
        await db.flush()

        # Create a few variants
        if mock_output.banner_ads:
            b = mock_output.banner_ads
            db.add(GeneratedAdVariant(
                ad_set_id=ad_set.id,
                ad_format=AdFormat.BANNER.value,
                variant_type="full_set",
                content=b.model_dump(),
                is_favorite=True,
            ))
        if mock_output.native_card_ads:
            n = mock_output.native_card_ads
            db.add(GeneratedAdVariant(
                ad_set_id=ad_set.id,
                ad_format=AdFormat.NATIVE_CARD.value,
                variant_type="full_set",
                content=n.model_dump(),
            ))

        # ── Publisher: profile, site, placement, slot ───────────────────────
        pub_profile = PublisherProfile(
            user_id=pub_user.id,
            company_name="MediaHub Digital",
            website_url="https://mediahub.example.com",
            contact_email="paula@mediahub.example.com",
            description="Premium digital media publisher serving technology and business audiences.",
            status=PublisherStatus.APPROVED,
            revenue_share_pct=Decimal("70.00"),
        )
        db.add(pub_profile)
        await db.flush()

        pub_site = PublisherSite(
            publisher_id=pub_profile.id,
            name="MediaHub Tech",
            domain="tech.mediahub.example.com",
            category="technology",
            description="Technology news and reviews for professionals.",
            is_active=True,
            allowed_categories=["technology", "software", "business"],
        )
        db.add(pub_site)
        await db.flush()

        placement = Placement(
            publisher_id=pub_profile.id,
            site_id=pub_site.id,
            name="Homepage Above Fold",
            page_path="/",
            context_tags=["homepage", "featured"],
            is_active=True,
        )
        db.add(placement)
        await db.flush()

        slot = AdSlot(
            placement_id=placement.id,
            name="Home Banner 728x90",
            format=SlotFormat.BANNER,
            width=728,
            height=90,
            category="technology",
            is_active=True,
        )
        db.add(slot)
        await db.flush()

        # ── Live campaign ───────────────────────────────────────────────────
        live_campaign = LiveCampaign(
            campaign_brief_id=brief.id,
            ad_set_id=ad_set.id,
            workspace_id=adv_workspace.id,
            name="TechCorp Pro - Q1 Live",
            status=LiveCampaignStatus.ACTIVE,
            pricing_model=PricingModel.CPM,
            cpm_rate=Decimal("5.00"),
            cpc_rate=Decimal("0.50"),
            total_budget=Decimal("1000.00"),
            spent_amount=Decimal("247.50"),
            daily_budget_cap=Decimal("50.00"),
            target_categories=["technology", "software", "business"],
            target_formats=["BANNER", "NATIVE_CARD"],
            is_approved=True,
            approved_at=datetime.now(timezone.utc),
            priority=7,
            frequency_cap_per_session=3,
        )
        db.add(live_campaign)
        await db.flush()

        # Budget ledger entry for reservation
        db.add(BudgetLedger(
            campaign_id=live_campaign.id,
            entry_type="reserve",
            amount=Decimal("1000.00"),
            description="Initial budget reservation",
        ))

        # Invoice
        db.add(AdvertiserInvoice(
            workspace_id=adv_workspace.id,
            campaign_id=live_campaign.id,
            invoice_number="INV-2024-001",
            gross_amount=Decimal("1200.00"),
            platform_fee=Decimal("200.00"),
            ad_budget_allocated=Decimal("1000.00"),
            status=InvoiceStatus.PAID,
            paid_at=datetime.now(timezone.utc),
        ))

        # ── Fake impressions and clicks ──────────────────────────────────────
        now = datetime.now(timezone.utc)
        for i in range(50):
            click_token = secrets.token_urlsafe(24)
            impression = AdImpression(
                campaign_id=live_campaign.id,
                slot_id=slot.id,
                ad_set_id=ad_set.id,
                session_id=f"session_{i % 10:03d}",
                site_url="https://tech.mediahub.example.com/",
                cost=Decimal("0.005000"),
                publisher_earnings=Decimal("0.003500"),
                served_at=now,
            )
            db.add(impression)
            await db.flush()

            if i % 5 == 0:  # 20% CTR on seed data
                click = AdClick(
                    impression_id=impression.id,
                    campaign_id=live_campaign.id,
                    slot_id=slot.id,
                    click_token=click_token,
                    destination_url="https://techcorp.example.com/pro",
                    cost=Decimal("0.000000"),  # CPM campaign, no CPC cost
                    publisher_earnings=Decimal("0.000000"),
                    clicked_at=now,
                )
                db.add(click)

        # Pacing counter
        db.add(PacingCounter(
            campaign_id=live_campaign.id,
            date_bucket=now.strftime("%Y-%m-%d"),
            impressions_today=50,
            clicks_today=10,
            spend_today=Decimal("0.250000"),
        ))

        await db.commit()

        print("✅ Admin user: admin@adgenius.ai / admin1234")
        print("✅ Advertiser user: advertiser@adgenius.ai / adv12345")
        print("✅ Publisher user: publisher@adgenius.ai / pub12345")
        print("✅ TechCorp brand, product, audience, campaign brief")
        print("✅ AI-generated ad set (mock)")
        print("✅ Publisher profile, site, placement, slot")
        print("✅ Active live campaign with 50 impressions and 10 clicks")
        print("✅ Advertiser invoice INV-2024-001")
        print("Seeding complete!")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
