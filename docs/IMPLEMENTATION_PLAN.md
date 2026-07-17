# Adventure OS — Implementation Plan

**Status:** Active delivery plan. The architecture is accepted and frozen for
this plan. This document does **not** redesign the system, introduce canonical
entities, or open a new ontology/domain/relationship track. It translates the
already-accepted architecture into executable work.

**Authoritative inputs (unchanged by this document):**
`docs/PROJECT_CONSTITUTION.md`, `docs/SYSTEM_ARCHITECTURE.md`,
`docs/DOMAIN_MODEL.md`, `docs/domain/DOMAIN_LANDSCAPE.md`,
`docs/KNOWLEDGE_GRAPH.md`, `docs/RELATIONSHIPS.md`, `docs/ROADMAP.md`,
`docs/SOURCE-MAP.md`, `docs/MCP_INTEGRATIONS.md`, `docs/decisions/*`,
`docs/integrations/adventure-hub.md`, `docs/integrations/plane.md`,
`docs/STATUS.md`.

Where this plan and the roadmap phases overlap, the roadmap defines *what and
why*; this plan defines *how, in what order, and at what cost*.

## How to read this plan

Each epic is tagged with a **timing lane** and a **complexity estimate**.

**Timing lanes** (the four explicit categories requested):

- **NOW** — start inside the first 30–60 days; unblocked by anything missing.
- **WAIT** — real and planned, but should not start until a named dependency
  lands. Starting early builds the wrong thing.
- **BLOCKED** — cannot proceed until an external fact, access, or decision is
  resolved. The blocker is named explicitly.
- **EXPERIMENT** — a time-boxed spike to reduce a specific unknown. Produces a
  decision or a throwaway prototype, not production code.

**Complexity:** `S` (≤2 days), `M` (~1 week), `L` (~2–3 weeks), `XL` (multi-week,
should be split before starting).

**Delivery principle (from `ROADMAP.md`): prefer vertical slices.** We do not
build the whole graph, then the whole adapter framework, then the whole UI.
The first useful thing is *one real TripGroup's connected context, end to end*.
Every early epic contributes a thin layer to that slice rather than a complete
horizontal platform. Infrastructure is built to the depth the current slice
needs and no further.

