# Adventure OS - Implementation Decisions

Purpose: permanent chronological log of implementation decisions that change the Adventure OS reference implementation.

This is not an ADR and does not define architecture. Architecture, ontology and business rules remain governed by the Constitution, ADRs, Domain Model, Relationships, Vocabulary and Rulebooks. This document records implementation choices made while applying that model to reference runtimes such as the MCP Cleanup Notion workspace.

Every future implementation change to a reference implementation must be recorded here.

## IMP-0001

Date: 2026-07-20

Sprint: Reference Implementation Sprint 1

Area: Implementation governance

Decision: Create `docs/IMPLEMENTATION_DECISIONS.md` as the permanent chronological implementation decision log.

Reason: The reference implementation now changes real source-system structure in Notion. Those changes need a durable implementation log without turning each operational naming/schema decision into an ADR.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/RELATIONSHIPS.md`

Implementation Status: Implemented

Open Questions: None

## IMP-0002

Date: 2026-07-20

Sprint: Reference Implementation Sprint 1

Area: Trip Groups

Decision: Rename the MCP Cleanup Notion `TOURS` data source to `Trip Groups` and rename its title property from `Group` to `Trip Group`.

Reason: The canonical multiday operating entity is `TripGroup`; `Tour` is a distinct operational delivery entity. The Notion database is storing multiday group records, not generic tours.

Reference Documents:

- `docs/DOMAIN_MODEL.md`
- `docs/domain/DOMAIN_LANDSCAPE.md`
- `docs/RELATIONSHIPS.md`

Implementation Status: Implemented

Open Questions: None

## IMP-0003

Date: 2026-07-20

Sprint: Reference Implementation Sprint 1

Area: Trip Group relationships

Decision: Standardize existing Notion relation property names that point to Trip Groups as `Trip Group` or `Trip Groups` depending on cardinality/context.

Reason: One business concept should have one implementation name. Existing properties named `Group`, `Tour`, `GROUPS 1` and `Payments ` created inconsistent source-system terminology for the same TripGroup relationship.

Reference Documents:

- `docs/DOMAIN_MODEL.md`
- `docs/RELATIONSHIPS.md`
- `docs/MCP_INTEGRATIONS.md`

Implementation Status: Implemented

Open Questions:

- AQ-004

## IMP-0004

Date: 2026-07-20

Sprint: Reference Implementation Sprint 1

Area: Database naming and descriptions

Decision: Standardize reviewed MCP Cleanup database titles to title case and add descriptions using the structure: business purpose, canonical mapping and main relationships.

Reason: The Notion workspace is now a reference implementation, so database purpose and canonical mapping must be visible at the source-system boundary.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/domain/DOMAIN_LANDSCAPE.md`
- `docs/MCP_INTEGRATIONS.md`

Implementation Status: Implemented for the reviewed MCP Cleanup databases:

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

Open Questions:

- AQ-005

## IMP-0005

Date: 2026-07-20

Sprint: Reference Implementation Sprint 1

Area: Views

Decision: Rename empty or generic Notion views to explicit `All ...` or `... Calendar` names.

Reason: Reference implementation views should be clear and consistent without introducing new workflows or business logic.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`

Implementation Status: Implemented

Open Questions: None

## IMP-0006

Date: 2026-07-20

Sprint: Reference Implementation Sprint 1

Area: Templates

Decision: Rename `TEMPLATE - Tour Page` to `TEMPLATE - Trip Group Page`.

Reason: The template is used for multiday TripGroup pages. The page content did not require a rewrite because the outdated `Tour` terminology was only in the title.

Reference Documents:

- `docs/DOMAIN_MODEL.md`
- `docs/domain/DOMAIN_LANDSCAPE.md`

Implementation Status: Implemented

Open Questions: None

## IMP-0007

Date: 2026-07-20

Sprint: Reference Implementation Sprint 1

Area: Out-of-scope fields

Decision: Preserve source-system fields whose canonical mapping is not yet decided, including status option vocabularies, embedded revenue fields, empty `Notes` select in Agencies, generic `Date` fields, `Prevoznik`, and source-specific finance rollups/formulas.

Reason: Changing these would decide architecture, lifecycle, supplier, finance or identity semantics not fully defined in the current documentation.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/domain/DOMAIN_LANDSCAPE.md`
- `docs/RELATIONSHIPS.md`

