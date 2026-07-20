# Adventure OS — Knowledge Graph

## Purpose

The knowledge graph connects records that currently live in separate systems. It does not copy every source record. It stores stable identities, source references, relationships, derived summaries and confidence.

## Graph model

The graph consists of:

- **nodes**: entities from `DOMAIN_MODEL.md`;
- **edges**: typed relationships between nodes, using the canonical catalogue in `RELATIONSHIPS.md`;
- **source references**: evidence for nodes and edges;
- **events**: time-stamped changes or observations;
- **projections**: Mission Control, System Map, entity context, chronological
  context and Search. UI route ownership is defined in `MASTER.md`.

## Initial node types

The first implementation should support:

- Person
- Organisation
- Brand
- Project
- Task
- TripGroup
- Participant
- Booking
- Adventure
- Document
- Message
- Meeting
- Payment
- Expense
- Asset
- Bike
- Location
- EventRecord

Additional types are added only after a real use case requires them.

## Initial edge types

The canonical relationship catalogue and service contract live in [`docs/RELATIONSHIPS.md`](RELATIONSHIPS.md). The list below is an initial subset, not a separate model:

- `PERSON_MEMBER_OF_ORGANISATION`
- `PERSON_PARTICIPATES_IN_PROJECT`
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
- `ALLOCATION_ASSIGNS_ASSET`
- `PAYMENT_APPLIES_TO_BOOKING`
- `PAYMENT_APPLIES_TO_TRIP_GROUP`
- `DOCUMENT_EVIDENCES_ENTITY`
- `DOCUMENT_MENTIONS_ENTITY`
- `MESSAGE_RELATES_TO_ENTITY`
- `ASSET_LOCATED_AT_LOCATION`
- `EVENT_RECORD_AFFECTS_ENTITY`

Edges are directional but can be queried in both directions.

## Edge evidence

Each edge must include:

```ts
{
  id: string;
  type: EdgeType;
  fromEntityId: string;
  toEntityId: string;
  confidence: "confirmed" | "probable" | "suggested";
  sourceRefs: SourceReference[];
  observedAt?: string;
  validFrom?: string;
  validTo?: string;
  createdBy: "human" | "import" | "agent" | "rule";
  reviewStatus: "accepted" | "pending" | "rejected";
}
```

No inferred edge is silently promoted to confirmed.

## Identity resolution

The same real entity may appear under different names and IDs across systems. Identity resolution follows these rules:

1. Preserve every source ID.
2. Match exact stable identifiers first: email, legal registration number, fleet code, booking ID.
3. Use name and context only as supporting signals.
4. Never auto-merge high-impact entities such as payments, companies or customers.
5. Store candidate matches as suggested relations until reviewed.
6. Maintain aliases rather than overwriting source names.

## Source references

A source reference should include:

```ts
{
  system: "google-drive" | "gmail" | "plane" | "docmost" | "notion" | "adventure-hub" | "github" | "apple-notes" | "apple-reminders" | string;
  objectType: string;
  externalId: string;
  url?: string;
  title?: string;
  version?: string;
  observedAt: string;
  modifiedAt?: string;
  checksum?: string;
}
```

## Graph views

### Mission Control
A prioritised projection of events, tasks, bookings, deadlines, unresolved questions and alerts. This supersedes the prototype label `Today`.

### System Map
A spatial projection across:

- organisation or brand;
- project, operation or theme;
- status, urgency or time.

The earlier `Matrix` and `Graph` labels describe interaction patterns now
owned by System Map. Neither is a separate data model or route.

### Entity workspace
Opening any Person, Organisation, Project, TripGroup or Asset shows:

- summary;
- connected entities;
- current work;
- timeline;
- documents and messages;
- source systems;
- unresolved inferred relations.

### Timeline
A chronological view of EventRecords and source changes.

### Universal search
Search returns entities and connected context, not only files. Results must expose source and freshness.

## Event model

Important changes become immutable EventRecords:

- TaskCreated
- TaskCompleted
- BookingCreated
- BookingStatusChanged
- PaymentReceived
- ExpenseRecorded
- DocumentCreated
- DocumentSigned
- MeetingCompleted
- DecisionRecorded
- AssetAllocated
- AssetServiced
- SourceIndexed
- RelationshipSuggested
- RelationshipConfirmed

Events enable incremental updates so agents do not need to rescan all systems repeatedly.

## Storage approach

Initial recommendation:

- PostgreSQL for nodes, edges, source references, events and audit data;
- `pgvector` for semantic retrieval over approved text chunks and summaries;
- relational tables remain primary for known entities and relationships;
- embeddings supplement search and do not replace structured identity.

A dedicated graph database is not required initially. Introduce one only if graph traversal or scale proves PostgreSQL insufficient.

## Indexing boundaries

Do not index everything by default.

Each source must define:

- allowed scopes;
- excluded folders/spaces/lists;
- personal-data classification;
- retention policy;
- refresh strategy;
- whether full content or metadata-only is stored.

The initial Google Drive scope is the supplied WORK folder. The initial Plane scope is read-only. Notion initially covers Multiday. Adventure Hub is limited to documented and approved reporting endpoints.

## First graph validation scenario

The first end-to-end test is:

> Find everything related to one known Multiday TripGroup and explain the links among agency, participants, payments, hotels, bike allocation, documents, tasks and communication.

The result must distinguish facts from inference and link back to every source.
