from typing import List, Dict, Any, Optional

def calculate_longitudinal_trend(historical_snapshots: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes statistical rate-of-change (Delta) and anomaly flags over rolling window.
    Replaces unsupportable suicide forecasting with empirical velocity-of-change monitoring.
    """
    if not historical_snapshots:
        return {
            "score_delta_7d": 0.0,
            "anomaly_flag": False,
            "trend_direction": "INSUFFICIENT_DATA",
            "historical_points_analyzed": 0
        }
    
    # Sort chronologically
    sorted_snaps = sorted(historical_snapshots, key=lambda x: x.get("measured_at", ""))
    latest_score = sorted_snaps[-1].get("composite_dds_score", 0.0)
    
    if len(sorted_snaps) == 1:
        return {
            "score_delta_7d": 0.0,
            "anomaly_flag": False,
            "trend_direction": "BASELINE_ESTABLISHED",
            "historical_points_analyzed": 1
        }
        
    baseline_score = sorted_snaps[0].get("composite_dds_score", 0.0)
    delta_7d = round(latest_score - baseline_score, 2)
    
    # Sudden distress jump > 20 points within rolling period triggers anomaly review
    anomaly_flag = delta_7d >= 20.0
    
    if delta_7d > 5.0:
        trend_direction = "ESCALATING"
    elif delta_7d < -5.0:
        trend_direction = "IMPROVING"
    else:
        trend_direction = "STABLE"
        
    return {
        "score_delta_7d": delta_7d,
        "anomaly_flag": anomaly_flag,
        "trend_direction": trend_direction,
        "historical_points_analyzed": len(sorted_snaps),
        "audit_note": "Longitudinal trend anomaly detection; non-predictive statistical observation."
    }
