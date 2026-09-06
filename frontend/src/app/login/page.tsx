'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import { QuickExit } from '@/components/common/QuickExit';

export default function LoginPage() {
  const router = useRouter();
  const { user, signInAsRole, signInWithGoogle, signInWithMeriPehchan, hasCompletedBaseline } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('victim');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Persist intent and route to OTP verification
    localStorage.setItem('sahay_pending_identifier', identifier || '9876543210');
    localStorage.setItem('sahay_pending_role', selectedRole);
    setTimeout(() => {
      router.push(`/verify-otp?role=${selectedRole}`);
    }, 400);
  };

  const handleQuickEnter = (role: UserRole) => {
    signInAsRole(role);
    if (role === 'victim') {
      if (!hasCompletedBaseline) {
        router.push('/onboarding/baseline');
      } else {
        router.push('/v/dashboard');
      }
    } else if (role === 'counselor') {
      router.push('/c/queue');
    } else {
      router.push('/admin/alerts');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pb-6 border-b border-[#D9D4C8]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg text-[#23303A] tracking-tight">Sahay</span>
          <span className="text-xs text-[#6E8E7A] font-devanagari">सहाय</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/emergency"
            className="text-xs text-[#8C4A3A] bg-[#F7ECE9] px-2.5 py-1 rounded border border-[#E5CDC6] font-medium"
          >
            Emergency 14566
          </Link>
          <QuickExit />
        </div>
      </div>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-medium text-[#23303A]">
            Sign in to your care space
          </h1>
          <p className="text-xs text-[#4E5B72]">
            Enter your registered phone number or NHAA Case Number. Your session is protected by Zero-Knowledge encryption.
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSendOtp} className="bg-white border border-[#D9D4C8] rounded-xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#23303A] block">
              Phone Number or Case Reference
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 98765 43210 or NHAA/2026/UP/00492"
              required
              className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-lg px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A] transition"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-[#23303A] block">
              Access Role
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('victim')}
                className={`py-2 px-3 rounded-lg border text-center transition ${
                  selectedRole === 'victim'
                    ? 'bg-[#6E8E7A] text-white border-[#6E8E7A] font-medium'
                    : 'bg-[#F6F4EF] text-[#23303A] border-[#D9D4C8]'
                }`}
              >
                Victim / Citizen
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('counselor')}
                className={`py-2 px-3 rounded-lg border text-center transition ${
                  selectedRole === 'counselor'
                    ? 'bg-[#1F4A48] text-white border-[#1F4A48] font-medium'
                    : 'bg-[#F6F4EF] text-[#23303A] border-[#D9D4C8]'
                }`}
              >
                Counsellor
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-3 rounded-lg border text-center transition ${
                  selectedRole === 'admin'
                    ? 'bg-[#1F4A48] text-white border-[#1F4A48] font-medium'
                    : 'bg-[#F6F4EF] text-[#23303A] border-[#D9D4C8]'
                }`}
              >
                DM / SP
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-lg transition shadow-sm"
          >
            {isLoading ? 'Sending One-Time Passcode...' : 'Send One-Time Passcode'}
          </button>
        </form>

        {/* National SSO & Instant Demonstration Personas */}
        <div className="bg-white border border-[#D9D4C8] rounded-xl p-5 space-y-3">
          <p className="text-[11px] font-medium text-[#4E5B72] text-center">
            Or continue with National Single Sign-On:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="py-2 px-3 border border-[#D9D4C8] rounded-lg text-xs text-[#23303A] hover:bg-[#F6F4EF] transition text-center font-medium"
            >
              Google Account
            </button>
            <button
              type="button"
              onClick={signInWithMeriPehchan}
              className="py-2 px-3 bg-[#1F4A48] text-white rounded-lg text-xs hover:bg-[#153331] transition text-center font-medium"
            >
              MeriPehchan SSO
            </button>
          </div>

          <div className="pt-2 border-t border-[#D9D4C8]">
            <p className="text-[10px] text-[#4E5B72] text-center mb-2">
              Instant Demonstration Entry:
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickEnter('victim')}
                className="p-1.5 bg-[#E6EEE8] text-[#5B7A66] rounded border border-[#6E8E7A]/30 text-center hover:bg-[#d8e4db]"
              >
                Priya Devi (Victim)
              </button>
              <button
                type="button"
                onClick={() => handleQuickEnter('counselor')}
                className="p-1.5 bg-[#E8F0EF] text-[#1F4A48] rounded border border-[#1F4A48]/30 text-center hover:bg-[#d6e3e1]"
              >
                Dr. Verma (Counsellor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickEnter('admin')}
                className="p-1.5 bg-[#F8F3E8] text-[#B98A2B] rounded border border-[#B98A2B]/30 text-center hover:bg-[#eee6d5]"
              >
                DM Varanasi (Official)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-[#4E5B72] pt-4">
        Governed by DPDP Act 2023 & SC/ST (Prevention of Atrocities) Act.
      </footer>
    </div>
  );
}
