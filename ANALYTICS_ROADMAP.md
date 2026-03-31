# Pirates Softball Dashboard - Analytics Features Roadmap

**Status:** Phase 3 Complete ✅ - Starting Phase 4
**Last Updated:** 2026-03-31
**Estimated Total Time:** ~62 hours

---

## Overview

Implementing 12 new analytics and UX features to transform the dashboard into a comprehensive season management tool.

---

## Current Status: Phase 4 - Export & Mobile (15 hours)

### ✅ Completed (Phases 1, 2, 3)
- Feature #5: Attendance Insights ✅
- Feature #8: Quick Practice Notes ✅
- Feature #9: Drill Performance by Date ✅
- Feature #4: Visual Trend Charts ✅
- Feature #7: Season Goals ✅
- Feature #1: Practice Timeline View ✅
- Feature #3: Team Improvement Trends ✅
- Feature #2: Player Comparison Tool ✅
- Feature #11: Player Profile Pages ✅

### 🔄 In Progress
- None

### ⏳ Next Up
- Feature #12: Mobile Gestures (Task #46)
- Feature #10: Export Full Season Report (Task #47)

---

## Implementation Phases

### Phase 1: Foundation (3 features, ~6 hours) ✅ COMPLETE
**Goal:** Add immediate-value features with no dependencies

| # | Feature | Task | Time | Complexity | Status |
|---|---------|------|------|------------|--------|
| 5 | Attendance Insights | #52 | 2h | Simple | ✅ Complete |
| 8 | Quick Practice Notes | #50 | 2h | Simple | ✅ Complete |
| 9 | Drill Performance by Date | #54 | 2h | Simple | ✅ Complete |

**Note:** Feature #6 (Practice Templates) moved to later - requires more design work.

**Deliverables:**
- ✅ Per-player attendance percentages with trend indicators (first half vs second half)
- ✅ Quick "highlight" notes during active practices with player tagging
- ✅ Drill usage analytics showing frequency and last run date with stale warnings

---

### Phase 2: Visualization Core (3 features, ~16 hours) ✅ COMPLETE
**Goal:** Build charting system that other features depend on

| # | Feature | Task | Time | Complexity | Status |
|---|---------|------|------|------------|--------|
| 4 | Visual Trend Charts | #48 | 8h | Complex | ✅ Complete |
| 7 | Season Goals | #44 | 4h | Medium | ✅ Complete |
| 1 | Practice Timeline View | #53 | 4h | Medium | ✅ Complete |

**Dependencies:**
- Feature #1 uses charts from #4 for sparklines
- Feature #7 standalone but enhanced by #4

**Technical Notes:**
- Build custom SVG-based LineChart, BarChart, Sparkline components
- ~200 lines of code, no external dependencies
- Keep single-file architecture

---

### Phase 3: Advanced Analytics (3 features, ~16 hours) ✅ COMPLETE
**Goal:** Deep insights and comparisons

| # | Feature | Task | Time | Complexity | Status |
|---|---------|------|------|------------|--------|
| 3 | Team Improvement Trends | #49 | 4h | Medium | ✅ Complete |
| 2 | Player Comparison Tool | #51 | 4h | Medium | ✅ Complete |
| 11 | Player Profile Pages | #45 | 8h | Complex | ✅ Complete |

**Deliverables:**
- ✅ Rolling 3-practice averages with trend indicators and improvement rates
- ✅ Side-by-side player comparison across drills, attendance, and game stats
- ✅ Comprehensive player profiles with 4 tabs: Overview, Practice History, Game History, Goals
- Feature #11 integrates #2 (comparison)

---

### Phase 4: Export & Mobile (2 features, ~15 hours)
**Goal:** Polish and cross-platform support

| # | Feature | Task | Time | Complexity | Status |
|---|---------|------|------|------------|--------|
| 12 | Mobile Gestures | #46 | 5h | Medium | ⏳ Pending |
| 10 | Export Full Season Report | #47 | 10h | Complex | ⏳ Pending |

**Dependencies:**
- Feature #10 should be last (depends on all other features being complete)

---

## Feature Details

### 1. Practice Timeline View (4h, Medium)
**Location:** Reports tab, new section at top
**What it does:**
- Chronological list of all practices with date markers
- Key metrics per practice: attendance, drills run, new PRs
- Mini sparklines showing performance trends
- Expandable to see full drill breakdown
- Filter by date range, focus area, drill category

**Implementation:**
```
Reports Tab
├── [NEW] Practice Timeline
│   ├── Vertical timeline with date markers
│   ├── Practice cards (focus, attendance, drills)
│   ├── Sparklines (from Feature #4)
│   └── Click to expand → full details
```

