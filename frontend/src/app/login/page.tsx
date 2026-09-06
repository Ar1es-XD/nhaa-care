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
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-[#D9D4C8] px-4 sm:px-8 py-3 bg-[#F6F4EF] z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-[#23303A] tracking-tight">Sahay</span>
            <span className="text-xs text-[#6E8E7A] font-devanagari">सहाय</span>
            <span className="text-xs text-[#4E5B72] border-l border-[#D9D4C8] pl-3 hidden sm:inline">
              Safe Space for Healing, Support & Justice
            </span>
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
      </header>

      {/* Main Split Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 md:py-12 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (6 cols): Clean Login Card */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full space-y-6">
            <div className="space-y-1">
              <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#23303A]">
                Sign in to your care space
              </h1>
              <p className="text-xs text-[#4E5B72]">
                Enter your registered phone number or NHAA Case Number. Zero-Knowledge encrypted.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="bg-white border border-[#D9D4C8] rounded-2xl p-6 space-y-4 shadow-sm">
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
                  className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-[#23303A] block">
                  Select Role
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('victim')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      selectedRole === 'victim'
                        ? 'bg-[#6E8E7A] text-white border-[#6E8E7A] font-medium'
                        : 'bg-[#F6F4EF] text-[#23303A] border-[#D9D4C8]'
                    }`}
                  >
                    🌸 Victim
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('counselor')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      selectedRole === 'counselor'
                        ? 'bg-[#1F4A48] text-white border-[#1F4A48] font-medium'
                        : 'bg-[#F6F4EF] text-[#23303A] border-[#D9D4C8]'
                    }`}
                  >
                    🩺 Counsellor
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      selectedRole === 'admin'
                        ? 'bg-[#1F4A48] text-white border-[#1F4A48] font-medium'
                        : 'bg-[#F6F4EF] text-[#23303A] border-[#D9D4C8]'
                    }`}
                  >
                    🛡️ DM / SP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-xl transition shadow-sm"
              >
                {isLoading ? 'Sending One-Time Passcode...' : 'Send One-Time Passcode'}
              </button>
            </form>

            <div className="bg-white border border-[#D9D4C8] rounded-2xl p-5 space-y-3 shadow-sm">
              <p className="text-[11px] font-medium text-[#4E5B72] text-center">
                Or authenticate with National SSO:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="py-2.5 px-3 border border-[#D9D4C8] rounded-xl text-xs text-[#23303A] hover:bg-[#F6F4EF] transition text-center font-medium"
                >
                  Google Account
                </button>
                <button
                  type="button"
                  onClick={signInWithMeriPehchan}
                  className="py-2.5 px-3 bg-[#1F4A48] text-white rounded-xl text-xs hover:bg-[#153331] transition text-center font-medium"
                >
                  MeriPehchan SSO
                </button>
              </div>

              <div className="pt-2 border-t border-[#D9D4C8]">
                <p className="text-[10px] text-[#4E5B72] text-center mb-2">
                  Instant One-Click Demonstration:
                </p>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickEnter('victim')}
                    className="p-2 bg-[#E6EEE8] text-[#5B7A66] rounded-lg border border-[#6E8E7A]/30 text-center hover:bg-[#d8e4db] font-medium"
                  >
                    Priya Devi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickEnter('counselor')}
                    className="p-2 bg-[#E8F0EF] text-[#1F4A48] rounded-lg border border-[#1F4A48]/30 text-center hover:bg-[#d6e3e1] font-medium"
                  >
                    Dr. Verma
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickEnter('admin')}
                    className="p-2 bg-[#F8F3E8] text-[#B98A2B] rounded-lg border border-[#B98A2B]/30 text-center hover:bg-[#eee6d5] font-medium"
                  >
                    DM Varanasi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Evocative, Calming Visual on Desktop */}
          <div className="hidden lg:block lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#D9D4C8] h-[580px]">
              <img
                src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
                alt="Tranquil morning mist over Varanasi ghats"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#23303A]/90 via-[#23303A]/30 to-transparent flex flex-col justify-end p-8 text-white space-y-3">
                <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-medium inline-block w-max">
                  Varanasi Pilot Jurisdiction • 2026
                </span>
                <blockquote className="font-serif text-xl leading-relaxed text-[#F6F4EF]">
                  "In the quiet of dawn, every citizen deserves to be heard with unconditional dignity and protected with steady strength."
                </blockquote>
                <p className="text-xs text-[#D9D4C8]">
                  Integrated with National Helpline Against Atrocities (14566) & Tele-MANAS (14416)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#D9D4C8] py-4 text-center text-[11px] text-[#4E5B72]">
        Governed by DPDP Act 2023 & SC/ST (Prevention of Atrocities) Act. Confidential & Sovereign.
      </footer>
    </div>
  );
}
