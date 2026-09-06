import pytest
from app.core.audit import record_audit_event, verify_chain_integrity, compute_audit_hash, GENESIS_HASH

def test_audit_hash_chain_creation_and_integrity():
    rec1 = record_audit_event("officer-01", "DISTRICT_MAGISTRATE", "VIEW_CASE", "CASE", "case-01", {"action": "review"})
    rec2 = record_audit_event("officer-02", "SUPERINTENDENT_OF_POLICE", "UPDATE_PROTECTION", "CASE", "case-01", {"action": "patrol"})
    
    res = verify_chain_integrity()
    assert res["is_valid"] is True
    assert res["records_checked"] >= 2

def test_audit_chain_tamper_detection():
    chain = [
        {
            "audit_id": 1,
            "prev_hash": GENESIS_HASH,
            "timestamp": "2026-09-06T10:00:00Z",
            "actor_user_id": "user-1",
            "action_type": "LOGIN",
            "target_resource": "AUTH",
            "resource_id": "session-1",
            "details_json": {"status": "ok"},
            "hash_checksum": ""
        }
    ]
    chain[0]["hash_checksum"] = compute_audit_hash(
        chain[0]["prev_hash"], chain[0]["timestamp"], chain[0]["actor_user_id"],
        chain[0]["action_type"], f"{chain[0]['target_resource']}:{chain[0]['resource_id']}",
        chain[0]["details_json"]
    )
    
    # Tamper with content
    chain[0]["details_json"]["status"] = "tampered"
    res = verify_chain_integrity(chain)
    assert res["is_valid"] is False
    assert "mismatch" in res["reason"]
