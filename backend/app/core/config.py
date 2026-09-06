import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "NHAA-Care Dynamic Distress Monitoring & Prediction Platform"
    VERSION: str = "1.0.0-gov.in"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "meghraj-pilot")
    
    # KMS / Cryptographic Envelope Key
    KMS_DATA_ENCRYPTION_KEY: bytes = os.getenv(
        "KMS_DATA_ENCRYPTION_KEY", 
        b"12345678901234567890123456789012" # 32-byte 256-bit AES master key
    )
    
    # MeriPehchan / Jan Parichay OIDC config
    MERIPEHCHAN_CLIENT_ID: str = os.getenv("MERIPEHCHAN_CLIENT_ID", "nhaa-gov-in-client")
    MERIPEHCHAN_ISSUER_URL: str = "https://janparichay.meripehchan.gov.in"
    
    # Model Lineage & Governance Tagging
    ACTIVE_MODEL_VERSION: str = "v1.0.2-research-calibrated"
    MODEL_VALIDATION_STATUS: str = "RESEARCH_PROTOTYPE_UNVALIDATED"
    
    # GIGW Compliance & Security
    DEFAULT_SESSION_TIMEOUT_MINUTES: int = 15
    BREAK_GLASS_SESSION_HOURS: int = 4

settings = Settings()
