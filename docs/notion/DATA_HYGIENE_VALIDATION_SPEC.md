# Multiday Data Hygiene Validation Specification

Date: 2026-07-20

Status: Reference implementation specification

Scope: `2026 Multiday - TEST / MCP CLEANUP` in the WORK Notion workspace

## Purpose

This specification defines the explainable validation rules used by the
Multiday Data Hygiene Center. It is a control layer over the existing Notion
reference implementation. It does not define new canonical entities, financial
semantics or operational workflows.

The underlying Notion record remains the source to repair. A detected issue
must disappear when that source record satisfies the rule. Manual business
judgment remains explicit and must not be replaced by inferred values.

## Severity

### BLOCKER

A record cannot be financially signed off or trusted for downstream
calculation. Examples include a missing required relation, ambiguous financial
allocation, invalid amount, unresolved formula failure or missing completed-trip
cost.

### WARNING

The record is usable for current operational work, but data is incomplete,
unconfirmed or likely to need attention before the next lifecycle stage.

### INFORMATIONAL

The condition is expected, approved or not yet due. It remains visible so that
an exception is not mistaken for silently complete data.

## Health Status

The row-level status vocabulary is:

- `VERIFIED`: no blocking or warning issues remain and sign-off was explicitly
  reviewed.
- `PROVISIONALLY RECONCILED`: source arithmetic reconciles, but completeness or
  final business review is not proven.
- `NEEDS DATA`: one or more required facts are missing.
- `RELATION ERROR`: a required relation is missing, inconsistent or ambiguous.
- `FORMULA ERROR`: a derived field is proven to disagree with valid source
  records.
- `NEEDS BUSINESS DECISION`: source facts exist, but their treatment cannot be
  determined from approved rules.
- `FUTURE / NOT YET DUE`: missing operational or financial facts are expected
  because the record has not reached the relevant lifecycle stage.

Status precedence when several issues exist:

1. `RELATION ERROR`
2. `FORMULA ERROR`
3. `NEEDS BUSINESS DECISION`
4. `NEEDS DATA`
5. `FUTURE / NOT YET DUE`
6. `PROVISIONALLY RECONCILED`
7. `VERIFIED`

`Ready for Sign-off` is true only when:

- blocking issue count is zero;
- warning count is zero;
- required financial inputs have been explicitly reviewed as complete; and
- the health status is `VERIFIED`.

An arithmetic result alone cannot set `Ready for Sign-off`.

## Common Audit Fields

The control layer may use these fields where needed:

- `Data Health Status`
- `Health Issues`
- `Blocking Issue Count`
- `Warning Count`
- `Ready for Sign-off`
- `Last Audited`
- `Audit Notes`

Automatically detectable issues should use formulas or rollups. Business
exceptions, completeness decisions and source explanations belong in
`Audit Notes` or a dedicated audit record. A manual note must not override an
active automatic blocker without an explicit approved exception.

## Trip Groups

### Required fields

- `Trip Group`
- `Trip Dates` once the group is beyond inquiry
- `Status`
- `Program Price Source`
- `Program Price Status`
- `Program Price` before commercial confirmation or collection
- `PAX Total` before operational confirmation

### Required relations

- at least one `Participant` before confirmation;
- every Payment that belongs to the group must point back to the Trip Group;
- every Expense that belongs to the group must point back to the Trip Group;
- operational Hotel Bookings must point to the Trip Group.

### Valid exceptions

- inquiry and future groups may have incomplete participants, payments,
  expenses and hotels;
- a record marked `Ignore` remains visible as informational and is excluded
  from sign-off only when the reason is documented;
- Hotel Bookings for future groups may have no Expense because a cost may not
  yet have been incurred or proven.

### Blocking states

- confirmed or completed group with no Participants;
- participant relation count conflicts with approved PAX and no explanation;
- Program Price is missing or has status `Conflict` when collection has begun;
- completed group with outstanding collection and no documented explanation;
- Expense relation is ambiguous or a source Expense is omitted from the group;
- completed group has a confirmed Hotel Booking whose corresponding Expense
  has not been reviewed;
- source Payment or Expense totals disagree with displayed rollups;
- a proven formula error affects a financial result.

### Warning states

- Program Price status is `Needs review`;
- Program Price differs from Accepted Quote Total;
- Collected Revenue exceeds Program Price;
- future group has incomplete commercial or operational data;
- Hotel Booking/Expense reconciliation has not yet been performed;
- payment or expense completeness is unknown.

### Informational states

- a future group is not yet expected to have final payments or expenses;
- an explicitly ignored source record is retained for provenance;
- Profit remains provisional until expense completeness is reviewed.

## Participants

### Required fields

- `Full Name`
- positive `Count`
- `Unit Price` for an active priced participant

### Required relations

- exactly one active Trip Group in the current Multiday implementation;
- all participant Payments must point to the same Trip Group.

### Valid exceptions

- an operational contact may have no Unit Price when explicitly documented as
  not being a priced participant;
- a cancelled participant may retain historical Payment evidence when the
  cancellation and commercial treatment are documented.

### Blocking states

- participant is referenced by a Payment for one Trip Group but is not related
  to that Trip Group;
- active participant has no Trip Group;
- active priced participant has zero or missing Count or Unit Price;
- cancelled participant remains in active Program Price without an approved
  retained-price explanation.

### Warning states

