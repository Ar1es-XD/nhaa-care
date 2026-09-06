-- Migration 013: PoA Rule 12 Relief & Compensation Tracking
CREATE TABLE relief_compensations (
    relief_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    stage_name VARCHAR(100) NOT NULL,
    sanctioned_amount NUMERIC(12,2) NOT NULL,
    disbursed_amount NUMERIC(12,2) DEFAULT 0.00,
    dbt_transaction_reference VARCHAR(100),
    is_disbursed BOOLEAN DEFAULT FALSE,
    disbursed_date DATE,
    delay_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
