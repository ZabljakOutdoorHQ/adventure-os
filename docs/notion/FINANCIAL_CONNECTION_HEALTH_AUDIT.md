# Financial Connection Health Audit

Date: 2026-07-20

Workspace: MCP Cleanup Notion reference implementation

# Executive Summary

Overall status: **PARTIALLY HEALTHY**

The direct `Payment -> Trip Group` chain is structurally healthy: all 53 active
Payment records have an amount and exactly one Trip Group, and Trip Groups roll
up `Payments.Amount` through the canonical `Payments` relation.

The `Expense -> Trip Group` chain was broken. The existing `Expenses total`
rollup referenced a non-exposed legacy relation, while the canonical
`Expenses.Trip Group` relation had no reciprocal Trip Group property. The
relation was made reciprocal and the existing rollup was redirected to
`Expenses.Amount`. All 86 Expense-to-Trip-Group values were restored from the
pre-change audit snapshot and then verified record by record.

The Company layer remains unreliable for decision-making. Nine Payments
totalling 4,975 EUR have no Company recipient, including all seven Udi Ganani
Wise payments. The Company schema has method totals for Cash, Bank and Wise but
no Hub link total even though 31 Hub link Payments total 16,016 EUR. Computed
Company formulas are not exposed by the connector, so displayed formula values
could not be independently read.

`PROFIT` is not verified profit. Its formula source and computed result are not
exposed by the connector, and canonical documentation does not define which
profit or margin concept the field represents. It must be treated as unreliable
until Architecture Review resolves its semantics.

# Scope

Audited data sources:

