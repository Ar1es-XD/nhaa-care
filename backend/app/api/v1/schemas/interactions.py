from pydantic import BaseModel
from typing import Optional, List

class InteractionTurnRequest(BaseModel):
    case_id: str
    channel: str = "IVRS_OUTBOUND"
    language: str = "hi"
    transcript: str
    audio_samples: Optional[List[float]] = None
