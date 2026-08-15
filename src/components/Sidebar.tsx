import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import { 
  ShoppingBag, Layers, Truck, Sparkles, 
  BookOpen, Users, Tag, BarChart3, FileCheck, ClipboardList, 
  ChevronRight, Maximize2, Monitor
} from 'lucide-react';
import { sounds } from '../utils/audio';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, transfers, aiBills, anomalies, setIsStandalonePosMode } = useApp();

  const pendingTransfers = transfers.filter(t => t.status === 'In-Transit').length;
  const pendingAiBills = aiBills.filter(b => b.status === 'Pending Review').length;
  const activeAnomalies = anomalies.filter(a => !a.resolved).length;

  const navItems: { id: NavTab; label: string; subLabel: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'pos',
      label: 'POS Terminal',
      subLabel: 'Barcode Billing & Sales',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'inventory',
      label: 'Matrix Inventory',
      subLabel: 'Lot, Box & Barcodes',
      icon: <Layers className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'approvals',
      label: 'Jangad & Approvals',
      subLabel: 'VIP Home Trials & Memo',
      icon: <FileCheck className="w-4 h-4 text-rose-400" />,
      badge: 2,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'purchases',
      label: 'Purchases & GRN',
      subLabel: 'Vendor PO & Inward',
      icon: <ClipboardList className="w-4 h-4 text-teal-400" />
    },
    {
      id: 'transfers',
      label: 'Store Transfers',
      subLabel: 'STN & Logistics',
      icon: <Truck className="w-4 h-4 text-amber-400" />,
      badge: pendingTransfers > 0 ? pendingTransfers : undefined,
      badgeColor: 'bg-amber-500 text-slate-950'
    },
    {
      id: 'aistudio',
      label: 'AI Digitization',
      subLabel: 'OCR Inward & Copilot',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      badge: pendingAiBills > 0 ? pendingAiBills : (activeAnomalies > 0 ? activeAnomalies : undefined),
      badgeColor: 'bg-purple-500 text-white'
    },
    {
      id: 'reports',
      label: 'Reports & MIS',
      subLabel: 'Profit, Aging & Ledger',
      icon: <BarChart3 className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'accounts',
      label: 'Accounts & GST',
      subLabel: 'Ledgers, Daybook & JVs',
      icon: <BookOpen className="w-4 h-4 text-sky-400" />
    },
    {
      id: 'crm',
      label: 'CRM & WhatsApp',
      subLabel: 'Customer 360 & Loyalty',
      icon: <Users className="w-4 h-4 text-pink-400" />
    },
    {
      id: 'schemes',
      label: 'Schemes & Pricing',
      subLabel: 'Slabs, Promos & MRPs',
      icon: <Tag className="w-4 h-4 text-indigo-400" />
    },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none overflow-y-auto backdrop-blur-2xl">
      <div className="p-3 space-y-2">
        {/* Dedicated Standalone POS Kiosk Launcher */}
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-extrabold text-white tracking-wide">POS TERMINAL</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">KIOSK</span>
          </div>
          <p className="text-[10px] text-emerald-200/70 leading-snug">
            Distraction-free, high-speed cashier billing mode.
          </p>
          <button
            onClick={() => {
              setIsStandalonePosMode(true);
              sounds.playTapClick();
            }}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all tactile-btn"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Launch Standalone POS</span>
          </button>
        </div>

        <div className="px-3 pt-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          ERP Modules
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                sounds.playTapClick();
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group tactile-btn ${
                isActive
                  ? 'bg-blue-600/20 border border-blue-500/40 text-white shadow-md shadow-blue-500/10'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-blue-500/20' : 'bg-slate-900 group-hover:bg-slate-850'
                }`}>
                  {item.icon}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {item.label}
                  </div>
                  <div className="text-[9px] text-slate-400 leading-tight">
                    {item.subLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {item.badge !== undefined && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-blue-600 text-white'}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer system status */}
      <div className="p-3 border-t border-white/[0.08] space-y-2 bg-slate-950/60">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-white/[0.06] text-[10px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Stores Active:</span>
            <span className="font-mono text-emerald-400 font-bold">5 Branches (ZIR, DAL, MCG, MUS)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Database:</span>
            <span className="font-mono text-cyan-400 font-bold">PostgreSQL v16</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">AI Sentinel:</span>
            <span className="text-purple-400 font-bold font-mono">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
