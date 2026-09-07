'use client';
import React, { useState, useEffect } from 'react';
import { fetchReliefStatus, ReliefStage } from '@/lib/api';

const DEFAULT_STEPS = [
  {
    stage: "1. Early Relief Sanctuary",
    hindi: "प्रारंभिक सहायता (25%)",
    amount: "₹2,12,500",
    status: "Safely Disbursed",
    date: "Disbursed via DBT on 18 Aug 2026",
    isComplete: true
  },
  {
    stage: "2. Investigation & Support Stage",
    hindi: "जांच एवं कानूनी सहायता (50%)",
    amount: "₹4,25,000",
    status: "In Expedited Review",
    date: "Statutory Rule 12 window (District Welfare Office)",
    isComplete: false,
    isCurrent: true
  },
  {
    stage: "3. Final Restorative Relief",
    hindi: "अंतिम पुनर्वास सहायता (25%)",
    amount: "₹2,12,500",
    status: "Guaranteed upon Completion",
    date: "Coordinated through DLSA & Court Counsel",
    isComplete: false
  }
];

export const ReliefTracker: React.FC<{ caseId?: string }> = ({ caseId = 'NHAA/2026/UP/LKO/00492' }) => {
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchReliefStatus(caseId)
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((stage, idx) => {
            const isComplete = stage.is_disbursed;
            const isCurrent = !isComplete && idx === data.findIndex(s => !s.is_disbursed);
            const titles: Record<string, { en: string; hi: string }> = {
              FIR_STAGE_25PCT: { en: "1. Early Relief Sanctuary (FIR Stage)", hi: "प्रारंभिक सहायता (25%)" },
              CHARGESHEET_STAGE_50PCT: { en: "2. Investigation & Support Stage", hi: "जांच एवं कानूनी सहायता (50%)" },
              CONVICTION_STAGE_25PCT: { en: "3. Final Restorative Relief", hi: "अंतिम पुनर्वास सहायता (25%)" }
            };
            const meta = titles[stage.stage_name] || { en: stage.stage_name, hi: "सहायता चरण" };
            return {
              stage: meta.en,
              hindi: meta.hi,
              amount: `₹${stage.sanctioned_amount.toLocaleString('en-IN')}`,
              status: isComplete ? "Safely Disbursed" : (stage.delay_days > 0 ? `Delayed by ${stage.delay_days}d` : "In Expedited Review"),
              date: isComplete ? "Disbursed via DBT" : "Statutory Rule 12 window",
              isComplete,
              isCurrent,
            };
          });
          setSteps(mapped);
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn('Backend relief API fallback:', err);
      });
  }, [caseId]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#e8f0ec] shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-[#2d3748]">Statutory Relief & Rehabilitation Road</h3>
          <p className="text-xs text-[#52796f]">Mandated financial and restorative aid under PoA Rule 12.</p>
        </div>
        <span className="text-xs text-[#52796f] font-semibold bg-[#faf8f5] px-3 py-1 rounded-full border border-[#e8f0ec]">
          Total Sanction: ₹8,50,000
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {steps.map((s, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-2xl border transition ${
              s.isComplete ? 'bg-[#f4f8f6] border-[#d8e6de]' :
              s.isCurrent ? 'bg-[#fffbf7] border-[#fcd5b8] shadow-sm' :
              'bg-[#faf8f5] border-[#e8f0ec] opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                s.isComplete ? 'bg-[#d8e6de] text-[#24523d]' :
                s.isCurrent ? 'bg-[#fce6d4] text-[#b85625]' :
                'bg-slate-200 text-slate-600'
              }`}>
                {s.status}
              </span>
              <span className="text-xs font-bold text-[#2d3748]">{s.amount}</span>
            </div>
            <div className="font-bold text-xs text-[#2d3748]">{s.stage}</div>
            <div className="text-[11px] text-[#52796f]">{s.hindi}</div>
            <p className="text-[10px] text-slate-500 mt-2">{s.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
