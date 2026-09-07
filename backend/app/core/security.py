import os
import base64
import hashlib
import functools
from typing import Dict, Any, Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import HTTPException, status
from app.core.config import settings

@functools.lru_cache(maxsize=1)
def get_master_key() -> bytes:
    """
    Returns a deterministic 32-byte AES-256 master key.
    Prevents key regeneration on successive requests to avoid permanent data loss.
    """
    raw_key = settings.KMS_DATA_ENCRYPTION_KEY
    if not raw_key:
        raw_key = b"12345678901234567890123456789012"

    if isinstance(raw_key, str):
        # Support 64-char hex string
        if len(raw_key) == 64:
            try:
                decoded = bytes.fromhex(raw_key)
                if len(decoded) == 32:
                    return decoded
            except ValueError:
                pass
        # Support base64 encoded 32-byte key
        if len(raw_key) == 44:
            try:
                decoded = base64.b64decode(raw_key)
                if len(decoded) == 32:
                    return decoded
            except Exception:
                pass
        raw_bytes = raw_key.encode('utf-8')
    else:
        raw_bytes = raw_key

    if len(raw_bytes) == 32:
        return raw_bytes

    # Deterministically derive 32-byte key using SHA-256
    return hashlib.sha256(raw_bytes).digest()

def encrypt_sensitive_field(plaintext: str) -> bytes:
    if not plaintext:
        return b""
    aesgcm = AESGCM(get_master_key())
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)
    return nonce + ciphertext

def decrypt_sensitive_field(encrypted_data: bytes) -> str:
    if not encrypted_data or len(encrypted_data) < 28:
        raise ValueError("Malformed or missing ciphertext buffer")
    aesgcm = AESGCM(get_master_key())
    nonce = encrypted_data[:12]
    ciphertext = encrypted_data[12:]
    decrypted = aesgcm.decrypt(nonce, ciphertext, None)
    return decrypted.decode('utf-8')

def mask_pii_string(value: str, field_type: str = "NAME") -> str:
    if not value:
        return "****"
    if field_type == "PHONE":
        if len(value) >= 10:
            return f"+91 ******{value[-4:]}"
        return "******"
    if field_type == "NAME":
        parts = value.split()
        masked_parts = [p[0] + "*" * max(len(p)-2, 1) + (p[-1] if len(p)>1 else "") for p in parts]
        return " ".join(masked_parts)
    return f"{value[:2]}****"

def evaluate_abac_access(user: Dict[str, Any], record_jurisdiction: Dict[str, str], is_break_glass: bool = False) -> bool:
    role = user.get("role")
    if role in ["SUPER_ADMIN", "NATIONAL_MONITOR"]:
        return True
    
    user_district = user.get("jurisdiction", {}).get("district_code")
    record_district = record_jurisdiction.get("district_code")
    
    if not user_district or user_district != record_district:
        return False
        
    return True
