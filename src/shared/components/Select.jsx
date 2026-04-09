/**
 * Select — Dark-themed dropdown
 */
export default function Select({ label, id, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm text-[#C4C4C4]">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          bg-[#1B1B1B] border border-[#3A3A3A] rounded-lg px-3 py-2 text-sm
          text-[#FAF9F6]
          focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50 focus:border-[#FDB515]
          transition-colors appearance-none
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
