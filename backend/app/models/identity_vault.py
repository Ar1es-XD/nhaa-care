from sqlalchemy import Column, String, LargeBinary, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class IdentityVault(Base):
    __tablename__ = "identity_vault"

    victim_token = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aadhaar_vault_reference = Column(String(64))
    encrypted_full_name = Column(LargeBinary, nullable=False)
    encrypted_phone_number = Column(LargeBinary, nullable=False)
    encrypted_current_address = Column(LargeBinary, nullable=False)
    encrypted_caste_category = Column(LargeBinary, nullable=False)
    preferred_language = Column(String(20), default="hi")
    emergency_contact_encrypted = Column(LargeBinary)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
