import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdvanceBooking } from '../../types';
import { 
  BookmarkCheck, Plus, Calendar, Clock, DollarSign, 
  User, Phone, Scissors, CheckCircle2, X 
} from 'lucide-react';

interface AdvanceBookingModalProps {
  onClose: () => void;
  onApplyAdvanceToPOS?: (booking: AdvanceBooking) => void;
}

export const AdvanceBookingModal: React.FC<AdvanceBookingModalProps> = ({ onClose, onApplyAdvanceToPOS }) => {
  const { currentStore, customers, showToast } = useApp();

  const [bookings, setBookings] = useState<AdvanceBooking[]>([
    {
      id: 'adv-01',
      bookingNo: 'ADV/ZIR/2026/092',
      date: '2026-08-10',
      expectedDeliveryDate: '2026-08-25',
      trialDate: '2026-08-20',
      customerName: 'Harpreet Singh Sandhu',
      customerPhone: '9876543210',
      storeId: 'zirakpur_hq',
      productName: 'Custom Imperial Heritage Sherwani & Turban Set',
      measurementNotes: 'Chest 42, Shoulder 18.5, Sleeve 25, Waist 36. Double layer inner lining.',
      totalOrderValue: 28000,
      advanceDeposited: 10000,
      balanceRemaining: 18000,
      tenderType: 'UPI',
      status: 'In Production'
    },
    {
      id: 'adv-02',
      bookingNo: 'ADV/DAL/2026/033',
      date: '2026-08-12',
      expectedDeliveryDate: '2026-08-22',
      trialDate: '2026-08-18',
      customerName: 'Mrs. Simran Kaur Gill',
      customerPhone: '9816029384',
      storeId: 'dalhousie_store',
      productName: 'Pure Raw Silk Bridal Lehenga with Hand Zardozi',
      measurementNotes: 'Blouse 36, Lehenga Length 42, Waist 32. Heavy latkan tassels requested.',
      totalOrderValue: 45000,
      advanceDeposited: 20000,
      balanceRemaining: 25000,
      tenderType: 'Card',
      status: 'Trial Ready'
    }
  ]);

  const [createMode, setCreateMode] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [orderValue, setOrderValue] = useState(15000);
  const [deposit, setDeposit] = useState(5000);
  const [tenderType, setTenderType] = useState<'Cash' | 'UPI' | 'Card'>('UPI');
  const [trialDate, setTrialDate] = useState('2026-08-22');
  const [deliveryDate, setDeliveryDate] = useState('2026-08-28');
  const [measurements, setMeasurements] = useState('');

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !productName) return;

    const newBooking: AdvanceBooking = {
      id: 'adv-' + Date.now(),
      bookingNo: `ADV/${currentStore.code}/${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: deliveryDate,
      trialDate,
      customerName: custName,
      customerPhone: custPhone || '9876543210',
      storeId: currentStore.id,
      productName,
      measurementNotes: measurements,
      totalOrderValue: Number(orderValue),
      advanceDeposited: Number(deposit),
      balanceRemaining: Number(orderValue) - Number(deposit),
      tenderType,
      status: 'Booked'
    };

    setBookings([newBooking, ...bookings]);
    setCreateMode(false);
    showToast('Advance Booking Registered', `${newBooking.bookingNo} with ₹${deposit} deposit.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Customer Advance Bookings & Layaway Drawer</h2>
              <p className="text-xs text-slate-400">Manage bespoke orders, bridal tokens, trial dates & balance adjustments (IkapVouc AdvanceVoucherPop)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {!createMode ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Active Bookings ({bookings.length})</span>
                <button
                  onClick={() => setCreateMode(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md"
                >
                  <Plus className="w-4 h-4" /> New Advance Booking
                </button>
              </div>

              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-sm font-mono">{b.bookingNo}</div>
                        <div className="text-slate-400 text-[11px]">
                          Customer: <strong className="text-slate-200">{b.customerName}</strong> ({b.customerPhone})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          b.status === 'Trial Ready'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {b.status}
                        </span>

                        {onApplyAdvanceToPOS && (
                          <button
                            onClick={() => {
                              onApplyAdvanceToPOS(b);
                              onClose();
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                          >
                            Apply Advance to Bill
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 rounded-xl">
                      <div className="font-semibold text-white">{b.productName}</div>
                      <div className="text-[10px] text-slate-400 italic mt-0.5">{b.measurementNotes}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-900 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-500 text-[10px] block font-sans">Total Order</span>
                        <span className="font-bold text-white">₹{b.totalOrderValue.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-sans">Advance Paid ({b.tenderType})</span>
                        <span className="font-bold text-emerald-400">₹{b.advanceDeposited.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-sans">Balance Due</span>
                        <span className="font-bold text-rose-400">₹{b.balanceRemaining.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-sans">Trial Date</span>
                        <span className="text-amber-300">{b.trialDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurpreet Singh"
                    value={custName}
                    onChange={e => setCustName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="10-digit number"
                    value={custPhone}
                    onChange={e => setCustPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Bespoke / Bridal Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Silk Sherwani + Turban & Stole"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Total Order Value (₹)</label>
                  <input
                    type="number"
                    value={orderValue}
                    onChange={e => setOrderValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Advance Token (₹)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={e => setDeposit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Tender</label>
                  <select
                    value={tenderType}
                    onChange={e => setTenderType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="UPI">UPI QR Scan</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Trial Date</label>
                  <input
                    type="date"
                    value={trialDate}
                    onChange={e => setTrialDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Final Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Measurements & Styling Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Chest, Shoulder, Sleeve, Waist, Hem Length, Special embroidery notes"
                  value={measurements}
                  onChange={e => setMeasurements(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateMode(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  Save Advance Token Booking
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
