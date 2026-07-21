# Adventure OS — Master Brief

## Purpose

Adventure OS is a central visual command centre for Boris Stijepovic and the connected organisations, brands and projects around Durmitor Adventure.

It is not an immediate replacement for existing tools. Its purpose is to:

- reveal where information lives;
- connect information that belongs to the same subject;
- provide unified search and navigation;
- surface active projects, obligations and risks;
- let AI work with trusted context;
- gradually become the main operational interface.

## Core principle

Integration begins read-only. Existing systems are not moved, deleted or reorganised automatically.

Initial work is limited to inventory, classification, relationship discovery, duplicate detection and proposed future structure. Any approved repair or write scope must be explicit, testable, auditable and isolated from production where required.

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

## Current product structure

The product structure is defined by the implemented routes and validated design direction. Concept names do not create separate product areas unless they are explicitly implemented.

### Mission Control

The primary operational overview: current activities, meetings, important messages, deadlines, expected payments, unresolved decisions and warnings.

Historical concept name: `Today`.

### Communications

Messages and communication context across authorised sources.

### Operations

Operational delivery, bookings, Trip Groups, allocations, logistics, finance visibility and source health.

### Projects

Active projects, owners, next actions, deadlines, related documents, communication and risks.

### Knowledge

Curated knowledge, source-grounded explanations, domain context and maintained documentation.

### System Map

The navigable relationship and system view across people, organisations, projects, documents, activities, events and financial records.

Historical concept names: `Matrix`, `People/Graph`, `Graph`.

### Documents, Calendar and Tasks

Direct working surfaces for source-linked documents, scheduled events and accepted operational work.

### Search and AI assistance

Exact and semantic search across authorised sources, with contextual AI assistance that can find, explain, summarise, compare, draft and propose changes. Consequential actions require approval.

Historical concept name: `AI Workspace`.

## Safety model

AI may initially read, search, classify, summarise, detect duplicates and propose relationships.

AI may not delete or move files, alter production financial or booking data, send messages, issue invoices, publish content or merge records without explicit authority.

Every future write action should record source, timestamp, actor, reason and rollback path.

## Delivery sequence

The canonical delivery sequence is maintained in [`ROADMAP.md`](ROADMAP.md). Current work and dependencies are maintained in [`STATUS.md`](STATUS.md).

## Historical first milestone

The original first milestone was a polished mock-data shell using the concept names `Today`, `Matrix` and `Entity Graph`, with no production integrations.

That milestone is historical and substantially completed. Current route names and product structure are defined above and in the implemented application; historical labels must not be treated as parallel canonical navigation.
