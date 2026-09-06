import React from 'react';

export const LongitudinalChart: React.FC = () => {
  const data = [
    { day: 'Day 1 (FIR)', score: 72 },
    { day: 'Day 7', score: 55 },
    { day: 'Day 14 (Bail)', score: 88 },
    { day: 'Day 21 (Today)', score: 85 }
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 my-4 shadow-sm">
      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Longitudinal Distress Velocity (DDS Trend)</h4>
      <div className="flex items-end gap-6 h-28 pt-4 px-2 border-b border-slate-200">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold text-slate-700">{d.score}</span>
            <div 
              className={`w-full rounded-t ${d.score > 75 ? 'bg-red-600' : 'bg-amber-500'}`} 
              style={{ height: `${(d.score / 100) * 80}px` }} 
            />
            <span className="text-[10px] text-slate-500 truncate w-full text-center">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
