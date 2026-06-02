from pydantic import BaseModel

class SupplierBase(BaseModel):
    name: str
    contact_email: str | None = None
    phone: str | None = None
    address: str | None = None

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: int
    class Config:
        from_attributes = True
