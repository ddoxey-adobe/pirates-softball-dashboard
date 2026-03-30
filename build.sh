#!/bin/bash
# Extract everything before <script type="text/babel">
head -n 35 index.html > index.html.tmp

# Add the script tag
echo '<script type="text/babel">' >> index.html.tmp
echo 'const { useState, useEffect, useRef } = React;' >> index.html.tmp
echo '' >> index.html.tmp

# Add the App.jsx content
cat src/App.jsx >> index.html.tmp

# Add ReactDOM render and closing tags
echo '' >> index.html.tmp
echo 'ReactDOM.render(<App />, document.getElementById("root"));' >> index.html.tmp
echo '</script>' >> index.html.tmp
echo '</body>' >> index.html.tmp
echo '</html>' >> index.html.tmp

# Replace original
mv index.html.tmp index.html
echo "✅ Built index.html from src/App.jsx"
