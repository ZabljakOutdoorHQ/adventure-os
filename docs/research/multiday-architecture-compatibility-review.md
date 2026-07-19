# Multiday ↔ Adventure OS — Architecture Compatibility Review

> **What this is.** A repository-wide compatibility check of the *draft* Multiday
> domain model (`notion-multiday-audit.md` §4) against the **existing canonical
> Adventure OS model already defined in Git**. Multiday is **one bounded context**
> inside Adventure OS, not a standalone model.
>
> **What this is not.** Not Phase 2. Not an approved canonical model. The Multiday
> §4 draft is **not** confirmed, and none of the five flagged items are finalized
> here — several are already *global* open questions and must be resolved at the
> Adventure OS level, not locally.
>
> **Guiding principle unchanged:** business first, software second, migration
> always possible.

## Sources reviewed (Git canon)

- `docs/DOMAIN_MODEL.md` — canonical entities + key distinctions + open questions
- `docs/RELATIONSHIPS.md` — canonical relationship catalogue (verbs)
- `docs/domain/DOMAIN_LANDSCAPE.md` — domains / bounded contexts + source-system status
- `docs/decisions/0002-agency-and-activity-economics.md` (ADR-0002) — agency vs activity economics, Supplier, VAT, WeTravel
- `lib/demo/types.ts` — prototype-only UI entity kinds (explicitly **not** canonical)

---

## 1. Headline conclusion

**The repository already contains a mature canonical domain model that covers
almost every Multiday concept — usually more richly than the Notion-derived
draft.** Therefore:

- The Multiday §4 draft should be **re-expressed as a mapping onto the existing
  canonical entities and relationship verbs** — not maintained as an independent
  model. The correct modelling direction (per `DOMAIN_LANDSCAPE.md`) is
  `Reality → Domain Landscape → Canonical Entities → Relationships → Knowledge
  Graph → Source Systems`: Notion is a *source system* mapping **up** into the
  canon, never a definer of it.
- Several §4 choices **conflict** with the canon or **inherit Notion
  limitations** (§5, §6 below).
- **Most of the five flagged items are already open questions at the Adventure OS
  level** (`DOMAIN_MODEL` open Qs #6–#7; `RELATIONSHIPS` open boundaries #1–#2;
  `DOMAIN_LANDSCAPE` ADR-0002 review list). Multiday must **feed evidence into
  those global decisions**, not pre-empt them. This is exactly why pausing before
  Phase 2 was correct.

## 2. Bounded-context framing

`DOMAIN_LANDSCAPE.md` classifies **Notion as the *transitional authoritative
source* for "Multiday operations."** So Multiday is a slice of the **Operations**
domain (with spokes into Commercial, Resources, Identity, Time), scoped to a
**Season** (`2026`). It **owns almost no new entities** — it is an implementation
of global entities that already exist in the canon:

> Operations: Tour · Booking · BookingItem · **TripGroup** · Participant role ·
> **GuideAssignment** · Schedule.

ADR-0002 also already names **WeTravel** as the *future multiday bookings and
payments* source — confirming the portability requirement the design constraints
demand: the model must survive Notion → WeTravel → Adventure OS.

## 3. Terminology map (draft → canon)

| Multiday draft (§4) | Canonical term in Git | Verdict |
|---|---|---|
| **Tour** (the sold group / TOURS row) | **TripGroup** | ⚠️ **naming collision** — canon reserves *Tour* for an operational delivery/segment (`TRIP_GROUP_INCLUDES_TOUR`). The TOURS row is a **TripGroup**. `DOMAIN_MODEL` already says *"TripGroup is preferred over the ambiguous standalone term Group."* |
| **Partner** (external client) | **Agency** = role of **Organisation** (`ORGANISATION_ACTS_AS_AGENCY_FOR_TRIP_GROUP`) | ✅ reuse — but mind the **Agency double-meaning** (§4 conflict below) |
| **Traveller** | **Participant** (role of **Person**; entity when it carries room/waiver/etc.) | ✅ reuse; rename to Participant |
| **Entity (own company + treasury)** | **Organisation** (identity) + **Brand** + **Settlement** (money position) | ❌ **conflated** — see flagged item (a) |
| **ItineraryDay (+ guide)** | **Tour** / **Schedule** (Operations); guide → **GuideAssignment** | ⚠️ maps to a Tour segment + Schedule, not a new entity |
| **Accommodation** | **Accommodation** (Resources domain — already canonical) | ✅ entity exists; the **verb** is the problem — item (c) |
| **Transfer** | **Transfer** (Resources) with `TRANSFER_FROM/TO_LOCATION`, `TRANSFER_MOVES_PERSON` | ✅ reuse |
| **Payment / Expense** | **Payment / Expense** with `*_APPLIES_TO_TRIP_GROUP`, `EXPENSE_PAID_TO_ORGANISATION` | ✅ reuse |
| **Asset (Bike)** + `PARTICIPANTS.Bike` | **Asset → Bike** + **Allocation** (`ALLOCATION_TO_PERSON/TRIP_GROUP`) | ⚠️ reuse, but ADR-0002 says **bike allocation lives in Adventure Hub** — Notion should not own it |
| **Inquiry / Offer** | **Inquiry**, **Offer** (Commercial) | ✅ entities exist; the **conversion path** is the problem — item (d) |
| **Document** | **Document** | ✅ reuse |
| **Guide** (day-level, non-entity) | **GuideAssignment** (first-class entity) + **Person** | ❌ **conflict** — item (b) |
| **Program** (`"Standard 3KL 3ZB 1TV"` select) | **Adventure** / **Route** / **Schedule** | ⚠️ a select is a Notion shortcut for a product/route config |
| **Revenue Source / Status** | **Settlement** + **VATEntry** (ADR-0002) | ⚠️ bespoke reconciliation shadowing a canonical concern |
| **Season "2026"** | **Season** (Time domain) | ✅ reuse |

