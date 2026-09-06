from sqlalchemy import Column, BigInteger, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, INET, JSONB
from app.db.base import Base

class SystemAuditLog(Base):
    __tablename__ = "system_audit_logs"

    audit_id = Column(BigInteger, primary_key=True, autoincrement=True)
    prev_hash = Column(String(64), nullable=False)
    actor_user_id = Column(UUID(as_uuid=True))
    actor_role = Column(String(50))
    ip_address = Column(INET)
    action_type = Column(String(100), nullable=False)
    target_resource = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=False)
    details_json = Column(JSONB)
    hash_checksum = Column(String(64), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
