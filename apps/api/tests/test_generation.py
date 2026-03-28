import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_generation_job(auth_client: AsyncClient):
    # Create brand
    brand_resp = await auth_client.post("/api/v1/brands", json={
        "name": "Test Brand",
        "description": "A test brand",
        "website_url": "https://testbrand.com",
    })
    assert brand_resp.status_code == 201
    brand_id = brand_resp.json()["id"]

    # Create campaign brief
    brief_resp = await auth_client.post("/api/v1/campaign-briefs", json={
        "brand_id": brand_id,
        "name": "Test Campaign",
        "objective": "TRAFFIC",
        "tone": "CASUAL",
        "platforms": ["GOOGLE", "META"],
        "product_description": "A great product for testing",
    })
    assert brief_resp.status_code == 201
    brief_id = brief_resp.json()["id"]

    # Create generation job
    job_resp = await auth_client.post("/api/v1/generation/jobs", json={
        "campaign_brief_id": brief_id,
    })
    assert job_resp.status_code == 201
    job = job_resp.json()
    assert "id" in job
    assert job["campaign_brief_id"] == brief_id
    assert job["status"] in ("PENDING", "PROCESSING", "COMPLETED", "FAILED")


@pytest.mark.asyncio
async def test_get_generation_job_status(auth_client: AsyncClient):
    # Create brand and brief first
    brand_resp = await auth_client.post("/api/v1/brands", json={
        "name": "Status Test Brand",
        "description": "Brand for status test",
    })
    assert brand_resp.status_code == 201
    brand_id = brand_resp.json()["id"]

    brief_resp = await auth_client.post("/api/v1/campaign-briefs", json={
        "brand_id": brand_id,
        "name": "Status Test Campaign",
        "objective": "SALES",
        "tone": "PROFESSIONAL",
        "platforms": ["META"],
        "product_description": "SaaS tool",
    })
    assert brief_resp.status_code == 201
    brief_id = brief_resp.json()["id"]

    # Create job
    job_resp = await auth_client.post("/api/v1/generation/jobs", json={
        "campaign_brief_id": brief_id,
    })
    assert job_resp.status_code == 201
    job_id = job_resp.json()["id"]

    # Check status
    status_resp = await auth_client.get(f"/api/v1/generation/jobs/{job_id}")
    assert status_resp.status_code == 200
    job = status_resp.json()
    assert job["id"] == job_id
    assert job["status"] in ("PENDING", "PROCESSING", "COMPLETED", "FAILED")


@pytest.mark.asyncio
async def test_generation_job_invalid_brief(auth_client: AsyncClient):
    import uuid
    fake_id = str(uuid.uuid4())
    resp = await auth_client.post("/api/v1/generation/jobs", json={
        "campaign_brief_id": fake_id,
    })
    assert resp.status_code == 404
