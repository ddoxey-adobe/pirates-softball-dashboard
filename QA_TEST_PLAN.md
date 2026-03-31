# Pirates Softball Dashboard - QA Test Plan

**Last Updated:** 2026-03-31
**Version:** Phase 1 (Pre-Scouting)

---

## 📋 **HOW TO USE THIS DOCUMENT**

1. Before deploying new features, test ALL sections marked "✅ Active"
2. Mark each test: ✓ Pass | ✗ Fail | ⊘ Skip (not applicable)
3. Document bugs in "Issues Found" section at bottom
4. Update this document when adding new features

---

## 🏠 **HOME / ROSTER TAB**

### **Player Management**
- [ ] Add new player with all fields (name, grade, position, returning status)
- [ ] Edit existing player
- [ ] Delete player (with confirmation)
- [ ] Player count updates in header stats (Roster, Returning, New, Pitchers)
- [ ] Mark player as pitcher (checkbox)
- [ ] Set primary position
- [ ] Set secondary positions (multi-select)
- [ ] Upload player photo (if implemented)
- [ ] Player list sorts alphabetically

### **Coach Management**
- [ ] Add new coach
- [ ] Edit existing coach
- [ ] Delete coach
- [ ] Assign specialty to coach

### **Load Test Data Button**
- [ ] Gold button in top-right loads test data
- [ ] Confirms before loading
- [ ] Populates players, practices, and game

---

## 📋 **PRACTICE TAB**

### **Practice Planning**
- [ ] Create new practice
- [ ] Set date, time, duration, focus
- [ ] Add drills from library (search/filter works)
- [ ] Remove drills from plan
- [ ] Reorder drills (drag or arrows)
- [ ] Assign coach to drill
- [ ] Set drill duration
- [ ] Save as draft
- [ ] Finalize practice (status change)

### **Practice Templates**
- [ ] Save practice as template
- [ ] Load template when creating new practice
- [ ] Manage template library (view/edit/delete)
- [ ] Template includes all drills and durations

### **Group Management**
- [ ] Create groups (Red, Blue, Gold)
- [ ] Assign players to groups
- [ ] Filter drill tracking by group
- [ ] Clear group selections

### **Live Practice Tracking**
- [ ] Mark attendance (check players present)
- [ ] Track drills with enhanced tracking:

**B1 - Home to First Sprint:**
- [ ] Stopwatch starts/stops correctly
- [ ] Records time per player
- [ ] Shows leaderboard (fastest to slowest)
- [ ] Displays in seconds (e.g., "3.2s")

**P2 - Pitch Location:**
- [ ] Strike/Ball counter per pitcher
- [ ] Strike % calculates correctly
- [ ] Shows total pitches
- [ ] Multiple pitchers can be tracked

**F3 - 21 Outs:**
- [ ] Team counter increments
- [ ] Resets on error
- [ ] Shows consecutive outs

**H9 - Points-Based Hitting:**
- [ ] Points entry per player (GB=1, FB=2, LD=3)
- [ ] Leaderboard sorts by total points
- [ ] Shows cumulative scores

**H10 - Bunt Stations:**
- [ ] Zone tap interface (9 zones)
- [ ] Points awarded per zone
- [ ] Leaderboard by accuracy points
- [ ] Visual grid updates

**H11 - Batting Queen:**
- [ ] Elimination bracket (6 levels)
- [ ] Level advancement tracking
- [ ] Shows highest level reached

### **Station Rotation Manager**
- [ ] Create stations (assign drills to stations)
- [ ] Set rotation time
- [ ] Timer countdown works
- [ ] Alerts on rotation
- [ ] Shows which groups at which stations

### **Practice Completion**
- [ ] Add coach notes
- [ ] Add player observations (per player)
- [ ] Complete practice (status change to "completed")
- [ ] Completed practice shows in history

### **Practice Reports & Export**
- [ ] Print practice plan (formatted)
- [ ] Print completed practice report (includes all tracking data)
- [ ] Export drill leaderboards to CSV
- [ ] CSV format correct (headers, data)

### **Practice Pitch Counts (NEW - Phase 1)**
- [ ] Track pitch count per pitcher (count only, no strikes/balls)
- [ ] Shows in pitcher status: "Last pitched: [date] - [count] pitches"
- [ ] Weekly cumulative total calculates correctly
- [ ] Warning shows when approaching weekly limit (100 pitches)
- [ ] Does NOT prevent starting pitcher (warning only)

