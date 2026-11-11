import registry from "@fasla-ui/registry.json"

/**
 * Component counts read from the source registry, so the site never states a
 * number the CLI cannot install. registry.json types effects as registry:ui,
 * so the category comes from where the source lives: registry/effects/ for
 * effects, everything else is a primitive.
 */
export type RegistryCategory = "primitives" | "effects"

type RegistryItem = { type: string; files: { path: string }[] }

export function categoryOf(item: RegistryItem): RegistryCategory {
  if (item.files.some((file) => file.path.startsWith("registry/effects/"))) return "effects"
  return "primitives"
}

const items: RegistryItem[] = registry.items

export const registryCounts: Record<RegistryCategory, number> & { total: number } = {
  total: items.length,
  primitives: items.filter((item) => categoryOf(item) === "primitives").length,
  effects: items.filter((item) => categoryOf(item) === "effects").length,
}
