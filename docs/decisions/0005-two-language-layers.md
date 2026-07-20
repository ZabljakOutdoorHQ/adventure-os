# ADR 0005 — Two Language Layers (Business ↔ Canonical)

## Status
Accepted

## Context

ADR-0004 established business-language-first for documentation. That is right, but it
created a risk: collapsing **two different things** into one. Business language and the
canonical software model are **not two versions of one model** — they are **two views of
the same reality**.

- The **business model** describes *how people work*. Its audience is Boris, Anđa, the
  guides and the accountant. It must be simple and in the team's own language.
- The **canonical model** describes *how the system thinks*. Its audience is developers,
  the database, the API, AI agents and MCP tools. It must be precise, consistent and
  stable for a decade — not necessarily "easy to read".

Both describe the same thing. The word may differ; the meaning must not.

## Decision

Adopt **two language layers**, added as Constitution principle 16.

**Layer 1 — Business language** (the team's own words). Used in: rulebooks, operational
documentation, onboarding, procedures, staff instructions. Examples: *Cjenovnik,
Dobavljač, Trošak, Ponuda, Prihvaćena ponuda, Obračun, Bike kasa.*

**Layer 2 — Canonical language** (stable international English). Used in:
`DOMAIN_MODEL.md`, ADRs, API, code, database, AI agents, MCP tools. Examples:
*PriceList, Supplier, Expense, Offer, AcceptedOffer, Settlement, EarmarkedFund, Payment,
TripGroup.*

Rules:

1. **Do not translate the canonical model into the local language.** `DOMAIN_MODEL.md`
   and code keep English names.
2. **Do not simplify the canonical model merely for readability.** Its job is precision
   and stability. An architecturally important term (e.g. `EarmarkedFund`, `Custodian`)
   stays in the canon **even if no one in the company uses that word** — the business
   doc simply says "bike kasa" or "novac je kod DA" instead.
3. **The simplicity axe (ADR-0004) governs Layer 1, not Layer 2.** Complexity audits
   simplify the *business* documents; they do not delete precise canonical concepts.
4. **Every concept exists in both layers**, bridged by one document
   ([`UBIQUITOUS_LANGUAGE.md`](../UBIQUITOUS_LANGUAGE.md)) — a business↔canonical
   translation table with definition and example. This is a **bridge, not duplication**.
5. **When a new concept appears**, give it a business phrasing *and* a canonical name,
   and add a bridge row. Neither layer is authoritative over the other on wording; both
   must point at the same meaning.

## Relationship to ADR-0004

ADR-0004 (simplicity + business language) and ADR-0005 (two layers) work together:
ADR-0004 keeps **Layer 1** plain and in our language; ADR-0005 protects **Layer 2** from
being translated or dumbed down. The "rejected abstractions" list in ADR-0004
(Operating Unit, Settlement Pool, …) means *genuinely unnecessary in either layer* — it
does **not** apply to precise canonical terms like `EarmarkedFund` or `Custodian`, which
are kept in Layer 2.

## Consequences

- A new bridge document, `docs/UBIQUITOUS_LANGUAGE.md`, is the single place that maps
  business terms to canonical names.
- Business docs (the Multiday rulebook) stay in the local language and may reference the
  bridge for anyone who needs the canonical name.
- The canonical model may keep terms the business never says, as long as the bridge
  connects them.
- This governs all of Adventure OS, not only Multiday.
