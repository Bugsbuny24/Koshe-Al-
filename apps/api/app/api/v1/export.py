import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, get_current_workspace
from app.models.user import User, Workspace
from app.schemas.export import ExportResponse
from app.services.generation_service import GenerationService
from app.services.export_service import ExportService

router = APIRouter(tags=["export"])


@router.get("/export/{ad_set_id}", response_model=ExportResponse)
async def export_ad_set(
    ad_set_id: uuid.UUID,
    format: str = Query(default="json", pattern="^(json|md|txt|csv)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_current_workspace),
):
    ad_set = await GenerationService.get_ad_set(db, ad_set_id, workspace.id)

    try:
        content = ExportService.export(ad_set, format)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return ExportResponse(
        ad_set_id=ad_set_id,
        format=format,
        content=content,
        created_at=datetime.now(timezone.utc),
    )
