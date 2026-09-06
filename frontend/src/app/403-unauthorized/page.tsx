'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  const getTargetDashboard = () => {
    if (!user) return '/login';
    if (user.role === 'victim') return '/v/dashboard';
    if (user.role === 'counselor') return '/c/queue';
    return '/admin/alerts';
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between p-6">
      <div className="max-w-md mx-auto w-full my-auto py-12 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#F8F3E8] border border-[#E8DFC8] text-[#B98A2B] flex items-center justify-center mx-auto text-xl font-serif">
          §
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-medium text-[#23303A]">
            Access Boundary
          </h1>
          <p className="text-xs text-[#4E5B72] leading-relaxed max-w-sm mx-auto">
            This area is restricted to authorized personnel under Section 5.3 of the SC/ST (PoA) Act & DPDP Act 2023.
          </p>
        </div>

        <div className="p-4 bg-white border border-[#D9D4C8] rounded-xl text-xs text-[#4E5B72] text-left space-y-1">
          <p className="font-semibold text-[#23303A]">Current Session:</p>
          <p>User: {user?.name || 'Unauthenticated'}</p>
          <p>Role: {user?.role || 'Guest'}</p>
        </div>

        <div className="pt-2">
          <Link
            href={getTargetDashboard()}
            className="inline-block px-6 py-2.5 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-lg transition"
          >
            Return to your designated workspace
          </Link>
        </div>
      </div>

      <footer className="text-center text-[11px] text-[#4E5B72]">
        Role-Based & Attribute-Based Access Control (ABAC) Active
      </footer>
    </div>
  );
}
