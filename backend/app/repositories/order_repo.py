from sqlalchemy.orm import Session, joinedload
from typing import Optional, List, Tuple
from app.models.order import Order, OrderStatus
from app.repositories.base import BaseRepository

class OrderRepository(BaseRepository):
    def get_by_id(self, order_id: int) -> Optional[Order]:
        return self.db.query(Order).options(
            joinedload(Order.items), joinedload(Order.customer)
        ).filter(Order.id == order_id).first()

    def get_all(self, skip: int = 0, limit: int = 100, status: str = None,
                search: str = None, sort_by: str = "id", sort_order: str = "asc") -> Tuple[List[Order], int]:
        q = self.db.query(Order).options(joinedload(Order.items), joinedload(Order.customer))
        if status:
            try:
                q = q.filter(Order.status == OrderStatus(status))
            except ValueError:
                pass
        if search:
            # search by customer name or order id
            q = q.filter(
                (Order.customer.has(full_name.ilike(f"%{search}%"))) |
                (Order.id == search if search.isdigit() else False)
            )
        sort_column = getattr(Order, sort_by, Order.id)
        if sort_order == "desc":
            q = q.order_by(sort_column.desc())
        else:
            q = q.order_by(sort_column.asc())
        total = q.count()
        orders = q.offset(skip).limit(limit).all()
        return orders, total

    def create(self, order_data: dict) -> Order:
        # order_data is already the Order instance (constructed in service)
        order = Order(**order_data)
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        return order

    def update_status(self, order: Order, status: OrderStatus) -> Order:
        order.status = status
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        return order

    def delete(self, order: Order):
        self.db.delete(order)
        self.db.commit()

    def get_status_breakdown(self) -> dict:
        from sqlalchemy import func
        result = self.db.query(Order.status, func.count(Order.id)).group_by(Order.status).all()
        return {status: count for status, count in result}

    def get_recent_orders(self, limit: int = 10) -> List[Order]:
        return self.db.query(Order).options(joinedload(Order.items), joinedload(Order.customer)).order_by(Order.created_at.desc()).limit(limit).all()

    def top_selling_products(self, limit: int = 5):
        from sqlalchemy import func
        from app.models.order_item import OrderItem
        from app.models.product import Product
        return self.db.query(
            Product.name, func.sum(OrderItem.quantity).label("total_sold")
        ).join(OrderItem).group_by(Product.id).order_by(func.sum(OrderItem.quantity).desc()).limit(limit).all()