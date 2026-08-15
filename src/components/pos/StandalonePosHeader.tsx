import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreId } from '../../types';
import { 
  Building2, ChevronDown, Lock, Maximize2, Minimize2, 
  Volume2, VolumeX, LogOut, ShieldAlert, Sparkles, Wallet, 
  Clock, RefreshCw, Layers
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const StandalonePosHeader: React.FC<{
  onOpenShiftModal: () => void;
  onLockTerminal: () => void;
}> = ({ onOpenShiftModal, onLockTerminal }) => {
  const { 
    currentStoreId, setCurrentStoreId, currentStore, stores, 
    setIsStandalonePosMode, cashInDrawer, cashierName, showToast 
  } = useApp();

  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="h-16 bg-slate-950 border-b border-white/[0.1] px-5 flex items-center justify-between gap-4 select-none z-30 shadow-2xl backdrop-blur-2xl">
      {/* Brand & Store Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-extrabold text-emerald-400 font-sans text-lg">
              POS
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">EMERGES POS</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">STANDALONE KIOSK</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span>Lane #01</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online (Synced)
              </span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-white/[0.1] hidden md:block" />

        {/* 5-Store Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/[0.1] text-xs text-slate-200 hover:border-emerald-500/40 transition-all tactile-btn"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <div className="text-left leading-tight">
              <div className="font-bold text-white text-xs">{currentStore.name}</div>
              <div className="text-[9px] text-slate-400 font-mono">{currentStore.city} · {currentStore.code}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {storeDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Select Retail Branch:
              </div>
              {stores.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentStoreId(s.id as StoreId);
                    setStoreDropdownOpen(false);
                    showToast('Store Changed', `Switched register to ${s.name}`, 'info');
                    sounds.playTapClick();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between mt-1 ${
                    currentStoreId === s.id 
                      ? 'bg-emerald-600/20 border border-emerald-500/40 text-white shadow-sm' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className={`w-4 h-4 ${currentStoreId === s.id ? 'text-emerald-400' : 'text-slate-400'}`} />
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

      {/* Clock & Cash Drawer Status */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.08] text-slate-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime}</span>
        </div>

        <button
          onClick={onOpenShiftModal}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-700/50 text-emerald-200 text-xs transition-all tactile-btn"
          title="Cash Drawer & Shift Reconcile"
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          <div className="text-left leading-tight">
            <div className="font-mono font-extrabold text-emerald-300">₹{cashInDrawer.toLocaleString('en-IN')}</div>
            <div className="text-[9px] text-emerald-400/80">Cash in Drawer</div>
          </div>
        </button>

        {/* Lock Terminal */}
        <button
          onClick={onLockTerminal}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/[0.08] text-amber-300 transition-all tactile-btn"
          title="Lock POS Terminal (Cashier Away)"
        >
          <Lock className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/[0.08] text-slate-300 transition-all tactile-btn hidden sm:block"
          title="Toggle Fullscreen Mode (F11)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Exit Standalone POS Mode to Full ERP */}
        <button
          onClick={() => {
            setIsStandalonePosMode(false);
            sounds.playTapClick();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all tactile-btn"
          title="Switch to Full Enterprise ERP Suite"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">ERP Manager Mode</span>
        </button>
      </div>
    </header>
  );
};
