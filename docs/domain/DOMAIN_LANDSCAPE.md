# Adventure OS — Domain Landscape

## Purpose

This document defines the major business domains that together describe the Adventure OS universe.

Domains are conceptual boundaries. They are not software modules and they are not source systems. Every canonical entity has one primary domain, while relationships may span multiple domains.

## Core principles

- Reality comes before software.
- Adventure OS owns the canonical domain model.
- No source system defines the domain.
- Source systems implement or expose parts of the domain.
- Domains should remain stable even when software changes.
- Every canonical entity must belong to one primary domain.
- If a concept does not clearly fit an existing domain, review the domain model before introducing it.

## Domain overview

### Identity

Represents people and the roles through which they participate.

Primary entities:

- Person
- Role
- Team

### Organisations

Represents legal, operational and public-facing organisational structures.

Primary entities:

- Organisation
- Brand
- Partner role

### Experience

Represents what is offered and what the guest experiences before, during and after an adventure.

Primary entities and concepts:

- Adventure
- ActivityType
- SafetyLevel
- Difficulty
- Media
- Review
- Instruction
- Waiver

Experience describes the product and guest experience. It is distinct from operational delivery.

The term `Activity` remains unresolved because ADR-0002 may require it as a distinct economic entity. It must not be silently collapsed into `ActivityType` or `Adventure`.

### Operations

Represents execution and delivery.

Primary entities:

- Tour
- Booking
- BookingItem
- TripGroup
- Participant role
- GuideAssignment
- Schedule

### Resources

Represents physical, geographic and capacity-constrained resources.

Primary entities:

- Asset
  - Bike
  - Vehicle
  - EquipmentItem
  - Device
- Location
- Route
- Accommodation
- Allocation
- ServiceRecord
- Transfer

`Bike` is a specialised `Asset`, not a top-level peer of Person, Organisation or Tour.

`Route` belongs primarily to Resources. An Adventure may use a Route and a Tour may follow a Route.

### Commercial

Represents commercial relationships and financial records.

Primary entities:

- Customer role
- Inquiry
- Offer
- Payment
- Expense
- Transaction
- Invoice
- Settlement

ADR-0002 additionally requires review of the following possible canonical entities:

- Activity as an economic entity
- VATEntry
- Supplier role or entity
- Import

These remain explicit modeling questions until resolved against the existing ADRs and operational evidence.

### Knowledge

Represents organisational knowledge and evidence.

Primary entities:

- Document
- Decision
- Note
- KnowledgeRecord
- Policy
- Procedure
- SourceReference

### Communication

Represents internal and external exchanges.

Primary entities:

- Conversation
- Message
- Contact role

### Strategy

Represents organisational direction and planned change.

Primary entities:

- Goal
- Initiative
- Project
- Task
- Idea
- Milestone
- KPI

### Governance

Represents compliance, control, permissions and accountability.

Primary entities:

- ComplianceRecord
- AuditRecord
- Risk
- Permission
- AgentAction
- Integration

### Time

Represents temporal structures shared by all domains.

Primary entities and concepts:

- Season
- Calendar
- Deadline
- Event
- Meeting
- EventRecord

## Cross-domain relationships

- Experience is delivered through Operations.
- Operations consume Resources.
- Operations generate Commercial records.
- Organisations own or manage Resources.
- People participate in Organisations through roles and teams.
- Knowledge describes and evidences every domain.
- Communication connects people, customers, organisations and operational records.
- Strategy drives Projects and Operations.
- Governance constrains every domain.
- Time affects every domain.

## Source systems

Source systems are not domains. They are authoritative or transitional systems that expose, store or execute parts of the canonical model.

| Source system | Current or proposed responsibility | Status |
|---|---|---|
| Adventure Hub | Daily operations, bookings, adventure catalogue and pricing | Current authoritative source within confirmed API scope |
| Notion | Multiday operations | Transitional authoritative source |
| Plane | Operational tasks | Current authoritative task source; Project scope remains open |
| Docmost | Maintained internal wiki and documentation | Current intended knowledge source; adoption details remain subject to source audit |
| Google Drive | Documents, spreadsheets, Excel/Numbers exports, PDFs and legacy files | Current mixed-authority source |
| Payload CMS | New website content, media and SEO | Current public-content authority |
| Documenso | Waivers, contracts, signing state and signed outputs | Current signing authority |
| Mattermost | Internal team communication | Current intended internal communication source |
| Chatwoot | Unified guest communication across email, WhatsApp, Viber, website chat, Messenger and Instagram DM | Proposed; not yet authoritative |
| Wandero | Current guest-facing AI/chat tool | Current replaceable adapter; not part of the canonical domain |

Additional systems such as Gmail, Google Calendar, n8n, banking, WSPay/Monri, Outdooractive and approved messaging imports remain defined in `SOURCE-MAP.md`.

## Terminology cautions

### Adventure versus Product

Source-system terminology does not decide canonical terminology. `Adventure` remains the current canonical entity, while the broader Adventure-versus-Product question stays open unless resolved through an approved domain decision.

### Agency

`Agency` currently carries two meanings:

1. an external travel intermediary or group client;
2. an internal economic or cost-recovery layer described in ADR-0002.

These meanings must be separated through distinct terminology. One ambiguous canonical entity must not represent both.

## Modeling sequence

The intended conceptual sequence is:

`Reality → Domain Landscape → Canonical Entities → Relationships / States / Verbs → Knowledge Graph → Source Systems`

## Future work

Detailed modeling continues in the existing domain and architecture documentation. The next domain artifacts should refine:

- canonical entities;
- relationships;
- states;
- verbs;
- graph representation;
- unresolved economic terminology from ADR-0002.
