from pydantic import BaseModel
from datetime import datetime


class DatasetResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    rows: int
    columns: int
    uploaded_at: datetime

    class Config:
        from_attributes = True