---

### 2. Player Comparison Tool (4h, Medium)
**Location:** Reports tab, new "Compare Players" button at top
**What it does:**
- Multi-select dropdown (2-3 players)
- Side-by-side comparison across all drills, game stats, attendance
- Visual bar charts for each metric
- Highlight leader in each category
- Export comparison to CSV

**Technical:**
- Modal with player selector
- Comparison table component
- Integrate charts from Feature #4

---

### 3. Team Improvement Trends (4h, Medium)
**Location:** Reports tab, new "Team Progress" section
**What it does:**
- Calculate team averages per drill over time
- Rolling 3-practice average to smooth variance
- Trend indicators: ↗ improving (green), → flat (yellow), ↘ declining (red)
- Rate of improvement: "Team improving 15% per practice"
- Drill A vs Drill B progress comparison

**Dependencies:** Feature #4 (charts)

---

### 4. Visual Trend Charts (8h, Complex) ⚡ CRITICAL
**Location:** Throughout Reports tab
**What it does:**
- Custom SVG-based charting system
- Components: LineChart, BarChart, Sparkline
- No external dependencies
- ~200 lines of code

**Why it's critical:** 6 other features depend on this

**Technical approach:**
```javascript
// Example LineChart component
const LineChart = ({ data, width, height }) => {
  // Calculate SVG path from data points
  // Return <svg> with <path> element
}
```

**Used by:**
- Feature #1 (sparklines in timeline)
- Feature #2 (comparison charts)
- Feature #3 (trend lines)
- Feature #7 (goal progress)
- Feature #11 (player profile charts)

---

### 5. Attendance Insights (2h, Simple)
**Location:** Reports tab, expand existing Attendance Summary
**What it does:**
- Per-player attendance percentage
- Trend: first half vs second half of season
- "At risk" badge for <70% attendance
- Filter to show only low attendance
- Visual progress bars

**Data:** Already available in `completedPractices.attendance`

---

### 6. Practice Templates (2h, Simple) 🔄 IN PROGRESS
**Location:** PracticeLog, add "Save as Template" button
**What it does:**
- Save current practice plan as reusable template
- Template management modal (name, category, delete)
- Template picker in "Plan Practice" flow
- Extend existing `PRACTICE_TEMPLATES` with custom templates

**Data structure:**
```javascript
localStorage: "pirates-practice-templates-2026v1"
[
  {
    id: "custom-1",
    name: "Hitting Focus",
    category: "Custom",
    drills: [...],
    duration: 120,
    description: "2 hours of hitting drills",
    createdDate: "2026-03-30"
  }
]
```

---

### 7. Season Goals (4h, Medium)
**Location:** New sub-tab in Reports or separate Goals tab
**What it does:**
- Set team and player goals
- Types: statistical (batting avg), milestone (learn position), behavioral (attendance)
- Auto-calculate progress from practice/game data
- Visual progress bars
- Link to relevant drill/player data

**Data structure:**
```javascript
localStorage: "pirates-goals-2026v1"
{
  team: [
    {
      id: "goal-1",
      goal: "Average 11+ attendance per practice",
      target: 11,
      current: 12.0,
      type: "statistical",
      category: "attendance",
      deadline: "2026-06-01",
      createdDate: "2026-03-15"
    }
  ],
  players: {
    "new1": [
      {
        id: "goal-2",
        goal: "Sub-3.0 second sprint time",
        target: 3.0,
        current: 3.0,
        type: "statistical",
        category: "baserunning",
        deadline: "2026-05-01"
      }
    ]
  }
}
```

---

### 8. Quick Practice Notes (2h, Simple)
**Location:** PracticeLog active practice, add to each drill
**What it does:**
- "💡 Highlight" button next to each drill during practice
- Quick note modal: text field + player tags
- Show highlights in completed practice view
- Filter practice timeline by highlights
- Export highlights to report

**Data structure:**
```javascript
// Add to practice object
highlights: [
  {
    drillId: "b1",
    note: "Jessica had her fastest sprint yet!",
    timestamp: "2026-03-30T17:45:00Z",
    playersTagged: ["ret2"]
  }
]
```

---

### 9. Drill Performance by Date (2h, Simple)
**Location:** Reports tab, new "Drill Usage" section
**What it does:**
- Table: drill name, times run, avg performance, last run date
- Sort by frequency, recent, performance
- Identify under-utilized: "Not run in 4 practices"
- Calendar heatmap (optional)
- Click drill → see all dates + performance

**Data source:** Aggregate `completedPractices.drills`

