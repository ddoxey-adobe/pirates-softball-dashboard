/**
 * GameDayPanel — Main container for the unified GameDay module
 *
 * Merges LineupPlanner + LineupBuilder + GameLog into a single 4-step flow:
 *   Step 1: Setup   — date, opponent, home/away, game type
 *   Step 2: Lineup  — position assignment + batting order
 *   Step 3: Live    — offense + defense scoring
 *   Step 4: Review  — post-game notes, stats summary
 *
 * Storage: `pirates-games-2026v1` (unified)
 * Also writes a compatibility shim to `pirates-gamelogs-2026v1` for Reports/Stats.
 */

import { useState, useEffect, useCallback } from 'react';
import { THEME } from '@app/theme';
import { STORAGE_KEYS } from '@app/constants';
import { load, save } from '@app/storage';
import useStorage from '@shared/hooks/useStorage';
import Button from '@shared/components/Button';
import Card from '@shared/components/Card';
import Badge from '@shared/components/Badge';
import Input from '@shared/components/Input';
import Tabs from '@shared/components/Tabs';

import LineupBuilder from './LineupBuilder';
import LiveScorer from './LiveScorer';
import GameReview from './GameReview';

/* ------------------------------------------------------------------ */
/*  Storage Keys                                                      */
/* ------------------------------------------------------------------ */

const GAMES_KEY = 'pirates-games-2026v1';
const ALIGNMENTS_KEY = 'pirates-alignments-2026v1';
const TEMPLATES_KEY = 'pirates-templates-2026v1';

/* ------------------------------------------------------------------ */
/*  Data Migration — runs once on first load                          */
/* ------------------------------------------------------------------ */

function runMigration(players) {
  const done = load('pirates-migration-gameday-v1', null);
  if (done === 'done') return null;

  const oldGameLogs = load(STORAGE_KEYS.GAMELOGS, []) || [];
  const oldLineups = load('pirates-lineups-2026v1', []) || [];
  const oldAlignV1 = load('pirates-alignment-library-2026v1', []) || [];
  const oldAlignV2 = load('pirates-alignment-library-2026v2', []) || [];
  const oldTemplates = load('pirates-lineup-templates-2026v2', []) || [];

  // Skip if there's nothing to migrate
  if (
    oldGameLogs.length === 0 &&
    oldLineups.length === 0 &&
    oldAlignV1.length === 0 &&
    oldAlignV2.length === 0 &&
    oldTemplates.length === 0
  ) {
    save('pirates-migration-gameday-v1', 'done');
    return null;
  }

  // --- Alignments ---
  const migAlignments = oldAlignV2.map((a) => ({
    id: a.id,
    name: a.name,
    positions: a.positions || [],
    isPrimary: a.isPrimary || false,
    createdDate: a.createdDate,
  }));

  oldAlignV1.forEach((a) => {
    const dupe = migAlignments.find((m) => m.name === a.name);
    const name = dupe ? `${a.name} (from Lineup)` : a.name;
    migAlignments.push({
      id: `migrated-${a.id}`,
      name,
      positions: (a.lineup || []).map((s) => ({
        playerId: s.playerId,
        position: s.position,
      })),
      isPrimary: false,
      createdDate: a.createdDate,
    });
  });

  // --- Templates ---
  const migTemplates = oldTemplates.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description || '',
    battingOrder: (t.battingLineup || [])
      .sort((a, b) => a.battingOrder - b.battingOrder)
      .map((s) => s.playerId),
    alignmentIds: t.alignmentIds || [],
    createdDate: t.createdDate,
  }));

  // --- Game Logs -> Games ---
  const migFromLogs = oldGameLogs.map((g) =>
    gameLogToUnified(g, players),
  );

  // --- Lineups -> Games (merge where possible) ---
  const migFromLineups = oldLineups
    .map((l) => {
      const match = migFromLogs.find(
        (g) => g.opponent === l.opponent && g.date === l.date,
      );
      if (match) {
        // Merge field data into existing game log
        match.gameState = l.gameState || null;
        match.battingOrder =
          match.battingOrder.length > 0
            ? match.battingOrder
            : (l.lineup || [])
                .sort((a, b) => a.battingOrder - b.battingOrder)
                .map((s) => s.playerId);
        match.initialPositions = (l.lineup || []).map((s) => ({
          playerId: s.playerId,
          position: s.position,
        }));
        match.gameAlignments = l.alignments || [];
        match.notes = l.notes || match.notes;
        match.availability = { ...match.availability, ...(l.availability || {}) };
        return null; // don't create duplicate
      }
      return lineupToUnified(l, players);
    })
    .filter(Boolean);

  const allGames = [...migFromLogs, ...migFromLineups];
  save(GAMES_KEY, allGames);
  save(ALIGNMENTS_KEY, migAlignments);
  save(TEMPLATES_KEY, migTemplates);
  save('pirates-migration-gameday-v1', 'done');

  return { games: allGames, alignments: migAlignments, templates: migTemplates };
}

