# SMI-UI Storybook

Interactive documentation and testing environment for SMI-UI components.

## Getting Started

From the root of the monorepo:

```bash
# Install dependencies
bun install

# Start Storybook development server
bun run storybook
```

Or from this directory:

```bash
bun run dev
```

## Building

```bash
bun run build
```

## Structure

```
stories/
├── ui/                 # UI Primitives
│   ├── Button.stories.tsx
│   ├── Input.stories.tsx
│   ├── Card.stories.tsx
│   ├── Badge.stories.tsx
│   └── Skeleton.stories.tsx
├── blocks/             # App Blocks
│   └── EmptyState.stories.tsx
└── effects/            # Animated Effects
    ├── ShimmerButton.stories.tsx
    ├── AnimatedGradient.stories.tsx
    ├── TextReveal.stories.tsx
    ├── BorderBeam.stories.tsx
    └── Spotlight.stories.tsx
```

## Features

- **Autodocs**: Automatic documentation generation
- **Theme Switching**: Light/Dark mode support
- **Accessibility**: Built-in a11y testing with addon-a11y
- **Controls**: Interactive prop editing
- **Actions**: Event logging

## Adding New Stories

Create a new file in the appropriate category folder:

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { MyComponent } from "../../../../packages/smi-ui/registry/ui/my-component"

const meta: Meta<typeof MyComponent> = {
  title: "UI/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // default props
  },
}
```
