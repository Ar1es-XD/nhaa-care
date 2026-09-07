import json
import os
import re
import ssl
import urllib.request
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

def generate_openai_reflection(transcript: str, language: str = "hi") -> Optional[str]:
    """
    Calls OpenAI Chat Completions API (gpt-4o-mini) to generate trauma-informed reflections.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    try:
        url = "https://api.openai.com/v1/chat/completions"
        system_prompt = (
            "You are Sahaara AI, a gentle, trauma-informed mental wellness listening companion in India. "
            "Your role is to support citizens, complainants, and families who are experiencing stress, anxiety, or hardship under the SC/ST framework.\n"
            "CRITICAL RULES:\n"
            "1. Warmth & Dignity: Always treat the person with unconditional respect, kindness, and validation.\n"
            "2. No Clinical Diagnoses: NEVER diagnose mental illnesses, quote psychiatric labels, or prescribe medications.\n"
            f"3. Language: Respond in {'comforting Hindi or Hinglish' if language == 'hi' else 'English'}.\n"
            "4. Grounding: Provide practical, calming guidance. Keep it gentle, supportive, and concise (1-2 short paragraphs)."
        )
        payload = json.dumps({
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Citizen shared: {transcript}"}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }).encode("utf-8")
        
        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
        )
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, context=ctx, timeout=6) as res:
            res_json = json.loads(res.read().decode("utf-8"))
            content = res_json.get("choices", [{}])[0].get("message", {}).get("content")
            return content.strip() if content else None
    except Exception:
        return None

def generate_gemini_reflection(transcript: str, language: str = "hi") -> Optional[str]:
    """
    Calls Google Gemini 3.6 Flash to generate trauma-informed, empathetic responses.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"
        prompt = (
            "You are Sahaara AI, an empathetic, soothing mental health listening companion for victims under the SC/ST framework in India. "
            f"Respond warmly and with dignity in {'Hindi' if language == 'hi' else 'English'}. Never give clinical diagnoses. Keep it gentle and grounding. "
            f"Citizen shared: {transcript}"
        )
        data = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, context=ctx, timeout=6) as res:
            res_json = json.loads(res.read().decode("utf-8"))
            return res_json["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        return None

def generate_dynamic_reflection(transcript: str, language: str = "hi") -> str:
    """
    Empathetic dynamic fallback when external AI quota is unavailable.
    """
    snippet = transcript[:80] + ("..." if len(transcript) > 80 else "")
    if language == "hi" or re.search(r"[\u0900-\u097f]", transcript):
        return (
            f"हमने आपकी बात बहुत ध्यान और संवेदनशीलता से सुनी: \"{snippet}\"। "
            "इस समय मन में तनाव या चिंता होना पूरी तरह से स्वाभाविक है। स्वयं पर कोई दबाव न डालें। "
            "सहारा आपके साथ एक सुरक्षित साथी की तरह उपस्थित है। गहरी सांस लें, हम आपकी बात सुनने के लिए हमेशा यहाँ हैं।"
        )
    return (
        f"We hear your words with deep presence and care: \"{snippet}\". "
        "It is completely understandable to feel the weight of this right now. Please be gentle with yourself. "
        "Take a slow, calming breath. Sahaara is here with you as a safe sanctuary."
    )

def generate_llm_reflection(transcript: str, language: str = "hi") -> str:
    """
    Orchestrates LLM response: OpenAI -> Gemini -> Empathetic Dynamic Engine.
    """
    openai_res = generate_openai_reflection(transcript, language)
    if openai_res:
        return openai_res
        
    gemini_res = generate_gemini_reflection(transcript, language)
    if gemini_res:
        return gemini_res
        
    return generate_dynamic_reflection(transcript, language)

THREAT_KEYWORDS = [
    "threat", "intimidat", "kill", "burn", "withdraw", "compromise", 
    "gawah", "dhamki", "marenge", "jala", "barbaad", "marne", "police",
    "attack", "dar", "dar lag raha", "goli"
]

SELF_HARM_KEYWORDS = [
    "suicide", "khatam", "mar jana", "jeene ka man nahi", "end my life", "give up"
]

def process_citizen_turn(
    transcript: str, 
    channel: str = "IVRS_OUTBOUND", 
    language: str = "hi",
    use_llm: bool = False
) -> AgentTurnResponse:
    """
    Evaluates citizen input against strict safety guardrails (Section 5.3).
    - AI is a listening and routing agent, never a clinician.
    - Preserves raw verbatim text and routes to human counselor immediately.
    - Zero clinical or diagnostic jargon.
    - Can invoke Gemini LLM for supportive empathetic dialogue.
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
    
    if use_llm and not is_terse:
        spoken_text = generate_llm_reflection(clean_text, language)
    elif language == "hi":
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
