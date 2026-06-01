from sqlalchemy.orm import Session
from typing import Optional, List, Tuple
from app.models.customer import Customer
from app.repositories.base import BaseRepository

class CustomerRepository(BaseRepository):
    def get_by_id(self, customer_id: int) -> Optional[Customer]:
        return self.db.query(Customer).filter(Customer.id == customer_id).first()

    def get_by_email(self, email: str) -> Optional[Customer]:
        return self.db.query(Customer).filter(Customer.email == email).first()

    def get_all(self, skip: int = 0, limit: int = 100, search: str = None,
                sort_by: str = "id", sort_order: str = "asc") -> Tuple[List[Customer], int]:
        q = self.db.query(Customer)
        if search:
            q = q.filter(
                (Customer.full_name.ilike(f"%{search}%")) |
                (Customer.email.ilike(f"%{search}%"))
            )
        sort_column = getattr(Customer, sort_by, Customer.id)
        if sort_order == "desc":
            q = q.order_by(sort_column.desc())
        else:
            q = q.order_by(sort_column.asc())
        total = q.count()
        customers = q.offset(skip).limit(limit).all()
        return customers, total

    def create(self, customer_data: dict) -> Customer:
        customer = Customer(**customer_data)
        self.db.add(customer)
        self.db.commit()
        self.db.refresh(customer)
        return customer

    def delete(self, customer: Customer):
        self.db.delete(customer)
        self.db.commit()

    def count_new_this_month(self) -> int:
        from sqlalchemy import func, extract
        from datetime import datetime
        now = datetime.utcnow()
        return self.db.query(Customer).filter(
            extract('month', Customer.registration_date) == now.month,
            extract('year', Customer.registration_date) == now.year,
        ).count()