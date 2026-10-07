/**
 * Maps between the `@/` aliases stored in components.json and the folders they
 * point at on disk. `@/` is whatever the project's tsconfig says it is, not
 * always `src/`: a Next.js app without a `src/` folder maps `@/*` to `./*`.
 */
import fs from "fs-extra"
import { parse as parseJsonc, type ParseError } from "jsonc-parser"
import { open } from "fs/promises"
import { createRequire } from "module"
import path from "path"

interface ConfigFile {
  dir: string
  compilerOptions: { baseUrl?: unknown; paths?: Record<string, unknown> }
}

/** A config in the chain that could not be read, so what it sets is unknown. */
interface UnreadConfig {
  problem: string
}

type ChainEntry = ConfigFile | UnreadConfig

export interface AliasRoot {
  /**
   * The folder `@/` points at, relative to the project root; `""` is the root
   * itself. It can point outside the project — `resolveInsideProject` refuses
   * that before anything is written.
   */
  root: string
  /**
   * Whether a tsconfig or jsconfig maps `@/*`. When it doesn't, `root` is a
   * guess from the folder layout, and nothing in the project resolves `@/`
   * yet: a Vite app has no such mapping until someone adds one.
   */
  mapped: boolean
  /**
   * Set when the configs could not all be read, so `root` is only a guess:
   * say so and let someone confirm it, never use it silently.
   */
  problem?: string
}

/**
 * Reads `@/` from the project's tsconfig.json, then jsconfig.json, following
 * `extends` the way TypeScript does. With no `@/*` path anywhere, falls back
 * to `src` when the project has a `src/` folder and to the project root when
 * it doesn't.
 */
export async function findAliasRoot(cwd: string): Promise<AliasRoot> {
  const realCwd = await fs.realpath(cwd)
  const guess = (await fs.pathExists(path.join(cwd, "src"))) ? "src" : ""
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const configPath = path.join(realCwd, file)
    if (!(await fs.pathExists(configPath))) continue
    const chain = await loadConfigChain(configPath, realCwd, new Set())
    // `paths` is replaced whole, not merged: the nearest config that sets it
    // decides, even when its object has no `@/*` key.
    const withPaths = nearest(chain, (c) => c.compilerOptions.paths !== undefined)
    if (withPaths && "problem" in withPaths) return { root: guess, mapped: false, problem: withPaths.problem }
    const target = withPaths?.compilerOptions.paths?.["@/*"]
    if (!withPaths || !Array.isArray(target) || typeof target[0] !== "string" || !target[0].endsWith("*")) continue
    // A mapping is relative to baseUrl when one is set anywhere in the chain,
    // and baseUrl to the config that sets it. Without one, it is relative to
    // the config that declares `paths`, not the one that extends it.
    const withBaseUrl = nearest(chain, (c) => typeof c.compilerOptions.baseUrl === "string")
    if (withBaseUrl && "problem" in withBaseUrl) return { root: guess, mapped: false, problem: withBaseUrl.problem }
    const base = withBaseUrl
      ? path.resolve(withBaseUrl.dir, withBaseUrl.compilerOptions.baseUrl as string)
      : withPaths.dir
    return { root: normalise(path.relative(realCwd, path.resolve(base, target[0].slice(0, -1)))), mapped: true }
  }
  return { root: guess, mapped: false }
}

/**
 * `findAliasRoot`, for a command. When the configs could not all be read, a
 * `--yes` run stops with an `UnknownAliasRootError`; an interactive run hands
 * the problem and the guess to `ask`, and uses the folder it returns.
 * `mapped` is false only when no config maps `@/*` and the root is a guess.
 */
