import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const PosLockModal: React.FC<{
  cashierName: string;
  onUnlock: () => void;
}> = ({ cashierName, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      sounds.playTapClick();
      if (newPin.length === 4) {
        // Any 4 digit PIN or default '1234' unlocks
        setTimeout(() => {
          onUnlock();
          sounds.playCheckoutSuccess();
        }, 150);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
    sounds.playTapClick();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
      <div className="max-w-xs w-full bg-slate-900 border border-white/[0.12] rounded-3xl p-6 text-center shadow-2xl space-y-5 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-black text-white">POS Register Locked</h3>
          <p className="text-xs text-slate-400 mt-1">{cashierName}</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-3 my-4">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                pin.length > idx
                  ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-md shadow-emerald-400/40'
                  : 'border-slate-700 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-750 active:scale-95 text-white font-mono text-lg font-bold border border-white/[0.06] transition-all shadow-sm"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-12 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 text-xs font-bold transition-all"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-750 active:scale-95 text-white font-mono text-lg font-bold border border-white/[0.06] transition-all"
          >
            0
          </button>
          <button
            onClick={() => onUnlock()}
            className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center transition-all shadow-md shadow-emerald-600/30"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Enter Cashier PIN (e.g. 1234)
        </div>
      </div>
    </div>
  );
};
