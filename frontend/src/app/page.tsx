import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6 text-center">
      <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow">
        🏛️
      </div>
      <h1 className="text-3xl font-bold text-slate-900">
        National Helpline Against Atrocities (NHAA - 14566)
      </h1>
      <p className="text-sm text-slate-600 max-w-2xl mx-auto">
        AI-based Dynamic Mental Health Monitoring, Longitudinal Distress Prediction & Multi-Agency Closed-Loop Intervention System under the SC/ST (Prevention of Atrocities) Act.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <Link href="/citizen" className="border rounded-lg p-6 bg-white hover:border-blue-700 shadow-sm transition">
          <div className="text-2xl mb-2">👤</div>
          <h3 className="font-bold text-slate-900">Citizen Care Portal</h3>
          <p className="text-xs text-slate-500 mt-1">Trauma-informed care bar, emotion pulse & relief tracking</p>
        </Link>
        <Link href="/counselor" className="border rounded-lg p-6 bg-white hover:border-blue-700 shadow-sm transition">
          <div className="text-2xl mb-2">🩺</div>
          <h3 className="font-bold text-slate-900">Counselor Triage</h3>
          <p className="text-xs text-slate-500 mt-1">Crisis triage board, verbatim quotes & human dispatch gate</p>
        </Link>
        <Link href="/command" className="border rounded-lg p-6 bg-white hover:border-blue-700 shadow-sm transition">
          <div className="text-2xl mb-2">🛡️</div>
          <h3 className="font-bold text-slate-900">Command Center</h3>
          <p className="text-xs text-slate-500 mt-1">District Magistrate & SP heatmaps & break-glass console</p>
        </Link>
      </div>
    </div>
  );
}
