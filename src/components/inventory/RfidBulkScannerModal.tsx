import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, Package, CheckCircle2, AlertTriangle, 
  RefreshCw, X, Zap, ShieldCheck, Box
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const RfidBulkScannerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { showToast } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<any[]>([]);
  const [cartonVerified, setCartonVerified] = useState(false);

  const startRfidPortalScan = () => {
    setScanning(true);
    setScannedItems([]);
    setCartonVerified(false);

    // Simulate 40 RFID tag read pulses
    let count = 0;
    const interval = setInterval(() => {
      count += 4;
      sounds.playScanBeep();
      if (count >= 32) {
        clearInterval(interval);
        setScanning(false);
        setCartonVerified(true);
        sounds.playCheckoutSuccess();
        setScannedItems([
          { epc: 'E28011700000020F87123A01', style: 'Royal Velvet Sherwani', size: '40', color: 'Emerald Green', expected: 1, read: 1, status: 'Match' },
          { epc: 'E28011700000020F87123A02', style: 'Royal Velvet Sherwani', size: '42', color: 'Emerald Green', expected: 1, read: 1, status: 'Match' },
          { epc: 'E28011700000020F87123A03', style: 'Italian Wool Bandhgala', size: '38', color: 'Midnight Black', expected: 2, read: 2, status: 'Match' },
          { epc: 'E28011700000020F87123A04', style: 'Italian Wool Bandhgala', size: '40', color: 'Midnight Black', expected: 4, read: 4, status: 'Match' },
          { epc: 'E28011700000020F87123A05', style: 'Pure Linen Nehru Jacket', size: 'L', color: 'Ivory Beige', expected: 8, read: 8, status: 'Match' },
          { epc: 'E28011700000020F87123A06', style: 'Banarasi Brocade Kurta Set', size: 'XL', color: 'Mustard Gold', expected: 6, read: 6, status: 'Match' },
          { epc: 'E28011700000020F87123A07', style: 'Supima Cotton Formal Shirt', size: '42', color: 'Sky Blue', expected: 10, read: 10, status: 'Match' },
        ]);
        showToast('RFID Portal Verified', 'Box #CTN-2026-8801 verified: 32/32 RFID tags 100% matched to STN Manifest.', 'success');
      }
    }, 80);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-[#242424] text-[#1c1c1c] dark:text-white border border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-b border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-sm">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Ultra-Fast RFID Portal & Bulk Carton Audit</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                  860–960 MHz UHF
                </span>
              </div>
              <div className="text-[11px] text-[#5c5c5c] dark:text-white/60">
                Simultaneous multi-tag UHF RFID scanning without opening sealed cartons.
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Carton Selector Card */}
          <div className="p-4 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs">Sealed Carton Manifest: #CTN-2026-8801</div>
                <div className="text-[11px] text-[#5c5c5c] dark:text-white/60">
                  Source: Zirakpur Central Godown ➔ Destination: Dalhousie Showroom · 32 Total Garments
                </div>
              </div>
            </div>

            <button
              onClick={startRfidPortalScan}
              disabled={scanning}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition-all ${
                scanning
                  ? 'bg-teal-700 text-white animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white tactile-btn'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{scanning ? 'Reading UHF Waves...' : 'Trigger RFID Portal Scan'}</span>
            </button>
          </div>

          {/* Results Table */}
          {scannedItems.length > 0 ? (
            <div className="border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-b border-[#e0e0e0] dark:border-white/[0.08] font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  32 / 32 RFID Tags Decoded in 0.4 Seconds
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Inward Match</span>
              </div>

              <table className="w-full text-left">
                <thead className="bg-[#f3f3f3] dark:bg-[#242424] text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 border-b border-[#e0e0e0] dark:border-white/[0.08]">
                  <tr>
                    <th className="p-3">EPC Identifier</th>
                    <th className="p-3">Garment Style</th>
                    <th className="p-3">Size / Color</th>
                    <th className="p-3">Manifest Qty</th>
                    <th className="p-3">RFID Scanned</th>
                    <th className="p-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                  {scannedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="p-3 font-mono text-[11px] text-[#0078d4] dark:text-[#60cdff]">{item.epc}</td>
                      <td className="p-3 font-bold">{item.style}</td>
                      <td className="p-3 text-[#5c5c5c] dark:text-white/70">{item.size} · {item.color}</td>
                      <td className="p-3 font-mono">{item.expected} pcs</td>
                      <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400">{item.read} pcs</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 border border-dashed border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl flex flex-col items-center justify-center text-center space-y-2 text-[#5c5c5c] dark:text-white/40">
              <Radio className="w-12 h-12 opacity-30 animate-pulse" />
              <div className="text-xs font-semibold">Pass Carton Through RFID Portal</div>
              <div className="text-[10px]">
                Reads and reconciles up to 200 items/carton in less than 1 second.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-t border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-[#5c5c5c] dark:text-white/60">
            Loss Prevention & Anti-Theft: <strong className="text-emerald-600 dark:text-emerald-400">Gate Alarm Disarmed on Scanned Inward</strong>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0078d4] hover:bg-[#1a86d9] text-white text-xs font-bold transition-all tactile-btn"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
