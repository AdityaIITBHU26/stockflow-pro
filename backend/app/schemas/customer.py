from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
from typing import Optional
import re

class CustomerBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    address: Optional[str] = None

    @validator('phone')
    def phone_must_be_valid(cls, v):
        if not re.match(r'^\+?1?\d{9,15}$', v):
            raise ValueError('Invalid phone number format')
        return v

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    registration_date: datetime

    class Config:
        from_attributes = True