"""AI-powered publisher slot to campaign matching service."""
import json
import structlog
import httpx
import redis.asyncio as aioredis
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.publisher import AdSlot, Placement
from app.models.adnet import Campaign

logger = structlog.get_logger()

_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
_GEMINI_MODEL = "gemini-1.5-flash"
_CACHE_TTL = 1800  # 30 minutes

# Module-level Redis connection pool, created lazily on first use
_redis_pool: aioredis.Redis | None = None


def _get_redis_client() -> aioredis.Redis:
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = aioredis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=2,
            max_connections=10,
        )
    return _redis_pool


async def _call_gemini_match(slot_context: dict, campaign_context: dict) -> dict | None:
    """Call Gemini API for slot/campaign match scoring. Returns parsed JSON or None."""
    if not settings.GEMINI_API_KEY:
        return None

    prompt = f"""You are an ad network matching system. Rate how well this ad slot matches this campaign.

Ad Slot:
- Format: {slot_context.get("slot_format", "unknown")}
- Category: {slot_context.get("slot_category", "unknown")}
- Context tags: {slot_context.get("context_tags", [])}

Campaign:
- Title: {campaign_context.get("campaign_title", "unknown")}
- Category: {campaign_context.get("campaign_category", "unknown")}
- Target countries: {campaign_context.get("target_countries", [])}
- Target devices: {campaign_context.get("target_devices", [])}

Return ONLY valid JSON with no markdown, no explanation:
{{"match_score": <float 0.0 to 1.0>, "reason": "<brief reason>"}}"""

    url = f"{_GEMINI_BASE_URL}/{_GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 256},
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()

        text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        if text.startswith("```"):
            text = text.split("```", 2)[1]
            if text.startswith("json"):
                text = text[4:]
        if text.endswith("```"):
            text = text.rsplit("```", 1)[0]
        return json.loads(text.strip())
    except Exception as e:
        logger.warning("Gemini match call failed", error=str(e))
        return None


async def score_slot_campaign_match(slot: AdSlot, campaign: Campaign, db: AsyncSession) -> float:
    """
    Score how well an AdSlot matches a Campaign using Gemini AI.

    Returns a float 0.0–1.0. Caches in Redis for 30 minutes.
    Falls back to 0.5 on error.
    """
    cache_key = f"match:{campaign.id}:{slot.id}"

    # Try cache first
    try:
        r = _get_redis_client()
        cached = await r.get(cache_key)
        if cached is not None:
            return float(cached)
    except Exception as e:
        logger.debug("Redis cache read failed for match score", error=str(e))

    # Fetch placement context_tags if available
    context_tags: list = []
    try:
        from sqlalchemy import select
        result = await db.execute(select(Placement).where(Placement.id == slot.placement_id))
        placement = result.scalar_one_or_none()
        if placement:
            context_tags = placement.context_tags or []
    except Exception:
        pass

    slot_context = {
        "slot_format": slot.format.value if slot.format else "unknown",
        "slot_category": slot.category,
        "context_tags": context_tags,
    }
    campaign_context = {
        "campaign_category": campaign.category,
        "target_countries": campaign.target_countries or [],
        "target_devices": campaign.target_devices or [],
        "campaign_title": campaign.title,
    }

    result_data = await _call_gemini_match(slot_context, campaign_context)

    match_score = 0.5  # default fallback
    if result_data and isinstance(result_data.get("match_score"), (int, float)):
        match_score = float(max(0.0, min(1.0, result_data["match_score"])))

    # Cache the result
    try:
        r = _get_redis_client()
        await r.setex(cache_key, _CACHE_TTL, str(match_score))
    except Exception as e:
        logger.debug("Redis cache write failed for match score", error=str(e))

    return match_score
