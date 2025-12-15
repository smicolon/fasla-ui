# @smicolon/cli

CLI for installing [smi-ui](https://www.npmjs.com/package/@smicolon/smi-ui) components into your project.

## Usage

```bash
# Initialize smi-ui in your project
npx @smicolon/cli init

# Add a component
npx @smicolon/cli add button

# Add multiple components
npx @smicolon/cli add button input card

# List all available components
npx @smicolon/cli list
```

## Commands

### `init`

Initialize smi-ui in your project. This will:
- Detect your project configuration
- Set up the required dependencies
- Configure paths for component installation

```bash
npx @smicolon/cli init
```

### `add <component...>`

Add one or more components to your project.

```bash
# Add a single component
npx @smicolon/cli add button

# Add multiple components
npx @smicolon/cli add button input textarea select

# Add an effect component
npx @smicolon/cli add shimmer-button

# Add a block component
npx @smicolon/cli add app-shell page-header
```

### `list`

List all available components.

```bash
npx @smicolon/cli list
```

## Available Components

### UI Primitives
`button`, `input`, `textarea`, `select`, `checkbox`, `switch`, `tabs`, `badge`, `avatar`, `card`, `skeleton`, `combobox`

### App Blocks
`app-shell`, `page-header`, `data-table`, `form-section`, `empty-state`, `sidebar`, `navbar`, `stats-card`

### Effects
`shimmer-button`, `animated-gradient`, `border-beam`, `spotlight`, `text-reveal`, `glow-card`, `typewriter-text`

## Requirements

- Node.js 18+
- A React project with Tailwind CSS configured

## Documentation

Visit [smi-ui.smicolon.dev](https://smi-ui.smicolon.dev) for full documentation.

## License

MIT
