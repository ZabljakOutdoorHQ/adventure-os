# Full Financial Reconciliation

Date: 2026-07-20

Workspace: MCP Cleanup Notion reference implementation

Status: **UNRELIABLE**

This report records the source-record reconciliation performed before any
further financial-model freeze. It does not treat an absent record as a
confirmed zero and does not convert Hotel Bookings into Expenses.

## Scope and Method

Audited:

- 14 Trip Groups;
- 102 Participants;
- 77 Payments;
- 86 Expenses;
- 40 Hotel Bookings; and
- 3 Companies.

`Program Price` was checked against both `Accepted Quote Total` and the
independent sum of Participant `Count x Unit Price`. `Collected Revenue` and
`Recorded Expenses` were independently calculated from source Payment and
Expense records. A result labelled provisional is arithmetic only:

`Collected Revenue - Recorded Expenses`

It is not verified Profit unless expense completeness is proven.

Computed Notion formula and rollup results are not exposed as numbers by the
connector. The authenticated Notion UI was also unavailable to this task.
Source records, reciprocal relations and schema definitions were therefore
used for independent verification. A formula field that the connector cannot
read is classified as unverified, not as a confirmed empty value.

## Dependency Map

| Displayed concept | Source | Relation | Rollup or formula | Audit result |
|---|---|---|---|---|
| Program Price | Participants.`Count x Unit Price` | Trip Groups.`Participants` | Trip Groups.`Program Price` | Source totals independently calculated; several groups conflict with Accepted Quote or PAX |
| Collected Revenue | Payments.`Amount` | Payments.`Trip Group` / Trip Groups.`Payments` | sum of Payment Amount | Structurally healthy for all 77 Payments |
| Remaining to Collect | Program Price and Collected Revenue | Trip Group properties | opaque formula | Independently calculated; negative values need business interpretation |
| Recorded Expenses | Expenses.`Amount` | Expenses.`Trip Group` / Trip Groups.`Expenses` | sum of Expense Amount | Structurally healthy, but five Expenses relate to two Trip Groups |
| Profit | Collected Revenue and Recorded Expenses | Trip Group properties | opaque formula | Not activated as canonical; expense completeness is unproven |
| Company method totals | Payment/Expense method formulas | Company reciprocal relations | method-specific rollups | Cash, Bank and Wise only; Hub link has no method branch |
| Company Payments TOTAL | Payments.`Amount` | Companies.`PAYMENTS` | current opaque formula | Misleading/incomplete because Hub link is omitted by method branches |
| Company Expence TOTAL | Expenses.`Amount` | Companies.`EXPENSES` | current opaque formula | Observed blank and not independently readable |
| Company Current State | Company payment and expense totals | Company properties | current opaque formula | Misleading; observed to ignore Expenses |

## Complete Trip Group Reconciliation Matrix

The short ID is the first eight characters of the Notion page ID and is used to
keep unnamed records distinguishable.

