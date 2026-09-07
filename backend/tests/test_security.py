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

def test_deterministic_master_key():
    from app.core.security import get_master_key
    k1 = get_master_key()
    k2 = get_master_key()
    assert k1 == k2
    assert len(k1) == 32

def test_encryption_with_arbitrary_key(monkeypatch):
    from app.core import config, security
    # Test with non-32 byte passphrase
    monkeypatch.setattr(config.settings, "KMS_DATA_ENCRYPTION_KEY", "short-secret-key")
    security.get_master_key.cache_clear()
    
    plaintext = "Confidential Witness Identity"
    ciphertext = security.encrypt_sensitive_field(plaintext)
    decrypted = security.decrypt_sensitive_field(ciphertext)
    assert decrypted == plaintext
    
    # Reset cache
    security.get_master_key.cache_clear()
