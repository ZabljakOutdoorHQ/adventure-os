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

## Phase 1 — status: complete

All four Phase-1 deliverables are done and captured above:

- ✅ **Workspace Inventory** (§Deliverable 1) — both universes, all core DBs, the
  treasury ledger, inquiries/offers, group-page template, legacy boundary.
- ✅ **Relationship Map** (§Deliverable 2).
- ✅ **Data Quality Report** (§Deliverable 3).
- ✅ **Canonical Business Model, draft** (§Deliverable 4) — Notion-independent,
  expressed as business concept → current → future.

**Workspace discovery is accepted as complete.** The one remaining gate before
Phase 2 is **not** sign-off on §4 (which is explicitly *not* approved). It is the
**Architecture Compatibility Review** —
[`multiday-architecture-compatibility-review.md`](multiday-architecture-compatibility-review.md)
— which checks this bounded context against the canonical Adventure OS model
already in Git. §4 will be reframed as a mapping onto that canon after the review
is accepted. **Phase 2 — System Design does not start until then, and no
workspace or production data is touched.**
