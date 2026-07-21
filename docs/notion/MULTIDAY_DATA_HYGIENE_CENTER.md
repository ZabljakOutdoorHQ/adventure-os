# Financial Integrity Rule Pack - Notion Reference Implementation

Date: 2026-07-20

Status: Implemented in the reference workspace

Workspace: `2026 Multiday - TEST / MCP CLEANUP`

Historical implementation name: Multiday Data Hygiene Center

Notion page:
[FINANCIAL INTEGRITY - MULTIDAY](https://app.notion.com/p/3a3814d0e14181b69c17ec149c0da89b)

## Executive Summary

The Multiday workspace has an explainable Financial Integrity control layer over
the existing operational databases. The successful Data Hygiene implementation
is retained as the first reference Rule Pack for Operational Integrity. It does
not replace the databases, change financial semantics or create financial
records.

The implementation:

- validates Trip Groups, Participants, Payments, Expenses and Hotel Bookings;
- exposes source records through filtered linked views;
- preserves approved exceptions explicitly;
- separates automatic structural checks from manual business review;
- keeps all 14 Trip Groups out of financial readiness while blocker Signals are
  resolved; and
- leaves Company financial formulas and all financial source values unchanged.

The Financial Integrity Rules are defined in
[`DATA_HYGIENE_VALIDATION_SPEC.md`](DATA_HYGIENE_VALIDATION_SPEC.md). The
platform contract is defined in
[`OPERATIONAL_INTEGRITY.md`](../OPERATIONAL_INTEGRITY.md).

## Architecture Mapping

| Existing implementation | Operational Integrity meaning |
|---|---|
| Notion formulas, rollups and reviewed classifications | Deterministic Financial Integrity Rules |
| A matching validation condition | Signal |
| `Health Issues` and related exact property names | Legacy Signal presentation fields |
| Filtered linked issue views | Attention views |
| Blocker and warning counts | Signal aggregation |
| `Ready for Sign-off` checkbox | Transitional display field; not canonical readiness |

No Signal Store exists. Evaluation and Attention both remain in Notion for this
reference implementation.

The existing page was renamed to `FINANCIAL INTEGRITY - MULTIDAY`, and its
Payment, Expense and Participant section headings now use `Signals`. Database
schemas, formulas, rollups, linked views, filters and source records were not
changed.

## Before and After

| Area | Before | After |
|---|---|---|
| Overall control | Audit findings existed only in reports | One central Notion control page links directly to source records |
| Trip Group health | No consistent row-level status or reason | All 14 rows have Data Health Status, active Signal reasons, audit date and readiness display state |
| Payments | Missing relations required an external scan | Missing Company, Participant, Trip Group, method and amount views update from source fields |
| Payment exceptions | Empty Participant could not be distinguished from an error | Six group-level payments, one cancellation payment and one adjustment are explicitly classified |
| Expenses | Five ambiguous cross-group records were known only from audit | Relation-count formulas and a Multiple Trip Groups view expose all five records |
| Participants | Missing group membership and suspicious rows were not centralized | Source formulas and Attention views expose missing Trip Group, pricing and manual-review records |
| Hotels | No explicit operational-to-financial reconciliation | Hotel Bookings can reference existing Expenses without becoming a financial source |
| Financial readiness | Zero and missing input could appear equivalent | No group is ready while blocker Signals or missing completeness evidence remain |

## Verified Baseline

The post-implementation re-fetch confirmed:

- 14 Trip Groups;
- 77 Payments;
- 86 Expenses;
- 40 Hotel Bookings;
- 33 Payments without Company;
- 8 Payments without Participant;
- 0 Payments without Trip Group;
- 5 Expenses linked to two Trip Groups;
- 14 Hotel Bookings linked to one or more proven Expense records;
- 11 Hotel Bookings with an unproven corresponding Expense;
- 4 Hotel Bookings requiring a business decision;
- 9 future Hotel Bookings whose Expense review is not yet due; and
- 0 Trip Groups ready for final sign-off.

No Payment amount, Expense amount, financial relation, participant price or
Company assignment was changed.

## Health Model

The row-level status vocabulary is:

- `VERIFIED`
- `PROVISIONALLY RECONCILED`
- `NEEDS DATA`
- `RELATION ERROR`
- `FORMULA ERROR`
- `NEEDS BUSINESS DECISION`
- `FUTURE / NOT YET DUE`

Payments, Expenses, Participants and Hotel Bookings use formula-backed
deterministic Rules. Their Signals clear automatically when the underlying field
or relation is corrected.

Trip Group source blocker and warning counts update through formulas and
rollups. Canonical financial readiness is derived from the absence of blocker
Signals. `Data Health Status` and `Ready for Sign-off` remain transitional Notion
review/display fields and cannot override an active blocker. Human final sign-off
remains a separate business action.

## Properties Added

### Trip Groups

Control fields:

- `Data Health Status`
- `Health Issues`
- `Blocking Issue Count`
- `Warning Count`
- `Ready for Sign-off`
- `Last Audited`
- `Audit Notes`
- `DQ Review Outcome`
- `DQ Review Reason`
- `DQ Manual Blockers`
- `DQ Manual Warnings`
- `DQ Formula Error`

Supporting rollups:

- `DQ Payment Blockers`
- `DQ Expense Blockers`
- `DQ Participant Blockers`
- `DQ Hotel Blockers`
- `DQ Hotel Warnings`

The blocker formula combines missing Trip Group inputs, participant/PAX
conflicts, source-record blocker rollups and documented manual blockers. The
warning formula combines Hotel warnings, Program Price review/conflict states,
over-collection and documented manual warnings.

### Payments

- `DQ Exception Type`
- `Audit Notes`
- `Blocking Issue Count`
- `Health Issues`
- `Data Health Status`

The formulas detect missing Trip Group, Company, Amount, Payment Method and an
unclassified missing Participant. An approved exception removes only the
Participant blocker; it does not exempt Company or Trip Group.

### Expenses

- `Trip Group Relation Count`
- `Blocking Issue Count`
- `Health Issues`
- `Data Health Status`

The formulas detect missing or multiple Trip Groups, missing Company, missing
or zero Amount and missing Payment Method.

### Participants

- `DQ Exception Type`
- `DQ Manual Blocker`
- `Audit Notes`
- `Blocking Issue Count`
- `Health Issues`
- `Data Health Status`

The formulas detect missing identity, Trip Group, Count and Unit Price. Unit
Price may be empty only for an explicit operational-contact or approved
unpriced-role exception.

### Hotel Bookings

- `Related Expense`
- `Expense Reconciliation`
- `Audit Notes`
- `Trip Group Relation Count`
- `Blocking Issue Count`
- `Warning Count`
- `Health Issues`
- `Data Health Status`

`Related Expense` is a one-way evidence relation to an existing Expense. It
does not contribute to `Recorded Expenses`, create an Expense or copy an
operational cost into the financial chain.

### Companies

No new Company property or formula was added. The existing direct source
rollups and `Current State` formula remain unchanged.

## Attention Views

The exact Notion view names below are preserved for compatibility. Where a
heading says `Issues`, it is a historical implementation label for active
Signals, not a separate authored issue system.

### Trip Group Health

- All Groups
- Blocked
- Relation Errors
- Needs Data
- Needs Business Decision
- Provisionally Reconciled
- Verified
- Completed Groups Only

### Payment Signals (`Payment Issues` in Notion)

- Missing Company
- Missing Participant
- Missing Trip Group
- Missing Payment Method
- Zero or Invalid Amount
- Unclassified Group-level Payments
- Hub Link Payments
- Adjustments
- Ancillary Revenue

`Adjustments` and `Ancillary Revenue` are separate views so each classification
remains explicit.

### Expense Signals (`Expense Issues` in Notion)

- Multiple Trip Groups
- Missing Company
- Missing Trip Group
- Missing Amount
- Missing Expense Method
- Bank Expenses
- Cash Expenses

### Participant Signals (`Participant Issues` in Notion)

- Participant Not Linked to Trip Group
- Participant Without Valid Price
- Participant With Payment Mismatch
- Cancelled Participant in Active Value
- Duplicate or Suspicious Participants

### Hotel Reconciliation

- All Hotel Reconciliation
- Potential Hotel Booking Without Expense
- Ambiguous Hotel Reconciliation
- Hotel Relation Errors
- Future Hotel Reconciliation

## Initial Trip Group Classification

| Trip Group | Data Health Status | Primary reason |
|---|---|---|
| Blank `490814d0` | NEEDS DATA | Missing identity, dates, commercial inputs and core relations |
| MENDY 24.05-31.05 | RELATION ERROR | Legacy/current Hotel relations, missing Wulfenia Expense and unexplained EUR 2 |
| ELI 24.05-31.05 | RELATION ERROR | Legacy/current Hotel relations and missing Wulfenia Expense |
| Unnamed `759814d0` | RELATION ERROR | Unclear identity and multiple Hotel Trip Group relations |
| ELI 01.06-08.06 | NEEDS DATA | Missing Wulfenia Expense |
| Unnamed `54f814d0` | RELATION ERROR | Unclear identity, Hotel relation conflicts and missing commercial input |
| Unnamed `083814d0` | RELATION ERROR | Unclear identity, Hotel relation conflicts and missing Bianca Expense |
| TALAS 25.06-02.07 | RELATION ERROR | Dalit relation, missing Payment Companies, Hotel relation conflicts and missing Hotel Expenses |
| Ayelette 01.09-08.09 | FUTURE / NOT YET DUE | Future inquiry; final financial inputs are not yet due |
| Blank `762814d0` | NEEDS DATA | Missing identity and Trip Dates |
| MOSHE 03.06-10.06 | NEEDS BUSINESS DECISION | Program Price source conflict and missing Bianca Expense |
| Unnamed `9de814d0` | RELATION ERROR | Five Expenses are shared ambiguously with another Trip Group |
| Unnamed `993814d0` | RELATION ERROR | Five Expenses are shared ambiguously with another Trip Group |
| Udi Ganani September 2026 | RELATION ERROR | All seven Payments lack Company; Hotel Expenses are future |

Status totals after re-fetch:

- 9 `RELATION ERROR`
- 3 `NEEDS DATA`
- 1 `NEEDS BUSINESS DECISION`
- 1 `FUTURE / NOT YET DUE`
- 0 `PROVISIONALLY RECONCILED`
- 0 `VERIFIED`

## Explicit Initial Exceptions

Payments:

- six existing group-level deposit/balance records;
- Iris D retained cancellation amount; and
- Yaron/TALAS boat cash adjustment.

Participants:

- Ayelette main contact as an operational contact; and
- ELI FOC as an approved unpriced role.

These classifications do not fill missing financial relations or alter source
amounts.

## Hotel Reconciliation Result

| Status | Count |
|---|---:|
| Reconciled | 14 |
| Missing Expense | 11 |
| Needs Business Decision | 4 |
| Future / Not Yet Due | 9 |
| No Expense Required | 1 |
| Not Reviewed | 1 |

Eighteen Hotel Bookings have a `Related Expense` relation because four
ambiguous bookings retain a candidate Expense while remaining blocked for a
business decision.

## Unresolved Business Decisions

- Confirm the actual receiving Company for 33 Payments.
- Resolve ownership of five Expenses linked to two Trip Groups.
- Explain MENDY's EUR 2 over-collection.
- Provide the missing MENDY Wulfenia Expense evidence.
- Confirm MOSHE's canonical Program Price source.
- Confirm whether remaining zero-price leader/contact records are approved
  exceptions or missing commercial input.
- Resolve legacy/current duplicate Trip Group relations on Hotel Bookings.
- Provide authoritative Expenses for unmatched completed-trip Hotel Bookings.

## Architecture Questions

No new Architecture Question was introduced.

Existing questions remain relevant:

- AQ-023: distinguish confirmed zero from unknown/incomplete.
- AQ-027: allocation semantics for an Expense linked to multiple Trip Groups.
- AQ-028: treatment of overpayments, refunds, credits and negative remaining
  balances.

## Prevention Recommendations

Safe next controls:

- standard database templates that expose required relations;
- daily views for newly created incomplete records;
- controlled Payment exception types;
- controlled Hotel reconciliation states; and
- a derived readiness display after all blocker Rules are proven against the
  existing Notion outputs.

Manual judgment remains required for:

- Company assignment;
- payer versus participant treatment;
- cancellation, fee and ancillary-revenue classification;
- Hotel Booking to Expense matching;
- shared Expense allocation; and
- final financial completeness and the human sign-off action.

No automation was activated.

## Connector Notes

The connector created and re-fetched the schemas, rows, page and linked views.
The generic SQL query endpoint became unavailable during final verification,
so the source databases were re-fetched through their existing database views.
That path confirmed the persisted classifications and counts.

Notion returns several formula and rollup values as opaque references through
the connector. The Rule Pack therefore does not claim connector-level numeric
verification for those values; source records and stored status fields remain
the verification basis.
