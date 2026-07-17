# Adventure OS - Canonical Relationships

## Purpose

This document defines the canonical relationship model used by Adventure OS services, adapters, graph storage, search, MCP tools and AI agents.

It is derived from:

- `docs/DOMAIN_MODEL.md`
- `docs/domain/DOMAIN_LANDSCAPE.md`
- `docs/KNOWLEDGE_GRAPH.md`
- accepted architecture and safety rules in `docs/PROJECT_CONSTITUTION.md`

The relationship catalogue is not a UI feature and does not connect any source. It is the shared contract for representing how canonical entities relate to each other.

## Core rule

Relationships describe real business meaning. They must not be generic source-system links, UI convenience fields or vague ownership shortcuts.

Every relationship must answer:

1. What canonical entity is the source?
2. What canonical entity is the target?
3. What business verb connects them?
4. Which source or human decision supports the claim?
5. Is the relationship confirmed, probable or suggested?
6. Is it current, time-bound, superseded or rejected?

## Direction

Relationships are directional for storage and audit, but services may query them in both directions.

Use the direction that best expresses the business verb:

- `Organisation OPERATES Brand`
- `Booking CONTAINS BookingItem`
- `Person ACTS_AS Participant`
- `Payment SETTLES Invoice`

Do not create inverse relationship types unless the inverse has different business meaning.

## Relationship record

All services that store, return or propose relationships should use this canonical shape.

```ts
type RelationshipConfidence = "confirmed" | "probable" | "suggested";

type RelationshipReviewStatus =
  | "accepted"
  | "pending"
  | "rejected"
  | "superseded";

type RelationshipActor = "human" | "import" | "agent" | "rule";

type CanonicalRelationship = {
  id: string;
  type: RelationshipType;
  fromEntityId: string;
  toEntityId: string;
  confidence: RelationshipConfidence;
  reviewStatus: RelationshipReviewStatus;
  sourceRefs: SourceReference[];
  observedAt: string;
  validFrom?: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: RelationshipActor;
  note?: string;
};
```

Rules:

- `sourceRefs` is required. A relationship with no evidence is a note or hypothesis, not a graph fact.
- `confirmed` requires an authoritative source or explicit human confirmation.
- `probable` and `suggested` must remain reviewable.
- Agents may propose relationships but may not silently mark them `confirmed`.
- Time-bound relationships use `validFrom` and `validTo`; do not duplicate time in the relationship type name.
- Source-system IDs remain in `sourceRefs`; they are not global entity IDs.

## Naming convention

Relationship types use uppercase snake case:

`FROMENTITY_VERB_TOENTITY`

Examples:

- `PERSON_MEMBER_OF_ORGANISATION`
- `ORGANISATION_OPERATES_BRAND`
- `BOOKING_CONTAINS_BOOKING_ITEM`
- `DOCUMENT_EVIDENCES_PAYMENT`

Use specific verbs. Avoid:

- `BELONGS_TO`
- `HAS`
- `RELATED_TO`
- `LINKED_TO`
- `OWNS`

unless the more specific legal, operational, commercial or evidentiary meaning is unavailable.

## Canonical relationship catalogue

### Identity and organisation

| Type | From | To | Meaning |
|---|---|---|---|
| `PERSON_MEMBER_OF_ORGANISATION` | Person | Organisation | A person is a member, employee or regular collaborator of an organisation. |
| `PERSON_HOLDS_ROLE` | Person | Role | A person holds a contextual role. |
| `PERSON_MEMBER_OF_TEAM` | Person | Team | A person belongs to a working team. |
| `TEAM_PART_OF_ORGANISATION` | Team | Organisation | A team operates within or across an organisation. |
| `ORGANISATION_OPERATES_BRAND` | Organisation | Brand | An organisation operates or manages a public-facing brand. |
| `ORGANISATION_PARTNER_OF_ORGANISATION` | Organisation | Organisation | Two organisations have a partnership relationship. |
| `ORGANISATION_ACTS_AS_AGENCY_FOR_TRIP_GROUP` | Organisation | TripGroup | An organisation acts as travel intermediary or group client for a multiday group. |

### Strategy and work