function gameLogToUnified(g) {
  return {
    id: g.id,
    date: g.date || '',
    opponent: g.opponent || '',
    location: '',
    homeAway: g.homeAway || 'home',
    gameType: g.gameType || 'league',
    templateId: null,
    availability: g.attendance || {},
    battingOrder: g.battingOrder || [],
    initialPositions: [],
    alignmentIds: [],
    gameAlignments: [],
    notes: '',
    gameState: {
      currentInning: g.inning || 1,
      inningData: {},
      playingTime: {},
      substitutionHistory: [],
      injuredPlayers: [],
    },
    scoring: {
      atBats: g.atBats || {},
      runs: g.runs || {},
      rbis: g.rbis || {},
      steals: g.steals || {},
      positions: g.positions || {},
      defensiveStats: g.defensiveStats || {},
      pitching: g.pitching || {},
      outs: g.outs || 0,
      inning: g.inning || 1,
      inningHalf: g.inningHalf || 'top',
    },
    review: {
      result: g.result || '',
      ourScore: g.ourScore || '',
      theirScore: g.theirScore || '',
      observations: g.observations || {},
      coachNotes: g.coachNotes || '',
    },
    status: g.result ? 'reviewed' : 'completed',
    createdDate: g.createdDate || g.date || new Date().toISOString(),
  };
}

