# Multiday 2026 — Workspace Audit (Phase 1)

> **Mission.** The objective is **not** to optimize Notion. The objective is to
> **document the business model** so that Notion becomes only *one*
> implementation of that model — Notion today, and WeTravel or Adventure OS
> tomorrow.
>
> **Guiding principle:** **Business first. Software second. Migration always
> possible.** Every finding and recommendation describes the *business* first
> and the *software* second, and must survive a change of platform.
>
> **Phase:** 1 — Audit. We are *not* migrating, merging, or modifying anything.
> This document is read-only findings + a first draft of the canonical model.
>
> **Privacy:** no client/agency names, guide or supplier names, payment amounts,
> or Notion IDs appear here. Only *structure* and *aggregate* counts.

---

## Design constraints

These are the non-negotiable rules the whole effort (this cleanup *and* the
eventual Adventure OS) must respect. They are written down deliberately, because
they are exactly the things that save a project when the platform changes:

1. **The 2026 season must continue uninterrupted.** Cleanup runs alongside live
   operations; nothing may block day-to-day work.
2. **Existing data must remain readable at every step.** No state where the team
   can't find a tour, a rooming list, or a payment.
3. **Every migration must be reversible.** Snapshot before each change; every
   step has a rollback.
4. **No vendor lock-in.** The business model is not owned by Notion, WeTravel, or
   Adventure OS. Any of them is a replaceable implementation.
5. **One business model, multiple implementations.** The model is defined once,
   independent of tooling; each platform maps *onto* it.
6. **The canonical schema lives in Git.** The repository — not any single Notion
   page — is the source of truth for *structure* (schema, naming, relations,
   rules). Notion holds the *operational data* for this season.
7. **Production data is never modified without an approved migration plan.** All
   experiments happen in the MCP Cleanup workspace.

## Architectural notes

- **WeTravel is a realistic future scenario.** Booking and tour management may
  move to WeTravel — itinerary, booking, customer communication, payments,
  expenses, and the booking widget could all become WeTravel's responsibility.
  (A hint already exists: PAYMENTS has a `Hub link` payment method.) Therefore
  the canonical model **must not be coupled to Notion**, and must be portable to
  **Notion · WeTravel · Adventure OS · any future platform**.
- **Separate the business model from the software implementation.** Every entity
  in this audit is described as three layers: **Business concept** → **Current
  implementation** (Notion database) → **Future implementations** (Notion /
  WeTravel / Adventure OS). The business is described first; the software second.
- **Do not over-design Notion.** The goal is not a perfect Notion workspace. The
  goal is a workspace that is *easy to maintain during 2026* and *easy to migrate
  later*. Avoid any structure that only makes sense inside Notion and would not
  survive a move to another platform.

---

## 0. Scope, rules, and roadmap

### Working rules for this phase

- **Audit only.** No merge, no migration, no structural change to any workspace.
- **All experimental work happens in the `2026 Multiday — MCP Cleanup`
  workspace** — it is the latest iteration and our experimental environment.
- **Production (`2026 Multiday`) stays untouched** until the audit is complete
  and a migration plan is approved.
- **No canonical copy is chosen yet.** That is a Phase-2 decision, not a
  Phase-1 one.

### Roadmap (approved)

| Phase | Name | Output |
|---|---|---|
| **1** | **Audit** *(this doc)* | Workspace Inventory · Relationship Map · Data Quality Report · Canonical Model (draft) |
| 2 | System Design | Canonical business model (Notion-independent) · canonical Notion schema · naming/templates/relations/rules · migration + rollback plan |
| 3 | Git Foundation | Schema, docs, audit reports, migration scripts in the repo — the single source of truth for workspace structure |
| 4 | Workspace Cleanup | Merge production + MCP Cleanup · remove duplicates · standardize · archive legacy · validate relations. Done **in Notion**, which stays the source of truth for this season — but treated as an evolutionary step toward a more integrated system. This season still has to be delivered; more tours are coming. |
| *later* | Adventure OS migration | Only **after** Phases 1–4. Notion becomes one implementation of the documented model; Adventure OS becomes another. |

### Decisions captured (this audit)

- **No Guides / Guide Assignments database.** Guides change frequently and often
  work different locations within the same tour. Guides are assigned at the
  **day-by-day itinerary level** (a Guide / Guides field per day or stage).
  Guide *fees* continue to go to Expenses (the EXPENSES table already has a
  `Guides` category — consistent with this).
- **No Room Allocations database.** That approach is dropped. Rooming already
  lives on PARTICIPANTS (Room type: Single/Double/Twin/Triple) — so the separate
  Room Allocations DB and the `PARTICIPANTS → Room allocation` relation are both
  slated for removal in Phase 4.
- **Google Sheets stays the source of truth for pricing calculations.** Notion
  holds the operational layer + a final-quote snapshot, not the calculators.

---

## Deliverable 1 — Workspace Inventory

> Status: **substantially complete for the core model; deepening in progress** for
> the MCP Cleanup satellite tables, INQUIRES embedded mini-DBs, and legacy years.

