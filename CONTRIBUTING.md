# Contributing to SMI UI

Thank you for your interest in contributing to SMI UI! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/) 1.0+
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/smi-ui.git
   cd smi-ui
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start development:
   ```bash
   bun run storybook
   ```

## Development Workflow

### Branch Naming

- `feat/component-name` - New components
- `fix/issue-description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(button): add loading state
fix(input): correct border color on error
docs(readme): update installation instructions
```

### Creating Components

1. Create a new directory in `packages/smi-ui/registry/ui/`:
   ```
   packages/smi-ui/registry/ui/component-name/
   ├── component-name.tsx
   ├── component-name.test.tsx
   ├── component-name.stories.tsx
   └── index.ts
   ```

2. Use the CVA pattern for variants:
   ```tsx
   import { cva, type VariantProps } from "class-variance-authority"
   import { cn } from "@/lib/utils"

   const componentVariants = cva("base-classes", {
     variants: {
       variant: {
         default: "...",
       },
       size: {
         default: "...",
       },
     },
     defaultVariants: {
       variant: "default",
       size: "default",
     },
   })
   ```

3. Add to `registry.json`:
   ```json
   {
     "name": "component-name",
     "type": "registry:ui",
     "files": [
       {
         "path": "registry/ui/component-name/component-name.tsx",
         "target": "components/ui/component-name.tsx"
       }
     ]
   }
   ```

4. Write tests (aim for 90%+ coverage)

5. Create Storybook stories

### Testing

```bash
# Run all tests
bun run test

# Watch mode
bun run test:watch

# With coverage
bun run test --coverage
```

### Code Style

- Use TypeScript
- Follow existing patterns in the codebase
- Use Tailwind CSS for styling
- Export all types
- Include JSDoc comments for public APIs

### Pull Request Process

1. Create a branch from `main`
2. Make your changes
3. Add/update tests
4. Add/update documentation
5. Run `bun run lint` and `bun run typecheck`
6. Create a changeset: `bun run changeset`
7. Push and create a PR

### Changeset

We use [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
bun run changeset
```

Follow the prompts to describe your changes.

## Component Guidelines

### Accessibility

- All interactive components must be keyboard accessible
- Use proper ARIA attributes
- Test with screen readers
- Support `prefers-reduced-motion`

### Performance

- Avoid unnecessary re-renders
- Use `React.memo` where appropriate
- Keep bundle size minimal
- Tree-shake friendly exports

### Styling

- Use Tailwind CSS utility classes
- Support dark mode via CSS variables
- Allow className overrides
- Use `cn()` for class merging

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in existing issues
- Check the documentation at [ui.smicolon.com](https://ui.smicolon.com)

## Code of Conduct

Be respectful and constructive. We're all here to build something great together.
