#!/usr/bin/env bash
# Benchmark `nx run-many -t lint` for before/after comparisons.
#
# Usage:
#   tools/perf/bench-lint.sh <label> [runs]
#
# Examples:
#   tools/perf/bench-lint.sh before        # 3 cold runs
#   tools/perf/bench-lint.sh after 5       # 5 cold runs
#
# Each run:
#   - clears the Nx local cache (cold run)
#   - invokes `nx run-many -t lint --skip-nx-cache --parallel=<N>`
#   - records wall time, user/sys CPU and max RSS via /usr/bin/time -l
#
# Outputs:
#   tools/perf/results/<label>/<timestamp>/run-<n>.log   (full lint output)
#   tools/perf/results/<label>/<timestamp>/run-<n>.time  (time -l output)
#   tools/perf/results/<label>/<timestamp>/summary.json  (aggregated stats)
#   tools/perf/results/<label>/<timestamp>/summary.md    (human readable)

set -euo pipefail

LABEL="${1:-}"
RUNS="${2:-3}"
PARALLEL="${PARALLEL:-3}"

if [[ -z "$LABEL" ]]; then
  echo "usage: $0 <label> [runs]" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="$REPO_ROOT/tools/perf/results/$LABEL/$TIMESTAMP"
mkdir -p "$OUT_DIR"

# Capture some environment metadata.
{
  echo "label: $LABEL"
  echo "timestamp: $TIMESTAMP"
  echo "runs: $RUNS"
  echo "parallel: $PARALLEL"
  echo "node: $(node -v 2>/dev/null || echo n/a)"
  echo "pnpm: $(pnpm -v 2>/dev/null || echo n/a)"
  echo "nx: $(npx --no-install nx --version 2>/dev/null || echo n/a)"
  echo "git_sha: $(git rev-parse --short HEAD 2>/dev/null || echo n/a)"
  echo "git_status:"
  git status --short 2>/dev/null || true
} > "$OUT_DIR/env.txt"

# Collect wall-time (in seconds) from each run for a simple mean/min/max.
TIMES=()

for i in $(seq 1 "$RUNS"); do
  echo ""
  echo "=== $LABEL | run $i/$RUNS ==="

  # Cold cache: wipe Nx local cache so every run does the full work.
  npx --no-install nx reset >/dev/null 2>&1 || true
  rm -rf "$REPO_ROOT/.nx/cache" "$REPO_ROOT/tmp/nx-cache" 2>/dev/null || true

  LOG="$OUT_DIR/run-$i.log"
  TIME_FILE="$OUT_DIR/run-$i.time"

  START_EPOCH=$(date +%s)

  # /usr/bin/time -l (macOS) prints wall, user, sys + max RSS to stderr.
  # We redirect time output to its own file so the lint log stays clean.
  set +e
  /usr/bin/time -l -o "$TIME_FILE" \
    npx --no-install nx run-many -t lint \
      --skip-nx-cache \
      --parallel="$PARALLEL" \
      > "$LOG" 2>&1
  EXIT_CODE=$?
  set -e

  END_EPOCH=$(date +%s)
  WALL=$((END_EPOCH - START_EPOCH))
  TIMES+=("$WALL")

  echo "exit: $EXIT_CODE | wall: ${WALL}s"
  echo "  log : $LOG"
  echo "  time: $TIME_FILE"
done

# Aggregate stats.
MIN="${TIMES[0]}"
MAX="${TIMES[0]}"
SUM=0
for t in "${TIMES[@]}"; do
  (( t < MIN )) && MIN=$t
  (( t > MAX )) && MAX=$t
  SUM=$((SUM + t))
done
MEAN=$(awk "BEGIN {printf \"%.2f\", $SUM/${#TIMES[@]}}")

# JSON summary.
{
  echo "{"
  echo "  \"label\": \"$LABEL\","
  echo "  \"timestamp\": \"$TIMESTAMP\","
  echo "  \"runs\": $RUNS,"
  echo "  \"parallel\": $PARALLEL,"
  printf "  \"wall_seconds\": ["
  for idx in "${!TIMES[@]}"; do
    printf "%s" "${TIMES[$idx]}"
    [[ $idx -lt $((${#TIMES[@]} - 1)) ]] && printf ", "
  done
  echo "],"
  echo "  \"min\": $MIN,"
  echo "  \"max\": $MAX,"
  echo "  \"mean\": $MEAN"
  echo "}"
} > "$OUT_DIR/summary.json"

# Markdown summary.
{
  echo "# Lint benchmark: $LABEL"
  echo ""
  echo "- timestamp: \`$TIMESTAMP\`"
  echo "- runs: $RUNS (parallel=$PARALLEL, --skip-nx-cache, cache reset each run)"
  echo "- git sha: $(git rev-parse --short HEAD 2>/dev/null || echo n/a)"
  echo ""
  echo "## Wall time (seconds)"
  echo ""
  echo "| run | wall (s) |"
  echo "| --- | --- |"
  for idx in "${!TIMES[@]}"; do
    echo "| $((idx + 1)) | ${TIMES[$idx]} |"
  done
  echo ""
  echo "- min: ${MIN}s"
  echo "- max: ${MAX}s"
  echo "- mean: ${MEAN}s"
  echo ""
  echo "Detailed \`/usr/bin/time -l\` output per run is in \`run-N.time\`."
} > "$OUT_DIR/summary.md"

echo ""
echo "=== done: $LABEL ==="
echo "min=${MIN}s max=${MAX}s mean=${MEAN}s"
echo "results: $OUT_DIR"
