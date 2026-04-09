# GameDay Merge Analysis: LineupPlanner + LineupBuilder + GameLog

**Status:** Analysis only -- no changes made  
**Risk level:** HIGH  
**Date:** 2026-04-08

---

## 1. Component Inventory

### 1.1 LineupPlanner (lines 3217-3736)

**Tab:** "Planner" (id: `planner`)  
**Props:** `{ players, onCreateGame }`

**State it manages:**
| State variable | Type | Purpose |
|---|---|---|
| `templates` | Array | Game templates (batting order + alignment references) |
| `alignments` | Array | Reusable defensive alignment library |
| `editingTemplate` | String/null | ID of template being edited |
| `editingAlignment` | String/null | ID of alignment being edited |
| `showTemplateBuilder` | Boolean | Show/hide template builder sub-view |
| `showAlignmentBuilder` | Boolean | Show/hide alignment builder sub-view |
| `alignmentForm` | Object | Working form for alignment being created/edited |
| `templateForm` | Object | Working form for template being created/edited |

**localStorage keys:**
| Key | Data |
|---|---|
| `pirates-lineup-templates-2026v2` | Game templates array |
| `pirates-alignment-library-2026v2` | Defensive alignments array |

**Data models:**
- **Alignment:** `{ id, name, positions: [{ playerId, position }], isPrimary, createdDate }`  
  - Positions are ONLY player-to-field-position mappings (no batting order)
- **Template:** `{ id, name, description, battingLineup: [{ battingOrder, playerId }], alignmentIds: [], createdDate }`  
  - Batting lineup has NO positions -- only batting order numbers
  - References alignments by ID rather than embedding them

**Features:**
- Create/edit/delete defensive alignments (9-position grid picker)
- Mark one alignment as "Primary"
- Create/edit/delete game templates (batting order + alignment selection)
- Reorder batters with up/down arrows in template builder
- "Create Game" button on each template (calls `onCreateGame` prop)

**How it relates to the others:**
- The `onCreateGame` callback is intended to bridge to GameLog, but it is a **broken TODO** (see section 3 below).
- Its alignment concept (`positions: [{ playerId, position }]`) is **incompatible** with LineupBuilder's alignment concept (`lineup: [{ playerId, battingOrder, position }]`).
- Uses `v2` storage keys that are completely separate from LineupBuilder's `v1` keys.

---

### 1.2 LineupBuilder (lines 3739-5343)

**Tab:** "Lineup" (id: `lineup`)  
**Props:** `{ players }`

**State it manages:**
| State variable | Type | Purpose |
|---|---|---|
| `lineups` | Array | Saved game lineups |
| `practices` | Array | Practice data (read-only, for attendance warnings) |
| `games` | Array | Game logs from GameLog (read-only, for playing-time warnings) |
| `alignmentLibrary` | Array | ITS OWN separate alignment library |
| `editing` | String/null | ID of lineup being edited |
| `showBuilder` | Boolean | Show/hide lineup builder modal |
| `form` | Object | Working form for lineup being created/edited |
| `activeGame` | Object/null | Currently running live game |
| `subModal` | Object/null | Substitution modal state |
| `injuryNotes` | String | Injury description during substitution |
| `multiGameInjury` | Boolean | Whether injury spans multiple games |
| `expandedInjuries` | Array | Expanded injury history toggles |

**localStorage keys:**
| Key | Data |
|---|---|
| `pirates-lineups-2026v1` | Lineups array |
| `pirates-practices-unified-2026v1` | Practices (read-only) |
| `pirates-gamelogs-2026v1` (STORAGE_KEYS.GAMELOGS) | Game logs (read-only) |
| `pirates-alignment-library-2026v1` | Alignment library |

