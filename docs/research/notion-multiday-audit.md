# Multiday 2026 — Workspace Audit (Phase 1)

> **Mission.** The objective is **not** to optimize Notion. The objective is to
> **document the business model** so that Notion becomes only *one*
> implementation of that model, and Adventure OS can later become another.
>
> **Phase:** 1 — Audit. We are *not* migrating, merging, or modifying anything.
> This document is read-only findings + a first draft of the canonical model.
>
> **Privacy:** no client/agency names, guide or supplier names, payment amounts,
> or Notion IDs appear here. Only *structure* and *aggregate* counts.

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
  and as a relation table (`Company`) used by Payments and Expenses. **The
  business runs under multiple own entities** — the model must be multi-entity.
- **Payer/account** — who physically paid an expense (`Expenses.Paid by`).

### 1.6 Inconsistent relation naming (schema hygiene)

The *same* TOURS relation is named differently in every table: `GROUPS 1`
(Agencies), `Tour` (Hotel Bookings, Expenses), `Group` (Participants, Payments,
Transfers), `Payments ` (trailing space, on TOURS), `👥 PARTICIPANTS` (emoji in
the property name). Phase 2 must define **one naming convention**.

### 1.7 Inbound pipeline

`2026 INQUIRES` is a **free-form page with a Markdown table** (~15 tour-operator
leads: dates, pax range, program, calc link, prices), plus a few loose embedded
mini-databases (a finance/dates grid, a calendar) and inline to-do checklists.
It is **not a real database** and carries **no relation** to TOURS. `PONUDE`
(offers) is a further, separate quote surface. Both are duplicated across the two
universes.

### 1.8 To finish the inventory (open)

- The `Company` (68e8…) table contents — confirm it is the own-entity/account
  register.
- The INQUIRES embedded mini-DBs (finance/dates grid, calendar) and `PONUDE` —
  schema + role.
- Legacy-year databases (2023/24/25) — enough to define an archive boundary.
- Per-group page anatomy — which of the 10 standard sections each page has, to
  quantify inconsistency (P7).

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

This is the point of the whole exercise: describe the business, not the tool.
Notion (today) and Adventure OS (later) are both just implementations of this.

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

### 4.4 How this maps to today and tomorrow

The same model expresses cleanly in both worlds — which is exactly why the
business model, not the Notion layout, is the deliverable:

| Canonical entity | Notion (this season) | Adventure OS (later) |
|---|---|---|
| TripGroup | TOURS row | TripGroup aggregate |
| Partner | AGENCIES | Company/Partner |
| Entity (own company) | `Company` table + Hotel `Entity/Company` select | Entity / org unit |
| Participant | PARTICIPANTS (rooming inline) | Participant |
| ItineraryDay (+ guide) | *Day-by-day table (to add)* | ItineraryDay |
| Accommodation | HOTEL BOOKINGS | Accommodation |
| Transfer | TRANSFERS | Logistics |
| Payment / Expense | PAYMENTS / EXPENSES | Payment / Cost |
| Asset | bikes | Asset |
| Inquiry | INQUIRES *(promote to DB)* | Lead |
| Document | *(to add: Drive link + status)* | Document |
| *(dropped)* | ~~Room Allocations~~ | — (rooming lives on Participant) |

---

## What remains to complete Phase 1

1. Finish the inventory (§1.8): confirm the `Company` table, the INQUIRES/PONUDE
   mini-DBs, legacy-year DBs, and per-group page anatomy.
2. Confirm the canonical model draft (§4) against how the business actually
   operates — corrections welcome; this is a draft.
3. Only then move to **Phase 2 — System Design** (canonical Notion schema,
   naming/templates/rules, migration + rollback plan). No structural change
   happens before that plan is approved.
