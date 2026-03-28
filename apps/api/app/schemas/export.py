import uuid
from datetime import datetime
from pydantic import BaseModel


class ExportResponse(BaseModel):
    ad_set_id: uuid.UUID
    format: str
    content: str
    created_at: datetime
