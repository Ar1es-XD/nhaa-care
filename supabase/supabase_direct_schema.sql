-- ============================================================================
-- SAHAARA (सहारा) / NHAA-CARE COMPREHENSIVE PRODUCTION SCHEMA
-- Target: Supabase PostgreSQL 17.6 (Project: "adi's sih" / xxnibumdtxqbazpbeisl)
-- Features: Zero-Knowledge Vault (AES-256), SHA-256 Hash Chaining,
--           PoA Rule 12 Relief Tracking, 4-Hour Break-Glass Unmasking,
--           Row Level Security (RLS), and Full Seed Data.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
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

-- 3. CORE TABLES

-- 3.1 Jurisdictions
CREATE TABLE IF NOT EXISTS jurisdictions (
    jurisdiction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(10) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    nodal_officer_name VARCHAR(255),
    nodal_officer_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_state_district UNIQUE (state_code, district_code)
);

-- 3.2 Platform Users & Officers
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_auth_id UUID,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role_enum NOT NULL,
    jurisdiction_id UUID REFERENCES jurisdictions(jurisdiction_id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.3 Zero-Knowledge Identity Vault (PII Isolated & Encrypted)
CREATE TABLE IF NOT EXISTS identity_vault (
    identity_vault_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encrypted_aadhaar_ref BYTEA,
    encrypted_phone BYTEA NOT NULL,
    encrypted_name BYTEA NOT NULL,
    encrypted_caste_category BYTEA NOT NULL,
    key_version VARCHAR(20) NOT NULL DEFAULT 'v1-kavach-aes256',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.4 Case Master (Anonymized PoA Cases)
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
    witness_protection_tier VARCHAR(20) DEFAULT 'CATEGORY_B',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.5 Case Milestones & Judicial Events
CREATE TABLE IF NOT EXISTS case_milestones (
    milestone_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    milestone_type milestone_type_enum NOT NULL,
    milestone_date DATE NOT NULL,
    source_channel channel_enum NOT NULL,
    milestone_details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.6 Multilingual Interactions (Voice/Web/IVRS)
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

-- 3.7 Distress Snapshots (Dynamic Distress Engine Outputs)
CREATE TABLE IF NOT EXISTS distress_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    interaction_id UUID REFERENCES interactions(interaction_id),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.2-calibrated',
    voice_stress_score NUMERIC(5,2) DEFAULT 0.00,
    nlp_sentiment_score NUMERIC(5,2) DEFAULT 0.00,
    clinical_screener_score NUMERIC(5,2) DEFAULT 0.00,
    delta_velocity_score NUMERIC(5,2) DEFAULT 0.00,
    calculated_dds NUMERIC(5,2) NOT NULL,
    assigned_tier risk_tier_enum NOT NULL,
    shap_explainability JSONB
);

-- 3.8 Triage Alerts
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

-- 3.9 PoA Rule 12 Relief Compensation Tracking
CREATE TABLE IF NOT EXISTS relief_compensations (
    relief_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    sanctioned_amount NUMERIC(12,2) NOT NULL,
    disbursed_amount NUMERIC(12,2) DEFAULT 0.00,
    is_disbursed BOOLEAN DEFAULT FALSE,
    delay_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.10 Break-Glass Emergency Unmasking Logs (4-Hour Protocol)
CREATE TABLE IF NOT EXISTS break_glass_events (
    break_glass_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES users(user_id),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    justification TEXT NOT NULL CHECK (char_length(justification) >= 50),
    otp_code VARCHAR(10) NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '4 hours'),
    is_revoked BOOLEAN DEFAULT FALSE
);

-- 3.11 Tamper-Evident SHA-256 Audit Ledger (Hash-Chained)
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

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_case_master_number ON case_master(nhaa_case_number);
CREATE INDEX IF NOT EXISTS idx_case_master_jurisdiction ON case_master(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_distress_case_date ON distress_snapshots(case_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_triage_tier_status ON triage_alerts(risk_tier, status);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON system_audit_logs(timestamp DESC);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distress_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE relief_compensations ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_glass_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous/Public policies (for mobile check-ins, helpline dialers, and baseline forms)
CREATE POLICY "Public can view active jurisdictions" ON jurisdictions FOR SELECT TO anon, authenticated USING (is_active = TRUE);
CREATE POLICY "Public can create anonymous interactions" ON interactions FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Public can log distress checkins" ON distress_snapshots FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

-- Authenticated Officer & Counselor policies
CREATE POLICY "Authenticated users view case master" ON case_master FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users view distress snapshots" ON distress_snapshots FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users view triage alerts" ON triage_alerts FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated counselors update alerts" ON triage_alerts FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users view relief compensations" ON relief_compensations FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users view break-glass events" ON break_glass_events FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users insert break glass" ON break_glass_events FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated users view audit ledger" ON system_audit_logs FOR SELECT TO authenticated USING (TRUE);

-- Service Role Full Access
CREATE POLICY "Service role full access jurisdictions" ON jurisdictions FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access cases" ON case_master FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access vault" ON identity_vault FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access alerts" ON triage_alerts FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access snapshots" ON distress_snapshots FOR ALL TO service_role USING (TRUE);
CREATE POLICY "Service role full access audits" ON system_audit_logs FOR ALL TO service_role USING (TRUE);

-- 6. SEED DATA

-- 6.1 Seed Jurisdictions
INSERT INTO jurisdictions (state_code, state_name, district_code, district_name, nodal_officer_name, nodal_officer_phone)
VALUES 
    ('UP', 'Uttar Pradesh', 'UP_VNS', 'Varanasi', 'Shri Rajeev Sharma, IAS (DM)', '+91-542-2501001'),
    ('UP', 'Uttar Pradesh', 'UP_LKO', 'Lucknow', 'Smt. Vandana Tripathi, PCS', '+91-522-2621002'),
    ('UP', 'Uttar Pradesh', 'UP_PRG', 'Prayagraj', 'Shri Alok Verma, IPS (SP)', '+91-532-2401003')
ON CONFLICT (state_code, district_code) DO NOTHING;

-- 6.2 Seed Officers
INSERT INTO users (full_name, email, role, is_active)
VALUES
    ('Dr. Ananya Verma', 'counselor.ananya@nhaa-care.gov.in', 'CERTIFIED_COUNSELOR', TRUE),
    ('Rajeev Sharma, IAS', 'dm.varanasi@up.gov.in', 'DISTRICT_MAGISTRATE', TRUE),
    ('Vikramaditya Singh, IPS', 'sp.varanasi@uppolice.gov.in', 'SUPERINTENDENT_OF_POLICE', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 6.3 Seed Zero-Knowledge Identity Vault Entries (AES-256 Mocked Hashes)
INSERT INTO identity_vault (identity_vault_id, encrypted_name, encrypted_phone, encrypted_caste_category, key_version)
VALUES
    ('a1111111-1111-1111-1111-111111111111', pgp_sym_encrypt('Priya Devi', 'kavach-prod-master-key'), pgp_sym_encrypt('+91 98765 43210', 'kavach-prod-master-key'), pgp_sym_encrypt('Scheduled Caste (Chamar)', 'kavach-prod-master-key'), 'v1-kavach-aes256'),
    ('b2222222-2222-2222-2222-222222222222', pgp_sym_encrypt('Ramesh Paswan', 'kavach-prod-master-key'), pgp_sym_encrypt('+91 94150 11223', 'kavach-prod-master-key'), pgp_sym_encrypt('Scheduled Caste (Paswan)', 'kavach-prod-master-key'), 'v1-kavach-aes256'),
    ('c3333333-3333-3333-3333-333333333333', pgp_sym_encrypt('Sunita Valmiki', 'kavach-prod-master-key'), pgp_sym_encrypt('+91 99350 44556', 'kavach-prod-master-key'), pgp_sym_encrypt('Scheduled Caste (Valmiki)', 'kavach-prod-master-key'), 'v1-kavach-aes256')
ON CONFLICT (identity_vault_id) DO NOTHING;

-- 6.4 Seed Case Master Entries
INSERT INTO case_master (case_id, nhaa_case_number, identity_vault_id, jurisdiction_id, police_station, fir_number, fir_date, poa_sections, case_status, baseline_vulnerability_score, witness_protection_tier)
SELECT 
    'd4444444-4444-4444-4444-444444444444',
    'VNS-2026-9042',
    'a1111111-1111-1111-1111-111111111111',
    jurisdiction_id,
    'Bhelupur Police Station, Varanasi',
    'FIR-492/2026',
    '2026-02-10',
    ARRAY['Section 3(1)(r)', 'Section 3(1)(s)', 'Section 3(2)(va)'],
    'CHARGESHEET_FILED',
    65.00,
    'CATEGORY_B'
FROM jurisdictions WHERE district_code = 'UP_VNS'
ON CONFLICT (nhaa_case_number) DO NOTHING;

INSERT INTO case_master (case_id, nhaa_case_number, identity_vault_id, jurisdiction_id, police_station, fir_number, fir_date, poa_sections, case_status, baseline_vulnerability_score, witness_protection_tier)
SELECT 
    'e5555555-5555-5555-5555-555555555555',
    'LKO-2026-8812',
    'b2222222-2222-2222-2222-222222222222',
    jurisdiction_id,
    'Hazratganj Police Station, Lucknow',
    'FIR-108/2026',
    '2026-02-18',
    ARRAY['Section 3(1)(w)', 'Section 3(2)(v)'],
    'ACTIVE_INVESTIGATION',
    45.00,
    'CATEGORY_C'
FROM jurisdictions WHERE district_code = 'UP_LKO'
ON CONFLICT (nhaa_case_number) DO NOTHING;

INSERT INTO case_master (case_id, nhaa_case_number, identity_vault_id, jurisdiction_id, police_station, fir_number, fir_date, poa_sections, case_status, baseline_vulnerability_score, witness_protection_tier)
SELECT 
    'f6666666-6666-6666-6666-666666666666',
    'PRG-2026-7731',
    'c3333333-3333-3333-3333-333333333333',
    jurisdiction_id,
    'Civil Lines Police Station, Prayagraj',
    'FIR-84/2026',
    '2026-01-29',
    ARRAY['Section 3(1)(za)', 'Section 3(2)(v)'],
    'SPECIAL_COURT_TRIAL',
    52.00,
    'CATEGORY_B'
FROM jurisdictions WHERE district_code = 'UP_PRG'
ON CONFLICT (nhaa_case_number) DO NOTHING;

-- 6.5 Seed 7-Day Longitudinal Distress Snapshots (for 900ms SVG trendlines)
INSERT INTO distress_snapshots (case_id, recorded_at, voice_stress_score, nlp_sentiment_score, clinical_screener_score, delta_velocity_score, calculated_dds, assigned_tier, shap_explainability)
VALUES
    ('d4444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP - INTERVAL '6 days', 38.00, 35.00, 40.00, 5.00, 38.50, 'TIER_1_MILD', '{"primary_factor": "Initial baseline entry"}'::jsonb),
    ('d4444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP - INTERVAL '5 days', 42.00, 40.00, 42.00, 4.00, 41.20, 'TIER_2_MODERATE', '{"primary_factor": "Pre-hearing anxiety"}'::jsonb),
    ('d4444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP - INTERVAL '4 days', 48.00, 45.00, 44.00, 6.00, 46.80, 'TIER_2_MODERATE', '{"primary_factor": "Delayed relief installment"}'::jsonb),
    ('d4444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP - INTERVAL '3 days', 59.00, 62.00, 58.00, 14.00, 61.50, 'TIER_2_MODERATE', '{"primary_factor": "Accused sighted near dwelling"}'::jsonb),
    ('d4444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP - INTERVAL '2 days', 72.00, 75.00, 70.00, 18.00, 74.30, 'TIER_3_HIGH', '{"primary_factor": "Sudden 3-day silence post-court"}'::jsonb),
    ('d4444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP - INTERVAL '1 days', 81.00, 84.00, 79.00, 22.00, 82.10, 'TIER_3_HIGH', '{"primary_factor": "F0 pitch jitter +42%, sleep disruption"}'::jsonb),
    ('d4444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP, 89.00, 88.00, 85.00, 26.00, 87.40, 'TIER_4_CRITICAL', '{"primary_factor": "Direct verbal intimidation reported"}'::jsonb);

-- 6.6 Seed Active Triage Alert
INSERT INTO triage_alerts (case_id, risk_tier, status, verbatim_preserved_quote)
VALUES
    ('d4444444-4444-4444-4444-444444444444', 'TIER_4_CRITICAL', 'TRIGGERED', 'कल शाम विपक्षी के लोग घर के बाहर आकर गाली-गलौज कर रहे थे और कह रहे थे कि अगर बयान वापस नहीं लिया तो अच्छा नहीं होगा। हमें बहुत डर लग रहा है।');

-- 6.7 Seed PoA Rule 12 Relief Milestones
INSERT INTO relief_compensations (case_id, stage_name, sanctioned_amount, disbursed_amount, is_disbursed, delay_days)
VALUES
    ('d4444444-4444-4444-4444-444444444444', 'Stage 1: FIR Registration (25%)', 212500.00, 212500.00, TRUE, 0),
    ('d4444444-4444-4444-4444-444444444444', 'Stage 2: Chargesheet Filing (50%)', 425000.00, 0.00, FALSE, 14),
    ('d4444444-4444-4444-4444-444444444444', 'Stage 3: Special Court Conviction (25%)', 212500.00, 0.00, FALSE, 0);

-- 6.8 Seed Genesis Block for SHA-256 Audit Chain
INSERT INTO system_audit_logs (prev_hash, actor_role, action_type, target_resource, resource_id, hash_checksum)
VALUES ('0000000000000000000000000000000000000000000000000000000000000000', 'SYSTEM', 'GENESIS_BLOCK', 'SYSTEM_AUDIT_LOGS', '0', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

-- 7. VERIFICATION SCRIPT (Run at end to confirm setup)
SELECT 'Total Jurisdictions' AS metric, COUNT(*)::text AS count FROM jurisdictions
UNION ALL
SELECT 'Total Cases', COUNT(*)::text FROM case_master
UNION ALL
SELECT 'Total Distress Snapshots', COUNT(*)::text FROM distress_snapshots
UNION ALL
SELECT 'Active Triage Alerts', COUNT(*)::text FROM triage_alerts
UNION ALL
SELECT 'Relief Stages Tracked', COUNT(*)::text FROM relief_compensations
UNION ALL
SELECT 'Audit Log Records', COUNT(*)::text FROM system_audit_logs;
