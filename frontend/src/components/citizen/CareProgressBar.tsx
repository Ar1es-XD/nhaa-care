import React from 'react';

export const CareProgressBar: React.FC<{ progressPercent: number }> = ({ progressPercent }) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-800">Care & Support Progress / देखभाल एवं सहायता प्रगति</span>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active Care</span>
      </div>
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div 
          className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Your assigned district counselor reviews your support profile weekly. Your next check-in is scheduled for Friday.
      </p>
    </div>
  );
};
