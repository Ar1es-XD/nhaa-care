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
        {/* Calming Hero Banner with Serene Morning Foliage Light */}
        <section className="relative rounded-2xl overflow-hidden border border-[#D9D4C8] shadow-sm">
          <div className="h-44 w-full relative">
            <img
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80"
              alt="Soft morning sunlight through eucalyptus leaves"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#23303A]/90 via-[#23303A]/40 to-transparent" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium inline-block">
                🌿 Safe Sanctuary • सहारा
              </span>
              <h1 className="font-serif text-xl md:text-2xl font-medium tracking-tight text-[#F6F4EF]">
                Good morning, {user?.name ? user.name.split(' ')[0] : 'friend'}
              </h1>
              <p className="text-xs text-[#D9D4C8]">
                Someone is watching out for you today.
              </p>
            </div>

            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              alt={user?.name || "Citizen"}
              className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm flex-shrink-0"
            />
          </div>
        </section>

        {/* Reassurance Copy (Center-Aligned) */}
        <section className="text-center space-y-2">
          <p className="text-xs md:text-sm text-[#4E5B72] leading-relaxed max-w-md mx-auto measure-readable">
            Your case is actively monitored by your district nodal unit. Your police protection escort is confirmed for the upcoming court date.
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

        {/* Counselor Connection with Verified Portrait */}
        <section className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#23303A]">
              Would you like to talk to someone today?
            </span>
            <span className="text-xs text-[#4E5B72]">
              Licensed Care
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#F6F4EF] rounded-xl border border-[#D9D4C8]">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80"
              alt="Dr. Ananya Verma"
              className="w-11 h-11 rounded-full object-cover border border-[#D9D4C8]"
            />
            <div>
              <span className="text-xs font-semibold text-[#23303A] block">
                Dr. Ananya Verma
              </span>
              <span className="text-[11px] text-[#4E5B72]">
                Certified Trauma Counselor • Council Reg #MH-7482
              </span>
            </div>
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

        {/* Grounding Moment with Tea & Breathing */}
        <section className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-[#D9D4C8]">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
                alt="Calm hands holding warm cup"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#23303A] block">
                Moment of Rest
              </span>
              <p className="text-[11px] text-[#4E5B72]">
                Follow the gentle rhythm to settle your heartbeat
              </p>
            </div>
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
