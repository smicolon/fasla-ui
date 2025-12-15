# @smicolon/smi-ui

[![npm version](https://img.shields.io/npm/v/@smicolon/smi-ui.svg)](https://www.npmjs.com/package/@smicolon/smi-ui)
[![npm downloads](https://img.shields.io/npm/dm/@smicolon/smi-ui.svg)](https://www.npmjs.com/package/@smicolon/smi-ui)
[![license](https://img.shields.io/npm/l/@smicolon/smi-ui.svg)](https://github.com/smicolon/smi-ui/blob/main/LICENSE)

A professional React UI component library built on **shadcn/ui** primitives. Provides animated effects components (like Magic UI), app building blocks, and design tokens - all distributed via a shadcn-compatible registry.

## Features

- **30+ Components** - UI primitives, app blocks, and animated effects
- **shadcn Compatible** - Works seamlessly with existing shadcn/ui projects
- **Tailwind CSS** - Utility-first styling with full customization
- **Framer Motion** - Smooth animations with `prefers-reduced-motion` support
- **TypeScript** - Full type safety and IntelliSense
- **Design Tokens** - Consistent spacing, colors, and density profiles
- **Accessible** - WCAG compliant with keyboard navigation support
- **Tree Shakeable** - Import only what you need

## Installation

```bash
# Using the CLI (recommended)
npx @smicolon/cli init
npx @smicolon/cli add button

# Or install the package directly
npm install @smicolon/smi-ui
# or
yarn add @smicolon/smi-ui
# or
pnpm add @smicolon/smi-ui
```

## Components

### UI Primitives
Core building blocks with CVA variants for consistent styling:

| Component | Description |
|-----------|-------------|
| **Button** | Multiple variants (default, destructive, outline, secondary, ghost, link) with loading state |
| **Input** | Text input with validation states and icon support |
| **Textarea** | Multi-line text input with auto-resize |
| **Select** | Dropdown selection with search |
| **Checkbox** | Checkbox with label and description |
| **Switch** | Toggle switch with multiple sizes |
| **Tabs** | Tabbed navigation with animations |
| **Badge** | Status indicators and labels |
| **Avatar** | User avatars with fallback initials |
| **Card** | Flexible content containers |
| **Skeleton** | Loading placeholders |
| **Combobox** | Searchable select with autocomplete |

### App Blocks
Pre-built page compositions for rapid development:

| Component | Description |
|-----------|-------------|
| **AppShell** | Application layout with sidebar and header |
| **PageHeader** | Title, breadcrumbs, and action buttons |
| **DataTable** | Sortable, filterable tables with pagination |
| **FormSection** | Grouped form fields with validation |
| **EmptyState** | Empty content placeholders with CTAs |
| **Sidebar** | Collapsible navigation sidebar |
| **Navbar** | Top navigation bar |
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
import { Button } from "@smicolon/smi-ui/registry/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@smicolon/smi-ui/registry/ui/card"
import { ShimmerButton } from "@smicolon/smi-ui/registry/effects/shimmer-button"

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
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^11.0.0"  // optional, required for effects
}
```

## Tailwind Configuration

Add smi-ui to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    // ... your content paths
    "./node_modules/@smicolon/smi-ui/**/*.{js,ts,jsx,tsx}",
  ],
}
```

## Documentation

Visit [ui.smicolon.com](https://ui.smicolon.com) for full documentation, examples, and API reference.

## Related

- [@smicolon/cli](https://www.npmjs.com/package/@smicolon/cli) - CLI for adding components
- [shadcn/ui](https://ui.shadcn.com) - The foundation this library builds on
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React

## License

MIT - See [LICENSE](https://github.com/smicolon/smi-ui/blob/main/LICENSE) for details.
