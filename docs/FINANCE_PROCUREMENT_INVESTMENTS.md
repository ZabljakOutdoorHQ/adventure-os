# Finance, Procurement & Investments

## Purpose

Adventure OS must treat financial and procurement material as a connected business domain, not as a loose folder of spreadsheets and invoices.

The goal is not to replace accounting software. The goal is to make operational finance, procurement history, investment decisions and supporting evidence understandable and searchable across the business.

## Current source types

Known sources include:

- Apple Numbers files;
- Excel and CSV exports;
- supplier invoices;
- customs and import documents;
- bank statements and payment confirmations;
- WS Pay and card processor reports;
- procurement lists;
- equipment stock and valuation files;
- investment-by-activity documents;
- internal calculations, margins and settlement sheets;
- scanned PDFs, photos and email attachments.

## Core domains

### Procurement

Covers the lifecycle from need to delivered asset:

- procurement request;
- supplier and quote;
- purchase order or invoice;
- payment;
- shipment;
- customs/import costs;
- received items;
- stock or asset registration;
- discrepancies and claims.

### Investment

Represents capital and strategic spending connected to an activity, business unit or project.

Examples:

- e-bike fleet investment;
- canyoning equipment;
- paragliding equipment and infrastructure;
- vehicles;
- office and booking infrastructure;
- events;
- website and software;
- server and internal systems.

### Operational finance

Covers decision-support information rather than statutory accounting:

- income and expense by organization;
- income and expense by activity;
- income and expense by project or TripGroup;
- receivables and expected payments;
- cash movement;
- intercompany settlements;
- guide payments and allowances;
- gross margin and contribution analysis.

## Canonical entities

- FinancialDocument
- Invoice
- InvoiceLine
- Payment
- Expense
- Revenue
- Transaction
- Investment
- ProcurementCase
- PurchaseOrder
- Shipment
- CustomsCase
- Supplier
- Asset
- EquipmentItem
- StockMovement
- Organization
- Activity
- Project
- TripGroup
- SourceFile

## Required relationships

Examples:

- Invoice `issued_by` Supplier
- Invoice `billed_to` Organization
- InvoiceLine `acquires` Asset or EquipmentItem
- Payment `settles` Invoice
- CustomsCase `relates_to` Shipment
- Shipment `contains` EquipmentItem
- EquipmentItem `supports` Activity
- Investment `funds` Activity, Project or Organization
- Expense `belongs_to` Project, Activity or TripGroup
- SourceFile `supports` FinancialDocument

## Investment-by-activity view

Adventure OS should provide a visual investment map by activity, including at minimum:

- total historical investment;
- year or period;
- acquisition category;
- current asset value when known;
- source documents;
- financing or payment source;
- linked equipment/assets;
- linked revenue and operating costs when available;
- confidence and data completeness.

The purpose is to answer questions such as:

- How much has been invested in e-bikes?
- Which supplier invoices and customs cases support that number?
- Which assets are still active?
- How much has canyoning generated relative to equipment investment?
- What is missing from the historical record?

## Numbers files

Apple Numbers files are valid source material but should not remain the only machine-readable source for critical operational data.

Transition rule:

1. preserve the original `.numbers` file;
2. generate a controlled XLSX or CSV export for ingestion;
3. store the source checksum and export date;
4. map columns to canonical entities;
5. do not overwrite the original source;
6. flag formula-dependent or visually structured sheets for manual review;
7. promote stable active datasets to PostgreSQL only after validation.

Numbers is therefore treated as a source and working tool, not the long-term system of record for connected finance data.

## Source-of-truth policy

Until a formal accounting or procurement system is designated:

- statutory accounting records remain outside Adventure OS;
- original invoices, customs records and bank evidence remain authoritative documents;
- structured Adventure OS records provide an operational view with links back to evidence;
- calculated totals must show formula, source period and freshness;
- conflicting amounts must not be silently merged.

## AI rules

AI may:

- classify documents;
- extract supplier, date, amount, currency and line items;
- propose relationships;
- detect likely duplicates;
- reconcile source totals;
- identify missing evidence;
- draft investment summaries.

AI may not without approval:

- alter original financial documents;
- declare a reconciled balance final;
- infer tax treatment;
- post accounting entries;
- merge conflicting transactions;
- issue invoices or payments.

## Initial delivery plan

1. Inventory finance-related source folders and files.
2. Identify critical Numbers documents and create controlled exports.
3. Define the investment-by-activity source document.
4. Map suppliers, invoices, payments, shipments, customs and assets.
5. Build a read-only visual Finance & Investments workspace with mock data.
6. Pilot ingestion on one bounded case, preferably one equipment import batch.
7. Validate totals against original documents before expanding.

## Status

Planned. Read-only foundation only. No financial source is currently connected to Adventure OS.
