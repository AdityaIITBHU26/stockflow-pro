from sqlalchemy import Column, Integer, String, DateTime, Text
from app.db.base import Base
from datetime import datetime

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(50), nullable=False)
    table_name = Column(String(50))
    record_id = Column(Integer)
    old_state = Column(Text)
    new_state = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
