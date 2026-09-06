from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health & GIGW Compliance"])

@router.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "active_model_version": settings.ACTIVE_MODEL_VERSION,
        "validation_status": settings.MODEL_VALIDATION_STATUS,
        "gigw_compliance": "GIGW 3.0 Standard Compliant",
        "wcag_level": "WCAG 2.1 AA",
        "dpdp_act_compliant": True
    }
