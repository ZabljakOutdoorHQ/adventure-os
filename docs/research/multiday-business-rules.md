# Multiday — Business Knowledge Extracted from Operations

> **Purpose.** Extract the durable *business knowledge* currently hidden inside
> Google Sheets / Numbers / documents, and classify each finding so it survives
> replacing the spreadsheets with Adventure OS (or WeTravel). This is a **reusable
> rulebook**, not a current-state audit and not a redesign.
>
> **This does NOT change the canonical model or §4.** It is raw extracted
> knowledge, to be reviewed *before* §4 is updated. Draft / not approved.
>
> **Revision v2 (2026-07)** — Parts B–D revised per architectural review. The core
> correction: keep four things apart that the spreadsheets blur —
> **business identity** (who someone *is*), **transaction role** (what they *do* in
> a given deal), **fund / purpose** (what money is *for*), and **allocation formula**
> (how it is *split*). Removed premature canonical terms: *Operating Unit*,
> *Operating Agency*, *Asset Usage Charge*, the `margin = fee + bike rent` formula,
> *Supplier-as-identity-entity*, and *Cost-as-one-estimate+actual-entity*.
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
   - **Non-bikers do not carry the bike component.**
   - Price = allocated shared costs + room supplement + an **operating-fee component**
     + a **bike component**. (Margin is *not* one of these — it is derived later; §B2.)
   - The **quoted price is a commercial decision independent of the computed cost** —
     the accepted price is its own fact, not the formula output.
3. **Configurable parameters (Policy/Config):** operating fee per pax (~€300); bike
   rent per day (~€55 × 5); local tax & insurance (~€1.5/pax/day); transfer rate card;
   hotel rate card; PAX-band thresholds (≤15 / >15); group-size price tiers (6/10/14).
4. **Disappears with the file:** one-tab-per-group layout; live `#REF!/#DIV/0!/#N/A`
   errors; rate cards copy-pasted per year; the manual "price we sent" cells.
5. **Domain-model concepts:** Offer (CostEstimate → OfferVersion → AcceptedOfferSnapshot);
   suppliers as a **role of Organisation** behind the rate cards; room type & rider type
   on Participant; Activity/Program; cost categories.
6. **Calc-engine concepts:** the whole cost build-up and per-person allocation.
7. **External reference data:** the transfer and hotel **rate cards** (PriceList items);
   tax/insurance rate; fee and bike-rent parameters.

### A2. Multi-entity settlement — `Multientity_Bike_Flow_v5_summary.xlsx`

1. **Decision supported:** how much each internal party must **receive or pay** after a
   season, so the shared operation settles fairly.
2. **Permanent business rules:**
   - The business runs as **multiple legal entities sharing one economic operation.**
   - Each tour has an Organisation that **collects revenue** and, per cost, one that
     **pays** — these are transaction **roles**, not organisational units.
   - **Profit is pooled**, then distributed; **settlement per party = entitlement −
     cash already held → net transfer.**
   - **Intercompany transfers are not tour costs** and must never enter a tour's P&L.
3. **Configurable parameters (Policy):** the profit-share split (the **v5 file computes
   50 / 25 / 25**; the owner has since set **25 / 25 / 25 / 25** — see §B0); the fleet
   contribution / reserve; which costs count as "external".
4. **Disappears with the file:** the v2→v5 tab structure; entity-name typo normalisation
   ("Samps"→"Sampas") done only in summary formulas; "approved revenue vs raw row sum"
   correction plumbing; provisional-transfer suggestion cells.
5. **Domain-model concepts:** Organisation-in-role (revenue collector, expense payer,
   custodian); Financial Account and Earmarked Fund (kept **separate**); Settlement +
   Intercompany Transfer; **Profit Sharing Policy** (the split as versioned policy, not
   a formula); Allocation Bucket / Shared Allocation Pool.
6. **Calc-engine concepts:** pool math, per-party delta, suggested transfers.
7. **External reference data:** the split percentages and reserve as versioned policy
   parameters.

### A3. Bike-fleet finance — financing folder + `Bike_Fee_PnL` + master data

1. **Decision supported:** how the shared bike fleet is paid for and how its cost is
   recovered from tours.
