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

## Product and navigation vocabulary

This is the canonical mapping between product concepts, implemented routes and
historical names. A concept may span more than one view; legacy labels do not
create parallel routes or domain models.

| Product concept | Current UI name and route | Legacy or superseded name | Delivery status |
|---|---|---|---|
| Daily attention, priorities and briefings | Mission Control (`/`) | Today | Current route; real-source coverage remains partial |
| Cross-source retrieval | Search (`/search`) | Command palette as the only search surface | Current demo route; semantic and live-source retrieval are planned |
| Connected entities and relationship exploration | System Map (`/system-map`) | Matrix, Graph, People / People & graph | Current demo route; Matrix remains a possible interaction pattern, not a separate product area |
| Daily activity, bookings and operational state | Operations (`/operations`) | Today operations panels | Current demo route; live Adventure Hub reporting is blocked on confirmed API scope |
| Outcome-oriented bodies of work | Projects (`/projects`) | Projects | Current placeholder route |
| Shared operational actions | Tasks (`/tasks`) | Tasks inside Today or Projects | Current demo route; Plane read-only service boundary exists |
| Maintained procedures, explanations and decisions | Knowledge (`/knowledge`) | Knowledge inside the AI workspace | Current demo route |
| Source files, agreements and signed outputs | Documents (`/documents`) | Documents inside entity views | Current demo route |
| Email and message context | Communications (`/communications`) | Messages inside Today | Current demo route; no outbound action without approval |
| Tours, meetings and deadlines | Calendar (`/calendar`) | Timeline / Today calendar | Current demo route; live calendar connection is planned |
| Contextual assistance across the product | No standalone route | AI Workspace | Future capability; assistance belongs in context and search unless evidence justifies a dedicated route |

Person and Organisation remain canonical entities, not top-level navigation
requirements. Their connected context is reached through Search, System Map
and contextual panels.

## Safety model

The non-negotiable safety and authority rules live in
[`PROJECT_CONSTITUTION.md`](PROJECT_CONSTITUTION.md). Product work described
here does not weaken those rules.

## Delivery sequence

The maintained phase sequence, dependencies, exit criteria and stop conditions
live in [`ROADMAP.md`](ROADMAP.md). Current work and blockers live only in
[`STATUS.md`](STATUS.md).

## Historical first milestone

The original milestone was a polished mock-data shell for Today, Matrix and
Entity Graph without production integrations. It was completed and then
superseded by the routed Mission Control foundation and the broader clickable
prototype. The old view names are retained here only as historical context;
the current product vocabulary is the mapping above.
