# ADR 0003 — Mission Control Foundation: routed top-nav shell, no fake data

## Status
Accepted

## Context

The Phase 1 prototype (PR #9/#10, audited and repaired in PR #11) used a single page with client-side tab state (Today, Matrix, Projects, People) and a left sidebar, backed entirely by hardcoded mock entities in `lib/mock-data.ts` (a named owner, named staff, named partner organisations). That approach had two problems once the product needed to grow past a first demo:

1. Tab-based state with no URL routing meant no deep links, no browser back/forward, and every new view added more branching inside one large client component.
2. Fixed mock entities blur the line between "structural placeholder" and "real data" — someone skimming the UI could mistake fabricated names for real operational facts.

## Decision

1. Replace the left-sidebar tab shell with a top navigation bar (`components/shell/top-nav.tsx`) and real Next.js App Router routes: `/` (Mission Control), `/communications`, `/operations`, `/projects`, `/knowledge`, `/system-map`. Each route is a real page, not client state — it supports deep links, browser history and per-route code splitting.
2. Remove `lib/mock-data.ts` and all fabricated entity names. Every page is a structural placeholder: real copy describing what the view will do (drawn from `MASTER.md`, `SYSTEM_ARCHITECTURE.md` and `MCP_INTEGRATIONS.md`), rendered as dashed-border "not yet connected" panels — never invented people, projects or numbers.
3. Add a persistent right context panel (`components/shell/right-context-panel.tsx`), replacing the earlier AI-specific sidebar. It is intentionally generic and empty ("no context selected") rather than pre-populated, since wiring it to a real selected entity is future work.
4. Add a global search entry point (`components/shell/global-search.tsx`) built on a new `Dialog` primitive (`@radix-ui/react-dialog`, matching the already-approved Radix/shadcn stack). It opens via a button or `Cmd/Ctrl+K`, and explicitly states it is not connected to any source — it does not fabricate search results.
5. All three responsive breakpoints from the previous shell carry forward in spirit: the top nav wraps and becomes horizontally scrollable, and the context panel collapses behind a toggle button below ~900px.

## Consequences

Positive:

- Every view is independently linkable and testable.
- No UI surface can be mistaken for real operational data.
- The shell can grow additional routes without touching unrelated pages.
- The Dialog primitive is now available for future modals (confirmations, entity detail overlays).

Trade-offs:

- The right context panel and global search currently do nothing beyond announcing their future purpose — they carry no business logic by design (see the Mission Control Foundation brief).
- `components/adventure-shell.tsx` and its Playwright coverage were deleted rather than incrementally migrated, since the tab-based model and the mock data were both being replaced at once.

## Guardrail

Future work that adds real data to Mission Control, Communications, Operations, Projects, Knowledge or System Map must go through the same read-only-first, source-and-confidence rules as any other integration in `MCP_INTEGRATIONS.md` — this shell only defines structure.
