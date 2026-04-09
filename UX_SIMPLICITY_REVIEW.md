# Pirates Softball Dashboard -- UX & Simplicity Review

**Reviewer perspective:** Youth rec league softball coach. Two hours before practice, five minutes between innings, phone in one hand, coaching with the other. Not a developer. Just wants to manage a team.

**Date:** 2026-04-08

---

## Executive Summary

This dashboard is built by a coach who clearly loves his team and loves building software. That combination produced something impressive in scope but overwhelming in practice. The app tries to be a tryout evaluation tool, a practice planner, a live game scorer, a scouting platform, a communications hub, a reporting engine, and a schedule viewer -- all inside a single 16,000-line file with 10 top-level tabs and 7 sub-tabs nested inside one of them.

A busy coach opening this for the first time will not know where to start. A coach mid-game will fumble through too many screens. The bones are good. The ambition is the problem.

**Overall verdict:** Cut the tab count in half, separate Tryouts into its own app, merge Practice/Planner/Lineup into one workflow, and add a "Today" home screen. That alone would transform this from an impressive engineering project into a tool coaches actually reach for.

---

## Tab-by-Tab Review

---

### 1. Roster

**Does it make sense?** Yes. Instantly clear. Player cards, badges for grade/returning/pitcher, skill ratings. A coach opens this and knows what it is.

**Is it overly complex?** The player form has 15+ fields including primary position, secondary positions, two parent phones, school, jersey, years of experience, star ratings for six skill areas, and notes. That is a lot to fill out for 13 kids. Most rec coaches will enter a name, a jersey number, and maybe a parent phone. Everything else is friction.

The coaching staff section below the roster is useful but rarely accessed -- it could be a settings page instead of sharing prime real estate with the roster.

**Workflow:** Adding a player is reasonable (tap Add, fill form, save). But the form opens in a modal with a 3-column grid layout that will be cramped on a phone. The skill star ratings are a nice idea but nobody is going to rate six skill areas for every player during roster setup. That data belongs in a post-tryout import or a separate evaluation workflow.

| Metric | Score |
|---|---|
| Simplicity | 6/10 |
| Usefulness | 8/10 |
| Workflow | 7/10 |
| Recommend | **Simplify** -- reduce required fields to Name, Jersey, Grade, Parent Phone. Move skills/positions to an optional "player profile" expandable section. |

---

### 2. Schedule

**Does it make sense?** Yes. Shows the full season with filtering by type and grouping by phase (Pre-Season, Week 1, Week 2, etc.). The "Next Up" card at the top is the best feature on this tab.

**Is it overly complex?** No -- actually this tab is well-scoped. Filter buttons, collapsible phases, clear event cards.

**The real problem:** The schedule is entirely hardcoded as a `SEASON_SCHEDULE` constant with 33 events baked into the source code. A coach cannot add, edit, or delete events. If a game gets rained out or rescheduled, the schedule is wrong and the coach cannot fix it. This makes the entire tab read-only decoration. For a rec league where schedules change weekly, that is a fatal flaw.

| Metric | Score |
|---|---|
| Simplicity | 8/10 |
| Usefulness | 3/10 (read-only kills it) |
| Workflow | 5/10 |
| Recommend | **Simplify** -- either make it editable (add/edit/delete events) or remove it entirely and link to Google Calendar or the league website. A static schedule that cannot be updated is worse than no schedule because it creates false confidence. |

---

### 3. Scouting

**Does it make sense?** This is a full opponent scouting portal. You create scouting reports with batting lineups, pitching assessments, defensive ratings by position, and live at-bat tracking during the opposing team's games.

**Is it overly complex?** Massively. For a rec league. This is a tool for a travel ball coach who scouts opponents before tournament play. A Lehi rec league coach is not attending other teams' games to chart their batters' tendencies with tag arrays for "Pull Hitter / Power / Speed / Contact / Bunt / Patient / Aggressive / Clutch."

The data model for a single scouting report has: opponent team management, batter profiles with strength/weakness tag arrays, pitcher profiles with speed/control/pitch type tags, defensive ratings for all 9 positions, and a full live at-bat tracking system with batting order management. That is professional-level scouting infrastructure for a 12U-14U rec league.

**Workflow:** To create a report you need to: create an opponent team, add their players, start a new report, select the team, then navigate between defense/liveTracking/insights/notes sub-sections. That is at least 10 taps before you record a single observation.

