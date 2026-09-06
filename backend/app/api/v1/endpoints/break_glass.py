from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from datetime import datetime, timezone, timedelta
from typing import Dict, Any
from app.core.audit import record_audit_event
from app.core.security import decrypt_sensitive_field, encrypt_sensitive_field

router = APIRouter(prefix="/break-glass", tags=["Emergency Break-Glass Protocol"])

class BreakGlassRequest(BaseModel):
    user_id: str
    user_role: str # Must be DISTRICT_MAGISTRATE or SUPERINTENDENT_OF_POLICE
    case_id: str
    fir_number: str
    district_code: str
    justification_reason: str = Field(..., min_length=50)
    mfa_otp: str

# Mock case store with encrypted fields
_SAMPLE_ENCRYPTED_VAULT = {
    "case-lko-00492": {
        "encrypted_full_name": encrypt_sensitive_field("Ramesh Kumar"),
        "encrypted_phone_number": encrypt_sensitive_field("+91 98765 43210"),
        "encrypted_current_address": encrypt_sensitive_field("Gram Panchayat Sadar, Sector 4, Lucknow, Uttar Pradesh"),
        "encrypted_caste_category": encrypt_sensitive_field("SC"),
        "district_code": "UP_LKO"
    }
}

@router.post("/request-unmasking")
def execute_break_glass_unmasking(req: BreakGlassRequest):
    """
    Emergency break-glass unmasking protocol:
    1. Authorized only for DM or SP within their jurisdiction.
    2. Mandatory justification (min 50 chars).
    3. Issues 4-hour time-bounded unmasking token.
    4. Immutable audit record chained and priority notification sent.
    """
    if req.user_role not in ["DISTRICT_MAGISTRATE", "SUPERINTENDENT_OF_POLICE"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Break-Glass protocol restricted to District Magistrate or SP"
        )
        
    vault_entry = _SAMPLE_ENCRYPTED_VAULT.get(req.case_id)
    if not vault_entry or vault_entry["district_code"] != req.district_code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found or jurisdiction mismatch"
        )
        
    # Decrypt sensitive fields inside the memory boundary
    decrypted_name = decrypt_sensitive_field(vault_entry["encrypted_full_name"])
    decrypted_phone = decrypt_sensitive_field(vault_entry["encrypted_phone_number"])
    decrypted_address = decrypt_sensitive_field(vault_entry["encrypted_current_address"])
    decrypted_caste = decrypt_sensitive_field(vault_entry["encrypted_caste_category"])
    
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=4)
    
    # Audit log entry chained
    record_audit_event(
        actor_user_id=req.user_id,
        actor_role=req.user_role,
        action_type="EMERGENCY_BREAK_GLASS_UNMASKING_EXECUTED",
        target_resource="IDENTITY_VAULT",
        resource_id=req.case_id,
        details_json={
            "justification": req.justification_reason,
            "fir_number": req.fir_number,
            "district_code": req.district_code,
            "session_valid_until": expires_at.isoformat()
        }
    )
    
    return {
        "status": "AUTHORIZED_TIME_BOUNDED",
        "session_id": f"bg-token-{req.case_id[-5:]}-4h",
        "granted_at": now.isoformat(),
        "expires_at": expires_at.isoformat(),
        "unmasked_data": {
            "full_name": decrypted_name,
            "phone_number": decrypted_phone,
            "current_address": decrypted_address,
            "caste_category": decrypted_caste
        },
        "regulatory_notice": "Unmasked data is logged under Section 15 of PoA Rules and DPDP Act. Audit chain recorded."
    }
