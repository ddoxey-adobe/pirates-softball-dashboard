import React, { useState } from "react";
import THEME from "../../data/theme";
import { POSITIONS, GRADES, SKILL_AREAS } from "../../data/constants";

// ─── Inline-style UI primitives ────────────────────────────────────
// These mirror the original App.jsx components so the roster module
// renders identically without depending on the Tailwind shared layer.
// When the Tailwind migration phase happens these will be swapped out.

const Button = ({ children, onClick, variant = "primary", small, style: xs, ...p }) => {
  const base = {
    padding: small ? "6px 12px" : "10px 20px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: small ? 12 : 14,
    transition: "all 0.2s",
    letterSpacing: 0.3,
    fontFamily: "'Oswald',sans-serif",
    textTransform: "uppercase",
  };
  const variants = {
    primary: { background: THEME.gold, color: THEME.black },
    secondary: { background: THEME.charcoal, color: THEME.white },
    danger: { background: THEME.red, color: THEME.white },
    ghost: { background: "transparent", color: THEME.gold, border: `1px solid ${THEME.gold}` },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...xs }} {...p}>
      {children}
    </button>
  );
};

const Card = ({ children, style, ...props }) => (
  <div
    style={{
      background: THEME.blackLight,
      borderRadius: 10,
      padding: 20,
      border: `1px solid ${THEME.charcoal}`,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

const Badge = ({ children, color = THEME.gold, bg = "rgba(253,181,21,0.15)", style, ...props }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      color,
      background: bg,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      ...style,
    }}
    {...props}
  >
    {children}
  </span>
);

const Input = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && (
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: THEME.gray,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          fontFamily: "'Oswald',sans-serif",
        }}
      >
        {label}
      </label>
    )}
    <input
      {...p}
      style={{
        padding: "8px 12px",
        background: THEME.black,
        border: `1px solid ${THEME.charcoal}`,
        borderRadius: 6,
        color: THEME.white,
        fontSize: 14,
        fontFamily: "'Source Sans 3',sans-serif",
        outline: "none",
        ...(p.style || {}),
      }}
    />
  </div>
);

const Select = ({ label, children, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && (
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: THEME.gray,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          fontFamily: "'Oswald',sans-serif",
        }}
      >
        {label}
      </label>
    )}
    <select
      {...p}
      style={{
        padding: "8px 12px",
        background: THEME.black,
        border: `1px solid ${THEME.charcoal}`,
        borderRadius: 6,
        color: THEME.white,
        fontSize: 14,
        outline: "none",
        ...(p.style || {}),
      }}
    >
      {children}
    </select>
  </div>
);

const TextArea = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && (
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: THEME.gray,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          fontFamily: "'Oswald',sans-serif",
        }}
      >
        {label}
      </label>
    )}
    <textarea
      {...p}
      style={{
        padding: "8px 12px",
        background: THEME.black,
        border: `1px solid ${THEME.charcoal}`,
        borderRadius: 6,
        color: THEME.white,
        fontSize: 14,
        fontFamily: "'Source Sans 3',sans-serif",
        outline: "none",
        resize: "vertical",
        minHeight: 80,
        ...(p.style || {}),
      }}
    />
  </div>
);

