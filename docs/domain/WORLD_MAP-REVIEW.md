# World Map v0.1 — Review

**Responds to:** `docs/domain/WORLD_MAP.md` v0.1, §13 ("Review request for Claude").
**Status:** Advisory. Nothing in this document changes `WORLD_MAP.md`,
`DOMAIN_MODEL.md`, or any other file — per §13's own instruction, this is a
focused diff proposal, not a rewrite. Boris decides what moves into v0.2.

## What was reviewed

Full text of: `docs/MASTER.md`, `docs/PROJECT_CONSTITUTION.md`,
`docs/DOMAIN_MODEL.md`, `docs/KNOWLEDGE_GRAPH.md`, `docs/SYSTEM_ARCHITECTURE.md`,
`docs/SOURCE-MAP.md`, `docs/COMPONENT-INVENTORY.md`, all three ADRs
(`docs/decisions/0001-0003`), both integration discovery docs
(`docs/integrations/adventure-hub.md`, `docs/integrations/plane.md`), the
shipped content of PR #16 (Plane Tasks in Mission Control) and PR #17
(interactive prototype), and `docs/research/outdoor-hq-architecture-review.md`
(this session's separate review of the `outdoor-hq` monorepo — cited below
wherever it independently confirms or contradicts something).

## Headline

