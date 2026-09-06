'use client';
import React, { useState } from 'react';

export const EmotionPulse: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = [
    { id: 'peaceful', label: 'Peaceful / शांत', emoji: '🟢' },
    { id: 'anxious', label: 'Worried / चिंतित', emoji: '🟡' },
    { id: 'unsafe', label: 'Unsafe / असुरक्षित', emoji: '🔴' }
  ];

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-1">How are you feeling right now? / आप अभी कैसा महसूस कर रहे हैं?</h3>
      <p className="text-xs text-slate-600 mb-4">Your response helps us ensure your protection and care.</p>
      
      {!submitted ? (
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setSelected(opt.id); setSubmitted(true); }}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-sm font-medium text-slate-800"
            >
              <span>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-sm">
          ✓ Thank you. Your response has been recorded in your support record.
        </div>
      )}
    </div>
  );
};
