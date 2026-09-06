import React from 'react';

export const ReliefTracker: React.FC = () => {
  const stages = [
    { title: 'Stage 1: FIR Registration (25%)', amount: '₹2,12,500', status: 'DISBURSED', date: '18 Aug 2026' },
    { title: 'Stage 2: Chargesheet Filing (50%)', amount: '₹4,25,000', status: 'IN_REVIEW', date: 'Statutory Target: 7 Days' },
    { title: 'Stage 3: Conviction / Trial (25%)', amount: '₹2,12,500', status: 'PENDING', date: 'Upon Trial Conclusion' }
  ];

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-2">Relief & Compensation Status (PoA Rule 12)</h3>
      <div className="space-y-3 mt-3">
        {stages.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between border-b pb-2 text-xs">
            <div>
              <div className="font-semibold text-slate-800">{s.title}</div>
              <div className="text-slate-500">{s.date}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">{s.amount}</div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                s.status === 'DISBURSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
