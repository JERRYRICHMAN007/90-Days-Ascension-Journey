import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

/**
 * Renders modals at document.body so they aren't clipped by transformed ancestors (e.g. page transitions).
 */
export function ModalPortal({ open, onClose, children, contentClassName, ariaLabel = 'Dialog' }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className={cn(
          'relative w-full sm:max-w-xl max-h-[min(85vh,calc(100dvh-2rem))] my-auto flex flex-col',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
