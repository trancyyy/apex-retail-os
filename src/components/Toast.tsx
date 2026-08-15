import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
        };

        const borderColors = {
          success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-100',
          warning: 'border-amber-500/30 bg-amber-950/80 text-amber-100',
          error: 'border-rose-500/30 bg-rose-950/80 text-rose-100',
          info: 'border-sky-500/30 bg-slate-900/90 text-sky-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md min-w-[300px] max-w-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${borderColors[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-xs">
              <div className="font-semibold tracking-wide text-sm">{toast.title}</div>
              <div className="text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