Implementation Status: Implemented by not changing those fields

Open Questions:

- AQ-001
- AQ-002
- AQ-003
- AQ-006
- AQ-007
- AQ-008

## IMP-0008

Date: 2026-07-20

Sprint: Sprint 2 - Udi Ganani Golden Dataset Validation

Area: Payments

Decision: Populate the existing Notion Payments `Amount` field with transfer received amounts for the Udi Ganani validation dataset.

Reason: The current Payments schema has only one editable amount field, and Trip Groups roll up `PAID Total` from linked Payment Amount values. Expected amounts, bank fees, payment status and payer distinctions were preserved in `docs/reference-data/UDI_GANANI_2026.md` and the validation report instead of being forced into unsupported fields.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/RELATIONSHIPS.md`
- `docs/reference-data/UDI_GANANI_2026.md`

Implementation Status: Implemented

Open Questions:

- AQ-009
- AQ-010
- AQ-017

## IMP-0009

Date: 2026-07-20

Sprint: Sprint 2.2 - Udi Trip Group Operational Page

Area: Trip Group operational pages

Decision: Use the existing Notion Trip Group database record as the operational hub page for the Udi Ganani validation case.

Reason: The existing record already owns the canonical Trip Group properties and relations. Adding operational page content to that record keeps the team in one context without creating a duplicate Trip Group or a separate competing page.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/RELATIONSHIPS.md`
- `docs/reference-data/UDI_GANANI_2026.md`

Implementation Status: Implemented

Open Questions: None

## IMP-0010

Date: 2026-07-20

Sprint: Sprint 2.2 - Udi Trip Group Operational Page

Area: Operational page content

Decision: Keep the Trip Snapshot, Payment Snapshot, group-level Bike Summary, Day-by-Day Operations, Accommodation Summary and Action Checklist as page content where the current Notion schema has no approved structured representation.

Reason: The operational team needs these verified facts in one working page, while this sprint forbids schema changes, new entities and invented assignments. Page content preserves the facts without changing architecture.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/reference-data/UDI_GANANI_2026.md`
- `docs/notion/UDI_GANANI_VALIDATION_REPORT.md`

Implementation Status: Implemented

Open Questions:

- AQ-019
- AQ-020

## IMP-0011

Date: 2026-07-20

Sprint: Sprint 2.2 - Udi Trip Group Operational Page

Area: Related-record presentation

Decision: Preserve existing Trip Group relations as the record boundary and use clear database links when the Notion connector cannot reliably create a linked view filtered by the current Trip Group.

Reason: The connector created an inline Participants linked database block but returned an empty relation filter configuration. Presenting it as filtered would be misleading, and manually copying related records would duplicate data. Payments and Hotel Bookings remain linked through existing relations and clear database links.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/RELATIONSHIPS.md`
- `docs/notion/UDI_GANANI_VALIDATION_REPORT.md`

Implementation Status: Implemented with connector limitation documented

Open Questions: None

## IMP-0012

Date: 2026-07-20

Sprint: Sprint 2.3 - Complete Udi Structured Relations

Area: Hotel Bookings

Decision: Treat the existing central Hotel Booking records as authoritative structured records and the Trip Group Accommodation Summary as an operational summary.

Reason: The three hotel stays already exist in the central Hotel Bookings database and relate to the Udi Trip Group. Keeping the page table as a summary provides operational readability without creating duplicate accommodation records or making the page the only source of truth.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/RELATIONSHIPS.md`
- `docs/reference-data/UDI_GANANI_2026.md`
- `docs/notion/UDI_GANANI_VALIDATION_REPORT.md`

Implementation Status: Implemented

Open Questions: None

## IMP-0013

Date: 2026-07-20

Sprint: Sprint 2.3 - Complete Udi Structured Relations

Area: Expenses

Decision: Do not create a central Expense record without a verified amount and authoritative source evidence.

Reason: The Udi itinerary indicates possible expense categories but does not verify incurred amounts, dates, payment methods or paying companies. Creating placeholder or estimated records would introduce unsupported business facts and could contaminate Trip Group expense rollups.

Reference Documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/RELATIONSHIPS.md`
- `docs/reference-data/UDI_GANANI_2026.md`

