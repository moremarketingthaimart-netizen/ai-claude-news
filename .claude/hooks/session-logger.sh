#!/bin/bash
# Logs Bash tool usage to .claude/logs/session.log

LOG_DIR="/Users/thanet/ai-claude-news/.claude/logs"
LOG_FILE="$LOG_DIR/session.log"

mkdir -p "$LOG_DIR"

TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-unknown}"

# Only log bash commands, trim to 120 chars
CMD_SHORT=$(echo "$TOOL_INPUT" | head -c 120)
echo "[$TIMESTAMP] $CMD_SHORT" >> "$LOG_FILE"

# Keep last 500 lines only
tail -n 500 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
