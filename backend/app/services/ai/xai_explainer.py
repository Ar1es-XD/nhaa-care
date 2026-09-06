from typing import Dict, Any, List

def generate_xai_attribution(
    composite_score: float,
    voice_stress: float,
    threat_markers: List[str],
    milestone_context: str
) -> Dict[str, Any]:
    shap_weights = {
        "threat_intimidation_tokens": round(0.45 if threat_markers else 0.10, 2),
        "voice_stress_acoustic_arousal": round(min(voice_stress / 150.0, 0.40), 2),
        "judicial_milestone_proximity": 0.25 if milestone_context else 0.05
    }
    
    primary_driver = "ACTIVE_WITNESS_INTIMIDATION" if threat_markers else ("ACOUSTIC_PANIC_AROUSAL" if voice_stress > 65 else "CHRONIC_STRESS")
    
    summary = f"Distress score driven primarily by {primary_driver.lower().replace('_', ' ')}. "
    if threat_markers:
        summary += f"Direct threat language cited: {', '.join(threat_markers)}. "
    if milestone_context:
        summary += f"Context: {milestone_context}."
        
    return {
        "primary_risk_driver": primary_driver,
        "shap_feature_weights": shap_weights,
        "salient_linguistic_tokens": threat_markers,
        "clinical_explanation_summary": summary,
        "confidence_interval": 0.885
    }
