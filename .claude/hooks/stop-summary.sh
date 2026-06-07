#!/bin/bash
# Runs when Claude Code session stops — shows quick session summary

TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
PROJECT_DIR="/Users/thanet/ai-claude-news"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ai-claude-news | Session ended: $TIMESTAMP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Show git status if any changes
if git -C "$PROJECT_DIR" rev-parse --git-dir > /dev/null 2>&1; then
  CHANGED=$(git -C "$PROJECT_DIR" status --porcelain | wc -l | tr -d ' ')
  if [ "$CHANGED" -gt "0" ]; then
    echo "  📝 Uncommitted changes: $CHANGED file(s)"
    git -C "$PROJECT_DIR" status --short | head -10 | sed 's/^/     /'
  else
    echo "  ✅ Working tree clean"
  fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
