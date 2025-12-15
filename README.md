# SMI UI

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

```bash
# Install the package
npm install @smicolon/smi-ui

# Or use the CLI
npx smi-ui init
npx smi-ui add button card
```

## Quick Start

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@smicolon/smi-ui"

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
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^11.0.0" // optional, for animations
}
```

## Tailwind Configuration

Add SMI UI to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    // ... your content
    "./node_modules/@smicolon/smi-ui/**/*.{js,ts,jsx,tsx}",
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