| Metric | Score |
|---|---|
| Simplicity | 2/10 |
| Usefulness | 2/10 (for rec league) |
| Workflow | 3/10 |
| Recommend | **Remove** for rec league use. If kept for travel ball, it should be a separate tool/mode, not tab 3 of 10. A rec coach needs at most a simple notes field: "Rockies pitcher throws hard but walks a lot. Their cleanup hitter pulls everything." |

---

### 4. Practice (Practice Log)

**Does it make sense?** Yes. Plan practices, run them live with drill tracking, mark them complete. The three-state workflow (plan -> active -> complete) is smart.

**Is it overly complex?** The drill library has 55+ drills with detailed descriptions, coach assignments, and equipment lists. That is genuinely useful content. But the practice planning interface requires selecting drills from a library, assigning coaches to each drill, splitting players into color-coded groups, and managing station rotations. That is a lot of overhead for "we're going to do warm-ups, then hitting stations, then grounders."

The active practice mode includes stopwatch timers, per-player tracking for trackable drills (sprint times, pitch counts, points), station rotation management, player group assignments, and a highlight/observation system. A coach running a live practice is not looking at a phone screen tracking drill data -- they are watching their players and coaching.

Practice templates (8 pre-built plans organized by Early/Mid/Late season) are excellent. But they are buried behind a "Templates" button instead of being the starting point.

**Workflow:** Creating a practice from scratch: tap "New Practice" -> fill date/time/duration/focus -> add drills one by one from the library -> assign coaches -> save. That is 5+ minutes of setup. Starting from a template is faster but the template button is not prominent.

| Metric | Score |
|---|---|
| Simplicity | 4/10 |
| Usefulness | 7/10 |
| Workflow | 5/10 |
| Recommend | **Simplify** -- templates should be the default starting point. "Pick a template, adjust if needed, go." The per-player drill tracking during active practice is overbuilt -- a coach is coaching, not data-entering. Post-practice observations are more realistic. |

---

### 5. Planner (Lineup Planner)

**Does it make sense?** This tab manages "Defensive Alignments" (who plays where) and "Game Templates" (batting order + which alignments to use). The idea is you pre-build configurations like "Lucy Pitching alignment" and "Rose Pitching alignment" then bundle them into game templates.

**Is it overly complex?** Extremely. The abstraction of separating "alignments" from "templates" that reference alignments by ID is a database design pattern, not a coaching workflow. A coach thinks: "What's my lineup for Monday's game?" They do not think: "Let me create an alignment entity, then create a template entity that references that alignment entity."

The alignment builder is a 3x3 grid of position dropdowns. The template builder asks for a name, description, batting lineup (drag to reorder), and alignment selections. This is 15+ interactions to set up one game plan.

**Workflow:** To prepare for a game: open Planner -> create alignment (9 position assignments + name) -> save -> create template (name + description + batting order + alignment selection) -> save -> click "Create Game" which shows... a TODO alert ("This will be implemented in Phase 1 Step 2!"). The feature is not even connected to the Game tab.

| Metric | Score |
|---|---|
| Simplicity | 2/10 |
| Usefulness | 4/10 |
| Workflow | 2/10 (broken -- does not connect to Game) |
| Recommend | **Merge** into Lineup tab. The concept of reusable alignments is good but the execution adds too many layers. |

---

### 6. Lineup (Lineup Builder)

**Does it make sense?** This is another lineup tool, separate from the Planner. This one creates game-specific lineups with opponent, date, location, player availability, batting order, position assignments, and per-inning alignments. It also tracks injuries, playing time warnings, and practice attendance warnings.

**Is it overly complex?** It is comprehensive and closer to what a coach actually needs than the Planner. But having TWO lineup tools is deeply confusing. The coach has to figure out: "Do I use Planner or Lineup? What's the difference?" The answer appears to be that Planner creates reusable templates and Lineup creates game-specific instances, but that distinction is not explained anywhere and is not intuitive.

The injury tracking system (mark a player injured, add notes, track if they return, flag multi-game injuries) is thoughtful and useful.

**Workflow:** Create lineup -> fill opponent/date -> toggle player availability -> set batting order -> assign positions for each inning. This is more natural than the Planner but still many taps.

