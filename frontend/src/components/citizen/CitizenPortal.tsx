import React from 'react';
import { BreathingWidget } from '../common/BreathingWidget';
import { CareProgressBar } from './CareProgressBar';
import { EmotionPulse } from './EmotionPulse';
import { VoiceJournal } from './VoiceJournal';
import { ReliefTracker } from './ReliefTracker';
import { OneTapCall } from './OneTapCall';

export const CitizenPortal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Warm Personal Greeting */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#e8f0ec] shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52796f]">
          <span>🌸</span>
          <span>Welcome to your safe space</span>
        </div>
        <h2 className="text-2xl font-bold text-[#2d3748]">
          Namaste, Ramesh Kumar / नमस्ते, रमेश कुमार
        </h2>
        <p className="text-xs text-[#52796f] max-w-2xl leading-relaxed">
          You are held in safety. Your case in Sadar, Lucknow is being actively monitored, and your legal aid companion <strong>Adv. Ananya Sharma</strong> is assigned to stand with you. Take today one gentle breath at a time.
        </p>
      </div>

      {/* Mindful Box Breathing Tool */}
      <BreathingWidget />

      {/* Daily Emotion Pulse Check-in */}
      <EmotionPulse />

      {/* Healing & Support Journey Progress */}
      <CareProgressBar progressPercent={70} />

      {/* Private Voice & Thought Journal */}
      <VoiceJournal />

      {/* Relief Roadmap Cards */}
      <ReliefTracker />

      {/* 24x7 Counselor Hotline */}
      <OneTapCall />
    </div>
  );
};
