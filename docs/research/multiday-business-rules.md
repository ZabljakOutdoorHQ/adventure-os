# Multiday — Business Knowledge Extracted from Operations

> **Purpose.** Extract the durable *business knowledge* currently hidden inside
> Google Sheets / Numbers / documents, and classify each finding so it survives
> replacing the spreadsheets with Adventure OS (or WeTravel). This is a **reusable
> rulebook**, not a current-state audit and not a redesign.
>
> **This does NOT change the canonical model or §4.** It is raw extracted
> knowledge, to be reviewed *before* §4 is updated. Draft / not approved.
>
> **Privacy.** No client/guest/guide names, invoice numbers or actual balances.
> Own-company names (Durmitor Adventure = DA, Sampas, Other Trails = OT) and
> business-rule *parameters* (fee-per-pax, split %) appear because they are model
> logic already named in the repo canon (ADR-0002) — not personal/payment data.
>
> **Companion docs:** [`notion-multiday-audit.md`](notion-multiday-audit.md)
> (current-state) and
> [`multiday-architecture-compatibility-review.md`](multiday-architecture-compatibility-review.md)
> (canon fit).

---

## Classification legend

Every extracted item is tagged with one primary type. The distinction is the whole
point of this pass — the same cell can be a permanent rule, a changeable policy, or
a disposable spreadsheet artifact, and they must not be canonised together.

| Type | Meaning | Lifespan | Belongs in |
|---|---|---|---|
| **Business Rule** | A durable truth about how the business works | Permanent | Canonical domain model |
| **Calculation** | A computation that *implements* a rule | Changes with tooling | Calculation engine |
| **Policy** | A deliberate decision that may change over time | Versioned | Config + governance |
| **Configuration** | Reference data / parameters | Edited routinely | External reference data |
| **Operational Convention** | How the team happens to work today | Habitual | Ops docs, not the model |
| **Historical Decision** | A past choice that shaped current structure | Fixed context | ADR / decision log |
| **Temporary Workaround** | A stopgap that must not be canonised | Should disappear | Nowhere (retire it) |
| **Spreadsheet Implementation** | An artifact of the tool itself | Dies with the file | Nowhere (disposable) |

---

## Part A — Per-spreadsheet analysis

Each answers the seven questions: (1) business decision supported, (2) permanent
rules, (3) configurable parameters, (4) implementation details that vanish with the
file, (5) concepts for the domain model, (6) concepts for a calc engine, (7)
concepts that stay external reference data.

### A1. Pricing calculator — `2026 multi-day kalkulacije.xlsx`

1. **Decision supported:** what price to quote a group, and whether it is profitable.
2. **Permanent business rules:**
   - A multiday tour is priced **per person**, differentiated by **room type** and by
     **rider type** (biker vs non-biker).
   - **Non-bikers do not carry the bike-usage charge.**
   - Price = allocated shared costs + room supplement; margin is added on top.
   - The **quoted price is a commercial decision independent of the computed cost** —
     the accepted price is its own fact, not the formula output.
3. **Configurable parameters (Policy/Config):** company fee per pax (~€300); bike rent
   per day (~€55 × 5); local tax & insurance (~€1.5/pax/day); transfer rate card;
   hotel rate card; PAX-band thresholds (≤15 / >15); group-size price tiers (6/10/14).
4. **Disappears with the file:** one-tab-per-group layout; live `#REF!/#DIV/0!/#N/A`
   errors; rate cards copy-pasted per year; the manual "price we sent" cells.
5. **Domain-model concepts:** Offer/Quote (with a **cost estimate** and an **accepted
   snapshot**), Supplier (behind the rate cards), room type & rider type on Participant,
   Activity/Program, cost categories.
6. **Calc-engine concepts:** the whole cost build-up and per-person allocation; margin
   computation.
7. **External reference data:** the transfer and hotel **rate cards**; tax/insurance
   rate; fee and bike-rent parameters.

### A2. Multi-entity settlement — `Multientity_Bike_Flow_v5_summary.xlsx`

1. **Decision supported:** how much each internal entity must **receive or pay** after a
   season, so the shared operation settles fairly.
2. **Permanent business rules:**
   - The business runs as **multiple legal entities sharing one economic operation.**
   - Each tour has a **revenue-collecting entity** and, per cost, a **paying entity**;
     neither need be the entity that ultimately owns the profit.
   - **Profit is pooled**, then distributed; **settlement per entity = entitlement −
     cash already held → net transfer.**
   - **Intercompany transfers are not tour costs** and must never enter a tour's P&L.
3. **Configurable parameters (Policy):** profit-share split (**currently DA 50 / OT 25 /
   Sampas 25**; earlier a flat 25 % + a 4th internal share); the multiday **bike-fee
   reserve** amount; which costs count as "external".
4. **Disappears with the file:** the v2→v5 tab structure; entity-name typo normalisation
   ("Samps"→"Sampas") done only in summary formulas; "approved revenue vs raw row sum"
   correction plumbing; provisional-transfer suggestion cells.
