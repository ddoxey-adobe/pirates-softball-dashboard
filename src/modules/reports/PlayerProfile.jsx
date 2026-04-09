import { useState, useMemo } from "react";

// ─── Theme (mirrors App.jsx) ───────────────────────────────────
const THEME = {
  gold: "#FDB515", goldLight: "#FDCF58", goldDim: "#C89A12",
  black: "#1B1B1B", blackLight: "#27251F", charcoal: "#3A3A3A",
  white: "#FAF9F6", cream: "#F5F0E6", red: "#E74C3C", green: "#2ECC71",
  blue: "#3498DB", gray: "#8E8E8E", grayLight: "#C4C4C4",
};

// ─── Drill tracking config (mirrors App.jsx) ──────────────────
const TRACKABLE_DRILLS = {
  b1: { type: "time", label: "Time (seconds)", perPlayer: true, description: "Record each player's home-to-first time" },
  p2: { type: "strikes-balls", label: "Strikes / Balls", perPlayer: true, description: "Track strikes vs balls for each pitcher" },
  p3: { type: "number", label: "Pitch Count", perPlayer: true, description: "Total pitches thrown" },
  f3: { type: "team-count", label: "Consecutive Outs", perPlayer: false, description: "Team's best consecutive outs before error" },
  h9: { type: "number", label: "Points", perPlayer: true, description: "Total points (GB=1, FB=2, LD=3)" },
  h10: { type: "number", label: "Points", perPlayer: true, description: "Bunt accuracy points" },
  h11: { type: "level", label: "Level Reached", perPlayer: true, description: "Highest level (1-6) achieved" },
};

// ─── Shared UI ─────────────────────────────────────────────────
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

const LineChart = ({ data, width = 300, height = 150, color = THEME.gold, showDots = true, showGrid = true }) => {
  if (!data || data.length === 0)
    return (
      <div style={{ color: THEME.gray, fontSize: 12, textAlign: "center", padding: 20 }}>No data</div>
    );

  const padding = { top: 10, right: 10, bottom: 10, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  const xScale = (i) => padding.left + (i / (data.length - 1)) * chartWidth;
  const yScale = (v) => padding.top + chartHeight - ((v - minValue) / range) * chartHeight;
  const pathData = data
    .map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.value);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {showGrid && (
        <g>
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + chartHeight * (1 - pct);
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={THEME.charcoal}
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}
        </g>
      )}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDots &&
        data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(d.value)}
            r="4"
            fill={color}
            stroke={THEME.black}
            strokeWidth="2"
          />
        ))}
    </svg>
  );
};

// ─── Helpers ───────────────────────────────────────────────────
function formatDrillValue(value, type) {
  if (type === "time") return `${Number(value).toFixed(2)}s`;
  if (type === "strikes-balls") return `${(Number(value) * 100).toFixed(0)}%`;
  if (type === "level") return `Level ${Math.round(Number(value))}`;
  return `${Math.round(Number(value))} pts`;
}

