# Adventure OS — Domain Model

## Purpose

This document defines the shared vocabulary and core entities used by the UI, knowledge graph, integrations and AI agents. It prevents the same word from meaning different things across Adventure Hub, Plane, Notion, Drive and internal conversation.

The conceptual business domains that organise these canonical entities are defined in [`docs/domain/DOMAIN_LANDSCAPE.md`](domain/DOMAIN_LANDSCAPE.md). This document defines the entities themselves; the Domain Landscape defines their primary conceptual domains. Canonical relationship types are defined in [`docs/RELATIONSHIPS.md`](RELATIONSHIPS.md).

## Modelling rule

Adventure OS treats every important business object as an **entity** with a stable internal ID and one or more source references. Source-system IDs are never used as the only global identity.

No source system defines the canonical domain. Source-system terminology and records are mapped into the Adventure OS model.

## Core entity groups

### Identity and organisation

#### Person
A human being: guest, participant, employee, guide, supplier contact, partner, member or collaborator.

A Person may have multiple roles and may belong to multiple organisations.

#### Organisation
A legal, operational or community body: company, NGO, government institution, travel agency, supplier, hotel, restaurant, partner or client organisation.

#### Brand
A public-facing identity or initiative operated by one or more organisations, for example Durmitor Adventure, Wild Collective, XElements or DiscoverMNE.

A Brand is not automatically a legal entity.

#### Team
A working group of people with a shared operational purpose. A Team can span organisations and brands.

### Work and planning

#### Project
A bounded body of work with an outcome, owner, status and lifecycle. Examples: Adventure OS, new website, XElements 2026, NP management-plan proposals.

A Project is not a recurring daily activity or a customer booking.

#### Task
A concrete action with an owner, status and optional due date. Plane is the initial authoritative task system.

#### Idea
An undeveloped opportunity, observation or proposal. An Idea becomes a Task or Project only after review.

#### Decision
A recorded choice with context, alternatives, owner, date and consequences.

#### Meeting
A scheduled or completed interaction with participants, notes, decisions and follow-ups.

#### Event
A time-bounded organised occurrence such as a race, festival, workshop or gathering. An Event can itself contain Projects and Tasks.

An Event is a domain object that is planned, scheduled or operated. It is not
the same as an `EventRecord`, which records that something happened in the
system or a source.

### Outdoor operations

#### ActivityType
A service category such as canyoning, rafting, hiking, e-bike, paragliding or via ferrata.

#### Adventure
A sellable or bookable product configuration in Adventure Hub, with price, meeting points, slots and seasonality.

#### Tour
An operational delivery of an activity or itinerary. A Tour may be private, guided, self-guided, daily or multiday.

#### Booking
A commercial reservation request or confirmed reservation. Adventure Hub is
the business source of truth for daily activity bookings. Adventure OS can read
only the booking fields and lifecycle operations established by a confirmed API
contract; broader reporting capabilities remain unknown.

#### BookingItem
One dated activity selection within a Booking. A Booking may contain multiple BookingItems.

#### TripGroup
A multiday group operated as a coherent unit, commonly linked to an agency, participants, hotels, transfers, payments and expenses.

`TripGroup` is preferred over the ambiguous standalone term `Group` in technical schemas.

#### Participant
A Person participating in a TripGroup, Tour or Event. Participant is a
contextual role, not a duplicate identity. A Participant may still be stored as
a contextual record when it carries role-specific fields such as room,
waiver, dietary note, price or segment participation; it must reference the
Person when identity is known.

#### Agency
An Organisation acting as a travel intermediary or group client. Agency is a role/type of Organisation.

This meaning must remain distinct from the internal economic or cost-recovery concept called “Agency” in ADR-0002. The latter requires separate terminology before it becomes canonical.

#### GuideAssignment
The relationship between a Person acting as guide and a Tour, BookingItem, Event or TripGroup segment.

Guide is a role of Person. `GuideAssignment` is the canonical contextual record
when the assignment has its own time, segment, responsibility or source
metadata; a separate Guide identity must not be created.

#### Location
A physical or logical place: office, meeting point, trailhead, lake, hotel, storage location or region.

### Assets and logistics

#### Asset
A durable item owned, managed or tracked by an Organisation: bike, vehicle, device, tent or technical equipment.

#### Bike
A specialised Asset with fleet code, type, size, ownership, location and service history.

#### Vehicle
A specialised Asset used for transport.

#### EquipmentItem
An equipment inventory concept used for countable stock or operational items.
If a durable physical unit is individually identified, owned, serviced or
allocated, model it as an Asset (or an approved Asset subtype) rather than a
duplicate EquipmentItem record. Quantity-based stock can remain an
EquipmentItem.

#### ServiceRecord
A maintenance, inspection or repair event for an Asset.

#### Allocation
A time-bound reservation or assignment of an Asset to a Person, Booking, Tour or TripGroup.

