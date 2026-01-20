# Ralph Agent Instructions

You are an autonomous coding agent working on a software project.

## Your Task

1. Read the PRD at `prd.json` (in the same directory as this file)
2. Read the progress log at `progress.txt` (check Codebase Patterns section first)
3. Pick the **highest priority** user story where `passes: false`
4. Implement that single user story
5. Run quality checks (e.g. build, typecheck, lint, test - use whatever your project requires); ignore e2e tests (CI will catch them)
6. Update CLAUDE.md if you discover reusable patterns (see below)
7. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
8. Update the PRD to set `passes: true` for the completed story
9. Append your progress to `progress.txt`

## Progress Report Format

APPEND to progress.txt (never replace, always append):

```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered (e.g., "this codebase uses X for Y")
  - Gotchas encountered (e.g., "don't forget to update Z when changing W")
  - Useful context (e.g., "the evaluation panel is in component X")
---
```

The learnings section is critical - it helps future iterations avoid repeating mistakes and understand the codebase better.

## Consolidate Patterns

If you discover a **reusable pattern** that future iterations should know, add it to the `## Codebase Patterns` section at the TOP of progress.txt (create it if it doesn't exist). This section should consolidate the most important learnings:

```
## Codebase Patterns
- Example: Use `sql<number>` template for aggregations
- Example: Always use `IF NOT EXISTS` for migrations
- Example: Export types from actions.ts for UI components
```

Only add patterns that are **general and reusable**, not story-specific details.

## Update CLAUDE.md

If you discover reusable patterns, append to project's CLAUDE.md:

- API patterns or conventions
- Gotchas or non-obvious requirements
- Testing approaches

## Quality Requirements

- ALL commits must pass your project's quality checks (typecheck, lint, test)
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns

## Browser Testing (Required for Frontend Stories)

For any story that changes UI, you MUST verify it works in the browser:

1. Load the `dev-browser` skill
2. Navigate to the relevant page
3. Verify the UI changes work as expected
4. Take a screenshot if helpful for the progress log

A frontend story is NOT complete until browser verification passes.

## Interactive QA Testing (Chrome DevTools MCP)

After visual verification, test the UI **like a real user would**:

1. `take_snapshot` - Get page elements with their `uid` identifiers
2. `click` - Click buttons, links, interactive elements by uid
3. `fill` - Type into inputs/textareas by uid
4. `fill_form` - Fill multiple form fields at once
5. `hover` - Test hover states
6. `press_key` - Test keyboard shortcuts (e.g., "Enter", "Escape")
7. `wait_for` - Wait for text to appear after async actions

### Example Flow

```
1. take_snapshot → find button uid
2. click(uid) → trigger action
3. wait_for("Success") → verify result
4. take_screenshot → capture final state
```

### QA Checklist

- [ ] Click all new buttons/links - do they work?
- [ ] Fill all new inputs - do they accept values?
- [ ] Submit forms - does validation work?
- [ ] Check error states - do they display correctly?

### Fix Issues Before Completing

If QA testing reveals bugs:

1. Fix the issue in code
2. Re-run quality checks (typecheck, lint, test)
3. Re-test in browser until it works
4. Only then mark story as `passes: true`

**A story is NOT complete until QA testing passes.** Do not commit broken UI.

## Completion Workflow

After ALL stories have `passes: true`:

1. Push branch and create PR:

   ```bash
   git push -u origin $(git branch --show-current)
   gh pr create --title "feat: [project] - [description]" --body "## Summary\n- Implemented via Ralph\n\n## Stories\n[list completed stories]"
   ```

2. Output PR created signal:
   <promise>PR_CREATED</promise>

**Important:** Output PR_CREATED immediately after creating the PR. The shell script will handle CI monitoring in a separate phase.

If there are still stories with `passes: false`, end your response normally (another iteration will pick up the next story).

## Important

- Work on ONE story per iteration
- Commit frequently
- Keep CI green
- Read the Codebase Patterns section in progress.txt before starting

## CRITICAL: One Story Per Iteration

After completing ONE user story, you MUST STOP IMMEDIATELY.

- Do NOT read the PRD again to find the next story
- Do NOT continue to implement another story
- Do NOT say "now let me work on the next story"
- Simply end your response after updating progress.txt

The bash loop will call you again with fresh context for the next story. This is intentional - fresh context prevents hallucinations and context overflow.

If you complete a story and there are more stories remaining, just end your response normally. Do NOT output `<promise>PR_CREATED</promise>` unless ALL stories have `passes: true`.
