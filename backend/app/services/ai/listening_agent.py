import json
import re
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field

class EscalationPayload(BaseModel):
    handoff_type: str = "URGENT_HUMAN_COUNSELOR_ESCALATION"
    reason: str
    channel: str
    language: str
    verbatim_preserved_concern: str
    threat_disclosed: bool = False
    self_harm_disclosed: bool = False
    flags: Dict[str, bool] = Field(default_factory=dict)

class AgentTurnResponse(BaseModel):
    spoken_response: str
    requires_escalation: bool
    escalation_payload: Optional[EscalationPayload] = None
    offer_quick_exit: bool = False
    language_used: str

THREAT_KEYWORDS = [
    "threat", "intimidat", "kill", "burn", "withdraw", "compromise", 
    "gawah", "dhamki", "marenge", "jala", "barbaad", "marne", "police",
    "attack", "dar", "dar lag raha", "goli"
]

SELF_HARM_KEYWORDS = [
    "suicide", "khatam", "mar jana", "jeene ka man nahi", "end my life", "give up"
]

def process_citizen_turn(transcript: str, channel: str = "IVRS_OUTBOUND", language: str = "hi") -> AgentTurnResponse:
    """
    Evaluates citizen input against strict safety guardrails (Section 5.3).
    - AI is a listening and routing agent, never a clinician.
    - Preserves raw verbatim text and routes to human counselor immediately.
    - Zero clinical or diagnostic jargon.
    """
    clean_text = transcript.strip()
    lower_t = clean_text.lower()
    
    has_threat = any(kw in lower_t for kw in THREAT_KEYWORDS)
    has_self_harm = any(kw in lower_t for kw in SELF_HARM_KEYWORDS)
    
    # 1. Critical Threat or Self-Harm Disclosure -> Immediate Human Counselor Handoff
    if has_threat or has_self_harm:
        if language == "hi":
            spoken_text = (
                "Aapki aur aapke parivar ki suraksha sabse pehle hai. "
                "Main turant hamare varishth counselor ko aapki call connect kar raha hoon "
                "jo aapse abhi baat karenge aur suraksha ke liye aage ki sahayata karenge. "
                "Kripya line par bane rahein."
            )
        else:
            spoken_text = (
                "Your safety and well-being are our highest priority. "
                "I am immediately connecting you to our certified senior counselor who will "
                "speak with you right away and coordinate immediate support. Please stay on the line."
            )
        
        reason = "SELF_HARM_DISCLOSURE" if has_self_harm else "WITNESS_INTIMIDATION_OR_SAFETY_THREAT"
        
        return AgentTurnResponse(
            spoken_response=spoken_text,
            requires_escalation=True,
            escalation_payload=EscalationPayload(
                reason=reason,
                channel=channel,
                language=language,
                verbatim_preserved_concern=clean_text, # Verbatim preserved
                threat_disclosed=has_threat,
                self_harm_disclosed=has_self_harm,
                flags={
                    "witness_intimidation_disclosed": has_threat,
                    "self_harm_risk_disclosed": has_self_harm,
                    "immediate_human_triage_required": True
                }
            ),
            offer_quick_exit=False,
            language_used=language
        )
    
    # 2. Check for terse / monosyllabic cues indicating potential surveillance or lack of privacy
    words = clean_text.split()
    is_terse = len(words) <= 2 and clean_text != ""
    
    if language == "hi":
        spoken_text = "Hum aapki baat dhyan se sun rahe hain. Aap jo bhi mehsoos kar rahe hain, bina kisi sankoch ke batayein."
    else:
        spoken_text = "We are here listening to you with care. Please feel free to share whatever is on your mind."
        
    return AgentTurnResponse(
        spoken_response=spoken_text,
        requires_escalation=False,
        escalation_payload=None,
        offer_quick_exit=is_terse, # Offer quick exit proactively if person answers in single words
        language_used=language
    )
