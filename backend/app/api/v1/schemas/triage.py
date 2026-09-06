from pydantic import BaseModel, Field
from typing import List, Optional

class TriageActionRequest(BaseModel):
    alert_id: str
    clinical_notes: str = Field(..., min_length=20)
    is_threat_confirmed: bool
    recommended_interventions: List[str] = Field(default_factory=list)
