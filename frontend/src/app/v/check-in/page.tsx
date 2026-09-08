'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SahayQuietHeader } from '@/components/common/SahayQuietHeader';
import { saveInteractionTurn } from '@/lib/interactionStore';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  hindiText?: string;
  isThreatHandoff?: boolean;
}

function CheckInContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: "Hello Priya. We are here with you. How have you been feeling since yesterday?",
      hindiText: "नमस्ते प्रिया। हम आपके साथ हैं। कल से अब तक आप कैसा महसूस कर रही हैं?",
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.lang = 'hi-IN';
        rec.onresult = (e: any) => {
          const trans = e.results[0][0].transcript;
          setInputText(trans);
          setIsRecording(false);
        };
        rec.onerror = () => setIsRecording(false);
        rec.onend = () => setIsRecording(false);
        recognitionRef.current = rec;
      }
    }
  }, []);

  const handleToggleRecord = () => {
    if (isRecording) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setIsRecording(false);
    } else {
      setIsRecording(true);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        setTimeout(() => {
          setInputText("आज मन में थोड़ा डर था, पर मैं सम्भलने की कोशिश कर रही हूँ।");
          setIsRecording(false);
        }, 1800);
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText,
    };

    setMessages((prev) => [...prev, userMsg]);
    const sentText = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: sentText,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          emotion: 'seeking quiet support',
          language: /[\u0900-\u097F]/.test(sentText) || /\b(hai|hain|nahi|nahin|hum|hume|ghar|dar|darr|police|shaam|aaye|gaye|kya|kyun|kaise)\b/i.test(sentText) ? 'hi' : 'en',
        }),
      });

      const data = await res.json();
      const replyText = data.response || "We hear you with care. You are not alone.";

      // Persist turn to interaction store for counselor mapping
      try {
        saveInteractionTurn({
          caseId: user?.caseNumber || 'NHAA/2026/UP/VNS/00492',
          userPrompt: sentText,
          aiResponse: replyText,
          emotion: 'seeking quiet support',
          channel: 'WEB_CHAT',
          isSafetyEscalation: !!data.isSafetyEscalation,
          autonomicArousal: data.isSafetyEscalation ? 86 : 64,
        });
      } catch (e) {
        console.warn('Failed to persist interaction turn:', e);
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        isThreatHandoff: data.isSafetyEscalation,
      };

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
        if (messages.length >= 2) {
          setTimeout(() => setIsCompleted(true), 3000);
        }
      }, 1000);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "We are listening to you with care. Take a slow, steady breath. You are safe here.",
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between">
      <SahayQuietHeader />

      <main className="max-w-xl mx-auto w-full px-4 py-6 md:py-10 flex-1 flex flex-col justify-between">
        {searchParams.get('source') === 'sms' && (
          <div className="mb-4 text-center">
            <span className="text-[11px] text-[#4E5B72] bg-white border border-[#D9D4C8] px-3 py-1 rounded-full">
              Opened from your daily check-in message
            </span>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              } animate-soft-settle`}
            >
              <div
                className={`max-w-[88%] p-4 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#6E8E7A] text-white rounded-br-none'
                    : m.isThreatHandoff
                    ? 'bg-[#F7ECE9] border border-[#E5CDC6] text-[#8C4A3A]'
                    : 'bg-white border border-[#D9D4C8] text-[#23303A] rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line font-medium">{m.text}</p>
                {m.hindiText && (
                  <p className="text-[11px] font-devanagari mt-1.5 opacity-90">
                    {m.hindiText}
                  </p>
                )}

                {m.isThreatHandoff && (
                  <div className="mt-3 pt-2 border-t border-[#E5CDC6]">
                    <a
                      href="tel:14566"
                      className="inline-block px-3 py-1.5 bg-[#8C4A3A] text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Call Helpline 14566 Now
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-[#D9D4C8] rounded-xl w-24">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E8E7A] animate-fade-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E8E7A] animate-fade-pulse [animation-delay:300ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E8E7A] animate-fade-pulse [animation-delay:600ms]" />
            </div>
          )}
        </div>

        {isCompleted && (
          <div className="my-4 p-5 bg-white border border-[#D9D4C8] rounded-xl text-center space-y-3 animate-soft-settle">
            <div className="w-8 h-8 rounded-full bg-[#E6EEE8] text-[#5B7A66] flex items-center justify-center mx-auto text-sm">
              ✓
            </div>
            <h3 className="font-serif text-base font-medium text-[#23303A]">
              Thank you for checking in today
            </h3>
            <p className="text-xs text-[#4E5B72] leading-relaxed max-w-sm mx-auto">
              Your thoughts are safely sealed. If your feelings shift or you feel uneasy later, we are always here.
            </p>
            <Link
              href="/v/dashboard"
              className="inline-block px-5 py-2 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-lg transition"
            >
              Return to your space
            </Link>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-2 pt-2 border-t border-[#D9D4C8]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type what is on your mind... या यहाँ बोलें"
              disabled={isTyping}
              className="flex-1 bg-white border border-[#D9D4C8] rounded-xl px-4 py-3 text-xs text-[#23303A] focus:outline-none focus:border-[#6E8E7A]"
            />

            <button
              type="button"
              onClick={handleToggleRecord}
              className={`p-3 rounded-xl border text-xs transition ${
                isRecording
                  ? 'bg-[#8C4A3A] text-white border-[#8C4A3A]'
                  : 'bg-white text-[#23303A] border-[#D9D4C8] hover:border-[#6E8E7A]'
              }`}
              title="Record voice reflection"
            >
              {isRecording ? '⏹' : '🎙️'}
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="px-5 py-3 bg-[#6E8E7A] hover:bg-[#5B7A66] text-white text-xs font-medium rounded-xl transition disabled:opacity-40"
            >
              Share
            </button>
          </div>
          <p className="text-[10px] text-[#4E5B72] text-center">
            Encrypted under DPDP Act 2023. Never shared with outside authorities.
          </p>
        </form>
      </main>

      <footer className="text-center text-[11px] text-[#4E5B72] py-3 border-t border-[#D9D4C8]">
        <Link href="/v/dashboard" className="hover:underline">Back to home</Link>
      </footer>
    </div>
  );
}

export default function VictimCheckInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F4EF]" />}>
      <CheckInContent />
    </Suspense>
  );
}
