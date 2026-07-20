# Notion GROUPS Reference Implementation

Status: Sprint 1 complete
Last updated: 2026-07-20
Workspace: Notion WORK / 2026 Multiday - TEST / MCP CLEANUP
Scope: GROUPS database only, implemented as the first Notion runtime reference for `TripGroup`

## Purpose

This document records the Sprint 1 implementation decisions for aligning the MCP Cleanup Notion GROUPS database with the current Adventure OS documentation.

The Notion database remains a source-system implementation. It does not define the canonical domain model. Canonical terms, entity boundaries and relationships remain governed by the Adventure OS documentation.

Permanent implementation decisions are recorded in `docs/IMPLEMENTATION_DECISIONS.md`. This file remains the detailed Notion changelog for the Sprint 1 reference implementation work.

## References Reviewed

- `docs/DOMAIN_MODEL.md`
- `docs/RELATIONSHIPS.md`
- `docs/domain/DOMAIN_LANDSCAPE.md`
- `docs/PROJECT_CONSTITUTION.md`
- `docs/MCP_INTEGRATIONS.md`
- `docs/SOURCE-MAP.md`
- `docs/ROADMAP.md`
- `docs/STATUS.md`
- Implementation Plan draft from `origin/pr-22`, reviewed as context only because it is not present on current `main`

No standalone `Vocabulary.md` or `Rulebook.md` file exists on current `main`. The vocabulary source used for this sprint is `docs/DOMAIN_MODEL.md`, whose stated purpose is to define the shared vocabulary. Rule constraints were taken from `docs/PROJECT_CONSTITUTION.md` and the current sprint instructions.

## Implemented Notion Target

- Database page: `Trip Groups`
- Original database title: `TOURS`
- Data source: `collection://02f814d0-e141-82ae-9a5e-073b49406e2c`
- Parent: `2026 Multiday - TEST / MCP CLEANUP`

## Reviewed Notion Databases

- `Trip Groups`
- `Bikes`
- `Agencies`
- `Participants`
- `Payments`
- `Expenses`
- `Hotel Bookings`
- `Transfers`
- `Guides`
- `Guide Assignments`

## Changelog

### CHANGE-001

Changed:
`TOURS`

To:
`Trip Groups`

Reason:
`docs/DOMAIN_MODEL.md` defines `TripGroup` as the canonical multiday operational entity and states that `TripGroup` is preferred over the ambiguous standalone term `Group` in technical schemas. `docs/domain/DOMAIN_LANDSCAPE.md` places `TripGroup` in Operations, distinct from `Tour`.

### CHANGE-002

Changed:
`Group`

To:
`Trip Group`

Reason:
The title property represents the TripGroup entity instance, not a generic group and not a Tour. Reference: `docs/DOMAIN_MODEL.md` / `TripGroup`; `docs/DOMAIN_MODEL.md` / Key distinctions / `Project vs TripGroup`; `docs/domain/DOMAIN_LANDSCAPE.md` / Operations.

### CHANGE-003

Changed:
`Dates`

To:
`Trip Dates`

Reason:
The date range belongs to a multiday TripGroup operating unit. The rename keeps the existing Notion date-range implementation and does not invent separate cardinality or lifecycle rules. Reference: `docs/DOMAIN_MODEL.md` / `TripGroup`; `docs/DOMAIN_MODEL.md` / Lifecycle fields.

### CHANGE-004

Changed:
`PAX`

To:
`PAX Total`

Reason:
The property is an operational count on the TripGroup, not a separate entity. The rename standardises the existing field without changing its semantics. Reference: `docs/DOMAIN_MODEL.md` / `TripGroup`; `docs/MCP_INTEGRATIONS.md` / Notion Multiday purpose.

### CHANGE-005

Changed:
`Agency`

To:
`Agency / Client Organisation`

Reason:
`Agency` is not an independent canonical identity entity. It is a role/type of `Organisation` acting as travel intermediary or group client. The existing Notion relation was kept and renamed to make the target entity explicit. Reference: `docs/DOMAIN_MODEL.md` / `Agency`; `docs/domain/DOMAIN_LANDSCAPE.md` / Agency terminology caution; `docs/RELATIONSHIPS.md` / `ORGANISATION_ACTS_AS_AGENCY_FOR_TRIP_GROUP`.

### CHANGE-006

Changed:
`👥 PARTICIPANTS`

To:
`Participants`

Reason:
The existing relation maps to the contextual `Participant` role for a TripGroup. The rename removes UI decoration from the schema name and keeps the canonical relationship visible. Reference: `docs/DOMAIN_MODEL.md` / `Participant`; `docs/RELATIONSHIPS.md` / `TRIP_GROUP_HAS_PARTICIPANT`; `docs/RELATIONSHIPS.md` / role-based relationships.

