import uuid
from typing import AsyncGenerator
from fastapi import Depends, HTTPException, Cookie, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import structlog

from app.database import AsyncSessionLocal
from app.models.user import User, Workspace, WorkspaceMember
from app.services.auth_service import decode_access_token

logger = structlog.get_logger()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def get_current_user(
    access_token: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not access_token:
        raise credentials_exception

    payload = decode_access_token(access_token)
    if not payload:
        raise credentials_exception

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise credentials_exception

    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise credentials_exception

    return user


async def get_current_workspace(
    access_token: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
) -> Workspace:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )

    if not access_token:
        raise credentials_exception

    payload = decode_access_token(access_token)
    if not payload:
        raise credentials_exception

    workspace_id_str = payload.get("workspace_id")
    if not workspace_id_str:
        raise credentials_exception

    try:
        workspace_id = uuid.UUID(workspace_id_str)
    except ValueError:
        raise credentials_exception

    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    workspace = result.scalar_one_or_none()

    if not workspace:
        raise credentials_exception

    return workspace


def rate_limiter(max_per_minute: int = 60):
    """Redis-based sliding window rate limiter (safe for multiple uvicorn workers).
    Falls back to allowing requests if Redis is unavailable."""
    import time
    import redis.asyncio as aioredis
    from app.config import settings

    # Shared connection pool across all requests for this limiter instance
    _pool: list = []

    def _get_redis():
        if not _pool:
            _pool.append(aioredis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=1,
                max_connections=10,
            ))
        return _pool[0]

    async def _rate_limit(current_user: User = Depends(get_current_user)):
        user_id = str(current_user.id)
        now = time.time()
        window_start = now - 60
        key = f"ratelimit:{user_id}"

        try:
            r = _get_redis()
            async with r.pipeline(transaction=True) as pipe:
                pipe.zremrangebyscore(key, "-inf", window_start)
                pipe.zadd(key, {str(now): now})
                pipe.zcard(key)
                pipe.expire(key, 120)
                results = await pipe.execute()
            count = results[2]
        except Exception:
            # Redis unavailable — fail open (allow request)
            return

        if count > max_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Max {max_per_minute} requests per minute.",
            )

    return _rate_limit
