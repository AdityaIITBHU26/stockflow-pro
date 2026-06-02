from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.audit_log import AuditLog

router = APIRouter()

@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can view audit logs")
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset((page-1)*limit).limit(limit).all()
    total = db.query(AuditLog).count()
    return {"success": True, "data": [{"id": l.id, "user_id": l.user_id, "action": l.action, "timestamp": l.timestamp.isoformat()} for l in logs], "page": page, "limit": limit, "total": total}
