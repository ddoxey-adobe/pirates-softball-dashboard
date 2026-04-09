# Modular Refactor Plan — Pirates Softball Dashboard

**Date:** April 9, 2026
**Goal:** Transform 16,386-line monolith into a modular, persona-aware coaching platform

---

## 1. Target Architecture

```
pirates-softball-dashboard/
├── index.html                    (Vite entry point)
├── vite.config.js
├── tailwind.config.js
├── package.json
├── public/
│   └── pirates-logo.svg
├── src/
│   ├── main.jsx                  (React root mount)
│   ├── App.jsx                   (Shell: auth check → module router → layout)
│   ├── app/
│   │   ├── moduleRegistry.js     (Declares all modules, enabled/disabled, permissions)
│   │   ├── theme.js              (THEME colors, fonts — CSS variables)
│   │   ├── constants.js          (POSITIONS, GRADES, SKILL_AREAS, AB_RESULTS)
│   │   ├── storage.js            (localStorage wrapper + Supabase adapter)
│   │   ├── auth.js               (PIN/role auth + permission checks)
│   │   └── teamConfig.js         (Team name, colors, season — loaded from storage)
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button.jsx        (Variants: primary, secondary, ghost, danger, small)
│   │   │   ├── Card.jsx          (Dark card with border, optional gold highlight)
│   │   │   ├── Modal.jsx         (Overlay + centered content, title, close, wide option)
│   │   │   ├── Badge.jsx         (Colored pill — color, bg, children props)
│   │   │   ├── Input.jsx         (Dark themed text input with label)
│   │   │   ├── Select.jsx        (Dark themed dropdown with label)
│   │   │   ├── TextArea.jsx      (Dark themed multiline with label)
│   │   │   ├── Tabs.jsx          (Gold active tab bar, supports icons)
│   │   │   ├── Toggle.jsx        (On/off switch)
│   │   │   ├── StarRating.jsx    (1-5 star skill display/editor)
│   │   │   ├── Toast.jsx         (Success/error notification — replaces alert())
│   │   │   └── ConfirmDialog.jsx (Styled confirm — replaces confirm())
│   │   ├── hooks/
│   │   │   ├── useStorage.js     (Get/set with key, auto-persist)
│   │   │   ├── useTeamConfig.js  (Read/write team config)
│   │   │   ├── useAuth.js        (Current user role, permissions)
│   │   │   └── useFirebase.js    (Firebase realtime for tryouts)
│   │   └── layouts/
│   │       ├── AppShell.jsx      (Header + tab bar + content area)
│   │       ├── TodayBanner.jsx   (Next Up event card)
│   │       └── BottomNav.jsx     (Mobile bottom navigation)
│   ├── modules/
│   │   ├── today/                ← NEW: Home screen
│   │   │   ├── index.js          (Module registration)
│   │   │   └── TodayPanel.jsx    (What's happening today — context-aware)
│   │   ├── roster/
│   │   │   ├── index.js
│   │   │   ├── RosterPanel.jsx   (Player list + coach list)
│   │   │   ├── PlayerCard.jsx    (Name, position, skills, parent info)
│   │   │   ├── PlayerForm.jsx    (Add/edit player modal)
│   │   │   └── data.js           (SEED_PLAYERS, player helpers)
│   │   ├── schedule/
│   │   │   ├── index.js
│   │   │   ├── SchedulePanel.jsx (Calendar view with CRUD)
│   │   │   ├── EventCard.jsx     (Single event display)
│   │   │   ├── EventForm.jsx     (Add/edit event)
│   │   │   └── data.js           (SEASON_SCHEDULE, helpers)
│   │   ├── practice/
│   │   │   ├── index.js
│   │   │   ├── PracticePanel.jsx (Plan + run practices)
│   │   │   ├── DrillPicker.jsx   (Drill library browser)
│   │   │   ├── ActivePractice.jsx(Live practice mode with tracking)
│   │   │   ├── PracticeLog.jsx   (Post-practice observations)
│   │   │   └── data.js           (DRILL_LIBRARY, TEMPLATES)
│   │   ├── gameday/              ← MERGED: Planner + Lineup + Game
│   │   │   ├── index.js
│   │   │   ├── GameDayPanel.jsx  (Unified: setup → lineup → score → review)
│   │   │   ├── LineupBuilder.jsx (Position assignment + batting order)
│   │   │   ├── LiveScorer.jsx    (Pitch-by-pitch offense + defense)
│   │   │   ├── GameReview.jsx    (Post-game coach notes + stats)
│   │   │   ├── PrintLineup.jsx   (Printable lineup card)
│   │   │   └── data.js           (Game helpers, stat calculations)
│   │   ├── reports/
│   │   │   ├── index.js
│   │   │   ├── ReportsPanel.jsx  (Simplified dashboard)
│   │   │   ├── PlayerProfile.jsx (Individual player stats + trends)
│   │   │   ├── TeamDashboard.jsx (Season overview)
│   │   │   └── ExportReport.jsx  (PDF/HTML export)
│   │   ├── comms/
│   │   │   ├── index.js
│   │   │   ├── CommsPanel.jsx    (Templates with auto-fill)
│   │   │   └── data.js           (Message templates)
│   │   ├── scouting/             ← TOGGLEABLE: off by default
│   │   │   ├── index.js          (enabled: false)
│   │   │   ├── ScoutingPanel.jsx
│   │   │   ├── OpponentCard.jsx
│   │   │   └── data.js
│   │   └── tryouts/              ← SEPARATE MODE
│   │       ├── index.js          (mode: "standalone")
│   │       ├── TryoutsPanel.jsx  (Current 2,550 lines, gradually refactored)
│   │       ├── ScoreForm.jsx
│   │       ├── Rankings.jsx
│   │       ├── DraftBoard.jsx
│   │       ├── Registration.jsx
│   │       └── data.js           (Scoring engine, position weights)
│   ├── parent/                   ← NEW: Parent-facing views
│   │   ├── ParentSchedule.jsx    (Read-only schedule)
│   │   ├── PlayerStats.jsx       (Their kid's stats only)
│   │   └── ParentLayout.jsx      (Simplified header, no coach tools)
│   └── styles/
│       └── index.css             (Tailwind base + theme CSS variables)
```

