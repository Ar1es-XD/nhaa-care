'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommandViewHeader } from '@/components/common/CommandViewHeader';

interface CaseAlert {
  id: string;
  caseNumber: string;
  district: string;
  tier: 'HIGH_ESCALATION' | 'ELEVATED';
  distressScore: number;
  deltaVelocity: number;
  whyExplanation: string;
  verbatimSnippet: string;
  milestoneContext: string;
  lastContact: string;
  assignedCounselor: string;
}

const SAMPLE_CASES: CaseAlert[] = [
  {
    id: 'alt-vns-9041',
    caseNumber: 'NHAA/2026/UP/VNS/00492',
    district: 'Varanasi District',
    tier: 'HIGH_ESCALATION',
    distressScore: 84,
    deltaVelocity: 32,
    whyExplanation: 'Acoustic voice tremor rise (+38%) following bail hearing notification; explicit intimidation disclosure during morning check-in.',
    verbatimSnippet: 'kal shaam ko unke aadmi aaye the. Bole ki gawaahi wapas le le nahi toh ghar jala denge. Hum bahut dare hue hain, bache ro rahe hain.',
    milestoneContext: 'Witness Deposition Hearing in 9 days',
    lastContact: '18 minutes ago (IVRS Outbound)',
    assignedCounselor: 'Dr. Ananya Verma',
  },
  {
    id: 'alt-lko-8812',
    caseNumber: 'NHAA/2026/UP/LKO/00381',
    district: 'Lucknow District',
    tier: 'ELEVATED',
    distressScore: 61,
    deltaVelocity: 14,
    whyExplanation: 'Sentiment drop across consecutive check-ins; delayed Rule 12 Stage 1 relief disbursement.',
    verbatimSnippet: 'muavza abhi tak nahi mila hai, advocate sahab se baat nahi ho pa rahi hai.',
    milestoneContext: 'Chargesheet Filed (Compensation Pending)',
    lastContact: '2 hours ago (App Check-in)',
    assignedCounselor: 'Dr. R. K. Singh',
  },
  {
    id: 'alt-prg-7719',
    caseNumber: 'NHAA/2026/UP/PRG/00215',
    district: 'Prayagraj District',
    tier: 'ELEVATED',
    distressScore: 56,
    deltaVelocity: 9,
    whyExplanation: 'Two missed daily micro-interactions following accused bail release.',
    verbatimSnippet: 'Missed two check-ins; automated IVRS callback scheduled.',
    milestoneContext: 'Accused Granted Conditional Bail',
    lastContact: 'Yesterday, 19:40',
    assignedCounselor: 'S. K. Maurya',
  },
];

