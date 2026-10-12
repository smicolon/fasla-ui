/**
 * The project's package manager, read from its lockfile, and the commands
 * that install with it. `npm install` in a pnpm project fails outright, and
 * in a bun or yarn project leaves a second lockfile beside the real one.
 */
import { spawn } from "child_process"
import fs from "fs-extra"
import path from "path"
import semver from "semver"

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

/**
 * Lockfiles in the order they win when a folder holds more than one. A stray
 * package-lock.json is the usual extra — someone ran `npm install` once in a
 * bun or pnpm project — so npm's comes last.
 */
const LOCKFILES: [string, PackageManager][] = [
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
  ["npm-shrinkwrap.json", "npm"],
]

/**
 * The package manager whose lockfile is nearest to `cwd`, looking in `cwd`
 * and then each folder above it, so a workspace inside a monorepo finds the
 * lockfile at the repo root. npm when there is none anywhere.
 */
export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  for (let dir = path.resolve(cwd); ; dir = path.dirname(dir)) {
    for (const [file, pm] of LOCKFILES) {
      if (await fs.pathExists(path.join(dir, file))) return pm
    }
    if (path.dirname(dir) === dir) return "npm"
  }
}

/** The arguments after the package manager's name that add `packages`. */
export function installArgs(pm: PackageManager, packages: string[], { dev = false } = {}): string[] {
  const verb = pm === "npm" ? "install" : "add"
  // bun spells the dev flag -d; the others take -D.
  const devFlag = pm === "bun" ? "-d" : "-D"
  return [verb, ...(dev ? [devFlag] : []), ...packages]
}

/** The install command as someone would type it: `pnpm add clsx tailwind-merge`. */
export function installCommand(pm: PackageManager, packages: string[], options: { dev?: boolean } = {}): string {
  return [pm, ...installArgs(pm, packages, options)].join(" ")
}

/** The name in an install spec: `tailwind-merge` from `tailwind-merge@^2`, `@scope/x` from `@scope/x@1`. */
export const specName = (spec: string) => spec.replace(/(?<=.)@.*$/, "")

/** The range in an install spec: `^2` from `tailwind-merge@^2`, undefined for a bare name. */
const specRange = (spec: string) => (spec.length > specName(spec).length ? spec.slice(specName(spec).length + 1) : undefined)

/**
 * The version of `name` installed where Node would resolve it from `cwd`: its
 * node_modules, then each folder above, as in a monorepo. Read from the file,
 * not require.resolve: tailwind-merge 3's exports don't include package.json.
 */
export async function installedVersion(cwd: string, name: string): Promise<string | undefined> {
  for (let dir = path.resolve(cwd); ; dir = path.dirname(dir)) {
    const pkg = await fs.readJson(path.join(dir, "node_modules", name, "package.json")).catch(() => undefined)
    if (typeof pkg?.version === "string") return pkg.version
    if (path.dirname(dir) === dir) return undefined
  }
}

/**
 * The specs in `packages` the project doesn't already have at a compatible
 * version. A bare name, `lucide-react`, is there once package.json lists it,
 * in dependencies or devDependencies, at any version. A name with a range,
 * `@base-ui/react@^1`, is there only when the listed range stays inside it and
 * the installed copy, if any, satisfies it; a listed range that may resolve
 * outside it, such as `*`, `latest` or a tag, counts as not, at the cost of a
 * reinstall. With no readable package.json, all of them.
 */
export async function missingPackages(cwd: string, packages: string[]): Promise<string[]> {
  let pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } = {}
  try {
    pkg = await fs.readJson(path.join(cwd, "package.json"))
  } catch {
    return packages
  }
  const listed: Record<string, string | undefined> = { ...pkg.dependencies, ...pkg.devDependencies }
  const missing: string[] = []
  for (const spec of packages) {
    const name = specName(spec)
    const range = listed[name]
    const wanted = specRange(spec)
    if (range === undefined) missing.push(spec)
    else if (wanted !== undefined && !(await compatible(cwd, name, range, wanted))) missing.push(spec)
  }
  return missing
}

/** Whether `listed`, and the copy of `name` installed, if any, stay inside `wanted`. */
async function compatible(cwd: string, name: string, listed: string, wanted: string): Promise<boolean> {
  try {
    if (!semver.subset(listed, wanted)) return false
  } catch {
    // Not a range semver reads: a tag, an alias, `workspace:*`.
    return false
  }
  const installed = await installedVersion(cwd, name)
  return installed === undefined || semver.satisfies(installed, wanted)
}

export type InstallResult = { ok: true } | { ok: false; output: string }

/** Runs a command and resolves with its exit, never rejects. `env` defaults to this process's. */
export type Runner = (command: string, args: string[], cwd: string, env?: NodeJS.ProcessEnv) => Promise<InstallResult>

/**
 * Runs the package manager with its output captured, so a failure can be
 * shown in full and a success stays quiet. A package manager that isn't
 * installed is a failure like any other, not a crash.
 */
export const spawnRunner: Runner = (command, args, cwd, env = process.env) =>
  new Promise((resolve) => {
    let output = ""
    let child
    try {
      // Windows resolves npm, pnpm and yarn to .cmd shims, which only a shell runs.
      child = spawn(command, args, { cwd, env, shell: process.platform === "win32", stdio: ["ignore", "pipe", "pipe"] })
    } catch (error) {
      resolve({ ok: false, output: (error as Error).message })
      return
    }
    child.stdout?.on("data", (chunk) => (output += chunk))
    child.stderr?.on("data", (chunk) => (output += chunk))
    child.on("error", (error) => resolve({ ok: false, output: `${output}${error.message}` }))
    child.on("close", (code) => resolve(code === 0 ? { ok: true } : { ok: false, output }))
  })

/** Installs `packages` into the project at `cwd` with `pm`. */
export function install(pm: PackageManager, packages: string[], cwd: string, run: Runner = spawnRunner) {
  return run(pm, installArgs(pm, packages), cwd)
}
