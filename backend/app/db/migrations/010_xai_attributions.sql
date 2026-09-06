-- Migration 010: Explainable AI Attributions
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
