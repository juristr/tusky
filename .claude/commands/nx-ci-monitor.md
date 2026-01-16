---
description: 'Monitor Nx Cloud CI pipeline and handle self-healing fixes automatically'
argument-hint: '[instructions] [--max-cycles N] [--timeout MINUTES] [--branch BRANCH] [--fresh]'
allowed-tools:
  - Bash
  - Task
  - mcp__nx__ci_information
  - mcp__nx__update_self_healing_fix
---

# Nx CI Monitor Command

Invoke the `ci-monitor` skill with parsed arguments.

## Context

- **Branch:** !`git branch --show-current`
- **Commit:** !`git rev-parse --short HEAD`
- **Remote Status:** !`git status -sb | head -1`

## Arguments

$ARGUMENTS

## Configuration

| Setting        | Default       | Description                        |
| -------------- | ------------- | ---------------------------------- |
| `--max-cycles` | 10            | Maximum CIPE cycles before timeout |
| `--timeout`    | 120           | Maximum duration in minutes        |
| `--branch`     | (auto-detect) | Branch to monitor                  |
| `--fresh`      | false         | Ignore previous context            |

Parse overrides from `$ARGUMENTS` and pass to the `ci-monitor` skill.

## Session Context

Within a Claude Code session, context persists. If you Ctrl+C and re-run `/nx-ci-monitor`, it continues from where it left off.

- **Continue:** Just re-run `/nx-ci-monitor`
- **Fresh start:** Use `--fresh` flag
- **Clean slate:** Exit and restart `claude`

## Execution

Load and execute the `ci-monitor` skill with:
- Parsed configuration from arguments
- Current branch context
- Any user-provided instructions

The skill handles all polling, fix application, and exit conditions.
