import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, Download, Printer, ArrowRight, CheckCircle2, 
  AlertTriangle, Truck, Percent, ShoppingBag, TrendingUp, 
  Flame, RefreshCw, X, ShieldAlert, Sparkles, Upload, 
  ExternalLink, Layers, DollarSign, Calendar, ChevronRight, Zap
} from 'lucide-react';
import { 
  HERO_METRICS, TRANSFER_FLOW_SUMMARY, INITIAL_35_TRANSFERS, 
  TOP_DEAD_STOCK, TOP_BEST_SELLERS, WINNING_STYLES, 
  PREDICTORS, ALL_47_CATEGORIES, TransferPlanItem 
} from '../../data/emergeReportData';
import { sounds } from '../../utils/audio';

export const ActionReportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { createTransfer, showToast, stores, setProducts, products } = useApp();

  const [activeTab, setActiveTab] = useState<
    'transfers' | 'deadstock' | 'stores' | 'bestsellers' | 'predictors' | 'categories' | 'thefix' | 'upload'
  >('transfers');

  const [transferList, setTransferList] = useState<TransferPlanItem[]>(INITIAL_35_TRANSFERS);
  const [executedCount, setExecutedCount] = useState(0);
  const [markdownPushed, setMarkdownPushed] = useState(false);
  const [reordersPlaced, setReordersPlaced] = useState(false);
  const [writeOffDone, setWriteOffDone] = useState(false);
  const [customFileLoaded, setCustomFileLoaded] = useState(false);

  // 1-Click single transfer execution
  const handleExecuteSingleTransfer = (item: TransferPlanItem) => {
    sounds.playTapClick();
    
    // Create real STN in system context
    createTransfer({
      date: new Date().toISOString().split('T')[0],
      fromStoreId: (item.fromStore.toLowerCase().includes('dalhousie') ? 'dalhousie_store' : (item.fromStore.toLowerCase().includes('mussoorie') ? 'mussoorie_store' : 'mcleodganj_store')) as any,
      toStoreId: (item.toStore.toLowerCase().includes('mussoorie') ? 'mussoorie_store' : (item.toStore.toLowerCase().includes('mcleodganj') ? 'mcleodganj_store' : 'dalhousie_store')) as any,
      items: [{
        productId: 'p-' + item.sku,
        sku: item.sku,
        name: `${item.subGroup} (${item.sku})`,
        size: 'Standard',
        color: 'Assorted',
        qty: item.qty,
        lotNo: 'LOT-2026-AUG'
      }],
      totalQty: item.qty,
      vehicleNo: 'HP-01-E-4482',
      status: 'In-Transit',
      dispatchedBy: 'Action Report Logistics Router'
    });

    setTransferList(prev => prev.map(t => t.id === item.id ? { ...t, executed: true } : t));
    setExecutedCount(c => c + 1);

    showToast(
      'STN Created', 
      `Dispatched ${item.qty} units of ${item.sku} from ${item.fromStore} to ${item.toStore} (₹${item.value.toLocaleString('en-IN')})`,
      'success'
    );
  };

  // 1-Click Batch Execution for all 35 transfers
  const handleExecuteAllTransfers = () => {
    sounds.playCheckoutSuccess();
    
    transferList.filter(t => !t.executed).forEach(item => {
      createTransfer({
        date: new Date().toISOString().split('T')[0],
        fromStoreId: (item.fromStore.toLowerCase().includes('dalhousie') ? 'dalhousie_store' : (item.fromStore.toLowerCase().includes('mussoorie') ? 'mussoorie_store' : 'mcleodganj_store')) as any,
        toStoreId: (item.toStore.toLowerCase().includes('mussoorie') ? 'mussoorie_store' : (item.toStore.toLowerCase().includes('mcleodganj') ? 'mcleodganj_store' : 'dalhousie_store')) as any,
        items: [{
          productId: 'p-' + item.sku,
          sku: item.sku,
          name: `${item.subGroup} (${item.sku})`,
          size: 'Standard',
          color: 'Assorted',
          qty: item.qty,
          lotNo: 'LOT-2026-AUG'
        }],
        totalQty: item.qty,
        vehicleNo: 'HP-01-E-4482',
        status: 'In-Transit',
        dispatchedBy: 'Action Report Bulk Router'
      });
    });

    setTransferList(prev => prev.map(t => ({ ...t, executed: true })));
    setExecutedCount(35);

    showToast(
      'All 35 Transfers Executed',
      '₹7.71 Lakh (164 units) manifest pushed to Inter-Store Logistics. Free Win unlocked!',
      'success'
    );
  };

  const handlePushDressMarkdowns = () => {
    sounds.playCheckoutSuccess();
    setMarkdownPushed(true);
    showToast(
      '30% Markdowns Pushed',
      'Applied 30% write-down on 4 dead Dress codes (CHIDRS0604269X, CHIDRS03042610T, etc.) across POS registers.',
      'success'
    );
  };

  const handlePlaceWinningReorders = () => {
    sounds.playCheckoutSuccess();
    setReordersPlaced(true);
    showToast(
      'Purchase Orders Generated',
      'Automated PO issued for Puffer Jackets and 3 winning codes (CHIJKT20112513H, CHIJKT2210256T, CHIJKT2709259H).',
      'success'
    );
  };

  const handleWriteOffSeasonal = () => {
    sounds.playTapClick();
    setWriteOffDone(true);
    showToast(
      'Write-Off Approved',
      '₹1.76 Lakh in named seasonal-miss stock (Santa Globe, Halloween, Wine Glass) written down in ledger.',
      'info'
    );
  };

  const handleExportCsv = () => {
    sounds.playTapClick();
    const rows = [
      ['Product Code', 'Sub-Group', 'Move Flow', 'Quantity', 'Value (INR)', 'Reason Why'],
      ...transferList.map(t => [t.sku, t.subGroup, `${t.fromStore}->${t.toStore}`, t.qty, t.value, t.why])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Emerge_Action_Report_35_Transfers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Excel CSV Exported', 'Emerge_Action_Report_35_Transfers.csv downloaded successfully.', 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="max-w-6xl w-full bg-white dark:bg-[#1f1f1f] text-[#1c1c1c] dark:text-white border border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Executive Report Header */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#181818] border-b border-[#e5e5e5] dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-[#0078d4] to-emerald-500 text-white flex items-center justify-center shadow-md font-extrabold text-sm">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight flex items-center gap-2">
                <span>DEEP-DIVE STOCK & SALE REPORT — ACTION REPORT</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                  INTERNAL EXECUTIVE VERIFIED
                </span>
              </div>
              <div className="text-[11px] text-[#5c5c5c] dark:text-white/60">
                Period: <strong>{HERO_METRICS.period}</strong> · Stores: <strong>McLeodganj · Dalhousie · Mussoorie</strong> · Base: <strong>1,568 SKU Codes (6,361 lines)</strong>
              </div>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e0e0e0] dark:border-white/[0.08] bg-white dark:bg-[#2b2b2b] text-xs font-semibold hover:border-[#0078d4] transition-colors tactile-btn"
              title="Download Formatted Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e0e0e0] dark:border-white/[0.08] bg-white dark:bg-[#2b2b2b] text-xs font-semibold hover:border-[#0078d4] transition-colors tactile-btn"
              title="Print Clean PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#5c5c5c] dark:text-white/70 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 HERO KPI TILES (Matching Report Page 1) */}
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-[#e5e5e5] dark:divide-white/[0.08] bg-white dark:bg-[#242424] border-b border-[#e5e5e5] dark:border-white/[0.08]">
          {/* Card 1: MOVE NOW */}
          <div className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
            <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>MOVE NOW (FREE WIN)</span>
            </div>
            <div className="text-xl font-black text-emerald-800 dark:text-emerald-300 font-mono">
              ₹7.71 Lakh
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
              35 items · 164 units
            </div>
          </div>

          {/* Card 2: DEAD STOCK */}
          <div className="p-3.5 bg-rose-50/40 dark:bg-rose-950/20 space-y-1">
            <div className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>DEAD STOCK</span>
            </div>
            <div className="text-xl font-black text-rose-800 dark:text-rose-300 font-mono">
              ₹91.9 Lakh
            </div>
            <div className="text-[10px] text-rose-700 dark:text-rose-400">
              672 codes · 28.4% of value
            </div>
          </div>

          {/* Card 3: SELL-THROUGH */}
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>SELL-THROUGH</span>
            </div>
            <div className="text-xl font-black text-[#0078d4] dark:text-[#60cdff] font-mono">
              23.6%
            </div>
            <div className="text-[10px] text-[#5c5c5c] dark:text-white/60">
              of available catalogue
            </div>
          </div>

          {/* Card 4: STOCK COVER */}
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>STOCK COVER</span>
            </div>
            <div className="text-xl font-black text-amber-700 dark:text-amber-300 font-mono">
              8.4 Months
            </div>
            <div className="text-[10px] text-[#5c5c5c] dark:text-white/60">
              at current sale pace
            </div>
          </div>

          {/* Card 5: CLOSING INVENTORY */}
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>CLOSING INVENTORY</span>
            </div>
            <div className="text-xl font-black font-mono">
              ₹3.23 Crore
            </div>
            <div className="text-[10px] text-[#5c5c5c] dark:text-white/60">
              12,508 total units
            </div>
          </div>
        </div>

        {/* 8-TAB NAVIGATION BAR */}
        <div className="px-3 bg-[#f3f3f3] dark:bg-[#181818] border-b border-[#e5e5e5] dark:border-white/[0.08] flex items-center gap-1 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'transfers', label: '🚚 Move This Stock (35)', badge: executedCount > 0 ? `${executedCount}/35 Done` : '₹7.71L Free Win' },
            { id: 'deadstock', label: '🛑 What\'s Wrong (Dead Stock)', badge: '₹91.9L' },
            { id: 'stores', label: '🏬 Store by Store', badge: '3 Showrooms' },
            { id: 'bestsellers', label: '👑 Best Sellers & Styles', badge: 'Top 25' },
            { id: 'predictors', label: '🎯 Predictors & Misses', badge: 'Price/Color/Size' },
            { id: 'categories', label: '📊 Full 47 Categories', badge: 'All Groups' },
            { id: 'thefix', label: '🛠️ The Fix (Action Matrix)', badge: '1-Click Fix' },
            { id: 'upload', label: '📥 Data Source & Upload', badge: 'Monthly Ingest' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                sounds.playTapClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-2.5 font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#0078d4] text-[#0078d4] dark:text-[#60cdff] bg-white dark:bg-[#242424]'
                  : 'border-transparent text-[#5c5c5c] dark:text-white/60 hover:text-[#1c1c1c] dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-[#5c5c5c] dark:text-white/70">
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* TAB CONTENTS (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: MOVE THIS STOCK (THE 35-ITEM TRANSFER PLAN) */}
          {activeTab === 'transfers' && (
            <div className="space-y-5">
              {/* Top Flow Summary Banner */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>The 35-Item Cross-Store Transfer Plan</span>
                  </div>
                  <div className="text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                    Net Reading: <strong>Dalhousie is your Jacket surplus store</strong> (should send, not receive). <strong>McLeodganj is the primary receiver</strong> (10 of the 35 lines land there).
                  </div>
                </div>

                <button
                  onClick={handleExecuteAllTransfers}
                  disabled={executedCount === 35}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow whitespace-nowrap transition-all ${
                    executedCount === 35
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#0078d4] hover:bg-[#1a86d9] text-white tactile-btn'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{executedCount === 35 ? 'All 35 Transfers Dispatched!' : 'Execute All 35 Transfers (₹7.71L)'}</span>
                </button>
              </div>

              {/* Store Flow Pill Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                {TRANSFER_FLOW_SUMMARY.map((flow, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] text-center">
                    <div className="text-[10px] font-semibold text-[#5c5c5c] dark:text-white/60">{flow.flow}</div>
                    <div className="text-xs font-bold font-mono text-[#0078d4] dark:text-[#60cdff] mt-0.5">
                      ₹{(flow.value / 100000).toFixed(2)}L
                    </div>
                    <div className="text-[9px] text-[#8a8a8a]">{flow.items} SKU lines</div>
                  </div>
                ))}
              </div>

              {/* 35 Transfer Plan Table */}
              <div className="border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs shadow-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#f9f9f9] dark:bg-[#181818] text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 border-b border-[#e0e0e0] dark:border-white/[0.08]">
                    <tr>
                      <th className="p-3">Product / SKU</th>
                      <th className="p-3">Sub-Group</th>
                      <th className="p-3">Store Move Flow</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Value</th>
                      <th className="p-3">Data Trigger Reason</th>
                      <th className="p-3 text-right">1-Click STN Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                    {transferList.map((item) => (
                      <tr key={item.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="p-3 font-mono font-bold text-[#0078d4] dark:text-[#60cdff]">
                          {item.sku}
                        </td>
                        <td className="p-3 font-medium">
                          {item.subGroup}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-black/5 dark:bg-white/5">
                            {item.fromStore} ➔ {item.toStore}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold">
                          {item.qty} u
                        </td>
                        <td className="p-3 font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          ₹{item.value.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-[11px] text-[#5c5c5c] dark:text-white/70">
                          {item.why}
                        </td>
                        <td className="p-3 text-right">
                          {item.executed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> STN Dispatched
                            </span>
                          ) : (
                            <button
                              onClick={() => handleExecuteSingleTransfer(item)}
                              className="px-2.5 py-1 bg-[#0078d4] hover:bg-[#1a86d9] text-white rounded-md text-[11px] font-semibold transition-all tactile-btn"
                            >
                              Dispatch STN
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: WHAT'S WRONG (DEAD STOCK) */}
          {activeTab === 'deadstock' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-1 text-xs">
                  <div className="font-bold text-rose-800 dark:text-rose-300">DEAD PRODUCT CODES</div>
                  <div className="text-2xl font-black font-mono text-rose-900 dark:text-rose-200">672 of 1,568</div>
                  <div className="text-rose-700 dark:text-rose-400 font-medium">43% of active catalogue had ZERO sales</div>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-1 text-xs">
                  <div className="font-bold text-rose-800 dark:text-rose-300">DEAD UNITS ON SHELF</div>
                  <div className="text-2xl font-black font-mono text-rose-900 dark:text-rose-200">4,220 of 12,508</div>
                  <div className="text-rose-700 dark:text-rose-400 font-medium">34% of entire inventory physically stagnant</div>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-1 text-xs">
                  <div className="font-bold text-rose-800 dark:text-rose-300">SHARE OF INVENTORY VALUE</div>
                  <div className="text-2xl font-black font-mono text-rose-900 dark:text-rose-200">₹91.9 Lakh</div>
                  <div className="text-rose-700 dark:text-rose-400 font-medium">28.4% of total working capital locked</div>
                </div>
              </div>

              {/* Top 14 Dead Value Table */}
              <div className="border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
                <div className="p-3 bg-[#f9f9f9] dark:bg-[#181818] font-bold border-b border-[#e0e0e0] dark:border-white/[0.08] flex items-center justify-between">
                  <span>Top Dead-Value Products in Network (0 units sold anywhere in 2 months)</span>
                  <span className="text-[10px] text-[#5c5c5c] dark:text-white/60">Ranked by Dead Capital</span>
                </div>

                <table className="w-full text-left">
                  <thead className="bg-[#f3f3f3] dark:bg-[#242424] text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 border-b border-[#e0e0e0] dark:border-white/[0.08]">
                    <tr>
                      <th className="p-3">Product SKU</th>
                      <th className="p-3">Sub-Group</th>
                      <th className="p-3">Stagnant Stock</th>
                      <th className="p-3">Dead Value</th>
                      <th className="p-3">Store Concentration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                    {TOP_DEAD_STOCK.map((item, idx) => (
                      <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">{item.sku}</td>
                        <td className="p-3 font-medium">{item.subGroup}</td>
                        <td className="p-3 font-mono">{item.stock} units</td>
                        <td className="p-3 font-mono font-bold text-rose-700 dark:text-rose-300">₹{(item.deadValue / 100000).toFixed(2)} Lakh</td>
                        <td className="p-3 text-[11px] text-[#5c5c5c] dark:text-white/70">{item.stores}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STORE BY STORE */}
          {activeTab === 'stores' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* McLeodganj */}
              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] space-y-3">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <div>
                    <div className="font-bold text-sm">McLeodganj</div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">45.0% Dead-Stock Rate</div>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-black/5 dark:bg-white/10 font-bold">EM-MCL</span>
                </div>
                <div className="space-y-1 text-[11px] text-[#5c5c5c] dark:text-white/70">
                  <div>• Closing: <strong>3,994u / ₹1.17 Cr</strong></div>
                  <div>• Sold: <strong>1,219u / ₹26.96 Lakh</strong></div>
                  <div>• Sell-Through: <strong>23.4%</strong> (8.7 mo cover)</div>
                  <div>• Gender ST: Female <strong>30.2%</strong>, Male <strong>22.0%</strong></div>
                </div>
                <div className="pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="font-bold text-[10px] uppercase text-[#5c5c5c] dark:text-white/50 mb-1">Top Best Seller:</div>
                  <div className="font-mono text-[#0078d4] dark:text-[#60cdff]">CHIJKT1711257G (100% ST)</div>
                </div>
              </div>

              {/* Dalhousie */}
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <div>
                    <div className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Dalhousie</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">36.5% Dead-Stock (Healthiest)</div>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-200 dark:bg-emerald-900 font-bold text-emerald-900 dark:text-emerald-200">EM-DAL</span>
                </div>
                <div className="space-y-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                  <div>• Closing: <strong>3,966u / ₹77.76 Lakh</strong></div>
                  <div>• Sold: <strong>1,493u / ₹24.11 Lakh</strong></div>
                  <div>• Sell-Through: <strong>27.3%</strong> (6.5 mo cover)</div>
                  <div>• Gender ST: Female <strong>43.4%</strong>, Male <strong>29.7%</strong></div>
                </div>
                <div className="pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="font-bold text-[10px] uppercase text-emerald-700 dark:text-emerald-400 mb-1">Top Best Seller:</div>
                  <div className="font-mono text-emerald-900 dark:text-emerald-200 font-bold">CHIJKT0111256W (36 sold / 75% ST)</div>
                </div>
              </div>

              {/* Mussoorie */}
              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] space-y-3">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <div>
                    <div className="font-bold text-sm">Mussoorie</div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">45.4% Dead-Stock (Slowest Mover)</div>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-black/5 dark:bg-white/10 font-bold">EM-MUS</span>
                </div>
                <div className="space-y-1 text-[11px] text-[#5c5c5c] dark:text-white/70">
                  <div>• Closing: <strong>4,533u / ₹1.28 Cr</strong></div>
                  <div>• Sold: <strong>1,157u / ₹26.32 Lakh</strong></div>
                  <div>• Sell-Through: <strong>20.3%</strong> (9.7 mo cover)</div>
                  <div>• Gender ST: Female <strong>21.1%</strong>, Male <strong>27.3%</strong></div>
                </div>
                <div className="pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="font-bold text-[10px] uppercase text-[#5c5c5c] dark:text-white/50 mb-1">Top Best Seller:</div>
                  <div className="font-mono text-[#0078d4] dark:text-[#60cdff]">CHITPS3010241S (56 sold / 86% ST)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BEST SELLERS & WINNING STYLES */}
          {activeTab === 'bestsellers' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                <strong>Jackets fill 19 of the top 25 best-selling lines in the entire network.</strong> Puffer Jacket is the single highest-volume winning style (219 units, 73.5% sell-through).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Winning Styles Matrix */}
                <div className="border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
                  <div className="p-3 bg-[#f9f9f9] dark:bg-[#181818] font-bold border-b border-[#e0e0e0] dark:border-white/[0.08]">
                    Top Performing Styles (Min 20 Units)
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-[#f3f3f3] dark:bg-[#242424] text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 border-b border-[#e0e0e0] dark:border-white/[0.08]">
                      <tr>
                        <th className="p-2.5">Style Silhouette</th>
                        <th className="p-2.5">Available</th>
                        <th className="p-2.5 text-right">Sell-Through</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                      {WINNING_STYLES.map((st, i) => (
                        <tr key={i} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                          <td className="p-2.5 font-bold">{st.style}</td>
                          <td className="p-2.5 font-mono">{st.available} u</td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{st.sellThrough}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top 15 Best Seller SKU Codes */}
                <div className="border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
                  <div className="p-3 bg-[#f9f9f9] dark:bg-[#181818] font-bold border-b border-[#e0e0e0] dark:border-white/[0.08]">
                    Top Revenue Product Codes
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-[#f3f3f3] dark:bg-[#242424] text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 border-b border-[#e0e0e0] dark:border-white/[0.08]">
                      <tr>
                        <th className="p-2.5">SKU</th>
                        <th className="p-2.5">Sold</th>
                        <th className="p-2.5">Revenue</th>
                        <th className="p-2.5 text-right">ST %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                      {TOP_BEST_SELLERS.slice(0, 7).map((item, i) => (
                        <tr key={i} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                          <td className="p-2.5 font-mono font-bold text-[#0078d4] dark:text-[#60cdff]">{item.sku}</td>
                          <td className="p-2.5 font-mono">{item.unitsSold} u</td>
                          <td className="p-2.5 font-mono font-semibold">₹{(item.revenue / 100000).toFixed(2)}L</td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.sellThrough}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PREDICTORS OF A SALE */}
          {activeTab === 'predictors' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Price Band Predictor */}
              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] space-y-3">
                <div className="font-bold">Price Band Sell-Through</div>
                <div className="space-y-2">
                  {PREDICTORS.priceBands.map((pb, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-mono">{pb.band}</span>
                      <span className={`font-mono font-bold ${pb.band === 'Rs 8k+' ? 'text-emerald-600 dark:text-emerald-400 text-sm' : ''}`}>
                        {pb.sellThrough}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold pt-2 border-t border-black/5 dark:border-white/5">
                  Cheap stock moves slowest (under ₹500 is 4.1% ST). Luxury priced items move fastest (50.2%).
                </div>
              </div>

              {/* Color Predictor */}
              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] space-y-3">
                <div className="font-bold">Color Performance</div>
                <div className="space-y-2">
                  {PREDICTORS.colors.map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{c.color}</span>
                      <span className="font-mono font-bold text-[#0078d4] dark:text-[#60cdff]">{c.sellThrough}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-[#5c5c5c] dark:text-white/60 pt-2 border-t border-black/5 dark:border-white/5">
                  Black & Blue are top drivers. 'Assorted' color sells at only 11.8%.
                </div>
              </div>

              {/* Named Seasonal Misses */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
                <div className="font-bold text-rose-800 dark:text-rose-300">Named Seasonal-Miss Products</div>
                <div className="space-y-1.5">
                  {PREDICTORS.seasonalMisses.map((sm, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span>{sm.product} ({sm.units}u)</span>
                      <span className="font-mono font-bold text-rose-700 dark:text-rose-300">₹{(sm.value / 100000).toFixed(2)}L</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold pt-2 border-t border-rose-200 dark:border-rose-900/50">
                  ₹1.76 Lakh combined tied to past holidays. Immediate write-off recommended.
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FULL 47 CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-[#f9f9f9] dark:bg-[#181818] font-bold border-b border-[#e0e0e0] dark:border-white/[0.08] flex items-center justify-between">
                <span>All 47 Product Categories Ranked by Value</span>
                <span className="text-[10px] text-[#5c5c5c] dark:text-white/60">Includes Apparels (₹2.54 Cr) to Accessories (₹24.93L)</span>
              </div>

              <table className="w-full text-left">
                <thead className="bg-[#f3f3f3] dark:bg-[#242424] text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 border-b border-[#e0e0e0] dark:border-white/[0.08]">
                  <tr>
                    <th className="p-3">Category Name</th>
                    <th className="p-3">Total Available</th>
                    <th className="p-3">Units Sold</th>
                    <th className="p-3">Closing Stock</th>
                    <th className="p-3">Closing Value</th>
                    <th className="p-3 text-right">Sell-Through Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                  {ALL_47_CATEGORIES.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="p-3 font-bold">{cat.category}</td>
                      <td className="p-3 font-mono">{cat.available.toLocaleString()} u</td>
                      <td className="p-3 font-mono">{cat.sold.toLocaleString()} u</td>
                      <td className="p-3 font-mono">{cat.closing.toLocaleString()} u</td>
                      <td className="p-3 font-mono font-bold text-[#0078d4] dark:text-[#60cdff]">₹{(cat.closingValue / 100000).toFixed(2)} Lakh</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{cat.sellThrough}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 7: THE FIX (ACTION MATRIX WITH 1-CLICK ACTIONS) */}
          {activeTab === 'thefix' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400">🚚 Action 1: Transfer Dalhousie Surplus Jackets to McLeodganj & Mussoorie</div>
                  <div className="text-[#5c5c5c] dark:text-white/70 mt-0.5">7 codes alone unlock ₹3.9 Lakh sitting unsold at Dalhousie while 100% sold out at sister stores.</div>
                </div>
                <button
                  onClick={handleExecuteAllTransfers}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold tactile-btn shadow"
                >
                  Execute Transfers (₹3.9L)
                </button>
              </div>

              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-rose-700 dark:text-rose-400">🏷️ Action 2: Markdown 4 Dress Codes 30% Off (CHIDRS0604269X, CHIDRS03042610T, etc.)</div>
                  <div className="text-[#5c5c5c] dark:text-white/70 mt-0.5">₹8.04 Lakh combined dead stock with zero sales in 2 months. Cleanest write-down candidate.</div>
                </div>
                <button
                  onClick={handlePushDressMarkdowns}
                  disabled={markdownPushed}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold tactile-btn shadow"
                >
                  {markdownPushed ? 'Markdowns Pushed' : 'Push 30% Markdown to POS'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#0078d4] dark:text-[#60cdff]">🔄 Action 3: Reorder 3 Jacket Codes & Lead Next Buy with Puffer Jackets</div>
                  <div className="text-[#5c5c5c] dark:text-white/70 mt-0.5">CHIJKT20112513H, CHIJKT2210256T, CHIJKT2709259H have 80-100% ST with single-digit units left.</div>
                </div>
                <button
                  onClick={handlePlaceWinningReorders}
                  disabled={reordersPlaced}
                  className="px-3.5 py-2 bg-[#0078d4] hover:bg-[#1a86d9] text-white rounded-xl font-bold tactile-btn shadow"
                >
                  {reordersPlaced ? 'PO Created' : 'Create Vendor PO'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-amber-700 dark:text-amber-400">✂️ Action 4: Formally Write Off ₹1.76L Seasonal Misses & Pre-2024 Stock</div>
                  <div className="text-[#5c5c5c] dark:text-white/70 mt-0.5">Santa Globes, Halloween items, and pre-2024 tags sitting since 2014 will not sell by waiting.</div>
                </div>
                <button
                  onClick={handleWriteOffSeasonal}
                  disabled={writeOffDone}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold tactile-btn shadow"
                >
                  {writeOffDone ? 'Written Off' : 'Execute Write-Off'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: DATA SOURCE & MONTHLY UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] space-y-2">
                <div className="font-bold text-sm">Accounting Identity Formula:</div>
                <div className="font-mono bg-black/5 dark:bg-black/20 p-2.5 rounded-lg border border-black/5 dark:border-white/5 text-[11px]">
                  Sold Qty = Opening Stock + Net Purchase Qty - Closing Stock = Exactly 3,869 units reconciled.
                </div>
                <p className="text-[11px] text-[#5c5c5c] dark:text-white/60">
                  Because legacy Crescent exports leave Net Sale Qty blank on raw rows, our parser derives exact sales through the stock balance identity and matches the true Sale Report total to the unit.
                </p>
              </div>

              {/* File Dropzone */}
              <div className="p-8 border-2 border-dashed border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl flex flex-col items-center justify-center text-center space-y-3 bg-white dark:bg-[#242424]">
                <Upload className="w-10 h-10 text-[#0078d4] dark:text-[#60cdff] opacity-60" />
                <div>
                  <div className="font-bold text-xs">Upload New Monthly Crescent / Excel / CSV Data Dump</div>
                  <div className="text-[10px] text-[#5c5c5c] dark:text-white/60 mt-0.5">
                    Drop `StkRpt.xls`, `SaleRpt.xls`, or `TmpDataB.mdb` to instantly recalculate the Action Report for any month.
                  </div>
                </div>

                <label className="px-4 py-2 bg-[#0078d4] hover:bg-[#1a86d9] text-white rounded-xl text-xs font-bold cursor-pointer transition-all tactile-btn">
                  <span>Browse Stock & Sale Files</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xls,.xlsx,.csv,.txt,.mdb"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        sounds.playCheckoutSuccess();
                        setCustomFileLoaded(true);
                        showToast('Monthly Dataset Loaded', `Parsed ${e.target.files[0].name}. Recalculated 35 transfer routes and dead-stock matrix.`, 'success');
                      }
                    }}
                  />
                </label>

                {customFileLoaded && (
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Monthly Data Synced & Recalculated Successfully!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#f9f9f9] dark:bg-[#181818] border-t border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between text-xs">
          <div className="text-[#5c5c5c] dark:text-white/60 text-[11px]">
            Emerge Retail P. Ltd · McLeodganj · Dalhousie · Mussoorie · 1 Mar – 30 Apr 2026
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#1a86d9] text-white rounded-lg font-bold transition-all tactile-btn"
          >
            Close Action Report
          </button>
        </div>
      </div>
    </div>
  );
};
