'use client';
import React, { useState, useEffect } from 'react';
import { VerbatimQuoteCard } from './VerbatimQuoteCard';
import { LongitudinalChart } from './LongitudinalChart';
import { ClinicalVerificationModal } from './ClinicalVerificationModal';
import { fetchTriageQueue, TriageAlert } from '@/lib/api';

const DEFAULT_ALERTS = [
  {
    id: 'alt-9041',
    caseNumber: 'NHAA/2026/UP/LKO/00492',
    district: 'Lucknow, UP',
    verbatim: 'kal shaam ko unke aadmi aaye the. Bole ki gawaahi wapas le le nahi toh ghar jala denge. Hum bahut dare hue hain, bache ro rahe hain.',
    language: 'hi',
    channel: 'IVRS_OUTBOUND',
    tier: 'TIER_4_CRITICAL',
    slaMinutes: 12
  }
];

export const TriageQueue: React.FC = () => {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [clinicalAiSummary, setClinicalAiSummary] = useState<string | null>(null);
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchTriageQueue()
      .then((data) => {
        if (data && data.length > 0) {
          setAlerts(data.map((item) => ({
            id: item.alert_id,
            caseNumber: item.case_number,
            district: `${item.district_name}, ${item.district_code}`,
            verbatim: item.verbatim_quote,
            language: item.detected_language || 'hi',
            channel: 'IVRS_OUTBOUND',
            tier: item.alert_tier,
            slaMinutes: item.sla_minutes_remaining,
          })));
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn('Backend offline, using fallback alerts:', err);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinical Crisis Triage Workspace</h1>
          <p className="text-xs text-slate-600">All alerts require licensed professional validation before physical-world deployment.</p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded text-xs border border-emerald-200">
              ● Live API Connected
            </span>
          )}
          <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded text-xs">
            {alerts.length} Active {alerts.length === 1 ? 'Alert' : 'Alerts'}
          </span>
        </div>
      </header>

      <div className="space-y-6">
        {alerts.map((a) => (
          <div key={a.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-mono text-sm font-bold text-blue-900">{a.caseNumber}</span>
                <span className="text-xs text-slate-500 ml-2">({a.district})</span>
              </div>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                CRITICAL (SLA: {a.slaMinutes}m)
              </span>
            </div>

            <VerbatimQuoteCard quote={a.verbatim} language={a.language} channel={a.channel} />
            
            {/* Real Gemini AI Clinical Insight Generator */}
            <div className="my-3 p-4 bg-[#f8fbf9] rounded-xl border border-[#c6dfd4] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🧠</span>
                  <span className="text-xs font-bold text-[#2d3748]">Sahaara Clinical Copilot (AI Analysis)</span>
                </div>
                <button
                  onClick={async () => {
                    setLoadingAi(true);
                    try {
                      const res = await fetch('/api/ai/counselor-summary', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          caseId: a.caseNumber,
                          ddsScore: 84,
                          velocity: 32,
                          verbatimQuote: a.verbatim,
                          milestone: 'Bail Hearing & Witness Deposition',
                        }),
                      });
                      const data = await res.json();
                      setClinicalAiSummary(data.summary);
                    } catch (e) {
                      setClinicalAiSummary('Failed to generate insight.');
                    } finally {
                      setLoadingAi(false);
                    }
                  }}
                  disabled={loadingAi}
                  className="text-xs bg-[#52796f] hover:bg-[#354f52] text-white px-3 py-1.5 rounded-full font-semibold transition shadow-sm disabled:opacity-50"
                >
                  {loadingAi ? 'Analyzing Signals...' : '✨ Generate AI Clinical Insight'}
                </button>
              </div>

              {clinicalAiSummary && (
                <div className="text-xs text-[#2d3748] bg-white p-3 rounded-lg border border-[#e8f0ec] leading-relaxed whitespace-pre-line font-medium">
                  {clinicalAiSummary}
                </div>
              )}
            </div>

            <LongitudinalChart />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActiveModalId(a.id)}
                className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded text-sm font-medium shadow"
              >
                Conduct Verification Call & Take Action
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeModalId && (
        <ClinicalVerificationModal alertId={activeModalId} onClose={() => setActiveModalId(null)} />
      )}
    </div>
  );
};
