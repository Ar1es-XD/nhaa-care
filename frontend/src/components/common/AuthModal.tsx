'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const { user, signInWithGoogle, signInWithMeriPehchan, signInAsRole, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {user ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f7f5] hover:bg-[#e8f0ec] border border-[#d8e6de] text-xs font-semibold text-[#354f52] transition shadow-sm"
          >
            <div className="w-5 h-5 rounded-full bg-[#52796f] text-white flex items-center justify-center text-[10px] uppercase font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
            <span className="text-[10px] bg-[#e8f0ec] text-[#52796f] px-1.5 py-0.5 rounded capitalize">
              {user.role}
            </span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-semibold shadow-sm transition"
        >
          <span>🔐 Sign In / प्रवेश</span>
        </button>
      )}

      {/* Modal Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-[#d8e6de] shadow-xl p-5 z-50 animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-[#e8f0ec] pb-3">
            <div>
              <h4 className="text-sm font-bold text-[#2d3748]">Sahaara Identity & Access</h4>
              <p className="text-[11px] text-[#52796f]">Supabase Auth & MeriPehchan SSO</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          {user && (
            <div className="bg-[#f4f7f5] p-3 rounded-2xl border border-[#e8f0ec] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">Active Session</span>
                <span className="text-[10px] bg-[#d8e6de] text-[#2d3748] px-2 py-0.5 rounded-full font-medium">
                  {user.provider}
                </span>
              </div>
              <p className="font-bold text-[#2d3748]">{user.name}</p>
              <p className="text-[#52796f] text-[11px]">{user.email}</p>
              <p className="text-slate-500 text-[10px]">Jurisdiction: <strong>{user.district} District</strong></p>
            </div>
          )}

          {/* Real Auth Options */}
          <div className="space-y-2">
            <button
              onClick={async () => {
                await signInWithGoogle();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white border border-[#d8e6de] hover:bg-[#f9fbf9] text-xs font-semibold text-[#2d3748] shadow-sm transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google OAuth</span>
            </button>

            <button
              onClick={async () => {
                await signInWithMeriPehchan();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold shadow-sm transition"
            >
              <span>🇮🇳 MeriPehchan (Jan Parichay) SSO</span>
            </button>
          </div>

          {/* Quick Role Select for Demonstration */}
          <div className="pt-2 border-t border-[#e8f0ec] space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
              Quick Demonstration Personas:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  signInAsRole('citizen');
                  setIsOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition ${
                  user?.role === 'citizen'
                    ? 'bg-[#52796f] text-white border-[#52796f]'
                    : 'bg-[#faf8f5] text-[#354f52] border-[#e8f0ec] hover:border-[#74a892]'
                }`}
              >
                🌸 Citizen
              </button>

              <button
                onClick={() => {
                  signInAsRole('counselor');
                  setIsOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition ${
                  user?.role === 'counselor'
                    ? 'bg-[#5b4cb7] text-white border-[#5b4cb7]'
                    : 'bg-[#faf8f5] text-[#5b4cb7] border-[#e8f0ec] hover:border-[#5b4cb7]'
                }`}
              >
                🩺 Counselor
              </button>

              <button
                onClick={() => {
                  signInAsRole('admin');
                  setIsOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition ${
                  user?.role === 'admin'
                    ? 'bg-[#d97757] text-white border-[#d97757]'
                    : 'bg-[#faf8f5] text-[#d97757] border-[#e8f0ec] hover:border-[#d97757]'
                }`}
              >
                🛡️ DM / SP
              </button>
            </div>
          </div>

          {user && (
            <button
              onClick={async () => {
                await signOut();
                setIsOpen(false);
              }}
              className="w-full py-2 rounded-xl text-xs font-semibold text-[#e76f51] hover:bg-[#fdf2f0] border border-[#f5c6cb] transition"
            >
              Sign Out from Session
            </button>
          )}
        </div>
      )}
    </div>
  );
};
