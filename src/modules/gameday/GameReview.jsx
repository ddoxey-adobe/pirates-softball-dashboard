/**
 * GameReview — Post-game coach notes, per-player observations, stats summary
 *
 * From GameLog's "Coach Review" tab + computed stats summary.
 */

import { THEME } from '@app/theme';
import { isHit, abColor } from '@app/constants';
import Card from '@shared/components/Card';
import Badge from '@shared/components/Badge';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function pLine(abs) {
  const codes = abs.map((a) => (typeof a === 'string' ? a : a.code));
  const h = codes.filter((c) => isHit(c)).length;
  const ab = codes.filter((c) => !['BB', 'HBP', 'SAC'].includes(c)).length;
  return `${h}-${ab}`;
}

function calcAvg(abs) {
  const codes = abs.map((a) => (typeof a === 'string' ? a : a.code));
  const h = codes.filter((c) => isHit(c)).length;
  const ab = codes.filter((c) => !['BB', 'HBP', 'SAC'].includes(c)).length;
  if (ab === 0) return '--';
  return (h / ab).toFixed(3).replace(/^0/, '');
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function GameReview({ game, onUpdate, players }) {
  if (!game) return null;

  const review = game.review || {};
  const scoring = game.scoring || {};
  const gameState = game.gameState || {};
  const battingOrder = game.battingOrder || [];
  const availability = game.availability || {};
  const activePlayers = battingOrder.filter((id) => availability[id]);

  const atBats = scoring.atBats || {};
  const runs = scoring.runs || {};
  const rbis = scoring.rbis || {};
  const steals = scoring.steals || {};
  const defensiveStats = scoring.defensiveStats || {};
  const playingTime = gameState.playingTime || {};
  const observations = review.observations || {};

  const getPlayer = (id) => players.find((p) => p.id === id);

  const update = (patch) => onUpdate({ ...game, ...patch });
  const updateReview = (patch) => update({ review: { ...review, ...patch } });

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <div className="space-y-4">
      {/* ── Game Result ──────────────────────────────────────── */}
      <Card>
        <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">Game Result</h4>
        <div className="grid grid-cols-3 gap-3">
          {/* Result picker */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#C4C4C4]">Result</label>
            <select
              value={review.result || ''}
              onChange={(e) => updateReview({ result: e.target.value })}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: THEME.black,
                color: THEME.white,
                border: `1px solid ${THEME.charcoal}`,
                outline: 'none',
              }}
            >
              <option value="">--</option>
              <option value="W">Win</option>
              <option value="L">Loss</option>
              <option value="T">Tie</option>
            </select>
          </div>
          {/* Our score */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#C4C4C4]">Our Score</label>
            <input
              type="number"
              min={0}
              value={review.ourScore || ''}
              onChange={(e) => updateReview({ ourScore: e.target.value })}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: THEME.black,
                color: THEME.white,
                border: `1px solid ${THEME.charcoal}`,
                outline: 'none',
              }}
            />
          </div>
          {/* Their score */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#C4C4C4]">Their Score</label>
            <input
              type="number"
              min={0}
              value={review.theirScore || ''}
              onChange={(e) => updateReview({ theirScore: e.target.value })}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: THEME.black,
                color: THEME.white,
                border: `1px solid ${THEME.charcoal}`,
                outline: 'none',
              }}
            />
          </div>
        </div>
      </Card>

      {/* ── Batting Stats Summary ────────────────────────────── */}
      <Card>
        <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
          Batting Summary
        </h4>
        {activePlayers.length === 0 ? (
          <p className="text-sm text-[#8E8E8E] text-center py-4">
            No players in batting order.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr
                  className="text-left"
                  style={{
                    borderBottom: `1px solid ${THEME.charcoal}`,
                    color: THEME.gray,
                  }}
                >
                  <th className="py-2 pr-4 font-semibold">#</th>
                  <th className="py-2 pr-4 font-semibold">Player</th>
                  <th className="py-2 pr-4 font-semibold">AB</th>
                  <th className="py-2 pr-4 font-semibold">AVG</th>
                  <th className="py-2 pr-4 font-semibold">R</th>
                  <th className="py-2 pr-4 font-semibold">RBI</th>
                  <th className="py-2 pr-4 font-semibold">SB</th>
                  <th className="py-2 font-semibold">Results</th>
                </tr>
              </thead>
              <tbody>
                {activePlayers.map((pid, idx) => {
                  const p = getPlayer(pid);
                  if (!p) return null;
                  const abs = atBats[pid] || [];
                  const r = runs[pid] || 0;
                  const rbi = rbis[pid] || 0;
                  const sb = steals[pid] || 0;

                  return (
                    <tr
                      key={pid}
                      style={{
                        borderBottom: `1px solid ${THEME.charcoal}`,
                      }}
                    >
                      <td className="py-2 pr-4" style={{ color: THEME.gold }}>
                        {idx + 1}
                      </td>
                      <td className="py-2 pr-4 font-semibold text-[#FAF9F6]">
                        {p.name}
                      </td>
                      <td className="py-2 pr-4 text-[#FAF9F6]">
                        {pLine(abs)}
                      </td>
                      <td className="py-2 pr-4" style={{ color: THEME.gold }}>
                        {calcAvg(abs)}
                      </td>
                      <td className="py-2 pr-4" style={{ color: THEME.green }}>
                        {r || ''}
                      </td>
                      <td className="py-2 pr-4" style={{ color: THEME.blue }}>
                        {rbi || ''}
                      </td>
                      <td
                        className="py-2 pr-4"
                        style={{ color: THEME.goldDim }}
                      >
                        {sb || ''}
                      </td>
                      <td className="py-2">
                        <div className="flex gap-1 flex-wrap">
                          {abs.map((ab, j) => {
                            const code =
                              typeof ab === 'string' ? ab : ab.code;
                            return (
                              <span
                                key={j}
                                className="text-[9px] rounded px-1 py-0.5"
                                style={{
                                  background: `${abColor(code)}20`,
                                  color: abColor(code),
                                }}
                              >
                                {code}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Defensive Stats Summary ──────────────────────────── */}
      {Object.keys(defensiveStats).some(
        (pid) =>
          (defensiveStats[pid]?.putouts || 0) > 0 ||
          (defensiveStats[pid]?.assists || 0) > 0 ||
          (defensiveStats[pid]?.errors || 0) > 0 ||
          (defensiveStats[pid]?.pitches || 0) > 0,
      ) && (
        <Card>
          <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
            Defensive Stats
          </h4>
          <div className="space-y-2">
            {Object.keys(defensiveStats)
              .filter((pid) => {
                const s = defensiveStats[pid];
                return s.putouts || s.assists || s.errors || s.pitches;
              })
              .map((pid) => {
                const p = getPlayer(pid);
                const s = defensiveStats[pid];
                const pitches = s.pitches || 0;
                const statusColor =
                  pitches >= 60
                    ? THEME.red
                    : pitches >= 40
                      ? THEME.gold
                      : THEME.green;

                return (
                  <div
                    key={pid}
                    className="flex justify-between items-center rounded-md px-3 py-2"
                    style={{
                      background: THEME.black,
                      border: pitches > 0
                        ? `2px solid ${statusColor}`
                        : `1px solid ${THEME.charcoal}`,
                    }}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#FAF9F6]">
                        {p?.name}
                      </div>
                      <div className="flex gap-2 text-[11px] mt-0.5">
                        {s.putouts > 0 && (
                          <span style={{ color: THEME.green }}>
                            {s.putouts} PO
                          </span>
                        )}
                        {s.assists > 0 && (
                          <span style={{ color: THEME.blue }}>
                            {s.assists} A
                          </span>
                        )}
                        {s.errors > 0 && (
                          <span style={{ color: THEME.red }}>
                            {s.errors} E
                          </span>
                        )}
                      </div>
                    </div>
                    {pitches > 0 && (
                      <Badge color={statusColor}>{pitches} pitches</Badge>
                    )}
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* ── Playing Time Summary ─────────────────────────────── */}
      {Object.keys(playingTime).length > 0 && (
        <Card>
          <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
            Playing Time
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {players
              .filter((p) => availability[p.id])
              .sort(
                (a, b) =>
                  (playingTime[b.id] || 0) - (playingTime[a.id] || 0),
              )
              .map((player) => {
                const inn = playingTime[player.id] || 0;
                const maxInn = gameState.currentInning || 1;
                const pct = maxInn > 0 ? Math.round((inn / maxInn) * 100) : 0;
                return (
                  <div
                    key={player.id}
                    className="rounded-md p-2.5"
                    style={{
                      background: THEME.blackLight,
                      border: `1px solid ${THEME.charcoal}`,
                    }}
                  >
                    <div className="text-xs font-semibold text-[#FAF9F6]">
                      {player.name}
                    </div>
                    <div className="text-[11px] text-[#8E8E8E] mt-0.5">
                      {inn}/{maxInn} innings ({pct}%)
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* ── Pitching Entry (manual override from coach) ──────── */}
      {players.filter(
        (p) => p.isPitcher && availability[p.id],
      ).length > 0 && (
        <Card>
          <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
            Pitching (Coach Entry)
          </h4>
          <div className="space-y-3">
            {players
              .filter((p) => p.isPitcher && availability[p.id])
              .map((p) => {
                const pitching = scoring.pitching || {};
                const pData = pitching[p.id] || {};
                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-[auto_1fr_1fr] gap-3 items-center"
                  >
                    <span className="text-sm font-semibold text-[#FAF9F6] min-w-[80px]">
                      {p.name.split(' ')[0]}
                    </span>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-[#8E8E8E]">
                        Innings
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={pData.innings || ''}
                        onChange={(e) =>
                          update({
                            scoring: {
                              ...scoring,
                              pitching: {
                                ...pitching,
                                [p.id]: {
                                  ...pData,
                                  innings: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        className="rounded px-2 py-1.5 text-xs"
                        style={{
                          background: THEME.black,
                          color: THEME.white,
                          border: `1px solid ${THEME.charcoal}`,
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-[#8E8E8E]">
                        Pitches
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={pData.pitchCount || ''}
                        onChange={(e) =>
                          update({
                            scoring: {
                              ...scoring,
                              pitching: {
                                ...pitching,
                                [p.id]: {
                                  ...pData,
                                  pitchCount: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        className="rounded px-2 py-1.5 text-xs"
                        style={{
                          background: THEME.black,
                          color: THEME.white,
                          border: `1px solid ${THEME.charcoal}`,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* ── Player Observations ──────────────────────────────── */}
      <Card>
        <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
          Player Observations
        </h4>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {activePlayers.map((pid) => {
            const p = getPlayer(pid);
            if (!p) return null;
            return (
              <div key={pid} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#FAF9F6] min-w-[80px] flex-shrink-0">
                  {p.name.split(' ')[0]}
                </span>
                <input
                  value={observations[pid] || ''}
                  onChange={(e) =>
                    updateReview({
                      observations: {
                        ...observations,
                        [pid]: e.target.value,
                      },
                    })
                  }
                  placeholder="One thing..."
                  className="flex-1 rounded px-2 py-1.5 text-xs"
                  style={{
                    background: THEME.black,
                    color: THEME.white,
                    border: `1px solid ${THEME.charcoal}`,
                    outline: 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Coach Notes ──────────────────────────────────────── */}
      <Card>
        <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">Coach Notes</h4>
        <textarea
          value={review.coachNotes || ''}
          onChange={(e) => updateReview({ coachNotes: e.target.value })}
          placeholder="What worked, adjustments, highlights..."
          className="w-full text-sm rounded-md px-3 py-2 resize-y"
          style={{
            background: THEME.black,
            color: THEME.white,
            border: `1px solid ${THEME.charcoal}`,
            fontFamily: 'inherit',
            minHeight: 100,
            outline: 'none',
          }}
        />
      </Card>
    </div>
  );
}