---

## 💡 **PLANNER TAB (NEW - Phase 1 Rebuild)**

### **Alignment Library**
- [ ] Create new alignment
- [ ] Name alignment (e.g., "Lucy Pitching")
- [ ] Visual field grid shows 9 positions (P, C, 1B, 2B, 3B, SS, LF, CF, RF)
- [ ] Assign player to each position (dropdown)
- [ ] Green = filled position, Grey = empty position
- [ ] Save alignment to library
- [ ] First alignment auto-marked as Primary ⭐
- [ ] Edit existing alignment
- [ ] Delete alignment (with confirmation)
- [ ] Set/remove Primary ⭐ (only one can be primary at a time)
- [ ] Load alignment into builder for editing

### **Game Templates**
- [ ] Create new template
- [ ] Name template (e.g., "Aggressive Strategy")
- [ ] Add description (optional)
- [ ] Build batting lineup (1-9 order, no positions)
- [ ] Add player to batting lineup
- [ ] Remove player from batting lineup
- [ ] Reorder batting lineup (▲▼ arrows work)
- [ ] First player cannot move up (disabled)
- [ ] Last player cannot move down (disabled)
- [ ] Removing player re-indexes batting orders (1, 2, 3...)
- [ ] Select alignments to include with template (multi-select from library)
- [ ] Save template
- [ ] Edit existing template
- [ ] Delete template (with confirmation)
- [ ] "🎮 Create Game" button on template (placeholder alert for now)

### **Alignment Builder UI**
- [ ] Visual field coverage shows filled/empty positions
- [ ] Position dropdown greys out already-filled positions
- [ ] Disabled positions show "(taken)" label
- [ ] Cannot assign duplicate positions
- [ ] Available players list updates as players assigned
- [ ] Clear visual distinction between filled (green) and empty (grey) positions

### **Data Integrity (Snapshots)**
- [ ] Loading alignment in game creates snapshot (not reference)
- [ ] Editing alignment in library does NOT change past games
- [ ] Editing alignment affects future games only
- [ ] Historical game data preserves original positions

---

## 📋 **LINEUP TAB (OLD - Still Active Until Phase 1 Complete)**

### **Lineup Builder**
- [ ] Create new lineup (opponent, date, location)
- [ ] Set player availability (checkboxes)
- [ ] Build batting order + starting positions
- [ ] Create defensive alignments
- [ ] Save alignment to library
- [ ] Load alignment from library
- [ ] Finalize lineup (status change to "finalized")
- [ ] Edit draft lineup
- [ ] View finalized lineup (read-only)
- [ ] Delete lineup

### **Live Game - In-Game Management**
- [ ] Start game from finalized lineup
- [ ] Shows current inning
- [ ] Shows on-field positions (9 players)
- [ ] Shows bench players with playing time
- [ ] Shows injured players section
- [ ] Next inning button (advances inning, copies positions, updates playing time)
- [ ] ⬅️ Previous inning button (reverts to previous inning)
- [ ] Previous inning disabled at inning 1

### **Substitutions**
- [ ] Click "Substitute" button on field player
- [ ] Substitution modal shows:
  - Outgoing player info (name, innings played)
  - Bench players eligible for substitution
  - Smart sorting (primary → secondary → experience → new position)
  - Position match indicators (⭐ primary, ✓ secondary, 🔄 has experience, 🆕 new)
  - Playing time equity highlighted (red border if needs more playing time)
- [ ] Select substitute
- [ ] Confirm substitution
- [ ] Substitution history logs correctly
- [ ] Playing time updates for both players
- [ ] Bench updates (outgoing to bench, incoming to field)

### **Injury Tracking**
- [ ] Click 🚑 button on field player
- [ ] Injury modal shows:
  - Injury notes field
  - "Multi-game injury" checkbox
  - Position player was playing
- [ ] Confirm injury substitution
- [ ] Injured player moves to "Injured" section
- [ ] Injured section shows:
  - Player name
  - Inning injured
  - Position at time of injury
  - Injury notes (if provided)
  - Multi-game status
