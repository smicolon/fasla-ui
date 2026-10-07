# @smicolon/cli

[![npm version](https://img.shields.io/npm/v/@smicolon/cli.svg)](https://www.npmjs.com/package/@smicolon/cli)
[![npm downloads](https://img.shields.io/npm/dm/@smicolon/cli.svg)](https://www.npmjs.com/package/@smicolon/cli)
[![license](https://img.shields.io/npm/l/@smicolon/cli.svg)](https://github.com/smicolon/fasla-ui/blob/main/LICENSE)

CLI for installing [@smicolon/fasla-ui](https://www.npmjs.com/package/@smicolon/fasla-ui) components into your React project. Works like shadcn/ui CLI - components are copied directly into your codebase for full customization.

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

Initialize fasla-ui in your project. Writes `components.json` and the `cn` helper
(`lib/utils.ts`), then installs `clsx` and `tailwind-merge`, the two packages the
helper imports, with your project's package manager. If that install fails, it
prints the exact command to run.

```bash
npx @smicolon/cli init

# Skip prompts with defaults
npx @smicolon/cli init -y

# Write the files but don't install; print the install command instead
npx @smicolon/cli init --no-install
```

`init` also handles two setups that need more than a config file:

- **Vite, and any project without `"@/"`.** Every component imports
  `"@/lib/utils"`, and a Vite app has no `"@/"` alias until you add one. When no
  config maps it, `init` and `add` print the exact lines to add to your tsconfig
  files and `vite.config`. Run interactively, they warn and carry on; with
  `--yes` they stop and write nothing, since every folder would be a guess.
- **Projects set up with 0.3.x.** Their `components.json` has a `"smicolon"`
  registry entry the shadcn CLI rejects, and paths that put files in `src/src`.
  Running `init` again repairs it by default: it fixes the config, moves the
  files to where `"@/"` reaches, and updates the imports that pointed at the old
  places. It never overwrites a file; an older copy that differs is kept as
  `.bak` for you to check. `add` offers the same repair, after it has checked
  the component names.

  The whole plan is written to `.fasla-repair.json` before anything changes. If
  a step fails, everything is put back. If the run is killed part way, the next
  `init` or `add` shows what is left and asks "Resume the repair?"; with `--yes`
  it doesn't resume, and says how to resume or abandon instead. Since that file
  sits in your project, it is checked first: any step a 0.3 repair of your
  `components.json` wouldn't make — moving a file other than a component from
  its 0.3 path to its repaired one, writing anything but updated imports — is
  refused, and nothing changes. Only one run repairs at a time; a second one
  exits and says so (`.fasla-repair.lock`).

### Package managers

The CLI reads your lockfile to pick the package manager (`package-lock.json`,
`pnpm-lock.yaml`, `yarn.lock` or `bun.lock`; npm when there is none, and the
nearest one in a monorepo). Every install it runs or prints uses that package
manager's syntax, so a pnpm project gets `pnpm add`, never `npm install`.

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
`avatar` `badge` `button` `card` `carousel` `checkbox` `combobox` `content-carousel` `input` `select` `skeleton` `status-indicator` `switch` `tabs` `textarea`

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

- [@smicolon/fasla-ui](https://www.npmjs.com/package/@smicolon/fasla-ui) - The component library
- [shadcn/ui](https://ui.shadcn.com) - Inspiration for this approach

## License

MIT
