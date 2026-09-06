'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SahayQuietHeader } from '@/components/common/SahayQuietHeader';

export default function VictimProfilePage() {
  const { user, signOut } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSavePreferences = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between">
      <SahayQuietHeader />

      <main className="max-w-xl mx-auto w-full px-4 py-8 md:py-12 space-y-6">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-medium text-[#23303A]">
            Your Care Preferences & Privacy
          </h1>
          <p className="text-xs text-[#4E5B72]">
            Manage how Sahay communicates with you and verify your zero-knowledge data protection.
          </p>
        </div>

        {/* Profile Details */}
        <div className="p-5 bg-white border border-[#D9D4C8] rounded-xl space-y-4 shadow-sm">
          <span className="text-xs font-semibold text-[#23303A] block">
            Registered Care Identity
          </span>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-[#4E5B72] block">Name</span>
              <span className="font-medium text-[#23303A]">{user?.name || 'Priya Devi'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#4E5B72] block">Case Number</span>
              <span className="font-medium text-[#23303A]">{user?.caseNumber || 'NHAA/2026/UP/00492'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#4E5B72] block">Assigned District</span>
              <span className="font-medium text-[#23303A]">{user?.district || 'Varanasi'} District</span>
            </div>
            <div>
              <span className="text-[11px] text-[#4E5B72] block">Primary Counselor</span>
              <span className="font-medium text-[#23303A]">Dr. Ananya Verma</span>
            </div>
          </div>
        </div>

        {/* Multilingual Preference (Plex Sans + Plex Devanagari parity) */}
        <div className="p-5 bg-white border border-[#D9D4C8] rounded-xl space-y-3 shadow-sm">
          <span className="text-xs font-semibold text-[#23303A] block">
            Preferred Language for Check-ins & IVRS Calls
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { code: 'hi', label: 'Hindi', script: 'हिन्दी' },
              { code: 'en', label: 'English', script: 'English' },
              { code: 'bho', label: 'Bhojpuri', script: 'भोजपुरी' },
              { code: 'aw', label: 'Awadhi', script: 'अवधी' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-3 rounded-lg border text-left transition ${
                  selectedLanguage === lang.code
                    ? 'bg-[#E6EEE8] border-[#6E8E7A] text-[#23303A]'
                    : 'bg-[#F6F4EF] border-[#D9D4C8] text-[#23303A] hover:border-[#6E8E7A]'
                }`}
              >
                <span className="font-medium block">{lang.label}</span>
                <span className="text-[11px] text-[#4E5B72] font-devanagari block">{lang.script}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full py-2.5 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-lg transition mt-2"
          >
            {savedAlert ? 'Preferences Saved' : 'Save Language Choice'}
          </button>
        </div>

        {/* Privacy & Legal Protection Summary */}
        <div className="p-5 bg-white border border-[#D9D4C8] rounded-xl space-y-3 shadow-sm">
          <span className="text-xs font-semibold text-[#23303A] block">
            Data Sovereignty & Encryption
          </span>
          <p className="text-xs text-[#4E5B72] leading-relaxed">
            Your name, phone number, and caste identity are stored inside an isolated vault with envelope encryption under Section 5.3 of the DPDP Act 2023.
          </p>
          <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#D9D4C8] text-[11px] text-[#4E5B72]">
            Vault Token: <code className="text-[#23303A]">vault_aes256_vns_00492_enc</code>
          </div>
        </div>

        {/* Exit Actions */}
        <div className="pt-2">
          <button
            onClick={signOut}
            className="w-full py-2.5 bg-[#F7ECE9] hover:bg-[#ebd5cf] text-[#8C4A3A] border border-[#E5CDC6] text-xs font-medium rounded-lg transition"
          >
            Sign Out of Current Session
          </button>
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
          <Link href="/v/case-status" className="text-[#4E5B72] hover:text-[#23303A] py-1">
            Case & Relief
          </Link>
          <Link href="/v/profile" className="text-[#6E8E7A] font-medium py-1">
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
