from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, get_current_workspace
from app.models.user import User, Workspace
from app.models.campaign import Platform
from app.schemas.integration import IntegrationStatus, AllIntegrationsStatus
from app.services.integration_service import IntegrationService

router = APIRouter(prefix="/integrations", tags=["integrations"])


@router.get("/status", response_model=AllIntegrationsStatus)
async def get_integration_status(
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    statuses = IntegrationService.get_all_statuses()
    return AllIntegrationsStatus(integrations=[IntegrationStatus(**s) for s in statuses])


@router.post("/{platform}/connect")
async def connect_platform(
    platform: str,
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    try:
        p = Platform(platform.upper())
    except ValueError:
        return {"message": "Unknown platform", "available": False}

    if not IntegrationService.is_platform_enabled(p):
        return {"message": "Integration coming soon", "available": False, "platform": p.value}

    return {"message": "Integration available but OAuth flow not yet implemented", "available": True, "platform": p.value}


@router.get("/{platform}/callback")
async def platform_callback(
    platform: str,
    state: str | None = None,
    code: str | None = None,
):
    try:
        p = Platform(platform.upper())
    except ValueError:
        return {"message": "Unknown platform", "available": False}

    if not IntegrationService.is_platform_enabled(p):
        return {"message": "Integration coming soon", "available": False, "platform": p.value}

    return {"message": "OAuth callback not yet implemented", "available": True, "platform": p.value}