**No conflicts with confirmed decisions.** Everything in World Map §10
("Confirmed decisions inherited") checks out against the source documents —
verified line by line below. The real findings are **gaps** (concepts the
existing docs need but World Map doesn't cover, or vice versa) and a couple
of **terminology clashes** worth resolving before they cause confusion in
code or conversation. Nothing here requires slowing down or redesigning —
these are the "minimal changes" §13 asked for.

---

## 1. Organisations and brands (§4.1)

**Gap.** World Map lists Durmitor Adventure, Wild Collective, WBATA,
DiscoverMNE, Adventure OS. Two real brands are missing:

- **XElements** — present in `MASTER.md`'s own Domains list, and a live app
  in `outdoor-hq` (`apps/xelements`). Should be in §4.1.
- **Sampas** — not mentioned anywhere in `WORLD_MAP.md` or `MASTER.md`, but
  it's a live `outdoor-hq` app (`apps/sampas`, outdoor equipment/service).
  If it's part of Boris's operating world, it belongs in §4.1; if it's
  deliberately out of scope, that should be stated rather than silent.

*Recommendation: Accept — add both, or confirm Sampas is intentionally
excluded.*

## 2. Central entities vs. `DOMAIN_MODEL.md` (§6)

Cross-checked every cluster in §6 against `DOMAIN_MODEL.md`'s entity list.

| §6 cluster | New vs. `DOMAIN_MODEL.md` | Classification |
|---|---|---|
| 6.3 Outdoor operations | `Schedule`, `Route` are new | Gap — both self-consistent with §7's time-as-dimension rule, but `Route` has no confirmed data source anywhere (see §5 below) |
| 6.5 Commercial/finance | `CostCenter` is new | Gap, but a *good* one — see §3 below |
| 6.6 Knowledge/comms | `Media` is new; `Reminder` (in `DOMAIN_MODEL.md`) is missing from §6.6 | Gap both ways — `Media` already flagged by World Map itself (§12.7); `Reminder`'s omission looks accidental, not a decision |
| 6.7 Governance | Entirely new vs. `DOMAIN_MODEL.md` (only `AuditRecord`/`AgentAction` existed) | Gap, self-flagged by World Map as "underrepresented... should be validated" — agreed, see §4 below |

Everything else in §6 (Identity, Strategy/work) maps cleanly onto existing
`DOMAIN_MODEL.md` entities with no new names introduced. No conflicts.

## 3. `CostCenter` — accept, and tie it explicitly to ADR 0002

ADR 0002 requires exactly this: *"Every transaction and cost should support
activity allocation, including an explicit `shared/unallocated` state."*
`CostCenter` is the entity that carries that state. Recommend promoting it
to `DOMAIN_MODEL.md` directly, cross-referenced from ADR 0002, rather than
leaving it as an open question (§12.5) — the need is already documented,
just not yet named as an entity.

## 4. The bigger gap ADR 0002 exposes: **Activity is missing as an economic entity**

This is the most significant finding in this review. ADR 0002 is explicit:

> *"Each activity is modeled as a separate operational and financial entity
> even when payments settle through the same legal company... Every
> transaction and cost should support activity allocation."*

It lists required relationships: *"Agency, Activity, Booking, Transaction,
Cost, VATEntry, Asset, Supplier, Import and Document."*

World Map's §6.3 only has **`ActivityType`** — a classification/category
("canyoning, rafting, hiking"), not an entity with its own P&L. There is no
`Activity` (the economic entity ADR 0002 requires), no `VATEntry`, no
`Supplier`, and no `Import` anywhere in World Map §6.

This isn't a new problem World Map created — `DOMAIN_MODEL.md` has the same
gap today. But since World Map's own stated purpose is to sit *above*
`DOMAIN_MODEL.md` and connect business reality to it, this is exactly the
kind of thing it should surface, and it currently doesn't.

*Recommendation: Gap, high priority — add `Activity` (distinct from
`ActivityType`), `VATEntry`, `Supplier`, `Import` to §6.5, cross-referenced
from ADR 0002 directly. This is the clearest "missing relationship required
by the current business model" §13 asks this review to find.*

## 5. Terminology clash: "Agency" means two different things

- **`DOMAIN_MODEL.md` / World Map §5:** Agency is *"a role/type of
  Organisation"* acting as travel intermediary for a `TripGroup` —
  external-facing, one Organisation representing a group of guests.
- **ADR 0002:** *"Durmitor Adventure is modeled as the agency and shared
  operating layer"* — an internal cost-recovery structure where Durmitor
  Adventure charges its own activities a system fee. This is Durmitor
  being the agency *over its own activities*, not intermediating for an
  external group.

Same word, two distinct, non-overlapping meanings, both in accepted
documents. This is exactly the kind of thing §9 (Relationship principles)
warns against ("relationships should be expressed as explicit verbs, not
vague lines") — worth extending that discipline to entity/role names too.

*Recommendation: Clarification, not a real conflict (both usages are
internally consistent within their own document) — but rename one. Suggest
keeping "Agency" for the `DOMAIN_MODEL.md`/booking-intermediary sense (it's
the one with an established relationship type, `TRIP_GROUP_MANAGED_BY_AGENCY`,
in `KNOWLEDGE_GRAPH.md`) and giving ADR 0002's internal-cost-layer sense a
different name — e.g. "Operating Company" or "Shared Services Layer" — when
`CostCenter` is formalized (§3).*

## 6. `GuideAssignment` and `Schedule`: no confirmed data source exists

`docs/integrations/adventure-hub.md`'s own findings (six investigated
capabilities table) are explicit: *"Guide assignments — No. Guides are not
mentioned in any of the 4 [AdventureHub] documents."* This session's
separate `outdoor-hq` research (`docs/research/outdoor-hq-architecture-review.md`
§5) independently confirms the same thing from `outdoor-hq`'s own, more
mature AdventureHub integration reference — no guide, schedule, or capacity
data exists in the documented API on either side.

World Map §6.3 lists `GuideAssignment` and `Schedule` as central entities
without flagging that neither has a confirmed source today. This isn't a
reason to remove them — the entities are still conceptually correct — but
the map should say so, matching the honesty standard `docs/PROJECT_CONSTITUTION.md`
and the integration discovery docs already hold themselves to.

*Recommendation: Clarification — add a note in §6.3 (or a shared "confirmed
source" column across §6) so nobody building against this map assumes
AdventureHub already covers guide/schedule data. It doesn't, on either side
of the company.*

## 7. `Adventure` vs. `Product` naming (§11.7, §12.2)

World Map already flags this as open (§12.2) and uses "Adventure/Product"
as a placeholder (§11.7). Two independent data points favor resolving it in
favor of **`Adventure`** alone, at least for now:

1. It's the vendor's own field name — `adventureTypeId`, `adventures[]` are
   literal AdventureHub API fields (`docs/integrations/adventure-hub.md`
   §Confirmed endpoints). Renaming introduces a translation layer for no
   functional reason.
2. `outdoor-hq`'s own production Payload CMS uses an `Adventures` collection
   (`docs/research/outdoor-hq-architecture-review.md` §7) — independent
   confirmation the business already thinks of these as "Adventures," not
   generic "Products."

The one scenario where `Product` earns its own meaning: if Sampas (§1
above) sells physical goods that aren't tours at all, "Product" could
become a real, distinct entity later — but that's speculative until Sampas
is actually in scope.

*Recommendation: Clarification → resolve now. Use `Adventure` only; revisit
`Product` if/when Sampas enters scope.*

## 8. `SOURCE-MAP.md` is out of date relative to both World Map and reality

Comparing `SOURCE-MAP.md`'s table against World Map §8's source-system list
turns up a real gap that matters today, not hypothetically:

- **Plane is missing from `SOURCE-MAP.md` entirely** — despite having its
  own discovery doc (`docs/integrations/plane.md`) and being a *merged,
  live* integration as of PR #16. This should have a row.
- World Map §8 introduces several sources `SOURCE-MAP.md` doesn't have yet:
  Slack, Viber, Zoho, WSPay/Monri, CKB and banking systems, accounting/
  fiscalisation systems, Outdooractive. ADR 0002 separately names
  **WeTravel** (future multiday bookings) — also absent from both documents.
- Conversely, `SOURCE-MAP.md` has three sources World Map §8 doesn't
  mention: Payload CMS, n8n, ChatGPT history, Local files. n8n's omission
  looks intentional and correct — `SYSTEM_ARCHITECTURE.md` §8 treats n8n as
  an automation/workflow layer, not a record source, and World Map §2
  already separates "source systems" from everything else. The other two
  look like plain gaps.

For Docmost, Documenso, and Mattermost specifically:
`docs/research/outdoor-hq-architecture-review.md` §6 found the `outdoor-hq`
tooling-server plan has **contradictory shipped-vs-not-built status**
(one doc says `status: shipped, 2026-06-19`, another says "not yet built").
`SOURCE-MAP.md`'s current notes ("Confirm adoption and ownership" /
"Sensitive access") should be updated to say explicitly that live
availability is unconfirmed, so nobody assumes these are reachable.

*Recommendation: Gap, low-risk to fix — update `SOURCE-MAP.md`'s table
(add Plane, WeTravel, and World Map §8's new sources; tighten the
Docmost/Documenso/Mattermost notes). This is the single most concrete,
low-judgment-call action item in this whole review.*

## 9. §10 sanity check — all ten claims confirmed, no conflicts

Verified each line of "Confirmed decisions inherited" against source:

| Claim | Verified against | Result |
|---|---|---|
| Control plane, not universal replacement | `SYSTEM_ARCHITECTURE.md` §Architectural intent, `PROJECT_CONSTITUTION.md` §1 | ✅ |
| Canonical IDs ≠ source-system IDs | `DOMAIN_MODEL.md` modelling rule, `KNOWLEDGE_GRAPH.md` §Identity resolution | ✅ |
| Person is identity; Participant/Customer/Guide are roles | `DOMAIN_MODEL.md` §Key distinctions | ✅ ("Guide" isn't named as explicitly as Participant/Customer — minor wording gap, not a conflict) |
| Organisation vs. Brand distinct | `DOMAIN_MODEL.md` §Key distinctions | ✅ |
| ActivityType/Adventure(Product)/Tour distinct | `DOMAIN_MODEL.md` §Key distinctions | ✅ (naming caveat per §7 above) |
| Booking vs. BookingItem distinct | `DOMAIN_MODEL.md` §Key distinctions | ✅ |
| Project vs. TripGroup distinct | `DOMAIN_MODEL.md` §Key distinctions | ✅ |
| Asset vs. EquipmentItem distinct | `DOMAIN_MODEL.md` §Key distinctions | ✅ |
| Document vs. KnowledgeRecord distinct | `DOMAIN_MODEL.md` §Key distinctions | ✅ |
| Confidence: confirmed/probable/suggested | `KNOWLEDGE_GRAPH.md` §Edge evidence (verbatim match) | ✅ |

## 10. Where World Map is already externally validated

Two places where this session's separate `outdoor-hq` research
independently confirms decisions World Map/`SYSTEM_ARCHITECTURE.md` already
made, worth knowing as reinforcement rather than treating as new work:

- **Deployment target.** `SYSTEM_ARCHITECTURE.md` §11 already says "Dokploy
  on the existing Netcup server." `outdoor-hq`'s own house rule — public
  traffic on Cloudflare edge, internal/back-office tooling on the
  self-hosted Dokploy box — independently confirms this is exactly the
  right target for an internal tool like Adventure OS
  (`docs/research/outdoor-hq-architecture-review.md` §3, §6).
- **AdventureHub's booking-only scope.** `docs/integrations/adventure-hub.md`'s
  "none of the six requested operational-reporting capabilities are
  exposed" finding is independently reproduced by `outdoor-hq`'s own,
  separately-written AdventureHub integration reference
  (`docs/research/outdoor-hq-architecture-review.md` §5) — two
  independent discovery efforts landed on the same conclusion.

## 11. PR #16 / #17 vs. World Map — no conflicts, one forward note

- PR #16's `CanonicalTask` (id, status, priority, dates, `assigneeIds[]`,
  `sourceRefs[]`) maps cleanly onto World Map's `Task` entity and
  `KNOWLEDGE_GRAPH.md`'s `PERSON_ASSIGNED_TO_TASK` edge. No conflict.
- PR #17's `DemoEntityKind` union (`person | organisation | project |
  booking | document | task | message | event`) is a deliberately reduced
  subset of World Map's full entity set — correct, since PR #17 was
  explicitly scoped as IA validation only, not domain modelling. As real
  integrations land, the natural next additions (in World Map order) are
  `TripGroup`, `Asset`, and `Payment` — Operations and Documents pages
  already gesture at concepts those would back.

*Recommendation: Future — no action now, just the growth path noted for
whoever picks up the next integration PR.*

## 12. Open questions (§12) — guidance, not final answers

Only covering the ones this review can actually inform:

- **§12.1 (Program vs. Project vs. BusinessDomain):** propose a concrete
  test — Program = durable, no end date, owns recurring allocation;
  Project = bounded outcome with an end state; BusinessDomain = a
  classification axis for reporting/filtering, not an entity at all. Needs
  Boris's confirmation, not something this review can settle alone.
- **§12.2 (Adventure/Product/ServiceProduct naming):** see §7 above —
  recommend resolving now in favor of `Adventure`.
- **§12.3 (Tour vs. TripGroup):** already answered by `DOMAIN_MODEL.md`'s
  existing `TripGroup` definition ("a multiday group operated as a coherent
  unit") — this is confirmed, not actually open; World Map v0.2 can just
  restate it.
- **§12.5 (CostCenter: entity, classification, or both):** lean toward
  "classification that is also lightly tracked as an entity for reporting,"
  given ADR 0002's explicit shared/unallocated tracking need (§3 above).
- **§12.6 (compliance objects: first-class or specialized Documents):**
  recommend specialized Documents with lifecycle metadata first — reuses
  the existing `Document` entity's `type`/`version`/`relations` fields
  rather than introducing seven new entity types at once, consistent with
  `PROJECT_CONSTITUTION.md` §3's "progressive complexity" principle.
- **§12.7 (where Media belongs):** lean Knowledge cluster, as a Document
  subtype — `outdoor-hq`'s own production Payload CMS models Media this
  way (a `Media` collection with `MediaTags`, not a separate top-level
  domain) (`docs/research/outdoor-hq-architecture-review.md` §7), which is
  a validated precedent worth following rather than inventing a new shape.
- **§12.8 (Plane: Tasks-only or also Projects/Ideas):** this duplicates
  `DOMAIN_MODEL.md`'s own existing open question #3, worded almost
  identically. Recommend consolidating so there's one tracked place for
  this, not two — otherwise the two documents will drift out of sync on
  the same unresolved question.
- **§12.10 (Durmitor-only vs. universal):** no confirmed answer, but
  `outdoor-hq`'s app separation (durmitor-adventure, deep-mne, and
  wild-collective are fully independent Astro apps/CMS instances with no
  shared booking system) suggests a reasonable default: identity/org/
  finance/knowledge clusters (§6.1, §6.5, §6.6) are universal; operational
  specifics tied to AdventureHub (§6.3's Adventure/Tour/Booking) are
  Durmitor-specific, since nothing found anywhere indicates Wild
  Collective or DiscoverMNE use AdventureHub at all.

---

## Summary for World Map v0.2

| Priority | Item | Classification |
|---|---|---|
| High | Add `Activity` (economic entity), `VATEntry`, `Supplier`, `Import` per ADR 0002 | Gap |
| High | Update `SOURCE-MAP.md`: add Plane, WeTravel, World Map's new sources; caveat Docmost/Documenso/Mattermost status | Gap |
| Medium | Resolve `Adventure` vs. `Product` naming → use `Adventure` | Clarification |
| Medium | Disambiguate "Agency" (booking intermediary vs. ADR 0002's internal cost layer) | Clarification |
| Medium | Add missing brands to §4.1 (XElements; confirm Sampas in/out of scope) | Gap |
| Medium | Flag `GuideAssignment`/`Schedule` as having no confirmed data source yet | Clarification |
| Low | Promote `CostCenter` to `DOMAIN_MODEL.md`, linked to ADR 0002 | Gap → Accept |
| Low | Add missing `Reminder` to §6.6 | Gap |
| Low | Consolidate World Map §12.8 with `DOMAIN_MODEL.md`'s open question #3 | Clarification |
| Deferred | Program, Goal/Milestone/Initiative, most governance entities beyond Waiver/Contract | Future |

Nothing above requires touching code or the existing PR history — this is
entirely a documentation-consistency pass, matching §14's own instruction to
produce "minimal changes... without redesigning the documentation structure."
