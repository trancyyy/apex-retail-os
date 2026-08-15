import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShoppingBag, Sparkles, CheckCircle2, QrCode, ShieldCheck, 
  Tag, Percent, ArrowRight, X, Monitor, Heart, Star
} from 'lucide-react';

export const CustomerFacingDisplay: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { cartItems, currentStore, selectedCustomer, appliedScheme } = useApp();

  const [upiSimulatedPaid, setUpiSimulatedPaid] = useState(false);

  // Calculate bill totals
  const grossTotal = cartItems.reduce((acc, item) => acc + (item.product.mrp * item.quantity), 0);
  const itemTotalAfterDiscount = cartItems.reduce((acc, item) => {
    const itemDiscount = item.customDiscountAmount || ((item.product.mrp - item.product.salePrice) * item.quantity);
    return acc + (item.product.mrp * item.quantity - itemDiscount);
  }, 0);

  const totalDiscount = grossTotal - itemTotalAfterDiscount;

  let schemeDiscount = 0;
  if (appliedScheme) {
    if (appliedScheme.type === 'FLAT_OFF' && appliedScheme.discountAmount) {
      schemeDiscount = appliedScheme.discountAmount;
    } else if (appliedScheme.type === 'SLAB' && appliedScheme.discountPercent) {
      schemeDiscount = (itemTotalAfterDiscount * appliedScheme.discountPercent) / 100;
    }
  }

  const netPayable = Math.max(0, Math.round(itemTotalAfterDiscount - schemeDiscount));
  const totalSavings = totalDiscount + schemeDiscount;

  const upiPayload = `upi://pay?pa=emerge.retail@hdfcbank&pn=Emerge%20Retail%20Pvt%20Ltd&am=${netPayable}&cu=INR&tn=Invoice%20Checkout`;

  return (
    <div className="fixed inset-0 bg-[#030712] z-50 flex flex-col text-slate-100 font-sans select-none overflow-hidden animate-in fade-in duration-200">
      {/* CFD Top Header */}
      <header className="h-20 bg-slate-950/90 border-b border-white/[0.1] px-8 flex items-center justify-between backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-xl shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-white text-xl">
              E
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              EMERGE RETAIL
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {currentStore.name}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Customer Experience Terminal · GSTIN: {currentStore.gstin}
            </div>
          </div>
        </div>

        {/* Customer Welcome Pill or Close */}
        <div className="flex items-center gap-4">
          {selectedCustomer ? (
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-500/30 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold border border-amber-500/30">
                {selectedCustomer.name[0]}
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  Welcome, {selectedCustomer.name}
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-mono font-bold">
                    {selectedCustomer.tier}
                  </span>
                </div>
                <div className="text-[10px] text-amber-400/90 font-mono">
                  {selectedCustomer.loyaltyPoints} Reward Points Available
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-white/[0.08] text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Ask Cashier for Loyalty Membership</span>
            </div>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-400 hover:text-white transition-all tactile-btn"
              title="Close Customer Facing Display"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main CFD Body */}
      {cartItems.length === 0 ? (
        /* Idle Lookbook Slideshow Mode */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-950 via-[#050b18] to-slate-950 relative overflow-hidden">
          {/* Ambient Lighting Circles */}
          <div className="absolute w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none top-1/4" />
          
          <div className="max-w-2xl space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono">
              <Star className="w-3.5 h-3.5 fill-blue-400 text-blue-400" /> AUTUMN / WEDDING COLLECTION 2026
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Bespoke Tailoring & Luxury Ethnic Apparel
            </h1>
            
            <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              Handcrafted bandhgalas, artisanal silk kurtas, and precision-fitted formal suits. 
              Ask our stylists for complementary custom alteration services.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6 max-w-lg mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] text-center space-y-1 backdrop-blur-md">
                <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[11px] text-slate-400 font-medium">Pure Silk & Linen</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] text-center space-y-1 backdrop-blur-md">
                <div className="text-2xl font-black text-blue-400 font-mono">Free</div>
                <div className="text-[11px] text-slate-400 font-medium">Master Alterations</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] text-center space-y-1 backdrop-blur-md">
                <div className="text-2xl font-black text-amber-400 font-mono">5%</div>
                <div className="text-[11px] text-slate-400 font-medium">VIP Cashback Points</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Billing Live Checkout Mode */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Area: Live Scanned Line Items */}
          <div className="flex-1 flex flex-col border-r border-white/[0.1] bg-slate-950/60 overflow-hidden">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-900/50">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Your Selection ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Real-Time Scanner Sync Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-between shadow-lg transition-all animate-in slide-in-from-left-4 duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/[0.08] flex items-center justify-center text-sm font-bold text-slate-300 font-mono">
                      {item.product.size}
                    </div>
                    <div>
                      <div className="text-base font-bold text-white font-sans">{item.product.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        {item.product.color} · {item.product.fabric} · SKU: {item.product.sku}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-mono">Qty: {item.quantity} × ₹{item.product.salePrice.toLocaleString('en-IN')}</div>
                    <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                      ₹{(item.product.salePrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                    {item.product.mrp > item.product.salePrice && (
                      <div className="text-xs text-slate-500 line-through font-mono">
                        MRP ₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Savings Callout Banner */}
            {totalSavings > 0 && (
              <div className="p-4 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border-t border-emerald-500/30 flex items-center justify-between px-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-wider">Store Promo Savings Applied</div>
                    <div className="text-xs text-emerald-300">You are saving a total of ₹{totalSavings.toLocaleString('en-IN')} on this bill!</div>
                  </div>
                </div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  -₹{totalSavings.toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>

          {/* Right Area: Dynamic UPI QR Code & Total Net Payable */}
          <div className="w-[440px] bg-slate-900/90 flex flex-col justify-between p-8 backdrop-blur-2xl">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                  Instant Contactless Payment
                </div>
                <h3 className="text-xl font-black text-white">Scan UPI QR to Settle</h3>
              </div>

              {/* Dynamic QR Code Card */}
              <div className="p-6 rounded-3xl bg-white text-slate-950 flex flex-col items-center justify-center shadow-2xl space-y-4">
                <QRCodeSVG
                  value={upiPayload}
                  size={190}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/vite.svg",
                    x: undefined,
                    y: undefined,
                    height: 28,
                    width: 28,
                    excavate: true,
                  }}
                />

                <div className="text-center">
                  <div className="text-2xl font-black font-mono text-slate-950">
                    ₹{netPayable.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                    Scan with GPay · PhonePe · Paytm · BHIM UPI
                  </div>
                </div>
              </div>

              {/* UPI Logos & Security Verification */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>NPCI 256-Bit Encrypted</span>
                </div>
                <span className="font-mono text-slate-300 text-[11px]">VPA: emerge.retail@hdfc</span>
              </div>
            </div>

            {/* Total Net Payable Footer */}
            <div className="pt-6 border-t border-white/[0.1] space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Gross Total</span>
                  <span className="font-mono text-slate-200">₹{grossTotal.toLocaleString('en-IN')}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discounts</span>
                    <span className="font-mono">-₹{totalDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {schemeDiscount > 0 && (
                  <div className="flex justify-between text-blue-400">
                    <span>Scheme Discount</span>
                    <span className="font-mono">-₹{schemeDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950 to-slate-900 border border-emerald-500/30 flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    Final Net Payable
                  </div>
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    ₹{netPayable.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                  Exact Amount
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