| Metric | Score |
|---|---|
| Simplicity | 5/10 |
| Usefulness | 7/10 |
| Workflow | 6/10 |
| Recommend | **Merge** Planner into this. Keep one Lineup tab. Add the ability to save a lineup as a reusable template from within this flow. |

---

### 7. Game (Game Log)

**Does it make sense?** Yes. This is the live game scoring tool. It has three sub-modes: Game Setup, Live Scorer, and Coach Review.

**Is it overly complex?** The Game Setup is reasonable: date, opponent, home/away, game type, result, scores, attendance toggles, batting order with drag-to-reorder. That is what you need.

The Live Scorer is where it gets ambitious. It toggles between Defense mode (pitch count tracking with Strike/Ball buttons, quick defensive play entries for K/GO/FO/Error) and Offense mode (current batter display, pitch count with Ball/Strike/Foul/Reset buttons, at-bat result buttons for 1B/2B/3B/HR/GO/FO/HBP, stolen base picker, run scorer, RBI counter, position tracker, and a full lineup view).

**One-hand phone usability:** The offense scoring buttons (1B, 2B, 3B, HR in a 4-column grid, then GO/FO/HBP in a 3-column grid) are large enough to tap with one hand. The Ball/Strike/Foul/Reset buttons are also big. The basic flow of "tap result -> auto-advance to next batter" is solid.

However: recording a complete at-bat with full fidelity requires tapping Ball/Strike for each pitch THEN tapping the result THEN optionally recording runs/RBIs/stolen bases THEN optionally noting positions played. That is a lot of interaction for one at-bat while you are also coaching base runners and calling defensive shifts.

The defensive mode pitch counter is useful. Strike and Ball are big buttons. The pitch count warnings (green/yellow/red) are exactly what a coach needs to monitor pitch limits.

**Workflow:** The game flow (Setup -> Score -> Review) matches how a real game works. The auto-advance through the batting order is smart. The undo button is essential and present. The biggest issue is that recording full pitch counts for every at-bat during a live game is unrealistic -- most rec coaches track results only and add pitch counts for their own pitchers.

| Metric | Score |
|---|---|
| Simplicity | 5/10 |
| Usefulness | 8/10 |
| Workflow | 6/10 |
| Recommend | **Simplify** -- make pitch-by-pitch tracking optional. Default mode should be "tap the result, move on." The pitch count tracker for YOUR pitchers (defense mode) is the killer feature here -- make that more prominent. |

---

### 8. Reports

**Does it make sense?** This is a massive analytics dashboard with: team summary stats, practice timeline, drill leaderboards, player profiles with comparison tools, game analytics (W/L record, batting stats), goal tracking (team and individual goals), attendance tracking, injury analytics (by position, by inning), playing time distribution, and a full export system.

**Is it overly complex?** This is the most overbuilt section. It has 20+ state variables, collapsible sections, date range filters, player comparison modals, player profile modals with sub-tabs, drill sort options, and an export configuration panel. The Reports component alone spans roughly 4,000 lines.

**Is the data useful?** Some of it:
- Attendance tracking: YES. "Who keeps missing practice?" is a real question.
- Win/Loss record with batting stats: YES. Basic but useful.
- Pitch count tracking per pitcher: YES. Safety concern.
- Playing time distribution: YES. Parents ask about this.

Some of it is impressive but impractical:
- Drill leaderboards across practices: Built for the data but who looks at this?
- Goal tracking with progress bars: Too much overhead to maintain.
- Injury analytics by position and by inning: With 10-game seasons the sample size is meaningless.
- Player comparison tool: Comparing two 7th graders' sprint times across 3 practices is not going to change coaching decisions.
- Practice timeline with expandable drill details: When would a coach review this?

**Workflow:** Pull-to-refresh is a nice touch but the page loads with everything visible and no guidance on what matters. A coach opens this tab and sees a wall of data. There is no hierarchy of "here's what you should actually look at."

| Metric | Score |
|---|---|
| Simplicity | 2/10 |
| Usefulness | 5/10 (useful data buried under noise) |
| Workflow | 3/10 |
| Recommend | **Simplify ruthlessly.** Keep: attendance summary, season record, pitcher pitch counts, and basic batting leaders. Remove: drill leaderboards, goal tracking, injury analytics, player comparison, practice timeline, export configuration. If a coach needs a deep dive they can look at the raw game logs. |