| Trip Group | Program Price | Accepted Quote | PAX / related Participants | Participant pricing total | Collected | Recorded Expenses | Remaining | Provisional | Missing or inconsistent input | Classification |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Unnamed `490814d0` | unknown | unknown | unknown / 0 | 0 | 0 | 0 | unknown | unknown | One Wulfenia booking; no commercial, participant, payment or expense records | MISSING INPUT |
| MENDY 24.05-31.05 (7 PAX) | 12,590.00 | 12,590.00 | 7 / 7 | 12,590.00 | 12,592.00 | 4,802.00 | -2.00 | 7,790.00 | Wulfenia Expense unproven; 2.00 over-collection unexplained | NEEDS BUSINESS DECISION |
| ELI 24.05-31.05 (21 PAX) | conflict | 34,595.40 | 21 / 22 | 31,765.00 | 34,595.40 | 15,327.60 | 0.00 against quote | 19,267.80 | One extra Participant relation; participant pricing differs by 2,830.40; Wolfenia Expense missing; both Payments have no Participant | RELATION ERROR |
| Unnamed `759814d0` (31 May-5 Jun) | 29,516.00 | 29,516.00 | 30 / 3 | 29,516.00 across Participant Count 25 | 8,855.00 | 1,887.60 | 20,661.00 | 6,967.40 | PAX, relation count and aggregate Participant Count disagree; Payment has no Participant; Wulfenia cost missing; Budva marked self-booked | RELATION ERROR |
| ELI 01.06-08.06 (6 PAX) | 9,900.00 | 9,900.00 | 6 / 6 | 9,900.00 | 9,900.00 | 2,685.50 | 0.00 | 7,214.50 | Two group-level Payments have no Participant; Wolfenia Expense missing | MISSING INPUT |
| Unnamed `54f814d0` (17-24 Jun) | 27,540.00 from Participants | unknown | 19 / 19 | 27,540.00 | 0 | 7,430.45 | unknown | -7,430.45 | Accepted Quote and Payments absent; Bianca Expense missing | MISSING INPUT |
| Ignored unnamed `083814d0` (20-27 Jun) | unknown | unknown | 16 / 0 | 0 | 0 | 7,124.25 | unknown | -7,124.25 | Marked Ignore; ten Expenses remain linked; five are also linked to another group; Bianca Expense missing | NEEDS BUSINESS DECISION |
| TALAS TRAVEL 25.06-02.07 (25 PAX) | 36,410.00 | 36,410.00 | 25 / 25 | 36,410.00 | 36,942.00 | 7,099.10 | -532.00 | 29,842.90 | 26 Payments lack Company; two Payments lack Participant; Dalit Participant relation mismatch; Hotel Zabljak and Bianca Expenses missing | RELATION ERROR |
| Ayelette 01.09-08.09 (10 PAX) | unknown | unknown | 10 / 1 | unknown | 1,000.00 | 50.00 | unknown | 950.00 | Future inquiry; Participant Unit Price absent; all three Hotel Expenses absent | MISSING INPUT |
| Unnamed `762814d0` | unknown | unknown | unknown / 0 | 0 | 0 | 0 | unknown | unknown | Three Hotel Bookings; no commercial, participant, payment or expense records | MISSING INPUT |
| MOSHE 03.06-10.06 (8 PAX) | conflict | 13,010.00 | 8 / 8 | 14,760.00 | 3,850.00 | 3,811.50 | 9,160.00 against quote | 38.50 | Participant pricing exceeds quote by 1,750.00; Payment has no Participant; Bianca Expense missing | NEEDS BUSINESS DECISION |
| Unnamed `9de814d0` (14 PAX) | unknown | unknown | 14 / 0 | 0 | 0 | 9,875.13 | unknown | -9,875.13 | Five Expenses also relate to `993814d0`; Kolasin Hotel Expense missing | RELATION ERROR |
| Unnamed `993814d0` (8 PAX) | unknown | unknown | 8 / 0 | 0 | 0 | 9,598.48 | unknown | -9,598.48 | Five Expenses also relate to `9de814d0`; Kolasin Hotel Expense missing | RELATION ERROR |
| Udi Ganani - Montenegro eMTB September 2026 | 13,970.00 | 13,970.00 | 7 / 7 | 13,970.00 | 4,171.00 | no records | 9,799.00 | unverified | Future group; all seven Payments lack Company; all Hotel Expenses remain future/unknown | MISSING INPUT |

No Trip Group is classified `COMPLETE`. No Trip Group was silently excluded.
The matrix uses `FORMULA ERROR` only where a Trip Group formula itself can be
proven wrong. The connector did not expose numeric Trip Group formula results,
so the current failures are source-data, relation or business-decision failures
rather than proven Trip Group formula defects.

## Payment Health

| Check | Result |
|---|---:|
| Total active Payments | 77 |
| With Trip Group | 77 |
| Without Trip Group | 0 |
| Without Participant | 8 |
| Without Company | 33 |
| Hub link | 31 records / 16,016.00 EUR |
| Bank | 8 records / 58,773.40 EUR |
| Cash | 31 records / 32,945.00 EUR |
| Wise | 7 records / 4,171.00 EUR |

The 33 Payments without Company comprise:

- 24 TALAS participant Cash payments totalling 23,830.00 EUR;
- seven Udi Wise payments totalling 4,171.00 EUR;
- Tali's 504.00 EUR TALAS Hub link cancellation deposit; and
- one 300.00 EUR TALAS Cash boat adjustment.

No receiving Company was inferred.

The eight Payments without Participant are group-level or unresolved records:

- six ELI/MOSHE Bank payments;
- the TALAS Iris cancellation/refund net Payment; and
- the 300.00 EUR TALAS boat adjustment.

Two DALIT Payments point to TALAS while the related Participant is not related
to TALAS. The records were not moved without source confirmation.

## Expense Health

| Check | Result |
|---|---:|
| Total active Expenses | 86 |
| With at least one Trip Group | 86 |
| Without Trip Group | 0 |
| With Company | 86 |
| Without Company | 0 |
| Amount missing or zero | 0 |
| Bank | 34 records / 40,696.63 EUR |
| Cash | 52 records / 19,421.50 EUR |

Five Expenses are each related in full to two unnamed Trip Groups:

- Hotel Magnolia: 4,082.48 EUR;
- Hotel Zabljak: 3,576.00 EUR;
- lunch katun ZB: 220.00 EUR;
- Gorivo i trajekt: 135.00 EUR; and
- Dnevnice Dule Strale Egor: 1,560.00 EUR.

