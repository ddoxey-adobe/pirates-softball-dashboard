# Persona Needs Map — Pirates Softball Dashboard

**Analysis Date:** 2026-04-08
**Tool Analyzed:** Pirates Softball Dashboard (single-page React app, localStorage + Firebase sync)
**League:** Lehi Rec Softball, 12U-14U Girls

---

## Current Feature Inventory

| Tab | What It Does |
|-----|-------------|
| **Roster** | Player profiles (name, grade, school, jersey, positions, skills 1-5, parent contacts). Coaching staff profiles (role, specialties, phone, email). Filter by returning/new. |
| **Schedule** | Hardcoded season schedule (33 events). Filters by type (game/practice/scrimmage/tournament). Shows "Next Up" card, phase grouping, past/upcoming counts. Read-only. |
| **Scouting** | Opponent team management (rosters, players). Scouting reports with batting notes, pitching analysis, defensive ratings, live at-bat tracking. Insights engine. Export reports. Bulk import league data (8 teams, 104 players). |
| **Practice** | Plan/Active/Complete lifecycle. 60+ drill library across 9 categories. Practice templates (early/mid/late season, assessment). Station rotations, group assignments, attendance tracking, stopwatch, drill metrics tracking, highlight notes, coach observations per player. |
| **Planner** | Defensive alignment library (who plays where). Batting order templates. Reusable lineup configurations. |
| **Lineup** | Per-game lineup builder. Live game mode with inning-by-inning position tracking, playing time tracker with fairness warnings, bench player management, injury tracking (in-game and multi-game), substitution system. |
| **Game** | Live at-bat scoring with ball/strike/foul count tracking. AB results (1B-HR, K, GO, FO, BB, etc.). Batting order management. Stolen bases, runs, RBIs per player. Defensive stats (putouts, assists, errors). Pitch count tracking per pitcher per inning. |
| **Reports** | Season analytics dashboard. Sections: Practice Timeline, Team Trends, Batting Leaderboards, Pitching Stats, Goals (team + individual), Drill Usage & Leaderboards, Attendance Tracker (at-risk alerts), Injury Analytics, Playing Time Equity, Game Log with W/L record. Player Profile modal (overview, practice history, game log, goals). Player comparison tool. Exportable season report (HTML). CSV export for drill leaderboards. |
| **Comms** | Message templates (Season Welcome, Practice Reminder, Game Day, Schedule Change, Weekly Recap). Editable body, copy-to-clipboard. Quick contact lists (coaches only / all contacts with parent phones). Sent message log. |
| **Tryouts** | 7 sub-tabs: Rubric (scoring anchors, station guide, tier scale, position weights, needs matrix), Players (manage tryout pool, CSV import), Check-In (attendance at tryouts), Score (per-evaluator scoring across 7 categories), Rankings (sortable, filterable, expandable player cards with position-fit analysis), Draft (snake draft across multiple teams with team balance tracking, roster import to main dashboard), Registration (parent-facing signup form, shareable URL). Firebase real-time sync for multi-device scoring. |
| **Team Settings** | Modal to edit team name, mascot, season, league, age group, colors. |
| **Data Backup** | Full export/import of all localStorage data as JSON. |

---

## League Director

*Manages the whole league: multiple teams, tryouts, draft, schedule, standings.*

