'use client';
import React, { useState } from 'react';
import { VerbatimQuoteCard } from './VerbatimQuoteCard';
import { LongitudinalChart } from './LongitudinalChart';
import { ClinicalVerificationModal } from './ClinicalVerificationModal';

export const TriageQueue: React.FC = () => {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const alerts = [
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinical Crisis Triage Workspace</h1>
          <p className="text-xs text-slate-600">All alerts require licensed professional validation before physical-world deployment.</p>
        </div>
        <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded text-xs">1 Active Critical Alert</span>
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
