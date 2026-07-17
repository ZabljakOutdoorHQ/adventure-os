# Outdoor HQ Architecture Review — for Adventure OS

## Status

**Research only. No code, PR, dependency, or architecture change accompanies
this document.** Prepared as implementation-architect groundwork while the
Adventure OS Product Blueprint is authored separately, so that blueprint
decisions land inside conventions that already exist rather than inventing
parallel ones.

**What was reviewed:**

- `ZabljakOutdoorHQ/outdoor-hq`, shallow clone of `main` (single branch,
  depth 1) at commit `f2ca3a8`.
- Every ADR in `docs/decisions/` (3), the two non-ADR architecture documents
  (`ARCHITECTURE_AUDIT.md`, `docs/architecture/monorepo.md`), `HANDOFF.md`,
  root `CLAUDE.md`, and app-scoped `apps/durmitor-adventure/CLAUDE.md` +
  `apps/durmitor-adventure-cms/CLAUDE.md`.
- All 51 pull requests (open + closed) via the GitHub API, to identify any
  branch specifically about system/Adventure-OS architecture (see
  [§9, "future architecture branch"](#9-open-questions) — none was found
  under that description; closest candidate is documented below).
- `docs/adventure-hub/*` — outdoor-hq's own AdventureHub integration
  reference, which is materially more mature than Adventure OS's
  `docs/integrations/adventure-hub.md`.
- `packages/ui-primitives`, `packages/ui-patterns`, `packages/ui-custom` —
  the shared component layer.
- `infra/*` and `docs/_archive/plans/2026-06-18-tooling-server-infra-plan.md`
  — the self-hosted internal-tooling deployment model.
- `biome.jsonc`, `apps/durmitor-adventure-cms/src/collections/*` (Payload
  domain model).
- Adventure OS's own open PRs #16 (`Plane Tasks in Mission Control`), #17
  (`Interactive prototype: full product vision click-through`), and #4
  (stale draft, base predates the current architecture — not load-bearing).

**What was not reviewed:** `ARCHITECTURE_AUDIT_REBUTTAL.md`,
`docs/architecture/durmitor-adventure-technical-assessment.md`,
`docs/architecture/extraction-inventory(y).md`, `docs/runbooks/*` beyond what
is cited below, and any outdoor-hq branch other than `main` (branches behind
merged/closed PRs are typically deleted; the shallow single-branch clone did
not fetch the ~34 open feature branches individually). If a specific
"future architecture branch" exists that this pass missed, name it and it
will be reviewed directly.

---

## 1. Architecture summary

outdoor-hq is a Turborepo + Bun monorepo of **market-facing Astro sites and
their Payload CMS backends** — it is not, anywhere in its current `main`
branch, related to an "Adventure OS" application. No file, branch name, ADR,
or plan mentions Adventure OS. The "architecture already defined elsewhere"
that applies to Adventure OS is **not a spec for Adventure OS** — it is the
company's established tech-stack, deployment, and design-system conventions,
which Adventure OS should inherit rather than reinvent.

| Layer | Established choice |
|---|---|
| Monorepo tooling | Turborepo 2.x, Bun 1.x package manager/runtime |
| Public site framework | Astro 6 (SSR), React 19 islands only where interactive |
| CMS | Payload CMS 3.84, on Next.js 16 (admin + API), via `@opennextjs/cloudflare` |
| Styling | Tailwind CSS v4, shadcn/ui ("New York" style) + shadcn/studio (paid), Radix UI primitives, Lucide icons |
| Hosting | Cloudflare Workers for **every** public app (Pages is explicitly deprecated for new projects; one legacy exception: `wild-collective` still on CF Pages) |
| Linting/formatting | Biome 2.x (single quotes, no semicolons, organized imports) |
| Testing | Playwright (E2E + visual regression + pixel-parity) |
| Internal tooling (planned) | Mattermost, Docmost, n8n, Documenso, Plausible — self-hosted via Docker Swarm + Dokploy on a dedicated box ("r2d2"), separate from the CF Workers app stack |

Eleven apps live under `apps/*` (kebab-case naming): six public
Astro sites (`durmitor-adventure`, `xelements`, `wild-collective`, `deep-mne`,
`sampas`, plus static `deep-mne-landing` and `durmitor-presentations`), two
Payload CMS backends (`durmitor-adventure-cms`, `deep-mne-cms`), and two
infrastructure-support Workers (`image-transformer`, `cf-builds-notifier`).
Shared code lives under `packages/*`: CMS-specific packages
(`cms-content-loader`, `cms-fields`, `cms-forms`, `cms-image-pipeline`,
`cms-lexical`, `cms-og`, `cms-preview`, `cms-totp`, `cms-audit`, `maps`) and
three UI packages (`ui-primitives`, `ui-patterns`, `ui-custom` — see
[§5](#5-reusable-components)).

Adventure OS shares almost none of this stack by necessity (Next.js 16 vs
Astro 6, no Cloudflare hosting decision made yet, no Payload CMS) — the
alignment that matters is at the **design-system and convention** level, not
the framework level.

---

## 2. Important patterns already established

**CMS migration bridge (repeated, not one-off).** Phases C, D, and E of the
Durmitor CMS migration (PRs #30–#53) all follow the identical sequence:
collection scaffold → composite loader → pass-through adapter →
`migrate-content` step → MD-vs-CMS **pixel-parity test** (0.1% diff
threshold, `pixelmatch`, kept as a permanent regression guard, not deleted
after the cutover) → flip the default source. This is the team's proven
playbook for any "old source → new source" migration and is directly
relevant precedent for any future Adventure OS data migration (e.g. mock
data → live adapter).

**ADR discipline.** Every ADR (`docs/decisions/*.md`) uses the same shape:
YAML frontmatter (`status`, `date`, `deciders`, optional `applies-to`),
a Context section citing *verified repo state* (not assumptions), a scored
decision against named criteria, explicit "Posledice" (consequences,
including honestly-labeled downsides), a rejected-alternatives section, and
a **"Kada revisit-ovati"** (when to revisit) section with concrete trigger
conditions. This is a stronger ADR convention than Adventure OS's own
`docs/decisions/` currently uses and is worth adopting verbatim.

**Public vs. internal deployment split — a stated house rule.** From the
`durm.it` URL-shortener ADR: *"javna produkcija ide na CF edge, r2d2 je
interni back-office"* (public production goes on the CF edge; r2d2 is
internal back-office). Public, guest-facing traffic is a hard requirement
for Cloudflare Workers/edge; internal tooling explicitly does not need to
be there and is deliberately kept on the self-hosted box instead. This is a
direct, reusable answer to "where should Adventure OS live" (see
[§6](#6-deployment-model)).

**Per-app `CLAUDE.md` as binding, scoped rules.** Each app has its own
`CLAUDE.md` opening with an explicit scope line (e.g. *"Scope: UI/design
work... No architectural changes without explicit discussion"*). Rules are
concrete and falsifiable (allowed color token list, `.astro` vs `.tsx`
decision table, "extract only after 3+ repetitions"), not aspirational
prose.

**Token-contract-driven shared UI, not copy-paste.** `@outdoor-hq/ui-primitives`
(see [§5](#5-reusable-components)) is consumed by declaring a CSS custom-property
contract in the app's own `globals.css`; the package never hardcodes a
color. This is the same principle Adventure OS's own
`docs/PROJECT_CONSTITUTION.md` and `components/ui/*` already follow — it is
now confirmed as the company-wide pattern, not just an Adventure OS
convention.

**No CI/CD pipeline; deploy is manual and human-triggered.** Confirmed by
the `remote-caching` ADR: *"Push u GitHub ne pokreće build"* (pushing to
GitHub does not trigger a build). `.github/workflows/` contains exactly one
workflow (`sync-media.yml`, unrelated to builds/deploys). Every app deploys
via `bun run deploy:<app>` run by hand from a developer's laptop. The team
is effectively one primary maintainer plus one part-time contributor.

---

## 3. Conventions Adventure OS MUST follow

1. **AdventureHub is the source of truth for bookings and guest PII; a
   consuming app may only read aggregate availability, never individual
   bookings or guest data.** This is stated explicitly in outdoor-hq's own
   integration docs (*"CMS ne čita rezervacije niti podatke gostiju —
   isključivo agregatne availability brojeve, čime se izbegavaju GDPR
   komplikacije"*) and is the exact same boundary Adventure OS's own
   `docs/PROJECT_CONSTITUTION.md` §4 already states. It is now independently
   confirmed as the real, production-enforced rule — not just an Adventure OS
   aspiration.
2. **Internal/back-office tools do not go on Cloudflare Workers.** They go
   on the dedicated self-hosted box, gated by Cloudflare Access where
   sensitive. If Adventure OS ships a real deployment, this house rule is
   the default answer for where, unless a documented reason overrides it
   (see [§9](#9-open-questions) — no such decision exists yet for Adventure
   OS specifically).
3. **Styling tokens only, no hardcoded colors, one `globals.css` as the
   single source of truth.** Confirmed both in `apps/durmitor-adventure/CLAUDE.md`
   ("Never hardcode hex/rgb/oklch in component `class` attributes... No new
   CSS files") and in the `@outdoor-hq/ui-primitives` token contract.
   Adventure OS already follows this; do not regress it.
4. **Extract a shared component only after it repeats 3+ times; otherwise
   keep it inline.** An explicit, quantified rule from
   `apps/durmitor-adventure/CLAUDE.md`, consistent with Adventure OS's own
   "don't introduce abstractions beyond what the task requires" instinct —
   now with a concrete threshold to cite.
5. **ADRs for consequential, reversible-cost decisions**, using the shape
   in [§2](#2-important-patterns-already-established): verified context,
   scored alternatives, explicit downsides, a revisit trigger. Adventure
   OS's `docs/decisions/` should converge on this shape.
6. **"No architectural changes without explicit discussion"** is the
   opening line of the most detailed per-app `CLAUDE.md` in the monorepo.
   It matches Adventure OS's own decision hierarchy
   (`docs/PROJECT_CONSTITUTION.md` §6) and is the operating norm this
   review itself is scoped by.

---

## 4. Conventions that should NOT be broken (i.e., not everything here transfers)

1. **Do not relax Adventure OS's lint/accessibility bar to match
   outdoor-hq's.** `biome.jsonc` in outdoor-hq turns **off**
   `noUnusedVariables`, `noUnusedImports`, `useExhaustiveDependencies`,
   `noExplicitAny`, `noArrayIndexKey`, and seven `a11y` rules including
   `useButtonType` and `useValidAnchor`. This is a defensible choice for a
   fast-moving, mostly-solo content-site team — it is not a standard to
   import into Adventure OS, which already keeps these on and whose own
   constitution treats accessibility as a first-class constraint.
2. **Do not weaken or remove Adventure OS's CI gate to match outdoor-hq's
   "no CI, manual deploy" model.** That model is a direct consequence of
   outdoor-hq's team size and the fact that nothing there currently builds
   in CI (see [§2](#2-important-patterns-already-established),
   [§6](#6-deployment-model)). Adventure OS's PR-gated
   lint/format/typecheck/e2e/build pipeline is a stricter, and better,
   standard for a system meant to become a shared operational surface. This
   is a place outdoor-hq's practice is *not* the target to converge on.
3. **Do not port Astro/Workers-specific mechanics wholesale.** `.astro` vs
   `.tsx` component-decision rules, `client:*` hydration directives,
   Wrangler config, and the CF-Workers-only hosting posture are answers to
   problems Adventure OS (Next.js, no hosting decision made) does not have
   in the same shape. The *reasoning style* behind those decisions (measure
   first, choose the minimum platform complexity the product shape
   justifies — see `ARCHITECTURE_AUDIT.md` §6) transfers; the specific
   mechanics do not.
4. **Do not conflate outdoor-hq's CMS domain model with Adventure OS's
   operational domain model.** Payload's collections
   (`Adventures`, `Packages`, `Holidays`, `Pages`, `Media`, `Tags`, `Users`,
   `Invites`, `AuditLogs`, `TotpChallenges`) model **public marketing
   content and CMS admin accounts** — not people, organisations, projects,
   bookings, or tasks in the sense Adventure OS's `docs/DOMAIN_MODEL.md`
   defines them. `Users` there means "CMS editors," not "everyone Adventure
   OS tracks." See [§7](#7-domain-boundaries).
5. **`ARCHITECTURE_AUDIT.md`'s specific findings are about
   `durmitor-adventure`'s route/template duplication** (parallel
   `[lang]/...` vs non-`[lang]` Astro routes, god-file page templates,
   translation logic embedded in "reusable" components). None of that
   applies structurally to Adventure OS's Next.js App Router setup, which
   does not have this duplication. The audit's *underlying lesson* is
   worth carrying forward regardless of stack: components that look
   reusable but secretly depend on app-specific routing/i18n are not
   reusable, and Adventure OS's own `EntityList` / `EntitySectionCard`
   components (added in PR #17) should be checked against that lesson as
   the prototype grows.

---

## 5. Reusable components

**`@outdoor-hq/ui-primitives`** (`packages/ui-primitives`) — the real,
already-built shared shadcn/ui v4 layer: `Button`, `Card`, `Dialog`,
`Input`, `Badge`, `Avatar`, `Select`, `Sheet`, `Tabs`, `Command`, `Popover`,
`Separator`, `Skeleton`, `Switch`, `Checkbox`, `RadioGroup`, `ScrollArea`,
`DropdownMenu`, `ToggleGroup`, `Accordion`, `Breadcrumb`, `Alert`,
`Calendar`, `Label`, `Textarea`, `Slider`. It carries a stated CSS
token contract (`--background`, `--primary`, `--destructive`, `--success`,
`--warning`, `--info` families, `--popover`, `--radius`, etc. — full list in
`packages/ui-primitives/README.md`).

- **It is `"private": true`, workspace-linked only — not published to any
  registry.** Adventure OS, as a separate repository, cannot `import` it
  today. This is the exact fork Adventure OS's own
  `docs/COMPONENT-INVENTORY.md` already anticipated ("private shadcn
  registry vs. GitHub Packages vs. versioned source copy") and deferred
  until "after the visual prototype is accepted" — a decision point that
  has now effectively arrived. See [§9](#9-open-questions).
- Adventure OS's current local `components/ui/*` (`button.tsx`, `card.tsx`,
  `dialog.tsx`, `input.tsx`) is an independently-built, smaller subset —
  missing `destructive`/`secondary`/`link` button variants, missing
  `data-slot` attributes, and using different token names (`--danger`
  instead of `--destructive`, no `--popover`, `--success-foreground`,
  `--warning-foreground`/`-border`, `--info-*`). This is drift, not a
  deliberate divergence, and should be named explicitly in the blueprint
  rather than left implicit.

**`docs/adventure-hub/*`** — outdoor-hq's own AdventureHub integration
reference is materially more mature than Adventure OS's own
`docs/integrations/adventure-hub.md`: confirmed production and staging base
URLs, a confirmed JWT auth flow (`POST /api/tokens`, `HS256`, 10-minute TTL,
anonymous `EndUser` role), confirmed endpoint contracts
(`GET /api/modal`, `GET /api/modal/total-price`, `POST /api/modal/booking`)
with empirically-verified request/response shapes, a byte-level
staging-vs-production comparison, a smoke-test script
(`apps/durmitor-adventure/scripts/ah-smoke.sh`), and a running list of
confirmed production blockers on the AdventureHub side (capacity
enforcement, `Idempotency-Key` support, an unhandled `HTTP 500`). Anything
Adventure OS's own AdventureHub doc claims should be reconciled against this
source before being treated as independently confirmed — see
[§9](#9-open-questions).

**Not reusable for Adventure OS:** `packages/ui-patterns` (language
switcher, lightbox gallery, form-timing/honeypot anti-spam,
`submit-form.ts`) and `packages/ui-custom` (`craft-button`, `cursor`,
`motion-preset`, `number-ticker`, `rating`) are marketing-site-specific —
built for public conversion-focused pages, not an internal operational
tool. There is no current Adventure OS use case for either.

---

## 6. Deployment model

**Public apps (all 11 in `apps/*`):** self-contained, Cloudflare Workers
(`@astrojs/cloudflare` for Astro, `@opennextjs/cloudflare` for the Payload/
Next.js CMSes; static apps are Workers serving static assets). CF Pages is
explicitly deprecated for new work; `wild-collective` is a documented legacy
exception. Deploy is **manual, per-app, from a developer machine**
(`cd apps/<app> && bun run deploy`) — there is no CI-triggered build or
deploy pipeline (`.github/workflows/` has one unrelated media-sync workflow;
confirmed explicitly by the `remote-caching` ADR).

**Internal/back-office tooling (Mattermost, Docmost, n8n, Documenso,
Plausible, and the interim Shlink URL shortener):** a **separate**
self-hosted box, hostname `r2d2` (netcup, 8 vCPU / 16 GB), orchestrated by
**Dokploy** on Docker Swarm behind **Traefik**, with **Cloudflare DNS +
Access** in front (sensitive surfaces like the n8n editor and the Dokploy
dashboard itself are Access-gated; webhook endpoints and the other app UIs
are public). Secrets are SOPS + age-encrypted in git
(`infra/secrets/prod.sops.yaml`), with Dokploy holding a synced runtime copy
— plaintext never touches git, chat, or the issue tracker.

**⚠️ Status is contradictory between two documents and should be verified
before being relied on:** `docs/_archive/plans/2026-06-18-tooling-server-infra-plan.md`
carries frontmatter `status: shipped`, `shipped: 2026-06-19`, while
`infra/README.md` (last read in this pass) states *"Status — not yet
built. The server is not deployed yet... After the first deploy... each
service's README 'As built' block gets [filled in]"* — and the per-service
READMEs read as deploy contracts, not as-built records. **Do not assume
Docmost/Documenso/Mattermost/n8n are live** without checking the current
per-service README "As built" sections or asking directly. See
[§9](#9-open-questions).

**Where would Adventure OS deploy?** No document in outdoor-hq mentions
Adventure OS. Per the stated house rule (public → CF edge, internal →
r2d2), an internal ops tool with no public-facing surface points toward the
r2d2 Dokploy box rather than Cloudflare Workers — but this is an inference
from the stated rule, not a decision anyone has made for Adventure OS. Flag
as open ([§9](#9-open-questions)), not settled.

---

## 7. Domain boundaries

outdoor-hq's domain and Adventure OS's domain do not currently overlap in
their entity models, and nothing found in this review contradicts Adventure
OS's own `docs/DOMAIN_MODEL.md`:

| | outdoor-hq | Adventure OS |
|---|---|---|
| Owns | Public marketing content (`Adventures`, `Packages`, `Holidays`, `Pages`, `Media`, `Tags` in Payload) + relay of the booking transaction flow to AdventureHub/WSPay | Internal operational knowledge graph: people, organisations, projects, bookings-as-read-model, tasks, documents, communications |
| "Users" means | CMS editors/admins (`Users`, `Invites`, `TotpChallenges`, `AuditLogs` collections) | Every person the org tracks (guides, partners, staff) |
| Source-of-truth stance | Content: Payload CMS (post-cutover, MD fully retired). Bookings: AdventureHub, never mirrored | Explicitly source-agnostic per system (`docs/PROJECT_CONSTITUTION.md` §4) — Adventure OS stores links/indexes/derived summaries, not the record itself |
| Booking data access | Full booking-flow contract (create booking, payment redirect) | Read-only aggregate availability only, if ever connected — same GDPR-driven boundary outdoor-hq already enforces on its own CMS side |

The one point of legitimate overlap is **AdventureHub availability data**
(aggregate counts only, never individual bookings or guest PII) — both
outdoor-hq's CMS side and any future Adventure OS Operations view are
allowed to read it, under the identical constraint outdoor-hq's own
integration docs already state for itself. No collision was found between
outdoor-hq's Payload domain model and Adventure OS's people/project/task
model — they describe genuinely different things and should stay that way.

---

## 8. Risks

1. **Vendoring `@outdoor-hq/ui-primitives` without a distribution decision
   creates silent drift.** If Adventure OS copies the source now, there is
   no update mechanism — the copy diverges from the original the moment
   either side changes. This is precisely the deferred decision Adventure
   OS's own `docs/COMPONENT-INVENTORY.md` flagged; it should be made
   explicitly (private registry / GitHub Packages / versioned copy with
   provenance tracking), not defaulted into by starting to copy files.
2. **Internal-tooling infra status is unclear (see [§6](#6-deployment-model)).**
   Planning Adventure OS integrations against Docmost/Documenso/Mattermost/
   n8n as "already there" would be premature given the contradictory
   shipped/not-built signals.
3. **outdoor-hq has no CI/CD and effectively one primary maintainer.**
   Any assumption that Adventure OS can lean on outdoor-hq's engineering
   process (code review cadence, automated gates, multi-person redundancy)
   does not hold — outdoor-hq's own ADRs describe a small-team, manual-ops
   posture as a deliberate, reasoned choice for *that* codebase, not a
   maturity gap to imitate.
4. **AdventureHub is still MVP-grade with open production blockers**
   (no server-side capacity enforcement, no active `Idempotency-Key`
   support, an unhandled `HTTP 500` on invalid input). Any Adventure OS
   feature that reads AdventureHub availability inherits these same
   upstream reliability caveats — this is a fact about the vendor, not
   about either repo's own code.
5. **This review's coverage is bounded by a shallow, single-branch clone.**
   `main` plus the open/closed PR list was reviewed; the ~34 other open
   feature branches were not individually fetched. If the "future
   architecture branch" referenced by the user is one of those branches
   rather than something already merged into `main`, it was not seen here
   (see [§9](#9-open-questions)).

---

## 9. Open questions

1. **Which branch is "the future architecture branch"?** No branch in
   outdoor-hq is named or scoped around Adventure OS or a general system
   architecture. The closest match found was PR #30,
   `docs/durmitor-cms-bridge-architecture` ("bridge architecture rewrite +
   Phase C plan"), whose content is now merged into
   `docs/specs/2026-05-07-durmitor-adventure-cms-design.md` and
   `docs/_archive/plans/2026-05-08-durmitor-adventure-cms-phase-c-plan.md`
   on `main` — but that document is about the **MD-to-CMS migration
   pattern** ([§2](#2-important-patterns-already-established)), not an
   Adventure OS architecture. Confirm whether that's the intended
   reference, or provide the actual branch name so it can be reviewed
   directly.
2. **Is the r2d2 tooling server actually live?** Resolve the
   shipped-vs-not-built contradiction in [§6](#6-deployment-model) before
   any Adventure OS integration work assumes Docmost/Documenso/Mattermost/
   n8n are reachable.
3. **What is the intended distribution path for `@outdoor-hq/ui-primitives`
   into Adventure OS** — versioned source copy, a new private package via
   GitHub Packages, or moving Adventure OS itself into the outdoor-hq
   monorepo as a new `apps/*` entry (which would give it workspace-native
   access but is a much larger structural decision with its own
   deployment-model implications)?
4. **Where does Adventure OS deploy, if/when it needs a real environment?**
   The public/internal house rule ([§3](#3-conventions-adventure-os-must-follow))
   points at the r2d2 box, but no one has decided this for Adventure OS
   specifically.
5. **Should Adventure OS's `docs/integrations/adventure-hub.md` be
   reconciled with outdoor-hq's `docs/adventure-hub/INTEGRATION-REFERENCE.md`?**
   The outdoor-hq version is empirically richer (confirmed staging
   environment, byte-level prod/staging diff, a maintained smoke test) but
   scoped to the full booking flow; Adventure OS only needs the aggregate
   availability slice. A straight merge would import scope Adventure OS
   doesn't need — worth a deliberate decision on what to import versus
   reference-by-link.
