/**
 * Loading — Pirates gold spinner with optional message
 *
 * Props:
 *   message   — optional text below the spinner
 *   fullScreen — if true, centers in the full viewport (default false, inline)
 *   size      — "sm" | "md" | "lg" (default "md")
 *   className — additional container classes
 *
 * Usage:
 *   <Loading />
 *   <Loading message="Loading roster..." />
 *   <Loading fullScreen message="Starting up..." />
 */

const SIZE_MAP = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
};

const TEXT_SIZE_MAP = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export default function Loading({
  message,
  fullScreen = false,
  size = 'md',
  className = '',
}) {
  const spinner = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`
          ${SIZE_MAP[size] || SIZE_MAP.md}
          border-[#FDB515] border-t-transparent
          rounded-full animate-spin
        `}
        role="status"
        aria-label={message || 'Loading'}
      />
      {message && (
        <p className={`${TEXT_SIZE_MAP[size] || TEXT_SIZE_MAP.md} text-[#8E8E8E]`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1B1B]/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
