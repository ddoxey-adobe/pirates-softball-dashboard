import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * ConfirmDialog — Styled replacement for browser confirm()
 *
 * Wrap your app with <ConfirmProvider> and consume via useConfirm():
 *
 *   const confirm = useConfirm();
 *
 *   // Basic usage
 *   const ok = await confirm("Save changes?");
 *
 *   // Danger variant (red confirm button)
 *   const ok = await confirm("Delete this player?", { danger: true });
 *
 *   // Full options
 *   const ok = await confirm("Remove from roster?", {
 *     title: "Confirm Removal",
 *     confirmText: "Remove",
 *     cancelText: "Keep",
 *     danger: true,
 *   });
 */

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ConfirmContext = createContext(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({ message, ...options });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    resolveRef.current = null;
    setDialog(null);
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    resolveRef.current = null;
    setDialog(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <ConfirmOverlay
          dialog={dialog}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Overlay component
// ---------------------------------------------------------------------------

function ConfirmOverlay({ dialog, onConfirm, onCancel }) {
  const overlayRef = useRef(null);
  const confirmBtnRef = useRef(null);

  const {
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
  } = dialog;

  // Focus the confirm button on mount for keyboard accessibility
  useEffect(() => {
    confirmBtnRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  // Prevent body scrolling while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div className="bg-[#27251F] border border-[#3A3A3A] rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h3
            id="confirm-title"
            className="text-lg font-bold text-[#FDB515]"
          >
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p id="confirm-message" className="text-sm text-[#FAF9F6]/80 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#3A3A3A] bg-[#1B1B1B]/40">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 text-sm rounded-lg
              bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#FAF9F6] border border-[#555]
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50
            "
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className={`
              px-4 py-2 text-sm font-semibold rounded-lg
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50
              ${
                danger
                  ? 'bg-[#E74C3C] hover:bg-[#c0392b] text-white'
                  : 'bg-[#FDB515] hover:bg-[#FDCF58] text-[#1B1B1B]'
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Keyframe styles injected once (only if not already present)
// ---------------------------------------------------------------------------

if (typeof document !== 'undefined' && !document.getElementById('confirm-dialog-styles')) {
  const style = document.createElement('style');
  style.id = 'confirm-dialog-styles';
  style.textContent = `
    @keyframes confirm-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes confirm-scale-in {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in  { animation: confirm-fade-in 150ms ease-out; }
    .animate-scale-in { animation: confirm-scale-in 200ms ease-out; }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm() must be used inside <ConfirmProvider>');
  }
  return ctx;
}
