/**
 * Dependency resolution and import rewriting for `add`. Pure, so they can be
 * tested without the network or the file system.
 */
import path from "path"
import type { RegistryItem } from "./registry.js"

export interface Resolved {
  /** Every item to install, each dependency before the items that need it. */
  items: RegistryItem[]
  /** Names pulled in only as dependencies, not asked for. */
  added: string[]
  /** `registryDependencies` this registry can't resolve — URLs or unknown names. */
  skipped: string[]
}

/**
 * Walks `registryDependencies` from the requested names. Each item is fetched
 * once, however many items depend on it, and a cycle can't loop: an item
 * already on the path is not visited again.
 */
export async function resolveWithDependencies(
  requested: string[],
  known: Set<string>,
  fetchItem: (name: string) => Promise<RegistryItem>
): Promise<Resolved> {
  const items: RegistryItem[] = []
  const done = new Set<string>()
  const visiting = new Set<string>()
  const skipped = new Set<string>()

  async function visit(name: string) {
    if (done.has(name) || visiting.has(name)) return
    visiting.add(name)
    const item = await fetchItem(name)
    for (const dep of item.registryDependencies ?? []) {
      if (known.has(dep)) await visit(dep)
      else skipped.add(dep)
    }
    visiting.delete(name)
    done.add(name)
    items.push(item)
  }

  for (const name of requested) await visit(name)

  const asked = new Set(requested)
  return {
    items,
    added: items.map((i) => i.name).filter((n) => !asked.has(n)),
    skipped: [...skipped],
  }
}

/**
 * Registry files import each other the way the source tree lays them out —
 * `../status-indicator/status-indicator` from `registry/ui/avatar/`. `add`
 * writes every file flat into its type's directory, so point each such import
 * at where that component actually lands. Imports of anything that isn't a
 * registry component are left alone.
 */
export function rewriteComponentImports(
  content: string,
  fromDir: string,
  targetDirOf: (name: string) => string | undefined
): string {
  return content.replace(
    /from (["'])\.\.\/([a-z0-9-]+)\/([a-z0-9-]+)\1/g,
    (match, quote: string, folder: string, file: string) => {
      const toDir = folder === file ? targetDirOf(file) : undefined
      if (!toDir) return match
      const rel = path.posix.relative(toPosix(fromDir), toPosix(toDir)) || "."
      const spec = `${rel.startsWith(".") ? rel : `./${rel}`}/${file}`
      return `from ${quote}${spec}${quote}`
    }
  )
}

function toPosix(p: string) {
  return p.split(path.sep).join(path.posix.sep)
}
