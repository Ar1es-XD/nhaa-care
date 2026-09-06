'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, UserRole } from '@/context/AuthContext';
import { QuickExit } from '@/components/common/QuickExit';

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, signInWithMeriPehchan, hasCompletedBaseline } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Varanasi');
  const [selectedRole, setSelectedRole] = useState<UserRole>('victim');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const routeUserByRole = (role: UserRole) => {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const result = await signUpWithEmail(email, password, fullName, selectedRole, district);
    setIsLoading(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        routeUserByRole(selectedRole);
      }, 800);
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="border-b border-[#D9D4C8] px-4 sm:px-8 py-3 bg-[#F6F4EF] z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-semibold text-lg text-[#23303A] tracking-tight">Sahay</span>
            <span className="text-xs text-[#6E8E7A] font-devanagari font-medium">सहाय</span>
            <span className="text-xs text-[#4E5B72] border-l border-[#D9D4C8] pl-3 hidden sm:inline">
              Citizen Registration
            </span>
          </Link>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12 my-auto">
        <div className="bg-white border border-[#D9D4C8] rounded-2xl p-6 sm:p-10 shadow-sm max-w-xl mx-auto space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#23303A]">
              Create Your Confidential Account
            </h1>
            <p className="text-xs text-[#4E5B72]">
              Protected under the Digital Personal Data Protection (DPDP) Act 2023.
            </p>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed animate-soft-settle ${
                statusMessage.type === 'success'
                  ? 'bg-[#E6EEE8] border-[#B7D0BF] text-[#2F5E3D]'
                  : 'bg-[#F7ECE9] border-[#E5CDC6] text-[#8C4A3A]'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#23303A] block">
                Full Name or Preferred Pseudonym
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Devi"
                required
                className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#23303A] block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. priya.devi@example.com"
                required
                className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#23303A] block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#23303A] block">
                  Select Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3 py-2 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
                >
                  <option value="victim">Citizen / Complainant</option>
                  <option value="counselor">Certified Counselor</option>
                  <option value="admin">District Magistrate / SP</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#23303A] block">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3 py-2 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
                >
                  <option value="Varanasi">Varanasi (UP)</option>
                  <option value="Lucknow">Lucknow (UP)</option>
                  <option value="Prayagraj">Prayagraj (UP)</option>
                  <option value="Gorakhpur">Gorakhpur (UP)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-xl transition shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Creating Account in Supabase...' : 'Complete Registration'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#D9D4C8]">
            <p className="text-xs text-[#4E5B72]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#6E8E7A] font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#D9D4C8] px-4 py-3 bg-[#F6F4EF] text-center text-[11px] text-[#4E5B72]">
        Sahaara (सहारा) • National Helpline 14566
      </footer>
    </div>
  );
}
