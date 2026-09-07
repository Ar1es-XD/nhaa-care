/**
 * NHAA-Care FastAPI Backend Client
 * Connects Next.js Frontend to FastAPI REST API (Port 8000).
 * Supports automatic fallback to offline cached structures when backend is unreachable.
 */

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/v1';

export interface CaseSummary {
  case_id: string;
  case_number: string;
  fir_number: string;
  district_name: string;
  district_code: string;
  act_sections: string[];
  incident_date: string;
  case_status: string;
  current_distress_tier: string;
  latest_dds_score: number;
}

export interface TriageAlert {
  alert_id: string;
  case_id: string;
  case_number: string;
  district_code: string;
  district_name: string;
  verbatim_quote: string;
  detected_language: string;
  alert_tier: string;
  sla_minutes_remaining: number;
  is_threat_confirmed: boolean;
  status: string;
  measured_at: string;
}

export interface ClinicalVerificationPayload {
  alert_id: string;
  counselor_user_id?: string;
  clinical_notes: string;
  is_threat_confirmed: boolean;
  recommended_interventions?: string[];
}

export interface ReliefStage {
  stage_name: string;
  sanctioned_amount: number;
  disbursed_amount: number;
  is_disbursed: boolean;
  delay_days: number;
}

export interface DistrictOverview {
  active_cases_monitored: number;
  critical_alerts_in_triage: number;
  human_verified_interventions_24h: number;
  rule12_compensation_compliance_pct: number;
  hotspot_police_stations: Array<{
    station_name: string;
    critical_cases: number;
    threat_trend: string;
  }>;
}

export interface BreakGlassRequest {
  user_id: string;
  user_role: string;
  case_id: string;
  fir_number: string;
  district_code: string;
  justification_reason: string;
  mfa_otp: string;
}

export interface BreakGlassResponse {
  status: string;
  session_id: string;
  granted_at: string;
  expires_at: string;
  unmasked_data: {
    full_name: string;
    phone_number: string;
    current_address: string;
    caste_category: string;
  };
  regulatory_notice: string;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// 1. Cases Endpoints
export async function fetchCases(districtCode?: string): Promise<CaseSummary[]> {
  const query = districtCode ? `?district_code=${encodeURIComponent(districtCode)}` : '';
  return apiFetch<CaseSummary[]>(`/cases${query}`);
}

export async function fetchCaseById(caseId: string): Promise<CaseSummary> {
  return apiFetch<CaseSummary>(`/cases/${encodeURIComponent(caseId)}`);
}

// 2. Clinical Triage Endpoints
export async function fetchTriageQueue(districtCode?: string): Promise<TriageAlert[]> {
  const query = districtCode ? `?district_code=${encodeURIComponent(districtCode)}` : '';
  return apiFetch<TriageAlert[]>(`/triage/queue${query}`);
}

export async function verifyAndDispatch(payload: ClinicalVerificationPayload): Promise<any> {
  return apiFetch<any>('/triage/verify-and-dispatch', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 3. Relief & Compensation Endpoints
export async function fetchReliefStatus(caseId: string): Promise<ReliefStage[]> {
  return apiFetch<ReliefStage[]>(`/relief/${encodeURIComponent(caseId)}`);
}

// 4. Macro Analytics Endpoints
export async function fetchDistrictOverview(): Promise<DistrictOverview> {
  return apiFetch<DistrictOverview>('/analytics/district-overview');
}

// 5. Emergency Break-Glass Endpoints
export async function requestBreakGlassUnmasking(payload: BreakGlassRequest): Promise<BreakGlassResponse> {
  return apiFetch<BreakGlassResponse>('/break-glass/request-unmasking', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 6. Cryptographic Audit Verification
export async function verifyAuditLedger(): Promise<{ is_valid: boolean; chain_length: number; last_block_hash: string }> {
  return apiFetch<{ is_valid: boolean; chain_length: number; last_block_hash: string }>('/audit/verify-chain');
}
