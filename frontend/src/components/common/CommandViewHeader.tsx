'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const CommandViewHeader: React.FC = () => {
  const pathname = usePathname();
  const { user, signInAsRole, signOut } = useAuth();

  return (
    <header className="bg-[#1F4A48] text-[#F6F4EF] px-4 md:px-8 py-3 border-b border-[#153331] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand & Jurisdiction */}
        <div className="flex items-center gap-4">
          <Link href="/c/queue" className="flex items-center gap-2">
            <span className="font-serif text-lg font-medium tracking-tight text-white">
              Command View
            </span>
            <span className="text-[11px] bg-[#153331] text-[#D9D4C8] px-2 py-0.5 rounded border border-[#2D5855]">
              SC/ST PoA Oversight
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs pl-4 border-l border-[#2D5855]">
            <Link
              href="/c/queue"
              className={`px-3 py-1.5 rounded transition ${
                pathname.startsWith('/c')
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-[#D9D4C8] hover:text-white'
              }`}
            >
              Priority Queue
            </Link>

            <Link
              href="/admin/alerts"
              className={`px-3 py-1.5 rounded transition ${
                pathname === '/admin/alerts'
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-[#D9D4C8] hover:text-white'
              }`}
            >
              Active Alerts
            </Link>

            <Link
              href="/admin/dispatch"
              className={`px-3 py-1.5 rounded transition ${
                pathname === '/admin/dispatch'
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-[#D9D4C8] hover:text-white'
              }`}
            >
              Inter-Agency Dispatch
            </Link>

            <Link
              href="/admin/analytics"
              className={`px-3 py-1.5 rounded transition ${
                pathname === '/admin/analytics'
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-[#D9D4C8] hover:text-white'
              }`}
            >
              Spatial Trends
            </Link>
          </nav>
        </div>

        {/* Right: Active Officer & Role Switcher */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-medium text-white text-[11px]">
              {user?.name || 'Officer'}
            </span>
            <span className="text-[10px] text-[#D9D4C8]">
              {user?.district || 'Varanasi'} District
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#153331] p-1 rounded border border-[#2D5855]">
            <button
              onClick={() => signInAsRole('counselor')}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                user?.role === 'counselor' ? 'bg-[#6E8E7A] text-white font-medium' : 'text-[#D9D4C8]'
              }`}
            >
              Counselor
            </button>
            <button
              onClick={() => signInAsRole('admin')}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                user?.role === 'admin' ? 'bg-[#B98A2B] text-white font-medium' : 'text-[#D9D4C8]'
              }`}
            >
              DM / SP
            </button>
            <button
              onClick={() => signInAsRole('victim')}
              className="px-2 py-0.5 rounded text-[10px] text-[#D9D4C8] hover:text-white transition"
              title="Switch to Victim Surface"
            >
              Sahay View
            </button>
          </div>

          <button
            onClick={signOut}
            className="text-[11px] text-[#D9D4C8] hover:text-white underline underline-offset-2 ml-1"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
