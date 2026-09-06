from typing import Dict, Any

def score_adapted_phq4(answers: Dict[str, int]) -> Dict[str, Any]:
    # answers: dict with keys q1, q2 (depression), q3, q4 (anxiety), values 0-3
    q1 = answers.get("little_interest", 0)
    q2 = answers.get("feeling_down", 0)
    q3 = answers.get("nervous_anxious", 0)
    q4 = answers.get("worrying_too_much", 0)
    
    dep_score = min(max(q1 + q2, 0), 6)
    anx_score = min(max(q3 + q4, 0), 6)
    total = dep_score + anx_score
    
    return {
        "phq4_total": total,
        "depression_subscore": dep_score,
        "anxiety_subscore": anx_score,
        "is_screen_positive": total >= 3,
        "clinical_note": "Preliminary screener adaptation; indicates referral eligibility, not formal psychiatric diagnosis."
    }