2. **Permanent business rules:**
   - The bike fleet is a **capital asset**: financed, run at a cost, and replaced over
     time.
   - A **portion of bike revenue is allocated (a Fleet Contribution) to a fund** that
     recovers fleet investment + running costs. *How* the portion is computed is a
     policy, not a fixed formula.
3. **Configurable parameters:** bike-rent rate; fleet-contribution rate; loan terms;
   sizes & quantities.
4. **Disappears with the file:** the annual P&L tab layout; one-off adjustment lines.
5. **Domain-model concepts:** Asset (Bike) with a **fleet-finance dimension**; the
   **Bike Fund** as an **Earmarked Fund** (not necessarily its own Financial Account);
   the loan as a **Financing Obligation**; supplier contracts as SupplierAgreements.
6. **Calc-engine concepts:** amortisation schedule; annual fleet P&L; per-tour fleet-
   contribution accrual.
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

The reusable knowledge base. Each rule is tool-independent. `Stability`: **Permanent**
(rule), **Versioned** (policy/param), **Retire** (workaround).

### B0 — Owner clarifications & architectural corrections (confirmed 2026-07)

Authoritative decisions from the business owner, plus the architectural corrections
from the rule review. They update the rules below. **Not** applied to §4 yet.

- **Profit pooling is a stable pattern; the split is a *versioned policy*, not a
  permanent number.** Current policy: **25 / 25 / 25 / 25** into four
  **Allocation Buckets** — DA, Sampas, OT (known beneficiaries) and a fourth
  **Shared Allocation Pool** whose beneficiary is **not yet fixed** (DA team / Kolašin
  collaborators / possibly investment). The split may differ by partnership, season,
  group or product → it needs a **Profit Sharing Policy** (effective period,
  participants, %, scope, approval status), not a hard-coded ratio.
- **Who holds the money ≠ who owns it.** DA is the **Custodian** of the pooled cash
  (most revenue enters and most costs are paid there); custody does not make DA the
  owner of the Shared Allocation Pool.
- **Operating Fee ≠ Operating Margin.** The **Operating Fee** (a.k.a. "company fee") is
  an *embedded price component* (~€300/pax) that funds DA's shared-operations work.
  **Operating Margin** is a *derived result* = revenue − costs − allocations. The two
  must never be equated, and **the `margin = fee + bike rent` formula is dropped.**
- **DA is not a new entity type / "layer".** DA is an **Organisation** (and a Brand)
  that plays **roles** in a deal: operator, revenue collector, expense payer,
  administrator/custodian of the shared operation. No "Operating Agency" object.
- **Bikes:** **Bike Rental Revenue** (revenue from bike use) and **Fleet Contribution**
  (the part of it earmarked to the fleet) are separate; the Fleet Contribution feeds the
  **Bike Fund** (Earmarked Fund custodied at DA) which pays **Fleet Expense** (service/
  parts/mechanic), **Fleet Financing Payment** (loan) and **Fleet Investment** (new
  bikes). Real margin is only what remains after these. (Prefer *Fleet Contribution*
  over "Asset Usage Charge" — the latter only fits if it is booked as a per-use charge.)
- **Estimate and actual stay separate facts.** A **CostEstimateLine** (on the offer/
  calc) and an **Expense** (actual) are linked by a relationship (`ACTUALIZES_ESTIMATE`),
  not merged into one entity — so the original commercial assumption is preserved.
- **Supplier is a *role of Organisation*, not a new identity entity.** Price history is
  modelled as **PriceList / RateCard → PriceListItem** (service, period, currency, tax,
  pax band, room type, location) with effective dates — kept so cost growth justifies
  our price increases.
- **A guide is a Person**, not a Supplier; the economic side attaches via
  GuideAssignment + Compensation/Expense (and a Supplier Organisation only when the
  guide invoices through a company).
- **Financial Account, Earmarked Fund and Financing Obligation are three different
  things** (see §B7).
- **Single-page operability:** a group's day-by-day itinerary should surface its transfer
  and hotel info from **central databases** onto **one page**, while the data lives in
  shared tables. (Design intent — recorded, not modelled.)
