import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Scissors, Plus, Check, X, Calculator, Ruler } from 'lucide-react';

interface FabricCalculatorModalProps {
  onClose: () => void;
  onAddFabricToCart: (product: Product, meters: number, totalAmt: number) => void;
}

export const FabricCalculatorModal: React.FC<FabricCalculatorModalProps> = ({ onClose, onAddFabricToCart }) => {
  const { products, showToast } = useApp();

  const fabricProducts = products.filter(p => p.category === 'Fabrics' || p.name.toLowerCase().includes('fabric') || p.name.toLowerCase().includes('shirting') || p.name.toLowerCase().includes('silk'));
  const [selectedProduct, setSelectedProduct] = useState<Product>(fabricProducts[0] || products[0]);
  
  const [lengthMeters, setLengthMeters] = useState<number>(2.5);
  const [fabricWidth, setFabricWidth] = useState<string>('56" (143 cm)');
  const [shrinkageAllowance, setShrinkageAllowance] = useState<number>(3); // 3%
  const [customRatePerMeter, setCustomRatePerMeter] = useState<number>(selectedProduct?.salePrice || 450);

  const effectiveMeters = Number((lengthMeters * (1 + shrinkageAllowance / 100)).toFixed(2));
  const totalAmount = Math.round(effectiveMeters * customRatePerMeter);

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setCustomRatePerMeter(prod.salePrice || 450);
  };

  const handleAdd = () => {
    if (!selectedProduct) return;
    onAddFabricToCart(selectedProduct, effectiveMeters, totalAmount);
    showToast('Fabric Cut Added to Cart', `${effectiveMeters}m of ${selectedProduct.name} (₹${totalAmount})`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Metered Fabric & Thaan Cutting Calculator</h2>
              <p className="text-xs text-slate-400">Fractional cut calculator with width & shrinkage allowances (FrmCarpetCalc)</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Select Fabric Roll / Thaan</label>
            <select
              value={selectedProduct?.id}
              onChange={e => {
                const p = products.find(prod => prod.id === e.target.value);
                if (p) handleSelectProduct(p);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              {fabricProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.fabric}) - ₹{p.salePrice}/metre · Lot: {p.lotNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Quick presets for common cuts */}
          <div>
            <label className="block text-slate-400 mb-1.5">Common Retail Cut Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Shirt (1.6m)', val: 1.6 },
                { label: 'Trouser (1.3m)', val: 1.3 },
                { label: 'Safari Suit (2.8m)', val: 2.8 },
                { label: 'Full 3-Pc Suit (3.5m)', val: 3.5 }
              ].map(preset => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setLengthMeters(preset.val)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    lengthMeters === preset.val
                      ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-[10px]">{preset.label}</div>
                  <div className="font-mono font-bold">{preset.val}m</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Exact Cut Length (Meters)</label>
              <input
                type="number"
                step="0.05"
                min="0.25"
                value={lengthMeters}
                onChange={e => setLengthMeters(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Rate per Meter (₹)</label>
              <input
                type="number"
                value={customRatePerMeter}
                onChange={e => setCustomRatePerMeter(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Thaan Width / Panna</label>
              <select
                value={fabricWidth}
                onChange={e => setFabricWidth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value='56" (143 cm)'>56" Standard Suiting Panna</option>
                <option value='44" (112 cm)'>44" Shirting / Kurta Panna</option>
                <option value='36" (91 cm)'>36" Narrow Silk Panna</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Shrinkage Allowance (%)</label>
              <input
                type="number"
                value={shrinkageAllowance}
                onChange={e => setShrinkageAllowance(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
              />
            </div>
          </div>

          {/* Calculated Output Box */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/40 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Billed Meterage:</span>
              <span className="font-mono font-bold text-white">{effectiveMeters} Meters (inc. {shrinkageAllowance}% buffer)</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1 border-t border-slate-900">
              <span className="font-bold text-white">Calculated Line Total:</span>
              <span className="font-mono font-extrabold text-emerald-400 text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Cut Piece to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
