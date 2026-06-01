from pydantic import BaseModel
from typing import Optional, Any, List

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

class PaginatedResponse(ResponseModel):
    page: int
    limit: int
    total: int
    data: List[Any]