5. **Domain-model concepts:** Entity / Operating Unit; Financial Account; Settlement +
   Intercompany Transfer; Allocation Rule (the split + reserve, as *data*); Revenue
   Allocation; Cost (actual, tagged by paying entity).
6. **Calc-engine concepts:** pool math, per-entity delta, suggested transfers.
7. **External reference data:** the split percentages and reserve as versioned policy
   parameters.

### A3. Bike-fleet finance — financing folder + `Bike_Fee_PnL` + master data

1. **Decision supported:** how the shared bike fleet is paid for and how its cost is
   recovered from tours.
2. **Permanent business rules:**
   - The bike fleet is a **capital asset that is financed, amortised, and cost-recovered
     through per-use charges** into a central fund at DA ("bike kasa").
   - A **"bike fee" is a fleet-investment-recovery policy, not a formula** — it exists to
     return capital + running costs, regardless of how it is computed.
3. **Configurable parameters:** bike-rent rate; annual reserve target; loan terms; sizes
   & quantities.
4. **Disappears with the file:** the annual P&L tab layout; one-off adjustment lines.
5. **Domain-model concepts:** Asset (Bike) with an **Asset Usage Charge** and a
   **finance/amortisation dimension**; the central fund as a Financial Account;
   supplier contracts and the loan as Documents/obligations.
6. **Calc-engine concepts:** amortisation schedule; annual bike P&L; per-tour bike-fee
   accrual.
7. **External reference data:** loan/amortisation schedule; supplier price offers; fleet
   register (also synced to Notion).

### A4. Summaries & per-group balances — `Troskovi/Uplate sumirano`, per-group balance sheets

1. **Decision supported:** a per-tour and season roll-up of money in vs out.
2. **Permanent rules:** none new — these are **derived views** over payments and costs.
3. **Configurable:** grouping/reporting choices.
4. **Disappears with the file:** entirely — they are reports.
5–7. **Concepts:** none of their own; they are **reporting/views**, not model or config.

---

## Part B — Business Rules extracted from Operations

The reusable knowledge base. Each rule is tool-independent: it stays true whether the
implementation is Google Sheets, Notion, WeTravel or Adventure OS. `Stability`:
**Permanent** (rule), **Versioned** (policy/param), **Retire** (workaround).

### B1. Pricing & commercial

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| PR-1 | Multiday tours are priced **per person**, by room type and rider type. | Business Rule | Permanent | Domain model |
| PR-2 | **Non-bikers** are not charged the bike-usage component. | Business Rule | Permanent | Domain model |
| PR-3 | Price = allocated shared costs + room supplement + margin. | Calculation | Versioned | Calc engine |
| PR-4 | **Margin = agency company fee + bike rent** (the two profit levers). | Policy | Versioned | Config + model |
| PR-5 | Company fee ≈ €300/pax; bike rent ≈ €55/day × 5; tax/ins ≈ €1.5/pax/day. | Configuration | Versioned | External config |
| PR-6 | Transfer & hotel prices depend on a **PAX band** (≤15 / >15). | Business Rule (+config threshold) | Permanent (threshold Versioned) | Model + config |
| PR-7 | The **accepted/quoted price is an independent commercial fact**, not the computed cost. | Business Rule | Permanent | Domain model |
| PR-8 | One calc tab per group, with live formula errors and yearly copy-paste. | Spreadsheet Implementation | Retire | Nowhere |

### B2. Agency & fee model

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| AG-1 | An **agency layer (Durmitor Adventure)** sits above activities and charges a per-participant system fee that funds shared overhead. | Business Rule | Permanent | Domain model (ties to ADR-0002) |
| AG-2 | The system-fee amount and what overhead it funds are set by decision. | Policy | Versioned | Config + governance |
| AG-3 | "Agency" means **two different things** (travel client vs internal economic layer) and must be split in naming. | Historical Decision | Fixed | ADR / model (open Q) |

### B3. Bikes as a financed asset

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| BK-1 | The bike fleet is a **capital asset**: financed, amortised, cost-recovered per use. | Business Rule | Permanent | Domain model |
| BK-2 | The **"bike fee" is a fleet-investment-recovery policy**, not a formula. | Policy | Versioned | Config + model |
| BK-3 | Bike-fee inflows accumulate in a **central fund ("bike kasa") at DA**; annual fleet costs are charged against it. | Business Rule | Permanent | Domain model |
| BK-4 | Fleet acquired via development loan (IRF) + supplier contract + import/customs. | Historical Decision | Fixed | Decision log |
| BK-5 | Bike allocation to participants is operational; ADR-0002 keeps allocation authoritative in Adventure Hub, not Notion. | Historical Decision | Fixed | Model boundary |
| BK-6 | Fleet register (sizes, quantities, IDs) is reference data, synced Notion↔Drive. | Configuration | Versioned | External reference |

