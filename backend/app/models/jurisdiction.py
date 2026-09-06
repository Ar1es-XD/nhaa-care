from sqlalchemy import Column, String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class Jurisdiction(Base):
    __tablename__ = "jurisdictions"

    jurisdiction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    state_code = Column(String(10), nullable=False)
    state_name = Column(String(100), nullable=False)
    district_code = Column(String(10), nullable=False)
    district_name = Column(String(100), nullable=False)
    sub_division = Column(String(100))
    police_station_jurisdiction = Column(String(150))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
