'use client';
import React, { useState, useEffect } from 'react';
import { fetchDistrictOverview, DistrictOverview } from '@/lib/api';

export const DistrictHeatmap: React.FC = () => {
  const [overview, setOverview] = useState<DistrictOverview | null>(null);
  const [districts, setDistricts] = useState([
    { name: 'Lucknow', cases: 142, tier4: 2, rule12DelayPct: 12 },
    { name: 'Nagpur', cases: 98, tier4: 0, rule12DelayPct: 8 },
    { name: 'Varanasi', cases: 114, tier4: 1, rule12DelayPct: 14 },
    { name: 'Belagavi', cases: 62, tier4: 0, rule12DelayPct: 5 }
  ]);

  useEffect(() => {
    fetchDistrictOverview()
      .then((data) => {
        if (data) {
          setOverview(data);
          if (data.hotspot_police_stations && data.hotspot_police_stations.length > 0) {
            setDistricts([
              { name: 'Lucknow', cases: data.active_cases_monitored, tier4: data.critical_alerts_in_triage, rule12DelayPct: 12 },
              { name: 'Nagpur', cases: 98, tier4: 0, rule12DelayPct: 8 },
              { name: 'Varanasi', cases: 114, tier4: 1, rule12DelayPct: 14 },
              { name: 'Belagavi', cases: 62, tier4: 0, rule12DelayPct: 5 }
            ]);
          }
        }
      })
      .catch((err) => {
        console.warn('Backend overview API fallback:', err);
      });
  }, []);

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
