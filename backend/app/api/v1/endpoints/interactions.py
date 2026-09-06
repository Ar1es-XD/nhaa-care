from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.services.ai.listening_agent import process_citizen_turn, AgentTurnResponse
from app.services.ai.prosody_analyzer import analyze_audio_prosody
from app.core.audit import record_audit_event

router = APIRouter(prefix="/interactions", tags=["Omnichannel Interactions"])

class CitizenTurnRequest(BaseModel):
    case_id: str
    channel: str = "IVRS_OUTBOUND" # NHAA_14566, IVRS_OUTBOUND, WHATSAPP_BOT, WEB_PORTAL
    language: str = "hi"
    transcript: str
    audio_samples: Optional[List[float]] = None

@router.post("/process-turn", response_model=AgentTurnResponse)
def handle_citizen_turn(req: CitizenTurnRequest):
    """
    Ingests conversational audio/text turn from victim/complainant.
    - Runs safety guardrails and listening agent.
    - If audio is present, computes acoustic arousal features.
    - Logs audit trail for security without recording unencrypted PII.
    """
    response = process_citizen_turn(
        transcript=req.transcript,
        channel=req.channel,
        language=req.language
    )
    
    # Optional prosody analysis if audio waveform samples are transmitted
    prosody_data = None
    if req.audio_samples:
        prosody_data = analyze_audio_prosody(req.audio_samples)
        
    # If escalation triggered, log to audit ledger
    if response.requires_escalation and response.escalation_payload:
        record_audit_event(
            actor_user_id="SYSTEM_AI_ROUTER",
            actor_role="AUTOMATED_INGESTION_AGENT",
            action_type="EMERGENCY_COUNSELOR_ESCALATION_QUEUED",
            target_resource="CASE_RECORD",
            resource_id=req.case_id,
            details_json={
                "channel": req.channel,
                "reason": response.escalation_payload.reason,
                "flags": response.escalation_payload.flags,
                "prosody": prosody_data
            }
        )
        
    return response
