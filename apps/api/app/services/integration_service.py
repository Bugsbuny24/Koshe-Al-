from app.models.campaign import Platform
from app.config import settings


class IntegrationService:
    FEATURE_FLAGS = {
        Platform.TIKTOK: "ENABLE_TIKTOK_CONNECT",
        Platform.META: "ENABLE_META_CONNECT",
        Platform.GOOGLE: "ENABLE_GOOGLE_CONNECT",
    }

    @classmethod
    def is_platform_enabled(cls, platform: Platform) -> bool:
        flag = cls.FEATURE_FLAGS.get(platform)
        if not flag:
            return False
        return getattr(settings, flag, False)

    @classmethod
    def get_all_statuses(cls) -> list[dict]:
        statuses = []
        for platform in Platform:
            enabled = cls.is_platform_enabled(platform)
            statuses.append({
                "platform": platform,
                "connected": False,
                "available": enabled,
                "message": "Integration available" if enabled else "Integration coming soon",
            })
        return statuses
