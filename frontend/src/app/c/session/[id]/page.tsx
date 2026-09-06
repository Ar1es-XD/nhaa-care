'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CommandViewHeader } from '@/components/common/CommandViewHeader';

export default function CounselorSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, saveDraftNote, getDraftNote } = useAuth();
  const caseId = (params?.id as string) || 'alt-vns-9041';

  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(142); // in seconds
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedActions, setSelectedActions] = useState<string[]>([
    'WITNESS_POLICE_PATROL',
    'DLSA_LEGAL_PREP',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionDispatched, setActionDispatched] = useState(false);

  // Restore saved draft note if previously interrupted
  useEffect(() => {
    const saved = getDraftNote(caseId);
    if (saved) {
      setClinicalNotes(saved);
    }
  }, [caseId, getDraftNote]);

  // Save draft note on change for session state preservation
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClinicalNotes(e.target.value);
    saveDraftNote(caseId, e.target.value);
  };

  // Call duration counter
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleGenerateAiInsight = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/counselor-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: 'NHAA/2026/UP/VNS/00492',
          ddsScore: 84,
          velocity: 32,
          verbatimQuote: 'kal shaam ko unke aadmi aaye the. Bole ki gawaahi wapas le le nahi toh ghar jala denge. Hum bahut dare hue hain.',
          milestone: 'Witness Deposition in 9 days',
        }),
      });
      const data = await res.json();
      setAiInsight(data.summary);
    } catch (e) {
      setAiInsight('Unable to fetch clinical summary. Proceed with manual documentation.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const toggleAction = (act: string) => {
    if (selectedActions.includes(act)) {
      setSelectedActions(selectedActions.filter((a) => a !== act));
    } else {
      setSelectedActions([...selectedActions, act]);
    }
  };

  const handleCompleteSession = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActionDispatched(true);
      setTimeout(() => {
        router.push('/c/queue');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#23303A]">
      <CommandViewHeader />

      <main className="max-w-5xl mx-auto w-full px-4 md:px-8 py-8 space-y-6 flex-1">
        {/* Active Call Status Bar */}
        <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${callActive ? 'bg-[#6E8E7A] animate-pulse' : 'bg-[#D9D4C8]'}`} />
            <div>
              <span className="text-xs font-semibold text-[#23303A] block">
                {callActive ? 'Encrypted Tele-Counseling Call in Progress' : 'Call Concluded'}
              </span>
              <p className="text-[11px] text-[#4E5B72]">
                Citizen: Priya Devi • Case NHAA/2026/UP/VNS/00492
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-mono font-medium text-[#23303A]">
              Duration: {formatTimer(callDuration)}
            </span>
            <button
              onClick={() => setCallActive(!callActive)}
              className={`px-3 py-1.5 rounded font-medium transition ${
                callActive
                  ? 'bg-[#8C4A3A] text-white hover:bg-[#783e30]'
                  : 'bg-[#6E8E7A] text-white hover:bg-[#5B7A66]'
              }`}
            >
              {callActive ? 'End Call' : 'Resume'}
            </button>
          </div>
        </div>

        {/* Two-Column Clinical Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left (7 cols): Clinical Notes & Copilot */}
          <div className="lg:col-span-7 space-y-5">
            {/* Notes with State Preservation */}
            <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#23303A]">
                  Clinical Observation & Assessment Notes
                </span>
                <span className="text-[11px] text-[#6E8E7A]">
                  Auto-saved to draft
                </span>
              </div>

              <textarea
                value={clinicalNotes}
                onChange={handleNotesChange}
                rows={6}
                placeholder="Document citizen's emotional affect, verified threats, coping capacity, and legal concerns... (Draft is preserved automatically)"
                className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-lg p-3 text-xs text-[#23303A] focus:outline-none focus:border-[#1F4A48] leading-relaxed"
              />
            </div>

            {/* AI Clinical Copilot */}
            <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#23303A]">
                  Clinical Decision Support (Gemini Copilot)
                </span>
                <button
                  onClick={handleGenerateAiInsight}
                  disabled={isGeneratingAi}
                  className="text-xs bg-[#1F4A48] hover:bg-[#153331] text-white px-3 py-1 rounded transition disabled:opacity-50"
                >
                  {isGeneratingAi ? 'Analyzing...' : 'Generate Case Summary'}
                </button>
              </div>

              {aiInsight && (
                <div className="p-3.5 bg-[#F6F4EF] border border-[#D9D4C8] rounded-lg text-xs text-[#23303A] leading-relaxed whitespace-pre-line animate-soft-settle">
                  {aiInsight}
                </div>
              )}
            </div>
          </div>

          {/* Right (5 cols): Inter-Agency Action Confirmation */}
          <div className="lg:col-span-5 bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-5 shadow-sm">
            <div>
              <h3 className="text-xs font-semibold text-[#23303A]">
                Human Clinical Verification & Sign-off
              </h3>
              <p className="text-[11px] text-[#4E5B72]">
                Select actions authorized under clinical protocol:
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: 'WITNESS_POLICE_PATROL', label: 'Witness Protection Escort (SP Dispatch)' },
                { id: 'DLSA_LEGAL_PREP', label: 'DLSA Free Legal Aid Briefing (Trial Prep)' },
                { id: 'RELIEF_ACCELERATION', label: 'Rule 12 Relief Acceleration (DM Nodal Unit)' },
                { id: 'SAFE_TRANSIT', label: 'Safe Shelter / Emergency Transit Review' },
              ].map((act) => (
                <label
                  key={act.id}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-[#D9D4C8] bg-[#F6F4EF] hover:bg-white cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedActions.includes(act.id)}
                    onChange={() => toggleAction(act.id)}
                    className="rounded text-[#1F4A48] focus:ring-0"
                  />
                  <span className="text-xs font-medium text-[#23303A]">{act.label}</span>
                </label>
              ))}
            </div>

            <div className="p-3 bg-[#F8F3E8] border border-[#E8DFC8] rounded-lg text-[11px] text-[#23303A] space-y-1">
              <span className="font-semibold text-[#B98A2B] block">Legal Verification Record:</span>
              <p className="text-[#4E5B72]">
                Signed by: <strong>{user?.name || 'Dr. Ananya Verma'}</strong> (Council Reg #MH-7482)
              </p>
            </div>

            {actionDispatched ? (
              <div className="p-3 bg-[#E6EEE8] text-[#5B7A66] rounded-lg text-xs font-medium text-center animate-soft-settle">
                ✓ Actions Verified & Dispatched to SP Varanasi & DLSA
              </div>
            ) : (
              <button
                onClick={handleCompleteSession}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-medium rounded-lg transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Logging Verification...' : 'Sign & Dispatch Inter-Agency Actions'}
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72] py-4 border-t border-[#D9D4C8]">
        NHAA Clinical Session Audit • Record is cryptographically chained
      </footer>
    </div>
  );
}
