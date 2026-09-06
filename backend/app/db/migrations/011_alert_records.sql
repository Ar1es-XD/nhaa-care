-- Migration 011: Real-Time Risk Alerts with Human Triage Gate
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
