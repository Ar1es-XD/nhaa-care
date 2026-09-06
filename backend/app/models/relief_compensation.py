from sqlalchemy import Column, String, Numeric, Boolean, Date, DateTime, Integer, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class ReliefCompensation(Base):
    __tablename__ = "relief_compensations"

    relief_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("case_master.case_id"), nullable=False)
    stage_name = Column(String(100), nullable=False)
    sanctioned_amount = Column(Numeric(12,2), nullable=False)
    disbursed_amount = Column(Numeric(12,2), default=0.00)
    dbt_transaction_reference = Column(String(100))
    is_disbursed = Column(Boolean, default=False)
    disbursed_date = Column(Date)
    delay_days = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
