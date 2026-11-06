/**
 * What `init` changed, for the summary it ends with: which files it created
 * or changed, and in what way. Read from the files before and after, so it
 * reports what is on disk, including what the shadcn CLI wrote.
 */
import fs from "fs-extra"
import path from "path"
import type { FontFix } from "./fonts.js"

/** File contents by project-relative path; undefined when the file is absent. */
export type Snapshot = Record<string, string | undefined>

export async function snapshotFiles(cwd: string, files: string[]): Promise<Snapshot> {
  const out: Snapshot = {}
  for (const file of files) out[file] = await fs.readFile(path.join(cwd, file), "utf8").catch(() => undefined)
  return out
}

/** The value of a CSS custom property's first declaration, as written. */
function cssValue(css: string, name: string): string | undefined {
  return new RegExp(`${name}\\s*:\\s*([^;]+);`).exec(css)?.[1]?.trim()
}

function packageDelta(before: string | undefined, after: string | undefined): string[] {
  const names = (text: string | undefined): string[] => {
    try {
      const pkg = JSON.parse(text ?? "{}")
      return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
    } catch {
      return []
    }
  }
  const had = new Set(names(before))
  return names(after).filter((name) => !had.has(name))
}

export interface SummaryInput {
  before: Snapshot
  after: Snapshot
  components: string
  /** The utils alias, as components.json stores it. */
  utilsAlias: string
  /** The utils file, relative to the project. */
  utils: string
  css: string
  layout?: string
  fontFixes: FontFix[]
  /** The theme was not installed (--no-install) and this is the command to run. */
  themeCommand?: string
}

/** One line per file created or changed: `created  components.json — …`. */
export function describeChanges({ before, after, components, utilsAlias, utils, css, layout, fontFixes, themeCommand }: SummaryInput): string[] {
  const lines: string[] = []
  const status = (file: string) => (before[file] === undefined ? "created" : before[file] !== after[file] ? "changed" : "unchanged")
  const row = (kind: string, file: string, note: string) => lines.push(`${kind.padEnd(9)} ${file}${note ? ` — ${note}` : ""}`)

  row(status("components.json"), "components.json", `components alias ${components}, utils alias ${utilsAlias}`)

  const utilsStatus = status(utils)
  row(utilsStatus, utils, utilsStatus === "unchanged" ? "yours was already there, kept" : "the cn() helper every component imports")

  const cssBefore = before[css] ?? ""
  const cssAfter = after[css] ?? ""
  if (cssBefore !== cssAfter) {
    const notes: string[] = []
    const moved = ["--background", "--foreground"].filter((token) => cssValue(cssBefore, token) !== cssValue(cssAfter, token))
    if (moved.length > 0) notes.push(`${moved.join(" and ")} changed to Fasla's ${moved.length > 1 ? "values" : "value"}`)
    notes.push("adds Fasla's theme tokens and the Arabic font rule")
    for (const fix of fontFixes) notes.push(`${fix.name} set to ${fix.to}`)
    row("changed", css, notes.join("; "))
  } else if (themeCommand) {
    row("unchanged", css, "the theme is not installed yet")
  }

  if (layout && (before[layout] ?? "") !== (after[layout] ?? "")) {
    const text = after[layout] ?? ""
    const notes: string[] = []
    if (/\bCairo\b/.test(text) && !/\bCairo\b/.test(before[layout] ?? "")) notes.push("adds the Cairo font")
    if (/className=\{cn\(/.test(text) && !/className=\{cn\(/.test(before[layout] ?? "")) notes.push("the html className now goes through cn()")
    row("changed", layout, notes.join("; ") || "font setup")
  }

  const added = packageDelta(before["package.json"], after["package.json"])
  if (added.length > 0) row("changed", "package.json", `adds ${added.join(", ")}`)

  return lines
}