| Type | From | To | Meaning |
|---|---|---|---|
| `PROJECT_BELONGS_TO_BRAND` | Project | Brand | A project is primarily connected to a brand. |
| `PROJECT_OWNED_BY_ORGANISATION` | Project | Organisation | An organisation is responsible for the project. |
| `PERSON_PARTICIPATES_IN_PROJECT` | Person | Project | A person contributes to or participates in a project. |
| `PERSON_OWNS_PROJECT` | Person | Project | A person is accountable for project outcome. |
| `PROJECT_HAS_TASK` | Project | Task | A task belongs to a project context. |
| `TASK_ASSIGNED_TO_PERSON` | Task | Person | A task is assigned to a person. |
| `TASK_DEPENDS_ON_TASK` | Task | Task | A task depends on another task. |
| `IDEA_PROMOTED_TO_PROJECT` | Idea | Project | An idea was accepted and became a project. |
| `IDEA_PROMOTED_TO_TASK` | Idea | Task | An idea was accepted and became a task. |
| `MEETING_PRODUCED_DECISION` | Meeting | Decision | A meeting produced a recorded decision. |
| `DECISION_AFFECTS_ENTITY` | Decision | Any canonical entity | A decision affects an entity. |
| `EVENT_CONTAINS_PROJECT` | Event | Project | A real-world event contains or drives project work. |
| `EVENT_HAS_TASK` | Event | Task | A task belongs to an event context. |

### Experience and operations

| Type | From | To | Meaning |
|---|---|---|---|
| `ADVENTURE_HAS_ACTIVITY_TYPE` | Adventure | ActivityType | A sellable adventure belongs to an activity category. |
| `ADVENTURE_USES_ROUTE` | Adventure | Route | A sellable adventure uses a route. |
| `TOUR_DELIVERS_ADVENTURE` | Tour | Adventure | A tour operationally delivers a sellable adventure. |
| `TOUR_FOLLOWS_ROUTE` | Tour | Route | A tour follows a route. |
| `TOUR_OCCURS_AT_LOCATION` | Tour | Location | A tour occurs at or starts from a location. |
| `BOOKING_CONTAINS_BOOKING_ITEM` | Booking | BookingItem | A booking contains one dated selected item. |
| `BOOKING_ITEM_RESERVES_ADVENTURE` | BookingItem | Adventure | A booking item reserves a sellable adventure. |
| `BOOKING_ITEM_FULFILLED_BY_TOUR` | BookingItem | Tour | A booking item is fulfilled by an operational tour. |
| `TRIP_GROUP_INCLUDES_TOUR` | TripGroup | Tour | A multiday group includes one operational tour or segment. |
| `TRIP_GROUP_HAS_PARTICIPANT` | TripGroup | Participant | A trip group includes a participant role. |
| `PERSON_ACTS_AS_PARTICIPANT` | Person | Participant | A person acts as a participant in a specific context. |
| `PERSON_GUIDES_TOUR` | Person | Tour | A person acts as guide for a tour. |
| `GUIDE_ASSIGNMENT_ASSIGNS_PERSON` | GuideAssignment | Person | A guide assignment assigns a person. |
| `GUIDE_ASSIGNMENT_COVERS_TOUR` | GuideAssignment | Tour | A guide assignment covers a tour. |
| `GUIDE_ASSIGNMENT_COVERS_BOOKING_ITEM` | GuideAssignment | BookingItem | A guide assignment covers a booking item. |
| `GUIDE_ASSIGNMENT_COVERS_TRIP_GROUP` | GuideAssignment | TripGroup | A guide assignment covers a multiday group or segment. |

### Resources and logistics

| Type | From | To | Meaning |
|---|---|---|---|
| `ASSET_SPECIALISED_AS_BIKE` | Asset | Bike | An asset is represented as a specialised bike record. |
| `ASSET_SPECIALISED_AS_VEHICLE` | Asset | Vehicle | An asset is represented as a specialised vehicle record. |
| `ASSET_LOCATED_AT_LOCATION` | Asset | Location | An asset is currently or historically located at a location. |
| `ASSET_OWNED_BY_ORGANISATION` | Asset | Organisation | An organisation owns or controls an asset. |
| `EQUIPMENT_ITEM_PART_OF_ASSET` | EquipmentItem | Asset | A countable equipment item belongs to or composes an asset. |
| `ALLOCATION_ASSIGNS_ASSET` | Allocation | Asset | An allocation reserves or assigns an asset. |
| `ALLOCATION_TO_PERSON` | Allocation | Person | An allocation assigns an asset to a person. |
| `ALLOCATION_TO_BOOKING` | Allocation | Booking | An allocation assigns an asset to a booking. |
| `ALLOCATION_TO_TOUR` | Allocation | Tour | An allocation assigns an asset to a tour. |
| `ALLOCATION_TO_TRIP_GROUP` | Allocation | TripGroup | An allocation assigns an asset to a multiday group. |
| `SERVICE_RECORD_SERVICES_ASSET` | ServiceRecord | Asset | A maintenance or inspection record applies to an asset. |
| `TRANSFER_MOVES_PERSON` | Transfer | Person | A transfer moves a person. |
| `TRANSFER_MOVES_ASSET` | Transfer | Asset | A transfer moves an asset. |
| `TRANSFER_FROM_LOCATION` | Transfer | Location | A transfer starts at a location. |
| `TRANSFER_TO_LOCATION` | Transfer | Location | A transfer ends at a location. |

