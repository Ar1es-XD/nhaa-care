-- ============================================================================
-- Sahaara (सहारा) / NHAA-Care Database Initialization
-- Target: Supabase Project "adi's sih" (xxnibumdtxqbazpbeisl)
-- PostgreSQL 17.6 Compatible Schema with pgcrypto & Zero-Knowledge Vault
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
    CREATE TYPE risk_tier_enum AS ENUM ('TIER_1_MILD', 'TIER_2_MODERATE', 'TIER_3_HIGH', 'TIER_4_CRITICAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE channel_enum AS ENUM ('NHAA_14566', 'IVRS_OUTBOUND', 'WEB_PORTAL', 'MOBILE_APP', 'WHATSAPP_BOT', 'FIELD_COUNSELOR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE milestone_type_enum AS ENUM ('FIR_REGISTERED', 'CHARGESHEET_FILED', 'ACCUSED_ARRESTED', 'BAIL_HEARING', 'TRIAL_HEARING', 'WITNESS_DEPOSITION', 'JUDGMENT_DELIVERED', 'COMPENSATION_RELEASE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE alert_status_enum AS ENUM ('TRIGGERED', 'IN_TRIAGE', 'HUMAN_VERIFIED', 'ACTION_DISPATCHED', 'RESOLVED_CLOSED', 'FALSE_POSITIVE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE intervention_type_enum AS ENUM ('CRISIS_TELE_COUNSELING', 'PSYCHIATRIC_REFERRAL', 'WITNESS_POLICE_PROTECTION', 'EMERGENCY_RELOCATION', 'LEGAL_AID_DLSA', 'COMPENSATION_FASTTRACK');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('SUPER_ADMIN', 'NATIONAL_MONITOR', 'STATE_NODAL_OFFICER', 'DISTRICT_MAGISTRATE', 'SUPERINTENDENT_OF_POLICE', 'DLSA_SECRETARY', 'DISTRICT_WELFARE_OFFICER', 'CERTIFIED_COUNSELOR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Jurisdictions
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

-- Users
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role_enum NOT NULL,
    jurisdiction_id UUID REFERENCES jurisdictions(jurisdiction_id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Identity Vault (PII Isolated)
CREATE TABLE IF NOT EXISTS identity_vault (
    identity_vault_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encrypted_aadhaar_ref BYTEA,
    encrypted_phone BYTEA NOT NULL,
    encrypted_name BYTEA NOT NULL,
    encrypted_caste_category BYTEA NOT NULL,
    key_version VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Cases
CREATE TABLE IF NOT EXISTS case_master (
    case_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nhaa_case_number VARCHAR(50) UNIQUE NOT NULL,
    identity_vault_id UUID NOT NULL REFERENCES identity_vault(identity_vault_id),
    jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(jurisdiction_id),
    police_station VARCHAR(150),
    fir_number VARCHAR(100),
    fir_date DATE,
    poa_sections TEXT[],
    case_status VARCHAR(50) DEFAULT 'ACTIVE_INVESTIGATION',
    baseline_vulnerability_score NUMERIC(5,2) DEFAULT 50.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Case Milestones
CREATE TABLE IF NOT EXISTS case_milestones (
    milestone_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    milestone_type milestone_type_enum NOT NULL,
    milestone_date DATE NOT NULL,
    source_channel channel_enum NOT NULL,
    milestone_details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Interactions
CREATE TABLE IF NOT EXISTS interactions (
    interaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    channel channel_enum NOT NULL,
    language_code VARCHAR(10) DEFAULT 'hi',
    call_duration_seconds INTEGER DEFAULT 0,
    consent_obtained BOOLEAN DEFAULT TRUE,
    quick_exit_triggered BOOLEAN DEFAULT FALSE,
    interaction_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Distress Snapshots
CREATE TABLE IF NOT EXISTS distress_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    interaction_id UUID REFERENCES interactions(interaction_id),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.2-research-calibrated',
    voice_stress_score NUMERIC(5,2) DEFAULT 0.00,
    nlp_sentiment_score NUMERIC(5,2) DEFAULT 0.00,
    clinical_screener_score NUMERIC(5,2) DEFAULT 0.00,
    delta_velocity_score NUMERIC(5,2) DEFAULT 0.00,
    calculated_dds NUMERIC(5,2) NOT NULL,
    assigned_tier risk_tier_enum NOT NULL
);

-- Triage Alerts
CREATE TABLE IF NOT EXISTS triage_alerts (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    snapshot_id UUID REFERENCES distress_snapshots(snapshot_id),
    risk_tier risk_tier_enum NOT NULL,
    status alert_status_enum DEFAULT 'TRIGGERED',
    verbatim_preserved_quote TEXT,
    counselor_verified_by UUID REFERENCES users(user_id),
    counselor_verification_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Relief Tracking (Rule 12)
CREATE TABLE IF NOT EXISTS relief_compensations (
    relief_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    stage_name VARCHAR(100) NOT NULL,
    sanctioned_amount NUMERIC(12,2) NOT NULL,
    disbursed_amount NUMERIC(12,2) DEFAULT 0.00,
    is_disbursed BOOLEAN DEFAULT FALSE,
    delay_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs (Hash-Chained)
CREATE TABLE IF NOT EXISTS system_audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    prev_hash VARCHAR(64) NOT NULL,
    actor_user_id UUID,
    actor_role VARCHAR(50),
    action_type VARCHAR(100) NOT NULL,
    target_resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    hash_checksum VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Jurisdictions
INSERT INTO jurisdictions (state_code, state_name, district_code, district_name)
VALUES 
    ('UP', 'Uttar Pradesh', 'UP_VNS', 'Varanasi'),
    ('UP', 'Uttar Pradesh', 'UP_LKO', 'Lucknow'),
    ('UP', 'Uttar Pradesh', 'UP_PRG', 'Prayagraj')
ON CONFLICT (state_code, district_code) DO NOTHING;

-- Seed Initial System Genesis Hash
INSERT INTO system_audit_logs (prev_hash, actor_role, action_type, target_resource, resource_id, hash_checksum)
VALUES ('0000000000000000000000000000000000000000000000000000000000000000', 'SYSTEM', 'GENESIS_BLOCK', 'SYSTEM_AUDIT_LOGS', '0', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
