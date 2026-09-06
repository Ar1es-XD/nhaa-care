-- Migration 004: Users & Stakeholder Registry
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sso_provider_id VARCHAR(150) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    official_email VARCHAR(150) UNIQUE NOT NULL,
    official_mobile VARCHAR(15) UNIQUE NOT NULL,
    role user_role_enum NOT NULL,
    designation VARCHAR(150) NOT NULL,
    jurisdiction_id UUID REFERENCES jurisdictions(jurisdiction_id),
    department VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