- **`Operating Unit` is deferred** — not introduced until stable units with their own
  budget, responsibility and reporting are proven (e.g. DA Multiday, DA Daily, Bike
  Workshop, Booking Office).

### B1 — Pricing & commercial

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| PR-1 | Multiday tours are priced **per person**, by room type and rider type. | Business Rule | Permanent | Domain model |
| PR-2 | **Non-bikers** do not carry the bike component. | Business Rule | Permanent | Domain model |
| PR-3 | Price = allocated shared costs + room supplement + **operating-fee component** + **bike component**. | Calculation | Versioned | Calc engine |
| PR-4 | The price **embeds an Operating Fee** (funds shared operations) and a **bike component** (rental + Fleet Contribution). These are **price components, not margin**. | Business Rule | Permanent | Domain model + config |
| PR-5 | Operating fee ≈ €300/pax; bike rent ≈ €55/day × 5; tax/ins ≈ €1.5/pax/day. | Configuration | Versioned | External config |
| PR-6 | Transfer & hotel prices depend on a **PAX band** (≤15 / >15). | Business Rule (+config threshold) | Permanent (threshold Versioned) | Model + config |
| PR-7 | The **accepted price is an independent, immutable commercial fact** (AcceptedOfferSnapshot), not the computed cost and not affected by later calc edits. | Business Rule | Permanent | Domain model |
| PR-8 | One calc tab per group, with live formula errors and yearly copy-paste. | Spreadsheet Implementation | Retire | Nowhere |

### B2 — Shared operations, fee & margin

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| SO-1 | DA runs a **shared-operations function** funded by an **Operating Fee** per participant; DA acts here as an **Organisation-in-roles**, not a new entity. | Business Rule | Permanent | Domain model (ties to ADR-0002) |
| SO-2 | The Operating Fee amount and what overhead it funds are set by decision. | Policy | Versioned | Config + governance |
| SO-3 | **Operating Margin = revenue − costs − allocations** (derived); it is *not* a fee and *not* fee + bike rent. | Business Rule | Permanent | Domain model / calc engine |
| SO-4 | "Agency" has two meanings (travel **client** vs internal **shared-operations**); keep the word for the client; do **not** invent an "Operating Agency" object. | Historical Decision | Fixed | Model naming (open Q) |

### B3 — Fleet (bikes) as a financed asset

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| FL-1 | The bike fleet is a **capital asset**: financed, run at a cost, replaced over time. | Business Rule | Permanent | Domain model |
| FL-2 | **Bike Rental Revenue** (from bike use) and **Fleet Contribution** (the part earmarked to the fleet) are **separate**; the contribution rate is policy. | Business Rule (+Policy) | Permanent (rate Versioned) | Model + config |
| FL-3 | Fleet Contributions accumulate in the **Bike Fund**, which pays **Fleet Expense**, **Fleet Financing Payment** and **Fleet Investment**. | Business Rule | Permanent | Domain model |
| FL-4 | Fleet acquired via development loan (IRF) + supplier contract + import/customs. | Historical Decision | Fixed | Decision log |
| FL-5 | Bike allocation to participants is authoritative in Adventure Hub, not Notion (ADR-0002). | Historical Decision | Fixed | Model boundary |
| FL-6 | Fleet register (sizes, quantities, IDs) is reference data, synced Notion↔Drive. | Configuration | Versioned | External reference |

