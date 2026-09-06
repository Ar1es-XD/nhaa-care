'use client';
import React, { useEffect } from 'react';

export const QuickExit: React.FC = () => {
  const triggerQuickExit = () => {
    document.title = "IRCTC Next Generation eTicketing System";
    window.location.replace("https://www.irctc.co.in");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerQuickExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <button
      onClick={triggerQuickExit}
      title="Press Escape to immediately disguise this screen"
      aria-label="Quick Exit to Railway Portal (Press Escape key)"
      className="bg-red-800 hover:bg-red-900 text-white font-semibold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 shadow"
    >
      <span>⚠️ Emergency Exit</span>
      <kbd className="bg-red-950 px-1 py-0.5 rounded text-[10px] text-red-200 uppercase">Esc</kbd>
    </button>
  );
};
