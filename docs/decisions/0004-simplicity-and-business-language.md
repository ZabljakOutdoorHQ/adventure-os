# ADR 0004 — Simplicity and Business Language

## Status
Accepted

## Context

Adventure OS is an operational system for one outdoor company — not an ERP, not
an accounting system, not a domain-driven-design showcase. During the Multiday
knowledge extraction, the model started drifting toward enterprise abstractions
(Operating Unit, Operating Agency, Asset Usage Charge, Settlement Pool, …) that
are theoretically defensible but not how the business actually talks or works.

The company's real logic is simple: **there is revenue, there are costs, and what
is left over is shared.** The model should look like that.

If the system uses words nobody in the company uses, people route around it. If it
uses the team's language, it becomes part of daily work. The goal is that in five
years Anđa opens the system and says *"of course — this is literally how we work."*

## Decision

**Principle 1 — Simplicity beats theoretical correctness.** When two models
describe the same business process equally well, always choose the simpler one.
This sharpens Constitution principles 8 (technology subordinate), 9 (progressive
complexity) and 14 (improve or disprove), and is added as Constitution principle 15.

Concretely:

1. **Business language first.** In business documentation, use the team's own words.
   Reach for a technical or English term only when (a) there is no good local word,
   or (b) it is an international standard (e.g. PAX, VAT). An English class name may
   exist in *implementation*, but not in the business docs.
2. **New concepts must justify themselves.** Before adding a term or object, answer:
   *What concrete problem does it solve? What can we not describe today without it?*
   No convincing answer → it is not added.
3. **One business term = one meaning.** A word must mean the same thing to Boris,
   Anđa, the guides and the accountant.
4. **Do not pre-build complexity.** Add a more complex model only when a real problem
   requires it — not in advance.
5. **A complexity audit follows every correctness pass.** For each term ask: is it
   really needed? can it be explained more simply? can it merge with an existing
   term? does a real person in the company use it? If not convincing — simplify.

**Rejected as unnecessary abstraction** (unless a concrete need later appears):
Contribution Margin, Allocated Entitlement, Settlement Obligation, Settlement Pool,
Operating Function, Operating Layer, Operating Agency, Operating Unit, Asset Usage
Charge.

**Business-language mapping** (business docs use the left column; an English class
name may appear only in implementation):

| Business term (use this) | Technical/EN (implementation only) |
|---|---|
| Cjenovnik | PriceList / RateCard |
| Stavka cjenovnika | PriceListItem |
| Dobavljač | Supplier |
| Račun (Finansijski račun) | Financial Account |
| Namjenski fond | Earmarked Fund |
| Bike kasa | Bike Fund |
| Procjena troškova | CostEstimate |
| Prihvaćena ponuda (ne mijenja se) | AcceptedOfferSnapshot |
| Naknada za organizaciju (company fee) | Operating Fee |
| Marža (ono što ostane) | Operating Margin |
| Obračun / poravnanje | Settlement |
| Dogovor o podjeli | Profit-sharing policy |
| Zajednički dio (4. dio) | Shared allocation pool |
| Izdvajanje za bicikle | Fleet contribution |

## Consequences

- Business documentation (the Multiday rulebook, future business docs) is written in
  the team's language; the canonical technical docs (`DOMAIN_MODEL.md`,
  `RELATIONSHIPS.md`) may keep English entity names as the implementation layer.
- Every future model or terminology proposal must pass the "justify itself" test and a
  complexity audit before adoption.
- The Multiday business rulebook is revised to plain business language (v3) and carries
  an explicit complexity audit.
- This ADR governs all of Adventure OS, not only Multiday.
