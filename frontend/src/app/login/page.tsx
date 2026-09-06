'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, UserRole } from '@/context/AuthContext';
import { QuickExit } from '@/components/common/QuickExit';

export default function LoginPage() {
  const router = useRouter();
  const {
    signInAsRole,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithMeriPehchan,
    hasCompletedBaseline
  } = useAuth();

  // Mode: 'signin' | 'signup' | 'otp'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'otp'>('signin');

  // Sign in / Sign up form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('Varanasi');
  const [selectedRole, setSelectedRole] = useState<UserRole>('victim');
  
  // OTP form fields
  const [identifier, setIdentifier] = useState('');

  // Status & Feedback
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

  // 1. Handle Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const result = await signInWithEmail(email, password);
    setIsLoading(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        routeUserByRole(selectedRole);
      }, 500);
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  // 2. Handle New User Registration / Signup
  const handleEmailSignUp = async (e: React.FormEvent) => {
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

  // 3. Handle Phone OTP Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    localStorage.setItem('sahay_pending_identifier', identifier || '9876543210');
    localStorage.setItem('sahay_pending_role', selectedRole);
    setTimeout(() => {
      router.push(`/verify-otp?role=${selectedRole}`);
    }, 400);
  };

  // 4. Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    const result = await signInWithGoogle();
    if (!result.success && result.message) {
      setIsLoading(false);
      setStatusMessage({
        type: 'info',
        text: `${result.message} (You can also sign in with Email or use Demo Access below.)`
      });
    }
  };

  // 5. Fast Demonstration Shortcut
  const handleQuickEnter = (role: UserRole) => {
    signInAsRole(role);
    routeUserByRole(role);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="border-b border-[#D9D4C8] px-4 sm:px-8 py-3 bg-[#F6F4EF] z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-[#23303A] tracking-tight">Sahay</span>
            <span className="text-xs text-[#6E8E7A] font-devanagari font-medium">सहाय</span>
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
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 md:py-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Auth Container */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full space-y-5">
            
            {/* Header copy */}
            <div className="space-y-1">
              <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#23303A]">
                {authMode === 'signup' ? 'Create your safe account' : 'Welcome to your care space'}
              </h1>
              <p className="text-xs text-[#4E5B72]">
                {authMode === 'signup'
                  ? 'Zero-Knowledge encrypted under DPDP Act 2023. Real identities are sealed.'
                  : 'Sign in with your email, password, or case reference.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-[#EBE7DF] rounded-xl border border-[#D9D4C8] text-xs font-medium">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setStatusMessage(null); }}
                className={`flex-1 py-2 rounded-lg transition text-center ${
                  authMode === 'signin'
                    ? 'bg-white text-[#23303A] shadow-sm font-semibold'
                    : 'text-[#4E5B72] hover:text-[#23303A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setStatusMessage(null); }}
                className={`flex-1 py-2 rounded-lg transition text-center ${
                  authMode === 'signup'
                    ? 'bg-white text-[#23303A] shadow-sm font-semibold'
                    : 'text-[#4E5B72] hover:text-[#23303A]'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('otp'); setStatusMessage(null); }}
                className={`flex-1 py-2 rounded-lg transition text-center ${
                  authMode === 'otp'
                    ? 'bg-white text-[#23303A] shadow-sm font-semibold'
                    : 'text-[#4E5B72] hover:text-[#23303A]'
                }`}
              >
                Phone / OTP
              </button>
            </div>

            {/* Feedback Alert */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed animate-soft-settle ${
                  statusMessage.type === 'success'
                    ? 'bg-[#E6EEE8] border-[#B7D0BF] text-[#2F5E3D]'
                    : statusMessage.type === 'error'
                    ? 'bg-[#F7ECE9] border-[#E5CDC6] text-[#8C4A3A]'
                    : 'bg-[#FAF3E0] border-[#E6D4A8] text-[#8C6B1F]'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            {/* TAB 1: SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleEmailSignIn} className="bg-white border border-[#D9D4C8] rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#23303A] block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya.devi@sahay.gov.in"
                    required
                    className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-[#23303A] block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('otp')}
                      className="text-[11px] text-[#6E8E7A] hover:underline"
                    >
                      Login via OTP instead?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* TAB 2: SIGN UP / REGISTER FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleEmailSignUp} className="bg-white border border-[#D9D4C8] rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#23303A] block">
                    Full Legal Name or Anonymous Pseudonym
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
                    placeholder="e.g. citizen@gmail.com"
                    required
                    className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#23303A] block">
                    Create Secure Password
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
                      Account Type
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3 py-2 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
                    >
                      <option value="victim">Complainant / Citizen</option>
                      <option value="counselor">Certified Counselor</option>
                      <option value="admin">District Magistrate / SP</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#23303A] block">
                      District Jurisdiction
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
                  {isLoading ? 'Registering with Supabase...' : 'Create Account & Enter'}
                </button>
              </form>
            )}

            {/* TAB 3: PHONE / CASE OTP FORM */}
            {authMode === 'otp' && (
              <form onSubmit={handleSendOtp} className="bg-white border border-[#D9D4C8] rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#23303A] block">
                    Phone Number or NHAA Case Number
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 98765 43210 or VNS-2026-9042"
                    required
                    className="w-full bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl px-3.5 py-2.5 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-[#23303A] block">
                    Select Target Surface
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('victim')}
                      className={`py-2 px-2 rounded-xl border text-center transition ${
                        selectedRole === 'victim'
                          ? 'bg-[#6E8E7A] text-white border-[#6E8E7A] font-medium'
                          : 'bg-[#F6F4EF] text-[#23303A] border-[#D9D4C8]'
                      }`}
                    >
                      🌸 Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('counselor')}
                      className={`py-2 px-2 rounded-xl border text-center transition ${
                        selectedRole === 'counselor'
                          ? 'bg-[#1F4A48] text-white border-[#1F4A48] font-medium'
                          : 'bg-[#F6F4EF] text-[#23303A] border-[#D9D4C8]'
                      }`}
                    >
                      🩺 Counselor
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`py-2 px-2 rounded-xl border text-center transition ${
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
                  {isLoading ? 'Dispatching One-Time Passcode...' : 'Send One-Time Passcode'}
                </button>
              </form>
            )}

            {/* National SSO & OAuth Providers */}
            <div className="bg-white border border-[#D9D4C8] rounded-2xl p-5 space-y-3 shadow-sm">
              <p className="text-[11px] font-medium text-[#4E5B72] text-center">
                Or authenticate via National SSO / OAuth:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="py-2.5 px-3 border border-[#D9D4C8] rounded-xl text-xs text-[#23303A] hover:bg-[#F6F4EF] transition text-center font-medium flex items-center justify-center gap-1.5"
                >
                  <span>Google Account</span>
                </button>
                <button
                  type="button"
                  onClick={signInWithMeriPehchan}
                  className="py-2.5 px-3 bg-[#1F4A48] text-white rounded-xl text-xs hover:bg-[#153331] transition text-center font-medium"
                >
                  MeriPehchan SSO
                </button>
              </div>
            </div>

            {/* Instant Persona Evaluation Access */}
            <div className="pt-2 border-t border-[#D9D4C8] space-y-2">
              <p className="text-[10px] text-[#4E5B72] text-center uppercase tracking-wider font-semibold">
                Instant Demonstration Personas:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickEnter('victim')}
                  className="p-2 bg-white hover:bg-[#E6EEE8] border border-[#D9D4C8] rounded-xl text-left transition"
                >
                  <span className="text-[10px] font-bold text-[#5B7A66] block">Priya Devi</span>
                  <span className="text-[9px] text-[#4E5B72]">Complainant</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickEnter('counselor')}
                  className="p-2 bg-white hover:bg-[#E6EEE8] border border-[#D9D4C8] rounded-xl text-left transition"
                >
                  <span className="text-[10px] font-bold text-[#1F4A48] block">Dr. Ananya</span>
                  <span className="text-[9px] text-[#4E5B72]">Counselor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickEnter('admin')}
                  className="p-2 bg-white hover:bg-[#E6EEE8] border border-[#D9D4C8] rounded-xl text-left transition"
                >
                  <span className="text-[10px] font-bold text-[#8C4A3A] block">DM Varanasi</span>
                  <span className="text-[9px] text-[#4E5B72]">Magistrate</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Serene Courtyard & Dawn Aesthetics */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#D9D4C8] shadow-sm aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                alt="Dawn over serene waters"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#23303A]/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-devanagari text-[#D9D4C8] font-medium">
                  "कोई भी अकेला नहीं है"
                </span>
                <p className="font-serif text-lg font-medium">
                  Confidential sanctuary for recovery, mental wellness, and witness protection.
                </p>
              </div>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-4 bg-white border border-[#D9D4C8] rounded-xl text-xs space-y-1.5 shadow-sm">
              <span className="font-semibold text-[#23303A] block">
                Zero-Knowledge Privacy Architecture
              </span>
              <p className="text-[#4E5B72] text-[11px] leading-relaxed">
                All identifying data is cryptographically sealed with AES-256 via the Sovereign Identity Vault. Police, court authorities, and external third parties cannot view complainant names without an explicit, time-bounded 4-hour judicial Break-Glass order.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D9D4C8] px-4 py-3 bg-[#F6F4EF] text-center text-[11px] text-[#4E5B72]">
        Sahaara (सहारा) • National Helpline 14566 • Tele-MANAS 14416 • Police 112
      </footer>
    </div>
  );
}
