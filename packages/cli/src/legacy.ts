/**
 * Repairs a project set up with @smicolon/cli 0.3.x.
 *
 * 0.3 wrote a `"smicolon": { "url" }` registry entry, which the shadcn CLI
 * rejects as an invalid components.json, and treated `@/` as `src/` whatever
 * the tsconfig said. Its prompts defaulted to `src/components`, stored as
 * `@/src/components`, so files landed in src/src/components; with `--yes` it
 * stored `@/components` but still wrote under src/. In a project whose `@/`
 * is the root, neither resolves, and 0.4's `add` then wrote a second copy to
 * where the old alias does point.
 *
 * The repair rewrites components.json, moves Fasla's files to where the new
 * aliases point, and updates the imports that pointed at the old places. It
 * never overwrites: a file whose destination is taken is deleted only when it
 * is the same file, and otherwise kept beside it as `.bak`.
 */
import fs from "fs-extra"
import path from "path"
import { aliasToPath, resolveInsideProject } from "./paths.js"
import { NAMESPACE, namespaceUrl } from "./registry.js"

export interface ComponentsConfig {
  aliases?: Record<string, string | undefined>
  registries?: Record<string, unknown>
  tailwind?: { css?: unknown; [key: string]: unknown }
  [key: string]: unknown
}

/** The registry key 0.3 wrote: no `@`, and a `{ url }` with no `{name}`. */
export const LEGACY_REGISTRY_KEY = "smicolon"

/** The folders `add` writes registry files into, under the components alias. */
const TYPE_DIRS = ["ui", "blocks", "effects"]

/** Folders never searched for imports to update. */
const SKIP_DIRS = new Set(["node_modules", "dist", "build", "out", "coverage"])
const SOURCE_FILE = /\.(tsx?|jsx?|mjs|cjs|mts|cts|mdx)$/

/**
 * Whether components.json came from 0.3: it has the old registry key, or its
 * aliases go through `@/src/` and the src/src folder 0.3 made is there.
 */
export async function isLegacyConfig(cwd: string, config: ComponentsConfig): Promise<boolean> {
  const registries = config.registries
  if (registries && typeof registries === "object" && LEGACY_REGISTRY_KEY in registries) return true
  const { components, utils } = config.aliases ?? {}
  const throughSrc = [components, utils].some((alias) => typeof alias === "string" && alias.startsWith("@/src/"))
  return throughSrc && (await fs.pathExists(path.join(cwd, "src", "src")))
}

/** `@/src/components` → `@/components`; anything else as it is. */
function withoutSrc(alias: string): string {
  return alias.startsWith("@/src/") ? `@/${alias.slice("@/src/".length)}` : alias
}

