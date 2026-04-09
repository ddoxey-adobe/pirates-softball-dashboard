import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * Toast — Notification system with Pirates theme
 *
 * Wrap your app with <ToastProvider> and consume via useToast():
 *
 *   const toast = useToast();
 *   toast.success("Player saved!");
 *   toast.error("Could not delete");
 *   toast.warning("Lineup is incomplete");
 *   toast.info("Game starts at 6 PM");
 *
 * Options (second arg):
 *   duration — auto-dismiss delay in ms (default 3000, pass 0 to persist)
 */

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext(null);

// ---------------------------------------------------------------------------
// Type configuration
// ---------------------------------------------------------------------------

const TOAST_TYPES = {
  success: {
    bg: 'bg-emerald-600',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-[#E74C3C]',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-[#FDB515]',
    textOverride: 'text-[#1B1B1B]',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-blue-600',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    ),
  },
};

const DEFAULT_DURATION = 3000;

// ---------------------------------------------------------------------------
// Individual toast item
// ---------------------------------------------------------------------------

function ToastItem({ toast, onDismiss }) {
  const [state, setState] = useState('entering'); // entering | visible | exiting
  const timerRef = useRef(null);
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;

  useEffect(() => {
    // Trigger enter animation on next frame
    const raf = requestAnimationFrame(() => setState('visible'));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (toast.duration === 0) return;
    timerRef.current = setTimeout(() => dismiss(), toast.duration || DEFAULT_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [toast.duration]);

  const dismiss = useCallback(() => {
    setState('exiting');
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  const translateClass =
    state === 'entering'
      ? 'translate-y-2 opacity-0'
      : state === 'exiting'
        ? 'translate-y-2 opacity-0'
        : 'translate-y-0 opacity-100';

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg
        max-w-sm w-full pointer-events-auto
        transition-all duration-300 ease-in-out
        ${config.bg}
        ${config.textOverride || 'text-white'}
        ${translateClass}
      `}
    >
      {config.icon}
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={dismiss}
        className={`shrink-0 opacity-70 hover:opacity-100 transition-opacity ${config.textOverride || 'text-white'}`}
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, options = {}) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, type, message, duration: options.duration ?? DEFAULT_DURATION }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const api = useMemo(
    () => ({
      success: (msg, opts) => addToast('success', msg, opts),
      error: (msg, opts) => addToast('error', msg, opts),
      warning: (msg, opts) => addToast('warning', msg, opts),
      info: (msg, opts) => addToast('info', msg, opts),
      dismiss: removeToast,
    }),
    [addToast, removeToast],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toast container — bottom-center on mobile, top-right on desktop */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="
          fixed z-[9999] pointer-events-none
          bottom-4 left-1/2 -translate-x-1/2
          md:bottom-auto md:top-4 md:right-4 md:left-auto md:translate-x-0
          flex flex-col-reverse md:flex-col items-center md:items-end gap-2
          max-w-sm w-full px-4 md:px-0
        "
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be used inside <ToastProvider>');
  }
  return ctx;
}
