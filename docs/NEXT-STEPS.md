# Adventure OS — concrete next steps

This document is the current execution plan. It should be updated whenever scope or sequencing changes.

## Current state

- Repository foundation exists and builds on `main`.
- Sprint 1A functional shell is in PR #4.
- All data is mock data.
- No external systems, production credentials or write access are connected.

## UI strategy

Adventure OS will use:

- Next.js App Router
- React + TypeScript strict
- Tailwind CSS
- shadcn/ui primitives
- Shadcn Studio blocks/components where they materially improve the interface
- Lucide icons
- Playwright tests

Shadcn components are copied into the project source rather than consumed as a conventional black-box UI package. Every installed component therefore becomes local code that can be reviewed, adapted and versioned.

## Shadcn Studio MCP role

Shadcn Studio MCP is an IDE-side design/development helper. It can:

- find and install Shadcn Studio blocks;
- customize an existing block with `/cui`;
- refine an installed block with `/rui`;
- generate inspired UI with `/iui` where the Pro plan permits it;
- install recognized blocks from Figma with `/ftc` when Figma MCP is also configured.

It is not part of the production runtime. Adventure OS must continue to work if the MCP server is unavailable.

## Required setup before using Studio MCP

1. Ensure standard shadcn/ui is initialized in this repository.
2. Add and validate `components.json`.
3. Configure aliases for `components`, `ui`, `lib` and `hooks`.
4. Create `lib/utils.ts` with the project `cn()` helper.
5. Install a minimal approved primitive set first.
6. Add Shadcn Studio MCP configuration locally in the chosen IDE.
7. Store the Shadcn Studio license/API key only in local IDE or secret storage. Never commit it or paste it into issues, PRs or source files.
8. Run Studio MCP one component/block at a time on a dedicated branch.
9. Review generated code, then run lint, typecheck, tests and build before merge.

## Initial approved component set

Install only the components needed for the shell:

- button
- card
- badge
- input
- textarea
- command
- sidebar
- sheet
- tabs
- dropdown-menu
- tooltip
- separator
- skeleton
- scroll-area
- resizable

Additional components require a concrete screen-level need.

## Component installation policy

For every new block or component:

1. Define which screen and user problem it solves.
2. Search existing local components first.
3. Install or generate exactly one block/component.
4. Keep it isolated in a feature branch.
5. Replace demo content with typed Adventure OS data.
6. Remove unused dependencies, images and placeholder code.
7. Use semantic design tokens rather than hard-coded styling where practical.
8. Add empty/loading/error states where the component displays data.
9. Add or update Playwright coverage.
10. Merge only after CI passes.

## Execution sequence

### Step 1 — complete Sprint 1A

- Make PR #4 pass CI.
- Merge functional navigation and typed mock data.
- Close issue #3.

### Step 2 — create clickable preview

Preferred first option: deploy a mock-only preview through the existing Cloudflare/Dokploy infrastructure.

Requirements:

- no production credentials;
- no external connectors;
- clearly labelled prototype mode;
- optional Cloudflare Access restriction;
- automatic redeploy from `main` or a dedicated preview branch.

### Step 3 — initialize shadcn properly

- add `components.json`;
- add `lib/utils.ts`;
- create `components/ui/`;
- install the initial approved primitives;
- document exact installed component names and sources.

### Step 4 — configure Shadcn Studio MCP locally

This requires a local AI-enabled IDE supported by Shadcn Studio, such as VS Code, Cursor, Windsurf or Claude Code.

The owner/developer must obtain the MCP onboarding configuration from the Shadcn Studio account. The secret portion stays local. The repository receives only non-secret project configuration and instruction files.

### Step 5 — migrate shell to approved components

Replace prototype markup incrementally:

- navigation → Sidebar
- search → Command
- signal blocks → Card + Badge
- AI panel → Resizable panel or Sheet
- filters → Tabs + Dropdown Menu
- loading states → Skeleton
- dense areas → Scroll Area

Do not redesign all screens in one generation request.

### Step 6 — Matrix v2

Build the first spatial interaction model:

- organisations on one axis;
- projects/workstreams on another;
- attention/status as visual depth;
- horizontal navigation;
- filtering and zoom;
- drill-down while preserving context;
- mock data only.

### Step 7 — Entity Graph prototype

Create a connected view for organisations, projects, people, groups, documents and payments. Relationships must carry confidence states:

- confirmed
- probable
- suggested

### Step 8 — read-only source inventory

Only after the visual interaction model is approved:

- Google Drive
- Notion
- Gmail
- Google Calendar
- Adventure Hub

The first integration phase indexes and reads. It does not reorganize, delete, send or alter source data.

## Immediate next task

After PR #4 is green and merged, create a separate branch and PR for:

`chore/shadcn-foundation`

Deliverables:

- valid `components.json`;
- `lib/utils.ts`;
- initial approved primitives;
- component inventory documentation;
- CI passing;
- no visual wholesale redesign yet.
