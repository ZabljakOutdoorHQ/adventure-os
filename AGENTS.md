# Agent Instructions

## Mission

Build Adventure OS as a visual operating layer for Durmitor Adventure, Wild Collective and connected projects. Preserve the user's existing working system while progressively making information searchable, connected and actionable.

## Required stack

- Next.js App Router
- React
- TypeScript strict
- Tailwind CSS
- shadcn/ui and Radix primitives
- Lucide icons
- Bun
- Biome
- Playwright

Do not introduce another UI framework without an approved architecture decision.

## Product rules

1. Existing systems remain authoritative until explicitly migrated.
2. Start with mock data, then read-only integrations, then controlled writes.
3. Never delete, move, merge or overwrite business data automatically.
4. Display source, freshness and confidence for aggregated information.
5. Mark inferred relationships as `confirmed`, `probable` or `suggested`.
6. Consequential actions require explicit human approval.
7. Personal data, finance and booking data need least-privilege access and audit logs.

## UI rules

1. Search the local component library before creating a component.
2. Reuse design tokens; do not hard-code colors when a semantic token exists.
3. Prefer composition over duplicated variants.
4. Do not copy arbitrary components from the internet.
5. Keep the shell spatial: persistent navigation, movable context, drill-down views and a separate AI panel.
6. Avoid a long single-column chat experience as the primary navigation model.
7. Every primary view must work on desktop and degrade clearly on tablet.

## Engineering rules

1. One focused task per branch and pull request.
2. Keep TypeScript strict and avoid `any` unless documented.
3. Add tests for critical navigation and data-state behaviour.
4. Never commit secrets or production credentials.
5. Use mock adapters behind interfaces so real integrations can replace them later.
6. Record major decisions in `docs/decisions/`.
7. Run lint, type-check, tests and build before marking a task complete.

## Definition of done

A task is complete only when:

- acceptance criteria are met;
- the implementation uses approved components and tokens;
- empty, loading and error states exist where relevant;
- tests cover the critical path;
- documentation is updated;
- no production data or credentials were introduced.
