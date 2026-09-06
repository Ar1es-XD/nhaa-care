import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#134074] text-slate-200 text-xs py-6 border-t border-slate-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <p className="font-semibold text-white">Ministry of Social Justice & Empowerment, Government of India</p>
          <p className="text-slate-300">Monitored under SC/ST (Prevention of Atrocities) Act 1989 & DPDP Act 2023</p>
        </div>
        <div className="flex flex-wrap gap-4 text-slate-300">
          <a href="#" className="hover:underline">GIGW 3.0 Compliance</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Tele-MANAS (14416)</a>
        </div>
      </div>
    </footer>
  );
};