export async function chooseAliasRoot(
  cwd: string,
  { yes, ask }: { yes: boolean; ask: (problem: string, guess: string) => Promise<string | undefined> }
): Promise<{ root: string; mapped: boolean }> {
  const found = await findAliasRoot(cwd)
  if (!found.problem) return { root: found.root, mapped: found.mapped }
  if (yes) {
    throw new UnknownAliasRootError(
      `${found.problem} Can't tell where "@/" points. Fix that config — installing ` +
        `dependencies usually does — or run without --yes to choose the folder.`
    )
  }
  const answer = await ask(found.problem, found.root)
  if (answer === undefined) throw new UnknownAliasRootError("Cancelled.")
  // Whoever answered says where `@/` points, so it counts as mapped.
  return { root: normalise(answer.trim() || "."), mapped: true }
}

export class UnknownAliasRootError extends Error {}

/**
 * The first entry in precedence order that sets an option, or the first
 * unreadable config before it — what that config would have set is unknown.
 */
function nearest(chain: ChainEntry[], sets: (c: ConfigFile) => boolean): ChainEntry | undefined {
  return chain.find((c) => "problem" in c || sets(c))
}

/**
 * The config at `configPath` followed by everything it extends, nearest
 * first, so the first entry that sets an option is the one TypeScript uses.
 * With an array `extends`, later entries win, so they come first. A config
 * that is missing or can't be parsed stays in the chain as an `UnreadConfig`.
 */
async function loadConfigChain(configPath: string, cwd: string, seen: Set<string>): Promise<ChainEntry[]> {
  const name = path.relative(cwd, configPath) || configPath
  let json
  let realPath
  try {
    realPath = await fs.realpath(configPath)
    if (seen.has(realPath)) return []
    seen.add(realPath)
    const errors: ParseError[] = []
    json = parseJsonc(await fs.readFile(realPath, "utf8"), errors, { allowTrailingComma: true })
    if (errors.length > 0 || typeof json !== "object" || json === null) throw new Error("unparseable")
  } catch {
    return [{ problem: `${name} could not be read as JSON.` }]
  }
  const dir = path.dirname(realPath)
  const chain: ChainEntry[] = [{ dir, compilerOptions: json.compilerOptions ?? {} }]
  const parents = typeof json.extends === "string" ? [json.extends] : Array.isArray(json.extends) ? json.extends : []
  for (const spec of [...parents].reverse()) {
    if (typeof spec !== "string") continue
    const parent = await resolveExtends(spec, dir)
    if (parent) chain.push(...(await loadConfigChain(parent, cwd, seen)))
    else chain.push({ problem: `${name} extends "${spec}", which could not be found.` })
  }
  return chain
}

/**
 * Where an `extends` entry points, found the way TypeScript finds it: a path
 * relative to the config, with `.json` added if needed, or a package looked
 * up through node_modules.
 */
async function resolveExtends(spec: string, fromDir: string): Promise<string | undefined> {
  if (spec.startsWith("./") || spec.startsWith("../") || path.isAbsolute(spec)) {
    const file = path.resolve(fromDir, spec)
    if (await isFile(file)) return file
    if (!file.endsWith(".json") && (await isFile(`${file}.json`))) return `${file}.json`
    return undefined
  }
  return resolvePackageConfig(spec, fromDir)
}

/**
 * A package config such as `@tsconfig/next`, `@repo/typescript-config/nextjs`
 * or `@repo/typescript-config/nextjs.json`. When the package has `exports`,
 * only a JSON file they map is used — TypeScript reports anything else as not
 * found, so a mapping from it would not apply to the project either. Without
 * `exports`, a bare name reads the package's `tsconfig` field, then its
 * tsconfig.json; a subpath is tried as written, with `.json`, and as a folder
 * holding a tsconfig.json.
 */
