'use client';
import React, { useState } from 'react';

export const BreakGlassConsole: React.FC = () => {
  const [justification, setJustification] = useState('');
  const [unmasked, setUnmasked] = useState<any>(null);

  const handleUnmask = () => {
    setUnmasked({
      fullName: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      address: 'Gram Panchayat Sadar, Sector 4, Lucknow, UP',
      caste: 'SC',
      expiresIn: '03:59:59'
    });
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-red-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🚨</span>
        <h3 className="text-sm font-bold text-red-900 uppercase">Emergency Break-Glass Identity Unmasking</h3>
      </div>
      <p className="text-xs text-slate-600 mb-3">
        Restricted to District Magistrate and Superintendent of Police. All access requests are cryptographically audit-logged and dispatched to State Nodal Officer.
      </p>

      {!unmasked ? (
        <div className="space-y-3">
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={2}
            placeholder="Mandatory justification reason (min 50 characters)..."
            className="w-full border rounded p-2 text-xs"
          />
          <button
            onClick={handleUnmask}
            disabled={justification.length < 50}
            className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded text-xs disabled:opacity-50"
          >
            Authorize 4-Hour Time-Bounded Unmasking
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 p-4 rounded text-xs space-y-1">
          <div className="font-bold text-red-800">UNMASKED VICTIM IDENTITY (Session Timer: {unmasked.expiresIn})</div>
          <div><strong>Name:</strong> {unmasked.fullName}</div>
          <div><strong>Phone:</strong> {unmasked.phone}</div>
          <div><strong>Address:</strong> {unmasked.address}</div>
          <div><strong>Caste Category:</strong> {unmasked.caste}</div>
        </div>
      )}
    </div>
  );
};
