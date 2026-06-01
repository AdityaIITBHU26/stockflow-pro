from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services.product_service import ProductService
from app.services.customer_service import CustomerService
from app.services.order_service import OrderService
from app.services.dashboard_service import DashboardService

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(db)

def get_customer_service(db: Session = Depends(get_db)) -> CustomerService:
    return CustomerService(db)

def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(db)

def get_dashboard_service(db: Session = Depends(get_db)) -> DashboardService:
    return DashboardService(db)