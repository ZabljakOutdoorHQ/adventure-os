# Approved component inventory

## Purpose

Adventure OS must reuse proven components and design conventions instead of inventing a parallel UI system.

## Authoritative source

The current reference implementation is the private `ZabljakOutdoorHQ/outdoor-hq` repository. Its documented stack includes React 19, Tailwind CSS v4, shadcn/ui, shadcn/studio, Radix UI, Lucide icons, strict TypeScript, Biome and Playwright.

## Phase 1 policy

Until a private component registry is formalised:

1. inspect existing components before adding a new primitive;
2. copy only the minimum approved component needed for the prototype;
3. preserve provenance in the component file header or accompanying decision record;
4. do not copy commercial blocks until their licence and repository location are confirmed;
5. do not add a second UI framework;
6. use semantic CSS variables rather than hard-coded brand colours;
7. keep Adventure OS independent from production website code.

## Initial approved primitives

The first prototype may use or implement shadcn-compatible versions of:

- Button
- Card
- Badge
- Input
- Textarea
- Separator
- Tooltip
- Avatar
- Dropdown menu
- Command palette
- Sheet / drawer
- Tabs
- Scroll area
- Resizable panels

## Adventure-specific blocks

These are composed product blocks, not new UI primitives:

- Application shell
- Domain switcher
- Global command bar
- Attention signal card
- Project card
- Entity summary
- Relationship panel
- Timeline item
- Matrix cell
- AI workspace panel

## Deferred decision

After the visual prototype is accepted, choose one distribution method:

- private shadcn registry;
- private package published through GitHub Packages;
- versioned source copy with automated provenance checks.

The private shadcn registry is the preferred long-term direction, but it is not required to validate the product concept.
