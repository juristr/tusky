#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop
# Usage: ./ralph.sh [max_iterations]
# FIX: Uses stream-json + force-kill to handle "No messages returned" hang

set -e

# ANSI colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

MAX_ITERATIONS=${1:-10}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"

SHOW_TOOLS=${SHOW_TOOLS:-false}  # set SHOW_TOOLS=true for tool visibility

# jq filters
STREAM_TEXT='select(.type == "assistant").message.content[]? | select(.type == "text").text // empty | gsub("\n"; "\r\n") | . + "\r\n\n"'
STREAM_WITH_TOOLS='if .type == "assistant" then
  .message.content[]? |
  if .type == "text" then .text | gsub("\n"; "\r\n") | . + "\r\n\n"
  elif .type == "tool_use" then "  → " + .name + "\r\n"
  else empty end
else empty end'
FINAL_RESULT='select(.type == "result").result // empty'

# Run claude with stream-json, detect completion, force-kill if hung
# Usage: run_claude_stream "prompt" "allowed_tools" [session_id]
# Sets OUTPUT variable with extracted text content
run_claude_stream() {
  local prompt="$1"
  local tools="$2"
  local session_arg=""
  [ -n "$3" ] && session_arg="--session-id $3"

  local tmpfile=$(mktemp)
  local filter="$STREAM_TEXT"
  [ "$SHOW_TOOLS" = true ] && filter="$STREAM_WITH_TOOLS"

  # Run pipeline in subshell for process-group kill
  (
    claude --print "$prompt" \
      --output-format stream-json \
      --verbose \
      --allowedTools "$tools" \
      $session_arg 2>/dev/null \
    | grep --line-buffered '^{' \
    | tee "$tmpfile" \
    | jq --unbuffered -rj "$filter"
  ) &
  local group_pid=$!

  # Watchdog: kill process group if result received but pipeline hangs
  (
    while kill -0 $group_pid 2>/dev/null; do
      if grep -q '"type":"result"' "$tmpfile" 2>/dev/null; then
        sleep 3
        kill -- -$group_pid 2>/dev/null || kill $group_pid 2>/dev/null
        break
      fi
      sleep 1
    done
  ) &
  local watchdog_pid=$!

  wait $group_pid 2>/dev/null || true
  kill $watchdog_pid 2>/dev/null || true
  wait $watchdog_pid 2>/dev/null || true

  # Extract result for signal detection
  OUTPUT=$(jq -r "$FINAL_RESULT" "$tmpfile" 2>/dev/null)

  if [ -n "$OUTPUT" ]; then
    echo -e "${DIM}✓ Session completed${NC}"
  else
    echo -e "${YELLOW}⚠ No result message received${NC}"
  fi

  rm -f "$tmpfile"
}

# Get PRD status: completed/total stories, current story info
get_prd_status() {
  if [ ! -f "$PRD_FILE" ]; then
    echo "0|0|||0||"
    return
  fi

  local total=$(jq '[.userStories[]] | length' "$PRD_FILE" 2>/dev/null || echo "0")
  local completed=$(jq '[.userStories[] | select(.passes == true)] | length' "$PRD_FILE" 2>/dev/null || echo "0")
  local project=$(jq -r '.projectName // "Unknown"' "$PRD_FILE" 2>/dev/null || echo "Unknown")
  local branch=$(jq -r '.branchName // "unknown"' "$PRD_FILE" 2>/dev/null || echo "unknown")

  # Get first story with passes:false (sorted by priority)
  local current_id=$(jq -r '[.userStories[] | select(.passes == false)] | sort_by(.priority) | .[0].id // ""' "$PRD_FILE" 2>/dev/null || echo "")
  local current_title=$(jq -r '[.userStories[] | select(.passes == false)] | sort_by(.priority) | .[0].title // ""' "$PRD_FILE" 2>/dev/null || echo "")
  local current_priority=$(jq -r '[.userStories[] | select(.passes == false)] | sort_by(.priority) | .[0].priority // ""' "$PRD_FILE" 2>/dev/null || echo "")
  local current_ac=$(jq '[.userStories[] | select(.passes == false)] | sort_by(.priority) | .[0].acceptanceCriteria | length' "$PRD_FILE" 2>/dev/null || echo "0")

  echo "$completed|$total|$project|$branch|$current_priority|$current_id|$current_title|$current_ac"
}

