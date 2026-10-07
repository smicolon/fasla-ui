/**
 * The project's package manager, read from its lockfile, and the commands
 * that install with it. `npm install` in a pnpm project fails outright, and
 * in a bun or yarn project leaves a second lockfile beside the real one.
 */
import { spawn } from "child_process"
import fs from "fs-extra"
import path from "path"

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

/**
 * The packages in `packages` that package.json does not already list, in
 * dependencies or devDependencies. With no readable package.json, all of
 * them.
 */
export async function missingPackages(cwd: string, packages: string[]): Promise<string[]> {
  let pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } = {}
  try {
    pkg = await fs.readJson(path.join(cwd, "package.json"))
  } catch {
    return packages
  }
  const listed = { ...pkg.dependencies, ...pkg.devDependencies }
  return packages.filter((name) => !(name in listed))
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