### B4 — Multi-entity operation & settlement

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| ME-1 | The business runs as **multiple legal entities sharing one economic operation**. | Business Rule | Permanent | Domain model |
| ME-2 | Per tour, one Organisation **collects revenue** and, per cost, one **pays** — **transaction roles**, not org units. | Business Rule | Permanent | Domain model |
| ME-3 | **Profit is pooled**, then distributed. (Pooling is the stable rule; the ratio is not.) | Business Rule | Permanent | Domain model |
| ME-4 | The split is governed by a **versioned Profit Sharing Policy**; current = **25/25/25/25** into four Allocation Buckets. | Policy | Versioned | Config + governance |
| ME-5 | The **Fleet Contribution / reserve** is handled before distribution and routed to the Bike Fund. | Policy | Versioned | Config + model |
| ME-6 | **Settlement per party = entitlement − cash already held → net transfer.** | Business Rule | Permanent | Domain model |
| ME-7 | **Intercompany transfers are not tour costs** and must be excluded from tour P&L. | Business Rule | Permanent | Domain model |
| ME-8 | The 4th bucket is a **Shared Allocation Pool**: beneficiary undecided; **DA is Custodian, not owner** (who holds ≠ who owns). | Policy | Versioned (open) | Config + governance |
| ME-9 | Settlement is **cash-based**, tracked as "cash held at party", partly physical cash. | Operational Convention | Should evolve | Ops (not a rule) |
| ME-10 | "Approved revenue" vs "raw row sum" with an unallocated correction that must reach zero. | Temporary Workaround | Retire | Nowhere |
| ME-11 | Entity-name typos normalised only in summary formulas. | Spreadsheet Implementation | Retire | Nowhere |

### B5 — Money: estimate vs actual, revenue, suppliers

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| FN-1 | **CostEstimateLine** (on the offer/calc) and **Expense** (actual) are **separate facts**, linked by `ACTUALIZES_ESTIMATE` for variance. | Business Rule | Permanent | Domain model |
| FN-2 | **Quoted → Accepted → Collected** are three distinct values. | Business Rule | Permanent | Domain model |
| FN-3 | Payments carry a **method** (cash / bank / Wise / Hub link) with per-method roll-ups. | Business Rule (+config) | Permanent | Model + config |
| FN-4 | Cost categories (hotel, transfer, guide comp, meals, NP tickets, rafting…). | Configuration | Versioned | External reference |
| FN-5 | **Suppliers are Organisations acting in a supplier role** (hotels, transfer/activity providers, bike vendors). A **guide is a Person**, not a Supplier. | Business Rule | Permanent | Domain model |
| FN-6 | Supplier prices live in **PriceList/RateCard → PriceListItem** (service, period, currency, tax, pax band, room type, location), time-versioned; history retained to justify our increases. | Business Rule | Permanent | Domain model + config |

### B6 — Tour lifecycle

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| LC-1 | Tour lifecycle is a **set of states + allowed transitions**, not one linear sequence. Happy path: inquiry → cost calc → offer → accepted/deposit → operate → collect → confirm costs → settle → closeout. | Business Rule | Permanent | Domain model |
| LC-2 | Branches must be supported: inquiry rejected, offer expired/revised, cancelled before/after deposit, partial payment, refund, delivered-but-unsettled, costs-not-confirmed. | Business Rule | Permanent | Domain model |
| LC-3 | **Closeout** is a *state* reached only after revenue collected, costs confirmed, and settlement done — reachable by several paths. | Business Rule | Permanent | Domain model |
| LC-4 | **Guides are assigned per day/segment** (GuideAssignment); they vary within one tour. | Business Rule | Permanent | Domain model |
| LC-5 | **Guide compensation method (per-diem)** varies by guide/contract/activity/season/tax status. | Policy / Configuration | Versioned | Config |

### B7 — Money holders: account vs fund vs obligation

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| MH-1 | **Financial Account** = a real place money sits: bank, Wise, POS clearing, physical cash. | Business Rule | Permanent | Domain model |
| MH-2 | **Earmarked Fund** = a purpose-designated portion of money (Bike Fund, Shared Investment Fund, tax reserve); may span several Financial Accounts. | Business Rule | Permanent | Domain model |
| MH-3 | **Financing Obligation / Liability** = a debt: loan (IRF), supplier debt, leasing. | Business Rule | Permanent | Domain model |
| MH-4 | The **Bike Fund** is an Earmarked Fund (a DA sub-ledger), not necessarily its own bank account. | Business Rule | Permanent | Domain model |

### B8 — Commercial offer chain

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| OF-1 | Chain: **CostEstimate → OfferVersion → AcceptedOfferSnapshot → PaymentSchedule → TripGroup → Expense**. | Business Rule | Permanent | Domain model |
| OF-2 | The **AcceptedOfferSnapshot is immutable** — later calculator changes do not alter accepted terms. | Business Rule | Permanent | Domain model |