**Current code baseline (what already exists, as of PR #21 review):**

- `lib/tasks/*` — canonical `TaskService` interface + `resolveWaitingForMeViewState`.
- `lib/adapters/plane/*` — `PlaneTaskService` (read-only), behind the interface.
- `lib/adapters/adventure-hub/*` — read-only client (types + fetch client), no service yet.
- `lib/task-service-provider.ts` — composition root, `import "server-only"`.
- `lib/demo/*` — prototype demo data (System Map, Search, Operations, etc.).
- `scripts/{plane,adventure-hub}-smoke.ts` — network-gated smoke tests.
- Mission Control shell + routed pages; Plane "Waiting for me" is the only live card.
- CI: lint, format, typecheck, unit, e2e, build.
- **No** Postgres, graph service, internal API, search service, MCP gateway, or write path yet.

---

## Epic 1 — Graph core

**Timing:** NOW · **Complexity:** XL (ship as a thin `M` slice first; do not attempt the full platform up front)

**Objective.** Provide the minimum internal knowledge service that stores
canonical entities, relationships, source references and events, and exposes
them through one internal read API — the foundation every later epic reads from.

**Scope.**

- In: PostgreSQL schema for entities, edges (`RELATIONSHIPS.md` shape), source
  references, events, audit; the internal read API (`getEntity`, `listRelated`,
  `searchById`); confidence + review status persisted end to end; a fixture
  adapter that seeds the **minimum initial relationship set** from
  `RELATIONSHIPS.md` (20 types) so the graph is exercisable without any live
  source.
- Out: `pgvector` semantic index (Epic 9), identity auto-merge (kept as
  *suggested* only, per `KNOWLEDGE_GRAPH.md`), any write-back to a source
  (Epic 11), a dedicated graph database (`SYSTEM_ARCHITECTURE.md` §14 defers it).

**Dependencies.** None blocking. Needs the Postgres target decided (dev: local
container; the production target is Dokploy/Netcup per `SYSTEM_ARCHITECTURE.md`
§11 — but dev can start immediately without it).

**Deliverables.**

- Versioned SQL migrations (`entities`, `edges`, `source_refs`, `events`, `audit`).
- `lib/graph/*` internal service returning canonical records (never raw adapter shapes).
- Fixture adapter + seed of the 20-type minimum relationship set.
- Unit tests: seed → traverse → every result exposes `sourceRefs` + `confidence`.

**Acceptance criteria.**

- Entities from fixtures can be searched by id and traversed by relationship.
- Every returned node and edge exposes its source(s) and confidence.
- No inferred edge is stored as `confirmed`; agent/rule-created edges default to `suggested`/`pending`.
- Schema migration is reversible and committed; no secrets in migrations.

**Risks.** Over-building the platform before a real consumer exists (mitigate:
thin slice, fixtures only). Schema churn once real source shapes arrive
(mitigate: `sourceRefs` is the flex point; canonical columns stay minimal).

**Suggested GitHub issues.** `graph: Postgres schema + migrations for
entities/edges/source_refs/events/audit`; `graph: internal read API
(getEntity/listRelated/searchById)`; `graph: fixture adapter seeding the
RELATIONSHIPS.md minimum set`.

**Sequencing.** First epic to start. Schema → read API → fixture seed. Blocks
Epics 6, 7, 8, 9, 11.

---

## Epic 2 — Source adapter framework

**Timing:** NOW · **Complexity:** M

**Objective.** Formalise the `SourceAdapter` contract from
`SYSTEM_ARCHITECTURE.md` §6 so every connector is uniform, health-reportable,
and returns canonical records with `sourceRefs` — never raw third-party shapes
into the graph.

**Scope.**

- In: the `SourceAdapter` TypeScript interface (`capabilities`, `health`,
  `discover`, `read`, optional `changes`); retrofit the existing Plane adapter
  behind it; a shared health/last-success model; adapter registration.
- Out: write capabilities (`proposeWrite`/`executeWrite` — Epic 11); any new
  source (Epics 3–5 consume this framework).

**Dependencies.** Light coupling to Epic 1's source-reference shape; can be
developed in parallel and integrated when the graph read API lands.

**Deliverables.**

- `lib/adapters/contract.ts` (or equivalent) implementing `SourceAdapter`.
- Plane adapter refactored to satisfy it without behaviour change (existing
  `TaskService` boundary preserved).
- Adapter health surface (`health()` → `IntegrationHealth`) with last-success timestamp.

**Acceptance criteria.**

- Plane adapter passes its existing tests unchanged in behaviour.
- A new adapter can be added by implementing one interface + registering it.
- Health status is queryable per adapter without hitting the live source.

**Risks.** Premature generality (mitigate: shape the interface around the two
adapters that already exist — Plane and Adventure-Hub — not hypothetical ones).

**Suggested GitHub issues.** `adapters: define SourceAdapter contract in lib`;
`adapters: retrofit Plane adapter to SourceAdapter without behaviour change`;
`adapters: shared IntegrationHealth + last-success model`.

**Sequencing.** Parallel to Epic 1. Must land before Epics 3–5 implement real adapters.

---

## Epic 3 — Drive read-only inventory

**Timing:** NOW · **Complexity:** M

**Objective.** Inventory the Google Drive WORK folder read-only, produce
source-map output (authority, freshness, sensitivity, duplication), and expose
Drive documents as canonical `Document` entities with `sourceRefs`.

**Scope.**

- In: read-only discovery/listing of the supplied WORK folder; per-file source
  + freshness metadata; a `SourceAdapter` for Drive (`list`/`read`/`search`);
  `Document` nodes into the graph with `DOCUMENT_MENTIONS_ENTITY` /
  `DOCUMENT_EVIDENCES_ENTITY` left as *suggested* until reviewed.
- Out: file content migration or copy; write/move/delete (Constitution §5
  forbids source mutation); folders beyond the approved WORK scope
  (`KNOWLEDGE_GRAPH.md` indexing boundaries).

**Dependencies.** Epic 2 (adapter framework), Epic 1 (graph to store into).
Google Drive access is available to this workspace (read connectors present).

**Deliverables.**

- Read-only Drive inventory script → `SOURCE-MAP.md`-style output for WORK.
- Drive `SourceAdapter` (read-only) producing canonical `Document` records.
- Sensitivity/personal-data classification per the Memory Policy before storage.

**Acceptance criteria.**

- WORK folder is inventoried without any write to Drive.
- Every indexed document exposes source, freshness and a scope classification.
- Nothing outside the approved WORK scope is indexed.

**Risks.** Over-indexing personal data (mitigate: explicit scope allow-list,
metadata-only where content is sensitive). Freshness drift (mitigate: store
`observedAt`, re-scan on demand).

**Suggested GitHub issues.** `drive: read-only WORK folder inventory + source-map
output`; `drive: read-only SourceAdapter emitting canonical Document records`.

**Sequencing.** After Epics 1–2. One of the two feeds (with Notion) for the
TripGroup validation slice (Epic 6).

---

## Epic 4 — Notion Multiday audit and adapter

**Timing:** NOW (audit) → WAIT (adapter until audit lands) · **Complexity:** L

**Objective.** Audit the Notion Multiday workspace (databases, relations,
duplicates, authoritative vs calculated fields) per ADR-0001, then build a
read-only adapter for the TripGroup-relevant collections.

**Scope.**

- In: schema audit of Multiday databases; identification of duplicate/overlapping
  relations and stale structures; a read-only `SourceAdapter` for the
  TripGroup-relevant slice (groups, participants, payments, expenses,
  allocations) mapped to canonical entities + `RELATIONSHIPS.md` edges.
- Out: any Notion write; migration of records out of Notion (ADR-0001: Notion
  stays transitional, read-only first, no destructive cleanup before a reviewed
  map exists); non-Multiday Notion areas.

**Dependencies.** Epics 1–2. The audit (NOW) has no code dependency and should
start immediately; the adapter (WAIT) depends on the audit's output and the
graph read API.

**Deliverables.**

- Notion Multiday audit document (databases, purpose, relations, duplicates,
  authority, stale records) — fits the existing Phase 2 output, not a new doc track.
- Read-only Notion `SourceAdapter` for TripGroup-relevant collections.
- Mapping notes: which Notion fields are authoritative vs derived.

**Acceptance criteria.**

- Audit distinguishes authoritative from calculated fields and flags duplicates.
- Adapter reads Multiday TripGroup data with correct `sourceRefs`, no writes.
- Ambiguous/duplicate relations surface as *suggested*, not `confirmed`.

**Risks.** Business rules encoded only in Boris's head (ADR-0001) — mitigate:
audit explicitly lists "rules only Boris understands" for human confirmation.
Notion relation ambiguity (mitigate: never auto-merge; keep suggested).

**Suggested GitHub issues.** `notion: Multiday schema audit (databases,
relations, duplicates, authority)`; `notion: read-only SourceAdapter for
TripGroup-relevant collections`.

**Sequencing.** Audit starts NOW alongside Epics 1–2. Adapter after audit +
graph read API. Feeds Epic 6.

---

## Epic 5 — Docmost inventory and integration path

**Timing:** BLOCKED (integration) · NOW (paper inventory only) · **Complexity:** M

**Objective.** Inventory Docmost's structure and decide the first maintainable
integration path — *without* assuming Docmost is reachable or that a specific
connector works.

**Scope.**

- In (NOW): a paper inventory of intended spaces/pages and ownership; a decision
  record on the integration path (official API vs. a local MCP vs. export).
- In (BLOCKED): any live read adapter.
- Out: write to Docmost; adopting an unvetted connector.

**Blocker (explicit).** This environment cannot reach `docs.durmitoradventure.com`
(egress policy returns `403` at the proxy — confirmed this session). Docmost's
live/not-built status is contradictory across the `outdoor-hq` infra docs
(`docs/research/outdoor-hq-architecture-review.md` §6). The `wisflux/docmost-local-mcp`
connector uses email/password + local session and is not a claude.ai directory
connector — it must run outside this sandbox. **Until (a) a reachable Docmost
instance URL, (b) confirmed auth, and (c) a vetted read path are provided, the
adapter cannot start.**

**Dependencies.** Unblocking facts above; then Epics 1–2 for the adapter.

**Deliverables (unblocked portion).**

- Docmost inventory + ownership notes (fits Phase 2 output).
- A short decision record naming the chosen integration path and its prerequisites.

**Acceptance criteria.**

- Inventory + path decision exist without requiring live access.
- The exact unblocking prerequisites are written down (URL, auth, vetted read path).

**Risks.** Building against a connector that isn't sanctioned or a server that
isn't live (mitigate: keep BLOCKED until the three facts are confirmed).

**Suggested GitHub issues.** `docmost: paper inventory + integration-path
decision record (blocked on live access)`.

**Sequencing.** Inventory can happen anytime; adapter waits on the blocker.
Not on the TripGroup slice's critical path.

---

## Epic 6 — Real TripGroup validation

**Timing:** WAIT (until Epics 1, 3/4 land) · **Complexity:** L

**Objective.** Deliver the roadmap's primary validation scenario and
`KNOWLEDGE_GRAPH.md`'s first graph test: assemble **one real Multiday
TripGroup's** connected context (agency, participants, payments, hotels/
allocations, tasks, documents) from the graph, distinguishing facts from
inference, every link tracing to a source.

