# Adventure OS - Operational Integrity

Status: Proposed architecture; Financial Integrity reference implementation active in Notion

Proposal: [`ADR-0007`](decisions/0007-operational-integrity-engine.md)

## Purpose

Operational Integrity is the cross-cutting Adventure OS platform capability that
evaluates canonical business reality against explicit rules and surfaces what needs
attention. The Operational Integrity Engine is the service that will implement that
capability when evaluation is extracted from a source system. The capability is not a
separate product area, a finance feature or a source-system database.

The durable flow is:

```text
Sources
  -> Adapters
  -> Canonical Model
  -> Operational Integrity Engine
  -> Rule Packs
  -> Attention / Mission Control
```

Financial Integrity is the first Rule Pack. The existing Multiday Data Hygiene
implementation in Notion is its reference implementation; it is promoted into this
architecture rather than replaced.

## Canonical Terms

| Term | Meaning |
|---|---|
| Operational Integrity | The platform capability that evaluates operational reality against deterministic rules. |
| Operational Integrity Engine | The service that implements the Operational Integrity capability outside source systems when the extraction tripwire is reached. |
| Rule Pack | A bounded, versioned set of rules for one concern, such as Financial Integrity. |
| Rule | A deterministic test over canonical data, with stable identity, severity, evidence and provenance. |
| Signal | An automatically derived observation emitted while a Rule's condition is true. |
| Attention | The presentation of active Signals to a person or team. |
| Readiness | A derived gate based on the absence of blocking Signals in a named Rule Pack. |

Legacy implementation terms such as `Data Hygiene Center`, `Health Issues` and
`Ready for Sign-off` may remain where they are exact Notion property, view or
historical project names. They do not define parallel platform concepts.

## Terminology Transition

The terminology evolves without invalidating the working implementation:

```text
Data Hygiene
  -> Financial Integrity Rule Pack
  -> Operational Integrity
```

- `Data Hygiene` is the historical name of the first Notion control implementation.
- `Financial Integrity Rule Pack` is the current name for its deterministic financial
  Rules and Signals.
- `Operational Integrity` is the broader platform capability into which that Rule Pack
  fits.

Existing Notion formulas, rollups, fields and linked views remain valid. Legacy names
may stay where renaming would break the reference implementation. They should disappear
gradually after dependent formulas, views and documentation are migrated and verified;
this proposal does not perform that migration.

## Signal

A Signal is a deterministic observation that a subject currently matches a Rule.
It may represent missing or conflicting data, policy deviation, overdue work,
opportunity, warning or inconsistency.

A Signal is not:

- a Task;
- a Bug;
- an Issue authored by a person;
- a new canonical business entity; or
- an AI conclusion.

The defining behavior is recomputation:

1. a Rule evaluates current canonical data;
2. the Signal is present while the Rule condition is true; and
3. the Signal disappears automatically when the underlying reality changes.

Tasks may be created from Signals through a separately approved workflow, but task
lifecycle never controls Signal truth.

### Minimum Signal Contract

Every Rule must be able to produce these values without AI:

| Field | Meaning |
|---|---|
| `ruleId` and `ruleVersion` | Stable Rule identity and version. |
| `subject` | Canonical entity reference plus source reference. |
| `rulePack` | Owning Rule Pack. |
| `severity` | At minimum `blocker`, `warning` or `informational`. |
| `category` | Explainable classification such as missing data, relation error, formula error or policy deviation. |
| `evidence` | Source values that caused the Rule to match. |
| `source` | Canonical document, rulebook or approved decision that authorizes the Rule. |

Persistence, acknowledgement, waiver and lifecycle history require a future decision.
They are not required by the current Notion reference implementation.

## Rules And Rule Packs

The engine is domain-agnostic. A Rule Pack owns its rules and declares:

- a stable pack identifier and version;
- the canonical subject types it evaluates;
- deterministic predicates;
- Signal severity and category;
- evidence extraction; and
- the canonical source for each rule.

A future Rule Pack must plug into the same evaluation contract without changing the
engine core. Fleet Integrity, Booking Integrity, CRM Integrity, Website Integrity and
Equipment Integrity are extension points only. They are not implemented or scheduled
by this decision.

