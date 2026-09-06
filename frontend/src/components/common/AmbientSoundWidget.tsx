'use client';
import React, { useState, useRef, useEffect } from 'react';

export const AmbientSoundWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const startRainSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generate 5 seconds of pink noise buffer
      const bufferSize = ctx.sampleRate * 5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      // Filter to simulate soft rainfall
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNodeRef.current = gain;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      sourceNodeRef.current = whiteNoise;
      setIsPlaying(true);
    } catch (e) {
      console.warn("Web Audio autoplay error:", e);
    }
  };

  const stopSound = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (_) {}
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startRainSound();
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? "Mute gentle ambient rainfall" : "Play soothing ambient rainfall for calm"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-sm ${
        isPlaying 
          ? 'bg-[#52796f] text-white animate-pulse' 
          : 'bg-[#e8f0ec] hover:bg-[#d8e6de] text-[#354f52]'
      }`}
    >
      <span>{isPlaying ? '🌧️ Rain Calm: On' : '🌧️ Calm Sound'}</span>
    </button>
  );
};
