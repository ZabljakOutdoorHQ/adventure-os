# Operational Integrity Engine

> **Status:** Proposed architecture (v0.1), pending Architecture Review Board
> ratification. Governs all of Adventure OS. Decision recorded in
> [ADR-0007](decisions/0007-operational-integrity-engine.md); Constitution §3.18.
>
> **Language:** this is a canonical (technical) document — English names are stable.
> The staff-facing surface uses business language ("na šta obratiti pažnju / šta ne
> valja"); mappings live in [`UBIQUITOUS_LANGUAGE.md`](UBIQUITOUS_LANGUAGE.md).

## 1. Purpose

The product promise is one sentence: **the system always knows the next most important
thing that is wrong, incomplete, or not ready — across the whole business — so people
don't have to search for it.**

The Operational Integrity Engine (OIE) is the horizontal service that keeps that promise.
It is not a database, not a finance feature, and not a Notion artifact. It is the layer
that *evaluates reality against expectations and surfaces the gaps, ranked.*

## 2. Core concept — the Signal

The atomic unit is a **`Signal`**: a machine-detected statement that some subject
deviates from an expectation.

The defining property: **a Signal is derived, never authored.** It is a *projection of
current reality against a rule*, recomputed on every evaluation — not a ticket a human
files. Consequences:

- It **appears** the moment a rule is violated and **disappears automatically** the
  moment reality is fixed. There is no manual "close" of the underlying condition.
- Signals **cannot rot**. A stale issue list is impossible because the list is a
  recomputed view, not an inbox.
- Human decisions (acknowledge, waive) are an **overlay** attached to a signal's stable
  identity; they change presentation, never detection.

## 3. Health model

### 3.1 Signal shape (smallest accurate set)

| Field | Meaning |
|---|---|
| `subject` | canonical entity ref + `sourceRefs` (never a raw Notion URL) |
| `rule` | `ruleId` + `ruleVersion` that produced it |
| `domain` | Finance, Fleet, CRM, Website, Guides, Operations, … |
| `severity` | `blocker` · `high` · `medium` · `info` |
| `category` | `technical` or `business` (see §4) + subtype (missing-data, missing-relation, broken-rollup, reconciliation, rule-violation, overdue, expiring, duplicate…) |
| `confidence` | `confirmed` · `probable` · `suggested` (reuses the canonical relationship-confidence vocabulary) |
| `state` | `open` · `acknowledged` · `waived` · `cleared` (see §3.3) |
| `evidence` | the values that triggered it (e.g. "9 payments, €4,975, no Company") |
| `detectedAt` / `lastSeenAt` / `clearedAt` | lifecycle timestamps (age is derived) |
| `owner` | who should act (role or person) |
| `recommendedAction` | optional; human- or AI-authored |
| `waiver` | if waived: who, why, until when |

### 3.2 Severity vs confidence (two independent axes)

- **Severity** = how much it matters (does it block a gate?).
- **Confidence** = how sure detection is. Deterministic rules (missing relation, broken
  rollup) are `confirmed`; heuristic/AI rules (probable duplicate, likely misprice) are
  `probable`/`suggested`. The feed must never present a `suggested` signal as a fact.

### 3.3 Lifecycle

```
        (rule violated)                    (reality fixed)
  ─────────────────────────▶  open  ─────────────────────────▶  cleared
                               │  ▲
              human ack        │  │  reappears when
                               ▼  │  a waiver expires
                          acknowledged
                               │
              human waive      ▼
                            waived  (documented deviation: owner + reason + expiry)
```

- **Identity** = `ruleId + subject` (+ optional discriminator). The same rule on the same
  subject is the *same* signal across runs — so age, acknowledgement and waivers persist,
  and duplicates are impossible.
- **acknowledged**: a human has seen it; it stays open but drops in the feed.
- **waived**: an accepted deviation (§4). Detection still fires underneath; the signal
  leaves the action feed into an *accepted-deviations* register, and **reappears** when
  the waiver expires.
- **cleared**: recomputation no longer finds the condition. Automatic.

### 3.4 Zero vs unknown (first-class)

The engine must distinguish **confirmed zero** from **no data entered yet**. "Expenses =
0" because a trip genuinely had none is different from "0 because nothing was recorded".
The former is healthy; the latter is a `missing-data` signal. This is a modeling
requirement, not a display nicety (it is Codex's open AQ-023).

### 3.5 Readiness gates (derived, not asserted)

Health of any subject (or the whole workspace) is a rollup of its open signals. A
**readiness gate** is defined as *the absence of open `blocker` signals in a named rule
set*. Example: **"TripGroup ready for financial sign-off"** = no open finance-blocker
signals for that trip. Sign-off becomes a **computed state**, not a manual checkbox —
which is exactly why "no Trip Group is ready for sign-off" is today a *fact the engine
should assert*, not a human guess.

## 4. Validation model — technical vs business

| | Technical validation | Business validation |
|---|---|---|
| Question | Is the structure mechanically correct? | Does reality meet a business expectation? |
| Examples | missing relation, broken/misconfigured rollup, orphan record, null required field | confirmed trip should have expenses before sign-off; Program Price must equal accepted quote; guide on a tour needs a valid licence |
| Determinism | deterministic, `confirmed` | often policy-based; may have legitimate exceptions |
| Waivable? | generally **no** — fix it | **yes** — via a documented waiver |
| Source | universal engine invariants | a rule pack citing an ADR / rulebook rule |

**Business exception / intentional override / documented deviation** are one mechanism:
the **waiver**. The rule still fires (reality still deviates), but a human records *owner
+ reason + expiry*, moving it from "action needed" to "accepted deviation". This keeps a
crucial invariant: **the engine never deletes a true signal; a human can only annotate
it.** No override can make reality lie.

Rules are **versioned and sourced**: each rule cites the business rule / ADR it enforces.
Changing a business rule is a rule-version change, not a hidden code edit — traceability,
per "one fact one home".

## 5. Module contract — how domains plug in

The engine core is domain-agnostic. Each vertical (Finance, Fleet, CRM, Website,
Marketing, HR, Documents, Assets, Bookings) contributes a **rule pack** — it does **not**
build its own issue system.

A **Rule** declares:

| Field | Meaning |
|---|---|
| `id`, `version` | stable identity + version |
| `domain`, `subjectType` | what it evaluates |
| `severity`, `category`, `confidence`, `waivable` | classification |
| `predicate` | how to evaluate a subject (pure function over canonical data) |
| `evidence` | how to extract the triggering values |
| `recommendedAction` | optional template |
| `source` | the ADR / rulebook rule it enforces |

The engine: loads rule packs → runs predicates over canonical subjects → manages signal
lifecycle → exposes signals + readiness rollups. **A new domain = a new rule pack + its
subject types; zero change to the engine core.** That is what makes this a platform, not
a feature.

Illustrative rule packs (not a build list):

- **Finance:** payment without company; expense on two trip groups; program-price ≠
  accepted-quote; no expenses before sign-off; unattributed cash.
- **Fleet:** service overdue; battery cycle exceeded; duplicate bike ID; bike allocated
  to two trips.
- **Guides:** expired licence; missing contract; unassigned day/segment.
- **Website:** missing SEO; broken link; missing translation.
- **Operations:** missing GPX; missing waiver; missing meeting point.
- **CRM:** missing contact detail; overdue follow-up.

## 6. AI interaction

AI is a **consumer and enhancer** of the signal system, never its source of truth. The
deterministic core must be trustworthy without a model being right (Constitution §3.10).

| Level | AI role | Authority |
|---|---|---|
| 0 — Detect | none; deterministic rules run without AI | — |
| 1 — Explain | plain-language explanation + consequence of a signal | read |
| 2 — Prioritize | rank the feed by impact/urgency/effort — the "next most important thing", across domains | recommend |
| 3 — Recommend | propose the concrete fix + evidence + preview | recommend |
| 4 — Act | execute the fix | **only with explicit human approval + audit + rollback** |

AI may also **propose new rules** (patterns humans haven't encoded), but a human ratifies
a rule before it becomes active — rules are policy.

## 7. Boundaries & fragility (introduce now)

Where this architecture could become fragile or Notion-specific, and the boundary that
prevents it:

1. **Notion-as-engine (biggest risk).** Integrity logic as Notion rollups/formulas is
   opaque, unversioned and Notion-locked (the connector can't even read formula values).
   **Boundary:** the engine reads sources via adapters and computes signals in code,
   storing them in its **own signal store**. Notion may display signals; it never
   computes or owns them.
2. **Rules as hidden code.** **Boundary:** rules are declarative, versioned and sourced;
   start in code but keep the definition data-shaped and cite their origin.
3. **Signal store coupling.** **Boundary:** signals live in a neutral store, not in
   Notion; Notion is one optional display surface.
4. **Zero vs unknown.** **Boundary:** modeled explicitly (§3.4).
5. **Alert fatigue.** Many low signals bury the important one. **Boundary:** severity +
   confidence + readiness gates + muting/waivers; the feed's job is the *one* next thing,
   so ranking and suppression are core, not optional.
6. **Rule sprawl / contradiction.** **Boundary:** a rule registry with provenance; each
   rule has one home and cites its source.
7. **Notion identity creep.** **Boundary:** subjects are addressed by canonical entity +
   `sourceRefs`, never a raw Notion URL — adapters translate.

## 8. Canonical architecture (five-year view)

```
  6  Experience        Mission Control "Attention" feed · per-entity health · dashboards
                       ("what is wrong / what is next")
  5  AI layer          explain · prioritize · recommend · act-with-approval
  4  Integrity Engine  rule registry (per-module rule packs) · evaluator ·
                       signal store · lifecycle · readiness/health rollups   ← the durable core
  3  Canonical model   DOMAIN_MODEL entities + relationships (shared truth)
  2  Adapters          read-only first; map source records → canonical entities + sourceRefs
  1  Sources           Notion (now) · Hub · Drive · Zoho · WeTravel · Postgres (later)
```

Each vertical module is a **rule pack + subject types** plugged into layer 4, reading via
layers 2–3. The engine and the product promise are the durable core; **Notion is a
swappable source at layer 1**, not the architecture.

## 9. Relationship to the existing product

This is continuity, not a new app: Mission Control already has an **Attention** section
and a `WaitingForMe` pattern (repo `components/shell`, `lib/tasks`). The OIE is the
general engine those surfaces were reaching toward — the Attention feed becomes the
prioritized signal feed; per-entity panels show that entity's health.

## 10. Rollout posture

- **Now:** Codex's finance work continues, reframed as the **first rule pack** of the
  OIE, with the boundary that the *engine and signal store live outside Notion* even if
  the first evaluation reads Notion and the first display is in Notion.
- **Next:** extract the evaluator + signal store as a neutral service; add a second rule
  pack (fleet or guides) to prove the plug-in contract.
- Documentation trails implementation by one sprint (Constitution §3.17); this spec is
  the target, refined as the engine is built.
