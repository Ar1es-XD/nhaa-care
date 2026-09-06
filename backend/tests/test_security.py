import pytest
from app.core.security import encrypt_sensitive_field, decrypt_sensitive_field, mask_pii_string

def test_envelope_encryption_roundtrip():
    plaintext = "Ramesh Kumar - Sadar Lucknow"
    ciphertext = encrypt_sensitive_field(plaintext)
    assert ciphertext != plaintext.encode()
    decrypted = decrypt_sensitive_field(ciphertext)
    assert decrypted == plaintext

def test_pii_masking():
    masked_phone = mask_pii_string("9876543210", field_type="PHONE")
    assert "******" in masked_phone
    assert masked_phone.endswith("3210")
    
    masked_name = mask_pii_string("Ramesh Kumar", field_type="NAME")
    assert "R****h" in masked_name or "R*h" in masked_name
