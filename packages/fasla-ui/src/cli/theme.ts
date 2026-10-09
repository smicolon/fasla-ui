/**
 * The Fasla theme, for `init`: which layer a project gets, and installing it.
 *
 * Both layers are registry items (`@fasla/theme-base`, `@fasla/theme`) that
 * the shadcn CLI installs, so `init` runs the same `shadcn add` the docs show:
 * one path, whichever way a developer comes in. A project's own colours are
 * never replaced unless someone chose Fasla's colours.
 */
import fs from "fs-extra"
import path from "path"
import type { Runner } from "./pm.js"
import { spawnRunner } from "./pm.js"

export type ThemeChoice = "fasla" | "brand"

/**
 * The registry items each choice installs. `theme` brings `theme-base` with
 * it; Geist comes beside it, except on Next.js 14 and older, whose
 * next/font/google has no Geist (its template loads Geist locally instead).
 */
export function themeItems(choice: ThemeChoice, { nextMajor }: { nextMajor?: number } = {}): string[] {
  if (choice === "brand") return ["theme-base"]
  return nextMajor !== undefined && nextMajor < 15 ? ["theme"] : ["theme", "font-geist"]
}

/** The question's answers, in the order they are offered. */
export const THEME_CHOICES: { value: ThemeChoice; title: string }[] = [
  { value: "fasla", title: "Starting from scratch: use Fasla's colours" },
  { value: "brand", title: "I have a brand: keep my colours" },
]

/** Where Tailwind and the stylesheet are in a project, for components.json. */
export interface ProjectStyle {
  tailwindMajor: 3 | 4
  /** The stylesheet that loads Tailwind, relative to the project. */
  css: string
  /** tailwind.config.*, for Tailwind 3; "" on Tailwind 4, which has none. */
  config: string
  /** Next.js: server components, so "use client" matters. */
  rsc: boolean
  /** Next.js's major version, when the project uses it. */
  nextMajor?: number
}

/**
 * Reads the Tailwind version from package.json, and finds the stylesheet that
 * loads Tailwind: app/globals.css in Next.js, src/index.css in Vite, or
 * wherever else `@import "tailwindcss"` or `@tailwind` is. `aliasRoot` is
 * where `@/` points, tried first.
 */
export async function detectProjectStyle(cwd: string, aliasRoot: string): Promise<ProjectStyle> {
  const pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } = await fs
    .readJson(path.join(cwd, "package.json"))
    .catch(() => ({}))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  const tailwindMajor = /^[\^~>=\s]*3\./.test(deps.tailwindcss ?? "") ? 3 : 4

  const under = (p: string) => (aliasRoot ? `${aliasRoot}/${p}` : p)
  const candidates = [
    ...new Set([
      under("app/globals.css"),
      "app/globals.css",
      "src/app/globals.css",
      "src/index.css",
      "src/styles/globals.css",
      "styles/globals.css",
      "src/globals.css",
      "src/App.css",
    ]),
  ]
  let css: string | undefined
  for (const file of candidates) {
    const text = await fs.readFile(path.join(cwd, file), "utf8").catch(() => undefined)
    if (text !== undefined && /@import\s+["']tailwindcss["']|@tailwind\s+base/.test(text)) {
      css = file
      break
    }
    if (text !== undefined && css === undefined) css = file
  }

  let config = ""
  if (tailwindMajor === 3) {
    for (const name of ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs", "tailwind.config.cjs"]) {
      if (await fs.pathExists(path.join(cwd, name))) {
        config = name
        break
      }
    }
    config ||= "tailwind.config.ts"
  }

  const nextVersion = /(\d+)\./.exec(deps.next ?? "")
  return {
    tailwindMajor,
    css: css ?? under("app/globals.css"),
    config,
    rsc: "next" in deps,
    nextMajor: nextVersion ? Number(nextVersion[1]) : undefined,
  }
}

/**
 * Whether a stylesheet already sets any of shadcn's colour tokens — the
 * project's own colours, or the stock ones `shadcn init` wrote. Either way
 * they are the project's, and only an explicit choice replaces them.
 */
export function hasColourTokens(css: string): boolean {
  return /--(background|foreground|primary|secondary|muted|accent|destructive|border|input|ring)\s*:/.test(css)
}

/**
 * The layer to install without asking: what `--theme` says, or with `--yes`
 * the one that changes no colours the project has — Fasla's only when there
 * are none to replace. Undefined means ask.
 */
export function themeWithoutAsking({
  flag,
  yes,
  hasColours,
}: {
  flag?: string
  yes: boolean
  hasColours: boolean
}): ThemeChoice | undefined {
  if (flag === "fasla" || flag === "brand") return flag
  if (yes) return hasColours ? "brand" : "fasla"
  return undefined
}

/** The command that installs a layer, as the docs show it and `init` runs it. */
export function themeCommand(choice: ThemeChoice, project: { nextMajor?: number } = {}): string {
  return `npx shadcn@latest add ${themeItems(choice, project).map((name) => `@fasla/${name}`).join(" ")}`
}

/**
 * This process's environment, less what an outer `npx` passes down about its
 * own run: `npx --package=… @smicolon/fasla-ui` exports npm_config_package, and an
 * inner `npx shadcn@latest` would then look for `shadcn@latest` inside our
 * package and fail with "command not found".
 */
export function childEnv(env: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const clean = { ...env }
  for (const key of Object.keys(clean)) {
    if (/^npm_config_(package|call)$/i.test(key)) delete clean[key]
  }
  return clean
}

/**
 * Installs a layer with the shadcn CLI, in the project. `--yes` lets it run
 * unattended; it overwrites no component files, as theme items have none.
 */
export function applyTheme(cwd: string, choice: ThemeChoice, project: { nextMajor?: number } = {}, run: Runner = spawnRunner) {
  const items = themeItems(choice, project).map((name) => `@fasla/${name}`)
  return run("npx", ["-y", "shadcn@latest", "add", ...items, "--yes"], cwd, childEnv())
}