- [ ] Temporary injury: "👆 Click to sub back in when cleared"
- [ ] Multi-game injury: "🔓 Changed - Allow Return" button
- [ ] Click "Allow Return" clears multi-game flag
- [ ] Cleared player shows in bench (can be subbed back in)
- [ ] Multiple injuries to same player: shows count badge "⚠️ 2x injured today"
- [ ] Click "View Full History" expands timeline of all injuries
- [ ] Injury history shows: inning, position, notes, status for each injury

### **Load Alignment During Game**
- [ ] Click "Load Alignment" button
- [ ] Shows library alignments + game-specific alignments
- [ ] Select alignment
- [ ] If player unavailable: shows warning, allows filling holes
- [ ] Load alignment with holes: empty positions shown, can assign from bench
- [ ] All 9 positions filled before continuing

### **Playing Time Tracking**
- [ ] Shows innings played per player
- [ ] Visual progress bar (% of game played)
- [ ] Red border if playing time < 50% (after inning 2)
- [ ] Updates after each inning advancement

### **Game Completion**
- [ ] "💾 Save & Exit" button (can resume later)
- [ ] "🏁 End Game" button (finalizes stats)
- [ ] End game changes status to "completed"
- [ ] Completed game shows "🏁 Game Completed" badge (blue)
- [ ] Completed game shows "📊 View Game Stats" button
- [ ] Completed game shows "← Back to Lineups" button (no edit controls)
- [ ] Live game header shows "🏁 COMPLETED" when game ended
- [ ] Editing disabled for completed games:
  - No substitute buttons
  - No injury buttons
  - No inning controls
  - No save/end game buttons

---

## ⚾ **GAME TAB**

### **Game Log Entry**
- [ ] Create new game
- [ ] Set opponent, date, location, field conditions
- [ ] Set starting pitcher
- [ ] Record final score (our score, their score)
- [ ] Record result (W/L/T)
- [ ] Add game notes

### **Live Scorer - Batting Tracking**
- [ ] Select current batter from lineup
- [ ] Log each pitch: [Ball] [Strike] [Foul]
- [ ] Pitch count increments correctly
- [ ] Log at-bat result:
  - Hits: [1B] [2B] [3B] [HR]
  - Outs: [K] [ꓘ] [GO] [FO] [SAC]
  - On-base: [BB] [HBP] [FC] [E]
- [ ] Result buttons color-coded (green=hit, red=out, blue=on-base, orange=error)
- [ ] Log RBI count
- [ ] Log stolen base [SB]
- [ ] Log caught stealing [CS]
- [ ] At-bat saves to game log

### **Live Scorer - Pitching Tracking**
- [ ] Select pitcher
- [ ] Log pitch: [Strike] [Ball]
- [ ] Pitch counter shows total, strikes, balls
- [ ] Strike % calculates correctly
- [ ] Visual progress bar (strikes in green, balls in red)
- [ ] Switch pitcher mid-game
- [ ] Each pitcher's stats tracked separately

### **Live Scorer - Fielding Tracking**
- [ ] Record putouts (who caught out)
- [ ] Record assists (who threw to get out)
- [ ] Record errors

### **Batting Stats Display**
- [ ] Player batting average calculates correctly (hits / at-bats)
- [ ] On-base percentage (OBP) calculates correctly
- [ ] Slugging percentage (SLG) calculates correctly
- [ ] Shows hits breakdown (1B, 2B, 3B, HR)
- [ ] Shows strikeouts, walks, RBIs

### **Game Tab - NO Pitch Count Tracking (NEW - Phase 1)**
- [ ] Game tab does NOT have pitch counter for coach
- [ ] Pitch count shown is READ-ONLY from Scorer tab
- [ ] Displays: "[Pitcher]: X pitches (Y strikes, Z balls)"
- [ ] Color indicator: Green (0-40), Yellow (41-60), Red (61+)
- [ ] Updates when Scorer logs pitches (real-time sync)

---

## 📊 **REPORTS TAB**

### **Date Range Filter**
- [ ] All Time filter works
- [ ] 30 Days filter works
- [ ] 60 Days filter works
- [ ] 90 Days filter works
- [ ] All stats recalculate based on date range

### **Collapse/Expand Controls**
- [ ] "⬇️ Expand All" button expands all sections
- [ ] "⬆️ Collapse All" button collapses all sections
- [ ] Individual section toggle works (▼/▶)
- [ ] Section state persists (localStorage)

