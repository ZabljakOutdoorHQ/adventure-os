# Adventure OS Modularity Contract

Adventure OS must evolve without restarting the project when tools, models or business structures change.

## Stable core

The stable core consists of:

1. canonical domain definitions;
2. knowledge graph identities and relationships;
3. provenance, freshness and confidence metadata;
4. Adventure OS API and MCP contracts;
5. permission and audit rules.

## Replaceable adapters

The following are adapters and may be replaced without changing the stable core:

- Adventure Hub;
- WeTravel;
- Plane;
- Notion;
- Google Drive;
- Docmost;
- Documenso;
- Gmail and Calendar;
- Apple Notes and Reminders;
- AI model providers;
- graph and search implementations;
- visual components and dashboard layouts.

## Rules

- Business entities must not be named after vendor-specific objects.
- UI components must consume canonical view models, not raw third-party API responses.
- Connectors translate external data into canonical entities and relationships.
- Every connector starts read-only and exposes its own health and freshness state.
- Source-specific identifiers remain stored as external references.
- Replacing a source system must not require redesigning unrelated capabilities.
- New capabilities extend the graph; they do not create isolated data islands.
- Migrations are incremental, reversible and auditable.

## Review question

Before accepting a feature, ask:

> Can this system, connector or UI layer be replaced later without rebuilding the business model?

If the answer is no, the implementation is too tightly coupled.
