-- Migration 012: Closed-Loop Intervention Actions
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
