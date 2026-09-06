from sqlalchemy import Column, String, Numeric, DateTime, Text, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid
from app.db.base import Base

class XAIAttribution(Base):
    __tablename__ = "xai_attributions"

    attribution_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    snapshot_id = Column(UUID(as_uuid=True), ForeignKey("distress_snapshots.snapshot_id"), nullable=False)
    primary_risk_driver = Column(String(100), nullable=False)
    shap_feature_weights = Column(JSONB, nullable=False)
    salient_linguistic_tokens = Column(ARRAY(String), nullable=False)
    clinical_explanation_summary = Column(Text, nullable=False)
    confidence_interval = Column(Numeric(4,3), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