**Scope.**

- In: select one real TripGroup; ingest its context via the Notion (+ Drive)
  read-only adapters into the graph; a read-only assembled view of that
  TripGroup's neighbourhood.
- Out: any write; generalising to all TripGroups before one works end to end;
  Adventure Hub booking data (its reporting surface doesn't exist — Epic 13/Phase 6).

**Dependencies.** Epic 1 (graph), Epic 2 (adapters), Epic 4 (Notion adapter),
Epic 3 (Drive documents) — this is the **first vertical slice** that threads them.

**Deliverables.**

- One real TripGroup fully assembled from the graph with sources + confidence.
- A short validation write-up: what reconciled, what conflicted, what saved time.
- Surfaced read-only in an existing view (System Map / Operations) — replacing
  demo data for that one case, not adding a new page.

**Acceptance criteria.**

- The scenario query returns the connected context with every link sourced.
- Facts and inferences are visually/structurally distinct.
- Stale or conflicting data is *identified*, not silently resolved.
- No source writes occur.

**Risks.** Adapter data richer/messier than fixtures (mitigate: this is the
point — it validates the model against reality before scaling). Identity
resolution across Notion/Drive (mitigate: suggested links + human review).

**Suggested GitHub issues.** `tripgroup: select first validation case + ingest
via read-only adapters`; `tripgroup: assemble connected context from graph and
render read-only`.

**Sequencing.** The keystone of the first slice. Do not scale connectors until
this one case works.

---

## Epic 7 — Mission Control data integration

**Timing:** WAIT (until Epic 1 read API) · **Complexity:** M

**Objective.** Move Mission Control's cards from demo data to graph-backed real
data through the internal API, keeping the honest empty/disconnected states.

**Scope.**

- In: back the Attention/Operations/Communications cards with the internal graph
  API where real data exists; preserve the Plane "Waiting for me" live path;
  keep "not yet connected" states truthful where a source isn't wired.
- Out: fabricating data for any card without a source (Constitution + ADR-0003);
  new cards or layout changes.

**Dependencies.** Epic 1 (read API). Benefits from Epics 3/4/6 data.

**Deliverables.**

- Mission Control cards reading from the internal API with source/confidence.
- Demo data retained only where no real source exists yet, clearly labelled.

**Acceptance criteria.**

- Every populated card traces to a source; empty states stay honest.
- No card can be mistaken for real data when it is demo (ADR-0003 guardrail holds).

**Risks.** Half-real dashboards feel misleading (mitigate: per-card source
badges; explicit empty states).

**Suggested GitHub issues.** `mission-control: back Attention cards with internal
graph API`; `mission-control: source/confidence badges per card`.

**Sequencing.** After the graph read API; interleaves with Epic 6's output.

---

## Epic 8 — Today briefing

**Timing:** WAIT (until Epics 1, 7) · **Complexity:** L

**Objective.** Deliver the Phase 5 Today view: one screen answering "what needs
attention today," grounded in Plane, Calendar and graph events, with citations
and stale-data warnings.

**Scope.**

- In: Today aggregation from tasks (Plane), calendar events, and graph
  `EventRecord`s; a concise briefing with citations; connector-health and
  failed-sync visibility; the personal/private visibility boundary.
- Out: AI-authored actions (Epic 11/12); false-urgency heuristics beyond simple
  due/overdue; write-back.

**Dependencies.** Epic 1 (events/graph), Epic 7 (Mission Control integration),
an event service (thin, Postgres-polling per `SYSTEM_ARCHITECTURE.md` §5 — no broker).

**Deliverables.**

- Today view aggregating tasks + calendar + events with citations.
- Stale-data and duplicate-alert controls; connector-health surface.

**Acceptance criteria.**

- One screen answers "what needs attention today," each item verifiable to source.
- Duplicate/false-urgency alerts are controlled, not amplified.

**Risks.** Alert noise erodes trust (mitigate: citations + dedupe from day one).

**Suggested GitHub issues.** `today: aggregate tasks+calendar+events with
citations`; `today: connector-health + stale-data surface`.

**Sequencing.** After Mission Control data integration.

---

## Epic 9 — Unified search

**Timing:** WAIT (exact/full-text NOW-ish after Epic 1; semantic is EXPERIMENT→WAIT) · **Complexity:** L (XL with semantic)

**Objective.** Replace the demo client-side `/search` filter with the real
search service: exact identifiers + full-text + graph-neighbour expansion, with
`pgvector` semantic retrieval added only after it proves its worth.

**Scope.**

- In: exact + full-text search over graph entities; graph-neighbour expansion;
  ranking by authority/freshness/context; results always expose source + freshness.
- Out: semantic retrieval in the first cut (spike first — see Experiments);
  search over sources not yet ingested.

**Dependencies.** Epic 1 (graph + data). Semantic tier depends on the pgvector experiment.

**Deliverables.**

- Search service (exact + full-text + neighbour expansion) behind the internal API.
- `/search` page wired to it, replacing the demo filter, keeping source/freshness on every result.

**Acceptance criteria.**

- Search returns entities *and* connected context, not just files.
- Every result exposes source and freshness (`MASTER.md` search requirement).
- Semantic tier, if added, supplements — never overrides — structured identity.

**Risks.** Embedding cost/quality uncertain (mitigate: ship exact+full-text
first; gate semantic behind the experiment).

**Suggested GitHub issues.** `search: exact + full-text service over graph`;
`search: wire /search page to real service (retire demo filter)`.

**Sequencing.** Exact/full-text after Epic 1; semantic after its spike.

---

## Epic 10 — Knowledge layer

**Timing:** WAIT (Drive-fed portion) · partly BLOCKED (Docmost-fed portion) · **Complexity:** L

**Objective.** Curate `KnowledgeRecord`s from evidence (documents, decisions,
notes) with source, confidence and lifecycle — the durable-meaning layer above
raw documents.

**Scope.**

- In: `KnowledgeRecord` creation/curation from Drive documents and repo ADRs;
  `DOCUMENT_CURATED_INTO_KNOWLEDGE_RECORD` / `KNOWLEDGE_RECORD_DESCRIBES_ENTITY`
  edges; lifecycle (`current`/`superseded`/`archived`).
- Out: Docmost-sourced knowledge (BLOCKED with Epic 5); auto-summaries promoted
  to fact without review (Constitution §7: "an AI summary is not a fact").

**Dependencies.** Epic 1, Epic 3 (Drive docs). Docmost portion waits on Epic 5's blocker.

**Deliverables.**

- Curated `KnowledgeRecord`s from Drive + ADRs with source + confidence + lifecycle.
- Knowledge view backed by real records where they exist; honest empty state otherwise.

**Acceptance criteria.**

- Every KnowledgeRecord cites evidence and carries confidence + lifecycle.
- No AI summary is stored as `confirmed` without human review.

**Risks.** Curation backlog (mitigate: start from the TripGroup slice's documents only).

**Suggested GitHub issues.** `knowledge: KnowledgeRecord curation from Drive
documents + ADRs`; `knowledge: lifecycle (current/superseded/archived) on records`.

**Sequencing.** After Drive adapter; Docmost-fed knowledge waits on Epic 5.

---

## Epic 11 — Controlled writes

**Timing:** WAIT (until graph + audit + approval exist) · **Complexity:** L

**Objective.** Enable the first reversible, human-approved write (Phase 7),
following the phased write model exactly: mock → read-only → proposal →
approved write. First candidate: create a Plane task from an approved Note,
Message or AI proposal.

**Scope.**

- In: the proposal→preview→approve→execute→audit path for **one** low-risk write
  (create Plane task); `AgentAction` + `AuditRecord` records; idempotency where
  the source supports it; a recovery/undo path.
- Out: any write to bookings, payments, or financial records (Constitution §5
  forbids); multi-step autonomous writes; writes without explicit destination + approval.

**Dependencies.** Epic 1 (graph + audit tables), Epic 2 (adapter `proposeWrite`/
`executeWrite`), a permission/visibility check.

**Deliverables.**

- `SourceAdapter.proposeWrite`/`executeWrite` implemented for Plane task creation.
- Preview + explicit-destination + permission-check + audit + result-link flow.
- Idempotency key usage where Plane supports it.

**Acceptance criteria.**

- No write executes without preview, explicit destination, permission check and audit.
- Every write records source, timestamp, actor, reason and a result link.
- The action is reversible or has a documented recovery path.

**Risks.** Scope creep into consequential writes (mitigate: exactly one
low-risk write type; Constitution gate on everything else).

**Suggested GitHub issues.** `writes: proposeWrite/executeWrite for Plane task
creation`; `writes: approval + audit + idempotency flow`.

**Sequencing.** Only after read-only slices are trusted and audit exists.

---

## Epic 12 — Agent operations

**Timing:** WAIT (until internal API + controlled writes) · **Complexity:** XL

**Objective.** Expose the Adventure OS MCP gateway so agents work through a
stable business interface (`MCP_INTEGRATIONS.md`) rather than raw source APIs,
under explicit policy and audit (Phase 10).

**Scope.**

- In: the Adventure OS MCP server over the internal API (read tools first:
  search, entity context, Today briefing); agent-proposed relationships/tasks as
  *suggested* + audited; ChatDev-style bounded development agents on GitHub issues.
- Out: agent access to production secrets; agent merges without green CI; agent
  execution of consequential writes without human approval (Constitution §10).

**Dependencies.** Epic 1 (API), Epic 9 (search), Epic 11 (controlled write path),
audit.

**Deliverables.**

- Adventure OS MCP server exposing read tools over the internal API.
- Agent proposals recorded as `AgentAction` + audit, never auto-confirmed.

**Acceptance criteria.**

- Agents can search and read business context via MCP without source-specific APIs.
- Every agent proposal is audited; none is silently promoted to `confirmed`.
- No agent path reaches production secrets or a consequential write unapproved.

**Risks.** Agent authority creep (mitigate: read tools first; writes only via
Epic 11's approved path).

**Suggested GitHub issues.** `mcp: Adventure OS MCP server (read tools over
internal API)`; `mcp: agent proposals as audited AgentAction records`.

**Sequencing.** Late. After search + one trusted write path.

---

## Epic 13 — Production hardening and rollout

**Timing:** NOW (preview only) → WAIT (full hardening) · **Complexity:** L

**Objective.** Take Adventure OS from local/dev to a durable internal
deployment per `SYSTEM_ARCHITECTURE.md` §10–12: identity boundary, Dokploy/
Netcup deploy, Postgres backup to R2, observability — starting with the
**still-unconfirmed Phase 1 preview deployment** (`STATUS.md`).

**Scope.**

- In (NOW): confirm/stand up the Phase 1 preview deployment (managed preview or
  Dokploy) so the prototype is clickable off a developer laptop.
- In (WAIT): identity provider / Cloudflare Access boundary; role + visibility
  checks inside the app; Postgres backup to R2; structured logs; connector-health
  dashboards; migrations in CI.
- Out: external SaaS tenancy; autonomous ops.

**Dependencies.** Preview: none blocking. Full hardening: a real database
consumer (Epic 1+) and the Dokploy/Netcup target (per `outdoor-hq` house rule:
internal tools on the self-hosted box, not Cloudflare Workers).

**Deliverables.**

- Confirmed preview deployment closing the Phase 1 exit gap.
- (Later) auth boundary, record-level permissions, Postgres→R2 backup, logging, health surface.

**Acceptance criteria.**

- Boris can click the prototype from a shared preview URL (Phase 1 exit).
- (Later) record-level permissions enforced beyond Cloudflare Access; backups verified restorable.

**Risks.** Standing up infra before there's a database to protect (mitigate:
preview now; full hardening only when Epic 1 data exists). Docmost/tooling-server
status ambiguity (see Epic 5) affects where this lands.

**Suggested GitHub issues.** `deploy: confirm + document Phase 1 preview
deployment`; `deploy: Postgres backup to R2 + restore test (after graph core)`.

**Sequencing.** Preview NOW (unblocks Phase 1 exit); full hardening tracks Epic 1's data landing.

---

## Work separated by lane

**Work required now (start in the first 30–60 days):**

- Epic 1 Graph core (thin slice) · Epic 2 Source adapter framework · Epic 3 Drive
  read-only inventory · Epic 4 Notion Multiday *audit* · Epic 13 *preview deployment*.

**Work that can wait (real, but gated on a dependency):**

- Epic 4 Notion *adapter* (after audit) · Epic 6 TripGroup validation (after graph +
  adapters) · Epic 7 Mission Control integration (after read API) · Epic 8 Today
  briefing · Epic 9 Unified search (exact/full-text) · Epic 10 Knowledge (Drive-fed)
  · Epic 11 Controlled writes · Epic 13 full hardening.

**Blocked work (named blocker must clear first):**

- Epic 5 Docmost *adapter* — no reachable instance URL / confirmed auth / vetted
  read path from this environment; Docmost live status itself unconfirmed.
- Epic 10 Docmost-fed knowledge — same blocker.
- Adventure Hub *reporting* (part of Epic 13/Phase 6) — the reporting API does not
  exist; only the public booking surface is confirmed (`docs/integrations/adventure-hub.md`).
  Staging DB isolation also unconfirmed.
- Any write to bookings/payments — permanently gated by Constitution §5.
- Chatwoot guest-communication ingestion — proposed only, implementation unconfirmed (`SOURCE-MAP.md`).

**Experiments (time-boxed spikes, produce a decision not a product):**

- `pgvector` semantic-search quality vs. exact+full-text (gates Epic 9's semantic tier).
- Identity-resolution match thresholds across Notion/Drive (informs Epic 6; stays *suggested*).
- `docmost-local-mcp` feasibility from an environment that can reach Docmost (informs Epic 5).
- Agent-proposed-relationship precision on the TripGroup slice (informs Epic 12).

---

## Delivery horizons

**First 30 days.**

- Stand up Graph core thin slice (schema + read API + fixture seed) — Epic 1.
- Formalise the `SourceAdapter` contract; retrofit Plane — Epic 2.
- Start the Drive WORK read-only inventory — Epic 3.
- Run the Notion Multiday audit (no code) — Epic 4.
- Confirm the Phase 1 preview deployment — Epic 13.
- Run the pgvector and identity-resolution spikes — Experiments.

**Next 60 days.**

- Notion Multiday read-only adapter — Epic 4.
- Drive read-only adapter emitting `Document`s — Epic 3.
- **First vertical slice: one real TripGroup's connected context, end to end** — Epic 6.
- Back Mission Control cards with the internal API — Epic 7.
- Exact + full-text unified search over the graph — Epic 9.

**Later.**

- Today briefing — Epic 8. Knowledge layer (Drive-fed) — Epic 10. Controlled
  writes (Plane task creation) — Epic 11. Agent operations / MCP gateway — Epic 12.
  Full production hardening — Epic 13. Docmost + Adventure Hub reporting once
  their blockers clear.

---

## First 10 GitHub issues to open

1. **graph: Postgres schema + reversible migrations** for entities, edges,
   source_refs, events, audit (Epic 1). `S/M`.
2. **graph: internal read API** — `getEntity`, `listRelated`, `searchById`,
   returning canonical records with source + confidence (Epic 1). `M`.
3. **graph: fixture adapter** seeding the `RELATIONSHIPS.md` minimum 20-type set;
   traversal test asserts source + confidence on every result (Epic 1). `S/M`.
4. **adapters: define `SourceAdapter` contract** in `lib` (capabilities/health/
   discover/read/changes) (Epic 2). `S`.
5. **adapters: retrofit Plane adapter** to `SourceAdapter` with no behaviour
   change; existing tests stay green (Epic 2). `S/M`.
6. **drive: read-only WORK folder inventory** → source-map output (authority,
   freshness, sensitivity, duplication) (Epic 3). `M`.
7. **notion: Multiday schema audit** — databases, relations, duplicates,
   authoritative-vs-derived fields, rules-only-Boris-knows (Epic 4). `M`.
8. **drive: read-only `SourceAdapter`** emitting canonical `Document` records
   with `sourceRefs` (Epic 3). `M`.
9. **notion: read-only `SourceAdapter`** for TripGroup-relevant collections
   (groups, participants, payments, allocations) (Epic 4). `L`.
10. **tripgroup: first validation slice** — ingest one real TripGroup via the
    read-only adapters and render its connected context read-only from the graph
    (Epic 6). `L`.

These ten deliver the first vertical slice (a real TripGroup's connected context
end to end) while closing the Phase 1 preview gap in parallel — visible relief
before the next layer of infrastructure, exactly as `ROADMAP.md`'s delivery
principle requires.
