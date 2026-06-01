from sqlalchemy.orm import Session
from app.repositories.dashboard_repo import DashboardRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.customer_repo import CustomerRepository

class DashboardService:
    def __init__(self, db: Session):
        self.dashboard_repo = DashboardRepository(db)
        self.product_repo = ProductRepository(db)
        self.order_repo = OrderRepository(db)
        self.customer_repo = CustomerRepository(db)

    def get_summary(self) -> dict:
        low_stock = self.product_repo.get_low_stock(threshold=5)
        out_of_stock = self.product_repo.get_out_of_stock()
        recent_orders = self.order_repo.get_recent_orders(limit=10)
        status_breakdown = self.order_repo.get_status_breakdown()
        top_products = self.order_repo.top_selling_products(limit=5)

        # Simplify recent orders
        recent_orders_data = []
        for o in recent_orders:
            recent_orders_data.append({
                "id": o.id,
                "customer_name": o.customer.full_name if o.customer else "Unknown",
                "status": o.status.value,
                "total_amount": float(o.total_amount),
                "created_at": o.created_at.isoformat(),
            })

        low_stock_data = [{"id": p.id, "name": p.name, "sku": p.sku, "quantity_in_stock": p.quantity_in_stock} for p in low_stock]
        out_of_stock_data = [{"id": p.id, "name": p.name, "sku": p.sku, "quantity_in_stock": 0} for p in out_of_stock]

        return {
            "total_products": self.dashboard_repo.total_products(),
            "total_customers": self.dashboard_repo.total_customers(),
            "total_orders": self.dashboard_repo.total_orders(),
            "total_revenue": self.dashboard_repo.total_revenue(),
            "low_stock_products": low_stock_data,
            "out_of_stock_products": out_of_stock_data,
            "inventory_value": self.product_repo.total_inventory_value(),
            "recent_orders": recent_orders_data,
            "order_status_breakdown": status_breakdown,
            "top_selling_products": [{"name": name, "total_sold": qty} for name, qty in top_products],
            "new_customers_this_month": self.customer_repo.count_new_this_month(),
        }