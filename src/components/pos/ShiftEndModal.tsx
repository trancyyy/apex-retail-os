import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, Calculator, CheckCircle2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ShiftEndModal: React.FC<Props> = ({ onClose }) => {
  const { cashInDrawer, cashierName, currentStore, showToast, addJournalVoucher } = useApp();

  const [denominations, setDenominations] = useState<{ [denom: number]: number }>({
    500: 25,
    200: 10,
    100: 8,
    50: 10,
    20: 5,
    10: 12,
  });

  const [notes, setNotes] = useState('');

  const countedTotal = Object.entries(denominations).reduce((acc, [denom, count]) => {
    return acc + (Number(denom) * (Number(count) || 0));
  }, 0);

  const variance = countedTotal - cashInDrawer;

  const handleReconcile = () => {
    addJournalVoucher({
      date: new Date().toISOString().split('T')[0],
      type: 'Journal',
      debitAccount: 'Daily Retail Cash Counter',
      creditAccount: 'Cash Drawer Closing Clearing A/c',
      amount: countedTotal,
      narration: `Shift end physical denomination count by ${cashierName}. Variance: ₹${variance}`,
      storeId: currentStore.id,
      auditUser: cashierName
    });

    showToast('Shift Reconciled', `Physical cash ₹${countedTotal.toLocaleString('en-IN')} confirmed.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-sm font-bold text-white">Cash Register & Denomination Reconcile</div>
              <div className="text-[11px] text-slate-400">{currentStore.name} · {cashierName}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <div className="text-slate-400">System Expected Cash:</div>
              <div className="text-lg font-bold font-mono text-white">₹{cashInDrawer.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="text-slate-400">Physical Counted Cash:</div>
              <div className="text-lg font-bold font-mono text-emerald-400">₹{countedTotal.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Denominations table */}
          <div>
            <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-400" /> Currency Denomination Breakdown
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[500, 200, 100, 50, 20, 10].map(d => (
                <div key={d} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-mono font-bold text-slate-300">₹{d}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">×</span>
                    <input
                      type="number"
                      min={0}
                      value={denominations[d] || 0}
                      onChange={(e) => setDenominations({ ...denominations, [d]: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                    />
                    <span className="font-mono text-slate-400 w-16 text-right">
                      = ₹{(d * (denominations[d] || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Variance Box */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            variance === 0 
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
              : variance > 0 
                ? 'bg-blue-950/40 border-blue-800 text-blue-200'
                : 'bg-rose-950/40 border-rose-800 text-rose-200'
          }`}>
            <div>
              <div className="font-semibold">Reconciliation Status:</div>
              <div className="text-[11px] opacity-80">
                {variance === 0 ? 'Exact Match! Cash drawer is fully balanced.' : variance > 0 ? `Surplus of ₹${variance}` : `Shortage of ₹${Math.abs(variance)}`}
              </div>
            </div>
            <div className="text-base font-bold font-mono">
              {variance >= 0 ? `+₹${variance}` : `-₹${Math.abs(variance)}`}
            </div>
          </div>

          <textarea
            placeholder="Closing remarks / handover notes..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleReconcile}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4" /> Finalize Shift & Close Register
          </button>
        </div>
      </div>
    </div>
  );
};
