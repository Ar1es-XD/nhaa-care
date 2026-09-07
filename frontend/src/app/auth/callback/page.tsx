'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/context/AuthContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Verifying secure sanctuary session...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 1. Check if there is an auth code to exchange
        const code = searchParams.get('code');
        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(code);
          } catch (codeErr) {
            console.warn('OAuth code exchange notice (session may already exist):', codeErr);
          }
        }

        // 2. Retrieve session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.user) {
          setStatus('Session verification failed. Returning to sign-in...');
          setTimeout(() => router.replace('/login'), 1200);
          return;
        }

        // 3. Extract role metadata from OAuth flow or stored state
        const urlRole = searchParams.get('target_role') as UserRole;
        const storedRole = (typeof window !== 'undefined' ? localStorage.getItem('sahay_pending_oauth_role') : null) as UserRole;
        const role = urlRole || storedRole || (session.user.user_metadata?.role as UserRole) || 'victim';
        const hasBaseline = localStorage.getItem('sahay_baseline_completed') === 'true';

        // Update Supabase user profile metadata with resolved role
        try {
          await supabase.auth.updateUser({ data: { role } });
        } catch (e) {
          // Non-blocking
        }

        // Cache authenticated user with resolved role
        const authUser = {
          id: session.user.id,
          email: session.user.email || 'user@sahay.gov.in',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || (role === 'counselor' ? 'Dr. Ananya Verma' : 'Priya Devi'),
          role,
          district: session.user.user_metadata?.district || 'Varanasi',
          provider: 'supabase_google',
        };
        localStorage.setItem('sahay_auth_user', JSON.stringify(authUser));
        localStorage.removeItem('sahay_pending_oauth_role');

        setStatus(`Authenticated as ${role === 'counselor' ? 'Certified Counselor' : 'Citizen'}. Redirecting to your workspace...`);

        setTimeout(() => {
          if (role === 'counselor') {
            router.replace('/c/queue');
          } else if (role === 'admin' || role === 'nodal_officer') {
            router.replace('/admin/alerts');
          } else {
            if (!hasBaseline) {
              router.replace('/onboarding/baseline');
            } else {
              router.replace('/v/dashboard');
            }
          }
        }, 600);
      } catch (err) {
        console.error('Callback error:', err);
        router.replace('/login');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-[#D9D4C8] rounded-2xl p-8 space-y-5 shadow-sm">
        <div className="w-12 h-12 border-3 border-[#6E8E7A] border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-1">
          <h2 className="font-serif text-lg font-medium text-[#23303A]">
            Securing Your Identity
          </h2>
          <p className="text-xs text-[#4E5B72] leading-relaxed">
            {status}
          </p>
        </div>
        <p className="text-[10px] text-[#4E5B72] border-t border-[#D9D4C8] pt-3">
          Sovereign Identity Vault • DPDP Act 2023 Compliant
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F4EF]" />}>
      <CallbackContent />
    </Suspense>
  );
}
