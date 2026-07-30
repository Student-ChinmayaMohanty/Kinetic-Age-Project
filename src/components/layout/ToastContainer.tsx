import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md animate-in slide-in-from-right duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/50 dark:bg-emerald-950/90'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 text-amber-100 border-amber-800/50'
              : toast.type === 'danger'
              ? 'bg-rose-950/90 text-rose-100 border-rose-800/50'
              : 'bg-gray-900/90 text-gray-100 border-gray-800'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400" />}
            {toast.type === 'danger' && <XCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
          </div>

          <div className="flex-1 text-xs">
            <div className="font-bold text-sm leading-snug">{toast.title}</div>
            <div className="opacity-90 mt-0.5">{toast.message}</div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