### **Practice Analytics**
- [ ] Shows total completed practices
- [ ] Shows average attendance
- [ ] Shows drills tracked count
- [ ] Cards display with gradient borders

### **Drill Leaderboards**
- [ ] All tracked drills show in separate sections
- [ ] Each drill shows player rankings (1st 🏆, 2nd 🥈, 3rd 🥉)
- [ ] Best value shows correctly (lowest for time, highest for points)
- [ ] Average value calculates correctly
- [ ] Attempts count correct
- [ ] Improvement indicator shows (↗ improving, ↘ declining, → stable)
- [ ] Click player to see practice-by-practice progress modal
- [ ] Progress modal shows all dates + values
- [ ] Export to CSV works (correct format)

### **Attendance Summary**
- [ ] Shows all players with attendance percentage
- [ ] Visual progress bar (gold gradient)
- [ ] Displays: [attended]/[total] (XX%)
- [ ] Export to CSV works

### **Injury Metrics (NEW)**
- [ ] Only shows when injury data exists in games
- [ ] Summary cards show:
  - Total injuries
  - Players affected
  - Average per game
  - Return rate %
- [ ] Injuries by position: horizontal bar chart with counts
- [ ] Injury timeline by inning: column chart (innings 1-7)
- [ ] Player injury history: shows all injuries per player
  - Inning, position, notes, status
  - Color-coded: red (serious), green (returned), gold (temporary)
- [ ] Common injury types: analyzes notes for keywords (ankle, knee, wrist, etc.)
- [ ] Shows count per injury type

### **Playing Time & Attendance Equity**
- [ ] Shows practice attendance (last 30 days)
- [ ] Shows game playing time (estimated innings)
- [ ] Low attendance warning (< 70%)
- [ ] Low playing time warning (< 40% and high attendance)
- [ ] Visual indicators: ⚠️ for issues, ✓ for good

### **Game Analytics**
- [ ] Shows total games, wins, losses, ties
- [ ] Win percentage calculates correctly
- [ ] Runs scored/allowed totals
- [ ] Team batting average
- [ ] Team on-base percentage (OBP)
- [ ] Team slugging percentage (SLG)

### **Player Batting Stats**
- [ ] Individual batting average (BA)
- [ ] On-base percentage (OBP)
- [ ] Slugging percentage (SLG)
- [ ] Hit breakdown (1B, 2B, 3B, HR)
- [ ] Walks, strikeouts, RBIs
- [ ] Sorted by BA (highest first)

### **Pitching Stats**
- [ ] Innings pitched (estimated from pitch count)
- [ ] Strike percentage
- [ ] Total pitches thrown
- [ ] Hits allowed, walks allowed

---

## ✉️ **COMMS TAB**

### **Message Management**
- [ ] Create new message
- [ ] Select recipients (individual players, all players, coaches)
- [ ] Set message priority (normal, urgent)
- [ ] Add subject and message body
- [ ] Send message
- [ ] View sent messages
- [ ] Delete message

### **Message Display**
- [ ] Shows recipient count
- [ ] Shows timestamp
- [ ] Urgent messages highlighted
- [ ] Read/unread status (if implemented)

---

## 🔄 **CROSS-TAB FUNCTIONALITY**

### **Data Persistence**
- [ ] All data saves to localStorage automatically
- [ ] Refresh page: all data persists
- [ ] Close browser and reopen: all data persists
- [ ] localStorage keys correct:
  - `pirates-players-2026v3`
  - `pirates-coaches-2026v1`
  - `pirates-practices-unified-2026v1`
  - `pirates-gamelogs-2026v1`
  - `pirates-lineups-2026v1`
  - `pirates-messages-2026v3`
  - `pirates-alignment-library-2026v1` (NEW - Phase 1)
  - `pirates-lineup-templates-2026v1` (NEW - Phase 1)

### **Tab Navigation**
- [ ] All 7 tabs visible: Roster, Practice, Planner, Lineup, Game, Reports, Comms
- [ ] Tab icons correct
- [ ] Active tab highlights (gold background)
- [ ] Tab switching preserves state

### **Reports Tab Integration**
- [ ] Practice data from Practice tab shows in Reports
- [ ] Game data from Game tab shows in Reports
- [ ] Lineup data (injuries) shows in Reports
- [ ] Date range affects all data sources

