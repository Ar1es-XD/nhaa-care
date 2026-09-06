import React from 'react';

export const VerbatimQuoteCard: React.FC<{ quote: string; language: string; channel: string }> = ({ quote, language, channel }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-3">
      <div className="flex justify-between items-center text-xs font-semibold text-amber-900 mb-1">
        <span>RAW VERBATIM SIGNAL ({channel})</span>
        <span className="uppercase">{language}</span>
      </div>
      <p className="text-sm font-medium text-slate-800 italic">"{quote}"</p>
      <p className="text-[11px] text-amber-800 mt-2">
        ⚠️ AI is prohibited from paraphrasing safety disclosures. Review raw text before clinical confirmation.
      </p>
    </div>
  );
};
