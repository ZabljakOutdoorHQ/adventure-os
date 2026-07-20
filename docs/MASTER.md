# Adventure OS — Master Brief

## Purpose

Adventure OS is a central visual command centre for Boris Stijepovic and the connected organisations, brands and projects around Durmitor Adventure.

It is not an immediate replacement for existing tools. Its first purpose is to:

- reveal where information lives;
- connect information that belongs to the same subject;
- provide unified search and navigation;
- surface active projects, obligations and risks;
- let AI work with trusted context;
- gradually become the main operational interface.

## Core principle

The first phase is read-only. Existing systems are not moved, deleted or reorganised automatically.

Initial work is limited to inventory, classification, relationship discovery, duplicate detection and proposed future structure.

The authoritative conceptual path is:

`Reality → Domain Landscape → Canonical Entities → Relationships / States / Verbs → Knowledge Graph → Source Systems`

Read [`docs/domain/DOMAIN_LANDSCAPE.md`](domain/DOMAIN_LANDSCAPE.md) before extending the canonical model. Source systems never define the domain.

## Documentation contract

Each kind of truth has one primary home:

| Question | Primary document |
|---|---|
| Why does Adventure OS exist and what is non-negotiable? | [`PROJECT_CONSTITUTION.md`](PROJECT_CONSTITUTION.md) |
| What domains exist and where does a concept belong? | [`domain/DOMAIN_LANDSCAPE.md`](domain/DOMAIN_LANDSCAPE.md) |
| What are the canonical entities and definitions? | [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) |
| How are canonical entities related? | [`RELATIONSHIPS.md`](RELATIONSHIPS.md) |
| How does business language map to canonical names? | [`UBIQUITOUS_LANGUAGE.md`](UBIQUITOUS_LANGUAGE.md) |
| Why was an architectural choice made? | `docs/decisions/` |
| How does one business area actually operate? | Its business rulebook in `docs/research/` until promoted |
| What is true about one external system or integration? | Its document in `docs/integrations/` |
| What is the current source inventory or audit finding? | Audit/research documents, explicitly marked as current-state evidence |

Other documents should link to the primary source instead of repeating its rules or definitions. A summary may orient the reader, but it must not become a second authority.

## Domains

- Durmitor Adventure
- Multiday e-bike operations
- Wild Collective
- XElements
- WBATA
- DiscoverMNE / Deep MNE
- Personal operations

These are organisational and operational areas, not the canonical conceptual domains defined in `docs/domain/DOMAIN_LANDSCAPE.md`.

## Existing sources

Structured and operational:

- Adventure Hub
- Payload CMS
- Notion
- Plane
- Google Drive
- Gmail
- Google Calendar
- n8n
- Docmost
- Documenso
- Mattermost

Proposed or transitional:

- Chatwoot as a unified guest communication layer
- Wandero as the current replaceable guest-facing AI/chat adapter

Unstructured:

- ChatGPT conversations
- WhatsApp communication
- Excel and Numbers files
- PDFs
- images and screenshots
- local folders
- email attachments
- notes

## Initial product views

### Today

Current activities, meetings, important messages, deadlines, expected payments and operational warnings.

### Matrix

A navigable workspace across organisation/domain, project/topic and time/status. This should feel spatial and multi-directional rather than like a long chat scroll.

### Projects

Active projects, owners, next actions, deadlines, related documents, communication and risks.

### People

A consolidated view of a person and their relationships to organisations, projects, messages, bookings, payments and documents.

### Graph

An interactive relationship map between people, organisations, projects, documents, activities, events and financial records.

### Timeline

A chronological view of important events, decisions and changes.

### Search

Exact and semantic search across authorised sources.

### AI Workspace

An assistant that can find, explain, summarise, compare, draft and propose changes. Consequential actions require approval.

## Safety model

AI may initially read, search, classify, summarise, detect duplicates and propose relationships.

AI may not initially delete or move files, alter financial or booking data, send messages, issue invoices, publish content or merge records without approval.

Every future write action should record source, timestamp, actor, reason and rollback path.

## Delivery phases

1. Inventory
2. Knowledge map
3. Visual prototype with mock data
4. Read-only dashboard
5. Controlled write operations
6. AI operations
7. Stable automation through n8n and service APIs

## First milestone

Deliver a polished shell and three mock-data views:

- Today
- Matrix
- Entity Graph

No production integrations are required for the first milestone.
