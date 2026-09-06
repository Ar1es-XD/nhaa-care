'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { QuickExit } from './QuickExit';
import { AmbientSoundWidget } from './AmbientSoundWidget';

export const SahayQuietHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <header className="bg-[#F6F4EF] border-b border-[#D9D4C8] px-4 sm:px-8 py-3 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Subtle Identity & Case Reference */}
          <div className="flex items-center gap-3">
            <Link href="/v/dashboard" className="flex items-center gap-2 group">
              <span className="text-base font-semibold text-[#23303A] tracking-tight">
                Sahay
              </span>
              <span className="text-xs text-[#6E8E7A] font-devanagari">सहाय</span>
            </Link>

            {user?.caseNumber && (
              <span className="text-xs text-[#4E5B72] border-l border-[#D9D4C8] pl-3 hidden sm:inline">
                {user.caseNumber}
              </span>
            )}
          </div>

          {/* Persistent Privacy Affordance & Quick Exit */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-xs text-[#6E8E7A] hover:text-[#5B7A66] transition underline underline-offset-4 decoration-[#D9D4C8]"
            >
              About your privacy
            </button>

            <AmbientSoundWidget />

            <Link
              href="/emergency"
              className="text-xs text-[#8C4A3A] bg-[#F7ECE9] px-2.5 py-1 rounded border border-[#E5CDC6] font-medium hover:bg-[#EED9D3] transition"
            >
              14566
            </Link>

            <QuickExit />

            {user && (
              <button
                onClick={signOut}
                className="text-xs text-[#4E5B72] hover:text-[#23303A] transition ml-1"
                title="Sign out"
              >
                Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Persistent Privacy Drawer / Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-[#23303A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F6F4EF] border border-[#D9D4C8] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl animate-soft-settle">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#23303A]">
                  How your information is protected
                </h3>
                <p className="text-xs text-[#4E5B72] mt-0.5">
                  Privacy guarantees under the DPDP Act, 2023
                </p>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-[#4E5B72] hover:text-[#23303A] p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#23303A] leading-relaxed">
              <div className="p-3 bg-white border border-[#D9D4C8] rounded-lg space-y-1">
                <p className="font-semibold text-[#23303A]">What is recorded:</p>
                <p className="text-[#4E5B72]">
                  Only the thoughts, check-in answers, or voice recordings you voluntarily share here.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#D9D4C8] rounded-lg space-y-1">
                <p className="font-semibold text-[#23303A]">Who can see this:</p>
                <p className="text-[#4E5B72]">
                  Only your assigned licensed counsellor. Police, court officials, and outside authorities cannot see your personal journal entries or private thoughts.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#D9D4C8] rounded-lg space-y-1">
                <p className="font-semibold text-[#23303A]">Zero-Knowledge Storage:</p>
                <p className="text-[#4E5B72]">
                  Your identity and caste category are sealed in an isolated vault using AES-256 envelope encryption.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-lg transition"
            >
              I understand
            </button>
          </div>
        </div>
      )}
    </>
  );
};
