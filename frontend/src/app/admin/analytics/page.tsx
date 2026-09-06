'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommandViewHeader } from '@/components/common/CommandViewHeader';

export default function AdminAnalyticsPage() {
  const [scope, setScope] = useState<'DISTRICT' | 'STATE'>('DISTRICT');

  const districtData = [
    { district: 'Varanasi', activeCases: 38, highRiskCount: 1, avgDelayDays: 8, reliefDisbursedPct: '74%' },
    { district: 'Lucknow', activeCases: 46, highRiskCount: 2, avgDelayDays: 16, reliefDisbursedPct: '62%' },
    { district: 'Prayagraj', activeCases: 29, highRiskCount: 1, avgDelayDays: 12, reliefDisbursedPct: '68%' },
    { district: 'Gorakhpur', activeCases: 19, highRiskCount: 0, avgDelayDays: 6, reliefDisbursedPct: '89%' },
    { district: 'Agra', activeCases: 24, highRiskCount: 0, avgDelayDays: 11, reliefDisbursedPct: '71%' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#23303A]">
      <CommandViewHeader />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9D4C8] pb-4">
          <div>
            <h1 className="font-serif text-2xl font-medium text-[#23303A]">
              District & State Macro Analytics
            </h1>
            <p className="text-xs text-[#4E5B72]">
              Aggregated longitudinal trends and PoA Rule 12 relief compliance (Individual identity is anonymized at macro tiers).
            </p>
          </div>

          <div className="flex items-center bg-white border border-[#D9D4C8] rounded-lg p-1 text-xs">
            <button
              onClick={() => setScope('DISTRICT')}
              className={`px-3 py-1 rounded transition ${
                scope === 'DISTRICT' ? 'bg-[#1F4A48] text-white font-medium' : 'text-[#4E5B72]'
              }`}
            >
              District Level
            </button>
            <button
              onClick={() => setScope('STATE')}
              className={`px-3 py-1 rounded transition ${
                scope === 'STATE' ? 'bg-[#1F4A48] text-white font-medium' : 'text-[#4E5B72]'
              }`}
            >
              State-Wide Aggregate
            </button>
          </div>
        </div>

        {/* Macro Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#4E5B72] block">Total Active Care Trajectories</span>
            <span className="text-2xl font-serif font-medium text-[#23303A]">156</span>
            <span className="text-[10px] text-[#6E8E7A] block">Monitored across 5 districts</span>
          </div>

          <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#4E5B72] block">High Escalation Trajectories</span>
            <span className="text-2xl font-serif font-medium text-[#8C4A3A]">4</span>
            <span className="text-[10px] text-[#8C4A3A] block">Assigned to senior counsellors</span>
          </div>

          <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#4E5B72] block">Average Rule 12 Relief Delay</span>
            <span className="text-2xl font-serif font-medium text-[#B98A2B]">11.4 Days</span>
            <span className="text-[10px] text-[#4E5B72] block">Statutory standard: &lt; 7 days</span>
          </div>

          <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-1 shadow-sm">
            <span className="text-[11px] text-[#4E5B72] block">Witness Protection Coverage</span>
            <span className="text-2xl font-serif font-medium text-[#1F4A48]">91.2%</span>
            <span className="text-[10px] text-[#6E8E7A] block">Escorts designated before trial</span>
          </div>
        </div>

        {/* District Compliance Table */}
        <div className="bg-white border border-[#D9D4C8] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#D9D4C8]">
            <h2 className="text-xs font-semibold text-[#23303A]">
              District-Wise Compliance & Distress Velocity Distribution
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F4EF] border-b border-[#D9D4C8] text-[#4E5B72] font-medium">
                <tr>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Active Cases</th>
                  <th className="py-3 px-4">High Escalation</th>
                  <th className="py-3 px-4">Avg Relief Delay</th>
                  <th className="py-3 px-4">Relief Disbursed %</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D4C8]">
                {districtData.map((d, i) => (
                  <tr key={i} className="hover:bg-[#F6F4EF]/60 transition">
                    <td className="py-3 px-4 font-semibold text-[#23303A]">{d.district}</td>
                    <td className="py-3 px-4 text-[#4E5B72]">{d.activeCases}</td>
                    <td className="py-3 px-4">
                      {d.highRiskCount > 0 ? (
                        <span className="text-[#8C4A3A] font-semibold bg-[#F7ECE9] px-2 py-0.5 rounded border border-[#E5CDC6]">
                          {d.highRiskCount} Case
                        </span>
                      ) : (
                        <span className="text-[#4E5B72]">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#23303A]">{d.avgDelayDays} Days</td>
                    <td className="py-3 px-4 text-[#1F4A48] font-semibold">{d.reliefDisbursedPct}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-[#6E8E7A] bg-[#E6EEE8] px-2 py-0.5 rounded font-medium">
                        Active Oversight
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72] py-4 border-t border-[#D9D4C8]">
        State Crime Records Bureau & Social Welfare Department Integration
      </footer>
    </div>
  );
}
