import os
import base64
from typing import Dict, Any, Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import HTTPException, status
from app.core.config import settings

def get_master_key() -> bytes:
    key = settings.KMS_DATA_ENCRYPTION_KEY
    if isinstance(key, str):
        key = key.encode('utf-8')
    if len(key) != 32:
        return AESGCM.generate_key(bit_length=256)
    return key

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
