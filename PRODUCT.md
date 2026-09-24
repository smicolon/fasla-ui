# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, served equally. Decisions have to work for both.

- **Smicolon's own teams.** Smicolon GmbH's designers and developers use Fasla to ship client
  products. For them it is the standard every screen is built from, so they don't design each
  project from scratch.
- **External product teams.** Fasla is also a product Smicolon offers and sells to other teams.
  The ones who get the most from it ship in both **Arabic and English**. Most would otherwise have
  to design their product twice or bolt RTL on after launch.

Both groups use it in two places: **designers** in the Figma file, and **developers** through the
shadcn-compatible registry, the `fasla-ui` CLI and the npm package. A third consumer is coming
into scope: **AI agents** that pick components and fill them with content on a person's behalf.

## Product Purpose

Fasla (Arabic: **فاصلة**) is a bilingual design system and React component library. Its job is to
let a team **ship one product in English and Arabic without designing it twice.**

The code side is built on shadcn/ui primitives. It has three layers, UI primitives, page-level
blocks and animated effects, all installed by a CLI that copies source into the consumer's project.

Success means:

- an Arabic screen is built from the same components as the English one, with one property changed;
- the Figma file and the code agree, token for token;
- a team can adopt the system and own the code without fighting a black box.

## Positioning

**Bilingual and RTL-first is the core claim.** Arabic is not a localisation layer added
afterwards. It is a first-class direction:

- `Direction = LTR / RTL` is a property of the component itself, not a separate file or port;
- the Arabic type ramp is a 1:1 twin of the English one;
- an RTL variant counts as part of the component, not downstream work.

Two things support that claim. Neither stands in for it:

1. **Figma and code parity.** Both sides use the same tokens (the `☾  Mode` collection), so a
   designer's decision and a developer's build are the same decision.
2. **Agent-ready documentation.** Components are documented with explicit content rules, so an AI
   agent can select and fill them safely.

The source-ownership CLI is shared with shadcn/ui. It is a feature of Fasla, but it doesn't set
Fasla apart.

## Operating Context

- **The Figma file is the source of truth for the design system** (fileKey
  `yGEQmCZOvs7KptsYUdB0Xg`). The repository is the code library. `design/FIGMA.md` covers how the
  file and its tooling work, and `design/INSTRUCTIONS.md` records the standing decisions.
  `UI_STANDARDS.md` defines how the code is built.
- **Design work runs as a fixed pipeline.**
  - Blocks: desktop LTR build → Tablet and Mobile breakpoints → Arabic RTL variants → English doc
    → Arabic doc.
  - Atoms: RTL variants → English doc → Arabic doc.
  - Each pass is its own session, driven by the skills and agents in `.agents/`.
- **The documentation site (`apps/docs`) ships in both locales**, `/en` (LTR) and `/ar` (RTL), as
  a static export. `docs/LOCALISATION.md` is the rulebook. Storybook (`apps/storybook`) is the
  component showcase.
- **Component status lives in the Figma page names** and is indexed in `design/index-atoms.md`.
  That file is generated and dated, so check its date before trusting it.

## Capabilities and Constraints

- **Two themes, one set of bindings.** Light is the default, Dark is the second mode. Every colour,
  spacing, radius and type value is token-bound, in Figma and in code.
- **Every surface ships its loading, empty, error and disabled states.** This is a stated promise
  of the product, not a nice-to-have.
- **Motion respects `prefers-reduced-motion`** through the shared presets. Nothing is animated
  ad hoc.
- **The registry defines three density profiles**: compact, comfortable (the default) and spacious.
- **Arabic copy is written, not translated.** It is Modern Standard Arabic and uses Western
  numerals. Technical and brand terms stay in Latin script. Arabic text is never letter-spaced,
  set in all caps or italicised. Demo people's names are transliterated.
- **Licensing: the core is MIT.** Fasla is also sold commercially. What is sold beyond the MIT
  core, and at what price, is **not recorded here**. Do not state tiers, prices or licence terms
  until they are confirmed.
- **Terminology.** An *atom* has a `Size` axis. A *block* is a family in one component set with a
  `Type` axis, plus `Breakpoint` and `Direction` axes.

## Brand Commitments

- **The name is Fasla in English and فاصلة in Arabic.** Never mix scripts within one direction.
  Never use an invented filler brand (Acme, Your Brand).
- **The previous name, SMI-UI / smicolon, is retired.** Leftover occurrences are raised with the
  designer, never swept silently.
- **Fasla is made by Smicolon GmbH in Germany.**
- **Brand identity V2.5 governs the brand.** Its Arabic-writing and mirroring rules are summarised
  in `docs/LOCALISATION.md`.
  - The Fasla mark and its comma never mirror.
  - The RTL lockup is its own drawing, not a flipped copy of the LTR lockup.

## Evidence on Hand

- **Brand assets** are in `apps/docs/public/brand/`: the mark, the comma, the app icon, the
  favicon, and the LTR and RTL lockups, each on light and dark.
- **The Figma file itself**, with the atom inventory in `design/index-atoms.md` and `.json` and the
  shipped block families listed in `design/FIGMA.md`.
- **The live bilingual docs site and Storybook** in `apps/`.
- **No customer names, testimonials, case studies, adoption figures or benchmarks are recorded.**
  Do not invent any. Sample data in components uses fictional companies and people by design.

## Product Principles

1. **Design once, ship in two directions.** When a decision works in English but costs extra
   work in Arabic, the decision is wrong. RTL is judged as part of the component, never deferred.
2. **Serve both audiences with one system.** What Smicolon ships to clients and what external
   teams adopt is the same product. There is no internal fork.
3. **Figma and code are one source of truth.** A token, variant or state that exists on one side
   and not the other is a defect, not a backlog item.
4. **Completeness over novelty.** Every component ships all its states, both themes and both
   directions before it counts as done. Build from existing parts. Add a new pattern only when it
   has been asked for, or when it is reused across projects.
5. **Legible to machines as well as people.** Documentation states what each part is for and its
   content limits, so an agent can use a component as reliably as a person can.

## Accessibility & Inclusion

- **Required standard: WCAG 2.2 AA.** It applies in both themes and both directions.
- **Baseline requirements** from `UI_STANDARDS.md`:
  - full keyboard reachability in a logical focus order;
  - visible focus styles;
  - labelled form inputs;
  - an `aria-label` on every icon-only button;
  - a non-animated fallback for every motion.
- **Known open defects against AA:**
  - `muted-foreground` on `muted` measures **4.35:1**, below the 4.5:1 minimum. It is used by
    placeholder and caption text.
  - `Button` Solid/primary is unreadable in Dark mode.
  - No formal audit has been run yet. Contrast pairs are inherited from shadcn defaults, not
    measured.
- **Inclusion means Arabic readers get equal quality**: correct mirroring, Arabic line heights of
  1.7–1.8 for body copy, and proper plural agreement across all six Arabic plural forms.
