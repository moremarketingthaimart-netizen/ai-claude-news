#!/bin/bash
# Alerts when token usage is high during a session

TOKEN_COUNT="${CLAUDE_TOKEN_COUNT:-0}"
THRESHOLD=50000

if [ "$TOKEN_COUNT" -gt "$THRESHOLD" ]; then
  echo ""
  echo "⚠️  Token Alert: ${TOKEN_COUNT} tokens used (threshold: ${THRESHOLD})"
  echo "   Consider starting a new session if context is getting large."
  echo ""
fi
