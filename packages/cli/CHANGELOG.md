# @smicolon/cli

## 0.3.1

### Patch Changes

- 3684401: Test trusted publishing with OIDC

## 0.3.0

### Minor Changes

- d7dc69a: Implement full registry integration for CLI
  - Add registry fetching from ui.smicolon.com/r/
  - `list` command now fetches available components from live registry
  - `add` command downloads actual component source code
  - Automatically transforms imports to match project configuration
  - Shows required dependencies after adding components
  - Shows correct import paths for added components

## 0.2.2

### Patch Changes

- 7d70eb2: Update documentation URL and improve package READMEs
  - Change documentation URL to ui.smicolon.com
  - Add npm badges (version, downloads, license)
  - Improve component documentation with organized tables
  - Add peer dependencies and Tailwind configuration sections

## 0.2.1

### Patch Changes

- Add package README for npm listing

## 0.2.0

### Minor Changes

- Initial release

  **@smicolon/smi-ui**
  - UI primitives: Button, Input, Textarea, Select, Checkbox, Switch, Tabs, Badge, Avatar, Card, Skeleton
  - App blocks: AppShell, PageHeader, DataTable, FormSection, EmptyState, Sidebar, Navbar, StatsCard
  - Effects: ShimmerButton, AnimatedGradient, BorderBeam, Spotlight, TextReveal, GlowCard, TypewriterText
  - Design tokens with density profiles (compact, comfortable, spacious)
  - Motion presets with reduced-motion support

  **@smicolon/cli**
  - `smi-ui init` - Initialize smi-ui in a project
  - `smi-ui add <component>` - Add components to your project
  - `smi-ui list` - List available components
