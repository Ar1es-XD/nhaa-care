'use client';

import React from 'react';
import Link from 'next/link';
import { SahayQuietHeader } from '@/components/common/SahayQuietHeader';

export default function VictimCaseStatusPage() {
  const steps = [
    {
      title: 'Registration & Initial Safety Assessment',
      hindiTitle: 'प्राथमिकी पंजीकरण एवं सुरक्षा समीक्षा',
      status: 'COMPLETED',
      date: 'Aug 12, 2026',
      description: 'Complaint registered under SC/ST (PoA) Act Sections 3(1)(r), 3(1)(s). Designated police officer assigned.',
    },
    {
      title: 'Rule 12 Relief Disbursement (Stage 1 - 25%)',
      hindiTitle: 'नियम 12 प्राथमिक आर्थिक राहत (25%)',
      status: 'COMPLETED',
      date: 'Aug 24, 2026',
      description: '₹1,25,000 deposited directly into your verified bank account via DBT transaction ref #DBT-UP-94821.',
    },
    {
      title: 'Witness Protection & Deposition Escort',
      hindiTitle: 'गवाह सुरक्षा एवं न्यायालय आवागमन व्यवस्था',
      status: 'UPCOMING',
      date: 'Sept 15, 2026',
      description: 'Designated sub-inspector assigned to escort you safely from home to Special Court, Varanasi.',
    },
    {
      title: 'Chargesheet & Stage 2 Relief (50%)',
      hindiTitle: 'आरोप पत्र दाखिल एवं द्वितीय चरण राहत (50%)',
      status: 'SCHEDULED',
      date: 'Late September',
      description: '₹2,50,000 scheduled upon filing of chargesheet before the Special Court Magistrate.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between">
      <SahayQuietHeader />

      <main className="max-w-xl mx-auto w-full px-4 py-8 md:py-12 space-y-8">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-medium text-[#23303A]">
            Your Legal & Relief Roadmap
          </h1>
          <p className="text-xs text-[#4E5B72]">
            Clear updates on your police protection, trial dates, and financial compensation under the law.
          </p>
        </div>

        {/* Protection Summary Card */}
        <div className="p-4 bg-white border border-[#D9D4C8] rounded-xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#23303A]">
              Active Protection Status
            </span>
            <span className="text-[11px] bg-[#E6EEE8] text-[#5B7A66] px-2.5 py-0.5 rounded-full font-medium">
              Active Protection
            </span>
          </div>
          <p className="text-xs text-[#4E5B72] leading-relaxed">
            Local police patrol visits your lane twice daily. If anyone approaches or threatens you, call your dedicated officer at <strong>0542-250123</strong> or helpline <strong>14566</strong>.
          </p>
        </div>

        {/* Steps Roadmap */}
        <div className="space-y-4">
          <span className="text-xs font-medium text-[#23303A] block">
            Milestone Timeline
          </span>

          <div className="space-y-3">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition ${
                  s.status === 'COMPLETED'
                    ? 'bg-white border-[#D9D4C8]'
                    : s.status === 'UPCOMING'
                    ? 'bg-[#E6EEE8]/50 border-[#6E8E7A]'
                    : 'bg-white/60 border-[#D9D4C8]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-semibold text-[#23303A]">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-[#6E8E7A] font-devanagari">
                      {s.hindiTitle}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#4E5B72] bg-[#F6F4EF] px-2 py-0.5 rounded border border-[#D9D4C8]">
                    {s.date}
                  </span>
                </div>
                <p className="text-xs text-[#4E5B72] mt-2 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Free Legal Aid DLSA Contact */}
        <div className="p-4 bg-white border border-[#D9D4C8] rounded-xl flex items-center justify-between gap-3 shadow-sm">
          <div>
            <span className="text-xs font-medium text-[#23303A] block">
              Free Legal Aid Advocate
            </span>
            <span className="text-xs text-[#4E5B72]">
              Adv. R. C. Prasad (DLSA Varanasi)
            </span>
          </div>
          <a
            href="tel:15100"
            className="px-3.5 py-2 bg-[#F6F4EF] hover:bg-[#EAE6DD] text-[#23303A] text-xs font-medium rounded-lg border border-[#D9D4C8] transition"
          >
            Contact Counsel
          </a>
        </div>
      </main>

      <nav className="bg-white border-t border-[#D9D4C8] px-4 py-3 sticky bottom-0 z-20">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2 text-center text-xs">
          <Link href="/v/dashboard" className="text-[#4E5B72] hover:text-[#23303A] py-1">
            Home
          </Link>
          <Link href="/v/check-in" className="text-[#4E5B72] hover:text-[#23303A] py-1">
            Check-in
          </Link>
          <Link href="/v/case-status" className="text-[#6E8E7A] font-medium py-1">
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