| # | Need | Solved? | How / Gap |
|---|------|:-------:|-----------|
| 1 | Create and manage multiple teams in the league | Partially | Tryouts > Draft tab lets you define team names and run a snake draft. Scouting tab stores opponent team rosters. But there is no unified league management view -- each team would need its own dashboard instance. |
| 2 | Run tryout evaluations for player pool | Yes | Tryouts tab -- 7-category rubric scoring, multi-evaluator support (Firebase real-time sync), anchored scales, 40-player pre-loaded pool. |
| 3 | Score and rank all tryout players | Yes | Tryouts > Rankings sub-tab -- sortable by total score, per-category averages across evaluators, tier labels (High/Solid/Dev/Support/Emerging), position-fit analysis with weighted scoring. |
| 4 | Handle tryout registration | Yes | Tryouts > Registration sub-tab -- parent-facing form (player name, grade, school, experience, parent contact, position preferences). Shareable URL via #register hash. Registration mode hides other tabs. |
| 5 | Check in players at tryouts | Yes | Tryouts > Check-In sub-tab -- mark attendance per player at tryout sessions. |
| 6 | Conduct a fair draft to form teams | Yes | Tryouts > Draft sub-tab -- snake draft with configurable team names, available player board sorted by score, team roster view with average scores for balance, position-fit reference board, undo/reset. |
| 7 | Transfer drafted players to team rosters | Yes | Tryouts > Draft has a "Roster Import" modal to push selected drafted players into the main Roster tab. |
| 8 | Build and publish the league schedule | Partially | Schedule tab displays a full season schedule, but it is hardcoded in source code. No UI to create, edit, or publish schedules. |
| 9 | Track league standings (all teams W/L) | No | Reports tab tracks one team's W/L record. No cross-league standings view. Would need a league-wide standings table pulling results from all teams. |
| 10 | Ensure equal playing time compliance | Partially | Lineup tab tracks per-player innings played per game with fairness warnings. Reports tab has a Playing Time section. But this is per-team only, not league-wide enforcement. |
| 11 | Handle schedule conflicts and rain-outs | No | Schedule is read-only. No reschedule, cancellation, or conflict detection. Would need editable schedule with notifications. |
| 12 | Communicate with all coaches across teams | No | Comms tab only targets one team's parents/coaches. No league-wide broadcast system. Would need multi-team contact groups and announcement system. |
| 13 | Set and enforce league rules (pitch counts, innings limits) | No | Game tab tracks pitch counts but has no configurable limits or alerts. Would need rule engine with configurable limits and automatic enforcement warnings. |
| 14 | Manage umpire assignments | No | Not addressed. Would need umpire roster and game assignment system. |
| 15 | Manage field/facility scheduling | No | Schedule has locations but no facility management. Would need shared facility calendar. |
| 16 | Run end-of-season tournaments | Partially | Schedule includes tournament dates. No bracket management, seeding, or results tracking specific to tournament format. |
| 17 | View aggregate league statistics | No | Reports tab is single-team only. Would need league-wide stat aggregation across all teams. |
| 18 | Handle parent complaints and disputes | No | No ticketing or dispute tracking system. Would need a communication/issue-tracking module. |
| 19 | Manage volunteer coordination | No | Not addressed. Would need volunteer signup and assignment system. |
| 20 | Archive season data for future reference | Partially | Data Backup feature exports all localStorage as JSON. But no structured season archive or historical comparison. |

**Coverage: 6 fully solved, 4 partially solved, 10 gaps = ~30% coverage (counting partial as half) = 40%**

---

## Head Coach

*Runs one team: practices, games, roster, communication, strategy.*

