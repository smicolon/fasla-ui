# FASLA UI

Professional UI components with animations and app building blocks for React applications.

Built with [Tailwind CSS](https://tailwindcss.com), [Framer Motion](https://www.framer.com/motion/), and [Radix UI](https://radix-ui.com).

## Features

- **UI Primitives** - Button, Input, Card, Badge, Skeleton with CVA variants
- **App Blocks** - AppShell, PageHeader, DataTable, EmptyState, FormSection
- **Effects** - ShimmerButton, AnimatedGradient, TextReveal, BorderBeam, Spotlight
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

`add` ends by printing the install command for the packages the components
need, in your project's package manager. For `button card` with npm it is:

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

Visit [ui.smicolon.com](https://ui.smicolon.com) for full documentation.

## Components

### UI Primitives

| Component | Description |
|-----------|-------------|
| Button | All variants (default, destructive, outline, secondary, ghost, link), sizes, loading state |
| Input | Text input with validation states, icons |
| Card | Composable card with header, content, footer |
| Badge | Status indicators with variants |
| Skeleton | Loading placeholders |

### App Blocks

| Component | Description |
|-----------|-------------|
| AppShell | Sidebar and header layout system |
| PageHeader | Title, breadcrumbs, actions |
| DataTable | Sortable, filterable tables with pagination |
| EmptyState | Contextual empty states with actions |
| FormSection | Grouped form fields |

### Effects

| Component | Description |
|-----------|-------------|
| ShimmerButton | Button with shimmer animation |
| AnimatedGradient | Animated gradient backgrounds |
| TextReveal | Character-by-character reveal |
| BorderBeam | Animated border effect |
| Spotlight | Cursor-following spotlight |

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
npx shadcn@latest add https://ui.smicolon.com/r/theme.json https://ui.smicolon.com/r/font-geist.json

# The same on Next.js 14, without Geist: its template already loads it.
npx shadcn@latest add https://ui.smicolon.com/r/theme.json

# I have a brand: keep my colours (base layer only)
npx shadcn@latest add https://ui.smicolon.com/r/theme-base.json
```

The base layer adds only what shadcn doesn't have: the success, warning and
info tokens and the soft tints, the type scale with Arabic line heights, the
Arabic setting, and the Cairo font. It never changes a colour you already
have. Arabic text uses `--font-arabic`; point it at another font to swap Cairo.

Fasla's base components replace shadcn's components of the same name in
`components/ui`; `add` asks before replacing a file that isn't Fasla's. Blocks
install to `components/blocks`.

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