/** Where 0.3 wrote an alias: it replaced `@/` with `src/`, always. */
function legacyPath(alias: string): string {
  return alias.replace(/^@\//, "src/")
}

export interface Move {
  /** Relative to the project root. */
  from: string
  to: string
  /** `move`: nothing at `to` yet. `duplicate`: the same file is there, so `from` goes. `conflict`: a different file is there, so `from` is kept as `.bak`. */
  action: "move" | "duplicate" | "conflict"
}

export interface RepairPlan {
  config: ComponentsConfig
  moves: Move[]
  /** Import specifiers to update across the project, old → new. */
  specifiers: [string, string][]
}

/**
 * What the repair will do, without doing any of it, so it can be shown before
 * anyone agrees to it. `root` is the folder `@/` points to now.
 */
export async function planLegacyRepair(cwd: string, config: ComponentsConfig, root: string): Promise<RepairPlan> {
  const aliases = config.aliases ?? {}
  const oldComponents = aliases.components ?? "@/components"
  const oldUtils = aliases.utils ?? "@/lib/utils"
  const newComponents = withoutSrc(oldComponents)
  const newUtils = withoutSrc(oldUtils)

  const registries = { ...(config.registries ?? {}) }
  delete registries[LEGACY_REGISTRY_KEY]
  registries[NAMESPACE] = namespaceUrl()

  const tailwind = { ...(config.tailwind ?? {}) }
  // 0.3 always wrote src/app/globals.css. Point it at the real file when that
  // one is missing and the usual place has one.
  const usualCss = root ? `${root}/app/globals.css` : "app/globals.css"
  if (typeof tailwind.css === "string" && !(await fs.pathExists(path.join(cwd, tailwind.css))) && (await fs.pathExists(path.join(cwd, usualCss)))) {
    tailwind.css = usualCss
  }

  const newConfig: ComponentsConfig = {
    ...config,
    tailwind,
    aliases: {
      ...aliases,
      components: newComponents,
      utils: newUtils,
      ui: withoutSrc(aliases.ui ?? `${oldComponents}/ui`),
    },
    registries,
  }

  const specifiers = new Map<string, string>()
  if (oldUtils !== newUtils) specifiers.set(oldUtils, newUtils)

  // Where files may be, newest first: where 0.4 wrote with the old aliases,
  // then where 0.3 did. The first copy of a file to reach its destination
  // keeps it.
  const claimed = new Map<string, string>()
  const moves: Move[] = []
  const rewrite = (text: string) => rewriteSpecifiers(text, [...specifiers])

  const consider = async (from: string, to: string) => {
    if (from === to || !(await isPlainFile(path.join(cwd, from)))) return
    const content = rewrite(await fs.readFile(path.join(cwd, from), "utf8"))
    let existing = claimed.get(to)
    if (existing === undefined && (await isPlainFile(path.join(cwd, to)))) {
      existing = rewrite(await fs.readFile(path.join(cwd, to), "utf8"))
      claimed.set(to, existing)
    }
    if (existing === undefined) {
      claimed.set(to, content)
      moves.push({ from, to, action: "move" })
    } else {
      moves.push({ from, to, action: existing === content ? "duplicate" : "conflict" })
    }
  }

  const newDir = aliasToPath(newComponents, root)
  const sourceDirs = unique([aliasToPath(oldComponents, root), legacyPath(oldComponents)])
  // Specifiers first, so files compare equal once their imports are updated.
  for (const dir of sourceDirs) {
    for (const type of TYPE_DIRS) {
      for (const name of await plainFiles(path.join(cwd, dir, type))) {
        const bare = name.replace(/\.[^.]+$/, "")
        const oldSpec = `${oldComponents}/${type}/${bare}`
        const newSpec = `${newComponents}/${type}/${bare}`
        if (oldSpec !== newSpec) specifiers.set(oldSpec, newSpec)
      }
    }
  }
  for (const dir of sourceDirs) {
    for (const type of TYPE_DIRS) {
      for (const name of await plainFiles(path.join(cwd, dir, type))) {
        await consider(`${dir}/${type}/${name}`, `${newDir}/${type}/${name}`)
      }
    }
  }
  const newUtilsFile = `${aliasToPath(newUtils, root)}.ts`
  for (const from of unique([`${aliasToPath(oldUtils, root)}.ts`, `${legacyPath(oldUtils)}.ts`])) {
    await consider(from, newUtilsFile)
  }

  return { config: newConfig, moves, specifiers: [...specifiers] }
}

/**
 * Carries out a plan: moves, removes and backs up files, deletes the folders
 * that leaves empty, and updates imports across the project. Returns the
 * files whose imports changed. Writing components.json is the caller's job.
 */
export async function applyLegacyRepair(cwd: string, plan: RepairPlan): Promise<{ rewritten: string[]; backups: string[] }> {
  const backups: string[] = []
  for (const move of plan.moves) {
    const from = await resolveInsideProject(cwd, move.from)
    if (move.action === "move") {
      const to = await resolveInsideProject(cwd, move.to)
      await fs.ensureDir(path.dirname(to))
      await fs.move(from, to, { overwrite: false })
    } else if (move.action === "duplicate") {
      await fs.remove(from)
    } else {
      let backup = `${move.from}.bak`
      for (let n = 2; await fs.pathExists(path.join(cwd, backup)); n++) backup = `${move.from}.bak${n}`
      await fs.move(from, await resolveInsideProject(cwd, backup), { overwrite: false })
      backups.push(backup)
    }
  }

  // Remove the folders the moves emptied, up to (never including) the root.
  const root = path.resolve(cwd)
  for (const move of plan.moves) {
    for (let dir = path.resolve(cwd, path.dirname(move.from)); dir !== root && dir.startsWith(root + path.sep); dir = path.dirname(dir)) {
      const entries = await fs.readdir(dir).catch(() => undefined)
      if (!entries || entries.length > 0) break
      await fs.rmdir(dir)
    }
  }

  const rewritten: string[] = []
  if (plan.specifiers.length > 0) {
    for (const file of await sourceFiles(root)) {
      const text = await fs.readFile(file, "utf8")
      const next = rewriteSpecifiers(text, plan.specifiers)
      if (next !== text) {
        await fs.writeFile(file, next)
        rewritten.push(path.relative(root, file).split(path.sep).join("/"))
      }
    }
  }
  return { rewritten, backups }
}

/** Replaces each old import specifier, quoted exactly, with its new one. */
export function rewriteSpecifiers(text: string, specifiers: [string, string][]): string {
  let out = text
  for (const [from, to] of specifiers) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    out = out.replace(new RegExp(`(["'])${escaped}\\1`, "g"), `$1${to}$1`)
  }
  return out
}

/** The plan in a few lines, to show before asking. */
export function describeRepair(plan: RepairPlan, oldConfig: ComponentsConfig): string[] {
  const lines: string[] = []
  if (oldConfig.registries && LEGACY_REGISTRY_KEY in oldConfig.registries) {
    lines.push(`- registries: "${LEGACY_REGISTRY_KEY}" becomes "${NAMESPACE}", so the shadcn CLI can read components.json`)
  }
  const before = oldConfig.aliases ?? {}
  const after = plan.config.aliases ?? {}
  for (const key of ["components", "utils"]) {
    if (before[key] !== after[key]) lines.push(`- aliases.${key}: ${before[key]} → ${after[key]}`)
  }
  const count = (action: Move["action"]) => plan.moves.filter((m) => m.action === action).length
  if (count("move") > 0) lines.push(`- move ${count("move")} file(s) to where those aliases point`)
  if (count("duplicate") > 0) lines.push(`- delete ${count("duplicate")} duplicate file(s) already at the new place`)
  if (count("conflict") > 0) lines.push(`- keep ${count("conflict")} older, different file(s) as .bak beside them`)
  if (plan.specifiers.length > 0) lines.push(`- update imports of the old paths in your code`)
  return lines
}

function unique(items: string[]): string[] {
  return [...new Set(items)]
}

async function isPlainFile(p: string): Promise<boolean> {
  const stat = await fs.lstat(p).catch(() => undefined)
  return Boolean(stat?.isFile())
}

/** Regular files in a folder, not symlinks; none when it doesn't exist. */
async function plainFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
  return entries.filter((e) => e.isFile()).map((e) => e.name).sort()
}

/** Source files under `dir`, skipping dependencies, build output and dot-folders. */
async function sourceFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await sourceFiles(full)))
    else if (entry.isFile() && SOURCE_FILE.test(entry.name)) out.push(full)
  }
  return out
}
