from sqlalchemy.orm import Session
from app.models.supplier import Supplier

class SupplierRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Supplier).all()

    def get_by_id(self, supplier_id: int):
        return self.db.query(Supplier).filter(Supplier.id == supplier_id).first()

    def create(self, data: dict):
        supplier = Supplier(**data)
        self.db.add(supplier)
        self.db.commit()
        self.db.refresh(supplier)
        return supplier

    def update(self, supplier: Supplier, data: dict):
        for k, v in data.items():
            setattr(supplier, k, v)
        self.db.add(supplier)
        self.db.commit()
        self.db.refresh(supplier)
        return supplier

    def delete(self, supplier: Supplier):
        self.db.delete(supplier)
        self.db.commit()