These records can double-count 9,573.48 EUR across group reports. They were not
moved or allocated because no allocation rule or authoritative target was
available.

## MENDY Reconciliation

| Measure | Source result |
|---|---:|
| Program Price | 12,590.00 EUR |
| Collected Revenue | 12,592.00 EUR |
| Recorded Expenses | 4,802.00 EUR |
| Provisional result | 7,790.00 EUR |
| Remaining to Collect | -2.00 EUR |

The 12 Payments are:

- 3,204.00 EUR Hub link;
- 573.00 EUR Bank; and
- 8,815.00 EUR Cash.

All 12 are related to Durmitor Adventure. Hub link must remain its own Payment
Method; it is not reclassified as Bank or Wise. A Company all-method Payment
total must include it by rolling up every related Payment `Amount`, independent
of method.

The 2.00 EUR difference is isolated to the combined Mendy/Miriam payments:
their Participant prices total 3,040.00 EUR while the related Payments total
3,042.00 EUR. Existing records consistently show 912.00 EUR plus 2,130.00 EUR.
No authoritative source found in the available records proves whether this is
an overpayment, transcription issue, credit or another business event. No
Payment was changed.

Aleksandar and Splendido have corresponding Hotel Expenses. Wulfenia does not.
The available Wulfenia Hotel Booking has no verified financial amount and is
marked Not Paid. Creating an Expense requires:

- actual amount;
- payment date;
- payment method;
- paying Company; and
- invoice, receipt or other authoritative evidence.

No Wulfenia Expense was created.

## Company Reconciliation Before Repair

The source-record truth is:

| Company | Source Payments | Source Expenses | Expected Current State |
|---|---:|---:|---:|
| Durmitor Adventure | 70,395.40 | 59,588.13 | 10,807.27 |
| Sampas | 12,705.00 | 0 | 12,705.00 |
| Other Trails | 0 | 530.00 | -530.00 |

Durmitor Adventure payment methods:

- Hub link: 15,512.00 EUR;
- Bank: 46,068.40 EUR; and
- Cash: 8,815.00 EUR.

Durmitor Adventure expense methods:

- Bank: 40,696.63 EUR; and
- Cash: 18,891.50 EUR.

Sampas has two Bank Payments totalling 12,705.00 EUR and no Expenses. Other
Trails has five Cash Expenses totalling 530.00 EUR and no Payments.

Before repair, the Companies schema had:

- numeric-sum rollups for Cash, Bank and Wise Payment helpers;
- numeric-sum rollups for Cash and Bank Expense helpers;
- opaque formulas for `Payments TOTAL`, `Expence TOTAL` and `Current State`;
- no Hub link helper; and
- UI symptoms showing expense arrays, blank Expense TOTAL and Current State
  equal to Payments TOTAL.

The formulas cannot be accepted as reconciled because the displayed Company
results are not exposed through the connector and the known Hub link branch is
absent.

## Proposed Minimal Company Repair

No live Company schema change was applied. The Notion connector rejected the
mutation because the previous implementation decision explicitly held Company
formula changes pending completed-trip proof.

The smallest reversible repair prepared for explicit approval is:

```sql
ALTER COLUMN "Expence Cash"
  SET ROLLUP('EXPENSES', 'Amount - Cash', 'sum');
ALTER COLUMN "Expense Bank"
  SET ROLLUP('EXPENSES', 'Amount - Bank', 'sum');
ALTER COLUMN "Expence TOTAL"
  SET ROLLUP('EXPENSES', 'Amount', 'sum');
ALTER COLUMN "Payments TOTAL"
  SET ROLLUP('PAYMENTS', 'Amount', 'sum');
ALTER COLUMN "Current State"
  SET FORMULA('prop("Payments TOTAL") - prop("Expence TOTAL")');
```

The actual relation names include the existing emoji prefixes. This report
omits them from the illustrative SQL for readability.

This repair would:

- preserve all raw Payments, Expenses and relations;
- include Hub link without reclassifying it;
- avoid method-based double counting;
- make Company totals direct source rollups; and
- define Current State as recorded cash position, not Settlement or final
  Profit.

`Wise Total` remains an existing method-specific helper. It is not a canonical
Company total. It currently returns zero where Wise Payments have no Company
relation; no Company was inferred and the field was not deleted.

## Proof Groups

