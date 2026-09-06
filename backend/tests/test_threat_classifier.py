import pytest
from app.services.ai.threat_classifier import classify_threat_signals

def test_threat_classification_tokens():
    text = "they threatened to attack our house and told us to withdraw the case"
    res = classify_threat_signals(text)
    assert res["threat_flag"] is True
    assert "violent_coercion" in res["detected_categories"]
    assert "witness_tampering" in res["detected_categories"]
    assert "attack" in res["matched_tokens"]
