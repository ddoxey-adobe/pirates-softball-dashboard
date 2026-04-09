# Pirates Softball Dashboard -- Full Audit
**Date:** April 9, 2026  
**Auditor:** Claude Code (Opus 4.6)  
**Files examined:** `src/App.jsx` (16,386 lines, 872KB), `TryoutsPanel.jsx` (2,550 lines, 124KB), `index.html`, `build.sh`, all project docs  

---

## Executive Summary

The Pirates Softball Dashboard is an ambitious single-file React application that covers an unusually wide surface area for a coaching tool: roster management, practice planning, game scoring, scouting, tryout evaluation with Firebase sync, a snake draft system, reports, communications, lineup building, and scheduling. For a tool built for one team's 2026 season, it is impressively functional. For a tool that other coaches or leagues could use, it has critical architectural and data-safety issues that must be resolved first.

**Bottom line:** This is a strong prototype with real coaching value today for the Pirates staff. It is NOT ready to share with other coaches without addressing the issues below.

---

## 1. Tab-by-Tab Feature Audit

### 1.1 Roster (lines 1094-1295)
**What works:**
- Full CRUD for players and coaches
- Skill ratings (1-5 stars), positions (primary + secondary), parent contacts
- Filtering by returning/new status
- Coach management with roles and specialties
- Jersey numbers, school, years of experience, nickname tracking

**What is broken or incomplete:**
- Delete has no confirmation dialog (single click deletes a player permanently)
- No undo for any roster action
- Player skills are all initialized to 0 for seed players despite notes saying they were rated at tryouts
- `positions[]` array (legacy) and `primaryPosition`/`secondaryPositions` (new) coexist with no migration; line 1122 has a fallback but it is confusing

**What is missing for production:**
- No player photo/avatar
- No import from CSV or roster file
- No player deactivation (only delete)
- No duplicate detection
- No jersey number conflict detection
- No parent email field displayed in the form (field exists in data model but no UI input)

---

### 1.2 Schedule (lines 13455-13558)
**What works:**
- Full season schedule with games, practices, scrimmages, tournaments
- Phase-based grouping (Pre-Season, Week 1, etc.)
- "Next Up" card with quick navigation
- Filter by event type
- Past/future event distinction with opacity
- Today highlighting

**What is broken or incomplete:**
- **Schedule is entirely hardcoded** in `SEASON_SCHEDULE` (lines 628-798). There is no way to add, edit, or delete events from the UI. This is a read-only calendar display.
- No integration with game log or practice log -- events exist independently
- No export to calendar (iCal, Google Calendar)

**What is missing for production:**
- CRUD for schedule events (critical gap)
- Recurring event support
- Calendar view (currently list-only)
- Location map links
- Weather integration
- RSVP / availability tracking
- Conflict detection

---

### 1.3 Scouting (lines 6188-9338)
**What works:**
- Opponent team management (create teams, add players with jersey/name/position)
- Scouting report creation with batting analysis, pitching analysis, defensive ratings
- Tag-based strength/weakness system for batters (Pull Hitter, Power, Speed, etc.)
- Pitcher analysis with speed, control, and pitch type tags
- **Live tracking mode** -- real-time at-bat tracking during games with pitch counts, baserunning, and batting order detection
- Per-position defensive ratings (1-5)
- Stats sidebar with real-time computed batting stats (avg, OBP, SLG, OPS)
- Report cloning for re-scouting
- Bulk league roster import (8 teams, 104 players pre-loaded)
- Dual-team scouting (home vs. away)
- Batting order management and lineup modal

**What is broken or incomplete:**
- Uses `prompt()` for bulk player import (line 6954) and quick batter add (line 6258) -- poor UX
- Stats sidebar uses `window.innerWidth` check (line 8806) which does not respond to resize events
- Legacy `opponentTeamId` and `opponent` fields coexist with newer `homeTeamId`/`awayTeamId` (backward compatibility debt)

**What is missing for production:**
- No photo/video attachment for scouting evidence
- No historical comparison between multiple scouting sessions of same team
- No game plan generation from scouting data
- No pitch heat map or spray chart visualization

