# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **@smicolon/fasla-ui**, a professional UI component library built on shadcn/ui primitives. It provides both animated effects components (like Magic UI) and app building blocks, distributed via a shadcn-compatible registry.

## Design and Figma work

This repo is the code library; the design system itself is maintained in Figma. For anything
touching Figma, design tokens, RTL or the design system, **read `design/FIGMA.md` first** — then
`design/INSTRUCTIONS.md` (standing instructions) and `design/DESIGN.md` (the visual system).

To find a specific component, start at **`design/index-atoms.md`** — every atom in the Figma file
with a direct link, its variant axes, whether it has RTL, English and Arabic docs, and whether it
is implemented in the code registry. `design/index-atoms.json` holds the same data for grepping.
Both are generated: regenerate with the `figma-index` skill, never edit them by hand. They carry
the date they were measured — **check it before trusting them**, and re-run the skill if it is old.
A blocks index will sit beside them as `design/index-blocks.*` once the block pages are
consolidated; it does not exist yet.

The skills, agents and slash-command launchers that drive that work live in `.agents/`, with
`.claude/` symlinked to it. They are **repo-anchored**: run them with the repo root as the working
directory, or their relative paths will not resolve.

## Commands

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Run Storybook (development)
bun run storybook

# Build Storybook
bun run build-storybook

# Typecheck all packages
bun run typecheck

# Lint all packages
bun run lint

# Run tests
bun run test

# Format code
bun run format

# Build single package
bun run --cwd packages/fasla-ui build

# CLI commands (after build)
npx fasla-ui init          # Initialize in a project
npx fasla-ui add button    # Add a component
npx fasla-ui list          # List available components
```

## Architecture

### Monorepo Structure
```
fasla-ui/
├── packages/
│   ├── fasla-ui/           # Core library
│   │   ├── registry/
│   │   │   ├── ui/       # Primitives (button, input, card)
│   │   │   ├── blocks/   # Composites (AppShell, PageHeader)
│   │   │   ├── effects/  # Animated components
│   │   │   └── hooks/    # Shared hooks
│   │   └── src/
│   │       ├── tokens/   # Design tokens
│   │       ├── motion/   # Motion presets
│   │       └── lib/      # Utilities (cn)
│   │
│   └── cli/              # CLI package (@smicolon/cli)
│
├── apps/
│   ├── storybook/        # Component showcase
│   └── docs/             # Documentation site (Next.js + MDX)
```

### Key Concepts

**UI Primitives** (`registry/ui/`): Base components with CVA variants - button, input, card, badge, skeleton.

**App Blocks** (`registry/blocks/`): Page-level compositions - AppShell, PageHeader, DataTable, FormSection, EmptyState.

**Effects** (`registry/effects/`): Animated components - ShimmerButton, AnimatedGradient, TextReveal, BorderBeam, Spotlight.

**Tokens** (`src/tokens/`): Design tokens with density profiles: `compact`, `comfortable`, `spacious`.

**Motion Presets** (`src/motion/presets.ts`): Framer Motion presets with automatic `prefers-reduced-motion` support.

**Registry** (`registry.json`): shadcn-compatible registry format for CLI distribution.

### Component Pattern (CVA)
All components use class-variance-authority for variants:
```tsx
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "...", outline: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
})
```

### Utility Function
Use `cn()` from `@/lib/utils` for merging Tailwind classes:
```tsx
import { cn } from "@/lib/utils"
cn("base-class", condition && "conditional-class", className)
```

## Implementation Rules (from UI_STANDARDS.md)

### Must Follow
- Use semantic tokens only (CSS variables + Tailwind theme), no raw hex colors
- Prefer blocks over page-only bespoke components
- Every surface must have: loading state, empty state, error state, disabled state
- All motion must use presets from `src/lib/motion/presets.ts`
- Support `prefers-reduced-motion` for all animations
- Icon-only buttons require `aria-label`
- Focus styles must be visible

### Standard Page Anatomy
```
AppShell
  └── PageHeader (title + breadcrumb + actions)
      └── Content sections (cards / panels / tables)
          └── Footer actions (sticky save bar when applicable)
```

## Localisation

`apps/docs` is bilingual (English, Arabic) via next-intl. Routes live under
`app/[locale]/`, strings under `apps/docs/messages/{en,ar}.json`.

Adding a string means adding the key to **both** files — a parity test fails
otherwise. Async server pages must call `setRequestLocale(locale)` or the
static export breaks. See `docs/LOCALISATION.md`.

## Workflow

1. Create a **Block Map** for each screen using `docs/BLOCK_MAP_TEMPLATE.md` (2-5 min)
2. Implement **structure pass** first: layout, semantics, all states (loading/empty/error/success)
3. Implement **polish pass**: motion presets, responsive layout, spacing/typography consistency
4. New blocks go in `packages/fasla-ui/registry/blocks/` with Storybook stories

## Prompt Reference (from docs/CLAUDE_CODE_PROMPTS.md)

For structure pass: focus on correct layout, semantics, component composition, and all states.
For polish pass: motion presets only, responsive improvements, skeleton layouts, token-consistent spacing.
