import React from 'react';

export const CareProgressBar: React.FC<{ progressPercent: number }> = ({ progressPercent }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#e8f0ec] shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-base font-bold text-[#2d3748]">Your Healing & Relief Journey / आपकी सहायता यात्रा</span>
          <span className="text-xs text-[#52796f] block">Step by step toward safety, dignity, and restorative justice.</span>
        </div>
        <span className="text-xs font-bold text-[#354f52] bg-[#e8f0ec] px-3 py-1 rounded-full border border-[#d8e6de]">
          70% Protected
        </span>
      </div>

      <div className="w-full bg-[#f4f7f5] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#e8f0ec]">
        <div 
          className="bg-gradient-to-r from-[#74a892] to-[#52796f] h-full rounded-full transition-all duration-700 shadow-sm" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-[#52796f] pt-1">
        <span>✓ Complaint Safely Registered</span>
        <span>✓ Support Assigned</span>
        <span className="font-semibold text-[#2d3748]">● Relief In Progress</span>
        <span className="opacity-60">Full Peace</span>
      </div>
    </div>
  );
};
