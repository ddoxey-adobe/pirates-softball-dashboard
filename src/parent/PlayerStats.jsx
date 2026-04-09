/**
 * PlayerStats — Individual player statistics view
 *
 * Shows batting average, hits, at-bats, runs, RBI, playing time per game,
 * position history, and season trend. Shareable via URL hash: #/stats/player-name
 *
 * Used in the ParentLayout for parent/player roles.
 */

import { useState, useMemo, useEffect } from 'react';
import THEME from '@data/theme';
import { SEED_PLAYERS } from '@data/players';
import { SEED_GAMELOGS } from '@data/gamelogs';
import { load } from '@app/storage';

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: THEME.gold,
    marginBottom: 12,
  },
  card: {
    background: THEME.blackLight,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: 10,
  },
  statBox: {
    background: THEME.black,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 10,
    padding: '12px 10px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: THEME.gold,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.gray,
    marginTop: 2,
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: `1px solid ${THEME.charcoal}`,
    fontSize: 13,
  },
  positionBadge: (color) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 600,
    color: THEME.white,
    background: color,
    marginRight: 4,
    marginBottom: 4,
  }),
  trendBar: (pct, color) => ({
    height: 24,
    width: `${Math.max(pct, 4)}%`,
    background: color,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 6,
    fontSize: 10,
    fontWeight: 600,
    color: THEME.black,
    marginBottom: 4,
    transition: 'width 0.3s',
  }),
  shareBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    background: THEME.charcoal,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 8,
    color: THEME.white,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: THEME.gray,
    padding: 40,
    fontSize: 14,
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

