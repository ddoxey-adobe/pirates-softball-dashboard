import { useState } from "react";

// ─── Theme (mirrors App.jsx) ───────────────────────────────────
const THEME = {
  gold: "#FDB515", goldLight: "#FDCF58", goldDim: "#C89A12",
  black: "#1B1B1B", blackLight: "#27251F", charcoal: "#3A3A3A",
  white: "#FAF9F6", cream: "#F5F0E6", red: "#E74C3C", green: "#2ECC71",
  blue: "#3498DB", gray: "#8E8E8E", grayLight: "#C4C4C4",
};

// ─── Team config (matches App.jsx defaults) ────────────────────
function loadTeamConfig() {
  try {
    const saved = localStorage.getItem("team-config-v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        name: "Pirates",
        mascot: "\uD83C\uDFF4\u200D\u2620\uFE0F",
        season: "2026",
        league: "Lehi Rec Softball",
        ...parsed,
      };
    }
  } catch {}
  return { name: "Pirates", mascot: "\uD83C\uDFF4\u200D\u2620\uFE0F", season: "2026", league: "Lehi Rec Softball" };
}

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

// ─── CSV Export Utility ────────────────────────────────────────
function exportToCSV(data, filename) {
  const csv = data
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return '"' + str.replace(/"/g, '""') + '"';
          }
          return str;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Report Sections ──────────────────────────────────────────
const REPORT_SECTIONS = [
  { key: "teamSummary", label: "Team Summary", icon: "\uD83D\uDCCA", desc: "Season overview, record, key stats" },
  { key: "playerProfiles", label: "Player Profiles", icon: "\uD83D\uDC64", desc: "Individual stats and attendance for all players" },
  { key: "gameStats", label: "Game Statistics", icon: "\u26BE", desc: "Game-by-game results and batting/pitching stats" },
];

// ─── Component ─────────────────────────────────────────────────
export default function ExportReport({ players, games, completedPractices }) {
  const [exportConfig, setExportConfig] = useState({
    teamSummary: true,
    playerProfiles: true,
    gameStats: true,
  });
  const [exporting, setExporting] = useState(false);

  const TEAM_CONFIG = loadTeamConfig();
  const totalPractices = completedPractices.length;

  const hasData = games.length > 0 || completedPractices.length > 0;

  // ── Generate & Print HTML Report ──
  const generateReport = () => {
    setExporting(true);
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) {
      alert("Please allow popups to generate the report.");
      setExporting(false);
      return;
    }

    const gameWins = games.filter((g) => g.result === "W").length;
    const gameLosses = games.filter((g) => g.result === "L").length;
    const gameTies = games.filter((g) => g.result === "T").length;
    const winPct = games.length > 0 ? ((gameWins / games.length) * 100).toFixed(0) : 0;
    const avgAttendance =
      totalPractices > 0
        ? (
            completedPractices.reduce(
              (sum, p) => sum + Object.values(p.attendance || {}).filter(Boolean).length,
              0
            ) / totalPractices
          ).toFixed(1)
        : "0";

    let reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${TEAM_CONFIG.name} Softball - ${TEAM_CONFIG.season} Season Report</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .page-break { page-break-before: always; }
    }
    body {
      font-family: 'Arial', sans-serif;
      color: #1B1B1B;
      background: white;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { color: #FDB515; font-size: 32px; margin: 0 0 8px 0; text-transform: uppercase; }
    h2 { color: #FDB515; font-size: 24px; margin: 30px 0 12px 0; border-bottom: 2px solid #FDB515; padding-bottom: 8px; }
    h3 { color: #1B1B1B; font-size: 18px; margin: 20px 0 8px 0; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #FDB515; padding-bottom: 20px; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 20px 0; }
    .stat-card { padding: 12px; background: #F5F0E6; border-radius: 6px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #FDB515; }
    .stat-label { font-size: 12px; color: #8E8E8E; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th { background: #FDB515; color: #1B1B1B; padding: 8px; text-align: left; font-weight: bold; }
    td { padding: 8px; border-bottom: 1px solid #E0E0E0; }
    tr:nth-child(even) { background: #F9F9F9; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #FDB515; text-align: center; color: #8E8E8E; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${TEAM_CONFIG.mascot} ${TEAM_CONFIG.name} Softball</h1>
    <div style="font-size: 18px; color: #8E8E8E;">${TEAM_CONFIG.season} Season Report</div>
    <div style="font-size: 14px; color: #8E8E8E; margin-top: 8px;">Generated ${new Date().toLocaleDateString()}</div>
  </div>
`;

    // Team Summary
    if (exportConfig.teamSummary) {
      reportHTML += `
  <h2>Team Summary</h2>
  <div class="stat-grid">
    <div class="stat-card"><div class="stat-value">${players.length}</div><div class="stat-label">Players</div></div>
    <div class="stat-card"><div class="stat-value">${totalPractices}</div><div class="stat-label">Practices</div></div>
    <div class="stat-card"><div class="stat-value">${games.length}</div><div class="stat-label">Games</div></div>
    <div class="stat-card"><div class="stat-value">${gameWins}-${gameLosses}${gameTies > 0 ? `-${gameTies}` : ""}</div><div class="stat-label">Record</div></div>
    <div class="stat-card"><div class="stat-value">${winPct}%</div><div class="stat-label">Win %</div></div>
    <div class="stat-card"><div class="stat-value">${avgAttendance}</div><div class="stat-label">Avg Attendance</div></div>
  </div>
`;
    }

    // Player Profiles
    if (exportConfig.playerProfiles) {
      reportHTML += `
  <div class="page-break"></div>
  <h2>Player Profiles</h2>
  <table>
    <tr><th>Player</th><th>Grade</th><th>Position</th><th>Attendance</th><th>Batting Avg</th><th>Games</th></tr>
`;
      players.forEach((player) => {
        const attended = completedPractices.filter((p) => p.attendance?.[player.id]).length;
        const attendancePct =
          totalPractices > 0 ? ((attended / totalPractices) * 100).toFixed(0) : 0;

        const atBats = games
          .flatMap((g) => g.atBats || [])
          .filter((ab) => ab.playerId === player.id);
        const playerHits = atBats.filter((ab) =>
          ["1B", "2B", "3B", "HR"].includes(ab.result)
        ).length;
        const avg = atBats.length > 0 ? (playerHits / atBats.length).toFixed(3) : "--";

        const gamesPlayed = games.filter((g) =>
          (g.lineup || []).find((l) => l.playerId === player.id)
        ).length;

        reportHTML += `
    <tr>
      <td><strong>${player.name}</strong>${player.returning ? " (Ret)" : ""}</td>
      <td>${player.grade}</td>
      <td>${player.primaryPosition || "--"}</td>
      <td>${attendancePct}% (${attended}/${totalPractices})</td>
      <td>${avg}</td>
      <td>${gamesPlayed}</td>
    </tr>
`;
      });
      reportHTML += `</table>`;
    }

    // Game Statistics
    if (exportConfig.gameStats && games.length > 0) {
      reportHTML += `
  <div class="page-break"></div>
  <h2>Game Results</h2>
  <table>
    <tr><th>Date</th><th>Opponent</th><th>Result</th><th>Score</th><th>Location</th></tr>
`;
      games
        .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
        .forEach((game) => {
          reportHTML += `
    <tr>
      <td>${game.date ? new Date(game.date + "T12:00:00").toLocaleDateString() : "N/A"}</td>
      <td>${game.opponent || "Unknown"}</td>
      <td>${game.result === "W" ? "Win" : game.result === "L" ? "Loss" : "Tie"}</td>
      <td>${game.ourScore || 0} - ${game.theirScore || 0}</td>
      <td>${game.location || ""}</td>
    </tr>
`;
        });
      reportHTML += `</table>`;

      // Top hitters table
      const battingStats = players
        .map((player) => {
          const atBats = games
            .flatMap((g) => g.atBats || [])
            .filter((ab) => ab.playerId === player.id);
          if (atBats.length === 0) return null;
          const playerHits = atBats.filter((ab) =>
            ["1B", "2B", "3B", "HR"].includes(ab.result)
          ).length;
          const rbi = atBats.reduce((sum, ab) => sum + (ab.rbi || 0), 0);
          const avg = atBats.length > 0 ? playerHits / atBats.length : 0;
          return { name: player.name, atBats: atBats.length, hits: playerHits, avg, rbi };
        })
        .filter(Boolean)
        .sort((a, b) => b.avg - a.avg);

      if (battingStats.length > 0) {
        reportHTML += `
  <h3>Batting Leaders</h3>
  <table>
    <tr><th>Player</th><th>AB</th><th>H</th><th>AVG</th><th>RBI</th></tr>
`;
        battingStats.forEach((s) => {
          reportHTML += `
    <tr><td>${s.name}</td><td>${s.atBats}</td><td>${s.hits}</td><td>${s.avg.toFixed(3)}</td><td>${s.rbi}</td></tr>
`;
        });
        reportHTML += `</table>`;
      }

      // Top pitchers table  --  BUG FIX: Array.isArray() guard on g.pitching
      const pitchingStats = players
        .map((player) => {
          const pitching = games.flatMap((g) =>
            (Array.isArray(g.pitching) ? g.pitching : []).filter(
              (p) => p.playerId === player.id
            )
          );
          if (pitching.length === 0) return null;
          const ip = pitching.reduce((sum, p) => sum + (p.innings || 0), 0);
          const er = pitching.reduce((sum, p) => sum + (p.earnedRuns || 0), 0);
          const k = pitching.reduce((sum, p) => sum + (p.strikeouts || 0), 0);
          const bb = pitching.reduce((sum, p) => sum + (p.walks || 0), 0);
          const era = ip > 0 ? (er / ip) * 7 : 0;
          return { name: player.name, ip, era, k, bb, appearances: pitching.length };
        })
        .filter(Boolean)
        .sort((a, b) => a.era - b.era);

      if (pitchingStats.length > 0) {
        reportHTML += `
  <h3>Pitching Leaders</h3>
  <table>
    <tr><th>Player</th><th>IP</th><th>ERA</th><th>K</th><th>BB</th></tr>
`;
        pitchingStats.forEach((s) => {
          reportHTML += `
    <tr><td>${s.name}</td><td>${s.ip.toFixed(1)}</td><td>${s.era.toFixed(2)}</td><td>${s.k}</td><td>${s.bb}</td></tr>
`;
        });
        reportHTML += `</table>`;
      }
    }

    reportHTML += `
  <div class="footer">
    <div>${TEAM_CONFIG.name} Softball ${TEAM_CONFIG.season} Season</div>
    <div>Generated with Pirates Softball Dashboard</div>
  </div>
</body>
</html>
`;

    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
    reportWindow.print();
    setExporting(false);
  };

  // ── Export CSV ──
  const exportCSV = () => {
    const csvData = [
      ["Player", "Grade", "Position", "Returning", "Attendance %", "Games Played", "Batting Avg", "Hits", "RBI"],
    ];

    players.forEach((player) => {
      const attended = completedPractices.filter((p) => p.attendance?.[player.id]).length;
      const pct = totalPractices > 0 ? ((attended / totalPractices) * 100).toFixed(0) : "0";
      const atBats = games
        .flatMap((g) => g.atBats || [])
        .filter((ab) => ab.playerId === player.id);
      const playerHits = atBats.filter((ab) => ["1B", "2B", "3B", "HR"].includes(ab.result)).length;
      const avg = atBats.length > 0 ? (playerHits / atBats.length).toFixed(3) : "";
      const rbi = atBats.reduce((sum, ab) => sum + (ab.rbi || 0), 0);
      const gamesPlayed = games.filter((g) =>
        (g.lineup || []).find((l) => l.playerId === player.id)
      ).length;

      csvData.push([
        player.name,
        player.grade,
        player.primaryPosition || "",
        player.returning ? "Yes" : "No",
        pct + "%",
        gamesPlayed,
        avg,
        playerHits,
        rbi,
      ]);
    });

    exportToCSV(csvData, `${TEAM_CONFIG.name.toLowerCase()}-season-stats.csv`);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Info */}
      <Card style={{ padding: 16 }}>
        <h3
          style={{
            color: THEME.gold,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Oswald',sans-serif",
            margin: "0 0 8px 0",
            textTransform: "uppercase",
          }}
        >
          Generate Season Report
        </h3>
        <p style={{ color: THEME.gray, fontSize: 13, margin: 0 }}>
          Create a printable season report or download stats as CSV. Select the sections to include.
        </p>
      </Card>

      {/* Section Checkboxes */}
      <div style={{ display: "grid", gap: 12 }}>
        {REPORT_SECTIONS.map((section) => (
          <label
            key={section.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 14,
              background: exportConfig[section.key] ? `${THEME.gold}10` : THEME.blackLight,
              border: `1px solid ${exportConfig[section.key] ? THEME.gold : THEME.charcoal}`,
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <input
              type="checkbox"
              checked={exportConfig[section.key]}
              onChange={(e) =>
                setExportConfig({ ...exportConfig, [section.key]: e.target.checked })
              }
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            <div style={{ fontSize: 22 }}>{section.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: THEME.white, fontSize: 14, fontWeight: 600 }}>
                {section.label}
              </div>
              <div style={{ color: THEME.gray, fontSize: 11 }}>{section.desc}</div>
            </div>
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <Button onClick={generateReport} disabled={!hasData || exporting}>
          {"\uD83D\uDCC4"} Generate & Print Report
        </Button>
        <Button variant="secondary" onClick={exportCSV} disabled={!hasData}>
          {"\uD83D\uDCE5"} Download CSV
        </Button>
      </div>

      {/* Empty state */}
      {!hasData && (
        <Card style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{"\uD83D\uDCC4"}</div>
          <div style={{ color: THEME.gray, fontSize: 13 }}>
            No data to export yet. Complete some games or practices first.
          </div>
        </Card>
      )}
    </div>
  );
}
