# @smicolon/fasla-ui

[![npm version](https://img.shields.io/npm/v/@smicolon/fasla-ui.svg)](https://www.npmjs.com/package/@smicolon/fasla-ui)
[![npm downloads](https://img.shields.io/npm/dm/@smicolon/fasla-ui.svg)](https://www.npmjs.com/package/@smicolon/fasla-ui)
[![license](https://img.shields.io/npm/l/@smicolon/fasla-ui.svg)](https://github.com/smicolon/fasla-ui/blob/main/LICENSE)

Arabic-first React components, built on shadcn/ui. RTL by default, bilingual by design.

Fasla (فاصلة) is a design system for React. Layouts use logical properties, so
a component mirrors under `dir="rtl"` with no extra classes, and the theme
brings a type scale with Arabic line heights and the Cairo font. Components are
distributed through a shadcn-compatible registry and copied into your project,
so the code is yours to change.

## Features

- **Arabic-first, RTL by default** - Logical properties throughout, so layouts mirror under `dir="rtl"`
- **42 Components** - 35 UI primitives and 7 animated effects
- **Themes** - Fasla's palette, or keep your brand's colours and add only the base layer
- **shadcn Compatible** - Works seamlessly with existing shadcn/ui projects
- **Tailwind CSS** - Utility-first styling with full customization
- **Motion** - Animated effects, on the `framer-motion` package, that respect `prefers-reduced-motion`
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

Without a terminal (an agent or a CI job), `init` asks nothing: pass `--yes`
and the theme. In a new project:

```bash
npx @smicolon/fasla-ui@latest init --yes --theme fasla
```

Under `--yes`, the theme default is decided by `--primary`: a stylesheet that
sets it keeps its colours (`brand`), and one that doesn't gets Fasla's
(`fasla`).

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

### UI Primitives (35)
Core building blocks with CVA variants for consistent styling:

| Component | Description |
|-----------|-------------|
| **Accordion** | Stacked headings that each show or hide a section of content |
| **Alert** | A message box for information, success, warnings and errors |
| **Alert Dialog** | A modal dialog on Base UI that asks the user to confirm or cancel an action |
| **Avatar** | A user's photo, initials or icon, in three sizes and two radii, with an optional border and presence dot |
| **Badge** | A compact inline label for status, category or metadata |
| **Breadcrumb** | A composable trail of links to the current page |
| **Button** | A button in five types (solid, soft, outline, ghost, link) and three tones, four sizes and the matching icon-button sizes, two radii, and a loading state |
| **Calendar** | A month calendar on react-day-picker |
| **Card** | A card component with header, content, and footer sections |
| **Carousel** | A scroll-snap carousel with a dot stepper |
| **Checkbox** | An accessible checkbox for binary selections with controlled state |
| **Combobox** | A searchable combobox with single or multiple selection |
| **Content Carousel** | A horizontal card browser with previous and next arrows, showing one, two or three content slots per view |
| **Date Picker** | A date field on Base UI's Popover |
| **Dialog** | A modal dialog on Base UI for focused tasks and forms |
| **Dropdown Menu** | A menu of actions on Base UI, opened from a button |
| **Fasla Logo** | The Fasla logo |
| **Input** | A text field with a label, helper labels, start and end icons, success and invalid states, four sizes and two radii |
| **Input Number** | A number field with step buttons in five layouts, Input's success, invalid and disabled states, min and max limits, and Western digits in every language, mirrored for RTL |
| **OTP Input** | A one-time code field on input-otp, with a slot per character in groups, separators or spaced slots |
| **Pagination** | A composable row of page links built on Button |
| **Progress** | A determinate progress bar in three sizes, with an optional percentage label, that fills from the inline start and mirrors for RTL |
| **Radio** | An accessible radio for choosing one option from a set, with a plain and a bordered layout variant |
| **Select** | A select field on Base UI |
| **Sheet** | A panel on Base UI that slides in from an edge of the screen |
| **Sidebar** | App navigation that collapses to icons |
| **Skeleton** | Loading placeholders that replace shadcn's Skeleton |
| **Slider** | A slider on Base UI for one value or a range, in three track sizes with a 16px thumb |
| **Social Icons** | Brand marks for 32 platforms, from Google and Apple to Slack and Zoom, in their own colours, one quiet muted colour, or the text colour around them |
| **Status Indicator** | A presence dot — online, away, busy or offline — with an accessible name in the page's language, so colour never carries the status alone |
| **Steps** | A display-only stepper for multi-step flows |
| **Switch** | An accessible switch for on-off settings |
| **Tabs** | Accessible, keyboard-navigable tabs (also called pills) |
| **Textarea** | A multi-line text field that grows with its text, with a label, helper text, a character counter, and success and invalid states |
| **Tooltip** | A short hint on hover or keyboard focus |

### Effects (7)
Animated components for visual flair; five of them use Motion (the `framer-motion` package):

| Component | Description |
|-----------|-------------|
| **Animated Gradient** | Animated gradient background and text effects |
| **Border Beam** | Animated border beam and glowing border effects |
| **Glow Card** | Card with a cursor-following glow on hover |
| **Shimmer Button** | A button with animated shimmer effect |
| **Spotlight** | Cursor-following spotlight effect |
| **Text Reveal** | Character and word reveal animations |
| **Typewriter Text** | Text that types itself out, one character at a time |

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
      <CardContent className="flex items-center gap-4">
        <Button variant="default">Get Started</Button>
        <ShimmerButton>Learn More</ShimmerButton>
      </CardContent>
    </Card>
  )
}
```

`variant="default"` is the type Figma calls Solid, and `md` is the default size,
so both props can be left out.

## Peer Dependencies

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "tailwindcss": "^3.4.0 || ^4.1.4",
  "framer-motion": "^11.0.0 || ^12.0.0 || ^13.0.0 || ^14.0.0"
}
```

`framer-motion` is optional (`peerDependenciesMeta`): only the motion presets
and five of the seven effects use it.

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

# The same on Next.js 14, without Geist: next/font/google has no Geist there, so
# shadcn would leave app/layout.tsx unchanged and ask you to add the fonts by
# hand. The Next.js 14 template already loads Geist from its own files.
npx shadcn@latest add https://fasla.smicolon.com/r/theme.json

# I have a brand: keep my colours (base layer only)
npx shadcn@latest add https://fasla.smicolon.com/r/theme-base.json
```

The base layer adds only what shadcn doesn't have: the success, warning and
info tokens and the soft tints, the type scale with Arabic line heights, the
Arabic setting, and the Cairo font. It never changes a colour you already
have. Arabic text uses `--font-arabic`; point it at another font to swap Cairo.

Fasla's base components replace shadcn's components of the same name in
`components/ui`; `add` asks before replacing a file that isn't Fasla's.

## Documentation

Visit [fasla.smicolon.com](https://fasla.smicolon.com) for full documentation, examples, and API reference.

## Related

- [shadcn/ui](https://ui.shadcn.com) - The foundation this library builds on
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Motion](https://motion.dev) - Animation library for React, formerly Framer Motion (the `framer-motion` package)

## License

The code is MIT licensed: see [LICENSE](https://github.com/smicolon/fasla-ui/blob/main/LICENSE). The Fasla and Smicolon names, logos and brand marks are reserved by Smicolon GmbH and are not licensed under MIT; see [NOTICE](https://github.com/smicolon/fasla-ui/blob/main/NOTICE) for them and for the fonts, icons and photos.
