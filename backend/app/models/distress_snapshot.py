from sqlalchemy import Column, String, Numeric, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class DistressSnapshot(Base):
    __tablename__ = "distress_snapshots"

    snapshot_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("interaction_sessions.session_id"), nullable=False)
    case_id = Column(UUID(as_uuid=True), ForeignKey("case_master.case_id"), nullable=False)
    measured_at = Column(DateTime(timezone=True), server_default=func.now())
    composite_dds_score = Column(Numeric(5,2), nullable=False)
    risk_tier = Column(String(30), nullable=False)
    voice_stress_index = Column(Numeric(5,2))
    nlp_sentiment_score = Column(Numeric(5,2))
    anxiety_score = Column(Numeric(5,2))
    depression_score = Column(Numeric(5,2))
    threat_intimidation_marker = Column(Numeric(5,2))
    score_delta_7d = Column(Numeric(5,2))
    anomaly_flag = Column(Boolean, default=False)
    model_version = Column(String(50), default="v1.0.0-research", nullable=False)
    validation_status = Column(String(50), default="EXPERIMENTAL_UNVALIDATED", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
