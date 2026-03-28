from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.brands import router as brands_router
from app.api.v1.products import router as products_router
from app.api.v1.audiences import router as audiences_router
from app.api.v1.campaigns import router as campaigns_router
from app.api.v1.generation import router as generation_router
from app.api.v1.export import router as export_router
from app.api.v1.integrations import router as integrations_router

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(health_router)
v1_router.include_router(auth_router)
v1_router.include_router(brands_router)
v1_router.include_router(products_router)
v1_router.include_router(audiences_router)
v1_router.include_router(campaigns_router)
v1_router.include_router(generation_router)
v1_router.include_router(export_router)
v1_router.include_router(integrations_router)
