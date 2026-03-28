import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.models.campaign import AdFormat, CampaignObjective, ToneOfVoice


class CampaignBriefCreate(BaseModel):
    brand_id: uuid.UUID
    product_id: Optional[uuid.UUID] = None
    audience_id: Optional[uuid.UUID] = None
    name: str
    product_description: Optional[str] = None
    website_url: Optional[str] = None
    country_region: Optional[str] = None
    language: Optional[str] = None
    objective: CampaignObjective
    tone: ToneOfVoice
    ad_formats: List[AdFormat]
    offer: Optional[str] = None
    budget_range: Optional[str] = None
    landing_page_angle: Optional[str] = None
    cta_preference: Optional[str] = None
    special_notes: Optional[str] = None


class CampaignBriefUpdate(BaseModel):
    brand_id: Optional[uuid.UUID] = None
    product_id: Optional[uuid.UUID] = None
    audience_id: Optional[uuid.UUID] = None
    name: Optional[str] = None
    product_description: Optional[str] = None
    website_url: Optional[str] = None
    country_region: Optional[str] = None
    language: Optional[str] = None
    objective: Optional[CampaignObjective] = None
    tone: Optional[ToneOfVoice] = None
    ad_formats: Optional[List[AdFormat]] = None
    offer: Optional[str] = None
    budget_range: Optional[str] = None
    landing_page_angle: Optional[str] = None
    cta_preference: Optional[str] = None
    special_notes: Optional[str] = None


class CampaignBriefResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    workspace_id: uuid.UUID
    brand_id: uuid.UUID
    product_id: Optional[uuid.UUID] = None
    audience_id: Optional[uuid.UUID] = None
    name: str
    product_description: Optional[str] = None
    website_url: Optional[str] = None
    country_region: Optional[str] = None
    language: Optional[str] = None
    objective: CampaignObjective
    tone: ToneOfVoice
    ad_formats: List[str]
    offer: Optional[str] = None
    budget_range: Optional[str] = None
    landing_page_angle: Optional[str] = None
    cta_preference: Optional[str] = None
    special_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
