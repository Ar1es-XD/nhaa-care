# Sahaara (सहारा) — AI-Based Dynamic Mental Health Monitoring & Distress Prediction System
[![CI Pipeline](https://github.com/Ar1es-XD/nhaa-care/actions/workflows/ci.yml/badge.svg)](https://github.com/Ar1es-XD/nhaa-care/actions)
[![Live Demo](https://img.shields.io/badge/Production-Live%20on%20Vercel-success)](https://frontend-livid-two-46.vercel.app)
[![GIGW 3.0](https://img.shields.io/badge/GIGW-3.0%20Compliant-blue)](https://www.meity.gov.in/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-green)](https://www.w3.org/WAI/WCAG21/AA/)
[![DPDP Act 2023](https://img.shields.io/badge/Privacy-DPDP%20Act%202023-emerald)](https://www.meity.gov.in/)

## 🌿 Overview
**Sahaara (सहारा)** is an empathetic, trauma-informed digital sanctuary and public health monitoring platform designed to support victims, complainants, and witnesses under the **Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989**.

Moving away from sterile, intimidating bureaucratic portals, Sahaara blends an intuitive **self-help and mental wellness environment** with institutional safeguards, integrating with the **National Helpline Against Atrocities (14566)**, state portals, mobile applications, and IVRS channels.

🔗 **Live Production Application**: [https://frontend-livid-two-46.vercel.app](https://frontend-livid-two-46.vercel.app)  
📦 **GitHub Repository**: [https://github.com/Ar1es-XD/nhaa-care](https://github.com/Ar1es-XD/nhaa-care)

---

## 🕊️ Citizen Sanctuary & Self-Help Features
1. **Calming Pacing Circle (4-7-8 Breathing)**: Interactive, rhythmically guided box breathing to stimulate parasympathetic vagal recovery during acute anxiety or distress episodes.
2. **Procedural Rain Soundscape**: Pure browser-generated pink noise and low-pass filter modulation via the Web Audio API—calming ambient rain with zero external audio assets or tracking scripts.
3. **Daily Emotion Pulse**: Non-stigmatizing one-touch emotion check-in (Peaceful, Anxious, Exhausted, Seeking Strength) offering contextual grounding affirmations.
4. **Private Voice & Text Journaling**: Reflective citizen safe space backed by real-time acoustic prosody estimation (F0 variance, jitter, shimmer) to gauge autonomic arousal without diagnostic labeling.
5. **Supportive Justice & Relief Roadmap**: Replaces impersonal tracking tables with an encouraging card roadmap for Scheduled Castes / Scheduled Tribes PoA Rule 12 relief and milestone progress.
6. **One-Tap Counselor Hotline**: Immediate connection to 24x7 licensed trauma counselors and tele-MANAS crisis counselors.
7. **Emergency Quick Escape**: Global `Esc` key shortcut and instant escape button redirecting immediately to a neutral portal (IRCTC Indian Railways) for personal safety.

---

## 🛡️ Clinical & Institutional Safeguards
- **Zero-Knowledge Identity Vault**: Segregation of all PII and caste data into an isolated `identity_vault` protected with AES-256-GCM envelope encryption.
- **Strict Human-in-the-Loop Gate**: Autonomous physical police dispatch is strictly prohibited; all high-acuity alerts require licensed clinical verification before inter-agency coordination.
- **Cryptographic Audit Chaining**: Every administrative, clinical, and data access action is recorded in an immutable SHA-256 hash chain ($H_i = \text{SHA256}(H_{i-1} \parallel \dots)$).
- **Attribute-Based Access Control (ABAC)**: Strict jurisdictional boundary isolation ensuring District Magistrates and Police Superintendents only access cases within their assigned district.
- **Time-Bounded Break-Glass Unmasking**: Emergency 4-hour token issuance for life-safety interventions requiring two-factor OTP and a mandatory 50+ character justification.

---

## 💻 Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Web Audio API.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, Cryptography, NumPy, Pytest.
- **Database**: PostgreSQL 16 + TimescaleDB hypertables + pgcrypto.
- **Deployment**: Vercel (Edge Frontend), Supabase (PostgreSQL / Migrations).

---

## 🚀 Getting Started

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt email-validator
pytest tests -v
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📜 Compliance & Governance
Fully compliant with the **DPDP Act 2023**, the **Mental Healthcare Act 2017**, **GIGW 3.0**, and **WCAG 2.1 AA**.
