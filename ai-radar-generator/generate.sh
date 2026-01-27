#!/bin/bash
# Convenience script to generate the AI Radar PDF
# Sets the required environment variables for WeasyPrint on macOS

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Set library path for Homebrew libraries (required for WeasyPrint on macOS)
export DYLD_LIBRARY_PATH="/opt/homebrew/lib:$DYLD_LIBRARY_PATH"

# Activate virtual environment and run generator
cd "$SCRIPT_DIR"
if command -v bun >/dev/null 2>&1; then
  echo "🧩 Building radar.html from MDX (bun)"
  bun run build:html || { echo "❌ Failed to build radar.html"; exit 1; }
else
  echo ""
  echo "❌ Error: bun is not installed"
  echo ""
  echo "   Bun is required to build the radar HTML from MDX files."
  echo ""
  echo "   Install bun:"
  echo "     • macOS/Linux: curl -fsSL https://bun.sh/install | bash"
  echo "     • Homebrew:    brew install oven-sh/bun/bun"
  echo "     • Windows:     powershell -c \"irm bun.sh/install.ps1|iex\""
  echo ""
  echo "   Or visit: https://bun.sh"
  echo ""
  exit 1
fi
source venv/bin/activate
python generate.py "$@"