---

## 📱 **RESPONSIVE DESIGN**

### **Desktop (1200px+)**
- [ ] Two-column layouts work
- [ ] Cards display properly
- [ ] Buttons accessible
- [ ] No horizontal scroll

### **Tablet (768px - 1199px)**
- [ ] Layouts reflow to single column
- [ ] Touch targets 48px minimum
- [ ] No horizontal scroll

### **Mobile (< 768px)**
- [ ] All features accessible
- [ ] Buttons large enough to tap
- [ ] Field coverage grid readable
- [ ] Dropdowns work correctly
- [ ] Scrolling smooth

---

## 🎨 **UI/UX CONSISTENCY**

### **Theme Colors**
- [ ] Gold (#FDB515) for primary actions
- [ ] Black (#1B1B1B) for backgrounds
- [ ] White (#FAF9F6) for text
- [ ] Red (#E74C3C) for danger/errors/injuries
- [ ] Green (#2ECC71) for success/filled
- [ ] Blue (#3498DB) for info
- [ ] Grey (#8E8E8E) for secondary text

### **Button Styles**
- [ ] Primary buttons: gold background, black text
- [ ] Secondary buttons: transparent, white text, charcoal border
- [ ] Danger buttons: red background, white text
- [ ] Small buttons: consistent padding (6px 12px)
- [ ] Hover states work
- [ ] Disabled states grey (50% opacity, not-allowed cursor)

### **Cards**
- [ ] Consistent padding (16px)
- [ ] Background: blackLight
- [ ] Border: 1px solid charcoal
- [ ] Border radius: 8px

### **Typography**
- [ ] Headers: Oswald font, gold color, uppercase
- [ ] Body: Default sans-serif
- [ ] Consistent font sizes (12px, 13px, 14px, 16px, 20px)

---

## 🐛 **KNOWN ISSUES / BUGS FOUND**

### **Issues from Previous Testing:**
- [x] FIXED: Substitution modal cards not clickable (Card component missing {...props})
- [x] FIXED: Injured players showing in substitution modal (filter logic)
- [x] FIXED: Multiple injuries creating duplicate player cards (Option C consolidation)
- [x] FIXED: Position dropdowns not greying out filled positions (Planner only)
- [x] FIXED: No up/down arrows for batting order (Planner only)
- [x] FIXED: Game status confusion (added "Game Completed" status)

### **New Issues (To Be Tested):**
- [ ] _Document any issues found during Phase 1 testing here_

---

## ✅ **REGRESSION TESTING CHECKLIST**

**Run this after ANY significant feature addition:**

### **Critical Path (Must Work):**
1. [ ] Create player → Create practice → Track drill → Complete practice → View in Reports
2. [ ] Create lineup → Start game → Make substitution → Track injury → End game → View in Reports
3. [ ] Create game → Log batting → Log pitching → Complete game → View stats in Reports

### **Data Integrity:**
- [ ] No data loss on page refresh
- [ ] No data corruption when editing existing records
- [ ] Deletion actually removes data
- [ ] Updates save correctly

---

## 📝 **TESTING NOTES**

**Date:** _________
**Tester:** _________
**Version Tested:** _________
**Browser:** _________
**Device:** _________

**General Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## 🔮 **UPCOMING FEATURES (Not Yet Built)**

### **Phase 2 - Scouting Portal**
- [ ] Create scouting report
- [ ] Track opponent batting (jersey numbers)
- [ ] Track opponent pitching (multiple pitchers)
- [ ] Track opponent defense (position ratings + notes)
- [ ] Generate formatted scouting report
- [ ] View scouting report when creating game

### **Phase 3 - Advanced Analytics**
- [ ] Visual trend charts (custom SVG)
- [ ] Team improvement trends
- [ ] Player comparison tool
- [ ] Player profile pages
- [ ] Season goals tracking
- [ ] Practice timeline view
- [ ] Export full season report (PDF)

### **Phase 4 - Mobile Optimization**
- [ ] Bottom tab navigation (thumb zone)
- [ ] Vertical single-column layouts
- [ ] Large touch targets (48px minimum)
- [ ] High contrast for outdoor readability

---

**END OF QA TEST PLAN**