## 4. Shared vs Multiday-owned concepts

**Shared / global (must reuse, must not redefine):** Person, Organisation, Brand,
Agency (role), Participant, TripGroup, Tour, Schedule, GuideAssignment, Payment,
Expense, Settlement, Invoice, Inquiry, Offer, Accommodation, Transfer, Asset,
Bike, Allocation, Document, Season.

**Genuinely Multiday-owned:** effectively **none at the entity level.** What is
local is *operational surface*, which should stay as **views/implementation**
(honouring "do not over-design Notion"):

- the day-by-day operational worksheet (a view over Tour/Schedule + GuideAssignment + Accommodation + Transfer);
- the rooming worksheet (a view over Participant fields);
- season-scoped dashboards and the closeout view.

Two Notion constructs that look like entities but are **not** new concepts:

- **`Program` select** → a local shorthand for an **Adventure/Route** configuration.
- **Treasury ledger (`Current State`)** → a **Settlement**/managerial-accounting view, not an entity (item a).

## 5. Duplicate / conflicting definitions found

1. **`Group` vs `TripGroup`.** Notion names the hub *Group/TOURS* everywhere;
   canon already standardised on **TripGroup** and explicitly deprecates bare
   *Group*.
2. **`Agency` double meaning.** `DOMAIN_MODEL`, `DOMAIN_LANDSCAPE` and ADR-0002 all
   warn that *Agency* means **two** things — (1) external travel intermediary/
   client, (2) the internal **economic/cost-recovery layer** (Durmitor Adventure
   as agency charging a system fee). Multiday `AGENCIES` is meaning (1); the
   Notion own-company/treasury is closer to meaning (2). The draft blurred them.
3. **`Tour` collision.** Multiday used *Tour* for the whole sold group; canon uses
   *Tour* for an operational delivery **inside** a TripGroup.
4. **Two "company" tables → two different canon entities.** Notion `AGENCIES`
   (external) maps to **Organisation-as-Agency**; the unnamed treasury ledger maps
   to **Organisation + Settlement** (money position) — not one "Entity".
