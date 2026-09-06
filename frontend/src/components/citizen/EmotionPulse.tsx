'use client';
import React, { useState } from 'react';

export const EmotionPulse: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = [
    { id: 'calm', label: 'Peaceful & Grounded', hindi: 'शांत एवं स्थिर', emoji: '🌿', color: 'hover:border-[#2a9d8f] hover:bg-[#e8f0ec]' },
    { id: 'tired', label: 'Tired / Heavyhearted', hindi: 'थका हुआ / उदास', emoji: '🍂', color: 'hover:border-[#e9c46a] hover:bg-[#fcf8ec]' },
    { id: 'anxious', label: 'Anxious / Uneasy', hindi: 'चिंतित / बेचैन', emoji: '🌊', color: 'hover:border-[#f4a261] hover:bg-[#fef4ec]' },
    { id: 'unsafe', label: 'Need Immediate Support', hindi: 'मदद की तुरंत ज़रूरत', emoji: '🛡️', color: 'hover:border-[#e76f51] hover:bg-[#fdf1ee]' }
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#e8f0ec] shadow-sm space-y-3">
      <div>
        <h3 className="text-base font-bold text-[#2d3748]">How is your heart feeling today? / आज आप कैसा महसूस कर रहे हैं?</h3>
        <p className="text-xs text-[#52796f]">Checking in with yourself is a step toward peace. Your response is completely private.</p>
      </div>
      
      {!submitted ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setSelected(opt.id); setSubmitted(true); }}
              className={`flex items-center gap-3 p-3.5 border border-[#e8f0ec] rounded-2xl transition text-left group bg-[#faf8f5] ${opt.color}`}
            >
              <span className="text-2xl group-hover:scale-110 transition">{opt.emoji}</span>
              <div>
                <div className="text-xs font-bold text-[#2d3748]">{opt.label}</div>
                <div className="text-[11px] text-[#52796f]">{opt.hindi}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-[#e8f0ec] border border-[#d8e6de] text-[#354f52] p-4 rounded-2xl text-xs space-y-1">
          <div className="font-bold text-[#2d3748]">🌸 Thank you for checking in.</div>
          <p>
            "Remember: Healing is not linear. Take your time, breathe deeply, and know that your courage is recognized."
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-[11px] text-[#52796f] underline font-semibold pt-1 block"
          >
            Update mood check-in
          </button>
        </div>
      )}
    </div>
  );
};
