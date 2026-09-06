from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/analytics", tags=["Macro Analytics & Heatmaps"])

@router.get("/district-overview")
def get_district_overview() -> Dict[str, Any]:
    return {
        "active_cases_monitored": 1420,
        "critical_alerts_in_triage": 3,
        "human_verified_interventions_24h": 11,
        "rule12_compensation_compliance_pct": 84.5,
        "hotspot_police_stations": [
            {"station_name": "Sadar PS, Lucknow", "critical_cases": 2, "threat_trend": "ESCALATING"},
            {"station_name": "Malihabad PS, Lucknow", "critical_cases": 1, "threat_trend": "STABLE"}
        ]
    }