async function resolvePackageConfig(spec: string, fromDir: string): Promise<string | undefined> {
  const parts = spec.split("/")
  const nameLength = spec.startsWith("@") ? 2 : 1
  const name = parts.slice(0, nameLength).join("/")
  const subpath = parts.slice(nameLength).join("/")

  for (let dir = fromDir; ; dir = path.dirname(dir)) {
    const pkgDir = path.join(dir, "node_modules", name)
    if (await fs.pathExists(path.join(pkgDir, "package.json"))) {
      let pkg: { exports?: unknown; tsconfig?: unknown } = {}
      try {
        pkg = await fs.readJson(path.join(pkgDir, "package.json"))
      } catch {
        return undefined
      }
      if (pkg.exports !== undefined) {
        try {
          const resolved = createRequire(path.join(pkgDir, "package.json")).resolve(spec)
          return resolved.endsWith(".json") ? resolved : undefined
        } catch {
          return undefined
        }
      }
      const candidates = subpath
        ? [path.join(pkgDir, subpath), path.join(pkgDir, `${subpath}.json`), path.join(pkgDir, subpath, "tsconfig.json")]
        : [
            ...(typeof pkg.tsconfig === "string" ? [path.join(pkgDir, pkg.tsconfig), path.join(pkgDir, `${pkg.tsconfig}.json`)] : []),
            path.join(pkgDir, "tsconfig.json"),
          ]
      for (const candidate of candidates) {
        if (candidate.endsWith(".json") && (await isFile(candidate))) return candidate
      }
      return undefined
    }
    if (path.dirname(dir) === dir) return undefined
  }
}

