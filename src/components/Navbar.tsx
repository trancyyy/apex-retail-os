import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoreId } from '../types';
import { 
  Building2, ChevronDown, Sparkles, AlertTriangle, 
  Wallet, Database, Store, ChevronRight, Settings, Sun, Moon
} from 'lucide-react';
import { BackupSnapshotModal } from './settings/BackupSnapshotModal';
import { sounds } from '../utils/audio';

export const Navbar: React.FC<{ 
  onOpenShiftModal: () => void;
  onOpenSettings?: () => void;
}> = ({ onOpenShiftModal, onOpenSettings }) => {
  const { 
    currentStoreId, setCurrentStoreId, currentStore, stores, 
    aiCopilotOpen, setAiCopilotOpen,
    anomalies, setActiveTab, activeTab, cashInDrawer, cashierName, showToast,
    theme, setTheme
  } = useApp();

  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const unresolvedAnomalies = anomalies.filter(a => !a.resolved);

  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'pos': return 'POS Register & Billing';
      case 'inventory': return 'Inventory & Matrix Stock';
      case 'approvals': return 'Jangad & Home Approvals';
      case 'purchases': return 'Purchases & Vendor GRN';
      case 'transfers': return 'Store Transfers & STN';
      case 'aistudio': return 'AI Digitization Studio';
      case 'reports': return 'MIS Reports & Analytics';
      case 'accounts': return 'Accounts & GST Ledger';
      case 'crm': return 'CRM & WhatsApp Marketing';
      case 'schemes': return 'Schemes & Price Matrix';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-11 border-b border-[#e0e0e0] dark:border-white/[0.08] bg-[#ffffff] dark:bg-[#242424] text-[#1c1c1c] dark:text-white px-4 flex items-center justify-between select-none z-30 shrink-0 transition-colors duration-150">
      {/* Left: Fluent Breadcrumbs & Store Switcher */}
      <div className="flex items-center gap-3">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-[#5c5c5c] dark:text-white/60">
          <span className="font-semibold text-[#1c1c1c] dark:text-white/90">Emerge Suite</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8a8a8a] dark:text-white/30" />
          <span className="font-semibold text-[#0078d4] dark:text-[#60cdff]">{getTabBreadcrumb()}</span>
        </div>

        <div className="h-4 w-px bg-[#e0e0e0] dark:bg-white/[0.1] mx-1" />

        {/* Fluent Store Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setStoreDropdownOpen(!storeDropdownOpen);
              sounds.playTapClick();
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#f3f3f3] dark:bg-[#2b2b2b] hover:bg-[#e5e5e5] dark:hover:bg-[#333333] border border-[#e0e0e0] dark:border-white/[0.08] text-xs text-[#1c1c1c] dark:text-white/90 transition-colors shadow-xs"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-[11px]">{currentStore.name}</span>
            <ChevronDown className="w-3 h-3 text-[#5c5c5c] dark:text-white/40 ml-0.5" />
          </button>

          {storeDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 rounded-lg bg-white dark:bg-[#2b2b2b] border border-[#e0e0e0] dark:border-white/[0.1] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-[#5c5c5c] dark:text-white/40 uppercase tracking-wider">
                Select Store Location
              </div>
              {stores.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentStoreId(s.id as StoreId);
                    setStoreDropdownOpen(false);
                    sounds.playTapClick();
                    showToast('Store Switched', `Active terminal routed to ${s.name}`, 'info');
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-colors flex items-center justify-between mt-0.5 ${
                    currentStoreId === s.id 
                      ? 'bg-[#0078d4] text-white font-medium' 
                      : 'hover:bg-black/5 dark:hover:bg-white/[0.06] text-[#1c1c1c] dark:text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#5c5c5c] dark:text-white/60" />
                    <div>
                      <div className="font-medium text-[11px]">{s.name}</div>
                      <div className="text-[9px] text-[#5c5c5c] dark:text-white/50">{s.city} · {s.code}</div>
                    </div>
                  </div>
                  {s.isHQ && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/20 text-[#0078d4] dark:text-white">
                      HQ
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Windows 11 Fluent Command Controls */}
      <div className="flex items-center gap-2">
        {/* Cash Register Drawer Status */}
        <button
          onClick={() => {
            sounds.playTapClick();
            onOpenShiftModal();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f3f3f3] dark:bg-[#2b2b2b] hover:bg-[#e5e5e5] dark:hover:bg-[#333333] border border-[#e0e0e0] dark:border-white/[0.08] text-xs text-[#1c1c1c] dark:text-white/90 transition-colors"
          title="Cash Drawer Reconcile & Shift Management"
        >
          <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            ₹{cashInDrawer.toLocaleString('en-IN')}
          </span>
        </button>

        {/* Database Snapshot Backup */}
        <button
          onClick={() => {
            sounds.playTapClick();
            setBackupModalOpen(true);
          }}
          className="p-1.5 rounded-md bg-[#f3f3f3] dark:bg-[#2b2b2b] hover:bg-[#e5e5e5] dark:hover:bg-[#333333] border border-[#e0e0e0] dark:border-white/[0.08] text-[#0078d4] dark:text-[#60cdff] transition-colors"
          title="Backup Database & System State"
        >
          <Database className="w-3.5 h-3.5" />
        </button>

        {/* AI Anomaly Radar Notification */}
        <button
          onClick={() => {
            sounds.playTapClick();
            setActiveTab('aistudio');
          }}
          className="relative p-1.5 rounded-md bg-[#f3f3f3] dark:bg-[#2b2b2b] hover:bg-[#e5e5e5] dark:hover:bg-[#333333] border border-[#e0e0e0] dark:border-white/[0.08] text-[#5c5c5c] dark:text-white/70 hover:text-[#1c1c1c] dark:hover:text-white transition-colors"
          title="Anomaly Sentinel"
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${unresolvedAnomalies.length > 0 ? 'text-amber-500 animate-pulse' : 'text-[#8a8a8a] dark:text-white/60'}`} />
          {unresolvedAnomalies.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#c42b1c] text-white text-[8px] font-bold flex items-center justify-center">
              {unresolvedAnomalies.length}
            </span>
          )}
        </button>

        {/* Microsoft Copilot AI Button */}
        <button
          onClick={() => {
            sounds.playTapClick();
            setAiCopilotOpen(!aiCopilotOpen);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            aiCopilotOpen
              ? 'bg-[#0078d4] text-white'
              : 'bg-[#f3f3f3] dark:bg-[#2b2b2b] hover:bg-[#e5e5e5] dark:hover:bg-[#333333] border border-[#e0e0e0] dark:border-white/[0.08] text-[#1c1c1c] dark:text-white/90'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-[#d19fff]" />
          <span>Copilot</span>
        </button>

        {/* Settings Dialog Trigger */}
        {onOpenSettings && (
          <button
            onClick={() => {
              sounds.playTapClick();
              onOpenSettings();
            }}
            className="p-1.5 rounded-md bg-[#f3f3f3] dark:bg-[#2b2b2b] hover:bg-[#e5e5e5] dark:hover:bg-[#333333] border border-[#e0e0e0] dark:border-white/[0.08] text-[#5c5c5c] dark:text-white/70 hover:text-[#1c1c1c] dark:hover:text-white transition-colors"
            title="Settings & Diagnostics"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Cashier User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#e0e0e0] dark:border-white/[0.08]">
          <div className="w-6 h-6 rounded-full bg-[#0078d4] text-white flex items-center justify-center text-[10px] font-semibold shadow-xs">
            {cashierName ? cashierName.slice(0, 2).toUpperCase() : 'AK'}
          </div>
          <span className="text-[11px] font-medium text-[#1c1c1c] dark:text-white/80 hidden sm:inline">
            {cashierName || 'Cashier'}
          </span>
        </div>
      </div>

      {backupModalOpen && (
        <BackupSnapshotModal onClose={() => setBackupModalOpen(false)} />
      )}
    </header>
  );
};
