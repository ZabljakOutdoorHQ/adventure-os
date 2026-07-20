# ADR 0006 — Documentation Cadence & Working Model

## Status
Accepted

## Context

The documentation core (constitution, domain landscape/model, relationships, vocabulary,
Multiday rulebook, ADRs) is now stable enough that further decisions can be incremental
rather than revolutionary. The risk now is spending more weeks perfecting documents while
nothing exists that the business can click.

Two failure modes must be avoided at once:

- **Analysis paralysis** — endless modelling with nothing delivered.
- **Code-first drift** — the system outgrows its documentation.

## Decision

**Documentation trails implementation by at most one sprint.**

- Do **not** write documentation far ahead of the system it describes.
- Do **not** build code that has no documentation.
- Canonical entities and relationships are added **when a sprint needs them**, not
  speculatively (this reinforces principles 9, 15 and 17).
- Documentation **follows** development; it must not block delivery.

### Working model (roles)

Adventure OS is built by a small team with distinct responsibilities:

| Role | Responsibility |
|---|---|
| **Domain Owner** (Boris) | Knows how the business actually works; final word on business meaning. |
| **Architecture Review Board** (Boris) | Owns the canonical model, architecture, ADRs and long-term decisions; the last instance before anything becomes canon; reviews PRs. |
| **Principal Analyst** | Audit, research, evidence, documentation and doc refactoring. Surfaces facts; does **not** decide the model. |
| **Lead Engineer** | Implementation, refactoring, PRs, tests, CI; brings docs in line with the architecture. Does not re-litigate the model. |

### Flow for a serious change

1. **Analyst** produces *Business Evidence* (how the work really operates; gaps; contradictions). Does not change canon.
2. **Architecture Review Board** decides what enters canon, what is excess, what changes.
3. **Engineer** implements the decision as a clean PR — model, code or docs — without re-designing it.
4. **Analyst** re-audits for regressions, contradictions and doc alignment.
5. **Merge** only then.

## Consequences

- Building starts now; the canonical model changes only when a sprint requires it.
- Each shipped increment updates its documentation within the same or next sprint.
- The analyst may prepare evidence and draft docs, but architectural decisions remain the
  Review Board's; implementation remains the engineer's.
- This ADR governs all of Adventure OS.
