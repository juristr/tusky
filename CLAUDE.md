<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- For understanding the workspace structure, projects, or available tasks, use the `/nx-workspace` skill which provides guidance on exploring Nx workspaces
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` MCP tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

- prefer the use of Nx generators to create new projects in this workspace.
