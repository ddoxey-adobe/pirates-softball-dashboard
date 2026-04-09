/**
 * ScoutingPanel — Opponent scouting and game preparation
 * 
 * STATUS: Deferred (disabled by default)
 * This module is for travel ball coaches who need to scout opponents.
 * It will be extracted from the legacy App.jsx (~2,000 lines) when enabled.
 * 
 * Features (when built):
 * - Opponent team management with full rosters
 * - Per-player batting/pitching/defense scouting
 * - Live game tracking of opponents with auto-calculated stats
 * - Bulk league import (all teams at once)
 * - Exportable HTML scouting reports
 * 
 * To enable: Set enabled: true in moduleRegistry.js
 */

const THEME = { gold: "#FDB515", black: "#1B1B1B", blackLight: "#27251F", white: "#FAF9F6", charcoal: "#3A3A3A", gray: "#8E8E8E" };

const ScoutingPanel = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: THEME.blackLight, border: "1px solid " + THEME.charcoal, borderRadius: 12, padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <h2 style={{ color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontSize: 22, marginBottom: 8 }}>SCOUTING MODULE</h2>
        <p style={{ color: THEME.gray, fontSize: 14, maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
          Advanced opponent scouting for travel ball coaches. Track opposing batters, pitchers, and defensive tendencies.
        </p>
        <p style={{ color: THEME.gray, fontSize: 12, marginTop: 16, fontStyle: "italic" }}>
          This module is available for teams that need advanced game preparation. Contact your league administrator to enable it.
        </p>
      </div>
    </div>
  );
};

export default ScoutingPanel;