### B9 — Customer & agency roles

| ID | Statement | Type | Stability | Belongs in |
|---|---|---|---|---|
| CU-1 | **Customer** = any buyer (role of Person/Organisation). **Agency** = travel intermediary / tour operator / DMC. **Corporate Client** = Organisation with a corporate customer role. **Direct Customer** = Person/Organisation with no intermediary. | Business Rule | Permanent | Domain model |

---

## Part C — Where each concept belongs (extraction summary)

**Canonical domain model** (identities, roles, relationships): Organisation **and its
roles** (operator, revenue collector, expense payer, custodian, supplier, agency,
customer); Person; GuideAssignment; Brand; TripGroup; the Offer chain (CostEstimate /
OfferVersion / AcceptedOfferSnapshot / PaymentSchedule); Payment; **Expense** and
**CostEstimateLine** as separate facts linked by `ACTUALIZES_ESTIMATE`; Settlement +
Intercompany Transfer; **Allocation Bucket / Shared Allocation Pool**; **Profit Sharing
Policy**; **Financial Account**, **Earmarked Fund** (Bike Fund), **Financing
Obligation** — kept separate; **Fleet Contribution / Bike Rental Revenue**; PriceList /
RateCard / PriceListItem; per-activity economics / VATEntry (ADR-0002).

**Future calculation engine** (implementations, not rules): the price build-up and
per-person allocation; the settlement pool/delta math; fleet amortisation and annual
fleet P&L; estimate-vs-actual variance. These consume model + config and produce
numbers — never modelled as truth.

**External reference / configuration data:** transfer & hotel rate cards (PriceListItems);
operating-fee, bike-rent, fleet-contribution and split parameters; cost categories;
loan/amortisation schedule; fleet register.

**Disappears with the spreadsheets (canonise nothing):** one-tab-per-group layout;
`#REF!/#DIV/0!` errors; yearly rate-card duplication; name-typo normalisation; the
approved-vs-raw revenue-correction plumbing; the manual "price we sent" override
*mechanism* (the *fact* that accepted price is independent — PR-7 — stays).

**Deliberately NOT introduced yet:** `Operating Unit` (no proven need); `Supplier` as an
identity entity (use a role + PriceList); "Operating Agency" as an object; `Cost` as a
single estimate+actual entity; the `margin = fee + bike rent` formula; "Asset Usage
Charge" as the primary name (use Fleet Contribution).

**Policies to govern, not hard-code:** the split % and its scope (ME-3/4), the fleet
contribution & reserve (FL-2/ME-5), the operating fee & bike rent (PR-4/5), the
Shared Allocation Pool beneficiary (ME-8), the guide compensation method (LC-5). All are
versioned decisions with effective dates — never baked into structure.

---

## Part D — Draft glossary of contested terms (company-wide, for review)

Working definitions, defined **once for all of Adventure OS** per the owner decision.
**Draft** — final adoption into `docs/DOMAIN_MODEL.md` happens at the model-update step.

**Identity (who someone *is*)**

| Term | Definition | Canon note |
|---|---|---|
| **Person** | A human being (guest, guide, contact…). | Canon entity. |
| **Organisation** | A legal/operational body (own company, hotel, agency, supplier…). | Canon entity. Roles attach to it. |
| **Legal Entity** | A registered company: DA, Sampas, Other Trails. | An Organisation. |
| **Brand** | A public identity (e.g. "Durmitor Adventure" as a brand); not automatically a legal entity. | Canon entity, distinct from Organisation. |

**Role (what they *do* in a deal — never a new identity)**

| Term | Definition |
|---|---|
| **Customer** | Any buyer (role of Person/Organisation). |
| **Agency** | A travel intermediary / tour operator / DMC (a client role). *Not* "direct" or "corporate" by itself. |
| **Corporate Client** | An Organisation holding a corporate customer role. |
| **Direct Customer** | A Person/Organisation buying with no intermediary. |
| **Supplier** | An Organisation providing a paid service/good (hotel, transfer, activity, bike vendor). A **role**, not an identity entity. |
| **Revenue Collector / Expense Payer / Operator / Custodian** | Transaction roles an Organisation plays for a given tour or fund. |
| **Shared-operations function** | DA's role of running shared operations, funded by the Operating Fee. *Not* a separate "Operating Agency" object. |

