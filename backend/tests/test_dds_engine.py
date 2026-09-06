import pytest
from app.services.ai.dds_engine import compute_dynamic_distress_score

def test_dds_critical_tier_assignment():
    res = compute_dynamic_distress_score(voice_arousal=85.0, threat_score=75.0, clinical_screener_score=10.0, milestone_modifier=15.0)
    assert res["risk_tier"] == "TIER_4_CRITICAL"
    assert res["requires_human_triage"] is True
    assert res["validation_status"] == "RESEARCH_PROTOTYPE_UNVALIDATED"

def test_dds_mild_tier_assignment():
    res = compute_dynamic_distress_score(voice_arousal=15.0, threat_score=0.0, clinical_screener_score=2.0)
    assert res["risk_tier"] == "TIER_1_MILD"
    assert res["requires_human_triage"] is False
