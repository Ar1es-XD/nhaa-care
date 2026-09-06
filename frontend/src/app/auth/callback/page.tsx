'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/citizen');
      } else {
        router.replace('/');
      }
    });
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="w-12 h-12 border-4 border-[#52796f] border-t-transparent rounded-full animate-spin mx-auto" />
      <h2 className="text-lg font-bold text-[#2d3748]">Verifying Secure Sanctuary Credentials...</h2>
      <p className="text-xs text-[#52796f]">Connecting with Supabase Auth & MeriPehchan SSO</p>
    </div>
  );
}
