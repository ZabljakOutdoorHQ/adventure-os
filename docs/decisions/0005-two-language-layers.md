# ADR 0005 — Two Language Layers (Business ↔ Canonical)

## Status
Accepted

## Context

Business documentation and the canonical software model serve different audiences:

- the **business layer** explains how people work, using the team’s language;
- the **canonical layer** gives software, integrations and agents stable English names and precise definitions.

They are two views of the same business reality, not two competing models.

## Decision

Adopt two coordinated language layers.

### Business layer

Used in rulebooks, procedures, onboarding and staff instructions. It should be direct, local and operational: *Cjenovnik, Dobavljač, Trošak, Prihvaćena ponuda, Obračun, Bike kasa.*

### Canonical layer

Used in `DOMAIN_MODEL.md`, relationships, API contracts, database schemas, code, agents and MCP tools. It uses stable English names such as `PriceList`, `Supplier`, `Expense`, `AcceptedOffer`, `Settlement` and `EarmarkedFund`.

### Rules

1. Canonical names remain in English.
2. Business documents are not required to expose technical terminology.
3. Both layers must describe the same meaning; wording may differ, semantics may not.
4. Only terms that need translation or clarification are entered in the [Business ↔ Canonical Vocabulary](../UBIQUITOUS_LANGUAGE.md). Not every internal technical concept needs a staff-facing synonym.
5. A vocabulary row does not adopt a canonical entity. Proposed names remain proposals until the canonical model is explicitly updated.
6. Simplicity applies to both layers as defined by [ADR-0004](0004-simplicity-and-business-language.md): plain language in the business layer; the smallest accurate model in the canonical layer.
7. Definitions have one primary home. The vocabulary maps names and gives a short orientation; authoritative entity definitions remain in `DOMAIN_MODEL.md`, while business rules remain in their rulebooks.

## Naming of the bridge document

The repository path remains `docs/UBIQUITOUS_LANGUAGE.md` to avoid unnecessary link churn, but its functional title is **Business ↔ Canonical Vocabulary / Poslovni rječnik**. It is a translation bridge, not a second domain model and not a place to repeat full rules.

## Consequences

- Staff-facing documents remain understandable without technical training.
- Developers and agents use stable canonical terminology.
- The vocabulary prevents translation drift without duplicating the domain model.
- Architecturally useful concepts may remain canonical even when staff never use their technical names.
- This ADR governs all of Adventure OS.
