import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreId, Product } from '../../types';
import { 
  Barcode, Search, CheckCircle2, AlertTriangle, AlertOctagon, 
  Trash2, RefreshCw, X, ShieldAlert, Download, Sparkles
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface AuditItemScan {
  barcode: string;
  product: Product;
  scannedCount: number;
}

export const RapidStockAuditModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { products, stores, currentStoreId, showToast } = useApp();

  const [selectedStore, setSelectedStore] = useState<StoreId>(currentStoreId);
  const [selectedBox, setSelectedBox] = useState<string>('BOX-01');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedMap, setScannedMap] = useState<Record<string, number>>({});
  const [lastScannedItem, setLastScannedItem] = useState<Product | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter expected products for this store & box
  const expectedProducts = products.filter(p => p.boxNumber === selectedBox);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = barcodeInput.trim();
    if (!query) return;

    const matched = products.find(p => p.barcode === query || p.sku.toLowerCase() === query.toLowerCase());
    if (matched) {
      setScannedMap(prev => ({
        ...prev,
        [matched.id]: (prev[matched.id] || 0) + 1
      }));
      setLastScannedItem(matched);
      sounds.playScanBeep();
      setBarcodeInput('');
    } else {
      showToast('Unknown Barcode', `Barcode ${query} not in catalog!`, 'warning');
      sounds.playTapClick();
    }
  };

  const totalExpectedUnits = expectedProducts.reduce((acc, p) => acc + (p.stockByStore[selectedStore] || 0), 0);
  const totalScannedUnits = Object.values(scannedMap).reduce((acc, count) => acc + count, 0);

  // Calculate discrepancies
  let missingUnits = 0;
  let missingValue = 0;
  let excessUnits = 0;

  const discrepancyList = expectedProducts.map(p => {
    const expected = p.stockByStore[selectedStore] || 0;
    const counted = scannedMap[p.id] || 0;
    const variance = counted - expected;

    if (variance < 0) {
      missingUnits += Math.abs(variance);
      missingValue += Math.abs(variance) * p.costPrice;
    } else if (variance > 0) {
      excessUnits += variance;
    }

    return {
      product: p,
      expected,
      counted,
      variance,
      status: variance === 0 ? 'MATCHED' : (variance < 0 ? 'MISSING' : 'EXCESS')
    };
  });

  const handleReconcileComplete = () => {
    sounds.playCheckoutSuccess();
    showToast('Audit Reconciled', `Physical verification recorded for ${selectedBox}. Discrepancy logged.`, 'success');
    onClose();
  };

  const boxes = ['BOX-01', 'BOX-02', 'BOX-03', 'BOX-04', 'BOX-05', 'BOX-06', 'BOX-07', 'BOX-08', 'BOX-09', 'BOX-10'];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-900 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                Rapid-Fire Physical Stock Audit & Shrinkage Sentinel
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  100 scans/min
                </span>
              </div>
              <div className="text-xs text-emerald-200/70">
                Continuous hardware barcode scanning with instant inventory variance analysis
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Store & Box Selector */}
        <div className="p-4 bg-slate-950/70 border-b border-white/[0.06] flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store:</span>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value as StoreId)}
              className="bg-slate-900 border border-white/[0.1] text-white text-xs rounded-xl px-3 py-1.5 font-semibold"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Bin / Box:</span>
            <select
              value={selectedBox}
              onChange={(e) => {
                setSelectedBox(e.target.value);
                setScannedMap({});
                sounds.playTapClick();
              }}
              className="bg-slate-900 border border-white/[0.1] text-emerald-300 text-xs rounded-xl px-3 py-1.5 font-bold font-mono"
            >
              {boxes.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* KPI Mini Badges */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.08]">
              <span className="text-slate-400">Expected:</span> <span className="font-bold text-white">{totalExpectedUnits}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              <span className="text-emerald-400">Scanned:</span> <span className="font-bold">{totalScannedUnits}</span>
            </div>
            {missingUnits > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800/60">
                <span>Shrinkage:</span> <span className="font-bold">-{missingUnits} (₹{missingValue.toLocaleString('en-IN')})</span>
              </div>
            )}
          </div>
        </div>

        {/* Rapid-Fire Scanner Bar */}
        <div className="p-4 bg-slate-900 border-b border-white/[0.08]">
          <form onSubmit={handleScanSubmit} className="relative">
            <Barcode className="w-5 h-5 text-emerald-400 absolute left-4 top-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Point Barcode Gun & Fire Continuously (Press Enter automatically)..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full bg-slate-950 border border-emerald-500/40 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </form>

          {lastScannedItem && (
            <div className="mt-2 text-xs text-emerald-400 flex items-center justify-between font-mono animate-in fade-in">
              <span>✓ Last Scanned: <strong>{lastScannedItem.name}</strong> ({lastScannedItem.sku})</span>
              <span>Count in this audit: {scannedMap[lastScannedItem.id] || 0}</span>
            </div>
          )}
        </div>

        {/* Discrepancy Verification Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">SKU & Item Name</th>
                <th className="pb-3">Size & Fabric</th>
                <th className="pb-3 text-right">System Qty</th>
                <th className="pb-3 text-right">Physical Scan</th>
                <th className="pb-3 text-right">Variance</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {discrepancyList.map(({ product: p, expected, counted, variance, status }) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors font-mono">
                  <td className="py-2.5">
                    <div className="font-bold text-white font-sans">{p.name}</div>
                    <div className="text-[10px] text-slate-400">{p.sku} · {p.barcode}</div>
                  </td>
                  <td className="py-2.5 text-slate-300">
                    {p.size} · {p.fabric}
                  </td>
                  <td className="py-2.5 text-right text-slate-300">{expected}</td>
                  <td className="py-2.5 text-right font-bold text-white">
                    {counted}
                  </td>
                  <td className={`py-2.5 text-right font-bold ${
                    variance === 0 ? 'text-slate-400' : (variance < 0 ? 'text-rose-400' : 'text-amber-400')
                  }`}>
                    {variance > 0 ? `+${variance}` : variance}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      status === 'MATCHED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : status === 'MISSING'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}>
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Audit Session ID: AUDIT-2026-AUG-{selectedBox}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setScannedMap({});
                sounds.playTapClick();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-all"
            >
              Reset Audit Scan
            </button>

            <button
              onClick={handleReconcileComplete}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all tactile-btn"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Finalize Stock Reconcile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