**Money — value & flow**

| Term | Definition |
|---|---|
| **Operating Fee** | An embedded price component (~€300/pax) funding shared operations. A price component, not margin. |
| **Operating Margin** | Derived result = revenue − costs − allocations. Not a fee. |
| **Bike Rental Revenue** | Revenue from bike use. |
| **Fleet Contribution** | The portion of bike revenue earmarked to the fleet (preferred over "Asset Usage Charge"). |
| **CostEstimateLine** | A forecast cost line on the offer/calc. |
| **Expense** | An actual cost incurred, tagged by paying Organisation. Linked to its estimate via `ACTUALIZES_ESTIMATE`. |
| **Quoted / Accepted / Collected** | Quoted price (calc) → accepted price (immutable commercial fact) → collected revenue (payments). |

**Money — where it sits / what it's for / what's owed** (kept separate)

| Term | Definition |
|---|---|
| **Financial Account** | A real place money sits: bank, Wise, POS clearing, physical cash. |
| **Earmarked Fund** | A purpose-designated portion of money; may span accounts (e.g. **Bike Fund**, Shared Investment Fund, tax reserve). |
| **Financing Obligation / Liability** | A debt: loan (IRF), supplier debt, leasing. |
| **Bike Fund** | The earmarked fleet fund ("bike kasa"), a DA sub-ledger; funds Fleet Expense / Financing Payment / Investment. |

**Allocation & settlement**

| Term | Definition |
|---|---|
| **Profit pooling** | The stable rule that profit is pooled before distribution. |
| **Profit Sharing Policy / Allocation Agreement** | A versioned policy: effective period, participants, %, scope (partnership/season/group/product), approval status. |
| **Allocation Bucket** | One share of the pool (currently four at 25 % each). |
| **Shared Allocation Pool** | The 4th bucket, beneficiary undecided (team / collaborators / investment). |
| **Custodian** | The party holding a fund's cash — *not* automatically its owner (who holds ≠ who owns). |
| **Settlement** | The reconciliation distributing the pool: `entitlement − cash held → transfer`. Not statutory accounting. |
| **Intercompany Transfer** | A money move between entities to settle; never a tour cost. |

**Fleet & assets**

| Term | Definition |
|---|---|
| **Asset (Bike)** | A capital asset with a finance dimension. |
| **Fleet Expense / Fleet Financing Payment / Fleet Investment** | Running costs / loan servicing / capital purchases of the fleet. |
| **SupplierAgreement / PriceList / RateCard / PriceListItem** | Contract + time-versioned prices (service, period, currency, tax, pax band, room type, location). |

**Activity economics**

| Term | Definition |
|---|---|
| **Per-activity economics / VATEntry** | Each activity (multiday e-bike, canyoning, rafting…) is its own economic unit with revenue, costs and output/input VAT; reconciled at legal-company level (ADR-0002). |

---

## Resolved questions & applied corrections

**Owner decisions (2026-07):** split 25/25/25/25 with a separate **Shared Allocation
Pool** (DA = custodian, beneficiary TBD); **Operating Fee ≠ Operating Margin**;
estimate and actual are **separate facts**; **Bike Fund** = earmarked fund custodied at
DA; **supplier price history kept** via versioned rate cards; **glossary defined
company-wide** (Part D); single-page group operability over central DBs.

**Architectural corrections applied in v2 (review):** removed `Operating Unit`,
"Operating Agency", "Asset Usage Charge" and the `margin = fee + bike rent` formula;
Supplier reduced to a **role** with PriceList history; Guide kept as **Person** (not
Supplier); Financial Account / Earmarked Fund / Financing Obligation **separated**;
profit split reframed as a **versioned Profit Sharing Policy**; lifecycle reframed as
**states + transitions**; guide per-diem split into rule (assignment) + policy
(compensation); Agency/Customer roles narrowed (B9).

**Next step:** your review of this v2 rulebook. Only after that do we update §4 — still
**not** Phase 2, and no changes to any workspace, production or Drive data.
