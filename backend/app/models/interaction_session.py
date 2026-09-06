from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class InteractionSession(Base):
    __tablename__ = "interaction_sessions"

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("case_master.case_id"), nullable=False)
    channel = Column(String(50), nullable=False)
    interaction_direction = Column(String(10))
    started_at = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True))
    duration_seconds = Column(Integer)
    audio_recording_s3_key = Column(String(500))
    raw_transcript_anonymized = Column(Text)
    detected_language = Column(String(20))
    is_completed = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
