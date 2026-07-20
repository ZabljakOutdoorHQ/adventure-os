# Canonical Financial Model

Status: Canonical model boundary for Adventure OS v0.1

## Revenue

`Program Price` is the single canonical revenue amount for a Trip Group. It is
the contracted price of the program, independent of when or how money is
received.

Accepted quotes, quote totals, program totals and imported revenue labels may
remain as historical evidence or supporting source data. They do not create a
second canonical revenue amount.

`Collected Revenue` is the sum of recorded Payments associated with a Trip
Group. At Company level, `Received Cash` is the sum of recorded Payments
received by that Company. Neither term replaces `Program Price`.

## Expenses

`Recorded Expenses` is the sum of Expense records associated with the relevant
Trip Group or Company.

Expenses are the sole financial source of truth for operating costs. Operational
records may describe services that are expected, booked or delivered, but they
do not become financial costs until represented by an Expense.

## Profit

The canonical definition is:

`Profit = Collected Revenue - Recorded Expenses`

Profit is reliable only when Expenses are complete. Until expense completeness
is confirmed, the calculated result is provisional and must not be presented as
settled or final profit.

Adventure OS does not yet define an expense-completeness mechanism.

## Companies

Companies represent legal entities, operational entities and cash holders in
the current Adventure OS model.

These responsibilities remain within one Company concept. The canonical model
does not split them into treasury, accounting or settlement entities.

`Settlement` is the reconciliation of obligations between Companies. A full
Settlement Engine is outside the current scope.

## Hotel Bookings

Hotel Bookings are operational records. They describe accommodation dates,
rooms, confirmation state, payment deadlines and other booking details needed
to deliver a Trip Group.

Hotel Bookings are not a financial source of truth. A hotel cost contributes to
`Recorded Expenses` only through an Expense record.

## Scope Boundary

| Current Scope | Future Scope |
|---|---|
| Trip Groups | Suppliers |
| Participants | Invoices |
| Payments | VAT |
| Expenses | Attachments |
| Companies | Accounting integration |
| Hotel Operations | General Ledger |
|  | Bank reconciliation |
|  | Full Settlement Engine |

Future scope extends this model. It does not redefine the current meanings of
Program Price, Collected Revenue, Received Cash, Recorded Expenses, Profit,
Company or Hotel Booking.