Implementation Status: Implemented by creating zero Expense records

Open Questions:

- AQ-021

## Architecture Questions

### AQ-001

Question: Should Notion TripGroup, Payment, Expense, Transfer, Hotel Booking and Guide Assignment status values be mapped to canonical lifecycle/status vocabularies, or remain source-system-specific until a lifecycle/state model is approved?

Why implementation cannot proceed: The current documentation says core entities should support `status` where relevant, but it does not define canonical status values for these Notion records.

Possible options:

- Keep all status values source-system-specific.
- Define canonical status vocabularies in architecture documentation.
- Map only a small confirmed subset and keep the rest source-specific.

### AQ-002

Question: Should `Program` in Trip Groups become a relation to `Tour`, `Adventure`, `ActivityType` or another approved entity, or remain a source-system select value?

Why implementation cannot proceed: The model distinguishes `ActivityType`, `Adventure`, `Tour` and `TripGroup`; the current Notion select value cannot be safely reinterpreted as one of them without an approved mapping.

Possible options:

- Leave `Program` as a source-system select.
- Map `Program` to `Tour` segments.
- Map `Program` to `Adventure` or `ActivityType` after source audit.

### AQ-003

Question: Should revenue fields embedded in Trip Groups remain there, or later move behind canonical Payment, Expense, Invoice or Settlement records?

Why implementation cannot proceed: Commercial entities and relationships are defined, but this sprint did not have authority to redesign finance structure or change formulas.

Possible options:

- Keep revenue fields embedded as Notion source-system fields.
- Move reporting through Payment/Expense/Invoice/Settlement records after finance audit.
- Keep embedded rollups but mark them derived in the adapter layer.

### AQ-004

Question: Should inverse relation property names across Participants, Payments, Expenses, Agencies, Hotel Bookings, Transfers and Guide Assignments be standardized through a dedicated relation-audit sprint?

Why implementation cannot proceed: Some inverse names were safely standardized, but a complete relation-direction audit across every database may affect source-system ergonomics and adapter mapping.

Possible options:

- Keep current inverse relation names after this sprint.
- Standardize every inverse relation name in a focused follow-up sprint.
- Leave inverse names source-system-specific and normalize only in the adapter layer.

### AQ-005

Question: Should `Hotel Bookings` remain source-system support data, become canonical `Accommodation` records, or require a separate canonical entity?

Why implementation cannot proceed: `DOMAIN_LANDSCAPE.md` lists `Accommodation`, while `DOMAIN_MODEL.md` does not define `HotelBooking` as a canonical entity.

Possible options:

- Keep Hotel Bookings as Notion support data related to TripGroup.
- Map Hotel Bookings to canonical `Accommodation` after architecture review.
- Define a new canonical entity through the architecture process.

### AQ-006

Question: Should `Prevoznik` in Transfers be mapped to Organisation/Supplier, renamed as a source-system field, or left unchanged?

Why implementation cannot proceed: The current documentation keeps Supplier role/entity as an unresolved commercial modelling question.

Possible options:

- Keep `Prevoznik` unchanged as a source-system select.
- Rename to a neutral source-system label after language-standard review.
- Map transport suppliers to Organisations after Supplier terminology is resolved.

### AQ-007

Question: Should generic `Date` fields in Bikes, Participants and Expenses receive entity-specific names, and what should those names mean?

Why implementation cannot proceed: The current documentation does not define the semantics of these source-system date fields, and guessing would create hidden business rules.

Possible options:

- Leave them as source-system `Date` fields until audited.
- Rename after confirming meaning per database.
- Normalize dates only in the adapter layer with source-field metadata.

### AQ-008

Question: Which documents should be treated as the standalone Vocabulary and Rulebook sources if separate files are required?

Why implementation cannot proceed: Current `main` does not contain standalone `Vocabulary.md` or `Rulebook.md` files. This sprint used `docs/DOMAIN_MODEL.md` for vocabulary and `docs/PROJECT_CONSTITUTION.md` for rule constraints.

Possible options:

- Treat `docs/DOMAIN_MODEL.md` as the vocabulary source until a separate Vocabulary document exists.
- Create standalone Vocabulary/Rulebook documents through architecture review.
- Keep rule constraints distributed across Constitution, ADRs and domain documents with no separate files.
