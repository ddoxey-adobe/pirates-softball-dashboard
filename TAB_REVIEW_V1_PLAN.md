# Pirates Softball Dashboard -- Tab-by-Tab Review & Improvement Plan

**Reviewed:** 2026-04-08
**File:** `/home/agent-infrastructure/repos/pirates-softball-dashboard/src/App.jsx` (15,543 lines)
**Architecture:** Single-file React app, localStorage/Capacitor storage, Firebase for Tryouts sync

---

## 1. ROSTER (line 943 -- RosterPanel)

### Current Features
- Player cards with jersey, name, nickname, grade, school, positions, skills (star ratings)
- Filter by All / Returning / New
- Add/edit/delete players via modal form (primary position, secondary positions, parent contacts, notes)
- Coaching staff section with roles and specialties
- Average skill rating shown on each card

### What's Missing
- No search/filter by name -- with 13+ players, scrolling is the only option
- No sort options (by name, grade, position, skill rating)
- No bulk actions (mark multiple as inactive, export subset)
- No photo/avatar upload for players
- No jersey number conflict detection (two players could get same number)
- Parent email field exists in data but is never used in the form
- No indication of injury status from Game tab data

### Improvements (Priority: HIGH)
1. Add a search bar at the top of the player list (filter by name as you type)
2. Add sort dropdown: Name, Grade, Skill Avg, Position, Jersey #
3. Show batting average from GameLog data on each roster card (pull from GAMELOGS store)
4. Add parent email field to the edit modal (it exists in data model but is hidden)
5. Show injury badge on players with active multi-game injuries from Lineup game state
6. Add "Copy parent contacts" button per player (phone + email to clipboard)
7. Detect duplicate jersey numbers and show a warning badge

---

## 2. SCHEDULE (line 13311 -- SchedulePanel)

### Current Features
- Hardcoded SEASON_SCHEDULE constant with games, practices, scrimmages, tournaments
- "Next Up" hero card with date, time, location, home/away
- Summary stats: Games count, Practices count, Completed, Remaining
- Filter by event type (games, practices, scrimmages, tournaments)
- Collapsible phase sections (early season, mid season, etc.)
- Past events shown at 50% opacity, today highlighted with gold border

