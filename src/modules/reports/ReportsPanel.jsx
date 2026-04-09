import { useState, useEffect } from "react";
import SeasonDashboard from "./SeasonDashboard";
import PlayerProfile from "./PlayerProfile";
import ExportReport from "./ExportReport";

// ─── Theme & Data (mirrors App.jsx constants) ──────────────────
const THEME = {
  gold: "#FDB515", goldLight: "#FDCF58", goldDim: "#C89A12",
  black: "#1B1B1B", blackLight: "#27251F", charcoal: "#3A3A3A",
  white: "#FAF9F6", cream: "#F5F0E6", red: "#E74C3C", green: "#2ECC71",
  blue: "#3498DB", gray: "#8E8E8E", grayLight: "#C4C4C4",
};

const STORAGE_KEYS = {
  GAMELOGS: "pirates-gamelogs-2026v1",
};

const loadStore = async (key, fb) => {
  try {
    const r = await window.storage.get(key);
    return r?.value ? JSON.parse(r.value) : fb;
  } catch {
    return fb;
  }
};

// ─── Shared UI Components ──────────────────────────────────────
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
    primary: { background: THEME.gold, color: THEME.black },
    secondary: { background: THEME.charcoal, color: THEME.white },
    ghost: { background: "transparent", color: THEME.gold, border: `1px solid ${THEME.gold}` },
  };
  return (
    <button onClick={onClick} style={{ ...b, ...v[variant], ...xs }} {...p}>
      {children}
    </button>
  );
};

// ─── Tab Definitions ───────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Season Dashboard", icon: "\uD83D\uDCCA" },
  { id: "players", label: "Player Profiles", icon: "\uD83D\uDC64" },
  { id: "export", label: "Export", icon: "\uD83D\uDCC4" },
];

// ─── Main Reports Panel ────────────────────────────────────────
export default function ReportsPanel({ players }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [games, setGames] = useState([]);
  const [practices, setPractices] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  useEffect(() => {
    loadStore(STORAGE_KEYS.GAMELOGS, []).then(setGames);
    loadStore("pirates-practices-unified-2026v1", []).then(setPractices);
  }, []);

  const completedPractices = practices.filter((p) => p.status === "completed");

  // Navigate to a specific player's profile
  const goToPlayer = (playerId) => {
    setSelectedPlayerId(playerId);
    setActiveTab("players");
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            color: THEME.gold,
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "'Oswald',sans-serif",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {"\uD83D\uDCCA"} Reports
        </h2>
        <p style={{ color: THEME.gray, margin: "4px 0 0 0", fontSize: 13 }}>
          Season stats, player profiles, and report generation
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: `2px solid ${THEME.charcoal}`,
          marginBottom: 20,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 20px",
              background: activeTab === tab.id ? THEME.gold : "transparent",
              color: activeTab === tab.id ? THEME.black : THEME.gray,
              border: "none",
              fontFamily: "'Oswald',sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              borderBottom:
                activeTab === tab.id
                  ? `2px solid ${THEME.gold}`
                  : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <SeasonDashboard
          players={players || []}
          games={games}
          completedPractices={completedPractices}
          onSelectPlayer={goToPlayer}
        />
      )}

      {activeTab === "players" && (
        <PlayerProfile
          players={players || []}
          games={games}
          completedPractices={completedPractices}
          selectedPlayerId={selectedPlayerId}
          onSelectPlayer={setSelectedPlayerId}
        />
      )}

      {activeTab === "export" && (
        <ExportReport
          players={players || []}
          games={games}
          completedPractices={completedPractices}
        />
      )}

      {/* Empty state */}
      {(!players || players.length === 0) && (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{"\uD83D\uDCCA"}</div>
          <p style={{ color: THEME.gray, margin: 0 }}>
            No players on the roster yet. Add players to see reports.
          </p>
        </Card>
      )}
    </div>
  );
}