| # | Need | Solved? | How / Gap |
|---|------|:-------:|-----------|
| 1 | Manage team roster with player details | Yes | Roster tab -- full player profiles: name, nickname, grade, school, jersey, years experience, positions (primary + secondary), 6-skill star ratings, returning status, pitcher flag, parent contacts, notes. |
| 2 | Manage coaching staff | Yes | Roster tab -- coach profiles with name, role (Head/Assistant/Pitching/Hitting/Base), phone, email, specialties. |
| 3 | View and know the season schedule | Yes | Schedule tab -- full season (33 events) with date, time, location, opponent, home/away, type filtering, phase grouping, "Next Up" highlight, past/remaining counts. |
| 4 | Plan practices with drill selection | Yes | Practice tab -- create practice plans with drill selection from 60+ drill library, duration, focus area, notes. Templates for early/mid/late season and assessment practices. Station rotation setup. |
| 5 | Run practices with live tracking | Yes | Practice tab -- "Active" mode with attendance, stopwatch, drill-by-drill tracking (times, strikes/balls, points), player observation notes, highlight quick-notes, group assignments (Red/Blue/Gold). |
| 6 | Access a drill library with descriptions | Yes | Practice tab -- 60+ drills across 9 categories (Warm-Up, Throwing, Fielding, Hitting, Baserunning, Pitching, Game Play, Conditioning, Mental). Each drill has duration, coach assignment, detailed description, equipment list. |
| 7 | Build game lineups (batting order + positions) | Yes | Planner tab -- defensive alignment library and batting order templates. Lineup tab -- per-game lineup builder with drag-and-drop batting order and position assignment. |
| 8 | Track playing time fairness during games | Yes | Lineup tab -- live game mode tracks innings played per player, highlights players who need playing time (< 50% of innings), bench player list with warning badges. |
| 9 | Score games live (at-bats, runs, defense) | Yes | Game tab -- live scoring with ball/strike/foul count, AB results (1B through HR, K, GO, FO, BB, HBP, FC, SAC, E), RBIs, runs, stolen bases. Defensive stats (putouts, assists, errors). Pitch count per pitcher. |
| 10 | Scout upcoming opponents | Yes | Scouting tab -- opponent team rosters, scouting reports with per-batter strengths/weaknesses tags, pitcher analysis (speed, control, pitch types), defensive ratings by position, live at-bat tracking, insights engine. Bulk import of all 8 league teams. |
| 11 | Analyze team and player performance | Yes | Reports tab -- batting leaderboards (AVG, SLG, HR, RBI), pitching stats (ERA, K, BB), practice attendance with at-risk alerts, drill leaderboards with trend arrows, player profiles with full history, team comparison tool, W/L record. |
| 12 | Set and track goals | Yes | Reports tab -- team goals and individual player goals with categories, targets, deadlines, and auto-calculated progress for some metrics (attendance, sprint times). |
| 13 | Communicate with parents | Yes | Comms tab -- 5 message templates (Welcome, Practice Reminder, Game Day, Schedule Change, Weekly Recap). Edit and copy to clipboard. Quick contact list extraction. Sent message log. |
| 14 | Track injuries | Yes | Lineup tab -- in-game injury tracking with notes, single-game vs multi-game flag, return tracking. Reports tab -- injury analytics (by position, by inning, by player, common types). |
| 15 | Handle player availability/absences | Partially | Practice tab tracks attendance per practice. Lineup tab has per-game availability toggles. But no advance RSVP system or absence notification from parents. |
| 16 | Develop individual player improvement plans | Partially | Reports > Player Profile shows practice history, game stats, goals, and drill performance trends. But no structured development plan or workout assignment feature. |
| 17 | Manage team equipment/inventory | No | Drill descriptions mention equipment needed but no inventory tracking. Would need equipment checklist and tracking. |
| 18 | Edit the schedule when things change | No | Schedule is hardcoded. No ability to add, edit, or cancel events from the UI. Would need CRUD operations on schedule events. |
| 19 | Share schedule/info with parents electronically | Partially | Comms tab lets you compose and copy messages. But no direct send (SMS/email), no calendar sync (iCal), no parent-facing portal. |
| 20 | Export data and reports | Yes | Reports tab exports full season report as HTML. Drill leaderboards export as CSV. Data Backup exports all data as JSON. Scouting reports export to new window. |
| 21 | Customize team branding | Yes | Team Settings modal -- team name, mascot emoji, season year, age group, league name, primary/secondary/accent colors. |
| 22 | Handle game-day substitutions | Yes | Lineup tab -- live game substitution system, sub modal for swapping field players with bench, automatic playing time updates on sub. |
| 23 | Track pitcher workload across season | Partially | Game tab tracks pitch count per game. Reports shows pitching stats. But no cumulative pitch count tracker with rest-day recommendations across the season. |
| 24 | Plan for tournaments | Partially | Schedule shows tournament dates. No tournament-specific planning (multiple games per day, pitcher rotation across games, bracket tracking). |
| 25 | Back up and restore all data | Yes | Data Backup -- full JSON export/import of all localStorage data with metadata. |

**Coverage: 17 fully solved, 5 partially solved, 3 gaps = ~78% coverage**

---

## Assistant Coach

*Helps the head coach: scoring, fielding drills, game support.*

