# @smicolon/cli

## [0.5.2](https://github.com/smicolon/fasla-ui/compare/cli-v0.5.1...cli-v0.5.2) (2026-10-09)


### Bug Fixes

* default border colour, cn type sizes and two docs examples ([#48](https://github.com/smicolon/fasla-ui/issues/48)) ([a781441](https://github.com/smicolon/fasla-ui/commit/a7814419f9893b820b6ff4e42d96e8b847ee75f8))

## [0.5.1](https://github.com/smicolon/fasla-ui/compare/cli-v0.5.0...cli-v0.5.1) (2026-10-09)


### Bug Fixes

* make the theme, docs and examples work on a new project ([a9d7fab](https://github.com/smicolon/fasla-ui/commit/a9d7fab00a858d94b2b022bf65d4b718bf22ff1a))

## [0.5.0](https://github.com/smicolon/fasla-ui/compare/cli-v0.4.0...cli-v0.5.0) (2026-10-07)


### Features

* **cli:** use the project's package manager, repair 0.3 setups ([#41](https://github.com/smicolon/fasla-ui/issues/41)) ([61ec6b0](https://github.com/smicolon/fasla-ui/commit/61ec6b06b04873f392619ffce5bfa4aa1a7cb8ff))
* ship the Fasla theme as base and colours registry items ([#43](https://github.com/smicolon/fasla-ui/issues/43)) ([7327c0c](https://github.com/smicolon/fasla-ui/commit/7327c0cc3537e857199bcd1d8cc85424e73f231a))

## [0.4.0](https://github.com/smicolon/fasla-ui/compare/cli-v0.3.3...cli-v0.4.0) (2026-10-07)


### ⚠ BREAKING CHANGES

* **ui:** rebuild Avatar and add Status Indicator ([#25](https://github.com/smicolon/fasla-ui/issues/25))

### Features

* **ui:** rebuild Avatar and add Status Indicator ([#25](https://github.com/smicolon/fasla-ui/issues/25)) ([93e0f45](https://github.com/smicolon/fasla-ui/commit/93e0f450a00ed8c29090cc606da8a94ff376488a))


### Bug Fixes

* **cli:** ask again for folders outside @/, skip existing files in add ([#31](https://github.com/smicolon/fasla-ui/issues/31)) ([91b067f](https://github.com/smicolon/fasla-ui/commit/91b067f465daef23682bbaad345527ce77720a35))
* **cli:** point every install command at @smicolon/cli ([#24](https://github.com/smicolon/fasla-ui/issues/24)) ([60c1ead](https://github.com/smicolon/fasla-ui/commit/60c1ead43b59c751b45873c3da5964c45d8de60c))
* **cli:** resolve component paths from tsconfig, not a hard-coded src/ ([#28](https://github.com/smicolon/fasla-ui/issues/28)) ([850ae1e](https://github.com/smicolon/fasla-ui/commit/850ae1e899d7fbef021e3e910379c020112d7294))
* **registry:** install with the official shadcn CLI ([#37](https://github.com/smicolon/fasla-ui/issues/37)) ([94cf991](https://github.com/smicolon/fasla-ui/commit/94cf9914868975e64a160d2173e623ebb05215f0))

## [0.3.3](https://github.com/smicolon/fasla-ui/compare/cli-v0.3.2...cli-v0.3.3) (2026-09-18)


### Bug Fixes

* complete the registry and repair Arabic docs links ([#10](https://github.com/smicolon/fasla-ui/issues/10)) ([b2f96b7](https://github.com/smicolon/fasla-ui/commit/b2f96b76ff84341a05b065ecc7e40b824d3a71ea))

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
