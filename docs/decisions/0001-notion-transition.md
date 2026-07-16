# ADR 0001 — Notion is a transitional source, not the final operating interface

Status: Accepted
Date: 2026-07-16

## Context

The existing Notion workspace, especially the multiday operations area, contains valuable operational data and relationships, but its information architecture and user interface are inconsistent, fragmented and difficult to navigate. This mirrors the current working reality: useful information exists, but it is distributed across many views, ad-hoc databases and partially overlapping structures.

Notion therefore contains important source material, but it should not define the long-term Adventure OS product model or user experience.

## Decision

1. Notion remains available as a transitional operational source during the discovery and migration period.
2. Adventure OS will read Notion in read-only mode first and map its databases, properties, relations, duplicates and stale structures.
3. Notion will not be used as the primary Adventure OS interface.
4. Notion will not automatically become the long-term source of truth merely because a record currently exists there.
5. Stable operational data that belongs to the Adventure OS domain will gradually move to PostgreSQL-backed services or remain in another clearly designated authoritative system.
6. Historical and low-value content may stay in Notion as an archive and be indexed rather than migrated.
7. Any migration must preserve source references, original identifiers, timestamps and auditability.
8. No destructive cleanup or bulk migration occurs before a reviewed source map and entity map exist.

## Target role of Notion

Notion may serve one or more of these roles during transition:

- legacy operational database;
- discovery source;
- human-readable archive;
- temporary collaboration space;
- read-only indexed knowledge source.

It should not serve as:

- the final Adventure OS frontend;
- the permanent identity system for people, projects, groups or financial records;
- an undocumented source of truth;
- a second task manager beside Plane once task migration is complete.

## Migration classification

Every Notion database or page will receive one of four decisions:

- **Keep authoritative** — rare; Notion remains the system of record temporarily.
- **Mirror read-only** — Adventure OS reads it, but no migration is currently justified.
- **Migrate active data** — current operational records move to a structured service or PostgreSQL.
- **Archive and index** — content remains available for search but is no longer operational.

## First audit scope

The first audit should focus on Multiday operations and identify:

- databases and their actual purpose;
- duplicate or overlapping relations;
- authoritative versus calculated fields;
- current active records versus historical records;
- broken or ambiguous links;
- fields that contain business rules only Boris understands;
- which data belongs in Adventure Hub, Plane, PostgreSQL, Drive or another specialist system.

## Consequences

Positive:

- avoids rebuilding Notion chaos inside a new product;
- preserves useful historical knowledge;
- allows a gradual transition without interrupting operations;
- creates a cleaner long-term data model;
- reduces dependence on one vendor and one UI.

Trade-offs:

- temporary duplication during migration;
- source-of-truth decisions must be explicit;
- some records require human review because their meaning is not reliably inferable;
- migration takes place incrementally rather than as a single cleanup event.

## Guardrail

Adventure OS must improve navigability and clarity. It must not merely reproduce Notion pages inside a prettier shell.
