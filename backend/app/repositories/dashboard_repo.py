from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from sqlalchemy import func

class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def total_products(self) -> int:
        return self.db.query(Product).count()

    def total_customers(self) -> int:
        return self.db.query(Customer).count()

    def total_orders(self) -> int:
        return self.db.query(Order).count()

    def total_revenue(self) -> float:
        result = self.db.query(func.sum(Order.total_amount)).filter(Order.status != 'cancelled').scalar()
        return float(result or 0)