---

## 2. Module System Design

### Module Registration

Each module has an `index.js` that exports its config:

```javascript
// modules/scouting/index.js
import { lazy } from 'react';

export default {
  id: 'scouting',
  label: 'Scouting',
  icon: '🔍',
  enabled: false,           // OFF by default — enable for travel ball
  tier: 'advanced',         // basic | advanced | league
  mode: 'tab',              // tab | standalone | parent-view
  permissions: ['head_coach', 'assistant'],
  component: lazy(() => import('./ScoutingPanel')),
  storageKeys: ['scouting-reports', 'opponent-teams'],
};
```

### Module Registry

```javascript
// app/moduleRegistry.js
import today from '../modules/today';
import roster from '../modules/roster';
import schedule from '../modules/schedule';
import practice from '../modules/practice';
import gameday from '../modules/gameday';
import reports from '../modules/reports';
import comms from '../modules/comms';
import scouting from '../modules/scouting';
import tryouts from '../modules/tryouts';

const ALL_MODULES = [today, roster, schedule, practice, gameday, reports, comms, scouting, tryouts];

export function getActiveModules(userRole, teamConfig) {
  return ALL_MODULES.filter(m => {
    if (!m.enabled && !teamConfig.enabledModules?.includes(m.id)) return false;
    if (m.permissions && !m.permissions.includes(userRole)) return false;
    return true;
  });
}
```

### App Shell Rendering

```javascript
// App.jsx
function App() {
  const { role } = useAuth();
  const teamConfig = useTeamConfig();
  const modules = getActiveModules(role, teamConfig);
  const [activeTab, setActiveTab] = useState(modules[0]?.id);

  return (
    <AppShell>
      <Tabs tabs={modules} active={activeTab} onSelect={setActiveTab} />
      <Suspense fallback={<Loading />}>
        {modules.map(m => activeTab === m.id && <m.component key={m.id} />)}
      </Suspense>
    </AppShell>
  );
}
```

---

## 3. Auth & Permissions

### Simple PIN-Based Auth (v1)