---

### 9. Comms (Communications)

**Does it make sense?** Yes. Message templates (Season Welcome, Practice Reminder, Game Day Info, Schedule Change, Weekly Recap) with copy-to-clipboard. Quick contact lists for coaches-only and all-contacts.

**Is it overly complex?** No. This is actually one of the best-scoped tabs. Pick a template, edit it, copy it, paste into your group text. The quick contact list copy feature is practical.

**What's missing:** It does not actually send messages. It is a template editor with a copy button. For most coaches who use iMessage group chats, this workflow (copy text -> switch to Messages -> paste) is exactly right. But it could be even simpler: auto-fill template variables from the schedule (next game date, opponent, time, location) instead of requiring manual [BRACKET] replacement.

| Metric | Score |
|---|---|
| Simplicity | 8/10 |
| Usefulness | 7/10 |
| Workflow | 7/10 |
| Recommend | **Keep** -- this is close to right. Auto-fill schedule data into templates for a quick win. |

---

### 10. Tryouts

**Does it make sense?** This is a complete tryout evaluation and team draft system with 7 sub-tabs: Rubric, Players, Check-In, Score, Rankings, Draft, and Registration.

**Is it overly complex?** This is not a tab -- it is an entire application embedded inside a tab. It has its own Firebase backend (with a hardcoded API key exposed in the source), its own player database (40 players with grade, school, previous team data), its own scoring engine (7 categories with anchor descriptions and position-weighted composite scores), a check-in system, a ranking system with per-evaluator breakdowns, a full snake draft system with team rosters and position-fit boards, and a registration data viewer.

The Tryouts panel alone is 2,550 lines in the standalone file and approximately 2,500 lines as embedded in App.jsx. It is larger than many complete applications.

**The fundamental issue:** Tryouts happen once a year over 1-2 days. This tool should not live as tab 10 inside the daily-use dashboard. It should be a separate app or at minimum a separate mode that is hidden during the regular season. Having "Tryouts" visible as a tab during game week is visual clutter and confusion.

The tryout scoring workflow itself is actually well-designed: evaluators see anchored rubrics, tap scores per category, and rankings auto-calculate with position weighting. The draft system is clever for leagues that draft teams. But it belongs in a separate tool.

**Security concern:** The Firebase API key, auth domain, database URL, project ID, and app ID are hardcoded in the source. This is a real credential exposure that should be addressed regardless of UX decisions.

| Metric | Score |
|---|---|
| Simplicity | 3/10 (for its scope, it is reasonably organized) |
| Usefulness | 7/10 (during tryouts specifically) |
| Workflow | 6/10 (within the tryout context) |
| Recommend | **Remove from dashboard, make separate tool.** Tryouts are a once-a-year event. The daily dashboard should not carry this weight. Build it as a standalone page/app that coaches access during tryout week only. |

---

## Answering the Specific Questions

### 1. Tab count: Which tabs could be merged?

**Current: 10 tabs.** Should be 5-6.

| Merge | Into | Rationale |
|---|---|---|
| Practice + Planner | "Practice" | One place to plan and log practices |
| Lineup + Game | "Game Day" | One place for lineup, scoring, review |
| Scouting | Remove or move to Reports as a sub-section | Not needed for rec league |
| Tryouts | Separate app/mode | Once-a-year tool, not daily use |

