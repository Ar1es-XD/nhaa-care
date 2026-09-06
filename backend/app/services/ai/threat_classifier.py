import re
from typing import Dict, Any, List

THREAT_TERMS = {
    "violent_coercion": ["goli", "dhamki", "marenge", "jala", "attack", "kill", "threat", "burn"],
    "witness_tampering": ["gawah", "withdraw", "compromise", "case band", "wapas", "faisla"],
    "social_boycott": ["ration", "pani", "hukka", "boycott", "no work", "dukan"]
}

def classify_threat_signals(text: str) -> Dict[str, Any]:
    lower_text = text.lower()
    detected_categories = []
    matched_tokens = []
    
    for category, tokens in THREAT_TERMS.items():
        for t in tokens:
            if t in lower_text:
                if category not in detected_categories:
                    detected_categories.append(category)
                matched_tokens.append(t)
                
    threat_density = min(len(matched_tokens) * 25.0, 100.0)
    
    return {
        "threat_intimidation_marker": threat_density,
        "detected_categories": detected_categories,
        "matched_tokens": list(set(matched_tokens)),
        "threat_flag": len(detected_categories) > 0
    }