| # | Need | Solved? | How / Gap |
|---|------|:-------:|-----------|
| 1 | Know what drills to run at practice | Yes | Practice tab -- when head coach creates a plan, all drills with descriptions are visible. Drill library has coach assignments. 60+ drills with detailed step-by-step instructions. |
| 2 | Track player performance during drills | Yes | Practice tab (Active mode) -- drill tracking for times, points, strikes/balls per player. Observation notes per player. Highlights system. |
| 3 | Score games in real time | Yes | Game tab -- full live scoring (at-bats, count tracking, defensive stats). Can run independently while head coach manages the dugout. |
| 4 | Know the lineup and positions each inning | Yes | Lineup tab -- shows current inning positions, batting order, bench players. Active game view visible on any device sharing the same localStorage. |
| 5 | Record defensive plays and errors | Yes | Game tab -- defensive stats tracking (putouts, assists, errors per player). |
| 6 | Help scout opponents | Yes | Scouting tab -- can create/edit scouting reports, track live at-bats during opponent games, note batting/pitching tendencies. |
| 7 | Access practice plans ahead of time | Yes | Practice tab -- planned practices are visible with all drill details, station assignments, and notes. |
| 8 | Track attendance at practices | Yes | Practice tab -- attendance checkbox per player per practice session. |
| 9 | Know player strengths and development areas | Yes | Roster tab shows skill ratings. Reports > Player Profile shows comprehensive history. Drill leaderboards show relative performance. |
| 10 | Communicate with head coach | Partially | Comms tab has coach contact list. But no in-app messaging or chat between coaches. Would need internal coaching staff communication channel. |
| 11 | Run tryout evaluations independently | Yes | Tryouts tab -- multi-evaluator scoring with Firebase real-time sync. Each evaluator selects their name and scores independently, averages are computed automatically. |
| 12 | Access the tool on a phone at the field | Partially | The app is a web app and works on mobile browsers. But it is not a PWA (no offline support, no install prompt). Scoring during games on a phone works but the UI is desktop-optimized. |
| 13 | Share observations with head coach | Partially | Practice tab allows per-player observation notes and highlights. But no notification system -- head coach must open the same practice log to see them. |
| 14 | Know the schedule and location | Yes | Schedule tab shows all events with dates, times, locations. |
| 15 | Understand their specific coaching role | Partially | Roster > Coaching Staff shows role and specialties. Drill library assigns drills to specific coaches. But no formal responsibility matrix or duty assignment per game/practice. |

**Coverage: 10 fully solved, 4 partially solved, 1 gap = ~80% coverage**

---

## Parent

*Wants to know schedule, their kid's playing time and stats, team communication.*

