import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchemeRule, ApparelCategory } from '../../types';
import { Tag, Plus, Check, Percent, Sparkles, RefreshCw } from 'lucide-react';

export const SchemesHub: React.FC = () => {
  const { schemes, addScheme, products, showToast } = useApp();

  const [newSchemeModal, setNewSchemeModal] = useState(false);
  const [code, setCode] = useState('DIWALI_20');
  const [name, setName] = useState('Diwali Special 20% Off');
  const [type, setType] = useState<SchemeRule['type']>('SLAB');
  const [minQty, setMinQty] = useState<number>(2);
  const [minBillValue, setMinBillValue] = useState<number>(4999);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [discountAmount, setDiscountAmount] = useState<number>(500);
  const [validCategory, setValidCategory] = useState<ApparelCategory>('Mens Ethnic');

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    addScheme({
      id: 'sch-' + Date.now(),
      code,
      name,
      type,
      minQty: type === 'SLAB' ? minQty : undefined,
      minBillValue: type === 'FLAT_OFF' ? minBillValue : undefined,
      discountPercent: type === 'SLAB' ? discountPercent : undefined,
      discountAmount: type === 'FLAT_OFF' ? discountAmount : undefined,
      validCategory: type === 'SLAB' ? validCategory : undefined,
      active: true,
      expiresOn: '2026-10-31'
    });

    setNewSchemeModal(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Pricing Strategy & Promotions</div>
          <h1 className="text-2xl font-extrabold text-white">Dynamic Schemes, Slab Discounts & MRP Rules</h1>
        </div>

        <button
          onClick={() => setNewSchemeModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Promo Scheme
        </button>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schemes.map(s => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono font-bold text-xs border border-indigo-800">
                  {s.code}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">🟢 Active</span>
              </div>

              <div className="font-bold text-white text-sm">{s.name}</div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1 text-slate-300">
                {s.type === 'SLAB' && (
                  <>
                    <div>Rule: <strong>{s.discountPercent}% Discount</strong></div>
                    <div className="text-slate-400">Min Quantity: <strong>{s.minQty} units</strong></div>
                    {s.validCategory && <div className="text-slate-400">Category: <strong>{s.validCategory}</strong></div>}
                  </>
                )}
                {s.type === 'FLAT_OFF' && (
                  <>
                    <div>Rule: <strong>Flat ₹{s.discountAmount} OFF</strong></div>
                    <div className="text-slate-400">Min Bill Amount: <strong>₹{s.minBillValue}</strong></div>
                  </>
                )}
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                  Expires: {s.expiresOn}
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Scheme Applied to POS', `Active code ${s.code} selected.`, 'info')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Test Scheme in POS Terminal
            </button>
          </div>
        ))}
      </div>

      {/* CREATE SCHEME MODAL */}
      {newSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-400" /> Create Dynamic Promotion Scheme
            </div>

            <form onSubmit={handleCreateScheme} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Scheme Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="SLAB">Slab Quantity % Discount</option>
                    <option value="FLAT_OFF">Flat Bill Amount OFF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Scheme Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              {type === 'SLAB' ? (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Min Qty</label>
                    <input
                      type="number"
                      value={minQty}
                      onChange={(e) => setMinQty(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Discount %</label>
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      value={validCategory}
                      onChange={(e) => setValidCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                    >
                      {['Mens Ethnic', 'Mens Casual', 'Womens Ethnic', 'Fabrics', 'Accessories'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Min Bill Value (₹)</label>
                    <input
                      type="number"
                      value={minBillValue}
                      onChange={(e) => setMinBillValue(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Flat Discount (₹)</label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewSchemeModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Activate Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
