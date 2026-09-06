'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SahayQuietHeader } from '@/components/common/SahayQuietHeader';

interface BaselineQuestion {
  id: number;
  question: string;
  hindiQuestion: string;
  subtext: string;
  options: { label: string; hindiLabel: string; score: number }[];
}

const QUESTIONS: BaselineQuestion[] = [
  {
    id: 1,
    question: "How has your sense of personal safety felt in recent days?",
    hindiQuestion: "पिछले कुछ दिनों में आपकी व्यक्तिगत सुरक्षा का अनुभव कैसा रहा है?",
    subtext: "Take your time. You can choose whatever feels closest.",
    options: [
      { label: "I feel reasonably safe right now", hindiLabel: "मैं अभी सुरक्षित महसूस कर रहा हूँ", score: 1 },
      { label: "Uneasy, especially after dark", hindiLabel: "असहज, विशेषकर रात के समय", score: 2 },
      { label: "Constantly anxious and on alert", hindiLabel: "लगातार भय और चिंता में", score: 3 },
    ],
  },
  {
    id: 2,
    question: "Have you or your family faced any unwelcome visits or warnings about your case?",
    hindiQuestion: "क्या आपके परिवार को किसी प्रकार की चेतावनी या दबाव का सामना करना पड़ा है?",
    subtext: "This helps your counselor know what support to coordinate.",
    options: [
      { label: "No unwelcome contacts", hindiLabel: "कोई अवांछित संपर्क नहीं", score: 1 },
      { label: "Indirect pressure or messages", hindiLabel: "अप्रत्यक्ष दबाव या संदेश", score: 2 },
      { label: "Direct threats or intimidation", hindiLabel: "सीधी धमकी या दबाव", score: 4 },
    ],
  },
  {
    id: 3,
    question: "How have you been managing sleep and everyday rest?",
    hindiQuestion: "आपकी नींद और मानसिक शांति की क्या स्थिति है?",
    subtext: "Sleep disturbance is a natural body response to trauma.",
    options: [
      { label: "Sleeping fairly well", hindiLabel: "नींद ठीक आ रही है", score: 1 },
      { label: "Waking frequently with anxiety", hindiLabel: "घबराहट के कारण बार-बार नींद टूटना", score: 2 },
      { label: "Hardly able to rest at all", hindiLabel: "नींद आना बेहद मुश्किल हो गया है", score: 3 },
    ],
  },
];

export default function BaselineOnboardingPage() {
  const router = useRouter();
  const { user, setBaselineCompleted } = useAuth();
  const [step, setStep] = useState(0); // 0 = welcome, 1-3 = questions, 4 = finish
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = QUESTIONS[step - 1];

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step < QUESTIONS.length) {
      setStep(step + 1);
      setSelectedOption(null);
    } else {
      setIsSubmitting(true);
      setBaselineCompleted(true);
      setTimeout(() => {
        router.push('/v/dashboard');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between">
      <SahayQuietHeader />

      <main className="max-w-xl mx-auto w-full px-4 py-8 md:py-16 my-auto">
        {step === 0 && (
          <div className="text-center space-y-6 animate-soft-settle">
            <div className="w-12 h-12 rounded-full bg-[#E6EEE8] text-[#5B7A66] flex items-center justify-center mx-auto text-xl">
              🌿
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#23303A]">
                Welcome, {user?.name || 'Friend'}
              </h1>
              <p className="text-sm text-[#4E5B72] max-w-md mx-auto leading-relaxed">
                This is Sahay — a quiet care space created to watch out for you and your family throughout your case.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#D9D4C8] rounded-xl text-xs text-[#4E5B72] max-w-md mx-auto text-left leading-relaxed">
              We ask three brief questions to understand where you are starting from. There are no right or wrong answers, and you are always in control.
            </div>

            <div className="pt-4">
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-lg transition shadow-sm"
              >
                Begin baseline reflection
              </button>
            </div>
          </div>
        )}

        {step >= 1 && step <= QUESTIONS.length && (
          <div className="space-y-6 animate-soft-settle">
            {/* Step progress (calm and subtle) */}
            <div className="flex items-center justify-between text-xs text-[#4E5B72]">
              <span>Question {step} of {QUESTIONS.length}</span>
              <span className="font-devanagari">प्रश्न {step}</span>
            </div>

            {/* Exactly One Question at a Time */}
            <div className="space-y-2">
              <h2 className="font-serif text-xl md:text-2xl font-medium text-[#23303A] leading-snug">
                {currentQ.question}
              </h2>
              <p className="text-xs text-[#6E8E7A] font-devanagari">
                {currentQ.hindiQuestion}
              </p>
              <p className="text-xs text-[#4E5B72] pt-1">
                {currentQ.subtext}
              </p>
            </div>

            {/* Options list */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selectedOption === idx
                      ? 'bg-[#E6EEE8] border-[#6E8E7A] text-[#23303A]'
                      : 'bg-white border-[#D9D4C8] hover:border-[#6E8E7A] text-[#23303A]'
                  }`}
                >
                  <span className="text-xs font-medium block">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-[#4E5B72] font-devanagari block mt-0.5">
                    {opt.hindiLabel}
                  </span>
                </button>
              ))}
            </div>

            {/* Exactly One Visible Primary Action */}
            <div className="pt-4">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className="w-full py-3 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-lg transition disabled:opacity-40"
              >
                {step === QUESTIONS.length ? 'Complete baseline' : 'Next question'}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72] py-4">
        Your answers are sealed in your private care vault.
      </footer>
    </div>
  );
}