### B4. Multi-entity operation & settlement

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| ME-1 | The business runs as **multiple legal entities sharing one economic operation**. | Business Rule | Permanent | Domain model |
| ME-2 | Each tour has a **revenue-collecting entity**; each cost has a **paying entity**. | Business Rule | Permanent | Domain model |
| ME-3 | Profit is **pooled**, then split by fixed percentages. | Business Rule | Permanent | Domain model |
| ME-4 | Current split = **DA 50 / OT 25 / Sampas 25** (was flat 25 % + a 4th internal share). | Policy | Versioned | Config + governance |
| ME-5 | A **bike-fee reserve** is deducted from the pool before distribution and retained centrally. | Policy | Versioned | Config + model |
| ME-6 | **Settlement per entity = profit entitlement − cash already held → net transfer.** | Business Rule | Permanent | Domain model |
| ME-7 | **Intercompany transfers are not tour costs** and must be excluded from tour P&L. | Business Rule | Permanent | Domain model |
| ME-8 | The **4th internal "ekipa" 25 % share** is an internal DA distribution, outside intercompany transfers. | Policy / Historical Decision | Versioned | Config + governance |
| ME-9 | Settlement is **cash-based**, tracked as "cash held at entity", partly physical cash. | Operational Convention | Should evolve | Ops (not a rule) |
| ME-10 | "Approved revenue" vs "raw row sum" with an unallocated correction that must reach zero. | Temporary Workaround | Retire | Nowhere |
| ME-11 | Entity-name typos normalised only in summary formulas. | Spreadsheet Implementation | Retire | Nowhere |

### B5. Money: estimate vs actual, revenue vs cost

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| FN-1 | Distinguish **estimated cost** (quote) from **actual cost** (settlement). | Business Rule | Permanent | Domain model |
| FN-2 | Distinguish **quoted price → accepted price → collected revenue**. | Business Rule | Permanent | Domain model |
| FN-3 | Payments carry a **method** (cash / bank / Wise / Hub link) with per-method roll-ups. | Business Rule (+config) | Permanent | Model + config |
| FN-4 | Cost categories (hotel, transfer, guide per-diem, meals, NP tickets, rafting…). | Configuration | Versioned | External reference |
| FN-5 | Suppliers (hotels, transfer providers, activity providers, guides, bike vendors) are real economic counterparties. | Business Rule | Permanent | Domain model |

### B6. Tour lifecycle

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| LC-1 | Lifecycle: **inquiry → cost calc → pricing → offer → accepted/deposit → operate → collect → confirm costs → settle → closeout.** | Business Rule | Permanent | Domain model |
| LC-2 | A tour is **closed out** only after revenue collected, costs confirmed, and inter-entity settlement done. | Business Rule | Permanent | Domain model |
| LC-3 | Guides are assigned per day/segment and paid via per-diem expenses (they vary within one tour). | Business Rule | Permanent | Domain model |

---

## Part C — Where each concept belongs (extraction summary)

**Canonical domain model** (permanent business rules → entities/relationships):
Offer/Quote (with cost-estimate + accepted-snapshot), Supplier, Entity / Operating
Unit, Financial Account, Settlement, Intercompany Transfer, Allocation Rule (as data),
Revenue Allocation, Cost (estimate + actual), Asset-with-usage-charge, Payment method,
Tour lifecycle + Closeout, day/segment GuideAssignment.

**Future calculation engine** (implementations, not rules): the price build-up and
per-person allocation; the settlement pool/delta math; the bike amortisation schedule
and annual bike P&L. These consume the model + config and produce numbers; they should
**not** be modelled as truth.

**External reference / configuration data:** transfer & hotel rate cards; fee, bike-rent
and tax parameters; profit-split percentages and reserve; cost categories; loan/
amortisation schedule; fleet register.

**Disappears with the spreadsheets (canonise nothing):** one-tab-per-group layout;
`#REF!/#DIV/0!` errors; yearly rate-card duplication; name-typo normalisation; the
approved-vs-raw revenue correction plumbing; manual "price we sent" overrides as a
*mechanism* (the *fact* that accepted price is independent stays — rule PR-7).

**Policies to govern, not hard-code:** the split % (ME-4), the bike-fee reserve (ME-5),
the company fee & bike rent (PR-4/PR-5), the 4th-share rule (ME-8). All are versioned
decisions — the model should reference them as parameters with an effective date, never
bake a number into structure.

---

## Open questions for the rule review (before §4)

1. Is the **50/25/25 split** the current authoritative policy, superseding the earlier
   flat-25 %-plus-4th-share model? Which file is canonical?
2. Is the **4th "ekipa" share** a standing policy or a one-season arrangement?
3. Should **estimated vs actual cost** be one entity with two states, or two?
4. Is the **bike kasa** one Financial Account, or a sub-ledger of DA?
5. Does **Supplier** need rate-card history (versioned prices), or only current rates?
6. Which of these are **global Adventure OS** decisions (Supplier, Settlement, Activity/
   VAT economics, the economic-"Agency" term) rather than Multiday-local?

**Next step:** your review of these extracted rules. Only after that do we update §4 —
still not Phase 2, still no changes to any workspace, production or Drive data.
