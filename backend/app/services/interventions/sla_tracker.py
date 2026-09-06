from datetime import datetime, timezone, timedelta
from typing import Dict, Any

SLA_LIMITS = {
    "TIER_4_CRITICAL": timedelta(minutes=15),
    "TIER_3_HIGH": timedelta(minutes=45),
    "TIER_2_MODERATE": timedelta(hours=4),
    "TIER_1_MILD": timedelta(hours=24)
}

def calculate_sla_status(triggered_at: datetime, alert_tier: str) -> Dict[str, Any]:
    now = datetime.now(timezone.utc)
    limit = SLA_LIMITS.get(alert_tier, timedelta(hours=4))
    deadline = triggered_at + limit
    
    is_breached = now > deadline
    remaining_secs = max(0, int((deadline - now).total_seconds()))
    
    return {
        "alert_tier": alert_tier,
        "triggered_at": triggered_at.isoformat(),
        "sla_deadline": deadline.isoformat(),
        "is_breached": is_breached,
        "minutes_remaining": remaining_secs // 60,
        "escalation_required": is_breached
    }
