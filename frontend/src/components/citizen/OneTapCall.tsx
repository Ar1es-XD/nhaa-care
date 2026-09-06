import React from 'react';

export const OneTapCall: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold">Talk to a Certified Support Counselor / परामर्शदाता से बात करें</h3>
        <p className="text-xs text-blue-200">Confidential, trauma-informed psychological and legal-accompaniment guidance.</p>
      </div>
      <a
        href="tel:14566"
        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-3 rounded-lg text-sm shadow whitespace-nowrap"
      >
        📞 Call Now (14566)
      </a>
    </div>
  );
};
