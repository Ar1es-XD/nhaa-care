import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_triage_queue():
    resp = client.get("/api/v1/triage/queue")
    assert resp.status_code == 200
    items = resp.json()
    assert len(items) >= 2

def test_clinical_verification_and_dispatch():
    payload = {
        "alert_id": "alt-9041",
        "counselor_user_id": "DR_SUNITA_SHARMA",
        "clinical_notes": "Conducted emergency clinical assessment call. Witness confirmed explicit arson threat from accused affiliates.",
        "is_threat_confirmed": True,
        "recommended_interventions": ["WITNESS_POLICE_PROTECTION", "EMERGENCY_RELOCATION"]
    }
    resp = client.post("/api/v1/triage/verify-and-dispatch", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "DISPATCH_AUTHORIZED"
    assert data["human_verified"] is True
    assert "WITNESS_POLICE_PROTECTION" in data["dispatched_interventions"]
