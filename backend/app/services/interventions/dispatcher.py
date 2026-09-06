from typing import Dict, Any, List
from datetime import datetime, timezone

def dispatch_inter_agency_action(
    intervention_type: str,
    case_id: str,
    case_number: str,
    district_code: str,
    clinical_notes: str
) -> Dict[str, Any]:
    # Routing map for target departmental nodal authority
    ROUTING_MAP = {
        "WITNESS_POLICE_PROTECTION": ("SUPERINTENDENT_OF_POLICE", "SC/ST Protection Cell, District Police"),
        "EMERGENCY_RELOCATION": ("DISTRICT_MAGISTRATE", "District Collectorate Rehabilitation Wing"),
        "LEGAL_AID_DLSA": ("DLSA_SECRETARY", "District Legal Services Authority"),
        "COMPENSATION_FASTTRACK": ("DISTRICT_WELFARE_OFFICER", "Social Welfare Department"),
        "PSYCHIATRIC_REFERRAL": ("HEALTH_OFFICER", "District Civil Hospital / Tele-MANAS"),
        "CRISIS_TELE_COUNSELING": ("CERTIFIED_COUNSELOR", "NHAA Psychological Support Wing")
    }
    
    target_role, dept_name = ROUTING_MAP.get(
        intervention_type, 
        ("DISTRICT_MAGISTRATE", "District Collectorate")
    )
    
    dispatch_ref = f"NHAA-DISP-{case_id[-6:].upper()}-{int(datetime.now(timezone.utc).timestamp())}"
    
    return {
        "dispatch_reference": dispatch_ref,
        "intervention_type": intervention_type,
        "target_authority": target_role,
        "department_name": dept_name,
        "case_id": case_id,
        "case_number": case_number,
        "district_code": district_code,
        "status": "DISPATCHED_TO_AUTHORITY",
        "dispatched_at": datetime.now(timezone.utc).isoformat(),
        "clinical_brief": clinical_notes[:120]
    }
