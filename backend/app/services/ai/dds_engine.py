from typing import Dict, Any

def compute_dynamic_distress_score(
    voice_arousal: float, 
    threat_score: float, 
    clinical_screener_score: float, 
    milestone_modifier: float = 0.0
) -> Dict[str, Any]:
    # CLINICAL RESEARCH PROTOTYPE:
    # Explicitly labeled as unvalidated exploratory research index.
    w1, w2, w3, w4 = 0.25, 0.35, 0.25, 0.15
    norm_clin = (clinical_screener_score / 12.0) * 100.0
    
    raw_composite = (w1 * voice_arousal) + (w2 * threat_score) + (w3 * norm_clin) + (w4 * milestone_modifier)
    composite = round(min(max(raw_composite, 0.0), 100.0), 2)
    
    if composite >= 75.0 or threat_score >= 50.0:
        tier = "TIER_4_CRITICAL"
    elif composite >= 50.0:
        tier = "TIER_3_HIGH"
    elif composite >= 25.0:
        tier = "TIER_2_MODERATE"
    else:
        tier = "TIER_1_MILD"
        
    return {
        "composite_dds_score": composite,
        "risk_tier": tier,
        "weights_used": {"voice": w1, "threat": w2, "clinical": w3, "milestone": w4},
        "model_version": "v1.0.2-research-calibrated",
        "validation_status": "RESEARCH_PROTOTYPE_UNVALIDATED",
        "requires_human_triage": tier in ["TIER_3_HIGH", "TIER_4_CRITICAL"]
    }
