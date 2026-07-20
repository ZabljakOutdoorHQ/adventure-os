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
