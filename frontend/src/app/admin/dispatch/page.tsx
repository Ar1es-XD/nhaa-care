'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CommandViewHeader } from '@/components/common/CommandViewHeader';

export default function AdminDispatchPage() {
  const { user } = useAuth();
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('123456');
  const [unmasked, setUnmasked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dispatchedUnits, setDispatchedUnits] = useState<string[]>([]);

  const handleTriggerDispatch = (unitName: string) => {
    setDispatchedUnits((prev) => [...prev, unitName]);
  };

  const handleBreakGlass = (e: React.FormEvent) => {
    e.preventDefault();
    if (justification.length < 50) {
      setErrorMsg('Mandatory statutory justification requires at least 50 characters under Section 5.3.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsProcessing(false);
      setUnmasked(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#23303A]">
      <CommandViewHeader />

      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 space-y-8 flex-1">
        <div className="border-b border-[#D9D4C8] pb-4">
          <h1 className="font-serif text-2xl font-medium text-[#23303A]">
            Inter-Agency Dispatch & Legal Command
          </h1>
          <p className="text-xs text-[#4E5B72] mt-0.5">
            Coordinate cross-departmental actions across Police, DLSA Legal Aid, and Welfare Units under the SC/ST (PoA) Act.
          </p>
        </div>

        {/* 1. Multi-Agency Action Triggers */}
        <div className="bg-white border border-[#D9D4C8] rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#23303A]">
            Active Intervention Dispatch Triggers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Police Escort */}
            <div className="p-4 bg-[#F6F4EF] rounded-xl border border-[#D9D4C8] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#23303A] block">
                    Police Witness Protection Escort
                  </span>
                  <span className="text-[11px] text-[#4E5B72]">
                    Superintendent of Police (Varanasi Rural)
                  </span>
                </div>
                <span className="text-[10px] bg-[#E6EEE8] text-[#5B7A66] px-2 py-0.5 rounded font-medium">
                  Section 15A
                </span>
              </div>
              <p className="text-[#4E5B72] leading-relaxed">
                Deploy armed escort vehicle for trial transit and station regular beat constables at victim residence.
              </p>
              <button
                onClick={() => handleTriggerDispatch('POLICE_ESCORT')}
                disabled={dispatchedUnits.includes('POLICE_ESCORT')}
                className="w-full py-2 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
              >
                {dispatchedUnits.includes('POLICE_ESCORT') ? '✓ Order Transmitted to SP Control' : 'Dispatch Witness Protection'}
              </button>
            </div>

            {/* DLSA Legal Aid */}
            <div className="p-4 bg-[#F6F4EF] rounded-xl border border-[#D9D4C8] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#23303A] block">
                    DLSA Free Legal Aid Counsel Designation
                  </span>
                  <span className="text-[11px] text-[#4E5B72]">
                    District Legal Services Authority
                  </span>
                </div>
                <span className="text-[10px] bg-[#F8F3E8] text-[#B98A2B] px-2 py-0.5 rounded font-medium">
                  Legal Aid
                </span>
              </div>
              <p className="text-[#4E5B72] leading-relaxed">
                Assign senior designated counsel for witness deposition preparation and Section 14A appeal filing.
              </p>
              <button
                onClick={() => handleTriggerDispatch('DLSA_LEGAL')}
                disabled={dispatchedUnits.includes('DLSA_LEGAL')}
                className="w-full py-2 bg-[#1F4A48] hover:bg-[#153331] text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
              >
                {dispatchedUnits.includes('DLSA_LEGAL') ? '✓ Counsel Brief Dispatched' : 'Designate Legal Aid Counsel'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Statutory Break-Glass Emergency Unmasking Protocol */}
        <div className="bg-white border-2 border-[#B98A2B]/40 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#23303A]">
                  Statutory Break-Glass Unmasking Console
                </span>
                <span className="text-[10px] bg-[#F8F3E8] text-[#B98A2B] px-2 py-0.5 rounded font-medium border border-[#E8DFC8]">
                  4-Hour Bounded Token
                </span>
              </div>
              <p className="text-xs text-[#4E5B72] mt-1">
                Restricted to District Magistrate & Superintendent of Police under emergency life-safety protocol.
              </p>
            </div>
          </div>

          {unmasked ? (
            <div className="p-4 bg-[#F8F3E8] border border-[#B98A2B] rounded-lg space-y-3 text-xs animate-soft-settle">
              <span className="font-bold text-[#B98A2B] block">
                ✓ Time-Bounded Unmasking Token Active (Expires in 03:59:59)
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-[#D9D4C8]">
                <div>
                  <span className="text-[10px] text-[#4E5B72] block">Citizen Legal Name</span>
                  <span className="font-bold text-[#23303A]">Priya Devi w/o Late Ramesh</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#4E5B72] block">Verified Mobile Number</span>
                  <span className="font-mono text-[#23303A] font-medium">+91 98765 43210</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#4E5B72] block">Residential Address</span>
                  <span className="text-[#23303A]">Village Shivpur, Pindra, Varanasi</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#4E5B72] block">Audit Hash ID</span>
                  <span className="font-mono text-[10px] text-[#4E5B72] truncate block">sha256:7f849c...</span>
                </div>
              </div>
              <p className="text-[11px] text-[#4E5B72]">
                Audit log entry immutably recorded in PostgreSQL TimescaleDB ledger.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBreakGlass} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#23303A] block">
                  Mandatory Legal Justification (Minimum 50 Characters)
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Enter detailed statutory justification: e.g. Immediate physical threat to witness Priya Devi requiring urgent relocation order by District Magistrate pursuant to SC/ST PoA Rule 15..."
                  rows={3}
                  className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-lg p-3 text-xs text-[#23303A] focus:outline-none focus:border-[#B98A2B]"
                />
                <span className="text-[10px] text-[#4E5B72] block">
                  Character count: {justification.length} / 50 minimum
                </span>
              </div>

              {errorMsg && (
                <p className="text-[#8C4A3A] bg-[#F7ECE9] p-2.5 rounded border border-[#E5CDC6]">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 bg-[#B98A2B] hover:bg-[#9E731F] text-white text-xs font-medium rounded-lg transition"
              >
                {isProcessing ? 'Authenticating...' : 'Authorize 4-Hour Emergency Unmasking'}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72] py-4 border-t border-[#D9D4C8]">
        NHAA Inter-Agency Coordination Ledger • Section 15A Compliant
      </footer>
    </div>
  );
}
