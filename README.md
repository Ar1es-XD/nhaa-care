# NHAA-Care: AI-based Dynamic Mental Health Monitoring & Distress Prediction System
[![CI Pipeline](https://github.com/Ar1es-XD/nhaa-care/actions/workflows/ci.yml/badge.svg)](https://github.com/Ar1es-XD/nhaa-care/actions)
[![GIGW 3.0](https://img.shields.io/badge/GIGW-3.0%20Compliant-blue)](https://www.meity.gov.in/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-green)](https://www.w3.org/WAI/WCAG21/AA/)
[![DPDP Act 2023](https://img.shields.io/badge/Privacy-DPDP%20Act%202023-emerald)](https://www.meity.gov.in/)

## Overview
**NHAA-Care** is an enterprise-grade public health and justice-support system developed to monitor, support, and safeguard victims, complainants, and witnesses under the **Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989**.

Integrating with the **National Helpline Against Atrocities (14566)**, state integrated portals, mobile apps, and sovereign IVRS infrastructure, NHAA-Care transitions support from passive grievance logging to proactive, longitudinal care.

---

## Architectural Highlights
1. **Trauma-Informed & Non-AI Theming**: Built with the *Kavach-Design* system conforming to GIGW 3.0 and WCAG 2.1 AA. Features a one-touch **Emergency Disguise (Quick Exit)** button (`Esc` key) for citizen safety.
2. **Zero-Knowledge Identity Vault**: Full separation of encrypted PII and caste data (`identity_vault`) using AES-256-GCM envelope encryption and PostgreSQL Row Level Security (RLS).
3. **Acoustic & Multilingual AI Pipeline**: Real-time voice stress arousal analysis (pitch jitter, shimmer, silence ratio) and Indic sentiment analysis across 14 languages.
4. **Clinical Human-in-the-Loop Gate**: Under strict clinical governance, **no physical-world action** (police patrol dispatch, relocation) is automated from an AI score. Licensed counselors verify all Tier 3 and 4 alerts before dispatching inter-agency interventions.
5. **Emergency Break-Glass Protocol**: 4-hour time-bounded unmasking for District Magistrates and Superintendents of Police requiring mandatory 50+ character justification.
6. **Tamper-Proof Audit Chaining**: Every administrative and clinical action is cryptographically chained via SHA-256 ($H_i = \text{SHA256}(H_{i-1} \parallel \dots)$).

---

## Tech Stack
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Cryptography, NumPy, Pytest.
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide Icons.
- **Database**: PostgreSQL 16 + TimescaleDB + pgcrypto.
- **Identity & SSO**: MeriPehchan (Jan Parichay) OIDC integration.
- **Deployment**: MeghRaj (NIC Cloud) / Vercel / Supabase.

---

## Getting Started

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

## License & Compliance
Licensed under the Open Government Data (OGD) Platform India terms. Governed by the DPDP Act 2023 and the Mental Healthcare Act 2017.
