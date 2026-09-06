import pytest
from app.core.security import decrypt_sensitive_field

def test_malformed_ciphertext_raises_value_error():
    with pytest.raises(ValueError):
        decrypt_sensitive_field(b"short")

def test_empty_string_encryption():
    from app.core.security import encrypt_sensitive_field
    assert encrypt_sensitive_field("") == b""