#### Transfer
Movement of people or assets between Locations.

### Commercial and finance

#### Customer
A Person or Organisation purchasing or requesting services. Customer is a role, not a separate identity entity.

#### Payment
Money received or expected, with payer, recipient, amount, currency, method, status and related commercial object.

#### Expense
Money spent or owed, with payer, supplier, category and related Project, TripGroup, Tour or Organisation.

#### Transaction
A direction-neutral financial movement used only when the source does not yet
establish whether money is received or spent. Map to Payment or Expense when
direction and business meaning become known; do not retain both as independent
canonical facts for the same movement.

#### Invoice
A formal incoming or outgoing financial document with lines and status.

#### Settlement
A calculated obligation between participating companies after collections, expenses, fees and profit-share rules.

#### Offer
A commercial proposal issued before booking or agreement.

#### Inquiry
An incoming request that may become an Offer, Booking, TripGroup or Project.

### Knowledge and communication

#### Document
A file or maintained page with title, type, source, version, owner and relations. The binary content may remain in Drive, Docmost, Documenso or another source.

#### Message
An email, chat message or imported communication unit.

#### Conversation
A thread or coherent exchange containing Messages.

#### Note
A lightweight personal or operational capture, including Apple Notes imports.

#### Reminder
A personal or operational prompt, including Apple Reminders references.

#### KnowledgeRecord
A curated fact, summary, policy, procedure or explanation derived from one or more sources.

#### SourceReference
A pointer to the authoritative external record: system, object type, external ID, URL, version and observed date.

### System and governance

#### Integration
A configured connection to an external system with access scope, mode, owner and health state.

#### AgentAction
A proposed or executed AI operation, including requested permissions, evidence, result and audit status.

#### EventRecord
An immutable description of something that happened: booking created, payment received, task completed, document signed, asset serviced.

An EventRecord is system evidence and may reference an Event or any other
entity. It does not replace the planned or operated Event entity.

#### AuditRecord
A trace of who or what read, proposed or changed data.

## Key distinctions

- **Organisation vs Brand:** Organisation is operational/legal; Brand is public identity.
- **Project vs TripGroup:** Project creates an outcome; TripGroup delivers a customer itinerary.
- **ActivityType vs Adventure vs Tour:** type/category → sellable product → actual delivery.
- **Booking vs BookingItem:** reservation container → one selected activity/date.
- **Person vs Participant/Customer/Guide:** Person is identity; the others are
  roles in context. Participant and GuideAssignment may carry contextual fields
  without becoming duplicate Person records.
- **Document vs KnowledgeRecord:** Document is a source object; KnowledgeRecord is curated meaning.
- **Task vs Reminder:** Task belongs to shared work; Reminder may remain personal and lightweight.
- **Asset vs Bike/Vehicle/EquipmentItem:** Bike and Vehicle are specialised
  Assets. Individually tracked durable equipment is also an Asset;
  EquipmentItem is reserved for operational inventory or countable stock.
- **Event vs EventRecord:** Event is planned or operated business reality;
  EventRecord is immutable evidence that a change or occurrence was observed.
- **Payment/Expense vs Transaction:** Payment and Expense express known
  direction and business meaning; Transaction is the temporary neutral form
  when those semantics are not established.

## Relationship confidence

Every inferred relation uses one of:

- `confirmed`: directly supported by an authoritative source or human confirmation;
- `probable`: strongly supported by matching identifiers and context;
- `suggested`: useful hypothesis requiring review.

The canonical relationship catalogue and service contract live in [`docs/RELATIONSHIPS.md`](RELATIONSHIPS.md). Services should add or return relationship types from that document rather than inventing source-specific links.

## Lifecycle fields

Core entities should support where relevant:

- `status`
- `createdAt`
- `updatedAt`
- `effectiveFrom`
- `effectiveTo`
- `sourceRefs[]`
- `ownerRef`
- `organisationRefs[]`
- `confidence`
- `visibility`
- `archivedAt`

## Open domain questions

The following must be resolved with source audits, not guessed:

1. Whether Multiday `TripGroup` remains authoritative in Notion or moves to a dedicated database.
2. Whether Adventure Hub exposes read APIs for booking lifecycle, capacity, payments and reporting beyond the public modal endpoints.
3. Whether Plane should hold only Tasks or also Projects and Ideas.
4. Whether Apple Reminders remain personal-only or selected lists become shared operational input.
5. Which finance objects are authoritative in accounting/fiscalisation systems versus Adventure OS reporting.
6. Whether ADR-0002 requires canonical `Activity`, `VATEntry`, `Supplier` and `Import` entities, and how they relate to `ActivityType`, `Adventure`, organisations and commercial records.
7. Which distinct term should replace the internal economic meaning of “Agency” in ADR-0002.
8. Whether `Adventure` remains the final canonical term or is later placed beneath a broader `Product` abstraction.
