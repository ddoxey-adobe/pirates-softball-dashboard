import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Theme (mirrors App.jsx) ──────────────────────────────────
const THEME = {
  gold: "#FDB515", goldLight: "#FDCF58", goldDim: "#C89A12",
  black: "#1B1B1B", blackLight: "#27251F", charcoal: "#3A3A3A",
  white: "#FAF9F6", cream: "#F5F0E6", red: "#E74C3C", green: "#2ECC71",
  blue: "#3498DB", gray: "#8E8E8E", grayLight: "#C4C4C4",
};

const STORAGE_KEY = "pirates-messages-2026v3";

// ─── Storage helpers ──────────────────────────────────────────
const loadStore = async (key, fb) => {
  try {
    if (window.storage) {
      const r = await window.storage.get(key);
      return r?.value ? JSON.parse(r.value) : fb;
    }
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fb;
  } catch { return fb; }
};
const saveStore = async (key, d) => {
  try {
    if (window.storage) {
      await window.storage.set(key, JSON.stringify(d));
    } else {
      localStorage.setItem(key, JSON.stringify(d));
    }
  } catch {}
};

// ─── Fallback schedule if none passed via props ───────────────
const FALLBACK_SCHEDULE = [
  { id: "s01", date: "2026-04-09", day: "Thu", type: "practice", title: "Assessment Practice 1", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s02", date: "2026-04-11", day: "Sat", type: "practice", title: "Assessment Practice 2", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s03", date: "2026-04-14", day: "Tue", type: "scrimmage", title: "Scrimmage", time: "6:00 PM", endTime: "8:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s04", date: "2026-04-16", day: "Thu", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s05", date: "2026-04-18", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s06", date: "2026-04-20", day: "Mon", type: "game", title: "vs Rockies", time: "6:30 PM", location: "Sports Complex North", homeAway: "away", opponent: "Rockies", phase: "Week 1" },
  { id: "s07", date: "2026-04-21", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 1" },
  { id: "s08", date: "2026-04-23", day: "Thu", type: "game", title: "vs Reds", time: "5:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Reds", phase: "Week 1" },
  { id: "s09", date: "2026-04-25", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 1" },
  { id: "s10", date: "2026-04-27", day: "Mon", type: "game", title: "vs Rangers", time: "6:30 PM", location: "Sports Complex North", homeAway: "home", opponent: "Rangers", phase: "Week 2" },
  { id: "s11", date: "2026-04-28", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 2" },
  { id: "s12", date: "2026-04-30", day: "Thu", type: "game", title: "vs White Sox", time: "6:30 PM", location: "Sports Complex North", homeAway: "away", opponent: "White Sox", phase: "Week 2" },
  { id: "s13", date: "2026-05-02", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 2" },
  { id: "s14", date: "2026-05-04", day: "Mon", type: "game", title: "vs Giants", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Giants", phase: "Week 3" },
  { id: "s15", date: "2026-05-05", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 3" },
  { id: "s16", date: "2026-05-07", day: "Thu", type: "game", title: "vs Athletics", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Athletics", phase: "Week 3" },
  { id: "s17", date: "2026-05-09", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 3" },
  { id: "s18", date: "2026-05-11", day: "Mon", type: "game", title: "vs Diamondbacks", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Diamondbacks", phase: "Week 4" },
  { id: "s19", date: "2026-05-13", day: "Wed", type: "game", title: "vs Reds", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Reds", phase: "Week 4" },
  { id: "s20", date: "2026-05-16", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 4" },
  { id: "s21", date: "2026-05-19", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 5" },
  { id: "s22", date: "2026-05-21", day: "Thu", type: "game", title: "vs Rockies", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Rockies", phase: "Week 5" },
  { id: "s23", date: "2026-05-23", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 5" },
  { id: "s24", date: "2026-05-26", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 6" },
  { id: "s25", date: "2026-05-27", day: "Wed", type: "game", title: "vs Rangers", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Rangers", phase: "Week 6" },
  { id: "s26", date: "2026-05-30", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 6" },
  { id: "s27", date: "2026-06-01", day: "Mon", type: "tournament", title: "City Tournament - Day 1", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s28", date: "2026-06-04", day: "Thu", type: "tournament", title: "City Tournament - Day 2", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s29", date: "2026-06-05", day: "Fri", type: "tournament", title: "City Tournament - Day 3", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s30", date: "2026-06-06", day: "Sat", type: "tournament", title: "City Tournament - Day 4", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s31", date: "2026-07-06", day: "Mon", type: "tournament", title: "State Tournament - Day 1", time: "TBD", location: "TBD", phase: "State Tournament" },
  { id: "s32", date: "2026-07-07", day: "Tue", type: "tournament", title: "State Tournament - Day 2", time: "TBD", location: "TBD", phase: "State Tournament" },
  { id: "s33", date: "2026-07-08", day: "Wed", type: "tournament", title: "State Tournament - Day 3", time: "TBD", location: "TBD", phase: "State Tournament" },
];

// ─── UI Primitives (match App.jsx) ────────────────────────────
const Card = ({ children, style, ...props }) => (
  <div style={{ background: THEME.blackLight, borderRadius: 10, padding: 20, border: `1px solid ${THEME.charcoal}`, ...style }} {...props}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", small, style: xs, ...p }) => {
  const base = {
    padding: small ? "6px 12px" : "10px 20px", border: "none", borderRadius: 6,
    cursor: "pointer", fontWeight: 700, fontSize: small ? 12 : 14, transition: "all 0.2s",
    letterSpacing: 0.3, fontFamily: "'Oswald',sans-serif", textTransform: "uppercase",
  };
  const variants = {
    primary: { background: THEME.gold, color: THEME.black },
    secondary: { background: THEME.charcoal, color: THEME.white },
    danger: { background: THEME.red, color: THEME.white },
    ghost: { background: "transparent", color: THEME.gold, border: `1px solid ${THEME.gold}` },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...xs }} {...p}>{children}</button>;
};

const SL = ({ children }) => (
  <label style={{
    fontSize: 11, fontWeight: 700, color: THEME.gray, textTransform: "uppercase",
    letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif", marginBottom: 6, display: "block",
  }}>{children}</label>
);

// ─── Date / schedule helpers ──────────────────────────────────

/** "2026-04-09" -> "Thursday, April 9" */
function formatDateLong(dateStr) {
  const d = new Date(dateStr + "T12:00:00"); // noon avoids timezone shift
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

/** Find the next upcoming event from the schedule (on or after today). */
function getNextEvent(schedule) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return schedule.find(ev => {
    const evDate = new Date(ev.date + "T12:00:00");
    evDate.setHours(0, 0, 0, 0);
    return evDate >= today;
  }) || null;
}

/** Find the next upcoming game specifically. */
function getNextGame(schedule) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return schedule.find(ev => {
    const evDate = new Date(ev.date + "T12:00:00");
    evDate.setHours(0, 0, 0, 0);
    return evDate >= today && ev.type === "game";
  }) || null;
}

/**
 * Replace placeholders in a template body with real schedule data.
 * [DAY]      -> "Thursday, April 9"
 * [TIME]     -> "4:45 PM"
 * [LOCATION] -> "Sports Complex"
 * [OPPONENT] -> "Rockies"
 * [GAME TIME] -> same as [TIME] for the game event
 * [FOCUS]    -> event title (for practices)
 * [EVENT]    -> next event title with date
 */
function fillTemplate(body, nextEvent, nextGame) {
  let filled = body;

  if (nextEvent) {
    filled = filled.replace(/\[DAY\]/g, formatDateLong(nextEvent.date));
    filled = filled.replace(/\[TIME\]/g, nextEvent.time || "TBD");
    filled = filled.replace(/\[LOCATION\]/g, nextEvent.location || "TBD");
    filled = filled.replace(/\[FOCUS\]/g, nextEvent.title || "");
    filled = filled.replace(/\[EVENT\]/g, `${nextEvent.title} - ${formatDateLong(nextEvent.date)} at ${nextEvent.time || "TBD"}`);
  }

  // Game-specific fields: prefer nextGame data for opponent / game time
  const game = nextGame || nextEvent;
  if (game) {
    filled = filled.replace(/\[OPPONENT\]/g, game.opponent || "TBD");
    filled = filled.replace(/\[GAME TIME\]/g, game.time || "TBD");
  }

  return filled;
}

// ─── Template definitions ─────────────────────────────────────
const TEAM_NAME = "Pirates";

const MSG_TEMPLATES = [
  {
    id: "t1",
    name: "Season Welcome",
    body: `Hi ${TEAM_NAME} Families!\n\nWelcome to the 2026 season!\n\n\u{1F94E} Coaches: Devin Doxey (Head), Ken (Assistant), Shari (Pitching)\n\n\u{1F94E} Philosophy: Development + love of the game. Every girl gets time and tries positions.\n\n\u{1F94E} Bring: Glove, bat, helmet, water, cleats, positive attitude!\n\nI'll send updates through group text. Questions? Reach out anytime.\n\nGo ${TEAM_NAME}! \u{1F3F4}\u{200D}\u{2620}\u{FE0F}`,
    usesSchedule: false,
  },
  {
    id: "t2",
    name: "Practice Reminder",
    body: `Hi ${TEAM_NAME} Families!\n\nPractice: [DAY] at [TIME] at [LOCATION]\n\nWorking on: [FOCUS]\n\n10 min early please. Let me know if she can't make it.\n\nGo ${TEAM_NAME}! \u{1F3F4}\u{200D}\u{2620}\u{FE0F}`,
    usesSchedule: true,
  },
  {
    id: "t3",
    name: "Game Day Info",
    body: `Hi ${TEAM_NAME} Families!\n\n\u{1F4CD} [LOCATION]\n\u{23F0} Arrive: [TIME] (game at [GAME TIME])\n\u{1F19A} [OPPONENT]\n\nFull uniform. Early for warm-ups.\n\nGo ${TEAM_NAME}! \u{1F3F4}\u{200D}\u{2620}\u{FE0F}`,
    usesSchedule: true,
  },
  {
    id: "t4",
    name: "Schedule Change",
    body: `Hi ${TEAM_NAME} Families!\n\n\u{26A0}\u{FE0F} [CHANGE DETAILS]\n\nNew plan: [DETAILS]\n\nSorry for the inconvenience.\n\nGo ${TEAM_NAME}! \u{1F3F4}\u{200D}\u{2620}\u{FE0F}`,
    usesSchedule: false,
  },
  {
    id: "t5",
    name: "Weekly Recap",
    body: `Hi ${TEAM_NAME} Families!\n\nGreat week!\n\n\u{2705} Worked on: [TOPICS]\n\u{2B50} Shoutouts: [PLAYER \u{2014} REASON]\n\u{1F4C5} Next: [EVENT]\n\nGo ${TEAM_NAME}! \u{1F3F4}\u{200D}\u{2620}\u{FE0F}`,
    usesSchedule: true,
  },
  {
    id: "t6",
    name: "Rain / Cancellation",
    body: `Hi ${TEAM_NAME} Families!\n\n\u{1F327}\u{FE0F} [DAY]'s [EVENT TYPE] has been cancelled due to weather.\n\nWe'll make up the time at our next session. Stay dry!\n\nGo ${TEAM_NAME}! \u{1F3F4}\u{200D}\u{2620}\u{FE0F}`,
    usesSchedule: true,
  },
];

// ─── Component ────────────────────────────────────────────────
export default function CommsPanel({ players = [], coaches = [], schedule }) {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [body, setBody] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedCoaches, setCopiedCoaches] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [searchContact, setSearchContact] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("auto"); // "auto" or event id

  // Resolve the schedule source
  const resolvedSchedule = useMemo(() => {
    if (schedule && schedule.length > 0) return schedule;
    return FALLBACK_SCHEDULE;
  }, [schedule]);

  // Load / persist sent messages
  useEffect(() => { loadStore(STORAGE_KEY, []).then(setSentMessages); }, []);
  useEffect(() => { if (sentMessages.length > 0) saveStore(STORAGE_KEY, sentMessages); }, [sentMessages]);

  // ─── Schedule-derived data ────────────────────────────────
  const nextEvent = useMemo(() => getNextEvent(resolvedSchedule), [resolvedSchedule]);
  const nextGame = useMemo(() => getNextGame(resolvedSchedule), [resolvedSchedule]);

  // Allow manual event override
  const activeEvent = useMemo(() => {
    if (selectedEvent === "auto") return nextEvent;
    return resolvedSchedule.find(e => e.id === selectedEvent) || nextEvent;
  }, [selectedEvent, resolvedSchedule, nextEvent]);

  // ─── Contact lists ────────────────────────────────────────
  const coachPhones = useMemo(() => coaches.filter(c => c.phone).map(c => c.phone), [coaches]);

  const parentContacts = useMemo(() => {
    const contacts = [];
    players.forEach(p => {
      if (p.parentPhone) contacts.push({ playerId: p.id, playerName: p.name, parentName: p.parentName, phone: p.parentPhone, label: "primary" });
      if (p.parentPhone2) contacts.push({ playerId: p.id, playerName: p.name, parentName: p.parentName, phone: p.parentPhone2, label: "secondary" });
    });
    return contacts;
  }, [players]);

  const parentPhones = useMemo(() => parentContacts.map(c => c.phone), [parentContacts]);
  const coachesOnlyList = coachPhones.join(", ");
  const allContactsList = [...coachPhones, ...parentPhones].join(", ");

  // Filtered contacts for search
  const filteredPlayers = useMemo(() => {
    if (!searchContact.trim()) return players;
    const q = searchContact.toLowerCase();
    return players.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.parentName?.toLowerCase().includes(q) ||
      p.parentPhone?.includes(q) ||
      p.parentPhone2?.includes(q)
    );
  }, [players, searchContact]);

  // ─── Template selection with auto-fill ────────────────────
  const selectTemplate = useCallback((template) => {
    setSelectedTemplate(template);
    let filled = template.body;
    if (template.usesSchedule) {
      filled = fillTemplate(filled, activeEvent, nextGame);
    }
    setBody(filled);
  }, [activeEvent, nextGame]);

  // Re-fill when event changes and a template is selected
  useEffect(() => {
    if (selectedTemplate?.usesSchedule) {
      setBody(fillTemplate(selectedTemplate.body, activeEvent, nextGame));
    }
  }, [activeEvent, nextGame, selectedTemplate]);

  // ─── Actions ──────────────────────────────────────────────
  const copyToClipboard = useCallback((text, setFlag) => {
    navigator.clipboard?.writeText(text);
    setFlag(true);
    setTimeout(() => setFlag(false), 2000);
  }, []);

  const copyBodyAndRecord = useCallback(() => {
    navigator.clipboard?.writeText(body);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
    setSentMessages(prev => [...prev, {
      id: Date.now().toString(),
      template: selectedTemplate?.name || "Custom",
      body,
      date: new Date().toISOString(),
      eventId: activeEvent?.id || null,
    }]);
  }, [body, selectedTemplate, activeEvent]);

  const deleteHistoryItem = useCallback((id) => {
    setSentMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    if (confirm("Clear all message history?")) setSentMessages([]);
  }, []);

  /** Build an sms: URI with the message body pre-filled */
  const smsLink = useCallback((phone) => {
    const cleaned = phone.replace(/[^0-9+]/g, "");
    const encoded = encodeURIComponent(body);
    // iOS uses &body=, Android uses ?body= — the & variant works more broadly
    return `sms:${cleaned}?&body=${encoded}`;
  }, [body]);

  // ─── Upcoming event badge ────────────────────────────────
  const eventBadge = (ev) => {
    if (!ev) return null;
    const colors = { practice: THEME.blue, game: THEME.green, scrimmage: THEME.goldDim, tournament: THEME.gold };
    const bg = { practice: "rgba(52,152,219,0.15)", game: "rgba(46,204,113,0.15)", scrimmage: "rgba(200,154,18,0.15)", tournament: "rgba(253,181,21,0.15)" };
    return (
      <span style={{
        display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11,
        fontWeight: 700, color: colors[ev.type] || THEME.gray,
        background: bg[ev.type] || "rgba(142,142,142,0.15)",
        letterSpacing: 0.5, textTransform: "uppercase",
      }}>
        {ev.type}
      </span>
    );
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <div>
      {/* ── Next Event Context Bar ────────────────────────── */}
      {nextEvent && (
        <Card style={{ padding: 14, marginBottom: 20, background: THEME.black, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 20 }}>{nextEvent.type === "game" ? "\u{1F3DF}\u{FE0F}" : nextEvent.type === "tournament" ? "\u{1F3C6}" : "\u{1F94E}"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: THEME.white, fontWeight: 700, fontSize: 14 }}>
              Next Up: {nextEvent.title} {eventBadge(nextEvent)}
            </div>
            <div style={{ color: THEME.gray, fontSize: 12, marginTop: 2 }}>
              {formatDateLong(nextEvent.date)} at {nextEvent.time} &mdash; {nextEvent.location}
              {nextEvent.opponent && <span style={{ color: THEME.gold, marginLeft: 6 }}>vs {nextEvent.opponent}</span>}
            </div>
          </div>
          {/* Event override selector */}
          <select
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            style={{
              padding: "6px 10px", background: THEME.blackLight, border: `1px solid ${THEME.charcoal}`,
              borderRadius: 6, color: THEME.white, fontSize: 12, outline: "none", maxWidth: 200,
            }}
          >
            <option value="auto">Auto (next event)</option>
            {resolvedSchedule.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.date} - {ev.title}
              </option>
            ))}
          </select>
        </Card>
      )}

      {/* ── Quick Contact Lists ───────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: THEME.gold, fontSize: 16, fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>
          Quick Contact Lists
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Coaches Only */}
          <Card style={{ padding: 16, background: THEME.black }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, margin: 0 }}>
                Coaches Only ({coachPhones.length})
              </h4>
              <Button small onClick={() => copyToClipboard(coachesOnlyList, setCopiedCoaches)}>
                {copiedCoaches ? "\u{2713} Copied!" : "Copy"}
              </Button>
            </div>
            <textarea
              value={coachesOnlyList}
              readOnly
              style={{
                width: "100%", minHeight: 60, padding: 8, background: THEME.blackLight,
                border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white,
                fontSize: 12, fontFamily: "monospace", resize: "none", boxSizing: "border-box",
              }}
            />
          </Card>

          {/* All Contacts */}
          <Card style={{ padding: 16, background: THEME.black }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, margin: 0 }}>
                All Contacts ({coachPhones.length + parentPhones.length})
              </h4>
              <Button small onClick={() => copyToClipboard(allContactsList, setCopiedAll)}>
                {copiedAll ? "\u{2713} Copied!" : "Copy"}
              </Button>
            </div>
            <textarea
              value={allContactsList}
              readOnly
              style={{
                width: "100%", minHeight: 60, padding: 8, background: THEME.blackLight,
                border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white,
                fontSize: 12, fontFamily: "monospace", resize: "none", boxSizing: "border-box",
              }}
            />
          </Card>
        </div>
      </div>

      {/* ── Templates & Editor ────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Left: template list */}
        <div>
          <SL>Templates</SL>
          {MSG_TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => selectTemplate(t)}
              style={{
                padding: "10px 14px",
                background: selectedTemplate?.id === t.id ? THEME.charcoal : THEME.black,
                borderRadius: 6, marginBottom: 6, cursor: "pointer",
                border: `1px solid ${selectedTemplate?.id === t.id ? THEME.gold : THEME.charcoal}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div style={{ color: THEME.white, fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              {t.usesSchedule && (
                <span style={{ fontSize: 10, color: THEME.goldDim, fontWeight: 600, textTransform: "uppercase" }}>
                  auto-fill
                </span>
              )}
            </div>
          ))}

          {/* Inline history toggle */}
          {sentMessages.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <SL>Message History ({sentMessages.length})</SL>
                <div style={{ display: "flex", gap: 6 }}>
                  <Button small variant="ghost" onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? "Hide" : "Show"}
                  </Button>
                  <Button small variant="danger" onClick={clearHistory}>Clear</Button>
                </div>
              </div>
              {showHistory && (
                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  {sentMessages.slice().reverse().map(m => (
                    <div key={m.id} style={{
                      padding: "8px 10px", background: THEME.black, borderRadius: 4,
                      marginBottom: 4, fontSize: 12, border: `1px solid ${THEME.charcoal}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ color: THEME.gold, fontWeight: 600 }}>{m.template}</span>
                          <span style={{ color: THEME.gray, marginLeft: 8 }}>
                            {new Date(m.date).toLocaleDateString()} {new Date(m.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteHistoryItem(m.id)}
                          style={{
                            background: "none", border: "none", color: THEME.gray, cursor: "pointer",
                            fontSize: 14, padding: "2px 6px", lineHeight: 1,
                          }}
                          title="Delete"
                        >
                          \u{2715}
                        </button>
                      </div>
                      {m.body && (
                        <div style={{
                          color: THEME.gray, fontSize: 11, marginTop: 4,
                          whiteSpace: "pre-wrap", maxHeight: 60, overflow: "hidden",
                        }}>
                          {m.body.substring(0, 150)}{m.body.length > 150 ? "..." : ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: editor */}
        <div>
          {selectedTemplate ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <SL>Edit Message</SL>
                <div style={{ display: "flex", gap: 8 }}>
                  {selectedTemplate.usesSchedule && activeEvent && (
                    <Button small variant="secondary" onClick={() => {
                      setBody(fillTemplate(selectedTemplate.body, activeEvent, nextGame));
                    }}>
                      Re-fill
                    </Button>
                  )}
                  <Button small onClick={copyBodyAndRecord}>
                    {copiedBody ? "\u{2713} Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Auto-filled variables indicator */}
              {selectedTemplate.usesSchedule && activeEvent && (
                <div style={{
                  padding: "6px 10px", background: "rgba(253,181,21,0.08)", borderRadius: 4,
                  marginBottom: 8, fontSize: 11, color: THEME.goldDim, border: `1px solid rgba(253,181,21,0.2)`,
                }}>
                  Auto-filled from: <strong>{activeEvent.title}</strong> ({formatDateLong(activeEvent.date)})
                </div>
              )}

              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                style={{
                  width: "100%", minHeight: 300, padding: 12, background: THEME.black,
                  border: `1px solid ${THEME.charcoal}`, borderRadius: 6, color: THEME.white,
                  fontSize: 13, fontFamily: "'Source Sans 3',sans-serif", outline: "none",
                  resize: "vertical", lineHeight: 1.6, boxSizing: "border-box",
                }}
              />

              {/* Character count */}
              <div style={{ textAlign: "right", fontSize: 11, color: THEME.gray, marginTop: 4 }}>
                {body.length} characters
                {body.length > 160 && <span style={{ color: THEME.goldDim, marginLeft: 8 }}>
                  ({Math.ceil(body.length / 160)} SMS segments)
                </span>}
              </div>
            </div>
          ) : (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <p style={{ color: THEME.gray, fontSize: 14 }}>Select a template to begin</p>
              <p style={{ color: THEME.charcoal, fontSize: 12, marginTop: 8 }}>
                Templates with "auto-fill" will populate [DAY], [TIME], [OPPONENT], and [LOCATION] from the next scheduled event.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* ── Parent Contact Directory + SMS Deep Links ────── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: THEME.gold, fontSize: 16, fontWeight: 700, textTransform: "uppercase", margin: 0 }}>
            Parent Directory
          </h3>
          <input
            type="text"
            placeholder="Search players or parents..."
            value={searchContact}
            onChange={e => setSearchContact(e.target.value)}
            style={{
              padding: "6px 12px", background: THEME.black, border: `1px solid ${THEME.charcoal}`,
              borderRadius: 6, color: THEME.white, fontSize: 13, outline: "none", width: 240,
              fontFamily: "'Source Sans 3',sans-serif",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
          {filteredPlayers.filter(p => p.parentPhone).map(p => (
            <Card key={p.id} style={{
              padding: 12, background: THEME.black,
              display: "flex", flexDirection: "column", gap: 6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ color: THEME.white, fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                  {p.jersey && <span style={{ color: THEME.goldDim, fontSize: 11, marginLeft: 6 }}>#{p.jersey}</span>}
                </div>
                {p.positions?.length > 0 && (
                  <span style={{ color: THEME.gray, fontSize: 11 }}>{p.positions.slice(0, 2).join("/")}</span>
                )}
              </div>

              <div style={{ fontSize: 12, color: THEME.gray }}>
                {p.parentName}
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {/* Primary phone */}
                <a
                  href={body ? smsLink(p.parentPhone) : `sms:${p.parentPhone.replace(/[^0-9+]/g, "")}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", background: "rgba(46,204,113,0.12)",
                    border: `1px solid rgba(46,204,113,0.3)`, borderRadius: 4,
                    color: THEME.green, fontSize: 12, textDecoration: "none",
                    fontWeight: 600, cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{"\u{1F4F1}"}</span> {p.parentPhone}
                </a>

                {/* Secondary phone */}
                {p.parentPhone2 && (
                  <a
                    href={body ? smsLink(p.parentPhone2) : `sms:${p.parentPhone2.replace(/[^0-9+]/g, "")}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", background: "rgba(52,152,219,0.12)",
                      border: `1px solid rgba(52,152,219,0.3)`, borderRadius: 4,
                      color: THEME.blue, fontSize: 12, textDecoration: "none",
                      fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{"\u{1F4F1}"}</span> {p.parentPhone2}
                  </a>
                )}

                {/* Copy individual number */}
                <button
                  onClick={() => {
                    const nums = [p.parentPhone, p.parentPhone2].filter(Boolean).join(", ");
                    navigator.clipboard?.writeText(nums);
                  }}
                  style={{
                    background: "none", border: `1px solid ${THEME.charcoal}`, borderRadius: 4,
                    color: THEME.gray, fontSize: 11, padding: "4px 8px", cursor: "pointer",
                  }}
                  title="Copy phone number(s)"
                >
                  Copy #
                </button>
              </div>
            </Card>
          ))}

          {filteredPlayers.filter(p => p.parentPhone).length === 0 && (
            <Card style={{ padding: 20, textAlign: "center", gridColumn: "1 / -1" }}>
              <p style={{ color: THEME.gray }}>
                {searchContact ? "No contacts match your search." : "No parent contacts available."}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
