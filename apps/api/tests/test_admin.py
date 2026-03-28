"""Tests for admin APIs."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_admin_overview_requires_auth(client: AsyncClient):
    resp = await client.get("/api/v1/admin/overview")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_admin_overview_requires_admin_role(auth_client: AsyncClient):
    """Regular advertiser should get 403 on admin endpoints."""
    resp = await auth_client.get("/api/v1/admin/overview")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_admin_list_campaigns_requires_admin(auth_client: AsyncClient):
    resp = await auth_client.get("/api/v1/admin/campaigns")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_admin_list_publishers_requires_admin(auth_client: AsyncClient):
    resp = await auth_client.get("/api/v1/admin/publishers")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_admin_moderation_queue_requires_admin(auth_client: AsyncClient):
    resp = await auth_client.get("/api/v1/admin/moderation")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_admin_finance_requires_admin(auth_client: AsyncClient):
    resp = await auth_client.get("/api/v1/admin/finance")
    assert resp.status_code == 403
