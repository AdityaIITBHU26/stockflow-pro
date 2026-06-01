from sqlalchemy.orm import Session
from app.repositories.order_repo import OrderRepository
from app.repositories.product_repo import ProductRepository
from app.models.order import Order, OrderStatus
from app.schemas.order import OrderCreate
from app.exceptions import StockFlowException, NotFoundException, InsufficientStockException

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

    def create_order(self, order_in: OrderCreate) -> Order:
        # Validate stock and prepare items
        items_data = []
        total = 0
        for item in order_in.items:
            product = self.product_repo.get_by_id(item.product_id)
            if not product:
                raise NotFoundException(f"Product with ID {item.product_id} not found")
            if product.quantity_in_stock < item.quantity:
                raise InsufficientStockException(
                    f"Insufficient stock for {product.name} (available: {product.quantity_in_stock})"
                )
            # Deduct stock
            product.quantity_in_stock -= item.quantity
            self.db.add(product)
            items_data.append({
                "product_id": product.id,
                "quantity": item.quantity,
                "unit_price": float(product.price),
            })
            total += float(product.price) * item.quantity

        # Create order
        order = Order(
            customer_id=order_in.customer_id,
            status=OrderStatus.PENDING,
            total_amount=total,
        )
        self.db.add(order)
        self.db.flush()  # get order.id

        from app.models.order_item import OrderItem
        for data in items_data:
            order_item = OrderItem(order_id=order.id, **data)
            self.db.add(order_item)

        self.db.commit()
        # Refresh to load relationships
        self.db.refresh(order)
        return order

    def update_status(self, order_id: int, new_status: OrderStatus) -> Order:
        order = self.get_order(order_id)
        if order.status in [OrderStatus.CANCELLED, OrderStatus.COMPLETED]:
            raise StockFlowException("Cannot change status of a cancelled or completed order")
        return self.order_repo.update_status(order, new_status)

    def cancel_order(self, order_id: int) -> Order:
        order = self.get_order(order_id)
        if order.status in [OrderStatus.CANCELLED, OrderStatus.COMPLETED]:
            raise StockFlowException("Cannot cancel this order")

        # Restore stock
        for item in order.items:
            product = self.product_repo.get_by_id(item.product_id)
            if product:
                product.quantity_in_stock += item.quantity
                self.db.add(product)
        order.status = OrderStatus.CANCELLED
        self.db.add(order)

        self.db.commit()
        self.db.refresh(order)
        return order
