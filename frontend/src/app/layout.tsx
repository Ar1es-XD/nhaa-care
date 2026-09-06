import React from 'react';
import '../styles/globals.css';
import { SanctuaryHeader } from '../components/common/SanctuaryHeader';

export const metadata = {
  title: 'Sahaara (सहारा) | Safe Space for Healing, Support & Justice',
  description: 'A trauma-informed self-help sanctuary and legal protection platform under the SC/ST (PoA) Act framework.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between bg-[#faf8f5]">
        <div>
          <SanctuaryHeader />
          <main>{children}</main>
        </div>
        <footer className="bg-white border-t border-[#e8f0ec] text-xs py-8 mt-12 text-[#52796f]">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="font-bold text-[#2d3748]">Sahaara (सहारा) — Healing & Protection Sanctuary</p>
              <p className="text-[11px] text-slate-500">
                Verified support network under SC/ST (PoA) Act, 1989 & DPDP Act, 2023. National Helpline: 14566
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-500 text-[11px]">
              <a href="#" className="hover:underline">Trauma-Informed Principles</a>
              <a href="#" className="hover:underline">Confidentiality & Privacy</a>
              <a href="#" className="hover:underline">Tele-MANAS (14416)</a>
              <a href="#" className="hover:underline">NHAA Care (14566)</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
