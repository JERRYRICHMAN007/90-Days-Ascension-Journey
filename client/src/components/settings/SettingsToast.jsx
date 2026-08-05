import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * Toast feedback for Settings global actions.
 */
export function SettingsToast({ message, type = 'success' }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] pointer-events-none"
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-lg backdrop-blur-md"
            style={{
              background: 'var(--bg-card)',
              borderColor: type === 'error' ? 'rgba(239,68,68,0.3)' : 'var(--border-subtle)',
            }}
          >
            {type === 'error' ? (
              <AlertTriangle className="size-4 text-red-400" />
            ) : (
              <CheckCircle2 className="size-4 text-[var(--neon-green)]" />
            )}
            <span className="text-sm font-medium text-[var(--text-primary)]">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
