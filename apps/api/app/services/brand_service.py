import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.brand import Brand, Product, Audience
from app.schemas.brand import BrandCreate, BrandUpdate, ProductCreate, ProductUpdate, AudienceCreate, AudienceUpdate


class BrandService:
    @staticmethod
    async def get_brands(db: AsyncSession, workspace_id: uuid.UUID) -> List[Brand]:
        result = await db.execute(select(Brand).where(Brand.workspace_id == workspace_id))
        return list(result.scalars().all())

    @staticmethod
    async def get_brand(db: AsyncSession, brand_id: uuid.UUID, workspace_id: uuid.UUID) -> Brand:
        result = await db.execute(
            select(Brand).where(Brand.id == brand_id, Brand.workspace_id == workspace_id)
        )
        brand = result.scalar_one_or_none()
        if not brand:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")
        return brand

    @staticmethod
    async def create_brand(db: AsyncSession, data: BrandCreate, workspace_id: uuid.UUID) -> Brand:
        brand = Brand(**data.model_dump(), workspace_id=workspace_id)
        db.add(brand)
        await db.flush()
        await db.refresh(brand)
        return brand

    @staticmethod
    async def update_brand(db: AsyncSession, brand_id: uuid.UUID, data: BrandUpdate, workspace_id: uuid.UUID) -> Brand:
        brand = await BrandService.get_brand(db, brand_id, workspace_id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(brand, key, value)
        await db.flush()
        await db.refresh(brand)
        return brand

    @staticmethod
    async def delete_brand(db: AsyncSession, brand_id: uuid.UUID, workspace_id: uuid.UUID) -> None:
        brand = await BrandService.get_brand(db, brand_id, workspace_id)
        await db.delete(brand)


class ProductService:
    @staticmethod
    async def get_products(db: AsyncSession, workspace_id: uuid.UUID, brand_id: Optional[uuid.UUID] = None) -> List[Product]:
        query = select(Product).join(Brand).where(Brand.workspace_id == workspace_id)
        if brand_id:
            query = query.where(Product.brand_id == brand_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_product(db: AsyncSession, product_id: uuid.UUID, workspace_id: uuid.UUID) -> Product:
        result = await db.execute(
            select(Product).join(Brand).where(Product.id == product_id, Brand.workspace_id == workspace_id)
        )
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return product

    @staticmethod
    async def create_product(db: AsyncSession, data: ProductCreate, workspace_id: uuid.UUID) -> Product:
        # Verify brand belongs to workspace
        result = await db.execute(
            select(Brand).where(Brand.id == data.brand_id, Brand.workspace_id == workspace_id)
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")
        product = Product(**data.model_dump())
        db.add(product)
        await db.flush()
        await db.refresh(product)
        return product

    @staticmethod
    async def update_product(db: AsyncSession, product_id: uuid.UUID, data: ProductUpdate, workspace_id: uuid.UUID) -> Product:
        product = await ProductService.get_product(db, product_id, workspace_id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(product, key, value)
        await db.flush()
        await db.refresh(product)
        return product

    @staticmethod
    async def delete_product(db: AsyncSession, product_id: uuid.UUID, workspace_id: uuid.UUID) -> None:
        product = await ProductService.get_product(db, product_id, workspace_id)
        await db.delete(product)


class AudienceService:
    @staticmethod
    async def get_audiences(db: AsyncSession, workspace_id: uuid.UUID) -> List[Audience]:
        result = await db.execute(select(Audience).where(Audience.workspace_id == workspace_id))
        return list(result.scalars().all())

    @staticmethod
    async def get_audience(db: AsyncSession, audience_id: uuid.UUID, workspace_id: uuid.UUID) -> Audience:
        result = await db.execute(
            select(Audience).where(Audience.id == audience_id, Audience.workspace_id == workspace_id)
        )
        audience = result.scalar_one_or_none()
        if not audience:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audience not found")
        return audience

    @staticmethod
    async def create_audience(db: AsyncSession, data: AudienceCreate, workspace_id: uuid.UUID) -> Audience:
        audience = Audience(**data.model_dump(), workspace_id=workspace_id)
        db.add(audience)
        await db.flush()
        await db.refresh(audience)
        return audience

    @staticmethod
    async def update_audience(db: AsyncSession, audience_id: uuid.UUID, data: AudienceUpdate, workspace_id: uuid.UUID) -> Audience:
        audience = await AudienceService.get_audience(db, audience_id, workspace_id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(audience, key, value)
        await db.flush()
        await db.refresh(audience)
        return audience

    @staticmethod
    async def delete_audience(db: AsyncSession, audience_id: uuid.UUID, workspace_id: uuid.UUID) -> None:
        audience = await AudienceService.get_audience(db, audience_id, workspace_id)
        await db.delete(audience)
