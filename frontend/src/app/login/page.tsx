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
  // Split portal path: 'citizen' | 'counselor'
  const [portalPath, setPortalPath] = useState<'citizen' | 'counselor'>('citizen');

  // Sign in / Sign up form fields
  const [email, setEmail] = useState('priya.devi@sahay.gov.in');
  const [password, setPassword] = useState('••••••••');
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

    const targetRole: UserRole = portalPath === 'counselor' ? 'counselor' : 'victim';
    const result = await signInWithEmail(email, password, targetRole);
    setIsLoading(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        routeUserByRole(targetRole);
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

    const targetRole: UserRole = portalPath === 'counselor' ? 'counselor' : 'victim';
    const result = await signUpWithEmail(email, password, fullName, targetRole, district);
    setIsLoading(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        routeUserByRole(targetRole);
      }, 800);
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  // 3. Handle Phone OTP Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const targetRole: UserRole = portalPath === 'counselor' ? 'counselor' : 'victim';
    localStorage.setItem('sahay_pending_identifier', identifier || '9876543210');
    localStorage.setItem('sahay_pending_role', targetRole);
    setTimeout(() => {
      router.push(`/verify-otp?role=${targetRole}`);
    }, 400);
  };

  // 4. Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    const targetRole: UserRole = portalPath === 'counselor' ? 'counselor' : 'victim';
    const result = await signInWithGoogle(targetRole);
    if (!result.success && result.message) {
      setIsLoading(false);
      setStatusMessage({
        type: 'info',
        text: `${result.message} (You can also sign in with Email or use Instant Persona below.)`
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
          <div className="lg:col-span-6 max-w-md mx-auto w-full space-y-4">
            
            {/* Split 2-Path Portal Selection */}
            <div className="space-y-1.5 pb-1">
              <span className="text-[10px] font-bold text-[#4E5B72] tracking-wider uppercase block">
                Choose Access Workspace / प्रवेश द्वार चुनें:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPortalPath('citizen');
                    setSelectedRole('victim');
                    setEmail('priya.devi@sahay.gov.in');
                    setStatusMessage(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    portalPath === 'citizen'
                      ? 'bg-white border-[#6E8E7A] shadow-md ring-2 ring-[#6E8E7A]/25'
                      : 'bg-[#F2EFE9] border-[#D9D4C8] hover:bg-white text-[#4E5B72]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🌿</span>
                    <span className="text-xs font-bold text-[#23303A]">Citizen Portal</span>
                  </div>
                  <span className="text-[10px] text-[#5B7A66] font-medium block">नागरिक सहायता कक्ष</span>
                  <span className="text-[9px] text-[#4E5B72] block mt-1">Healing sanctuary & daily journal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPortalPath('counselor');
                    setSelectedRole('counselor');
                    setEmail('dr.ananya.verma@counselor.sahay.gov.in');
                    setStatusMessage(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    portalPath === 'counselor'
                      ? 'bg-white border-[#1F4A48] shadow-md ring-2 ring-[#1F4A48]/25'
                      : 'bg-[#F2EFE9] border-[#D9D4C8] hover:bg-white text-[#4E5B72]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🧠</span>
                    <span className="text-xs font-bold text-[#23303A]">Counselor Portal</span>
                  </div>
                  <span className="text-[10px] text-[#1F4A48] font-medium block">परामर्शदाता कक्ष</span>
                  <span className="text-[9px] text-[#4E5B72] block mt-1">Caseload & mapped user data</span>
                </button>
              </div>
            </div>

            {/* Header copy */}
            <div className="space-y-1">
              <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#23303A]">
                {portalPath === 'citizen'
                  ? (authMode === 'signup' ? 'Create your citizen account' : 'Welcome to your care space')
                  : (authMode === 'signup' ? 'Register as Certified Counselor' : 'Counselor Clinical Workspace')}
              </h1>
              <p className="text-xs text-[#4E5B72]">
                {portalPath === 'citizen'
                  ? 'Zero-Knowledge encrypted under DPDP Act 2023. Real identities are sealed.'
                  : 'Authorized triage workspace under SC/ST (PoA) Act Section 15A.'}
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
            <div className="bg-white border border-[#D9D4C8] rounded-2xl p-4 space-y-3 shadow-sm">
              <p className="text-[11px] font-medium text-[#4E5B72] text-center">
                Or authenticate via Google OAuth or MeriPehchan:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-3 border border-[#D9D4C8] rounded-xl text-xs text-[#23303A] hover:bg-[#F6F4EF] transition font-medium flex items-center justify-center gap-2 bg-white shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>
                    {portalPath === 'citizen'
                      ? 'Sign in with Google (Citizen Space)'
                      : 'Sign in with Google (Counselor Space)'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={signInWithMeriPehchan}
                  className="w-full py-2 px-3 bg-[#1F4A48] text-white rounded-xl text-xs hover:bg-[#153331] transition text-center font-medium flex items-center justify-center gap-1.5"
                >
                  <span>🇮🇳 MeriPehchan National SSO</span>
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