### Commercial and finance

| Type | From | To | Meaning |
|---|---|---|---|
| `BOOKING_CUSTOMER_IS_PERSON` | Booking | Person | A person is the customer for a booking. |
| `BOOKING_CUSTOMER_IS_ORGANISATION` | Booking | Organisation | An organisation is the customer for a booking. |
| `INQUIRY_FROM_PERSON` | Inquiry | Person | An inquiry came from a person. |
| `INQUIRY_FROM_ORGANISATION` | Inquiry | Organisation | An inquiry came from an organisation. |
| `INQUIRY_CONVERTED_TO_OFFER` | Inquiry | Offer | An inquiry became a commercial offer. |
| `OFFER_CONVERTED_TO_BOOKING` | Offer | Booking | An offer became a booking. |
| `OFFER_CONVERTED_TO_TRIP_GROUP` | Offer | TripGroup | An offer became a multiday group. |
| `PAYMENT_RECEIVED_FROM_PERSON` | Payment | Person | A payment was received from a person. |
| `PAYMENT_RECEIVED_FROM_ORGANISATION` | Payment | Organisation | A payment was received from an organisation. |
| `PAYMENT_APPLIES_TO_BOOKING` | Payment | Booking | A payment applies to a booking. |
| `PAYMENT_APPLIES_TO_TRIP_GROUP` | Payment | TripGroup | A payment applies to a multiday group. |
| `PAYMENT_SETTLES_INVOICE` | Payment | Invoice | A payment settles an invoice. |
| `EXPENSE_PAID_TO_ORGANISATION` | Expense | Organisation | An expense is paid or owed to an organisation. |
| `EXPENSE_APPLIES_TO_PROJECT` | Expense | Project | An expense belongs to a project. |
| `EXPENSE_APPLIES_TO_TRIP_GROUP` | Expense | TripGroup | An expense belongs to a multiday group. |
| `EXPENSE_APPLIES_TO_TOUR` | Expense | Tour | An expense belongs to a tour. |
| `EXPENSE_APPLIES_TO_ORGANISATION` | Expense | Organisation | An expense belongs to an organisation. |
| `INVOICE_ISSUED_BY_ORGANISATION` | Invoice | Organisation | An organisation issued an invoice. |
| `INVOICE_BILLED_TO_PERSON` | Invoice | Person | A person is billed by an invoice. |
| `INVOICE_BILLED_TO_ORGANISATION` | Invoice | Organisation | An organisation is billed by an invoice. |
| `SETTLEMENT_RECONCILES_PAYMENT` | Settlement | Payment | A settlement reconciles a payment. |
| `SETTLEMENT_RECONCILES_EXPENSE` | Settlement | Expense | A settlement reconciles an expense. |
| `SETTLEMENT_BETWEEN_ORGANISATIONS` | Settlement | Organisation | An organisation participates in a settlement. |

### Knowledge, documents and communication

| Type | From | To | Meaning |
|---|---|---|---|
| `DOCUMENT_EVIDENCES_ENTITY` | Document | Any canonical entity | A document is evidence for an entity. |
| `DOCUMENT_MENTIONS_ENTITY` | Document | Any canonical entity | A document mentions an entity without necessarily evidencing it. |
| `DOCUMENT_SUPPORTS_PROJECT` | Document | Project | A document supports a project. |
| `DOCUMENT_SUPPORTS_TOUR` | Document | Tour | A document supports a tour. |
| `DOCUMENT_SUPPORTS_TRIP_GROUP` | Document | TripGroup | A document supports a multiday group. |
| `DOCUMENT_SUPPORTS_PAYMENT` | Document | Payment | A document supports a payment. |
| `DOCUMENT_SUPPORTS_EXPENSE` | Document | Expense | A document supports an expense. |
| `DOCUMENT_CURATED_INTO_KNOWLEDGE_RECORD` | Document | KnowledgeRecord | A document was curated into a knowledge record. |
| `KNOWLEDGE_RECORD_DESCRIBES_ENTITY` | KnowledgeRecord | Any canonical entity | A curated fact, policy or explanation describes an entity. |
| `CONVERSATION_CONTAINS_MESSAGE` | Conversation | Message | A conversation contains a message. |
| `MESSAGE_FROM_PERSON` | Message | Person | A message was sent by a person. |
| `MESSAGE_TO_PERSON` | Message | Person | A message was sent to a person. |
| `MESSAGE_RELATES_TO_ENTITY` | Message | Any canonical entity | A message relates to an entity. |
| `NOTE_RELATES_TO_ENTITY` | Note | Any canonical entity | A note relates to an entity. |
| `REMINDER_RELATES_TO_ENTITY` | Reminder | Any canonical entity | A reminder relates to an entity. |

### Governance, systems and audit

