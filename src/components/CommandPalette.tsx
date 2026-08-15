import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag, Users, FileText, Sparkles, ArrowRight, X } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    commandPaletteOpen, setCommandPaletteOpen, 
    products, customers, invoices, 
    addToCart, setActiveTab, setSelectedCustomer,
    setAiCopilotOpen 
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProducts = q
    ? products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q)).slice(0, 4)
    : [];

  const filteredCustomers = q
    ? customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 3)
    : [];

  const filteredInvoices = q
    ? invoices.filter(inv => inv.invoiceNo.toLowerCase().includes(q) || (inv.customer?.name && inv.customer.name.toLowerCase().includes(q))).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-slate-900/50">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products, SKUs, customers, invoices, or type AI commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">ESC</kbd>
          <button 
            onClick={() => setCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Actions if query empty */}
          {!q && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Quick Navigation</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setActiveTab('pos'); setCommandPaletteOpen(false); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-800/80 text-left text-xs text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium">Open POS Terminal</div>
                    <div className="text-[10px] text-slate-400">Rapid barcode billing</div>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab('aistudio'); setCommandPaletteOpen(false); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-800/80 text-left text-xs text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-medium">AI Inward OCR Ingestion</div>
                    <div className="text-[10px] text-slate-400">Digitize vendor invoices</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* AI Trigger */}
          {q && (
            <div
              onClick={() => {
                setCommandPaletteOpen(false);
                setAiCopilotOpen(true);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-purple-500/20 hover:border-purple-500/40 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-xs text-purple-200">
                  Ask Emerges AI: <strong className="text-white">"{query}"</strong>
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Products & Lots</div>
              <div className="space-y-1">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      addToCart(p);
                      setActiveTab('pos');
                      setCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer text-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-blue-400 font-mono text-[10px] border border-slate-700">
                        {p.size}
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-blue-300 transition-colors">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.sku} · Barcode: {p.barcode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-400">₹{p.salePrice.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400">{p.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Customers</div>
              <div className="space-y-1">
                {filteredCustomers.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setActiveTab('pos');
                      setCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="font-medium text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.phone} · {c.city}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {c.tier} ({c.loyaltyPoints} pts)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Invoices</div>
              <div className="space-y-1">
                {filteredInvoices.map(inv => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      setActiveTab('accounts');
                      setCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-medium text-white font-mono">{inv.invoiceNo}</div>
                        <div className="text-[10px] text-slate-400">{inv.customer?.name || 'Walk-in Customer'} · {inv.date}</div>
                      </div>
                    </div>
                    <div className="text-right font-semibold text-white">
                      ₹{inv.netPayable.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Use <strong>Enter</strong> to select</span>
            <span><strong>ESC</strong> to close</span>
          </div>
          <span className="text-blue-400 font-mono text-[10px]">EmergesOS Instant Index</span>
        </div>
      </div>
    </div>
  );
};
