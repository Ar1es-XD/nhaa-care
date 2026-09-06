from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sso_provider_id = Column(String(150), unique=True)
    full_name = Column(String(150), nullable=False)
    official_email = Column(String(150), unique=True, nullable=False)
    official_mobile = Column(String(15), unique=True, nullable=False)
    role = Column(String(50), nullable=False)
    designation = Column(String(150), nullable=False)
    jurisdiction_id = Column(UUID(as_uuid=True), ForeignKey("jurisdictions.jurisdiction_id"))
    department = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    last_login_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
