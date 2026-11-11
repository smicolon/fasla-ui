import registry from "@fasla-ui/registry.json"
import { categoryOf, type RegistryCategory } from "./registry"
import { componentRoutes } from "./seo-routes"

/**
 * The components the landing page lists: every item in the source registry,
 * so the page names exactly what the CLI can install. Primitives first, then
 * effects, each group in alphabetical order.
 */
type Item = { name: string; title?: string; type: string; files: { path: string }[] }

export type Atom = {
  /** The registry name, `date-picker`. */
  slug: string
  /** The English name, `Date Picker`. Also the key of the Arabic name in the messages. */
  name: string
  kind: RegistryCategory
  /** The component's docs page, when it has one. */
  path: string | null
}

const pages = new Set<string>(componentRoutes.map((route) => route.path))

export const atoms: Atom[] = (registry.items as Item[])
  .map((item) => {
    const path = `/docs/components/${item.name}/`
    return {
      slug: item.name,
      name: item.title ?? item.name,
      kind: categoryOf(item),
      path: pages.has(path) ? path : null,
    }
  })
  .sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name, "en") : a.kind === "primitives" ? -1 : 1))

export const atomCounts = {
  total: atoms.length,
  primitives: atoms.filter((atom) => atom.kind === "primitives").length,
  effects: atoms.filter((atom) => atom.kind === "effects").length,
}
