import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_signup(client: AsyncClient):
    data = {
        "email": "signup_test@example.com",
        "password": "password123",
        "full_name": "Sign Up Test",
    }
    response = await client.post("/api/v1/auth/signup", json=data)
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == data["email"]
    assert body["full_name"] == data["full_name"]
    assert "id" in body
    assert "hashed_password" not in body
    assert "workspace" in body
    # Cookie should be set
    assert "access_token" in response.cookies


@pytest.mark.asyncio
async def test_signup_duplicate_email(client: AsyncClient):
    data = {
        "email": "duplicate@example.com",
        "password": "password123",
        "full_name": "Duplicate User",
    }
    r1 = await client.post("/api/v1/auth/signup", json=data)
    assert r1.status_code == 201

    r2 = await client.post("/api/v1/auth/signup", json=data)
    assert r2.status_code == 409


@pytest.mark.asyncio
async def test_login(client: AsyncClient):
    # First create user
    signup = await client.post("/api/v1/auth/signup", json={
        "email": "login_test@example.com",
        "password": "mypassword",
        "full_name": "Login Test",
    })
    # may already exist if fixture ran
    assert signup.status_code in (201, 409)

    response = await client.post("/api/v1/auth/login", json={
        "email": "login_test@example.com",
        "password": "mypassword",
    })
    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "login_test@example.com"
    assert "access_token" in response.cookies


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post("/api/v1/auth/signup", json={
        "email": "wrongpass@example.com",
        "password": "correctpass",
        "full_name": "Wrong Pass",
    })
    response = await client.post("/api/v1/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "wrongpass",
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me(auth_client: AsyncClient):
    response = await auth_client.get("/api/v1/auth/me")
    assert response.status_code == 200
    body = response.json()
    assert "email" in body
    assert "workspace" in body


@pytest.mark.asyncio
async def test_logout(auth_client: AsyncClient):
    response = await auth_client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Logged out successfully"


@pytest.mark.asyncio
async def test_me_unauthenticated(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
