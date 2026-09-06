import React from 'react';
import { QuickExit } from './QuickExit';

export const GovHeader: React.FC = () => {
  return (
    <header className="bg-[#0B2545] text-white border-b-4 border-[#F58220] px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0B2545] font-black text-xl">
            🏛️
          </div>
          <div>
            <div className="text-xs tracking-wider uppercase opacity-90">Government of India | सामाजिक न्याय और अधिकारिता मंत्रालय</div>
            <div className="text-lg font-bold">National Helpline Against Atrocities (NHAA - 14566)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="tel:14566"
            className="bg-[#138808] hover:bg-green-700 text-white font-bold px-4 py-2 rounded text-sm flex items-center gap-2 shadow"
          >
            <span>📞 24x7 Toll-Free: 14566</span>
          </a>
          <QuickExit />
        </div>
      </div>
    </header>
  );
};
