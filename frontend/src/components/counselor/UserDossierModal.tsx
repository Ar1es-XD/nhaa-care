'use client';

import React, { useState } from 'react';
import { CompleteUserDossier } from '@/lib/interactionStore';

interface UserDossierModalProps {
  dossier: CompleteUserDossier | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDossierModal: React.FC<UserDossierModalProps> = ({ dossier, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'compensation' | 'witness_protection' | 'ai_analysis'>('overview');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  if (!isOpen || !dossier) return null;

  const handleGenerateDossierAi = async () => {
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
      setAiAnalysis('Unable to generate AI analysis. Please proceed with manual clinical notes.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl border border-[#D9D4C8] shadow-2xl flex flex-col overflow-hidden animate-scale-up text-[#23303A]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EBE7DF] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F4A48] text-white flex items-center justify-center font-bold text-base shadow-sm">
              📁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#23303A]">
                  Complete DB Record: {dossier.anonymizedIdentifier}
                </h2>
                <span className="text-[10px] bg-[#E8F0EC] text-[#2F5E3D] px-2.5 py-0.5 rounded-full font-bold border border-[#B7D0BF]">
                  Assigned to Dr. Ananya Verma
                </span>
              </div>
              <p className="text-xs text-[#4E5B72]">
                Case: <strong className="font-mono">{dossier.caseNumber}</strong> • {dossier.district}, {dossier.state} • FIR: {dossier.firNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
              dossier.currentDdsScore >= 75
                ? 'bg-[#F7ECE9] text-[#8C4A3A] border-[#E5CDC6]'
                : 'bg-[#FAF3E0] text-[#8C6B1F] border-[#E6D4A8]'
            }`}>
              DDS {dossier.currentDdsScore}/100 (Δ +{dossier.deltaVelocity14d})
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#EBE7DF] hover:bg-[#D9D4C8] text-[#23303A] flex items-center justify-center font-bold text-sm transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#EBE7DF] bg-[#F6F4EF] px-6 text-xs font-semibold overflow-x-auto">
          {[
            { key: 'overview', label: '📋 Master Case File' },
            { key: 'interactions', label: `💬 Mapped Chat & Voice (${dossier.interactionHistory.length})` },
            { key: 'compensation', label: '₹ Rule 12 Relief' },
            { key: 'witness_protection', label: '🛡️ Section 15A Protection' },
            { key: 'ai_analysis', label: '🧠 Clinical AI Synthesis' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-4 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-[#1F4A48] text-[#1F4A48] font-bold bg-white'
                  : 'border-transparent text-[#4E5B72] hover:text-[#23303A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: MASTER OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Judicial & Police Details */}
                <div className="p-4 bg-[#FAF8F5] border border-[#EBE7DF] rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-[#1F4A48] uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚖️</span> Judicial & Police Master Records
                  </h3>
                  <div className="space-y-1.5 text-xs">
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
                <div className="p-4 bg-[#FAF8F5] border border-[#EBE7DF] rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-[#1F4A48] uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔐</span> Sovereign Vault Demographics
                  </h3>
                  <div className="space-y-1.5 text-xs">
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
                      <span className="font-semibold text-[#B98A2B]">{dossier.milestoneContext}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Legal Charges */}
              <div className="p-4 bg-white border border-[#EBE7DF] rounded-2xl space-y-3 shadow-sm">
                <h3 className="text-xs font-bold text-[#23303A] uppercase tracking-wider">
                  Statutory Offence Classifications & Penal Sections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#4E5B72] block mb-1.5">
                      SC/ST (Prevention of Atrocities) Act Sections:
                    </span>
                    <ul className="space-y-1 text-xs">
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
                    <ul className="space-y-1 text-xs">
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

          {/* TAB 2: MAPPED CHAT & VOICE INTERACTIONS */}
          {activeTab === 'interactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#23303A]">Live Mapped Interaction Stream</h3>
                  <p className="text-[11px] text-[#4E5B72]">
                    Transcribed directly from the citizen's private check-in chat, voice journal sanctuary, and IVRS turns.
                  </p>
                </div>
                <span className="text-xs bg-[#E8F0EC] text-[#2F5E3D] px-2.5 py-1 rounded-full font-bold border border-[#B7D0BF]">
                  ● Active Behavioral Sync
                </span>
              </div>

              {dossier.interactionHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#4E5B72] bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D9D4C8]">
                  No interaction turns recorded yet for this case.
                </div>
              ) : (
                <div className="space-y-3">
                  {dossier.interactionHistory.map((turn) => (
                    <div
                      key={turn.id}
                      className={`p-4 rounded-2xl border transition ${
                        turn.isSafetyEscalation
                          ? 'bg-[#FDF7F5] border-[#E5CDC6] shadow-sm'
                          : 'bg-white border-[#EBE7DF] shadow-sm'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#EBE7DF]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EBE7DF] text-[#23303A]">
                            {turn.channel}
                          </span>
                          <span className="text-[11px] text-[#4E5B72]">{turn.timestamp}</span>
                          {turn.isSafetyEscalation && (
                            <span className="text-[10px] bg-[#F7ECE9] text-[#8C4A3A] px-2 py-0.5 rounded font-bold border border-[#E5CDC6]">
                              🚨 Safety Escalation Triggered
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[#4E5B72]">Acoustic Tremor:</span>
                          <strong className="text-[#8C4A3A]">{turn.autonomicArousal}%</strong>
                          <span className="text-[#4E5B72] border-l pl-2">State: <strong>{turn.emotion}</strong></span>
                        </div>
                      </div>

                      {/* Citizen Raw Verbatim Input */}
                      <div className="space-y-1 mb-3">
                        <span className="text-[10px] font-bold text-[#4E5B72] uppercase tracking-wider block">
                          Citizen Verbatim Utterance:
                        </span>
                        <p className="text-xs font-medium text-[#23303A] bg-[#FAF8F5] p-3 rounded-xl border border-[#EBE7DF] leading-relaxed">
                          "{turn.userPrompt}"
                        </p>
                      </div>

                      {/* AI Companion Grounding Response */}
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

          {/* TAB 3: COMPENSATION & RELIEF */}
          {activeTab === 'compensation' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-[#23303A]">Rule 12 SC/ST (PoA) Relief Ledger</h3>
                <p className="text-[11px] text-[#4E5B72]">
                  Mandatory statutory compensation stages, disbursement tracking, and delay accountability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {dossier.compensationRecords.map((comp, idx) => (
                  <div key={idx} className="p-4 bg-white border border-[#EBE7DF] rounded-2xl space-y-2 shadow-sm">
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
                    <p className="text-[11px] text-[#4E5B72] leading-tight">{comp.description}</p>
                    <div className="pt-2 border-t border-[#EBE7DF] flex justify-between items-baseline">
                      <span className="text-[11px] text-[#4E5B72]">Sanctioned:</span>
                      <span className="text-sm font-bold text-[#1F4A48]">₹{comp.sanctionedAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] text-[#4E5B72]">Disbursed:</span>
                      <span className="text-xs font-bold text-[#2F5E3D]">₹{comp.disbursedAmount.toLocaleString('en-IN')}</span>
                    </div>
                    {comp.disbursementDate && (
                      <span className="text-[10px] text-[#4E5B72] block">
                        Disbursed on: {comp.disbursementDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WITNESS PROTECTION */}
          {activeTab === 'witness_protection' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-[#23303A]">Section 15A Witness Protection Matrix</h3>
                <p className="text-[11px] text-[#4E5B72]">
                  Statutory security safeguards ordered by the Special Court and District Administration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#EBE7DF] rounded-2xl space-y-3 shadow-sm text-xs">
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

                <div className="p-4 bg-[#FAF8F5] border border-[#EBE7DF] rounded-2xl space-y-3 text-xs">
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

          {/* TAB 5: AI CLINICAL SYNTHESIS */}
          {activeTab === 'ai_analysis' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#23303A]">OpenAI Clinical Copilot Deep Analysis</h3>
                  <p className="text-[11px] text-[#4E5B72]">
                    Synthesizes all DB records, longitudinal tremor metrics, and mapped chat transcripts into a clinical brief.
                  </p>
                </div>
                <button
                  onClick={handleGenerateDossierAi}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>🧠</span>
                  <span>{isGeneratingAi ? 'Analyzing DB Dossier...' : 'Generate Clinical Brief'}</span>
                </button>
              </div>

              {aiAnalysis ? (
                <div className="p-5 bg-[#FAF8F5] border border-[#C6DFD4] rounded-2xl text-xs text-[#23303A] leading-relaxed whitespace-pre-line font-medium shadow-sm">
                  {aiAnalysis}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#4E5B72] bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D9D4C8] space-y-2">
                  <p>Click "Generate Clinical Brief" to invoke the OpenAI clinical copilot on this user's entire dataset.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#EBE7DF] bg-[#FAF8F5] flex justify-between items-center text-xs">
          <span className="text-[#4E5B72]">
            DPDP Act 2023 & Section 15A Protected Record
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#EBE7DF] hover:bg-[#D9D4C8] text-[#23303A] font-semibold rounded-xl transition"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
