#!/usr/bin/env python3
"""
Refactor script to merge Practice Planner and Practice Log into one unified component
"""

with open('src/App.jsx', 'r') as f:
    content = f.read()

# 1. Update TABS - remove "practice" tab
old_tabs = '''const TABS = [
  { id: "roster", label: "Roster", icon: "👥" },
  { id: "practice", label: "Plan", icon: "📋" },
  { id: "practicelog", label: "Practice Log", icon: "📝" },
  { id: "gamelog", label: "Game Log", icon: "⚾" },
  { id: "comms", label: "Comms", icon: "✉️" },
];'''

new_tabs = '''const TABS = [
  { id: "roster", label: "Roster", icon: "👥" },
  { id: "practicelog", label: "Practice Log", icon: "📋" },
  { id: "gamelog", label: "Game Log", icon: "⚾" },
  { id: "comms", label: "Comms", icon: "✉️" },
];'''

content = content.replace(old_tabs, new_tabs)

# 2. Update the render section - remove practice tab reference
old_render = '''      {tab==="roster" && <RosterPanel players={players} setPlayers={setPlayers} />}
      {tab==="practice" && <PracticePlanner />}
      {tab==="practicelog" && <PracticeLog players={players} />}
      {tab==="gamelog" && <GameLog players={players} />}
      {tab==="comms" && <Comms players={players} />}'''

new_render = '''      {tab==="roster" && <RosterPanel players={players} setPlayers={setPlayers} />}
      {tab==="practicelog" && <UnifiedPracticeLog players={players} />}
      {tab==="gamelog" && <GameLog players={players} />}
      {tab==="comms" && <Comms players={players} />}'''

content = content.replace(old_render, new_render)

# Write the updated content
with open('src/App.jsx', 'w') as f:
    f.write(content)

print("✅ Updated TABS and render section")
print("⚠️  Still need to create UnifiedPracticeLog component manually")
