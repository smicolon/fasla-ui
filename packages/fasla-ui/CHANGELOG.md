# @smicolon/fasla-ui

## [0.3.0](https://github.com/smicolon/fasla-ui/compare/fasla-ui-v0.2.4...fasla-ui-v0.3.0) (2026-10-07)


### ⚠ BREAKING CHANGES

* **ui:** rebuild Switch to match the Figma set ([#32](https://github.com/smicolon/fasla-ui/issues/32))
* **ui:** rebuild Avatar and add Status Indicator ([#25](https://github.com/smicolon/fasla-ui/issues/25))
* **ui:** rebuild Badge against the Figma set ([#23](https://github.com/smicolon/fasla-ui/issues/23))

### Features

* **design:** index every atom in the Figma file, generated and dated ([#19](https://github.com/smicolon/fasla-ui/issues/19)) ([39aed84](https://github.com/smicolon/fasla-ui/commit/39aed84b3fc4ed98017e9eae9f34ddd0ec05bef9))
* **typography:** mirror the Figma type ramp across both scripts ([#14](https://github.com/smicolon/fasla-ui/issues/14)) ([8f028b4](https://github.com/smicolon/fasla-ui/commit/8f028b47e4838eaa05d5aa3777bc268113320821))
* **ui:** rebuild Avatar and add Status Indicator ([#25](https://github.com/smicolon/fasla-ui/issues/25)) ([93e0f45](https://github.com/smicolon/fasla-ui/commit/93e0f450a00ed8c29090cc606da8a94ff376488a))
* **ui:** rebuild Badge against the Figma set ([#23](https://github.com/smicolon/fasla-ui/issues/23)) ([92e5160](https://github.com/smicolon/fasla-ui/commit/92e51603a95a08c73eb601c8df187bc573dfdd81))
* **ui:** rebuild Switch to match the Figma set ([#32](https://github.com/smicolon/fasla-ui/issues/32)) ([da6ce14](https://github.com/smicolon/fasla-ui/commit/da6ce147276fd2b2e1d1c521048d7f5488f64f6b))
* **ui:** replace hand-written SVG icons with lucide-react ([#27](https://github.com/smicolon/fasla-ui/issues/27)) ([eadac23](https://github.com/smicolon/fasla-ui/commit/eadac234bbd8457bad2b973b92d4ed8b8a9225fc))

## [0.2.4](https://github.com/smicolon/fasla-ui/compare/fasla-ui-v0.2.3...fasla-ui-v0.2.4) (2026-09-18)


### Bug Fixes

* complete the registry and repair Arabic docs links ([#10](https://github.com/smicolon/fasla-ui/issues/10)) ([b2f96b7](https://github.com/smicolon/fasla-ui/commit/b2f96b76ff84341a05b065ecc7e40b824d3a71ea))

## [0.2.3](https://github.com/smicolon/fasla-ui/compare/fasla-ui-v0.2.2...fasla-ui-v0.2.3) (2026-09-16)


### Refactors

* rename smi-ui to fasla-ui ([#4](https://github.com/smicolon/fasla-ui/issues/4)) ([91ee183](https://github.com/smicolon/fasla-ui/commit/91ee1839cbf6ec01833fee9a630f8246d4da00e5))

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