**Data models:**
- **Lineup:** `{ id, opponent, date, location, status ("draft"/"finalized"/"completed"), createdDate, availability: {playerId: bool}, lineup: [{ playerId, battingOrder, position }], alignments: [{ name, lineup: [...] }], activeAlignment, notes, gameState }`
- **Alignment (Library):** `{ id, name, lineup: [{ playerId, battingOrder, position }], createdDate }` -- positions AND batting order combined
- **GameState:** `{ currentInning, inningData: { [inning]: [{ playerId, position }] }, playingTime: { [playerId]: innings }, benchTime, substitutionHistory, injuredPlayers }`

**Features:**
- Create/edit/delete game lineups with opponent, date, location
- Player availability toggles with attendance/playing-time warnings
- Batting order AND position assignment (combined in one view)
- Field position coverage visualization (missing/doubled positions)
- Auto-fill lineup from available players
- Reusable alignment library (save/load position+batting configs)
- Game-specific alignment snapshots
- Finalize lineup workflow (draft -> finalized)
- **LIVE GAME ENGINE:**
  - Start/resume/end game from finalized lineups
  - Inning-by-inning position tracking
  - Substitution system with smart sorting (primary > secondary > experience > new)
  - Injury tracking with multi-game flag, notes, return-to-play
  - Playing time fairness tracker with progress bars
  - Quick alignment loading during live game
  - Save-and-exit / resume game capability

---

### 1.3 GameLog (lines 5389-6045)

**Tab:** "Game" (id: `gamelog`)  
**Props:** `{ players }`

**State it manages:**
| State variable | Type | Purpose |
|---|---|---|
| `logs` | Array | Game log entries |
| `show` | Boolean | Show/hide game modal |
| `ed` | String/null | ID of game being edited |
| `expId` | String/null | Expanded game in list view |
| `mode` | String | Active tab within modal: "setup"/"score"/"coach" |
| `curBatterIdx` | Number | Current batter position in scoring view |
| `showSBPicker` | Boolean | Stolen base player picker |
| `showRunPicker` | Boolean | Run scoring player picker |
| `defenseMode` | String | "offense" or "defense" within scorer |
| `currentPitcher` | String/null | Active pitcher player ID |
| `pitchCount` | Object | Current pitcher's pitch/strike/ball counts |
| `inningPitchers` | Object | Per-inning pitcher tracking |
| `form` | Object | Working game form |
| `count` | Object | Current at-bat ball/strike/foul count |

**localStorage keys:**
| Key | Data |
|---|---|
| `pirates-gamelogs-2026v1` (STORAGE_KEYS.GAMELOGS) | Game logs array |

**Data model:**
- **Game log:** `{ id, date, opponent, result, homeAway, gameType, ourScore, theirScore, battingOrder: [playerId], attendance: {playerId: bool}, atBats: {playerId: [{code, inning, balls, strikes, fouls}]}, runs: {playerId: N}, rbis: {playerId: N}, steals: {playerId: N}, positions: {playerId: [pos]}, pitching: {playerId: {innings, pitchCount}}, observations: {playerId: ""}, coachNotes: "", outs, inning, inningHalf, defensiveInnings, defensiveStats: {playerId: {putouts, assists, errors, pitches}} }`

**Features:**
- Game list view with expandable per-player stat summaries
- Three-tab modal: **Game Setup** / **Live Scorer** / **Coach Review**
- **Game Setup:** Date, opponent, home/away, game type, result, score, attendance, batting order reorder, print lineup card
- **Live Scorer (Offense):** Full at-bat tracking with pitch count (ball/strike/foul), at-bat results (1B/2B/3B/HR/GO/FO/HBP/BB/K), stolen bases, runs/RBIs, undo, inning auto-advance on 3 outs
- **Live Scorer (Defense):** Pitcher selection with pitch counting (strike/ball), pitch count warnings (green/yellow/red zones), quick defensive play entry (K/ground out/fly out/error), per-player defensive stats
- **Coach Review:** Per-player observations, pitching stats entry, coach notes
- Printable lineup card generation

---

## 2. What's Duplicated Between the Three

### 2.1 Batting Order Construction (3 independent implementations)

