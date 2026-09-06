import React from 'react';

export const OneTapCall: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#52796f] to-[#354f52] text-white p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
      <div className="space-y-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="text-xl">🤍</span>
          <h3 className="text-lg font-bold">Connect with a Caring Counselor / परामर्शदाता से बात करें</h3>
        </div>
        <p className="text-xs text-[#d8e6de] max-w-xl">
          Confidential, trauma-informed guidance available 24 hours a day. Whether you need quiet listening, legal accompaniment, or safety coordination, you are not alone.
        </p>
      </div>

      <a
        href="tel:14566"
        className="bg-[#faf8f5] hover:bg-white text-[#354f52] font-bold px-7 py-3 rounded-full text-xs shadow hover:shadow-md transition whitespace-nowrap"
      >
        📞 Call Confidentially (14566)
      </a>
    </div>
  );
};
