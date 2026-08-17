import type { Metadata } from "next"

export const SITE_URL = "https://ui.smicolon.com"

export type ComponentCategory = "UI Primitives" | "Blocks" | "Effects"

type CoreRoute = {
  kind: "core"
  path: "/" | "/docs/" | "/docs/installation/"
  title: string
  description: string
  h1: string
}

type ComponentRoute = {
  kind: "component"
  path: `/docs/components/${string}/`
  title: string
  description: string
  h1: string
  category: ComponentCategory
}

export type SeoRoute = CoreRoute | ComponentRoute

export const routes = [
  {
    kind: "core",
    path: "/",
    title: "SMI-UI React Component Library by Smicolon",
    description:
      "Build polished React interfaces with accessible SMI-UI components, application blocks, and motion effects for Tailwind CSS.",
    h1: "The only UI library you need to build beautiful",
  },
  {
    kind: "core",
    path: "/docs/",
    title: "SMI-UI Documentation: React Components and Blocks",
    description:
      "Explore SMI-UI documentation for reusable React primitives, application blocks, animated effects, and copy-paste implementation guidance.",
    h1: "Introduction",
  },
  {
    kind: "core",
    path: "/docs/installation/",
    title: "Install SMI-UI for React and Tailwind CSS",
    description:
      "Install SMI-UI with the CLI or manually, then configure React, TypeScript, Tailwind CSS, and the shared component utilities.",
    h1: "Installation",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/button/",
    title: "Button React Component | SMI-UI",
    description:
      "Add an accessible React button with visual variants, responsive sizes, loading feedback, and composable child rendering.",
    h1: "Button",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/input/",
    title: "Input React Component | SMI-UI",
    description:
      "Use a typed React text input with validation states, icon support, accessible focus styles, and Tailwind customization.",
    h1: "Input",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/card/",
    title: "Card React Component | SMI-UI",
    description:
      "Compose React card layouts from accessible header, title, description, content, and footer building blocks.",
    h1: "Card",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/badge/",
    title: "Badge React Component | SMI-UI",
    description:
      "Display compact React status indicators and labels with reusable badge variants and semantic Tailwind styling.",
    h1: "Badge",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/skeleton/",
    title: "Skeleton Loading Components for React | SMI-UI",
    description:
      "Create accessible React loading placeholders for text, avatars, cards, and custom content layouts with SMI-UI skeletons.",
    h1: "Skeleton",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/avatar/",
    title: "Avatar React Component | SMI-UI",
    description:
      "Represent users with a React avatar that supports images, fallback content, grouping, and consistent accessible sizing.",
    h1: "Avatar",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/checkbox/",
    title: "Checkbox React Component | SMI-UI",
    description:
      "Add an accessible React checkbox for binary selections with controlled state, labels, and keyboard interaction.",
    h1: "Checkbox",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/switch/",
    title: "Switch React Component | SMI-UI",
    description:
      "Use an accessible React switch for on-off settings with controlled state, keyboard support, and clear visual feedback.",
    h1: "Switch",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/select/",
    title: "Select React Component | SMI-UI",
    description:
      "Build a typed React select control for choosing one option with accessible interaction and customizable styling.",
    h1: "Select",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/textarea/",
    title: "Textarea React Component | SMI-UI",
    description:
      "Add a multi-line React text input with character counting, resize options, validation states, and accessible labels.",
    h1: "Textarea",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/tabs/",
    title: "Tabs React Component | SMI-UI",
    description:
      "Organize related React content into accessible tab lists, triggers, and keyboard-navigable panels.",
    h1: "Tabs",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/combobox/",
    title: "Combobox React Component | SMI-UI",
    description:
      "Create a searchable React combobox with single or multiple selection, accessible controls, and typed options.",
    h1: "Combobox",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/app-shell/",
    title: "App Shell React Layout | SMI-UI",
    description:
      "Structure React applications with a responsive app shell that composes navigation, sidebars, headers, and main content.",
    h1: "AppShell",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/page-header/",
    title: "Page Header React Block | SMI-UI",
    description:
      "Build consistent React page headers with titles, descriptions, breadcrumbs, and responsive action areas.",
    h1: "PageHeader",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/empty-state/",
    title: "Empty State React Block | SMI-UI",
    description:
      "Explain empty React views with contextual icons, helpful descriptions, search variants, and clear next actions.",
    h1: "EmptyState",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/form-section/",
    title: "Form Section React Block | SMI-UI",
    description:
      "Group related React form fields with headings, descriptions, validation-ready layout, and aligned action controls.",
    h1: "FormSection",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/data-table/",
    title: "Data Table React Block | SMI-UI",
    description:
      "Present structured React data with typed columns, pagination, responsive controls, and reusable table states.",
    h1: "DataTable",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/sidebar/",
    title: "Sidebar React Navigation Block | SMI-UI",
    description:
      "Add a responsive React sidebar for application navigation with collapsible structure and accessible links.",
    h1: "Sidebar",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/navbar/",
    title: "Navbar React Navigation Block | SMI-UI",
    description:
      "Create a responsive React navigation bar with desktop links, mobile menu behavior, and flexible brand content.",
    h1: "Navbar",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/stats-card/",
    title: "Stats Card React Block | SMI-UI",
    description:
      "Display key React dashboard metrics with trend indicators, supporting context, icons, and consistent card layout.",
    h1: "Stats Card",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/shimmer-button/",
    title: "Shimmer Button React Effect | SMI-UI",
    description:
      "Draw attention to React calls to action with a polished shimmer animation that respects reduced-motion preferences.",
    h1: "Shimmer Button",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/animated-gradient/",
    title: "Animated Gradient React Effect | SMI-UI",
    description:
      "Add a configurable animated gradient background to React hero sections and cards with smooth motion behavior.",
    h1: "AnimatedGradient",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/text-reveal/",
    title: "Text Reveal React Effect | SMI-UI",
    description:
      "Reveal React text character by character with reusable animation controls and reduced-motion support.",
    h1: "TextReveal",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/border-beam/",
    title: "Border Beam React Effect | SMI-UI",
    description:
      "Highlight React cards and containers with a configurable animated beam that travels around the border.",
    h1: "BorderBeam",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/spotlight/",
    title: "Spotlight React Effect | SMI-UI",
    description:
      "Create cursor-responsive spotlight backgrounds for React interfaces with controlled glow and positioning.",
    h1: "Spotlight",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/typewriter-text/",
    title: "Typewriter Text React Effect | SMI-UI",
    description:
      "Animate React copy with a configurable typewriter sequence for product messages, headings, and demonstrations.",
    h1: "Typewriter Text",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/glow-card/",
    title: "Glow Card React Effect | SMI-UI",
    description:
      "Build interactive React cards with pointer-following glow effects, layered content, and adaptable surface styling.",
    h1: "Glow Card",
  },
] as const satisfies readonly SeoRoute[]

export type RoutePath = (typeof routes)[number]["path"]

export const componentRoutes = routes.filter(
  (route): route is Extract<(typeof routes)[number], { kind: "component" }> =>
    route.kind === "component"
)

export const componentRouteGroups = (
  ["UI Primitives", "Blocks", "Effects"] as const
).map((category) => ({
  category,
  routes: componentRoutes.filter((route) => route.category === category),
}))

export function metadataForRoute(path: RoutePath): Metadata {
  const route = routes.find((candidate) => candidate.path === path)

  if (!route) {
    throw new Error(`Unknown canonical route: ${path}`)
  }

  const canonical = new URL(route.path, SITE_URL).toString()
  const image = new URL("/smicolon-icon.png", SITE_URL).toString()

  return {
    title: route.title,
    description: route.description,
    alternates: { canonical },
    icons: { icon: "/favicon.ico" },
    openGraph: {
      title: route.title,
      description: route.description,
      type: "website",
      url: canonical,
      siteName: "SMI-UI",
      images: [{ url: image, alt: "SMI-UI by Smicolon" }],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [image],
    },
  }
}
