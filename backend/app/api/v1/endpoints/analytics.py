from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from datetime import datetime, timedelta
import numpy as np
import csv
from io import StringIO

router = APIRouter()

@router.get("/forecast/{product_id}")
def product_forecast(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    ninety_days_ago = datetime.utcnow() - timedelta(days=90)
    sales = db.query(OrderItem).join(Order).filter(
        OrderItem.product_id == product_id,
        Order.created_at >= ninety_days_ago
    ).all()
    daily_qty = {}
    for item in sales:
        date = item.order.created_at.date()
        daily_qty[date] = daily_qty.get(date, 0) + item.quantity
    dates = sorted(daily_qty.keys())
    qty_values = [daily_qty[d] for d in dates]
    if len(dates) < 2:
        return {"forecast": "Not enough data"}
    x = np.arange(len(qty_values))
    coeffs = np.polyfit(x, qty_values, 1)
    if coeffs[0] <= 0:
        return {"forecast": "Stock not depleting"}
    current_stock = product.quantity_in_stock
    days_until_out = int(current_stock / coeffs[0])
    out_date = datetime.utcnow().date() + timedelta(days=days_until_out)
    return {"days_until_out": days_until_out, "out_date": out_date.isoformat()}

@router.get("/export/orders")
def export_orders_csv(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Order ID", "Customer", "Status", "Total", "Date"])
    for order in orders:
        writer.writerow([order.id, order.customer.full_name if order.customer else "", order.status.value, float(order.total_amount), order.created_at])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=orders.csv"})