**Assessment:** This is the most complete and impressive tab. The live tracking feature alone puts this ahead of many basic scouting tools.

---

### 1.4 Practice (lines 1299-3215)
**What works:**
- Three-phase practice lifecycle: Plan -> Active -> Complete
- 80+ drill library with detailed descriptions, categories, coaches, and durations
- Practice templates (8+ pre-built: early season, mid season, pre-game, hitting-focused, etc.)
- Drill tracking for specific drills (sprint times, strike/ball ratios, point scores, batting levels)
- Stopwatch for timed drills
- Station rotation system (3 groups)
- Attendance tracking per practice
- Player group assignment (Red/Blue/Gold)
- Quick highlights/notes during active practice
- Per-player observations
- Coach notes
- Migration from old storage keys to unified structure

**What is broken or incomplete:**
- `alert("Error starting practice: " + error.message)` on line 1443 -- browser alert for error handling
- `alert("Please enter a note")` on line 1456 -- browser alert for validation
- Confirm dialogs for delete (lines 1521, 1574, 1628) -- should be custom modals

**What is missing for production:**
- No drag-and-drop for drill ordering (README claims this exists but no evidence in code)
- No drill search/filter in the planning view
- No practice duration countdown timer
- No practice sharing/export (PDF or printable)
- No drill video links

**Assessment:** Solid practice management. The tracking system is a genuine differentiator.

---

### 1.5 Planner (lines 3217-3738)
**What works:**
- Defensive alignment builder (9 positions with player assignment)
- Batting order template builder (separate from positions)
- Alignment library (save multiple configurations like "Rose Pitching", "Lucy Pitching")
- Primary alignment designation
- Template-to-game creation intent (TODO on line 16373)

**What is broken or incomplete:**
- **Critical bug:** `onCreateGame` callback shows `alert()` on line 16374: "This will be implemented in Phase 1 Step 2!" -- the Planner-to-Game pipeline is NOT connected.
- Uses `alert()` for validation (lines 3260, 3264, 3279, 3283)

**What is missing for production:**
- Visual field diagram for alignment placement
- Position conflict warnings (two players at same position)
- Integration with Game tab is incomplete

---

### 1.6 Lineup (lines 3739-5388)
**What works:**
- Game-specific lineup builder with opponent, date, location
- Player availability toggling
- Batting order with drag-to-reorder
- **Active game position tracking** with inning-by-inning position history
- Substitution system with bench tracking
- Injury tracking during games (single-game vs. multi-game injuries)
- Playing time warnings (low attendance, low playing time)
- Alignment library for quick position loading
- Post-game summary with playing time percentages
- Game completion flow

**What is broken or incomplete:**
- **Storage key mismatch bug:** LineupBuilder uses `pirates-alignment-library-2026v1` (line 3751) but LineupPlanner uses `pirates-alignment-library-2026v2` (line 3227). Alignments created in Planner are invisible in Lineup and vice versa. This is a data integrity bug.
- Uses `alert()` extensively (lines 3787, 4762, 5183, 5241, 5324)
- Uses `confirm()` for critical actions like deleting lineups (line 4794)
- `prompt()` used for saving alignments (lines 5186, 5244)

**What is missing for production:**
- Lineup export/print for dugout use
- Integration with Schedule (auto-populate opponent from schedule)
- Fair play calculator (equal playing time enforcement)

---

### 1.7 Game (lines 5389-6048)
**What works:**
- Full game log with setup, live tracking, and post-game flow
- Pitch-by-pitch count tracking (balls, strikes, fouls)
- Automatic walk on 4 balls, automatic strikeout on 3 strikes
- Batting order management with attendance filtering
- At-bat result recording with 13 result types (1B, 2B, 3B, HR, BB, HBP, K, backwards-K, GO, FO, FC, SAC, E)
- Color-coded results
- Run and RBI tracking per player
- Stolen base tracking
- Defense mode with pitcher tracking, pitch count alerts (40/50/60 pitches)
- Quick defensive play entry (K, GO, FO, E)
- Defensive stats (putouts, assists, errors)
- Inning tracking with outs
- Game saving and editing

