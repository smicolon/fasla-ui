# @smicolon/cli

## [0.3.2](https://github.com/smicolon/fasla-ui/compare/cli-v0.3.1...cli-v0.3.2) (2026-09-16)


### Bug Fixes

* add repository url for provenance verification ([1a50ff9](https://github.com/smicolon/fasla-ui/commit/1a50ff91ba7ff02d9ecfe8e5bffd27cf0d588855))


### Refactors

* rename smi-ui to fasla-ui ([#4](https://github.com/smicolon/fasla-ui/issues/4)) ([91ee183](https://github.com/smicolon/fasla-ui/commit/91ee1839cbf6ec01833fee9a630f8246d4da00e5))

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

  **@smicolon/fasla-ui**
  - UI primitives: Button, Input, Textarea, Select, Checkbox, Switch, Tabs, Badge, Avatar, Card, Skeleton
  - App blocks: AppShell, PageHeader, DataTable, FormSection, EmptyState, Sidebar, Navbar, StatsCard
  - Effects: ShimmerButton, AnimatedGradient, BorderBeam, Spotlight, TextReveal, GlowCard, TypewriterText
  - Design tokens with density profiles (compact, comfortable, spacious)
  - Motion presets with reduced-motion support

  **@smicolon/cli**
  - `fasla-ui init` - Initialize fasla-ui in a project
  - `fasla-ui add <component>` - Add components to your project
  - `fasla-ui list` - List available components