| Type | From | To | Meaning |
|---|---|---|---|
| `AGENT_ACTION_AFFECTS_ENTITY` | AgentAction | Any canonical entity | An agent action affects or proposes to affect an entity. |
| `AUDIT_RECORD_RECORDS_AGENT_ACTION` | AuditRecord | AgentAction | An audit record records an agent action. |
| `AUDIT_RECORD_RECORDS_ENTITY` | AuditRecord | Any canonical entity | An audit record records access to or changes around an entity. |
| `EVENT_RECORD_AFFECTS_ENTITY` | EventRecord | Any canonical entity | An event affects an entity. |

Relationship creation, review, rejection and supersession are recorded in relationship metadata and audit logs. Do not create relationship-to-relationship graph edges unless the storage layer later introduces relationship records as first-class graph nodes through an accepted architecture decision.

Integration health, source discovery and indexing state belong in integration records, event records and `sourceRefs`. They are not business relationships between canonical entities.

## Source references are not relationships

`SourceReference` points to evidence in an external system. It is not itself a business relationship.

Correct:

- `Task TASK_ASSIGNED_TO_PERSON Person`
- supported by `sourceRefs: [{ system: "plane", objectType: "work_item", externalId: "..." }]`

Incorrect:

- `Task RELATED_TO_PLANE_WORK_ITEM PlaneWorkItem`

The source-system object can be stored as evidence, but it does not become a canonical node unless it has independent business meaning.

## Roles versus entities

Contextual roles are represented as relationships unless the role needs its own lifecycle, fields or source references.

Examples:

- Customer is usually a role of Person or Organisation in relation to Booking, Offer, Payment or TripGroup.
- Participant is a contextual role and may be an entity when it carries participant-specific fields such as room, waiver, dietary note or segment participation.
- GuideAssignment is an entity because it can have time, segment, responsibility, source and review status.

Do not duplicate Person records for participant, customer, guide, employee or partner roles.

## Open modelling boundaries

The following remain unresolved and must not be guessed into production services:

1. Whether ADR-0002 requires canonical `Activity`, `VATEntry`, `Supplier` and `Import` entities.
2. Which term replaces the internal economic meaning of "Agency" from ADR-0002.
3. Whether `Adventure` stays the canonical sellable entity or moves under a broader `Product` abstraction.
4. Whether `Program`, `CostCenter`, `Contract`, `Waiver`, `Licence`, `Permit`, `Certificate`, `InsurancePolicy`, `ComplianceRequirement` and `Inspection` become canonical entities.
5. Whether Plane owns only Tasks or also Projects and Ideas.

Until resolved, services may record source references and suggested relationships, but must not promote these concepts to confirmed canonical relationships.

## Service implementation rules

All services should follow these rules:

1. Return canonical relationship records, not raw adapter links.
2. Keep source-system IDs in `sourceRefs`.
3. Preserve confidence and review status through every API boundary.
4. Never collapse distinct meanings into a generic `belongsTo`.
5. Use `validFrom` and `validTo` for temporary assignments, memberships, allocations and guide assignments.
6. Do not auto-confirm inferred relationships.
7. Reject relationship writes that lack evidence or an explicit human decision.
8. Treat relationship deletion as supersession or rejection unless a record was created in error.
9. Keep relationship type additions small and backed by a documented use case.
10. Update this document before adding new relationship types to services.

## Minimum initial implementation set

The first graph/service implementation should support this subset before expanding:

- `PERSON_MEMBER_OF_ORGANISATION`
- `ORGANISATION_OPERATES_BRAND`
- `PROJECT_BELONGS_TO_BRAND`
- `PROJECT_HAS_TASK`
- `TASK_ASSIGNED_TO_PERSON`
- `ADVENTURE_HAS_ACTIVITY_TYPE`
- `TOUR_DELIVERS_ADVENTURE`
- `BOOKING_CONTAINS_BOOKING_ITEM`
- `BOOKING_ITEM_RESERVES_ADVENTURE`
- `TRIP_GROUP_HAS_PARTICIPANT`
- `PERSON_ACTS_AS_PARTICIPANT`
- `PERSON_GUIDES_TOUR`
- `ASSET_LOCATED_AT_LOCATION`
- `ALLOCATION_ASSIGNS_ASSET`
- `PAYMENT_APPLIES_TO_BOOKING`
- `PAYMENT_APPLIES_TO_TRIP_GROUP`
- `DOCUMENT_EVIDENCES_ENTITY`
- `DOCUMENT_MENTIONS_ENTITY`
- `MESSAGE_RELATES_TO_ENTITY`
- `EVENT_RECORD_AFFECTS_ENTITY`

This subset matches the first useful Adventure OS views: Mission Control, Search, System Map, Projects, Tasks, Operations, Documents and future TripGroup validation.
