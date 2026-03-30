# Pirates Softball 2026 Dashboard

A comprehensive coaching dashboard for managing the Pirates Softball team (2026 season).

## Features

### 📊 Roster Management
- Track 13 players (5 returning, 8 new)
- Skill ratings (Hitting, Fielding, Throwing, Baserunning, Pitching, Attitude)
- Parent contact information
- Position tracking
- Pitcher designation

### 📋 Practice Planning
- 44-drill library with detailed descriptions
- 4 practice templates (Early Season, Mid Season, Pre-Game, Hitting-Focused)
- Drag-and-drop drill ordering
- Station rotations (3 groups)
- Time tracking against practice duration

### ⚾ Live Game Tracking
**Offense Mode:**
- Pitch-by-pitch tracking (balls, strikes, fouls)
- Automatic walk on 4 balls
- Automatic strikeout on 3 strikes
- Batting order management
- Stats: Hits, At-Bats, Runs, RBIs, Stolen Bases

**Defense Mode:** (NEW!)
- Pitcher selection and pitch count tracking
- USA Softball pitch count alerts (40/50/60 pitch warnings)
- Quick-entry defensive plays (K, GO, FO, E)
- Defensive stats: Putouts (PO), Assists (A), Errors (E)
- Auto-advance outs and innings

### 📝 Practice Logging
- Post-practice observations per player
- Attendance tracking
- Drill notes
- Coach reflections

### ✉️ Communications
- 5 message templates (Season Welcome, Practice Reminder, Game Day Info, etc.)
- Parent contact quick-reference
- Message history

## Tech Stack

- **React 18** (from CDN)
- **Babel Standalone** (for JSX transpilation)
- **localStorage** (for data persistence)
- Single HTML file deployment (no build step!)

## Usage

Simply open `index.html` in any modern browser. All data is saved locally in your browser's localStorage.

### Live Demo

🔗 [https://ddoxey-adobe.github.io/pirates-softball-dashboard/](https://ddoxey-adobe.github.io/pirates-softball-dashboard/)

## Data Structure

All data is stored in localStorage with versioned keys:
- `pirates-players-2026v3` - Roster data
- `pirates-practices-2026v3` - Practice plans
- `pirates-gamelogs-2026v1` - Game logs with offensive + defensive stats
- `pirates-practicelogs-2026v1` - Practice observations
- `pirates-messages-2026v3` - Communication history

## Development

To update the app:

1. Edit `pirates-coaching-dashboard.jsx`
2. Run `./build-html.sh` to regenerate `index.html`
3. Commit and push to GitHub

## Theme

Pirates colors:
- Gold: #FDB515
- Black: #1B1B1B
- White: #FAF9F6

## Credits

Built with 💛 for the 2026 Pirates Softball season.

Go Pirates! 🏴‍☠️⚾