| Proof group | Program Price | Collected | Expenses | Expected arithmetic | Actual source arithmetic | Difference | Result |
|---|---:|---:|---:|---:|---:|---:|---|
| MENDY | 12,590.00 | 12,592.00 | 4,802.00 | 7,790.00 | 7,790.00 | 0 | Arithmetic passes; Wulfenia completeness fails |
| TALAS | 36,410.00 | 36,942.00 | 7,099.10 | 29,842.90 | 29,842.90 | 0 | Arithmetic passes; two Hotel Expenses and 26 Company links missing |
| ELI 01.06 | 9,900.00 | 9,900.00 | 2,685.50 | 7,214.50 | 7,214.50 | 0 | Arithmetic passes; Wolfenia Expense missing |
| MENDY Hub link branch | 12,590.00 | 12,592.00 | 4,802.00 | 7,790.00 | 7,790.00 | 0 | 3,204.00 Hub link present in source and Company relation |

These proofs validate source arithmetic. They do not prove completed-trip
expense completeness, so Trip Group Profit activation and model freeze remain
on hold.

## Hotel Booking Cross-check

Hotel Bookings remain operational. An unmatched booking means a possible
missing business input, not permission to create an Expense.

Completed or active groups with an unproven Hotel Expense include:

- MENDY: Wulfenia;
- ELI 24.05: Wolfenia;
- unnamed 31 May-5 June: Wulfenia; Budva is marked self-booked;
- ELI 01.06: Wolfenia;
- unnamed 17-24 June: Bianca;
- ignored unnamed 20-27 June: Bianca;
- TALAS: Hotel Zabljak and Bianca;
- MOSHE: Bianca;
- unnamed 14-PAX and 8-PAX records: Kolasin.

Future groups have operational Hotel Bookings without Expenses, which is not
yet an error: Ayelette and Udi.

One Hotel Booking is not related to a Trip Group. Only three of 40 Hotel
Bookings contain a Total Cost. Those operational values do not participate in
financial totals.

## Missing Business Inputs

- MENDY Wulfenia actual amount, date, method, Company and evidence.
- Business explanation for MENDY's 2.00 EUR over-collection.
- Receiving Company for 24 TALAS Cash Payments, Tali's Hub deposit, the TALAS
  boat adjustment and all seven Udi Wise Payments.
- Participant or approved group-level treatment for eight Payments without a
  Participant.
- Correct TALAS relation for Dalit, supported by participant source evidence.
- Expense proof for each unmatched completed-trip Hotel Booking.
- Correct target or allocation for the five Expenses linked to two groups.
- Reconciliation of ELI 24.05 PAX, related Participant count and Participant
  pricing.
- Reconciliation of the unnamed 31 May group PAX and Participant relations.
- Canonical commercial amount for the unnamed 17 June group.
- Reconciliation of MOSHE Accepted Quote and Participant pricing.
- Business disposition of ignored and unnamed Trip Group records.

## Formula and Rollup Findings

- Trip Group `Collected Revenue` and `Recorded Expenses` source chains are
  structurally correct.
- Trip Group `Remaining to collect` and `Profit` formula source/results remain
  opaque through the connector.
- Negative Remaining values for MENDY and TALAS are real source arithmetic,
  not proven formula errors.
- Company `Payments TOTAL`, `Expence TOTAL` and `Current State` remain
  unverified and unchanged after the connector rejected activation.
- Company method helpers are supporting fields, not canonical totals.
- `Hub link` remains a distinct Payment Method and must contribute to the
  all-method Company Payment total.

## Zero Versus Unknown

The following apparent zeros are not confirmed zeros:

- no Expenses for Udi or an unnamed Hotel-only group;
- no Payments for groups with participant pricing or Expenses;
- no Company Wise total when Wise Payments lack Company relations;
- no Company Expenses for Sampas where the source relation currently has zero
  records; and
- any provisional result calculated while expected operational costs have no
  Expense records.

AQ-023 remains open. No completeness property, status or formula was added.

## Architecture Questions

AQ-023

How should a financial total distinguish confirmed zero from unknown or
incomplete because no source records have been entered?

AQ-027

Can one Expense apply in full to multiple Trip Groups, or does a cross-group
cost require an allocation rule before it can contribute to each group total?

AQ-028

How should `Remaining to collect` represent overpayments, refunds, credits and
negative balances?

AQ-025 is resolved at the implementation boundary: `Hub link` remains its own
Payment Method, while Company total collected cash includes every related
Payment amount independent of method. This does not define Hub link as Bank,
Wise or a settlement concept.

## Groups Not Ready

All 14 Trip Groups remain not ready for final financial sign-off:

- ten have missing commercial, payment, participant or hotel-expense input;
- four have direct relation or source conflicts; and
- MENDY additionally needs a business explanation for the 2.00 EUR difference.

No completed group proves that all operational hotel costs are present in
Expenses. The Adventure OS canonical financial model must not be marked frozen.

