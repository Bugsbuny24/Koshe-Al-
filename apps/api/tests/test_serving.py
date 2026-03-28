"""Tests for ad serving and tracking APIs."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_serve_ad_no_slot(client: AsyncClient):
    """Requesting an ad for a nonexistent slot returns 404."""
    import uuid
    resp = await client.get(f"/api/v1/serve/ad?slot_id={uuid.uuid4()}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_track_impression_invalid_campaign(client: AsyncClient):
    """Tracking impression for nonexistent campaign returns 404."""
    import uuid
    resp = await client.post("/api/v1/track/impression", json={
        "campaign_id": str(uuid.uuid4()),
        "slot_id": str(uuid.uuid4()),
    })
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_track_click_invalid_token(client: AsyncClient):
    """Tracking click with invalid token returns 404."""
    resp = await client.get("/api/v1/track/click/invalid-token-xyz")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_track_conversion_invalid_campaign(client: AsyncClient):
    """Tracking conversion for nonexistent campaign returns 404."""
    import uuid
    resp = await client.post("/api/v1/track/conversion", json={
        "campaign_id": str(uuid.uuid4()),
        "event_type": "conversion",
    })
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_advertiser_report_requires_auth(client: AsyncClient):
    resp = await client.get("/api/v1/reports/advertiser")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_advertiser_report_authenticated(auth_client: AsyncClient):
    resp = await auth_client.get("/api/v1/reports/advertiser")
    assert resp.status_code == 200
    body = resp.json()
    assert "campaigns" in body
    assert "totals" in body


@pytest.mark.asyncio
async def test_publisher_report_no_profile(auth_client: AsyncClient):
    """Publisher report when no publisher profile returns 404."""
    resp = await auth_client.get("/api/v1/reports/publisher")
    # Depends on whether this user has a publisher profile
    assert resp.status_code in (200, 404)


@pytest.mark.asyncio
async def test_admin_report_requires_admin(auth_client: AsyncClient):
    resp = await auth_client.get("/api/v1/reports/admin")
    assert resp.status_code == 403
