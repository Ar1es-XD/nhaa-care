'use client';

import React from 'react';
import Link from 'next/link';
import { QuickExit } from '@/components/common/QuickExit';

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-md mx-auto w-full flex items-center justify-between pb-6 border-b border-[#D9D4C8]">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold text-lg text-[#23303A] tracking-tight">Sahay</span>
          <span className="text-xs text-[#6E8E7A] font-devanagari">सहाय</span>
        </Link>
        <QuickExit />
      </div>

      <main className="max-w-md mx-auto w-full my-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#F7ECE9] border border-[#E5CDC6] text-[#8C4A3A] flex items-center justify-center mx-auto text-xl font-serif">
            !
          </div>
          <h1 className="font-serif text-2xl font-medium text-[#23303A]">
            Immediate Assistance & Helplines
          </h1>
          <p className="text-xs text-[#4E5B72]">
            If you are in immediate physical danger, or someone has threatened your family, connect with support right away.
          </p>
        </div>

        <div className="space-y-3">
          {/* Primary Atrocity Helpline */}
          <a
            href="tel:14566"
            className="block p-4 rounded-xl bg-[#8C4A3A] hover:bg-[#783e30] text-white transition shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#F7ECE9] font-medium block">
                  National Helpline Against Atrocities (24x7)
                </span>
                <span className="text-xl font-bold tracking-tight">
                  Call 14566
                </span>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
                Toll Free
              </span>
            </div>
            <p className="text-xs text-[#F7ECE9] mt-2 leading-relaxed">
              Immediate police coordination, witness safety escalations, and FIR assistance.
            </p>
          </a>

          {/* Tele-MANAS Psychological Support */}
          <a
            href="tel:14416"
            className="block p-4 rounded-xl bg-white border border-[#D9D4C8] hover:border-[#6E8E7A] transition shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#4E5B72] font-medium block">
                  Tele-MANAS Mental Health Support
                </span>
                <span className="text-lg font-bold text-[#23303A]">
                  Call 14416
                </span>
              </div>
              <span className="text-xs text-[#6E8E7A] bg-[#E6EEE8] px-2.5 py-0.5 rounded-full font-medium">
                Counselling
              </span>
            </div>
            <p className="text-xs text-[#4E5B72] mt-1.5 leading-relaxed">
              Confidential, licensed psychological support across all 22 official Indian languages.
            </p>
          </a>

          {/* Police Emergency 112 */}
          <a
            href="tel:112"
            className="block p-4 rounded-xl bg-white border border-[#D9D4C8] hover:border-[#8C4A3A] transition shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#4E5B72] font-medium block">
                  National Emergency Services
                </span>
                <span className="text-lg font-bold text-[#23303A]">
                  Dial 112
                </span>
              </div>
              <span className="text-xs text-[#8C4A3A] bg-[#F7ECE9] px-2.5 py-0.5 rounded-full font-medium">
                Immediate Police
              </span>
            </div>
          </a>
        </div>

        {/* Discreet Exit Reassurance */}
        <div className="p-4 bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl text-center space-y-2">
          <p className="text-xs text-[#23303A]">
            Need to leave this screen quickly without leaving history?
          </p>
          <QuickExit />
        </div>
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-[#4E5B72]">
        <Link href="/" className="hover:underline">Return to home</Link>
      </footer>
    </div>
  );
}
