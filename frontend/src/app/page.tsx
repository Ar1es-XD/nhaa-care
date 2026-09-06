import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8 text-center">
      {/* Hero Icon & Greeting */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-[#74a892] to-[#52796f] text-white rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-sm">
          🌿
        </div>
        <div className="inline-block bg-[#e8f0ec] text-[#354f52] font-semibold text-xs px-3.5 py-1 rounded-full border border-[#d8e6de]">
          A Safe Space for Healing & Justice • सहारा
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#2d3748] tracking-tight">
          Welcome to Sahaara
        </h1>
        <p className="text-sm md:text-base text-[#52796f] max-w-xl mx-auto leading-relaxed">
          A quiet, trauma-informed sanctuary where your mental well-being comes first. You are heard, you are supported, and your legal rights are safeguarded every step of the way.
        </p>
      </div>

      {/* 3 Dedicated Care Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 text-left">
        <Link 
          href="/citizen" 
          className="group bg-white border border-[#e8f0ec] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#74a892] transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f0ec] text-[#354f52] flex items-center justify-center text-2xl group-hover:scale-105 transition">
              🌸
            </div>
            <h3 className="font-bold text-base text-[#2d3748]">Citizen Sanctuary</h3>
            <p className="text-xs text-[#52796f] leading-relaxed">
              Mindful box-breathing, daily mood check-ins, private voice reflections, and your relief roadmap.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#52796f] pt-4 block group-hover:text-[#354f52]">
            Enter Sanctuary →
          </span>
        </Link>

        <Link 
          href="/counselor" 
          className="group bg-white border border-[#e8f0ec] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#74a892] transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ece9fb] text-[#5b4cb7] flex items-center justify-center text-2xl group-hover:scale-105 transition">
              🩺
            </div>
            <h3 className="font-bold text-base text-[#2d3748]">Counselor Care Circle</h3>
            <p className="text-xs text-[#52796f] leading-relaxed">
              Crisis triage queue, verbatim citizen signals, longitudinal distress velocity, and human verification gate.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#52796f] pt-4 block group-hover:text-[#354f52]">
            Open Triage Workspace →
          </span>
        </Link>

        <Link 
          href="/command" 
          className="group bg-white border border-[#e8f0ec] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#74a892] transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fef4ec] text-[#d97757] flex items-center justify-center text-2xl group-hover:scale-105 transition">
              🛡️
            </div>
            <h3 className="font-bold text-base text-[#2d3748]">Justice & Protection Command</h3>
            <p className="text-xs text-[#52796f] leading-relaxed">
              District Magistrate & SP oversight, PoA Rule 12 relief compliance scorecard, and emergency unmasking.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#52796f] pt-4 block group-hover:text-[#354f52]">
            Open Command Center →
          </span>
        </Link>
      </div>

      {/* Gentle Reassurance Banner */}
      <div className="bg-[#f4f7f5] border border-[#d8e6de] p-5 rounded-3xl text-xs text-[#52796f] max-w-2xl mx-auto flex items-center justify-center gap-2">
        <span>🕊️</span>
        <span>
          <strong>Zero-Knowledge Safety Guarantee:</strong> All personal reflections and health signals are encrypted at rest under the DPDP Act, 2023.
        </span>
      </div>
    </div>
  );
}