- Amount Due differs from the documented commercial treatment;
- participant Payment total cannot be matched to the expected participant
  amount;
- duplicate or suspicious identity requires human review;
- room or bike data is missing when operationally due.

### Informational states

- future bike size, room detail or balance payment is not yet due.

## Payments

### Required fields

- `Name`
- non-zero `Amount`
- `Payment Method`

### Required relations

- exactly one Trip Group;
- exactly one receiving Company unless an explicitly approved exception exists;
- a Participant for participant-level Program Revenue.

### Valid exceptions

- Participant may be empty for an explicitly documented group-level,
  ancillary, cancellation, processing-fee or adjustment Payment;
- a non-zero negative adjustment may exist only when its reason and related
  commercial object are documented.

### Blocking states

- missing Trip Group;
- missing Company without an approved exception;
- zero or missing Amount;
- missing Payment Method;
- Participant missing and no approved group-level classification;
- Participant and Payment point to different Trip Groups;
- duplicate Payment contributes twice.

### Warning states

- Participant is empty but a documented classification is still awaiting
  approval;
- payer differs from Participant but the source schema cannot represent payer
  separately;
- Payment classification is carried only in free text;
- Payment Method is `Hub link` and the Company relation has not been checked.

### Informational states

- `Hub link` is a valid distinct Payment Method and contributes to Company
  `Payments TOTAL` through the all-method direct rollup;
- an approved cancellation deposit remains collected revenue when supported by
  the commercial decision;
- approved ancillary or group-level Payments remain visible without inventing
  a Participant.

## Expenses

### Required fields

- `Expense`
- non-zero `Amount`
- `Payment Method`

### Required relations

- exactly one paying Company;
- normally exactly one Trip Group.

### Valid exceptions

- an Expense outside Trip Group operations may omit Trip Group only when the
  supported Project or Organisation context is explicit;
- a cross-group Expense cannot be treated as valid merely because two Trip
  Groups are related. It requires an approved allocation decision.

### Blocking states

- missing Company;
- missing Trip Group without documented non-group context;
- more than one Trip Group without approved allocation;
- zero or missing Amount;
- missing Payment Method;
- duplicate inclusion in group totals;
- archived or ignored source record unexpectedly contributes to an active
  group.

### Warning states

- missing Category;
- Date is missing where payment timing matters;
- hotel Expense cannot be matched to the operational Hotel Booking;
- Company or Trip Group assignment requires source confirmation.

### Informational states

- Cash, Bank and Wise are method-specific reporting dimensions;
- an Expense remains the sole financial cost source even when an operational
  Hotel Booking contains a cost estimate.

## Hotel Bookings

### Required fields

- `Hotel Name`
- Trip Group
- Check-in Date
- Check-out Date
- Status

### Required relations

- exactly one Trip Group;
- a corresponding Expense reference or explicit reconciliation explanation
  once a completed/financially due booking has a proven cost.

### Valid exceptions

- inquiry, option, cancelled and future bookings may not yet have an Expense;
- self-booked accommodation may have no Company Expense when that commercial
  treatment is explicitly documented;
- Total Cost may remain empty until authoritative cost evidence exists.

### Blocking states

- missing Trip Group;
- confirmed completed-trip booking has no corresponding Expense and no approved
  explanation;
- a related Expense points to another Trip Group;
- a cost is copied into financial totals without an Expense record.

### Warning states

- confirmed booking has no Expense review;
- payment status, confirmation evidence or expected cost is missing when
  operationally due;
- hotel name matching is ambiguous.

### Informational states

- operational Total Cost does not contribute to Recorded Expenses;
- future booking costs remain unknown rather than confirmed zero.

## Companies

### Required fields

- `Name`

### Required relations

- every Payment received by the Company must use the reciprocal Payments
  relation;
- every Expense paid by the Company must use the reciprocal Expenses relation.

### Valid exceptions

- a Company may have no Payments or no Expenses when source records confirm
  that position;
- method-specific totals may be zero even when the all-method total is non-zero.

### Blocking states

- Payment or Expense source record names the Company but lacks the relation;
- reciprocal relation count differs from source records;
- Payments TOTAL or Expence TOTAL omits a valid method;
- Current State differs from Payments TOTAL minus Expence TOTAL.

### Warning states

- source records with missing Company prevent a complete Company position;
- Current State is presented as Settlement or final Profit;
- Wise Total appears zero because Wise Payments have no Company relation.

### Informational states

- `Payments TOTAL` is the all-method direct sum of related Payment Amount;
- `Expence TOTAL` is the direct sum of related Expense Amount;
- `Current State` is recorded cash position, not Settlement or final Profit;
- Cash, Bank and Wise totals are supporting method views.

## Automatic Versus Manual Validation

Safe automatic checks:

- empty required fields;
- empty required relations;
- relation counts;
- zero amounts;
- missing methods;
- multiple Trip Group relations;
- source count rollups;
- direct arithmetic using canonical source totals.

Manual business review:

- whether a Payment is valid group-level or ancillary revenue;
- cancellation and refund treatment;
- which Company received an unassigned Payment;
- whether a Hotel Booking should have an Expense;
- whether all Expenses are complete;
- cross-group Expense allocation;
- overpayments, credits and negative Remaining values;
- duplicate or suspicious Participant identity;
- final financial sign-off.

No automatic rule may create financial data, infer a Company, assign a
Participant, allocate a shared Expense or mark a Trip Group verified.
