import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Store, Minus, Square, Copy, X, Building2
} from 'lucide-react';
import { sounds } from '../utils/audio';

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      isElectron: boolean;
      getVersion: () => string;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      isMaximized: () => Promise<boolean>;
      onMaximizeChange: (callback: (isMax: boolean) => void) => void;
    };
  }
}

export const Windows11Titlebar: React.FC<{ onOpenCommandPalette: () => void }> = ({ onOpenCommandPalette }) => {
  const { currentStore, cashInDrawer } = useApp();
  const [isMaximized, setIsMaximized] = useState(true);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized).catch(() => {});
      window.electronAPI.onMaximizeChange((max) => setIsMaximized(max));
    }
  }, []);

  const handleMinimize = () => {
    sounds.playTapClick();
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximizeToggle = () => {
    sounds.playTapClick();
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    } else {
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    sounds.playTapClick();
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div className="h-9 bg-[#1f1f1f] border-b border-white/[0.08] flex items-center justify-between select-none win11-titlebar-drag z-50 text-xs shrink-0">
      {/* Left: Windows 11 App Icon & Title */}
      <div className="flex items-center gap-2 px-3 win11-titlebar-no-drag">
        <div className="w-4.5 h-4.5 rounded bg-gradient-to-br from-[#0078d4] to-[#005a9e] flex items-center justify-center text-white shadow-sm font-bold text-[9px]">
          A
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white/90 text-xs tracking-tight">Apex Retail OS</span>
          <span className="text-white/30">|</span>
          <span className="text-white/60 text-[11px] font-normal flex items-center gap-1">
            <Store className="w-3 h-3 text-[#60cdff]" />
            {currentStore.name} ({currentStore.code})
          </span>
        </div>
      </div>

      {/* Center: Windows 11 Command / Search Bar Capsule */}
      <div className="flex-1 max-w-lg px-4 win11-titlebar-no-drag">
        <button
          onClick={() => {
            sounds.playTapClick();
            onOpenCommandPalette();
          }}
          className="w-full h-6.5 bg-[#2b2b2b] hover:bg-[#333333] border border-white/[0.08] hover:border-white/[0.14] rounded-md px-3 flex items-center justify-between text-white/60 hover:text-white text-xs transition-colors shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3 h-3 text-[#60cdff] group-hover:scale-105 transition-transform" />
            <span className="text-[11px] text-white/70">Search products, SKUs, inventory, bills...</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[9px] text-white/40 bg-black/20 px-1.5 py-0.5 rounded border border-white/[0.06]">
            <span>Ctrl+K</span>
          </div>
        </button>
      </div>

      {/* Right: Quick Tools & Windows 11 Caption Buttons */}
      <div className="flex items-center gap-1 win11-titlebar-no-drag">
        {/* Cash Drawer Status */}
        <div className="px-2 py-0.5 rounded bg-[#272727] border border-white/[0.06] text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mr-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>₹{cashInDrawer.toLocaleString()}</span>
        </div>

        {/* Caption Control: Minimize */}
        <button
          onClick={handleMinimize}
          className="win11-caption-btn text-white/70 hover:text-white"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Caption Control: Maximize / Restore */}
        <button
          onClick={handleMaximizeToggle}
          className="win11-caption-btn text-white/70 hover:text-white"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <Copy className="w-3 h-3 rotate-180" />
          ) : (
            <Square className="w-3 h-3" />
          )}
        </button>

        {/* Caption Control: Close */}
        <button
          onClick={handleClose}
          className="win11-caption-btn win11-close text-white/70 hover:text-white"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