### What's Missing
- Schedule is entirely hardcoded -- no add/edit/delete events
- No integration with Practice or Game tabs (can't link to a practice plan)
- No calendar view -- only a list
- No "Add to phone calendar" or iCal export
- No game results shown on past games (W/L/score)
- No weather info or field conditions
- No RSVP / availability tracking per event

### Improvements (Priority: HIGH)
1. Make schedule editable -- add/edit/delete events stored in localStorage
2. Add "Create Practice Plan" button on practice events that links to Practice tab
3. Show game results (W/L, score) on past game events by pulling from GAMELOGS
4. Add a mini calendar view (month grid) as an alternative to the list
5. Add "Copy event to clipboard" button (date, time, location formatted for texting)
6. Add countdown badge showing "in 3 days" or "tomorrow" on upcoming events

---

## 3. SCOUTING (line 6037 -- Scouting)

### Current Features
- Opponent team management (create teams with rosters of players by jersey/name/position)
- Scouting reports with home/away team selection
- Batting scouting: per-batter notes, strength tags (Pull Hitter, Power, Speed, etc.), weakness tags (Inside, Outside, etc.)
- Pitching scouting: speed tags, control tags, pitch types
- Defensive ratings by position (1-5 scale)
- Live tracking mode: real-time at-bat results (1B, 2B, K, GO, etc.), pitch tracking (strike/ball/hit), baserunning (SB/CS)
- Batting order tracking with lineup confirmation
- Insights tab: calculated BA, OBP, SLG per player, pitching strike %, stolen base %
- Clone report feature, quick-add batters by jersey numbers
- Stats sidebar (collapsible)

### What's Missing
- No way to compare scouting reports across multiple games against the same team
- No "tendencies" summary (e.g., "#12 is 0-for-6 on outside pitches across 3 games")
- No game prep sheet generator (combine scouting data into a printable summary)
- No photo attachment for field conditions or opponent pitchers
- No pitch sequence tracking (just aggregate strike/ball counts)

### Improvements (Priority: MEDIUM)
1. Add "Team Summary" view that aggregates all reports for one opponent team
2. Add a pre-game prep sheet export: opponent lineup, pitcher tendencies, key hitters, defensive weaknesses
3. Track pitch sequences (pitch 1: ball, pitch 2: strike, etc.) not just totals
4. Add a "key matchups" section linking our batters to their pitchers based on strengths/weaknesses
5. Add opponent record/standings field to team profiles

---

## 4. PRACTICE (line 1148 -- PracticeLog)

### Current Features
- Full practice lifecycle: Plan -> Active -> Completed
- 50+ drill library organized by category (Warm-Up, Throwing, Fielding, Hitting, Baserunning, Pitching, Game Play, Conditioning, Mental)
- Practice templates for early/mid/late season with phase-based drill organization
- Station rotation support with group assignments (Red/Blue/Gold teams)
- Trackable drills: home-to-first time, strikes/balls, pitch count, consecutive outs, points, level
- Per-player data collection during active practice
- Stopwatch timer for timed drills
- Highlight/observation notes taggable to specific drills and players
- Attendance tracking per practice
- Coach assignment per drill
- Duration tracking with total time calculation

### What's Missing
- No way to see practice-over-practice trends for a specific drill (that's in Reports)
- No "duplicate last practice" button for recurring weekly formats
- No weather/field condition logging
- No drill effectiveness rating (coach rates how well a drill went)
- No quick "reschedule" from planned to a new date

### Improvements (Priority: MEDIUM)
1. Add "Duplicate Practice" button on completed practices to quickly plan a similar session
2. Add drill effectiveness rating (1-5 thumbs) during completion to track which drills work best
3. Add weather/field condition dropdown (sunny, cloudy, rain, wet field, dry field)
4. Show player attendance streak on the attendance checklist ("3 in a row" badge)
5. Add a "Quick Practice" button that auto-generates a plan from a template based on days until next game

---

## 5. PLANNER (line 3066 -- LineupPlanner)

### Current Features
- Defensive alignment library: create named position configurations (e.g., "Lucy Pitching", "Rose Pitching")
- Visual 3x3 grid for assigning players to 9 positions
- Lineup templates: separate batting order from defensive alignments
- Multiple alignments can be attached to one template
- Primary alignment designation
- Player position preferences shown when assigning

### What's Missing
- No integration with the Lineup tab (templates created here don't auto-populate there)
- The "Create Game" button shows a TODO alert instead of working
- No drag-and-drop for batting order
- No position coverage analysis (shows who CAN play each position based on roster data)
- No "auto-suggest" lineup based on player skills and positions
- No comparison view between two alignments side by side

### Improvements (Priority: HIGH)
1. Fix the onCreateGame callback -- actually create a Lineup entry from a Planner template
2. Add position coverage matrix: show all players who can play each position with skill ratings
3. Add "auto-fill" that suggests an alignment based on players' primary/secondary positions
4. Add drag-and-drop reordering for batting lineup
5. Merge Planner and Lineup into one unified tab (they serve overlapping purposes)

---

## 6. LINEUP (line 3588 -- LineupBuilder)

### Current Features
- Game-specific lineups with opponent, date, location
- Player availability checklist
- Batting order with position assignment
- Multiple defensive alignments per game
- Lineup finalization workflow (draft -> finalized -> start game)
- **Active game mode** with full inning-by-inning tracking:
  - Position assignments per inning
  - Playing time tracking (innings played per player)
  - Bench time monitoring
  - Substitution history
  - Injury tracking during games (single-game vs multi-game injuries, return tracking)
  - Visual field position display
  - "Needs playing time" warnings based on practice attendance and game history
- Substitution modal with bench player selection
- Game completion with playing time summary
- Low attendance and low playing time warnings pulled from practice/game data

### What's Missing
- No connection to Planner templates (can't import an alignment)
- No batting order suggestions based on hitting stats
- No "fair play" checker to ensure all players get minimum innings
- No pitch count tracking for pitchers (separate from GameLog's tracking)
- No print/share lineup card
- Alignment library is loaded from a different storage key than Planner (v1 vs v2 mismatch)

### Improvements (Priority: HIGH)
1. Add "Import from Planner" button that loads alignment templates
2. Fix storage key mismatch: LineupBuilder loads `alignment-library-2026v1` but Planner saves to `v2`
3. Add a printable/shareable lineup card (opponent, date, batting order, positions)
4. Add minimum innings rule checker (configurable: e.g., "every player must play 3 of 7 innings")
5. Show batting stats next to each player name when building the order (AVG, OBP from game data)

---

## 7. GAME (line 5238 -- GameLog)

### Current Features
- Full at-bat tracking with ball/strike/foul count
- Result codes: 1B, 2B, 3B, HR, K, GO, FO, BB, HBP, SAC, FC, E, DP
- Batting order management with reordering
- Inning tracking with automatic advancement on 3 outs
- Undo last at-bat with count restoration
- Runs, RBIs, stolen bases counters per player
- Per-player observations/notes during game
- Defensive stats tracking (putouts, assists, errors)
- Pitcher tracking: pitch count, strikes, balls, mid-inning pitcher changes
- Inning-by-inning pitcher history
- Attendance tracking
- Game types: league, tournament, scrimmage
- Home/away designation
- Box score view with hit/AB line per player
- Coach notes field

### What's Missing
- No run-scoring interface (tracking when runners score on hits/errors)
- No inning-by-inning score display (linescore)
- No pitch type tracking (just count)
- No defensive play-by-play (only aggregate putouts/assists/errors)
- No post-game summary generation
- No connection to Lineup tab (these are two separate game tracking systems)

### Improvements (Priority: HIGH)
1. Add a linescore display showing runs per inning for both teams
2. Add a post-game summary generator (box score, key plays, stats to copy/paste for parents)
3. Unify Game and Lineup game tracking -- currently two separate systems track games independently
4. Add "game situation" display: runners on base, outs, inning (visual diamond)
5. Add pitch type selection (fastball, changeup, drop, rise) per pitch for our pitchers

---

## 8. REPORTS (line 9240 -- Reports)

### Current Features
- Date range filtering (All, 30, 60, 90 days)
- Practice timeline view with expandable practice details
- Attendance analytics: average attendance, per-player attendance rates, "at-risk" filter
- Drill leaderboards: best/avg values, improvement trends, attempt counts per tracked drill
- Team trends with LineChart and BarChart visualizations (custom SVG)
- Player comparison modal (select 2+ players, compare across drills)
- Full player profiles with tabs: Overview, Practice History, Game History, Goals
- Game analytics: W/L record, win %, runs scored/allowed
- Player batting stats: AVG, SLG, RBI, HR, doubles, triples
- Player pitching stats: innings, ERA, K, BB
- Goal tracking: team and individual goals with progress bars and deadline tracking
- Injury analytics: total, per game, by position, by inning, body part keywords, player history
- Playing time analysis
- Collapsible sections with collapse/expand all
- Export report config (select which sections to include)
- Pull-to-refresh support

### What's Missing
- Export report actually just toggles config checkboxes -- no actual export/download
- No PDF or printable report generation
- No trend arrows on player batting averages (improving vs declining)
- No game-by-game batting log for individual players (only aggregates)
- No season-long graph of team batting average or runs per game
- No comparison to league averages or opponent stats

### Improvements (Priority: MEDIUM)
1. Implement actual report export: generate a formatted text/HTML report and copy to clipboard or download
2. Add game-by-game batting log in player profiles (show each game's AB results)
3. Add trend indicators on batting stats: arrow up/down based on last 3 games vs season avg
4. Add a "Season Timeline" chart showing team runs scored per game over time
5. Add drill-specific progress charts per player (already have LineChart component, just need to wire it)

---

## 9. COMMS (line 5898 -- Comms)

### Current Features
- 5 message templates: Season Welcome, Practice Reminder, Game Day Info, Schedule Change, Weekly Recap
- Template editor with placeholder text (editable before sending)
- Copy-to-clipboard for message body
- Quick contact lists: Coaches Only (phone numbers), All Contacts (coaches + parents)
- Copy contact lists to clipboard
- Sent message log (last 5 messages with template name and date)
- Per-player contact display (player name, parent name, phones)

### What's Missing
- No actual SMS/email integration (copy-paste only)
- No auto-fill of template variables (need to manually replace [DAY], [TIME], [LOCATION])
- No per-player messaging (e.g., message just one family)
- No attendance-based templates ("Your daughter missed practice on...")
- No game recap auto-generation from game data
- No email addresses shown (only phone numbers)
- Only 5 static templates, no way to create custom templates

### Improvements (Priority: MEDIUM)
1. Auto-fill template variables from Schedule data: next practice date/time/location, next game opponent
2. Add "Game Recap" template that auto-populates from GameLog: score, key stats, next event
3. Add custom template creation (save your own templates)
4. Add per-player/family message mode with pre-filled name
5. Show parent email addresses in the contact list (data exists but is never displayed)
6. Add "Select recipients" checklist to filter which families receive the message

---

## 10. TRYOUTS (line 13416 -- TryoutsPanel)

### Current Features
- Firebase real-time sync for multi-evaluator scoring
- 5 sub-tabs: Rubric, Players, Score, Rankings, Draft
- Rubric: 7 scoring categories with detailed anchors (hitting, glove work, throwing, hustle, attitude, coachability, pitching)
- Station descriptions with scoring info
- Tier scale (80-100% High, 65-79% Solid, etc.)
- Player management: 40 default players, add single/bulk CSV import
- Evaluator selection (Doxey, Ken, Shari) with per-evaluator scores
- Score entry: select player by number, rate each category with anchor-guided sliders
- Rankings: sortable table with all players, overall %, per-category scores, tier labels
- Draft board: position-weighted rankings for Pitcher, Catcher, SS, 3B, 1B, 2B, OF, Utility
- Position urgency indicators (Critical for Catcher, High for Pitcher/SS/OF)
- Position-specific weight matrices (e.g., Pitcher weights pitching 4x, coachability 3x)
- Local storage backup with Firebase sync
- Toast notifications for sync status

### What's Missing
- No "notes" field per player in scoring (only category scores)
- No side-by-side comparison of two tryout players
- No printable evaluation sheets for offline scoring
- No "watch list" or flag system for borderline players
- No integration with Roster tab (selected players don't auto-import)
- No historical tryout data (only current year)
- Protected player indicators exist in data but aren't prominently displayed

### Improvements (Priority: LOW -- tryouts are seasonal, likely already completed)
1. Add a free-text notes field to the scoring interface per player
2. Add "Add to Roster" button on drafted players that creates a roster entry with tryout data
3. Add a "compare two players" modal in Rankings (side-by-side categories + radar chart)
4. Show protected player status prominently in Rankings and Draft tabs
5. Add printable evaluation form export for clipboard scoring at the field

---

## CROSS-CUTTING ISSUES

### Data Silos (Priority: CRITICAL)
- **Planner and Lineup use different storage keys** for alignment libraries (v1 vs v2) -- they never share data
- **Game tab and Lineup tab both track games independently** -- stats don't cross-reference
- **Schedule is hardcoded** while Practice and Game create their own event records
- **Tryouts results don't flow into Roster** -- drafted players must be manually re-entered

### Performance
- Single 15,543-line file -- should be split into per-tab component files
- All data loaded at mount regardless of which tab is active
- No lazy loading of tabs or data

### Mobile UX
- Swipe navigation exists but some modals are hard to use on small screens
- Tables in Reports and Rankings don't scroll horizontally
- Some buttons are small touch targets (< 44px)

### Missing Global Features
1. **Data backup/restore** partially exists (Export/Import buttons in header) but needs error handling
2. **No undo for deletions** -- deleting a player or game is immediate and permanent
3. **No dark/light theme toggle** -- hardcoded dark theme
4. **No offline indicator** -- Firebase sync in Tryouts has status, but other tabs don't indicate storage state
5. **No onboarding or help** -- complex features like active game tracking have no tooltips

---

## PRIORITY SUMMARY

| Priority | Tab | Top Action |
|----------|-----|------------|
| CRITICAL | Cross-cutting | Fix Planner/Lineup storage key mismatch (v1 vs v2) |
| CRITICAL | Cross-cutting | Unify Game and Lineup game-tracking into one system |
| HIGH | Schedule | Make schedule editable (not hardcoded) |
| HIGH | Roster | Add search bar and sort options |
| HIGH | Planner | Fix onCreateGame TODO (currently just shows alert) |
| HIGH | Lineup | Import alignments from Planner |
| HIGH | Game | Add linescore and post-game summary |
| MEDIUM | Reports | Implement actual report export (not just config toggles) |
| MEDIUM | Comms | Auto-fill template variables from Schedule/Game data |
| MEDIUM | Practice | Add duplicate practice and drill effectiveness rating |
| MEDIUM | Scouting | Add cross-game opponent summaries |
| LOW | Tryouts | Add "Add to Roster" flow from draft results |
