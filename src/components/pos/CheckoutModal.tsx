import React, { useState, useEffect } from 'react';
import { Customer, TenderSplit, Store } from '../../types';
import { 
  CreditCard, Smartphone, Banknote, Gift, 
  Award, CheckCircle2, ArrowRight, X, Sparkles, QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  totalPayable: number;
  customer: Customer | null;
  store: Store;
  onClose: () => void;
  onComplete: (tenders: TenderSplit) => void;
}

export const CheckoutModal: React.FC<Props> = ({ totalPayable, customer, store, onClose, onComplete }) => {
  const [tenders, setTenders] = useState<TenderSplit>({
    cash: 0,
    creditCard: 0,
    upi: 0,
    loyaltyRedemption: 0,
    creditNote: 0,
    advanceAdjustment: 0,
  });

  const [activeTab, setActiveTab] = useState<'cash' | 'upi' | 'card' | 'loyalty' | 'split'>('cash');
  const [cashTendered, setCashTendered] = useState<number>(totalPayable);
  const [upiRefNo, setUpiRefNo] = useState('UPI-' + Math.floor(100000 + Math.random() * 900000));
  const [upiScanned, setUpiScanned] = useState(false);

  // Set default tender based on activeTab
  useEffect(() => {
    if (activeTab === 'cash') {
      setTenders({ cash: totalPayable, creditCard: 0, upi: 0, loyaltyRedemption: 0, creditNote: 0, advanceAdjustment: 0 });
      setCashTendered(totalPayable);
    } else if (activeTab === 'upi') {
      setTenders({ cash: 0, creditCard: 0, upi: totalPayable, loyaltyRedemption: 0, creditNote: 0, advanceAdjustment: 0 });
    } else if (activeTab === 'card') {
      setTenders({ cash: 0, creditCard: totalPayable, upi: 0, loyaltyRedemption: 0, creditNote: 0, advanceAdjustment: 0 });
    }
  }, [activeTab, totalPayable]);

  const totalAllocated = tenders.cash + tenders.creditCard + tenders.upi + tenders.loyaltyRedemption + tenders.creditNote + tenders.advanceAdjustment;
  const remaining = totalPayable - totalAllocated;
  const changeToReturn = Math.max(0, cashTendered - tenders.cash);

  const handleFinish = () => {
    if (Math.abs(remaining) > 0.5) {
      alert(`Please allocate the full bill amount. Remaining: ₹${remaining.toFixed(2)}`);
      return;
    }

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    onComplete(tenders);
  };

  const setExactAmount = (method: keyof TenderSplit) => {
    setTenders(prev => ({
      ...prev,
      [method]: prev[method] + remaining
    }));
  };

  const handleSimulateUpiPayment = () => {
    setUpiScanned(true);
    setTenders(prev => ({ ...prev, upi: totalPayable, cash: 0, creditCard: 0 }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Multi-Tender Settlement</div>
            <div className="text-xl font-extrabold text-white">
              Total Due: <span className="text-emerald-400 font-mono">₹{totalPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Methods Nav */}
        <div className="grid grid-cols-5 p-2 bg-slate-950 border-b border-slate-800 gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('cash')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl font-medium transition-all ${
              activeTab === 'cash' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Banknote className="w-4 h-4" /> Cash (F1)
          </button>
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl font-medium transition-all ${
              activeTab === 'upi' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" /> UPI QR (F2)
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl font-medium transition-all ${
              activeTab === 'card' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Card (F3)
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl font-medium transition-all ${
              activeTab === 'loyalty' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" /> Loyalty
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl font-medium transition-all ${
              activeTab === 'split' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-4 h-4" /> Split Tender
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5 flex-1 min-h-[280px]">
          {/* CASH TAB */}
          {activeTab === 'cash' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bill Amount to Cash</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono">₹</span>
                    <input
                      type="number"
                      value={tenders.cash}
                      onChange={(e) => setTenders({ ...tenders, cash: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-base focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cash Tendered by Customer</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono">₹</span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-base focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Cash Presets */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Quick Denominations:</span>
                {[500, 1000, 2000, 5000, 10000].map(val => (
                  <button
                    key={val}
                    onClick={() => setCashTendered(val)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors"
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              {/* Change Return Box */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-300 font-medium">Change to Return to Customer</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    ₹{changeToReturn.toLocaleString('en-IN')}
                  </div>
                </div>
                <Banknote className="w-8 h-8 text-emerald-400/40" />
              </div>
            </div>
          )}

          {/* UPI QR TAB */}
          {activeTab === 'upi' && (
            <div className="flex items-center gap-6 p-2 animate-in fade-in">
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-300 flex flex-col items-center">
                <div className="w-40 h-40 bg-slate-100 flex items-center justify-center rounded-lg border border-slate-200">
                  <QrCode className="w-32 h-32 text-slate-900" />
                </div>
                <div className="text-[10px] text-slate-700 font-mono mt-1 font-bold">
                  {store.gstin} · UPI PAY
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <div className="text-xs text-slate-400">Scan via GPay, PhonePe, Paytm, BHIM</div>
                  <div className="text-2xl font-extrabold text-purple-300 font-mono mt-0.5">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-slate-400">UPI Ref: <span className="text-slate-200">{upiRefNo}</span></div>
                  <div className="text-slate-400">Merchant: <span className="text-slate-200">{store.name}</span></div>
                  <div className="text-slate-400">Status: <span className={upiScanned ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {upiScanned ? '🟢 Payment Captured' : '🟡 Awaiting Customer Scan'}
                  </span></div>
                </div>

                {!upiScanned ? (
                  <button
                    onClick={handleSimulateUpiPayment}
                    className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" /> Simulate Instant UPI Success
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> UPI Payment Confirmed via Webhook
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CARD TAB */}
          {activeTab === 'card' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-300 font-medium">Swipe/Dip/Tap on EDC Terminal</div>
                  <div className="text-2xl font-black font-mono text-blue-400">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </div>
                </div>
                <CreditCard className="w-8 h-8 text-blue-400/40" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Card Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4819"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Approval Code / Auth No</label>
                  <input
                    type="text"
                    placeholder="e.g. 981240"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* LOYALTY & DISCOUNTS */}
          {activeTab === 'loyalty' && (
            <div className="space-y-4 animate-in fade-in">
              {customer ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{customer.name}</div>
                      <div className="text-xs text-slate-400">{customer.phone} · {customer.tier}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-amber-400 font-semibold">Available Points</div>
                      <div className="text-lg font-bold font-mono text-amber-300">{customer.loyaltyPoints} pts (₹{customer.loyaltyPoints})</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const redeemable = Math.min(customer.loyaltyPoints, totalPayable);
                      setTenders({ ...tenders, loyaltyRedemption: redeemable, cash: totalPayable - redeemable });
                    }}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Redeem Max Points (₹{Math.min(customer.loyaltyPoints, totalPayable)})
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No customer selected on this bill. Attach a customer in POS to redeem points.
                </div>
              )}
            </div>
          )}

          {/* SPLIT TENDER TAB */}
          {activeTab === 'split' && (
            <div className="grid grid-cols-2 gap-3 text-xs animate-in fade-in">
              <div>
                <label className="block text-slate-400 mb-1">Cash Tender</label>
                <input
                  type="number"
                  value={tenders.cash}
                  onChange={(e) => setTenders({ ...tenders, cash: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">UPI / QR Code</label>
                <input
                  type="number"
                  value={tenders.upi}
                  onChange={(e) => setTenders({ ...tenders, upi: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Credit / Debit Card</label>
                <input
                  type="number"
                  value={tenders.creditCard}
                  onChange={(e) => setTenders({ ...tenders, creditCard: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Credit Note / Gift Card</label>
                <input
                  type="number"
                  value={tenders.creditNote}
                  onChange={(e) => setTenders({ ...tenders, creditNote: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Action */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Allocated / Due</div>
            <div className="text-sm font-bold font-mono">
              <span className="text-white">₹{totalAllocated}</span>
              <span className="text-slate-500"> / </span>
              <span className="text-emerald-400">₹{totalPayable}</span>
              {remaining > 0 && <span className="text-rose-400 ml-2 text-xs">(₹{remaining} remaining)</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel (ESC)
            </button>
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" /> Complete Sale & Print Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
