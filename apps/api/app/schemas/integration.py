from typing import Optional
from pydantic import BaseModel
from app.models.campaign import Platform


class IntegrationStatus(BaseModel):
    platform: Platform
    connected: bool
    available: bool
    message: str


class ConnectRequest(BaseModel):
    platform: Platform


class AllIntegrationsStatus(BaseModel):
    integrations: list[IntegrationStatus]
