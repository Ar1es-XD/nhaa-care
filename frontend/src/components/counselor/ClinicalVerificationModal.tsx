'use client';
import React, { useState } from 'react';

export const ClinicalVerificationModal: React.FC<{ alertId: string; onClose: () => void }> = ({ alertId, onClose }) => {
  const [notes, setNotes] = useState('');
  const [threatConfirmed, setThreatConfirmed] = useState(false);
  const [interventions, setInterventions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const toggleIntervention = (type: string) => {
    setInterventions(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleDispatch = async () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Clinical Verification & Multi-Agency Dispatch Gate</h3>
        <p className="text-xs text-slate-600">
          Per clinical governance policy, physical protection or relocation cannot be deployed without licensed professional confirmation.
        </p>

        {!done ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Assessment Notes (min 20 chars)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Document victim's immediate state, confirmed threats, and witness protection urgency..."
                className="w-full border rounded p-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="threat_conf"
                checked={threatConfirmed}
                onChange={(e) => setThreatConfirmed(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="threat_conf" className="text-xs font-bold text-red-700">
                Confirm Active Physical Threat / Witness Intimidation Disclosed
              </label>
            </div>

            {threatConfirmed && (
              <div className="space-y-2 border-t pt-3">
                <span className="text-xs font-semibold text-slate-700 block">Select Authorized Inter-Agency Referrals:</span>
                <label className="flex items-center gap-2 text-xs text-slate-800">
                  <input type="checkbox" onChange={() => toggleIntervention('WITNESS_POLICE_PROTECTION')} />
                  Dispatch SP Witness Protection Detail
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-800">
                  <input type="checkbox" onChange={() => toggleIntervention('EMERGENCY_RELOCATION')} />
                  Request District Magistrate Transit Relocation
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-800">
                  <input type="checkbox" onChange={() => toggleIntervention('LEGAL_AID_DLSA')} />
                  Assign DLSA Witness Accompaniment Counsel
                </label>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="px-4 py-2 border rounded text-xs">Cancel</button>
              <button
                onClick={handleDispatch}
                disabled={notes.length < 20 || submitting}
                className="px-4 py-2 bg-blue-900 text-white font-semibold rounded text-xs hover:bg-blue-800 disabled:opacity-50"
              >
                {submitting ? 'Verifying...' : 'Sign & Dispatch Authorized Action'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-sm font-bold text-emerald-800">Intervention Dispatched & Audit Chained</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded text-xs">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};
