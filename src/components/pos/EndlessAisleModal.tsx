import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Store } from '../../types';
import { 
  Globe2, Truck, Store as StoreIcon, Package, Search, 
  MapPin, CheckCircle2, ArrowRight, ShieldCheck, X, Sparkles, Send
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const EndlessAisleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { products, stores, currentStore, addToCart, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fulfillmentType, setFulfillmentType] = useState<'ship_to_home' | 'bopis'>('ship_to_home');
  const [customerAddress, setCustomerAddress] = useState('Flat 402, Royal Palms, Sector 12, Chandigarh - 160012');
  const [fulfillingStoreId, setFulfillingStoreId] = useState<string>('zirakpur_godown');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrderFulfillment = () => {
    if (!selectedProduct) return;
    sounds.playCheckoutSuccess();
    setDispatchSuccess(true);
    showToast(
      'Omnichannel Order Placed', 
      `Dispatched SKU ${selectedProduct.sku} from ${stores.find(s => s.id === fulfillingStoreId)?.name || 'Central Godown'}. AWB #BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)} generated.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white dark:bg-[#242424] text-[#1c1c1c] dark:text-white border border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-b border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-[#0078d4] text-white flex items-center justify-center shadow-sm">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Endless Aisle & Omnichannel Fulfillment</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                  5-STORE LIVE MATRIX
                </span>
              </div>
              <div className="text-[11px] text-[#5c5c5c] dark:text-white/60">
                Out of stock locally at {currentStore.name}? Sell instantly from another boutique or Central Godown.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[#5c5c5c] dark:text-white/70 hover:text-[#1c1c1c] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#e5e5e5] dark:divide-white/[0.08]">
          {/* Left: Product Search & Store Stock Finder (7 Cols) */}
          <div className="md:col-span-7 flex flex-col overflow-hidden p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8a8a8a] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search styles across network (e.g., 'Sherwani', 'Linen', 'Tuxedo')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#f3f3f3] dark:bg-[#1f1f1f] border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#0078d4]"
              />
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                // Calculate stock across stores
                const localStock = p.stockByStore[currentStore.id] || 0;
                const godownStock = p.stockByStore['zirakpur_godown'] || 0;
                const totalNetworkStock = Object.values(p.stockByStore).reduce((a, b) => a + b, 0);

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      sounds.playTapClick();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0078d4] ring-2 ring-[#0078d4]/20 bg-blue-50/50 dark:bg-blue-950/20'
                        : 'border-[#e0e0e0] dark:border-white/[0.08] hover:border-[#0078d4]/40 bg-white dark:bg-[#2b2b2b]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs">{p.name}</div>
                        <div className="text-[10px] text-[#5c5c5c] dark:text-white/60 font-mono mt-0.5">
                          SKU: {p.sku} · Barcode: {p.barcode} · Size: {p.size}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xs text-[#0078d4] dark:text-[#60cdff]">
                          ₹{p.salePrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {totalNetworkStock} available in network
                        </div>
                      </div>
                    </div>

                    {/* Store Breakdown Pills */}
                    <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-1.5 text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-mono ${localStock > 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'}`}>
                        {currentStore.name}: {localStock} pcs
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono bg-black/5 dark:bg-white/5 text-[#5c5c5c] dark:text-white/70">
                        Zirakpur Godown: {godownStock} pcs
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono bg-black/5 dark:bg-white/5 text-[#5c5c5c] dark:text-white/70">
                        Mussoorie: 6 pcs
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono bg-black/5 dark:bg-white/5 text-[#5c5c5c] dark:text-white/70">
                        Dalhousie: 10 pcs
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Omnichannel Checkout & Fulfillment Router (5 Cols) */}
          <div className="md:col-span-5 p-4 flex flex-col justify-between bg-[#f9f9f9] dark:bg-[#1f1f1f]">
            {selectedProduct ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white dark:bg-[#2b2b2b] border border-[#e0e0e0] dark:border-white/[0.08]">
                  <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/40 mb-1">
                    Selected Style
                  </div>
                  <div className="font-bold text-xs">{selectedProduct.name}</div>
                  <div className="text-[11px] text-[#0078d4] dark:text-[#60cdff] font-bold font-mono mt-0.5">
                    ₹{selectedProduct.salePrice.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Fulfillment Routing Selector */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/40">
                    Fulfillment Channel
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFulfillmentType('ship_to_home')}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        fulfillmentType === 'ship_to_home'
                          ? 'border-[#0078d4] bg-blue-50 dark:bg-blue-950/40 text-[#0078d4] dark:text-[#60cdff] font-bold'
                          : 'border-[#e0e0e0] dark:border-white/[0.08] bg-white dark:bg-[#2b2b2b] text-[#5c5c5c] dark:text-white/70'
                      }`}
                    >
                      <Truck className="w-4 h-4 mb-1" />
                      <div>Ship-to-Home</div>
                      <div className="text-[9px] font-normal opacity-70">Courier Direct to Client</div>
                    </button>

                    <button
                      onClick={() => setFulfillmentType('bopis')}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        fulfillmentType === 'bopis'
                          ? 'border-[#0078d4] bg-blue-50 dark:bg-blue-950/40 text-[#0078d4] dark:text-[#60cdff] font-bold'
                          : 'border-[#e0e0e0] dark:border-white/[0.08] bg-white dark:bg-[#2b2b2b] text-[#5c5c5c] dark:text-white/70'
                      }`}
                    >
                      <StoreIcon className="w-4 h-4 mb-1" />
                      <div>Click & Collect</div>
                      <div className="text-[9px] font-normal opacity-70">Pickup at Nearest Store</div>
                    </button>
                  </div>
                </div>

                {/* Source Dispatch Node */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/40">
                    Dispatching Hub
                  </div>
                  <select
                    value={fulfillingStoreId}
                    onChange={(e) => setFulfillingStoreId(e.target.value)}
                    className="w-full bg-white dark:bg-[#2b2b2b] border border-[#e0e0e0] dark:border-white/[0.08] rounded-lg p-2 text-xs font-semibold focus:outline-none"
                  >
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code}) — Express Ready
                      </option>
                    ))}
                  </select>
                </div>

                {/* Client Delivery Destination */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/40">
                    Delivery Destination Address
                  </div>
                  <textarea
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white dark:bg-[#2b2b2b] border border-[#e0e0e0] dark:border-white/[0.08] rounded-lg p-2 text-xs focus:outline-none"
                  />
                </div>

                {dispatchSuccess ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1 animate-in fade-in">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Omnichannel Dispatch Order Created!
                    </div>
                    <div className="text-[11px]">
                      Automated courier manifest generated. Customer notified via WhatsApp with live tracking link.
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleOrderFulfillment}
                    className="w-full py-2.5 rounded-xl bg-[#0078d4] hover:bg-[#1a86d9] text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition-all tactile-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>Sell & Dispatch from Network (₹{selectedProduct.salePrice.toLocaleString('en-IN')})</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#5c5c5c] dark:text-white/40 space-y-2">
                <Globe2 className="w-10 h-10 opacity-30" />
                <div className="text-xs font-semibold">Select a Product to Route Fulfillment</div>
                <div className="text-[10px]">
                  Browse any SKU from all 5 showrooms and central warehouse.
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-4 w-full py-2 rounded-lg border border-[#e0e0e0] dark:border-white/[0.08] hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
