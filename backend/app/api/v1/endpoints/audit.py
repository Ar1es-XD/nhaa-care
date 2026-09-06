from fastapi import APIRouter
from app.core.audit import verify_chain_integrity

router = APIRouter(prefix="/audit", tags=["Audit & Legal Defensibility"])

@router.get("/verify-chain")
def verify_audit_ledger():
    return verify_chain_integrity()
