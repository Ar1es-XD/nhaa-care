'use client';
import React, { useState, useEffect } from 'react';

export const BreathingWidget: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        if (phase === 'Inhale') { setPhase('Hold'); return 7; }
        if (phase === 'Hold') { setPhase('Exhale'); return 8; }
        if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
        return 4;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, phase]);

  return (
    <div className="bg-gradient-to-br from-[#e8f0ec] to-[#f4f7f5] p-6 rounded-3xl border border-[#d8e6de] text-center shadow-sm">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-lg">🫁</span>
        <h3 className="text-sm font-bold text-[#354f52] uppercase tracking-wider">
          Mindful Box Breathing / शांत प्राणायाम
        </h3>
      </div>
      <p className="text-xs text-[#52796f] mb-4">
        Slow down your pulse and steady your thoughts. Follow the gentle rhythm below.
      </p>

      <div className="flex flex-col items-center justify-center my-4">
        <div 
          className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-md ${
            !isActive ? 'bg-[#52796f] text-white scale-95' :
            phase === 'Inhale' ? 'scale-110 bg-[#74a892] text-white' :
            phase === 'Hold' ? 'scale-110 bg-[#52796f] text-white' :
            'scale-90 bg-[#a4c2b5] text-white'
          }`}
        >
          <span className="text-xs font-semibold tracking-wide uppercase">{isActive ? phase : 'Ready?'}</span>
          <span className="text-3xl font-black">{isActive ? countdown : '●'}</span>
          <span className="text-[10px] opacity-80 mt-0.5">
            {isActive ? (phase === 'Inhale' ? 'Deep breath in' : phase === 'Hold' ? 'Gentle pause' : 'Slow release') : '4-7-8 Rhythm'}
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className="mt-2 px-6 py-2.5 rounded-full bg-[#354f52] hover:bg-[#283c3e] text-white text-xs font-bold shadow transition"
      >
        {isActive ? 'Pause Exercise' : 'Begin 4-7-8 Breathing'}
      </button>
    </div>
  );
};
