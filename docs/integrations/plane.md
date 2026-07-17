# Plane — Read-Only Task Integration Discovery

## Status

**Discovery only. No integration is live.** Unlike the AdventureHub discovery
(`docs/integrations/adventure-hub.md`), no client-supplied documents existed
for Plane in this session, and no Plane MCP connector was enabled here. This
document is instead grounded in the **official vendor-published packages**:

- [`@makeplane/plane-node-sdk`](https://www.npmjs.com/package/@makeplane/plane-node-sdk)
  v0.2.11 — published by `plane-engineering` via a GitHub OIDC trusted
  publisher (`engineering@plane.so`).
- [`@makeplane/plane-mcp-server`](https://www.npmjs.com/package/@makeplane/plane-mcp-server)
  v0.1.5 — same publisher.

Both were downloaded from the npm registry (reachable from this session;
`api.plane.so` and Plane's documentation site were not — see
[Session constraints](#session-constraints)) and read directly: the SDK's
compiled JavaScript (not just its type declarations) was inspected for
`docs/integrations/adventure-hub.md`-style empirical confirmation of header
names, endpoint paths, and default base URLs — this is vendor *source code*,
not vendor *marketing copy*, which is why claims below are cited to specific
files rather than to prose documentation.

## Source material

| Source | What it confirms |
|---|---|
| `plane-node-sdk` `dist/api/BaseResource.js` | Exact auth header names, base path, error handling |
| `plane-node-sdk` `dist/Configuration.js` | Default base URL, required config |
| `plane-node-sdk` `dist/api/**/*.js` | Exact endpoint paths and HTTP methods actually called |
| `plane-node-sdk` `dist/types.bundle.d.ts` | Field-level shapes for WorkItem, State, Project, User, Cycle |
| `plane-mcp-server` `README.md` | Confirms an official MCP server exists, its full tool list, and its own configuration contract |

**Not available in this session:** Plane's own hosted API reference
(`developers.plane.so`) — blocked by this environment's egress policy (see
below) — and no direct live API call was made. Everything here is what the
vendor's own client code does, which is a strong source, but it has not been
independently exercised against a live workspace by this session.

## Session constraints

This environment has **no general internet access** — not specific to
Plane. `curl` to `developers.plane.so` and even `www.google.com` both fail
identically (`403` `CONNECT` rejection at the proxy, confirmed via
`$HTTPS_PROXY/__agentproxy/status`). Package registries
(`registry.npmjs.org`, `pypi.org`, etc.) are the explicit exception — which
is exactly how the vendor packages above were obtained. No Plane API key,
workspace, or MCP connector was available to this session, so nothing here
was exercised against a real workspace.

## Official integration paths

Two officially supported paths exist, confirmed by the packages above:

1. **Direct REST API** via a static workspace API key (what this PR's
   adapter uses).
2. **Official MCP server** (`@makeplane/plane-mcp-server`) — exists, but its
   published tool list (see below) has **no bulk issue-listing or
   filtering tool**. It can fetch a single issue by identifier
   (`get_issue_using_readable_identifier`) or issues within one module/cycle,
   but nothing resembling "issues assigned to user X" or "issues due
   today." **The MCP server alone cannot serve Mission Control's stated
   goal** — the direct REST API (via this adapter, or a future custom MCP
   tool built on top of it) is required.

## Authentication

Confirmed from `Configuration.js` / `BaseResource.js`:

- Static token: header **`X-Api-Key: <token>`**. Generated in the Plane app
  at **Workspace Settings → API Tokens** (`/settings/api-tokens/`), per the
  MCP server's own README — this is the mechanism the official MCP server
  uses (`PLANE_API_KEY` env var).
- A second, separate OAuth2 flow also exists in the SDK
  (`client/oauth-client.js`: authorization URL, Basic-auth code exchange,
  then `Authorization: Bearer <token>`) — more complex, app-registration
  flow, not needed for a single-workspace internal read integration. Not
  used by this PR.
- `Content-Type: application/json` on every request.
- **Not documented anywhere in either package:** rate limits, token
  expiry/rotation policy for the static API key.

The static API key **is a real secret** (unlike AdventureHub's anonymous
JWT) — it must never be committed. See [What this PR
implements](#what-this-pr-implements).

## Base URL and API surface

- Default base URL: **`https://api.plane.so`** (`Configuration.js`:
  `this.baseUrl = config.baseUrl || "https://api.plane.so"`).
- Self-hosted Plane instances override this (`PLANE_API_HOST_URL` in the MCP
  server, `baseUrl` in the SDK config) — relevant if Durmitor ever
  self-hosts Plane; not assumed here.
- Every request is prefixed with **`/api/v1`** (`BaseResource.js`:
  `apiBasePath = "/api/v1"`).
- Every endpoint below is **workspace-scoped** by a `workspaceSlug` path
  segment — the slug visible in the Plane app's URL. There is no
  documented way to discover it via API; it must be configured.

## Confirmed endpoints (read surface relevant to this PR)

All paths below are exact strings taken from the SDK's compiled JS, appended
to `{baseUrl}/api/v1`.

| Method | Path | Resource | Notes |
|---|---|---|---|
| `GET` | `/users/me/` | Current user | Confirms auth; needed to resolve "assigned to me" |
| `GET` | `/workspaces/{slug}/members/` | Workspace members | Needed to resolve assignee IDs → names for "delegated to other team members" |
| `GET` | `/workspaces/{slug}/projects/` | Projects | `params: { limit?, offset? }` only — no filtering |
| `GET` | `/workspaces/{slug}/projects/{projectId}/work-items/` | Work items in one project | `params: ListWorkItemsParams` — see below |
| `GET` | `/workspaces/{slug}/work-items/{identifier}/` | One work item by readable ID (e.g. `PROJ-123`) | Workspace-scoped, not project-scoped |
| `GET` | `/workspaces/{slug}/work-items/search/` | Workspace-wide text search | `params: { search, project? }` — filter contract for assignee/date **not confirmed** |
| `POST` | `/workspaces/{slug}/work-items/advanced-search/` | Workspace-wide structured search | Body: `{ query?, filters?, limit? }` — `filters` is a recursive AND/OR tree of **untyped** keys (`[key: string]: unknown` in the SDK's own types) |
| `GET` | `/workspaces/{slug}/projects/{projectId}/cycles/` | Cycles in one project | No workspace-wide cycle list confirmed |
| `GET` | `/workspaces/{slug}/projects/{projectId}/states/` | States in one project | Needed to resolve `WorkItem.state` (an ID) to its `group` for canonical status |

`ListWorkItemsParams` (confirmed shape, `types.bundle.d.ts`):

```ts
{ project?: string; state?: string; assignee?: string; limit?: number; offset?: number; pql?: string }
```

**`assignee` accepts exactly one value** — its expected format (a user UUID)
is inferred from the `User.id` type, not documented as accepting a `"me"`
shorthand or multiple values. **`pql`** (Plane Query Language) is a
free-text query parameter whose syntax is not documented in either package
— present but unusable without external documentation.

## Confirmed data shapes

### WorkItem (task)

```ts
{
  id: string; created_at: Date; updated_at: Date; deleted_at?: Date;
  created_by: string; updated_by?: string;
  name: string;
  sequence_id: number;              // combine with Project.identifier for "PROJ-123"
  description_html?: string;
  project: string;                  // project ID
  labels?: string[];
  assignees?: string[];             // user IDs — a work item can have MULTIPLE assignees
  type?: string;
  state?: string;                   // State ID, not a status string — see State below
  parent?: string;
  is_draft?: boolean;
  archived_at?: string;
  completed_at?: string;
  target_date?: string;             // this is the due date
  start_date?: string;
  priority?: "urgent" | "high" | "medium" | "low" | "none";
}
```

### State (status)

```ts
{ id: string; name: string; color: string; group?: "backlog" | "unstarted" | "started" | "completed" | "cancelled" | "triage"; project?: string; ... }
```

States are **per-project and custom-named** — `name` is not a reliable
cross-project status value. `group` is the vendor's own canonical bucket and
is what this PR's mapping uses (see below).

### Project

```ts
{ id: string; name: string; identifier?: string; workspace: string; ... }
```

`identifier` (e.g. `"PROJ"`) + `WorkItem.sequence_id` is how the
human-readable ID (`PROJ-123`) is constructed — it is **not** returned
directly on a `WorkItem` from the list/retrieve-by-UUID endpoints, only from
`retrieveByIdentifier` (which requires already knowing it). A project lookup
is required to resolve one direction or the other.

### Pagination

```ts
{ count: number; total_count: number; total_pages: number; results: T[]; next_cursor?: string; prev_cursor?: string; ... }
```

Both `limit`/`offset` (request) and `next_cursor`/`prev_cursor` (response)
appear together in the confirmed shapes — which pagination style the server
actually expects/honors is not disambiguated by the type definitions alone.

## Investigated: the four requested query capabilities

| Capability | Available? | Detail |
|---|---|---|
| Tasks assigned to the current user | **Partial, per-project only** | `GET /users/me/` resolves the current user's ID; `ListWorkItemsParams.assignee` filters by exactly one user ID — but only **within one project at a time**. No confirmed single call returns "my tasks across the whole workspace." |
| Tasks due today or overdue | **Not directly** | `target_date` exists on every work item, but no confirmed query parameter filters by date or date range. Must fetch (by project + optionally by assignee) and compare `target_date` to the current date client-side. |
| Tasks delegated to other team members | **Same shape as "assigned to me"** | Same `assignee` filter, any workspace member's user ID (resolved via `GET /workspaces/{slug}/members/`) — same per-project limitation applies. |
| Workspaces, projects, issues, cycles | **Projects and per-project issues/cycles confirmed; no workspace-wide issue or cycle aggregation confirmed** | `GET /workspaces/{slug}/projects/` is workspace-wide. Work items and cycles are only confirmed listable **within a single project** via `list()`. The `advanced-search` endpoint is the only confirmed workspace-wide issue query, but its filter vocabulary isn't documented in the sources available here. |

**Bottom line:** reading "my tasks due today, across every project, plus
what I've delegated to others" as a single call is **not a confirmed
capability**. The safest supported approach is: list projects once, then
list work items per project with the `assignee` filter, then merge and
filter by `target_date` client-side. That's what this PR's adapter and
mapping are built for — not a workspace-wide shortcut that isn't confirmed
to exist.

## Explicit gaps and permission requirements

- **Gap:** no confirmed single endpoint for cross-project "my tasks" or
  "due today/overdue" — requires per-project iteration (see above).
- **Gap:** `advanced-search`'s filter key vocabulary (e.g. whether
  `assignees` or `target_date` are valid filter keys, and what operators are
  supported) is not documented in either package — do not guess it into the
  adapter.
- **Gap:** `pql` syntax is undocumented.
- **Gap:** rate limits are undocumented.
- **Gap:** whether the human-readable identifier (`PROJ-123`) is returned on
  list/search results (only confirmed present when already known, via
  `retrieveByIdentifier`) — the mapping below treats it as absent unless a
  project lookup is also performed.
- **Permission requirement:** the static API key is generated per-workspace
  at Workspace Settings → API Tokens by a workspace admin/member with access
  to that settings page — this is a real credential (unlike AdventureHub's
  anonymous auth) and needs to be requested from whoever administers the
  Durmitor Plane workspace, then stored in approved secret storage per
  `docs/MCP_INTEGRATIONS.md` ("Secret handling: access token stays in
  approved secret storage, never in repository files").
- **Permission requirement:** reading other members' assigned tasks
  ("delegated to other team members") depends on what the API key's role
  can see — member-level keys may be restricted to their own assignments in
  some Plane workspace configurations; this session cannot confirm either
  way without a live key.
- **Open question carried from `docs/DOMAIN_MODEL.md`:** "Whether Plane
  should hold only Tasks or also Projects and Ideas" — unresolved by this
  discovery, unrelated to the API's technical shape.

## Canonical task mapping

`docs/DOMAIN_MODEL.md` defines Task as "a concrete action with an owner,
status and optional due date," with lifecycle fields `status`, `createdAt`,
`updatedAt`, `sourceRefs[]`, `ownerRef`, `confidence`, `archivedAt` among
others, and `docs/KNOWLEDGE_GRAPH.md` defines `SourceReference` with
`system`, `objectType`, `externalId`, `observedAt`. `"plane"` is already a
literal in that `SourceReference.system` union. The mapping implemented in
`lib/adapters/plane/mapping.ts`:

| Adventure OS canonical field | From Plane | Note |
|---|---|---|
| `status` | `State.group` (via a separate state lookup, not the raw `WorkItem.state` ID) | Six-value enum, vendor-normalized — not per-project state names |
| `title` | `WorkItem.name` | |
| `priority` | `WorkItem.priority` | Already a closed enum, passed through |
| `dueDate` | `WorkItem.target_date` | Nullable |
| `assigneeIds` | `WorkItem.assignees` | Array — Plane supports multiple assignees per task; canonical `ownerRef` is not a clean 1:1 fit (see below) |
| `createdAt` / `updatedAt` / `archivedAt` | `WorkItem.created_at` / `updated_at` / `archived_at` | |
| `sourceRefs[0]` | `{ system: "plane", objectType: "work_item", externalId: WorkItem.id, observedAt: <fetch time> }` | Per `KNOWLEDGE_GRAPH.md`'s confirmed shape |
| `confidence` | Not set by the mapper | Confidence is a knowledge-graph relationship concept (`DOMAIN_MODEL.md` §"Relationship confidence") — a directly-fetched task from its authoritative system doesn't need one; left for the caller if a derived/inferred link is built later |

**Known mismatch, not resolved by this mapping:** the canonical model's
`ownerRef` is singular; Plane's `assignees` is an array. The mapper exposes
`assigneeIds: string[]` and does not collapse it to a single `ownerRef` —
that decision (first assignee? all as separate participant edges?) belongs
to whoever wires this into the knowledge graph, not to a read-only discovery
adapter.

## Service interface

Everything Plane-specific is isolated behind one interface,
`TaskService` (`lib/tasks/task-service.ts`):

```ts
interface TaskService {
  getCurrentUser(): Promise<CanonicalTaskUser>;
  listTasks(filter?: TaskFilter): Promise<CanonicalTask[]>;
}
```

`lib/tasks/` (the interface plus `CanonicalTask`, `CanonicalTaskUser`,
`TaskFilter`, `SourceReference`) has **zero imports from any adapter** —
verified by grep, not just by convention. `PlaneTaskService`
(`lib/adapters/plane/task-service.ts`) is the only class that implements the
interface today; it's also the only place outside `lib/adapters/plane/`
itself that's allowed to know Plane exists. It does the per-project
iteration and client-side due-date filtering the confirmed API gaps above
require, and returns only `CanonicalTask[]` / `CanonicalTaskUser` — never a
`PlaneWorkItem` or `PlaneUser`.

Mission Control (or any future consumer) would depend on `TaskService` and
`CanonicalTask` only. Replacing Plane with a different task system later
means writing a new class that implements `TaskService` — no consumer
changes. This PR does not wire a `TaskService` into Mission Control; it
only establishes the boundary.

## What this PR implements

- `lib/adapters/plane/types.ts` — types for the confirmed shapes above, each
  annotated with its source.
- `lib/adapters/plane/client.ts` — read-only client: `getCurrentUser()`,
  `listWorkspaceMembers()`, `listProjects()`, `listWorkItems(projectId,
  params)`, `getWorkItemByIdentifier(identifier)`. **No create/update/delete
  method exists** — this discovery is read-only by design, matching the
  brief.
- `lib/adapters/plane/mapping.ts` — the canonical task mapping above, as a
  pure function (`toCanonicalTask(workItem, state)`).
- `lib/tasks/{types,task-service,index}.ts` — the source-agnostic
  `TaskService` interface and canonical types (see "Service interface"
  above). No Plane import anywhere in this directory.
- `lib/adapters/plane/task-service.ts` — `PlaneTaskService`, the concrete
  `TaskService` implementation, plus a `createPlaneTaskService()` factory.
- `.env.example` — `PLANE_API_KEY` (placeholder only — **never a real
  value**), `PLANE_WORKSPACE_SLUG`, `PLANE_API_BASE_URL` (optional,
  self-hosted override).
- `scripts/plane-smoke.ts` — authenticates via `GET /users/me/`, then makes
  one safe `GET /workspaces/{slug}/projects/` call. Not wired into CI, for
  the same reason as the AdventureHub smoke test: real credentials and
  network egress this repository's CI shouldn't depend on.
- **Not connected to Mission Control or any other page.**

## Next steps (not part of this PR)

1. Request a Plane API token from whoever administers the Durmitor
   workspace, store it in approved secret storage, and run
   `bun run plane:smoke` from an environment with real egress to confirm
   this document against the live API.
2. Once confirmed live, resolve the per-project iteration question: either
   accept "iterate every project the user is a member of" as the real
   implementation, or get Plane/community confirmation of the
   `advanced-search` filter vocabulary to do it in one call.
3. Resolve `docs/DOMAIN_MODEL.md`'s open question on whether Plane holds
   only Tasks or also Projects/Ideas before wiring this into the knowledge
   graph.
4. Only after the above: connect to Mission Control's "Waiting for me" /
   "Waiting for team" / "Open questions" cards.
