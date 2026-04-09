import THEME from "../../data/theme";

export const Badge = ({ children, color = THEME.gold, bg = "rgba(253,181,21,0.15)", style, ...props }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, color, background: bg, letterSpacing: 0.5, textTransform: "uppercase", ...style }} {...props}>{children}</span>
);

export const Button = ({ children, onClick, variant = "primary", small, style: xs, ...p }) => {
  const b = { padding: small ? "6px 12px" : "10px 20px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: small ? 12 : 14, transition: "all 0.2s", letterSpacing: 0.3, fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" };
  const v = {
    primary: { background: THEME.gold, color: THEME.black },
    secondary: { background: THEME.charcoal, color: THEME.white },
    danger: { background: THEME.red, color: THEME.white },
    ghost: { background: "transparent", color: THEME.gold, border: `1px solid ${THEME.gold}` }
  };
  return <button onClick={onClick} style={{ ...b, ...v[variant], ...xs }} {...p}>{children}</button>;
};

export const Card = ({ children, style, ...props }) => (
  <div style={{ background: THEME.blackLight, borderRadius: 10, padding: 20, border: `1px solid ${THEME.charcoal}`, ...style }} {...props}>{children}</div>
);

export const Input = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 700, color: THEME.gray, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif" }}>{label}</label>}
    <input {...p} style={{ padding: "8px 12px", background: THEME.black, border: `1px solid ${THEME.charcoal}`, borderRadius: 6, color: THEME.white, fontSize: 14, fontFamily: "'Source Sans 3',sans-serif", outline: "none", ...(p.style || {}) }} />
  </div>
);

export const TextArea = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 700, color: THEME.gray, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif" }}>{label}</label>}
    <textarea {...p} style={{ padding: "8px 12px", background: THEME.black, border: `1px solid ${THEME.charcoal}`, borderRadius: 6, color: THEME.white, fontSize: 14, fontFamily: "'Source Sans 3',sans-serif", outline: "none", resize: "vertical", minHeight: 80, ...(p.style || {}) }} />
  </div>
);

export const SL = ({ children }) => (
  <label style={{ fontSize: 11, fontWeight: 700, color: THEME.gray, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif", marginBottom: 6, display: "block" }}>{children}</label>
);

export const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: THEME.blackLight, borderRadius: 12, padding: 24, border: `1px solid ${THEME.gold}`, maxWidth: wide ? 800 : 520, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontSize: 20, textTransform: "uppercase" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: THEME.gray, fontSize: 22, cursor: "pointer" }}>&#10005;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const ToggleChips = ({ players, selected, onToggle }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {players.map(p => (
      <button key={p.id} onClick={() => onToggle(p.id)} style={{
        padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700,
        fontFamily: "'Oswald',sans-serif", cursor: "pointer",
        background: selected[p.id] ? THEME.gold : THEME.black,
        color: selected[p.id] ? THEME.black : THEME.gray,
        border: `1px solid ${selected[p.id] ? THEME.gold : THEME.charcoal}`
      }}>{p.name.split(" ")[0]}</button>
    ))}
  </div>
);