**What is broken or incomplete:**
- Uses `alert()` for validation (lines 6456, 6539, 6570, 6574, 6598, 6603)
- Confirm dialogs for critical game actions (lines 3883, 3889, 4091, 4205, 4259, 4307)
- Score export opens a new popup window (line 5382) which browsers often block
- No autosave during live game -- data loss risk if browser closes

**What is missing for production:**
- Real-time score display for spectators/parents
- Game timer
- Pitch type tracking (fastball, changeup, etc.)
- Spray chart / hit location
- Box score export
- Integration with Schedule (auto-populate opponent)

**Assessment:** The core scoring engine is functional and covers both offense and defense. The pitch count tracking with USA Softball alerts is a valuable safety feature.

---

### 1.8 Reports (lines 9391-13388)
**What works:**
- Practice timeline with drill frequency, attendance trends
- Drill leaderboards with best/average/improvement tracking
- Player comparison modal (select 2+ players, compare stats side-by-side)
- Player profiles with drill history, game stats, goals
- Game analytics (W/L record, runs scored/allowed, win percentage)
- Injury tracking and analytics (by position, by inning, return rates)
- Playing time analysis
- Team and individual goal setting with progress tracking
- Collapsible sections with expand/collapse all
- Date range filtering (all, 30, 60, 90 days)
- Attendance filtering (all vs. at-risk)
- Drill sorting (frequency, recent, name)
- Season report export to popup window (HTML format)
- Pull-to-refresh on mobile (Reports tab only)

**What is broken or incomplete:**
- Report export uses `window.open()` (line 12304) which browsers block as popups
- `alert("Please allow popups to generate the report.")` fallback (line 12306)
- Goal progress calculation only works for attendance and baserunning categories (lines 9518-9538); other categories return `{ current: 0, progress: 0 }`

**What is missing for production:**
- PDF export
- Season-over-season comparison
- Charts/graphs (all data is numeric tables)
- Automated weekly digest
- Sharable report links

**Assessment:** The most data-rich tab. Real coaching intelligence is here. The lack of visualizations (charts, graphs) significantly limits its impact.

---

### 1.9 Comms (lines 6049-6144)
**What works:**
- 5 message templates (Season Welcome, Practice Reminder, Game Day Info, Schedule Change, Weekly Recap)
- Template editing with placeholder text
- Parent contact quick-reference
- "Copy to clipboard" for sending via external apps
- Message history (last 5 sent, with date)
- Quick contact lists: coaches-only and all-contacts, each with copy button
- Dual phone number support

**What is broken or incomplete:**
- Templates are hardcoded with Pirates-specific content; dynamic fields like `[DAY]`, `[TIME]` are not auto-populated
- No actual sending mechanism -- copy-paste only
- Message "sent" tracking is really "copied" tracking; no delivery confirmation

**What is missing for production:**
- Actual SMS/email integration
- Individual player/parent messaging
- Read receipts
- Announcement board
- Calendar event attachments
- Auto-generated game recap messages from game log data
- Template customization persistence (edits are lost on reload)

---

### 1.10 Tryouts (lines 13566-16110)
**What works:**
- **7 sub-tabs**: Rubric, Players, Check-In, Score, Rankings, Draft, Registration
- **Rubric tab**: Clear scoring criteria with anchor descriptions for each category, station plan, tier scale, position weighting, position urgency
- **Players tab**: 40 pre-loaded tryout players with number, name, grade, school. Add/edit/delete players. CSV paste import. Roster needs tracking.
- **Check-In tab**: Digital check-in with count display. Tracks who showed up.
- **Score tab**: Per-evaluator scoring across 7 categories (hitting, glove work, throwing, hustle, attitude, coachability, pitching). Anchor-based rubric visible during scoring. Score averaging across multiple evaluators.
- **Rankings tab**: Automatic ranking by total score percentage. Tier badges (High/Solid/Dev/Support/Emerging). Position fit calculation with weighted scoring per position. Position urgency indicators. Comparative scoring.
- **Draft tab**: Full snake draft system. Configurable team names. Available player board sorted by score. Per-team roster display with average scores. Position fit board. Undo last pick. Reset draft. **Roster import modal** to export drafted teams for the main roster.
- **Registration tab**: Self-service registration mode via `#register` URL hash. Parent-facing form with player info, position preferences, experience. Registration counter.
- **Firebase real-time sync**: Cross-device scoring during tryouts. Connection status indicator. localStorage backup.
- **Multi-evaluator support**: Default evaluators (Doxey, Ken, Shari). Score averaging across evaluators.

