-- Migration 006: Atrocity Case Master Record
CREATE TABLE case_master (
    case_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    fir_number VARCHAR(100),
    police_station VARCHAR(150),
    jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(jurisdiction_id),
    victim_token UUID NOT NULL REFERENCES identity_vault(victim_token),
    act_sections TEXT[] NOT NULL,
    incident_date DATE NOT NULL,
    case_status VARCHAR(50) DEFAULT 'UNDER_INVESTIGATION',
    is_witness_protection_active BOOLEAN DEFAULT FALSE,
    current_distress_tier risk_tier_enum DEFAULT 'TIER_1_MILD',
    latest_dds_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
