/**
 * Card — Dark-themed container with border
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-[#27251F] border border-[#3A3A3A] rounded-xl p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