**Proposed tab structure:**
1. **Today** (new -- see #8 below)
2. **Roster**
3. **Schedule** (make editable)
4. **Practice** (plan + log + templates)
5. **Game Day** (lineup + live scorer + review)
6. **Reports** (simplified)
7. **Comms**

That is 7 tabs, and "Today" could be the default home view rather than a tab, bringing it to 6.

### 2. Tryouts tab: Should it be separate?

**Yes, absolutely.** It is a standalone application with its own database, its own user model (evaluators, not coaches), and its own lifecycle (pre-season only). Embedding it as tab 10 is like putting your tax software inside your email client because you used email to send your tax documents once.

### 3. Practice vs Planner vs Lineup: Confusing?

**Yes, deeply confusing.** From a coach's perspective:
- "I need to plan practice" -- go to Practice? Or Planner? (Practice.)
- "I need to set my lineup for Monday's game" -- go to Lineup? Or Planner? (Either, but they work differently and one doesn't connect to the other.)
- "I'm at the game and need to score" -- go to Game? Or Lineup? (Game, but Lineup also has game state tracking.)

The distinction between Planner (reusable alignment templates + game templates) and Lineup (game-specific lineups with per-inning tracking) is an engineering abstraction, not a coaching concept. Merge them.

### 4. Game tab: One-hand phone usability?

**The basics work.** The at-bat result buttons (1B, 2B, 3B, HR, GO, FO, HBP) are large and tappable. The auto-advance to the next batter is smart. The undo button exists.

**What doesn't work one-handed:**
- The pitch count section (Ball/Strike/Foul/Reset) adds 4 taps per at-bat before the result -- that is too many interactions per plate appearance during a live game.
- The Defense/Offense toggle requires context switching mid-inning. Between innings you switch from watching your batters to tracking pitches for your pitcher. That cognitive load during a 90-second between-innings break is high.
- The "Who Scored?" and stolen base pickers require opening overlay panels and tapping individual players. During a live play where a runner scores, you are coaching ("GO GO GO!") not tapping a picker.
- Positions Played as toggle chips during at-bat recording is out of context. Positions should be set once in the lineup, not toggled during scoring.

**Recommendation:** Default to "results only" mode. One tap per at-bat. Pitch tracking should be opt-in. Score tracking should be dead simple: the coach's assistant tracks "who scored that inning" as a bulk entry between innings, not per-play.

### 5. Reports: Useful or impressive?

**Mostly impressive.** The useful data:
- Season record (W-L)
- Team batting average
- Individual batting lines
- Attendance (who is showing up to practice?)
- Pitcher pitch counts (safety)
- Playing time equity (so you can answer "why isn't my daughter playing shortstop?")

**The impressive-but-unused data:**
- Drill leaderboards with improvement trends
- Goal tracking with progress calculations
- Injury analytics by position and inning
- Player comparison tool
- Practice timeline with drill-by-drill logs
- Export configuration with checkboxes for what to include

A mid-season coach looks at: "Are we winning? Who's hitting? Who's not showing up? Am I pitching anyone too much?" That is four numbers, not a 4,000-line analytics dashboard.

### 6. Schedule: Hardcoded?

**The hardcoded schedule is a problem.** It serves one purpose well: showing the season at a glance on day one. After that, every rain-out, reschedule, and added event makes it wrong. A schedule that cannot be edited is a liability.

**Options:**
- Make it editable (add/edit/delete events with localStorage persistence)
- Remove it and add a link to the league's online schedule
- Keep it as read-only but add a prominent disclaimer: "Schedule may not reflect changes -- check the league site"

The first option is best. The infrastructure for localStorage persistence already exists throughout the app. Adding CRUD to the schedule is a small lift for a big usability win.

### 7. Feature bloat check

Features that were built because they could be, not because a coach needs them:

1. **Scouting portal with opponent team management, per-batter strength/weakness tags, live at-bat tracking, and pitching analysis.** This is travel ball infrastructure for a rec league. Remove.

2. **Drill leaderboards with trend analysis.** Tracking every player's sprint time across practices and calculating improvement slopes. Nobody is using this data to make decisions. Remove from Reports, keep the raw data in Practice logs.

3. **Goal tracking system.** Setting team goals with deadline dates and progress bar calculations tied to drill performance data. Coaches set goals verbally ("Let's get 21 outs in a row this week"), they don't enter them into a form with category, target value, and deadline. Remove.

4. **Injury analytics (by position, by inning, return rate percentage).** With a 10-game season, you might have 0-2 injuries. Statistical analysis of injury patterns is meaningless at this sample size. Remove the analytics, keep the ability to note an injury on a game log.

5. **Player comparison tool.** Side-by-side comparison of two players' stats. A rec league coach knows their 13 kids. They don't need a comparison dashboard. Remove.

6. **Snake draft system.** This is useful if your league actually does a live draft. But it is embedded inside the Tryouts tab inside the daily-use dashboard. If needed, spin it off. If your league pre-assigns players, this is dead weight.

7. **Defensive alignment as a separate entity from lineup.** The Planner tab's concept of creating named alignment objects that are referenced by template objects is over-engineered. A coach thinks "who plays where this game," not "let me manage my alignment entity library." Merge into a simple position assignment inside the lineup.

8. **Registration sub-tab in Tryouts.** Viewing registration data inside the evaluation tool adds clutter to an already complex panel.

9. **Pull-to-refresh with animated indicator.** Nice touch but unnecessary when there is no server -- all data is local. This is a UX pattern for apps that fetch remote data.

10. **Export/Import with full data serialization.** Useful for backup but not a daily feature. Move to a settings/gear menu.

11. **Team Settings modal with color pickers.** The note at the bottom says "Colors are saved for future theming support. Currently the app uses the default gold/black theme." So the color pickers do not do anything yet. Remove until they work.

12. **"Load Test Data" button in the header.** This is a developer tool, not a coach tool. Remove from the UI.

### 8. Missing simplicity features

Things that would make this 10x more useful:

1. **A "Today" home screen.** When a coach opens the app, show:
   - What's happening today (practice at 4:45 PM at Sports Complex)
   - What you need to do (set lineup for Monday's game, take attendance)
   - Quick actions (Start Practice, Start Game, Send Message)
   - One stat: season record
   
   This single screen would eliminate 80% of tab-hunting.

2. **Quick attendance.** A single screen with all player names and checkboxes. Tap-tap-tap-done. Usable in 15 seconds while players are warming up. Currently attendance is buried inside the practice planning flow or the game setup flow.

3. **Auto-populated message templates.** The Comms templates use [BRACKET] placeholders. The app knows the next game date, time, opponent, and location from the schedule. Fill them in automatically.

4. **"Copy lineup to clipboard" as formatted text.** For pasting into a group chat. The Print Lineup Card feature exists but coaches text more than they print.

5. **Simple post-game summary.** After a game, one screen: W/L, score, batting highlights (who got hits), pitching summary (who pitched, how many pitches), one text box for "what went well / what to work on." Auto-generate a parent-friendly recap for the group text.

6. **Offline-first with conflict-free sync.** The app uses localStorage which is phone-local. If the coach's phone dies mid-game, the data is gone. Even simple backup to iCloud or a shared Google Sheet would be valuable.

7. **Fewer taps for common actions.** The most frequent action during a game is recording an at-bat result. That should be: see current batter -> tap result -> done. Currently it can be: see batter -> track pitch count -> tap result -> record who scored -> record RBI -> note positions -> next batter. Make the happy path one tap.

8. **Practice plan sharing.** If there are three coaches, all three need to see the practice plan. Currently the data is in one phone's localStorage. Even a "text the practice plan" button would help.

---

## Summary Scorecard

| Tab | Simplicity | Usefulness | Workflow | Verdict |
|---|---|---|---|---|
| Roster | 6/10 | 8/10 | 7/10 | Simplify |
| Schedule | 8/10 | 3/10 | 5/10 | Rebuild (make editable) |
| Scouting | 2/10 | 2/10 | 3/10 | Remove |
| Practice | 4/10 | 7/10 | 5/10 | Simplify |
| Planner | 2/10 | 4/10 | 2/10 | Merge into Lineup |
| Lineup | 5/10 | 7/10 | 6/10 | Keep + absorb Planner |
| Game | 5/10 | 8/10 | 6/10 | Simplify |
| Reports | 2/10 | 5/10 | 3/10 | Simplify ruthlessly |
| Comms | 8/10 | 7/10 | 7/10 | Keep |
| Tryouts | 3/10 | 7/10 | 6/10 | Separate app |

**Overall app scores:**
- Simplicity: 4/10
- Usefulness: 6/10
- Workflow: 5/10

---

## The One-Line Summary

This app tries to be everything for a softball coach and ends up being too much of everything. Cut it in half and it becomes twice as useful.

---

## Priority Action Items

1. **Add a "Today" home screen** -- biggest single UX improvement possible.
2. **Merge Planner + Lineup into one "Lineup" tab.**
3. **Merge Practice Log into a unified "Practice" tab with templates as the default entry point.**
4. **Remove Scouting** (or hide it behind a "pro mode" toggle).
5. **Extract Tryouts into a standalone tool** that is only accessible during tryout season.
6. **Make Schedule editable.**
7. **Simplify Reports** to attendance + record + batting leaders + pitch counts.
8. **Add one-tap game scoring mode** as the default (pitch tracking opt-in).
9. **Auto-fill Comms templates** from schedule data.
10. **Remove the Firebase API key from source code** (security issue, not UX, but urgent).