**What is broken or incomplete:**
- Firebase API key is hardcoded and exposed in source code (line 13571): `AIzaSyB0yepEGh_xeuM49joy8U9rFRLN6GrrEmg`. This key is also committed to git and published in `index.html`.
- The `TryoutsPanel` component re-destructures React hooks from `React` global (line 13567): `const { useState, useEffect, useRef, useCallback } = React;` -- this works because the build process strips the import statement but is fragile.
- No Firebase security rules audit -- anyone with the config could read/write the database
- TryoutsPanel has its own `TModal` component (line 14168) that duplicates the main `Modal` component
- Draft roster import modal generates data but does not actually write to the main roster storage -- it shows a "copy to clipboard" flow

**What is missing for production:**
- Tryout session management (multiple tryout dates)
- Video recording integration for evaluations
- Parent notification of results
- Comparison to previous year's tryout data
- Printable evaluation sheets for offline scoring

**Assessment:** This is the crown jewel of the app. The tryout evaluation + draft system is genuinely production-quality for a rec league. The Firebase sync makes it usable across multiple coaches simultaneously. The registration mode is a nice parent-facing touch.

---

## 2. Persona Readiness

### 2.1 League Director
| Capability | Status | Notes |
|---|---|---|
| Create multiple teams | NO | Single-team app. No multi-team support. |
| Manage tryouts across league | PARTIAL | Tryout draft supports multiple team names but all within one pool. No per-team tryout sessions. |
| Run a draft | YES | Snake draft with position fit, undo, reset, team rosters. |
| Assign players to teams | PARTIAL | Draft assigns players to team names. Roster import is copy-paste, not automatic. |
| Set league schedule | NO | Schedule is hardcoded. No CRUD. |
| View standings | NO | No standings feature exists. |

**Verdict:** Not ready for league directors. This is a single-team tool with a multi-team tryout bolt-on.

### 2.2 Head Coach
| Capability | Status | Notes |
|---|---|---|
| Plan practices with drills | YES | 80+ drills, templates, station rotations, tracking. |
| Track live games | YES | Pitch-by-pitch, offense + defense modes, pitch count alerts. |
| Manage roster | YES | Full CRUD, skills, positions, parent contacts. |
| Scout opponents | YES | Full scouting with live tracking, team rosters, batting/pitching analysis. |
| View reports | YES | Practice timelines, drill leaderboards, player profiles, game analytics. |
| Communicate with parents | PARTIAL | Copy-paste templates. No actual sending. |
| Run tryouts | YES | Full evaluation, scoring, ranking, drafting. |

**Verdict:** Highly functional for a head coach. This is clearly the primary persona the app was designed for. The gaps are in communication (no real messaging) and schedule management (read-only).

### 2.3 Assistant Coach
| Capability | Status | Notes |
|---|---|---|
| Score tryout players | YES | Multi-evaluator scoring with individual login. |
| View (not edit) roster | NO | No role-based access control. Full edit access or no access. |
| Help with game tracking | YES | Can open the app on their device, but no multi-device game sync (only tryouts have Firebase). |

**Verdict:** Not specifically supported. No role-based access means assistants have full admin access, which is a governance issue. The tryout multi-evaluator system is the one place assistants are explicitly supported.

