import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrder } from '../../types';
import { 
  ShoppingBag, Plus, Barcode, CheckCircle2, 
  Clock, ArrowRight, Truck, FileSpreadsheet, Scan, Check
} from 'lucide-react';

export const PurchasesHub: React.FC = () => {
  const { currentStore, showToast } = useApp();

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'po-101',
      poNo: 'PO/26-27/0118',
      date: '2026-08-10',
      expectedDate: '2026-08-18',
      vendorName: 'Surat Silk Mills Pvt. Ltd.',
      vendorGstin: '24AABCS9821K1ZN',
      storeId: 'zirakpur_godown',
      items: [
        {
          description: 'Pure Kanchipuram Brocade Weft (Sky Blue)',
          hsn: '5007',
          fabric: 'Mulberry Silk',
          size: '50 Meters Roll',
          quantity: 50,
          rate: 620,
          total: 31000
        },
        {
          description: 'Raw Banarasi Georgette Thaan (Rose Gold)',
          hsn: '5007',
          fabric: 'Georgette Silk',
          size: '40 Meters Roll',
          quantity: 40,
          rate: 850,
          total: 34000
        }
      ],
      totalAmount: 65000,
      status: 'Sent to Vendor'
    },
    {
      id: 'po-102',
      poNo: 'PO/26-27/0119',
      date: '2026-08-12',
      expectedDate: '2026-08-19',
      vendorName: 'Ludhiana Woolens & Tweed Mills',
      vendorGstin: '03AAACL5129F1ZK',
      storeId: 'zirakpur_godown',
      items: [
        {
          description: 'Mens Heavy Herringbone Tweed Fabric (Charcoal)',
          hsn: '5112',
          fabric: 'Wool Tweed 80/20',
          size: '80 Meters Thaan',
          quantity: 80,
          rate: 980,
          total: 78400
        }
      ],
      totalAmount: 78400,
      status: 'Partially Received'
    }
  ]);

  const [newPoModal, setNewPoModal] = useState(false);
  const [vendorName, setVendorName] = useState('Luthra Textiles & Shirting');
  const [vendorGstin, setVendorGstin] = useState('03AABCL4419P1ZL');
  const [itemDesc, setItemDesc] = useState('Egyptian Giza Cotton Thaan (Sky Blue)');
  const [qty, setQty] = useState(100);
  const [rate, setRate] = useState(380);

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const newPO: PurchaseOrder = {
      id: 'po-' + Date.now(),
      poNo: `PO/26-27/${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      expectedDate: '2026-08-25',
      vendorName,
      vendorGstin,
      storeId: currentStore.id,
      items: [
        {
          description: itemDesc,
          hsn: '5208',
          fabric: '100% Giza Cotton',
          size: 'Per Metre',
          quantity: Number(qty),
          rate: Number(rate),
          total: Number(qty) * Number(rate)
        }
      ],
      totalAmount: Number(qty) * Number(rate),
      status: 'Sent to Vendor'
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setNewPoModal(false);
    showToast('Purchase Order Generated', `${newPO.poNo} sent to ${vendorName}`, 'success');
  };

  const handleInwardGRN = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => po.id === poId ? { ...po, status: 'Completed' } : po));
    showToast('Inward GRN Verified', `Stock added to Central Godown with barcode generation.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-teal-400" /> Vendor Purchase Orders & Inward Goods (GRN)
          </div>
          <h1 className="text-2xl font-extrabold text-white">Purchase Orders & Inward Scanning Hub</h1>
        </div>

        <button
          onClick={() => setNewPoModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Purchase Order (PO)
        </button>
      </div>

      {/* PO List */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto p-5 space-y-4 shadow-xl">
        <div className="font-bold text-white text-sm">Active Vendor Purchase Orders & GRN Receiving</div>

        <div className="space-y-3">
          {purchaseOrders.map(po => (
            <div key={po.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm font-mono">{po.poNo}</div>
                    <div className="text-[11px] text-slate-400">
                      Vendor: <strong className="text-slate-200">{po.vendorName}</strong> (GSTIN: {po.vendorGstin}) · Date: {po.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    po.status === 'Completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : po.status === 'Sent to Vendor'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800 animate-pulse'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {po.status}
                  </span>

                  {po.status !== 'Completed' && (
                    <button
                      onClick={() => handleInwardGRN(po.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs shadow-md"
                    >
                      <Scan className="w-3.5 h-3.5" /> Inward Scan & Generate Barcodes
                    </button>
                  )}
                </div>
              </div>

              {/* Items in PO */}
              <div className="pt-2 border-t border-slate-900 divide-y divide-slate-900">
                {po.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center text-[11px]">
                    <div>
                      <div className="font-semibold text-white">{it.description}</div>
                      <div className="text-[10px] text-slate-400 font-mono">HSN: {it.hsn} · Fabric: {it.fabric} ({it.size})</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-emerald-400">₹{it.total.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-500">{it.quantity} units @ ₹{it.rate}/unit</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <div>Expected Inward Delivery: <strong className="text-teal-300">{po.expectedDate}</strong></div>
                <div>Total Order Value: <strong className="text-white font-mono text-xs">₹{po.totalAmount.toLocaleString('en-IN')}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE PO MODAL */}
      {newPoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-teal-400" /> Create Vendor Purchase Order (PO)
            </div>

            <form onSubmit={handleCreatePo} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Vendor GSTIN</label>
                  <input
                    type="text"
                    required
                    value={vendorGstin}
                    onChange={(e) => setVendorGstin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Item Description & Fabric</label>
                <input
                  type="text"
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Order Quantity (Rolls/Units)</label>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Purchase Rate (₹/unit)</label>
                  <input
                    type="number"
                    min={1}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewPoModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Dispatch Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
