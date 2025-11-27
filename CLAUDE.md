<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly

<!-- nx configuration end-->

- use Nx generators to setup new projects whenever possible.

## After concluding your work

Run `pnpm nx format:write` after every change to adjust formatting.