# Display PRD status banner
show_prd_status() {
  local iteration=$1
  local max=$2

  IFS='|' read -r completed total project branch priority story_id story_title ac_count <<< "$(get_prd_status)"

  local width=55
  local line=$(printf '═%.0s' $(seq 1 $width))
  local thin_line=$(printf '─%.0s' $(seq 1 $width))

  echo ""
  echo -e "${CYAN}$line${NC}"
  printf "${BOLD}  Ralph Iteration %d of %d${NC}" "$iteration" "$max"
  if [ "$total" -gt 0 ]; then
    printf "            ${GREEN}▸ %d/%d stories done${NC}\n" "$completed" "$total"
  else
    echo ""
  fi
  echo -e "${CYAN}$line${NC}"

  if [ -f "$PRD_FILE" ] && [ "$total" -gt 0 ]; then
    echo -e "  ${DIM}Project:${NC} $project ${DIM}│${NC} ${DIM}Branch:${NC} $branch"
    echo ""
    if [ -n "$story_id" ]; then
      echo -e "  ${YELLOW}▸ Working on:${NC} ${BOLD}$story_id${NC} - $story_title"
      echo -e "    ${DIM}Priority: $priority │ Acceptance criteria: $ac_count${NC}"
    fi
  fi
  echo -e "${CYAN}$thin_line${NC}"
  echo ""
}

# Show summary after iteration
show_iteration_summary() {
  local prev_completed=$1

  IFS='|' read -r completed total project branch priority story_id story_title ac_count <<< "$(get_prd_status)"

  local width=55
  local thin_line=$(printf '─%.0s' $(seq 1 $width))

  echo ""
  echo -e "${CYAN}$thin_line${NC}"

  local new_completed=$((completed - prev_completed))
  if [ "$new_completed" -gt 0 ]; then
    echo -e "  ${GREEN}✓ Completed $new_completed story/stories this iteration${NC}"
  fi

  if [ "$total" -gt 0 ]; then
    local pct=$((completed * 100 / total))
    echo -e "  ${DIM}Overall progress:${NC} ${BOLD}$completed/$total${NC} stories (${pct}%)"
  fi

  echo -e "${CYAN}$thin_line${NC}"
}

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo -e "${BOLD}Starting Ralph${NC} - Max iterations: $MAX_ITERATIONS"

for i in $(seq 1 $MAX_ITERATIONS); do
  # Capture pre-iteration status
  IFS='|' read -r prev_completed _ _ _ _ _ _ _ <<< "$(get_prd_status)"

  # Show iteration banner with PRD status
  show_prd_status "$i" "$MAX_ITERATIONS"

  # Run claude with the ralph prompt (using stream-json workaround)
  RALPH_PROMPT=$(cat "$SCRIPT_DIR/prompt.md")
  if [ -z "$RALPH_PROMPT" ]; then
    echo -e "${YELLOW}Error: prompt.md is empty or missing${NC}"
    exit 1
  fi
  run_claude_stream "$RALPH_PROMPT" 'Bash(git:*) Bash(jq:*) Bash(pnpm:*) Bash(npm:*) Bash(nx:*) Bash(mkdir:*) Bash(gh:*) Read Write Edit Glob Grep Task mcp__nx__ci_information mcp__nx__update_self_healing_fix'

  # Show iteration summary
  show_iteration_summary "$prev_completed"

  # Check for implementation done signal - exit loop, proceed to PR phase
  if echo "$OUTPUT" | grep -q "<promise>IMPLEMENTATION_DONE</promise>"; then
    echo ""
    echo -e "${GREEN}${BOLD}All stories implemented!${NC}"
    break
  fi

  echo ""
  echo -e "${DIM}Iteration $i complete. Continuing...${NC}"
  sleep 2
done

# Check if we exited loop due to completion or max iterations
IFS='|' read -r completed total _ _ _ _ _ _ <<< "$(get_prd_status)"
if [ "$completed" -lt "$total" ]; then
  echo ""
  echo -e "${YELLOW}Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks.${NC}"
  echo -e "${DIM}Check $PROGRESS_FILE for status.${NC}"
  exit 1
fi

# ═══════════════════════════════════════════════════════
# Phase 2: PR Creation + CI Monitoring
# ═══════════════════════════════════════════════════════

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  Phase 2: PR Creation + CI Monitoring${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

# Generate session ID for PR+CI phase (allows spying with: claude --resume $SESSION_ID)
CI_SESSION_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
echo -e "${DIM}Session: ${CYAN}$CI_SESSION_ID${NC}"
echo -e "${DIM}Spy with: claude --resume $CI_SESSION_ID${NC}"
echo ""

echo -e "${DIM}Starting PR creation + CI monitor...${NC}"
echo -e "${DIM}CI Session ID: ${CYAN}$CI_SESSION_ID${NC}"

CI_PROMPT="1. Commit all changes
2. Push branch and create PR (use gh cli)
3. Monitor CI using the nx ci monitor skill

When CI passes, output: <promise>COMPLETE</promise>
If CI fails and cannot be fixed after self-healing attempts, output: <promise>FAILED</promise>"

run_claude_stream "$CI_PROMPT" 'Bash(git:*) Bash(nx:*) Bash(gh:*) Read Write Edit Task mcp__nx-mcp__ci_information mcp__nx-mcp__update_self_healing_fix' "$CI_SESSION_ID"

if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
  echo ""
  echo -e "${GREEN}${BOLD}Ralph completed - CI passed!${NC}"
  exit 0
else
  echo -e "${YELLOW}CI monitoring ended without success${NC}"
  exit 1
fi
