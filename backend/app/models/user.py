from sqlalchemy import Column, Integer, String, Boolean, Enum as SAEnum
from app.db.base import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    WAREHOUSE_STAFF = "warehouse_staff"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.WAREHOUSE_STAFF)
    is_active = Column(Boolean, default=True)
