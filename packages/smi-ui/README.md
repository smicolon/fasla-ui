# @smicolon/smi-ui

A professional UI component library built on shadcn/ui primitives. Provides both animated effects components (like Magic UI) and app building blocks, distributed via a shadcn-compatible registry.

## Installation

```bash
# Using the CLI (recommended)
npx @smicolon/cli init
npx @smicolon/cli add button

# Or install directly
npm install @smicolon/smi-ui
```

## Components

### UI Primitives
Basic building blocks with CVA variants:
- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Input** - Text input with validation states
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Checkbox** - Checkbox with label support
- **Switch** - Toggle switch with sizes
- **Tabs** - Tabbed navigation
- **Badge** - Status indicators
- **Avatar** - User avatars with fallback
- **Card** - Content containers
- **Skeleton** - Loading placeholders

### App Blocks
Page-level compositions for rapid development:
- **AppShell** - Application layout wrapper
- **PageHeader** - Title, breadcrumb, and actions
- **DataTable** - Sortable, filterable tables
- **FormSection** - Form grouping with validation
- **EmptyState** - Empty content placeholders
- **Sidebar** - Navigation sidebar
- **Navbar** - Top navigation bar
- **StatsCard** - Metric display cards

### Effects
Animated components for visual flair:
- **ShimmerButton** - Button with shimmer effect
- **AnimatedGradient** - Animated gradient backgrounds
- **BorderBeam** - Animated border effect
- **Spotlight** - Cursor-following spotlight
- **TextReveal** - Text reveal on scroll
- **GlowCard** - Card with glow effect
- **TypewriterText** - Typewriter animation

## Features

- **Design Tokens** - Density profiles: `compact`, `comfortable`, `spacious`
- **Motion Presets** - Framer Motion presets with `prefers-reduced-motion` support
- **shadcn Compatible** - Works with existing shadcn/ui setups
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling

## Usage

```tsx
import { Button } from "@smicolon/smi-ui/registry/ui/button"
import { ShimmerButton } from "@smicolon/smi-ui/registry/effects/shimmer-button"

export function MyComponent() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <ShimmerButton>Shimmer</ShimmerButton>
    </div>
  )
}
```

## Documentation

Visit [smi-ui.smicolon.dev](https://smi-ui.smicolon.dev) for full documentation.

## License

MIT
