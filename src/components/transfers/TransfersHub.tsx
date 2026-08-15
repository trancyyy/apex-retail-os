import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreId, StockTransferNote } from '../../types';
import { 
  Truck, Plus, ArrowRight, CheckCircle2, 
  Clock, AlertTriangle, FileText, Check, Package, Printer, TrendingUp, Sparkles 
} from 'lucide-react';
import { BoxPickSlipModal } from './BoxPickSlipModal';
import { SmartReplenishmentModal } from './SmartReplenishmentModal';

export const TransfersHub: React.FC = () => {
  const { transfers, createTransfer, updateTransferStatus, stores, products, showToast } = useApp();

  const [newStnModal, setNewStnModal] = useState(false);
  const [replenishmentModalOpen, setReplenishmentModalOpen] = useState(false);
  const [pickSlipTransfer, setPickSlipTransfer] = useState<StockTransferNote | null>(null);
  const [fromStore, setFromStore] = useState<StoreId>('zirakpur_godown');
  const [toStore, setToStore] = useState<StoreId>('dalhousie_store');
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || '');
  const [transferQty, setTransferQty] = useState<number>(5);
  const [vehicleNo, setVehicleNo] = useState('PB-65-AX-4819');
  const [ewayBill, setEwayBill] = useState('241098239910');
  const [notes, setNotes] = useState('Weekend store replenishment');

  const handleCreateSTN = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;

    createTransfer({
      date: new Date().toISOString().split('T')[0],
      fromStoreId: fromStore,
      toStoreId: toStore,
      items: [
        {
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          size: prod.size,
          color: prod.color,
          qty: Number(transferQty),
          lotNo: prod.lotNumber || 'LOT-2026-AUG'
        }
      ],
      totalQty: Number(transferQty),
      vehicleNo,
      ewayBillNo: ewayBill,
      status: 'In-Transit',
      dispatchedBy: 'Warehouse Manager',
      notes
    });

    setNewStnModal(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Multi-Store Logistics</div>
          <h1 className="text-2xl font-extrabold text-white">Stock Transfer Notes (STN) & Inter-Store Inward</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setReplenishmentModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold rounded-xl text-xs transition-all tactile-btn"
            title="AI Demand Velocity Auto-Replenishment"
          >
            <TrendingUp className="w-4 h-4 text-blue-400" /> Auto-Replenishment
          </button>
          <button
            onClick={() => setNewStnModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-600/20 transition-all tactile-btn"
          >
            <Plus className="w-4 h-4" /> Create New STN Transfer
          </button>
        </div>
      </div>

      {/* Transfer Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['All Transfers', 'Draft', 'In-Transit', 'Received'].map((st, i) => {
          const count = st === 'All Transfers' 
            ? transfers.length 
            : transfers.filter(t => t.status === st).length;

          return (
            <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">{st}</div>
                <div className="text-xl font-bold font-mono text-white mt-0.5">{count}</div>
              </div>
              <Truck className="w-6 h-6 text-amber-400/40" />
            </div>
          );
        })}
      </div>

      {/* Transfers List */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto p-5 space-y-4 shadow-xl">
        <div className="font-bold text-white text-sm">Active & Historical Store Transfer Notes</div>

        <div className="space-y-3">
          {transfers.map(t => {
            const srcStore = stores.find(s => s.id === t.fromStoreId)?.name || t.fromStoreId;
            const destStore = stores.find(s => s.id === t.toStoreId)?.name || t.toStoreId;

            return (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm font-mono">{t.stnNo}</div>
                      <div className="text-[11px] text-slate-400">Date: {t.date} · Vehicle: {t.vehicleNo}</div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-200">{srcStore}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-emerald-300">{destStore}</span>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      t.status === 'Received'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                    }`}>
                      {t.status}
                    </span>

                    <button
                      onClick={() => setPickSlipTransfer(t)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold"
                      title="Generate Warehouse Bin Picker Sheet (FrmBoxIdWisePicSlip)"
                    >
                      <Package className="w-3.5 h-3.5" /> Box Pick Slip
                    </button>

                    {t.status === 'In-Transit' && (
                      <button
                        onClick={() => updateTransferStatus(t.id, 'Received')}
                        className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs shadow-md"
                      >
                        <Check className="w-3.5 h-3.5" /> 1-Click Accept & Inward GTN
                      </button>
                    )}
                  </div>
                </div>

                {/* Items included in STN */}
                <div className="pt-2 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  {t.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-slate-900/60 rounded-lg">
                      <div>
                        <span className="font-medium text-white">{item.name}</span>
                        <span className="text-slate-500 ml-1">({item.size} · {item.color})</span>
                      </div>
                      <span className="font-mono font-bold text-amber-300">{item.qty} pcs</span>
                    </div>
                  ))}
                </div>

                {t.notes && (
                  <div className="text-[10px] text-slate-400 italic">
                    Note: {t.notes} · Dispatched by: {t.dispatchedBy}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE STN MODAL */}
      {newStnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" /> Dispatch New Stock Transfer Note (STN)
            </div>

            <form onSubmit={handleCreateSTN} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">From Location</label>
                  <select
                    value={fromStore}
                    onChange={(e) => setFromStore(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">To Destination</label>
                  <select
                    value={toStore}
                    onChange={(e) => setToStore(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Select Product SKU</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku}) - {p.size}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    min={1}
                    value={transferQty}
                    onChange={(e) => setTransferQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Transport Vehicle No</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dispatch Remarks</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewStnModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  Dispatch STN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pickSlipTransfer && (
        <BoxPickSlipModal
          transfer={pickSlipTransfer}
          onClose={() => setPickSlipTransfer(null)}
        />
      )}

      {replenishmentModalOpen && (
        <SmartReplenishmentModal onClose={() => setReplenishmentModalOpen(false)} />
      )}
    </div>
  );
};
