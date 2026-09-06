import React from 'react';
import { CareProgressBar } from './CareProgressBar';
import { EmotionPulse } from './EmotionPulse';
import { ReliefTracker } from './ReliefTracker';
import { OneTapCall } from './OneTapCall';

export const CitizenPortal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Namaste Ramesh Kumar / नमस्ते रमेश कुमार</h2>
        <p className="text-xs text-slate-600 mt-1">Case ID: NHAA/2026/UP/LKO/00492 | Police Station: Sadar, Lucknow</p>
        <p className="text-xs text-slate-600">Assigned Legal Aid Counsel: Adv. Ananya Sharma (DLSA)</p>
      </div>

      <CareProgressBar progressPercent={70} />
      <EmotionPulse />
      <ReliefTracker />
      <OneTapCall />
    </div>
  );
};
