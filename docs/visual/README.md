# Visual maps

Self-contained, dependency-free HTML pages that show what Adventure OS is and
where it's going. They are **documentation, not part of the app build** — open
them directly in a browser (double-click, or `open docs/visual/<file>.html`).
No server, bundler, or network access required; each file inlines its own CSS
and JS and renders in the viewer's light or dark theme.

| File | What it shows |
|---|---|
| [`adventure-os-map.html`](adventure-os-map.html) | The whole picture — the architecture read as altitude layers (control plane above source systems), the 11 canonical domains, the Mission Control wireframe, and the delivery route (now / waiting / blocked / experiments). |
| [`tripgroup-graph.html`](tripgroup-graph.html) | A deeper, interactive System Map graph centred on one TripGroup — the "first graph validation scenario" from [`KNOWLEDGE_GRAPH.md`](../KNOWLEDGE_GRAPH.md). Click any node to see how it connects, its source system, and the confidence of the link. |

## Provenance

These pages illustrate the **accepted** architecture — they do not add to or
change it. They are grounded in:

- [`domain/DOMAIN_LANDSCAPE.md`](../domain/DOMAIN_LANDSCAPE.md) — the domains
- [`RELATIONSHIPS.md`](../RELATIONSHIPS.md) — the relationship verbs used on the graph edges
- [`KNOWLEDGE_GRAPH.md`](../KNOWLEDGE_GRAPH.md) — the TripGroup validation scenario
- [`SYSTEM_ARCHITECTURE.md`](../SYSTEM_ARCHITECTURE.md) — the layered control-plane model
- [`IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) — the delivery lanes and horizons

The TripGroup graph uses **illustrative demo names** (clearly labelled on the
page): the *shape* of the connections is real, the people and numbers are not.
No live source is contacted.
