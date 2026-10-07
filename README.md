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
npx @smicolon/cli init              # once per project: writes components.json and lib/utils.ts
npm install clsx tailwind-merge     # the two packages lib/utils.ts imports
npx @smicolon/cli add button card   # per component
```

`add` ends by printing an `npm install` line for the packages the components
need. For `button card` it is:

```bash
npm install @radix-ui/react-slot class-variance-authority lucide-react
```

The `@smicolon/fasla-ui` package holds the design tokens, the Tailwind preset
and the motion presets, not the components. Install it when you want those:

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

## Tailwind Configuration

Add FASLA UI to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    // ... your content
    "./node_modules/@smicolon/fasla-ui/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

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
