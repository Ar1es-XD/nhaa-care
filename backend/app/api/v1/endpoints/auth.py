from fastapi import APIRouter
from app.api.v1.schemas.auth import AuthTokenResponse, UserClaims

router = APIRouter(prefix="/auth", tags=["Authentication & SSO"])

@router.post("/meripehchan/callback", response_model=AuthTokenResponse)
def meripehchan_sso_callback(auth_code: str):
    return AuthTokenResponse(
        access_token="mock-jwt-token-janparichay-verified",
        user=UserClaims(
            user_id="user-counselor-01",
            full_name="Dr. Sunita Sharma",
            email="s.sharma@nhaa.gov.in",
            role="CERTIFIED_COUNSELOR",
            district_code="UP_LKO",
            department="Social Welfare & Helpline Care"
        )
    )