### 2.4 Parent
| Capability | Status | Notes |
|---|---|---|
| See schedule | PARTIAL | If shared the URL, they can view the schedule tab. But no parent-specific view. |
| See child's stats | NO | No parent-facing view. No login/access control. |
| Get notifications | NO | No notification system. |
| Tryout registration | YES | Registration mode at `#register` hash is parent-facing. |

**Verdict:** Not ready for parents beyond tryout registration. Parents would see the entire coaching dashboard if given the URL.

### 2.5 Player
| Capability | Status | Notes |
|---|---|---|
| See schedule | PARTIAL | Same as parent -- full dashboard access. |
| See own stats | NO | No player-specific view. |

**Verdict:** Not supported as a distinct persona.

---

## 3. Bugs and Issues

### 3.1 Confirmed Bugs

1. **Storage key mismatch (CRITICAL):** `LineupPlanner` uses `pirates-alignment-library-2026v2` but `LineupBuilder` uses `pirates-alignment-library-2026v1`. Alignments created in one tab are invisible in the other. Data is split across two keys with no migration.

2. **Planner-to-Game pipeline broken:** Line 16373 has a TODO: "Pass template to GameLog and show game creation form." The `onCreateGame` callback shows a browser alert saying "This will be implemented in Phase 1 Step 2!" The Planner tab cannot create games.

3. **Goal progress calculation incomplete:** The `calculateGoalProgress` function (line 9517) only handles `attendance` and `baserunning` categories. All other goal categories (hitting, fielding, etc.) return `{ current: 0, progress: 0 }` regardless of actual data.

4. **Stats sidebar does not respond to resize:** Line 8806 uses `window.innerWidth <= 768` at render time, which is evaluated once. Resizing the browser does not trigger a re-render, so the sidebar layout can be wrong after a resize.

### 3.2 Code Smells and Anti-Patterns

1. **Browser dialogs:** 40+ uses of `alert()`, 20+ uses of `confirm()`, and 4 uses of `prompt()` throughout the codebase. These are blocking, not accessible, and cannot be styled. Every one should be replaced with custom modal dialogs.

2. **No error boundaries:** Zero instances of `ErrorBoundary` or `componentDidCatch`. A runtime error in any component crashes the entire app with a white screen.

3. **Zero accessibility:** No `aria-` attributes, no `role` attributes, no `tabIndex`, no `onKeyDown` handlers anywhere in 16,386 lines. Not keyboard-navigable. Screen readers cannot parse it.

4. **Popup-based exports:** Report export (line 12304), scouting report export (line 7137), and game scorebook export (line 5382) all use `window.open()`, which most browsers block by default. Users get `alert("Please allow popups")` as the error message.

5. **Three `window.location.reload()` calls:** Lines 881, 16237, 16356. Page reloads destroy in-memory state and create a jarring user experience.

6. **Duplicate component definitions:** `TModal` (line 14168 inside TryoutsPanel) duplicates `Modal` (line 1084). Two different modal implementations in the same file.

7. **Inline styles everywhere:** No CSS classes, no CSS-in-JS library, no stylesheets. Every element has a `style={{}}` prop. This makes theming, responsive design, and maintenance extremely difficult.

8. **143 useState calls, 26 useEffect calls:** Extreme state complexity in a single file with no state management library. Every component re-renders with every state change in its parent.

### 3.3 TODO/FIXME/HACK
- **1 TODO:** Line 16373: "Pass template to GameLog and show game creation form"
- **0 FIXME:** None found
- **0 HACK:** None found

---

## 4. Production Readiness

### 4.1 Data Persistence
| Layer | Status | Scope |
|---|---|---|
| localStorage | YES | All tabs except Tryouts |
| Firebase Realtime DB | YES | Tryouts tab only |
| window.storage wrapper | YES | Async wrapper around localStorage for main app |
| Export/Import (JSON backup) | YES | Full data export/import for main app |

**Critical issue:** localStorage has a 5-10MB limit per origin. With 13+ storage keys, drill tracking data, game logs, scouting reports, and opponent rosters, a full season of data could approach this limit. There is no monitoring or warning for storage exhaustion.

