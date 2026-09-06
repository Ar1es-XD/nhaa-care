from pydantic import BaseModel
from typing import Optional
from datetime import date

class ReliefStage(BaseModel):
    stage_name: str
    sanctioned_amount: float
    disbursed_amount: float
    is_disbursed: bool
    delay_days: int
