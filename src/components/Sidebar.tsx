import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import { 
  ShoppingBag, Layers, Truck, Sparkles, 
  BookOpen, Users, Tag, BarChart3, FileCheck, ClipboardList, 
  ChevronRight, Monitor, Store, Settings, Database
} from 'lucide-react';
import { sounds } from '../utils/audio';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, transfers, aiBills, anomalies, setIsStandalonePosMode } = useApp();

  const pendingTransfers = transfers.filter(t => t.status === 'In-Transit').length;
  const pendingAiBills = aiBills.filter(b => b.status === 'Pending Review').length;
  const activeAnomalies = anomalies.filter(a => !a.resolved).length;

  interface NavSection {
    title: string;
    items: {
      id: NavTab;
      label: string;
      subLabel: string;
      icon: React.ReactNode;
      badge?: number;
      badgeColor?: string;
    }[];
  }

  const sections: NavSection[] = [
    {
      title: 'Daily Operations',
      items: [
        {
          id: 'pos',
          label: 'POS Register',
          subLabel: 'Barcode Billing & Sales',
          icon: <ShoppingBag className="w-4 h-4 text-[#60cdff]" />
        },
        {
          id: 'approvals',
          label: 'Jangad & Approvals',
          subLabel: 'VIP Home Trials & Memos',
          icon: <FileCheck className="w-4 h-4 text-[#ff99a4]" />,
          badge: 2,
          badgeColor: 'bg-[#c42b1c] text-white'
        },
        {
          id: 'crm',
          label: 'Customer 360 & CRM',
          subLabel: 'WhatsApp & Loyalty Hub',
          icon: <Users className="w-4 h-4 text-[#f085b3]" />
        }
      ]
    },
    {
      title: 'Stock & Warehouse',
      items: [
        {
          id: 'inventory',
          label: 'Inventory & Matrix',
          subLabel: 'Lot, Box & Barcodes',
          icon: <Layers className="w-4 h-4 text-[#60cdff]" />
        },
        {
          id: 'purchases',
          label: 'Purchases & GRN',
          subLabel: 'Vendor PO & Inward',
          icon: <ClipboardList className="w-4 h-4 text-[#6ce5e8]" />
        },
        {
          id: 'transfers',
          label: 'Inter-Store Transfers',
          subLabel: 'STN & Logistics',
          icon: <Truck className="w-4 h-4 text-[#fce100]" />,
          badge: pendingTransfers > 0 ? pendingTransfers : undefined,
          badgeColor: 'bg-[#fce100] text-black font-bold'
        }
      ]
    },
    {
      title: 'Finance & AI Intelligence',
      items: [
        {
          id: 'aistudio',
          label: 'AI Copilot Studio',
          subLabel: 'OCR Digitization & Radar',
          icon: <Sparkles className="w-4 h-4 text-[#d19fff]" />,
          badge: pendingAiBills > 0 ? pendingAiBills : (activeAnomalies > 0 ? activeAnomalies : undefined),
          badgeColor: 'bg-[#8764b8] text-white'
        },
        {
          id: 'reports',
          label: 'MIS & Analytics',
          subLabel: 'Sales, Profit & Aging',
          icon: <BarChart3 className="w-4 h-4 text-[#6ccb5f]" />
        },
        {
          id: 'accounts',
          label: 'Accounts & GST Ledger',
          subLabel: 'Daybook & Tax Returns',
          icon: <BookOpen className="w-4 h-4 text-[#5bc5f2]" />
        },
        {
          id: 'schemes',
          label: 'Schemes & Promotions',
          subLabel: 'VIP Slabs & Pricing',
          icon: <Tag className="w-4 h-4 text-[#b197fc]" />
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#1f1f1f] border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="p-2 space-y-4">
        {/* Windows 11 Quick Kiosk Mode Launcher */}
        <div className="p-2.5 rounded-lg bg-[#272727] border border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-white/90">Kiosk Billing</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              STANDALONE
            </span>
          </div>

          <button
            onClick={() => {
              setIsStandalonePosMode(true);
              sounds.playTapClick();
            }}
            className="w-full py-1.5 px-3 rounded-md bg-[#0078d4] hover:bg-[#1a86d9] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow transition-colors tactile-btn"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Launch POS Kiosk</span>
          </button>
        </div>

        {/* Section Groups */}
        {sections.map((section, secIdx) => (
          <div key={secIdx} className="space-y-0.5">
            <div className="px-3 pb-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
              {section.title}
            </div>

            {section.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    sounds.playTapClick();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors group ${
                    isActive
                      ? 'fluent-nav-active'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-medium tracking-tight">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-white/40 group-hover:text-white/60 leading-tight">
                        {item.subLabel}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-[#0078d4] text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Windows 11 System Status Footer */}
      <div className="p-2 border-t border-white/[0.08] bg-[#1a1a1a]">
        <div className="p-2 rounded-md bg-[#242424] border border-white/[0.06] text-[10px] space-y-1">
          <div className="flex items-center justify-between text-white/60">
            <span>5-Store Matrix:</span>
            <span className="font-mono text-emerald-400 font-semibold">Online & Synced</span>
          </div>
          <div className="flex items-center justify-between text-white/60">
            <span>Engine:</span>
            <span className="font-mono text-[#60cdff] font-semibold">PostgreSQL v16</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
