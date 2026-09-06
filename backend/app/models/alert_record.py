from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class AlertRecord(Base):
    __tablename__ = "alert_records"

    alert_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("case_master.case_id"), nullable=False)
    snapshot_id = Column(UUID(as_uuid=True), ForeignKey("distress_snapshots.snapshot_id"), nullable=False)
    alert_tier = Column(String(30), nullable=False)
    alert_title = Column(String(200), nullable=False)
    alert_description = Column(Text, nullable=False)
    status = Column(String(30), default="TRIGGERED")
    sla_breach_at = Column(DateTime(timezone=True), nullable=False)
    assigned_counselor_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    clinical_validation_notes = Column(Text)
    human_verified_at = Column(DateTime(timezone=True))
    is_threat_confirmed = Column(Boolean, default=False)
    resolved_at = Column(DateTime(timezone=True))
    resolution_remarks = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
