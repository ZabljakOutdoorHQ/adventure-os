# Adventure OS — MCP and Integration Plan

## Purpose

Adventure OS must give agents a stable business interface without forcing them to understand every source system, API and workaround.

The preferred model is:

```text
Agent
  ↓
Adventure OS MCP
  ↓
Adventure API and permission layer
  ↓
Source adapters
```

Source-specific MCP servers can assist development and discovery, but the production contract should remain under Adventure OS control.

## Core Adventure OS MCP capabilities

Initial read tools:

- `search_everything(query, filters)`
- `get_entity(entityId)`
- `get_entity_context(entityId, depth)`
- `find_people(query)`
- `find_projects(query)`
- `find_trip_groups(query)`
- `get_today_brief()`
- `get_project_status(projectId)`
- `get_trip_group_status(tripGroupId)`
- `get_source_document(sourceRef)`
- `list_open_questions(scope)`
- `list_integration_health()`

Later proposal tools:

- `propose_task(input)`
- `propose_relationship(input)`
- `propose_document_update(input)`
- `propose_reminder(input)`

Write tools are introduced only with explicit approval objects and audit.

## Connector registry

### Google Drive — WORK folder

**Initial scope:** supplied WORK folder only.

**Mode:** read-only discovery and indexing.

**Purpose:** documents, spreadsheets, PDFs, plans, historical project material and source references.

**First outputs:** folder inventory, document classification, duplicate candidates, project/entity suggestions and freshness assessment.

**Do not:** move, rename, reorganise or delete files.

### Gmail

**Mode:** later read-only, query-based.

**Purpose:** connect communication to people, organisations, bookings, groups and projects.

**Boundary:** avoid bulk indexing the entire mailbox before retention and relevance rules are agreed.

### Google Calendar

**Mode:** read-only initially.

**Purpose:** Today view, meetings, deadlines, tours and event context.

### Notion — Multiday

**Mode:** read-only initially.

**Purpose:** agencies, TripGroups, participants, payments, expenses, hotels, transfers, room allocations and bike assignments.

**Key requirement:** audit actual database schemas and duplicate relations before modelling.

### Plane

**Available input:** access token and CSV export supplied outside Git.

**Mode:** CSV audit first; API read-only second.

**Purpose:** shared operational tasks, projects, status and assignments.

**Decision pending:** whether Ideas and Projects also become authoritative in Plane or only Tasks.

**Secret handling:** access token stays in approved secret storage, never in repository files.

### Docmost

**Mode:** read-only proof of concept.

**Options under evaluation:**

- `MrMartiniMo/docmost-mcp`
- `wisflux/docmost-local-mcp`
- a minimal custom adapter using available local/API access

**Purpose:** maintained internal wiki and procedures.

**Principle:** use a workaround only if it is maintainable, scoped and does not bypass access controls. Production integration must be pinned, reviewed and documented.

### Documenso

**Mode:** metadata/status read-only first.

**Purpose:** templates, envelopes/documents, recipients, signing status and signed-output references.

**Deployment:** separately document Docker/Dokploy deployment, DNS, mail, storage, backup and restore. Adventure OS links to signing state; it does not replace Documenso.

### Adventure Hub

**Authority boundary:** Adventure Hub remains the business source of truth for
bookings. That business authority is broader than the surface Adventure OS can
currently read. Integration claims are limited to the confirmed contract below.

**Known public/modal API capabilities:**

- token issuance;
- adventure catalogue and dependent modal data;
- total-price calculation;
- booking creation and optional WSPay redirect.

**Current limitation:** supplied documentation is mainly booking-modal oriented. It does not yet establish a safe internal reporting contract for booking lifecycle, capacity, payment status, revenue, guide assignment or operational reports.

**Mode:** no production writes from Adventure OS. Build a typed read adapter only after approved report endpoints and authentication are confirmed.

**Important existing findings:** capacity is absent from the modal response; error formats are inconsistent; booking and payment semantics have open questions. These remain integration risks, not details to guess around.

### GitHub

**Mode:** read/write for development under branch/PR controls.

**Purpose:** code, issues, ADRs, documentation, CI and ChatDev development workflow.

### Apple Notes

**Mode:** deferred opt-in ingestion.

**Likely implementation paths:**

- local macOS export/Shortcut to a watched folder;
- Shortcuts → webhook/n8n;
- periodic export to Markdown;
- local companion process with explicit folder selection.

**Purpose:** personal idea and context inbox.

**Boundary:** no full-device access. Start with one selected Notes folder and human-reviewed classification.

### Apple Reminders

**Mode:** deferred opt-in.

**Likely implementation paths:** Shortcuts, EventKit-based local helper, or export into a controlled inbox.

**Purpose:** personal reminders visible in Today and optionally linked to projects.

**Boundary:** Reminders remain authoritative until an explicit task-conversion action occurs.

### Payload CMS

**Mode:** read-only content context initially; controlled writes much later.

**Purpose:** connect public content, activities, media and website projects.

### Mattermost

**Mode:** later message/event integration.

**Purpose:** internal team communication and operational intake if the team adopts it.

### n8n

**Role:** orchestration engine, not knowledge authority.

Use for deterministic sync, polling, transformation and alerts. Workflows must emit structured events and errors to Adventure OS.

## Integration onboarding checklist

Every connector requires:

1. owner;
2. business purpose;
3. authoritative objects;
4. exact access scope;
5. read/write capabilities;
6. authentication method;
7. secret location;
8. refresh or event strategy;
9. rate limits;
10. personal-data classification;
11. retention policy;
12. error and retry rules;
13. health check;
14. rollback/revocation process;
15. test fixtures and acceptance criteria.

## Implementation order

1. Plane CSV inventory — no secret required.
2. Google Drive WORK folder inventory — read-only.
3. Notion Multiday schema audit — read-only.
4. Plane API read adapter.
5. Docmost proof of concept.
6. Adventure Hub reporting-contract discovery.
7. Documenso status adapter.
8. Apple Notes selected-folder intake.
9. Apple Reminders selected-list intake.
10. Gmail and Calendar context after privacy scopes are confirmed.

## Agent-development use of ChatDev

ChatDev can be deployed as a development and testing team after:

- architecture documents are merged;
- agent rules are loaded from the repo;
- GitHub access is limited to branches and PRs;
- no production secrets are exposed;
- each task has acceptance criteria;
- CI and human review remain mandatory.

ChatDev is not the production orchestration layer and is not the source of domain truth.
