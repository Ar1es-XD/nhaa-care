'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommandViewHeader } from '@/components/common/CommandViewHeader';
import { getCounselorCaseload, CompleteUserDossier, getFullUserDossier } from '@/lib/interactionStore';
import { UserDossierModal } from '@/components/counselor/UserDossierModal';

export default function CounselorQueuePage() {
  const [tierFilter, setTierFilter] = useState<'DISTRICT' | 'ALL'>('DISTRICT');
  const [caseload, setCaseload] = useState<CompleteUserDossier[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<CompleteUserDossier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAiCaseId, setLoadingAiCaseId] = useState<string | null>(null);
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load assigned caseload for Dr. Ananya Verma (Varanasi District)
    const assigned = getCounselorCaseload('usr-c-002');
    setCaseload(assigned);
  }, []);

  const primaryCase = caseload[0];
  const compactCases = caseload.slice(1);

  const handleOpenDossier = (caseKey: string) => {
    const dossier = getFullUserDossier(caseKey);
    if (dossier) {
      setSelectedDossier(dossier);
      setIsModalOpen(true);
    }
  };

  const handleGenerateAiInsight = async (c: CompleteUserDossier) => {
    setLoadingAiCaseId(c.caseNumber);
    try {
      const recentQuote = c.interactionHistory[0]?.userPrompt || 'No recent transcript recorded';
      const res = await fetch('/api/ai/counselor-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: c.caseNumber,
          ddsScore: c.currentDdsScore,
          velocity: c.deltaVelocity14d,
          verbatimQuote: recentQuote,
          milestone: c.milestoneContext,
        }),
      });
      const data = await res.json();
      setAiSummaries((prev) => ({
        ...prev,
        [c.caseNumber]: data.summary || 'Clinical assessment generated.',
      }));
    } catch (e) {
      setAiSummaries((prev) => ({
        ...prev,
        [c.caseNumber]: 'Unable to connect to clinical copilot. Please proceed with manual triage.',
      }));
    } finally {
      setLoadingAiCaseId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#23303A] font-sans">
      <CommandViewHeader />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8 flex-1">
        {/* Top Operational Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9D4C8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-medium text-[#23303A] tracking-tight">
                Clinical Priority Queue & Caseload
              </h1>
              <span className="text-xs bg-[#E8F0EC] text-[#2F5E3D] px-2.5 py-0.5 rounded-full font-bold border border-[#B7D0BF]">
                Dr. Ananya Verma (Varanasi)
              </span>
            </div>
            <p className="text-xs text-[#4E5B72] mt-0.5">
              Mapped assigned citizens with real-time chat, voice journal telemetry, and full DB records.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#4E5B72]">Assigned Caseload:</span>
            <div className="flex items-center bg-white border border-[#D9D4C8] rounded-lg p-1 font-medium">
              <button
                onClick={() => setTierFilter('DISTRICT')}
                className={`px-3 py-1 rounded transition ${
                  tierFilter === 'DISTRICT'
                    ? 'bg-[#1F4A48] text-white'
                    : 'text-[#4E5B72] hover:text-[#23303A]'
                }`}
              >
                My Cohort ({caseload.length} Citizens)
              </button>
              <button
                onClick={() => setTierFilter('ALL')}
                className={`px-3 py-1 rounded transition ${
                  tierFilter === 'ALL'
                    ? 'bg-[#1F4A48] text-white'
                    : 'text-[#4E5B72] hover:text-[#23303A]'
                }`}
              >
                District Wide
              </button>
            </div>
          </div>
        </div>

        {/* Asymmetric Layout: Left = Assigned Caseload; Right = Caseload Summary & Regional Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Priority Cases */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#23303A]">
                Requires Immediate Clinical Action
              </span>
              <span className="text-[11px] text-[#8C4A3A] bg-[#F7ECE9] px-2.5 py-0.5 rounded border border-[#E5CDC6] font-bold">
                1 Critical • 2 Elevated Cases Mapped
              </span>
            </div>

            {/* HERO CASE CARD (Priya Devi - NHAA/2026/UP/VNS/00492) */}
            {primaryCase && (
              <div className="bg-white border-2 border-[#8C4A3A]/40 rounded-2xl p-6 shadow-sm space-y-5 animate-soft-settle">
                
                {/* Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D9D4C8] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#23303A]">
                        {primaryCase.caseNumber}
                      </span>
                      <span className="text-xs text-[#8C4A3A] bg-[#F7ECE9] px-2 py-0.5 rounded font-bold border border-[#E5CDC6]">
                        Critical Escalation
                      </span>
                      <span className="text-xs text-[#5B7A66] bg-[#E8F0EC] px-2 py-0.5 rounded font-medium border border-[#B7D0BF]">
                        {primaryCase.anonymizedIdentifier}
                      </span>
                    </div>
                    <p className="text-xs text-[#4E5B72] mt-1">
                      {primaryCase.district} • Last Active: {primaryCase.lastActiveTimestamp} • Milestone: {primaryCase.milestoneContext}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className="text-xs text-[#4E5B72]">Distress Index</span>
                      <span className="text-2xl font-bold text-[#8C4A3A]">
                        {primaryCase.currentDdsScore}
                      </span>
                      <span className="text-xs text-[#4E5B72]">/100</span>
                    </div>
                    <span className="text-[11px] text-[#8C4A3A] font-medium block">
                      Δ 14-Day Velocity: +{primaryCase.deltaVelocity14d}
                    </span>
                  </div>
                </div>

                {/* Behavioral Telemetry Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-[#4E5B72] uppercase block">Autonomic Arousal / Tremor</span>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#EBE7DF] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#8C4A3A] h-full rounded-full" style={{ width: `${primaryCase.averageArousal}%` }} />
                      </div>
                      <span className="font-bold text-[#8C4A3A]">{primaryCase.averageArousal}%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-[#4E5B72] uppercase block">Guardedness Indicator</span>
                    <span className={`text-xs font-bold block ${primaryCase.guardednessAlert ? 'text-[#8C4A3A]' : 'text-[#2F5E3D]'}`}>
                      {primaryCase.guardednessAlert ? '⚠️ Terse / High Vigilance' : '✓ Uninhibited Disclosure'}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-[#4E5B72] uppercase block">Section 15A Patrol Status</span>
                    <span className="text-xs font-bold text-[#1F4A48] block">
                      {primaryCase.witnessProtection.lastPatrolCheckin}
                    </span>
                  </div>
                </div>

                {/* Live Mapped Citizen Interaction Signal */}
                <div className="p-4 bg-[#F6F4EF] border-l-4 border-[#8C4A3A] rounded-r-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#4E5B72]">
                    <span className="font-bold text-[#8C4A3A] flex items-center gap-1.5">
                      <span>💬</span>
                      <span>Live Mapped Citizen Interaction ({primaryCase.interactionHistory[0]?.channel || 'WEB_CHAT'})</span>
                    </span>
                    <span>{primaryCase.interactionHistory[0]?.timestamp || 'Recent'}</span>
                  </div>
                  <p className="text-xs italic text-[#23303A] leading-relaxed">
                    "{primaryCase.interactionHistory[0]?.userPrompt || 'No recent transcript'}"
                  </p>
                </div>

                {/* AI Clinical Insight Box if generated */}
                {aiSummaries[primaryCase.caseNumber] && (
                  <div className="p-4 bg-[#F8FBF9] border border-[#C6DFD4] rounded-xl text-xs leading-relaxed whitespace-pre-line text-[#23303A] font-medium animate-soft-settle">
                    <div className="flex items-center gap-1.5 font-bold text-[#1F4A48] mb-1">
                      <span>🧠</span>
                      <span>OpenAI Clinical Copilot Analysis:</span>
                    </div>
                    {aiSummaries[primaryCase.caseNumber]}
                  </div>
                )}

                {/* Card Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EBE7DF]">
                  <button
                    onClick={() => handleOpenDossier(primaryCase.caseNumber)}
                    className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#EBE7DF] text-[#1F4A48] text-xs font-bold rounded-xl border border-[#D9D4C8] transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>📁</span>
                    <span>Inspect Complete DB Dossier (All Records)</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateAiInsight(primaryCase)}
                      disabled={loadingAiCaseId === primaryCase.caseNumber}
                      className="px-3.5 py-2.5 bg-[#FAF3E0] hover:bg-[#F3E5C8] text-[#8C6B1F] border border-[#E6D4A8] text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-1"
                    >
                      <span>🧠</span>
                      <span>{loadingAiCaseId === primaryCase.caseNumber ? 'Analyzing with OpenAI...' : 'AI Clinical Brief'}</span>
                    </button>
                    
                    <Link
                      href={`/c/session/${primaryCase.caseId}`}
                      className="px-5 py-2.5 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1"
                    >
                      <span>📞</span>
                      <span>Start Session</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* REMAINING ASSIGNED CASES IN CASELOD */}
            <div className="space-y-3 pt-4">
              <span className="text-xs font-semibold text-[#23303A] block">
                Assigned Caseload Cohort ({compactCases.length} Additional Citizens)
              </span>

              {compactCases.map((c) => (
                <div
                  key={c.caseId}
                  className="bg-white border border-[#D9D4C8] hover:border-[#1F4A48] rounded-2xl p-5 space-y-3 transition shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#23303A]">{c.caseNumber}</span>
                        <span className="text-[10px] text-[#B98A2B] bg-[#FAF3E0] px-2 py-0.5 rounded font-bold border border-[#E6D4A8]">
                          Elevated Risk
                        </span>
                        <span className="text-[10px] text-[#4E5B72] bg-[#F2EFE9] px-2 py-0.5 rounded font-medium">
                          {c.anonymizedIdentifier}
                        </span>
                      </div>
                      <p className="text-xs text-[#4E5B72]">
                        {c.district} • Milestone: {c.milestoneContext} • Active: {c.lastActiveTimestamp}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold text-[#B98A2B]">{c.currentDdsScore}</span>
                      <span className="text-xs text-[#4E5B72]">/100</span>
                      <span className="text-[10px] text-[#4E5B72] block">Δ +{c.deltaVelocity14d} (14d)</span>
                    </div>
                  </div>

                  {/* Verbatim mapped signal without truncation */}
                  <div className="p-3 bg-[#FAF8F5] border-l-3 border-[#B98A2B] rounded-r-xl space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-[#8C6B1F] block">Recent Interaction Signal:</span>
                    <p className="italic text-[#23303A] leading-relaxed">
                      "{c.interactionHistory[0]?.userPrompt || 'Routine daily check-in completed without distress escalation.'}"
                    </p>
                  </div>

                  {/* AI Clinical brief if generated */}
                  {aiSummaries[c.caseNumber] && (
                    <div className="p-3 bg-[#F8FBF9] border border-[#C6DFD4] rounded-xl text-xs leading-relaxed whitespace-pre-line text-[#23303A] font-medium">
                      {aiSummaries[c.caseNumber]}
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleOpenDossier(c.caseNumber)}
                      className="text-xs font-bold text-[#1F4A48] hover:underline flex items-center gap-1"
                    >
                      <span>📁</span>
                      <span>Open Full DB Dossier</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateAiInsight(c)}
                        disabled={loadingAiCaseId === c.caseNumber}
                        className="px-3 py-1.5 bg-[#FAF3E0] hover:bg-[#F3E5C8] text-[#8C6B1F] border border-[#E6D4A8] text-xs font-bold rounded-lg transition disabled:opacity-50"
                      >
                        {loadingAiCaseId === c.caseNumber ? 'Analyzing...' : '🧠 AI Insight'}
                      </button>
                      <Link
                        href={`/c/case/${c.caseId}`}
                        className="px-3 py-1.5 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-bold rounded-lg transition"
                      >
                        Case File
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (4 cols): Caseload Statistics & Protocol */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Caseload Capacity Card */}
            <div className="bg-white border border-[#D9D4C8] rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
                <span className="text-xs font-bold text-[#23303A]">
                  Caseload Distribution
                </span>
                <span className="text-[11px] bg-[#E8F0EC] text-[#2F5E3D] px-2 py-0.5 rounded font-bold">
                  3 Active Mapped
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#EBE7DF]">
                  <span className="text-[#4E5B72]">Assigned Counselor:</span>
                  <span className="font-bold text-[#1F4A48]">Dr. Ananya Verma</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#EBE7DF]">
                  <span className="text-[#4E5B72]">Jurisdiction:</span>
                  <span className="font-semibold">Varanasi District (UP)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#EBE7DF]">
                  <span className="text-[#4E5B72]">Max Clinical Capacity:</span>
                  <span className="font-semibold">5 Cases (Optimal: 3)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#4E5B72]">Avg Arousal Telemetry:</span>
                  <span className="font-bold text-[#8C4A3A]">61.6%</span>
                </div>
              </div>
            </div>

            {/* Statutory Witness Protection Protocol */}
            <div className="bg-white border border-[#D9D4C8] rounded-2xl p-5 space-y-3 shadow-sm text-xs">
              <span className="font-bold text-[#1F4A48] block text-sm flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Section 15A Clinical Mandate</span>
              </span>
              <p className="text-[#4E5B72] leading-relaxed">
                Counselors are authorized to submit expedited protection assessments to the District Nodal Officer & SP for:
              </p>
              <ul className="space-y-1.5 text-[#23303A]">
                <li className="flex items-center gap-1.5">
                  <span>✓</span> Daily police PCR patrol checks at witness residence.
                </li>
                <li className="flex items-center gap-1.5">
                  <span>✓</span> Armed police escort for court appearances.
                </li>
                <li className="flex items-center gap-1.5">
                  <span>✓</span> Rule 12(4) emergency interim relief acceleration.
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      {/* Complete User DB Dossier Modal */}
      <UserDossierModal
        dossier={selectedDossier}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <footer className="border-t border-[#D9D4C8] px-4 py-3 bg-[#F6F4EF] text-center text-[11px] text-[#4E5B72]">
        Sahaara (सहारा) Clinical Portal • Licensed Counselor Workspace • DPDP Act 2023 & Section 15A
      </footer>
    </div>
  );
}