/** Whether `p` is a file, following symlinks. */
async function isFile(p: string): Promise<boolean> {
  try {
    return (await fs.stat(p)).isFile()
  } catch {
    return false
  }
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
 * alias is kept as it is. A folder outside `@/`'s folder has no alias, so it
 * gives `undefined` — never an alias for some other folder inside it.
 */
export function pathToAlias(input: string, root: string): string | undefined {
  const trimmed = input.trim()
  if (trimmed.startsWith("@/")) return `@/${normalise(trimmed.slice(2))}`
  const rel = normalise(trimmed)
  if (!root) return `@/${rel}`
  if (rel.startsWith(`${root}/`)) return `@/${rel.slice(root.length + 1)}`
  return undefined
}

/** Why `pathToAlias` gave no alias for `input`, to show before asking again. */
export function outsideAliasMessage(input: string, root: string): string {
  return (
    `${normalise(input.trim()) || "."} is not inside ${root}/, the folder "@/" points to, ` +
    `so files there can't be imported through "@/". Enter a folder inside ${root}/, such as ${root}/components.`
  )
}

/**
 * How `add` treats one destination. Without `--overwrite`, a file already
 * there — a symlink included, even a dangling one — is skipped and never
 * written, so only its folder has to be inside the project. Anything that
 * will be written must pass `resolveWritableFile`.
 */
export async function checkDestination(cwd: string, rel: string, overwrite: boolean): Promise<"write" | "skip"> {
  if (!overwrite && (await lexists(path.resolve(cwd, rel)))) {
    await resolveInsideProject(cwd, path.dirname(rel))
    return "skip"
  }
  await resolveWritableFile(cwd, rel)
  return "write"
}

/** A destination the CLI refuses to write: outside the project, or a symlink. */
export class UnsafePathError extends Error {}

const SEE_CONFIG = `Check the "@/*" path in tsconfig.json, the aliases in components.json and any symlinks on the way.`

/**
 * The absolute path of `rel` inside the project, or an `UnsafePathError` when
 * it resolves anywhere else — `..` segments in a tsconfig mapping or an alias,
 * or a symlinked folder that leads out, dangling ones included.
 */
export async function resolveInsideProject(cwd: string, rel: string): Promise<string> {
  const root = await fs.realpath(cwd)
  const target = path.resolve(cwd, rel)
  // Follow symlinks through the deepest part of the path that already exists.
  // lstat, not stat: a symlink to nothing still exists and is still followed.
  let existing = target
  while (!(await lexists(existing))) existing = path.dirname(existing)
  let realExisting
  try {
    realExisting = await fs.realpath(existing)
  } catch {
    const link = existing === target ? rel : `${rel}: the folder ${existing}`
    throw new UnsafePathError(`${link} is a symlink to something that does not exist. ${SEE_CONFIG}`)
  }
  const real = path.join(realExisting, path.relative(existing, target))
  for (const [base, p] of [[path.resolve(cwd), target], [root, real]]) {
    const inside = path.relative(base, p)
    if (inside === ".." || inside.startsWith(`..${path.sep}`) || path.isAbsolute(inside)) {
      throw new UnsafePathError(`${rel} resolves to ${real}, outside the project at ${root}. ${SEE_CONFIG}`)
    }
  }
  return target
}

/**
 * `resolveInsideProject` for a file the CLI is about to write, which must not
 * itself be a symlink — wherever it points, even at nothing, writing would
 * follow it. Checked with lstat, which sees the link rather than its target.
 */
export async function resolveWritableFile(cwd: string, rel: string): Promise<string> {
  const target = await resolveInsideProject(cwd, rel)
  const stat = await fs.lstat(target).catch(() => undefined)
  if (stat?.isSymbolicLink()) {
    throw new UnsafePathError(
      `${rel} is a symlink, and writing to it would change the file it points at instead. ` +
        `Remove the symlink, then run the command again.`
    )
  }
  return target
}

/**
 * Writes a file without following a symlink at its path, on systems that
 * support it: a link that appears after `resolveWritableFile` checked the
 * path makes the write fail instead of landing somewhere else. A new file
 * gets 0o666 less the umask, as `fs.writeFile` gives it, so a shared
 * project's group-write umask still applies; an existing file keeps its mode.
 *
 * With `createOnly`, the file must not exist yet: anything at the path — a
 * file another process made after a check, one written earlier in the same
 * run, a symlink — fails the write with `EEXIST` and is left as it was. The
 * check and the create are one step, so nothing can slip in between them.
 */
export async function writeFileNoFollow(
  file: string,
  content: string,
  { createOnly = false }: { createOnly?: boolean } = {}
): Promise<void> {
  const { O_WRONLY, O_CREAT, O_TRUNC, O_EXCL, O_NOFOLLOW } = fs.constants
  const flags = createOnly ? O_WRONLY | O_CREAT | O_EXCL : O_WRONLY | O_CREAT | O_TRUNC | (O_NOFOLLOW ?? 0)
  const handle = await open(file, flags, 0o666)
  try {
    await handle.writeFile(content, "utf8")
  } finally {
    await handle.close()
  }
}

/**
 * Writes one file for `add`, deciding whether it may at the moment of the
 * write. A destination another component wrote earlier in the same run is
 * never replaced, with or without `overwrite` — two registry files would
 * otherwise overwrite each other. Without `overwrite`, a file already there,
 * even one created after `checkDestination` ran, is left as it is.
 */
export async function installFile(
  file: string,
  content: string,
  owner: string,
  { overwrite, writtenBy }: { overwrite: boolean; writtenBy: Map<string, string> }
): Promise<{ result: "written" } | { result: "exists" } | { result: "duplicate"; by: string }> {
  const by = writtenBy.get(file)
  if (by !== undefined) return { result: "duplicate", by }
  if (overwrite) await writeFileNoFollow(file, content)
  else if (!(await writeFileIfAbsent(file, content))) return { result: "exists" }
  writtenBy.set(file, owner)
  return { result: "written" }
}

/**
 * Writes a file only if nothing is at its path, a symlink included, and says
 * whether it did. Unlike checking first and writing after, a file that
 * appears in between is left as it is.
 */
export async function writeFileIfAbsent(file: string, content: string): Promise<boolean> {
  try {
    await writeFileNoFollow(file, content, { createOnly: true })
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") return false
    throw error
  }
}

/** Whether anything, a symlink included, is at `p`. */
async function lexists(p: string): Promise<boolean> {
  try {
    await fs.lstat(p)
    return true
  } catch {
    return false
  }
}

/** Drops a leading `./` and any trailing slash, so `./src/` reads as `src`. */
function normalise(p: string): string {
  const clean = path.posix.normalize(p.replace(/\\/g, "/")).replace(/\/+$/, "")
  return clean === "." ? "" : clean.replace(/^\.\//, "")
}
