# FASLA UI

Arabic-first React components: 35 UI primitives and 7 animated effects, 42 in all, copied into your project by a CLI.

Built with [Tailwind CSS](https://tailwindcss.com), [Framer Motion](https://www.framer.com/motion/), and [Radix UI](https://radix-ui.com).

## Features

- **35 UI Primitives** - Button, Input, Select, Dialog, Tabs, Sidebar and more, with CVA variants
- **7 Effects** - ShimmerButton, AnimatedGradient, TextReveal, BorderBeam, Spotlight, GlowCard, TypewriterText
- **Design Tokens** - Consistent spacing, colors, typography
- **Motion Presets** - Built-in animations that respect `prefers-reduced-motion`
- **shadcn Compatible** - Works with the shadcn CLI

## Installation

Components are copied into your project with the CLI, as with shadcn/ui:

```bash
npx @smicolon/fasla-ui@latest init              # once per project: writes components.json and lib/utils.ts,
                                                # and installs clsx and tailwind-merge, which lib/utils.ts imports
npx @smicolon/fasla-ui@latest add button card   # per component
```

Keep `@latest`: without it, npx runs the copy of `@smicolon/fasla-ui` a project
already has installed, and 0.4 or older has no CLI.

`add` ends by installing the packages the components import, with your
project's package manager, and skips any the project already has at a
compatible version. If the install fails, it keeps the files it wrote and
prints the command to run. `--no-install` prints the command instead of
installing; for `button card` with npm it is:

```bash
npm install @radix-ui/react-slot class-variance-authority lucide-react
```

The CLI runs from `@smicolon/fasla-ui` without installing it. The package also
holds the design tokens, the Tailwind preset and the motion presets, not the
components. Install it when you want those:

```bash
npm install @smicolon/fasla-ui
```

## Quick Start

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default" size="default">
          Get Started
        </Button>
      </CardContent>
    </Card>
  )
}
```

## Documentation

Visit [fasla.smicolon.com](https://fasla.smicolon.com) for full documentation.

## Components

### UI Primitives (35)

| Component | Description |
|-----------|-------------|
| Accordion | Stacked headings that each show or hide a section of content |
| Alert | A message box for information, success, warnings and errors |
| Alert Dialog | A modal dialog on Base UI that asks the user to confirm or cancel an action |
| Avatar | A user's photo, initials or icon, in three sizes and two radii, with an optional border and presence dot |
| Badge | A compact inline label for status, category or metadata |
| Breadcrumb | A composable trail of links to the current page |
| Button | A button in five types (solid, soft, outline, ghost, link) and three tones, four sizes and the matching icon-button sizes, two radii, and a loading state |
| Calendar | A month calendar on react-day-picker |
| Card | A card component with header, content, and footer sections |
| Carousel | A scroll-snap carousel with a dot stepper |
| Checkbox | An accessible checkbox for binary selections with controlled state |
| Combobox | A searchable combobox with single or multiple selection |
| Content Carousel | A horizontal card browser with previous and next arrows, showing one, two or three content slots per view |
| Date Picker | A date field on Base UI's Popover |
| Dialog | A modal dialog on Base UI for focused tasks and forms |
| Dropdown Menu | A menu of actions on Base UI, opened from a button |
| Fasla Logo | The Fasla logo |
| Input | A text field with a label, helper labels, start and end icons, success and invalid states, four sizes and two radii |
| Input Number | A number field with step buttons in five layouts, Input's success, invalid and disabled states, min and max limits, and Western digits in every language, mirrored for RTL |
| OTP Input | A one-time code field on input-otp, with a slot per character in groups, separators or spaced slots |
| Pagination | A composable row of page links built on Button |
| Progress | A determinate progress bar in three sizes, with an optional percentage label, that fills from the inline start and mirrors for RTL |
| Radio | An accessible radio for choosing one option from a set, with a plain and a bordered layout variant |
| Select | A select field on Base UI |
| Sheet | A panel on Base UI that slides in from an edge of the screen |
| Sidebar | App navigation that collapses to icons |
| Skeleton | Loading placeholders that replace shadcn's Skeleton |
| Slider | A slider on Base UI for one value or a range, in three track sizes with a 16px thumb |
| Social Icons | Brand marks for 32 platforms, from Google and Apple to Slack and Zoom, in their own colours, one quiet muted colour, or the text colour around them |
| Status Indicator | A presence dot — online, away, busy or offline — with an accessible name in the page's language, so colour never carries the status alone |
| Steps | A display-only stepper for multi-step flows |
| Switch | An accessible switch for on-off settings |
| Tabs | Accessible, keyboard-navigable tabs (also called pills) |
| Textarea | A multi-line text field that grows with its text, with a label, helper text, a character counter, and success and invalid states |
| Tooltip | A short hint on hover or keyboard focus |

### Effects (7)

| Component | Description |
|-----------|-------------|
| Animated Gradient | Animated gradient background and text effects |
| Border Beam | Animated border beam and glowing border effects |
| Glow Card | Card with a cursor-following glow on hover |
| Shimmer Button | A button with animated shimmer effect |
| Spotlight | Cursor-following spotlight effect |
| Text Reveal | Character and word reveal animations |
| Typewriter Text | Text that types itself out, one character at a time |

## Peer Dependencies

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "tailwindcss": "^3.4.0 || ^4.1.4",
  "framer-motion": "^11.0.0 || ^12.0.0 || ^13.0.0 || ^14.0.0" // optional, for animations
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
`components/ui`; `add` asks before replacing a file that isn't Fasla's.

## Development

```bash
# Install dependencies
bun install

# Start Storybook
bun run storybook

# Run tests
bun run test

# Build all packages
bun run build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT - See [LICENSE](./LICENSE) for details.
