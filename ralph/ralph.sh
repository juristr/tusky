#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop
# Usage: ./ralph.sh [max_iterations]

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
ARCHIVE_DIR="$SCRIPT_DIR/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"

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

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    # Archive the previous run
    DATE=$(date +%Y-%m-%d)
    # Strip "ralph/" prefix from branch name for folder
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    echo "Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Archived to: $ARCHIVE_FOLDER"

    # Reset progress file for new run
    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# Track current branch
if [ -f "$PRD_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  fi
fi

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

  # Run claude with the ralph prompt
  OUTPUT=$(claude --print "$(cat "$SCRIPT_DIR/prompt.md")" --allowedTools 'Bash(git:*) Bash(jq:*) Bash(pnpm:*) Bash(npm:*) Bash(nx:*) Bash(mkdir:*) Bash(gh:*) Read Write Edit Glob Grep Task mcp__nx__ci_information mcp__nx__update_self_healing_fix' 2>&1 | tee /dev/stderr) || true

  # Show iteration summary
  show_iteration_summary "$prev_completed"

  # Check for PR created signal - start CI monitor phase
  if echo "$OUTPUT" | grep -q "<promise>PR_CREATED</promise>"; then
    echo ""
    echo -e "${GREEN}${BOLD}PR created! Starting CI monitoring...${NC}"

    # Run CI monitor with 60 min timeout
    CI_OUTPUT=$(timeout 3600 claude --print "Run /nx:ci-monitor. When CI passes, output <promise>COMPLETE</promise>. If CI fails and cannot be fixed, output <promise>FAILED</promise>." \
      --allowedTools 'Bash(git:*) Bash(nx:*) Read Write Edit Task mcp__nx-mcp__ci_information mcp__nx-mcp__update_self_healing_fix' 2>&1 | tee /dev/stderr) || true

    if echo "$CI_OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
      echo -e "${GREEN}${BOLD}Ralph completed - CI passed!${NC}"
      exit 0
    else
      echo -e "${YELLOW}CI monitoring ended without success${NC}"
      exit 1
    fi
  fi

  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo -e "${GREEN}${BOLD}Ralph completed all tasks!${NC}"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  echo ""
  echo -e "${DIM}Iteration $i complete. Continuing...${NC}"
  sleep 2
done

echo ""
echo -e "${YELLOW}Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks.${NC}"
echo -e "${DIM}Check $PROGRESS_FILE for status.${NC}"
exit 1