---

### 10. Export Full Season Report (10h, Complex)
**Location:** Reports tab, top button
**What it does:**
- Generate comprehensive PDF with all season data
- Sections: team summary, practice timeline, leaderboards, player profiles, games, goals
- Professional Pirates branding
- Configurable: include/exclude sections, date range

**Technical:**
- Use jsPDF + html2canvas from CDN
- Or: generate HTML report, print to PDF via browser

**Dependencies:** Should be LAST - needs all other features complete

---

### 11. Player Profile Pages (8h, Complex)
**Location:** Modal from roster click or Reports player name click
**What it does:**
- Comprehensive player view - all stats in one place
- Tabs: Overview, Practice History, Game History, Goals
- Practice History: timeline with all drill performances
- Game History: batting/pitching/fielding over time
- Charts showing performance trends (Feature #4)
- "Compare to Team Avg" toggle
- Quick actions: add observation, set goal

**Dependencies:** Features #2, #4

---

### 12. Mobile Gestures (5h, Medium)
**Location:** Global enhancements
**What it does:**
- Swipe left/right to navigate tabs
- Pull-to-refresh on reports
- Pinch-to-zoom on charts
- Long-press on player for quick actions
- Touch-optimized 48px hit targets

**Technical:**
- Vanilla touch event handlers (~100 lines)
- No library needed
- Test on iOS Safari, Chrome Android

---

## Technical Considerations

### Chart Implementation
**Decision:** Custom SVG charts (no libraries)
- Keeps single-file architecture
- ~200 lines for LineChart, BarChart, Sparkline
- Better performance than canvas
- Full control over styling

### Data Structure Changes

**New localStorage keys:**
```javascript
"pirates-practice-templates-2026v1": [...]
"pirates-goals-2026v1": {...}
```

**Extend practice object:**
```javascript
{
  // existing fields...
  highlights: [
    { drillId, note, timestamp, playersTagged }
  ]
}
```

### Performance
- All processing client-side
- Current scale: ~13 players × ~20 practices = minimal
- Use memoization for chart calculations
- PDF generation on-demand only

---

## File Locations

**Primary file:**
- `/Users/devindoxey/Desktop/Projects/pirates-softball-dashboard/src/App.jsx` (3,567 lines)

**Build system:**
- `/Users/devindoxey/Desktop/Projects/pirates-softball-dashboard/build.sh`
- `/Users/devindoxey/Desktop/Projects/pirates-softball-dashboard/index.html` (built from App.jsx)

**Key component locations in App.jsx:**
- `Reports` component: ~line 3077
- `PracticeLog` component: ~line 734
- `GameLog` component: ~line 2488
- Existing attendance summary: ~line 3436

---

## When Returning to This Work

### Quick Start Commands

1. **Check current progress:**
   ```
   "Show me the task list for the softball dashboard features"
   ```

2. **Continue where we left off:**
   ```
   "Continue implementing the analytics features - pick up from the roadmap"
   ```

3. **Check what's deployed:**
   ```bash
   git log --oneline -10
   ```

### What to Tell Me

When you return, say:
> "Let's continue with the softball dashboard analytics features. Check the ANALYTICS_ROADMAP.md file and continue from where we left off."

I'll:
1. Read this roadmap
2. Check which tasks are complete
3. Pick up the next feature in sequence
4. Continue building

---

## Success Metrics

### Phase 1 Complete When:
- ✅ Can save/load practice templates
- ✅ Can see attendance percentages and trends
- ✅ Can add highlights during practice
- ✅ Can see drill usage analytics

### Phase 2 Complete When:
- ✅ Charts render correctly on all drill leaderboards
- ✅ Can set and track goals
- ✅ Practice timeline shows full season at a glance

### Phase 3 Complete When:
- ✅ Can compare 2-3 players side-by-side
- ✅ Team trends show improvement rates
- ✅ Player profiles show comprehensive stats

### Phase 4 Complete When:
- ✅ Mobile gestures work on iPhone/Android
- ✅ Can export full PDF season report

---

## Notes

- **Current test data:** 1 practice (Mar 15, 2026) + 1 game (Mar 22, 2026)
- **Live URL:** https://ddoxey-adobe.github.io/pirates-softball-dashboard/
- **Build command:** `./build.sh && git commit && git push`
- **Load test data button:** Top-right gold button (if needed for testing)

---

**Last worked on:** 2026-03-31 - Feature #11 (Player Profile Pages) complete ✅
**Next session:** Begin Phase 4 with Feature #12 (Mobile Gestures) or Feature #10 (Export Full Season Report)
