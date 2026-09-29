/**
 * Maps between the `@/` aliases stored in components.json and the folders they
 * point at on disk. `@/` is whatever the project's tsconfig says it is, not
 * always `src/`: a Next.js app without a `src/` folder maps `@/*` to `./*`.
 */
import fs from "fs-extra"
import path from "path"

/**
 * The folder `@/` points at, relative to the project root, from the text of a
 * tsconfig.json or jsconfig.json. `""` is the project root itself. Undefined
 * when the file sets no `@/*` path.
 */
export function parseAliasRoot(configText: string): string | undefined {
  let config
  try {
    config = JSON.parse(stripJsonComments(configText))
  } catch {
    return undefined
  }
  const options = config?.compilerOptions ?? {}
  const target = options.paths?.["@/*"]?.[0]
  if (typeof target !== "string" || !target.endsWith("*")) return undefined
  const joined = path.posix.join(options.baseUrl ?? ".", target.slice(0, -1))
  return normalise(joined)
}

/**
 * Reads `@/` from the project's tsconfig.json, then jsconfig.json. With
 * neither, or no `@/*` path in them, falls back to `src` when the project has
 * a `src/` folder and to the project root when it doesn't.
 */
export async function readAliasRoot(cwd: string): Promise<string> {
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const configPath = path.join(cwd, file)
    if (!(await fs.pathExists(configPath))) continue
    const root = parseAliasRoot(await fs.readFile(configPath, "utf8"))
    if (root !== undefined) return root
  }
  return (await fs.pathExists(path.join(cwd, "src"))) ? "src" : ""
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

/** Drops a leading `./` and any trailing slash, so `./src/` reads as `src`. */
function normalise(p: string): string {
  const clean = path.posix.normalize(p.replace(/\\/g, "/")).replace(/\/+$/, "")
  return clean === "." ? "" : clean.replace(/^\.\//, "")
}

/**
 * tsconfig.json allows comments and trailing commas. Strips both, leaving
 * anything inside a string alone — `"$schema": "https://..."` keeps its `//`.
 */
function stripJsonComments(text: string): string {
  let out = ""
  let inString = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inString) {
      out += ch
      if (ch === "\\") out += text[++i] ?? ""
      else if (ch === '"') inString = false
    } else if (ch === '"') {
      inString = true
      out += ch
    } else if (ch === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i++
      out += "\n"
    } else if (ch === "/" && text[i + 1] === "*") {
      i = text.indexOf("*/", i + 2)
      if (i === -1) break
      i++
    } else {
      out += ch
    }
  }
  return out.replace(/,(\s*[}\]])/g, "$1")
}
