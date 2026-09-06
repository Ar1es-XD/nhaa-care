from pydantic import BaseModel, EmailStr
from typing import Optional

class UserClaims(BaseModel):
    user_id: str
    full_name: str
    email: EmailStr
    role: str
    district_code: Optional[str] = None
    department: str

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_seconds: int = 900
    user: UserClaims
