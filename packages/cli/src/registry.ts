/**
 * Registry module for fetching components from the smi-ui registry
 */

const REGISTRY_URL = "https://ui.smicolon.com/r"

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