**Critical issue:** localStorage is per-browser, per-device. If a coach switches browsers, clears browser data, or uses a different device, all data is lost unless they manually export/import.

**Critical issue:** The Tryouts tab uses Firebase but the rest of the app does not. This creates a split-brain data architecture where tryout data is cloud-synced but everything else is local-only.

### 4.2 Error Handling
- **No error boundaries.** Any uncaught exception in React render causes a white screen crash.
- `try/catch` blocks exist (50 instances) but most have empty catch blocks: `catch {}` or `catch (e) {}`. Errors are silently swallowed.
- Console errors/warnings: only 9 `console.error`/`console.warn`/`console.log` calls total, all in the Firebase sync code.

### 4.3 Mobile Responsiveness
- Viewport meta tag is set correctly in `build.sh`: `width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no`
- **No media queries** except for print styles (3 instances)
- Swipe navigation between tabs: YES (lines 13390-13452)
- Pull-to-refresh on Reports tab: YES (lines 13418-13452)
- Tab bar has horizontal scroll on mobile: YES (`overflowX: "auto"`)
- Stats sidebar has a mobile check: YES but broken (evaluated once, not responsive)
- **No responsive grid layouts.** Two-column grids in Comms, Reports will stack poorly on mobile.
- **Most forms use fixed-width grids** (e.g., `gridTemplateColumns: "1fr 1fr 1fr"`) that will be cramped on mobile.

**Verdict:** Partially mobile-friendly. Touch gestures are good. Layouts need work.

### 4.4 Performance
- **16,386 lines in a single file (872KB of JSX).** Babel transpiles this entirely on every page load.
- **No code splitting.** Every tab's code is loaded even if never visited.
- **No memoization.** No `useMemo`, `useCallback` (except in TryoutsPanel), `React.memo` usage in the main app. Every state change re-renders everything.
- **Babel standalone transpilation:** The build uses Babel Standalone in the browser (`<script type="text/babel">`), which means every page load includes a ~2.5MB JavaScript parser that transpiles 872KB of JSX at runtime. This adds 2-5 seconds to initial load on mobile.
- **CDN dependencies loaded synchronously:** React, ReactDOM, Firebase, Babel are all loaded from CDN with no `async` or `defer` attributes in the build script.
- **No production build:** The build.sh script produces a development build with no minification, no tree-shaking, and no optimization.

### 4.5 Security
1. **Firebase API key exposed in source code, committed to git, and published in index.html.** The key `AIzaSyB0yepEGh_xeuM49joy8U9rFRLN6GrrEmg` is for project `softball-tryouts-2026`. While Firebase API keys are technically client-side and not secret (Firebase relies on security rules), without proper database rules, anyone can read/write all tryout data.
2. **No authentication.** Anyone with the URL has full admin access.
3. **No input sanitization.** Player names, notes, and all text fields are rendered directly. While React escapes HTML in JSX, the `window.open()` export functions build raw HTML strings that could be vulnerable to injection.
4. **PII exposure:** Parent phone numbers, names, and player information are stored in localStorage (unencrypted) and visible in the Firebase database. The `.gitignore` does not mention `.env` files, and there is no environment variable usage.
5. **No HTTPS enforcement.** The GitHub Pages deployment uses HTTPS by default, but there is no redirect or HSTS header.

