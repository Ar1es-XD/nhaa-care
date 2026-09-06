-- Copy of hardened schema for Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE risk_tier_enum AS ENUM ('TIER_1_MILD', 'TIER_2_MODERATE', 'TIER_3_HIGH', 'TIER_4_CRITICAL');
CREATE TYPE channel_enum AS ENUM ('NHAA_14566', 'IVRS_OUTBOUND', 'WEB_PORTAL', 'MOBILE_APP', 'WHATSAPP_BOT', 'FIELD_COUNSELOR');

CREATE TABLE IF NOT EXISTS jurisdictions (
    jurisdiction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(10) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_state_district UNIQUE (state_code, district_code)
);