5. **Brand vs legal entity.** The draft treats *Durmitor Adventure / Sampas /
   Other Trails* as own legal entities; `DOMAIN_MODEL` explicitly classifies
   **Durmitor Adventure as a Brand** (public identity, *"not automatically a legal
   entity"*), operated by an Organisation. Identity, brand, and legal entity must
   not be merged.
6. **Code vs docs:** `lib/demo/types.ts` is prototype-only (person, organisation,
   project, booking, document, task, message, event) and states it is **not** a
   source-of-truth model. No code-level conflict — but note TripGroup, Participant,
   Payment etc. are **not yet implemented in code**; the docs are the only canon.

## 6. The five flagged items — evidence & recommended direction (NOT decisions)

### (a) Entity combined with treasury position → **split, and defer to global finance model**
Canon has **no "Entity"** concept. It has **Organisation** (legal/operational
identity), **Brand** (public identity), and **Settlement** (*"a calculated
obligation between participating companies after collections, expenses, fees and
profit-share rules"*), with `SETTLEMENT_RECONCILES_PAYMENT/EXPENSE` and
`SETTLEMENT_BETWEEN_ORGANISATIONS`. ADR-0002 goes further: the economic unit is
**Activity** (each activity is a separate economic entity even on a shared bank
account), with VAT and agency-fee views. → The Notion `Current State` ledger is a
**derived Settlement / managerial-accounting view**, not an attribute of an
entity. **Do not finalize.** This lands squarely inside ADR-0002's unresolved
finance model (Activity, VATEntry, Settlement).

### (b) Guide as a non-entity → **conflict; canon models it as GuideAssignment**
`RELATIONSHIPS.md` §"Roles versus entities": *"GuideAssignment is an entity
because it can have time, segment, responsibility, source and review status,"*
with `GUIDE_ASSIGNMENT_COVERS_TRIP_GROUP` (*"covers a multiday group or
**segment**"*) and `validFrom/validTo`. The operational reasoning behind the
Multiday decision (guides change per day and per location) is **exactly** the
case `GuideAssignment` exists to capture — a plain day-level field would *lose*
the segment/time/role metadata the canon expects. → Recommendation: keep the
day-level guide field as an **operational convenience in Notion**, but its
canonical form is a **time-bound GuideAssignment covering a TripGroup segment**.
"Non-entity" should not be finalized.

### (c) Accommodation `OPERATED_BY Entity` → **drop the verb; Accommodation itself is fine**
**Accommodation is already a canonical entity** (Resources domain), so that part
is compatible. But `OPERATED_BY Entity` is **not** a canonical verb and conflates
two distinct things: (i) the **hotel** = an **Organisation (supplier role)** the
stay is booked *with*; (ii) which **own Organisation** is *responsible/pays* =
`EXPENSE_APPLIES_TO_ORGANISATION` / a responsibility relationship. → Recommend
dropping `OPERATED_BY Entity`; model the hotel as a supplier **Organisation** and
the responsible own-company separately. Blocked on Supplier canonicalization (e).

### (d) Inquiry directly converting to TripGroup → **conflict; canon requires Offer in between**
Canon is explicit: `INQUIRY_CONVERTED_TO_OFFER` → `OFFER_CONVERTED_TO_TRIP_GROUP`
(and `OFFER_CONVERTED_TO_BOOKING`). There is **no** Inquiry→TripGroup edge. The
Notion reality already has an Offer surface (`PONUDE`), even if thin. → The §4
verb `Inquiry CONVERTS_TO TripGroup` must be corrected to the two-step canon path.

### (e) Supplier/Vendor omission → **real gap vs canon direction; defer final form**
Suppliers (transfer operators, hotels) are **Organisations in a supplier role**
(`EXPENSE_PAID_TO_ORGANISATION`). ADR-0002 and `DOMAIN_LANDSCAPE` list **Supplier**
as a pending canonical entity/role and a required Knowledge-Graph relationship
(*"Agency, Activity, Booking, Transaction, Cost, VATEntry, Asset, Supplier,
Import, Document"*). → Multiday currently hard-codes transport operators as a
`select` and hotels as text — a Notion limitation. Direction: represent them as
**Organisations (supplier)**. The final Supplier entity-vs-role decision is a
**global open question**; do not settle it inside Multiday.

## 7. Notion-inherited limitations the draft must not bake in

1. **No Person identity.** Guests, agency contacts, guides are embedded per table;
   canon requires a shared **Person** with contextual roles. A returning guest is
   currently a new row — the model would inherit duplicate identities.
2. **`Group` naming** instead of TripGroup.
3. **Guide flattened to a field** — loses GuideAssignment (segment/time/role).
4. **Bike allocation duplicated in Notion**, though ADR-0002 says allocation is an
   **Adventure Hub** capability that Adventure OS *reads*, not owns.
5. **Money position as a per-account ledger** instead of Settlement + Activity
   economics + VAT (ADR-0002).
6. **Revenue Source/Status** as a bespoke reconciliation instead of Settlement/
   VATEntry.
7. **Inquiry → Group directly**, skipping Offer.
8. **Program as one select** rather than an Adventure/Route/Schedule configuration.

## 8. Governance: route these to the Adventure OS level, not Multiday

These are already open at the global level and must be resolved there (with
Multiday supplying operational evidence), not decided inside the Notion cleanup:

- **Activity as an economic entity, VATEntry, Supplier, Import** — ADR-0002 review
  list (`DOMAIN_LANDSCAPE` Commercial; `RELATIONSHIPS` open boundary #1;
  `DOMAIN_MODEL` open Q#6).
- **A distinct term for the economic "Agency"** — `RELATIONSHIPS` #2, `DOMAIN_MODEL`
  Q#7, `DOMAIN_LANDSCAPE` Agency caution.
- **Whether Multiday TripGroup stays in Notion or moves to a dedicated store** —
  `DOMAIN_MODEL` Q#1 (and WeTravel per ADR-0002).
- **Accommodation's responsibility/ownership edges** — depend on Supplier +
  Organisation-responsibility modelling above.

## 9. Recommendation (for your review — still not Phase 2)

1. **Reframe §4** of the audit from an independent "canonical model" into a
   **bounded-context mapping**: each Multiday/Notion construct → its canonical
   entity + relationship verb, tagged `reuse` / `conflict-to-fix` /
   `open-global-question`. (This review is the raw material for that rewrite.)
2. **Correct the clear conflicts** in the draft now (naming: Group→TripGroup,
   Traveller→Participant; verb: Inquiry→Offer→TripGroup; drop `OPERATED_BY Entity`;
   Guide → GuideAssignment as the canonical form).
3. **Do not finalize** the five flagged items; log them against the existing
   global open questions (§8) so they are resolved once, for all of Adventure OS.
4. Keep Multiday-specific needs as **views/implementation**, per "don't
   over-design Notion."

**Next step:** your review of this compatibility analysis. Only after you accept
it do we decide how to revise §4 — and even then we remain in the audit/modelling
stage, **not** Phase 2 System Design, and **no** workspace or production data is
touched.