| Component | How it builds batting order |
|---|---|
| **LineupPlanner** | Click-to-add players, up/down reorder buttons, `battingLineup: [{ battingOrder, playerId }]` -- NO positions |
| **LineupBuilder** | Add-from-dropdown, up/down reorder, `lineup: [{ playerId, battingOrder, position }]` -- WITH positions |
| **GameLog** | All players pre-loaded, up/down reorder in setup tab, `battingOrder: [playerId]` -- just an ordered ID array |

All three have their own up/down arrow reorder UI. None share code.

### 2.2 Defensive Alignment / Position Assignment (2 independent implementations)

| Component | How it handles positions |
|---|---|
| **LineupPlanner** | Dedicated alignment builder with 3x3 position grid, position-only (no batting order), stored separately as library |
| **LineupBuilder** | Inline position dropdowns per batting-order row, plus a separate "alignment library" that saves full lineup snapshots |

The data formats are **incompatible**: Planner stores `[{ playerId, position }]` while Builder stores `[{ playerId, battingOrder, position }]`.

### 2.3 Player Availability / Attendance (2 independent implementations)

| Component | How it tracks availability |
|---|---|
| **LineupBuilder** | `availability: {playerId: bool}` with attendance/playing-time warning badges |
| **GameLog** | `attendance: {playerId: bool}` with toggle chips, filters batting order |

Same concept, different key names, different UI patterns.

### 2.4 Live Game Tracking (2 independent, incompatible systems)

| Feature | LineupBuilder | GameLog |
|---|---|---|
| **Inning tracking** | `gameState.currentInning` with next/prev buttons | `form.inning` with +/- buttons |
| **Position tracking** | Per-inning snapshots in `inningData` | Manual position chip toggles per player |
| **Substitutions** | Full modal with smart-sorted eligible subs | None |
| **Injury tracking** | Full system with multi-game flag, notes, return | None |
| **Playing time** | Automatic inning-based tracker | None |
| **At-bat recording** | None | Full pitch-by-pitch with count tracking |
| **Defensive stats** | None | Putouts, assists, errors, pitch counting |
| **Pitching tracker** | None | Per-pitcher strike/ball counter with warnings |
| **Score tracking** | None | Runs, RBIs, stolen bases per player |
| **Coach notes** | None | Per-player observations + coach notes |

