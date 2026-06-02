from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_db
from sqlalchemy.orm import Session
from app.schemas.supplier import SupplierCreate, SupplierResponse
from app.services.supplier_service import SupplierService
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=list[SupplierResponse])
def list_suppliers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = SupplierService(db)
    return service.get_suppliers()

@router.post("/", response_model=SupplierResponse, status_code=201)
def create_supplier(supplier_in: SupplierCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = SupplierService(db)
    return service.create_supplier(supplier_in)

@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(supplier_id: int, supplier_in: SupplierCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = SupplierService(db)
    return service.update_supplier(supplier_id, supplier_in)

@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = SupplierService(db)
    service.delete_supplier(supplier_id)
    return {"success": True, "message": "Supplier deleted"}