### 1.1 Top-level structure

The `multiday trips Workspace` root contains, mixed together:

- **2026, current:** `2026 Multiday` (production), `2026 Multiday — TEST / MCP
  CLEANUP` (experimental/working), `2026 Multiday ebike UPGRADE`, `Multi-Day
  Tours - UPITI`.
- **Legacy:** `2025 Grupe` (+ backup), `2024 Scheduled tours`, `2023 Scheduled
  tours / staro`, `Transferi - Etape 2025`, plus loose root-level databases and
  a Photo & Video page.
- **Template:** an `Empty page - Template`.

### 1.2 The core model (hub-and-spoke)

`TOURS` is the hub; one row = one tour/group. Confirmed properties:

- **Own fields:** Group (title), Dates, PAX, Status (multi-select pipeline:
  Upit → Poslat program → Uplaćen depozit → Bukirani hoteli → Potvrđen →
  Završeno → Naplaćeno sve / Otkazano), Program, Notes.
- **Relations:** Agency → COMPANIES · Participants → PARTICIPANTS · Payments →
  PAYMENTS · Hotel Bookings → HOTEL BOOKINGS.
- **Rollups/formulas:** Participants count · Program price total · PAID Total ·
  Expenses total · **PROFIT** (formula) · **Remaining to collect** (formula).
- **MCP Cleanup copy adds:** Revenue Source, Revenue Status, Accepted Quote
  Total (a revenue-reconciliation layer for cross-checking against Zoho).

Databases pointing **into** TOURS:

- **EXPENSES** — Tour → TOURS; category, amount, payment method, "paid by".
- **TRANSFERS** — Group → TOURS; route (start/finish text), supplier (select),
  PAX, transfer date, status (Upit / Bukirano / Otkazano).

Plus a **bikes import** table and hotel-reference material.

### 1.3 The MCP Cleanup workspace (our working environment) — full contents

Databases (all internally wired to the Cleanup `TOURS`, i.e. a **complete,
self-contained graph**):

| Database | Role | Key relations |
|---|---|---|
| **TOURS** | hub (one row = one tour) | Agency, Participants, Payments, Hotel Bookings |
| **AGENCIES** 🏦 | external client (TO / DMC / Direct / Corporate) | GROUPS 1 → TOURS |
| **PARTICIPANTS** 👥 | traveller (rooming, bike, rider type, price) | Group → TOURS, Payments, Bike, ~~Room allocation~~ |
| **PAYMENTS** 💶 | money in | Group → TOURS, Participant, Company |
| **HOTEL BOOKINGS** 🏨 | accommodation (most polished table) | Tour → TOURS |
| **EXPENSES** 💸 | money out (categories incl. `Guides`) | Tour → TOURS, Paid by → Company |
| **TRANSFERS** 🚌 | transport legs | Group → TOURS |
| **bikes import** | asset pool | (linked from PARTICIPANTS.Bike) |
| **Company** *(68e8…)* | own paying/receiving entity/account | used by Payments.Company, Expenses.Paid by |
| ~~**Room Allocations**~~ *(004a…)* | **to be removed** (decision) | orphaned once PARTICIPANTS.Room allocation drops |

Pages: `2026 INQUIRES`, `PONUDE` (offers), `HOTELI INFO`, **14 per-group pages +
`TEMPLATE - Tour Page`**, plus `Multiday 2026 OS Dashboard`, `Daily Operations
Dashboard`, `Closeout Dashboard — Clean`, `MCP Cleanup Log`, `Bike Allocation
System - Implementation Plan`, `Sync-up 21.04.2026`.

Note: **14 group pages vs 13 TOURS rows** — the narrative pages and the DB rows
are not even in 1:1 correspondence, confirming they are a separate, unsynced
layer (P5).

### 1.4 Two parallel copies — total duplication, not "split"

Correction to a first impression: it is **not** that relations are split across
the two copies. **Each universe is internally complete** — production has its
own Expenses/Transfers pointing at the production TOURS, and MCP Cleanup has its
own pointing at the Cleanup TOURS. So the whole graph (hub + all spokes) exists
**twice, in full**, and the two have **drifted** (see Data Quality Report). The
Cleanup copy is the more advanced one (revenue model, dashboards, closeout) and
is our working environment.

### 1.5 Two "company"-shaped concepts (modelling clarity needed)

Three different things currently blur together and must be separated in the
canonical model:

- **Partner / Agency** (AGENCIES) — the *external* client who books a group
  (tour operator, DMC, direct, corporate).
- **Entity / own company** — *our* legal entities that pay and get paid. Present
  as a select on Hotel Bookings (`Durmitor Adventure`, `Sampas`, `Other Trails`)
  and as a relation table used by Payments and Expenses. **The business runs
  under multiple own entities** — the model must be multi-entity.
