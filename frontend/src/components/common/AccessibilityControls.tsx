'use client';
import React, { useState } from 'react';

export const AccessibilityControls: React.FC = () => {
  const [zoom, setZoom] = useState(100);

  const changeZoom = (delta: number) => {
    const next = Math.min(Math.max(zoom + delta, 90), 130);
    setZoom(next);
    document.documentElement.style.fontSize = `${(next / 100) * 16}px`;
  };

  return (
    <div className="flex items-center gap-1 text-xs bg-slate-100 p-1 rounded border border-slate-200">
      <button onClick={() => changeZoom(-10)} className="px-2 py-0.5 font-bold hover:bg-white rounded">A-</button>
      <span className="px-1 text-slate-500 font-mono text-[10px]">{zoom}%</span>
      <button onClick={() => changeZoom(10)} className="px-2 py-0.5 font-bold hover:bg-white rounded">A+</button>
    </div>
  );
};
