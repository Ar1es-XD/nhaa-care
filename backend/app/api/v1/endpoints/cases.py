from fastapi import APIRouter, Query
from typing import List, Optional
from datetime import date
from app.api.v1.schemas.cases import CaseSummary

router = APIRouter(prefix="/cases", tags=["Case Master"])

_SAMPLE_CASES = [
    CaseSummary(
        case_id="case-lko-00492",
        case_number="NHAA/2026/UP/LKO/00492",
        fir_number="FIR-482/2026",
        district_name="Lucknow",
        district_code="UP_LKO",
        act_sections=["3(1)(r)", "3(1)(s)", "3(2)(v)"],
        incident_date=date(2026, 8, 14),
        case_status="UNDER_INVESTIGATION",
        current_distress_tier="TIER_4_CRITICAL",
        latest_dds_score=88.50
    ),
    CaseSummary(
        case_id="case-ngp-00118",
        case_number="NHAA/2026/MH/NGP/00118",
        fir_number="FIR-109/2026",
        district_name="Nagpur",
        district_code="MH_NGP",
        act_sections=["3(1)(r)", "3(1)(w)"],
        incident_date=date(2026, 8, 20),
        case_status="CHARGESHEET_FILED",
        current_distress_tier="TIER_3_HIGH",
        latest_dds_score=64.20
    )
]

@router.get("", response_model=List[CaseSummary])
def list_cases(district_code: Optional[str] = Query(None)):
    if district_code:
        return [c for c in _SAMPLE_CASES if c.district_code == district_code]
    return _SAMPLE_CASES
