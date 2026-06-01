from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List, Tuple
from app.models.product import Product
from app.repositories.base import BaseRepository

class ProductRepository(BaseRepository):
    def get_by_id(self, product_id: int) -> Optional[Product]:
        return self.db.query(Product).filter(Product.id == product_id).first()

    def get_by_sku(self, sku: str) -> Optional[Product]:
        return self.db.query(Product).filter(Product.sku == sku).first()

    def get_all(self, skip: int = 0, limit: int = 100, search: str = None,
                category: str = None, sort_by: str = "id", sort_order: str = "asc") -> Tuple[List[Product], int]:
        q = self.db.query(Product)
        if search:
            q = q.filter(
                (Product.name.ilike(f"%{search}%")) |
                (Product.sku.ilike(f"%{search}%"))
            )
        if category:
            q = q.filter(Product.category == category)

        # sorting
        sort_column = getattr(Product, sort_by, Product.id)
        if sort_order == "desc":
            q = q.order_by(sort_column.desc())
        else:
            q = q.order_by(sort_column.asc())

        total = q.count()
        products = q.offset(skip).limit(limit).all()
        return products, total

    def create(self, product_data: dict) -> Product:
        product = Product(**product_data)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update(self, product: Product, update_data: dict) -> Product:
        for key, value in update_data.items():
            setattr(product, key, value)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete(self, product: Product):
        self.db.delete(product)
        self.db.commit()

    def get_low_stock(self, threshold: int = 5) -> List[Product]:
        return self.db.query(Product).filter(Product.quantity_in_stock <= threshold, Product.quantity_in_stock > 0).all()

    def get_out_of_stock(self) -> List[Product]:
        return self.db.query(Product).filter(Product.quantity_in_stock == 0).all()

    def total_inventory_value(self) -> float:
        result = self.db.query(func.sum(Product.price * Product.quantity_in_stock)).scalar()
        return float(result or 0)