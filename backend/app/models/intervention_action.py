from sqlalchemy import Column, String, DateTime, Text, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class InterventionAction(Base):
    __tablename__ = "intervention_actions"

    action_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alert_id = Column(UUID(as_uuid=True), ForeignKey("alert_records.alert_id"), nullable=False)
    case_id = Column(UUID(as_uuid=True), ForeignKey("case_master.case_id"), nullable=False)
    intervention_type = Column(String(50), nullable=False)
    target_authority_role = Column(String(50), nullable=False)
    assigned_officer_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    action_status = Column(String(50), default="INITIATED")
    action_notes = Column(Text)
    action_order_reference = Column(String(100))
    victim_verification_otp_status = Column(String(20), default="PENDING")
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
