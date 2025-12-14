export type RegistryItemType = "ui" | "block" | "effect" | "hook"

export type RegistryItem = {
  name: string
  type: RegistryItemType
  title: string
  description: string
  sourcePath: string
  dependencies?: string[]
  registryDependencies?: string[]
  categories?: string[]
}

export const registry: RegistryItem[] = [
  // UI Primitives
  {
    name: "button",
    type: "ui",
    title: "Button",
    description: "A button component with multiple variants, sizes, and loading state.",
    sourcePath: "registry/ui/button",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    categories: ["primitives", "forms"],
  },
  {
    name: "input",
    type: "ui",
    title: "Input",
    description: "An input component with variants for validation states and icon support.",
    sourcePath: "registry/ui/input",
    dependencies: ["class-variance-authority"],
    categories: ["primitives", "forms"],
  },
  {
    name: "card",
    type: "ui",
    title: "Card",
    description: "A card component with header, content, and footer sections.",
    sourcePath: "registry/ui/card",
    categories: ["primitives", "layout"],
  },
  {
    name: "badge",
    type: "ui",
    title: "Badge",
    description: "A badge component for status indicators with multiple variants.",
    sourcePath: "registry/ui/badge",
    dependencies: ["class-variance-authority"],
    categories: ["primitives", "data-display"],
  },
  {
    name: "skeleton",
    type: "ui",
    title: "Skeleton",
    description: "Loading skeleton placeholders with pre-built variants for text, avatars, and cards.",
    sourcePath: "registry/ui/skeleton",
    categories: ["primitives", "feedback"],
  },
  // Blocks
  {
    name: "app-shell",
    type: "block",
    title: "App Shell",
    description: "Application shell with sidebar, header, and content area.",
    sourcePath: "registry/blocks/app-shell",
    categories: ["layout", "application"],
  },
  {
    name: "page-header",
    type: "block",
    title: "Page Header",
    description: "Page header with title, breadcrumb, description, and actions.",
    sourcePath: "registry/blocks/page-header",
    categories: ["layout", "navigation"],
  },
  {
    name: "empty-state",
    type: "block",
    title: "Empty State",
    description: "Empty state component with icon, title, description, and actions.",
    sourcePath: "registry/blocks/empty-state",
    categories: ["feedback", "data-display"],
  },
  {
    name: "form-section",
    type: "block",
    title: "Form Section",
    description: "Form section with title, description, fields, and actions.",
    sourcePath: "registry/blocks/form-section",
    categories: ["forms", "layout"],
  },
  {
    name: "data-table",
    type: "block",
    title: "Data Table",
    description: "Data table with sorting, pagination, and custom cell rendering.",
    sourcePath: "registry/blocks/data-table",
    categories: ["data-display", "tables"],
  },
  // Effects
  {
    name: "shimmer-button",
    type: "effect",
    title: "Shimmer Button",
    description: "A button with animated shimmer effect.",
    sourcePath: "registry/effects/shimmer-button",
    dependencies: ["framer-motion"],
    categories: ["effects", "buttons"],
  },
  {
    name: "animated-gradient",
    type: "effect",
    title: "Animated Gradient",
    description: "Animated gradient background and text effects.",
    sourcePath: "registry/effects/animated-gradient",
    dependencies: ["framer-motion"],
    categories: ["effects", "backgrounds"],
  },
  {
    name: "text-reveal",
    type: "effect",
    title: "Text Reveal",
    description: "Character and word reveal animations.",
    sourcePath: "registry/effects/text-reveal",
    dependencies: ["framer-motion"],
    categories: ["effects", "text"],
  },
  {
    name: "border-beam",
    type: "effect",
    title: "Border Beam",
    description: "Animated border beam and glowing border effects.",
    sourcePath: "registry/effects/border-beam",
    dependencies: ["framer-motion"],
    categories: ["effects", "borders"],
  },
  {
    name: "spotlight",
    type: "effect",
    title: "Spotlight",
    description: "Cursor-following spotlight effect.",
    sourcePath: "registry/effects/spotlight",
    dependencies: ["framer-motion"],
    categories: ["effects", "interactive"],
  },
]

export function getRegistryItem(name: string): RegistryItem | undefined {
  return registry.find((item) => item.name === name)
}

export function getRegistryItemsByType(type: RegistryItemType): RegistryItem[] {
  return registry.filter((item) => item.type === type)
}

export function getRegistryItemsByCategory(category: string): RegistryItem[] {
  return registry.filter((item) => item.categories?.includes(category))
}
