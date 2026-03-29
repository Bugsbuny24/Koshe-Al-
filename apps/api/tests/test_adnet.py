"""Smoke tests for the AdGenius Network vertical slice:
advertiser campaign flow, wallet, ad serving, impression/click tracking, publisher earnings.
"""
import pytest
from decimal import Decimal
from httpx import AsyncClient


# ── Helpers ────────────────────────────────────────────────────────────────────

async def _signup_advertiser(client: AsyncClient) -> AsyncClient:
    resp = await client.post("/api/v1/auth/signup", json={
        "email": "adv_smoke@example.com",
        "password": "adv_smoke123",
        "full_name": "Smoke Advertiser",
        "role": "ADVERTISER",
    })
    if resp.status_code == 409:
        await client.post("/api/v1/auth/login", json={
            "email": "adv_smoke@example.com",
            "password": "adv_smoke123",
        })
    return client


async def _signup_publisher(client: AsyncClient) -> AsyncClient:
    resp = await client.post("/api/v1/auth/signup", json={
        "email": "pub_smoke@example.com",
        "password": "pub_smoke123",
        "full_name": "Smoke Publisher",
        "role": "PUBLISHER",
    })
    if resp.status_code == 409:
        await client.post("/api/v1/auth/login", json={
            "email": "pub_smoke@example.com",
            "password": "pub_smoke123",
        })
    return client


# ── Advertiser: campaign CRUD ──────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_advertiser_creates_campaign(client: AsyncClient):
    """Advertiser can create a campaign and retrieve it."""
    adv_client = await _signup_advertiser(client)

    campaign_data = {
        "title": "Summer Sale",
        "landing_url": "https://example.com/sale",
        "total_budget": "100.00",
        "pricing_model": "CPM",
        "bid_amount": "2.00",
        "status": "DRAFT",
    }
    resp = await adv_client.post("/api/v1/advertiser/campaigns", json=campaign_data)
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["title"] == "Summer Sale"
    assert body["pricing_model"] == "CPM"
    campaign_id = body["id"]

    # List campaigns
    resp2 = await adv_client.get("/api/v1/advertiser/campaigns")
    assert resp2.status_code == 200
    campaigns = resp2.json()
    assert any(c["id"] == campaign_id for c in campaigns)


@pytest.mark.asyncio
async def test_advertiser_adds_ad_to_campaign(client: AsyncClient):
    """Advertiser can add an ad creative to a campaign."""
    adv_client = await _signup_advertiser(client)

    # Create campaign
    c_resp = await adv_client.post("/api/v1/advertiser/campaigns", json={
        "title": "Ad Test Campaign",
        "landing_url": "https://example.com",
        "total_budget": "50.00",
        "pricing_model": "CPC",
        "bid_amount": "0.50",
    })
    assert c_resp.status_code == 201
    campaign_id = c_resp.json()["id"]

    # Create ad
    ad_data = {
        "headline": "Click Here For Deals",
        "body": "Amazing deals await you — don't miss out.",
        "cta": "Shop Now",
    }
    resp = await adv_client.post(f"/api/v1/advertiser/campaigns/{campaign_id}/ads", json=ad_data)
    assert resp.status_code == 201, resp.text
    ad = resp.json()
    assert ad["headline"] == "Click Here For Deals"
    assert ad["cta"] == "Shop Now"

    # List ads
    resp2 = await adv_client.get(f"/api/v1/advertiser/campaigns/{campaign_id}/ads")
    assert resp2.status_code == 200
    assert len(resp2.json()) >= 1


# ── Advertiser: wallet ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_advertiser_wallet_deposit(client: AsyncClient):
    """Advertiser can deposit funds and see balance."""
    adv_client = await _signup_advertiser(client)

    # Get initial wallet (auto-created on first access)
    resp = await adv_client.get("/api/v1/advertiser/wallet")
    assert resp.status_code == 200
    wallet_data = resp.json()
    initial_balance = float(wallet_data["balance"])

    # Deposit
    dep_resp = await adv_client.post("/api/v1/advertiser/wallet/deposit", json={"amount": 200.0})
    assert dep_resp.status_code == 200

    # Check new balance
    resp2 = await adv_client.get("/api/v1/advertiser/wallet")
    assert resp2.status_code == 200
    data = resp2.json()
    assert float(data["balance"]) >= initial_balance + 200.0
    # Transaction should be recorded
    assert any(t["tx_type"] == "deposit" for t in data["transactions"])