```javascript
// Roles and their capabilities
const ROLES = {
  league_director: { modules: ['*'], data: 'all_teams' },
  head_coach:      { modules: ['today','roster','schedule','practice','gameday','reports','comms','tryouts'], data: 'own_team' },
  assistant:       { modules: ['today','roster:view','schedule','gameday','tryouts:score'], data: 'own_team' },
  parent:          { modules: ['schedule:view','stats:own_child'], data: 'own_child' },
  player:          { modules: ['schedule:view','stats:self'], data: 'self' },
};

// Auth flow
// 1. First visit → "Select your role" screen
// 2. Coach roles → enter team PIN (set by head coach)
// 3. Parent role → enter player access code (generated per player)
// 4. Role stored in localStorage, checked on each app load
```

### URL-Based Views (no auth needed)

```
/                          → Coach dashboard (requires PIN)
/#/register                → Tryout registration (public)
/#/schedule                → Read-only schedule (public)
/#/stats/teagan-doxey      → Player stats page (public, read-only)
```

---

## 4. State Management

### Global State (shared across modules)

```javascript
// Accessed via hooks, persisted to storage
const GLOBAL_STATE = {
  teamConfig: {},     // Team name, colors, season
  players: [],        // Roster
  coaches: [],        // Coaching staff
  schedule: [],       // Season events
};
```

### Module-Local State (not shared)

```javascript
// Each module manages its own state
// Practice: current practice plan, active drill
// GameDay: current game, live scoring state
// Tryouts: scores, draft picks, check-in
// Reports: filters, expanded sections
```

### Storage Adapter

```javascript
// storage.js — same API, swappable backend
const storage = {
  async get(key) { /* localStorage now, Supabase later */ },
  async set(key, value) { /* localStorage now, Supabase later */ },
  async subscribe(key, callback) { /* no-op now, realtime later */ },
};
```

---

## 5. Migration Plan (Phase by Phase)

### Phase 0: Build System Setup (4 hours)
**What:** Initialize Vite, Tailwind, folder structure, module registry
**After:** New `npm run dev` serves a Pirates-themed shell with placeholder tabs. Old `build.sh` still works for the live app.
**Risk:** Low — parallel setup, nothing breaks
**Status:** Agent building this now

### Phase 1: Extract Shared Components (6 hours)
**What:** Build Button, Card, Modal, Badge, Input, Select, Tabs, Toast, ConfirmDialog as standalone components with Tailwind
**After:** Component library works independently. Can be imported by any module.
**Risk:** Low — new code, nothing existing changes

### Phase 2: Extract Data Constants (2 hours)
**What:** Move THEME, DRILL_LIBRARY, SEED_PLAYERS, SEASON_SCHEDULE, constants to separate files in `src/data/`
**After:** Data is importable by any module. Single source of truth.
**Risk:** Low — just file reorganization

### Phase 3: Extract Roster Module (4 hours)
**What:** Move RosterPanel + PlayerForm into `modules/roster/`. Wire to storage hooks.
**After:** Roster works as a standalone module. First proof that the module system works.
**Risk:** Medium — first real extraction, may surface state dependencies

### Phase 4: Extract Schedule Module (4 hours)
**What:** Move SchedulePanel into `modules/schedule/`. Add CRUD (add/edit/delete events).
**After:** Schedule is editable. Biggest user-facing improvement.
**Risk:** Low — SchedulePanel is already fairly isolated

### Phase 5: Extract Practice Module (6 hours)
**What:** Move PracticeLog + drill picker + active practice into `modules/practice/`
**After:** Practice planning works as standalone module.
**Risk:** Medium — practice has complex drill tracking state

### Phase 6: Create Game Day Module (8 hours)
**What:** MERGE Planner + LineupBuilder + GameLog into unified `modules/gameday/`. Flow: Setup → Lineup → Score → Review.
**After:** One tab for game day instead of three. Biggest UX improvement.
**Risk:** High — merging three components with different data models

### Phase 7: Extract Reports Module (4 hours)
**What:** Move Reports into `modules/reports/`. Simplify to: Season Dashboard, Player Profiles, Export.
**After:** Reports load separately (big performance win — 4,000 lines no longer loaded on every tab).
**Risk:** Medium — Reports depends on data from multiple other modules

