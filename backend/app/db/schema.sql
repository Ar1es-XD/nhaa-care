-- ============================================================================
-- NHAA-Care: AI-based Dynamic Mental Health Monitoring & Distress Prediction
-- Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act Framework
-- Database Schema: PostgreSQL 16 + TimescaleDB + pgcrypto Envelope Encryption
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types for strict state machine handling
CREATE TYPE risk_tier_enum AS ENUM (
    'TIER_1_MILD', 
    'TIER_2_MODERATE', 
    'TIER_3_HIGH', 
    'TIER_4_CRITICAL'
);

CREATE TYPE channel_enum AS ENUM (
    'NHAA_14566', 
    'IVRS_OUTBOUND', 
    'WEB_PORTAL', 
    'MOBILE_APP', 
    'WHATSAPP_BOT', 
    'FIELD_COUNSELOR'
);

CREATE TYPE milestone_type_enum AS ENUM (
    'FIR_REGISTERED', 
    'CHARGESHEET_FILED', 
    'ACCUSED_ARRESTED', 
    'BAIL_HEARING', 
    'TRIAL_HEARING', 
    'WITNESS_DEPOSITION', 
    'JUDGMENT_DELIVERED', 
    'COMPENSATION_RELEASE'
);

CREATE TYPE alert_status_enum AS ENUM (
    'TRIGGERED', 
    'IN_TRIAGE', 
    'HUMAN_VERIFIED', 
    'ACTION_DISPATCHED', 
    'RESOLVED_CLOSED', 
    'FALSE_POSITIVE'
);

CREATE TYPE intervention_type_enum AS ENUM (
    'CRISIS_TELE_COUNSELING', 
    'PSYCHIATRIC_REFERRAL', 
    'WITNESS_POLICE_PROTECTION', 
    'EMERGENCY_RELOCATION', 
    'LEGAL_AID_DLSA', 
    'COMPENSATION_FASTTRACK'
);

CREATE TYPE user_role_enum AS ENUM (
    'SUPER_ADMIN', 
    'NATIONAL_MONITOR', 
    'STATE_NODAL_OFFICER', 
    'DISTRICT_MAGISTRATE', 
    'SUPERINTENDENT_OF_POLICE', 
    'DLSA_SECRETARY', 
    'DISTRICT_WELFARE_OFFICER', 
    'CERTIFIED_COUNSELOR'
);

-- ----------------------------------------------------------------------------
-- 1. Administrative Jurisdictions (Hierarchical Spatial Units)
-- ----------------------------------------------------------------------------
CREATE TABLE jurisdictions (
    jurisdiction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(10) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    sub_division VARCHAR(100),
    police_station_jurisdiction VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_state_district UNIQUE (state_code, district_code)
);

