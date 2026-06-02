from sqlalchemy.orm import Session
from app.repositories.order_repo import OrderRepository
from app.repositories.product_repo import ProductRepository
from app.models.order import Order, OrderStatus
from app.models.batch import Batch
from app.schemas.order import OrderCreate
from app.exceptions import StockFlowException, NotFoundException, InsufficientStockException
from app.services.audit_service import log_audit
from app.models.product import Product

class OrderService:
    def __init__(self, db: Session):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.product_repo = ProductRepository(db)

    def get_orders(self, **kwargs):
        return self.order_repo.get_all(**kwargs)

    def get_order(self, order_id: int) -> Order:
        order = self.order_repo.get_by_id(order_id)
        if not order:
            raise NotFoundException("Order not found")
        return order

    def create_order(self, order_in: OrderCreate, current_user_id: int = None) -> Order:
        items_data = []
        total = 0
        for item in order_in.items:
            product = self.product_repo.get_by_id(item.product_id)
            if not product:
                raise NotFoundException(f"Product {item.product_id} not found")
            if product.quantity_in_stock < item.quantity:
                raise InsufficientStockException(f"Insufficient stock for {product.name}")

            old_version = product.version

            # FIFO deduction from batches
            remaining = item.quantity
            batches = self.db.query(Batch).filter(
                Batch.product_id == product.id,
                Batch.quantity > 0
            ).order_by(Batch.expiry_date.asc()).all()

            for batch in batches:
                if remaining <= 0:
                    break
                deduct = min(batch.quantity, remaining)
                batch.quantity -= deduct
                remaining -= deduct
                self.db.add(batch)

            if remaining > 0:
                raise InsufficientStockException(f"Not enough batch stock for {product.name}")

            # Optimistic lock
            updated = self.db.query(Product).filter(
                Product.id == product.id,
                Product.version == old_version
            ).update(
                {"quantity_in_stock": Product.quantity_in_stock - item.quantity,
                 "version": old_version + 1},
                synchronize_session='fetch'
            )
            if updated == 0:
                raise StockFlowException("Concurrent modification detected, please retry")

            items_data.append({
                "product_id": product.id,
                "quantity": item.quantity,
                "unit_price": float(product.price),
            })
            total += float(product.price) * item.quantity

        order = Order(
            customer_id=order_in.customer_id,
            status=OrderStatus.PENDING,
            total_amount=total,
        )
        self.db.add(order)
        self.db.flush()

        from app.models.order_item import OrderItem
        for data in items_data:
            order_item = OrderItem(order_id=order.id, **data)
            self.db.add(order_item)

        self.db.commit()
        log_audit(self.db, current_user_id, "ORDER_CREATED", "orders", order.id, None, {"id": order.id, "total": total})
        return self.order_repo.get_by_id(order.id)

    def cancel_order(self, order_id: int, current_user_id: int = None):
        order = self.get_order(order_id)
        if order.status in [OrderStatus.CANCELLED, OrderStatus.COMPLETED]:
            raise StockFlowException("Cannot cancel this order")
        for item in order.items:
            product = self.product_repo.get_by_id(item.product_id)
            if product:
                product.quantity_in_stock += item.quantity
                self.db.add(product)
        order.status = OrderStatus.CANCELLED
        self.db.add(order)
        self.db.commit()
        log_audit(self.db, current_user_id, "ORDER_CANCELLED", "orders", order.id, None, {"status": "cancelled"})
        return self.order_repo.get_by_id(order.id)

    def update_status(self, order_id: int, new_status: OrderStatus, current_user_id: int = None):
        order = self.get_order(order_id)
        if order.status in [OrderStatus.CANCELLED, OrderStatus.COMPLETED]:
            raise StockFlowException("Cannot change status")
        old_status = order.status
        order.status = new_status
        self.db.add(order)
        self.db.commit()
        log_audit(self.db, current_user_id, "ORDER_STATUS_CHANGED", "orders", order.id, {"old": old_status.value}, {"new": new_status.value})
        return order