### 4.6 Accessibility
**Rating: 0/10.**
- Zero `aria-` attributes in 16,386 lines
- Zero `role` attributes
- Zero `tabIndex` attributes
- Zero `onKeyDown` handlers
- Star ratings are not keyboard-accessible
- Modals do not trap focus
- No skip-to-content link
- No visible focus indicators (all custom buttons)
- Color contrast: gold (#FDB515) on black (#1B1B1B) is 10.4:1 (good), but gray (#8E8E8E) on black is 5.2:1 (passes AA but fails AAA for small text)

---

## 5. Gap Analysis

### Critical (Blocks real usage by other coaches/leagues)

| # | Gap | Impact |
|---|---|---|
| C1 | **No authentication / role-based access** | Anyone with the URL has full admin access. Cannot share with parents, assistants, or league directors without exposing everything. |
| C2 | **localStorage-only persistence (except tryouts)** | All season data is trapped in one browser on one device. Device loss, browser clear, or switching devices = total data loss. |
| C3 | **16K-line single file with Babel Standalone** | 3-5 second load time on mobile. Cannot be maintained or extended by other developers. No code splitting, no tree shaking. |
| C4 | **No error boundaries** | Any React error crashes the entire app to a white screen. During a live game, this is catastrophic. |
| C5 | **Hardcoded schedule with no CRUD** | Teams cannot manage their own schedule. The schedule tab is a static display of Pirates 2026 data. |
| C6 | **Storage key mismatch between Planner and Lineup** | Alignment data is split, creating confusion and data loss. |
| C7 | **No autosave during live game tracking** | Browser crash or accidental close during a game loses all in-progress data. |
| C8 | **Pirates-specific seed data baked in** | Other teams would see Pirates players, Pirates schedule, Pirates coaches on first load. No onboarding flow. |

### Important (Degrades experience significantly)

| # | Gap | Impact |
|---|---|---|
| I1 | **40+ browser alert() / confirm() / prompt() calls** | Jarring, non-branded, blocks the UI thread. |
| I2 | **No charts or graphs in Reports** | All data is in tables. Coaches need visual trends to make decisions quickly. |
| I3 | **No actual messaging (copy-paste only)** | Comms tab is a text editor, not a communication tool. |
| I4 | **No PDF or print export** | Lineup cards, practice plans, and reports should be printable. Coaches use paper in the dugout. |
| I5 | **Popup-blocked exports** | `window.open()` is blocked by default in most browsers. Export fails silently. |
| I6 | **No undo for destructive actions** | Deleting players, games, practices, and scouting reports is instant and permanent. |
| I7 | **Mobile layout issues** | Fixed multi-column grids, small touch targets, no responsive breakpoints beyond tab scrolling. |
| I8 | **Firebase API key in source control** | Security risk. Database could be vandalized. |
| I9 | **No onboarding / setup wizard** | New users see a fully populated Pirates team instead of an empty state that guides them through setup. |
| I10 | **Planner-to-Game pipeline not connected** | TODO left unimplemented. Templates cannot create games. |
| I11 | **Goal progress broken for most categories** | Only attendance and baserunning goals track progress. All others show 0%. |

### Nice-to-Have (Polish items)

| # | Gap | Impact |
|---|---|---|
| N1 | **No dark/light mode toggle** | Dark-only theme. Some coaches may prefer light mode for outdoor use. |
| N2 | **No keyboard shortcuts** | Power users cannot navigate quickly. |
| N3 | **No player photos** | Coaches learn names faster with faces. |
| N4 | **No field diagram in lineup/alignment** | Positions are assigned from a list, not dragged onto a diamond. |
| N5 | **No calendar view for schedule** | List-only view. Month/week calendar would be standard. |
| N6 | **No pitch type tracking in games** | Only fastball pitch count. No changeup, drop, rise differentiation. |
| N7 | **No drill video links** | Drill descriptions are text-only. YouTube links would help new coaches. |
| N8 | **No season-over-season comparison** | No way to compare 2025 vs. 2026 data. |
| N9 | **No standing/W-L tracking against league** | Game results exist but no league standings. |
| N10 | **Duplicate Modal components** | `Modal` and `TModal` do the same thing. Technical debt. |

---

## 6. Competitive Readiness

Compared to GameChanger, TeamSnap, and iScore:

| Area | Rating | Notes |
|---|---|---|
| **Practice coaching** | 7/10 | Drill library is excellent. Templates are thoughtful. Tracking is unique. Lacks video integration and session sharing. |
| **Game day scoring** | 6/10 | Functional offense + defense tracking. Pitch count alerts are valuable. No pitch type tracking, no spray charts, no real-time sharing with parents. GameChanger significantly ahead. |
| **Team management** | 5/10 | Roster is solid. Schedule is read-only. No availability tracking. No document management (waivers, medical forms). TeamSnap significantly ahead. |
| **Parent engagement** | 2/10 | Tryout registration only. No parent-facing views, no notifications, no schedule sharing, no stats for individual families. TeamSnap is 10/10 here. |
| **League management** | 1/10 | Single-team tool. No multi-team, no standings, no schedules, no league admin. Not competitive at all. |
| **Tryout evaluation** | 9/10 | Best-in-class for rec league level. Multi-evaluator, position-weighted scoring, snake draft, Firebase sync, registration. Better than anything in the consumer market for this specific use case. |
| **Data safety** | 2/10 | localStorage only (except tryouts). No cloud backup. No multi-device sync. No encryption. Firebase key exposed. One browser clear away from total data loss. |
| **Mobile usability** | 4/10 | Touch gestures are good. Layouts are not responsive. Load time is slow. Forms are cramped. Not optimized for sideline use during games. |

---

## 7. Architecture Recommendations (Priority Order)

1. **Break up the monolith.** Move each panel to its own file. Use a proper bundler (Vite, esbuild). This alone fixes C3 and makes all other improvements possible.

2. **Add cloud persistence.** Extend Firebase (or add Supabase/Firestore) to sync all data, not just tryouts. This fixes C2 and C7.

3. **Add authentication.** Firebase Auth or Supabase Auth. Define roles: admin, coach, assistant, parent, player. This fixes C1.

4. **Add error boundaries.** Wrap each tab in an error boundary so one tab's crash does not kill the app. This fixes C4.

5. **Make schedule editable.** Replace `SEASON_SCHEDULE` constant with a CRUD-backed schedule panel. This fixes C5.

6. **Fix the storage key mismatch.** Unify `pirates-alignment-library-2026v1` and `v2` with a migration. This fixes C6.

7. **Replace all browser dialogs.** Custom confirmation modals, toast notifications, and inline validation. This fixes I1.

8. **Add a first-run setup wizard.** Team name, colors, season, roster import. Remove Pirates-specific seed data from the default flow. This fixes C8.

---

## 8. What Works Well (Credit Where Due)

- **Drill library:** 80+ drills with detailed coaching descriptions is genuinely useful content.
- **Practice tracking:** Sprint times, pitch ratios, hit points -- this is real coaching data that most apps do not track.
- **Tryout system:** The evaluator scoring, position fit weighting, snake draft, and Firebase sync is a complete tryout management solution.
- **Scouting live tracking:** Real-time at-bat logging during games with automatic stat computation is powerful.
- **Visual design:** The gold/black Pirates theme is cohesive and professional-looking.
- **Reports depth:** Player profiles, drill leaderboards, injury analytics, goal tracking -- this is a coaching analytics dashboard, not just a score keeper.
- **Export/Import backup:** The JSON backup system is a smart interim solution for a localStorage-based app.
- **Team settings:** The configurability of team name, colors, season, and league shows forward-thinking about multi-team usage.

---

## Final Verdict

**This is an impressive single-developer coaching tool that solves real problems for the Pirates coaching staff.** The practice tracking, tryout evaluation, and scouting features are genuinely better than what most rec league coaches have access to.

**It is NOT ready to share with other coaches** due to:
1. Data trapped in localStorage (one device, one browser)
2. No authentication (anyone can see and edit everything)
3. Hardcoded Pirates data and schedule
4. Performance issues from single-file architecture
5. No error recovery (white screen crashes)

**Estimated effort to reach "shareable with other coaches" state:** 4-6 weeks of focused development, assuming the architecture recommendations above are followed in order.

**Estimated effort to reach "competitive with GameChanger/TeamSnap" state:** 3-6 months, with cloud infrastructure, mobile optimization, parent-facing features, and polished UI.

---

*Audit conducted by Claude Code (Opus 4.6) on April 9, 2026. All line numbers reference `src/App.jsx` unless otherwise noted.*
