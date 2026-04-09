/**
 * Badge — Colored pill label
 *
 * Built-in color presets: gold, green, red, blue, gray
 * Or pass a custom `color` hex string.
 */
const PRESETS = {
  gold: 'bg-[#FDB515]/20 text-[#FDB515] border-[#FDB515]/30',
  green: 'bg-[#2ECC71]/20 text-[#2ECC71] border-[#2ECC71]/30',
  red: 'bg-[#E74C3C]/20 text-[#E74C3C] border-[#E74C3C]/30',
  blue: 'bg-[#3498DB]/20 text-[#3498DB] border-[#3498DB]/30',
  gray: 'bg-[#8E8E8E]/20 text-[#8E8E8E] border-[#8E8E8E]/30',
};

export default function Badge({ children, preset = 'gold', color, className = '' }) {
  const presetClasses = PRESETS[preset] || PRESETS.gold;

  if (color) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
        style={{
          backgroundColor: `${color}20`,
          color: color,
          borderColor: `${color}50`,
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${presetClasses} ${className}`}
    >
      {children}
    </span>
  );
}
