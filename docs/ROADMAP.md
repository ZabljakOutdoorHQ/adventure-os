# Adventure OS — Roadmap

## Delivery principle

Each phase must produce visible relief or trustworthy knowledge before the next layer of complexity is added.

No phase may depend on hidden chat context. Decisions and acceptance criteria live in GitHub.

## Phase 0 — Foundation

**Goal:** establish a safe project and a shared mental model.

Deliverables:

- repository, CI and agent rules;
- clickable mock command-centre shell;
- Project Constitution;
- Domain Model;
- Knowledge Graph specification;
- Memory Policy;
- System Architecture;
- MCP/Integration Plan;
- source inventory.

Exit criteria:

- documents agree on authority, safety and vocabulary;
- no secrets are committed;
- CI passes;
- Boris can explain the intended system without technical translation.

## Phase 1 — Visual prototype and design system

**Goal:** make the spatial interaction model tangible.

Deliverables:

- standard shadcn/ui foundation;
- selective Shadcn Studio blocks where they save work;
- Today, Matrix, Projects, People/Graph and AI context panel;
- command palette/search interaction;
- responsive desktop/tablet shell;
- preview deployment.

Exit criteria:

- Boris can click through the prototype;
- navigation is materially clearer than a long chat or tool list;
- no live data is required to evaluate the UX.

## Phase 2 — Source discovery

**Goal:** understand current information before building integrations.

Workstreams:

1. Plane CSV inventory.
2. Google Drive WORK folder inventory.
3. Notion Multiday schema audit.
4. Existing Docmost structure inventory.
5. Adventure Hub API/reporting capability audit.
6. Existing server deployment documentation inventory.

Outputs:

- `SOURCE_MAP.md` with authority, freshness, sensitivity and duplication;
- revised vocabulary and entity map;
- connector-specific acceptance criteria;
- list of unresolved business questions.

Exit criteria:

- no source is migrated or modified;
- at least one real cross-source use case is selected for validation.

## Phase 3 — Adventure Graph core

**Goal:** create the minimum internal knowledge service.

Deliverables:

- PostgreSQL schema for entities, edges, source refs, events and audit;
- `pgvector` extension and semantic-index boundary;
- internal API;
- identity-resolution suggestions;
- confidence and lifecycle model;
- mock and fixture adapters.

Exit criteria:

- entities from fixtures can be searched and traversed;
- every result exposes sources and confidence;
- suggested relations require review.

## Phase 4 — First read-only connectors

**Goal:** prove unified context without creating operational risk.

Order:

1. Plane read-only.
2. Drive WORK read-only.
3. Notion Multiday read-only.
4. Docmost read-only proof of concept.

Primary validation scenario:

> Find one known Multiday TripGroup and show its connected agency, participants, payments, hotels, bike allocation, tasks and documents.

Exit criteria:

- source links work;
- stale or conflicting data is identified;
- no source writes exist;
- the result saves real search time.

## Phase 5 — Today and operational briefings

**Goal:** reduce daily cognitive load.

Deliverables:

- Today view from Plane, Calendar and graph events;
- unresolved decisions and stale-data warnings;
- concise AI briefing with citations;
- connector health and failed-sync visibility;
- personal/private visibility boundary.

Exit criteria:

- one screen answers what needs attention today;
- briefing is grounded and can be verified quickly;
- false urgency and duplicate alerts are controlled.

## Phase 6 — Adventure Hub reporting

**Goal:** provide trustworthy operational and commercial reporting from the actual booking source.

Prerequisites:

- approved authentication and reporting endpoints;
- documented booking lifecycle and payment semantics;
- clear capacity and availability contract;
- staging isolation confirmed.

Deliverables:

- typed Adventure Hub read adapter;
- activity, booking and revenue summaries supported by the API;
- API health and schema smoke tests;
- no booking write access from Adventure OS.

Exit criteria:

- reports reconcile with Adventure Hub;
- unknown API semantics are visible, not guessed.

## Phase 7 — Controlled task and knowledge writes

**Goal:** remove repetitive entry while keeping human authority.

Candidate writes:

- create a Plane task from an approved Note, Message or AI proposal;
- confirm a graph relationship;
- create or update a Docmost draft page;
- link a document to a Project or TripGroup;
- create a personal Reminder.

Every write requires:

- preview;
- explicit destination;
- permission check;
- audit record;
- source result link;
- idempotency where supported.

## Phase 8 — Apple input channels

**Goal:** turn existing personal capture habits into controlled inputs.

Deliverables:

- one selected Apple Notes folder export/intake;
- one selected Reminders list intake;
- classification into idea, task, question, project context or archive;
- human review before promotion into shared systems.

Exit criteria:

- Notes remain easy to use;
- no uncontrolled device-wide ingestion;
- accepted items reach the correct project/task context.

## Phase 9 — Event-driven automation

**Goal:** automate stable repeatable processes.

Candidate events:

- task completed;
- booking status changed;
- payment received;
- document signed;
- asset serviced;
- deadline approaching;
- connector failed.

n8n executes deterministic flows; Adventure OS records and explains them.

## Phase 10 — Agent operations and ChatDev

**Goal:** use agents as a controlled development and operations workforce.

ChatDev scope:

- implement bounded GitHub issues;
- generate and run tests;
- prepare documentation;
- review code through specialised agents;
- never access production secrets or merge without green CI.

Business-agent scope:

- source-grounded research;
- status summaries;
- proposed tasks and links;
- controlled writes under explicit policies.

## Immediate next actions

Current status is tracked in [`docs/STATUS.md`](STATUS.md).

1. Finish review for PR #21.
2. Confirm the Phase 1 preview deployment.
3. Inventory the Drive WORK folder in read-only mode.
4. Audit Notion Multiday databases and relationships.
5. Inventory Docmost spaces/pages and decide the first maintainable integration path.
6. Select the first real TripGroup validation case.
7. Continue the Plane read-only pilot without expanding write scope.
8. Confirm the Adventure Hub internal/reporting API scope with its developers.
9. Document Documenso Docker/Dokploy deployment and ownership.

## Stop conditions

Pause and reassess when:

- a new tool duplicates an existing responsibility;
- a connector requires excessive permissions;
- data authority is unclear;
- agents produce untraceable changes;
- implementation work exceeds the practical relief it provides;
- Boris must manually maintain the same information in multiple places.
