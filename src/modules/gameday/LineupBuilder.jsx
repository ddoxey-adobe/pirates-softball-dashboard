/**
 * LineupBuilder — Unified lineup construction UI
 *
 * Merges functionality from:
 *   - LineupPlanner's template system (batting order + alignment references)
 *   - LineupBuilder's drag interface (position assignment + batting order)
 *
 * Provides:
 *   - Player availability toggles with attendance/playing-time warnings
 *   - Batting order construction with reorder arrows
 *   - Per-player position assignment via dropdown
 *   - Field coverage visualization (missing/doubled positions)
 *   - Alignment library (save/load/delete)
 *   - Auto-fill from available players
 *   - Print lineup card
 */

import { useState, useEffect } from 'react';
import { THEME } from '@app/theme';
import { POSITIONS, STORAGE_KEYS } from '@app/constants';
import { load } from '@app/storage';
import Button from '@shared/components/Button';
import Card from '@shared/components/Card';
import printLineupCard from './PrintLineup';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const FIELD_POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];

function getPlayerWarnings(playerId, practices, gameLogs) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentPractices = (practices || []).filter((p) => {
    if (!p.date || p.status !== 'completed') return false;
    const d = new Date(p.date + 'T12:00:00');
    return d >= thirtyDaysAgo;
  });

  const attended = recentPractices.filter((p) => p.attendance?.[playerId]).length;
  const attPct = recentPractices.length > 0 ? (attended / recentPractices.length) * 100 : 100;

  const played = (gameLogs || []).filter((g) =>
    (g.battingOrder || []).includes(playerId),
  ).length;
  const playPct = gameLogs.length > 0 ? (played / gameLogs.length) * 100 : 100;

  return {
    lowAttendance: attPct < 70,
    lowPlayingTime: playPct < 40 && attPct >= 70,
    attendancePercent: attPct,
    playingTimePercent: playPct,
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function LineupBuilder({
  game,
  onUpdate,
  players,
  alignmentLibrary,
  onSaveAlignment,
  onDeleteAlignment,
}) {
  // External data for warnings (read-only)
  const [practices, setPractices] = useState([]);
  const [gameLogs, setGameLogs] = useState([]);

  useEffect(() => {
    setPractices(load('pirates-practices-2026v3', []) || []);
    setGameLogs(load(STORAGE_KEYS.GAMELOGS, []) || []);
  }, []);

  if (!game) return null;

  const availability = game.availability || {};
  const battingOrder = game.battingOrder || [];
  const initialPositions = game.initialPositions || [];
  const gameAlignments = game.gameAlignments || [];

  const availablePlayers = players.filter((p) => availability[p.id]);

  /* ---- local mutation helpers (call onUpdate to propagate) ---- */
  const update = (patch) => onUpdate({ ...game, ...patch });

  const toggleAvailability = (playerId) => {
    update({
      availability: { ...availability, [playerId]: !availability[playerId] },
    });
  };

  /* ---- batting order helpers ---- */
  const addBatter = (playerId) => {
    const player = players.find((p) => p.id === playerId);
    const newPos = {
      playerId,
      position: player?.primaryPosition || 'Bench',
    };
    update({
      battingOrder: [...battingOrder, playerId],
      initialPositions: [...initialPositions, newPos],
    });
  };

  const removeBatter = (idx) => {
    const pid = battingOrder[idx];
    update({
      battingOrder: battingOrder.filter((_, i) => i !== idx),
      initialPositions: initialPositions.filter((p) => p.playerId !== pid),
    });
  };

  const moveBatter = (idx, dir) => {
    const to = idx + dir;
    if (to < 0 || to >= battingOrder.length) return;
    const newOrder = [...battingOrder];
    [newOrder[idx], newOrder[to]] = [newOrder[to], newOrder[idx]];
    update({ battingOrder: newOrder });
  };

  const setPosition = (playerId, position) => {
    const exists = initialPositions.find((p) => p.playerId === playerId);
    if (exists) {
      update({
        initialPositions: initialPositions.map((p) =>
          p.playerId === playerId ? { ...p, position } : p,
        ),
      });
    } else {
      update({
        initialPositions: [...initialPositions, { playerId, position }],
      });
    }
  };

  const autoFill = () => {
    const avail = players.filter((p) => availability[p.id]);
    const newOrder = avail.slice(0, 10).map((p) => p.id);
    const newPos = avail.slice(0, 10).map((p) => ({
      playerId: p.id,
      position: p.primaryPosition || 'Bench',
    }));
    update({ battingOrder: newOrder, initialPositions: newPos });
  };

  /* ---- field coverage analysis ---- */
  const posMap = {};
  initialPositions.forEach((p) => {
    if (FIELD_POSITIONS.includes(p.position)) {
      if (!posMap[p.position]) posMap[p.position] = [];
      posMap[p.position].push(p.playerId);
    }
  });
  const missingPositions = FIELD_POSITIONS.filter((pos) => !posMap[pos]);
  const doubledPositions = FIELD_POSITIONS.filter(
    (pos) => posMap[pos] && posMap[pos].length > 1,
  );

  /* ---- alignment helpers ---- */
  const saveToLibrary = () => {
    if (battingOrder.length === 0) {
      alert('Create a lineup first before saving to library');
      return;
    }
    const name = prompt('Save alignment to library as:');
    if (!name) return;
    onSaveAlignment?.({
      id: Date.now().toString(),
      name,
      positions: initialPositions.map((p) => ({
        playerId: p.playerId,
        position: p.position,
      })),
      isPrimary: false,
      createdDate: new Date().toISOString(),
    });
  };

  const loadAlignment = (alignment) => {
    const positions = alignment.positions || [];
    // Build a new batting order from the alignment positions if current is empty
    const newPositions = positions.map((p) => ({
      playerId: p.playerId,
      position: p.position,
    }));
    update({ initialPositions: newPositions });
  };

  const saveGameAlignment = () => {
    if (initialPositions.length === 0) {
      alert('Create positions first');
      return;
    }
    const name = prompt('Save alignment for this game as:');
    if (!name) return;
    update({
      gameAlignments: [
        ...gameAlignments,
        {
          id: Date.now().toString(),
          name,
          positions: initialPositions.map((p) => ({
            playerId: p.playerId,
            position: p.position,
          })),
        },
      ],
    });
  };

  const loadGameAlignment = (alignment) => {
    const positions = alignment.positions || [];
    update({
      initialPositions: positions.map((p) => ({
        playerId: p.playerId,
        position: p.position,
      })),
    });
  };

  const deleteGameAlignment = (alignmentId) => {
    update({
      gameAlignments: gameAlignments.filter((a) => a.id !== alignmentId),
    });
  };

  /* ---- print ---- */
  const handlePrint = () => {
    const bo = battingOrder.map((pid) => {
      const p = players.find((pl) => pl.id === pid);
      const pos = initialPositions.find((ip) => ip.playerId === pid);
      return {
        name: p ? p.name : 'Unknown',
        position: pos?.position || '',
      };
    });
    printLineupCard('Pirates', game.date, game.opponent, game.homeAway || 'home', bo);
  };

  /* ---- render helpers ---- */
  const positionForPlayer = (playerId) =>
    initialPositions.find((p) => p.playerId === playerId)?.position || 'Bench';

  const otherAssigned = (excludePid) =>
    initialPositions
      .filter((p) => p.playerId !== excludePid)
      .map((p) => p.position);

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <div className="space-y-4">
      {/* ── Player Availability ────────────────────────────────── */}
      <Card>
        <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
          Player Availability (
          {Object.values(availability).filter(Boolean).length}/{players.length})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {players.map((player) => {
            const isAvail = availability[player.id];
            const warns = getPlayerWarnings(player.id, practices, gameLogs);
            return (
              <div
                key={player.id}
                onClick={() => toggleAvailability(player.id)}
                className="cursor-pointer rounded-md px-3 py-2 transition-colors"
                style={{
                  background: isAvail ? THEME.blackLight : THEME.black,
                  border: `1px solid ${isAvail ? THEME.gold : THEME.charcoal}`,
                  opacity: isAvail ? 1 : 0.5,
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAvail || false}
                    onChange={() => {}}
                    className="cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#FAF9F6]">
                      {player.name}
                    </div>
                    {isAvail && (warns.lowAttendance || warns.lowPlayingTime) && (
                      <div className="text-[10px] text-[#E74C3C] mt-0.5">
                        {warns.lowAttendance && 'Low attendance '}
                        {warns.lowPlayingTime && 'Needs playing time'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Batting Order & Positions ─────────────────────────── */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-[#FAF9F6]">
            Batting Order & Positions
          </h4>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={autoFill}>
              Auto-Fill
            </Button>
            <Button size="sm" variant="secondary" onClick={handlePrint}>
              Print Card
            </Button>
          </div>
        </div>

        {battingOrder.length === 0 ? (
          <div className="text-center py-8 text-[#8E8E8E] text-sm">
            <div className="text-3xl mb-2">&#x26BE;</div>
            <p>
              No lineup created yet. Click "Auto-Fill" to get started, or add
              players below.
            </p>
          </div>
        ) : (
          <>
            {/* Field Coverage Visual */}
            <div
              className="rounded-lg p-4 mb-4"
              style={{
                background: THEME.blackLight,
                border: `1px solid ${THEME.charcoal}`,
              }}
            >
              <h5 className="text-xs font-bold text-[#FAF9F6] uppercase mb-3">
                Field Coverage
              </h5>
              <div className="grid grid-cols-3 gap-1.5 max-w-sm">
                {/* Row 1: Outfield */}
                {['LF', 'CF', 'RF'].map((pos) => {
                  const filled = posMap[pos]?.length > 0;
                  const pName = filled
                    ? players.find((p) => p.id === posMap[pos][0])?.name
                    : null;
                  return (
                    <div
                      key={pos}
                      className="rounded text-center px-2 py-1.5"
                      style={{
                        background: filled ? THEME.green + '20' : THEME.red + '20',
                        border: `1px solid ${filled ? THEME.green : THEME.red}`,
                      }}
                    >
                      <div className="text-[11px] font-bold text-[#FAF9F6]">
                        {pos}
                      </div>
                      <div
                        className="text-[9px] mt-0.5"
                        style={{ color: filled ? THEME.white : THEME.gray }}
                      >
                        {pName || '--'}
                      </div>
                    </div>
                  );
                })}
                {/* Row 2: Infield */}
                {['3B', 'SS', '2B'].map((pos) => {
                  const filled = posMap[pos]?.length > 0;
                  const pName = filled
                    ? players.find((p) => p.id === posMap[pos][0])?.name
                    : null;
                  return (
                    <div
                      key={pos}
                      className="rounded text-center px-2 py-1.5"
                      style={{
                        background: filled ? THEME.green + '20' : THEME.red + '20',
                        border: `1px solid ${filled ? THEME.green : THEME.red}`,
                      }}
                    >
                      <div className="text-[11px] font-bold text-[#FAF9F6]">
                        {pos}
                      </div>
                      <div
                        className="text-[9px] mt-0.5"
                        style={{ color: filled ? THEME.white : THEME.gray }}
                      >
                        {pName || '--'}
                      </div>
                    </div>
                  );
                })}
                {/* Row 3: 1B centered */}
                <div />
                {(() => {
                  const filled = posMap['1B']?.length > 0;
                  const pName = filled
                    ? players.find((p) => p.id === posMap['1B'][0])?.name
                    : null;
                  return (
                    <div
                      className="rounded text-center px-2 py-1.5"
                      style={{
                        background: filled ? THEME.green + '20' : THEME.red + '20',
                        border: `1px solid ${filled ? THEME.green : THEME.red}`,
                      }}
                    >
                      <div className="text-[11px] font-bold text-[#FAF9F6]">
                        1B
                      </div>
                      <div
                        className="text-[9px] mt-0.5"
                        style={{ color: filled ? THEME.white : THEME.gray }}
                      >
                        {pName || '--'}
                      </div>
                    </div>
                  );
                })()}
                <div />
                {/* Row 4: Battery */}
                {['C', 'P'].map((pos) => {
                  const filled = posMap[pos]?.length > 0;
                  const pName = filled
                    ? players.find((p) => p.id === posMap[pos][0])?.name
                    : null;
                  return (
                    <div
                      key={pos}
                      className="rounded text-center px-2 py-1.5"
                      style={{
                        background: filled ? THEME.green + '20' : THEME.red + '20',
                        border: `1px solid ${filled ? THEME.green : THEME.red}`,
                      }}
                    >
                      <div className="text-[11px] font-bold text-[#FAF9F6]">
                        {pos}
                      </div>
                      <div
                        className="text-[9px] mt-0.5"
                        style={{ color: filled ? THEME.white : THEME.gray }}
                      >
                        {pName || '--'}
                      </div>
                    </div>
                  );
                })}
              </div>
              {(missingPositions.length > 0 || doubledPositions.length > 0) && (
                <div className="mt-3 text-[11px]">
                  {missingPositions.length > 0 && (
                    <div style={{ color: THEME.red }}>
                      Missing: {missingPositions.join(', ')}
                    </div>
                  )}
                  {doubledPositions.length > 0 && (
                    <div style={{ color: THEME.red }}>
                      Doubled: {doubledPositions.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Batting Order Rows */}
            <div className="space-y-2 mb-4">
              {battingOrder.map((pid, idx) => {
                const player = players.find((p) => p.id === pid);
                const warns = getPlayerWarnings(pid, practices, gameLogs);
                const pos = positionForPlayer(pid);
                const assigned = otherAssigned(pid);
                const isFirst = idx === 0;
                const isLast = idx === battingOrder.length - 1;

                return (
                  <div
                    key={pid + '-' + idx}
                    className="flex items-center gap-2 rounded-md px-2 py-2"
                    style={{ background: THEME.black }}
                  >
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        disabled={isFirst}
                        onClick={() => moveBatter(idx, -1)}
                        className="text-[10px] rounded px-1.5 py-0.5"
                        style={{
                          background: isFirst ? THEME.charcoal : THEME.blackLight,
                          color: isFirst ? THEME.gray : THEME.white,
                          border: 'none',
                          cursor: isFirst ? 'not-allowed' : 'pointer',
                        }}
                      >
                        &#x25B2;
                      </button>
                      <button
                        disabled={isLast}
                        onClick={() => moveBatter(idx, 1)}
                        className="text-[10px] rounded px-1.5 py-0.5"
                        style={{
                          background: isLast ? THEME.charcoal : THEME.blackLight,
                          color: isLast ? THEME.gray : THEME.white,
                          border: 'none',
                          cursor: isLast ? 'not-allowed' : 'pointer',
                        }}
                      >
                        &#x25BC;
                      </button>
                    </div>

                    {/* Order number */}
                    <div
                      className="flex items-center justify-center rounded-md font-bold text-sm"
                      style={{
                        minWidth: 32,
                        height: 32,
                        background: THEME.gold,
                        color: THEME.black,
                      }}
                    >
                      {idx + 1}
                    </div>

                    {/* Player name */}
                    <div className="flex-1 text-[13px] text-[#FAF9F6]">
                      {player?.name}
                      {(warns.lowAttendance || warns.lowPlayingTime) && (
                        <div className="text-[10px] text-[#E74C3C] mt-0.5">
                          {warns.lowAttendance && 'Low attendance '}
                          {warns.lowPlayingTime && 'Needs playing time'}
                        </div>
                      )}
                    </div>

                    {/* Position dropdown */}
                    <select
                      value={pos}
                      onChange={(e) => setPosition(pid, e.target.value)}
                      className="text-xs rounded-md px-2 py-1.5"
                      style={{
                        background: THEME.blackLight,
                        color: THEME.white,
                        border: `1px solid ${THEME.charcoal}`,
                        minWidth: 90,
                      }}
                    >
                      {POSITIONS.map((p) => {
                        const taken =
                          assigned.includes(p) && p !== 'Bench';
                        return (
                          <option
                            key={p}
                            value={p}
                            disabled={taken}
                            style={{
                              color: taken ? THEME.gray : THEME.white,
                            }}
                          >
                            {p}
                            {taken ? ' (taken)' : ''}
                          </option>
                        );
                      })}
                    </select>

                    {/* Remove */}
                    <button
                      onClick={() => removeBatter(idx)}
                      className="text-xs rounded-md px-2.5 py-1.5 font-semibold"
                      style={{
                        background: THEME.red,
                        color: THEME.white,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      x
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Add player dropdown */}
        <select
          className="w-full text-sm rounded-lg px-3 py-2"
          style={{
            background: THEME.blackLight,
            color: THEME.white,
            border: `1px solid ${THEME.charcoal}`,
          }}
          onChange={(e) => {
            if (!e.target.value) return;
            addBatter(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">+ Add player to lineup...</option>
          {players
            .filter(
              (p) => availability[p.id] && !battingOrder.includes(p.id),
            )
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
      </Card>

      {/* ── Defensive Alignments ──────────────────────────────── */}
      <Card>
        <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
          Defensive Alignments
        </h4>

        {/* Library */}
        <div
          className="rounded-md p-3 mb-3"
          style={{ background: THEME.black }}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className="text-[11px] font-bold uppercase"
              style={{ color: THEME.gold }}
            >
              Reusable Library
            </div>
            <Button size="sm" variant="secondary" onClick={saveToLibrary}>
              + Save to Library
            </Button>
          </div>
          {(!alignmentLibrary || alignmentLibrary.length === 0) ? (
            <p className="text-center text-[11px] text-[#8E8E8E] py-3">
              No reusable alignments saved yet.
            </p>
          ) : (
            <div className="space-y-1.5">
              {alignmentLibrary.map((al) => (
                <div
                  key={al.id}
                  className="flex items-center justify-between rounded px-3 py-2"
                  style={{
                    background: THEME.blackLight,
                    border: `1px solid ${THEME.charcoal}`,
                  }}
                >
                  <div>
                    <div className="text-xs font-semibold text-[#FAF9F6]">
                      {al.name}{' '}
                      {al.isPrimary && (
                        <span style={{ color: THEME.gold }}>*</span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#8E8E8E] mt-0.5">
                      {al.positions?.length || 0} positions
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => loadAlignment(al)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm(`Delete "${al.name}" from library?`)) {
                          onDeleteAlignment?.(al.id);
                        }
                      }}
                    >
                      x
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Game-specific */}
        <div className="rounded-md p-3" style={{ background: THEME.black }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-bold text-[#FAF9F6] uppercase">
              This Game Only
            </div>
            <Button size="sm" variant="secondary" onClick={saveGameAlignment}>
              + Save for Game
            </Button>
          </div>
          {gameAlignments.length === 0 ? (
            <p className="text-center text-[11px] text-[#8E8E8E] py-3">
              No game-specific alignments.
            </p>
          ) : (
            <div className="space-y-1.5">
              {gameAlignments.map((al) => (
                <div
                  key={al.id}
                  className="flex items-center justify-between rounded px-3 py-2"
                  style={{
                    background: THEME.blackLight,
                    border: `1px solid ${THEME.charcoal}`,
                  }}
                >
                  <div className="text-xs font-semibold text-[#FAF9F6]">
                    {al.name}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => loadGameAlignment(al)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm(`Delete "${al.name}"?`)) {
                          deleteGameAlignment(al.id);
                        }
                      }}
                    >
                      x
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ── Notes ─────────────────────────────────────────────── */}
      <Card>
        <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">Notes</h4>
        <textarea
          value={game.notes || ''}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Strategy notes, reminders, special situations..."
          className="w-full text-sm rounded-md px-3 py-2 resize-y"
          style={{
            background: THEME.black,
            color: THEME.white,
            border: `1px solid ${THEME.charcoal}`,
            fontFamily: 'inherit',
            minHeight: 80,
            outline: 'none',
          }}
        />
      </Card>
    </div>
  );
}
