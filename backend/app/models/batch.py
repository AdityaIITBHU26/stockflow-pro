from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, func
from app.db.base import Base

class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    batch_number = Column(String(50), nullable=False)
    manufacturing_date = Column(Date)
    expiry_date = Column(Date)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
