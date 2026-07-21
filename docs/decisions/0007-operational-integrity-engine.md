# ADR 0007 - Operational Integrity Engine

## Status

Proposed

## Context

The Multiday Data Hygiene Center proved that deterministic checks over operational
records can expose missing data, broken relations and financial inconsistencies, and
that filtered views clear automatically when the underlying source is corrected.

That implementation is successful, but `Data Hygiene` is too narrow to describe the
durable platform capability. The same evaluation pattern may later apply to other
operational concerns. Replacing the working implementation would add risk without
adding evidence.

## Proposed Decision

Adopt **Operational Integrity** as a cross-cutting Adventure OS platform capability.
The **Operational Integrity Engine** is the service that implements that capability
outside source systems when the extraction tripwire is reached.

1. The existing Multiday Data Hygiene implementation is retained as the reference
   implementation of the **Financial Integrity Rule Pack**.
2. A **Signal** is the canonical platform concept for a deterministic observation
   produced by a Rule. It is not a Task, Bug, authored Issue or canonical business
   entity.
3. Signals exist only while their deterministic condition is true and clear when the
   underlying reality changes.
4. **Readiness is derived** from the absence of active blocker Signals in a named Rule
   Pack. A manual field may display the result but cannot override blockers.
5. The Operational Integrity Engine is domain-agnostic. New concerns integrate through
   versioned Rule Packs without changing the engine contract.
6. Operational Integrity functions without AI. AI may explain, group, prioritize and
   recommend from Signals, but it cannot create canonical Signals.
7. The current implementation may evaluate Financial Integrity rules inside the
   Notion test workspace. Portable extraction through adapters and the canonical model
   is the target architecture.
8. The evaluator should move out of Notion when Operational Integrity must evaluate
   multiple independent systems of record. That extraction is future work and requires
   separate review.
9. A persistent Signal Store is explicitly deferred until the reference implementation
   proves the operational contract. This ADR does not authorize its schema or build.
10. No additional Rule Pack is implemented by this decision.

The terminology transition is `Data Hygiene` -> `Financial Integrity Rule Pack` ->
`Operational Integrity`. Existing Notion behavior remains valid while legacy names are
retired gradually through separately verified compatibility changes.

The detailed contract is defined in
[`OPERATIONAL_INTEGRITY.md`](../OPERATIONAL_INTEGRITY.md).

## Consequences

- Existing Notion formulas, rollups, classifications and filtered views keep their
  behavior.
- Historical implementation names may remain where changing them would break exact
  property or view references, but documentation maps them to canonical terminology.
- Financial Integrity becomes the first tenant of a reusable platform capability, not
  the owner of a separate issue system.
- Mission Control Attention is the future primary presentation surface for Signals.
- Extraction from Notion can happen incrementally after adapter and canonical-data
  boundaries exist and the multiple-systems-of-record tripwire is reached.
- Signal persistence, acknowledgements, waivers and cross-run history remain future
  architecture work.

## Alternatives Rejected

### Replace the Notion implementation now

Rejected because the implementation already provides useful deterministic behavior
and has not yet proven a need for a separate service or Signal Store.

### Keep Data Hygiene as a finance-only platform

Rejected because it couples a general evaluation capability to one business concern.

### Let AI identify canonical Signals

Rejected because canonical integrity observations must be reproducible, explainable
and available without model inference.

## Canonical Ownership

[`OPERATIONAL_INTEGRITY.md`](../OPERATIONAL_INTEGRITY.md) is the single canonical
specification. This ADR records the proposal and rationale. The Project Constitution
contains the governing principle only; it does not duplicate the specification.
