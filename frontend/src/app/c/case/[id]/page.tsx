'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CommandViewHeader } from '@/components/common/CommandViewHeader';

export default function CounselorCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = (params?.id as string) || 'alt-vns-9041';

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#23303A]">
      <CommandViewHeader />

      <main className="max-w-5xl mx-auto w-full px-4 md:px-8 py-8 space-y-6 flex-1">
        {/* Breadcrumb & Case Identifier */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D4C8] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#4E5B72]">
              <Link href="/c/queue" className="hover:underline">Queue</Link>
              <span>/</span>
              <span>Case File</span>
            </div>
            <h1 className="font-serif text-2xl font-medium text-[#23303A]">
              NHAA/2026/UP/VNS/00492
            </h1>
            <p className="text-xs text-[#4E5B72]">
              Varanasi District • Special Court Atrocities Case #SC-284/2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-[#4E5B72] block">Current Distress Index</span>
              <span className="text-2xl font-bold text-[#8C4A3A]">84/100</span>
            </div>
            <Link
              href={`/c/session/${caseId}`}
              className="px-5 py-2.5 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-medium rounded-lg transition shadow-sm"
            >
              Start Clinical Session
            </Link>
          </div>
        </div>

        {/* Explainable AI (SHAP) Factor Attribution */}
        <div className="bg-white border border-[#D9D4C8] rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#23303A]">
                SHAP Explainable Risk Attribution
              </h2>
              <p className="text-xs text-[#4E5B72]">
                Key drivers contributing to the recent distress escalation
              </p>
            </div>
            <span className="text-[11px] bg-[#F8F3E8] text-[#B98A2B] px-2.5 py-0.5 rounded border border-[#E8DFC8] font-medium">
              Calibrated Model v1.0.2
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { factor: 'Explicit Witness Intimidation Mentioned', contribution: '+42%', width: '84%', color: 'bg-[#8C4A3A]' },
              { factor: 'Acoustic Voice Stress & Jitter (Autonomic Arousal)', contribution: '+28%', width: '56%', color: 'bg-[#B98A2B]' },
              { factor: 'Upcoming Witness Deposition Hearing (T-9 Days)', contribution: '+18%', width: '36%', color: 'bg-[#B98A2B]' },
              { factor: 'Delayed Rule 12 Stage 2 Compensation Disbursement', contribution: '+12%', width: '24%', color: 'bg-[#6E8E7A]' },
            ].map((item, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between text-[#23303A]">
                  <span className="font-medium">{item.factor}</span>
                  <span className="font-semibold">{item.contribution}</span>
                </div>
                <div className="w-full bg-[#F6F4EF] h-2 rounded-full overflow-hidden border border-[#D9D4C8]">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Verbatim Signals (Mandatory Human Review) */}
        <div className="bg-white border border-[#D9D4C8] rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#23303A]">
            Verbatim Interaction Log (Unsummarized)
          </h2>
          
          <div className="p-4 bg-[#F6F4EF] border-l-4 border-[#8C4A3A] rounded-r-lg space-y-2">
            <div className="flex justify-between items-center text-[11px] text-[#4E5B72]">
              <span className="font-semibold text-[#8C4A3A]">IVRS Outbound Call • 08:30 AM Today</span>
              <span>Audio Preserved in Vault</span>
            </div>
            <p className="text-xs italic text-[#23303A] leading-relaxed">
              "kal shaam ko unke aadmi aaye the. Bole ki gawaahi wapas le le nahi toh ghar jala denge. Hum bahut dare hue hain, bache ro rahe hain."
            </p>
            <p className="text-[11px] text-[#4E5B72]">
              Clinical Rule: Raw statements must be reviewed verbatim by licensed counsellors before taking inter-agency action.
            </p>
          </div>
        </div>

        {/* Inter-Agency Protection Checklist */}
        <div className="bg-white border border-[#D9D4C8] rounded-xl p-6 space-y-3 shadow-sm text-xs">
          <h2 className="text-sm font-semibold text-[#23303A]">
            Protection & Relief Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#D9D4C8]">
              <span className="text-[11px] text-[#4E5B72] block">Police Witness Protection</span>
              <span className="font-semibold text-[#23303A]">Sub-Inspector Escort Assigned</span>
            </div>
            <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#D9D4C8]">
              <span className="text-[11px] text-[#4E5B72] block">Rule 12 Relief Status</span>
              <span className="font-semibold text-[#23303A]">₹1,25,000 Disbursed (25%)</span>
            </div>
            <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#D9D4C8]">
              <span className="text-[11px] text-[#4E5B72] block">Legal Aid DLSA Counsel</span>
              <span className="font-semibold text-[#23303A]">Adv. R. C. Prasad</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72] py-4 border-t border-[#D9D4C8]">
        <Link href="/c/queue" className="hover:underline">Return to priority queue</Link>
      </footer>
    </div>
  );
}
