-- Migration 009: Longitudinal Distress Snapshots with Model Lineage
CREATE TABLE distress_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interaction_sessions(session_id),
    case_id UUID NOT NULL REFERENCES case_master(case_id),
    measured_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    composite_dds_score NUMERIC(5,2) NOT NULL CHECK (composite_dds_score >= 0 AND composite_dds_score <= 100),
    risk_tier risk_tier_enum NOT NULL,
    voice_stress_index NUMERIC(5,2),
    nlp_sentiment_score NUMERIC(5,2),
    anxiety_score NUMERIC(5,2),
    depression_score NUMERIC(5,2),
    threat_intimidation_marker NUMERIC(5,2),
    score_delta_7d NUMERIC(5,2),
    anomaly_flag BOOLEAN DEFAULT FALSE,
    model_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.0-research',
    validation_status VARCHAR(50) NOT NULL DEFAULT 'EXPERIMENTAL_UNVALIDATED',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_distress_snapshots_case_time ON distress_snapshots(case_id, measured_at DESC);
