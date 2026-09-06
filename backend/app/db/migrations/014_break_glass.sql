-- Migration 014: Break-Glass Access Sessions
CREATE TABLE break_glass_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    justification_reason TEXT NOT NULL CHECK (length(justification_reason) >= 50),
    granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT
);
