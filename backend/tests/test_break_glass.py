import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_break_glass_unauthorized_role():
    payload = {
        "user_id": "counselor-01",
        "user_role": "CERTIFIED_COUNSELOR",
        "case_id": "case-lko-00492",
        "fir_number": "FIR-482/2026",
        "district_code": "UP_LKO",
        "justification_reason": "Need to contact the victim immediately because of threat.",
        "mfa_otp": "123456"
    }
    resp = client.post("/api/v1/break-glass/request-unmasking", json=payload)
    assert resp.status_code == 403

def test_break_glass_short_justification_fails():
    payload = {
        "user_id": "dm-01",
        "user_role": "DISTRICT_MAGISTRATE",
        "case_id": "case-lko-00492",
        "fir_number": "FIR-482/2026",
        "district_code": "UP_LKO",
        "justification_reason": "Too short reason",
        "mfa_otp": "123456"
    }
    resp = client.post("/api/v1/break-glass/request-unmasking", json=payload)
    assert resp.status_code == 422 # Pydantic min_length validation

def test_break_glass_success():
    payload = {
        "user_id": "dm-01",
        "user_role": "DISTRICT_MAGISTRATE",
        "case_id": "case-lko-00492",
        "fir_number": "FIR-482/2026",
        "district_code": "UP_LKO",
        "justification_reason": "Armed retaliation mob reported outside witness hamlet requiring immediate transit evacuation order.",
        "mfa_otp": "894120"
    }
    resp = client.post("/api/v1/break-glass/request-unmasking", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "AUTHORIZED_TIME_BOUNDED"
    assert data["unmasked_data"]["full_name"] == "Ramesh Kumar"
    assert data["unmasked_data"]["caste_category"] == "SC"
