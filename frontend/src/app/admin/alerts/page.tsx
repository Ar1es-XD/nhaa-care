'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommandViewHeader } from '@/components/common/CommandViewHeader';

export default function AdminAlertsPage() {
  const [filterState, setFilterState] = useState<'ALL' | 'HIGH' | 'ELEVATED'>('ALL');

  const alerts = [
    {
      id: 'alt-vns-9041',
      caseNumber: 'NHAA/2026/UP/VNS/00492',
      district: 'Varanasi',
      tier: 'HIGH',
      score: 84,
      velocity: '+32',
      trigger: 'Witness Deposition (T-9 Days)',
      intimidationDisclosed: true,
      time: '18 min ago',
      assignedOfficer: 'Dr. Ananya Verma',
    },
    {
      id: 'alt-lko-8812',
      caseNumber: 'NHAA/2026/UP/LKO/00381',
      district: 'Lucknow',
      tier: 'ELEVATED',
      score: 61,
      velocity: '+14',
      trigger: 'Relief Disbursement Delay (18 days)',
      intimidationDisclosed: false,
      time: '2 hours ago',
      assignedOfficer: 'Dr. R. K. Singh',
    },
    {
      id: 'alt-prg-7719',
      caseNumber: 'NHAA/2026/UP/PRG/00215',
      district: 'Prayagraj',
      tier: 'ELEVATED',
      score: 56,
      velocity: '+9',
      trigger: 'Bail Release of Accused',
      intimidationDisclosed: false,
      time: 'Yesterday',
      assignedOfficer: 'S. K. Maurya',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#23303A]">
      <CommandViewHeader />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-6 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9D4C8] pb-4">
          <div>
            <h1 className="font-serif text-2xl font-medium text-[#23303A]">
              Active Escalation Alerts
            </h1>
            <p className="text-xs text-[#4E5B72]">
              Real-time monitoring feed for District Magistrates, SPs, and Nodal Officers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/dispatch"
              className="px-4 py-2 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-medium rounded-lg transition"
            >
              Open Dispatch Console
            </Link>
          </div>
        </div>

        {/* Alert Feed Table */}
        <div className="bg-white border border-[#D9D4C8] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F4EF] border-b border-[#D9D4C8] text-[#4E5B72] font-medium">
                <tr>
                  <th className="py-3 px-4">Case Reference</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Distress Index</th>
                  <th className="py-3 px-4">14-Day Δ</th>
                  <th className="py-3 px-4">Milestone Trigger</th>
                  <th className="py-3 px-4">Intimidation Signal</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D4C8]">
                {alerts.map((a) => (
                  <tr key={a.id} className="hover:bg-[#F6F4EF]/60 transition">
                    <td className="py-3 px-4 font-semibold text-[#23303A]">
                      {a.caseNumber}
                    </td>
                    <td className="py-3 px-4 text-[#4E5B72]">{a.district}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        a.tier === 'HIGH' ? 'bg-[#F7ECE9] text-[#8C4A3A]' : 'bg-[#F8F3E8] text-[#B98A2B]'
                      }`}>
                        {a.score}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#23303A]">{a.velocity}</td>
                    <td className="py-3 px-4 text-[#4E5B72]">{a.trigger}</td>
                    <td className="py-3 px-4">
                      {a.intimidationDisclosed ? (
                        <span className="text-[#8C4A3A] font-semibold bg-[#F7ECE9] px-2 py-0.5 rounded border border-[#E5CDC6]">
                          Threat Reported
                        </span>
                      ) : (
                        <span className="text-[#4E5B72]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/c/case/${a.id}`}
                        className="text-[#1F4A48] hover:underline font-medium"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72] py-4 border-t border-[#D9D4C8]">
        NHAA Command View • Role-Based Access Control Active
      </footer>
    </div>
  );
}
