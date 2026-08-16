import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ApparelCategory } from '../../types';
import { 
  Layers, Barcode, Box, Plus, Search, Filter, 
  Printer, CheckCircle2, AlertCircle, Scan, Tag, RefreshCw, Zap, Percent, Radio
} from 'lucide-react';
import { RapidStockAuditModal } from './RapidStockAuditModal';
import { DynamicMarkdownModal } from './DynamicMarkdownModal';
import { RfidBulkScannerModal } from './RfidBulkScannerModal';
import { sounds } from '../../utils/audio';

export const InventoryHub: React.FC = () => {
  const { products, setProducts, currentStoreId, currentStore, stores, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'boxes' | 'barcodeStudio' | 'audit'>('matrix');
  const [rapidAuditModalOpen, setRapidAuditModalOpen] = useState(false);
  const [markdownModalOpen, setMarkdownModalOpen] = useState(false);
  const [rfidModalOpen, setRfidModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Barcode Label Studio State
  const [selectedProductForBarcode, setSelectedProductForBarcode] = useState<Product | null>(products[0] || null);
  const [labelCopies, setLabelCopies] = useState<number>(10);
  const [labelLayout, setLabelLayout] = useState<'single' | '2up' | '3up'>('2up');

  // Stock Audit Scanner State
  const [auditScans, setAuditScans] = useState<{ [sku: string]: number }>({});
  const [auditScanInput, setAuditScanInput] = useState('');

  // New Product Modal State
  const [newProductModal, setNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'Mens Ethnic',
    subCategory: 'Kurta Pyjama',
    brand: 'Emerge Royal',
    style: 'Classic Fit',
    color: 'Ivory Cream',
    size: '40 (L)',
    fabric: 'Linen Silk',
    mrp: 4999,
    costPrice: 1800,
    salePrice: 3999,
    gstPercent: 5,
    hsnCode: '6205',
    boxNumber: 'BOX-ETH-03',
    lotNumber: 'LOT-2026-AUG-99',
    stockByStore: {
      zirakpur_hq: 15,
      dalhousie_store: 5,
      mcleodganj_store: 8,
      mussoorie_store: 6,
      zirakpur_godown: 40
    },
    active: true
  });

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = search === '' || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) || 
      p.barcode.includes(search);
    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku) {
      alert('Please fill product name and SKU');
      return;
    }

    const created: Product = {
      id: 'p-' + Date.now(),
      sku: newProduct.sku,
      barcode: newProduct.barcode || '890' + Math.floor(1000000000 + Math.random() * 9000000000),
      name: newProduct.name,
      category: (newProduct.category as ApparelCategory) || 'Mens Ethnic',
      subCategory: newProduct.subCategory || 'General',
      brand: newProduct.brand || 'Emerge',
      style: newProduct.style || 'Regular',
      color: newProduct.color || 'Standard',
      size: newProduct.size || 'M',
      fabric: newProduct.fabric || 'Cotton',
      mrp: Number(newProduct.mrp) || 999,
      costPrice: Number(newProduct.costPrice) || 400,
      salePrice: Number(newProduct.salePrice) || 899,
      gstPercent: Number(newProduct.gstPercent) || 5,
      hsnCode: newProduct.hsnCode || '6203',
      stockByStore: newProduct.stockByStore || { zirakpur_hq: 10, dalhousie_store: 5, mcleodganj_store: 5, mussoorie_store: 5, zirakpur_godown: 20 },
      boxNumber: newProduct.boxNumber || 'BOX-01',
      lotNumber: newProduct.lotNumber || 'LOT-AUG-26',
      active: true
    };

    setProducts(prev => [created, ...prev]);
    setNewProductModal(false);
    showToast('Product Created', `${created.name} (${created.sku}) added to catalog.`, 'success');
  };

  const handleAuditScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const barcode = auditScanInput.trim();
    if (!barcode) return;

    const matched = products.find(p => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase());
    if (matched) {
      setAuditScans(prev => ({
        ...prev,
        [matched.sku]: (prev[matched.sku] || 0) + 1
      }));
      setAuditScanInput('');
      showToast('Item Scanned', `${matched.name} (+1)`, 'info');
    } else {
      showToast('Unknown Barcode', barcode, 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Sub Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Inventory & Supply Chain</div>
          <h1 className="text-2xl font-extrabold text-white">Smart Matrix Inventory & Lot Hub</h1>
        </div>

        {/* Tab Controls & Add Product Button */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveSubTab('matrix')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeSubTab === 'matrix' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Matrix SKU Stock
            </button>
            <button
              onClick={() => setActiveSubTab('boxes')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeSubTab === 'boxes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lot & Box Locations
            </button>
            <button
              onClick={() => setActiveSubTab('barcodeStudio')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeSubTab === 'barcodeStudio' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Barcode Label Studio
            </button>
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeSubTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stock Audit Scanner
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMarkdownModalOpen(true);
                sounds.playTapClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 dark:bg-rose-600/15 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-xl text-xs font-bold transition-all tactile-btn"
              title="AI Dynamic Markdown & GMROI Clearance Optimizer"
            >
              <Percent className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Dynamic Markdowns
            </button>
            <button
              onClick={() => {
                setRfidModalOpen(true);
                sounds.playTapClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 dark:bg-teal-600/15 hover:bg-teal-100 dark:hover:bg-teal-600/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 rounded-xl text-xs font-bold transition-all tactile-btn"
              title="UHF RFID Bulk Carton Scanning Portal"
            >
              <Radio className="w-4 h-4 text-teal-600 dark:text-teal-400" /> RFID Portal
            </button>
            <button
              onClick={() => {
                setRapidAuditModalOpen(true);
                sounds.playTapClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-600/15 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-xs font-bold transition-all tactile-btn"
              title="100 Scans/Min Physical Rack & Box Inventory Audit"
            >
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Rapid Stock Audit
            </button>
            <button
              onClick={() => setNewProductModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0078d4] hover:bg-[#1a86d9] text-white rounded-xl text-xs font-bold shadow transition-all tactile-btn"
            >
              <Plus className="w-4 h-4" /> Add New SKU
            </button>
          </div>
        </div>
      </div>

      {/* MATRIX SKU STOCK VIEW */}
      {activeSubTab === 'matrix' && (
        <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Filter by SKU, Product Name, Fabric, Color or Barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {['All', 'Mens Ethnic', 'Mens Casual', 'Womens Ethnic', 'Fabrics', 'Accessories'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="p-3 pl-4">SKU / Barcode</th>
                  <th className="p-3">Product Name & Fabric</th>
                  <th className="p-3">Category / Style</th>
                  <th className="p-3">Color / Size</th>
                  <th className="p-3 text-right">Cost</th>
                  <th className="p-3 text-right">MRP / Sale</th>
                  <th className="p-3 text-center">Zirakpur HQ</th>
                  <th className="p-3 text-center">Dalhousie</th>
                  <th className="p-3 text-center">Godown</th>
                  <th className="p-3 text-center">Total Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredProducts.map((p) => {
                  const totalStock = (p.stockByStore.zirakpur_hq || 0) + (p.stockByStore.dalhousie_store || 0) + (p.stockByStore.zirakpur_godown || 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="font-mono font-bold text-white">{p.sku}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.barcode}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.fabric} · HSN: {p.hsnCode}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 text-[10px] font-medium">
                          {p.category}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{p.style}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-200">{p.color}</div>
                        <div className="text-[10px] font-mono text-slate-400">Size: {p.size}</div>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-400">
                        ₹{p.costPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-mono">
                        <div className="text-emerald-400 font-bold">₹{p.salePrice.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-500 line-through">₹{p.mrp.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="p-3 text-center font-mono font-semibold text-slate-200">
                        {p.stockByStore.zirakpur_hq || 0}
                      </td>
                      <td className="p-3 text-center font-mono font-semibold text-slate-200">
                        {p.stockByStore.dalhousie_store || 0}
                      </td>
                      <td className="p-3 text-center font-mono font-semibold text-slate-200">
                        {p.stockByStore.zirakpur_godown || 0}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
                          totalStock > 15 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                            : totalStock > 0 
                              ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {totalStock}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LOT & BOX LOCATIONS VIEW (Derived from Crescent BoxStockKREST) */}
      {activeSubTab === 'boxes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['BOX-ETH-01', 'BOX-KUR-04', 'BOX-BRIDAL-02', 'BOX-SAREE-09', 'BOX-BLZ-03', 'ROLL-FAB-108'].map(boxNo => {
            const boxItems = products.filter(p => p.boxNumber === boxNo);
            const totalUnits = boxItems.reduce((sum, p) => sum + (p.stockByStore[currentStoreId] || 0), 0);

            return (
              <div key={boxNo} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="font-extrabold text-white text-sm">{boxNo}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Location: Rack A-4 (Zirakpur)</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 font-mono text-xs font-bold border border-slate-800">
                    {totalUnits} Units
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs pt-1">
                  {boxItems.map(item => (
                    <div key={item.id} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.size} · Lot: {item.lotNumber}</div>
                      </div>
                      <div className="text-right font-mono font-bold text-white">
                        {item.stockByStore[currentStoreId] || 0} pcs
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BARCODE LABEL STUDIO */}
      {activeSubTab === 'barcodeStudio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Barcode className="w-4 h-4 text-blue-400" /> Label Customizer & Sticker Layout
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Product SKU</label>
                <select
                  value={selectedProductForBarcode?.id || ''}
                  onChange={(e) => {
                    const found = products.find(p => p.id === e.target.value);
                    if (found) setSelectedProductForBarcode(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Sticker Roll Layout</label>
                  <select
                    value={labelLayout}
                    onChange={(e) => setLabelLayout(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="single">Single Roll (50mm × 35mm)</option>
                    <option value="2up">2-Up Jewelry / Apparel Tag</option>
                    <option value="3up">3-Up Thermal Barcode Roll</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Number of Copies</label>
                  <input
                    type="number"
                    value={labelCopies}
                    onChange={(e) => setLabelCopies(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  window.print();
                  showToast('Labels Sent to Thermal Roll', `${labelCopies} copies dispatched.`, 'success');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
              >
                <Printer className="w-4 h-4" /> Print {labelCopies} Barcode Labels
              </button>
            </div>
          </div>

          {/* Label Preview */}
          <div className="lg:col-span-7 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-xs text-slate-400 mb-4">Live Thermal Sticker Label Preview:</div>
            
            {selectedProductForBarcode && (
              <div className="w-80 bg-white text-black p-4 rounded-lg shadow-2xl border border-slate-300 font-sans select-none">
                <div className="text-center font-extrabold text-sm tracking-wider uppercase border-b border-black pb-1">
                  EMERGE RETAIL
                </div>
                <div className="py-1.5 text-center">
                  <div className="font-bold text-xs leading-tight line-clamp-1">{selectedProductForBarcode.name}</div>
                  <div className="text-[10px] text-gray-700 font-mono mt-0.5">
                    {selectedProductForBarcode.sku}
                  </div>
                </div>

                <div className="bg-gray-50 border border-dashed border-gray-400 p-2 my-1 text-center font-mono">
                  <div className="text-base tracking-[0.25em] font-extrabold">
                    ||| | |||| | ||||| |||
                  </div>
                  <div className="text-[10px] font-bold text-gray-900 mt-0.5">
                    {selectedProductForBarcode.barcode}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-1 border-t border-black text-xs font-bold">
                  <div>
                    <span className="text-[9px] block text-gray-600">SIZE / COLOR:</span>
                    <span>{selectedProductForBarcode.size} · {selectedProductForBarcode.color}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] block text-gray-600">MRP (INCL. TAX):</span>
                    <span className="text-sm font-black font-mono">₹{selectedProductForBarcode.salePrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STOCK AUDIT SCANNER */}
      {activeSubTab === 'audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Scan className="w-4 h-4 text-emerald-400" /> Physical Barcode Stock Audit
            </div>
            <div className="text-xs text-slate-400">
              Scan items physically in the showroom or godown. EmergesOS will automatically reconcile physical counts against system records.
            </div>

            <form onSubmit={handleAuditScanSubmit} className="space-y-3">
              <div className="relative">
                <Barcode className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Scan item barcode..."
                  value={auditScanInput}
                  onChange={(e) => setAuditScanInput(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Record Physical Scan
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Audit Reconciliation Table</div>
            <div className="divide-y divide-slate-800 text-xs">
              {products.map(p => {
                const sysCount = p.stockByStore[currentStoreId] || 0;
                const physicalCount = auditScans[p.sku] || 0;
                const diff = physicalCount - sysCount;

                return (
                  <div key={p.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.sku}</div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-[10px] text-slate-500">System: {sysCount}</div>
                        <div className="font-mono font-bold text-slate-200">Scanned: {physicalCount}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                        diff === 0 
                          ? 'bg-slate-800 text-slate-300' 
                          : diff > 0 
                            ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {diff === 0 ? 'Match' : diff > 0 ? `+${diff}` : `${diff}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* NEW PRODUCT MODAL */}
      {newProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="text-base font-bold text-white">Create New Matrix Product SKU</div>
            <form onSubmit={handleCreateProduct} className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandhgala Silk Suit"
                  value={newProduct.name || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">SKU Code</label>
                <input
                  type="text"
                  required
                  placeholder="EM-SUIT-099"
                  value={newProduct.sku || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newProduct.category || 'Mens Ethnic'}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                >
                  {['Mens Ethnic', 'Mens Casual', 'Womens Ethnic', 'Fabrics', 'Accessories'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Size</label>
                <input
                  type="text"
                  value={newProduct.size || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Color / Shade</label>
                <input
                  type="text"
                  value={newProduct.color || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Cost Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.costPrice || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.salePrice || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, salePrice: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewProductModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {rapidAuditModalOpen && (
        <RapidStockAuditModal onClose={() => setRapidAuditModalOpen(false)} />
      )}

      {markdownModalOpen && (
        <DynamicMarkdownModal onClose={() => setMarkdownModalOpen(false)} />
      )}

      {rfidModalOpen && (
        <RfidBulkScannerModal onClose={() => setRfidModalOpen(false)} />
      )}
    </div>
  );
};
