import pytest
import numpy as np
from app.services.ai.prosody_analyzer import analyze_audio_prosody

def test_prosody_analysis_arousal():
    # Simulated waveform with tremors
    t = np.linspace(0, 1.0, 16000)
    waveform = np.sin(2 * np.pi * 220 * t) + 0.5 * np.random.normal(0, 1, 16000)
    res = analyze_audio_prosody(waveform, 16000)
    
    assert "voice_stress_arousal_index" in res
    assert 0.0 <= res["voice_stress_arousal_index"] <= 100.0
    assert "clinical_caveat" in res

def test_prosody_empty_audio():
    res = analyze_audio_prosody([])
    assert res["voice_stress_arousal_index"] == 0.0
    assert res["status"] == "NO_AUDIO_STREAM"
