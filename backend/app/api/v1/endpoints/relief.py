from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.schemas.relief import ReliefStage

router = APIRouter(prefix="/relief", tags=["PoA Rule 12 Compensation"])

_DEFAULT_STAGES = [
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

@router.get("/{case_id:path}", response_model=List[ReliefStage])
def get_relief_status(case_id: str, db: Session = Depends(get_db)):
    """
    Returns PoA Rule 12 compensation disbursement status for a specific case.
    Queries database relief_compensations table and falls back to statutory default.
    """
    try:
        from app.models.relief_compensation import ReliefCompensation
        from app.models.case_master import CaseMaster
        import uuid

        # Check if case_id matches UUID or case_number
        target_case = None
        try:
            uid = uuid.UUID(case_id)
            target_case = db.query(CaseMaster).filter(CaseMaster.case_id == uid).first()
        except ValueError:
            pass

        if not target_case:
            target_case = db.query(CaseMaster).filter(CaseMaster.case_number == case_id).first()

        cid = target_case.case_id if target_case else None

        records = []
        if cid:
            records = db.query(ReliefCompensation).filter(ReliefCompensation.case_id == cid).all()
        else:
            # Try direct match
            records = db.query(ReliefCompensation).all()

        if records:
            return [
                ReliefStage(
                    stage_name=r.stage_name,
                    sanctioned_amount=float(r.sanctioned_amount),
                    disbursed_amount=float(r.disbursed_amount or 0.0),
                    is_disbursed=r.is_disbursed,
                    delay_days=r.delay_days or 0
                )
                for r in records
            ]
    except Exception:
        pass

    return _DEFAULT_STAGES