### Phase 8: Extract Comms Module (2 hours)
**What:** Move Comms into `modules/comms/`. Wire auto-fill from schedule data.
**After:** Templates auto-fill [DAY], [TIME], [OPPONENT] from schedule.
**Risk:** Low — Comms is simple

### Phase 9: Move Scouting to Toggle Module (2 hours)
**What:** Move Scouting into `modules/scouting/` with `enabled: false`.
**After:** Scouting is invisible by default. Head coach can enable it in settings.
**Risk:** Low — just moving code + adding toggle

### Phase 10: Refactor Tryouts to Standalone Mode (4 hours)
**What:** Move TryoutsPanel into `modules/tryouts/`. Add mode switch for tryout season vs regular season.
**After:** Tryouts is a separate mode, not tab 10. Accessible during tryout week.
**Risk:** Medium — Firebase integration needs careful handling

### Phase 11: Add Today Home Screen (4 hours)
**What:** Build `modules/today/TodayPanel.jsx`. Shows: next event, quick actions based on context (practice day vs game day), recent activity.
**After:** Coach opens app → sees exactly what they need today.
**Risk:** Low — new component, reads from other modules' data

### Phase 12: Add Auth + Parent Views (8 hours)
**What:** Build PIN auth, role selection, parent-facing routes (#/schedule, #/stats).
**After:** Parents can see schedule and their kid's stats. Coaches see full dashboard.
**Risk:** Medium — auth touches every module's visibility

### Phase 13: Migrate to Supabase (8 hours)
**What:** Swap localStorage adapter for Supabase. Add magic link auth. Real-time sync.
**After:** Multi-device, cloud backup, shareable. The tool becomes a product.
**Risk:** High — data migration, backend dependency

---

## 6. Tech Stack

| Layer | Current | Target |
|-------|---------|--------|
| Build | Babel Standalone (runtime) | **Vite** (compile-time, HMR) |
| Framework | React 18 CDN | **React 18** (npm, tree-shaken) |
| Styling | Inline styles | **Tailwind CSS** |
| Storage | localStorage | **localStorage → Supabase** |
| Auth | None | **PIN → Supabase Auth** |
| Hosting | GitHub Pages | **GitHub Pages → Vercel** (for API routes) |
| Tryout sync | Firebase Realtime | **Firebase → Supabase Realtime** (consolidate) |

---

## 7. Data Migration Strategy

### localStorage → Supabase

1. On first Supabase-enabled load, check if localStorage has data
2. If yes, show: "We found existing data. Upload to cloud? This enables multi-device sync."
3. On confirm, push all localStorage data to Supabase
4. Set a `migrated: true` flag in localStorage
5. Future loads read from Supabase, write to both (fallback)
6. After 30 days of successful cloud operation, stop writing to localStorage

### Version Migration

Current storage keys use version numbers (`v1`, `v2`, `v3`). The new system:
- Reads any version on first load
- Migrates to the latest schema
- Writes only the latest version going forward
- Old keys are preserved (not deleted) for 1 season as backup

---

## Summary

| Phase | Effort | Impact | Risk |
|-------|--------|--------|------|
| 0: Vite setup | 4h | Foundation | Low |
| 1: Shared components | 6h | Reusability | Low |
| 2: Data extraction | 2h | Clean imports | Low |
| 3: Roster module | 4h | First proof | Medium |
| 4: Schedule module + CRUD | 4h | Editable schedule! | Low |
| 5: Practice module | 6h | Core feature | Medium |
| 6: Game Day (merge 3→1) | 8h | Biggest UX win | High |
| 7: Reports module | 4h | Performance win | Medium |
| 8: Comms module | 2h | Auto-fill templates | Low |
| 9: Scouting toggle | 2h | Clean removal | Low |
| 10: Tryouts standalone | 4h | Separate mode | Medium |
| 11: Today home screen | 4h | Daily driver | Low |
| 12: Auth + parent views | 8h | Multi-persona | Medium |
| 13: Supabase migration | 8h | Product-ready | High |
| **Total** | **66h** | | |

**Recommended order:** 0 → 1 → 2 → 11 → 4 → 3 → 6 → 5 → 8 → 7 → 9 → 10 → 12 → 13

Start with the foundation (0-2), then the biggest user-facing wins (Today screen, editable schedule), then the hard merge (Game Day), then polish.
