from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    contact_email = Column(String(100))
    phone = Column(String(20))
    address = Column(String(500))
