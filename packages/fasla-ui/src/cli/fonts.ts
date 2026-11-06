/**
 * The font variables `init` leaves in the stylesheet. The shadcn CLI writes
 * `--font-sans: var(--font-sans);` into `@theme inline` for a font item, and
 * nothing sets `--font-sans` when the project already loads its font under
 * another name (create-next-app's Geist is `--font-geist-sans`): the variable
 * refers to itself, so `font-sans` resolves to nothing. This points such a
 * variable at the project's real one, or at a system font stack.
 */
import fs from "fs-extra"
import path from "path"

export type FontKind = "sans" | "mono" | "arabic"

/** The fallback for each kind: what the browser has when the project names no font. */
export const SYSTEM_FONT_STACKS: Record<FontKind, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  arabic: "system-ui, sans-serif",
}

/** The CSS variables next/font sets, as `variable: "--font-geist-sans"` in a layout. */
export function layoutFontVariables(layout: string): string[] {
  return [...layout.matchAll(/\bvariable\s*:\s*["'`](--[\w-]+)["'`]/g)].map((m) => m[1]!)
}

/** `--font-sans` → "sans"; a name that isn't one of the kinds gives undefined. */
function kindOf(name: string): FontKind | undefined {
  const kind = name.replace(/^--font-/, "")
  return kind === "sans" || kind === "mono" || kind === "arabic" ? kind : undefined
}

/**
 * The project's own variable for a kind: `--font-geist-sans` for sans,
 * `--font-geist-mono` for mono. Undefined when the layout sets none.
 */
export function projectFontVariable(kind: FontKind, variables: string[]): string | undefined {
  const named = variables.filter((v) => v.includes(kind))
  if (named.length > 0) return named[0]
  // A sans font has no "sans" in its name when it is the only one left: --font-inter.
  if (kind === "sans") {
    const rest = variables.filter((v) => !/mono|arabic|cairo|serif|display|heading/.test(v) && v !== "--font-sans")
    return rest.length === 1 ? rest[0] : undefined
  }
  return undefined
}

export interface FontFix {
  name: string
  to: string
}

/**
 * Rewrites each `--font-x: var(--font-x);` that nothing else sets. One the
 * layout sets itself (next/font with `variable: "--font-x"`) or the
 * stylesheet declares elsewhere is not a loop, and is left as it is.
 */
export function fixSelfReferencingFonts(css: string, layoutVariables: string[]): { css: string; fixed: FontFix[] } {
  const fixed: FontFix[] = []
  const out = css.replace(/(^[ \t]*)(--font-[\w-]+)(\s*:\s*)var\(\s*\2\s*\)(\s*;)/gm, (whole, indent, name, colon, end) => {
    if (layoutVariables.includes(name)) return whole
    const declared = new RegExp(`(?<![\\w-])${name}\\s*:(?!\\s*var\\(\\s*${name}\\s*\\))`)
    if (declared.test(css)) return whole
    const kind = kindOf(name)
    const own = kind && projectFontVariable(kind, layoutVariables)
    const to = own ? `var(${own})` : SYSTEM_FONT_STACKS[kind ?? "sans"]
    fixed.push({ name, to })
    return `${indent}${name}${colon}${to}${end}`
  })
  return { css: out, fixed }
}

/** Where a Next.js layout is, as the project keeps it. */
export const LAYOUT_CANDIDATES = [
  "src/app/layout.tsx",
  "app/layout.tsx",
  "src/app/layout.jsx",
  "app/layout.jsx",
  "src/app/layout.js",
  "app/layout.js",
]

export async function findLayout(cwd: string): Promise<string | undefined> {
  for (const file of LAYOUT_CANDIDATES) {
    if (await fs.pathExists(path.join(cwd, file))) return file
  }
  return undefined
}

/** Fixes the stylesheet in place, and says what it changed. */
export async function repairFontVariables(cwd: string, css: string): Promise<FontFix[]> {
  const cssPath = path.join(cwd, css)
  const text = await fs.readFile(cssPath, "utf8").catch(() => undefined)
  if (text === undefined) return []
  const layoutFile = await findLayout(cwd)
  const layout = layoutFile ? await fs.readFile(path.join(cwd, layoutFile), "utf8").catch(() => "") : ""
  const { css: next, fixed } = fixSelfReferencingFonts(text, layoutFontVariables(layout))
  if (fixed.length > 0) await fs.writeFile(cssPath, next)
  return fixed
}
