import registry from "@fasla-ui/registry.json"

/**
 * Component counts read from the source registry, so the site never states a
 * number the CLI cannot install. registry.json types effects as registry:ui,
 * so the category comes from where the source lives: registry/effects/ for
 * effects, registry:block for blocks, everything else is a primitive.
 */
export type RegistryCategory = "primitives" | "blocks" | "effects"

type RegistryItem = { type: string; files: { path: string }[] }

export function categoryOf(item: RegistryItem): RegistryCategory {
  if (item.type === "registry:block") return "blocks"
  if (item.files.some((file) => file.path.startsWith("registry/effects/"))) return "effects"
  return "primitives"
}

const items: RegistryItem[] = registry.items

export const registryCounts: Record<RegistryCategory, number> & { total: number } = {
  total: items.length,
  primitives: items.filter((item) => categoryOf(item) === "primitives").length,
  blocks: items.filter((item) => categoryOf(item) === "blocks").length,
  effects: items.filter((item) => categoryOf(item) === "effects").length,
}
