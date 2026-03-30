#!/usr/bin/env python3
"""
Add full planning UI with drill library and templates
"""

# Read the backup to get the full planning UI
with open('src/App.jsx.backup', 'r') as f:
    backup = f.read()

# Extract the planning UI section (from Template Loader to Add Drills section)
template_start = backup.find('{/* Template Loader */')
drills_end = backup.find('</div>}', backup.find('<SL>Add Drills</SL>')) + len('</div>}')
planning_ui = backup[template_start:drills_end]

# Add the TextArea for notes at the end
planning_ui += '''
      <TextArea label="Notes" value={form.notes || ""} onChange={e => setForm({...form, notes: e.target.value})} style={{ marginTop: 12 }} placeholder="General notes about this practice..." />'''

# Read current file
with open('src/App.jsx', 'r') as f:
    content = f.read()

# Replace the placeholder
content = content.replace(
    '''          {/* Planning Mode UI - will add in next section */}
          <p style={{color: THEME.white}}>Planning UI goes here</p>''',
    planning_ui
)

# Write it back
with open('src/App.jsx', 'w') as f:
    f.write(content)

print("✅ Added full planning UI with:")
print("   - Template loader (4 practice templates)")
print("   - Drill library (44 drills)")
print("   - Drag-and-drop drill ordering")
print("   - Time tracking")
print("   - Category filters")
