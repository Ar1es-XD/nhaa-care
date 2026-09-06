import React from 'react';

export const DistrictHeatmap: React.FC = () => {
  const districts = [
    { name: 'Lucknow', cases: 142, tier4: 2, rule12DelayPct: 12 },
    { name: 'Nagpur', cases: 98, tier4: 0, rule12DelayPct: 8 },
    { name: 'Jaipur', cases: 114, tier4: 1, rule12DelayPct: 18 },
    { name: 'Belagavi', cases: 62, tier4: 0, rule12DelayPct: 5 }
  ];

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">District Atrocity Vulnerability & Hotspots</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 border-b">
            <tr>
              <th className="py-2 px-3">District</th>
              <th className="py-2 px-3">Active Monitored Cases</th>
              <th className="py-2 px-3">Tier 4 Critical Hotspots</th>
              <th className="py-2 px-3">Rule 12 Relief Delay Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-800">
            {districts.map((d, i) => (
              <tr key={i}>
                <td className="py-2 px-3 font-semibold">{d.name}</td>
                <td className="py-2 px-3">{d.cases}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded font-bold ${d.tier4 > 0 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'}`}>
                    {d.tier4}
                  </span>
                </td>
                <td className="py-2 px-3">{d.rule12DelayPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
