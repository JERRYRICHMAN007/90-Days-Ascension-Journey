import { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Offline Mode Banner
 * Shows when backend/Supabase is unavailable
 * Allows app to work in offline mode with LocalStorage
 * NOTE: Only shows in development mode, hidden in production
 */
export function OfflineModeBanner() {
  // Don't show in production - early return
  if (import.meta.env.PROD) {
    return null;
  }

  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we're in offline mode
    const checkOfflineMode = () => {
      // Check localStorage for offline mode flag
      const offlineFlag = localStorage.getItem('ascension_offline_mode');
      if (offlineFlag === 'true') {
        setIsOffline(true);
      }
    };

    checkOfflineMode();

    // Listen for service unavailable errors
    const handleError = (event) => {
      if (event.detail?.code === 'SERVICE_UNAVAILABLE' || 
          event.detail?.message?.includes('service unavailable')) {
        setIsOffline(true);
        localStorage.setItem('ascension_offline_mode', 'true');
      }
    };

    window.addEventListener('service-unavailable', handleError);
    
    return () => {
      window.removeEventListener('service-unavailable', handleError);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!isOffline || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 backdrop-blur-sm border-b border-yellow-600"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-yellow-900" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">
                Offline Mode Active
              </p>
              <p className="text-xs text-yellow-800">
                Backend service unavailable. App is working with LocalStorage. Your progress is saved locally.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded hover:bg-yellow-600/50 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-yellow-900" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

