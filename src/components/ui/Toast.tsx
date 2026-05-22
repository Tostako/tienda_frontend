import { useApp } from '../../context/AppContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="flex items-center gap-3 bg-white shadow-lg border border-luxe-gray px-4 py-3 min-w-[300px]"
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-luxe-green shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-luxe-coral shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-luxe-blue shrink-0" />}
            <p className="text-sm font-montserrat text-luxe-black flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-luxe-gray-medium hover:text-luxe-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
