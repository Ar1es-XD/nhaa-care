import pytest
from app.services.ai.clinical_screener import score_adapted_phq4

def test_adapted_phq4_scoring():
    answers = {
        "little_interest": 2,
        "feeling_down": 3,
        "nervous_anxious": 1,
        "worrying_too_much": 2
    }
    res = score_adapted_phq4(answers)
    assert res["phq4_total"] == 8
    assert res["depression_subscore"] == 5
    assert res["anxiety_subscore"] == 3
    assert res["is_screen_positive"] is True
