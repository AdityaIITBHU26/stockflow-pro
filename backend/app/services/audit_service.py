from app.models.audit_log import AuditLog
import json

def log_audit(db, user_id, action, table_name=None, record_id=None, old=None, new=None):
    log = AuditLog(
        user_id=user_id,
        action=action,
        table_name=table_name,
        record_id=record_id,
        old_state=json.dumps(old) if old else None,
        new_state=json.dumps(new) if new else None,
    )
    db.add(log)
    db.commit()
