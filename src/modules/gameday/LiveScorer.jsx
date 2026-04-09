/**
 * LiveScorer — Pitch-by-pitch scoring interface
 *
 * Merges functionality from:
 *   - LineupBuilder's live game engine (field management, subs, injuries, playing time)
 *   - GameLog's live scorer (offense at-bat tracking, defense pitch counting)
 *
 * Two panels:
 *   Left  — Field Management: on-field positions, bench, substitutions, injuries
 *   Right — Scoring: offense (at-bats, pitch count, runs) / defense (pitcher tracking, quick plays)
 */

import { useState } from 'react';
import { THEME } from '@app/theme';
import { isHit, abColor } from '@app/constants';
import Button from '@shared/components/Button';
import Card from '@shared/components/Card';
import Badge from '@shared/components/Badge';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const OUT_CODES = ['K', 'GO', 'FO', 'SAC'];
const FIELD_POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];

/* ------------------------------------------------------------------ */
/*  Helper: compute line from at-bats array                           */
/* ------------------------------------------------------------------ */

function pLine(abs) {
  const codes = abs.map((a) => (typeof a === 'string' ? a : a.code));
  const h = codes.filter((c) => isHit(c)).length;
  const ab = codes.filter((c) => !['BB', 'HBP', 'SAC'].includes(c)).length;
  return `${h}-${ab}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function LiveScorer({ game, onUpdate, players }) {
  /* ---- local scoring state (not persisted until save) ---- */
  const [defenseMode, setDefenseMode] = useState('offense');
  const [curBatterIdx, setCurBatterIdx] = useState(0);
  const [count, setCount] = useState({ balls: 0, strikes: 0, fouls: 0 });
  const [showSBPicker, setShowSBPicker] = useState(false);
  const [showRunPicker, setShowRunPicker] = useState(false);

  // Pitcher tracking
  const [currentPitcher, setCurrentPitcher] = useState(null);
  const [pitchCount, setPitchCount] = useState({ pitches: 0, strikes: 0, balls: 0 });
  const [inningPitchers, setInningPitchers] = useState({});

  // Substitution modal
  const [subModal, setSubModal] = useState(null);
  const [injuryNotes, setInjuryNotes] = useState('');
  const [multiGameInjury, setMultiGameInjury] = useState(false);
  const [expandedInjuries, setExpandedInjuries] = useState([]);

  if (!game) return null;

  const gameState = game.gameState || {};
  const scoring = game.scoring || {};

  const battingOrder = game.battingOrder || [];
  const availability = game.availability || {};
  const activeBattingOrder = battingOrder.filter((id) => availability[id]);

  const getPlayer = (id) => players.find((p) => p.id === id);
  const curPid = activeBattingOrder[curBatterIdx];
  const curPlayer = getPlayer(curPid);

  /* ---- update helpers ---- */
  const update = (patch) => onUpdate({ ...game, ...patch });

  const updateGameState = (patch) =>
    update({ gameState: { ...gameState, ...patch } });

  const updateScoring = (patch) =>
    update({ scoring: { ...scoring, ...patch } });

  /* ================================================================ */
  /*  FIELD MANAGEMENT — Inning positions, subs, injuries             */
  /* ================================================================ */

  const currentInning = gameState.currentInning || 1;
  const inningData = gameState.inningData || {};
  const currentPositions = inningData[currentInning] || [];
  const playingTime = gameState.playingTime || {};
  const onFieldIds = currentPositions.map((p) => p.playerId);
  const injuredPlayers = gameState.injuredPlayers || [];
  const substitutionHistory = gameState.substitutionHistory || [];

  const activelyInjuredIds = injuredPlayers
    .filter((ip) => !ip.returnedInning && ip.multiGame)
    .map((ip) => ip.playerId);

  const benchPlayers = players.filter(
    (p) =>
      availability[p.id] &&
      !onFieldIds.includes(p.id) &&
      !activelyInjuredIds.includes(p.id),
  );

  // Group injuries by player
  const injuredMap = {};
  injuredPlayers.forEach((inj) => {
    if (!injuredMap[inj.playerId]) injuredMap[inj.playerId] = [];
    injuredMap[inj.playerId].push(inj);
  });
  const injuredSummary = Object.keys(injuredMap).map((pid) => {
    const list = injuredMap[pid];
    const latest = list[list.length - 1];
    const player = getPlayer(pid);
    return { ...player, ...latest, injuryCount: list.length, allInjuries: list };
  });

  /* ---- Inning controls ---- */
  const advanceInning = () => {
    const next = currentInning + 1;
    const updatedPT = { ...playingTime };
    currentPositions.forEach((spot) => {
      updatedPT[spot.playerId] = (updatedPT[spot.playerId] || 0) + 1;
    });
    updateGameState({
      currentInning: next,
      inningData: { ...inningData, [next]: [...currentPositions] },
      playingTime: updatedPT,
    });
    // Also sync scoring inning
    updateScoring({ inning: next, outs: 0 });
  };

  const prevInning = () => {
    if (currentInning <= 1) return;
    if (!confirm('Go back to previous inning? This will revert positions.')) return;
    updateGameState({ currentInning: currentInning - 1 });
  };

  /* ---- Substitution ---- */
  const makeSubstitution = (incomingPlayerId) => {
    const updatedPositions = currentPositions.map((spot) =>
      spot.playerId === subModal.playerId
        ? { ...spot, playerId: incomingPlayerId }
        : spot,
    );

    const newInjured = subModal.isInjury
      ? [
          ...injuredPlayers,
          {
            playerId: subModal.playerId,
            inning: currentInning,
            position: subModal.position,
            timestamp: new Date().toISOString(),
            notes: injuryNotes || '',
            multiGame: multiGameInjury,
            returnedInning: null,
          },
        ]
      : injuredPlayers;

    updateGameState({
      inningData: { ...inningData, [currentInning]: updatedPositions },
      injuredPlayers: newInjured,
      substitutionHistory: [
        ...substitutionHistory,
        {
          inning: currentInning,
          out: subModal.playerId,
          in: incomingPlayerId,
          position: subModal.position,
          isInjury: subModal.isInjury || false,
          timestamp: new Date().toISOString(),
        },
      ],
    });
    setSubModal(null);
    setInjuryNotes('');
    setMultiGameInjury(false);
  };

  /* ---- Smart sub sorting ---- */
  const getEligibleSubs = () => {
    if (!subModal) return [];
    return benchPlayers
      .map((p) => {
        const player = getPlayer(p.id);
        const inn = playingTime[p.id] || 0;
        const needsTime = inn < currentInning * 0.5;

        // Position history this game
        const posHist = {};
        Object.values(inningData).forEach((positions) => {
          const spot = positions.find((s) => s.playerId === p.id);
          if (spot) posHist[spot.position] = (posHist[spot.position] || 0) + 1;
        });
        const hasPlayed = (posHist[subModal.position] || 0) > 0;

        let matchType = 4;
        let matchLabel = 'New position';
        let matchDesc = `Never played ${subModal.position} this game`;

        if (player?.primaryPosition === subModal.position) {
          matchType = 1;
          matchLabel = 'Primary position';
          matchDesc = 'This is their main position';
        } else if ((player?.secondaryPositions || []).includes(subModal.position)) {
          matchType = 2;
          matchLabel = 'Secondary position';
          matchDesc = `Listed as backup for ${subModal.position}`;
        } else if (hasPlayed) {
          matchType = 3;
          matchLabel = 'Has experience';
          matchDesc = `Played ${subModal.position} ${posHist[subModal.position]}x this game`;
        }

        return {
          ...p,
          inningsPlayed: inn,
          needsPlayingTime: needsTime,
          matchType,
          matchLabel,
          matchDesc,
        };
      })
      .sort((a, b) => {
        if (a.matchType !== b.matchType) return a.matchType - b.matchType;
        return a.inningsPlayed - b.inningsPlayed;
      });
  };

  /* ---- Alignment loading ---- */
  const loadAlignmentIntoGame = (positions) => {
    updateGameState({
      inningData: {
        ...inningData,
        [currentInning]: positions.map((p) => ({
          playerId: p.playerId,
          position: p.position,
        })),
      },
      substitutionHistory: [
        ...substitutionHistory,
        {
          inning: currentInning,
          type: 'alignment',
          timestamp: new Date().toISOString(),
        },
      ],
    });
  };

  /* ================================================================ */
  /*  OFFENSE SCORING — At-bat tracking                               */
  /* ================================================================ */

  const atBats = scoring.atBats || {};
  const runs = scoring.runs || {};
  const rbis = scoring.rbis || {};
  const steals = scoring.steals || {};
  const outs = scoring.outs || 0;
  const scoringInning = scoring.inning || 1;
  const defensiveStats = scoring.defensiveStats || {};

  const resetCount = () => setCount({ balls: 0, strikes: 0, fouls: 0 });

  const recordABWithCount = (code, countData) => {
    const pid = activeBattingOrder[curBatterIdx];
    if (!pid) return;
    const c = countData || { balls: count.balls, strikes: count.strikes, fouls: count.fouls };
    const newAB = { code, inning: scoringInning, balls: c.balls, strikes: c.strikes, fouls: c.fouls };
    const newAbs = { ...atBats, [pid]: [...(atBats[pid] || []), newAB] };
    let newOuts = outs;
    let newInn = scoringInning;
    if (OUT_CODES.includes(code)) {
      newOuts = outs + 1;
      if (newOuts >= 3) {
        newOuts = 0;
        newInn = scoringInning + 1;
      }
    }
    updateScoring({ atBats: newAbs, outs: newOuts, inning: newInn });
    setCurBatterIdx((curBatterIdx + 1) % activeBattingOrder.length);
    resetCount();
  };

  const recordAB = (code) => recordABWithCount(code);

  const addBall = () => {
    const nb = count.balls + 1;
    if (nb >= 4) {
      recordABWithCount('BB', { balls: nb, strikes: count.strikes, fouls: count.fouls });
    } else {
      setCount({ ...count, balls: nb });
    }
  };

  const addStrike = () => {
    const ns = count.strikes + 1;
    if (ns >= 3) {
      recordABWithCount('K', { balls: count.balls, strikes: ns, fouls: count.fouls });
    } else {
      setCount({ ...count, strikes: ns });
    }
  };

  const addFoul = () => {
    if (count.strikes < 2) {
      setCount({ ...count, strikes: count.strikes + 1, fouls: count.fouls + 1 });
    } else {
      setCount({ ...count, fouls: count.fouls + 1 });
    }
  };

  const undoLastAB = () => {
    const prevIdx =
      (curBatterIdx - 1 + activeBattingOrder.length) % activeBattingOrder.length;
    const pid = activeBattingOrder[prevIdx];
    if (!pid) return;
    const abs = atBats[pid] || [];
    if (abs.length === 0) return;
    const removed = abs[abs.length - 1];
    const removedCode = typeof removed === 'string' ? removed : removed.code;
    let newOuts = outs;
    let newInn = scoringInning;
    if (OUT_CODES.includes(removedCode)) {
      if (outs === 0 && scoringInning > 1) {
        newOuts = 2;
        newInn = scoringInning - 1;
      } else {
        newOuts = Math.max(0, outs - 1);
      }
    }
    updateScoring({
      atBats: { ...atBats, [pid]: abs.slice(0, -1) },
      outs: newOuts,
      inning: newInn,
    });
    setCurBatterIdx(prevIdx);
    if (typeof removed === 'object' && removed.balls !== undefined) {
      setCount({ balls: removed.balls, strikes: removed.strikes, fouls: removed.fouls || 0 });
    } else {
      resetCount();
    }
  };

  /* ---- Pitcher tracking (defense mode) ---- */
  const savePitcherStats = () => {
    if (!currentPitcher || pitchCount.pitches === 0) return;
    updateScoring({
      defensiveStats: {
        ...defensiveStats,
        [currentPitcher]: {
          ...(defensiveStats[currentPitcher] || { putouts: 0, assists: 0, errors: 0, pitches: 0 }),
          pitches:
            (defensiveStats[currentPitcher]?.pitches || 0) + pitchCount.pitches,
        },
      },
    });
    setInningPitchers((prev) => ({
      ...prev,
      [scoringInning]: [
        ...(prev[scoringInning] || []),
        {
          playerId: currentPitcher,
          pitches: pitchCount.pitches,
          strikes: pitchCount.strikes,
          balls: pitchCount.balls,
        },
      ],
    }));
    setPitchCount({ pitches: 0, strikes: 0, balls: 0 });
  };

  const defPlayOut = () => {
    const newOuts = outs + 1;
    if (newOuts >= 3) {
      updateScoring({ outs: 0, inning: scoringInning + 1 });
    } else {
      updateScoring({ outs: newOuts });
    }
  };

  /* ================================================================ */
  /*  RENDER — Big button helper                                      */
  /* ================================================================ */

  const bigBtn = (label, color, bg, onClick) => (
    <button
      onClick={onClick}
      className="w-full font-bold rounded-lg cursor-pointer"
      style={{
        padding: '14px 0',
        fontSize: 15,
        background: bg,
        color,
        border: 'none',
        fontFamily: "'Oswald',sans-serif",
        minHeight: 48,
      }}
    >
      {label}
    </button>
  );

  const isHome = game.homeAway === 'home';

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <div>
      {/* ── Inning & Outs Header ─────────────────────────────── */}
      <div
        className="flex items-center justify-between rounded-lg px-4 py-3 mb-4"
        style={{ background: THEME.black }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[#8E8E8E] text-sm">Inning</span>
          <button
            onClick={prevInning}
            className="w-7 h-7 rounded text-sm"
            style={{
              background: THEME.charcoal,
              color: THEME.white,
              border: 'none',
              cursor: currentInning > 1 ? 'pointer' : 'not-allowed',
              opacity: currentInning > 1 ? 1 : 0.5,
            }}
          >
            -
          </button>
          <span
            className="text-2xl font-bold min-w-[28px] text-center"
            style={{ color: THEME.gold, fontFamily: "'Oswald',sans-serif" }}
          >
            {currentInning}
          </span>
          <button
            onClick={advanceInning}
            className="w-7 h-7 rounded text-sm"
            style={{
              background: THEME.charcoal,
              color: THEME.white,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#8E8E8E] text-sm">Outs</span>
          {[0, 1, 2].map((o) => (
            <div
              key={o}
              className="w-5 h-5 rounded-full"
              style={{
                background: o < outs ? THEME.red : THEME.charcoal,
                border: `2px solid ${o < outs ? THEME.red : THEME.gray}`,
              }}
            />
          ))}
          <span
            className="text-lg font-bold ml-1"
            style={{ color: THEME.red, fontFamily: "'Oswald',sans-serif" }}
          >
            {outs}
          </span>
        </div>
      </div>

      {/* ── Two-column layout: Field | Scoring ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ============================================================= */}
        {/*  LEFT COLUMN — Field Management                                */}
        {/* ============================================================= */}
        <div className="space-y-4">
          {/* On Field */}
          <Card>
            <h3 className="text-sm font-bold text-[#FAF9F6] mb-3">
              On Field (Inning {currentInning})
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {currentPositions.map((spot) => {
                const player = getPlayer(spot.playerId);
                const inn = playingTime[spot.playerId] || 0;
                return (
                  <div
                    key={spot.playerId}
                    className="rounded-md p-3"
                    style={{
                      background: THEME.blackLight,
                      border: `1px solid ${THEME.charcoal}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="flex items-center justify-center rounded-md font-bold text-xs"
                        style={{
                          minWidth: 28,
                          height: 28,
                          background: THEME.gold,
                          color: THEME.black,
                        }}
                      >
                        {spot.position}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#FAF9F6]">
                          {player?.name}
                        </div>
                        <div className="text-[10px] text-[#8E8E8E]">
                          {inn} inn
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 !text-[10px] !px-1"
                        onClick={() => {
                          setInjuryNotes('');
                          setMultiGameInjury(false);
                          setSubModal({
                            playerId: spot.playerId,
                            position: spot.position,
                          });
                        }}
                      >
                        Sub
                      </Button>
                      <button
                        onClick={() => {
                          setInjuryNotes('');
                          setMultiGameInjury(false);
                          setSubModal({
                            playerId: spot.playerId,
                            position: spot.position,
                            isInjury: true,
                          });
                        }}
                        className="text-[10px] rounded-md px-2 py-1 font-semibold"
                        style={{
                          background: THEME.red,
                          color: THEME.white,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Inj
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Bench */}
          <Card>
            <h3 className="text-sm font-bold text-[#FAF9F6] mb-3">
              Bench ({benchPlayers.length})
            </h3>
            {benchPlayers.length === 0 ? (
              <p className="text-center text-[#8E8E8E] text-xs py-4">
                Everyone is on the field!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {benchPlayers.map((player) => {
                  const inn = playingTime[player.id] || 0;
                  const needsTime = inn < currentInning * 0.5;
                  return (
                    <div
                      key={player.id}
                      className="rounded-md p-2.5"
                      style={{
                        background: needsTime
                          ? 'rgba(231,76,60,0.1)'
                          : THEME.blackLight,
                        border: `1px solid ${needsTime ? THEME.red : THEME.charcoal}`,
                      }}
                    >
                      <div className="text-xs font-semibold text-[#FAF9F6]">
                        {player.name}
                      </div>
                      <div className="text-[11px] text-[#8E8E8E]">
                        {inn} innings
                      </div>
                      {needsTime && (
                        <div className="text-[10px] text-[#E74C3C] mt-1">
                          Needs playing time
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Injured */}
          {injuredSummary.length > 0 && (
            <Card
              className="!border-[#E74C3C]"
              style={{ background: 'rgba(231,76,60,0.05)' }}
            >
              <h3 className="text-sm font-bold mb-3" style={{ color: THEME.red }}>
                Injured ({injuredSummary.length})
              </h3>
              <div className="space-y-2">
                {injuredSummary.map((inj) => {
                  const canReturn = !inj.multiGame && !inj.returnedInning;
                  const hasReturned = !!inj.returnedInning;
                  const isExpanded = expandedInjuries.includes(inj.playerId);

                  return (
                    <div
                      key={inj.playerId}
                      className="rounded-md p-3 transition-all"
                      style={{
                        background: THEME.blackLight,
                        border: `2px solid ${hasReturned ? THEME.green : THEME.red}`,
                        opacity: hasReturned ? 0.6 : 1,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-md text-lg"
                          style={{
                            minWidth: 32,
                            height: 32,
                            background: hasReturned ? THEME.green : THEME.red,
                            color: THEME.white,
                          }}
                        >
                          {hasReturned ? 'OK' : '!'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#FAF9F6]">
                              {inj.name}
                            </span>
                            {inj.injuryCount > 1 && (
                              <Badge preset="gold">
                                {inj.injuryCount}x injured
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8E8E8E] mt-0.5">
                            Injured inning {inj.inning} - Was {inj.position}
                          </div>
                          {inj.notes && (
                            <div className="text-[11px] text-[#8E8E8E] mt-0.5 italic">
                              "{inj.notes}"
                            </div>
                          )}
                          {hasReturned && (
                            <div
                              className="text-[11px] mt-1 font-semibold"
                              style={{ color: THEME.green }}
                            >
                              Returned inning {inj.returnedInning}
                            </div>
                          )}
                          {!hasReturned && inj.multiGame && (
                            <div className="mt-2">
                              <div className="text-[11px] font-semibold" style={{ color: THEME.red }}>
                                Out for multiple games
                              </div>
                              <Button
                                size="sm"
                                className="mt-1"
                                onClick={() => {
                                  const updated = injuredPlayers.map((ip) =>
                                    ip.playerId === inj.playerId
                                      ? { ...ip, multiGame: false }
                                      : ip,
                                  );
                                  updateGameState({ injuredPlayers: updated });
                                }}
                              >
                                Allow Return
                              </Button>
                            </div>
                          )}
                          {canReturn && (
                            <div
                              className="text-[11px] mt-1 font-semibold cursor-pointer"
                              style={{ color: THEME.gold }}
                              onClick={() => {
                                if (
                                  !confirm(
                                    `Is ${inj.name} cleared to return?`,
                                  )
                                )
                                  return;
                                const updated = injuredPlayers.map((ip) =>
                                  ip.playerId === inj.playerId
                                    ? { ...ip, returnedInning: currentInning }
                                    : ip,
                                );
                                updateGameState({ injuredPlayers: updated });
                              }}
                            >
                              Click to clear for return
                            </div>
                          )}
                          {inj.injuryCount > 1 && (
                            <div className="mt-2">
                              <div
                                className="text-[11px] font-semibold cursor-pointer"
                                style={{ color: THEME.blue }}
                                onClick={() =>
                                  setExpandedInjuries((prev) =>
                                    isExpanded
                                      ? prev.filter((id) => id !== inj.playerId)
                                      : [...prev, inj.playerId],
                                  )
                                }
                              >
                                {isExpanded ? 'Hide' : 'View'} Full History (
                                {inj.injuryCount})
                              </div>
                              {isExpanded && (
                                <div
                                  className="mt-2 pl-3 space-y-1.5"
                                  style={{ borderLeft: `2px solid ${THEME.gray}` }}
                                >
                                  {inj.allInjuries.map((h, i) => (
                                    <div
                                      key={i}
                                      className="text-[11px] text-[#8E8E8E] rounded p-1.5"
                                      style={{ background: THEME.black }}
                                    >
                                      <div className="font-semibold text-[#FAF9F6]">
                                        #{i + 1} - Inning {h.inning}
                                      </div>
                                      <div>Position: {h.position}</div>
                                      {h.notes && (
                                        <div className="italic">"{h.notes}"</div>
                                      )}
                                      {h.returnedInning && (
                                        <div style={{ color: THEME.green }}>
                                          Returned inning {h.returnedInning}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Playing Time Tracker */}
          <Card>
            <h3 className="text-sm font-bold text-[#FAF9F6] mb-3">
              Playing Time
            </h3>
            <div className="space-y-2">
              {players
                .filter((p) => availability[p.id])
                .sort(
                  (a, b) =>
                    (playingTime[a.id] || 0) - (playingTime[b.id] || 0),
                )
                .map((player) => {
                  const inn = playingTime[player.id] || 0;
                  const pct =
                    currentInning > 0
                      ? (inn / currentInning) * 100
                      : 0;
                  const needsAttn = pct < 50 && currentInning >= 2;
                  return (
                    <div
                      key={player.id}
                      className="rounded p-2"
                      style={{
                        background: THEME.blackLight,
                        border: `1px solid ${needsAttn ? THEME.red : THEME.charcoal}`,
                      }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-semibold text-[#FAF9F6]">
                          {player.name}
                        </span>
                        <span
                          className="text-[11px]"
                          style={{
                            color: needsAttn ? THEME.red : THEME.gray,
                          }}
                        >
                          {inn}/{currentInning} inn
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: THEME.black }}
                      >
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            background: needsAttn ? THEME.red : THEME.green,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>

        {/* ============================================================= */}
        {/*  RIGHT COLUMN — Scoring                                        */}
        {/* ============================================================= */}
        <div className="space-y-4">
          {/* Offense / Defense toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setDefenseMode('defense')}
              className="flex-1 py-3 text-sm font-bold rounded-lg uppercase"
              style={{
                background: defenseMode === 'defense' ? THEME.red : THEME.charcoal,
                color: THEME.white,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Oswald',sans-serif",
              }}
            >
              {isHome ? 'Defense (Top)' : 'Defense (Bot)'}
            </button>
            <button
              onClick={() => setDefenseMode('offense')}
              className="flex-1 py-3 text-sm font-bold rounded-lg uppercase"
              style={{
                background: defenseMode === 'offense' ? THEME.green : THEME.charcoal,
                color: defenseMode === 'offense' ? THEME.black : THEME.white,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Oswald',sans-serif",
              }}
            >
              {isHome ? 'Offense (Bot)' : 'Offense (Top)'}
            </button>
          </div>

          {/* ─── DEFENSE MODE ─────────────────────────────────── */}
          {defenseMode === 'defense' && (
            <div className="space-y-4">
              {/* Select Pitcher */}
              <Card>
                <div className="text-xs font-bold text-[#8E8E8E] uppercase mb-2">
                  Select Pitcher
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {activeBattingOrder
                    .filter((pid) => getPlayer(pid)?.isPitcher)
                    .map((pid) => {
                      const p = getPlayer(pid);
                      return (
                        <button
                          key={pid}
                          onClick={() => {
                            if (currentPitcher && currentPitcher !== pid) savePitcherStats();
                            setCurrentPitcher(pid);
                            setPitchCount({ pitches: 0, strikes: 0, balls: 0 });
                          }}
                          className="rounded-md px-3 py-2.5 text-xs font-bold"
                          style={{
                            background:
                              currentPitcher === pid ? THEME.gold : THEME.charcoal,
                            color:
                              currentPitcher === pid ? THEME.black : THEME.white,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {p?.name?.split(' ')[0]}
                        </button>
                      );
                    })}
                </div>
                {activeBattingOrder.filter((p) => getPlayer(p)?.isPitcher)
                  .length === 0 && (
                  <p className="text-xs text-[#8E8E8E] mt-2">
                    No pitchers in lineup. Mark pitchers in Roster.
                  </p>
                )}
              </Card>

              {/* Pitcher Stats */}
              {currentPitcher &&
                (() => {
                  const pitcher = getPlayer(currentPitcher);
                  const prevPitches =
                    defensiveStats[currentPitcher]?.pitches || 0;
                  const total = pitchCount.pitches + prevPitches;
                  const wColor =
                    total >= 60
                      ? THEME.red
                      : total >= 40
                        ? '#F1C40F'
                        : THEME.green;
                  return (
                    <Card>
                      <div className="text-center mb-3">
                        <div
                          className="text-lg font-bold text-[#FAF9F6]"
                          style={{ fontFamily: "'Oswald',sans-serif" }}
                        >
                          Pitcher: {pitcher?.name}
                        </div>
                        <div
                          className="text-3xl font-bold mt-1"
                          style={{
                            color: wColor,
                            fontFamily: "'Oswald',sans-serif",
                          }}
                        >
                          {total} pitches
                        </div>
                        {total >= 40 && (
                          <div className="text-[11px] mt-1" style={{ color: wColor }}>
                            {total >= 60
                              ? 'LIMIT REACHED - MUST REST'
                              : total >= 50
                                ? 'APPROACHING LIMIT'
                                : 'MONITOR CLOSELY'}
                          </div>
                        )}
                        <div className="flex gap-4 justify-center mt-2 text-sm">
                          <span>
                            <span
                              className="font-bold"
                              style={{ color: THEME.green }}
                            >
                              {pitchCount.strikes}
                            </span>{' '}
                            <span className="text-[#8E8E8E]">S</span>
                          </span>
                          <span>
                            <span
                              className="font-bold"
                              style={{ color: THEME.red }}
                            >
                              {pitchCount.balls}
                            </span>{' '}
                            <span className="text-[#8E8E8E]">B</span>
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          onClick={() =>
                            setPitchCount({
                              ...pitchCount,
                              pitches: pitchCount.pitches + 1,
                              strikes: pitchCount.strikes + 1,
                            })
                          }
                          className="py-3 text-sm font-bold rounded-lg"
                          style={{
                            background: '#2ECC71',
                            color: THEME.black,
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: "'Oswald',sans-serif",
                          }}
                        >
                          Strike
                        </button>
                        <button
                          onClick={() =>
                            setPitchCount({
                              ...pitchCount,
                              pitches: pitchCount.pitches + 1,
                              balls: pitchCount.balls + 1,
                            })
                          }
                          className="py-3 text-sm font-bold rounded-lg"
                          style={{
                            background: '#E74C3C',
                            color: THEME.white,
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: "'Oswald',sans-serif",
                          }}
                        >
                          Ball
                        </button>
                      </div>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={savePitcherStats}
                      >
                        Save & Switch Pitcher
                      </Button>
                    </Card>
                  );
                })()}

              {/* Quick Defensive Plays */}
              <Card>
                <div className="text-xs font-bold text-[#8E8E8E] uppercase mb-2">
                  Quick Defensive Plays
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      defPlayOut();
                      if (currentPitcher) {
                        updateScoring({
                          defensiveStats: {
                            ...defensiveStats,
                            [currentPitcher]: {
                              ...(defensiveStats[currentPitcher] || {
                                putouts: 0,
                                assists: 0,
                                errors: 0,
                              }),
                              putouts:
                                (defensiveStats[currentPitcher]?.putouts || 0) + 1,
                            },
                          },
                        });
                      }
                    }}
                    className="py-3.5 text-sm font-bold rounded-lg"
                    style={{
                      background: THEME.red,
                      color: THEME.white,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Strikeout (K)
                  </button>
                  <button
                    onClick={defPlayOut}
                    className="py-3.5 text-sm font-bold rounded-lg"
                    style={{
                      background: '#8E8E8E',
                      color: THEME.white,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Ground Out
                  </button>
                  <button
                    onClick={defPlayOut}
                    className="py-3.5 text-sm font-bold rounded-lg"
                    style={{
                      background: '#8E8E8E',
                      color: THEME.white,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Fly Out
                  </button>
                  <button
                    onClick={() => {}}
                    className="py-3.5 text-sm font-bold rounded-lg"
                    style={{
                      background: '#E67E22',
                      color: THEME.white,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Error (No Out)
                  </button>
                </div>
              </Card>

              {/* Defensive stats summary */}
              <Card>
                <div className="text-xs font-bold text-[#8E8E8E] uppercase mb-2">
                  Defensive Stats
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {activeBattingOrder.map((pid) => {
                    const p = getPlayer(pid);
                    const s = defensiveStats[pid] || {};
                    if (!s.putouts && !s.assists && !s.errors && !s.pitches)
                      return null;
                    return (
                      <div
                        key={pid}
                        className="flex justify-between items-center py-1.5"
                        style={{
                          borderBottom: `1px solid ${THEME.charcoal}`,
                        }}
                      >
                        <span className="text-xs font-semibold text-[#FAF9F6]">
                          {p?.name?.split(' ')[0]}
                        </span>
                        <div className="flex gap-2 text-xs">
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
                          {s.pitches > 0 && (
                            <span style={{ color: THEME.gold }}>
                              {s.pitches} P
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* ─── OFFENSE MODE ─────────────────────────────────── */}
          {defenseMode === 'offense' && curPlayer && (
            <div className="space-y-4">
              {/* Current Batter */}
              <Card>
                <div className="text-center mb-3">
                  <div
                    className="text-xl font-bold text-[#FAF9F6]"
                    style={{ fontFamily: "'Oswald',sans-serif" }}
                  >
                    #{curBatterIdx + 1} {curPlayer.name}
                  </div>
                  <div
                    className="text-lg font-bold mt-1"
                    style={{
                      color: THEME.gold,
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    {pLine(atBats[curPid] || [])}
                  </div>
                  <div className="flex gap-4 justify-center mt-1.5 text-sm">
                    <span>
                      <span
                        className="font-bold"
                        style={{ color: THEME.green }}
                      >
                        {runs[curPid] || 0}
                      </span>{' '}
                      <span className="text-[#8E8E8E]">R</span>
                    </span>
                    <span>
                      <span
                        className="font-bold"
                        style={{ color: THEME.blue }}
                      >
                        {rbis[curPid] || 0}
                      </span>{' '}
                      <span className="text-[#8E8E8E]">RBI</span>
                    </span>
                    <span>
                      <span
                        className="font-bold"
                        style={{ color: THEME.goldLight }}
                      >
                        {steals[curPid] || 0}
                      </span>{' '}
                      <span className="text-[#8E8E8E]">SB</span>
                    </span>
                  </div>
                  {/* At-bat history chips */}
                  {(atBats[curPid] || []).length > 0 && (
                    <div className="flex gap-1 justify-center mt-2 flex-wrap">
                      {(atBats[curPid] || []).map((ab, i) => {
                        const code =
                          typeof ab === 'string' ? ab : ab.code;
                        const inn =
                          typeof ab === 'string' ? null : ab.inning;
                        return (
                          <span
                            key={i}
                            className="text-[10px] font-bold rounded px-1.5 py-0.5"
                            style={{
                              background: `${abColor(code)}25`,
                              color: abColor(code),
                            }}
                          >
                            {inn ? `${inn}:` : ''}
                            {code}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>

              {/* Pitch Count Display */}
              <Card>
                <div className="text-xs font-bold text-[#8E8E8E] uppercase mb-2">
                  Pitch Count
                </div>
                <div className="flex items-center justify-center gap-5 mb-3">
                  <div className="text-center">
                    <div className="flex gap-1.5 mb-1">
                      {[0, 1, 2, 3].map((b) => (
                        <div
                          key={b}
                          className="w-5 h-5 rounded-full"
                          style={{
                            background:
                              b < count.balls ? '#2ECC71' : THEME.charcoal,
                            border: `2px solid ${b < count.balls ? '#2ECC71' : THEME.gray}`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8E8E8E]">Balls</span>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#FAF9F6]"
                    style={{ fontFamily: "'Oswald',sans-serif" }}
                  >
                    {count.balls}-{count.strikes}
                  </div>
                  <div className="text-center">
                    <div className="flex gap-1.5 mb-1">
                      {[0, 1, 2].map((s) => (
                        <div
                          key={s}
                          className="w-5 h-5 rounded-full"
                          style={{
                            background:
                              s < count.strikes ? '#E74C3C' : THEME.charcoal,
                            border: `2px solid ${s < count.strikes ? '#E74C3C' : THEME.gray}`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8E8E8E]">
                      Strikes
                    </span>
                  </div>
                </div>
                {count.fouls > 0 && (
                  <div className="text-center text-xs mb-2" style={{ color: THEME.goldDim }}>
                    {count.fouls} foul{count.fouls !== 1 ? 's' : ''}
                  </div>
                )}
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={addBall}
                    className="py-2.5 text-sm font-bold rounded-lg"
                    style={{
                      background: '#2ECC71',
                      color: THEME.black,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Ball
                  </button>
                  <button
                    onClick={addStrike}
                    className="py-2.5 text-sm font-bold rounded-lg"
                    style={{
                      background: '#E74C3C',
                      color: THEME.white,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Strike
                  </button>
                  <button
                    onClick={addFoul}
                    className="py-2.5 text-sm font-bold rounded-lg"
                    style={{
                      background: THEME.goldDim,
                      color: THEME.black,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Foul
                  </button>
                  <button
                    onClick={resetCount}
                    className="py-2.5 text-sm font-bold rounded-lg"
                    style={{
                      background: THEME.charcoal,
                      color: THEME.gray,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Reset
                  </button>
                </div>
              </Card>

              {/* At-Bat Results */}
              <Card>
                <div className="text-xs font-bold text-[#8E8E8E] uppercase mb-2">
                  At-Bat Result (Inning {scoringInning})
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {bigBtn('1B', THEME.black, '#2ECC71', () => recordAB('1B'))}
                  {bigBtn('2B', THEME.black, '#2ECC71', () => recordAB('2B'))}
                  {bigBtn('3B', THEME.black, '#2ECC71', () => recordAB('3B'))}
                  {bigBtn('HR', THEME.black, '#F1C40F', () => recordAB('HR'))}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {bigBtn('GO', THEME.white, '#8E8E8E', () => recordAB('GO'))}
                  {bigBtn('FO', THEME.white, '#8E8E8E', () => recordAB('FO'))}
                  {bigBtn('HBP', THEME.white, '#3498DB', () => recordAB('HBP'))}
                </div>
                <div className="mb-3">
                  {bigBtn('Stolen Base', THEME.black, THEME.goldLight, () =>
                    setShowSBPicker(true),
                  )}
                </div>

                {/* Stolen Base Picker */}
                {showSBPicker && (
                  <div
                    className="rounded-lg p-3 mb-3"
                    style={{
                      background: THEME.black,
                      border: `1px solid ${THEME.gold}`,
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#FAF9F6]">
                        Who stole a base?
                      </span>
                      <button
                        onClick={() => setShowSBPicker(false)}
                        className="text-[#8E8E8E] text-base"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        x
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {activeBattingOrder.map((pid) => {
                        const p = getPlayer(pid);
                        if (!p) return null;
                        return (
                          <button
                            key={pid}
                            onClick={() => {
                              updateScoring({
                                steals: {
                                  ...steals,
                                  [pid]: (steals[pid] || 0) + 1,
                                },
                              });
                              setShowSBPicker(false);
                            }}
                            className="flex justify-between items-center rounded-md px-3 py-2.5 text-left"
                            style={{
                              background: THEME.charcoal,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <span className="text-sm font-semibold text-[#FAF9F6]">
                              {p.name.split(' ')[0]}
                            </span>
                            {(steals[pid] || 0) > 0 && (
                              <span
                                className="text-xs"
                                style={{
                                  color: THEME.goldLight,
                                  fontFamily: "'Oswald',sans-serif",
                                }}
                              >
                                {steals[pid]} SB
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="text-center mb-3">
                  <button
                    onClick={undoLastAB}
                    className="text-sm font-semibold rounded-md px-5 py-2"
                    style={{
                      background: 'transparent',
                      color: THEME.red,
                      border: `1px solid ${THEME.red}40`,
                      cursor: 'pointer',
                    }}
                  >
                    Undo Last At-Bat
                  </button>
                </div>
              </Card>

              {/* Runs / RBIs */}
              <Card>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setShowRunPicker(!showRunPicker)}
                    className="flex-1 py-3 text-sm font-bold rounded-lg"
                    style={{
                      background: '#2ECC71',
                      color: THEME.black,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Who Scored?
                  </button>
                </div>
                {showRunPicker && (
                  <div
                    className="rounded-md p-3 mb-3"
                    style={{ border: `1px solid ${THEME.green}` }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#FAF9F6]">
                        Tap player who scored (+1R, +1RBI for batter)
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setShowRunPicker(false)}
                      >
                        Done
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {activeBattingOrder.map((pid) => {
                        const p = getPlayer(pid);
                        if (!p) return null;
                        return (
                          <button
                            key={pid}
                            onClick={() => {
                              updateScoring({
                                runs: {
                                  ...runs,
                                  [pid]: (runs[pid] || 0) + 1,
                                },
                                rbis: {
                                  ...rbis,
                                  [curPid]: (rbis[curPid] || 0) + 1,
                                },
                              });
                            }}
                            className="flex justify-between items-center rounded-md px-3 py-2.5 text-left"
                            style={{
                              background: THEME.charcoal,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <span className="text-sm font-semibold text-[#FAF9F6]">
                              {p.name.split(' ')[0]}
                            </span>
                            <span
                              className="text-sm font-bold"
                              style={{
                                color: THEME.green,
                                fontFamily: "'Oswald',sans-serif",
                              }}
                            >
                              {runs[pid] || 0}R
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Manual RBI counter */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#8E8E8E]">
                    RBIs (current batter)
                  </span>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() =>
                        updateScoring({
                          rbis: {
                            ...rbis,
                            [curPid]: Math.max(0, (rbis[curPid] || 0) - 1),
                          },
                        })
                      }
                      className="w-9 h-9 rounded-md text-xl"
                      style={{
                        background: THEME.charcoal,
                        color: THEME.white,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      -
                    </button>
                    <span
                      className="text-xl font-bold min-w-[28px] text-center"
                      style={{
                        color: THEME.blue,
                        fontFamily: "'Oswald',sans-serif",
                      }}
                    >
                      {rbis[curPid] || 0}
                    </span>
                    <button
                      onClick={() =>
                        updateScoring({
                          rbis: {
                            ...rbis,
                            [curPid]: (rbis[curPid] || 0) + 1,
                          },
                        })
                      }
                      className="w-9 h-9 rounded-md text-xl"
                      style={{
                        background: THEME.charcoal,
                        color: THEME.white,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </Card>

              {/* Batter navigation + full lineup */}
              <Card>
                <div className="flex justify-between items-center py-2">
                  <button
                    onClick={() => {
                      setCurBatterIdx(
                        (curBatterIdx - 1 + activeBattingOrder.length) %
                          activeBattingOrder.length,
                      );
                      resetCount();
                    }}
                    className="rounded-md px-4 py-2 text-sm font-bold"
                    style={{
                      background: 'none',
                      border: `1px solid ${THEME.gold}`,
                      color: THEME.gold,
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Prev
                  </button>
                  <span className="text-xs text-[#8E8E8E]">
                    {curBatterIdx + 1} of {activeBattingOrder.length}
                  </span>
                  <button
                    onClick={() => {
                      setCurBatterIdx(
                        (curBatterIdx + 1) % activeBattingOrder.length,
                      );
                      resetCount();
                    }}
                    className="rounded-md px-4 py-2 text-sm font-bold"
                    style={{
                      background: 'none',
                      border: `1px solid ${THEME.gold}`,
                      color: THEME.gold,
                      cursor: 'pointer',
                      fontFamily: "'Oswald',sans-serif",
                    }}
                  >
                    Next
                  </button>
                </div>

                <div className="text-xs font-bold text-[#8E8E8E] uppercase mt-3 mb-2">
                  Full Lineup
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {activeBattingOrder.map((pid, i) => {
                    const p = getPlayer(pid);
                    if (!p) return null;
                    const abs = atBats[pid] || [];
                    const isActive = i === curBatterIdx;
                    return (
                      <button
                        key={pid}
                        onClick={() => setCurBatterIdx(i)}
                        className="flex justify-between items-center w-full px-2.5 py-1.5 text-left"
                        style={{
                          background: isActive ? `${THEME.gold}15` : 'transparent',
                          border: 'none',
                          borderBottom: `1px solid ${THEME.charcoal}`,
                          borderLeft: isActive
                            ? `3px solid ${THEME.gold}`
                            : '3px solid transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          className="text-xs"
                          style={{
                            color: isActive ? THEME.gold : THEME.white,
                            fontWeight: isActive ? 700 : 400,
                          }}
                        >
                          {i + 1}. {p.name.split(' ')[0]}
                        </span>
                        <div className="flex gap-1 items-center">
                          {abs.map((ab, j) => {
                            const c =
                              typeof ab === 'string' ? ab : ab.code;
                            return (
                              <span
                                key={j}
                                className="text-[9px] rounded px-1"
                                style={{
                                  background: `${abColor(c)}20`,
                                  color: abColor(c),
                                }}
                              >
                                {c}
                              </span>
                            );
                          })}
                          <span
                            className="text-[11px] ml-1"
                            style={{
                              color: THEME.gold,
                              fontFamily: "'Oswald',sans-serif",
                            }}
                          >
                            {pLine(abs)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {defenseMode === 'offense' && !curPlayer && (
            <Card>
              <p className="text-sm text-[#8E8E8E] text-center py-6">
                Set up attendance and batting order in the Lineup step first.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/*  SUBSTITUTION MODAL                                            */}
      {/* ============================================================= */}
      {subModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setSubModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[80vh] overflow-y-auto rounded-xl p-6"
            style={{
              background: THEME.blackLight,
              border: `2px solid ${subModal.isInjury ? THEME.red : THEME.gold}`,
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h3
                className="text-lg font-bold"
                style={{
                  color: subModal.isInjury ? THEME.red : THEME.gold,
                  fontFamily: "'Oswald',sans-serif",
                }}
              >
                {subModal.isInjury
                  ? 'INJURY SUBSTITUTION'
                  : `Substitute ${subModal.position}`}
              </h3>
              <button
                onClick={() => setSubModal(null)}
                className="text-2xl"
                style={{
                  background: 'none',
                  border: 'none',
                  color: THEME.gray,
                  cursor: 'pointer',
                }}
              >
                x
              </button>
            </div>

            {/* Outgoing player */}
            <div
              className="rounded-lg p-4 mb-4"
              style={{ background: THEME.black }}
            >
              <div className="text-[11px] text-[#8E8E8E] uppercase mb-2">
                {subModal.isInjury ? 'Injured Player' : 'Coming Out'}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-lg font-bold text-base"
                  style={{
                    minWidth: 40,
                    height: 40,
                    background: THEME.red,
                    color: THEME.white,
                  }}
                >
                  {subModal.position}
                </div>
                <div>
                  <div className="text-base font-bold text-[#FAF9F6]">
                    {getPlayer(subModal.playerId)?.name}
                  </div>
                  <div className="text-xs text-[#8E8E8E]">
                    {playingTime[subModal.playerId] || 0} innings played
                  </div>
                </div>
              </div>
            </div>

            {/* Injury details */}
            {subModal.isInjury && (
              <div
                className="rounded-lg p-4 mb-4"
                style={{ background: THEME.black }}
              >
                <div className="text-sm font-bold text-[#FAF9F6] mb-3">
                  Injury Details (Optional)
                </div>
                <input
                  type="text"
                  value={injuryNotes}
                  onChange={(e) => setInjuryNotes(e.target.value)}
                  placeholder="e.g., Twisted ankle, hit by ball..."
                  className="w-full rounded-md px-3 py-2 text-sm mb-3"
                  style={{
                    background: THEME.blackLight,
                    color: THEME.white,
                    border: `1px solid ${THEME.charcoal}`,
                    outline: 'none',
                  }}
                />
                <div
                  className="flex items-center gap-2 rounded-md p-2.5"
                  style={{ background: THEME.blackLight }}
                >
                  <input
                    type="checkbox"
                    checked={multiGameInjury}
                    onChange={(e) => setMultiGameInjury(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <label
                    className="text-sm text-[#FAF9F6] cursor-pointer"
                    onClick={() => setMultiGameInjury(!multiGameInjury)}
                  >
                    Serious injury - Out for multiple games
                  </label>
                </div>
              </div>
            )}

            {/* Eligible subs */}
            <div className="mb-3">
              <div className="text-sm font-bold text-[#FAF9F6] mb-1">
                Available Substitutes ({getEligibleSubs().length})
              </div>
              <div className="text-[11px] text-[#8E8E8E] mb-3">
                Sorted: Primary &rarr; Secondary &rarr; Experience &rarr; New
              </div>
            </div>

            {getEligibleSubs().length === 0 ? (
              <div
                className="rounded-lg p-5 text-center"
                style={{ background: THEME.black }}
              >
                <p className="text-[#8E8E8E]">Everyone is on the field!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {getEligibleSubs().map((sub) => {
                  const player = getPlayer(sub.id);
                  const badgeColor =
                    sub.matchType === 1
                      ? THEME.gold
                      : sub.matchType === 2
                        ? THEME.blue
                        : sub.matchType === 3
                          ? THEME.green
                          : THEME.charcoal;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => makeSubstitution(sub.id)}
                      className="rounded-lg p-3 cursor-pointer transition-all"
                      style={{
                        background: THEME.black,
                        border: `2px solid ${sub.needsPlayingTime ? THEME.gold : badgeColor}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-lg font-bold text-base"
                          style={{
                            minWidth: 40,
                            height: 40,
                            background: badgeColor,
                            color: THEME.white,
                          }}
                        >
                          {subModal.position}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#FAF9F6]">
                              {player?.name}
                            </span>
                            {sub.needsPlayingTime && (
                              <Badge preset="gold">Priority</Badge>
                            )}
                            <Badge color={badgeColor}>{sub.matchLabel}</Badge>
                          </div>
                          <div className="text-[11px] text-[#8E8E8E] mt-1">
                            {sub.matchDesc}
                          </div>
                          <div className="text-[11px] text-[#8E8E8E] mt-0.5">
                            {sub.inningsPlayed} innings - Primary:{' '}
                            {player?.primaryPosition || 'None'}
                          </div>
                        </div>
                        <div style={{ color: badgeColor, fontSize: 20 }}>
                          &rarr;
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
