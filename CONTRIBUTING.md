# Contributing to FASLA UI

Thanks for your interest in FASLA UI. This guide covers how to set the project
up, how to propose a change, and what we look for in a pull request.

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
To report a security problem, follow [SECURITY.md](SECURITY.md) instead of
opening an issue.

## Scope of this repository

This repository holds the free, open-source part of FASLA UI:

- **UI primitives, blocks and effects** in `packages/fasla-ui/registry/`
- **The `fasla-ui` command-line tool** (`init`, `add`, `list`) in
  `packages/fasla-ui/src/cli/`
- **The documentation site** in `apps/docs` (English and Arabic)
- **The Storybook** in `apps/storybook`

Bug fixes, accessibility and RTL fixes, new components and documentation
improvements are all welcome. For a large change, such as a new component
family or a change to the CLI, open an issue first so we can agree on the shape
before you spend time on it.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 22 or newer (the root `package.json` sets
  `engines.node` to `>=22`; `.node-version` pins 22)
- [Bun](https://bun.sh/) 1.2 or newer (the workspace is installed and run with
  Bun; CI uses 1.4.2)
- Git

### Set up

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/fasla-ui.git
   cd fasla-ui
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a branch from `main`, for example `feat/button-loading` or
   `fix/input-error-border`.

### Commands

Run these from the repository root.

| Task | Command |
| --- | --- |
| Lint | `bun run lint` |
| Type check | `bun run typecheck` |
| Unit tests | `bun run test` |
| Build everything | `bun run build` |
| Storybook (dev server) | `bun run storybook` |
| Docs site (dev server) | `bun run --cwd apps/docs dev` |
| Library tests in watch mode | `bun run --cwd packages/fasla-ui test:watch` |

`bun run lint`, `typecheck`, `test` and `build` run through
[Turborepo](https://turbo.build) across every workspace that defines the
script. Run lint, type check, tests and build before you push; CI runs the same
commands.

## Making a change

### Adding or changing a component

Components live in `packages/fasla-ui/registry/`: `ui/` for primitives,
`blocks/` for larger compositions, and `effects/` for animated components. A
component usually has its own folder:

```
packages/fasla-ui/registry/ui/component-name/
├── component-name.tsx
├── component-name.test.tsx
└── index.ts
```

- Build variants with [class-variance-authority](https://cva.style) and merge
  classes with `cn()` from `@/lib/utils`.
- Style with Tailwind CSS and the theme tokens (CSS variables), not raw colour
  values, so dark mode and theming keep working.
- Accept a `className` prop and export your prop types.
- Register the component in `packages/fasla-ui/registry.json` so the CLI can
  install it.
- Add a Storybook story under `apps/storybook/stories/`.
- Add or update the docs page in `apps/docs`.
- Write tests for the behaviour, not only the rendering.

### Quality bar

- **Right-to-left.** FASLA UI is Arabic-first. Check every change in both LTR
  and RTL. Use logical properties (`ms-*`, `ps-*`, `start-*`, `text-start`)
  instead of left and right, and mirror directional icons.
- **Accessibility.** Everything interactive works from the keyboard, has a
  visible focus style and the right ARIA attributes. Icon-only buttons need an
  `aria-label`.
- **Motion.** Animation respects `prefers-reduced-motion`.
- **States.** Cover loading, empty, error and disabled states where they apply.
- **Light and dark.** Check both themes.

### Localisation

The docs site ships in English and Arabic, and every page exists in both. A
string added to one locale and not the other fails the tests. Read
[docs/LOCALISATION.md](docs/LOCALISATION.md) before you add a page, a string or
a locale.

## Commits and pull request titles

This repository uses [Conventional Commits](https://www.conventionalcommits.org/)
and **squash-merges** every pull request. That means the **pull request title
becomes the commit message on `main`**, so the title is what matters. The
individual commits on your branch are not kept, but clear ones help reviewers.

The format is:

```
<type>(<optional scope>): <description>
```

- **Types:** `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`,
  `refactor`, `revert`, `style`, `test`
- **Scope** is optional: lowercase letters, digits, `.`, `_`, `/` and `-`, in
  parentheses, for example `fix(cli): ...` or `feat(button): ...`
- A `!` before the colon marks a breaking change: `feat!: drop React 17`
- Keep the title to **72 characters or fewer**

Examples:

```
feat(button): add a loading state
fix(input): correct the border colour on error
docs: explain how to add a locale
```

The `PR title` workflow (`.github/workflows/pr-title.yml`) checks this on every
pull request and fails if the title does not match.

## How releases work

You never bump a version or edit a changelog by hand.

A bot ([release-please](https://github.com/googleapis/release-please)) reads the
squash-merged commit messages on `main` and keeps one open pull request titled
`chore: release packages`. That pull request contains the next version number
and the changelog entries it worked out from the commits. When a maintainer
merges it, the release is tagged and the package is published to npm by the
release workflow.

What your title type does to the version:

| Title | Effect |
| --- | --- |
| `fix:` | patch release (`0.8.0` to `0.8.1`) |
| `feat:` | minor release (`0.8.0` to `0.9.0`) |
| `feat!:` or a `BREAKING CHANGE:` footer | major release (while the version is below 1.0, a minor bump) |
| `docs:`, `refactor:`, `perf:`, `revert:` | listed in the changelog, but no version bump on their own |
| `chore:`, `ci:`, `build:`, `style:`, `test:` | no version bump and not in the changelog |

A title that does not parse as a conventional commit produces no release entry,
which is why the title check exists.

## Pull requests

A good pull request:

- does one thing and is small enough to review in one sitting
- has a conventional title as described above
- explains **what** changed and **why**, and links the issue it closes
- includes tests for new behaviour and bug fixes
- updates the docs, Storybook stories and, where it applies, both locales
- includes before and after screenshots for visual changes, in LTR and RTL
- passes lint, type check, tests and build

Open the pull request against `main` and fill in the template. A maintainer will
review it; expect some back-and-forth, and please keep discussion on the pull
request so others can follow it.

## Getting help

- Read the documentation at [fasla.smicolon.com](https://fasla.smicolon.com)
- Search the [existing issues](https://github.com/smicolon/fasla-ui/issues)
  before opening a new one
- Use the issue templates for bugs, component requests and questions

## License

By contributing you agree that your contributions are licensed under the
[MIT License](LICENSE) that covers the project.
