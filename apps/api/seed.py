"""
Seed demo data for AdGenius.
Run: python seed.py
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings
from app.models.user import User, Workspace, WorkspaceMember
from app.models.brand import Brand, Product, Audience
from app.models.campaign import CampaignBrief, CampaignObjective, ToneOfVoice, Platform
from app.models.generation import GenerationJob, GeneratedAdSet, GeneratedAdVariant, JobStatus
from app.services.auth_service import hash_password
from app.ai.mock_data import get_mock_output
from datetime import datetime, timezone
import uuid


async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with SessionLocal() as db:
        # Check if demo user exists
        from sqlalchemy import select
        result = await db.execute(select(User).where(User.email == "demo@adgenius.ai"))
        existing = result.scalar_one_or_none()
        if existing:
            print("Demo data already seeded.")
            return

        print("Seeding demo data...")

        # Create demo user
        user = User(
            email="demo@adgenius.ai",
            hashed_password=hash_password("demo1234"),
            full_name="Demo User",
            is_active=True,
        )
        db.add(user)
        await db.flush()

        # Create workspace
        workspace = Workspace(
            name="Demo Workspace",
            slug="demo-workspace",
            owner_id=user.id,
        )
        db.add(workspace)
        await db.flush()

        # Add user as owner member
        member = WorkspaceMember(
            workspace_id=workspace.id,
            user_id=user.id,
            role="owner",
        )
        db.add(member)

        # Create brand
        brand = Brand(
            workspace_id=workspace.id,
            name="TechCorp",
            description="A leading technology company building innovative SaaS products for modern teams.",
            website_url="https://techcorp.example.com",
            logo_url="https://techcorp.example.com/logo.png",
        )
        db.add(brand)
        await db.flush()

        # Create product
        product = Product(
            brand_id=brand.id,
            name="TechCorp Pro",
            description="The all-in-one productivity suite for growing businesses. AI-powered, easy to use.",
            price_point="$49/month",
            category="SaaS / Productivity",
        )
        db.add(product)
        await db.flush()

        # Create audience
        audience = Audience(
            workspace_id=workspace.id,
            name="Young Professionals 25-35",
            age_range="25-35",
            gender="All",
            interests=["technology", "productivity", "startup culture", "business growth"],
            locations=["United States", "United Kingdom", "Canada", "Australia"],
            languages=["English"],
        )
        db.add(audience)
        await db.flush()

        # Create campaign brief
        brief = CampaignBrief(
            workspace_id=workspace.id,
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
            platforms=[Platform.GOOGLE.value, Platform.META.value, Platform.TIKTOK.value],
            offer="Start free for 30 days, no credit card required",
            budget_range="$5,000 - $10,000/month",
            landing_page_angle="Free trial with instant value",
            cta_preference="Start Free Trial",
            special_notes="Emphasize AI features and time-saving benefits. Target decision-makers and team leads.",
        )
        db.add(brief)
        await db.flush()

        # Create generation job
        job = GenerationJob(
            workspace_id=workspace.id,
            campaign_brief_id=brief.id,
            status=JobStatus.COMPLETED,
            started_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc),
        )
        db.add(job)
        await db.flush()

        # Generate mock output
        mock_output = get_mock_output(brief)
        raw_json = mock_output.model_dump(exclude_none=True)

        # Create ad set
        ad_set = GeneratedAdSet(
            generation_job_id=job.id,
            campaign_brief_id=brief.id,
            raw_json=raw_json,
        )
        db.add(ad_set)
        await db.flush()

        # Create variants
        variants = []
        if mock_output.google_ads:
            g = mock_output.google_ads
            variants.append(GeneratedAdVariant(
                ad_set_id=ad_set.id,
                platform=Platform.GOOGLE,
                variant_type="full_set",
                content=g.model_dump(),
                is_favorite=True,
            ))
            for i, h in enumerate(g.headlines[:3]):
                variants.append(GeneratedAdVariant(
                    ad_set_id=ad_set.id,
                    platform=Platform.GOOGLE,
                    variant_type="headline",
                    content={"text": h, "index": i},
                ))

        if mock_output.meta_ads:
            m = mock_output.meta_ads
            variants.append(GeneratedAdVariant(
                ad_set_id=ad_set.id,
                platform=Platform.META,
                variant_type="full_set",
                content=m.model_dump(),
            ))
            for i, t in enumerate(m.primary_texts):
                variants.append(GeneratedAdVariant(
                    ad_set_id=ad_set.id,
                    platform=Platform.META,
                    variant_type="primary_text",
                    content={"text": t, "index": i},
                ))

        if mock_output.tiktok_ads:
            t = mock_output.tiktok_ads
            variants.append(GeneratedAdVariant(
                ad_set_id=ad_set.id,
                platform=Platform.TIKTOK,
                variant_type="full_set",
                content=t.model_dump(),
            ))

        for v in variants:
            db.add(v)

        await db.commit()
        print(f"✅ Demo user created: demo@adgenius.ai / demo1234")
        print(f"✅ Workspace: Demo Workspace")
        print(f"✅ Brand: TechCorp")
        print(f"✅ Product: TechCorp Pro")
        print(f"✅ Audience: Young Professionals 25-35")
        print(f"✅ Campaign Brief: TechCorp Pro - Q1 Launch Campaign")
        print(f"✅ Generated Ad Set with {len(variants)} variants")
        print("Seeding complete!")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
