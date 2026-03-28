"""Tests for publisher APIs."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_publisher_profile(auth_client: AsyncClient):
    data = {
        "company_name": "MediaCorp Digital",
        "website_url": "https://mediacorp.example.com",
        "contact_email": "contact@mediacorp.example.com",
        "description": "A leading digital media publisher.",
    }
    resp = await auth_client.post("/api/v1/publishers/profile", json=data)
    # May be 201 or 409 if already exists from another test
    assert resp.status_code in (201, 409)
    if resp.status_code == 201:
        body = resp.json()
        assert body["company_name"] == "MediaCorp Digital"
        assert body["status"] == "PENDING"


@pytest.mark.asyncio
async def test_get_publisher_profile(auth_client: AsyncClient):
    # Create first if needed
    await auth_client.post("/api/v1/publishers/profile", json={
        "company_name": "MediaCorp Digital",
        "contact_email": "contact@mediacorp.example.com",
    })
    resp = await auth_client.get("/api/v1/publishers/profile")
    assert resp.status_code == 200
    body = resp.json()
    assert "company_name" in body


@pytest.mark.asyncio
async def test_create_site_requires_profile(auth_client: AsyncClient):
    """Creating a site returns profile data or 404 if not set up."""
    # Profile should exist from previous test
    resp = await auth_client.get("/api/v1/publishers/profile")
    if resp.status_code == 404:
        pytest.skip("No publisher profile exists")

    site_data = {
        "name": "Tech Blog",
        "domain": "techblog.example.com",
        "category": "technology",
    }
    resp = await auth_client.post("/api/v1/publishers/sites", json=site_data)
    assert resp.status_code == 201
    body = resp.json()
    assert body["name"] == "Tech Blog"
    assert body["domain"] == "techblog.example.com"


@pytest.mark.asyncio
async def test_list_sites(auth_client: AsyncClient):
    resp = await auth_client.get("/api/v1/publishers/sites")
    # Could be 200 with list or 404 if no profile
    assert resp.status_code in (200, 404)


@pytest.mark.asyncio
async def test_create_and_list_placements(auth_client: AsyncClient):
    """Create a placement and list it."""
    profile_resp = await auth_client.get("/api/v1/publishers/profile")
    if profile_resp.status_code == 404:
        pytest.skip("No publisher profile exists")

    placement_data = {
        "name": "Homepage Banner",
        "page_path": "/",
        "context_tags": ["homepage"],
    }
    resp = await auth_client.post("/api/v1/publishers/placements", json=placement_data)
    assert resp.status_code == 201
    placement_id = resp.json()["id"]

    list_resp = await auth_client.get("/api/v1/publishers/placements")
    assert list_resp.status_code == 200
    placements = list_resp.json()
    assert any(p["id"] == placement_id for p in placements)


@pytest.mark.asyncio
async def test_create_ad_slot(auth_client: AsyncClient):
    """Create an ad slot under a placement."""
    profile_resp = await auth_client.get("/api/v1/publishers/profile")
    if profile_resp.status_code == 404:
        pytest.skip("No publisher profile exists")

    # Get or create placement
    placements_resp = await auth_client.get("/api/v1/publishers/placements")
    if placements_resp.status_code != 200 or not placements_resp.json():
        create_resp = await auth_client.post("/api/v1/publishers/placements", json={
            "name": "Test Placement",
            "page_path": "/test",
        })
        assert create_resp.status_code == 201
        placement_id = create_resp.json()["id"]
    else:
        placement_id = placements_resp.json()[0]["id"]

    slot_data = {
        "name": "Banner 728x90",
        "format": "BANNER",
        "width": 728,
        "height": 90,
        "category": "technology",
    }
    resp = await auth_client.post(f"/api/v1/publishers/placements/{placement_id}/slots", json=slot_data)
    assert resp.status_code == 201
    body = resp.json()
    assert body["format"] == "BANNER"
    assert body["width"] == 728
