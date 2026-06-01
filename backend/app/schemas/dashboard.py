from pydantic import BaseModel
from typing import List, Dict

class LowStockProduct(BaseModel):
    id: int
    name: str
    sku: str
    quantity_in_stock: int

class TopSellingProduct(BaseModel):
    name: str
    total_sold: int

class DashboardResponse(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    total_revenue: float
    low_stock_products: List[LowStockProduct]
    out_of_stock_products: List[LowStockProduct]
    inventory_value: float
    recent_orders: List[dict]   # simplified
    order_status_breakdown: Dict[str, int]
    top_selling_products: List[TopSellingProduct]
    new_customers_this_month: int