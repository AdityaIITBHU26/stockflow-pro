from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import List, Optional
from app.models.order import OrderStatus

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

    @validator('items')
    def items_not_empty(cls, v):
        if not v:
            raise ValueError('Order must have at least one item')
        return v

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    status: OrderStatus
    total_amount: float
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
class OrderStatusUpdate(BaseModel):
    status: OrderStatus