- **Cash / account position** — the relation table wired to Payments and
  Expenses is actually an **(unnamed) treasury ledger**: per account it rolls up
  Cash / Bank / Wise totals from Payments, subtracts Cash / Bank expense totals,
  and computes a `Current State` (running balance). So "own entity" and "cash
  account balance" are currently the *same* fragmented, untitled table — a
  business concept (money position per entity) hiding inside a Notion utility.
- **Payer/account** — who physically paid an expense (`Expenses.Paid by`).

The business concept here is **Entity** (an own company, with a money position);
the current Notion implementation splits it across a hotel select and an unnamed
ledger. Phase 2 should name and unify it.

### 1.6 Inconsistent relation naming (schema hygiene)

The *same* TOURS relation is named differently in every table: `GROUPS 1`
(Agencies), `Tour` (Hotel Bookings, Expenses), `Group` (Participants, Payments,
Transfers), `Payments ` (trailing space, on TOURS), `👥 PARTICIPANTS` (emoji in
the property name). Phase 2 must define **one naming convention**.

### 1.7 Inbound pipeline: Inquiries → Offers → Tour (all disconnected)

The business flow is **Lead → Offer → confirmed Tour**. In Notion today all
three stages live in separate, unlinked surfaces:

- **Inquiries** — `2026 INQUIRES` is a **free-form page with a Markdown table**
  (~15 tour-operator leads: dates, pax range, program, calc link, prices), plus
  a few loose embedded mini-databases (a finance/dates grid, a calendar) and
  inline to-do checklists. **Not a real database; no relation to TOURS.**
- **Offers** — `PONUDE` wraps a **thin, untitled database** with only `Name`,
  `Brochure` (file), and `Calculation` (URL to the Google Sheet). It is really a
  document holder, **not** a quote pipeline: no client, dates, price, or relation
  to TOURS.
- **Tour** — the TOURS row, created by hand.

So a lead is re-typed at each stage; nothing carries a relation forward. In the
business model this is a **single lifecycle** (`Inquiry → Offer → TripGroup`),
and every implementation should preserve that thread. Both surfaces are also
duplicated across the two universes.

### 1.8 Group-page anatomy (the "standard" is half-structured)

The `TEMPLATE - Tour Page` — the intended standard — mixes two incompatible
styles:

- **Database-backed views:** an embedded HOTEL BOOKINGS view and an embedded
  EXPENSES view, filtered to the tour. ✅ good — reads from the real tables.
- **Manual Markdown tables** for rooming/bikes (Room · Guest 1/2 · Transport ·
  Bed type · Height · Frame size · Bike no.) and a "Bikes sum" table. ❌ these
  **shadow the PARTICIPANTS database** (which already holds room type, rider
  type, bike, bike size) — re-entering the same data as free text.

So even the template perpetuates double-entry (P5): rooming exists both in
PARTICIPANTS and as prose on the page. Real group pages are less consistent
still ("group pages različite i zbrda-zdola"). Recommendation for Phase 2: the
page should be a **thin view layer over the databases** (embedded, filtered
views + Drive links), with **no** hand-maintained tables that duplicate a DB.

### 1.9 Legacy boundary (2023–2025)

