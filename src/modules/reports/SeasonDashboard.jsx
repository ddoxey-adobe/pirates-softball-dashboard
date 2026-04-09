import { useState } from "react";

// ─── Theme (mirrors App.jsx) ───────────────────────────────────
const THEME = {
  gold: "#FDB515", goldLight: "#FDCF58", goldDim: "#C89A12",
  black: "#1B1B1B", blackLight: "#27251F", charcoal: "#3A3A3A",
  white: "#FAF9F6", cream: "#F5F0E6", red: "#E74C3C", green: "#2ECC71",
  blue: "#3498DB", gray: "#8E8E8E", grayLight: "#C4C4C4",
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

const Sparkline = ({ data, width = 60, height = 20, color = THEME.gold, showArea = false }) => {
  if (!data || data.length === 0) return null;
  const values = typeof data[0] === "number" ? data : data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  const xScale = (i) => (i / (values.length - 1)) * width;
  const yScale = (v) => height - ((v - minValue) / range) * height;
  const pathData = values
    .map((val, i) => {
      const x = xScale(i);
      const y = yScale(val);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");
  const areaPath = showArea ? `${pathData} L ${width} ${height} L 0 ${height} Z` : null;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {showArea && areaPath && <path d={areaPath} fill={color} opacity="0.2" />}
      <path d={pathData} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ value, label, color = THEME.gold, borderColor }) => (
  <Card
    style={{
      padding: 16,
      background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`,
      border: `1px solid ${borderColor || color}40`,
      textAlign: "center",
    }}
  >
    <div
      style={{
        color,
        fontSize: 28,
        fontWeight: 700,
        fontFamily: "'Oswald',sans-serif",
      }}
    >
      {value}
    </div>
    <div
      style={{
        color: THEME.gray,
        fontSize: 11,
        textTransform: "uppercase",
        marginTop: 4,
      }}
    >
      {label}
    </div>
  </Card>
);

// ─── Helper: calculate batting stats ───────────────────────────
function calcBattingStats(players, games) {
  return players
    .map((player) => {
      const atBats = games.flatMap((g) => g.atBats || []).filter((ab) => ab.playerId === player.id);
      if (atBats.length === 0) return null;

      const hits = atBats.filter((ab) => ["1B", "2B", "3B", "HR"].includes(ab.result)).length;
      const singles = atBats.filter((ab) => ab.result === "1B").length;
      const doubles = atBats.filter((ab) => ab.result === "2B").length;
      const triples = atBats.filter((ab) => ab.result === "3B").length;
      const hrs = atBats.filter((ab) => ab.result === "HR").length;
      const totalBases = singles + doubles * 2 + triples * 3 + hrs * 4;
      const rbi = atBats.reduce((sum, ab) => sum + (ab.rbi || 0), 0);
      const runs = atBats.reduce((sum, ab) => sum + (ab.runs || 0), 0);
      const avg = atBats.length > 0 ? hits / atBats.length : 0;
      const slg = atBats.length > 0 ? totalBases / atBats.length : 0;

      return { player, atBats: atBats.length, hits, avg, slg, rbi, runs, hrs, doubles, triples };
    })
    .filter(Boolean)
    .sort((a, b) => b.avg - a.avg);
}

// ─── Helper: calculate pitching stats ──────────────────────────
// BUG FIX: Uses Array.isArray() check before .filter() on g.pitching
function calcPitchingStats(players, games) {
  return players
    .map((player) => {
      const pitching = games.flatMap((g) =>
        (Array.isArray(g.pitching) ? g.pitching : []).filter((p) => p.playerId === player.id)
      );
      if (pitching.length === 0) return null;

      const inningsPitched = pitching.reduce((sum, p) => sum + (p.innings || 0), 0);
      const earnedRuns = pitching.reduce((sum, p) => sum + (p.earnedRuns || 0), 0);
      const strikeouts = pitching.reduce((sum, p) => sum + (p.strikeouts || 0), 0);
      const walks = pitching.reduce((sum, p) => sum + (p.walks || 0), 0);
      const era = inningsPitched > 0 ? (earnedRuns / inningsPitched) * 7 : 0;

      return { player, inningsPitched, era, strikeouts, walks, earnedRuns, appearances: pitching.length };
    })
    .filter(Boolean)
    .sort((a, b) => a.era - b.era);
}

// ─── Component ─────────────────────────────────────────────────
export default function SeasonDashboard({ players, games, completedPractices, onSelectPlayer }) {
  // Game record
  const gameStats = {
    total: games.length,
    wins: games.filter((g) => g.result === "W").length,
    losses: games.filter((g) => g.result === "L").length,
    ties: games.filter((g) => g.result === "T").length,
    runsScored: games.reduce((sum, g) => sum + (g.ourScore || 0), 0),
    runsAllowed: games.reduce((sum, g) => sum + (g.theirScore || 0), 0),
  };
  gameStats.winPct = gameStats.total > 0 ? gameStats.wins / gameStats.total : 0;

  // Batting
  const battingStats = calcBattingStats(players, games);
  const teamAvg =
    battingStats.length > 0
      ? battingStats.reduce((sum, s) => sum + s.avg * s.atBats, 0) /
        battingStats.reduce((sum, s) => sum + s.atBats, 0)
      : 0;

  // Pitching
  const pitchingStats = calcPitchingStats(players, games);

  // Attendance
  const totalPractices = completedPractices.length;
  const avgAttendance =
    totalPractices > 0
      ? completedPractices.reduce(
          (sum, p) => sum + Object.values(p.attendance || {}).filter(Boolean).length,
          0
        ) / totalPractices
      : 0;

  // Recent games (last 5)
  const recentGames = [...games]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);

  // Batting avg trend per game (sparkline)
  const battingTrend = games
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    .map((g) => {
      const abs = g.atBats || [];
      if (abs.length === 0) return null;
      const hits = abs.filter((ab) => ["1B", "2B", "3B", "HR"].includes(ab.result)).length;
      return hits / abs.length;
    })
    .filter((v) => v !== null);

  const hasData = games.length > 0 || completedPractices.length > 0;

  if (!hasData) {
    return (
      <Card style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{"\uD83D\uDCCA"}</div>
        <p style={{ color: THEME.gray, margin: 0 }}>
          No games or practices recorded yet. Data will appear here as the season progresses.
        </p>
      </Card>
    );
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* ── Record & Key Stats ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        <StatCard
          value={`${gameStats.wins}-${gameStats.losses}${gameStats.ties > 0 ? `-${gameStats.ties}` : ""}`}
          label={`Record (${(gameStats.winPct * 100).toFixed(0)}%)`}
          color={THEME.green}
        />
        <StatCard value={teamAvg.toFixed(3)} label="Team Batting Avg" color={THEME.gold} />
        <StatCard value={gameStats.runsScored} label="Runs Scored" color={THEME.blue} />
        <StatCard
          value={`+${gameStats.runsScored - gameStats.runsAllowed}`}
          label="Run Differential"
          color={gameStats.runsScored >= gameStats.runsAllowed ? THEME.green : THEME.red}
        />
        <StatCard value={totalPractices} label="Practices" color={THEME.gold} />
        <StatCard value={avgAttendance.toFixed(1)} label="Avg Attendance" color={THEME.blue} />
      </div>

      {/* ── Team Batting Trend ── */}
      {battingTrend.length >= 2 && (
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3
              style={{
                color: THEME.gold,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "'Oswald',sans-serif",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Team Batting Trend
            </h3>
            <Sparkline data={battingTrend} width={120} height={28} color={THEME.gold} showArea />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {battingTrend.map((avg, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "6px 4px",
                  background: THEME.black,
                  borderRadius: 4,
                  border: `1px solid ${THEME.charcoal}`,
                }}
              >
                <div style={{ color: THEME.white, fontSize: 12, fontWeight: 700 }}>{avg.toFixed(3)}</div>
                <div style={{ color: THEME.gray, fontSize: 9 }}>Game {i + 1}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Recent Results ── */}
      {recentGames.length > 0 && (
        <Card style={{ padding: 16 }}>
          <h3
            style={{
              color: THEME.gold,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Oswald',sans-serif",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
            }}
          >
            Recent Results
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {recentGames.map((game) => {
              const isWin = game.result === "W";
              const isLoss = game.result === "L";
              const resultColor = isWin ? THEME.green : isLoss ? THEME.red : THEME.gray;

              return (
                <div
                  key={game.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    background: THEME.black,
                    borderRadius: 6,
                    border: `1px solid ${resultColor}40`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 16 }}>{isWin ? "\u2705" : isLoss ? "\u274C" : "\u23F8\uFE0F"}</div>
                    <div>
                      <div style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>
                        {game.date
                          ? new Date(game.date + "T12:00:00").toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : ""}{" "}
                        vs {game.opponent}
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 11 }}>
                        {game.location || "Unknown"}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: resultColor,
                      fontSize: 16,
                      fontWeight: 700,
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    {game.result} {game.ourScore}-{game.theirScore}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Top Hitters ── */}
      {battingStats.length > 0 && (
        <Card style={{ padding: 16 }}>
          <h3
            style={{
              color: THEME.gold,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Oswald',sans-serif",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
            }}
          >
            Top Hitters
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {battingStats.slice(0, 5).map((stat, idx) => (
              <div
                key={stat.player.id}
                onClick={() => onSelectPlayer?.(stat.player.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: idx === 0 ? THEME.blackLight : "transparent",
                  borderRadius: 4,
                  border: `1px solid ${idx === 0 ? THEME.gold : THEME.charcoal}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = THEME.blackLight)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = idx === 0 ? THEME.blackLight : "transparent")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: idx === 0 ? THEME.gold : THEME.charcoal,
                      color: idx === 0 ? THEME.black : THEME.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>
                    {stat.player.name}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.gold, fontWeight: 700 }}>{stat.avg.toFixed(3)}</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>AVG</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.white, fontWeight: 700 }}>{stat.hits}</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>H</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.white, fontWeight: 700 }}>{stat.rbi}</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>RBI</div>
                  </div>
                  {stat.hrs > 0 && (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: THEME.green, fontWeight: 700 }}>{stat.hrs}</div>
                      <div style={{ color: THEME.gray, fontSize: 10 }}>HR</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Top Pitchers ── */}
      {pitchingStats.length > 0 && (
        <Card style={{ padding: 16 }}>
          <h3
            style={{
              color: THEME.gold,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Oswald',sans-serif",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
            }}
          >
            Top Pitchers
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {pitchingStats.slice(0, 5).map((stat, idx) => (
              <div
                key={stat.player.id}
                onClick={() => onSelectPlayer?.(stat.player.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: idx === 0 ? THEME.blackLight : "transparent",
                  borderRadius: 4,
                  border: `1px solid ${idx === 0 ? THEME.gold : THEME.charcoal}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = THEME.blackLight)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = idx === 0 ? THEME.blackLight : "transparent")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: idx === 0 ? THEME.gold : THEME.charcoal,
                      color: idx === 0 ? THEME.black : THEME.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>
                    {stat.player.name}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.gold, fontWeight: 700 }}>{stat.era.toFixed(2)}</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>ERA</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.white, fontWeight: 700 }}>
                      {stat.inningsPitched.toFixed(1)}
                    </div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>IP</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.green, fontWeight: 700 }}>{stat.strikeouts}</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>K</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.red, fontWeight: 700 }}>{stat.walks}</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>BB</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Attendance Leaders ── */}
      {completedPractices.length > 0 && (
        <Card style={{ padding: 16 }}>
          <h3
            style={{
              color: THEME.gold,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Oswald',sans-serif",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
            }}
          >
            Attendance Leaders
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {players
              .map((player) => {
                const attended = completedPractices.filter((p) => p.attendance?.[player.id]).length;
                const pct = totalPractices > 0 ? (attended / totalPractices) * 100 : 0;
                return { player, attended, pct };
              })
              .sort((a, b) => b.pct - a.pct)
              .slice(0, 5)
              .map((data) => (
                <div
                  key={data.player.id}
                  onClick={() => onSelectPlayer?.(data.player.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: 4,
                    border: `1px solid ${data.pct < 70 ? THEME.red : THEME.charcoal}`,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>
                    {data.player.name}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 80,
                        height: 6,
                        background: THEME.charcoal,
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${data.pct}%`,
                          height: "100%",
                          background:
                            data.pct < 70
                              ? THEME.red
                              : `linear-gradient(90deg, ${THEME.gold} 0%, ${THEME.goldLight} 100%)`,
                        }}
                      />
                    </div>
                    <span style={{ color: THEME.gray, fontSize: 12, minWidth: 60, textAlign: "right" }}>
                      {data.attended}/{totalPractices} ({data.pct.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
