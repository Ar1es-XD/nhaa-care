-- Migration 015: Tamper-Proof Cryptographic Audit Logs
CREATE TABLE system_audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    prev_hash VARCHAR(64) NOT NULL,
    actor_user_id UUID,
    actor_role VARCHAR(50),
    ip_address INET,
    action_type VARCHAR(100) NOT NULL,
    target_resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    details_json JSONB,
    hash_checksum VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_chain ON system_audit_logs(audit_id, timestamp);
