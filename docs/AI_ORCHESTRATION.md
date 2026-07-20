# Adventure OS — AI Orchestration

## Purpose

Adventure OS uses several AI systems as a coordinated delivery team. Their outputs must converge on one product direction, one canonical model and one versioned documentation base.

This document defines responsibilities, hand-offs and decision ownership. It does not grant any model independent product authority.

## Roles

### Boris — Product Owner and business authority

Boris defines the real operational problem, priorities, acceptable trade-offs and final business decisions.

Only Boris may approve changes to business meaning, canonical operating rules, consequential source-system writes and final product direction.

### ChatGPT — Systems Architect and orchestrator

ChatGPT maintains the whole-system view and directs work across models.

Responsibilities:

- connect current work to the existing Adventure OS foundation;
- frame architecture and implementation tasks;
- decide which questions belong to architecture, implementation or business review;
- prevent parallel models and duplicated documentation structures;
- reconcile outputs from Claude and Codex;
- narrow expanded exploration into durable decisions and useful documentation;
- identify when an ADR, canonical document update or implementation record is required.

ChatGPT is not a substitute for Boris's business authority and does not silently approve consequential changes.

### Claude — Architecture reviewer and challenger

Claude reviews architecture before implementation when available, and reviews the completed implementation afterwards.

Responsibilities:

- challenge assumptions and abstractions;
- test long-term coherence, scalability and domain boundaries;
- identify Notion-specific or vendor-specific coupling;
- distinguish architecture from temporary implementation detail;
- recommend simplification or correction;
- review whether implementation matches accepted architecture.

Claude should not silently become the implementation owner or introduce a parallel canonical model.

### Codex — Principal engineer

Codex implements bounded, accepted work.

Responsibilities:

- repository changes;
- Notion and MCP implementation;
- formulas, relations, adapters and services;
- tests and technical verification;
- implementation documentation;
- focused branches and pull requests.

Codex must not invent business rules, canonical entities or architecture when the task does not explicitly authorise them.

## Standard delivery loop

1. **Business intent** — Boris identifies a real need, problem or opportunity.
2. **Context recovery** — existing canonical documents, ADRs, implementation records and current status are reviewed first.
3. **Exploration** — options, evidence, edge cases and new ideas are expanded.
4. **Architecture** — ChatGPT frames the system direction; Claude challenges it when available.
5. **Decision** — Boris confirms material business or product choices.
6. **Implementation brief** — the accepted direction is translated into bounded acceptance criteria.
7. **Implementation** — Codex builds and verifies the change on a focused branch.
8. **Technical review** — implementation evidence, tests, limitations and deviations are documented.
9. **Architecture review** — Claude checks the result against the intended architecture.
10. **Consolidation** — ChatGPT reconciles findings and reduces the expanded context to durable decisions.
11. **Canonisation** — accepted knowledge updates the appropriate canonical documents, ADRs, status or implementation log.
12. **Merge** — only coherent, reviewed work becomes part of the main line.

Claude availability must not stop bounded implementation work that is already explicitly approved. In that case, the architecture review occurs after implementation and before final canonisation or merge where practical.

## Decision ownership

- **Business truth and priority:** Boris.
- **Canonical architecture direction:** Boris, supported and coordinated by ChatGPT.
- **Architecture challenge and independent review:** Claude.
- **Implementation design inside accepted boundaries:** Codex.
- **Technical verification:** Codex, with review by the orchestrator and relevant reviewers.
- **Canonical documentation placement and reconciliation:** ChatGPT, subject to Boris's approval for material decisions.

No AI output becomes canonical merely because it is detailed or persuasive.

## Required evidence at hand-off

An implementation hand-off should state:

- the problem being solved;
- the canonical documents reviewed;
- accepted scope and explicit non-goals;
- business rules that must not change;
- architecture decisions already made;
- unresolved questions;
- implementation evidence and tests;
- known compromises or deviations;
- documents that require reconciliation afterwards.

## Current reference case: Data Hygiene Center

The Multiday Notion workspace is the test ground for the Adventure OS Data Quality Layer.

Codex is implementing a practical Data Hygiene Center that exposes incomplete records, broken relations, missing financial inputs, ambiguous data, inconsistent totals and records requiring business decisions. The implementation must allow issues to disappear automatically when their underlying records are corrected, without hiding unresolved issues.

This implementation is deliberately bounded to the MCP Cleanup workspace. It does not itself settle the long-term architecture of the wider Operational Integrity Engine.

Claude's follow-up review must evaluate whether the implementation supports a reusable platform-level integrity service rather than a Notion-specific dashboard. ChatGPT will then reconcile that review with the implementation and the existing Adventure OS architecture.

## Guardrails

- Read the existing foundation before proposing a new structure.
- Do not create a parallel documentation hierarchy.
- Do not treat chat history as the canonical record.
- Do not let implementation convenience redefine the business domain.
- Do not preserve every discussion; preserve decisions, evidence, unresolved questions and reusable insight.
- Do not merge architecture claims that have not been reconciled with the existing Constitution, Domain Landscape and ADRs.
