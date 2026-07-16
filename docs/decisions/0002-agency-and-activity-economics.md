# ADR 0002 — Agency and Activity Economics

## Status
Accepted

## Decision

Durmitor Adventure is modeled as the agency and shared operating layer. Each activity is modeled as a separate operational and financial entity even when payments settle through the same legal company and CKB bank account.

Examples of activity entities:

- Canyoning
- eBike
- Paragliding
- Hiking
- Packraft
- Via Ferrata
- Rafting and partner-delivered activities where applicable

## Agency layer

Durmitor Adventure charges a system fee or commission defined in Adventure Hub. Agency-level revenue finances shared costs such as:

- websites and hosting;
- marketing;
- office procurement and overhead;
- salaries and administration;
- common software and payment infrastructure;
- shared equipment and operational investments where explicitly allocated.

## Activity layer

Each activity owns or is allocated its own:

- gross sales;
- system fee charged by the agency;
- direct operating costs;
- guides and staff costs;
- meals, transport and partner costs;
- equipment and maintenance;
- investment and depreciation references;
- output VAT;
- allocated input VAT;
- contribution margin;
- operational assets and inventory.

## Required financial view

For any period, Adventure OS must be able to show:

1. gross sales by activity;
2. agency system fee by activity;
3. net operating revenue by activity;
4. direct costs and shared-cost allocations;
5. output VAT from recorded white-channel revenue;
6. input VAT linked to eligible costs and investments;
7. net VAT position by activity;
8. aggregate legal-entity totals matching accounting and bank records.

The activity-level view is managerial accounting. The legal-company view remains authoritative for statutory accounting and tax filing.

## Source systems

- Adventure Hub: daily bookings, transactions, system fee, activity costs where available, bike allocation.
- WeTravel: future multiday bookings and payments.
- CKB and payment processors: settlement evidence.
- Numbers, XLSX and CSV: historic imports, procurement and investment registers.
- Google Drive WORK and UVOZ folders: invoices, customs, transport and supporting documents.
- Accounting records: statutory VAT and general-ledger truth.

## Equipment ownership

Bike allocation remains a capability of Adventure Hub. Adventure OS reads and contextualizes allocation records; it does not duplicate allocation logic.

Canyoning and other activity equipment use the shared Asset model but remain linked to their owning activity, invoice, supplier, import shipment, location and lifecycle.

## Hub audit requirement

The current public API does not expose the complete operational and financial model. Before designing full read integration, the Hub must be audited through one or more of:

- read-only API expansion;
- database/report exports;
- screenshots or a narrated screen recording of the authenticated application;
- relevant backend/frontend repository documentation;
- a structured walkthrough with the Hub team.

Adventure OS must not infer undocumented financial rules from the visible UI alone.

## Consequences

- A shared bank account does not collapse activities into one economic entity.
- Every transaction and cost should support activity allocation, including an explicit `shared/unallocated` state.
- Agency overhead and activity economics are reported separately and reconciled at company level.
- The Knowledge Graph must support relationships among Agency, Activity, Booking, Transaction, Cost, VATEntry, Asset, Supplier, Import and Document.