**Key insight:** LineupBuilder has the live FIELD management (who's playing where, subs, injuries, fairness) while GameLog has the live SCORING (at-bats, pitching, defensive plays, coach review). These are complementary halves of the same game.

---

## 3. The Broken "Create Game" TODO

**Location:** `App.jsx` line 16372-16375

```jsx
{tab==="planner" && <LineupPlanner players={players} onCreateGame={(template) => {
  // TODO: Pass template to GameLog and show game creation form
  alert(`Creating game from template: ${template.name}\n\nThis will be implemented in Phase 1 Step 2!`);
  setTab("gamelog");
}} />}
```

**What it does now:** Shows an alert and switches to the gamelog tab. The template data is thrown away.

**What it should do:**
1. Take the template's `battingLineup` (ordered player IDs) and `alignmentIds` (references to defensive alignments)
2. Resolve the alignment IDs to actual position data from the Planner's alignment library
3. Create a pre-populated game form in the unified component with:
   - Batting order from template
   - Initial field positions from the primary alignment
   - All referenced alignments available for quick-load during the game
4. Open the game setup view with this pre-populated data

**Why it's broken beyond the TODO:**
- GameLog has no mechanism to receive external data (no props for initial form state)
- The template's `battingLineup` format (`[{ battingOrder, playerId }]`) doesn't match GameLog's `battingOrder` format (`[playerId]`)
- The template references alignments by ID, but the Planner's alignment library is in `v2` storage and the Planner component owns that state -- GameLog has no access

---

## 4. Storage Key Mismatch: Planner (v2) vs Builder (v1)

### Alignment Libraries

| Component | Storage Key | Data Shape |
|---|---|---|
| **LineupPlanner** | `pirates-alignment-library-2026v2` | `[{ id, name, positions: [{ playerId, position }], isPrimary, createdDate }]` |
| **LineupBuilder** | `pirates-alignment-library-2026v1` | `[{ id, name, lineup: [{ playerId, battingOrder, position }], createdDate }]` |

These are **two completely separate alignment libraries** with:
- Different storage keys (v2 vs v1)
- Different data structures (`positions` vs `lineup`, position-only vs position+battingOrder)
- Different feature sets (Planner has `isPrimary`, Builder does not)
- No cross-references between them

**User impact:** A coach who creates alignments in the Planner tab will not see them in the Lineup tab, and vice versa. This is confusing because both tabs claim to manage "defensive alignments."

### Game Data

| Component | Storage Key | Data Shape |
|---|---|---|
| **LineupBuilder** | `pirates-lineups-2026v1` | Full lineup objects with gameState |
| **GameLog** | `pirates-gamelogs-2026v1` | Full game log objects with at-bat data |
| **LineupBuilder** | `pirates-gamelogs-2026v1` (READ-ONLY) | Reads GameLog's data for playing-time calculations |

LineupBuilder reads GameLog's data but GameLog has no knowledge of LineupBuilder's data. A game played via LineupBuilder's live engine generates no at-bat stats. A game scored via GameLog has no position tracking or substitution history.

---

## 5. Ideal Unified Flow: Setup -> Lineup -> Score -> Review

### Phase 1: Pre-Game (replaces Planner + Builder setup)

**"Game Setup" view:**
1. Create game: date, opponent, location, home/away, game type
2. (Optional) Load from template -- pre-fills batting order + alignments
3. Player availability toggles (with attendance/playing-time warnings from Builder)
4. Status: "Planned"

### Phase 2: Lineup (replaces Builder's lineup builder + Planner's template builder)

**"Lineup" view:**
1. Batting order construction (add players, reorder)
2. Position assignment per player (dropdown per row, like Builder)
3. Field coverage visualization (like Builder)
4. Save/load defensive alignments from unified library
5. Save as reusable template for future games
6. Print lineup card
7. Finalize to lock lineup
8. Status: "Ready"

### Phase 3: Live Game (merges Builder's live engine + GameLog's live scorer)

**"Live Game" view (single screen, two panels):**

Left panel -- Field Management (from LineupBuilder):
- On-field position display per inning
- Substitution modal with smart sorting
- Injury tracking
- Quick alignment loading
- Bench display with playing-time warnings

Right panel -- Live Scoring (from GameLog):
- Offense mode: current batter, pitch count, at-bat results, runs/RBIs/steals
- Defense mode: pitcher selection, pitch counting, quick plays (K/GO/FO/E)
- Inning/outs display (shared between panels)

**Inning advance** is now unified: one "Next Inning" action advances the inning for BOTH field positions and scoring.

Status: "In Progress" while active, "Completed" when ended.

### Phase 4: Post-Game Review (from GameLog's coach review)

**"Review" view:**
- Per-player observations
- Pitching summary (auto-populated from live scorer)
- Coach notes
- Game result entry (W/L/T, score)
- Full stat summary (batting lines, defensive stats, playing time)
- Status: "Reviewed"

### Alignment Library (unified, replaces both v1 and v2)

Single persistent library accessible from any game:
- Defensive-only alignments (like Planner's concept): `[{ playerId, position }]`
- Can be attached to templates or loaded into live games
- Single storage key
- Supports "Primary" marking (from Planner)

### Template Library (unified, from Planner)

Reusable game configurations:
- Batting order (player IDs in order)
- References to alignment IDs
- Description
- Can be applied when creating a new game

---

## 6. Data Model Changes Required

### 6.1 Unified Game Object

```javascript
{
  id: String,
  
  // Setup (Phase 1)
  date: String,
  opponent: String,
  location: String,
  homeAway: "home" | "away",
  gameType: "league" | "scrimmage" | "internal" | "tournament" | "exhibition",
  templateId: String | null,  // Source template, if any
  
  // Lineup (Phase 2)
  availability: { [playerId]: Boolean },
  battingOrder: [playerId],  // Ordered array of player IDs
  initialPositions: [{ playerId, position }],  // Starting field positions
  alignmentIds: [String],  // Referenced alignment IDs for quick-load
  gameAlignments: [{ id, name, positions: [{ playerId, position }] }],  // Game-specific snapshots
  notes: String,
  
  // Live Game (Phase 3) -- from LineupBuilder's gameState
  gameState: {
    currentInning: Number,
    inningData: { [inning]: [{ playerId, position }] },
    playingTime: { [playerId]: Number },
    substitutionHistory: [{ inning, out, in, position, isInjury, timestamp }],
    injuredPlayers: [{ playerId, inning, position, notes, multiGame, returnedInning }],
  },
  
  // Live Scoring (Phase 3) -- from GameLog's form
  scoring: {
    atBats: { [playerId]: [{ code, inning, balls, strikes, fouls }] },
    runs: { [playerId]: Number },
    rbis: { [playerId]: Number },
    steals: { [playerId]: Number },
    positions: { [playerId]: [String] },  // All positions played
    defensiveStats: { [playerId]: { putouts, assists, errors, pitches } },
    pitching: { [playerId]: { innings, pitchCount } },  // From coach review
    outs: Number,
    inning: Number,  // Should sync with gameState.currentInning
    inningHalf: String,
  },
  
  // Review (Phase 4) -- from GameLog's coach tab
  review: {
    result: "W" | "L" | "T" | "",
    ourScore: String,
    theirScore: String,
    observations: { [playerId]: String },
    coachNotes: String,
  },
  
  // Status tracking
  status: "planned" | "ready" | "in-progress" | "completed" | "reviewed",
  createdDate: String,
}
```

### 6.2 Unified Alignment Object

```javascript
{
  id: String,
  name: String,
  positions: [{ playerId, position }],  // Position-only, no batting order
  isPrimary: Boolean,
  createdDate: String,
}
```

This follows Planner's design (positions only, with isPrimary), which is more correct. Batting order is a separate concern from defensive alignment.

### 6.3 Unified Template Object

```javascript
{
  id: String,
  name: String,
  description: String,
  battingOrder: [playerId],  // Just ordered IDs
  alignmentIds: [String],  // References to alignment library
  createdDate: String,
}
```

### 6.4 Unified Storage Keys

```javascript
STORAGE_KEYS = {
  ...existing,
  GAMES: "pirates-games-2026v1",          // Replaces pirates-lineups-2026v1 + pirates-gamelogs-2026v1
  ALIGNMENTS: "pirates-alignments-2026v1", // Replaces both alignment libraries
  TEMPLATES: "pirates-templates-2026v1",   // Replaces pirates-lineup-templates-2026v2
};
```

---

## 7. Migration Plan for Existing localStorage Data

### Step 1: Read all old data

```javascript
const migrateGameData = async () => {
  const oldLineups = await loadStore("pirates-lineups-2026v1", []);
  const oldGameLogs = await loadStore("pirates-gamelogs-2026v1", []);
  const oldAlignmentsV1 = await loadStore("pirates-alignment-library-2026v1", []);
  const oldAlignmentsV2 = await loadStore("pirates-alignment-library-2026v2", []);
  const oldTemplates = await loadStore("pirates-lineup-templates-2026v2", []);
  // ... see steps below
};
```

### Step 2: Migrate alignments (merge v1 + v2)

```javascript
// v2 alignments (from Planner) are already in the target format
const migratedAlignments = oldAlignmentsV2.map(a => ({
  id: a.id,
  name: a.name,
  positions: a.positions,  // Already [{ playerId, position }]
  isPrimary: a.isPrimary || false,
  createdDate: a.createdDate,
}));

// v1 alignments (from Builder) need position extraction
oldAlignmentsV1.forEach(a => {
  // Check for name collision with v2
  const existingName = migratedAlignments.find(m => m.name === a.name);
  const name = existingName ? `${a.name} (from Lineup)` : a.name;
  
  migratedAlignments.push({
    id: `migrated-${a.id}`,
    name,
    positions: a.lineup.map(spot => ({ playerId: spot.playerId, position: spot.position })),
    isPrimary: false,
    createdDate: a.createdDate,
  });
});
```

### Step 3: Migrate templates (from Planner v2)

```javascript
const migratedTemplates = oldTemplates.map(t => ({
  id: t.id,
  name: t.name,
  description: t.description,
  battingOrder: t.battingLineup
    .sort((a, b) => a.battingOrder - b.battingOrder)
    .map(spot => spot.playerId),
  alignmentIds: t.alignmentIds,  // These reference v2 alignment IDs, which are preserved
  createdDate: t.createdDate,
}));
```

### Step 4: Migrate game logs (from GameLog)

```javascript
const migratedFromGameLogs = oldGameLogs.map(g => ({
  id: g.id,
  date: g.date,
  opponent: g.opponent,
  location: "",
  homeAway: g.homeAway || "home",
  gameType: g.gameType || "league",
  templateId: null,
  
  availability: g.attendance || {},
  battingOrder: g.battingOrder || [],
  initialPositions: [],
  alignmentIds: [],
  gameAlignments: [],
  notes: "",
  
  gameState: null,  // GameLog games have no field management data
  
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
    inningHalf: g.inningHalf || "top",
  },
  
  review: {
    result: g.result || "",
    ourScore: g.ourScore || "",
    theirScore: g.theirScore || "",
    observations: g.observations || {},
    coachNotes: g.coachNotes || "",
  },
  
  status: g.result ? "reviewed" : "completed",
  createdDate: g.createdDate || g.date || new Date().toISOString(),
}));
```

### Step 5: Migrate lineups (from LineupBuilder)

```javascript
const migratedFromLineups = oldLineups.map(l => {
  // Check if this lineup has a matching game log (same opponent + date)
  const matchingGameLog = migratedFromGameLogs.find(
    g => g.opponent === l.opponent && g.date === l.date
  );
  
  // If there's a matching game log, merge the field data into it
  if (matchingGameLog) {
    matchingGameLog.gameState = l.gameState;
    matchingGameLog.battingOrder = matchingGameLog.battingOrder.length > 0
      ? matchingGameLog.battingOrder  // Prefer GameLog's batting order (has stats)
      : l.lineup.sort((a, b) => a.battingOrder - b.battingOrder).map(s => s.playerId);
    matchingGameLog.initialPositions = l.lineup.map(s => ({ playerId: s.playerId, position: s.position }));
    matchingGameLog.gameAlignments = l.alignments || [];
    matchingGameLog.notes = l.notes || matchingGameLog.notes;
    matchingGameLog.availability = { ...matchingGameLog.availability, ...l.availability };
    return null;  // Don't create duplicate
  }
  
  // No matching game log -- create standalone game record
  return {
    id: l.id,
    date: l.date,
    opponent: l.opponent,
    location: l.location || "",
    homeAway: "home",
    gameType: "league",
    templateId: null,
    
    availability: l.availability || {},
    battingOrder: l.lineup.sort((a, b) => a.battingOrder - b.battingOrder).map(s => s.playerId),
    initialPositions: l.lineup.map(s => ({ playerId: s.playerId, position: s.position })),
    alignmentIds: [],
    gameAlignments: l.alignments || [],
    notes: l.notes || "",
    
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
      inningHalf: "top",
    },
    
    review: {
      result: "",
      ourScore: "",
      theirScore: "",
      observations: {},
      coachNotes: "",
    },
    
    status: l.status === "completed" ? "completed" : l.status === "finalized" ? "ready" : "planned",
    createdDate: l.createdDate || new Date().toISOString(),
  };
}).filter(Boolean);
```

### Step 6: Merge and save

```javascript
const allGames = [...migratedFromGameLogs, ...migratedFromLineups];
await saveStore("pirates-games-2026v1", allGames);
await saveStore("pirates-alignments-2026v1", migratedAlignments);
await saveStore("pirates-templates-2026v1", migratedTemplates);

// Mark migration as complete
localStorage.setItem("pirates-migration-gameday-v1", "done");
```

### Step 7: Keep old keys for rollback

Do NOT delete the old storage keys during migration. Only remove them after the merged component has been stable for multiple sessions. Add a cleanup function gated behind a version check:

```javascript
const OLD_KEYS_TO_CLEAN = [
  "pirates-lineups-2026v1",
  "pirates-alignment-library-2026v1",
  "pirates-alignment-library-2026v2",
  "pirates-lineup-templates-2026v2",
  // Don't remove pirates-gamelogs-2026v1 until Reports/Stats components
  // are updated to read from the new key
];
```

---

## 8. Tab Consolidation

### Current tabs (3):
| Tab | Component | Purpose |
|---|---|---|
| Planner | LineupPlanner | Templates + alignment library |
| Lineup | LineupBuilder | Game lineups + live field management |
| Game | GameLog | Game scoring + stats |

### Proposed tabs (1):
| Tab | Component | Purpose |
|---|---|---|
| GameDay | GameDay | Unified: templates, lineups, live game (field + scoring), review |

The unified "GameDay" tab would have a **sub-navigation within** to handle the different views:
- **Library** -- alignment library + templates (from Planner)
- **Games** -- list of all games with status badges
- **Active Game** -- combined live field + scoring view (when a game is in progress)

---

## 9. External Consumers of Game Data

Before merging, these other components read game data and must be updated:

| Consumer | What it reads | Storage key |
|---|---|---|
| **LineupBuilder** (itself) | `STORAGE_KEYS.GAMELOGS` for playing-time warnings | `pirates-gamelogs-2026v1` |
| **Reports** component | `STORAGE_KEYS.GAMELOGS` for batting/fielding stats | `pirates-gamelogs-2026v1` |
| **Stats views** (line ~9428) | `STORAGE_KEYS.GAMELOGS` for season statistics | `pirates-gamelogs-2026v1` |

After migration, these must either:
1. Read from the new `pirates-games-2026v1` key and extract `scoring` sub-object, OR
2. Continue reading from the old key while a compatibility shim writes to both keys

**Recommendation:** Option 2 during the transition. The unified component should write game log data to BOTH the new key and the legacy `STORAGE_KEYS.GAMELOGS` key until all consumers are updated.

---

## 10. Implementation Order (Suggested)

1. **Create unified data model and migration function** -- test that all old data converts correctly
2. **Build the unified GameDay component** starting from LineupBuilder as the base (it has the most complex state)
3. **Merge GameLog's scoring into GameDay** as a sub-view within the live game
4. **Merge Planner's template/alignment library** into GameDay as a sub-view
5. **Wire up the "Create Game from Template" flow** that was the original broken TODO
6. **Remove the three old tabs** and replace with single GameDay tab
7. **Update external consumers** (Reports, Stats) to read from new storage key
8. **Remove legacy storage writes** once all consumers are updated

---

## 11. Risk Factors

| Risk | Impact | Mitigation |
|---|---|---|
| Data loss during migration | HIGH -- coaches lose game history | Keep old keys; run migration on load with rollback flag |
| Two live game engines in one component | HIGH -- complex state interactions | Clear separation: `gameState` owns field, `scoring` owns stats; single inning source of truth |
| Inning sync between field + scoring | MEDIUM -- different inning counts | Single `currentInning` value shared by both panels |
| Existing Reports/Stats break | MEDIUM -- season stats disappear | Dual-write to old key during transition |
| Large component size | MEDIUM -- App.jsx already 16K+ lines | Extract GameDay to its own file before building |
| In-progress games at migration time | LOW -- game state may be mid-play | Detect `status === "in-progress"` and preserve `gameState` exactly as-is |
