from pydantic import BaseModel, Field

class BreakGlassRequest(BaseModel):
    user_id: str
    user_role: str
    case_id: str
    fir_number: str
    district_code: str
    justification_reason: str = Field(..., min_length=50)
    mfa_otp: str
