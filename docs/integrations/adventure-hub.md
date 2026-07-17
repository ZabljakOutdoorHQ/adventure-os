# Adventure Hub — Read-Only Integration Discovery

## Status

**Discovery only. No integration is live.** This document synthesizes four
source documents supplied on 2026-07-17 (listed below) plus one session
constraint discovered while writing it. Nothing here was independently
re-verified against a live endpoint by this session — this environment's
outbound network policy blocks `api.adventurehub.tech` (`403` at the proxy
layer; see [Session constraints](#session-constraints)). Every claim below is
attributed to a source document, not to this session's own testing, per the
Constitution's rule that an AI summary is not a fact merely because it is
written confidently.

## Source documents

| # | Document | Nature | Confidence |
|---|---|---|---|
| 1 | `API documentation.docx` | Vendor (AdventureHub) API reference | Documented contract |
| 2 | `Booking modal docs.pdf` | Durmitor frontend developer documentation (reverse-engineered from the current Angular→vanilla-JS booking modal) | Documented client behaviour, not vendor-confirmed |
| 3 | `FINDINGSANDQUESTIONS.md` | Durmitor client-team empirical test log against both environments, plus open questions addressed to the AdventureHub team | Empirically tested, dated, includes explicit "not yet verified" callouts |
| 4 | `Email documentation.pdf` | Durmitor documentation of AdventureHub's guest-facing transactional emails | Documented observation of email templates |

None of these documents were authored by AdventureHub confirming a
*reporting* contract — all four describe the public/anonymous **booking**
surface (catalog read → price calc → booking submit) and the guest
communication that follows it.

## Environments

| Environment | Base URL | Status | Source |
|---|---|---|---|
| Production | `https://api.adventurehub.tech` | Active, empirically tested | Doc 3 |
| Staging | `https://be.adventurehub.test.softelm.com` | Active, empirically tested | Doc 3 |

**Not confirmed:** whether staging writes to an isolated database or shares
the production database. Doc 3 found staging and production `GET
/api/modal?season=summer` responses byte-identical except
`slot.availableDates[].availableFromMonth` (staging `5`, production `6`),
which the client team explicitly flags as inconclusive — it could mean a
shared seed source, a periodic dump, or a shared live database. **This
adapter must not be pointed at staging for anything beyond read calls until
AdventureHub confirms database isolation** (Doc 3, §6.7).

## Authentication

- `POST /api/tokens` issues an **anonymous** JWT — no client secret, API key,
  or credentials are involved (Doc 1, Doc 3).
- Response shape per Doc 1: `{ "accessToken": string, "refreshToken": string }`.
- Doc 3 (empirical): token TTL ≈ 10 minutes, role `EndUser`.
- **Not documented:** the refresh-token exchange endpoint/flow. `refreshToken`
  is returned but no document describes how to redeem it. Doc 3's own client
  implementation just re-requests a fresh token from a Worker-side cache
  rather than using refresh.
- **Not documented:** rate-limit behavior on `POST /api/tokens` — open
  question in Doc 3 (§8.7.1), unanswered as of this document's sources.

Because auth is anonymous, **no secret needs to be committed or configured**
for the read surface this PR implements — only a base URL.

## Confirmed endpoints (read surface)

### `GET /api/modal`

- Purpose (Doc 1): "Returns all active adventures and their dependent data
  required for display on the modal."
- Auth: Bearer token.
- Query params: `season` (optional, `summer` | `winter`; omitted returns both).
- Response (Doc 1, shape confirmed in Doc 3): array of adventure-type groups,
  each containing `adventures[]` with `id`, `name`, `description`, `price`,
  `adventureTypeId`, `active`, `timeLimit`, `isPickupLocationEnabled`,
  `meetingPoints[]` (`id`, `name`), `slots[]` (`id`, `time`, `active`,
  `availableDates[]` with `availableFromMonth/Day`, `availableToMonth/Day`).
- Doc 3 confirms **11 adventure types** exist in the current catalogue
  (`adventureTypeId` 1–9, 12, 13 — Canyoning, Paragliding, Rafting, ZipLine,
  eBikes, Horse riding, Via ferrata, Hiking, Rock climbing, Packraft, Picnic
  Experience).
- **Confirmed absent** (Doc 3, empirical): no capacity field of any kind.
  No `remainingCapacity`, no `maxPerBooking`, no `available` boolean. The
  only availability signal is the seasonal date mask and `slot.active`.

### `GET /api/modal/total-price`

- Purpose (Doc 1): price preview as guest count / discount code change.
- Auth: Bearer token.
- Query params: `adventureIds` (repeated), `numberOfGuests` (repeated,
  positional to `adventureIds`), `discountCodeName` (optional).
- Response (Doc 1): `{ name, amount, isValid, subtotalPrice, totalPrice }`.
- **Documentation conflict (unresolved):** Doc 1 documents HTTP `422` for an
  invalid discount code. Doc 3 (empirical) observed HTTP `200` with
  `isValid: false` in the body instead. Doc 3 treats this as the *better*
  behavior and proposes updating the vendor doc, not changing it — but it
  means an adapter must not assume `422` means "invalid code."
- **Confirmed defect** (Doc 3, §2.3): an invalid `adventureIds` value returns
  HTTP `500` with an unformatted string body, not a structured `400`.

### `POST /api/modal/booking` — documented for context only, **not implemented**

Write operation. Included here only because it's the one endpoint that
reveals what happens to a booking after creation (relevant to the "missing"
findings below) — this PR does not implement or call it, per the read-only
constraint.

- Two of eleven adventure types (Rafting, ZipLine) return a real
  `paymentUrl` pointing at WSPay; the other nine return `paymentUrl: ""`
  (Doc 3, empirical, all 11 types tested).
- **Documentation conflict (unresolved):** Doc 2 (booking modal frontend doc)
  states Rafting, ZipLine, **and PackRaft** trigger the deposit-payment
  redirect. Doc 1 (vendor doc) and Doc 3 (empirical test, all 11 types) both
  say only Rafting and ZipLine do — Doc 3 explicitly recorded Packraft
  (`adventureTypeId=12`) as HTTP `200` with `paymentUrl: ""`. **This is a
  direct contradiction between two source documents; it is not resolved
  here and must not be guessed either way.**
- Guests without a `paymentUrl` enter a status that is never exposed to the
  caller (see [Booking status](#5-booking-status) below) — Doc 4 (email doc)
  is the only evidence any status exists at all, and it's observed only as
  the content of guest-facing emails, never as an API response.

## The six investigated capabilities

| Capability | Available via documented API? | Evidence |
|---|---|---|
| Bookings by date (listing/retrieval) | **No** | No retrieval/listing endpoint exists in any of the 4 documents. `POST /api/modal/booking` is create-only, fire-and-forget from the caller's perspective. |
| Activities/tours by date | **Partial** | `GET /api/modal` returns a seasonal *catalogue* (which adventure types run in which month/day range, per slot) — not a per-date operational schedule or instance list. There is no "what's running on 2026-08-20" endpoint. |
| Guest counts | **No** | `numberOfGuests` is an *input* to price/booking calls, never a retrievable aggregate. No reporting endpoint returns guest counts for existing bookings. |
| Booking status | **No** | Doc 4 confirms internal statuses exist (`Requested` → `Accepted`/`Rejected`, auto-accepted for Rafting/ZipLine) — but they are communicated exclusively via guest email, never via an API response. No status-by-ID or status-by-date endpoint is documented anywhere. |
| Guide assignments | **No** | Guides are not mentioned in any of the 4 documents — no field, no endpoint, no reference. |
| Payment status | **No** | Payment happens via WSPay redirect; Doc 4 confirms a "payment confirmation" email is sent after WSPay completes (implying AdventureHub receives a WSPay server-side callback), but no document describes an API for querying payment status. WSPay's redirect is the only visible signal, and it's visible to the guest's browser, not to a server-side caller. |

**Bottom line: none of the six requested operational-reporting capabilities
are exposed by the current documented API.** The current API is exclusively
a public, anonymous **booking-creation** surface (catalog read → price
calc → booking submit), not an operational or reporting API. This matches
and now concretely confirms what `docs/MCP_INTEGRATIONS.md` and ADR 0002
already flagged as an open risk before this discovery.

## Missing / undocumented operational endpoints

Explicit list, all "no document among the four supplied describes this":

- Booking retrieval by ID, date range, or guest.
- Booking status query (current state, history, or transitions).
- Guide/staff assignment data, in any form.
- Payment/transaction status query (beyond the WSPay redirect itself).
- Capacity or remaining-slot data of any kind (`GET /api/modal` explicitly
  lacks it — Doc 3, §1 and §3.2, which also proposes the shape AdventureHub
  would need to add).
- Cancellation, refund, or booking-modification endpoints.
- Any revenue, settlement, or financial reporting endpoint (relevant to ADR
  0002's activity-economics model — nothing here supports it yet).
- Voucher/gift-trip endpoints (Doc 3, §6.9 — confirmed not to exist; a
  proposed contract is sketched but unbuilt).
- Refresh-token redemption endpoint (token shape includes `refreshToken` but
  no endpoint to use it is documented).
- Availability-with-`ETag` polling endpoint (proposed in Doc 3 §6.2, not
  built).

## Known documentation conflicts (unresolved, flagged not guessed)

1. **Packraft deposit behavior** — Doc 2 says PackRaft redirects to deposit
   payment like Rafting/ZipLine; Doc 1 and Doc 3's empirical test both say it
   doesn't. Needs a follow-up question to AdventureHub, not an assumption.
2. **Discount-code error status** — Doc 1 documents HTTP `422`; Doc 3 observed
   HTTP `200` with `isValid: false`. Doc 3 recommends updating Doc 1, which
   this document treats as the working assumption for the adapter (handle
   `isValid` in the body; do not treat `422` as the only "invalid" signal).
3. **Error response format** — Doc 3 (§3.1) documents three different error
   body shapes returned by the API depending on the failure (structured
   `problem+json`, unformatted plain text, and an unformatted `500`). Any
   adapter error handling must not assume a single consistent shape.

## Session constraints

- This session has **no credentials, no authenticated Hub UI access, and no
  browser extension** connected to any AdventureHub session. A request to
  browse the authenticated admin UI directly was not possible from this
  environment for that reason.
- This session's outbound network policy explicitly denies connections to
  `api.adventurehub.tech` (`CONNECT` rejected with `403` at the proxy layer,
  confirmed via `$HTTPS_PROXY/__agentproxy/status`). Because authentication
  is anonymous (no secret required), this session attempted a live read-only
  reverification (`POST /api/tokens` + `GET /api/modal`, identical to the
  smoke test this PR adds) before concluding this — it was blocked by
  environment policy, not by missing credentials. **This document has not
  been independently re-verified against a live endpoint.** The smoke-test
  script added by this PR (`scripts/adventure-hub-smoke.ts`) is written so
  that it *can* be run from an environment with real egress (a developer
  machine or a CI runner with outbound access) to close that gap.

## What this PR implements

- `lib/adapters/adventure-hub/types.ts` — TypeScript types for the two
  confirmed read responses (`GET /api/modal`, `GET /api/modal/total-price`),
  each field commented with its source document.
- `lib/adapters/adventure-hub/client.ts` — a minimal fetch-based client with
  three methods: `getToken()`, `getCatalog(season?)`, `getTotalPrice(...)`.
  No booking-creation method exists. No payment call exists.
- `.env.example` — `ADVENTURE_HUB_BASE_URL` and `ADVENTURE_HUB_ENV`
  placeholders only. No secret variable, because none is required.
- `scripts/adventure-hub-smoke.ts` — authenticates, then makes one `GET
  /api/modal` call, and checks the response is well-formed. Not wired into
  CI (see script header comment for why) since it depends on real network
  egress to a third-party production host, which this repository's CI
  environment may not have and should not depend on.
- **Not connected to Mission Control or any other page** — per the brief,
  this PR stops at the adapter foundation.

## Next steps (not part of this PR)

1. Ask AdventureHub to resolve the two flagged conflicts (Packraft deposit
   behavior; discount-code status code) and confirm staging database
   isolation before staging is used in any CI smoke test.
2. Get an explicit answer to ADR 0002's "Hub audit requirement" — none of
   the four supplied documents constitute the read-only API expansion,
   database export, or structured walkthrough that ADR 0002 calls for
   specifically for the *financial/operational* model (activity-level
   revenue, guide assignment, capacity). This discovery closes the booking-
   creation-surface question; it does not close the operational-reporting
   question, because the answer is "that surface doesn't exist yet."
3. Run `scripts/adventure-hub-smoke.ts` from an environment with real
   network egress to confirm this document against the live API before
   anything depends on it.
