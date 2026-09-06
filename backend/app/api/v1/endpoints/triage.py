from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from app.core.audit import record_audit_event

router = APIRouter(prefix="/triage", tags=["Clinical Triage & Verification"])

# Mock in-memory triage queue for demonstration
_TRIAGE_QUEUE = [
    {
        "alert_id": "alt-9041",
        "case_id": "case-lko-00492",
        "case_number": "NHAA/2026/UP/LKO/00492",
        "district_code": "UP_LKO",
        "district_name": "Lucknow",
        "verbatim_quote": "kal shaam ko unke aadmi aaye the. Bole ki gawaahi wapas le le nahi toh ghar jala denge. Hum bahut dare hue hain, bache ro rahe hain.",
        "detected_language": "hi",
        "alert_tier": "TIER_4_CRITICAL",
        "sla_minutes_remaining": 12,
        "is_threat_confirmed": False,
        "status": "IN_TRIAGE",
        "measured_at": "2026-09-06T17:15:00Z"
    },
    {
        "alert_id": "alt-9042",
        "case_id": "case-ngp-00118",
        "case_number": "NHAA/2026/MH/NGP/00118",
        "district_code": "MH_NGP",
        "district_name": "Nagpur",
        "verbatim_quote": "Village shopkeeper refused to sell ration after FIR. Nobody is talking to us. We have no food for tomorrow.",
        "detected_language": "en",
        "alert_tier": "TIER_3_HIGH",
        "sla_minutes_remaining": 45,
        "is_threat_confirmed": False,
        "status": "IN_TRIAGE",
        "measured_at": "2026-09-06T18:00:00Z"
    }
]

class ClinicalVerificationPayload(BaseModel):
    alert_id: str
    counselor_user_id: str = "COUNSELOR_DR_MITTAL"
    clinical_notes: str = Field(..., min_length=20)
    is_threat_confirmed: bool
    recommended_interventions: List[str] = Field(default_factory=list) # e.g. ['WITNESS_POLICE_PROTECTION', 'EMERGENCY_RELOCATION', 'LEGAL_AID_DLSA']

@router.get("/queue", response_model=List[Dict[str, Any]])
def get_triage_queue(district_code: Optional[str] = Query(None)):
    """Returns alerts requiring human clinical verification."""
    if district_code:
        return [item for item in _TRIAGE_QUEUE if item["district_code"] == district_code]
    return _TRIAGE_QUEUE

@router.post("/verify-and-dispatch")
def verify_and_dispatch_action(payload: ClinicalVerificationPayload):
    """
    HUMAN CLINICAL GATE:
    Under strict policy, NO law enforcement or physical intervention can be dispatched
    solely from an AI score. A human licensed professional must confirm threat and approve referrals.
    """
    target_alert = next((a for a in _TRIAGE_QUEUE if a["alert_id"] == payload.alert_id), None)
    if not target_alert:
        raise HTTPException(status_code=404, detail="Alert ID not found in active triage queue")
        
    target_alert["status"] = "HUMAN_VERIFIED"
    target_alert["is_threat_confirmed"] = payload.is_threat_confirmed
    target_alert["clinical_notes"] = payload.clinical_notes
    
    # Audit log entry chained
    record_audit_event(
        actor_user_id=payload.counselor_user_id,
        actor_role="CERTIFIED_COUNSELOR",
        action_type="CLINICAL_VERIFICATION_SUBMITTED",
        target_resource="ALERT_RECORD",
        resource_id=payload.alert_id,
        details_json={
            "case_id": target_alert["case_id"],
            "is_threat_confirmed": payload.is_threat_confirmed,
            "dispatched_interventions": payload.recommended_interventions,
            "clinical_summary": payload.clinical_notes[:100]
        }
    )
    
    return {
        "status": "DISPATCH_AUTHORIZED" if payload.is_threat_confirmed else "RESOLVED_SUPPORTIVE_CARE",
        "alert_id": payload.alert_id,
        "case_number": target_alert["case_number"],
        "human_verified": True,
        "verified_at": datetime.now(timezone.utc).isoformat(),
        "dispatched_interventions": payload.recommended_interventions if payload.is_threat_confirmed else []
    }
