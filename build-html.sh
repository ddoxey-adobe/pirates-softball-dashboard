#!/bin/bash

SOURCE="pirates-coaching-dashboard.jsx"
OUTPUT="pirates-softball-dashboard/index.html"

# Read the JSX file and remove the import line
JSX_CODE=$(tail -n +2 "$SOURCE")

# Create the HTML file
cat > "$OUTPUT" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>Pirates Softball 2026 Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet">
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { margin: 0; padding: 0; }
</style>
</head>
<body>
<div id="root"></div>

<script>
// localStorage-based storage API
window.storage = {
  get: async (key) => {
    const value = localStorage.getItem(key);
    return value ? { value } : null;
  },
  set: async (key, value) => {
    localStorage.setItem(key, value);
  }
};
</script>

<script type="text/babel">
const { useState, useEffect, useRef } = React;

EOF

# Append the JSX code (without import statement)
echo "$JSX_CODE" >> "$OUTPUT"

# Add the React rendering code at the end
cat >> "$OUTPUT" << 'EOF'

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
</script>

</body>
</html>
EOF

echo "✅ Created $OUTPUT"
