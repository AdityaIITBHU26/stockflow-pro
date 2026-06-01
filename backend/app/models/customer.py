from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.base import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    address = Column(String(500))
    registration_date = Column(DateTime(timezone=True), server_default=func.now())