# ADR 0007 — Operational Integrity Engine

## Status
Proposed (architecture review; pending Architecture Review Board ratification)

## Context

A cleanup effort has revealed the real product. It is not another database and not a
"Data Hygiene Center" bolted onto finance. Across the audits, the recurring value was
always the same: **the system should continuously tell us what is wrong, what is
incomplete, and what to do next — instead of forcing a human to search.**

The current implementation (Codex, "Data Hygiene Center") is building exactly this
capability, but framed as a finance-area module living inside Notion formulas/rollups.
Two things in that framing will not survive five years:

1. **Scope.** The same need exists in fleet, guides, website, CRM, documents, bookings.
   A finance module cannot serve them.
2. **Location.** Integrity logic encoded as Notion rollups/formulas is opaque (the
   connector cannot even read computed formula values), unversioned, Notion-locked, and
   cannot express cross-database, historical, or confidence-weighted logic.

## Decision

Adopt an **Operational Integrity Engine (OIE)** as a **core, cross-cutting platform
service** — not a module and not a Notion artifact. Rename "Data Hygiene Center" to it.

Key decisions (detailed model in [`OPERATIONAL_INTEGRITY.md`](../OPERATIONAL_INTEGRITY.md)):

1. **Platform service, not a module.** One engine; every domain plugs in a *rule pack*.
   Finance is the first tenant, not the owner.
2. **The unit is a derived `Signal`, not an authored ticket.** A Signal is a projection
   of current reality against a rule. It **appears** when a rule is violated and
   **disappears** automatically when reality is fixed. Signals cannot rot, because they
   are recomputed, never manually "closed".
3. **The engine lives outside the source system.** It *reads* Notion (and later Hub,
   Drive, Zoho, WeTravel, Postgres) through adapters, computes signals in code, and
   stores them in its own signal store. Notion may *display* signals; it does not own or
   compute them. In-Notion rollups remain an operational convenience, never the integrity
   truth.
4. **Subjects are canonical entities + `sourceRefs`, never raw Notion URLs.** This keeps
   the engine portable across source systems.
5. **Technical vs business validation are distinguished, and business deviations can be
   waived** — a human may annotate (acknowledge/waive with reason + owner + expiry) but
   may never make a true signal lie. Detection is never suppressed; only presentation.
6. **Deterministic core; AI is a consumer/enhancer, never the source of truth.** The
   backbone must be trustworthy without a model being right (Constitution §3.10).
7. **Readiness is derived, not asserted.** "Ready for financial sign-off" = *no open
   blocking signals* in the relevant rule set — a computed gate, not a manual checkbox.

## Consequences

- The engine becomes a durable 5-year platform layer; Notion becomes a swappable source.
- Each future module ships a versioned, sourced **rule pack**, not its own issue system.
- Mission Control's existing "Attention" surface becomes the primary consumer (the
  prioritized "what needs attention" feed) — architectural continuity, not a new app.
- Integrity logic leaves Notion formulas over time; Notion rollups stay as convenience.
- This governs all of Adventure OS. Constitution principle 18 records the durable rule.

## Answers to the architecture-review questions (condensed)

1. **"Data Hygiene Center" is the wrong abstraction** — too janitorial, too finance-local.
2. **"Operational Integrity Engine" is stronger** and adopted; the emitted unit is a
   `Signal`; the staff-facing surface is the attention feed ("na šta obratiti pažnju").
3. **Core platform service**, not a module (decision 1).
4. **Health model** — see spec §3 (severity, confidence, lifecycle, appear/disappear,
   zero-vs-unknown, readiness gates).
5. **Validation model** — see spec §4 (technical vs business; waivers/overrides).
6. **Module plug-in** — see spec §5 (rule-pack contract).
7. **AI** — explain → prioritize → recommend → act-with-approval; never the source of
   truth (spec §6).
8. **Weaknesses/boundaries** — Notion-as-engine, rules-as-code, signal store coupling,
   zero-vs-unknown, alert fatigue, rule sprawl; boundaries in spec §7.
9. **Canonical architecture** — layered Sources → Adapters → Canonical model → Integrity
   Engine → AI → Experience (spec §8).
