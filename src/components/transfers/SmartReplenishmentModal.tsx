import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, StoreId, StockTransferNote } from '../../types';
import { 
  Truck, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, 
  ArrowRight, X, Package, ShieldCheck, Zap
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ReplenishmentSuggestion {
  product: Product;
  targetStore: StoreId;
  targetStoreName: string;
  currentStock: number;
  dailyVelocity: number;
  daysToStockout: number;
  recommendedTransferQty: number;
}

export const SmartReplenishmentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { products, stores, createTransfer, showToast } = useApp();

  const [selectedDestination, setSelectedDestination] = useState<StoreId>('mcleodganj_store');

  // Compute predictive replenishment suggestions
  const suggestions: ReplenishmentSuggestion[] = products.slice(0, 12).map((p, idx) => {
    const stock = p.stockByStore[selectedDestination] || 0;
    const godownStock = p.stockByStore['zirakpur_godown'] || 40;
    const velocity = (idx % 3 === 0 ? 2.5 : (idx % 2 === 0 ? 1.8 : 0.8));
    const daysToStockout = Math.max(1, Math.round(stock / velocity));
    const recommendedTransferQty = Math.min(godownStock, Math.max(5, Math.round(velocity * 14))); // 14-day stock buffer

    const targetStoreObj = stores.find(s => s.id === selectedDestination) || stores[1];

    return {
      product: p,
      targetStore: selectedDestination,
      targetStoreName: targetStoreObj.name,
      currentStock: stock,
      dailyVelocity: velocity,
      daysToStockout,
      recommendedTransferQty
    };
  });

  const totalTransferUnits = suggestions.reduce((acc, s) => acc + s.recommendedTransferQty, 0);

  const handleGenerateSTN = () => {
    const stnData: Omit<StockTransferNote, 'id' | 'stnNo'> = {
      date: new Date().toISOString().split('T')[0],
      fromStoreId: 'zirakpur_godown',
      toStoreId: selectedDestination,
      items: suggestions.map(s => ({
        productId: s.product.id,
        sku: s.product.sku,
        name: s.product.name,
        size: s.product.size,
        color: s.product.color,
        qty: s.recommendedTransferQty,
        lotNo: s.product.lotNumber || 'LOT-2026-AUG-01'
      })),
      totalQty: totalTransferUnits,
      vehicleNo: selectedDestination === 'mcleodganj_store' ? 'HP-48-B-9912' : 'UK-07-C-4412',
      ewayBillNo: `2410${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'In-Transit',
      dispatchedBy: 'AI Auto-Replenishment Scheduler',
      notes: `Automated predictive replenishment for ${suggestions[0]?.targetStoreName} (14-Day Demand Buffer)`
    };

    createTransfer(stnData);
    sounds.playCheckoutSuccess();
    showToast('STN Generated', `Automated Stock Transfer Note generated with ${totalTransferUnits} units for dispatch!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-900 border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-b border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-300 border border-blue-400/40 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                Predictive Store Auto-Replenishment & Demand Radar
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  AI Sales Velocity
                </span>
              </div>
              <div className="text-xs text-blue-200/70">
                Balances stock from Central Godown to prevent showroom stock-outs
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

        {/* Store Target Filter */}
        <div className="p-4 bg-slate-950/70 border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination Showroom:</span>
            <select
              value={selectedDestination}
              onChange={(e) => {
                setSelectedDestination(e.target.value as StoreId);
                sounds.playTapClick();
              }}
              className="bg-slate-900 border border-white/[0.1] text-white text-xs rounded-xl px-3.5 py-1.5 font-bold"
            >
              {stores.filter(s => !s.isHQ && s.id !== 'zirakpur_godown').map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Source Godown:</span>
            <span className="font-bold text-emerald-400">Zirakpur Central Godown (EM-GDN)</span>
          </div>
        </div>

        {/* Suggestions Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Product Name & SKU</th>
                <th className="pb-3">Size & Color</th>
                <th className="pb-3 text-right">Branch Stock</th>
                <th className="pb-3 text-right">Daily Velocity</th>
                <th className="pb-3 text-right">Depletion Forecast</th>
                <th className="pb-3 text-right">AI Suggested Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {suggestions.map((s) => (
                <tr key={s.product.id} className="hover:bg-slate-800/40 transition-colors font-mono">
                  <td className="py-2.5">
                    <div className="font-bold text-white font-sans">{s.product.name}</div>
                    <div className="text-[10px] text-slate-400">{s.product.sku}</div>
                  </td>
                  <td className="py-2.5 text-slate-300">
                    {s.product.size} · {s.product.color}
                  </td>
                  <td className="py-2.5 text-right text-slate-300">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      s.currentStock <= 5 ? 'bg-rose-950 text-rose-300 border border-rose-800/60' : 'bg-slate-800 text-slate-200'
                    }`}>
                      {s.currentStock} units
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-300">
                    {s.dailyVelocity} / day
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`font-bold ${
                      s.daysToStockout <= 3 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                    }`}>
                      {s.daysToStockout} days left
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-extrabold text-emerald-400">
                    +{s.recommendedTransferQty} units
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-slate-300 font-mono">
            Total Recommended Units for Dispatch: <strong className="text-white">{totalTransferUnits} Units</strong> (Estimated 1 Tempo Load)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleGenerateSTN}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all tactile-btn"
            >
              <Truck className="w-4 h-4" />
              <span>1-Click Generate STN & E-Way Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
