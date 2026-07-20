# ADR 0004 — Simplicity and Business Language

## Status
Accepted

## Context

Adventure OS is an operational system for a real outdoor business. During Multiday knowledge extraction, theoretically defensible abstractions began to appear before a concrete need had been demonstrated.

The business logic is intentionally simple: **there is revenue, there are costs, and what remains is shared.** The system must preserve that clarity without sacrificing precision where precision is actually required.

## Decision

**Simplicity beats theoretical correctness when both describe the business equally well.**

This applies to both language layers, but differently:

- **Business documentation** must use the team’s own words and remain understandable to staff without technical training.
- **The canonical model** may use precise technical concepts, but every concept must still justify its existence through a real requirement. Precision is not permission for speculative complexity.

Rules:

1. **A new concept must solve a concrete problem.** State what cannot be represented correctly without it. If there is no convincing answer, do not add it.
2. **Prefer the smallest accurate model.** Do not pre-build structures for imagined future needs.
3. **One term has one meaning within its layer.** Synonyms may be mapped across layers, but definitions may not drift.
4. **Complexity must be earned.** Add detail only when operations, reporting, safety, integration or governance require it.
5. **Run a simplification pass after every correctness pass.** Remove repetition, unused distinctions and concepts that merely rename existing ones.
6. **Do not simplify away necessary precision.** A concept such as `EarmarkedFund` or `Custodian` remains valid when it prevents a real ambiguity, even if the business document expresses it in plain language.

Concepts rejected during the Multiday review because no current requirement justified them include: `OperatingUnit`, `OperatingAgency`, `OperatingLayer`, `AssetUsageCharge`, `SettlementPool`, `ContributionMargin` and `AllocatedEntitlement`. They may be reconsidered only when a concrete use case appears.

## Documentation rule

Definitions and term mappings do not live in this ADR. They belong in the [Business ↔ Canonical Vocabulary](../UBIQUITOUS_LANGUAGE.md). Multiday-specific rules belong in the [Multiday business rulebook](../research/multiday-business-rules.md).

## Consequences

- New concepts require a documented business or technical need.
- Business documents remain plain and operational.
- Canonical documents remain precise but avoid speculative entities.
- Documentation audits remove repetition and contradictions before adding more material.
- This ADR governs all of Adventure OS.