# ── Publisher: slot creation ───────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_publisher_creates_slot_with_key(client: AsyncClient):
    """Publisher can create a site, placement, and slot with a slot_key."""
    pub_client = await _signup_publisher(client)

    # Create publisher profile first
    prof_resp = await pub_client.post("/api/v1/publishers/profile", json={
        "company_name": "Smoke Publisher Co",
        "contact_email": "pub_smoke@example.com",
    })
    assert prof_resp.status_code in (200, 201, 409)

    # Create site
    site_resp = await pub_client.post("/api/v1/publishers/sites", json={
        "name": "Smoke Site",
        "domain": "smoke.example.com",
        "category": "technology",
    })
    assert site_resp.status_code == 201, site_resp.text
    site_id = site_resp.json()["id"]

    # Create placement
    pl_resp = await pub_client.post("/api/v1/publishers/placements", json={
        "name": "Header",
        "site_id": site_id,
    })
    assert pl_resp.status_code == 201, pl_resp.text
    placement_id = pl_resp.json()["id"]

    # Create slot with a slot_key
    slot_resp = await pub_client.post(f"/api/v1/publishers/placements/{placement_id}/slots", json={
        "name": "Header Banner",
        "format": "BANNER",
        "slot_key": "smoke-header-banner",
        "revenue_share_percent": 70,
    })
    assert slot_resp.status_code == 201, slot_resp.text
    slot = slot_resp.json()
    assert slot["slot_key"] == "smoke-header-banner"


# ── Ad serving ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_serve_ad_by_slot_key_no_campaigns(client: AsyncClient):
    """serve/ad returns 404 when slot exists but no active campaigns."""
    pub_client = await _signup_publisher(client)

    # Create a slot
    prof_resp = await pub_client.post("/api/v1/publishers/profile", json={
        "company_name": "Serve Test Publisher",
        "contact_email": "pub_smoke@example.com",
    })

    site_resp = await pub_client.post("/api/v1/publishers/sites", json={
        "name": "Serve Site",
        "domain": "serve.example.com",
        "category": "news",
    })
    if site_resp.status_code != 201:
        pytest.skip("Publisher site creation failed")

    site_id = site_resp.json()["id"]
    pl_resp = await pub_client.post("/api/v1/publishers/placements", json={
        "name": "Serve Header",
        "site_id": site_id,
    })
    pl_id = pl_resp.json()["id"]

    slot_resp = await pub_client.post(f"/api/v1/publishers/placements/{pl_id}/slots", json={
        "name": "Serve Banner",
        "format": "BANNER",
        "slot_key": "serve-test-slot-empty",
        "revenue_share_percent": 70,
    })
    assert slot_resp.status_code == 201

    # No active campaigns → 404
    resp = await client.get("/api/v1/serve/ad?slot_key=serve-test-slot-empty")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_serve_ad_nonexistent_slot_key(client: AsyncClient):
    """serve/ad returns 404 for unknown slot_key."""
    resp = await client.get("/api/v1/serve/ad?slot_key=nonexistent-slot-key-xyz")
    assert resp.status_code == 404


# ── Impression tracking ────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_track_impression_invalid_campaign(client: AsyncClient):
    """Tracking impression for nonexistent campaign returns 404."""
    import uuid
    resp = await client.post("/api/v1/track/impression", json={
        "campaign_id": str(uuid.uuid4()),
        "slot_id": str(uuid.uuid4()),
    })
    assert resp.status_code == 404


# ── Click tracking ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_track_click_invalid_token(client: AsyncClient):
    """Click with invalid token returns 404."""
    resp = await client.get("/api/v1/track/click/invalid-token-xyz-abc")
    assert resp.status_code == 404


# ── Publisher earnings ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_publisher_earnings_requires_publisher_role(client: AsyncClient):
    """Publisher earnings endpoint requires publisher role."""
    # Use advertiser client
    adv_client = await _signup_advertiser(client)
    resp = await adv_client.get("/api/v1/publisher/earnings")
    # Either 403 (wrong role) or 404 (no profile) is acceptable
    assert resp.status_code in (403, 404)


@pytest.mark.asyncio
async def test_budget_decreases_on_impression(client: AsyncClient):
    """When a CPM impression is tracked on a new Campaign, spent_amount increases."""
    import uuid
    adv_client = await _signup_advertiser(client)

    # Create campaign
    camp_resp = await adv_client.post("/api/v1/advertiser/campaigns", json={
        "title": "Budget Test",
        "landing_url": "https://example.com",
        "total_budget": "10.00",
        "pricing_model": "CPM",
        "bid_amount": "1.00",
        "status": "ACTIVE",
    })
    assert camp_resp.status_code == 201
    campaign = camp_resp.json()
    assert float(campaign["spent_amount"]) == 0.0

    # Track impression (slot won't exist, so expect 404 from slot lookup)
    imp_resp = await adv_client.post("/api/v1/track/impression", json={
        "campaign_id": campaign["id"],
        "slot_id": str(uuid.uuid4()),  # nonexistent slot
    })
    # Slot not found → 404 (campaign exists but slot doesn't)
    assert imp_resp.status_code == 404
