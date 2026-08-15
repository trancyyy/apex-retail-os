import React from 'react';
import { useApp } from '../../context/AppContext';
import { StockTransferNote } from '../../types';
import { Package, Printer, X, CheckSquare, Layers } from 'lucide-react';

interface BoxPickSlipModalProps {
  transfer: StockTransferNote;
  onClose: () => void;
}

export const BoxPickSlipModal: React.FC<BoxPickSlipModalProps> = ({ transfer, onClose }) => {
  const { products, stores } = useApp();

  const fromStore = stores.find(s => s.id === transfer.fromStoreId);
  const toStore = stores.find(s => s.id === transfer.toStoreId);

  // Group transfer items by Box Number
  const itemsWithBox = transfer.items.map(item => {
    const prod = products.find(p => p.id === item.productId || p.sku === item.sku);
    return {
      ...item,
      boxNumber: prod?.boxNumber || 'BOX-01',
      brand: prod?.brand || 'Emerge Collection',
      fabric: prod?.fabric || 'Cotton Blend'
    };
  });

  const boxGroups: Record<string, typeof itemsWithBox> = {};
  itemsWithBox.forEach(item => {
    if (!boxGroups[item.boxNumber]) boxGroups[item.boxNumber] = [];
    boxGroups[item.boxNumber].push(item);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Warehouse Box-Wise Pick Slip (FrmBoxIdWisePicSlip)</h2>
              <p className="text-xs text-slate-400">Picker sheet grouped by physical Box / Rack locations for STN #{transfer.stnNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md"
            >
              <Printer className="w-4 h-4" /> Print Pick Slip
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Dispatch summary banner */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">Origin Warehouse</span>
              <span className="font-bold text-white">{fromStore?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">Destination Branch</span>
              <span className="font-bold text-emerald-400">{toStore?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">Total Dispatched Qty</span>
              <span className="font-bold text-amber-300">{transfer.totalQty} Units</span>
            </div>
          </div>

          {/* Grouped by Box */}
          <div className="space-y-4">
            {Object.entries(boxGroups).map(([boxId, items]) => (
              <div key={boxId} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs">
                      {boxId}
                    </span>
                    <span className="font-semibold text-white">Bin Rack Allocation</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{items.reduce((s, i) => s + i.qty, 0)} pcs in this bin</span>
                </div>

                <div className="divide-y divide-slate-900">
                  {items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-0.5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0" />
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            SKU: {item.sku} · Lot: {item.lotNo} · Size: {item.size} · Color: {item.color}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="px-2 py-0.5 bg-slate-900 rounded font-bold text-white text-xs">
                          {item.qty} pcs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Picker sign off */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-[10px] text-slate-400">
            <div>
              <span>Warehouse Picker Signature: ______________________</span>
            </div>
            <div className="text-right">
              <span>Security Outward Check: ______________________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
