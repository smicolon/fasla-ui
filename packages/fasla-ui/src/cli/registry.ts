/**
 * Registry module for fetching components from the fasla-ui registry
 */

export const DEFAULT_REGISTRY_URL = "https://fasla.smicolon.com/r"

/**
 * Where the registry was served before fasla.smicolon.com. It still serves
 * /r/* with no redirect, and the registry's dependencies between items point
 * there (see docs/DOMAINS.md), so `add` still treats URLs under it as ours.
 */
export const LEGACY_REGISTRY_URL = "https://ui.smicolon.com/r"

/**
 * Point the CLI at another registry — a local build, or a staging deploy —
 * without editing the source. Trailing slashes are trimmed so the caller can
 * pass either form.
 */
export const REGISTRY_URL = (
  process.env.FASLA_UI_REGISTRY_URL || DEFAULT_REGISTRY_URL
).replace(/\/+$/, "")

/**
 * The `components.json` entry `init` writes, so the shadcn CLI can install
 * from this registry as `@fasla/<name>`. The shadcn CLI requires the key to
 * start with "@" and the URL to contain "{name}".
 */
export const NAMESPACE = "@fasla"

/**
 * The theme items the registry publishes beside the components but keeps out
 * of the index: CSS and fonts, installed with the shadcn CLI. A component may
 * depend on one (a block on an inverted surface needs theme-inverse), and
 * `add` installs those. Fixed here because the CLI ships without the token
 * files theme/theme-items.mjs builds them from; a test holds the two equal.
 */
export const THEME_ITEMS: readonly string[] = ["theme-base", "theme", "theme-inverse", "font-cairo", "font-geist"]

export function namespaceUrl(base: string = REGISTRY_URL): string {
  return `${base}/{name}.json`
}

export interface RegistryFile {
  path: string
  type: string
  target: string
  content: string
}

export interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
  categories?: string[]
}

export interface Registry {
  $schema?: string
  name: string
  homepage: string
  items: RegistryItem[]
}

/**
 * Fetch the main registry index
 */
export async function fetchRegistry(): Promise<Registry> {
  const response = await fetch(`${REGISTRY_URL}/registry.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch registry: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Fetch a specific component with its source code
 */
export async function fetchComponent(name: string): Promise<RegistryItem> {
  const response = await fetch(`${REGISTRY_URL}/${name}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch component "${name}": ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Get the target directory based on component type
 */
export function getTargetDirectory(type: string, baseDir: string): string {
  const typeMap: Record<string, string> = {
    "registry:ui": "ui",
    "registry:block": "blocks",
    "registry:effect": "effects",
    ui: "ui",
    block: "blocks",
    effect: "effects",
  }
  const subDir = typeMap[type] || "ui"
  return `${baseDir}/${subDir}`
}
