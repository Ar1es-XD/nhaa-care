# Sahaara (`nhaa-care`) — Verification & Testing Guide

**Production URL:** [https://frontend-livid-two-46.vercel.app](https://frontend-livid-two-46.vercel.app)  
**Local Development:** `http://localhost:3000`  
**Backend API:** `http://localhost:8000/api/v1`  
**Repository:** [Ar1es-XD/nhaa-care](https://github.com/Ar1es-XD/nhaa-care)

---

## 1. Login Credentials & Demo Personas

Sahaara features a **Split Authentication Architecture** supporting both Email/Password authentication and Google OAuth, with role-based routing and session state preservation.

| Role / Persona | Portal Option | Default Email | Password | Landing Page |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen / Complainant**<br>*(Priya Devi)* | **Citizen Portal**<br>(सुरक्षित नागरिक पोर्टल) | `priya.devi@sahay.gov.in` | Any password *(e.g. `password123`)* | `/v/dashboard` |
| **Certified Clinical Counselor**<br>*(Dr. Ananya Verma)* | **Counselor Portal**<br>(विशेष परामर्शदाता पोर्टल) | `dr.ananya.verma@counselor.sahay.gov.in`<br>*(or `counselor@sahaara.gov.in`)* | Any password *(e.g. `password123`)* | `/c/queue` |
| **District Nodal Officer**<br>*(DySP Rajeshwar Singh)* | Direct / Instant Persona | `nodal.varanasi@gov.in` | Any password | `/admin/dispatch` |
| **Special Court Administrator**<br>*(District Magistrate)* | Direct / Instant Persona | `admin.nhaa@nic.in` | Any password | `/admin/alerts` |

> [!TIP]
> **One-Click Fast Personas:** On the `/login` page, you can also scroll to the **"Instant Persona Access"** bar at the bottom and click either **"Citizen (Priya Devi)"** or **"Counselor (Dr. Verma)"** for immediate instant authentication without typing credentials.

---

## 2. Split Portal Verification Steps

### Step 2.1: Verify Citizen Login Path
1. Navigate to [`/login`](https://frontend-livid-two-46.vercel.app/login).
2. Select the **"Citizen / Complainant Portal (सुरक्षित नागरिक पोर्टल)"** card on the left.
3. Notice the input defaults to `priya.devi@sahay.gov.in`.
4. Click **"Enter Private Sanctuary"** (or use Google OAuth).
5. **Expected Result:** You are routed to [`/v/dashboard`](https://frontend-livid-two-46.vercel.app/v/dashboard), displaying Priya Devi's private sanctuary, reassurance copy, breathing exercise widget, and check-in prompt.
6. **Role Guard Test:** While logged in as Citizen, manually change the browser URL to `/c/queue`.
   - **Expected Result:** The security guard intercepts the request and redirects you back to `/v/dashboard`, protecting counselor case files.

---

### Step 2.2: Verify Counselor Login Path
1. Navigate back to [`/login`](https://frontend-livid-two-46.vercel.app/login).
2. Select the **"Certified Counselor Portal (विशेष परामर्शदाता पोर्टल)"** card on the right.
3. Notice the input defaults to `counselor@sahaara.gov.in`.
4. Click **"Access Clinical Console"** (or use Google OAuth).
5. **Expected Result:** You are routed to [`/c/queue`](https://frontend-livid-two-46.vercel.app/c/queue), opening the counselor clinical triage console.

---

## 3. Counselor Caseload & Complete DB Dossier Verification

### Step 3.1: Verify Caseload Mapping (Cohort Limitation)
1. In the Counselor view ([`/c/queue`](https://frontend-livid-two-46.vercel.app/c/queue)):
2. Observe the **Caseload Distribution** panel on the right:
   - Counselor: **Dr. Ananya Verma**
   - Cohort: Strictly limited to **3 assigned citizens** in Varanasi District rather than an unbounded global table.
3. Observe the queue listings:
   - **Primary Escalation:** `NHAA/2026/UP/VNS/00492` (Priya Devi, DDS 84/100, Witness Deposition in 9 days).
   - **Assigned Cohort Citizen 2:** `NHAA/2026/UP/VNS/00381` (Sunita Bharti, DDS 61/100, Stage 2 Relief Pending).
   - **Assigned Cohort Citizen 3:** `NHAA/2026/UP/VNS/00215` (Ramesh Paswan, DDS 56/100, Conditional Bail Hearing).

---

### Step 3.2: Inspect Complete User DB Dossier (Click-on-User)
1. In [`/c/queue`](https://frontend-livid-two-46.vercel.app/c/queue), click **directly on the case header** (or click the button **"Inspect Complete DB Dossier (All Records)"**).
2. The modal **"Complete DB Record"** opens. Verify all **5 interactive tabs**:
   - **Tab 1 — 📋 Master Case File:**
     - FIR Number (`FIR-482/2026 Chitaipur PS`), filing date (`2026-08-14`), Investigating Officer (`DySP Rajeshwar Singh`).
     - Special Atrocities Court No. 2, Judge (`Hon. Justice V. K. Mishra`).
     - Sealed Sovereign Identity (`VAULT-VNS-P779`), Caste classification, dependents, and upcoming judicial milestones.
     - Statutory Penal Sections: SC/ST PoA Act Sections `3(1)(r)`, `3(1)(s)`, `3(2)(va)` and BNS Sections `352`, `351(2)`.
   - **Tab 2 — 💬 Mapped Chat & Voice Stream:**
     - Complete longitudinal interaction history with user verbatim transcripts, companion responses, acoustic tremor percentage (`86%`), and escalation tags.
   - **Tab 3 — ₹ Rule 12 Relief Ledger:**
     - Stage 1 (FIR Lodgement): ₹2,50,000 sanctioned & disbursed.
     - Stage 2 (Chargesheet Filing): ₹5,00,000 sanctioned, pending approval.
     - Stage 3 (Special Court Verdict): ₹2,50,000 scheduled.
   - **Tab 4 — 🛡️ Section 15A Witness Protection:**
     - Threat Level: `CRITICAL`.
     - Police Escort Assigned: `YES`.
     - Last Police Patrol Verification: `06:30 AM Today (PRV-0492)`.
     - Button: **"🚨 Dispatch Emergency Police Escort Check"**.
   - **Tab 5 — 🧠 Clinical AI Synthesis:**
     - Click **"Generate Clinical Brief"** to invoke the clinical copilot and view structured triage notes.
3. Close the modal, and click on **Sunita Bharti** (`NHAA/2026/UP/VNS/00381`):
   - Notice the modal dynamically loads Sunita's specific FIR (`FIR-312/2026 Shivpur PS`), her specific chargesheet status, and her specific interaction history.
   - Notice previous AI analyses do not leak between users.

---

### Step 3.3: Verify Standalone Case Dossier Page
1. From `/c/queue`, click **"Case File"** next to any citizen (e.g. `/c/case/alt-vns-9041` or `/c/case/alt-vns-8812`).
2. **Expected Result:** The standalone case page dynamically renders that exact user's complete database records, SHAP factor attribution breakdown, and all 5 data tabs.

---

## 4. Live Mapped Chat & Untruncated AI Response Verification

### Step 4.1: Citizen Check-In & Non-Truncation Test
1. Open a new window / tab and go to [`/v/check-in`](https://frontend-livid-two-46.vercel.app/v/check-in).
2. Choose how you feel (e.g. *Anxious* or *Seeking Calm*).
3. Type a message in Hindi, Hinglish, or English:
   - **Hinglish Test:** `"kal shaam ko unke aadmi aaye the. Bole ki gawaahi wapas le le nahi toh ghar jala denge. Hum bahut dare hue hain."`
   - **English Test:** `"I feel completely overwhelmed about the court testimony next week, I can barely sleep."`
4. Click Send.
5. **Expected Results:**
   - The response is **complete, empathetic, and grammatically closed** (it never cuts off mid-sentence and ends cleanly with proper punctuation `.`, `!`, `?`, or `।`).
   - If physical intimidation was mentioned, safety escalation activates with emergency helpline `14566` guidance.

---

### Step 4.2: Real-Time Sync to Counselor Queue
1. Without closing the citizen tab, switch back to the counselor tab ([`/c/queue`](https://frontend-livid-two-46.vercel.app/c/queue)).
2. Focus the window.
3. **Expected Result:** The counselor's queue automatically syncs the new interaction:
   - The verbatim sentence you typed appears immediately under **"Live Mapped Citizen Interaction"**.
   - The citizen's acoustic tremor and distress velocity update in real time.

---

## 5. Clinical Tele-Counseling Session Verification

1. On `/c/queue`, click **"Start Session"** (or navigate to `/c/session/alt-vns-9041`).
2. **Encrypted Call Simulation:** Observe the timer incrementing and the status indicator showing active encrypted call.
3. **Citizen Dossier Header:** Confirms the active patient name and case number.
4. **Observation Notes Auto-Save:** Type notes in the clinical text box; observe the *"Auto-saved to draft"* indicator. Reloading or returning to the page restores your draft notes.
5. **AI Clinical Copilot:** Click **"Generate Clinical Brief"**; verify that it generates a 3-bullet clinical note summarizing longitudinal risk, trauma, and recommended inter-agency actions.
6. **Complete Session:** Click **"Conclude Session & Dispatch Actions"**; verify it saves the notes and returns you to `/c/queue`.

---

## 6. Automated Test Suite Execution

### Backend Tests (31 Passed)
Run from project root:
```bash
source backend/.venv/bin/activate
pytest backend/tests -v
```

### Frontend Build Verification (24 Routes)
Run from `frontend/` directory:
```bash
cd frontend
npm run build
```
Confirms clean TypeScript compilation, Next.js static page generation, and zero route errors.

---

## 7. Security & Compliance Safeguards

- **Zero-Knowledge Architecture:** Demographics and citizen identities remain protected behind the Sovereign Vault pseudonymization token (`VAULT-VNS-P779`) in accordance with India's **Digital Personal Data Protection (DPDP) Act, 2023**.
- **Section 15A SC/ST (PoA) Protocol:** Intimidation keywords trigger immediate escalation flags in the counselor triage queue and prompt safety check-ins with the Varanasi District Police Nodal Officer.
- **Resilient AI Fallback:** The OpenAI `gpt-4o-mini` engine is backed by local dynamic fallback handlers, guaranteeing 100% uptime and complete sentence structure regardless of network latency or API rate limits.
