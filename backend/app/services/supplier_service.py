from sqlalchemy.orm import Session
from app.repositories.supplier_repo import SupplierRepository
from app.schemas.supplier import SupplierCreate
from app.exceptions import NotFoundException

class SupplierService:
    def __init__(self, db: Session):
        self.repo = SupplierRepository(db)

    def get_suppliers(self):
        return self.repo.get_all()

    def get_supplier(self, supplier_id: int):
        supplier = self.repo.get_by_id(supplier_id)
        if not supplier:
            raise NotFoundException("Supplier not found")
        return supplier

    def create_supplier(self, supplier_in: SupplierCreate):
        return self.repo.create(supplier_in.model_dump())

    def update_supplier(self, supplier_id: int, supplier_in: SupplierCreate):
        supplier = self.repo.get_by_id(supplier_id)
        if not supplier:
            raise NotFoundException("Supplier not found")
        return self.repo.update(supplier, supplier_in.model_dump(exclude_unset=True))

    def delete_supplier(self, supplier_id: int):
        supplier = self.repo.get_by_id(supplier_id)
        if not supplier:
            raise NotFoundException("Supplier not found")
        self.repo.delete(supplier)
