'use client';
import React from 'react';

export const LanguageSelector: React.FC<{ selected: string; onChange: (lang: string) => void }> = ({ selected, onChange }) => {
  const languages = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'bn', label: 'বাংলা' }
  ];

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-500 font-medium">भाषा / Language:</span>
      <select 
        value={selected} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
      >
        {languages.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
};
