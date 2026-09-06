from sqlalchemy import Column, String, Boolean, Date, DateTime, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import uuid
from app.db.base import Base

class CaseMaster(Base):
    __tablename__ = "case_master"

    case_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String(50), unique=True, nullable=False)
    fir_number = Column(String(100))
    police_station = Column(String(150))
    jurisdiction_id = Column(UUID(as_uuid=True), ForeignKey("jurisdictions.jurisdiction_id"), nullable=False)
    victim_token = Column(UUID(as_uuid=True), ForeignKey("identity_vault.victim_token"), nullable=False)
    act_sections = Column(ARRAY(String), nullable=False)
    incident_date = Column(Date, nullable=False)
    case_status = Column(String(50), default="UNDER_INVESTIGATION")
    is_witness_protection_active = Column(Boolean, default=False)
    current_distress_tier = Column(String(30), default="TIER_1_MILD")
    latest_dds_score = Column(Numeric(5,2), default=0.00)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
