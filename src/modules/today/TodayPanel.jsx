import { useState, useEffect } from "react";

// ─── Theme & Data (mirrors App.jsx constants) ──────────────────
const THEME = {
  gold: "#FDB515", goldLight: "#FDCF58", goldDim: "#C89A12",
  black: "#1B1B1B", blackLight: "#27251F", charcoal: "#3A3A3A",
  white: "#FAF9F6", cream: "#F5F0E6", red: "#E74C3C", green: "#2ECC71",
  blue: "#3498DB", gray: "#8E8E8E", grayLight: "#C4C4C4",
};

const SEASON_SCHEDULE = [
  // PRE-SEASON
  { id: "s01", date: "2026-04-09", day: "Thu", type: "practice", title: "Assessment Practice 1", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s02", date: "2026-04-11", day: "Sat", type: "practice", title: "Assessment Practice 2", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s03", date: "2026-04-14", day: "Tue", type: "scrimmage", title: "Scrimmage", time: "6:00 PM", endTime: "8:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s04", date: "2026-04-16", day: "Thu", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s05", date: "2026-04-18", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Pre-Season" },
  // WEEK 1
  { id: "s06", date: "2026-04-20", day: "Mon", type: "game", title: "vs Rockies", time: "6:30 PM", location: "Sports Complex North", homeAway: "away", opponent: "Rockies", phase: "Week 1" },
  { id: "s07", date: "2026-04-21", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 1" },
  { id: "s08", date: "2026-04-23", day: "Thu", type: "game", title: "vs Reds", time: "5:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Reds", phase: "Week 1" },
  { id: "s09", date: "2026-04-25", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 1" },
  // WEEK 2
  { id: "s10", date: "2026-04-27", day: "Mon", type: "game", title: "vs Rangers", time: "6:30 PM", location: "Sports Complex North", homeAway: "home", opponent: "Rangers", phase: "Week 2" },
  { id: "s11", date: "2026-04-28", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 2" },
  { id: "s12", date: "2026-04-30", day: "Thu", type: "game", title: "vs White Sox", time: "6:30 PM", location: "Sports Complex North", homeAway: "away", opponent: "White Sox", phase: "Week 2" },
  { id: "s13", date: "2026-05-02", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 2" },
  // WEEK 3
  { id: "s14", date: "2026-05-04", day: "Mon", type: "game", title: "vs Giants", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Giants", phase: "Week 3" },
  { id: "s15", date: "2026-05-05", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 3" },
  { id: "s16", date: "2026-05-07", day: "Thu", type: "game", title: "vs Athletics", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Athletics", phase: "Week 3" },
  { id: "s17", date: "2026-05-09", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 3" },
  // WEEK 4
  { id: "s18", date: "2026-05-11", day: "Mon", type: "game", title: "vs Diamondbacks", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Diamondbacks", phase: "Week 4" },
  { id: "s19", date: "2026-05-13", day: "Wed", type: "game", title: "vs Reds", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Reds", phase: "Week 4" },
  { id: "s20", date: "2026-05-16", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 4" },
  // WEEK 5
  { id: "s21", date: "2026-05-19", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 5" },
  { id: "s22", date: "2026-05-21", day: "Thu", type: "game", title: "vs Rockies", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Rockies", phase: "Week 5" },
  { id: "s23", date: "2026-05-23", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 5" },
  // WEEK 6
  { id: "s24", date: "2026-05-26", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 6" },
  { id: "s25", date: "2026-05-27", day: "Wed", type: "game", title: "vs Rangers", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Rangers", phase: "Week 6" },
  { id: "s26", date: "2026-05-30", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 6" },
  // TOURNAMENTS
  { id: "s27", date: "2026-06-01", day: "Mon", type: "tournament", title: "City Tournament - Day 1", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s28", date: "2026-06-04", day: "Thu", type: "tournament", title: "City Tournament - Day 2", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s29", date: "2026-06-05", day: "Fri", type: "tournament", title: "City Tournament - Day 3", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s30", date: "2026-06-06", day: "Sat", type: "tournament", title: "City Tournament - Day 4", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s31", date: "2026-07-06", day: "Mon", type: "tournament", title: "State Tournament - Day 1", time: "TBD", location: "TBD", phase: "State Tournament", notes: "Top 4 from city qualify" },
  { id: "s32", date: "2026-07-07", day: "Tue", type: "tournament", title: "State Tournament - Day 2", time: "TBD", location: "TBD", phase: "State Tournament", notes: "Top 4 from city qualify" },
  { id: "s33", date: "2026-07-08", day: "Wed", type: "tournament", title: "State Tournament - Day 3", time: "TBD", location: "TBD", phase: "State Tournament", notes: "Top 4 from city qualify" },
];

const STORAGE_KEYS = {
  PLAYERS: "pirates-players-2026v3",
  COACHES: "pirates-coaches-2026v1",
  GAMELOGS: "pirates-gamelogs-2026v1",
  PRACTICELOGS: "pirates-practicelogs-2026v1",
  SCOUTINGREPORTS: "pirates-scouting-reports-2026v1",
};

// ─── UI Primitives (match App.jsx) ─────────────────────────────
const Card = ({ children, style, ...props }) => (
  <div style={{ background: THEME.blackLight, borderRadius: 10, padding: 20, border: `1px solid ${THEME.charcoal}`, ...style }} {...props}>
    {children}
  </div>
);

const Badge = ({ children, color = THEME.gold, bg = "rgba(253,181,21,0.15)", style, ...props }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, color, background: bg, letterSpacing: 0.5, textTransform: "uppercase", ...style }} {...props}>
    {children}
  </span>
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


// ─── Helpers ───────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];

const getTodayEvent = () => {
  const d = todayStr();
  return SEASON_SCHEDULE.find(e => e.date === d) || null;
};

const getUpcoming = (count = 3) => {
  const d = todayStr();
  return SEASON_SCHEDULE.filter(e => e.date >= d).slice(0, count);
};

const getNextEvent = () => {
  const d = todayStr();
  return SEASON_SCHEDULE.find(e => e.date > d) || null;
};

const daysUntil = (dateStr) => {
  const target = new Date(dateStr + "T12:00:00");
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return Math.round((target - now) / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr) => {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
};

const formatFullDate = (dateStr) => {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning, Coach";
  if (h < 17) return "Good afternoon, Coach";
  return "Good evening, Coach";
};

const loadLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const isHit = (code) => ["1B", "2B", "3B", "HR"].includes(code);
const isOnBase = (code) => ["1B", "2B", "3B", "HR", "BB", "HBP", "FC", "E"].includes(code);

// ─── Season Phase Suggestions ──────────────────────────────────
const getPracticeSuggestion = (phase) => {
  const suggestions = {
    "Pre-Season": {
      focus: "Assessment & Fundamentals",
      items: [
        "Player evaluations -- identify strengths and positions",
        "Establish throwing mechanics baseline",
        "Tee work and swing assessments",
        "Set team expectations and culture",
      ],
    },
    "Week 1": {
      focus: "Game Preparation",
      items: [
        "Defensive alignments and cutoff plays",
        "Live batting practice -- build timing",
        "Baserunning situations (1st-to-3rd, tagging)",
        "Review game 1 performance if applicable",
      ],
    },
    "Week 2": {
      focus: "Situational Play",
      items: [
        "Bunt defense and offensive bunting",
        "Relay and cutoff reps under pressure",
        "Pitcher/catcher communication",
        "Address weaknesses from Week 1 games",
      ],
    },
    "Week 3": {
      focus: "Mid-Season Adjustments",
      items: [
        "Opponent-specific defensive shifts",
        "2-strike hitting approach",
        "Infield/outfield communication drills",
        "Individual player development plans",
      ],
    },
    "Week 4": {
      focus: "Competitive Sharpening",
      items: [
        "Live scrimmage situations",
        "Pressure at-bats with runners in scoring position",
        "Late-game defensive scenarios",
        "Pitching rotation fine-tuning",
      ],
    },
    "Week 5": {
      focus: "Tournament Prep",
      items: [
        "Full game simulations",
        "Quick-inning defensive execution",
        "Pinch-hitting and bench readiness",
        "Mental toughness and composure drills",
      ],
    },
    "Week 6": {
      focus: "Peak Performance",
      items: [
        "Light reps -- stay sharp, avoid fatigue",
        "Review scouting reports for upcoming opponents",
        "Confidence-building drills",
        "Team bonding and championship mindset",
      ],
    },
    "City Tournament": {
      focus: "Tournament Execution",
      items: [
        "Light warm-up and stretch only",
        "Review opponent tendencies",
        "Finalize pitching rotation for bracket",
        "Focus on energy management between games",
      ],
    },
    "State Tournament": {
      focus: "Championship Mode",
      items: [
        "Game-day warm-up only",
        "Stay loose, trust the preparation",
        "Adjust lineup based on matchups",
        "Enjoy the moment",
      ],
    },
  };
  return suggestions[phase] || suggestions["Pre-Season"];
};


// ─── Compute Season Stats from localStorage Game Logs ──────────
const computeSeasonStats = (gameLogs, players) => {
  const wins = gameLogs.filter(g => g.result === "W").length;
  const losses = gameLogs.filter(g => g.result === "L").length;
  const ties = gameLogs.filter(g => g.result === "T").length;

  // Aggregate batting stats
  const playerStats = {};
  for (const game of gameLogs) {
    for (const ab of (game.atBats || [])) {
      if (!playerStats[ab.playerId]) {
        playerStats[ab.playerId] = { abs: 0, hits: 0, obp_num: 0, rbi: 0, runs: 0, hrs: 0 };
      }
      const s = playerStats[ab.playerId];
      // Walks and HBP don't count as at-bats
      if (!["BB", "HBP", "SAC"].includes(ab.result)) s.abs++;
      if (isHit(ab.result)) s.hits++;
      if (isOnBase(ab.result)) s.obp_num++;
      s.rbi += ab.rbi || 0;
      s.runs += ab.runs || 0;
      if (ab.result === "HR") s.hrs++;
    }
  }

  // Team batting average
  let totalAbs = 0, totalHits = 0;
  for (const pid in playerStats) {
    totalAbs += playerStats[pid].abs;
    totalHits += playerStats[pid].hits;
  }
  const teamAvg = totalAbs > 0 ? (totalHits / totalAbs) : 0;

  // Top performers (min 1 AB)
  const topBatters = Object.entries(playerStats)
    .filter(([, s]) => s.abs >= 1)
    .map(([pid, s]) => {
      const player = players.find(p => p.id === pid);
      return {
        id: pid,
        name: player ? player.name : pid,
        avg: (s.hits / s.abs).toFixed(3),
        hits: s.hits,
        abs: s.abs,
        rbi: s.rbi,
        hrs: s.hrs,
      };
    })
    .sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg))
    .slice(0, 3);

  // Pitching stats
  const pitcherStats = {};
  for (const game of gameLogs) {
    for (const p of (game.pitching || [])) {
      if (!pitcherStats[p.playerId]) {
        pitcherStats[p.playerId] = { ip: 0, k: 0, bb: 0, er: 0 };
      }
      const s = pitcherStats[p.playerId];
      s.ip += p.inningsP || 0;
      s.k += p.k || 0;
      s.bb += p.bb || 0;
      s.er += p.er || 0;
    }
  }

  const topPitchers = Object.entries(pitcherStats)
    .filter(([, s]) => s.ip >= 1)
    .map(([pid, s]) => {
      const player = players.find(p => p.id === pid);
      return {
        id: pid,
        name: player ? player.name : pid,
        ip: s.ip,
        k: s.k,
        era: s.ip > 0 ? ((s.er / s.ip) * 7).toFixed(2) : "0.00",
      };
    })
    .sort((a, b) => parseFloat(a.era) - parseFloat(b.era));

  return { wins, losses, ties, teamAvg, topBatters, topPitchers, gamesPlayed: gameLogs.length };
};


// ─── Last Game Summary ─────────────────────────────────────────
const getLastGame = (gameLogs) => {
  if (!gameLogs || gameLogs.length === 0) return null;
  return gameLogs[gameLogs.length - 1];
};

const getMostRecentPastGame = () => {
  const d = todayStr();
  const pastGames = SEASON_SCHEDULE
    .filter(e => e.type === "game" && e.date < d)
    .sort((a, b) => b.date.localeCompare(a.date));
  return pastGames[0] || null;
};


// ─── Pitching Rotation Helper ──────────────────────────────────
const getPitchingRotation = (players, gameLogs) => {
  const pitchers = players.filter(p => p.isPitcher);
  if (pitchers.length === 0) return [];

  // Find last game each pitcher threw in
  const lastPitched = {};
  for (const game of gameLogs) {
    for (const p of (game.pitching || [])) {
      lastPitched[p.playerId] = { date: game.date, pitches: p.pitches || 0, innings: p.inningsP || 0 };
    }
  }

  return pitchers.map(p => ({
    ...p,
    lastGame: lastPitched[p.id] || null,
    daysRest: lastPitched[p.id] ? daysUntil(lastPitched[p.id].date) * -1 : 999,
  })).sort((a, b) => b.daysRest - a.daysRest); // Most rested first
};


// ─── Alerts ────────────────────────────────────────────────────
const getAlerts = (players, gameLogs) => {
  const alerts = [];
  const d = todayStr();

  // Check for players with 0 skills rated (need assessment)
  const unassessed = players.filter(p => {
    const vals = Object.values(p.skills || {});
    return vals.every(v => v === 0);
  });
  if (unassessed.length > 0) {
    alerts.push({
      type: "info",
      icon: "\u{1F4CB}",
      text: `${unassessed.length} player${unassessed.length > 1 ? "s" : ""} still need skill assessments`,
    });
  }

  // Season hasn't started yet
  const firstGame = SEASON_SCHEDULE.find(e => e.type === "game");
  if (firstGame && firstGame.date > d && gameLogs.length === 0) {
    const days = daysUntil(firstGame.date);
    if (days <= 14 && days > 0) {
      alerts.push({
        type: "warning",
        icon: "\u26BE",
        text: `First game in ${days} day${days !== 1 ? "s" : ""} -- make sure lineups are ready`,
      });
    }
  }

  // Players without jersey numbers
  const noJersey = players.filter(p => !p.jersey);
  if (noJersey.length > 0) {
    alerts.push({
      type: "info",
      icon: "\u{1F455}",
      text: `${noJersey.length} player${noJersey.length > 1 ? "s" : ""} missing jersey numbers`,
    });
  }

  return alerts;
};


// ═══════════════════════════════════════════════════════════════
//  TODAY PANEL
// ═══════════════════════════════════════════════════════════════
const TodayPanel = ({ players: propPlayers = [], onNavigate }) => {
  const [players, setPlayers] = useState(propPlayers || []);
  const [gameLogs, setGameLogs] = useState([]);
  const [now, setNow] = useState(new Date());

  // Load data from localStorage / window.storage
  useEffect(() => {
    const load = async () => {
      // Load players if not passed as prop
      if (!propPlayers || propPlayers.length === 0) {
        try {
          if (window.storage) {
            const r = await window.storage.get(STORAGE_KEYS.PLAYERS);
            if (r?.value) {
              const p = JSON.parse(r.value);
              if (Array.isArray(p) && p.length > 0) setPlayers(p);
            }
          } else {
            const p = loadLocal(STORAGE_KEYS.PLAYERS, []);
            if (p.length > 0) setPlayers(p);
          }
        } catch {}
      }
      // Load game logs
      try {
        if (window.storage) {
          const r = await window.storage.get(STORAGE_KEYS.GAMELOGS);
          if (r?.value) {
            const g = JSON.parse(r.value);
            if (Array.isArray(g)) setGameLogs(g);
          }
        } else {
          const g = loadLocal(STORAGE_KEYS.GAMELOGS, []);
          setGameLogs(g);
        }
      } catch {}
    };
    load();
  }, [propPlayers]);

  // Update props when they change
  useEffect(() => {
    if (propPlayers && propPlayers.length > 0) setPlayers(propPlayers);
  }, [propPlayers]);

  // Refresh clock every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const todayEvent = getTodayEvent();
  const upcoming = getUpcoming(4);
  const stats = computeSeasonStats(gameLogs, players);
  const alerts = getAlerts(players, gameLogs);
  const lastGame = getLastGame(gameLogs);
  const pitchers = getPitchingRotation(players, gameLogs);
  const nav = (tab) => onNavigate && onNavigate(tab);

  const typeColors = { game: THEME.red, practice: THEME.green, scrimmage: THEME.blue, tournament: THEME.gold };
  const typeIcons = { game: "\u26BE", practice: "\u{1F4CB}", scrimmage: "\u{1F93C}", tournament: "\u{1F3C6}" };

  // ─── Determine today's context ─────────────────────────────
  const isGameDay = todayEvent && (todayEvent.type === "game" || todayEvent.type === "tournament");
  const isPracticeDay = todayEvent && (todayEvent.type === "practice" || todayEvent.type === "scrimmage");
  const isOffDay = !todayEvent;

  // ─── Shared: Time display ──────────────────────────────────
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div>
      {/* ── Header / Greeting ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{
              margin: 0, fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700,
              color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
            }}>
              {getGreeting()}
            </h2>
            <p style={{ margin: "4px 0 0", color: THEME.gray, fontSize: 14 }}>
              {dateStr} &middot; {timeStr}
            </p>
          </div>
          {stats.gamesPlayed > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: THEME.blackLight, padding: "10px 18px", borderRadius: 8,
              border: `1px solid ${THEME.charcoal}`,
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Oswald',sans-serif", color: THEME.gold }}>
                  {stats.wins}-{stats.losses}{stats.ties > 0 ? `-${stats.ties}` : ""}
                </div>
                <div style={{ fontSize: 10, color: THEME.gray, textTransform: "uppercase", letterSpacing: 1 }}>Record</div>
              </div>
              <div style={{ width: 1, height: 36, background: THEME.charcoal }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Oswald',sans-serif", color: THEME.white }}>
                  .{(stats.teamAvg * 1000).toFixed(0).padStart(3, "0")}
                </div>
                <div style={{ fontSize: 10, color: THEME.gray, textTransform: "uppercase", letterSpacing: 1 }}>Team AVG</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Alerts ── */}
      {alerts.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 8,
              background: a.type === "warning" ? "rgba(231,76,60,0.1)" : "rgba(52,152,219,0.08)",
              border: `1px solid ${a.type === "warning" ? THEME.red + "40" : THEME.blue + "30"}`,
            }}>
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <span style={{ fontSize: 13, color: a.type === "warning" ? THEME.red : THEME.grayLight }}>{a.text}</span>
            </div>
          ))}
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════ */}
      {/*  GAME DAY                                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isGameDay && (
        <>
          {/* Hero card */}
          <Card style={{
            marginBottom: 20, padding: 0, overflow: "hidden",
            border: `2px solid ${THEME.red}`,
            background: `linear-gradient(135deg, ${THEME.blackLight} 0%, rgba(231,76,60,0.08) 100%)`,
          }}>
            <div style={{
              background: THEME.red, padding: "10px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{
                fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14,
                textTransform: "uppercase", letterSpacing: 2, color: THEME.white,
              }}>
                {todayEvent.type === "tournament" ? "Tournament Day" : "Game Day"}
              </span>
              <span style={{ fontSize: 22 }}>{"\u26BE"}</span>
            </div>
            <div style={{ padding: "20px 20px 24px" }}>
              <h3 style={{
                margin: "0 0 4px", fontFamily: "'Oswald',sans-serif", fontSize: 28,
                fontWeight: 700, color: THEME.white, textTransform: "uppercase",
              }}>
                {todayEvent.title}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{"\u{1F552}"}</span>
                  <span style={{ color: THEME.grayLight, fontSize: 15 }}>{todayEvent.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{"\u{1F4CD}"}</span>
                  <span style={{ color: THEME.grayLight, fontSize: 15 }}>{todayEvent.location}</span>
                </div>
                {todayEvent.homeAway && (
                  <Badge
                    color={todayEvent.homeAway === "home" ? THEME.green : THEME.blue}
                    bg={todayEvent.homeAway === "home" ? "rgba(46,204,113,0.15)" : "rgba(52,152,219,0.15)"}
                    style={{ fontSize: 12, padding: "4px 12px" }}
                  >
                    {todayEvent.homeAway === "home" ? "\u{1F3E0} Home" : "\u{2708}\u{FE0F} Away"}
                  </Badge>
                )}
              </div>

              {/* Quick actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <Button onClick={() => nav("lineup")} style={{ flex: 1, minWidth: 120 }}>
                  Set Lineup
                </Button>
                <Button onClick={() => nav("gamelog")} variant="ghost" style={{ flex: 1, minWidth: 120 }}>
                  Start Scoring
                </Button>
              </div>
            </div>
          </Card>

          {/* Pitching Rotation Reminder */}
          {pitchers.length > 0 && (
            <Card style={{ marginBottom: 20 }}>
              <h4 style={{
                margin: "0 0 12px", fontFamily: "'Oswald',sans-serif", fontSize: 15,
                color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
              }}>
                Pitching Rotation
              </h4>
              <div style={{ display: "grid", gap: 8 }}>
                {pitchers.map((p, i) => (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: 6,
                    background: i === 0 ? "rgba(253,181,21,0.08)" : "transparent",
                    border: i === 0 ? `1px solid ${THEME.gold}40` : `1px solid transparent`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: i === 0 ? THEME.gold : THEME.charcoal,
                        color: i === 0 ? THEME.black : THEME.gray,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 12,
                      }}>
                        {i + 1}
                      </div>
                      <span style={{ color: THEME.white, fontSize: 14, fontWeight: i === 0 ? 700 : 400 }}>
                        {p.name}
                      </span>
                      {i === 0 && <Badge color={THEME.gold} bg="rgba(253,181,21,0.15)">Starter</Badge>}
                    </div>
                    <span style={{ color: THEME.gray, fontSize: 12 }}>
                      {p.lastGame
                        ? `${p.daysRest}d rest${p.lastGame.pitches ? ` \u00B7 ${p.lastGame.pitches} pitches last` : ""}`
                        : "No recent appearances"
                      }
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Opponent Scouting Summary */}
          {todayEvent.opponent && (
            <Card style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h4 style={{
                  margin: 0, fontFamily: "'Oswald',sans-serif", fontSize: 15,
                  color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
                }}>
                  Opponent: {todayEvent.opponent}
                </h4>
                <Button small variant="ghost" onClick={() => nav("scouting")}>
                  View Scouting
                </Button>
              </div>
              {/* Check localStorage for scouting data */}
              <OpponentScoutingSummary opponent={todayEvent.opponent} />
            </Card>
          )}
        </>
      )}


      {/* ═══════════════════════════════════════════════════════ */}
      {/*  PRACTICE DAY                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isPracticeDay && (
        <>
          {/* Hero card */}
          <Card style={{
            marginBottom: 20, padding: 0, overflow: "hidden",
            border: `2px solid ${THEME.green}`,
            background: `linear-gradient(135deg, ${THEME.blackLight} 0%, rgba(46,204,113,0.06) 100%)`,
          }}>
            <div style={{
              background: THEME.green, padding: "10px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{
                fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14,
                textTransform: "uppercase", letterSpacing: 2, color: THEME.white,
              }}>
                {todayEvent.type === "scrimmage" ? "Scrimmage Today" : "Practice Today"}
              </span>
              <span style={{ fontSize: 22 }}>{todayEvent.type === "scrimmage" ? "\u{1F93C}" : "\u{1F4CB}"}</span>
            </div>
            <div style={{ padding: "20px 20px 24px" }}>
              <h3 style={{
                margin: "0 0 4px", fontFamily: "'Oswald',sans-serif", fontSize: 28,
                fontWeight: 700, color: THEME.white, textTransform: "uppercase",
              }}>
                {todayEvent.title}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{"\u{1F552}"}</span>
                  <span style={{ color: THEME.grayLight, fontSize: 15 }}>
                    {todayEvent.time}{todayEvent.endTime ? ` - ${todayEvent.endTime}` : ""}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{"\u{1F4CD}"}</span>
                  <span style={{ color: THEME.grayLight, fontSize: 15 }}>{todayEvent.location}</span>
                </div>
                <Badge color={THEME.gray} bg="rgba(142,142,142,0.1)" style={{ fontSize: 12, padding: "4px 12px" }}>
                  {todayEvent.phase}
                </Badge>
              </div>

              {/* Quick actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <Button onClick={() => nav("practicelog")} style={{ flex: 1, minWidth: 120 }}>
                  Start Practice
                </Button>
                <Button onClick={() => nav("planner")} variant="ghost" style={{ flex: 1, minWidth: 120 }}>
                  View Practice Plans
                </Button>
              </div>
            </div>
          </Card>

          {/* Attendance Quick Check */}
          <Card style={{ marginBottom: 20 }}>
            <h4 style={{
              margin: "0 0 12px", fontFamily: "'Oswald',sans-serif", fontSize: 15,
              color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
            }}>
              Expected Today ({players.filter(p => (p.status || "active") === "active").length} players)
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {players
                .filter(p => (p.status || "active") === "active")
                .map(p => (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "5px 10px", borderRadius: 6,
                    background: THEME.black, border: `1px solid ${THEME.charcoal}`,
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: p.returning ? THEME.gold : THEME.charcoal,
                      color: p.returning ? THEME.black : THEME.white,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 9,
                    }}>
                      {p.jersey || p.name?.charAt(0) || "?"}
                    </div>
                    <span style={{ fontSize: 12, color: THEME.white, fontWeight: 600 }}>
                      {p.name.split(" ")[0]}
                    </span>
                  </div>
                ))
              }
            </div>
          </Card>

          {/* Suggested Practice Focus */}
          {(() => {
            const suggestion = getPracticeSuggestion(todayEvent.phase);
            return (
              <Card style={{ marginBottom: 20 }}>
                <h4 style={{
                  margin: "0 0 4px", fontFamily: "'Oswald',sans-serif", fontSize: 15,
                  color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
                }}>
                  Suggested Focus: {suggestion.focus}
                </h4>
                <p style={{ margin: "0 0 12px", fontSize: 12, color: THEME.gray }}>
                  Based on {todayEvent.phase} schedule position
                </p>
                <div style={{ display: "grid", gap: 6 }}>
                  {suggestion.items.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 8,
                      padding: "6px 0", borderBottom: i < suggestion.items.length - 1 ? `1px solid ${THEME.charcoal}` : "none",
                    }}>
                      <span style={{ color: THEME.gold, fontSize: 12, marginTop: 1 }}>{"\u25B8"}</span>
                      <span style={{ color: THEME.grayLight, fontSize: 13 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })()}
        </>
      )}


      {/* ═══════════════════════════════════════════════════════ */}
      {/*  OFF DAY                                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isOffDay && (
        <>
          {/* Next Event Countdown */}
          {(() => {
            const next = getUpcoming(1)[0];
            if (!next) return null;
            const days = daysUntil(next.date);
            return (
              <Card style={{
                marginBottom: 20, padding: 0, overflow: "hidden",
                border: `2px solid ${THEME.gold}`,
                background: `linear-gradient(135deg, ${THEME.blackLight} 0%, rgba(253,181,21,0.06) 100%)`,
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${THEME.gold} 0%, ${THEME.goldDim} 100%)`,
                  padding: "10px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{
                    fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14,
                    textTransform: "uppercase", letterSpacing: 2, color: THEME.black,
                  }}>
                    Off Day
                  </span>
                  <span style={{
                    fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14,
                    color: THEME.black,
                  }}>
                    Next up in {days} day{days !== 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: typeColors[next.type] || THEME.gold,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28,
                    }}>
                      {typeIcons[next.type] || "\u{1F4C5}"}
                    </div>
                    <div>
                      <h3 style={{
                        margin: 0, fontFamily: "'Oswald',sans-serif", fontSize: 22,
                        fontWeight: 700, color: THEME.white, textTransform: "uppercase",
                      }}>
                        {next.title}
                      </h3>
                      <div style={{ color: THEME.gray, fontSize: 14, marginTop: 4 }}>
                        {formatFullDate(next.date)} at {next.time}
                        {next.homeAway && ` \u00B7 ${next.homeAway === "home" ? "Home" : "Away"}`}
                        {" \u00B7 "}{next.location}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })()}

          {/* Season Stats Snapshot */}
          {stats.gamesPlayed > 0 && (
            <Card style={{ marginBottom: 20 }}>
              <h4 style={{
                margin: "0 0 16px", fontFamily: "'Oswald',sans-serif", fontSize: 15,
                color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
              }}>
                Season Snapshot
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Record", value: `${stats.wins}-${stats.losses}${stats.ties > 0 ? `-${stats.ties}` : ""}`, color: THEME.gold },
                  { label: "Win %", value: stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed * 100).toFixed(0) + "%" : "--", color: stats.wins >= stats.losses ? THEME.green : THEME.red },
                  { label: "Team AVG", value: `.${(stats.teamAvg * 1000).toFixed(0).padStart(3, "0")}`, color: THEME.white },
                  { label: "Games", value: stats.gamesPlayed, color: THEME.grayLight },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center", padding: "8px 4px" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif", color: s.color }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 10, color: THEME.gray, textTransform: "uppercase", letterSpacing: 0.8 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Performers */}
              {stats.topBatters.length > 0 && (
                <>
                  <div style={{ fontSize: 12, color: THEME.gray, fontWeight: 700, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif" }}>
                    Top Hitters
                  </div>
                  <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
                    {stats.topBatters.map((b, i) => (
                      <div key={b.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "6px 10px", borderRadius: 6,
                        background: i === 0 ? "rgba(253,181,21,0.06)" : "transparent",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{
                            width: 20, height: 20, borderRadius: "50%",
                            background: i === 0 ? THEME.gold : THEME.charcoal,
                            color: i === 0 ? THEME.black : THEME.gray,
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 10,
                          }}>
                            {i + 1}
                          </span>
                          <span style={{ color: THEME.white, fontSize: 13 }}>{b.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 15 }}>
                            {b.avg}
                          </span>
                          <span style={{ color: THEME.gray, fontSize: 11 }}>
                            {b.hits}/{b.abs}{b.hrs > 0 ? ` \u00B7 ${b.hrs} HR` : ""}{b.rbi > 0 ? ` \u00B7 ${b.rbi} RBI` : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Top Pitchers */}
              {stats.topPitchers.length > 0 && (
                <>
                  <div style={{ fontSize: 12, color: THEME.gray, fontWeight: 700, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif" }}>
                    Pitching Leaders
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {stats.topPitchers.map((p, i) => (
                      <div key={p.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "6px 10px", borderRadius: 6,
                      }}>
                        <span style={{ color: THEME.white, fontSize: 13 }}>{p.name}</span>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14 }}>
                            {p.era} ERA
                          </span>
                          <span style={{ color: THEME.gray, fontSize: 11 }}>
                            {p.ip} IP \u00B7 {p.k} K
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          )}

          {/* Last Game Summary */}
          {lastGame && (
            <Card style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{
                  margin: 0, fontFamily: "'Oswald',sans-serif", fontSize: 15,
                  color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
                }}>
                  Last Game
                </h4>
                <Badge
                  color={lastGame.result === "W" ? THEME.green : lastGame.result === "L" ? THEME.red : THEME.gray}
                  bg={lastGame.result === "W" ? "rgba(46,204,113,0.15)" : lastGame.result === "L" ? "rgba(231,76,60,0.15)" : "rgba(142,142,142,0.1)"}
                  style={{ fontSize: 14, padding: "4px 14px" }}
                >
                  {lastGame.result} {lastGame.score}
                </Badge>
              </div>
              <div style={{ color: THEME.gray, fontSize: 13, marginBottom: 8 }}>
                vs {lastGame.opponent} &middot; {formatDate(lastGame.date)}
              </div>
              {lastGame.notes && (
                <div style={{
                  color: THEME.grayLight, fontSize: 13, fontStyle: "italic",
                  padding: "8px 12px", borderRadius: 6, background: THEME.black,
                  borderLeft: `3px solid ${THEME.gold}`,
                }}>
                  {lastGame.notes}
                </div>
              )}
            </Card>
          )}

          {/* To-Do Items */}
          <Card style={{ marginBottom: 20 }}>
            <h4 style={{
              margin: "0 0 12px", fontFamily: "'Oswald',sans-serif", fontSize: 15,
              color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
            }}>
              Coach To-Do
            </h4>
            <OffDayTodos gameLogs={gameLogs} players={players} onNavigate={nav} />
          </Card>
        </>
      )}


      {/* ═══════════════════════════════════════════════════════ */}
      {/*  ALWAYS SHOWN SECTIONS                                 */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* Upcoming Schedule (next 3 events, skip today's if shown) */}
      <Card style={{ marginBottom: 20 }}>
        <h4 style={{
          margin: "0 0 12px", fontFamily: "'Oswald',sans-serif", fontSize: 15,
          color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
        }}>
          Coming Up
        </h4>
        <div style={{ display: "grid", gap: 8 }}>
          {upcoming
            .filter(e => e.date !== todayStr() || !todayEvent)
            .slice(0, 3)
            .map(ev => {
              const days = daysUntil(ev.date);
              return (
                <div key={ev.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", borderRadius: 8,
                  background: THEME.black, border: `1px solid ${THEME.charcoal}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{typeIcons[ev.type] || "\u{1F4C5}"}</span>
                    <div>
                      <div style={{ color: THEME.white, fontSize: 14, fontWeight: 600 }}>{ev.title}</div>
                      <div style={{ color: THEME.gray, fontSize: 12 }}>
                        {formatDate(ev.date)} at {ev.time}
                        {ev.homeAway && ` \u00B7 ${ev.homeAway === "home" ? "Home" : "Away"}`}
                      </div>
                    </div>
                  </div>
                  <Badge
                    color={typeColors[ev.type] || THEME.gold}
                    bg={(typeColors[ev.type] || THEME.gold) + "20"}
                    style={{ fontSize: 11 }}
                  >
                    {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                  </Badge>
                </div>
              );
            })
          }
          {upcoming.length === 0 && (
            <div style={{ textAlign: "center", padding: 20, color: THEME.gray }}>
              No upcoming events on the schedule.
            </div>
          )}
        </div>
      </Card>

      {/* Quick Links */}
      <Card style={{ marginBottom: 20 }}>
        <h4 style={{
          margin: "0 0 12px", fontFamily: "'Oswald',sans-serif", fontSize: 15,
          color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
        }}>
          Quick Links
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Roster", icon: "\u{1F465}", tab: "roster", desc: `${players.length} players` },
            { label: "Schedule", icon: "\u{1F4C5}", tab: "schedule", desc: `${SEASON_SCHEDULE.length} events` },
            { label: "Practice Log", icon: "\u{1F4CB}", tab: "practicelog", desc: "Log & review" },
            { label: "Game Log", icon: "\u26BE", tab: "gamelog", desc: `${stats.gamesPlayed} games logged` },
            { label: "Lineup Builder", icon: "\u{1F4DD}", tab: "lineup", desc: "Build lineups" },
            { label: "Scouting", icon: "\u{1F50D}", tab: "scouting", desc: "Opponent reports" },
            { label: "Reports", icon: "\u{1F4CA}", tab: "reports", desc: "Stats & analytics" },
            { label: "Comms", icon: "\u{2709}\u{FE0F}", tab: "comms", desc: "Messages & notes" },
          ].map(link => (
            <button
              key={link.tab}
              onClick={() => nav(link.tab)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 8,
                background: THEME.black, border: `1px solid ${THEME.charcoal}`,
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = THEME.gold + "60"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = THEME.charcoal; }}
            >
              <span style={{ fontSize: 22 }}>{link.icon}</span>
              <div>
                <div style={{ color: THEME.white, fontSize: 13, fontWeight: 700, fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" }}>
                  {link.label}
                </div>
                <div style={{ color: THEME.gray, fontSize: 11 }}>{link.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Season Progress */}
      <Card>
        <h4 style={{
          margin: "0 0 12px", fontFamily: "'Oswald',sans-serif", fontSize: 15,
          color: THEME.gold, textTransform: "uppercase", letterSpacing: 1,
        }}>
          Season Progress
        </h4>
        {(() => {
          const d = todayStr();
          const total = SEASON_SCHEDULE.length;
          const completed = SEASON_SCHEDULE.filter(e => e.date < d).length;
          const pct = total > 0 ? (completed / total * 100) : 0;
          const gamesTotal = SEASON_SCHEDULE.filter(e => e.type === "game").length;
          const gamesCompleted = SEASON_SCHEDULE.filter(e => e.type === "game" && e.date < d).length;
          const currentPhase = todayEvent ? todayEvent.phase : (getUpcoming(1)[0]?.phase || "Off-Season");
          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: THEME.gray }}>{completed} of {total} events completed</span>
                <span style={{ fontSize: 12, color: THEME.gold, fontWeight: 700 }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{
                height: 8, borderRadius: 4, background: THEME.charcoal, overflow: "hidden", marginBottom: 14,
              }}>
                <div style={{
                  height: "100%", borderRadius: 4, width: `${pct}%`,
                  background: `linear-gradient(90deg, ${THEME.goldDim}, ${THEME.gold})`,
                  transition: "width 0.5s ease",
                }} />
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 11, color: THEME.gray, textTransform: "uppercase" }}>Phase: </span>
                  <span style={{ fontSize: 13, color: THEME.white, fontWeight: 600 }}>{currentPhase}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: THEME.gray, textTransform: "uppercase" }}>Games: </span>
                  <span style={{ fontSize: 13, color: THEME.white, fontWeight: 600 }}>{gamesCompleted}/{gamesTotal}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: THEME.gray, textTransform: "uppercase" }}>Remaining: </span>
                  <span style={{ fontSize: 13, color: THEME.white, fontWeight: 600 }}>{total - completed} events</span>
                </div>
              </div>
            </div>
          );
        })()}
      </Card>
    </div>
  );
};


// ─── Sub-Components ────────────────────────────────────────────

const OpponentScoutingSummary = ({ opponent }) => {
  const [report, setReport] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        let reports = [];
        if (window.storage) {
          const r = await window.storage.get(STORAGE_KEYS.SCOUTINGREPORTS);
          if (r?.value) reports = JSON.parse(r.value);
        } else {
          reports = loadLocal(STORAGE_KEYS.SCOUTINGREPORTS, []);
        }
        const match = reports.find(r =>
          r.opponent?.toLowerCase() === opponent.toLowerCase() ||
          r.team?.toLowerCase() === opponent.toLowerCase()
        );
        setReport(match || null);
      } catch {}
      setLoaded(true);
    };
    load();
  }, [opponent]);

  if (!loaded) return <div style={{ color: THEME.gray, fontSize: 13 }}>Loading...</div>;

  if (!report) {
    return (
      <div style={{
        padding: "12px 14px", borderRadius: 6,
        background: THEME.black, border: `1px dashed ${THEME.charcoal}`,
        textAlign: "center",
      }}>
        <div style={{ color: THEME.gray, fontSize: 13, marginBottom: 4 }}>
          No scouting report for {opponent} yet
        </div>
        <div style={{ color: THEME.gray, fontSize: 11 }}>
          Add one in the Scouting tab before game time
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 12px", borderRadius: 6, background: THEME.black }}>
      {report.notes && <div style={{ color: THEME.grayLight, fontSize: 13, marginBottom: 6 }}>{report.notes}</div>}
      {report.strengths && (
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: THEME.red, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Watch out: </span>
          <span style={{ color: THEME.grayLight, fontSize: 12 }}>{report.strengths}</span>
        </div>
      )}
      {report.weaknesses && (
        <div>
          <span style={{ color: THEME.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Exploit: </span>
          <span style={{ color: THEME.grayLight, fontSize: 12 }}>{report.weaknesses}</span>
        </div>
      )}
    </div>
  );
};


const OffDayTodos = ({ gameLogs, players, onNavigate }) => {
  const lastGame = getLastGame(gameLogs);
  const nextEvent = getUpcoming(1)[0];

  const todos = [];

  // Review last game
  if (lastGame) {
    todos.push({
      icon: "\u{1F4DD}",
      text: `Review ${lastGame.result} ${lastGame.score} vs ${lastGame.opponent}`,
      action: "gamelog",
      actionLabel: "View Game",
    });
  }

  // Plan next practice
  if (nextEvent && (nextEvent.type === "practice" || nextEvent.type === "scrimmage")) {
    todos.push({
      icon: "\u{1F4CB}",
      text: `Plan ${nextEvent.title} (${formatDate(nextEvent.date)})`,
      action: "planner",
      actionLabel: "Open Planner",
    });
  }

  // Check scouting for next opponent
  const nextGame = SEASON_SCHEDULE.find(e => e.type === "game" && e.date > todayStr());
  if (nextGame && nextGame.opponent) {
    todos.push({
      icon: "\u{1F50D}",
      text: `Scout ${nextGame.opponent} (game ${formatDate(nextGame.date)})`,
      action: "scouting",
      actionLabel: "Scouting",
    });
  }

  // Players needing attention
  const unassessed = players.filter(p => Object.values(p.skills || {}).every(v => v === 0));
  if (unassessed.length > 0) {
    todos.push({
      icon: "\u{1F4CA}",
      text: `Complete skill ratings for ${unassessed.length} player${unassessed.length > 1 ? "s" : ""}`,
      action: "roster",
      actionLabel: "Roster",
    });
  }

  // Lineup prep
  if (nextGame) {
    todos.push({
      icon: "\u{1F4DD}",
      text: `Prepare lineup for vs ${nextGame.opponent}`,
      action: "lineup",
      actionLabel: "Lineup",
    });
  }

  if (todos.length === 0) {
    todos.push({
      icon: "\u2705",
      text: "All caught up! Enjoy the off day.",
      action: null,
      actionLabel: null,
    });
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {todos.map((todo, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 12px", borderRadius: 6,
          background: THEME.black, border: `1px solid ${THEME.charcoal}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 16 }}>{todo.icon}</span>
            <span style={{ color: THEME.grayLight, fontSize: 13 }}>{todo.text}</span>
          </div>
          {todo.action && (
            <Button small variant="ghost" onClick={() => onNavigate(todo.action)} style={{ flexShrink: 0 }}>
              {todo.actionLabel}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};


export default TodayPanel;
