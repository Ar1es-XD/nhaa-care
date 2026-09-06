from fastapi import APIRouter
from typing import List
from app.api.v1.schemas.relief import ReliefStage

router = APIRouter(prefix="/relief", tags=["PoA Rule 12 Compensation"])

@router.get("/{case_id}", response_model=List[ReliefStage])
def get_relief_status(case_id: str):
    return [
        ReliefStage(
            stage_name="FIR_STAGE_25PCT",
            sanctioned_amount=212500.0,
            disbursed_amount=212500.0,
            is_disbursed=True,
            delay_days=0
        ),
        ReliefStage(
            stage_name="CHARGESHEET_STAGE_50PCT",
            sanctioned_amount=425000.0,
            disbursed_amount=0.0,
            is_disbursed=False,
            delay_days=14 # Past statutory 7-day rule
        ),
        ReliefStage(
            stage_name="CONVICTION_STAGE_25PCT",
            sanctioned_amount=212500.0,
            disbursed_amount=0.0,
            is_disbursed=False,
            delay_days=0
        )
    ]
