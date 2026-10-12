# Fasla Storybook

Interactive documentation and testing environment for Fasla components.

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
import { MyComponent } from "../../../../packages/fasla-ui/registry/ui/my-component"

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

## Story layout rule

The same rule as `CLAUDE.md` ("Stories and docs examples: layout rule"), with
how to meet it:

- **Rows share a top edge.** Lay a matrix out as a CSS grid with
  `items-start` (or `items-stretch` plus `subgrid`, below). Never offset a
  cell by hand to make it line up.
- **No large empty gaps.** Spacing comes from the grid gap and the content.
  Do not pad a story to make room "just in case"; reserve exactly what is
  drawn.
- **Labels sit with what they describe.** A row label aligns with the
  component's own line (a tooltip's title, a field's label), not with the
  control underneath.
- **Two columns, not one long stack,** wherever the content fits.
- **Fit the Docs page.** Autodocs renders each story in a container about
  1000px wide that clips anything wider. Check every story there as well as
  in Canvas, in both directions and both themes.

**Held-open floating content** (see `stories/ui/Tooltip.stories.tsx`): a
tooltip or popover is positioned out of flow, so nothing makes room for it
unless the example does.

1. Portal it into its own cell (`container`), so it scrolls and clips with
   the story and inherits a themed panel's tokens.
2. Reserve exactly the room it takes around the trigger, worked out from
   its own rendered width and height plus its gap to the trigger. Never guess
   a height: Arabic lines are taller and text wraps. Do **not** work the room
   out from positions: reserving room moves the trigger, the tooltip follows
   a frame later, and a reading taken in between makes the room change
   again — the tooltip jitters for ever. Read the gap only right after Base
   UI places it (its positioner's `style` changes), and keep it unless a new
   reading is more than a pixel off, since positions are rounded to device
   pixels.
3. To line up triggers and captions across a row, make each cell
   `row-span-4 grid grid-rows-subgrid` (room above, trigger, room below,
   caption) inside a grid with `gap-y-0`: each row becomes as tall as its
   tallest cell needs.
4. After the room changes, dispatch a window `resize` event. The trigger has
   moved, and Base UI does not always notice a move caused by a parent's
   padding, which leaves the tooltip where it was.
5. Give the floating element `w-max` (Tooltip's positioner has it), or a
   narrow container squeezes its text a letter per line.
6. Never let it flip sides (`collisionAvoidance.side: "none"`). Above or
   below the trigger let it shift (`align: "shift"`): that only moves it
   sideways, and keeps the room Base UI reports independent of position.
   Beside the trigger turn shifting off (`align: "none"`), or Base UI pulls
   it toward the visible part of the page and it slides as you scroll.
7. Verify it stays still: sample each open tooltip's position for a few
   seconds, and its position relative to its trigger while scrolling, in
   both directions and themes, at desktop and phone width.

