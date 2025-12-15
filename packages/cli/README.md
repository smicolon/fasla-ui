# @smicolon/cli

[![npm version](https://img.shields.io/npm/v/@smicolon/cli.svg)](https://www.npmjs.com/package/@smicolon/cli)
[![npm downloads](https://img.shields.io/npm/dm/@smicolon/cli.svg)](https://www.npmjs.com/package/@smicolon/cli)
[![license](https://img.shields.io/npm/l/@smicolon/cli.svg)](https://github.com/smicolon/smi-ui/blob/main/LICENSE)

CLI for installing [@smicolon/smi-ui](https://www.npmjs.com/package/@smicolon/smi-ui) components into your React project. Works like shadcn/ui CLI - components are copied directly into your codebase for full customization.

## Quick Start

```bash
# Initialize in your project
npx @smicolon/cli init

# Add components
npx @smicolon/cli add button card input

# List all available components
npx @smicolon/cli list
```

## Commands

### `init`

Initialize smi-ui in your project. Creates a `components.json` configuration file.

```bash
npx @smicolon/cli init

# Skip prompts with defaults
npx @smicolon/cli init -y
```

### `add <component...>`

Add one or more components to your project. Components are copied to your configured directory.

```bash
# Add a single component
npx @smicolon/cli add button

# Add multiple components at once
npx @smicolon/cli add button input textarea card

# Add effect components
npx @smicolon/cli add shimmer-button animated-gradient

# Add app blocks
npx @smicolon/cli add app-shell page-header data-table
```

### `list`

List all available components organized by category.

```bash
npx @smicolon/cli list
```

## Available Components

### UI Primitives
`avatar` `badge` `button` `card` `checkbox` `combobox` `input` `select` `skeleton` `switch` `tabs` `textarea`

### App Blocks
`app-shell` `data-table` `empty-state` `form-section` `navbar` `page-header` `sidebar` `stats-card`

### Effects
`animated-gradient` `border-beam` `glow-card` `shimmer-button` `spotlight` `text-reveal` `typewriter-text`

## Requirements

- **Node.js** 18+
- **React** 18+
- **Tailwind CSS** configured in your project
- **TypeScript** (recommended)

## How It Works

Unlike traditional npm packages, this CLI copies component source code directly into your project:

1. `init` creates a `components.json` with your project configuration
2. `add` downloads and copies components to your configured directory
3. You own the code - customize freely without package updates

This approach gives you full control over styling and behavior.

## Documentation

Visit [ui.smicolon.com](https://ui.smicolon.com) for:
- Component documentation and examples
- Installation guides
- Customization tips
- Design token reference

## Related

- [@smicolon/smi-ui](https://www.npmjs.com/package/@smicolon/smi-ui) - The component library
- [shadcn/ui](https://ui.shadcn.com) - Inspiration for this approach

## License

MIT
