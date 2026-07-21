# Adventure OS — System Architecture

## Architectural intent

Adventure OS is a control plane above specialist systems. It provides unified navigation, search, graph context, reporting and agent tools while preserving authoritative data in source applications.

## Logical layers

```text
Users and agents
      │
Adventure OS web app
      │
Adventure API / MCP gateway
      │
Knowledge service ─ Search service ─ Event service ─ Audit service
      │
Operational Integrity Engine ─ Rule Packs ─ Attention
      │
PostgreSQL + pgvector
      │
Connector adapters and n8n workflows
      │
Drive · Gmail · Calendar · Plane · Docmost · Documenso · Notion
Adventure Hub · Payload · GitHub · Apple Notes/Reminders
```

## 1. Presentation layer

### Adventure OS web application

- Next.js, React, TypeScript and Tailwind;
- standard shadcn/ui components stored locally;
- premium Shadcn Studio blocks used selectively after review;
- spatial navigation across Today, Matrix, Projects, People, Operations and Graph;
- universal command/search interface;
- contextual AI assistance without forcing all work into a chat timeline.

The UI must be useful with mock or read-only data before write integrations exist.

## 2. Application/API layer

A stable internal API separates the frontend from connectors and storage.

Responsibilities:

- entity and relationship queries;
- search and graph traversal;
- source and freshness metadata;
- Today briefing aggregation;
- permissions and visibility filtering;
- proposed actions and approval workflow;
- integration health;
- audit logging.

The API should be available both to the web app and to the Adventure OS MCP server.

## 3. Operational Integrity service

Operational Integrity is the platform capability that evaluates canonical data against
deterministic, versioned Rules and exposes active Signals and derived readiness to
Attention surfaces. The Operational Integrity Engine is the service that implements
that capability outside source systems. Neither is a business domain or source-system
feature.

The current reference implementation evaluates the Financial Integrity Rule Pack in
the Notion Multiday test workspace and presents results through filtered Notion views.
That implementation remains valid while adapters and canonical storage mature.

The evaluator moves out of Notion only when Operational Integrity must evaluate
multiple independent systems of record. That architectural tripwire is future work,
not part of the current reference implementation.

The portable target is:

```text
Sources -> Adapters -> Canonical Model -> Operational Integrity Engine
        -> Rule Packs -> Attention / Mission Control
```

AI may explain, group, prioritize and recommend from Signals. It cannot generate the
canonical Signal set. A persistent Signal Store is deliberately deferred and is not a
prerequisite for the current reference implementation.

The canonical contract is defined in
[`OPERATIONAL_INTEGRITY.md`](OPERATIONAL_INTEGRITY.md).

## 4. Knowledge service

Responsibilities:

- stable internal entity IDs;
- source references and aliases;
- typed relationships;
- confidence and review status;
- knowledge records and summaries;
- identity-resolution suggestions;
- lifecycle and supersession.

It does not own source-system business state.

## 5. Search service

Search combines:

- exact identifiers and full-text search;
- relational filters;
- semantic retrieval through `pgvector`;
- graph-neighbour expansion;
- ranking based on authority, freshness and user context.

Embeddings assist retrieval. They do not determine identity or overwrite structured facts.

## 6. Event service

Events describe changes detected from connectors or user actions.

The event service:

- stores immutable EventRecords;
- drives incremental graph updates;
- supports Today and Timeline views;
- triggers approved n8n workflows;
- avoids repeatedly rescanning every source.

Initial implementation may use PostgreSQL tables and scheduled polling. A separate message broker is unnecessary until volume justifies it.

## 7. Integration layer

Each source uses an adapter with a common contract:

```ts
interface SourceAdapter {
  id: string;
  capabilities: Array<"list" | "read" | "search" | "events" | "write">;
  health(): Promise<IntegrationHealth>;
  discover(cursor?: string): Promise<SourcePage>;
  read(ref: SourceReference): Promise<SourceObject>;
  changes?(cursor?: string): Promise<ChangePage>;
  proposeWrite?(action: ProposedAction): Promise<WritePlan>;
  executeWrite?(approvedPlan: ApprovedWritePlan): Promise<ActionResult>;
}
```

Every adapter begins with only the minimum permissions required.

## 8. Data layer

Initial recommendation:

- PostgreSQL for entities, edges, source references, events, connector state and audit;
- `pgvector` extension for semantic indexes;
- object/file content remains in source systems where possible;
- encrypted secrets stored in Dokploy or the approved password manager;
- separate databases or schemas for production and development;
- migrations versioned in Git.

A dedicated graph database, Redis or queue is deferred until a measured need exists.

## 9. Automation layer

n8n handles stable, explicit workflows such as:

- scheduled source refresh;
- connector event processing;
- reminder and alert delivery;
- approved task creation;
- document-signing notifications;
- backup status alerts.

AI reasoning must not be hidden inside large untraceable n8n workflows. Agent proposals and deterministic workflow execution remain distinguishable.

## 10. Agent layer

ChatGPT, coding agents and ChatDev can interact through:

- GitHub for development;
- Adventure OS MCP for business context and approved tools;
- source-specific connectors where appropriate.

Adventure OS MCP is the preferred business abstraction. Agents should not need to understand each source API independently for common operations.

## 11. Authentication and permissions

Initial internal deployment should use:

- identity provider or Cloudflare Access for the application boundary;
- role-based and visibility-domain checks inside Adventure OS;
- per-connector service credentials;
- least-privilege scopes;
- explicit user approval for consequential writes;
- complete audit of agent actions.

Cloudflare Access alone is not sufficient for record-level permissions.

## 12. Deployment

Target platform:

- GitHub repository and CI;
- containerised services;
- Dokploy on the existing Netcup server;
- Cloudflare DNS, TLS and Access;
- PostgreSQL backup to Cloudflare R2;
- preview environment with mock data before internal production deployment.

The web UI may initially use a managed preview service if that is faster, but production architecture should remain portable.

## 13. Reliability and observability

- CI: lint, typecheck, build and tests;
- structured application logs;
- connector health and last-success timestamps;
- failed-sync queue visible in the UI;
- audit records for reads and writes as appropriate;
- Grafana for technical infrastructure monitoring;
- business integrity and active Signals visible through Attention surfaces.

## 14. Phased write model

1. **Mock:** no source access.
2. **Read-only:** display and search real data.
3. **Proposal:** agent prepares a change but cannot execute it.
4. **Approved write:** user approves one reversible action.
5. **Deterministic automation:** repeatable low-risk workflow runs under explicit rules.
6. **Conditional autonomy:** only for narrowly defined cases with audit and rollback.

## 15. Explicit deferrals

Not in the initial architecture:

- replacing Plane, Docmost, Documenso or Adventure Hub;
- synchronising every field bidirectionally;
- mass migration of historical files;
- a separate graph database;
- autonomous booking or financial modifications;
- a persistent Operational Integrity Signal Store before the reference Rule Pack proves the need;
- generic external SaaS tenancy.
