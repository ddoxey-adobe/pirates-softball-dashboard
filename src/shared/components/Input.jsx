/**
 * Input — Dark-themed text input
 */
export default function Input({ label, id, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm text-[#C4C4C4]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          bg-[#1B1B1B] border border-[#3A3A3A] rounded-lg px-3 py-2 text-sm
          text-[#FAF9F6] placeholder-[#8E8E8E]
          focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50 focus:border-[#FDB515]
          transition-colors
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
