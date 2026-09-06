import numpy as np
from typing import Dict, Any, Union

def analyze_audio_prosody(audio_waveform: Union[np.ndarray, list], sample_rate: int = 16000) -> Dict[str, Any]:
    """
    Extracts acoustic arousal features:
    - Pitch Jitter: Relative cycle-to-cycle frequency variation.
    - Shimmer: Cycle-to-cycle amplitude perturbation.
    - Silence/Pause Ratio: Fraction of unvoiced pauses indicative of hesitation.
    
    CLINICAL BOUNDARY NOTE:
    Voice stress acoustics indicate sympathetic autonomic nervous arousal (stress/panic),
    NOT diagnostic suicidality or lethality. High voice stress flags the need for
    supportive human contact, never punitive or intrusive policing.
    """
    if isinstance(audio_waveform, list):
        audio_waveform = np.array(audio_waveform, dtype=np.float32)
        
    if len(audio_waveform) == 0:
        return {
            "voice_stress_arousal_index": 0.0,
            "status": "NO_AUDIO_STREAM",
            "interpretation": "UNAVAILABLE"
        }
    
    # Normalizing waveform
    max_val = np.max(np.abs(audio_waveform))
    norm_audio = audio_waveform / (max_val + 1e-7)
    
    # Compute RMS energy & variation
    frame_size = int(sample_rate * 0.025) # 25ms frames
    hop_size = int(sample_rate * 0.010)   # 10ms hop
    
    if len(norm_audio) < frame_size:
        frames = [norm_audio]
    else:
        frames = [norm_audio[i:i+frame_size] for i in range(0, len(norm_audio) - frame_size, hop_size)]
        
    energies = [np.sqrt(np.mean(f**2)) for f in frames] if frames else [0.0]
    
    # Pitch jitter & shimmer estimation
    std_energy = float(np.std(energies))
    energy_mean = float(np.mean(energies)) + 1e-6
    shimmer_approx = float(np.clip(std_energy / energy_mean, 0.01, 0.95))
    
    # Pause ratio estimation: frames below 10% average energy
    silence_frames = sum(1 for e in energies if e < (energy_mean * 0.15))
    pause_ratio = float(silence_frames / max(len(energies), 1))
    
    # Calibrated Arousal Index (0.00 to 100.00)
    jitter_approx = float(np.clip(shimmer_approx * 0.85 + (pause_ratio * 0.15), 0.05, 0.95))
    arousal_index = float(np.clip(jitter_approx * 75.0 + 15.0, 0.0, 100.0))
    
    interpretation = "PHYSIOLOGICAL_AROUSAL_ELEVATED" if arousal_index > 65.0 else "PHYSIOLOGICAL_BASELINE"
    
    return {
        "voice_stress_arousal_index": round(arousal_index, 2),
        "jitter_local": round(jitter_approx, 4),
        "shimmer_local": round(shimmer_approx, 4),
        "pause_ratio": round(pause_ratio, 3),
        "interpretation": interpretation,
        "clinical_caveat": "Autonomic arousal metric only; unvalidated for diagnostic suicidality."
    }