## Financial Integrity Reference Implementation

The current implementation is:

```text
Notion Multiday source records
  -> deterministic formulas, rollups and reviewed classifications
  -> Financial Integrity Signals
  -> filtered Notion Attention views
```

Its existing behavior remains valid:

- source records remain the facts to repair;
- deterministic conditions appear in filtered views;
- those conditions clear when the source data is corrected;
- business uncertainty remains visible rather than being inferred; and
- Hotel Bookings remain operational while Expenses remain the financial cost source.

The implementation-specific fields documented in
[`DATA_HYGIENE_VALIDATION_SPEC.md`](notion/DATA_HYGIENE_VALIDATION_SPEC.md) are the
first adapter-local expression of Financial Integrity rules. They are not a second
domain model and do not require other source systems to copy Notion property names.

## Readiness

Readiness is derived from active Signals:

```text
Ready for financial sign-off := no active blocker Signals
                                in the Financial Integrity Rule Pack
```

A display field or checkbox may mirror that result, but it cannot authoritatively
override active blocker Signals. Human approval of a consequential action remains a
separate workflow under the Project Constitution.

The current Notion `Ready for Sign-off` checkbox is a transitional display field. It
is not the canonical readiness source. Until its formula migration is proven against
the existing rule outputs, the derived blocker result takes precedence and the field
must not be used to make a blocked Trip Group ready.

## AI Boundary

Operational Integrity must function without AI.

AI may:

- explain a Signal and its evidence;
- group related Signals;
- prioritize Attention;
- recommend an action; and
- propose a candidate Rule for human review.

AI must not emit canonical Signals, suppress a deterministic Signal or activate a
candidate Rule. A Rule becomes active only through the documented implementation and
review process.

## Current And Future Architecture

Current reference implementation:

```text
Notion
  -> integrity evaluation in Notion
  -> Attention views in Notion
```

Portable target architecture:

```text
Sources
  -> Adapters
  -> Canonical Model
  -> Operational Integrity Engine
  -> Rule Packs
  -> Signal Store
  -> Mission Control
```

The Signal Store is intentionally postponed. The current Rule Pack must first prove
its operational value and portable contract. No Signal Store schema, persistence
model or migration is authorized by this document.

The extraction tripwire is explicit: evaluation should move out of Notion when
Operational Integrity must evaluate multiple independent systems of record. Until that
condition exists, the current Notion evaluator remains the valid reference
implementation. Crossing the tripwire requires a separately reviewed implementation;
it must preserve Financial Integrity semantics and use the approved adapter and
canonical-model boundaries.

## Boundaries

- Source systems remain authoritative for their business facts.
- Operational Integrity evaluates; it does not silently repair source data.
- Signals do not create new canonical entities or business rules.
- Rule definitions are versioned and cite their canonical source.
- Missing data is not treated as confirmed zero.
- Attention is a view of Signals, not an independent issue tracker.
- Mission Control consumes Signals; it does not determine Signal truth.
- Other Rule Packs stay out of scope until separately approved.

## Architecture Reconciliation

This file is the only canonical Operational Integrity specification. ADR-0007 records
the proposed architecture decision; the Constitution records only the governing
principle. Architecture-review drafts and historical implementation documents are
noncanonical and must link here rather than restating a competing specification.

Related documents retain their existing responsibilities:

- [`PROJECT_CONSTITUTION.md`](PROJECT_CONSTITUTION.md) owns authority and AI safety;
- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) owns canonical business entities;
- [`RELATIONSHIPS.md`](RELATIONSHIPS.md) owns canonical business relations;
- [`SYSTEM_ARCHITECTURE.md`](SYSTEM_ARCHITECTURE.md) owns technical layers;
- [`CANONICAL_FINANCIAL_MODEL.md`](CANONICAL_FINANCIAL_MODEL.md) owns financial semantics;
- [`DATA_HYGIENE_VALIDATION_SPEC.md`](notion/DATA_HYGIENE_VALIDATION_SPEC.md) owns the current Financial Integrity rules; and
- [`MULTIDAY_DATA_HYGIENE_CENTER.md`](notion/MULTIDAY_DATA_HYGIENE_CENTER.md) records the current Notion reference implementation.
