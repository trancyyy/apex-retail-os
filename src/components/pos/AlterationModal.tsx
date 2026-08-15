import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scissors, Calendar, User, Phone, X, CheckCircle } from 'lucide-react';
import { CartItem } from '../../types';

interface Props {
  item: CartItem;
  onClose: () => void;
}

export const AlterationModal: React.FC<Props> = ({ item, onClose }) => {
  const { selectedCustomer, addAlteration, showToast } = useApp();

  const [customerName, setCustomerName] = useState(selectedCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(selectedCustomer?.phone || '');
  const [tailorName, setTailorName] = useState('Master Ji (Mohd. Rafiq)');
  const [lengthAdjustment, setLengthAdjustment] = useState('');
  const [waistAdjustment, setWaistAdjustment] = useState('');
  const [chestAdjustment, setChestAdjustment] = useState('');
  const [sleeveAdjustment, setSleeveAdjustment] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [trialDate, setTrialDate] = useState('2026-08-18');
  const [deliveryDate, setDeliveryDate] = useState('2026-08-19');

  const handleSave = () => {
    if (!customerName || !customerPhone) {
      alert('Please provide customer name and phone number');
      return;
    }

    addAlteration({
      invoiceNo: 'PENDING-SALE',
      customerName,
      customerPhone,
      productName: `${item.product.name} (${item.product.size})`,
      instructions: {
        lengthAdjustment,
        waistAdjustment,
        chestAdjustment,
        sleeveAdjustment,
        specialNotes
      },
      tailorName,
      trialDate,
      deliveryDate,
      status: 'Received',
      charge: 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-sm font-bold text-white">Custom Tailoring & Alteration Slip</div>
              <div className="text-[11px] text-slate-400">{item.product.name} ({item.product.size})</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Customer Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <div className="font-semibold text-slate-300">Alteration Measurements & Instructions</div>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Length (e.g. -1.5 inch)"
                value={lengthAdjustment}
                onChange={(e) => setLengthAdjustment(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Waist / Hem (e.g. In 1 inch)"
                value={waistAdjustment}
                onChange={(e) => setWaistAdjustment(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Chest / Fitting"
                value={chestAdjustment}
                onChange={(e) => setChestAdjustment(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Sleeves Adjustment"
                value={sleeveAdjustment}
                onChange={(e) => setSleeveAdjustment(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Special tailoring instructions for master..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-400 mb-1">Tailor / Master</label>
              <select
                value={tailorName}
                onChange={(e) => setTailorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white"
              >
                <option>Master Ji (Mohd. Rafiq)</option>
                <option>Master Suresh (Suits)</option>
                <option>Karigar Akhtar (Lehenga/Zari)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Trial Date</label>
              <input
                type="date"
                value={trialDate}
                onChange={(e) => setTrialDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white"
              />
            </div>
          </div>
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
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20"
          >
            <CheckCircle className="w-4 h-4" /> Generate Alteration Slip
          </button>
        </div>
      </div>
    </div>
  );
};
