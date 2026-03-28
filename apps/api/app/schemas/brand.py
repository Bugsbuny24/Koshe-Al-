import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class BrandCreate(BaseModel):
    name: str
    description: Optional[str] = None
    website_url: Optional[str] = None
    logo_url: Optional[str] = None


class BrandUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    logo_url: Optional[str] = None


class BrandResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    workspace_id: uuid.UUID
    name: str
    description: Optional[str] = None
    website_url: Optional[str] = None
    logo_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ProductCreate(BaseModel):
    brand_id: uuid.UUID
    name: str
    description: Optional[str] = None
    price_point: Optional[str] = None
    category: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_point: Optional[str] = None
    category: Optional[str] = None


class ProductResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    brand_id: uuid.UUID
    name: str
    description: Optional[str] = None
    price_point: Optional[str] = None
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class AudienceCreate(BaseModel):
    name: str
    age_range: Optional[str] = None
    gender: Optional[str] = None
    interests: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    languages: Optional[List[str]] = None


class AudienceUpdate(BaseModel):
    name: Optional[str] = None
    age_range: Optional[str] = None
    gender: Optional[str] = None
    interests: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    languages: Optional[List[str]] = None


class AudienceResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    workspace_id: uuid.UUID
    name: str
    age_range: Optional[str] = None
    gender: Optional[str] = None
    interests: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime
