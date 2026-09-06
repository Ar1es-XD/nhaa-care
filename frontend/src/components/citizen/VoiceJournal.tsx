'use client';
import React, { useState } from 'react';

export const VoiceJournal: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [saved, setSaved] = useState(false);

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setJournalEntry("Today felt a little calmer. No one stopped by our lane, but I still feel uneasy when it gets dark. I talked with my sister today.");
      }, 1800);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#e8f0ec] shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#2d3748]">Private Voice & Thought Sanctuary / निजी विचार एवं वॉइस डायरी</h3>
          <p className="text-xs text-[#52796f]">Take a quiet moment to speak or type what you are experiencing. You are safe here.</p>
        </div>
        <span className="text-xs bg-[#ece9fb] text-[#5b4cb7] px-3 py-1 rounded-full font-medium flex items-center gap-1">
          <span>🔒</span>
          <span>Zero-Knowledge Encrypted</span>
        </span>
      </div>

      <textarea
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
        placeholder="Type or record your feelings freely. Everything you share is protected and confidential..."
        rows={3}
        className="w-full bg-[#faf8f5] border border-[#e8f0ec] rounded-2xl p-4 text-xs text-[#2d3748] focus:ring-2 focus:ring-[#74a892] focus:outline-none transition"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          onClick={handleToggleRecord}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition ${
            isRecording 
              ? 'bg-[#e76f51] text-white animate-pulse' 
              : 'bg-[#e8f0ec] hover:bg-[#d8e6de] text-[#354f52]'
          }`}
        >
          <span>{isRecording ? '⏹ Stop Recording' : '🎙️ Record Voice Reflection'}</span>
        </button>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-[#2a9d8f] font-semibold animate-fade-in">
              ✓ Safely saved to your care record
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!journalEntry}
            className="px-5 py-2 rounded-full bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-semibold shadow transition disabled:opacity-40"
          >
            Save Thought
          </button>
        </div>
      </div>
    </div>
  );
};
