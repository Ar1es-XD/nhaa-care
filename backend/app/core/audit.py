import hashlib
import json
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

_AUDIT_LEDGER: List[Dict[str, Any]] = []

def compute_audit_hash(prev_hash: str, timestamp_iso: str, actor_id: str, action: str, resource: str, details: Dict[str, Any]) -> str:
    payload = f"{prev_hash}|{timestamp_iso}|{actor_id}|{action}|{resource}|{json.dumps(details, sort_keys=True)}"
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()

def record_audit_event(actor_user_id: str, actor_role: str, action_type: str, target_resource: str, resource_id: str, details_json: Dict[str, Any], ip_address: str = "127.0.0.1") -> Dict[str, Any]:
    prev_hash = _AUDIT_LEDGER[-1]["hash_checksum"] if _AUDIT_LEDGER else GENESIS_HASH
    timestamp_iso = datetime.now(timezone.utc).isoformat()
    
    hash_checksum = compute_audit_hash(
        prev_hash=prev_hash,
        timestamp_iso=timestamp_iso,
        actor_id=actor_user_id,
        action=action_type,
        resource=f"{target_resource}:{resource_id}",
        details=details_json
    )
    
    entry = {
        "audit_id": len(_AUDIT_LEDGER) + 1,
        "prev_hash": prev_hash,
        "actor_user_id": actor_user_id,
        "actor_role": actor_role,
        "ip_address": ip_address,
        "action_type": action_type,
        "target_resource": target_resource,
        "resource_id": resource_id,
        "details_json": details_json,
        "hash_checksum": hash_checksum,
        "timestamp": timestamp_iso
    }
    _AUDIT_LEDGER.append(entry)
    return entry

def verify_chain_integrity(records: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    chain = records if records is not None else _AUDIT_LEDGER
    if not chain:
        return {"is_valid": True, "records_checked": 0, "status": "EMPTY_CHAIN"}
    
    prev_hash = GENESIS_HASH
    for idx, record in enumerate(chain):
        if record["prev_hash"] != prev_hash:
            return {
                "is_valid": False,
                "broken_at_index": idx,
                "record_id": record.get("audit_id"),
                "reason": "Previous hash pointer mismatch (chain breakage or row reordering)"
            }
        
        expected_hash = compute_audit_hash(
            prev_hash=record["prev_hash"],
            timestamp_iso=record["timestamp"],
            actor_id=record["actor_user_id"],
            action=record["action_type"],
            resource=f"{record['target_resource']}:{record['resource_id']}",
            details=record["details_json"]
        )
        if record["hash_checksum"] != expected_hash:
            return {
                "is_valid": False,
                "broken_at_index": idx,
                "record_id": record.get("audit_id"),
                "reason": "Content hash verification mismatch (row content tampered)"
            }
        prev_hash = record["hash_checksum"]
        
    return {"is_valid": True, "records_checked": len(chain), "status": "VERIFIED_TAMPER_PROOF"}
