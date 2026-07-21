# Adventure OS — Project Constitution

## 1. Mission

Adventure OS is the spatial operating layer for Boris Stijepovic, Durmitor Adventure and connected organisations, brands and projects.

It exists to reduce cognitive load, connect fragmented information and make important work reachable in **three clicks or one question**.

Adventure OS is not an ERP replacement, a second wiki, another task manager or a copy of every source system. It is a visual and agent-accessible layer above the tools that already perform specialised work.

## 2. North Star

Every important item must be reachable in three clicks or one question, with its source, freshness and confidence visible.

A feature that does not materially improve understanding, retrieval, coordination or execution should not be built.

## 3. Product principles

1. **Human clarity before automation.** The system must reduce work, not create another system Boris must maintain.
2. **Preserve working reality.** Existing tools remain authoritative until a migration is explicitly approved.
3. **Read before write.** Every integration starts read-only. Controlled writes come only after the source contract is understood and tested.
4. **One operational view, not one physical database.** Adventure OS may present unified information while data remains in specialist systems.
5. **Graph over folders.** People, projects, bookings, documents, tasks, payments, assets and messages are connected entities, not isolated files.
6. **Source and confidence are mandatory.** Derived information must state where it came from and whether a relationship is confirmed, probable or suggested.
7. **Reversible actions.** Consequential changes require audit logs, user confirmation and a recovery path.
8. **Technology stays subordinate.** The system serves real outdoor operations, people and experiences. It must not turn the organisation into a technology story.
9. **Progressive complexity.** Start with useful visibility. Add graph, automation and agents only where they remove real work.
10. **No silent agent authority.** AI may search, classify, summarise and propose. Sending, publishing, deleting, moving money or changing bookings requires explicit authority.
11. **The canonical domain belongs to Adventure OS.** Source systems implement or expose parts of the domain; they do not define it.
12. **Every canonical entity has one primary domain.** If a concept does not clearly fit the existing Domain Landscape, review the model before introducing it.
13. **No parallel models.** An AI agent may not introduce a parallel domain model or documentation hierarchy without an explicit reason and migration plan.
14. **Improve or disprove.** Every model change must improve the existing model or demonstrate why the existing model is wrong.
15. **Canonical documentation must remain true.** A change that alters system behavior, vocabulary, authority, workflow or product structure is incomplete until the relevant canonical documents are reconciled.

## 4. Authoritative systems

Until changed by an approved architecture decision:

- Adventure Hub is the business source of truth for the daily activity catalogue and booking lifecycle. Adventure OS may only rely on booking, payment, availability or reporting fields that are actually exposed and verified through an approved integration surface.
- Plane is authoritative for operational tasks once a task is accepted into the shared task system.
- Docmost is authoritative for maintained internal wiki content.
- Documenso is authoritative for document-signing state and signed outputs.
- Google Workspace is authoritative for original email, Drive documents and Calendar events.
- Notion remains authoritative for existing Multiday data until a deliberate migration is completed.
- Payload CMS is authoritative for public website content.
- GitHub is authoritative for code, technical decisions and versioned system documentation.
- Adventure OS stores links, indexes, derived summaries, graph relationships, preferences and audit records; it does not silently replace source records.

Business authority and integration visibility are distinct. A source may remain authoritative even when its current API or connector exposes only a limited subset of that source.

## 5. Safety boundaries

Adventure OS must never, without explicit approval:

- delete or move source files;
- merge duplicate people, companies, bookings or payments;
- modify production bookings or financial records;
- send external messages;
- publish content;
- sign documents;
- allocate money or equipment;
- expose secrets or personal information beyond the user's permissions.

Production credentials never enter Git, prompts, screenshots or documentation.

## 6. Decision hierarchy

When instructions conflict, use this order:

1. legal, privacy and safety obligations;
2. this Constitution;
3. approved architecture decisions in `docs/decisions/`;
4. authoritative domain and integration documents;
5. current sprint acceptance criteria;
6. agent implementation preferences.

## 7. Canonical document ownership

Each durable concern has one primary owner:

- `PROJECT_CONSTITUTION.md` — mission, principles, authority and non-negotiable rules;
- `DOMAIN_MODEL.md` — canonical entities and vocabulary;
- `domain/DOMAIN_LANDSCAPE.md` — conceptual business domains;
- `RELATIONSHIPS.md` — canonical relationship types and relation semantics;
- `MEMORY_POLICY.md` — memory classes and promotion into durable knowledge;
- `SYSTEM_ARCHITECTURE.md` — technical architecture and service boundaries;
- `ROADMAP.md` — delivery phases, sequence and stop conditions;
- `STATUS.md` — current operational truth and active dependencies;
- `decisions/` — approved architectural decisions;
- `IMPLEMENTATION_DECISIONS.md` — concrete implementation choices and verified exceptions.

Other documents may summarise or apply these rules, but should link to the canonical owner instead of creating a competing definition.

## 8. Knowledge quality

Every knowledge record or relation should support:

- source reference;
- observed or effective date;
- last verification date;
- owner or responsible organisation;
- confidence: `confirmed`, `probable`, `suggested`;
- lifecycle: `current`, `superseded`, `archived`, `unknown`.

An AI summary is not a fact merely because it is written confidently.

## 9. Development governance

- Work is performed through focused branches and pull requests.
- CI must pass before merge.
- New dependencies and integrations require a documented reason.
- Mock data precedes live data.
- Read-only precedes write access.
- A stable API or adapter boundary precedes UI coupling.
- ChatDev or other agent teams may implement and test, but do not determine product truth.
- Major decisions are recorded as ADRs in `docs/decisions/`.
- The relevant canonical documentation is reviewed after implementation and before merge.
- `STATUS.md` is updated last when a change alters current project state.

A pull request is not complete when it changes system behavior, vocabulary, authority, workflow or product structure but leaves the relevant canonical documentation inaccurate or contradictory.

## 10. Success criteria

Adventure OS succeeds when Boris can:

- understand what needs attention without checking six applications;
- open a person, project, group or organisation and see its connected context;
- find scattered information without remembering its storage location;
- receive concise, source-grounded briefings;
- convert notes, messages and observations into organised work with minimal manual entry;
- trust that automation will not make consequential changes behind his back.

## 11. Non-goals for the initial phases

- replacing all existing operational tools;
- migrating the full historical archive;
- building a generic commercial SaaS product;
- autonomous financial or booking decisions;
- real 3D visual effects before spatial navigation proves useful;
- indexing every personal file before access, privacy and retention rules are defined.
