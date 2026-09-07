'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CommandViewHeader } from '@/components/common/CommandViewHeader';
import { getFullUserDossier, CompleteUserDossier } from '@/lib/interactionStore';

export default function CounselorCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const rawId = (params?.id as string) || 'NHAA/2026/UP/VNS/00492';
  const decodedId = decodeURIComponent(rawId);

  const [dossier, setDossier] = useState<CompleteUserDossier | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'compensation' | 'witness_protection' | 'ai_analysis'>('overview');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'victim') {
      router.replace('/v/dashboard');
      return;
    }
    const loaded = getFullUserDossier(decodedId);
    setDossier(loaded);
    setAiAnalysis(null);
    setActiveTab('overview');
  }, [decodedId, user, router]);

  if (!dossier) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#23303A]">
        <CommandViewHeader />
        <main className="max-w-5xl mx-auto w-full px-4 md:px-8 py-16 text-center space-y-4">
          <h2 className="text-xl font-serif font-bold text-[#23303A]">Case Record Not Found</h2>
          <p className="text-sm text-[#4E5B72]">No database entry matching identifier "{decodedId}".</p>
          <Link
            href="/c/queue"
            className="inline-block px-5 py-2.5 bg-[#1F4A48] text-white text-xs font-semibold rounded-xl"
          >
            Return to Priority Queue
          </Link>
        </main>
      </div>
    );
  }

  const handleGenerateAi = async () => {
    setIsGeneratingAi(true);
    try {
      const recentQuote = dossier.interactionHistory[0]?.userPrompt || 'No recent transcript';
      const res = await fetch('/api/ai/counselor-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: dossier.caseNumber,
          ddsScore: dossier.currentDdsScore,
          velocity: dossier.deltaVelocity14d,
          verbatimQuote: recentQuote,
          milestone: dossier.milestoneContext,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.summary || 'Clinical assessment generated.');
    } catch (e) {
      setAiAnalysis('Unable to generate AI analysis. Please proceed with manual clinical review.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

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
              <span>Case Dossier</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-medium text-[#23303A]">
                {dossier.caseNumber}
              </h1>
              <span className="text-xs bg-[#E8F0EC] text-[#2F5E3D] px-2.5 py-0.5 rounded-full font-bold border border-[#B7D0BF]">
                Assigned: {dossier.assignedCounselorName}
              </span>
            </div>
            <p className="text-xs text-[#4E5B72]">
              {dossier.district} District • {dossier.specialCourt} • FIR: {dossier.firNumber}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-[#4E5B72] block">Current Distress Index</span>
              <span className={`text-2xl font-bold ${
                dossier.currentDdsScore >= 75 ? 'text-[#8C4A3A]' : 'text-[#B98A2B]'
              }`}>
                {dossier.currentDdsScore}/100
              </span>
            </div>
            <Link
              href={`/c/session/${dossier.caseId}`}
              className="px-5 py-2.5 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-medium rounded-lg transition shadow-sm"
            >
              Start Clinical Session
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#D9D4C8] bg-white rounded-t-xl px-4 text-xs font-semibold overflow-x-auto">
          {[
            { key: 'overview', label: '📋 Master Case File' },
            { key: 'interactions', label: `💬 Mapped Chat & Voice (${dossier.interactionHistory.length})` },
            { key: 'compensation', label: '₹ Rule 12 Relief' },
            { key: 'witness_protection', label: '🛡️ Section 15A Protection' },
            { key: 'ai_analysis', label: '🧠 Clinical AI Copilot' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-4 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-[#1F4A48] text-[#1F4A48] font-bold bg-[#FAF8F5]'
                  : 'border-transparent text-[#4E5B72] hover:text-[#23303A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Master Case File */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* SHAP Factor Attribution */}
            <div className="bg-white border border-[#D9D4C8] rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#23303A]">
                    SHAP Explainable Risk Attribution
                  </h2>
                  <p className="text-xs text-[#4E5B72]">
                    Key drivers contributing to the recent distress escalation (Δ +{dossier.deltaVelocity14d})
                  </p>
                </div>
                <span className="text-[11px] bg-[#F8F3E8] text-[#B98A2B] px-2.5 py-0.5 rounded border border-[#E8DFC8] font-medium">
                  Calibrated Model v1.0.2
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { factor: 'Explicit Witness Intimidation Mentioned', contribution: '+42%', width: '84%', color: 'bg-[#8C4A3A]' },
                  { factor: `Acoustic Voice Stress & Jitter (Autonomic Arousal ${dossier.averageArousal}%)`, contribution: '+28%', width: '56%', color: 'bg-[#B98A2B]' },
                  { factor: `Milestone Pressure: ${dossier.milestoneContext}`, contribution: '+18%', width: '36%', color: 'bg-[#B98A2B]' },
                  { factor: 'Delayed Rule 12 Relief Disbursement', contribution: '+12%', width: '24%', color: 'bg-[#6E8E7A]' },
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

            {/* Master DB Record Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Judicial & Police Details */}
              <div className="bg-white p-5 border border-[#D9D4C8] rounded-xl space-y-3 shadow-sm">
                <h3 className="text-xs font-bold text-[#1F4A48] uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚖️</span> Judicial & Police Master Records
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">FIR Number:</span>
                    <span className="font-semibold">{dossier.firNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Filing Date:</span>
                    <span className="font-semibold">{dossier.firDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Police Station:</span>
                    <span className="font-semibold">{dossier.policeStation}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Investigating Officer:</span>
                    <span className="font-semibold">{dossier.investigatingOfficer}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Special Court:</span>
                    <span className="font-semibold">{dossier.specialCourt}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4E5B72]">Special Judge:</span>
                    <span className="font-semibold">{dossier.judgeName}</span>
                  </div>
                </div>
              </div>

              {/* Demographic & Identity Records */}
              <div className="bg-white p-5 border border-[#D9D4C8] rounded-xl space-y-3 shadow-sm">
                <h3 className="text-xs font-bold text-[#1F4A48] uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔐</span> Sovereign Vault Demographics
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Sealed Identity:</span>
                    <span className="font-semibold text-[#1F4A48]">{dossier.anonymizedIdentifier}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Caste Classification:</span>
                    <span className="font-semibold">{dossier.casteCategory}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Village / Tehsil:</span>
                    <span className="font-semibold">{dossier.villageTehsil}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Dependents:</span>
                    <span className="font-semibold">{dossier.dependentsCount} Family Members</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EBE7DF]">
                    <span className="text-[#4E5B72]">Economic Vulnerability:</span>
                    <span className="font-semibold text-[#8C4A3A]">{dossier.economicVulnerability}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4E5B72]">Upcoming Milestone:</span>
                    <span className="font-semibold text-[#B98A2B]">{dossier.milestoneContext} ({dossier.milestoneDueDate})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Sections */}
            <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-[#23303A] uppercase tracking-wider">
                Statutory Offence Classifications & Penal Sections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-[#4E5B72] block mb-1.5">
                    SC/ST (Prevention of Atrocities) Act Sections:
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {dossier.poaSections.map((sec, idx) => (
                      <li key={idx} className="p-2 bg-[#FAF3E0] border border-[#E6D4A8] rounded-lg text-[#8C6B1F] font-medium">
                        ⚖️ {sec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#4E5B72] block mb-1.5">
                    Bharatiya Nyaya Sanhita (BNS) / IPC Sections:
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {dossier.ipcSections.map((sec, idx) => (
                      <li key={idx} className="p-2 bg-[#F6F4EF] border border-[#D9D4C8] rounded-lg text-[#23303A] font-medium">
                        📜 {sec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Mapped Chat & Voice */}
        {activeTab === 'interactions' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#D9D4C8] shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#23303A]">Live Mapped Behavioral & Chat Stream</h3>
                <p className="text-xs text-[#4E5B72]">
                  Unfiltered verbatim logs from citizen private check-in, voice reflections, and outbound IVRS.
                </p>
              </div>
              <span className="text-xs bg-[#E8F0EC] text-[#2F5E3D] px-3 py-1 rounded-full font-bold border border-[#B7D0BF]">
                ● Real-Time Bi-Directional Sync
              </span>
            </div>

            {dossier.interactionHistory.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#4E5B72] bg-white rounded-xl border border-dashed border-[#D9D4C8]">
                No interaction turns recorded yet for this case.
              </div>
            ) : (
              <div className="space-y-3">
                {dossier.interactionHistory.map((turn) => (
                  <div
                    key={turn.id}
                    className={`p-5 rounded-xl border transition ${
                      turn.isSafetyEscalation
                        ? 'bg-[#FDF7F5] border-[#E5CDC6] shadow-sm'
                        : 'bg-white border-[#D9D4C8] shadow-sm'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#EBE7DF]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#EBE7DF] text-[#23303A]">
                          {turn.channel}
                        </span>
                        <span className="text-xs text-[#4E5B72]">{turn.timestamp}</span>
                        {turn.isSafetyEscalation && (
                          <span className="text-[10px] bg-[#F7ECE9] text-[#8C4A3A] px-2 py-0.5 rounded font-bold border border-[#E5CDC6]">
                            🚨 Safety Escalation Triggered
                          </span>
                        )}
                        {turn.isTerse && (
                          <span className="text-[10px] bg-[#FAF3E0] text-[#8C6B1F] px-2 py-0.5 rounded font-bold border border-[#E6D4A8]">
                            ⚠️ Terse / Guarded Utterance
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#4E5B72]">Autonomic Arousal:</span>
                        <strong className="text-[#8C4A3A]">{turn.autonomicArousal}%</strong>
                        <span className="text-[#4E5B72] border-l pl-2">State: <strong>{turn.emotion}</strong></span>
                      </div>
                    </div>

                    {/* Verbatim Utterance */}
                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-bold text-[#4E5B72] uppercase tracking-wider block">
                        Citizen Verbatim Utterance:
                      </span>
                      <p className="text-xs font-medium text-[#23303A] bg-[#FAF8F5] p-3 rounded-xl border border-[#EBE7DF] leading-relaxed">
                        "{turn.userPrompt}"
                      </p>
                    </div>

                    {/* AI Response */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#5B7A66] uppercase tracking-wider block">
                        Sahaara AI Companion Response:
                      </span>
                      <p className="text-xs text-[#4E5B72] bg-[#F4F8F5] p-3 rounded-xl border border-[#C6DFD4] leading-relaxed whitespace-pre-line">
                        {turn.aiResponse}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Rule 12 Relief */}
        {activeTab === 'compensation' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#D9D4C8] shadow-sm">
              <h3 className="text-sm font-bold text-[#23303A]">Rule 12 SC/ST (PoA) Relief Ledger</h3>
              <p className="text-xs text-[#4E5B72]">
                Statutory compensation stages, disbursal timelines, and state accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dossier.compensationRecords.map((comp, idx) => (
                <div key={idx} className="p-5 bg-white border border-[#D9D4C8] rounded-xl space-y-2 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#23303A]">{comp.stage}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      comp.status === 'DISBURSED'
                        ? 'bg-[#E8F0EC] text-[#2F5E3D]'
                        : comp.status === 'PENDING_APPROVAL'
                        ? 'bg-[#F7ECE9] text-[#8C4A3A]'
                        : 'bg-[#FAF3E0] text-[#8C6B1F]'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#4E5B72] leading-tight">{comp.description}</p>
                  <div className="pt-2 border-t border-[#EBE7DF] flex justify-between items-baseline">
                    <span className="text-xs text-[#4E5B72]">Sanctioned:</span>
                    <span className="text-sm font-bold text-[#1F4A48]">₹{comp.sanctionedAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-[#4E5B72]">Disbursed:</span>
                    <span className="text-xs font-bold text-[#2F5E3D]">₹{comp.disbursedAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {comp.disbursementDate && (
                    <span className="text-[11px] text-[#4E5B72] block">
                      Disbursed on: {comp.disbursementDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Section 15A Witness Protection */}
        {activeTab === 'witness_protection' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#D9D4C8] shadow-sm">
              <h3 className="text-sm font-bold text-[#23303A]">Section 15A Witness Protection Matrix</h3>
              <p className="text-xs text-[#4E5B72]">
                Statutory security safeguards ordered by the Special Court and District Administration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white border border-[#D9D4C8] rounded-xl space-y-3 shadow-sm text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#EBE7DF]">
                  <span className="text-[#4E5B72]">Threat Evaluation Level:</span>
                  <strong className="text-[#8C4A3A]">{dossier.witnessProtection.threatLevel}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EBE7DF]">
                  <span className="text-[#4E5B72]">Section 15A Order Active:</span>
                  <strong className="text-[#2F5E3D]">{dossier.witnessProtection.section15AOrdered ? 'YES (Active)' : 'NO'}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EBE7DF]">
                  <span className="text-[#4E5B72]">Dedicated Police Escort:</span>
                  <strong className="text-[#2F5E3D]">{dossier.witnessProtection.policeEscortAssigned ? 'ASSIGNED' : 'PENDING'}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EBE7DF]">
                  <span className="text-[#4E5B72]">CCTV at Residence:</span>
                  <strong className="text-[#2F5E3D]">{dossier.witnessProtection.cctvMonitoringAtResidence ? 'INSTALLED' : 'NOT APPLICABLE'}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#4E5B72]">Last Police Patrol Verification:</span>
                  <strong className="text-[#1F4A48]">{dossier.witnessProtection.lastPatrolCheckin}</strong>
                </div>
              </div>

              <div className="p-5 bg-white border border-[#D9D4C8] rounded-xl space-y-3 text-xs shadow-sm">
                <span className="font-bold text-[#1F4A48] block">Nodal Officer Coordination:</span>
                <p className="text-[#4E5B72] leading-relaxed">
                  Assigned Officer: <strong>{dossier.witnessProtection.nodalOfficer}</strong>.
                  Under Section 15A(10), the Special Court may order relocation, change of identity, and immediate safe transit protection upon application by the counselor or victim.
                </p>
                <button
                  onClick={() => alert("Urgent Section 15A Patrol Request Dispatched to SP Varanasi.")}
                  className="w-full py-2.5 bg-[#8C4A3A] hover:bg-[#723C2F] text-white rounded-xl font-bold transition shadow-sm"
                >
                  🚨 Dispatch Emergency Police Escort Check
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: AI Clinical Copilot */}
        {activeTab === 'ai_analysis' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#D9D4C8] shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#23303A]">OpenAI Clinical Copilot Deep Analysis</h3>
                <p className="text-xs text-[#4E5B72]">
                  Synthesizes all database records, longitudinal tremor metrics, and mapped chat transcripts into a clinical brief.
                </p>
              </div>
              <button
                onClick={handleGenerateAi}
                disabled={isGeneratingAi}
                className="px-5 py-2.5 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>🧠</span>
                <span>{isGeneratingAi ? 'Analyzing Complete DB Dossier...' : 'Generate Clinical Brief'}</span>
              </button>
            </div>

            {aiAnalysis ? (
              <div className="p-6 bg-white border border-[#C6DFD4] rounded-xl text-xs text-[#23303A] leading-relaxed whitespace-pre-line font-medium shadow-sm">
                {aiAnalysis}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[#4E5B72] bg-white rounded-xl border border-dashed border-[#D9D4C8] space-y-2">
                <p className="font-semibold text-sm text-[#23303A]">No Clinical Synthesis Generated Yet</p>
                <p>Click "Generate Clinical Brief" above to invoke the OpenAI clinical engine on this user's entire dataset.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-[#4E5B72] py-4 border-t border-[#D9D4C8] bg-white">
        <Link href="/c/queue" className="hover:underline text-[#1F4A48] font-medium">Return to Counselor Priority Queue</Link>
      </footer>
    </div>
  );
}