Legacy years sit as **separate top-level pages/databases** at the workspace root
(`2023 Scheduled tours / staro`, `2024 Scheduled tours`, `2025 Grupe` + backup,
`Transferi - Etape 2025`), not relationally connected to the 2026 model. The
archive boundary is therefore clean and low-risk: in Phase 4 they can be moved
under a single `Archive` parent without touching any 2026 relation. They are
**read-only history** — kept readable (constraint #2), not migrated.

### 1.10 Inventory status: **complete**

The Phase-1 inventory is closed. Every core database, the treasury ledger, the
inquiries/offers surfaces, the group-page template, and the legacy boundary have
been examined (read-only). Remaining detail (exact per-page section counts across
all 14 group pages) is quantification, not discovery, and can be produced on
demand.

---

## Deliverable 2 — Relationship Map

Current, as-built **within one universe** (✅ wired · ❌ missing). Both universes
have this same internal shape:

```
AGENCIES ──GROUPS 1──────────▶  TOURS   ✅ (relation exists; ~⅓ rows empty)
PARTICIPANTS ──Group─────────▶  TOURS   ✅ (relation exists; ~⅓–½ empty)
   PARTICIPANTS ──Payments───▶  PAYMENTS ✅   PARTICIPANTS ──Bike──▶ bikes ✅
   PARTICIPANTS ──Room alloc─▶  (Room Allocations)  ✂️ to be removed
PAYMENTS ──Group─────────────▶  TOURS   ✅ (~½ empty)
   PAYMENTS ──Company────────▶  Company ✅   PAYMENTS ──Participant▶ PARTICIPANTS ✅
HOTEL BOOKINGS ──Tour────────▶  TOURS   ✅ (fully linked)
EXPENSES ──Tour──────────────▶  TOURS   ✅   EXPENSES ──Paid by──▶ Company ✅
TRANSFERS ──Group────────────▶  TOURS   ✅
INQUIRES (lead)  ❌─not linked─▶  TOURS
PONUDE (offer)   ❌─not linked─▶  TOURS
Per-group pages  ❌─not linked─▶  TOURS   (14 pages vs 13 rows)
```

Structural faults that stand out:

- **The entire graph is duplicated across two universes** (production + MCP
  Cleanup), each internally complete, now drifted apart. This — not a split — is
  the core problem.
- **Two/three entry points never meet the hub:** INQUIRES (leads), PONUDE
  (offers), and the rich per-group pages all describe the same tours as the
  TOURS rows, with no relation → the same group is captured 2–3 times.
- **One relation to prune:** PARTICIPANTS → Room Allocations (per decision).

---

## Deliverable 3 — Data Quality Report

Measured live across both TOURS copies (13 rows each; one is a template row, so
treat ~12 as real tours). Aggregate only:

| Field missing | Production copy | MCP Cleanup copy |
|---|---|---|
| Agency | 5 / 13 | 5 / 13 |
| Payments link | 6 / 13 | 6 / 13 |
| Participants link | 6 / 13 | 5 / 13 |
| Hotel bookings | 0 / 13 | 0 / 13 |
| Dates | 4 / 13 | 4 / 13 |
| PAX | 4 / 13 | 2 / 13 |
| Status | 5 / 13 | 5 / 13 |

Findings:

- **Hotels are fully linked; everything else is missing on ~⅓–½ of tours**
  (agency, payments, participants, dates, status).
- **The two copies disagree** on Participants and PAX for the same tours — hard
  evidence that parallel editing has caused divergence, and that there is no
  single trustworthy record today.
- Because Payments/Participants/Expenses links are incomplete, the **PROFIT and
  Remaining-to-collect rollups cannot be trusted** for roughly half the tours.

---

## Deliverable 4 — Canonical Business Model (draft, Notion-independent)

> ⚠️ **Not approved. Superseded pending reconciliation.** This section is a
> *first draft built up from Notion*. A repository-wide check found that Adventure
> OS **already defines** a mature canonical model covering these concepts — see
> [`multiday-architecture-compatibility-review.md`](multiday-architecture-compatibility-review.md).
> Several items below **conflict with the canon or inherit Notion limitations**
> (e.g. `Group`→**TripGroup**, `Traveller`→**Participant**, `Guide` is a canonical
> **GuideAssignment**, Inquiry converts via **Offer**, "Entity+treasury" splits
> into **Organisation + Settlement**). Do **not** treat this §4 as the canonical
> model; it will be reframed as a *bounded-context mapping* onto the existing
> canon after review.

This is the point of the whole exercise: describe the business, not the tool.
Notion (today), WeTravel and Adventure OS (later) are all just implementations of
it — but the canonical definition lives in the repo's domain docs, not here.

### 4.1 Entities

| Entity | Meaning | Lifecycle / notes |
|---|---|---|
| **Inquiry (Lead)** | Inbound request from a tour operator before it's sold | Open → Quoted → Won (→ becomes a TripGroup) / Lost |
| **TripGroup** | One sold/planned multiday tour for one client group — the **aggregate root** | Inquiry → Quoted → Deposit → Confirmed → Hotels booked → Operating → Completed → Closed/Paid |
| **Partner (Agency/DMC)** | The **external** B2B client who books the group (TO / DMC / Direct / Corporate) | reused across seasons |
| **Entity (own company)** | One of **our own** legal entities that pays/receives (e.g. multiple trading names) | multi-entity from day one; a booking/payment belongs to one entity |
| **Participant** | An individual traveller in a group | rider type (biker/non-biker), **room type (single/double/twin/triple)**, bike + size, unit price, payment status |
| **ItineraryDay** | One day/stage of a TripGroup | date, base, hotel, program, transfer, meals, **guide(s)**, status |
| **Accommodation** | A hotel stay for a group segment | check-in/out, nights, PAX, rooms, cost, confirmation #, payment status/deadline, **responsible entity** |
| **Transfer** | A transport leg | route, supplier, PAX, date, status |
| **Payment** | Money **in** — attaches to a TripGroup and/or a Participant | amount, method (cash/bank/Wise), receiving **Entity** |
| **Expense** | Money **out** (incl. guide fees) | category, amount, method, **paid-by (Entity/payer)** |
| **Asset (Bike)** | Equipment allocated to a participant | frame size, bike no. |
| **Document** | External file (Drive) | type (calc/brochure/confirmation/invoice), status, link |
| **Guide** | A person referenced on ItineraryDay | **not** a managed DB — a reference at day level; fees → Expense |

### 4.2 Relationships (verbs)

```
Inquiry        CONVERTS_TO        TripGroup
Partner        BOOKS              TripGroup
Participant    TRAVELS_IN         TripGroup
TripGroup      HAS_DAY            ItineraryDay
ItineraryDay   GUIDED_BY          Guide(s)
ItineraryDay   STAYS_AT           Accommodation
ItineraryDay   USES               Transfer
TripGroup      RECEIVES           Payment          (→ collected by an Entity)
Participant    PAYS               Payment
TripGroup      INCURS             Expense          (→ paid by an Entity/payer)
Accommodation  OPERATED_BY        Entity
Participant    ASSIGNED           Asset(Bike)
TripGroup      REFERENCES         Document
TripGroup      PRICED_IN          GoogleSheet      (external system of record)
```

### 4.3 Boundaries

- **Pricing/calculation** lives in **Google Sheets** (external source of truth);
  the model stores only the *final quote snapshot* and *price basis*, not the
  calculators.
- **Revenue reconciliation** (Revenue Source/Status) is a *verification* concern
  cross-checking the model against accounting (Zoho) — kept, but modelled as an
  attribute of the money flow, not a parallel truth.

### 4.4 Business concept → current → future implementations

**Business first, software second.** Each row reads left-to-right: the business
concept is primary; Notion is merely its *current* implementation; WeTravel and
Adventure OS are *possible future* ones. The concept does not change when the
platform does.

| Business concept | Current impl. (Notion) | Future impl. (Notion / WeTravel / Adventure OS) |
|---|---|---|
| **Tour** (a sold multiday trip) | `TOURS` row | Notion DB · WeTravel *trip* · AOS `TripGroup` |
| **Partner** (external client) | `AGENCIES` | Notion DB · WeTravel *contact/agent* · AOS `Company` |
| **Entity** (own company + money position) | Hotel `Entity` select + unnamed treasury ledger | Notion DB · WeTravel *account* · AOS `Entity` |
| **Traveller** | `PARTICIPANTS` (rooming inline) | Notion DB · WeTravel *booking/traveler* · AOS `Participant` |
| **Itinerary day** (+ guide) | *day-by-day table (to add)* | Notion DB · WeTravel *itinerary* · AOS `ItineraryDay` |
| **Accommodation** | `HOTEL BOOKINGS` | Notion DB · WeTravel *supplier booking* · AOS `Accommodation` |
| **Transfer** | `TRANSFERS` | Notion DB · WeTravel *logistics* · AOS `Logistics` |
| **Payment** (money in) | `PAYMENTS` | Notion DB · WeTravel *payments/widget* · AOS `Payment` |
| **Expense** (money out) | `EXPENSES` | Notion DB · WeTravel *expenses* · AOS `Cost` |
| **Asset** (bike) | bikes import | Notion DB · (n/a WeTravel) · AOS `Asset` |
| **Inquiry / Offer** (lead lifecycle) | `INQUIRES` text + `PONUDE` doc DB | Notion DB · WeTravel *lead/widget* · AOS `Lead` |
| **Document** | brochure/calc links (scattered) | Notion DB · WeTravel *files* · AOS `Document` |
| *(dropped)* | ~~Room Allocations~~ | rooming lives on Traveller everywhere |

The point of the table: **nothing in the middle column is essential.** If booking
moves to WeTravel, the concepts survive unchanged; only the right-hand mapping is
exercised. That is the portability the design constraints require.

---

## Deliverable 5 — Google Drive & Spreadsheet Operations (draft)

> Read-only audit of the operational layer that lives **outside** Notion — in
> Google Sheets, Numbers and documents. This is where pricing, the multi-entity
> settlement, and bike-fleet finance actually live. **No file was modified,
> renamed, moved or created.**
>
> **Privacy:** no client names, guest/guide personal names, invoice numbers or
> actual money balances appear here. Own-company names (Durmitor Adventure,
> Sampas, Other Trails) are used because the repo canon (ADR-0002, DOMAIN_MODEL)
> already names them. Business-rule *parameters* (split %, per-pax fee structure)
> are included as model logic; **actual amounts and balances are not.**

### 5.1 Drive inventory (folders)

| Folder | Purpose | Period | Owner(s) | State | Relation to Notion | Content type |
|---|---|---|---|---|---|---|
| **Multiday 2026** | Live season ops | 2026 | Boris + colleague | Active | Mirrors Notion group pages; holds the calc Notion links to | Source data + calc + offer docs + per-group folders + invoices + hotel rate cards |
| **Multiday 2025** | Prior season + **multi-entity finance lab** | 2025 | Boris + colleague | Historical/reference | Not linked; the settlement model Notion lacks entirely | Settlement models (Bike_Flow v2–v5, Settlement template, Entity summary), cash/financials, per-group folders, calc backups |
| **2024 archive** | 2024 season | 2024 | Boris + colleague | Historical | Not linked | 2024 calc, bike register, per-group folders, invoices, deposits |
| **Bike master data** (segment) | Bike fleet register ↔ Notion sync | 2026 | Boris | Active | **Directly feeds** Notion bikes DB (export/import round-trip) | `bikes_master`, Notion export zip, `notion_bikes_import.csv/tsv` |
| **Bike financing** (segment) | Fleet **capital / investment / amortization** | 2024→ | Boris | Active/reference | None | Amortization plan, **IRF loan**, supplier contract (Matija), Bike-Discount/Cube offers, customs, bank guarantee, tax docs |
| **Multiday umbrella** (wider) | Parent of 2025/2026 | — | Boris | Container | — | Folders only |
| **eBike parts** (wider) | Parts / maintenance | 2026 | Boris | Active | Feeds bike cost side | Parts receipts/spec |

Nothing was inaccessible in the listed folders; deep-read focused on the two
highest-value spreadsheets (pricing calculator, multi-entity settlement). Per-group
sub-folders and per-group balance sheets were sampled, not exhaustively opened.

### 5.2 Spreadsheet model analysis

**A. Pricing calculator — `2026 multi-day kalkulacije.xlsx`** (the calc the Notion
INQUIRES rows link to; **Google Sheets is authoritative for pricing**, per ADR-0002
and the Notion decision).

- **Reference tabs (rate cards):** a **Transfers** price list (route → price, in two
  PAX bands ≤15 / >15) and a **Hotels** price list (hotel + season → single/double
  rate). These are **supplier rate cards** — shared inputs.
- **One tab per inquiry/group.** Each rebuilds: a day-by-day **itinerary** (date,
  base, hotel, biking program); a **transfers** block (per-day legs priced from the
  rate card, split biking/non-biking PAX); a **hotels** block (nights × rate); an
  **additional services** block (rafting, lunch packets, dinners, gondola, boat —
  each with an *Is included* flag); and a **Shared Expenses** cost build-up (guide,
  supporting vehicles, logistics, **company fee**, local tax & insurance, NP tickets,
  shared transfers, rafting, dinners).
- **Business rule — cost→price:** `shared costs total ÷ PAX = shared cost per person`
  → `+ room supplement (single/double)` → **Price PP**, computed separately for
  **bikers vs non-bikers** and tiered by group size (6/10/14 PAX bands).
- **Business rule — margin:** `Marza = Company fee + Bike rent`, where **Company fee ≈
  €300/person** (this is the ADR-0002 **agency system fee**) and **Bike rent ≈ €55/day
  × 5 days** (the **bike-usage charge** baked into price). Margin is *defined as* the
  agency fee plus the bike charge — the whole profit engine is those two levers.
- **Manual steps / risks:** the *quoted* price is frequently a **manual override** of
  the computed price (cells like "price we sent to …" differ from the formula); several
  tabs carry live `#REF!` / `#DIV/0!` / `#N/A` errors; rate cards are duplicated across
  yearly calc files.

**B. Multi-entity settlement — `Multientity_Bike_Flow_v5_summary.xlsx`** (the single
place the whole multi-company economics is modelled; **nothing equivalent exists in
Notion**). Tabs and roles:

| Tab | Role |
|---|---|
| `Bike_Fee_PnL` | Annual **bike-fleet P&L**: fleet costs (parts, mechanic, imports, investments, staff) vs bike-fee inflows per entity → leftover reserve |
| `Multiday_Costs` | Per-group **actual external costs**, each tagged `Paid_By_Entity` + `Cost_Category` + `Settled?` |
| `Multiday_Revenue` | Per-group **revenue**, tagged with the collecting `Entity` |
| `Intercompany_Transfers` | Cash/bank moves **between entities** (explicitly *not* group costs) |
| `Multi_PnL` | Pool math: revenue − external costs − multiday bike-fee = **distributable profit** |
| `Entity_Summary_v2` / `Settlement_Summary_v5` | **Settlement**: per entity entitlement − cash held = **delta (+receive / −pay)**, plus provisional transfer suggestions |
| `Logic_Control_v5` | Controls: approved-revenue vs raw-row-sum, **revenue correction** that must reach zero before settlement is final |

- **Business rule — settlement:** `gross pool = (approved multiday revenue − external
  costs) + all bike-fee inflows − annual bike-fee costs`; split by fixed **profit-share
  %** (v5: **DA 50 / Other Trails 25 / Sampas 25**; earlier versions used a flat 25 %
  plus a 4th internal share); then **deduct the multiday bike-fee reserve** (retained
  in the central **"bike kasa" at Durmitor Adventure**); the remainder is the final
  distributable pool. Per entity, `entitlement − cash already held = settlement delta`,
  settled by intercompany transfers.
- **Cross-file dependencies:** revenue rows trace to Notion Payments and to per-group
  balance sheets; costs trace to `Troskovi sumirano.numbers` and invoices in Drive;
  bike-fee logic depends on the **bike-financing** folder (below). Links to Hub, Wise,
  bank and Zoho are referenced by payment method (`cash / bank / Wise / Hub link`) but
  not reconciled inside the workbook.
- **Version risk:** the model exists as v2→v5 with **changing split rules** — no single
  file is marked authoritative.

### 5.3 Multi-entity operating model

The files force a separation the Notion audit had collapsed into one "Entity". Ten
distinct concepts are actually in play:

| Concept | How the files express it |
|---|---|
| **Legal Entity** | Durmitor Adventure, Sampas, Other Trails (registered companies; invoices, tax/bank-guarantee docs sit under DA) |
| **Operating Unit** | DA = agency + bike ops; Sampas = mountain/Kolašin ops; Other Trails = coast/Tivat logistics; **+ a 4th internal "ekipa" 25 % share** inside DA |
| **Revenue Collector** | the entity that *collected* a given group's revenue (`Multiday_Revenue.Entity`) |
| **Expense Payer** | `Paid_By_Entity` on each cost row |
| **Supplier** | hotels, transfer providers, activity providers (rafting/jeep), guides (per-diem), bike suppliers (Matija, Bike-Discount, Cube), restaurants |
| **Financial Account** | cash / bank / Wise positions per entity; the central **bike kasa** at DA; the **IRF loan** account |
| **Settlement** | entitlement vs cash-held → delta; provisional intercompany transfers |
| **Allocation Rule** | profit-share % (50/25/25); bike-fee reserve deduction; company-fee-per-PAX; bike-rent-per-day |
| **Ledger / Transaction** | `Multiday_Costs`, `Multiday_Revenue`, `Intercompany_Transfers` rows; per-group balances |
| **Derived Account Balance** | "cash held at DA/OT/Sampas", `Current State`, settlement delta |

**Bike fee = Asset Usage Charge / fleet financing.** The bike-financing folder shows
the fleet was **capitalised** (supplier contract, **IRF development loan**, customs
import, bank guarantee) and **amortized** (an explicit amortization plan). The
per-tour "bike rent" in pricing and the "bike fee" in settlement are the mechanism
that **recovers that capital + running costs** into the central bike kasa. This is a
genuine domain concept (asset usage charge + depreciation/loan servicing) **entirely
absent from Notion**, and it is what ADR-0002 anticipated under "investment and
depreciation references" and "equipment and maintenance".

### 5.4 Pricing & quotation workflow (reconstructed)

| Lifecycle step | Where it happens | Authoritative value |
|---|---|---|
| Inquiry | Notion INQUIRES (text) + Drive inquiry docs | first contact only |
| Cost calculation | **Google Sheets** calc (per-group tab) | **estimated costs** ← authoritative |
| Pricing decision | Sheets `Marza` + **manual override** | **quoted price** |
| Offer / proposal | Drive PPTX/PDF brochures + thin Notion PONUDE | the sent document |
| Accepted terms | Drive deposit PDFs + Notion status "deposit paid" | **accepted quote snapshot** (unstructured) |
| Deposit | Notion Payments + Drive invoices | actual payment |
| Operational planning | Notion group pages + Drive per-group folders | rooming/logistics |
| Delivery | operational (guides/transfers) | — |
| Final collection | Notion Payments + Drive invoices | **actual revenue** |
| Cost confirmation | Drive `Multiday_Costs` / `Troskovi sumirano` | **actual expenses** |
| Multi-entity settlement | **Drive settlement workbook only** | **entity settlement** ← authoritative |
| Tour closeout | Drive Obracun draft + thin Notion Closeout | closeout |

Value types that must stay distinct (the files prove they diverge): **estimated cost**
(Sheets) ≠ **quoted price** (Sheets) ≠ **accepted-quote snapshot** (manual/deposit doc)
≠ **actual revenue** (Payments) ≠ **actual expenses** (settlement) ≠ **gross margin**
(Multi_PnL) ≠ **distributable profit** (after bike-fee reserve) ≠ **entity settlement**
(delta).

### 5.5 Source-of-truth matrix

| Business information | Current source of truth | Secondary copies | Risk |
|---|---|---|---|
| Lead | Notion INQUIRES (text) | Drive inquiry docs, email | not structured; leads lost |
| Quote calculation | **Google Sheets** calc | yearly calc backups, HTML export | fragile (`#REF!`), duplicated rate cards |
| Accepted price | Deposit PDF / manual "price sent" | Notion `Accepted Quote Total` (mostly empty) | **no structured home** |
| Participant list | Notion PARTICIPANTS | Drive per-group rooming sheets, group-page tables | triple-entry, drift |
| Hotel costs | Sheets rate card + `Multiday_Costs` | Notion Hotel Bookings, Drive hotel price lists | three copies, no reconciliation |
| Payments | Notion PAYMENTS | Drive `Uplate sumirano`, invoices, bank/Wise | split across systems |
| Actual expenses | Drive `Multiday_Costs` | Notion Expenses, `Troskovi sumirano` | Notion Expenses incomplete |
| Profit split | **Drive settlement workbook** | — | single fragile file, versioned, manual |
| Intercompany balance | **Drive settlement workbook** | — | cash-based, provisional, no ledger |

### 5.6 Notion ↔ Drive gap analysis

**Concepts entirely missing from the Notion audit / model:**

- **Multi-entity settlement** — revenue-collector & expense-payer per entity, profit
  pool, split %, intercompany transfers, per-entity cash balances. *Zero* Notion
  representation.
- **Financial Account** — cash / bank / Wise / bike-kasa / loan positions.
- **Allocation Rule** — the split and reserve logic is code-in-a-spreadsheet, nowhere
  declared as data.
- **Asset Usage Charge + fleet finance** — bike fee, amortization, IRF loan, customs.
- **Cost Estimate vs Actual Expense** — Notion has only (partial) actuals; estimates
  live in Sheets; the two are never compared.
- **Accepted-quote snapshot** — a real value with no structured home (the Notion field
  exists but is empty).
- **Supplier / rate cards** — suppliers are real and priced in Drive; Notion has none.

**Correctly external (should stay out of the canonical operational store):** the
**pricing calculation engine** (Google Sheets is the right place per ADR-0002) — but
its *inputs* (rate cards → Supplier prices) and *outputs* (quote, accepted snapshot)
belong in the model.

**Merely reports/views (not new entities):** the closeout dashboard, `Troskovi/Uplate
sumirano`, HTML calc export — these are derived views over the ledgers above.

### 5.7 Evidence-driven corrections to the draft model (§4)

The Drive evidence **confirms** that the canonical model must include these concepts
(most already exist in the Adventure OS canon — see the compatibility review):

- **Offer/Quote** as a first-class entity, carrying a **calculation reference** and an
  **accepted-quote snapshot** (canon: `Offer`). Confirmed.
- **Supplier** as an Organisation role, with **rate cards** (canon: pending `Supplier`).
  Confirmed.
- **Financial Account** (cash/bank/Wise/bike-kasa/loan) — **new**; canon has no such
  entity yet → route to global finance modelling.
- **Settlement** + **Intercompany Transfer** (canon: `Settlement`,
  `SETTLEMENT_BETWEEN_ORGANISATIONS`). Confirmed and now evidenced with real logic.
- **Allocation Rule / Revenue Allocation** (profit-share %, reserve, per-pax fee) —
  **new**; no canon entity → global open question.
- **Cost Estimate vs Actual Expense** — the model must distinguish forecast from actual.
- **Asset Usage Charge + depreciation/loan** on the Asset (bike) — **new**; extends the
  canon Asset with a finance dimension (ADR-0002 already anticipates it).
- **Trip Closeout** as a lifecycle state of TripGroup (revenue in, costs confirmed,
  settled).

These are recorded as **draft additions**; they are **not** finalized here. Where they
are already global open questions (Supplier, Settlement, Activity/VAT economics, a term
for the economic "Agency"), they must be resolved at the Adventure OS level, not inside
Multiday.

---

## Phase 1 — status

> **Business knowledge extraction:** the durable rules hidden in the spreadsheets
> are extracted and classified (Business Rule / Policy / Config / Calculation /
> Convention / Historical Decision / Workaround / Spreadsheet Implementation) in
> [`multiday-business-rules.md`](multiday-business-rules.md) — a reusable rulebook
> meant to survive replacing Google Sheets. Draft; reviewed before §4 is updated.

Phase 1 now covers **both** the Notion operational structure **and** the Google Drive /
spreadsheet processes. Against the completion criteria, we can now explain end to end:

1. **Inquiry → confirmed group** — INQUIRES/inquiry docs → Sheets calc → offer doc →
   deposit → Notion status. ✅ (reconstructed; the thread is manual, not relational)
2. **Price calculated & approved** — Sheets calc (cost build-up + agency fee + bike
   rent), with a manual quoted-price override. ✅
3. **Where accepted terms are stored** — deposit PDF + (mostly empty) Notion field;
   **no structured home**. ✅ (identified as a gap)
4. **How participants/rooms/bikes/hotels/transfers/guides are operated** — Notion DBs +
   Drive per-group folders + group-page worksheets. ✅ (with duplication)
5. **How revenue & expenses are recorded** — Notion Payments/Expenses (partial) + Drive
   settlement ledgers (authoritative for costs). ✅
6. **How internal entities share work/money/profit** — Drive settlement workbook: per-
   entity revenue/cost, 50/25/25 pool, bike-fee reserve, intercompany transfers. ✅
7. **How final settlement & closeout are calculated** — settlement delta = entitlement −
   cash held; closeout via Drive obracun. ✅
8. **Which system is authoritative for each fact** — see the source-of-truth matrix
   (§5.5). ✅

**All four deliverables + the Drive audit are complete** (Deliverables 1–5). Two gates
remain before Phase 2, and neither is workspace cleanup:

1. The **Architecture Compatibility Review**
   ([`multiday-architecture-compatibility-review.md`](multiday-architecture-compatibility-review.md))
   — already written; awaiting your acceptance.
2. **Reconciling §4** with both the canon *and* the new Drive-evidenced concepts (§5.7).
   §4 stays **draft / not approved**.

**Can Phase 1 be closed?** Discovery is complete — there is no more current-state to
find. But Phase 1's *modelling* output (§4) is not yet reconciled with (a) the existing
Adventure OS canon and (b) the multi-entity/finance concepts Drive revealed. Recommend:
close Phase 1 **discovery** now; keep Phase 1 **canonical-model** open for one
reconciliation pass (compatibility review + §5.7), then close. **Phase 2 — System Design
does not start, and no workspace, production or Drive data is modified, until you
approve.**
