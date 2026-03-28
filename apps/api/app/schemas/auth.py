import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class WorkspaceResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    name: str
    slug: str
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class UserResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    email: str
    full_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    workspace: WorkspaceResponse | None = None
