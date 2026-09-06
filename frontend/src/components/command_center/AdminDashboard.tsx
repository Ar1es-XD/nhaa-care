import React from 'react';
import { DistrictHeatmap } from './DistrictHeatmap';
import { BreakGlassConsole } from './BreakGlassConsole';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">District Magistrate & Police Command Center</h1>
          <p className="text-xs text-slate-600">Inter-agency monitoring under SC/ST (PoA) Act Rules 11, 12, and 15</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DistrictHeatmap />
        <BreakGlassConsole />
      </div>
    </div>
  );
};