### CHANGE-007

Changed:
`Payments `

To:
`Payments`

Reason:
The trailing-space property name was cleaned up while preserving the existing relation to payments. Reference: `docs/DOMAIN_MODEL.md` / `Payment`; `docs/RELATIONSHIPS.md` / `PAYMENT_APPLIES_TO_TRIP_GROUP`.

### CHANGE-008

Changed:
empty calendar view name

To:
`Trip Groups Calendar`

Reason:
The existing calendar view now names the TripGroup runtime explicitly and continues to use the existing `Trip Dates` field. Reference: `docs/PROJECT_CONSTITUTION.md` / Human clarity before automation; `docs/DOMAIN_MODEL.md` / `TripGroup`.

### CHANGE-009

Changed:
empty table view name

To:
`All Trip Groups`

Reason:
The primary table view now names the TripGroup runtime explicitly without changing filters, sorts or business logic. Reference: `docs/PROJECT_CONSTITUTION.md` / Human clarity before automation; `docs/DOMAIN_MODEL.md` / `TripGroup`.

### CHANGE-010

Changed:
Data source description added.

Reason:
The description records that this Notion data source is a source-system implementation of the Adventure OS `TripGroup` entity and that Notion IDs remain source references, not canonical Adventure OS identity. Reference: `docs/DOMAIN_MODEL.md` / Modelling rule; `docs/PROJECT_CONSTITUTION.md` / Authoritative systems; `docs/PROJECT_CONSTITUTION.md` / Source and confidence are mandatory.

### CHANGE-011

Changed:
Reviewed database titles and descriptions.

To:
Title-case database names with descriptions covering business purpose, canonical mapping and main relationships.

Reason:
The MCP Cleanup workspace is now a reference implementation, so source-system boundaries must state how each database maps to the canonical documentation. Reference: `docs/PROJECT_CONSTITUTION.md` / canonical domain belongs to Adventure OS; `docs/DOMAIN_MODEL.md`; `docs/domain/DOMAIN_LANDSCAPE.md`; `docs/MCP_INTEGRATIONS.md`.

### CHANGE-012

Changed:
Cross-database relation names pointing at Trip Groups:

- `GROUPS 1`
- `Group`
- `Tour`

To:

- `Trip Groups`
- `Trip Group`

Reason:
The same business concept must not appear as `Tour`, `Group` and `TripGroup` in the reference implementation. Reference: `docs/DOMAIN_MODEL.md` / `TripGroup`; `docs/DOMAIN_MODEL.md` / `Tour`; `docs/RELATIONSHIPS.md` / TripGroup relationships.

### CHANGE-013

Changed:
Generic, empty or outdated view names across reviewed databases.

To:
Explicit view names such as `All Agencies`, `All Payments`, `All Expenses`, `All Transfers`, `Transfers Calendar`, `All Guides`, `Guide Assignments Calendar` and `All Guide Assignments`.

Reason:
View names should be clear in a reference implementation without changing workflow or business logic. Reference: `docs/PROJECT_CONSTITUTION.md` / Human clarity before automation.

### CHANGE-014

Changed:
`TEMPLATE - Tour Page`

To:
`TEMPLATE - Trip Group Page`

Reason:
The template is used for multiday TripGroup pages. Its content did not require a rewrite because the outdated `Tour` terminology was only in the title. Reference: `docs/DOMAIN_MODEL.md` / `TripGroup`; `docs/domain/DOMAIN_LANDSCAPE.md` / Operations.

## Intentionally Not Changed

- No new canonical entities were introduced.
- No new Notion databases were created.
- No runtime code, UI, adapters or services were changed.
- No Notion records were rewritten, merged, archived or deleted.
- No payment, expense, booking or participant business rules were changed.
- Existing status options were kept unchanged because the current model does not define a canonical TripGroup status vocabulary.
- Existing financial formulas and rollups were kept unchanged because this sprint is not a finance-model redesign.
- Existing relations to Participants, Payments, Hotel Bookings and expense rollups were kept rather than duplicated.
- Status options, embedded revenue logic, unresolved supplier terminology and ambiguous source-system `Date` fields were kept unchanged.
- Hotel Bookings was described as source-system support data; no canonical `HotelBooking` entity was introduced.

## Architecture Questions

The active Architecture Questions for this implementation are maintained in `docs/IMPLEMENTATION_DECISIONS.md` to keep one canonical AQ sequence.