| # | Need | Solved? | How / Gap |
|---|------|:-------:|-----------|
| 1 | Know the season schedule (dates, times, locations) | No | Schedule tab exists but the entire dashboard is a coach-facing tool. No parent-facing view, no login, no shared link. Parents cannot access the schedule without full dashboard access. |
| 2 | Get notified of schedule changes | No | Comms tab helps coaches compose messages, but there is no direct notification system (no email, SMS, push). Coaches must manually copy text to an external messaging app. |
| 3 | See their child's playing time | No | Lineup tab tracks playing time, but there is no parent-facing view. Coach would have to manually share this information. |
| 4 | See their child's stats (batting avg, etc.) | No | Reports tab has full batting/pitching stats and player profiles, but these are coach-only views. No parent portal or shareable player card. |
| 5 | Know what to bring to practice/games | Partially | Comms > Practice Reminder and Game Day templates include "Bring" instructions, but only if the coach uses the template and sends it via external messaging. |
| 6 | RSVP for attendance (practice/game) | No | No RSVP system. Coaches track attendance manually. Would need parent-facing availability/RSVP feature. |
| 7 | Contact the coach | Partially | Coach phone/email is stored in the Roster tab, but parents would need to receive this info through an external channel. No in-app parent-to-coach messaging. |
| 8 | Register for tryouts | Yes | Tryouts > Registration sub-tab with shareable URL (#register). Parent-facing form collects player name, grade, school, experience, parent contact, position preferences, notes. Registration mode hides all other coach tabs. |
| 9 | Know team roster and contact other parents | No | Roster tab has all parent contacts, but this is coach-only. No parent-facing team directory. Would need shared directory with privacy controls. |
| 10 | See game results | No | Game tab logs results, but parent-accessible. Would need a parent-facing game recap or notification. |
| 11 | Understand the coaching philosophy and expectations | Partially | Comms > Season Welcome template includes philosophy blurb, but it is manually sent. No persistent "About the Team" page for parents. |
| 12 | Report their child's injury or absence | No | No parent-facing injury/absence report. Coaches track injuries during games only. Would need parent submission form. |
| 13 | See practice plans (what will be worked on) | No | Practice plans are coach-only. Some info could flow through Comms templates but is not automated. |
| 14 | Access a team calendar they can subscribe to | No | No iCal export, Google Calendar integration, or subscribable calendar feed. |
| 15 | View photos or recaps from games/practices | No | No media sharing feature. Would need photo upload and gallery. |

**Coverage: 1 fully solved, 3 partially solved, 11 gaps = ~12% coverage**

---

## Player

*Wants to know schedule, their own stats, what to work on.*

| # | Need | Solved? | How / Gap |
|---|------|:-------:|-----------|
| 1 | Know when and where practice/games are | No | Schedule exists but is coach-only. No player-facing view. Would need player login or shareable schedule link. |
| 2 | See their own batting stats | No | Reports has detailed player profiles with batting stats, but no player-accessible view. Would need player portal with individual stats card. |
| 3 | See what position they are playing | No | Lineup tab shows positions, but it is coach-facing. No player notification of lineup. |
| 4 | Know what skills to work on | No | Reports > Player Profile shows skill gaps and drill performance trends, but player cannot access it. Would need player-facing development dashboard. |
| 5 | Track their personal improvement over time | No | Reports tracks drill performance trends (sprint times, pitching accuracy, etc.) per player, but this data is coach-only. Would need player-facing progress tracker. |
| 6 | See their goals and progress | No | Reports tab has individual goals with progress tracking, but coach-only. Would need player-facing goals view. |
| 7 | Access practice drills to work on at home | No | Drill library has detailed descriptions, but player cannot access them. Would need shareable drill assignments or homework feature. |
| 8 | Know team standings and game results | No | Reports shows W/L, but not player-accessible. Would need player-facing team page. |
| 9 | Feel recognized for achievements | No | Reports has leaderboards and PRs, but only coach sees them. Would need player-visible recognition (badges, shoutouts, leaderboard). |
| 10 | Communicate with coaches | No | No player-to-coach messaging. Would need in-app communication or at minimum contact info sharing. |
| 11 | Register for tryouts | Partially | Tryouts > Registration form is parent-facing (requires parent info). A player could fill it out but it is designed for parents. |
| 12 | See the team roster and know teammates | No | Roster is coach-only. No player-facing team directory. |

**Coverage: 0 fully solved, 1 partially solved, 11 gaps = ~4% coverage**

---

## Coverage Summary

| Persona | Fully Solved | Partially Solved | Gaps | Coverage Score |
|---------|:-----------:|:----------------:|:----:|:--------------:|
| **League Director** | 6 / 20 | 4 / 20 | 10 / 20 | **~40%** |
| **Head Coach** | 17 / 25 | 5 / 25 | 3 / 25 | **~78%** |
| **Assistant Coach** | 10 / 15 | 4 / 15 | 1 / 15 | **~80%** |
| **Parent** | 1 / 15 | 3 / 15 | 11 / 15 | **~12%** |
| **Player** | 0 / 12 | 1 / 12 | 11 / 12 | **~4%** |

---

## Priority Gaps (Top 5 by Impact)

These are ranked by how many personas are affected and how severely the gap blocks the tool from being useful.

| Rank | Gap | Personas Affected | Impact |
|------|-----|-------------------|--------|
| **1** | **No parent/player-facing view of any kind** -- All data is locked inside a coach-only dashboard. Parents and players cannot see schedule, stats, lineups, or anything without full admin access. This is the single biggest structural gap. | Parent, Player | **Critical** -- The tool is invisible to 60%+ of the league's users. Without even a read-only shared view, coaches must manually relay every piece of information. |
| **2** | **Schedule is read-only and hardcoded** -- No UI to create, edit, cancel, or reschedule events. No calendar subscription (iCal) for parents. Changes require editing source code. | League Director, Head Coach, Parent, Player | **High** -- Schedule is the most universally needed feature. Being hardcoded makes it brittle and blocks 4 of 5 personas. |
| **3** | **No direct communication delivery** -- Comms tab composes messages but cannot send them. No email, SMS, push notification, or calendar integration. Copy-to-clipboard is the only output. | Head Coach, Parent, Player | **High** -- Communication is the #1 parent complaint in youth sports. The current workflow requires leaving the app entirely to actually reach anyone. |
| **4** | **No league-wide multi-team management** -- The dashboard is single-team. League directors cannot see standings across teams, enforce rules league-wide, or manage multiple rosters from one place. | League Director | **High** -- The League Director persona is structurally unsupported beyond tryouts and draft. |
| **5** | **No RSVP / availability system** -- Parents cannot report absences in advance. Coaches must manually track who is coming to each event. No advance lineup planning based on known availability. | Head Coach, Assistant Coach, Parent | **Medium-High** -- Causes last-minute lineup scrambles and makes practice planning less reliable. |

---

## Quick Wins (< 1 Day Each)

| # | Quick Win | Effort | Personas Helped | Description |
|---|-----------|--------|-----------------|-------------|
| 1 | **Shareable read-only schedule page** | ~4 hours | Parent, Player, Head Coach | Add a `#schedule` hash route (like the tryout registration `#register` pattern already exists) that shows the Schedule tab in a clean, parent-friendly layout. No login needed. Share a single URL. |
| 2 | **iCal/Google Calendar export** | ~3 hours | Parent, Player | Generate an `.ics` file from `SEASON_SCHEDULE` and offer a download link on the schedule page. Parents import once and get all dates in their phone calendar. |
| 3 | **Editable schedule (CRUD)** | ~6 hours | Head Coach, League Director | Move `SEASON_SCHEDULE` from a hardcoded const into localStorage (like all other data). Add create/edit/delete UI on the Schedule tab. The structure already exists; it just needs to be made dynamic. |
| 4 | **Shareable player stats card** | ~4 hours | Parent, Player | In Reports > Player Profile, add a "Share" button that generates a standalone URL or printable HTML card showing that player's batting stats, goals, attendance, and drill PRs. No login required for the viewer. |
| 5 | **SMS deep-link in Comms** | ~2 hours | Head Coach, Parent | Instead of just copy-to-clipboard, add an `sms:` link that opens the phone's Messages app pre-populated with the contact list and message body. Works on mobile. Minimal code change. |

---

## The Honest Answer

### League Director
**Not usable as a league management tool today.** The tryouts and draft modules are genuinely excellent -- multi-evaluator Firebase-synced scoring, snake draft with balance tracking, and player registration are all production-quality. But once the draft is over, there is nothing for league-wide management. No multi-team oversight, no standings, no league scheduling, no cross-team communication. The League Director can use this tool for exactly two weeks of the season (tryouts through draft), then it stops being useful to them.

### Head Coach
**Yes, usable today. This is clearly who the tool was built for.** The head coach has a comprehensive toolkit: roster management, 60+ drill library with detailed descriptions, practice planning with templates and live tracking, game scoring with defensive stats and pitch counts, lineup building with playing-time fairness tracking, opponent scouting with live tracking, season analytics with player profiles and drill leaderboards, goal setting, injury tracking, message composition, and full data backup. The main pain points are the hardcoded schedule and the lack of direct parent communication -- but these are workflow friction, not blockers. A head coach could run an entire season with this tool today.

### Assistant Coach
**Yes, usable today as a scoring and drill reference tool.** The assistant coach benefits from the same features as the head coach. The drill library is especially valuable -- every drill has a detailed description that tells you exactly how to run it, what to watch for, and what equipment you need. Multi-evaluator tryout scoring with Firebase sync means assistant coaches can score independently on their own phones. The main gap is that the tool assumes one device or manual data sharing between coaches (no real multi-user collaboration beyond tryouts).

### Parent
**Not usable today.** The only parent-facing feature is tryout registration (`#register` mode). Everything else -- schedule, stats, lineup, communication -- is locked behind the coach dashboard. Parents get zero self-service access. The coach must manually relay all information through external channels (group text, email, etc.). This is the tool's biggest structural gap. Adding even a simple read-only shared view of schedule + game results would transform the parent experience.

### Player
**Not usable today.** Players have even less access than parents. There is no player-facing view, no login, no way to see their own stats, goals, schedule, or development areas. The rich data that exists in the Reports tab (drill PRs, batting trends, improvement arrows, personal goals) would be incredibly motivating for players if they could see it -- but they cannot. The tool tracks everything a player would want to know but shares none of it with them.