-- ----------------------------------------------------------------------------
-- 2. Users & Government Stakeholders (RBAC / ABAC Anchor)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sso_provider_id VARCHAR(150) UNIQUE, -- Jan Parichay / MeriPehchan ID
    full_name VARCHAR(150) NOT NULL,
    official_email VARCHAR(150) UNIQUE NOT NULL,
    official_mobile VARCHAR(15) UNIQUE NOT NULL,
    role user_role_enum NOT NULL,
    designation VARCHAR(150) NOT NULL,
    jurisdiction_id UUID REFERENCES jurisdictions(jurisdiction_id),
    department VARCHAR(100) NOT NULL, -- e.g. 'Police', 'Judiciary', 'Social Welfare', 'Health'
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. Hardened Identity Vault (PII Isolation Layer with Cryptographic Protection)
-- ----------------------------------------------------------------------------
-- REVIEW FIX: caste_category is strictly encrypted alongside all identifiable
-- attributes using KMS envelope encryption. Zero plaintext leakage permitted.
CREATE TABLE identity_vault (
    victim_token UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aadhaar_vault_reference VARCHAR(64), -- Zero-knowledge token from UIDAI vault
    encrypted_full_name BYTEA NOT NULL,
    encrypted_phone_number BYTEA NOT NULL,
    encrypted_current_address BYTEA NOT NULL,
    encrypted_caste_category BYTEA NOT NULL, -- Fully encrypted at rest
    preferred_language VARCHAR(20) DEFAULT 'hi',
    emergency_contact_encrypted BYTEA,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. Case Master (SC/ST PoA Case Registry)
-- ----------------------------------------------------------------------------
CREATE TABLE case_master (
    case_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'NHAA/2026/UP/LKO/00492'
    fir_number VARCHAR(100),
    police_station VARCHAR(150),
    jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(jurisdiction_id),
    victim_token UUID NOT NULL REFERENCES identity_vault(victim_token),
    act_sections TEXT[] NOT NULL, -- e.g. ARRAY['3(1)(r)', '3(1)(s)', '3(2)(v)']
    incident_date DATE NOT NULL,
    case_status VARCHAR(50) DEFAULT 'UNDER_INVESTIGATION',
    is_witness_protection_active BOOLEAN DEFAULT FALSE,
    current_distress_tier risk_tier_enum DEFAULT 'TIER_1_MILD',
    latest_dds_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. Case Milestones (Judicial & Investigation Timeline Correlation)
-- ----------------------------------------------------------------------------
CREATE TABLE case_milestones (
    milestone_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    milestone_type milestone_type_enum NOT NULL,
    scheduled_date DATE,
    actual_date DATE,
    court_name VARCHAR(150),
    outcome_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. Interaction Sessions (Omnichannel Communication Logs)
-- ----------------------------------------------------------------------------
CREATE TABLE interaction_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    channel channel_enum NOT NULL,
    interaction_direction VARCHAR(10) CHECK (interaction_direction IN ('INBOUND', 'OUTBOUND')),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    audio_recording_s3_key VARCHAR(500), -- Sovereign object store key
    raw_transcript_anonymized TEXT,
    detected_language VARCHAR(20),
    is_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. Distress Snapshots (Longitudinal Hypertable with Model Lineage)
-- ----------------------------------------------------------------------------
-- REVIEW FIX: Added model_version and validation_status columns so every score
-- is auditable to a specific, clinically approved model artifact.
CREATE TABLE distress_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interaction_sessions(session_id),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    measured_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite Research Metric (0.00 to 100.00)
    composite_dds_score NUMERIC(5,2) NOT NULL CHECK (composite_dds_score >= 0 AND composite_dds_score <= 100),
    risk_tier risk_tier_enum NOT NULL,
    
    -- Extracted Sub-Features (Provisional / Exploratory Indicators)
    voice_stress_index NUMERIC(5,2), -- Acoustic arousal marker (Jitter, Shimmer, F0 dispersion)
    nlp_sentiment_score NUMERIC(5,2),
    anxiety_score NUMERIC(5,2),
    depression_score NUMERIC(5,2),
    threat_intimidation_marker NUMERIC(5,2),
    
    -- Longitudinal Trend & Anomaly Metrics
    score_delta_7d NUMERIC(5,2),
    anomaly_flag BOOLEAN DEFAULT FALSE,
    
    -- Model Provenance & Governance
    model_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.0-research',
    validation_status VARCHAR(50) NOT NULL DEFAULT 'EXPERIMENTAL_UNVALIDATED',
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_distress_snapshots_case_time ON distress_snapshots(case_id, measured_at DESC);

-- ----------------------------------------------------------------------------
-- 8. Explainable AI (XAI) Attributions (Verifiable Citations & Weights)
-- ----------------------------------------------------------------------------
CREATE TABLE xai_attributions (
    attribution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_id UUID NOT NULL REFERENCES distress_snapshots(snapshot_id) ON DELETE CASCADE,
    primary_risk_driver VARCHAR(100) NOT NULL,
    shap_feature_weights JSONB NOT NULL,
    salient_linguistic_tokens TEXT[] NOT NULL,
    clinical_explanation_summary TEXT NOT NULL,
    confidence_interval NUMERIC(4,3) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. Real-Time Risk Alerts (Human Clinical Triage Gated)
-- ----------------------------------------------------------------------------
-- REVIEW FIX: Added clinical validation gate. Alerts require human review
-- before physical-world law enforcement or administrative actions are triggered.
CREATE TABLE alert_records (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    snapshot_id UUID NOT NULL REFERENCES distress_snapshots(snapshot_id),
    alert_tier risk_tier_enum NOT NULL,
    alert_title VARCHAR(200) NOT NULL,
    alert_description TEXT NOT NULL,
    status alert_status_enum DEFAULT 'TRIGGERED',
    sla_breach_at TIMESTAMPTZ NOT NULL,
    assigned_counselor_id UUID REFERENCES users(user_id),
    clinical_validation_notes TEXT,
    human_verified_at TIMESTAMPTZ,
    is_threat_confirmed BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolution_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_alerts_status_tier ON alert_records(status, alert_tier);

-- ----------------------------------------------------------------------------
-- 10. Closed-Loop Intervention Actions (Dispatched only post-verification)
-- ----------------------------------------------------------------------------
CREATE TABLE intervention_actions (
    action_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alert_records(alert_id),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    intervention_type intervention_type_enum NOT NULL,
    target_authority_role user_role_enum NOT NULL,
    assigned_officer_id UUID REFERENCES users(user_id),
    action_status VARCHAR(50) DEFAULT 'INITIATED',
    action_notes TEXT,
    action_order_reference VARCHAR(100),
    victim_verification_otp_status VARCHAR(20) DEFAULT 'PENDING',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 11. Relief & Compensation Tracking (PoA Rules 1995 Rule 12 Compliance)
-- ----------------------------------------------------------------------------
CREATE TABLE relief_compensations (
    relief_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    stage_name VARCHAR(100) NOT NULL, -- 'FIR_STAGE_25PCT', 'CHARGESHEET_50PCT', 'CONVICTION_25PCT'
    sanctioned_amount NUMERIC(12,2) NOT NULL,
    disbursed_amount NUMERIC(12,2) DEFAULT 0.00,
    dbt_transaction_reference VARCHAR(100),
    is_disbursed BOOLEAN DEFAULT FALSE,
    disbursed_date DATE,
    delay_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 12. Break-Glass Access Session Registry (Emergency Unmasking Protocol)
-- ----------------------------------------------------------------------------
CREATE TABLE break_glass_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    justification_reason TEXT NOT NULL CHECK (length(justification_reason) >= 50),
    granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL, -- Strictly time-bounded (e.g. 4 hours)
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT
);

-- ----------------------------------------------------------------------------
-- 13. Cryptographic Hash-Chained Audit Logs (Tamper-Proof Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE system_audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    prev_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of previous row
    actor_user_id UUID,
    actor_role VARCHAR(50),
    ip_address INET,
    action_type VARCHAR(100) NOT NULL,
    target_resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    details_json JSONB,
    hash_checksum VARCHAR(64) NOT NULL, -- SHA256(prev_hash || timestamp || actor || action || resource || details)
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_chain ON system_audit_logs(audit_id, timestamp);
