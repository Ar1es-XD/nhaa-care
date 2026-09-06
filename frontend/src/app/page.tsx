'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function GatekeeperContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, hasCompletedBaseline, signInAsRole } = useAuth();

  useEffect(() => {
    if (loading) return;

    // 0. Handle Deep Links
    const source = searchParams.get('source');
    const deepCase = searchParams.get('case');
    const target = searchParams.get('target');

    if (source === 'sms') {
      router.replace('/v/check-in?source=sms');
      return;
    }
    if (deepCase) {
      router.replace(`/c/case/${deepCase}`);
      return;
    }
    if (target === 'court') {
      router.replace('/v/case-status');
      return;
    }

    // 1. Check Authentication State
    if (!user) {
      router.replace('/login');
      return;
    }

    // 2. Check User Role & Dispatch
    if (user.role === 'victim') {
      if (!hasCompletedBaseline) {
        router.replace('/onboarding/baseline');
      } else {
        router.replace('/v/dashboard');
      }
    } else if (user.role === 'counselor') {
      router.replace('/c/queue');
    } else if (user.role === 'admin' || user.role === 'nodal_officer') {
      router.replace('/admin/alerts');
    }
  }, [user, loading, hasCompletedBaseline, router, searchParams]);

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between p-6">
      <main className="max-w-md mx-auto w-full my-auto py-12 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#E6EEE8] text-[#5B7A66] flex items-center justify-center mx-auto text-xl animate-fade-pulse">
          🌿
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-medium text-[#23303A]">
            Sahay Care Gateway
          </h1>
          <p className="text-xs text-[#4E5B72]">
            Verifying secure session credentials and dispatching to your authorized care space...
          </p>
        </div>

        <div className="p-4 bg-white border border-[#D9D4C8] rounded-xl text-xs space-y-3 shadow-sm text-left">
          <span className="font-semibold text-[#23303A] block">
            Select Workspace Directly:
          </span>
          <div className="space-y-2">
            <button
              onClick={() => {
                signInAsRole('victim');
                router.push('/v/dashboard');
              }}
              className="w-full text-left p-2.5 rounded-lg bg-[#F6F4EF] hover:bg-[#E6EEE8] border border-[#D9D4C8] text-[#23303A] transition"
            >
              🌸 <strong>Sahay Sanctuary</strong> (Victim / Complainant)
            </button>
            <button
              onClick={() => {
                signInAsRole('counselor');
                router.push('/c/queue');
              }}
              className="w-full text-left p-2.5 rounded-lg bg-[#F6F4EF] hover:bg-[#E8F0EF] border border-[#D9D4C8] text-[#1F4A48] transition"
            >
              🩺 <strong>Command View</strong> (Counselor Triage Queue)
            </button>
            <button
              onClick={() => {
                signInAsRole('admin');
                router.push('/admin/alerts');
              }}
              className="w-full text-left p-2.5 rounded-lg bg-[#F6F4EF] hover:bg-[#F8F3E8] border border-[#D9D4C8] text-[#B98A2B] transition"
            >
              🛡️ <strong>Command View</strong> (District Magistrate / SP Dispatch)
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72]">
        National Helpline Against Atrocities (14566) • DPDP Act 2023 Compliant
      </footer>
    </div>
  );
}

export default function RootGatekeeperPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center text-xs text-[#4E5B72]">
        Loading Sahay Gateway...
      </div>
    }>
      <GatekeeperContent />
    </Suspense>
  );
}
