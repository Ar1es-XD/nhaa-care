from sqlalchemy import Column, String, Date, DateTime, Text, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class CaseMilestone(Base):
    __tablename__ = "case_milestones"

    milestone_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("case_master.case_id"), nullable=False)
    milestone_type = Column(String(50), nullable=False)
    scheduled_date = Column(Date)
    actual_date = Column(Date)
    court_name = Column(String(150))
    outcome_summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
