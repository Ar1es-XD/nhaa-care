import React from 'react';
import Link from 'next/link';
import { QuickExit } from './QuickExit';
import { AmbientSoundWidget } from './AmbientSoundWidget';
import { AuthModal } from './AuthModal';

export const SanctuaryHeader: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#e8f0ec] px-4 md:px-8 py-3.5 shadow-sm transition">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#74a892] to-[#52796f] text-white flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition">
            🌿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#2d3748] tracking-tight">Sahaara</span>
              <span className="text-xs bg-[#e8f0ec] text-[#354f52] font-semibold px-2 py-0.5 rounded-full">सहारा</span>
            </div>
            <span className="text-[11px] text-[#52796f] block font-medium">Safe Space for Healing, Support & Justice</span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <AmbientSoundWidget />
          <AuthModal />
          <a
            href="tel:14566"
            className="hidden md:flex items-center gap-1.5 bg-[#f4f7f5] hover:bg-[#e8f0ec] text-[#354f52] font-semibold px-3.5 py-1.5 rounded-full text-xs transition border border-[#d8e6de]"
          >
            <span>📞 14566</span>
          </a>
          <QuickExit />
        </div>
      </div>
    </header>
  );
};
