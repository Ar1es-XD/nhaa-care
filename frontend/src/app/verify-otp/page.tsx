'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import { QuickExit } from '@/components/common/QuickExit';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithPhoneOtp, hasCompletedBaseline } = useAuth();
  const [otp, setOtp] = useState('123456');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('victim');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const pRole = (searchParams.get('role') as UserRole) || 
      (localStorage.getItem('sahay_pending_role') as UserRole) || 'victim';
    const pPhone = localStorage.getItem('sahay_pending_identifier') || '9876543210';
    setRole(pRole);
    setPhone(pPhone);
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg('');

    const success = await signInWithPhoneOtp(phone, otp, role);
    if (success) {
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
    } else {
      setErrorMsg('Invalid passcode. Please enter 123456 for testing.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-md mx-auto w-full flex items-center justify-between pb-6 border-b border-[#D9D4C8]">
        <Link href="/login" className="flex items-center gap-2">
          <span className="font-semibold text-lg text-[#23303A] tracking-tight">Sahay</span>
          <span className="text-xs text-[#6E8E7A] font-devanagari">सहाय</span>
        </Link>
        <QuickExit />
      </div>

      <main className="max-w-md mx-auto w-full my-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-medium text-[#23303A]">
            Enter your verification passcode
          </h1>
          <p className="text-xs text-[#4E5B72]">
            We sent a 6-digit code to <strong>{phone || 'your number'}</strong>.
          </p>
        </div>

        <form onSubmit={handleVerify} className="bg-white border border-[#D9D4C8] rounded-xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#23303A] block text-center">
              6-Digit One-Time Passcode
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              required
              className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-lg px-3.5 py-3 text-center text-lg font-semibold tracking-widest text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
            />
            <p className="text-[11px] text-[#4E5B72] text-center">
              Default test code: <strong>123456</strong>
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#8C4A3A] bg-[#F7ECE9] p-2.5 rounded border border-[#E5CDC6] text-center">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-lg transition"
          >
            {isVerifying ? 'Verifying...' : 'Verify and Enter'}
          </button>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-xs text-[#4E5B72] hover:text-[#23303A] underline underline-offset-4">
            Back to phone entry
          </Link>
        </div>
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-[#4E5B72] pt-4">
        Protected under DPDP Act 2023. Zero-Knowledge session token.
      </footer>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F4EF]" />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
