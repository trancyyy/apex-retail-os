import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ApparelCategory, SaleInvoice, TenderSplit, CartItem, AdvanceBooking } from '../../types';
import { 
  Barcode, Search, Plus, Minus, Trash2, Scissors, 
  UserPlus, UserCheck, Tag, Zap, CreditCard, ShoppingCart, 
  Sparkles, Check, ArrowRight, ShieldCheck, BookmarkCheck, Ruler, Monitor, Globe2
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import { ThermalReceiptModal } from './ThermalReceiptModal';
import { AlterationModal } from './AlterationModal';
import { AdvanceBookingModal } from './AdvanceBookingModal';
import { FabricCalculatorModal } from './FabricCalculatorModal';
import { CustomerFacingDisplay } from './CustomerFacingDisplay';
import { AiStylistModal } from './AiStylistModal';
import { EndlessAisleModal } from './EndlessAisleModal';
import { sounds } from '../../utils/audio';

export const PosTerminal: React.FC = () => {
  const { 
    products, currentStoreId, currentStore,
    cartItems, addToCart, removeFromCart, updateCartQty, updateCartDiscount, clearCart,
    customers, selectedCustomer, setSelectedCustomer,
    appliedScheme, setAppliedScheme, schemes,
    completeSale, showToast, cashierName
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<SaleInvoice | null>(null);
  const [alterationItem, setAlterationItem] = useState<CartItem | null>(null);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [fabricModalOpen, setFabricModalOpen] = useState(false);
  const [appliedAdvance, setAppliedAdvance] = useState<AdvanceBooking | null>(null);
  const [scanFlash, setScanFlash] = useState(false);
  const [cfdModalOpen, setCfdModalOpen] = useState(false);
  const [stylistModalOpen, setStylistModalOpen] = useState(false);
  const [endlessAisleModalOpen, setEndlessAisleModalOpen] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus barcode input on load
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F4' && cartItems.length > 0) {
        e.preventDefault();
        setCheckoutModalOpen(true);
        sounds.playTapClick();
      }
      if (e.key === 'F1' && cartItems.length > 0) {
        e.preventDefault();
        handleQuickCashCheckout();
      }
      if (e.key === 'F9') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        setCustomerSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems]);

  // Handle barcode or product search submit
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    let qty = 1;
    let code = query;
    if (query.includes('*')) {
      const parts = query.split('*');
      qty = parseInt(parts[0]) || 1;
      code = parts[1].trim();
    }

    const matched = products.find(p => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase());
    if (matched) {
      addToCart(matched, qty);
      sounds.playScanBeep();
      setScanFlash(true);
      setTimeout(() => setScanFlash(false), 400);
      setSearchQuery('');
    } else {
      showToast('Item Not Found', `No product with barcode/SKU "${code}"`, 'warning');
    }
  };

  const handleProductCardClick = (p: Product) => {
    addToCart(p);
    sounds.playTapClick();
  };

  // Filter products by category and search
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchesCat && matchesSearch && p.active;
  });

  // Calculate bill totals
  const grossTotal = cartItems.reduce((acc, item) => acc + (item.product.mrp * item.quantity), 0);
  const itemTotalAfterDiscount = cartItems.reduce((acc, item) => {
    const itemDiscount = item.customDiscountAmount || ((item.product.mrp - item.product.salePrice) * item.quantity);
    return acc + (item.product.mrp * item.quantity - itemDiscount);
  }, 0);

  const itemDiscountTotal = grossTotal - itemTotalAfterDiscount;

  // Apply schemes
  let schemeDiscount = 0;
  if (appliedScheme) {
    if (appliedScheme.type === 'FLAT_OFF' && appliedScheme.discountAmount) {
      schemeDiscount = appliedScheme.discountAmount;
    } else if (appliedScheme.type === 'SLAB' && appliedScheme.discountPercent) {
      schemeDiscount = (itemTotalAfterDiscount * appliedScheme.discountPercent) / 100;
    }
  }

  const advanceCredited = appliedAdvance ? appliedAdvance.advanceDeposited : 0;
  const netPayable = Math.max(0, Math.round(itemTotalAfterDiscount - schemeDiscount - advanceCredited));

  const gstRates = [5, 12, 18];
  let totalGst = 0;
  gstRates.forEach(rate => {
    const rateItems = cartItems.filter(i => i.product.gstPercent === rate);
    const rateTotal = rateItems.reduce((acc, item) => acc + (item.product.salePrice * item.quantity), 0);
    const taxAmt = rateTotal - (rateTotal / (1 + rate / 100));
    totalGst += taxAmt;
  });

  const taxableTotal = Math.round(netPayable - totalGst);
  const cgstTotal = Math.round(totalGst / 2);
  const sgstTotal = Math.round(totalGst / 2);

  const handleCheckoutComplete = (tenders: TenderSplit) => {
    const invoiceData: Omit<SaleInvoice, 'id'> = {
      invoiceNo: `EM/${currentStore.code}/26-27/${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      storeId: currentStoreId,
      cashierName,
      customer: selectedCustomer || undefined,
      advanceBookingId: appliedAdvance?.id,
      items: cartItems.map(item => ({
        sku: item.product.sku,
        name: item.product.name,
        size: item.product.size,
        color: item.product.color,
        qty: item.quantity,
        meterLength: item.meterLength,
        mrp: item.product.mrp,
        price: item.product.salePrice,
        discount: item.customDiscountAmount || 0,
        taxableAmt: Math.round(item.product.salePrice * item.quantity / 1.12),
        cgst: Math.round((item.product.salePrice * item.quantity * 0.06)),
        sgst: Math.round((item.product.salePrice * item.quantity * 0.06)),
        total: item.product.salePrice * item.quantity
      })),
      grossAmount: grossTotal,
      itemDiscountTotal,
      billDiscountAmount: schemeDiscount,
      taxableTotal,
      cgstTotal,
      sgstTotal,
      roundOff: 0,
      netPayable,
      tenders,
      status: 'Completed'
    };

    const saved = completeSale(invoiceData);
    if (tenders.upi > 0) {
      sounds.speakUpiPayment(tenders.upi);
    } else {
      sounds.playCheckoutSuccess();
    }
    setCheckoutModalOpen(false);
    setLastInvoice(saved);
    setAppliedAdvance(null);
  };

  const handleQuickCashCheckout = () => {
    handleCheckoutComplete({
      cash: netPayable,
      creditCard: 0,
      upi: 0,
      loyaltyRedemption: 0,
      creditNote: 0,
      advanceAdjustment: advanceCredited
    });
  };

  const categories = ['All', 'Mens Ethnic', 'Mens Casual', 'Womens Ethnic', 'Fabrics', 'Accessories'];

  return (
    <div className={`flex-1 flex overflow-hidden bg-[#f3f3f3] dark:bg-[#030712] ${scanFlash ? 'scan-flash-effect' : ''}`}>
      {/* LEFT AREA: Search, Category Bar & Product Quick Grid */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-[#e0e0e0] dark:border-white/[0.08]">
        {/* Top Barcode Input & Scanner Bar */}
        <div className="p-3.5 bg-white dark:bg-slate-950/70 border-b border-[#e0e0e0] dark:border-white/[0.08] backdrop-blur-xl flex items-center gap-3">
          <form onSubmit={handleBarcodeSubmit} className="flex-1 relative">
            <div className="absolute left-3.5 top-2.5 flex items-center gap-2 pointer-events-none text-slate-400">
              <Barcode className="w-5 h-5 text-emerald-500" />
            </div>
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Scan Barcode or Type SKU / Name (e.g. 8901234001018 or 'Sherwani')... Press Enter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f3f3f3] dark:bg-slate-900/90 border border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl pl-11 pr-24 py-2.5 text-sm text-[#1c1c1c] dark:text-white placeholder-slate-400 focus:border-[#0078d4] focus:outline-none shadow-inner"
            />
            <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-black/5 dark:bg-slate-800 rounded-lg border border-[#e0e0e0] dark:border-white/[0.1] shadow-xs">
                F9
              </kbd>
            </div>
          </form>

          {/* Quick Tools: Endless Aisle, AI Stylist, Fabric Cut, Advance Token & CFD Display */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEndlessAisleModalOpen(true);
                sounds.playTapClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl text-xs font-bold whitespace-nowrap transition-all tactile-btn"
              title="Endless Aisle — Omnichannel 5-Store Stock Fulfillment"
            >
              <Globe2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" /> Endless Aisle
            </button>
            <button
              type="button"
              onClick={() => {
                setStylistModalOpen(true);
                sounds.playTapClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-purple-50 dark:bg-purple-600/15 hover:bg-purple-100 dark:hover:bg-purple-600/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 rounded-2xl text-xs font-bold whitespace-nowrap transition-all tactile-btn"
              title="AI Wardrobe Stylist & VIP Ensemble Builder"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" /> AI Stylist
            </button>
            <button
              type="button"
              onClick={() => {
                setFabricModalOpen(true);
                sounds.playTapClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-sky-50 dark:bg-sky-600/15 hover:bg-sky-100 dark:hover:bg-sky-600/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 rounded-2xl text-xs font-bold whitespace-nowrap transition-all tactile-btn"
              title="Metered Fabric Cutting Calculator (FrmCarpetCalc)"
            >
              <Scissors className="w-3.5 h-3.5" /> Fabric Cut
            </button>
            <button
              type="button"
              onClick={() => {
                setAdvanceModalOpen(true);
                sounds.playTapClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-amber-50 dark:bg-amber-600/15 hover:bg-amber-100 dark:hover:bg-amber-600/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded-2xl text-xs font-bold whitespace-nowrap transition-all tactile-btn"
              title="Customer Advance Bookings & Tokens"
            >
              <Tag className="w-3.5 h-3.5" /> Advance Orders
            </button>
            <button
              type="button"
              onClick={() => {
                setCfdModalOpen(true);
                sounds.playTapClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-blue-50 dark:bg-blue-600/15 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-2xl text-xs font-bold whitespace-nowrap transition-all tactile-btn"
              title="Dual-Screen Customer Facing Display (CFD)"
            >
              <Monitor className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Customer Screen
            </button>
          </div>

          {/* Quick Clear Filter */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-xl"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2.5 bg-slate-950/50 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                sounds.playTapClick();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all tactile-btn ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 content-start">
          {filteredProducts.map((p) => {
            const storeStock = p.stockByStore[currentStoreId] || 0;
            const inCart = cartItems.find(i => i.product.id === p.id);

            return (
              <div
                key={p.id}
                onClick={() => handleProductCardClick(p)}
                className={`group relative glass-card rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer tactile-btn ${
                  inCart 
                    ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 bg-emerald-950/20' 
                    : 'hover:border-white/[0.16]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 font-mono text-[10px] font-bold border border-white/[0.06]">
                      {p.size}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      storeStock > 5 
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' 
                        : storeStock > 0 
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                    }`}>
                      {storeStock} in stock
                    </span>
                  </div>

                  <div className="font-bold text-white text-xs line-clamp-2 group-hover:text-blue-300 transition-colors font-sans">
                    {p.name}
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {p.color} · {p.fabric}
                  </div>
                </div>

                {/* Stock Depth Micro Bar */}
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden my-2 border border-white/[0.04]">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (storeStock / 25) * 100)}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-emerald-400 font-mono">
                      ₹{p.salePrice.toLocaleString('en-IN')}
                    </div>
                    {p.mrp > p.salePrice && (
                      <div className="text-[10px] text-slate-500 line-through font-mono">
                        ₹{p.mrp.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <button className="w-8 h-8 rounded-xl bg-blue-600/20 group-hover:bg-blue-600 text-blue-300 group-hover:text-white flex items-center justify-center transition-all shadow-md">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT AREA: Cart, Customer Attach & Checkout */}
      <div className="w-96 bg-slate-950/90 flex flex-col justify-between shrink-0 shadow-2xl border-l border-white/[0.08] backdrop-blur-2xl">
        {/* Customer Header */}
        <div className="p-3.5 border-b border-white/[0.08] bg-slate-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Active Customer</span>
            {selectedCustomer && (
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-[10px] text-rose-400 hover:underline font-bold"
              >
                Detach
              </button>
            )}
          </div>

          {selectedCustomer ? (
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/[0.1] flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">{selectedCustomer.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{selectedCustomer.phone} · <span className="text-amber-400 font-bold">{selectedCustomer.tier}</span></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-amber-400 font-extrabold font-mono">{selectedCustomer.loyaltyPoints} Pts</div>
                <div className="text-[9px] text-slate-400">₹{selectedCustomer.loyaltyPoints} Wallet</div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setCustomerSearchOpen(!customerSearchOpen);
                  sounds.playTapClick();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] hover:border-white/[0.15] text-xs text-slate-300 transition-all tactile-btn shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  <span>Attach Customer (Loyalty & e-Bill)...</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-lg text-slate-400 border border-white/[0.06]">F2</span>
              </button>

              {customerSearchOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-full bg-slate-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-2xl p-2 z-50 space-y-1 max-h-64 overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-widest">Select Customer:</div>
                  {customers.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerSearchOpen(false);
                        sounds.playTapClick();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs flex justify-between items-center text-slate-200 transition-all"
                    >
                      <div>
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.phone} · {c.city}</div>
                      </div>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">{c.loyaltyPoints} pts</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Applied Advance Token Banner */}
        {appliedAdvance && (
          <div className="px-3.5 py-2 bg-amber-950/40 border-b border-amber-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-amber-300">Advance Applied:</span>
                <span className="text-white ml-1 font-mono font-bold">₹{appliedAdvance.advanceDeposited}</span>
              </div>
            </div>
            <button 
              onClick={() => setAppliedAdvance(null)}
              className="text-[10px] text-rose-400 hover:underline font-bold"
            >
              Remove
            </button>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-3xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-center mb-3">
                <ShoppingCart className="w-8 h-8 text-slate-600" />
              </div>
              <div className="text-sm font-bold text-slate-300">Register Ready</div>
              <div className="text-xs text-slate-500 mt-1 max-w-[200px]">
                Scan a barcode or click any product to initiate transaction.
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="p-3 rounded-2xl bg-slate-900/90 border border-white/[0.08] space-y-2.5 text-xs shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-bold text-white leading-tight">{item.product.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {item.product.size} · {item.product.color} · <span className="text-slate-300">{item.product.sku}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.product.id);
                      sounds.playTapClick();
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-slate-950 border border-white/[0.08] rounded-xl p-0.5">
                    <button
                      onClick={() => {
                        updateCartQty(item.product.id, item.quantity - 1);
                        sounds.playTapClick();
                      }}
                      className="w-6 h-6 flex items-center justify-center text-slate-300 hover:bg-slate-800 rounded-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-mono font-extrabold text-white text-xs">{item.quantity}</span>
                    <button
                      onClick={() => {
                        updateCartQty(item.product.id, item.quantity + 1);
                        sounds.playTapClick();
                      }}
                      className="w-6 h-6 flex items-center justify-center text-slate-300 hover:bg-slate-800 rounded-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Alteration Trigger */}
                  <button
                    onClick={() => {
                      setAlterationItem(item);
                      sounds.playTapClick();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-bold transition-all"
                  >
                    <Scissors className="w-3 h-3 text-amber-400" /> Alteration
                  </button>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="font-extrabold text-white font-mono text-xs">
                      ₹{(item.product.salePrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill Summary & Settlement Dock */}
        <div className="p-4 border-t border-white/[0.08] bg-slate-950 space-y-3">
          {/* Slabs & Scheme selector */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Promotion Scheme:</span>
            <select
              value={appliedScheme?.id || ''}
              onChange={(e) => {
                const s = schemes.find(sch => sch.id === e.target.value);
                setAppliedScheme(s || null);
                sounds.playTapClick();
              }}
              className="bg-slate-900 border border-white/[0.08] text-white rounded-xl px-2.5 py-1 text-[11px] font-medium"
            >
              <option value="">No Active Scheme</option>
              {schemes.map(sch => (
                <option key={sch.id} value={sch.id}>{sch.name}</option>
              ))}
            </select>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-1 text-xs border-t border-white/[0.06] pt-2 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Gross MRP Total</span>
              <span className="font-mono">₹{grossTotal.toLocaleString('en-IN')}</span>
            </div>
            {itemDiscountTotal > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Product Discounts</span>
                <span className="font-mono">-₹{itemDiscountTotal.toLocaleString('en-IN')}</span>
              </div>
            )}
            {schemeDiscount > 0 && (
              <div className="flex justify-between text-blue-400">
                <span>Scheme ({appliedScheme?.name})</span>
                <span className="font-mono">-₹{schemeDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {advanceCredited > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Advance Token Credit</span>
                <span className="font-mono">-₹{advanceCredited.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Taxes Included (CGST+SGST)</span>
              <span className="font-mono">₹{totalGst.toFixed(2)}</span>
            </div>
          </div>

          {/* Net Payable Highlight */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/[0.1] flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Net Amount Payable</div>
              <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                ₹{netPayable.toLocaleString('en-IN')}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              {cartItems.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                handleQuickCashCheckout();
                sounds.playTapClick();
              }}
              disabled={cartItems.length === 0}
              className="py-3 px-3 bg-slate-900 hover:bg-slate-850 disabled:opacity-40 text-emerald-400 border border-emerald-500/30 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all tactile-btn"
            >
              <Zap className="w-4 h-4 text-emerald-400" /> Cash (F1)
            </button>
            <button
              onClick={() => {
                setCheckoutModalOpen(true);
                sounds.playTapClick();
              }}
              disabled={cartItems.length === 0}
              className="py-3 px-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xl shadow-emerald-600/30 transition-all tactile-btn"
            >
              <CreditCard className="w-4 h-4" /> Split Tender (F4)
            </button>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="w-full py-1 text-[11px] text-slate-500 hover:text-rose-400 text-center transition-colors"
            >
              Clear Cart (ESC)
            </button>
          )}
        </div>
      </div>

      {/* MODALS */}
      {checkoutModalOpen && (
        <CheckoutModal
          totalPayable={netPayable}
          customer={selectedCustomer}
          store={currentStore}
          onClose={() => setCheckoutModalOpen(false)}
          onComplete={handleCheckoutComplete}
        />
      )}

      {lastInvoice && (
        <ThermalReceiptModal
          invoice={lastInvoice}
          store={currentStore}
          onClose={() => setLastInvoice(null)}
        />
      )}

      {alterationItem && (
        <AlterationModal
          item={alterationItem}
          onClose={() => setAlterationItem(null)}
        />
      )}

      {advanceModalOpen && (
        <AdvanceBookingModal
          onClose={() => setAdvanceModalOpen(false)}
          onApplyAdvanceToPOS={(booking) => {
            setAppliedAdvance(booking);
            const cust = customers.find(c => c.phone === booking.customerPhone);
            if (cust) setSelectedCustomer(cust);
            showToast('Advance Applied', `₹${booking.advanceDeposited} advance credited against ${booking.bookingNo}`, 'success');
          }}
        />
      )}

      {fabricModalOpen && (
        <FabricCalculatorModal
          onClose={() => setFabricModalOpen(false)}
          onAddFabricToCart={(prod, meters, amt) => {
            addToCart({
              ...prod,
              salePrice: Math.round(amt / 1),
            }, 1);
          }}
        />
      )}

      {cfdModalOpen && (
        <CustomerFacingDisplay onClose={() => setCfdModalOpen(false)} />
      )}

      {stylistModalOpen && (
        <AiStylistModal
          customer={selectedCustomer}
          onClose={() => setStylistModalOpen(false)}
          onAddEnsembleToCart={(items) => {
            items.forEach(it => addToCart(it, 1));
          }}
        />
      )}

      {endlessAisleModalOpen && (
        <EndlessAisleModal onClose={() => setEndlessAisleModalOpen(false)} />
      )}
    </div>
  );
};