const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: THEME.blackLight,
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${THEME.gold}`,
          maxWidth: wide ? 800 : 520,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              margin: 0,
              color: THEME.gold,
              fontFamily: "'Oswald',sans-serif",
              fontSize: 20,
              textTransform: "uppercase",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: THEME.gray,
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const StarRating = ({ value, onChange, size = 18 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        onClick={() => onChange(s)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontSize: size,
          lineHeight: 1,
          color: s <= value ? THEME.gold : THEME.grayLight,
        }}
      >
        ★
      </button>
    ))}
  </div>
);

const SL = ({ children }) => (
  <label
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: THEME.gray,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      fontFamily: "'Oswald',sans-serif",
      marginBottom: 6,
      display: "block",
    }}
  >
    {children}
  </label>
);

// ─── Helper factories ──────────────────────────────────────────────

const emptyPlayer = () => ({
  id: Date.now().toString(),
  name: "",
  nickname: "",
  grade: "7th",
  returning: false,
  yearsExp: 0,
  positions: [],
  primaryPosition: "",
  secondaryPositions: [],
  parentName: "",
  parentPhone: "",
  parentPhone2: "",
  parentEmail: "",
  school: "",
  jersey: "",
  skills: { Hitting: 0, Fielding: 0, Throwing: 0, Baserunning: 0, Pitching: 0, Attitude: 0 },
  notes: "",
  isPitcher: false,
  status: "active",
});

const emptyCoach = () => ({
  id: Date.now().toString(),
  name: "",
  role: "Assistant Coach",
  phone: "",
  email: "",
  specialties: [],
});

// ─── Constants local to roster ─────────────────────────────────────

const COACH_ROLES = [
  "Head Coach",
  "Assistant Coach",
  "Pitching Coach",
  "Hitting Coach",
  "Base Coach",
];

const COACH_SPECIALTIES = [
  "Hitting",
  "Pitching",
  "Throwing",
  "Infield",
  "Outfield",
  "Defense",
  "Strategy",
  "Baserunning",
  "Conditioning",
];

// ─── RosterPanel ───────────────────────────────────────────────────

const RosterPanel = ({ players = [], setPlayers, coaches = [], setCoaches }) => {
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyPlayer());
  const [filter, setFilter] = useState("all");
  const [editingCoach, setEditingCoach] = useState(null);
  const [showCoach, setShowCoach] = useState(false);
  const [coachForm, setCoachForm] = useState(emptyCoach());

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setPlayers((p) => p.map((x) => (x.id === editing ? { ...form } : x)));
    } else {
      setPlayers((p) => [...p, { ...form, id: Date.now().toString() }]);
    }
    setShow(false);
    setEditing(null);
    setForm(emptyPlayer());
  };

  const saveCoach = () => {
    if (!coachForm.name.trim()) return;
    if (editingCoach) {
      setCoaches((p) => p.map((x) => (x.id === editingCoach ? { ...coachForm } : x)));
    } else {
      setCoaches((p) => [...p, { ...coachForm, id: Date.now().toString() }]);
    }
    setShowCoach(false);
    setEditingCoach(null);
    setCoachForm(emptyCoach());
  };

  const filtered =
    filter === "all"
      ? players
      : filter === "returning"
        ? players.filter((p) => p.returning)
        : players.filter((p) => !p.returning);

  const avg = (p) => {
    const v = Object.values(p.skills).filter((x) => x > 0);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : "\u2014";
  };

  return (
    <div>
      {/* ── Filter bar + Add button ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "returning", "new"].map((f) => (
            <Button
              key={f}
              small
              variant={filter === f ? "primary" : "ghost"}
              onClick={() => setFilter(f)}
            >
              {f === "all"
                ? `All (${players.length})`
                : f === "returning"
                  ? `Returning (${players.filter((p) => p.returning).length})`
                  : `New (${players.filter((p) => !p.returning).length})`}
            </Button>
          ))}
        </div>
        <Button
          onClick={() => {
            setForm(emptyPlayer());
            setEditing(null);
            setShow(true);
          }}
        >
          + Add Player
        </Button>
      </div>

      {/* ── Player cards ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <p style={{ color: THEME.gray }}>No players yet.</p>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((p) => (
            <Card
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 14,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flex: 1,
                  minWidth: 180,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: p.returning ? THEME.gold : THEME.charcoal,
                    color: p.returning ? THEME.black : THEME.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Oswald',sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {p.jersey || p.name?.charAt(0) || "?"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: THEME.white, fontSize: 15 }}>
                    {p.name}
                    {p.nickname ? ` "${p.nickname}"` : ""}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                    <Badge>{p.grade}</Badge>
                    {p.returning && (
                      <Badge color={THEME.green} bg="rgba(46,204,113,0.15)">
                        Returning
                      </Badge>
                    )}
                    {p.isPitcher && (
                      <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">
                        Pitcher
                      </Badge>
                    )}
                    {p.school && (
                      <Badge color={THEME.gray} bg="rgba(142,142,142,0.1)">
                        {p.school}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Positions */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {p.primaryPosition && (
                  <span
                    style={{
                      padding: "2px 6px",
                      background: THEME.gold,
                      borderRadius: 4,
                      fontSize: 11,
                      color: THEME.black,
                      fontWeight: 700,
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    {p.primaryPosition}
                  </span>
                )}
                {(p.secondaryPositions || []).map((pos) => (
                  <span
                    key={pos}
                    style={{
                      padding: "2px 6px",
                      background: THEME.blue,
                      borderRadius: 4,
                      fontSize: 11,
                      color: THEME.white,
                      fontWeight: 700,
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    {pos}
                  </span>
                ))}
                {(p.positions || []).length > 0 &&
                  !p.primaryPosition &&
                  (p.positions || []).map((pos) => (
                    <span
                      key={pos}
                      style={{
                        padding: "2px 6px",
                        background: THEME.black,
                        borderRadius: 4,
                        fontSize: 11,
                        color: THEME.goldLight,
                        fontWeight: 700,
                        fontFamily: "'Oswald',sans-serif",
                      }}
                    >
                      {pos}
                    </span>
                  ))}
              </div>

              {/* Avg skill rating */}
              <div
                style={{
                  color: THEME.gold,
                  fontWeight: 700,
                  fontFamily: "'Oswald',sans-serif",
                  fontSize: 16,
                }}
              >
                {avg(p)}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 4 }}>
                <Button
                  small
                  variant="ghost"
                  onClick={() => {
                    setForm({ ...p });
                    setEditing(p.id);
                    setShow(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  small
                  variant="danger"
                  onClick={() => setPlayers((x) => x.filter((q) => q.id !== p.id))}
                >
                  ✕
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Coaching Staff Section ───────────────────────────────── */}
      <div style={{ marginTop: 40, paddingTop: 24, borderTop: `2px solid ${THEME.charcoal}` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              color: THEME.gold,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "'Oswald',sans-serif",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Coaching Staff
          </h3>
          <Button
            onClick={() => {
              setCoachForm(emptyCoach());
              setEditingCoach(null);
              setShowCoach(true);
            }}
          >
            + Add Coach
          </Button>
        </div>

        {coaches.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: THEME.gray }}>No coaches added yet.</p>
          </Card>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {coaches.map((c) => (
              <Card
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: THEME.blue,
                      color: THEME.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Oswald',sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {c.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: THEME.white, fontSize: 15 }}>
                      {c.name}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                      <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">
                        {c.role}
                      </Badge>
                      {(c.specialties || []).map((spec) => (
                        <Badge key={spec} color={THEME.gray} bg="rgba(142,142,142,0.1)">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <Button
                    small
                    variant="ghost"
                    onClick={() => {
                      setCoachForm({ ...c });
                      setEditingCoach(c.id);
                      setShowCoach(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    small
                    variant="danger"
                    onClick={() => setCoaches((x) => x.filter((q) => q.id !== c.id))}
                  >
                    ✕
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── Player Modal ─────────────────────────────────────────── */}
      <Modal
        open={show}
        onClose={() => {
          setShow(false);
          setEditing(null);
        }}
        title={editing ? "Edit Player" : "Add Player"}
        wide
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Nickname"
            value={form.nickname || ""}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          />
          <Select
            label="Grade"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
          <Input
            label="School"
            value={form.school || ""}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
          />
          <Input
            label="Jersey #"
            value={form.jersey || ""}
            onChange={(e) => setForm({ ...form, jersey: e.target.value })}
          />
          <Input
            label="Years Exp"
            type="number"
            min={0}
            value={form.yearsExp}
            onChange={(e) => setForm({ ...form, yearsExp: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <label
            style={{
              color: THEME.white,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <input
              type="checkbox"
              checked={form.returning}
              onChange={(e) => setForm({ ...form, returning: e.target.checked })}
            />{" "}
            Returning
          </label>
          <label
            style={{
              color: THEME.white,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <input
              type="checkbox"
              checked={form.isPitcher}
              onChange={(e) => setForm({ ...form, isPitcher: e.target.checked })}
            />{" "}
            Pitcher
          </label>
        </div>

        {/* Primary position */}
        <div style={{ marginTop: 12 }}>
          <SL>Primary Position</SL>
          <Select
            value={form.primaryPosition || ""}
            onChange={(e) => setForm({ ...form, primaryPosition: e.target.value })}
          >
            <option value="">Select primary position...</option>
            {POSITIONS.filter((x) => x !== "Bench").map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </Select>
        </div>

        {/* Secondary positions */}
        <div style={{ marginTop: 12 }}>
          <SL>Secondary Positions (Can Also Play)</SL>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {POSITIONS.filter((x) => x !== "Bench" && x !== form.primaryPosition).map((pos) => (
              <button
                key={pos}
                onClick={() =>
                  setForm({
                    ...form,
                    secondaryPositions: (form.secondaryPositions || []).includes(pos)
                      ? (form.secondaryPositions || []).filter((x) => x !== pos)
                      : [...(form.secondaryPositions || []), pos],
                  })
                }
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Oswald',sans-serif",
                  cursor: "pointer",
                  background: (form.secondaryPositions || []).includes(pos)
                    ? THEME.blue
                    : THEME.black,
                  color: (form.secondaryPositions || []).includes(pos) ? THEME.white : THEME.gray,
                  border: `1px solid ${
                    (form.secondaryPositions || []).includes(pos) ? THEME.blue : THEME.charcoal
                  }`,
                }}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginTop: 12 }}>
          <SL>Skills</SL>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SKILL_AREAS.map((sk) => (
              <div
                key={sk}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  background: THEME.black,
                  borderRadius: 6,
                }}
              >
                <span style={{ color: THEME.white, fontSize: 13 }}>{sk}</span>
                <StarRating
                  value={form.skills[sk]}
                  onChange={(v) => setForm({ ...form, skills: { ...form.skills, [sk]: v } })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          <Input
            label="Parent Name"
            value={form.parentName}
            onChange={(e) => setForm({ ...form, parentName: e.target.value })}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input
              label="Parent Phone 1"
              value={form.parentPhone}
              onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
            />
            <Input
              label="Parent Phone 2"
              value={form.parentPhone2 || ""}
              onChange={(e) => setForm({ ...form, parentPhone2: e.target.value })}
            />
          </div>
        </div>

        <TextArea
          label="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          style={{ marginTop: 12 }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <Button
            variant="ghost"
            onClick={() => {
              setShow(false);
              setEditing(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={save}>{editing ? "Save" : "Add"}</Button>
        </div>
      </Modal>

      {/* ── Coach Modal ──────────────────────────────────────────── */}
      <Modal
        open={showCoach}
        onClose={() => {
          setShowCoach(false);
          setEditingCoach(null);
        }}
        title={editingCoach ? "Edit Coach" : "Add Coach"}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input
            label="Name"
            value={coachForm.name}
            onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
          />
          <Select
            label="Role"
            value={coachForm.role}
            onChange={(e) => setCoachForm({ ...coachForm, role: e.target.value })}
          >
            {COACH_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <Input
            label="Phone"
            value={coachForm.phone || ""}
            onChange={(e) => setCoachForm({ ...coachForm, phone: e.target.value })}
          />
          <Input
            label="Email"
            value={coachForm.email || ""}
            onChange={(e) => setCoachForm({ ...coachForm, email: e.target.value })}
          />
        </div>

        {/* Specialties */}
        <div style={{ marginTop: 12 }}>
          <SL>Specialties</SL>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {COACH_SPECIALTIES.map((spec) => (
              <button
                key={spec}
                onClick={() =>
                  setCoachForm({
                    ...coachForm,
                    specialties: (coachForm.specialties || []).includes(spec)
                      ? coachForm.specialties.filter((x) => x !== spec)
                      : [...(coachForm.specialties || []), spec],
                  })
                }
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Oswald',sans-serif",
                  cursor: "pointer",
                  background: (coachForm.specialties || []).includes(spec)
                    ? THEME.gold
                    : THEME.black,
                  color: (coachForm.specialties || []).includes(spec) ? THEME.black : THEME.gray,
                  border: `1px solid ${
                    (coachForm.specialties || []).includes(spec) ? THEME.gold : THEME.charcoal
                  }`,
                }}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <Button
            variant="ghost"
            onClick={() => {
              setShowCoach(false);
              setEditingCoach(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={saveCoach}>{editingCoach ? "Save" : "Add"}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default RosterPanel;
