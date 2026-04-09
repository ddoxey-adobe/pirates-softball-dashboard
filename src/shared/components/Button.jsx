/**
 * Button — Pirates-themed button component
 *
 * Variants:
 *   primary   — gold background, dark text (default)
 *   secondary — charcoal background, light text
 *   ghost     — transparent, gold text, hover background
 *   danger    — red background
 */
const VARIANT_CLASSES = {
  primary:
    'bg-[#FDB515] hover:bg-[#FDCF58] text-[#1B1B1B] font-semibold shadow-sm',
  secondary:
    'bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#FAF9F6] border border-[#555]',
  ghost:
    'bg-transparent hover:bg-[#27251F] text-[#FDB515] border border-transparent',
  danger:
    'bg-[#E74C3C] hover:bg-[#c0392b] text-white font-semibold',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary}
        ${SIZE_CLASSES[size] || SIZE_CLASSES.md}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
