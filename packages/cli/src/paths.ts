/**
 * Maps between the `@/` aliases stored in components.json and the folders they
 * point at on disk. `@/` is whatever the project's tsconfig says it is, not
 * always `src/`: a Next.js app without a `src/` folder maps `@/*` to `./*`.
 */
import fs from "fs-extra"
import { parse as parseJsonc, type ParseError } from "jsonc-parser"
import { createRequire } from "module"
import path from "path"

interface ConfigFile {
  dir: string
  compilerOptions: { baseUrl?: unknown; paths?: Record<string, unknown> }
}

/**
 * Reads `@/` from the project's tsconfig.json, then jsconfig.json, following
 * `extends` the way TypeScript does. Returns the folder relative to the
 * project root — `""` is the root itself — which can point outside the
 * project; `resolveInsideProject` refuses that before anything is written.
 * With no `@/*` path anywhere, falls back to `src` when the project has a
 * `src/` folder and to the project root when it doesn't.
 */
export async function readAliasRoot(cwd: string): Promise<string> {
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const configPath = path.join(cwd, file)
    if (!(await fs.pathExists(configPath))) continue
    const chain = await loadConfigChain(configPath, new Set())
    // `paths` is replaced whole, not merged: the nearest config that sets it
    // decides, even when its object has no `@/*` key.
    const withPaths = chain.find((c) => c.compilerOptions.paths !== undefined)
    const target = withPaths?.compilerOptions.paths?.["@/*"]
    if (!withPaths || !Array.isArray(target) || typeof target[0] !== "string" || !target[0].endsWith("*")) continue
    // A mapping is relative to baseUrl when one is set anywhere in the chain,
    // and baseUrl to the config that sets it. Without one, it is relative to
    // the config that declares `paths`, not the one that extends it.
    const withBaseUrl = chain.find((c) => typeof c.compilerOptions.baseUrl === "string")
    const base = withBaseUrl
      ? path.resolve(withBaseUrl.dir, withBaseUrl.compilerOptions.baseUrl as string)
      : withPaths.dir
    // Config folders are real paths (package lookups resolve symlinks), so
    // compare against the real project folder too.
    return normalise(path.relative(await fs.realpath(cwd), path.resolve(base, target[0].slice(0, -1))))
  }
  return (await fs.pathExists(path.join(cwd, "src"))) ? "src" : ""
}

/**
 * The config at `configPath` followed by everything it extends, nearest
 * first, so the first entry that sets an option is the one TypeScript uses.
 * With an array `extends`, later entries win, so they come first. A config
 * that is missing, can't be parsed or was already visited is left out.
 */
async function loadConfigChain(configPath: string, seen: Set<string>): Promise<ConfigFile[]> {
  let json
  let realPath
  try {
    realPath = await fs.realpath(configPath)
    if (seen.has(realPath)) return []
    seen.add(realPath)
    const errors: ParseError[] = []
    json = parseJsonc(await fs.readFile(configPath, "utf8"), errors, { allowTrailingComma: true })
    if (errors.length > 0 || typeof json !== "object" || json === null) return []
  } catch {
    return []
  }
  const dir = path.dirname(realPath)
  const chain: ConfigFile[] = [{ dir, compilerOptions: json.compilerOptions ?? {} }]
  const parents = typeof json.extends === "string" ? [json.extends] : Array.isArray(json.extends) ? json.extends : []
  for (const spec of [...parents].reverse()) {
    if (typeof spec !== "string") continue
    const parent = await resolveExtends(spec, dir)
    if (parent) chain.push(...(await loadConfigChain(parent, seen)))
  }
  return chain
}

/**
 * Where an `extends` entry points: a path relative to the config, or a package
 * such as `@repo/typescript-config/nextjs.json` or `@tsconfig/next`, looked up
 * from the config's folder the way Node would.
 */
async function resolveExtends(spec: string, fromDir: string): Promise<string | undefined> {
  if (spec.startsWith(".") || path.isAbsolute(spec)) {
    const file = path.resolve(fromDir, spec)
    for (const candidate of [file, `${file}.json`]) {
      if ((await fs.pathExists(candidate)) && (await fs.stat(candidate)).isFile()) return candidate
    }
    return undefined
  }
  const require = createRequire(path.join(fromDir, "tsconfig.json"))
  for (const candidate of [spec, `${spec}.json`, `${spec}/tsconfig.json`]) {
    try {
      return require.resolve(candidate)
    } catch {
      // try the next form
    }
  }
  return undefined
}

/** `@/components` → `src/components`, or `components` when `@/` is the root. */
export function aliasToPath(alias: string, root: string): string {
  if (!alias.startsWith("@/")) return normalise(alias)
  const rest = normalise(alias.slice(2))
  return root ? `${root}/${rest}` : rest
}

/**
 * What someone typed at the init prompt → the alias to store. `src/components`
 * becomes `@/components` when `@/` is `src/`; an answer that is already an
 * alias is kept as it is.
 */
export function pathToAlias(input: string, root: string): string {
  const trimmed = input.trim()
  if (trimmed.startsWith("@/")) return `@/${normalise(trimmed.slice(2))}`
  const rel = normalise(trimmed)
  if (root && rel.startsWith(`${root}/`)) return `@/${rel.slice(root.length + 1)}`
  return `@/${rel}`
}

export class OutsideProjectError extends Error {}

/**
 * The absolute path of `rel` inside the project, or an `OutsideProjectError`
 * when it resolves anywhere else — `..` segments in a tsconfig mapping or an
 * alias, or a symlinked folder or file that leads out. Checked before every
 * write, so the CLI never creates or overwrites a file outside `cwd`.
 */
export async function resolveInsideProject(cwd: string, rel: string): Promise<string> {
  const root = await fs.realpath(cwd)
  const target = path.resolve(cwd, rel)
  // Follow symlinks through the deepest part of the path that already exists.
  let existing = target
  while (!(await fs.pathExists(existing))) existing = path.dirname(existing)
  const real = path.join(await fs.realpath(existing), path.relative(existing, target))
  for (const [base, p] of [[path.resolve(cwd), target], [root, real]]) {
    const inside = path.relative(base, p)
    if (inside === ".." || inside.startsWith(`..${path.sep}`) || path.isAbsolute(inside)) {
      throw new OutsideProjectError(
        `${rel} resolves to ${real}, outside the project at ${root}. ` +
          `Check the "@/*" path in tsconfig.json, the aliases in components.json and any symlinks on the way.`
      )
    }
  }
  return target
}

/** Drops a leading `./` and any trailing slash, so `./src/` reads as `src`. */
function normalise(p: string): string {
  const clean = path.posix.normalize(p.replace(/\\/g, "/")).replace(/\/+$/, "")
  return clean === "." ? "" : clean.replace(/^\.\//, "")
}
