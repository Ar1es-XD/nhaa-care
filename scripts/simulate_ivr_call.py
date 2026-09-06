import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def simulate_call(phrase, lang="hi"):
    payload = {
        "case_id": "case-lko-00492",
        "channel": "IVRS_OUTBOUND",
        "language": lang,
        "transcript": phrase
    }
    print(f"Simulating IVR inbound phrase: '{phrase}' ({lang})")
    try:
        resp = requests.post(f"{BASE_URL}/interactions/process-turn", json=payload)
        print("Agent Spoken Response:", resp.json().get("spoken_response"))
        print("Escalation Triggered:", resp.json().get("requires_escalation"))
    except Exception as e:
        print("Backend not running or error:", e)

if __name__ == "__main__":
    simulate_call("kal unke log dhamki dekar gaye hain")
