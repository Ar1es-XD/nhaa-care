'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SahayQuietHeader } from '@/components/common/SahayQuietHeader';
import { BreathingWidget } from '@/components/common/BreathingWidget';

export default function VictimDashboardPage() {
  const { user } = useAuth();
  const [counselorRequested, setCounselorRequested] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between">
      <SahayQuietHeader />

      <main className="max-w-xl mx-auto w-full px-4 py-8 md:py-12 space-y-8">
        {/* Reassurance Hero (Center-Aligned) */}
        <section className="text-center space-y-3 pt-2">
          <div className="inline-block p-2 rounded-full bg-[#E6EEE8] text-[#5B7A66] mb-1">
            🌿
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#23303A] tracking-tight">
            Good morning, {user?.name || 'Priya'}
          </h1>
          <p className="text-xs md:text-sm text-[#4E5B72] leading-relaxed max-w-md mx-auto measure-readable">
            Someone is watching out for you today. Your case is under active review by your district nodal officer, and your legal aid counsel is confirmed for the upcoming hearing.
          </p>
        </section>

        {/* Exactly One Primary Action Button */}
        <section className="text-center">
          <Link
            href="/v/check-in"
            className="inline-block w-full max-w-md py-4 px-6 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-sm font-medium rounded-xl shadow-sm transition"
          >
            Begin today's gentle check-in
          </Link>
          <p className="text-[11px] text-[#4E5B72] mt-2">
            Takes less than two minutes • Voice or text
          </p>
        </section>

        {/* Milestone Care Continuity Notice */}
        <section className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#23303A]">
              Next Case Milestone
            </span>
            <span className="text-[11px] text-[#6E8E7A] bg-[#E6EEE8] px-2.5 py-0.5 rounded-full font-medium">
              In 9 days
            </span>
          </div>
          <p className="text-xs text-[#4E5B72] leading-relaxed">
            Witness deposition hearing scheduled at Special Court (SC/ST PoA), Varanasi on September 15, 2026.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-[#D9D4C8] text-xs">
            <Link
              href="/v/case-status"
              className="text-[#6E8E7A] hover:text-[#5B7A66] underline underline-offset-4"
            >
              View full case & relief status
            </Link>
            <span className="text-[#4E5B72] text-[11px]">
              Police protection active
            </span>
          </div>
        </section>

        {/* Counselor Connection (Care continuity, never 'escalate' or 'ticket') */}
        <section className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#23303A]">
              Would you like to talk to someone today?
            </span>
            <span className="text-xs text-[#4E5B72]">
              Dr. Ananya Verma
            </span>
          </div>
          <p className="text-xs text-[#4E5B72] leading-relaxed">
            Your assigned counsellor is available for a quiet, supportive phone conversation at any time.
          </p>
          {counselorRequested ? (
            <div className="p-3 bg-[#E6EEE8] text-[#5B7A66] rounded-lg text-xs font-medium animate-soft-settle text-center">
              A counsellor will reach out to you within the hour. You are not alone.
            </div>
          ) : (
            <button
              onClick={() => setCounselorRequested(true)}
              className="w-full py-2.5 bg-[#F6F4EF] hover:bg-[#EAE6DD] text-[#23303A] text-xs font-medium rounded-lg border border-[#D9D4C8] transition"
            >
              Request a counsellor phone call
            </button>
          )}
        </section>

        {/* Pacing & Grounding (Breathing) */}
        <section className="space-y-3">
          <div className="text-center">
            <span className="text-xs font-medium text-[#23303A]">
              Moment of Rest
            </span>
            <p className="text-[11px] text-[#4E5B72]">
              Follow the breathing rhythm to steady your heart
            </p>
          </div>
          <BreathingWidget />
        </section>
      </main>

      {/* Persistent Bottom Nav */}
      <nav className="bg-white border-t border-[#D9D4C8] px-4 py-3 sticky bottom-0 z-20">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2 text-center text-xs">
          <Link href="/v/dashboard" className="text-[#6E8E7A] font-medium py-1">
            Home
          </Link>
          <Link href="/v/check-in" className="text-[#4E5B72] hover:text-[#23303A] py-1">
            Check-in
          </Link>
          <Link href="/v/case-status" className="text-[#4E5B72] hover:text-[#23303A] py-1">
            Case & Relief
          </Link>
          <Link href="/v/profile" className="text-[#4E5B72] hover:text-[#23303A] py-1">
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