export default function CounselorQueuePage() {
  const [tierFilter, setTierFilter] = useState<'ALL' | 'DISTRICT' | 'STATE'>('DISTRICT');
  const primaryCase = SAMPLE_CASES[0];
  const compactCases = SAMPLE_CASES.slice(1);

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#23303A]">
      <CommandViewHeader />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8 flex-1">
        {/* Top Operational Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9D4C8] pb-4">
          <div>
            <h1 className="font-serif text-2xl font-medium text-[#23303A] tracking-tight">
              Clinical Priority Queue
            </h1>
            <p className="text-xs text-[#4E5B72] mt-0.5">
              Trauma-informed risk triaging under SC/ST (PoA) Act clinical protocol.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#4E5B72]">Scope:</span>
            <div className="flex items-center bg-white border border-[#D9D4C8] rounded-lg p-1">
              <button
                onClick={() => setTierFilter('DISTRICT')}
                className={`px-3 py-1 rounded transition ${
                  tierFilter === 'DISTRICT'
                    ? 'bg-[#1F4A48] text-white font-medium'
                    : 'text-[#4E5B72] hover:text-[#23303A]'
                }`}
              >
                Varanasi District (3)
              </button>
              <button
                onClick={() => setTierFilter('STATE')}
                className={`px-3 py-1 rounded transition ${
                  tierFilter === 'STATE'
                    ? 'bg-[#1F4A48] text-white font-medium'
                    : 'text-[#4E5B72] hover:text-[#23303A]'
                }`}
              >
                Uttar Pradesh State
              </button>
            </div>
          </div>
        </div>

        {/* Asymmetric Layout: Left = Highest Escalation Hero Card + Queue; Right = Trend Geometry Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Priority Cases */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#23303A]">
                Requires Immediate Human Attention
              </span>
              <span className="text-[11px] text-[#8C4A3A] bg-[#F7ECE9] px-2.5 py-0.5 rounded border border-[#E5CDC6] font-medium">
                1 High Escalation
              </span>
            </div>

            {/* ENLARGED HERO CASE CARD (Hierarchy visible across the room!) */}
            <div className="bg-white border-2 border-[#8C4A3A]/40 rounded-xl p-6 shadow-sm space-y-5 animate-soft-settle">
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D9D4C8] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#23303A]">
                      {primaryCase.caseNumber}
                    </span>
                    <span className="text-xs text-[#8C4A3A] bg-[#F7ECE9] px-2 py-0.5 rounded font-medium border border-[#E5CDC6]">
                      High Escalation Risk
                    </span>
                  </div>
                  <p className="text-xs text-[#4E5B72] mt-1">
                    {primaryCase.district} • Contact: {primaryCase.lastContact}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-xs text-[#4E5B72]">Distress Index</span>
                    <span className="text-2xl font-bold text-[#8C4A3A]">
                      {primaryCase.distressScore}
                    </span>
                    <span className="text-xs text-[#4E5B72]">/100</span>
                  </div>
                  <span className="text-[11px] text-[#8C4A3A] font-medium block">
                    Δ Velocity: +{primaryCase.deltaVelocity} (14 days)
                  </span>
                </div>
              </div>

              {/* Explainable AI "Why" Affordance */}
              <div className="p-3.5 bg-[#F8F3E8] border border-[#E8DFC8] rounded-lg space-y-1">
                <span className="text-[11px] font-semibold text-[#B98A2B] block">
                  Why this case was elevated (Explainable AI):
                </span>
                <p className="text-xs text-[#23303A] leading-relaxed">
                  {primaryCase.whyExplanation}
                </p>
              </div>

              {/* Raw Verbatim Signal (Mandatory Human Review) */}
              <div className="p-4 bg-[#F6F4EF] border-l-4 border-[#8C4A3A] rounded-r-lg space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#4E5B72]">
                  <span className="font-semibold text-[#8C4A3A]">Raw Verbatim Signal (Unsummarized)</span>
                  <span>Hindi Audio IVRS</span>
                </div>
                <p className="text-xs italic text-[#23303A] leading-relaxed">
                  "{primaryCase.verbatimSnippet}"
                </p>
              </div>

              {/* Single Hero Animated Distress Trend Line (Draws in once, ~900ms ease-out) */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] text-[#4E5B72]">
                  <span>14-Day Longitudinal Distress Trend</span>
                  <span>Trigger: {primaryCase.milestoneContext}</span>
                </div>
                <div className="w-full h-16 bg-[#F6F4EF] border border-[#D9D4C8] rounded-lg p-2 flex items-end">
                  <svg className="w-full h-12 overflow-visible" viewBox="0 0 400 48">
                    <path
                      d="M 0 42 Q 60 40, 120 38 T 240 32 T 320 22 T 400 6"
                      fill="none"
                      stroke="#8C4A3A"
                      strokeWidth="2.5"
                      strokeDasharray="1000"
                      strokeDashoffset="0"
                      className="animate-draw-line"
                    />
                    <circle cx="400" cy="6" r="4" fill="#8C4A3A" />
                  </svg>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-[#4E5B72]">
                  Assigned Officer: <strong>{primaryCase.assignedCounselor}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/c/case/${primaryCase.id}`}
                    className="px-4 py-2 bg-[#F6F4EF] hover:bg-[#EAE6DD] text-[#23303A] text-xs font-medium rounded-lg border border-[#D9D4C8] transition"
                  >
                    View Case File
                  </Link>
                  <Link
                    href={`/c/session/${primaryCase.id}`}
                    className="px-5 py-2 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-medium rounded-lg transition shadow-sm"
                  >
                    Initiate Clinical Call
                  </Link>
                </div>
              </div>
            </div>

            {/* COMPACT LIST ROWS (Remaining lower-priority cases) */}
            <div className="space-y-3 pt-4">
              <span className="text-xs font-semibold text-[#23303A] block">
                Pending Active Cases (Queue)
              </span>

              {compactCases.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-[#D9D4C8] hover:border-[#B98A2B] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 transition shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#23303A]">{c.caseNumber}</span>
                      <span className="text-[10px] text-[#B98A2B] bg-[#F8F3E8] px-2 py-0.5 rounded border border-[#E8DFC8] font-medium">
                        Elevated
                      </span>
                    </div>
                    <p className="text-xs text-[#4E5B72]">{c.district} • Context: {c.milestoneContext}</p>
                    <p className="text-[11px] text-[#23303A] max-w-xl truncate">
                      <strong>Signal:</strong> {c.whyExplanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-lg font-bold text-[#B98A2B]">{c.distressScore}</span>
                      <span className="text-[10px] text-[#4E5B72] block">Δ +{c.deltaVelocity}</span>
                    </div>
                    <Link
                      href={`/c/case/${c.id}`}
                      className="px-3 py-1.5 bg-[#F6F4EF] hover:bg-[#EAE6DD] text-[#23303A] text-xs font-medium rounded border border-[#D9D4C8] transition"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (4 cols): Regional Geographic Distribution & Milestone Triggers */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#23303A]">
                  Spatial Trend Distribution
                </span>
                <span className="text-[11px] text-[#4E5B72]">
                  Sized by Trend Velocity
                </span>
              </div>

              {/* Geographic Region Clusters */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#D9D4C8] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#23303A]">Varanasi Rural (Pindra)</span>
                    <span className="text-[11px] text-[#8C4A3A] font-bold">1 High Escalation</span>
                  </div>
                  <div className="w-full bg-[#D9D4C8] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#8C4A3A] h-full w-[84%]" />
                  </div>
                  <span className="text-[10px] text-[#4E5B72] block">
                    Witness deposition scheduled in 9 days
                  </span>
                </div>

                <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#D9D4C8] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#23303A]">Lucknow Sadar</span>
                    <span className="text-[11px] text-[#B98A2B] font-bold">1 Elevated</span>
                  </div>
                  <div className="w-full bg-[#D9D4C8] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#B98A2B] h-full w-[61%]" />
                  </div>
                  <span className="text-[10px] text-[#4E5B72] block">
                    Relief disbursement delay: 18 days
                  </span>
                </div>

                <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#D9D4C8] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#23303A]">Prayagraj (Koraon)</span>
                    <span className="text-[11px] text-[#B98A2B] font-bold">1 Elevated</span>
                  </div>
                  <div className="w-full bg-[#D9D4C8] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#B98A2B] h-full w-[56%]" />
                  </div>
                  <span className="text-[10px] text-[#4E5B72] block">
                    Accused bail notification sent
                  </span>
                </div>
              </div>
            </div>

            {/* Closed-Loop Verification Status */}
            <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-3 shadow-sm text-xs">
              <span className="font-semibold text-[#23303A] block">
                Closed-Loop Verification Mandate
              </span>
              <p className="text-[#4E5B72] leading-relaxed">
                Under Section 5.3 of clinical protocol, AI predictions never trigger physical police dispatch autonomously. A certified human counsellor must complete a verification call.
              </p>
              <div className="pt-2 border-t border-[#D9D4C8] flex justify-between text-[11px]">
                <span className="text-[#4E5B72]">SLA Window:</span>
                <span className="font-bold text-[#8C4A3A]">12 Minutes Remaining</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72] py-4 border-t border-[#D9D4C8]">
        NHAA-Care Command View • Authorized Clinical Personnel Only
      </footer>
    </div>
  );
}
