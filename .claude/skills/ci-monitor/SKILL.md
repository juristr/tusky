---
name: ci-monitor
description: Monitor CI pipeline status. Polls CI, handles self-healing fixes, waits for success.
allowed-tools:
  - Bash
  - Task
  - mcp__nx__ci_information
  - mcp__nx__update_self_healing_fix
---

# CI Monitor Skill

Monitor Nx Cloud CI pipeline execution and handle self-healing fixes.

## Parameters

| Parameter    | Default       | Description                        |
| ------------ | ------------- | ---------------------------------- |
| `branch`     | (auto-detect) | Branch to monitor                  |
| `max-cycles` | 10            | Maximum CIPE cycles before timeout |
| `timeout`    | 120           | Maximum duration in minutes        |

## Status Table

| Status                       | Action                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ci_success`                 | Exit success                                                                                                             |
| `fix_available` (verified)   | Apply via MCP (`update_self_healing_fix` action: "APPLY"). Loop.                                                         |
| `fix_available` (unverified) | Analyze fix. If good → apply. If needs enhancement → `nx apply-locally`, enhance, commit, push. If wrong → reject, fix. |
| `fix_failed`                 | Attempt local fix from `taskOutputSummary`. Commit, push, loop.                                                          |
| `environment_issue`          | MCP rerun: `update_self_healing_fix` action: "RERUN_ENVIRONMENT_STATE". Loop.                                            |
| `no_fix`                     | Attempt local fix if possible. Otherwise exit failure.                                                                   |
| `polling_timeout`            | Exit timeout                                                                                                             |
| `cipe_canceled`              | Exit canceled                                                                                                            |
| `cipe_timed_out`             | Exit timeout                                                                                                             |
| `error`                      | Increment `no_progress_count`. If >= 3 → exit circuit breaker. Otherwise wait 60s, loop.                                 |

### Verified vs Unverified

- **Verified** (`verificationStatus == 'COMPLETED'`): Safe to auto-apply
- **Unverified**: Analyze `suggestedFix`, `suggestedFixReasoning`, `taskOutputSummary` before deciding

### Apply Flows

**Apply via MCP:** `update_self_healing_fix({ shortLink, action: "APPLY" })` - Self-healing applies in CI, new CIPE spawns automatically.

**Apply Locally:** `nx apply-locally <shortLink>` - Use when enhancing the fix before pushing.

**Reject:** `update_self_healing_fix({ shortLink, action: "REJECT" })` - Fix is wrong, will fix from scratch.

## Exit Conditions

| Condition                             | Exit Type       |
| ------------------------------------- | --------------- |
| `cipeStatus == 'SUCCEEDED'`           | Success         |
| Max cycles reached                    | Timeout         |
| Max duration reached                  | Timeout         |
| 3 consecutive no-progress iterations  | Circuit breaker |
| No fix available, local fix not possible | Failure      |

## Main Loop

### Initialize

```
cycle_count = 0
start_time = now()
no_progress_count = 0
last_state = null
```

### Poll

Spawn `nx-ci-monitor` subagent:

```
Task(
  subagent_type: "nx-ci-monitor",
  prompt: "Monitor CI for branch '<branch>'. Timeout: <timeout> minutes."
)
```

### Handle Response

1. Check returned status
2. Look up action in status table
3. Execute action (apply/reject/fix locally)
4. If looping → go to Poll step

### Progress Tracking

- State changed → reset `no_progress_count = 0`
- State unchanged → `no_progress_count++`

## Error Handling

| Error                    | Action                       |
| ------------------------ | ---------------------------- |
| Git rebase conflict      | Report, exit                 |
| `nx apply-locally` fails | Report, attempt manual patch |
| MCP tool error           | Retry once, then report      |
| Subagent spawn failure   | Retry once, then exit        |
