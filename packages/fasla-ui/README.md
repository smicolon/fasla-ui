# @smicolon/fasla-ui

[![npm version](https://img.shields.io/npm/v/@smicolon/fasla-ui.svg)](https://www.npmjs.com/package/@smicolon/fasla-ui)
[![npm downloads](https://img.shields.io/npm/dm/@smicolon/fasla-ui.svg)](https://www.npmjs.com/package/@smicolon/fasla-ui)
[![license](https://img.shields.io/npm/l/@smicolon/fasla-ui.svg)](https://github.com/smicolon/fasla-ui/blob/main/LICENSE)

Arabic-first React components and blocks, built on shadcn/ui. RTL by default, bilingual by design.

Fasla (فاصلة) is a design system for React. Layouts use logical properties, so
a component mirrors under `dir="rtl"` with no extra classes, and the theme
brings a type scale with Arabic line heights and the Cairo font. Components are
distributed through a shadcn-compatible registry and copied into your project,
so the code is yours to change.

## Features

- **Arabic-first, RTL by default** - Logical properties throughout, so layouts mirror under `dir="rtl"`
- **29 Components** - 14 UI primitives, 8 app blocks and 7 animated effects
- **Themes** - Fasla's palette, or keep your brand's colours and add only the base layer
- **shadcn Compatible** - Works seamlessly with existing shadcn/ui projects
- **Tailwind CSS** - Utility-first styling with full customization
- **Framer Motion** - Animated effects that respect `prefers-reduced-motion`
- **TypeScript** - Full type safety and IntelliSense
- **Design Tokens** - Consistent spacing, colors, and density profiles
- **Accessible** - Keyboard navigation and visible focus styles on form controls
- **Own the Code** - The CLI copies each component's source into your project, so you ship only what you add

## Installation

Components are copied into your project with the CLI, as with shadcn/ui:

```bash
npx @smicolon/fasla-ui@latest init   # once per project: writes components.json and lib/utils.ts,
                                     # and installs clsx and tailwind-merge, which lib/utils.ts imports
npx @smicolon/fasla-ui@latest add button card shimmer-button
```

Keep `@latest`: without it, npx runs the copy of this package a project already
has installed, and 0.4 or older has no CLI.

`add` ends by installing the packages the components import, with your
project's package manager, and skips any the project already has at a
compatible version. If the install fails, it keeps the files it wrote and
prints the command to run. `--no-install` prints the command instead of
installing; for `button card shimmer-button` with npm it is:

```bash
npm install @radix-ui/react-slot class-variance-authority lucide-react framer-motion
```

The CLI runs from this package without installing it. The package also holds
the design tokens, the Tailwind preset and the motion presets, not the
components. Install it when you want those:

```bash
npm install @smicolon/fasla-ui
# or
yarn add @smicolon/fasla-ui
# or
pnpm add @smicolon/fasla-ui
```

## Components

### UI Primitives
Core building blocks with CVA variants for consistent styling:

| Component | Description |
|-----------|-------------|
| **Button** | Multiple variants (default, destructive, outline, secondary, ghost, link) with loading state |
| **Input** | Text input with validation states and icon support |
| **Input Number** | A number field with step buttons in five layouts, min and max limits, and Western digits in every language |
| **OTP Input** | A one-time code field with a slot per character, in four layouts, with SMS autofill and paste |
| **Textarea** | Multi-line text field that grows with its text, with a label, helper text and a counter |
| **Select** | Dropdown selection with search |
| **Calendar** | A month calendar for one day or a range, across up to three months, mirrored for RTL |
| **Date Picker** | A date field on Select's trigger that opens a Calendar, for one day or a range |
| **Dropdown Menu** | A menu of actions, checkboxes, radio choices and submenus, opened from a button |
| **Checkbox** | Checkbox with label and description |
| **Radio** | Single choice from a set, as a plain control or a bordered card |
| **Switch** | Toggle switch with multiple sizes |
| **Slider** | Choose a value or a range by dragging a thumb along a track, in three sizes |
| **Steps** | A display-only stepper for multi-step flows, horizontal or vertical, with done, current and upcoming steps |
| **Tabs** | Tabbed navigation with animations |
| **Accordion** | Headings that show or hide their content, in four styles |
| **Alert Dialog** | A modal that asks the user to confirm or cancel an action |
| **Sheet** | A panel that slides in from an edge of the screen, with a pinned footer and a scrolling body |
| **Dialog** | A modal for a focused task or form, in three widths, with a back button, pinned header and footer, and scrolling content |
| **Badge** | Status indicators and labels |
| **Breadcrumb** | A trail of links to the current page, with chevron or custom separators and a collapsed form |
| **Alert** | Messages for information, success, warnings and errors, with an action and a close button |
| **Pagination** | Page links built on Button, with Previous, Next and an ellipsis, in three variants |
| **Avatar** | User avatars with fallback initials |
| **Status Indicator** | Presence dot with a language-aware accessible name |
| **Card** | Flexible content containers |
| **Skeleton** | Loading placeholders |
| **Combobox** | Searchable select with autocomplete |
| **Carousel** | Scroll-snap slides with a dot stepper |
| **Content Carousel** | Card browser with previous/next arrows and 1-3 slots per view |

### App Blocks
Pre-built page compositions for rapid development:

| Component | Description |
|-----------|-------------|
| **AppShell** | Application layout with sidebar and header |
| **PageHeader** | Title, breadcrumbs, and action buttons |
| **DataTable** | Tables with selection, loading and empty states; pair with Pagination |
| **FormSection** | Grouped form fields with validation |
| **EmptyState** | Empty content placeholders with CTAs |
| **Sidebar** | Collapsible navigation sidebar |
| **Navbar** | 17 navigation bars (`navbar-*`), from a logo and links to floating pills and a shop header |
| **StatsCard** | Metric display cards |

### Effects
Animated components for visual flair (powered by Framer Motion):

| Component | Description |
|-----------|-------------|
| **ShimmerButton** | Button with animated shimmer effect |
| **AnimatedGradient** | Smooth gradient background animations |
| **BorderBeam** | Animated border glow effect |
| **Spotlight** | Cursor-following spotlight |
| **TextReveal** | Text reveal on scroll |
| **GlowCard** | Card with hover glow effect |
| **TypewriterText** | Typewriter text animation |

## Quick Start

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShimmerButton } from "@/components/ui/shimmer-button"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="space-x-4">
        <Button variant="default">Get Started</Button>
        <ShimmerButton>Learn More</ShimmerButton>
      </CardContent>
    </Card>
  )
}
```

## Peer Dependencies

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "tailwindcss": "^3.4.0 || ^4.1.4",
  "framer-motion": "^11.0.0 || ^12.0.0 || ^13.0.0 || ^14.0.0"  // optional, required for effects
}
```

## Theme

Components take every colour from your theme. `init` asks which of two layers
you want and installs it; both include the base layer. The shadcn commands below
install one too, or switch a project to the other one later.

They need a project that is already set up, with a `components.json`: in a new
project, run `npx @smicolon/fasla-ui@latest init` first, or
`npx shadcn@latest init`. Without one, the shadcn CLI sets the project up
itself, and its preset's colours replace Fasla's. On Next.js 14, use
`npx @smicolon/fasla-ui@latest init`: `shadcn init` writes Tailwind 4 styles and
loads Geist from `next/font`, which Next.js 14 has neither of.

```bash
# Starting from scratch: use Fasla's colours (palette, radius, Geist).
npx shadcn@latest add https://fasla.smicolon.com/r/theme.json https://fasla.smicolon.com/r/font-geist.json

# The same on Next.js 14, without Geist: its template already loads it.
npx shadcn@latest add https://fasla.smicolon.com/r/theme.json

# I have a brand: keep my colours (base layer only)
npx shadcn@latest add https://fasla.smicolon.com/r/theme-base.json
```

The base layer adds only what shadcn doesn't have: the success, warning and
info tokens and the soft tints, the type scale with Arabic line heights, the
Arabic setting, and the Cairo font. It never changes a colour you already
have. Arabic text uses `--font-arabic`; point it at another font to swap Cairo.

Fasla's base components replace shadcn's components of the same name in
`components/ui`; `add` asks before replacing a file that isn't Fasla's. Blocks
install to `components/blocks`.

## Documentation

Visit [fasla.smicolon.com](https://fasla.smicolon.com) for full documentation, examples, and API reference.

## Related

- [shadcn/ui](https://ui.shadcn.com) - The foundation this library builds on
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React

## License

MIT - See [LICENSE](https://github.com/smicolon/fasla-ui/blob/main/LICENSE) for details.
