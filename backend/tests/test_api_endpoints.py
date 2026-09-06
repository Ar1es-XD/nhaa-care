import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health_endpoints():
    r1 = client.get("/")
    assert r1.status_code == 200
    assert "GIGW 3.0" in r1.json()["standards"]
    
    r2 = client.get("/api/v1/health")
    assert r2.status_code == 200
    assert r2.json()["status"] == "HEALTHY"
    assert r2.json()["dpdp_act_compliant"] is True

def test_case_listing_endpoint():
    resp = client.get("/api/v1/cases")
    assert resp.status_code == 200
    cases = resp.json()
    assert len(cases) >= 2

def test_audit_verify_endpoint():
    resp = client.get("/api/v1/audit/verify-chain")
    assert resp.status_code == 200
    assert resp.json()["is_valid"] is True
