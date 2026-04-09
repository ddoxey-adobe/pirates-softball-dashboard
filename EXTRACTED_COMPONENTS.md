# Extracted Component Specifications

> Reference document for building the shared component library from `src/App.jsx`.
> Every pattern, variant, and constant extracted from the 868KB monolith.

---

## Table of Contents

1. [THEME Constant](#1-theme-constant)
2. [Data Constants](#2-data-constants)
3. [Storage Utilities](#3-storage-utilities)
4. [Button Component](#4-button-component)
5. [Card Component](#5-card-component)
6. [Modal Component](#6-modal-component)
7. [Badge Component](#7-badge-component)
8. [Input / Select / TextArea Components](#8-input--select--textarea-components)
9. [Tabs Component](#9-tabs-component)
10. [ToggleChips Component](#10-togglechips-component)
11. [StarRating Component](#11-starrating-component)
12. [SL (Section Label) Component](#12-sl-section-label-component)
13. [Chart Components](#13-chart-components)
14. [Toast Pattern](#14-toast-pattern)
15. [Additional Inline Patterns](#15-additional-inline-patterns)

---

## 1. THEME Constant

### Current Implementation (line 48)

```js
const THEME = {
  gold: "#FDB515",
  goldLight: "#FDCF58",
  goldDim: "#C89A12",
  black: "#1B1B1B",
  blackLight: "#27251F",
  charcoal: "#3A3A3A",
  white: "#FAF9F6",
  cream: "#F5F0E6",
  red: "#E74C3C",
  green: "#2ECC71",
  blue: "#3498DB",
  gray: "#8E8E8E",
  grayLight: "#C4C4C4",
};
```

### Tailwind Config Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        pirates: {
          gold:      "#FDB515",
          "gold-light": "#FDCF58",
          "gold-dim":   "#C89A12",
          black:     "#1B1B1B",
          "black-light": "#27251F",
          charcoal:  "#3A3A3A",
          white:     "#FAF9F6",
          cream:     "#F5F0E6",
          red:       "#E74C3C",
          green:     "#2ECC71",
          blue:      "#3498DB",
          gray:      "#8E8E8E",
          "gray-light": "#C4C4C4",
        }
      },
      fontFamily: {
        heading: ["'Oswald'", "sans-serif"],
        body:    ["'Source Sans 3'", "sans-serif"],
      }
    }
  }
};
```

### Dynamic Team Config (line 14-46)

The THEME colors are static, but the app also supports dynamic team configuration:

```js
const DEFAULT_TEAM_CONFIG = {
  name: "Pirates",
  mascot: "\U0001F3F4\u200D\u2620\uFE0F",
  season: "2026",
  league: "Lehi Rec Softball",
  ageGroup: "12U-14U",
  primaryColor: "#FDB515",   // maps to THEME.gold
  secondaryColor: "#1B1B1B", // maps to THEME.black
  accentColor: "#FAF9F6",    // maps to THEME.white
};
```

### Typography Conventions

Two font families are used throughout:

| Context | Font | Weight | Usage |
|---------|------|--------|-------|
| Headings, labels, buttons | `'Oswald', sans-serif` | 400-700 | All uppercase text, tab labels, section headers |
| Body text, inputs | `'Source Sans 3', sans-serif` | 300-700 | Paragraphs, form fields, notes |

Root container: `fontFamily: "'Source Sans 3',sans-serif"` (line 16280)

---

## 2. Data Constants

### POSITIONS (line 55)

```js
const POSITIONS = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "Bench"];
```

### GRADES (line 56)

```js
const GRADES = ["7th", "8th", "9th"];
```

### SKILL_AREAS (line 57)

```js
const SKILL_AREAS = ["Hitting", "Fielding", "Throwing", "Baserunning", "Pitching", "Attitude"];
```

### AB_RESULTS (line 58-72)

```js
const AB_RESULTS = [
  { code: "1B", label: "1B", type: "hit", color: "#2ECC71" },
  { code: "2B", label: "2B", type: "hit", color: "#2ECC71" },
  { code: "3B", label: "3B", type: "hit", color: "#2ECC71" },
  { code: "HR", label: "HR", type: "hit", color: "#F1C40F" },
  { code: "BB", label: "BB", type: "on",  color: "#3498DB" },
  { code: "HBP", label: "HBP", type: "on",  color: "#3498DB" },
  { code: "K",  label: "K",  type: "out", color: "#E74C3C" },
  { code: "\ua4d8", label: "\ua4d8", type: "out", color: "#E74C3C" },
  { code: "GO", label: "GO", type: "out", color: "#8E8E8E" },
  { code: "FO", label: "FO", type: "out", color: "#8E8E8E" },
  { code: "FC", label: "FC", type: "on",  color: "#8E8E8E" },
  { code: "SAC", label: "SAC", type: "out", color: "#8E8E8E" },
  { code: "E",  label: "E",  type: "on",  color: "#E67E22" },
];
```

### Helper functions (lines 73-76)

```js
const isHit = (code) => ["1B","2B","3B","HR"].includes(code);
const isOnBase = (code) => ["1B","2B","3B","HR","BB","HBP","FC","E"].includes(code);
const isOut = (code) => ["K","\ua4d8","GO","FO","SAC"].includes(code);
const abColor = (code) => (AB_RESULTS.find(a => a.code === code) || {}).color || THEME.gray;
```

### STORAGE_KEYS (line 3)

```js
const STORAGE_KEYS = {
  PLAYERS: "pirates-players-2026v3",
  COACHES: "pirates-coaches-2026v1",
  PRACTICES: "pirates-practices-2026v3",
  MESSAGES: "pirates-messages-2026v3",
  GAMELOGS: "pirates-gamelogs-2026v1",
  PRACTICELOGS: "pirates-practicelogs-2026v1",
  SCOUTINGREPORTS: "pirates-scouting-reports-2026v1",
  OPPONENTTEAMS: "pirates-opponent-teams-2026v1",
};
```

### ALL_BACKUP_KEYS (line 814)

```js
const ALL_BACKUP_KEYS = [
  ...Object.values(STORAGE_KEYS),
  "pirates-practices-unified-2026v1",
  "pirates-lineup-templates-2026v2",
  "pirates-lineups-2026v1",
  "pirates-goals-2026v1",
  "pirates-alignment-library-2026v2",
  "pirates-stats-sidebar-open",
  "pirates-reports-collapsed",
];
```

---

## 3. Storage Utilities

### loadStore / saveStore (lines 811-812)

```js
const loadStore = async (key, fb) => {
  try {
    const r = await window.storage.get(key);
    return r?.value ? JSON.parse(r.value) : fb;
  } catch {
    return fb;
  }
};

const saveStore = async (key, d) => {
  try {
    await window.storage.set(key, JSON.stringify(d));
  } catch {}
};
```

**API:**
- `window.storage.get(key)` -- returns `{ value: string }` or null
- `window.storage.set(key, string)` -- persists a string value
- All values are JSON serialized/deserialized by the wrapper functions
- `fb` parameter is the fallback default value

### Usage Patterns

```js
// Loading on mount
useEffect(() => { loadStore(STORAGE_KEYS.GAMELOGS, []).then(setLogs); }, []);

// Saving on state change
useEffect(() => { saveStore(STORAGE_KEYS.GAMELOGS, logs); }, [logs]);

// Direct window.storage usage (for seeding/resetting)
window.storage.set(STORAGE_KEYS.PLAYERS, JSON.stringify(SEED_PLAYERS));
const r = await window.storage.get(STORAGE_KEYS.PLAYERS);
```

### Team Config Storage (lines 29-44)

Separate from window.storage -- uses `localStorage` directly:

```js
const TEAM_CONFIG_STORAGE_KEY = "team-config-v1";

function loadTeamConfig() {
  try {
    const saved = localStorage.getItem(TEAM_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_TEAM_CONFIG, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_TEAM_CONFIG };
}

function saveTeamConfig(config) {
  try {
    localStorage.setItem(TEAM_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {}
}
```

### Export / Import (lines 825-889)

```js
const handleExportData = async () => {
  // Reads all ALL_BACKUP_KEYS from localStorage
  // Creates a JSON blob with _meta header and data
  // Triggers file download: "pirates-backup-YYYY-MM-DD.json"
};

const handleImportData = () => {
  // Opens file picker for .json
  // Validates _meta and data structure
  // Confirms with user
  // Writes all keys to localStorage
  // Reloads page
};
```

---

## 4. Button Component

### Current Implementation (line 895)

```jsx
const Button = ({ children, onClick, variant = "primary", small, style: xs, ...p }) => {
  const b = {
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
  const v = {
    primary:   { background: THEME.gold,        color: THEME.black },
    secondary: { background: THEME.charcoal,     color: THEME.white },
    danger:    { background: THEME.red,          color: THEME.white },
    ghost:     { background: "transparent",      color: THEME.gold, border: `1px solid ${THEME.gold}` },
  };
  return <button onClick={onClick} style={{ ...b, ...v[variant], ...xs }} {...p}>{children}</button>;
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | -- | Button label |
| `onClick` | function | -- | Click handler |
| `variant` | `"primary" \| "secondary" \| "danger" \| "ghost"` | `"primary"` | Visual variant |
| `small` | boolean | false | Compact size (6px/12px padding, 12px font) |
| `style` | object | -- | Override styles |
| `...p` | any | -- | Passed through to `<button>` |

### Variant Details

| Variant | Background | Text Color | Border |
|---------|-----------|------------|--------|
| `primary` | `#FDB515` (gold) | `#1B1B1B` (black) | none |
| `secondary` | `#3A3A3A` (charcoal) | `#FAF9F6` (white) | none |
| `danger` | `#E74C3C` (red) | `#FAF9F6` (white) | none |
| `ghost` | transparent | `#FDB515` (gold) | 1px solid gold |

### Size Variants

| Size | Padding | Font Size |
|------|---------|-----------|
| default | `10px 20px` | 14px |
| `small` | `6px 12px` | 12px |

### Tailwind Replacement Classes

```
/* Base */
rounded-md cursor-pointer font-bold font-heading uppercase tracking-wide transition-all duration-200

/* Primary */
bg-pirates-gold text-pirates-black

/* Secondary */
bg-pirates-charcoal text-pirates-white

/* Danger */
bg-pirates-red text-pirates-white

/* Ghost */
bg-transparent text-pirates-gold border border-pirates-gold

/* Default size */
px-5 py-2.5 text-sm

/* Small size */
px-3 py-1.5 text-xs
```

### Usage Examples (from codebase)

```jsx
// Primary (default)
<Button onClick={save}>Save</Button>
<Button onClick={save}>{editing ? "Save" : "Add"}</Button>

// Small primary
<Button small onClick={e => { e.stopPropagation(); startPractice(p); }}>Start Practice</Button>

// Ghost
<Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button>
<Button small variant="ghost" onClick={() => { setForm({...p}); setEditing(p.id); setShow(true); }}>Edit</Button>

// Danger
<Button small variant="danger" onClick={() => setPlayers(x => x.filter(q => q.id !== p.id))}>X</Button>

// With style override (common pattern)
<Button small onClick={() => setPrimary(alignment.id)} style={{ background: THEME.gold, color: THEME.black }}>Set Primary</Button>
<Button onClick={saveHighlight} style={{ background: THEME.gold }}>Save Highlight</Button>
<Button onClick={saveAlignment} style={{ background: THEME.green }}>Save Alignment</Button>
<Button small onClick={() => setActiveGame(lineup)} style={{ background: THEME.blue }}>Start Game</Button>

// Filter buttons using Button
<Button key={f} small variant={filter===f?"primary":"ghost"} onClick={() => setFilter(f)}>All (12)</Button>
```

### Additional Inline Button Patterns (NOT using Button component)

These are raw `<button>` elements with inline styles found throughout the codebase. They represent additional variants that should be consolidated into the Button component:

**Icon button (close/dismiss):**
```jsx
<button onClick={onClose} style={{
  background: "none", border: "none", color: THEME.gray,
  fontSize: 22, cursor: "pointer"
}}>X</button>
```

**Mini increment/decrement:**
```jsx
<button onClick={() => onChange(Math.max(0, value - 1))} style={{
  background: THEME.charcoal, border: "none", color: THEME.white,
  width: 36, height: 36, borderRadius: 6, cursor: "pointer", fontSize: 20
}}>-</button>
```

**Small increment (inning counter):**
```jsx
<button style={{
  background: THEME.charcoal, border: "none", color: THEME.white,
  width: 28, height: 28, borderRadius: 4, cursor: "pointer", fontSize: 14
}}>-</button>
```

**bigBtn helper (line 5549):**
```jsx
const bigBtn = (label, color, bg, onClick) => (
  <button onClick={onClick} style={{
    padding: "16px 0", fontSize: 16, fontWeight: 700, borderRadius: 8,
    cursor: "pointer", background: bg, color, border: "none",
    fontFamily: "'Oswald',sans-serif", width: "100%", minHeight: 52
  }}>{label}</button>
);
```

**Game scorer buttons (strike/ball/foul):**
```jsx
<button style={{
  padding: "14px 0", fontSize: 15, fontWeight: 700, borderRadius: 8,
  cursor: "pointer", background: "#2ECC71", color: THEME.black,
  border: "none", fontFamily: "'Oswald',sans-serif"
}}>Strike</button>

<button style={{
  padding: "14px 0", fontSize: 15, fontWeight: 700, borderRadius: 8,
  cursor: "pointer", background: "#E74C3C", color: THEME.white,
  border: "none", fontFamily: "'Oswald',sans-serif"
}}>Ball</button>
```

**Pill/chip filter button (drill category):**
```jsx
<button style={{
  padding: "3px 8px", fontSize: 11, borderRadius: 4, cursor: "pointer",
  background: active ? THEME.gold : THEME.black,
  color: active ? THEME.black : THEME.gray,
  border: `1px solid ${active ? THEME.gold : THEME.charcoal}`,
  fontWeight: 700, textTransform: "capitalize"
}}>{category}</button>
```

**Link-style button (text only):**
```jsx
<button style={{
  color: THEME.gold, textDecoration: "underline",
  background: "none", border: "none", cursor: "pointer"
}}>Add teams first</button>
```

**Toolbar/header button:**
```jsx
<button style={{
  background: "none", border: `1px solid ${THEME.charcoal}`,
  color: THEME.gray, padding: "6px 12px", borderRadius: 6,
  fontSize: 11, cursor: "pointer", fontFamily: "'Oswald',sans-serif",
  textTransform: "uppercase"
}}>Reset Roster</button>
```

**Toolbar button (gold outlined):**
```jsx
<button style={{
  background: "none", border: `1px solid ${THEME.gold}`,
  color: THEME.gold, padding: "6px 12px", borderRadius: 6,
  fontSize: 11, cursor: "pointer", fontFamily: "'Oswald',sans-serif",
  textTransform: "uppercase", fontWeight: 700
}}>Export Data</button>
```

**Undo button (red outlined):**
```jsx
<button style={{
  padding: "8px 20px", fontSize: 13, borderRadius: 6, cursor: "pointer",
  background: "transparent", color: THEME.red,
  border: `1px solid ${THEME.red}40`, fontWeight: 600
}}>Undo Last At-Bat</button>
```

---

## 5. Card Component

### Current Implementation (line 896)

```jsx
const Card = ({ children, style, ...props }) => (
  <div style={{
    background: THEME.blackLight,  // #27251F
    borderRadius: 10,
    padding: 20,
    border: `1px solid ${THEME.charcoal}`,  // 1px solid #3A3A3A
    ...style
  }} {...props}>
    {children}
  </div>
);
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | -- | Card content |
| `style` | object | -- | Override any base styles |
| `...props` | any | -- | Passed through to `<div>` (including `onClick`) |

### Tailwind Replacement Classes

```
bg-pirates-black-light rounded-[10px] p-5 border border-pirates-charcoal
```

### Card Variants Found in Usage

**1. Default card:**
```jsx
<Card>...</Card>
// bg: #27251F, borderRadius: 10, padding: 20, border: 1px solid #3A3A3A
```

**2. Compact card (padding override):**
```jsx
<Card style={{ padding: 14 }}>...</Card>
<Card style={{ padding: 12 }}>...</Card>
<Card style={{ padding: 16 }}>...</Card>
```

**3. Empty state card:**
```jsx
<Card style={{ textAlign: "center", padding: 40 }}>
  <p style={{ color: THEME.gray }}>No players yet.</p>
</Card>
```

**4. List item card:**
```jsx
<Card style={{
  display: "flex", justifyContent: "space-between",
  alignItems: "center", padding: 14, flexWrap: "wrap", gap: 10
}}>...</Card>
```

**5. Clickable card:**
```jsx
<Card key={p.id} style={{ padding: 14, cursor: "pointer" }}
  onClick={() => setExp(exp === p.id ? null : p.id)}>...</Card>
```

**6. Highlighted card (gold border):**
```jsx
<Card style={{ padding: 14, cursor: "pointer", border: `1px solid ${THEME.gold}40` }}>...</Card>
```

**7. Active/selected card (blue border):**
```jsx
<Card style={{ padding: 14, cursor: "pointer", border: `2px solid ${THEME.blue}` }}>...</Card>
```

**8. Danger card (red border + red background):**
```jsx
<Card style={{
  padding: 16, marginTop: 16,
  border: `2px solid ${THEME.red}`,
  background: "rgba(231,76,60,0.05)"
}}>...</Card>
```

**9. Error card:**
```jsx
<Card style={{
  padding: 12, marginBottom: 16,
  background: "rgba(231,76,60,0.1)",
  border: `1px solid ${THEME.red}`
}}>...</Card>
```

**10. Dark card (using THEME.black background):**
```jsx
<Card style={{ padding: 16, marginBottom: 16, background: THEME.black }}>...</Card>
```

**11. Centered content card:**
```jsx
<Card style={{ padding: 20, textAlign: "center", background: THEME.black }}>...</Card>
```

### Inline Card Pattern (not using Card component)

The TryoutsPanel replicates the card pattern inline (line 14076):
```js
const cardStyle = {
  background: THEME.blackLight,
  borderRadius: 10,
  padding: 20,
  border: "1px solid " + THEME.charcoal,
  marginBottom: 16,
};
```

### Stat Card Pattern (header area, line 16363)

```jsx
<div style={{
  background: THEME.blackLight, padding: "10px 16px",
  borderRadius: 8, border: `1px solid ${THEME.charcoal}`, minWidth: 80
}}>
  <div style={{ color: THEME.gold, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{value}</div>
  <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase" }}>{label}</div>
</div>
```

---

## 6. Modal Component

### Current Implementation (line 1084)

```jsx
const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: THEME.blackLight,      // #27251F
        borderRadius: 12,
        padding: 24,
        border: `1px solid ${THEME.gold}`, // gold border
        maxWidth: wide ? 800 : 520,
        width: "100%",
        maxHeight: "85vh",
        overflowY: "auto",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 16
        }}>
          <h3 style={{
            margin: 0, color: THEME.gold,
            fontFamily: "'Oswald',sans-serif",
            fontSize: 20, textTransform: "uppercase"
          }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            color: THEME.gray, fontSize: 22, cursor: "pointer"
          }}>X</button>
        </div>
        {children}
      </div>
    </div>
  );
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | -- | Controls visibility |
| `onClose` | function | -- | Called on backdrop click or close button |
| `title` | string | -- | Modal header text (rendered uppercase, gold) |
| `children` | ReactNode | -- | Modal body content |
| `wide` | boolean | false | If true, maxWidth is 800px instead of 520px |

### Tailwind Replacement Classes

```
/* Overlay */
fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-5

/* Panel */
bg-pirates-black-light rounded-xl p-6 border border-pirates-gold w-full max-h-[85vh] overflow-y-auto
/* default: max-w-[520px] */
/* wide: max-w-[800px] */

/* Title */
text-pirates-gold font-heading text-xl uppercase

/* Close button */
bg-transparent border-none text-pirates-gray text-[22px] cursor-pointer
```

### Usage Examples

```jsx
<Modal open={show} onClose={() => setShow(false)} title="Add Player">
  <Input label="Name" value={form.name} onChange={...} />
  <Button onClick={save}>Save</Button>
</Modal>

<Modal open={show} onClose={close} title={ed ? "Edit Game" : "New Game"} wide>
  {/* Game log editor with sub-tabs */}
</Modal>
```

### Alternate Inline Modal Pattern (TeamSettingsModal, line 16137)

A slightly different modal pattern used for team settings:

```jsx
<div style={{
  position: "fixed", inset: 0, zIndex: 9999,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(0,0,0,0.7)"
}} onClick={onClose}>
  <div style={{
    background: THEME.black,           // #1B1B1B (darker than Modal)
    border: `2px solid ${THEME.gold}`, // 2px (thicker than Modal)
    borderRadius: 16,                  // 16px (more rounded than Modal)
    padding: 28,
    width: "90%", maxWidth: 420,
    maxHeight: "85vh", overflowY: "auto",
    boxShadow: `0 8px 32px rgba(0,0,0,0.6)`
  }} onClick={e => e.stopPropagation()}>
    ...
  </div>
</div>
```

Differences from `Modal`: darker background, thicker border, more rounded, has box shadow, slightly different z-index.

### Inline Sub-Modal Pattern (LineupBuilder, line 4517)

```jsx
<div onClick={e => e.stopPropagation()} style={{
  background: THEME.blackLight, borderRadius: 12, padding: 24,
  border: "1px solid " + THEME.gold, maxWidth: 520, width: "100%",
  maxHeight: "85vh", overflowY: "auto"
}}>
```

---

## 7. Badge Component

### Current Implementation (line 894)

```jsx
const Badge = ({ children, color = THEME.gold, bg = "rgba(253,181,21,0.15)", style, ...props }) => (
  <span style={{
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    color,
    background: bg,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    ...style
  }} {...props}>
    {children}
  </span>
);
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | -- | Badge label text |
| `color` | string | `THEME.gold` (`"#FDB515"`) | Text color |
| `bg` | string | `"rgba(253,181,21,0.15)"` | Background color |
| `style` | object | -- | Override styles |
| `...props` | any | -- | Passed through to `<span>` |

### Tailwind Replacement Classes

```
inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase
```

### Color Variants Found in Usage

| Variant | color | bg | Usage |
|---------|-------|----|-------|
| **Default (gold)** | `THEME.gold` | `rgba(253,181,21,0.15)` | Generic badges, "PLANNED", drill info |
| **Green** | `THEME.green` | `rgba(46,204,113,0.15)` | "Returning", "COMPLETED", focus areas, Win result |
| **Blue** | `THEME.blue` | `rgba(52,152,219,0.15)` | "Pitcher", coach assignments, "IN PROGRESS", drill counts |
| **Gray** | `THEME.gray` | `rgba(142,142,142,0.1)` | School name, location, focus tags |
| **White** | `THEME.white` | `rgba(255,255,255,0.1)` | Attendance count |
| **Red** | `THEME.red` | `rgba(231,76,60,0.15)` | Loss result |
| **Dynamic** | varies | `${color}20` | e.g. `<Badge color={badgeColor} bg={badgeColor + "20"}>` |

### Usage Examples

```jsx
// Default gold
<Badge>7th</Badge>
<Badge>15min</Badge>
<Badge>PLANNED</Badge>

// Green
<Badge color={THEME.green} bg="rgba(46,204,113,0.15)">Returning</Badge>
<Badge color={THEME.green} bg="rgba(46,204,113,0.15)">COMPLETED</Badge>

// Blue
<Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">Pitcher</Badge>
<Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{coach}</Badge>
<Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{count} drills</Badge>

// Gray
<Badge color={THEME.gray} bg="rgba(142,142,142,0.1)">{school}</Badge>
<Badge color={THEME.gray} bg={`${THEME.gray}20`}>{position}</Badge>

// White
<Badge color={THEME.white} bg="rgba(255,255,255,0.1)">{count} expected</Badge>

// With style override
<Badge color={THEME.gold} bg="rgba(253,181,21,0.15)" style={{ fontSize: 10 }}>PRIMARY</Badge>

// Conditional color
<Badge color={result === "W" ? THEME.green : result === "L" ? THEME.red : THEME.gray}
       bg={result === "W" ? "rgba(46,204,113,0.15)" : result === "L" ? "rgba(231,76,60,0.15)" : "rgba(142,142,142,0.15)"}>
  {result}
</Badge>
```

---

## 8. Input / Select / TextArea Components

### Input (line 897)

```jsx
const Input = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && (
      <label style={{
        fontSize: 11, fontWeight: 700, color: THEME.gray,
        textTransform: "uppercase", letterSpacing: 0.8,
        fontFamily: "'Oswald',sans-serif"
      }}>{label}</label>
    )}
    <input {...p} style={{
      padding: "8px 12px",
      background: THEME.black,                    // #1B1B1B
      border: `1px solid ${THEME.charcoal}`,      // 1px solid #3A3A3A
      borderRadius: 6,
      color: THEME.white,                         // #FAF9F6
      fontSize: 14,
      fontFamily: "'Source Sans 3',sans-serif",
      outline: "none",
      ...(p.style || {})
    }} />
  </div>
);
```

### Select (line 898)

```jsx
const Select = ({ label, children, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && (
      <label style={{
        fontSize: 11, fontWeight: 700, color: THEME.gray,
        textTransform: "uppercase", letterSpacing: 0.8,
        fontFamily: "'Oswald',sans-serif"
      }}>{label}</label>
    )}
    <select {...p} style={{
      padding: "8px 12px",
      background: THEME.black,
      border: `1px solid ${THEME.charcoal}`,
      borderRadius: 6,
      color: THEME.white,
      fontSize: 14,
      outline: "none",
      ...(p.style || {})
    }}>
      {children}
    </select>
  </div>
);
```

### TextArea (line 899)

```jsx
const TextArea = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && (
      <label style={{
        fontSize: 11, fontWeight: 700, color: THEME.gray,
        textTransform: "uppercase", letterSpacing: 0.8,
        fontFamily: "'Oswald',sans-serif"
      }}>{label}</label>
    )}
    <textarea {...p} style={{
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
      ...(p.style || {})
    }} />
  </div>
);
```

### Shared Form Field Props

All three components share:

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Optional uppercase label above field |
| `style` | object | Merged into field element styles |
| `...p` | any | Spread onto the native element (value, onChange, placeholder, type, etc.) |

### Shared Label Style (used by all form fields + SL)

```js
{
  fontSize: 11,
  fontWeight: 700,
  color: THEME.gray,        // #8E8E8E
  textTransform: "uppercase",
  letterSpacing: 0.8,
  fontFamily: "'Oswald',sans-serif",
}
```

### Tailwind Replacement Classes

```
/* Label */
text-[11px] font-bold text-pirates-gray uppercase tracking-wider font-heading

/* Input / Select */
px-3 py-2 bg-pirates-black border border-pirates-charcoal rounded-md
text-pirates-white text-sm font-body outline-none

/* TextArea additionally */
resize-y min-h-[80px]

/* Wrapper */
flex flex-col gap-1
```

### Alternate Input Style (TryoutsPanel, line 14103)

```js
const inputStyle = {
  padding: "8px 12px",
  background: THEME.black,
  border: "1px solid " + THEME.charcoal,
  borderRadius: 6,
  color: THEME.white,
  fontSize: 14,
  fontFamily: "'Source Sans 3',sans-serif",
  outline: "none",
  width: "100%",  // adds width: 100%
};
```

### Alternate Field Style (TeamSettingsModal, line 16133)

```js
const fieldStyle = {
  width: "100%",
  padding: "10px 12px",            // slightly taller
  borderRadius: 8,                 // more rounded
  border: `1px solid ${THEME.charcoal}`,
  background: THEME.blackLight,    // different! Uses blackLight instead of black
  color: THEME.white,
  fontSize: 14,
  fontFamily: "inherit",
  boxSizing: "border-box",
};
```

### Usage Examples

```jsx
<Input label="Player Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
<Input label="Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />

<Select label="Grade" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
</Select>

<TextArea label="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} />
```

### Inline Form Fields (not using components)

Many form fields in the codebase use inline styles instead of the Input/Select/TextArea components. The inline style pattern:

```jsx
<input style={{
  padding: "6px 8px",
  background: THEME.blackLight,
  border: `1px solid ${THEME.charcoal}`,
  borderRadius: 4,
  color: THEME.white,
  fontSize: 13,
  width: 80
}} />

<select style={{
  padding: "10px 12px",
  background: THEME.blackLight,
  border: `1px solid ${THEME.charcoal}`,
  borderRadius: 6,
  color: THEME.white,
  fontSize: 14
}}>...</select>

<textarea style={{
  width: "100%", minHeight: 300, padding: 12,
  background: THEME.black,
  border: `1px solid ${THEME.charcoal}`,
  borderRadius: 6, color: THEME.white,
  fontSize: 13, fontFamily: "'Source Sans 3',sans-serif",
  outline: "none", resize: "vertical", lineHeight: 1.6,
  boxSizing: "border-box"
}} />
```

---

## 9. Tabs Component

### Current Implementation (line 1086)

```jsx
const Tabs = ({ tabs, active, onSelect }) => (
  <div style={{
    display: "flex", gap: 0,
    borderBottom: `2px solid ${THEME.charcoal}`,
    marginBottom: 20,
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  }}>
    {tabs.map(t => (
      <button key={t.id}
        onClick={() => onSelect(t.id)}
        style={{
          padding: "14px 16px",
          minHeight: 48,
          background: active === t.id ? THEME.gold : "transparent",
          color: active === t.id ? THEME.black : THEME.gray,
          border: "none",
          fontFamily: "'Oswald',sans-serif",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          borderBottom: active === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent",
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
        }}
      >
        {t.icon} {t.label}
      </button>
    ))}
  </div>
);
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `tabs` | `Array<{ id: string, label: string, icon?: string }>` | Tab definitions |
| `active` | string | Currently active tab id |
| `onSelect` | `(id: string) => void` | Called when a tab is clicked |

### Tab Data Shape

```js
{ id: "roster", label: "Roster", icon: "emoji-here" }
```

### Main TABS Constant (line 16113)

```js
const TABS = [
  { id: "roster",      label: "Roster",   icon: "emoji" },
  { id: "schedule",    label: "Schedule",  icon: "emoji" },
  { id: "scouting",    label: "Scouting",  icon: "emoji" },
  { id: "practicelog", label: "Practice",  icon: "emoji" },
  { id: "planner",     label: "Planner",   icon: "emoji" },
  { id: "lineup",      label: "Lineup",    icon: "emoji" },
  { id: "gamelog",     label: "Game",      icon: "emoji" },
  { id: "reports",     label: "Reports",   icon: "emoji" },
  { id: "comms",       label: "Comms",     icon: "emoji" },
  { id: "tryouts",     label: "Tryouts",   icon: "emoji" },
];
```

### Tailwind Replacement Classes

```
/* Container */
flex border-b-2 border-pirates-charcoal mb-5 overflow-x-auto

/* Tab button (inactive) */
px-4 py-3.5 min-h-[48px] bg-transparent text-pirates-gray
border-none font-heading text-xs font-bold uppercase tracking-wide
whitespace-nowrap transition-all duration-200 cursor-pointer
border-b-2 border-transparent

/* Tab button (active) */
bg-pirates-gold text-pirates-black border-b-2 border-pirates-gold
```

### Alternate Sub-Tab Patterns

**Tryouts SUB_TABS (line 14065):**

```js
const SUB_TABS = [
  { id: "rubric",   label: "Rubric",       icon: "emoji" },
  { id: "players",  label: "Players",      icon: "emoji" },
  { id: "checkin",  label: "Check-In",     icon: "emoji" },
  { id: "score",    label: "Score",        icon: "emoji" },
  { id: "rankings", label: "Rankings",     icon: "emoji" },
  { id: "draft",    label: "Draft",        icon: "emoji" },
  { id: "register", label: "Registration", icon: "emoji" },
];
```

Uses the same visual pattern inline (not the Tabs component):
```jsx
<div style={{
  display: "flex", gap: 0,
  borderBottom: "2px solid " + THEME.charcoal,
  marginBottom: 20, overflowX: "auto",
  WebkitOverflowScrolling: "touch"
}}>
  {SUB_TABS.map(t => (
    <button style={{
      padding: "14px 16px", minHeight: 48, border: "none", cursor: "pointer",
      fontFamily: "'Oswald',sans-serif", fontSize: 12, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap",
      transition: "all 0.2s ease",
      background: subTab === t.id ? THEME.gold : "transparent",
      color: subTab === t.id ? THEME.black : THEME.gray,
      borderBottom: subTab === t.id ? "2px solid " + THEME.gold : "2px solid transparent",
    }}>
      {t.icon} {t.label}
    </button>
  ))}
</div>
```

**Game Log inner tabs (line 5626):**

```jsx
{[{ id: "setup", label: "Game Setup" }, { id: "score", label: "Live Scorer" }, { id: "coach", label: "Coach Review" }].map(t => (
  <button key={t.id} onClick={() => setMode(t.id)} style={{
    padding: "8px 16px",
    background: mode === t.id ? THEME.gold : "transparent",
    color: mode === t.id ? THEME.black : THEME.gray,
    border: "none", fontFamily: "'Oswald',sans-serif",
    fontSize: 13, fontWeight: 700, cursor: "pointer",
    textTransform: "uppercase",
    borderBottom: mode === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent",
  }}>{t.label}</button>
))}
```

**Player Profile tabs (line 11909):**

Uses a different visual pattern (pill/chip style):
```jsx
{["overview", "practice", "game", "goals"].map(([tab, label]) => (
  <button style={{
    padding: "8px 16px",
    background: profileTab === tab ? THEME.gold : "transparent",
    border: `1px solid ${profileTab === tab ? THEME.gold : THEME.charcoal}`,
    borderRadius: 6,
    color: profileTab === tab ? THEME.black : THEME.white,
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    transition: "all 0.2s ease"
  }}>{label}</button>
))}
```

---

## 10. ToggleChips Component

### Current Implementation (line 1088)

```jsx
const ToggleChips = ({ players, selected, onToggle }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {players.map(p => (
      <button key={p.id}
        onClick={() => onToggle(p.id)}
        style={{
          padding: "4px 10px",
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "'Oswald',sans-serif",
          cursor: "pointer",
          background: selected[p.id] ? THEME.gold : THEME.black,
          color: selected[p.id] ? THEME.black : THEME.gray,
          border: `1px solid ${selected[p.id] ? THEME.gold : THEME.charcoal}`,
        }}
      >
        {p.name.split(" ")[0]}
      </button>
    ))}
  </div>
);
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `players` | `Array<{ id: string, name: string }>` | List of players |
| `selected` | `Record<string, boolean>` | Map of player IDs to selected state |
| `onToggle` | `(id: string) => void` | Called when a chip is toggled |

### Tailwind Replacement Classes

```
/* Container */
flex flex-wrap gap-1.5

/* Chip (unselected) */
px-2.5 py-1 rounded text-xs font-bold font-heading cursor-pointer
bg-pirates-black text-pirates-gray border border-pirates-charcoal

/* Chip (selected) */
bg-pirates-gold text-pirates-black border-pirates-gold
```

---

## 11. StarRating Component

### Current Implementation (line 893)

```jsx
const StarRating = ({ value, onChange, size = 18 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s}
        onClick={() => onChange(s)}
        style={{
          background: "none", border: "none",
          cursor: "pointer", padding: 0,
          fontSize: size, lineHeight: 1,
          color: s <= value ? THEME.gold : THEME.grayLight,
        }}
      >star-char</button>
    ))}
  </div>
);
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number (1-5) | -- | Current rating |
| `onChange` | `(rating: number) => void` | -- | Called when a star is clicked |
| `size` | number | 18 | Font size in pixels |

---

## 12. SL (Section Label) Component

### Current Implementation (line 900)

```jsx
const SL = ({ children }) => (
  <label style={{
    fontSize: 11,
    fontWeight: 700,
    color: THEME.gray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "'Oswald',sans-serif",
    marginBottom: 6,
    display: "block",
  }}>
    {children}
  </label>
);
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Label text |

### Tailwind Replacement Classes

```
block text-[11px] font-bold text-pirates-gray uppercase tracking-wider font-heading mb-1.5
```

### Difference from Input/Select/TextArea Label

The SL component adds `marginBottom: 6` and `display: "block"`, while the Input/Select/TextArea labels omit those properties. The SL is intended as a standalone section label, while the form field labels are part of a flex column layout.

### Section Title Style (TryoutsPanel, line 14084)

A larger variant used in the tryouts panel:
```js
const sectionTitleStyle = {
  fontFamily: "'Oswald',sans-serif",
  fontSize: 16,
  fontWeight: 700,
  color: THEME.gold,
  textTransform: "uppercase",
  letterSpacing: 1,
  marginBottom: 12,
};
```

---

## 13. Chart Components

### LineChart (line 905)

```jsx
const LineChart = ({ data, width = 300, height = 150, color = THEME.gold, showDots = true, showGrid = true }) => { ... };
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<{ value: number }>` | -- | Data points |
| `width` | number | 300 | SVG width |
| `height` | number | 150 | SVG height |
| `color` | string | `THEME.gold` | Line/dot color |
| `showDots` | boolean | true | Show data point circles |
| `showGrid` | boolean | true | Show horizontal grid lines |

Renders a pure SVG line chart with optional grid lines and dots. Uses internal padding of 10px on all sides.

### BarChart (line 978)

```jsx
const BarChart = ({ data, width = 300, height = 150, color = THEME.gold, showValues = false }) => { ... };
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<{ value: number, label?: string }>` | -- | Data points |
| `width` | number | 300 | SVG width |
| `height` | number | 150 | SVG height |
| `color` | string | `THEME.gold` | Bar fill color |
| `showValues` | boolean | false | Show value labels above bars |

Renders SVG bars with 20% spacing between bars. Labels rendered at bottom if provided.

### Sparkline (line 1042)

```jsx
const Sparkline = ({ data, width = 60, height = 20, color = THEME.gold, showArea = false }) => { ... };
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<number> \| Array<{ value: number }>` | -- | Data points (accepts both formats) |
| `width` | number | 60 | SVG width |
| `height` | number | 20 | SVG height |
| `color` | string | `THEME.gold` | Line color |
| `showArea` | boolean | false | Fill area under line (20% opacity) |

Compact inline chart for use within cards/tables.

---

## 14. Toast Pattern

### Implementation (lines 13727-13730 and 16012-16021)

```jsx
// State
const [toastMsg, setToastMsg] = useState(null);
const toastTimer = useRef(null);

// Show function
const showToast = useCallback((msg, type) => {
  setToastMsg({ msg, type: type || "ok" });
  if (toastTimer.current) clearTimeout(toastTimer.current);
  toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
}, []);

// Render
{toastMsg && (
  <div style={{
    position: "fixed",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "8px 18px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    zIndex: 300,
    background: toastMsg.type === "ok" ? "rgba(46,204,113,0.9)" : "rgba(231,76,60,0.9)",
    color: "#fff",
  }}>
    {toastMsg.msg}
  </div>
)}
```

### Types

| Type | Background |
|------|-----------|
| `"ok"` | `rgba(46,204,113,0.9)` (green) |
| anything else | `rgba(231,76,60,0.9)` (red) |

### Tailwind Replacement Classes

```
fixed bottom-4 left-1/2 -translate-x-1/2
px-4 py-2 rounded-lg text-xs font-semibold z-[300] text-white

/* ok type */
bg-green-500/90

/* error type */
bg-red-500/90
```

---

## 15. Additional Inline Patterns

### Header / App Shell (line 16279-16366)

```jsx
<div style={{
  minHeight: "100vh",
  background: THEME.black,
  color: THEME.white,
  fontFamily: "'Source Sans 3',sans-serif",
  padding: "0 0 40px 0",
  position: "relative",
}}>
```

### Header Bar (line 16348)

```jsx
<div style={{
  background: `linear-gradient(135deg, ${THEME.black} 0%, ${THEME.blackLight} 100%)`,
  borderBottom: `3px solid ${THEME.gold}`,
  padding: "20px 24px",
}}>
```

### Content Area (line 16367)

```jsx
<div style={{ padding: "0 24px", marginTop: 16 }}>
```

### Logo Circle (line 16350)

```jsx
<div style={{
  width: 56, height: 56, borderRadius: "50%",
  background: THEME.black, border: `3px solid ${THEME.gold}`,
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: 8, boxShadow: `0 0 20px ${THEME.gold}40`,
}}>
```

### Page Title (line 16353)

```jsx
<h1 style={{
  margin: 0, fontFamily: "'Oswald',sans-serif",
  fontSize: 28, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: 2,
  color: THEME.gold,
}}>{name} Softball</h1>
```

### Stat Cards Row (line 16363)

```jsx
{stats.map(s => (
  <div style={{
    background: THEME.blackLight,
    padding: "10px 16px",
    borderRadius: 8,
    border: `1px solid ${THEME.charcoal}`,
    minWidth: 80,
  }}>
    <div style={{
      color: THEME.gold, fontSize: 24, fontWeight: 700,
      fontFamily: "'Oswald',sans-serif",
    }}>{s.v}</div>
    <div style={{
      color: THEME.gray, fontSize: 11, textTransform: "uppercase",
    }}>{s.l}</div>
  </div>
))}
```

### Next Event Card (line 16365)

```jsx
<div style={{
  cursor: "pointer", flex: 1, minWidth: 200,
  background: THEME.blackLight, padding: "10px 14px",
  borderRadius: 8, border: "1px solid " + THEME.gold + "40",
  display: "flex", alignItems: "center", gap: 10,
}}>
```

### Swipe Navigation (lines 16213-16226)

The app supports swipe gestures to navigate between tabs:
```js
const currentIndex = TABS.findIndex(t => t.id === tab);
// Swipe left: go to next tab
if (currentIndex < TABS.length - 1) setTab(TABS[currentIndex + 1].id);
// Swipe right: go to previous tab
if (currentIndex > 0) setTab(TABS[currentIndex - 1].id);
```

### Pull-to-Refresh (line 16287)

Only active on the "reports" tab.

### Progress Bar (line 1767)

```jsx
<div style={{ width: 120, height: 6, background: THEME.charcoal, borderRadius: 3 }}>
  <div style={{
    width: `${Math.min(100, (current / total) * 100)}%`,
    height: "100%",
    background: current > total ? THEME.red : THEME.gold,
    borderRadius: 3,
  }} />
</div>
```

### Counter Component (line 5543-5545)

```jsx
const Counter = ({ value, onChange }) => (
  <div>
    <button onClick={() => onChange(Math.max(0, value - 1))}
      style={{ background: THEME.charcoal, border: "none", color: THEME.white,
               width: 36, height: 36, borderRadius: 6, cursor: "pointer", fontSize: 20 }}>
      -
    </button>
    <span>{value}</span>
    <button onClick={() => onChange(value + 1)}
      style={{ background: THEME.charcoal, border: "none", color: THEME.white,
               width: 36, height: 36, borderRadius: 6, cursor: "pointer", fontSize: 20 }}>
      +
    </button>
  </div>
);
```

### Defense/Offense Toggle (line 5738-5739)

```jsx
<button style={{
  flex: 1, padding: "12px 0", fontSize: 14, fontWeight: 700,
  borderRadius: 8, cursor: "pointer",
  background: active ? THEME.red : THEME.charcoal,
  color: THEME.white, border: "none",
  fontFamily: "'Oswald',sans-serif", textTransform: "uppercase"
}}>Defense</button>
<button style={{
  flex: 1, padding: "12px 0", fontSize: 14, fontWeight: 700,
  borderRadius: 8, cursor: "pointer",
  background: active ? THEME.green : THEME.charcoal,
  color: THEME.white, border: "none",
  fontFamily: "'Oswald',sans-serif", textTransform: "uppercase"
}}>Offense</button>
```

---

## Summary: Component Count

| Component | Defined As | Total Usages (approx.) |
|-----------|-----------|----------------------|
| Button | Named component | ~122 `<Button>` usages + ~80 inline `<button>` |
| Card | Named component | ~60+ `<Card>` usages + inline card patterns |
| Modal | Named component | ~15 `<Modal>` usages + ~5 inline modal overlays |
| Badge | Named component | ~45+ `<Badge>` usages |
| Input | Named component | Moderate (many form fields still use inline `<input>`) |
| Select | Named component | Moderate (many still inline) |
| TextArea | Named component | Moderate (many still inline) |
| Tabs | Named component | 1 main usage + 3 inline tab patterns |
| ToggleChips | Named component | Used for attendance/availability toggles |
| StarRating | Named component | Used in skill rating forms |
| SL | Named component | Used as section labels throughout |
| LineChart | Named component | Used in reports |
| BarChart | Named component | Used in reports |
| Sparkline | Named component | Used in reports |
| Toast | Inline pattern | 2 instances (TryoutsPanel + App) |

## Priority Extraction Order

1. **THEME + Tailwind config** -- Foundation for everything else
2. **Button** -- Most used, most variants, most inline duplication
3. **Card** -- Second most used, many inline duplicates
4. **Badge** -- Heavily used, well-defined API
5. **Modal** -- Critical UX component, multiple inline duplicates
6. **Input / Select / TextArea** -- Many inline fields need consolidation
7. **Tabs** -- Multiple inline duplications of same pattern
8. **Toast** -- Small but duplicated
9. **SL** -- Small utility
10. **ToggleChips, StarRating** -- Already clean, just move to shared file
11. **Charts** -- Already clean, move to shared file
12. **Storage utilities** -- Move to dedicated utils file