function getPlayerDrillData(completedPractices, playerId, drillId) {
  const config = TRACKABLE_DRILLS[drillId];
  if (!config || !config.perPlayer) return [];
  return completedPractices
    .filter((p) => p.drillTracking?.[drillId]?.[playerId] && p.attendance?.[playerId])
    .map((p) => ({
      date: p.date,
      value: p.drillTracking[drillId][playerId],
      practice: p,
    }))
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

// ─── Component ─────────────────────────────────────────────────
export default function PlayerProfile({
  players,
  games,
  completedPractices,
  selectedPlayerId,
  onSelectPlayer,
}) {
  const [profileTab, setProfileTab] = useState("overview");

  const player = players.find((p) => p.id === selectedPlayerId);

  // Tracked drill IDs that have data
  const trackedDrillIds = useMemo(() => {
    return [
      ...new Set(completedPractices.flatMap((p) => Object.keys(p.drillTracking || {}))),
    ].filter((id) => TRACKABLE_DRILLS[id]?.perPlayer);
  }, [completedPractices]);

  // ── Player List (when no player selected) ──
  if (!player) {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: THEME.gray, fontSize: 13, margin: 0 }}>
            Select a player to view their detailed profile.
          </p>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {players.map((p) => {
            const attended = completedPractices.filter((pr) => pr.attendance?.[p.id]).length;
            const pct =
              completedPractices.length > 0
                ? ((attended / completedPractices.length) * 100).toFixed(0)
                : 0;

            // Batting avg
            const atBats = games.flatMap((g) => g.atBats || []).filter((ab) => ab.playerId === p.id);
            const hits = atBats.filter((ab) => ["1B", "2B", "3B", "HR"].includes(ab.result)).length;
            const avg = atBats.length > 0 ? (hits / atBats.length).toFixed(3) : "--";

            // BUG FIX: Array.isArray() check on pitching data before .filter()
            const pitchingApps = games.flatMap((g) =>
              (Array.isArray(g.pitching) ? g.pitching : []).filter((pi) => pi.playerId === p.id)
            ).length;

            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPlayer(p.id);
                  setProfileTab("overview");
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: THEME.blackLight,
                  borderRadius: 8,
                  border: `1px solid ${THEME.charcoal}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = THEME.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = THEME.charcoal)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: p.returning ? THEME.gold : THEME.charcoal,
                      color: p.returning ? THEME.black : THEME.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Oswald',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {p.jersey || p.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div style={{ color: THEME.white, fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                      <Badge>{p.grade}</Badge>
                      {p.primaryPosition && (
                        <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">
                          {p.primaryPosition}
                        </Badge>
                      )}
                      {p.isPitcher && (
                        <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">
                          Pitcher
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.gold, fontWeight: 700 }}>{avg}</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>AVG</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.white, fontWeight: 700 }}>{pct}%</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>ATT</div>
                  </div>
                  {pitchingApps > 0 && (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: THEME.blue, fontWeight: 700 }}>{pitchingApps}</div>
                      <div style={{ color: THEME.gray, fontSize: 10 }}>GP</div>
                    </div>
                  )}
                  <div style={{ color: THEME.gold, fontSize: 18, alignSelf: "center" }}>{"\u203A"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Selected Player Detail ──
  const totalPractices = completedPractices.length;
  const practicesAttended = completedPractices.filter((p) => p.attendance?.[player.id]).length;
  const attendancePercent = totalPractices > 0 ? (practicesAttended / totalPractices) * 100 : 0;

  // Batting
  const atBats = games.flatMap((g) => g.atBats || []).filter((ab) => ab.playerId === player.id);
  const hits = atBats.filter((ab) => ["1B", "2B", "3B", "HR"].includes(ab.result)).length;
  const totalABs = atBats.filter((ab) => !["BB", "HBP", "SAC"].includes(ab.result)).length;
  const walks = atBats.filter((ab) => ab.result === "BB").length;
  const strikeouts = atBats.filter((ab) => ["K", "\uA4D8"].includes(ab.result)).length;
  const battingAvg = totalABs > 0 ? hits / totalABs : 0;
  const rbi = atBats.reduce((sum, ab) => sum + (ab.rbi || 0), 0);
  const runs = atBats.reduce((sum, ab) => sum + (ab.runs || 0), 0);

  // Pitching  --  BUG FIX: Array.isArray() guard
  const pitchingData = games.flatMap((g) =>
    (Array.isArray(g.pitching) ? g.pitching : []).filter((p) => p.playerId === player.id)
  );
  const inningsPitched = pitchingData.reduce((sum, p) => sum + (p.innings || 0), 0);
  const pitchingStrikeouts = pitchingData.reduce((sum, p) => sum + (p.strikeouts || 0), 0);
  const pitchingWalks = pitchingData.reduce((sum, p) => sum + (p.walks || 0), 0);
  const earnedRuns = pitchingData.reduce((sum, p) => sum + (p.earnedRuns || 0), 0);
  const era = inningsPitched > 0 ? (earnedRuns / inningsPitched) * 7 : 0;

  // Games played
  const playerGames = games.filter((g) => (g.lineup || []).find((l) => l.playerId === player.id));

  // Drill performance
  const playerDrillStats = trackedDrillIds
    .map((drillId) => {
      const config = TRACKABLE_DRILLS[drillId];
      const drillData = getPlayerDrillData(completedPractices, player.id, drillId);
      if (drillData.length === 0) return null;

      let values = [];
      if (config.type === "time") {
        values = drillData.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v) && v > 0);
      } else if (config.type === "strikes-balls") {
        values = drillData.map((d) => {
          const s = d.value.strikes || 0;
          const b = d.value.balls || 0;
          return s + b > 0 ? s / (s + b) : 0;
        });
      } else {
        values = drillData.map((d) => parseInt(d.value)).filter((v) => !isNaN(v));
      }

      if (values.length === 0) return null;

      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const best = config.type === "time" ? Math.min(...values) : Math.max(...values);
      const latest = values[values.length - 1];

      return {
        drillId,
        config,
        drillData,
        values,
        avg,
        best,
        latest,
        count: values.length,
      };
    })
    .filter(Boolean);

  // Batting avg trend per game
  const battingTrendData = playerGames
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    .map((game) => {
      const gameABs = (game.atBats || []).filter((ab) => ab.playerId === player.id);
      if (gameABs.length === 0) return null;
      const gameHits = gameABs.filter((ab) => ["1B", "2B", "3B", "HR"].includes(ab.result)).length;
      return {
        value: gameHits / gameABs.length,
        label: game.date
          ? new Date(game.date + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "",
      };
    })
    .filter(Boolean);

  return (
    <div>
      {/* Back button + player name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <Button small variant="ghost" onClick={() => onSelectPlayer(null)}>
          {"\u2190"} All Players
        </Button>
        <h3
          style={{
            color: THEME.white,
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "'Oswald',sans-serif",
            margin: 0,
          }}
        >
          {player.name}
        </h3>
        {player.primaryPosition && (
          <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">
            {player.primaryPosition}
          </Badge>
        )}
        {player.isPitcher && (
          <Badge color={THEME.gold} bg="rgba(253,181,21,0.15)">
            Pitcher
          </Badge>
        )}
      </div>

      {/* Sub-tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          borderBottom: `1px solid ${THEME.charcoal}`,
          paddingBottom: 8,
        }}
      >
        {[
          ["overview", "Overview"],
          ["game", "Game Stats"],
          ["practice", "Practice Drills"],
        ].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setProfileTab(tab)}
            style={{
              padding: "8px 16px",
              background: profileTab === tab ? THEME.gold : "transparent",
              border: `1px solid ${profileTab === tab ? THEME.gold : THEME.charcoal}`,
              borderRadius: 6,
              color: profileTab === tab ? THEME.black : THEME.white,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {profileTab === "overview" && (
        <div style={{ display: "grid", gap: 16 }}>
          {/* Player info */}
          <Card style={{ padding: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 12,
              }}
            >
              <div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginBottom: 2 }}>
                  Grade
                </div>
                <div style={{ color: THEME.white, fontSize: 14, fontWeight: 600 }}>{player.grade}</div>
              </div>
              <div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginBottom: 2 }}>
                  Position
                </div>
                <div style={{ color: THEME.white, fontSize: 14, fontWeight: 600 }}>
                  {player.primaryPosition || "Not set"}
                </div>
              </div>
              <div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginBottom: 2 }}>
                  Status
                </div>
                <div style={{ color: THEME.white, fontSize: 14, fontWeight: 600 }}>
                  {player.returning ? "Returning" : "New"}
                </div>
              </div>
            </div>
          </Card>

          {/* Key stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 12,
            }}
          >
            <Card
              style={{
                padding: 16,
                background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`,
                border: `1px solid ${THEME.gold}40`,
                textAlign: "center",
              }}
            >
              <div style={{ color: THEME.gold, fontSize: 24, fontWeight: 700 }}>
                {attendancePercent.toFixed(0)}%
              </div>
              <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginTop: 4 }}>
                Attendance
              </div>
              <div style={{ color: THEME.gray, fontSize: 10, marginTop: 2 }}>
                {practicesAttended}/{totalPractices} practices
              </div>
            </Card>

            {playerGames.length > 0 && (
              <Card
                style={{
                  padding: 16,
                  background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`,
                  border: `1px solid ${THEME.green}40`,
                  textAlign: "center",
                }}
              >
                <div style={{ color: THEME.green, fontSize: 24, fontWeight: 700 }}>
                  {battingAvg.toFixed(3)}
                </div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginTop: 4 }}>
                  Batting Avg
                </div>
                <div style={{ color: THEME.gray, fontSize: 10, marginTop: 2 }}>
                  {hits}/{totalABs} ({playerGames.length} games)
                </div>
              </Card>
            )}

            <Card
              style={{
                padding: 16,
                background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`,
                border: `1px solid ${THEME.blue}40`,
                textAlign: "center",
              }}
            >
              <div style={{ color: THEME.blue, fontSize: 24, fontWeight: 700 }}>
                {playerGames.length}
              </div>
              <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginTop: 4 }}>
                Games Played
              </div>
            </Card>

            {inningsPitched > 0 && (
              <Card
                style={{
                  padding: 16,
                  background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`,
                  border: `1px solid ${THEME.red}40`,
                  textAlign: "center",
                }}
              >
                <div style={{ color: THEME.red, fontSize: 24, fontWeight: 700 }}>
                  {era.toFixed(2)}
                </div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginTop: 4 }}>
                  ERA
                </div>
                <div style={{ color: THEME.gray, fontSize: 10, marginTop: 2 }}>
                  {inningsPitched.toFixed(1)} IP
                </div>
              </Card>
            )}
          </div>

          {/* Drill summary */}
          {playerDrillStats.length > 0 && (
            <Card style={{ padding: 16 }}>
              <h4
                style={{
                  color: THEME.gold,
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                Drill Performance Summary
              </h4>
              <div style={{ display: "grid", gap: 12 }}>
                {playerDrillStats.map((stat) => (
                  <div
                    key={stat.drillId}
                    style={{
                      padding: 12,
                      background: THEME.black,
                      borderRadius: 6,
                      border: `1px solid ${THEME.charcoal}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>
                        {stat.drillId.toUpperCase()}
                      </span>
                      <span style={{ color: THEME.gray, fontSize: 11 }}>{stat.count} attempts</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                      <div>
                        <span style={{ color: THEME.gray }}>Best: </span>
                        <span style={{ color: THEME.green, fontWeight: 700 }}>
                          {formatDrillValue(stat.best, stat.config.type)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: THEME.gray }}>Avg: </span>
                        <span style={{ color: THEME.white, fontWeight: 700 }}>
                          {formatDrillValue(stat.avg, stat.config.type)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: THEME.gray }}>Latest: </span>
                        <span style={{ color: THEME.gold, fontWeight: 700 }}>
                          {formatDrillValue(stat.latest, stat.config.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── Game Stats Tab ── */}
      {profileTab === "game" && (
        <div style={{ display: "grid", gap: 16 }}>
          {playerGames.length > 0 ? (
            <>
              {/* Season totals */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                  gap: 12,
                }}
              >
                <Card style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ color: THEME.gold, fontSize: 20, fontWeight: 700 }}>
                    {battingAvg.toFixed(3)}
                  </div>
                  <div style={{ color: THEME.gray, fontSize: 10, textTransform: "uppercase" }}>AVG</div>
                </Card>
                <Card style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ color: THEME.white, fontSize: 20, fontWeight: 700 }}>{hits}</div>
                  <div style={{ color: THEME.gray, fontSize: 10, textTransform: "uppercase" }}>Hits</div>
                </Card>
                <Card style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ color: THEME.green, fontSize: 20, fontWeight: 700 }}>{rbi}</div>
                  <div style={{ color: THEME.gray, fontSize: 10, textTransform: "uppercase" }}>RBI</div>
                </Card>
                <Card style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ color: THEME.white, fontSize: 20, fontWeight: 700 }}>{runs}</div>
                  <div style={{ color: THEME.gray, fontSize: 10, textTransform: "uppercase" }}>Runs</div>
                </Card>
                <Card style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ color: THEME.blue, fontSize: 20, fontWeight: 700 }}>{walks}</div>
                  <div style={{ color: THEME.gray, fontSize: 10, textTransform: "uppercase" }}>BB</div>
                </Card>
                <Card style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ color: THEME.red, fontSize: 20, fontWeight: 700 }}>{strikeouts}</div>
                  <div style={{ color: THEME.gray, fontSize: 10, textTransform: "uppercase" }}>K</div>
                </Card>
              </div>

              {/* Pitching stats (if pitcher) */}
              {inningsPitched > 0 && (
                <Card style={{ padding: 16 }}>
                  <h4 style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                    Pitching Stats
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                      gap: 12,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: THEME.gold, fontSize: 20, fontWeight: 700 }}>
                        {era.toFixed(2)}
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 10 }}>ERA</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: THEME.white, fontSize: 20, fontWeight: 700 }}>
                        {inningsPitched.toFixed(1)}
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 10 }}>IP</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: THEME.green, fontSize: 20, fontWeight: 700 }}>
                        {pitchingStrikeouts}
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 10 }}>K</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: THEME.red, fontSize: 20, fontWeight: 700 }}>
                        {pitchingWalks}
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 10 }}>BB</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Batting trend chart */}
              {battingTrendData.length >= 2 && (
                <Card style={{ padding: 16 }}>
                  <h4 style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                    Batting Average by Game
                  </h4>
                  <LineChart
                    data={battingTrendData}
                    width={500}
                    height={180}
                    color={THEME.gold}
                    showDots
                    showGrid
                  />
                </Card>
              )}

              {/* Game-by-game breakdown */}
              <Card style={{ padding: 16 }}>
                <h4 style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                  Game-by-Game Performance
                </h4>
                <div style={{ display: "grid", gap: 8 }}>
                  {playerGames
                    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
                    .map((game) => {
                      const gameABs = (game.atBats || []).filter(
                        (ab) => ab.playerId === player.id
                      );
                      const gameHits = gameABs.filter((ab) =>
                        ["1B", "2B", "3B", "HR"].includes(ab.result)
                      ).length;
                      const gameAvg =
                        gameABs.length > 0 ? (gameHits / gameABs.length).toFixed(3) : ".000";
                      const lineup = (game.lineup || []).find((l) => l.playerId === player.id);

                      return (
                        <div
                          key={game.id}
                          style={{
                            padding: 10,
                            background: THEME.black,
                            borderRadius: 4,
                            border: `1px solid ${THEME.charcoal}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>
                              vs {game.opponent}
                            </div>
                            <div style={{ color: THEME.gray, fontSize: 11 }}>
                              {game.date
                                ? new Date(game.date + "T12:00:00").toLocaleDateString()
                                : "No date"}
                              {lineup && ` \u2022 #${lineup.battingOrder} ${lineup.position}`}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700 }}>
                              {gameAvg}
                            </div>
                            <div style={{ color: THEME.gray, fontSize: 10 }}>
                              {gameHits}/{gameABs.length}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </>
          ) : (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{"\u26BE"}</div>
              <div style={{ color: THEME.gray, fontSize: 13 }}>No game data yet.</div>
            </Card>
          )}
        </div>
      )}

      {/* ── Practice Drills Tab ── */}
      {profileTab === "practice" && (
        <div style={{ display: "grid", gap: 16 }}>
          {playerDrillStats.length > 0 ? (
            playerDrillStats.map((stat) => {
              // Prepare chart data
              const chartData = stat.drillData.map((d) => {
                let value = 0;
                if (stat.config.type === "strikes-balls") {
                  const s = d.value.strikes || 0;
                  const b = d.value.balls || 0;
                  value = s + b > 0 ? ((s / (s + b)) * 100) : 0;
                } else if (stat.config.type === "time") {
                  value = parseFloat(d.value) || 0;
                } else {
                  value = parseInt(d.value) || 0;
                }
                return {
                  value,
                  label: d.date
                    ? new Date(d.date + "T12:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "",
                };
              });

              const isImproving =
                chartData.length >= 2
                  ? stat.config.type === "time"
                    ? chartData[chartData.length - 1].value < chartData[0].value
                    : chartData[chartData.length - 1].value > chartData[0].value
                  : false;
              const chartColor = chartData.length >= 2 ? (isImproving ? THEME.green : THEME.red) : THEME.gold;

              return (
                <Card key={stat.drillId} style={{ padding: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, margin: 0 }}>
                      {stat.drillId.toUpperCase()} - {stat.config.description}
                    </h4>
                    <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                      <span style={{ color: THEME.green }}>
                        Best: {formatDrillValue(stat.best, stat.config.type)}
                      </span>
                      <span style={{ color: THEME.gray }}>
                        Avg: {formatDrillValue(stat.avg, stat.config.type)}
                      </span>
                    </div>
                  </div>

                  {chartData.length >= 2 && (
                    <div style={{ marginBottom: 12 }}>
                      <LineChart
                        data={chartData}
                        width={500}
                        height={160}
                        color={chartColor}
                        showDots
                        showGrid
                      />
                      <div style={{ marginTop: 6, color: THEME.gray, fontSize: 11, textAlign: "center" }}>
                        {stat.config.type === "time" && "Lower is better"}
                        {stat.config.type === "strikes-balls" && "Strike percentage over time"}
                        {(stat.config.type === "number" || stat.config.type === "level") && "Higher is better"}
                      </div>
                    </div>
                  )}

                  {/* Session list */}
                  <details>
                    <summary
                      style={{
                        color: THEME.gray,
                        fontSize: 11,
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      View all {stat.count} sessions
                    </summary>
                    <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
                      {stat.drillData.map((d, idx) => {
                        let displayVal = "";
                        if (stat.config.type === "strikes-balls") {
                          const s = d.value.strikes || 0;
                          const b = d.value.balls || 0;
                          const pct = s + b > 0 ? ((s / (s + b)) * 100).toFixed(0) : 0;
                          displayVal = `${s}/${b} (${pct}% strikes)`;
                        } else if (stat.config.type === "time") {
                          displayVal = `${d.value}s`;
                        } else if (stat.config.type === "level") {
                          displayVal = `Level ${d.value}`;
                        } else {
                          displayVal = `${d.value} pts`;
                        }
                        return (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "4px 8px",
                              background: THEME.black,
                              borderRadius: 4,
                              fontSize: 11,
                            }}
                          >
                            <span style={{ color: THEME.gray }}>
                              {d.date
                                ? new Date(d.date + "T12:00:00").toLocaleDateString()
                                : "No date"}
                            </span>
                            <span style={{ color: THEME.white, fontWeight: 600 }}>{displayVal}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </Card>
              );
            })
          ) : (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{"\uD83C\uDFAF"}</div>
              <div style={{ color: THEME.gray, fontSize: 13 }}>No practice drill tracking data yet.</div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