function lineupToUnified(l) {
  return {
    id: l.id,
    date: l.date || '',
    opponent: l.opponent || '',
    location: l.location || '',
    homeAway: 'home',
    gameType: 'league',
    templateId: null,
    availability: l.availability || {},
    battingOrder: (l.lineup || [])
      .sort((a, b) => a.battingOrder - b.battingOrder)
      .map((s) => s.playerId),
    initialPositions: (l.lineup || []).map((s) => ({
      playerId: s.playerId,
      position: s.position,
    })),
    alignmentIds: [],
    gameAlignments: l.alignments || [],
    notes: l.notes || '',
    gameState: l.gameState || null,
    scoring: {
      atBats: {},
      runs: {},
      rbis: {},
      steals: {},
      positions: {},
      defensiveStats: {},
      pitching: {},
      outs: 0,
      inning: 1,
      inningHalf: 'top',
    },
    review: {
      result: '',
      ourScore: '',
      theirScore: '',
      observations: {},
      coachNotes: '',
    },
    status:
      l.status === 'completed'
        ? 'completed'
        : l.status === 'finalized'
          ? 'ready'
          : 'planned',
    createdDate: l.createdDate || new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/*  Empty game factory                                                */
/* ------------------------------------------------------------------ */

function createEmptyGame(players) {
  return {
    id: Date.now().toString(),
    date: '',
    opponent: '',
    location: '',
    homeAway: 'home',
    gameType: 'league',
    templateId: null,
    availability: (players || []).reduce(
      (acc, p) => ({ ...acc, [p.id]: true }),
      {},
    ),
    battingOrder: [],
    initialPositions: [],
    alignmentIds: [],
    gameAlignments: [],
    notes: '',
    gameState: null,
    scoring: {
      atBats: {},
      runs: {},
      rbis: {},
      steals: {},
      positions: {},
      defensiveStats: {},
      pitching: {},
      outs: 0,
      inning: 1,
      inningHalf: 'top',
    },
    review: {
      result: '',
      ourScore: '',
      theirScore: '',
      observations: {},
      coachNotes: '',
    },
    status: 'planned',
    createdDate: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                    */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG = {
  planned: { label: 'Planned', color: THEME.gold, preset: 'gold' },
  ready: { label: 'Ready', color: THEME.green, preset: 'green' },
  'in-progress': { label: 'In Progress', color: THEME.blue, preset: 'blue' },
  completed: { label: 'Completed', color: THEME.gray, preset: 'gray' },
  reviewed: { label: 'Reviewed', color: THEME.green, preset: 'green' },
};

const STEP_TABS = [
  { id: 'setup', label: 'Setup', icon: '' },
  { id: 'lineup', label: 'Lineup', icon: '' },
  { id: 'live', label: 'Live Scorer', icon: '' },
  { id: 'review', label: 'Review', icon: '' },
];

/* ================================================================== */
/*  COMPONENT                                                         */
/* ================================================================== */

export default function GameDayPanel() {
  /* ---- players from storage (self-contained, no props needed) ---- */
  const [players] = useStorage(STORAGE_KEYS.PLAYERS, []);

  /* ---- core data ---- */
  const [games, setGames] = useStorage(GAMES_KEY, []);
  const [alignments, setAlignments] = useStorage(ALIGNMENTS_KEY, []);
  const [templates, setTemplates] = useStorage(TEMPLATES_KEY, []);

  /* ---- UI state ---- */
  const [activeGameId, setActiveGameId] = useState(null);
  const [step, setStep] = useState('setup');
  const [expandedId, setExpandedId] = useState(null);

  /* ---- run migration once ---- */
  useEffect(() => {
    const migrated = runMigration(players);
    if (migrated) {
      setGames(migrated.games);
      setAlignments(migrated.alignments);
      setTemplates(migrated.templates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- compatibility shim: write to old gamelogs key ---- */
  useEffect(() => {
    const logFormat = games
      .filter((g) => g.status === 'completed' || g.status === 'reviewed')
      .map((g) => ({
        id: g.id,
        date: g.date,
        opponent: g.opponent,
        result: g.review?.result || '',
        homeAway: g.homeAway,
        gameType: g.gameType,
        ourScore: g.review?.ourScore || '',
        theirScore: g.review?.theirScore || '',
        battingOrder: g.battingOrder,
        attendance: g.availability,
        atBats: g.scoring?.atBats || {},
        runs: g.scoring?.runs || {},
        rbis: g.scoring?.rbis || {},
        steals: g.scoring?.steals || {},
        positions: g.scoring?.positions || {},
        defensiveStats: g.scoring?.defensiveStats || {},
        pitching: g.scoring?.pitching || {},
        observations: g.review?.observations || {},
        coachNotes: g.review?.coachNotes || '',
        outs: g.scoring?.outs || 0,
        inning: g.scoring?.inning || 1,
        inningHalf: g.scoring?.inningHalf || 'top',
      }));
    save(STORAGE_KEYS.GAMELOGS, logFormat);
  }, [games]);

  /* ---- active game accessor ---- */
  const activeGame = games.find((g) => g.id === activeGameId) || null;

  const updateGame = useCallback(
    (updated) => {
      setGames((prev) =>
        prev.map((g) => (g.id === updated.id ? updated : g)),
      );
    },
    [setGames],
  );

  /* ---- CRUD helpers ---- */
  const createGame = () => {
    const g = createEmptyGame(players);
    setGames((prev) => [...prev, g]);
    setActiveGameId(g.id);
    setStep('setup');
  };

  const createGameFromTemplate = (template) => {
    const g = createEmptyGame(players);
    g.templateId = template.id;
    // Apply batting order from template
    g.battingOrder = template.battingOrder || [];
    // Resolve alignment IDs into game alignments
    const resolved = (template.alignmentIds || [])
      .map((aid) => alignments.find((a) => a.id === aid))
      .filter(Boolean);
    g.gameAlignments = resolved.map((a) => ({
      id: a.id,
      name: a.name,
      positions: a.positions || [],
    }));
    g.alignmentIds = template.alignmentIds || [];
    // Apply primary alignment positions
    const primary = resolved.find((a) => a.isPrimary) || resolved[0];
    if (primary) {
      g.initialPositions = (primary.positions || []).map((p) => ({
        playerId: p.playerId,
        position: p.position,
      }));
    }
    setGames((prev) => [...prev, g]);
    setActiveGameId(g.id);
    setStep('lineup');
  };

  const deleteGame = (id) => {
    if (!confirm('Delete this game?')) return;
    setGames((prev) => prev.filter((g) => g.id !== id));
    if (activeGameId === id) setActiveGameId(null);
  };

  const startLiveGame = (game) => {
    if (game.battingOrder.length === 0) {
      alert('Add players to the lineup before starting');
      return;
    }
    const initialGameState = {
      currentInning: 1,
      inningData: {
        1: (game.initialPositions || []).map((s) => ({
          playerId: s.playerId,
          position: s.position,
        })),
      },
      playingTime: (game.initialPositions || []).reduce(
        (acc, s) => ({ ...acc, [s.playerId]: 1 }),
        {},
      ),
      substitutionHistory: [],
      injuredPlayers: [],
    };
    const updated = {
      ...game,
      status: 'in-progress',
      gameState: initialGameState,
    };
    updateGame(updated);
    setActiveGameId(game.id);
    setStep('live');
  };

  const endGame = (game) => {
    if (!confirm('End game? This will finalize all stats.')) return;
    const updated = {
      ...game,
      status: 'completed',
      gameState: {
        ...(game.gameState || {}),
        completed: true,
      },
    };
    updateGame(updated);
    setStep('review');
  };

  const saveAndExit = () => {
    if (!confirm('Save and exit? You can resume later.')) return;
    // Game is already saved via updateGame
    setActiveGameId(null);
  };

  /* ---- alignment CRUD ---- */
  const addAlignment = (alignment) => {
    setAlignments((prev) => [...prev, alignment]);
  };

  const deleteAlignment = (id) => {
    setAlignments((prev) => prev.filter((a) => a.id !== id));
  };

  /* ================================================================ */
  /*  RENDER — Active Game (4-step flow)                              */
  /* ================================================================ */

  if (activeGame) {
    const isLive = activeGame.status === 'in-progress';
    const isCompleted =
      activeGame.status === 'completed' || activeGame.status === 'reviewed';
    const sc = STATUS_CONFIG[activeGame.status] || STATUS_CONFIG.planned;

    return (
      <div className="p-4 max-w-7xl mx-auto">
        {/* ── Game Header ────────────────────────────────────── */}
        <div
          className="flex items-center justify-between rounded-xl p-4 mb-4"
          style={{
            background: THEME.blackLight,
            border: `2px solid ${isLive ? THEME.blue : THEME.gold}`,
          }}
        >
          <div>
            <div className="flex items-center gap-3">
              <h2
                className="text-lg font-bold"
                style={{
                  color: THEME.gold,
                  fontFamily: "'Oswald',sans-serif",
                }}
              >
                {activeGame.opponent
                  ? `vs ${activeGame.opponent}`
                  : 'New Game'}
              </h2>
              <Badge preset={sc.preset}>{sc.label}</Badge>
            </div>
            <p className="text-xs text-[#8E8E8E] mt-1">
              {activeGame.date
                ? new Date(activeGame.date + 'T12:00:00').toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )
                : 'No date set'}
              {activeGame.location && ` -- ${activeGame.location}`}
            </p>
          </div>
          <div className="flex gap-2">
            {isLive && (
              <>
                <Button size="sm" variant="secondary" onClick={saveAndExit}>
                  Save & Exit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => endGame(activeGame)}
                >
                  End Game
                </Button>
              </>
            )}
            {!isLive && activeGame.status === 'ready' && (
              <Button
                size="sm"
                onClick={() => startLiveGame(activeGame)}
                className="!bg-[#2ECC71]"
              >
                Start Game
              </Button>
            )}
            {activeGame.status === 'planned' && (
              <Button
                size="sm"
                onClick={() => {
                  if (!activeGame.opponent || !activeGame.date) {
                    alert('Please fill in opponent and date first');
                    return;
                  }
                  updateGame({ ...activeGame, status: 'ready' });
                }}
              >
                Finalize Lineup
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveGameId(null)}
            >
              Back to Games
            </Button>
          </div>
        </div>

        {/* ── Step Navigation ────────────────────────────────── */}
        <Tabs tabs={STEP_TABS} activeId={step} onChange={setStep} />

        {/* ── Step Content ───────────────────────────────────── */}
        <div className="mt-4">
          {/* STEP 1: Setup */}
          {step === 'setup' && (
            <div className="space-y-4">
              <Card>
                <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
                  Game Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input
                    label="Opponent *"
                    value={activeGame.opponent}
                    onChange={(e) =>
                      updateGame({ ...activeGame, opponent: e.target.value })
                    }
                    placeholder="Team name"
                  />
                  <Input
                    label="Date *"
                    type="date"
                    value={activeGame.date}
                    onChange={(e) =>
                      updateGame({ ...activeGame, date: e.target.value })
                    }
                  />
                  <Input
                    label="Location"
                    value={activeGame.location}
                    onChange={(e) =>
                      updateGame({ ...activeGame, location: e.target.value })
                    }
                    placeholder="Home Field"
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#C4C4C4]">
                      Home / Away
                    </label>
                    <select
                      value={activeGame.homeAway}
                      onChange={(e) =>
                        updateGame({ ...activeGame, homeAway: e.target.value })
                      }
                      className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-lg px-3 py-2 text-sm text-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50 transition-colors appearance-none"
                    >
                      <option value="home">Home</option>
                      <option value="away">Away</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#C4C4C4]">Game Type</label>
                    <select
                      value={activeGame.gameType}
                      onChange={(e) =>
                        updateGame({ ...activeGame, gameType: e.target.value })
                      }
                      className="bg-[#1B1B1B] border border-[#3A3A3A] rounded-lg px-3 py-2 text-sm text-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50 transition-colors appearance-none"
                    >
                      <option value="league">League Game</option>
                      <option value="scrimmage">Scrimmage</option>
                      <option value="internal">Internal Scrimmage</option>
                      <option value="tournament">Tournament</option>
                      <option value="exhibition">Exhibition</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Load from Template */}
              {templates.length > 0 && (
                <Card>
                  <h4 className="text-sm font-bold text-[#FAF9F6] mb-3">
                    Load from Template
                  </h4>
                  <div className="space-y-2">
                    {templates.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-md px-3 py-2.5"
                        style={{
                          background: THEME.black,
                          border: `1px solid ${THEME.charcoal}`,
                        }}
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#FAF9F6]">
                            {t.name}
                          </div>
                          {t.description && (
                            <div className="text-[11px] text-[#8E8E8E] mt-0.5">
                              {t.description}
                            </div>
                          )}
                          <div className="text-[10px] text-[#8E8E8E] mt-0.5">
                            {t.battingOrder?.length || 0} batters --{' '}
                            {t.alignmentIds?.length || 0} alignments
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            // Apply template to current game
                            const resolved = (t.alignmentIds || [])
                              .map((aid) => alignments.find((a) => a.id === aid))
                              .filter(Boolean);
                            const ga = resolved.map((a) => ({
                              id: a.id,
                              name: a.name,
                              positions: a.positions || [],
                            }));
                            const primary =
                              resolved.find((a) => a.isPrimary) || resolved[0];
                            const initPos = primary
                              ? primary.positions.map((p) => ({
                                  playerId: p.playerId,
                                  position: p.position,
                                }))
                              : [];
                            updateGame({
                              ...activeGame,
                              templateId: t.id,
                              battingOrder: t.battingOrder || [],
                              gameAlignments: ga,
                              alignmentIds: t.alignmentIds || [],
                              initialPositions: initPos,
                            });
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Quick actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setStep('lineup')}
                >
                  Next: Lineup &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Lineup */}
          {step === 'lineup' && (
            <div>
              <LineupBuilder
                game={activeGame}
                onUpdate={updateGame}
                players={players}
                alignmentLibrary={alignments}
                onSaveAlignment={addAlignment}
                onDeleteAlignment={deleteAlignment}
              />
              <div className="flex gap-2 justify-between mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep('setup')}
                >
                  &larr; Setup
                </Button>
                <div className="flex gap-2">
                  {activeGame.status === 'planned' && (
                    <Button
                      onClick={() => {
                        if (!activeGame.opponent || !activeGame.date) {
                          alert('Please fill in opponent and date first');
                          return;
                        }
                        updateGame({ ...activeGame, status: 'ready' });
                      }}
                    >
                      Finalize Lineup
                    </Button>
                  )}
                  {(activeGame.status === 'ready' ||
                    activeGame.status === 'planned') && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (
                          activeGame.status === 'ready' ||
                          activeGame.status === 'in-progress'
                        ) {
                          setStep('live');
                        } else {
                          alert(
                            'Finalize the lineup first to start the live scorer',
                          );
                        }
                      }}
                    >
                      Next: Live Scorer &rarr;
                    </Button>
                  )}
                  {activeGame.status === 'in-progress' && (
                    <Button
                      variant="secondary"
                      onClick={() => setStep('live')}
                    >
                      Next: Live Scorer &rarr;
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Live Scorer */}
          {step === 'live' && (
            <div>
              {activeGame.status === 'in-progress' ||
              activeGame.status === 'completed' ||
              activeGame.status === 'reviewed' ? (
                <LiveScorer
                  game={activeGame}
                  onUpdate={updateGame}
                  players={players}
                />
              ) : activeGame.status === 'ready' ? (
                <Card className="text-center !py-12">
                  <div className="text-4xl mb-4">&#x26BE;</div>
                  <h3 className="text-lg font-bold text-[#FDB515] mb-2">
                    Ready to Start
                  </h3>
                  <p className="text-sm text-[#8E8E8E] mb-4">
                    Lineup is finalized. Start the game to begin live scoring.
                  </p>
                  <Button onClick={() => startLiveGame(activeGame)}>
                    Start Game
                  </Button>
                </Card>
              ) : (
                <Card className="text-center !py-12">
                  <div className="text-4xl mb-4">&#x26BE;</div>
                  <h3 className="text-lg font-bold text-[#FDB515] mb-2">
                    Not Ready Yet
                  </h3>
                  <p className="text-sm text-[#8E8E8E] mb-4">
                    Complete the Setup and Lineup steps, then finalize to start
                    the game.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setStep('lineup')}
                  >
                    Go to Lineup
                  </Button>
                </Card>
              )}
              <div className="flex gap-2 justify-between mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep('lineup')}
                >
                  &larr; Lineup
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setStep('review')}
                >
                  Next: Review &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 'review' && (
            <div>
              <GameReview
                game={activeGame}
                onUpdate={updateGame}
                players={players}
              />
              <div className="flex gap-2 justify-between mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep('live')}
                >
                  &larr; Live Scorer
                </Button>
                <div className="flex gap-2">
                  {activeGame.status !== 'reviewed' && (
                    <Button
                      onClick={() => {
                        updateGame({ ...activeGame, status: 'reviewed' });
                      }}
                    >
                      Mark as Reviewed
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => setActiveGameId(null)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  RENDER — Game List (no active game)                             */
  /* ================================================================ */

  const sortedGames = [...games].sort((a, b) =>
    (b.date || '').localeCompare(a.date || ''),
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-xl font-bold"
            style={{
              color: THEME.gold,
              fontFamily: "'Oswald',sans-serif",
            }}
          >
            Game Day
          </h2>
          <p className="text-sm text-[#8E8E8E] mt-0.5">
            {games.length} game{games.length !== 1 ? 's' : ''} this season
          </p>
        </div>
        <Button onClick={createGame}>+ New Game</Button>
      </div>

      {/* ── Templates Quick Access ───────────────────────────── */}
      {templates.length > 0 && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#FAF9F6]">
              Quick Start from Template
            </h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => createGameFromTemplate(t)}
                className="flex-shrink-0 rounded-lg px-4 py-2.5 text-left transition-colors"
                style={{
                  background: THEME.black,
                  border: `1px solid ${THEME.charcoal}`,
                  cursor: 'pointer',
                  minWidth: 160,
                }}
              >
                <div className="text-xs font-semibold text-[#FAF9F6]">
                  {t.name}
                </div>
                <div className="text-[10px] text-[#8E8E8E] mt-0.5">
                  {t.battingOrder?.length || 0} batters
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* ── Game List ────────────────────────────────────────── */}
      {sortedGames.length === 0 ? (
        <Card className="text-center !py-12">
          <div className="text-4xl mb-4">&#x26BE;</div>
          <h3 className="text-lg font-bold text-[#FDB515] mb-2">
            No Games Yet
          </h3>
          <p className="text-sm text-[#C4C4C4] mb-4">
            Create your first game to start tracking lineups, scoring, and
            stats.
          </p>
          <Button onClick={createGame}>+ New Game</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedGames.map((game) => {
            const sc = STATUS_CONFIG[game.status] || STATUS_CONFIG.planned;
            const isExpanded = expandedId === game.id;
            const scoring = game.scoring || {};
            const review = game.review || {};
            const atBats = scoring.atBats || {};

            return (
              <Card key={game.id} className="!p-0 overflow-hidden">
                {/* Main row */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : game.id)
                  }
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold text-[#FAF9F6]">
                        {game.date
                          ? new Date(
                              game.date + 'T12:00:00',
                            ).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'No date'}
                        {game.opponent && ` vs ${game.opponent}`}
                      </span>
                      <Badge preset={sc.preset}>{sc.label}</Badge>
                    </div>
                    <div className="flex gap-2 items-center">
                      {game.homeAway && (
                        <Badge preset="gray">
                          {game.homeAway === 'home' ? 'Home' : 'Away'}
                        </Badge>
                      )}
                      {game.gameType && game.gameType !== 'league' && (
                        <Badge preset="blue">{game.gameType}</Badge>
                      )}
                      {review.result && (
                        <Badge
                          preset={
                            review.result === 'W'
                              ? 'green'
                              : review.result === 'L'
                                ? 'red'
                                : 'gray'
                          }
                        >
                          {review.result}
                        </Badge>
                      )}
                      {(review.ourScore || review.theirScore) && (
                        <Badge preset="gold">
                          {review.ourScore || '?'}-{review.theirScore || '?'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {game.status === 'in-progress' && (
                      <Button
                        size="sm"
                        className="!bg-[#3498DB]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGameId(game.id);
                          setStep('live');
                        }}
                      >
                        Resume
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveGameId(game.id);
                        setStep(
                          game.status === 'planned'
                            ? 'setup'
                            : game.status === 'ready'
                              ? 'lineup'
                              : game.status === 'in-progress'
                                ? 'live'
                                : 'review',
                        );
                      }}
                    >
                      {game.status === 'completed' || game.status === 'reviewed'
                        ? 'View'
                        : 'Edit'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGame(game.id);
                      }}
                    >
                      x
                    </Button>
                  </div>
                </div>

                {/* Expanded player stats */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4"
                    style={{
                      borderTop: `1px solid ${THEME.charcoal}`,
                    }}
                  >
                    <div className="pt-3 space-y-1">
                      {players
                        .filter((p) => game.availability?.[p.id])
                        .map((p) => {
                          const abs = atBats[p.id] || [];
                          const r = (scoring.runs || {})[p.id] || 0;
                          const rbi = (scoring.rbis || {})[p.id] || 0;
                          const sb = (scoring.steals || {})[p.id] || 0;
                          const defS =
                            (scoring.defensiveStats || {})[p.id] || {};
                          const obs =
                            (review.observations || {})[p.id] || '';
                          const codes = abs.map((a) =>
                            typeof a === 'string' ? a : a.code,
                          );
                          const hits = codes.filter((c) =>
                            ['1B', '2B', '3B', 'HR'].includes(c),
                          ).length;
                          const abCount = codes.filter(
                            (c) =>
                              !['BB', 'HBP', 'SAC'].includes(c),
                          ).length;

                          return (
                            <div
                              key={p.id}
                              className="flex items-center justify-between py-1.5 text-xs"
                              style={{
                                borderBottom: `1px solid ${THEME.charcoal}`,
                              }}
                            >
                              <span className="font-semibold text-[#FAF9F6]">
                                {p.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  style={{
                                    color: THEME.gold,
                                    fontFamily: "'Oswald',sans-serif",
                                  }}
                                >
                                  {hits}-{abCount}
                                </span>
                                {r > 0 && (
                                  <span style={{ color: THEME.green }}>
                                    {r}R
                                  </span>
                                )}
                                {rbi > 0 && (
                                  <span style={{ color: THEME.blue }}>
                                    {rbi}RBI
                                  </span>
                                )}
                                {sb > 0 && (
                                  <span style={{ color: THEME.goldDim }}>
                                    {sb}SB
                                  </span>
                                )}
                                {(defS.putouts > 0 ||
                                  defS.assists > 0 ||
                                  defS.errors > 0 ||
                                  defS.pitches > 0) && (
                                  <span className="text-[10px] text-[#8E8E8E]">
                                    {defS.putouts > 0
                                      ? `${defS.putouts}PO `
                                      : ''}
                                    {defS.assists > 0
                                      ? `${defS.assists}A `
                                      : ''}
                                    {defS.errors > 0
                                      ? `${defS.errors}E `
                                      : ''}
                                    {defS.pitches > 0
                                      ? `${defS.pitches}P`
                                      : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      {review.coachNotes && (
                        <p className="text-xs text-[#8E8E8E] italic mt-2">
                          Coach: {review.coachNotes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Alignment Library ────────────────────────────────── */}
      {alignments.length > 0 && (
        <div className="mt-8">
          <h3
            className="text-base font-bold mb-3"
            style={{
              color: THEME.gold,
              fontFamily: "'Oswald',sans-serif",
            }}
          >
            Alignment Library ({alignments.length})
          </h3>
          <div className="space-y-2">
            {alignments.map((al) => (
              <Card key={al.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#FAF9F6]">
                        {al.name}
                      </span>
                      {al.isPrimary && <Badge preset="gold">Primary</Badge>}
                    </div>
                    <div className="flex gap-2 flex-wrap mt-1.5">
                      {(al.positions || []).map((pos, i) => {
                        const p = players.find((pl) => pl.id === pos.playerId);
                        return (
                          <span key={i} className="text-[11px] text-[#8E8E8E]">
                            <span
                              className="font-semibold"
                              style={{ color: THEME.gold }}
                            >
                              {pos.position}:
                            </span>{' '}
                            {p?.name || 'Unknown'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!al.isPrimary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setAlignments((prev) =>
                            prev.map((a) => ({
                              ...a,
                              isPrimary: a.id === al.id,
                            })),
                          )
                        }
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm(`Delete alignment "${al.name}"?`)) {
                          deleteAlignment(al.id);
                        }
                      }}
                    >
                      x
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
