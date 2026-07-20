# Adventure OS — Knowledge Consolidation

## Purpose

Adventure OS work naturally expands while real operational problems are investigated. New facts, exceptions, tools, ideas and architectural implications appear during implementation.

Expansion is useful. Uncontrolled accumulation is not.

This document defines how Adventure OS converts broad working context into a small, trustworthy and reusable body of knowledge without losing prior work.

## Core pattern

`Recover → Expand → Test → Decide → Narrow → Canonise → Reuse`

### Recover

Before starting substantial work, recover the existing foundation:

- Project Constitution;
- Master Brief and current Status;
- Domain Landscape and canonical entity model;
- relationship catalogue;
- relevant ADRs;
- source-system and integration documents;
- implementation decision log;
- active pull requests and known blockers.

The purpose is to continue the project, not restart it from the current conversation.

### Expand

Investigate the real problem broadly enough to expose:

- operational reality;
- source evidence;
- edge cases;
- inconsistencies;
- alternative solutions;
- architecture implications;
- unresolved business decisions.

Working notes and chat context may be broad, repetitive and provisional at this stage.

### Test

Use audits, reference implementations, prototypes and bounded experiments to distinguish assumptions from evidence.

A test implementation is evidence, not automatically the final architecture.

### Decide

Material business and product decisions require Boris's approval. Technical implementation choices may be made within explicitly accepted boundaries.

Unresolved questions remain visible. They are not converted into confident prose merely to make documentation appear complete.

### Narrow

After exploration or implementation, reduce the context to what remains useful:

- confirmed facts;
- accepted decisions and their rationale;
- reusable principles;
- architecture boundaries;
- implementation evidence;
- unresolved questions;
- known risks and next actions.

Duplicated discussion, abandoned branches of thought and temporary prompts should not be promoted into durable documentation.

### Canonise

Place each retained item in the existing authoritative structure:

- constitutional principle;
- ADR;
- domain or relationship model;
- architecture document;
- integration contract;
- product/process document;
- implementation decision log;
- status snapshot;
- roadmap or issue.

Do not create a new document merely because a discussion produced new text. Prefer updating the existing owner document when the concept already has one.

### Reuse

Future work starts from the canonised result. Chat transcripts may provide supporting context, but they do not outrank versioned project documentation and source evidence.

## Documentation classes

### Canonical

Defines current accepted product, domain, architecture or governance truth.

Canonical documents should be few, linked from the authoritative reading path and changed deliberately.

### Decision record

Records a material choice, alternatives, rationale and consequences. A decision record should not become a second architecture manual.

### Implementation record

Records what was actually changed in a source system or codebase, including verification and deviations. It does not redefine canonical architecture by itself.

### Status

Describes the current phase, active work, blockers and next actions. Status is intentionally time-sensitive.

### Research or review

Preserves evidence, audits and advisory findings. It informs decisions but is not automatically canonical.

### Working material

Temporary prompts, scratch notes, exports and exploratory artefacts. These should be removed, archived or clearly labelled after consolidation.

## Promotion rules

Working context becomes durable only when at least one of the following is true:

- Boris confirmed a business or product decision;
- an authoritative source directly supports the fact;
- an implementation was verified;
- the insight defines a reusable project rule;
- an unresolved question materially affects future work and must remain visible.

AI inference alone is not sufficient.

## Reconciliation checkpoint

A documentation reconciliation is required after:

- a major architecture review;
- a reference implementation;
- a source-system audit that changes assumptions;
- a substantial module or integration;
- discovery of conflicting canonical documents;
- a sequence of working sessions that materially changes direction.

The checkpoint asks:

1. What did we learn?
2. What changed?
3. What remains unproven?
4. Which existing document owns each retained insight?
5. Is an ADR required?
6. Which temporary material can now be discarded or archived?
7. Does the Status or Roadmap need updating?

## Current reference case: Operational Integrity

The Multiday finance cleanup began as a concrete Notion data-repair task. It exposed a broader product requirement: Adventure OS must continuously show what is incomplete, inconsistent, ambiguous or awaiting a business decision.

The current Data Hygiene Center is a reference implementation and test ground. The broader Operational Integrity concept must be reconciled only after:

- Codex completes and verifies the bounded implementation;
- Claude reviews the architecture and implementation;
- the findings are checked against the existing Constitution, System Architecture, Domain Landscape and product direction;
- Boris confirms any material product or business decisions.

Until then, the implementation and the architecture hypothesis must remain related but distinct.

## Practical standard

Adventure OS should not preserve every conversation.

It should preserve enough trustworthy context that the next person or agent can understand:

- what the system is trying to achieve;
- what has already been decided;
- why it was decided;
- what was implemented;
- what remains uncertain;
- where the supporting evidence lives.

The target is not maximum documentation. The target is minimum sufficient context with high trust and clear ownership.
