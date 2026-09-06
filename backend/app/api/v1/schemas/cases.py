from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class CaseSummary(BaseModel):
    case_id: str
    case_number: str
    fir_number: Optional[str] = None
    district_name: str
    district_code: str
    act_sections: List[str]
    incident_date: date
    case_status: str
    current_distress_tier: str
    latest_dds_score: float
