import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoreId } from '../types';
import { 
  Building2, ChevronDown, Search, Sparkles, AlertTriangle, 
  Wallet, ShieldCheck, RefreshCw, Database, Activity, Command
} from 'lucide-react';
import { BackupSnapshotModal } from './settings/BackupSnapshotModal';

export const Navbar: React.FC<{ onOpenShiftModal: () => void }> = ({ onOpenShiftModal }) => {
  const { 
    currentStoreId, setCurrentStoreId, currentStore, stores, 
    setCommandPaletteOpen, aiCopilotOpen, setAiCopilotOpen,
    anomalies, setActiveTab, cashInDrawer, cashierName, showToast
  } = useApp();

  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const unresolvedAnomalies = anomalies.filter(a => !a.resolved);

  return (
    <header className="h-16 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-40 px-5 flex items-center justify-between gap-4 select-none">
      {/* Brand & Store Selector */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setActiveTab('pos')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-white font-sans text-lg">
              E
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-sans font-display">EMERGES</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">OS 2.0</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">Emerge Retail Enterprise Suite</div>
          </div>
        </div>

        <div className="h-5 w-px bg-white/[0.08] hidden md:block" />

        {/* Multi-Store Switcher with Live Pulse */}
        <div className="relative">
          <button
            onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-white/[0.08] text-xs text-slate-200 transition-all tactile-btn shadow-sm"
          >
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
            </div>
            <div className="text-left leading-tight">
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                {currentStore.name}
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">{currentStore.city} · {currentStore.code}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {storeDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Active Store Hubs
              </div>
              {stores.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentStoreId(s.id as StoreId);
                    setStoreDropdownOpen(false);
                    showToast('Branch Activated', `Live terminal routed to ${s.name}`, 'info');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between mt-1 ${
                    currentStoreId === s.id 
                      ? 'bg-blue-600/20 border border-blue-500/40 text-white shadow-sm' 
                      : 'hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className={`w-4 h-4 ${currentStoreId === s.id ? 'text-blue-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.city} · GSTIN: {s.gstin}</div>
                    </div>
                  </div>
                  {s.isHQ && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      HQ
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Spotlight Command Palette (Linear/Raycast Style) */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/[0.08] text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span>Search products, barcodes, customers, bills...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-800/90 rounded border border-white/[0.1] shadow-sm">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Actions & Status Indicators */}
      <div className="flex items-center gap-2.5">
        {/* Cash Register Drawer Gauge */}
        <button
          onClick={onOpenShiftModal}
          className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-800/40 text-emerald-200 text-xs transition-all tactile-btn"
          title="Click to perform Cash Drawer Reconcile & Shift End"
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          <div className="text-left leading-tight">
            <div className="font-mono font-extrabold text-emerald-300">₹{cashInDrawer.toLocaleString('en-IN')}</div>
            <div className="text-[9px] text-emerald-400/80">Cash in Drawer</div>
          </div>
        </button>

        {/* System Snapshot Backup */}
        <button
          onClick={() => setBackupModalOpen(true)}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-white/[0.08] text-cyan-400 transition-all tactile-btn"
          title="1-Click System State Backup & Snapshots (SqlBak.exe)"
        >
          <Database className="w-4 h-4" />
        </button>

        {/* Anomaly Sentinel */}
        <button
          onClick={() => setActiveTab('aistudio')}
          className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-white/[0.08] text-slate-300 transition-all tactile-btn"
          title="AI Anomaly Sentinel"
        >
          <AlertTriangle className={`w-4 h-4 ${unresolvedAnomalies.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
          {unresolvedAnomalies.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse shadow-md">
              {unresolvedAnomalies.length}
            </span>
          )}
        </button>

        {/* AI Copilot Trigger */}
        <button
          onClick={() => setAiCopilotOpen(!aiCopilotOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all tactile-btn shadow-lg ${
            aiCopilotOpen
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-purple-500/30'
              : 'bg-purple-950/40 hover:bg-purple-900/40 text-purple-200 border-purple-700/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Cashier Online Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-slate-200 shadow-sm">
              AK
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
        </div>
      </div>

      {backupModalOpen && (
        <BackupSnapshotModal onClose={() => setBackupModalOpen(false)} />
      )}
    </header>
  );
};
