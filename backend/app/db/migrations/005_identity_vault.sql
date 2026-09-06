-- Migration 005: Hardened Identity Vault with Encrypted Caste Category
CREATE TABLE identity_vault (
    victim_token UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aadhaar_vault_reference VARCHAR(64),
    encrypted_full_name BYTEA NOT NULL,
    encrypted_phone_number BYTEA NOT NULL,
    encrypted_current_address BYTEA NOT NULL,
    encrypted_caste_category BYTEA NOT NULL,
    preferred_language VARCHAR(20) DEFAULT 'hi',
    emergency_contact_encrypted BYTEA,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
