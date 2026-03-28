from typing import Generic, List, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    pages: int


class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
    extra: Optional[Any] = None