const isHit = (code) => ['1B', '2B', '3B', 'HR'].includes(code);
const isAtBat = (code) => !['BB', 'HBP', 'SAC'].includes(code);

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Resolve the player from hash URL like #/stats/player-name */
function getPlayerIdFromHash(players) {
  const hash = window.location.hash;
  const match = hash.match(/#\/stats\/(.+)/);
  if (!match) return null;
  const slug = match[1];
  const player = players.find((p) => slugify(p.name) === slug);
  return player ? player.id : null;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function PlayerStats({ playerId: propPlayerId }) {
  const players = load('pirates-players-2026v3', SEED_PLAYERS);
  const gamelogs = load('pirates-gamelogs-2026v1', SEED_GAMELOGS);

  // Resolve player: prop > hash URL > null
  const resolvedId = propPlayerId || getPlayerIdFromHash(players);
  const player = players.find((p) => p.id === resolvedId);

  const [copied, setCopied] = useState(false);

  // Update hash when player is set (for shareability)
  useEffect(() => {
    if (player && !window.location.hash.includes('/stats/')) {
      // Don't overwrite an existing stats hash
    }
  }, [player]);

  // ── Compute stats ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!player) return null;

    let hits = 0, atBats = 0, runs = 0, rbi = 0, doubles = 0, triples = 0, hr = 0, bb = 0;
    const gameStats = []; // per-game breakdowns
    const positionMap = {}; // position -> count
    const gameAppearances = [];

    gamelogs.forEach((game) => {
      // Check lineup for this player
      const lineupEntry = (game.lineup || []).find((l) => l.playerId === player.id);
      if (lineupEntry) {
        gameAppearances.push({
          date: game.date,
          opponent: game.opponent,
          position: lineupEntry.position,
        });
        positionMap[lineupEntry.position] = (positionMap[lineupEntry.position] || 0) + 1;
      }

      // At-bats in this game
      const playerABs = (game.atBats || []).filter((ab) => ab.playerId === player.id);
      let gameHits = 0, gameABs = 0, gameRuns = 0, gameRbi = 0;

      playerABs.forEach((ab) => {
        if (isHit(ab.result)) {
          hits++;
          gameHits++;
        }
        if (isAtBat(ab.result)) {
          atBats++;
          gameABs++;
        }
        runs += ab.runs || 0;
        gameRuns += ab.runs || 0;
        rbi += ab.rbi || 0;
        gameRbi += ab.rbi || 0;

        if (ab.result === '2B') doubles++;
        if (ab.result === '3B') triples++;
        if (ab.result === 'HR') hr++;
        if (ab.result === 'BB' || ab.result === 'HBP') bb++;
      });

      if (playerABs.length > 0 || lineupEntry) {
        gameStats.push({
          date: game.date,
          opponent: game.opponent || 'Unknown',
          hits: gameHits,
          atBats: gameABs,
          runs: gameRuns,
          rbi: gameRbi,
          avg: gameABs > 0 ? (gameHits / gameABs) : 0,
        });
      }
    });

    const avg = atBats > 0 ? hits / atBats : 0;
    const obp = (atBats + bb) > 0 ? (hits + bb) / (atBats + bb) : 0;
    const slg = atBats > 0 ? (hits + doubles + 2 * triples + 3 * hr) / atBats : 0;

    return {
      avg, hits, atBats, runs, rbi, doubles, triples, hr, bb, obp, slg,
      gameStats,
      positionMap,
      gameAppearances,
      gamesPlayed: gameAppearances.length,
    };
  }, [player, gamelogs]);

  // ── No player resolved ────────────────────────────────────────────────
  if (!player) {
    return (
      <div style={styles.empty}>
        No player data available. Make sure you are logged in with a valid access code.
      </div>
    );
  }

  if (!stats) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}#/stats/${slugify(player.name)}`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Position colors
  const POS_COLORS = {
    P: THEME.red, C: THEME.blue, '1B': THEME.green, '2B': THEME.gold,
    '3B': '#E67E22', SS: '#9B59B6', LF: '#1ABC9C', CF: '#1ABC9C',
    RF: '#1ABC9C', LCF: '#1ABC9C', RCF: '#1ABC9C', Bench: THEME.gray,
  };

  return (
    <div>
      {/* Player header */}
      <div style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: THEME.gold, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: THEME.black,
          }}
        >
          {player.jersey || player.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: THEME.white }}>
            {player.name}
          </div>
          <div style={{ fontSize: 12, color: THEME.gray }}>
            {player.grade} &middot; {player.positions.join(', ') || 'TBD'}
            {player.jersey ? ` &middot; #${player.jersey}` : ''}
          </div>
        </div>
        <button style={styles.shareBtn} onClick={handleShare}>
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Key stats grid */}
      <div style={styles.sectionTitle}>Season Stats</div>
      <div style={styles.statGrid}>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.avg.toFixed(3)}</div>
          <div style={styles.statLabel}>AVG</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.hits}</div>
          <div style={styles.statLabel}>Hits</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.atBats}</div>
          <div style={styles.statLabel}>AB</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.runs}</div>
          <div style={styles.statLabel}>Runs</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.rbi}</div>
          <div style={styles.statLabel}>RBI</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.gamesPlayed}</div>
          <div style={styles.statLabel}>Games</div>
        </div>
      </div>

      {/* Advanced stats */}
      <div style={{ ...styles.statGrid, marginTop: 10, marginBottom: 20 }}>
        <div style={styles.statBox}>
          <div style={{ ...styles.statValue, fontSize: 18 }}>{stats.obp.toFixed(3)}</div>
          <div style={styles.statLabel}>OBP</div>
        </div>
        <div style={styles.statBox}>
          <div style={{ ...styles.statValue, fontSize: 18 }}>{stats.slg.toFixed(3)}</div>
          <div style={styles.statLabel}>SLG</div>
        </div>
        <div style={styles.statBox}>
          <div style={{ ...styles.statValue, fontSize: 18 }}>{stats.hr}</div>
          <div style={styles.statLabel}>HR</div>
        </div>
        <div style={styles.statBox}>
          <div style={{ ...styles.statValue, fontSize: 18 }}>{stats.bb}</div>
          <div style={styles.statLabel}>BB</div>
        </div>
      </div>

      {/* Position History */}
      {Object.keys(stats.positionMap).length > 0 && (
        <>
          <div style={styles.sectionTitle}>Position History</div>
          <div style={styles.card}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {Object.entries(stats.positionMap)
                .sort((a, b) => b[1] - a[1])
                .map(([pos, count]) => (
                  <span key={pos} style={styles.positionBadge(POS_COLORS[pos] || THEME.gray)}>
                    {pos} ({count})
                  </span>
                ))}
            </div>
            {stats.gameAppearances.map((g, i) => (
              <div key={i} style={styles.tableRow}>
                <span style={{ color: THEME.grayLight }}>{g.date} vs {g.opponent}</span>
                <span style={styles.positionBadge(POS_COLORS[g.position] || THEME.gray)}>
                  {g.position}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Season Trend (game-by-game) */}
      {stats.gameStats.length >= 2 && (
        <>
          <div style={styles.sectionTitle}>Season Trend</div>
          <div style={styles.card}>
            {stats.gameStats.map((g, i) => {
              const barPct = g.avg * 100;
              const color = g.avg >= 0.300 ? THEME.green : g.avg >= 0.200 ? THEME.gold : THEME.red;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: THEME.gray, marginBottom: 2 }}>
                    <span>vs {g.opponent} ({g.date})</span>
                    <span>{g.hits}/{g.atBats} &middot; {g.atBats > 0 ? g.avg.toFixed(3) : '---'}</span>
                  </div>
                  <div style={styles.trendBar(barPct, color)}>
                    {g.atBats > 0 ? g.avg.toFixed(3) : ''}
                  </div>
                </div>
              );
            })}

            {/* Running average line summary */}
            <div style={{ marginTop: 10, fontSize: 12, color: THEME.grayLight, textAlign: 'center' }}>
              Season: {stats.hits}/{stats.atBats} &middot; {stats.avg.toFixed(3)} AVG &middot; {stats.runs} R &middot; {stats.rbi} RBI
            </div>
          </div>
        </>
      )}

      {/* Playing Time per Game */}
      {stats.gameStats.length > 0 && (
        <>
          <div style={styles.sectionTitle}>Game Log</div>
          <div style={styles.card}>
            <div style={{ ...styles.tableRow, fontWeight: 700, color: THEME.grayLight, borderBottom: `2px solid ${THEME.charcoal}` }}>
              <span style={{ flex: 2 }}>Opponent</span>
              <span style={{ flex: 1, textAlign: 'center' }}>H/AB</span>
              <span style={{ flex: 1, textAlign: 'center' }}>AVG</span>
              <span style={{ flex: 1, textAlign: 'center' }}>R</span>
              <span style={{ flex: 1, textAlign: 'center' }}>RBI</span>
            </div>
            {stats.gameStats.map((g, i) => (
              <div key={i} style={styles.tableRow}>
                <span style={{ flex: 2, color: THEME.white }}>vs {g.opponent}</span>
                <span style={{ flex: 1, textAlign: 'center', color: THEME.grayLight }}>
                  {g.hits}/{g.atBats}
                </span>
                <span style={{
                  flex: 1, textAlign: 'center', fontWeight: 600,
                  color: g.avg >= 0.300 ? THEME.green : g.avg >= 0.200 ? THEME.gold : THEME.red,
                }}>
                  {g.atBats > 0 ? g.avg.toFixed(3) : '---'}
                </span>
                <span style={{ flex: 1, textAlign: 'center', color: THEME.grayLight }}>{g.runs}</span>
                <span style={{ flex: 1, textAlign: 'center', color: THEME.grayLight }}>{g.rbi}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {stats.gameStats.length === 0 && (
        <div style={{ ...styles.card, ...styles.empty }}>
          No game data recorded yet. Stats will appear after the first game.
        </div>
      )}
    </div>
  );
}
