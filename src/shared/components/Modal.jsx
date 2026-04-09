import { useEffect, useRef } from 'react';

/**
 * Modal — Overlay with centered content, click-outside-to-close
 */
export default function Modal({ open, onClose, title, children, className = '' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      <div
        className={`
          bg-[#27251F] border border-[#3A3A3A] rounded-2xl shadow-2xl
          w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto
          ${className}
        `}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A3A3A]">
            <h2 className="text-lg font-bold text-[#FDB515]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[#8E8E8E] hover:text-[#FAF9F6] text-xl leading-none"
            >
              x
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
