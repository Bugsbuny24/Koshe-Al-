import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.models.campaign import AdFormat
from app.models.generation import JobStatus


class GenerationJobCreate(BaseModel):
    campaign_brief_id: uuid.UUID


class GenerationJobResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    workspace_id: uuid.UUID
    campaign_brief_id: uuid.UUID
    status: JobStatus
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class AdVariantResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    ad_set_id: uuid.UUID
    ad_format: str
    variant_type: str
    content: Dict[str, Any]
    is_favorite: bool
    created_at: datetime
    updated_at: datetime


class AdVariantUpdate(BaseModel):
    content: Optional[Dict[str, Any]] = None
    is_favorite: Optional[bool] = None


class GeneratedAdSetResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    generation_job_id: uuid.UUID
    campaign_brief_id: uuid.UUID
    raw_json: Dict[str, Any]
    variants: List[AdVariantResponse] = []
    created_at: datetime
    updated_at: datetime


class RegenerateFormatRequest(BaseModel):
    ad_format: AdFormat