- [Trip Groups](https://app.notion.com/p/7e3814d0e1418236905201afccb25318)
- [Payments](https://app.notion.com/p/a03814d0e14182049ae701d4030e7ecd)
- [Expenses](https://app.notion.com/p/2b5814d0e14183fb9664817e8949f559)
- [Companies](https://app.notion.com/p/3a4814d0e1418293aae20103e3b93c7f)
- [Participants](https://app.notion.com/p/b7d814d0e14183cb8f36810ada555909),
  only where required to independently calculate `Program price total`

Reference documents:

- `docs/PROJECT_CONSTITUTION.md`
- `docs/DOMAIN_MODEL.md`
- `docs/domain/DOMAIN_LANDSCAPE.md`
- `docs/RELATIONSHIPS.md`
- `docs/FINANCE_PROCUREMENT_INVESTMENTS.md`
- `docs/decisions/0002-agency-and-activity-economics.md`
- `docs/IMPLEMENTATION_DECISIONS.md`

Active records audited:

- 14 Trip Groups
- 53 Payments
- 86 Expenses
- 3 Companies
- 102 Participants for participant-line revenue calculations

Archived records returned by the audited views: 0.

# Dependency Map

## Trip Group revenue and collection

`Participants.Count x Participants.Unit Price`
-> `Participants.Line Total`
-> `Participants.Trip Group`
-> `Trip Groups.Participants`
-> `Trip Groups.Program price total`

`Payments.Amount`
-> `Payments.Trip Group`
-> `Trip Groups.Payments`
-> `Trip Groups.PAID Total`
-> `Trip Groups.Remaining to collect`

## Trip Group expenses

Pre-repair:

`Expenses.Amount`
-> `Expenses.Trip Group` one-way relation
-> no reciprocal canonical Trip Group relation
-> `Trip Groups.Expenses total` referenced legacy relation ID `an5TTg`
-> displayed zero/empty expense totals

Post-repair:

`Expenses.Amount`
-> `Expenses.Trip Group`
-> `Trip Groups.Expenses`
-> `Trip Groups.Expenses total`
-> `Trip Groups.PROFIT` formula input, if the existing formula references the
expense rollup

## Company payments

`Payments.Amount + Payments.Payment Method`
-> `Amount - Cash`, `Amount - Bank`, `Amount - Wise`
-> `Payments.Company`
-> Company `Cash Total`, `Bank Total`, `Wise Total`
-> `Payments TOTAL`
-> `Current State`

There is no Company rollup for the `Hub link` payment method.

## Company expenses

`Expenses.Amount + Expenses.Payment Method`
-> `Amount - Cash`, `Amount - Bank`, `Amount - Wise`
-> `Expenses.Paid By`
-> Company `Expence Cash`, `Expense Bank`
-> `Expence TOTAL`
-> `Current State`

There is no Company Wise-expense rollup. No current Expense uses Wise, so this
does not change today's source totals but leaves the chain incomplete.

# Current Property Semantics

| Database | Property | Type / definition | Observed meaning | Finding |
|---|---|---|---|---|
| Trip Groups | Program price total | Sum of Participant `Line Total` | Participant-line total, not necessarily the accepted quote | MISLEADING LABEL where the two sources differ |
| Trip Groups | PAID Total | Sum of related Payment `Amount` | Total recorded collected amounts | Correct for linked Payment rows |
| Trip Groups | Remaining to collect | Formula source not exposed | Appears intended as program total minus paid total | Semantics for conflicts, refunds and overpayment are unverified |
| Trip Groups | Expenses total | Sum of related Expense `Amount` | Total recorded related Expenses | BROKEN ROLLUP before repair; structurally repaired |
| Trip Groups | PROFIT | Formula source not exposed | Previously behaved like paid total where expenses were disconnected | MISLEADING LABEL / unverified formula semantics |
| Payments | Amount | EUR number | Received amount for Udi; source-specific amount elsewhere | Correct under IMP-0008 for Udi |
| Payments | Trip Group | Reciprocal relation | Commercial object receiving the Payment | Healthy |
| Payments | Company | Reciprocal relation | Company recorded as payment recipient | Incomplete: 9 missing |
| Payments | Participant | Reciprocal relation | Beneficiary participant where represented | Incomplete by design for group-level payments |
| Payments | Payment Method | Cash, Bank, Wise, Hub link | Collection channel/method | Healthy as source data |
| Expenses | Amount | Number, no currency format | Recorded expense amount | Currency is implicit |
| Expenses | Trip Group | Reciprocal relation after repair | Trip Group incurring the Expense | Healthy after repair |
| Expenses | Paid By | Company relation | Company recorded as paying the Expense | Complete for current rows |
| Expenses | Category | Source-system select | Expense category | Complete for current rows |
| Expenses | Date | Date | Expense date | Complete for current rows |
| Expenses | Payment Method | Cash, Bank, Wise | Payment channel/method | Complete for current rows |
| Companies | Cash/Bank/Wise Total | Payment method rollups | Payments by three named methods | Does not cover Hub link |
| Companies | Payments TOTAL | Formula source not exposed | Intended total payments received | Cannot be verified; method chain is incomplete |
| Companies | Expence Cash / Expense Bank | Expense method rollups | Expenses paid by Cash and Bank | Current rows covered; naming is inconsistent |
| Companies | Expence TOTAL | Formula source not exposed | Intended total expenses paid | Cannot be independently read |
| Companies | Current State | Formula source not exposed | Intended company cash position/balance | MISLEADING LABEL and semantically unverified |

# Trip Groups Reconciliation

`Program Price` below is calculated independently from Participant Count and
Unit Price. `Source Payments` and `Source Expenses` are direct sums of related
records. Post-repair expense totals have the same record set as the source
calculation. The connector omits computed rollup/formula values, so numeric
display verification uses relation membership and rollup definitions rather
than connector-returned formula values.

| Trip Group | Program Price | Source Payments | Displayed Paid | Source Expenses | Displayed Expenses | Provisional cash margin | Result |
|---|---:|---:|---:|---:|---:|---:|---|
| Udi Ganani - Montenegro eMTB September 2026 | 13,970.00 | 4,171.00 | structurally 4,171.00 | 0.00 | zero from no records | 4,171.00, incomplete | MISSING DATA |
| MENDY 24.05-31.05 | 12,590.00 | 12,592.00 | structurally 12,592.00 | 4,802.00 | repaired to source set | 7,790.00 | PASS after repair |
| ELI 24.05-31.05 | 31,765.00 | 34,595.40 | structurally 34,595.40 | 15,327.60 | repaired to source set | 19,267.80 | MISLEADING LABEL |
| ELI 31.05-05.06 | 29,516.00 | 8,855.00 | structurally 8,855.00 | 1,887.60 | repaired to source set | 6,967.40 | MISSING DATA |
| ELI 01.06-08.06 | 9,900.00 | 9,900.00 | structurally 9,900.00 | 2,685.50 | repaired to source set | 7,214.50 | PASS after repair |
| MOSHE 03.06-10.06 | 14,760.00 | 3,850.00 | structurally 3,850.00 | 3,811.50 | repaired to source set | 38.50 | MISLEADING LABEL |
| ELI 17.06-24.06 | 27,540.00 | 0.00 | zero from no records | 7,430.45 | repaired to source set | -7,430.45, incomplete | MISSING DATA |
| TALAS TRAVEL 25.06-02.07 | 36,410.00 | 13,112.00 | structurally 13,112.00 | 7,099.10 | repaired to source set | 6,012.90 | MISLEADING LABEL |

Program-price conflicts:

- ELI 24.05 has a 31,765.00 EUR participant-line total and a 34,595.40 EUR
  accepted-quote/payment value marked `Conflict`.
- MOSHE has a 14,760.00 EUR participant-line total and a 13,010.00 EUR accepted
  quote.
- TALAS has a 36,410.00 EUR participant-line total and a 37,885.00 EUR accepted
  quote.

These are source/data reconciliation issues, not rollup defects.

# Payments Health

- Total active Payments: 53.
- Total recorded amount: 88,075.40 EUR.
- Linked to Trip Group: 53.
- Unlinked from Trip Group: 0.
- Linked to more than one Trip Group: 0.
- Missing or zero amount: 0.
- Linked to Company: 44.
- Missing Company: 9, totalling 4,975.00 EUR.
- Missing Participant: 8. These are mostly group-level payments and one
  adjustment; absence is not automatically an error.
- Payment status, payment date, payer/source and currency cannot be audited
  because those properties do not exist in the current Payments schema.
- Cash: 7 records / 9,115.00 EUR.
- Bank: 8 records / 58,773.40 EUR.
- Wise: 7 records / 4,171.00 EUR.
- Hub link: 31 records / 16,016.00 EUR.
- Archived Payments: 0.

Payments without Company:

- Seven Udi Wise payments: 4,171.00 EUR.
- Yaron/Talas boat cash adjustment: 300.00 EUR.
- Tali Hub link deposit: 504.00 EUR.

Udi verification:

- Exactly 7 Payment records.
- Total recorded received amount: 4,171.00 EUR.
- All seven remain linked to the Udi Trip Group and beneficiary Participants.
- No Udi payment value was changed in this audit.

# Expenses Health

- Total active Expenses: 86.
- Total recorded amount: 60,118.13 EUR.
- Linked to Trip Group: 86.
- Unlinked from Trip Group: 0.
- Linked to Company: 86.
- Missing Company: 0.
- Amount present and non-zero: 86.
- Date present: 86.
- Category present: 86.
- Payment method present: 86.
- Cash: 52 records.
- Bank: 34 records.
- Wise: 0 records.
- Archived Expenses: 0.
- Linked through the existing canonical `Expenses.Trip Group` field before
  repair: 86.
- Included in the broken pre-repair Trip Group rollup: 0.
- Excluded from the broken pre-repair Trip Group rollup: 86.
- Included in the canonical Trip Group relation after repair: 86.
- Excluded from the canonical Trip Group relation after repair: 0.
- A separate Supplier relation and Expense status do not exist in the current
  Expenses schema.

Five Expense records are each linked to two candidate Trip Groups:

| Expense | Amount |
|---|---:|
| Hotel Magnolia | 4,082.48 |
| Hotel Zabljak | 3,576.00 |
| lunch katun ZB | 220.00 |
| Gorivo i trajekt | 135.00 |
| Dnevnice Dule Strale Egor | 1,560.00 |

The duplicated cross-group exposure is 9,573.48 EUR. No relation was removed
because the authoritative Trip Group allocation is not available.

# Companies Reconciliation

Source totals count only records explicitly related to each Company.

| Company | Source Payments | Displayed Payments | Source Expenses | Displayed Expenses | Net Source Position | Displayed Balance | Result |
|---|---:|---|---:|---|---:|---|---|
| Durmitor Adventure | 70,395.40 | connector omits formula value; 15,512.00 is Hub link | 59,588.13 | connector omits formula value | 10,807.27 | connector omits formula value | UNRELIABLE |
| Sampas | 12,705.00 | connector omits formula value | 0.00 | connector omits formula value | 12,705.00 | connector omits formula value | PARTIAL |
| Other Trails | 0.00 | connector omits formula value | 530.00 | connector omits formula value | -530.00 | connector omits formula value | PARTIAL |

Workspace-level gaps:

- 4,975.00 EUR of Payments has no Company and cannot contribute to any Company
  total.
- Company payment rollups have no `Hub link` branch. Durmitor Adventure has
  15,512.00 EUR of Company-linked Hub link payments.
- `Payments TOTAL`, `Expence TOTAL` and `Current State` formula source and
  computed values are not returned by the connector.
- The schema does not distinguish holder of funds, owner of funds, paying
  company and receiving company.
- No fourth-share or custodian record was reinterpreted as a Company.
- Intercompany transfers and profit-share obligations cannot be verified from
  these records.

# Formula and Rollup Findings

1. `PAID Total` is a healthy sum rollup over `Payments.Amount`.
2. `Program price total` is a healthy technical rollup but may be a misleading
   business label because it always uses participant lines.
3. `Expenses total` was a broken rollup. It is now connected to the reciprocal
   canonical `Expenses` relation and sums `Expenses.Amount`.
4. `Remaining to collect` cannot be fully verified because formula code is not
   exposed and canonical handling of negative values, refunds and conflicts is
   undefined.
5. `PROFIT` cannot be accepted as profit. Even after expense propagation is
   repaired, the field could represent collected cash minus recorded expenses,
   contracted value minus expenses, gross margin, provisional margin or another
   concept.
6. Company formula values are opaque to the connector. Their visible method
   dependencies are incomplete for Hub link payments and Wise expenses.

# Zero vs Unknown Findings

The current interface can render zero in at least these incomplete states:

- A Trip Group has no Expense records entered.
- A Trip Group has no Payment records entered.
- A Company has no related records for a method.
- A Company has Payments without a Company relation elsewhere in the workspace.
- A Trip Group has a participant line with no Unit Price.

Udi `Expenses total = 0` means no verified Expense records have been entered; it
does not prove that operating expenses are zero. ELI 17.06 `PAID Total = 0`
means no Payment records are linked; it does not prove that no money was
collected.

# Safe Repairs Applied

## Expense reciprocal relation

Changed the existing `Expenses.Trip Group` relation from one-way to reciprocal,
creating the canonical `Trip Groups.Expenses` inverse.

Reference:

- `docs/DOMAIN_MODEL.md` / Expense
- `docs/RELATIONSHIPS.md` / `EXPENSE_APPLIES_TO_TRIP_GROUP`

## Expense rollup

Changed the existing `Trip Groups.Expenses total` rollup from the unresolved
legacy relation ID `an5TTg` to:

`Trip Groups.Expenses -> Expenses.Amount -> sum`

No formula, amount, category, Company, status or business rule was changed.

## Repair verification

The connector's relation-type alteration cleared existing Expense-to-Trip-Group
values. The pre-change export was used to restore all 86 records exactly.

Post-repair verification:

- 86 Expense records re-fetched.
- 0 relation differences from the pre-change snapshot.
- 0 unlinked Expense records.
- 5 intentionally unchanged multi-Trip-Group Expense records.
- All 11 affected Trip Group reciprocal relation sets match the source export.
- Udi still has 0 verified Expenses.

# Unresolved Data Gaps

- Nine Payments have no Company recipient.
- Five Expenses are linked to two candidate Trip Groups.
- Three Trip Groups have participant-line totals that differ from accepted
  quote totals.
- Udi has no verified Expense records.
- ELI 17.06 has no Payment records.
- A ghost/ignored Trip Group has 7,124.25 EUR of related Expenses.
- Payer, recipient, account/custodian and beneficiary distinctions are not
  structurally complete.
- Payment and Expense currency is not explicit across the full model.
- Company formula results cannot be read through the current connector.

# Architecture Questions

## AQ-022

What exact financial concept should the current `PROFIT` field represent:
collected cash minus recorded expenses, contracted revenue minus recorded
expenses, gross margin, provisional margin, settled profit or another defined
measure?

## AQ-023

How should a financial total distinguish confirmed zero from unknown or
incomplete because no source records have been entered?

## AQ-024

How should the model distinguish holder of funds, owner of funds, paying
Company, receiving Company and intercompany settlement obligations?

## AQ-025

How should `Hub link` Payments contribute to Company totals, and is `Hub link`
a payment method, processor, account or another source-system classification?

## AQ-026

Which source controls Trip Group contracted revenue when Participant Line Total
and Accepted Quote Total differ, and which source should `Remaining to collect`
use?

## AQ-027

Can one Expense apply in full to multiple Trip Groups, or does a cross-group
cost require an allocation rule before it can contribute to each group total?

## AQ-028

How should `Remaining to collect` represent overpayments, refunds, credits and
negative balances?

# Template Consistency Findings

Compared pages:

- Udi Ganani - complete canonical operational hub page.
- ELI 24.05-31.05 - rich operational page with linked views and cycling detail,
  but source-specific terminology and conflicting commercial facts.
- MENDY 24.05-31.05 - blank page despite populated database properties.

Recommended generic layout:

| Section | Classification | Recommendation |
|---|---|---|
| Trip Snapshot | generic; mixed structured/static | Standard |
| Commercial Summary | generic; structured plus source notes | Standard, pending revenue semantics |
| Payments Summary | generic; database-backed | Standard |
| Expenses Summary | generic; database-backed | Standard after this repair |
| Financial Status | generic; derived | Do not standardize until AQ-022/023/026 |
| Bike Summary | cycling-specific | Conditional |
| Accommodation Summary | generic when applicable | Conditional |
| Day-by-Day Operations | generic operational static summary | Standard page section; AQ-019 remains |
| Participants / Rooming | generic | Standard |
| Related Records | generic; database-backed | Standard |
| Action Checklist | generic container; case-specific items | Standard container |

No template was changed in this sprint.

# Recommended Next Steps

Data cleanup:

- Resolve the five Expenses linked to two Trip Groups.
- Confirm the correct Trip Groups for the 7,124.25 EUR attached to the ignored
  ghost group.
- Assign Company recipients to the nine Payments where source evidence exists.
- Reconcile Participant Line Total against Accepted Quote Total for ELI 24.05,
  MOSHE and TALAS.

Implementation repair:

- Verify Company displayed values in an authenticated Notion UI or connector
  that exposes formula results.
- After Architecture Review, repair Company method coverage without
  reclassifying Hub link as Cash, Bank or Wise.

Architecture review:

- Resolve AQ-022 through AQ-028 before changing formula semantics or labels.
- Keep AQ-003 and AQ-021 active.

Future operational work:

- Apply a canonical Trip Group page template only after the financial status
  section has approved semantics.
- Continue using central Payments and Expenses records as structured sources,
  with Trip Group pages as operational summaries.
