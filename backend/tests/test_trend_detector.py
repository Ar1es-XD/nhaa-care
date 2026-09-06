import pytest
from app.services.ai.trend_detector import calculate_longitudinal_trend

def test_trend_anomaly_flag():
    history = [
        {"measured_at": "2026-08-20T10:00:00Z", "composite_dds_score": 42.0},
        {"measured_at": "2026-08-27T10:00:00Z", "composite_dds_score": 78.5}
    ]
    res = calculate_longitudinal_trend(history)
    assert res["anomaly_flag"] is True
    assert res["score_delta_7d"] == 36.5
    assert res["trend_direction"] == "ESCALATING"
