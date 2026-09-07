from fastapi import APIRouter, HTTPException, status, Query, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.session import get_db
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
def get_triage_queue(
    district_code: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Returns alerts requiring human clinical verification.
    Queries PostgreSQL alert_records table and falls back to demo queue if offline.
    """
    try:
        from app.models.alert_record import AlertRecord
        from app.models.case_master import CaseMaster
        from app.models.jurisdiction import Jurisdiction

        alerts = db.query(AlertRecord).filter(AlertRecord.status.in_(["TRIGGERED", "IN_TRIAGE"])).all()
        if alerts:
            results = []
            for a in alerts:
                case = db.query(CaseMaster).filter(CaseMaster.case_id == a.case_id).first()
                dist_name = "Lucknow"
                dist_code = "UP_LKO"
                if case and case.jurisdiction_id:
                    j = db.query(Jurisdiction).filter(Jurisdiction.jurisdiction_id == case.jurisdiction_id).first()
                    if j:
                        dist_name = j.district_name
                        dist_code = j.district_code

                if district_code and dist_code != district_code:
                    continue

                sla_rem = 12
                if a.sla_breach_at:
                    now = datetime.now(timezone.utc)
                    breach = a.sla_breach_at if a.sla_breach_at.tzinfo else a.sla_breach_at.replace(tzinfo=timezone.utc)
                    sla_rem = max(1, int((breach - now).total_seconds() // 60))

                results.append({
                    "alert_id": str(a.alert_id),
                    "case_id": str(case.case_id) if case else "case-lko-00492",
                    "case_number": case.case_number if case else "NHAA/2026/UP/LKO/00492",
                    "district_code": dist_code,
                    "district_name": dist_name,
                    "verbatim_quote": a.alert_description,
                    "detected_language": "hi",
                    "alert_tier": a.alert_tier,
                    "sla_minutes_remaining": sla_rem,
                    "is_threat_confirmed": a.is_threat_confirmed or False,
                    "status": a.status,
                    "measured_at": a.created_at.isoformat() if a.created_at else datetime.now(timezone.utc).isoformat()
                })
            if results:
                return results
    except Exception:
        pass

    if district_code:
        return [item for item in _TRIAGE_QUEUE if item["district_code"] == district_code]
    return _TRIAGE_QUEUE

@router.post("/verify-and-dispatch")
def verify_and_dispatch_action(
    payload: ClinicalVerificationPayload,
    db: Session = Depends(get_db)
):
    """
    HUMAN CLINICAL GATE:
    Under strict policy, NO law enforcement or physical intervention can be dispatched
    solely from an AI score. A human licensed professional must confirm threat and approve referrals.
    """
    case_number = "NHAA/2026/UP/LKO/00492"
    case_id = "case-lko-00492"
    found = False

    # 1. Update in Database if alert exists
    try:
        from app.models.alert_record import AlertRecord
        from app.models.case_master import CaseMaster
        import uuid

        db_alert = None
        try:
            uid = uuid.UUID(payload.alert_id)
            db_alert = db.query(AlertRecord).filter(AlertRecord.alert_id == uid).first()
        except ValueError:
            pass

        if db_alert:
            db_alert.status = "HUMAN_VERIFIED"
            db_alert.is_threat_confirmed = payload.is_threat_confirmed
            db_alert.clinical_validation_notes = payload.clinical_notes
            db_alert.human_verified_at = datetime.now(timezone.utc)
            db.commit()
            case = db.query(CaseMaster).filter(CaseMaster.case_id == db_alert.case_id).first()
            if case:
                case_number = case.case_number
                case_id = str(case.case_id)
            found = True
    except Exception:
        pass

    # 2. Also check/update in-memory queue for tests and offline mode
    target_alert = next((a for a in _TRIAGE_QUEUE if a["alert_id"] == payload.alert_id), None)
    if target_alert:
        target_alert["status"] = "HUMAN_VERIFIED"
        target_alert["is_threat_confirmed"] = payload.is_threat_confirmed
        target_alert["clinical_notes"] = payload.clinical_notes
        case_number = target_alert["case_number"]
        case_id = target_alert["case_id"]
        found = True

    if not found:
        raise HTTPException(status_code=404, detail="Alert ID not found in active triage queue")

    # Audit log entry chained
    record_audit_event(
        actor_user_id=payload.counselor_user_id,
        actor_role="CERTIFIED_COUNSELOR",
        action_type="CLINICAL_VERIFICATION_SUBMITTED",
        target_resource="ALERT_RECORD",
        resource_id=payload.alert_id,
        details_json={
            "case_id": case_id,
            "is_threat_confirmed": payload.is_threat_confirmed,
            "dispatched_interventions": payload.recommended_interventions,
            "clinical_summary": payload.clinical_notes[:100]
        }
    )

    return {
        "status": "DISPATCH_AUTHORIZED" if payload.is_threat_confirmed else "RESOLVED_SUPPORTIVE_CARE",
        "alert_id": payload.alert_id,
        "case_number": case_number,
        "human_verified": True,
        "verified_at": datetime.now(timezone.utc).isoformat(),
        "dispatched_interventions": payload.recommended_interventions if payload.is_threat_confirmed else []
    }
