import type { Metadata } from "next"
import { locales, defaultLocale, type Locale } from "@/i18n/routing"

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
    title: "Fasla — React Component Library by Smicolon GmbH",
    description:
      "28 accessible React components — primitives, application blocks and motion effects for Tailwind CSS. The CLI copies the source into your project. MIT-licensed core.",
    h1: "Add a component،own the source.",
  },
  {
    kind: "core",
    path: "/docs/",
    title: "Fasla Documentation: React Components and Blocks",
    description:
      "Explore Fasla documentation for reusable React primitives, application blocks, animated effects, and copy-paste implementation guidance.",
    h1: "Introduction",
  },
  {
    kind: "core",
    path: "/docs/installation/",
    title: "Install Fasla for React and Tailwind CSS",
    description:
      "Install Fasla with the CLI or manually, then configure React, TypeScript, Tailwind CSS, and the shared component utilities.",
    h1: "Installation",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/button/",
    title: "Button React Component | Fasla",
    description:
      "Add an accessible React button with visual variants, responsive sizes, loading feedback, and composable child rendering.",
    h1: "Button",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/input/",
    title: "Input React Component | Fasla",
    description:
      "Use a typed React text input with validation states, icon support, accessible focus styles, and Tailwind customization.",
    h1: "Input",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/card/",
    title: "Card React Component | Fasla",
    description:
      "Compose React card layouts from accessible header, title, description, content, and footer building blocks.",
    h1: "Card",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/badge/",
    title: "Badge React Component | Fasla",
    description:
      "Display compact React status indicators and labels with reusable badge variants and semantic Tailwind styling.",
    h1: "Badge",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/skeleton/",
    title: "Skeleton Loading Components for React | Fasla",
    description:
      "Create accessible React loading placeholders for text, avatars, cards, and custom content layouts with Fasla skeletons.",
    h1: "Skeleton",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/avatar/",
    title: "Avatar React Component | Fasla",
    description:
      "Represent users with a React avatar that supports images, fallback content, grouping, and consistent accessible sizing.",
    h1: "Avatar",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/checkbox/",
    title: "Checkbox React Component | Fasla",
    description:
      "Add an accessible React checkbox for binary selections with controlled state, labels, and keyboard interaction.",
    h1: "Checkbox",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/radio/",
    title: "Radio React Component | Fasla",
    description:
      "Add an accessible React radio for choosing one option from a set, with a plain control, a bordered card layout, and full RTL support.",
    h1: "Radio",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/switch/",
    title: "Switch React Component | Fasla",
    description:
      "Use an accessible React switch for on-off settings with controlled state, keyboard support, and clear visual feedback.",
    h1: "Switch",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/select/",
    title: "Select React Component | Fasla",
    description:
      "Build a typed React select control for choosing one option with accessible interaction and customizable styling.",
    h1: "Select",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/textarea/",
    title: "Textarea React Component | Fasla",
    description:
      "Add a multi-line React text input with character counting, resize options, validation states, and accessible labels.",
    h1: "Textarea",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/tabs/",
    title: "Tabs React Component | Fasla",
    description:
      "Organize related React content into accessible tab lists, triggers, and keyboard-navigable panels.",
    h1: "Tabs",
  },
  {
    kind: "component",
    category: "UI Primitives",
    path: "/docs/components/combobox/",
    title: "Combobox React Component | Fasla",
    description:
      "Create a searchable React combobox with single or multiple selection, accessible controls, and typed options.",
    h1: "Combobox",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/app-shell/",
    title: "App Shell React Layout | Fasla",
    description:
      "Structure React applications with a responsive app shell that composes navigation, sidebars, headers, and main content.",
    h1: "AppShell",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/page-header/",
    title: "Page Header React Block | Fasla",
    description:
      "Build consistent React page headers with titles, descriptions, breadcrumbs, and responsive action areas.",
    h1: "PageHeader",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/empty-state/",
    title: "Empty State React Block | Fasla",
    description:
      "Explain empty React views with contextual icons, helpful descriptions, search variants, and clear next actions.",
    h1: "EmptyState",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/form-section/",
    title: "Form Section React Block | Fasla",
    description:
      "Group related React form fields with headings, descriptions, validation-ready layout, and aligned action controls.",
    h1: "FormSection",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/data-table/",
    title: "Data Table React Block | Fasla",
    description:
      "Present structured React data with typed columns, pagination, responsive controls, and reusable table states.",
    h1: "DataTable",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/sidebar/",
    title: "Sidebar React Navigation Block | Fasla",
    description:
      "Add a responsive React sidebar for application navigation with collapsible structure and accessible links.",
    h1: "Sidebar",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/navbar/",
    title: "Navbar React Navigation Block | Fasla",
    description:
      "Create a responsive React navigation bar with desktop links, mobile menu behavior, and flexible brand content.",
    h1: "Navbar",
  },
  {
    kind: "component",
    category: "Blocks",
    path: "/docs/components/stats-card/",
    title: "Stats Card React Block | Fasla",
    description:
      "Display key React dashboard metrics with trend indicators, supporting context, icons, and consistent card layout.",
    h1: "Stats Card",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/shimmer-button/",
    title: "Shimmer Button React Effect | Fasla",
    description:
      "Draw attention to React calls to action with a polished shimmer animation that respects reduced-motion preferences.",
    h1: "Shimmer Button",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/animated-gradient/",
    title: "Animated Gradient React Effect | Fasla",
    description:
      "Add a configurable animated gradient background to React hero sections and cards with smooth motion behavior.",
    h1: "AnimatedGradient",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/text-reveal/",
    title: "Text Reveal React Effect | Fasla",
    description:
      "Reveal React text character by character with reusable animation controls and reduced-motion support.",
    h1: "TextReveal",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/border-beam/",
    title: "Border Beam React Effect | Fasla",
    description:
      "Highlight React cards and containers with a configurable animated beam that travels around the border.",
    h1: "BorderBeam",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/spotlight/",
    title: "Spotlight React Effect | Fasla",
    description:
      "Create cursor-responsive spotlight backgrounds for React interfaces with controlled glow and positioning.",
    h1: "Spotlight",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/typewriter-text/",
    title: "Typewriter Text React Effect | Fasla",
    description:
      "Animate React copy with a configurable typewriter sequence for product messages, headings, and demonstrations.",
    h1: "Typewriter Text",
  },
  {
    kind: "component",
    category: "Effects",
    path: "/docs/components/glow-card/",
    title: "Glow Card React Effect | Fasla",
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

/** Every route exists once per locale, so the canonical carries the prefix. */
export function localisedPath(path: RoutePath, locale: Locale): string {
  return `/${locale}${path === "/" ? "/" : path}`.replace(/\/{2,}/g, "/")
}

export function metadataForRoute(path: RoutePath, locale: Locale = defaultLocale): Metadata {
  const route = routes.find((candidate) => candidate.path === path)

  if (!route) {
    throw new Error(`Unknown canonical route: ${path}`)
  }

  const canonical = new URL(localisedPath(path, locale), SITE_URL).toString()

  // hreflang tells a crawler these are the same page in another language, and
  // x-default names the one to serve when no language matches.
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, new URL(localisedPath(path, l), SITE_URL).toString()]),
  )
  languages["x-default"] = new URL(localisedPath(path, defaultLocale), SITE_URL).toString()
  const image = new URL("/smicolon-icon.png", SITE_URL).toString()

  return {
    title: route.title,
    description: route.description,
    alternates: { canonical, languages },
    icons: { icon: "/favicon.ico" },
    openGraph: {
      title: route.title,
      description: route.description,
      type: "website",
      url: canonical,
      siteName: "Fasla",
      images: [{ url: image, alt: "Fasla by Smicolon" }],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [image],
    },
  }
}
