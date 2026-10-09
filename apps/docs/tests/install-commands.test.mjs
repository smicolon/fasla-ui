import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

// The CLI ships in @smicolon/fasla-ui from 0.5.0, and @smicolon/cli is retired.
// Every command keeps `@latest`: in a project with fasla-ui 0.4 or older
// installed, a bare `npx @smicolon/fasla-ui` runs that copy, which has no CLI
// and prints a scaffold's usage instead.

const docsRoot = path.resolve(import.meta.dir, "..")
const repoRoot = path.resolve(docsRoot, "../..")

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(tsx?|mdx?|json)$/.test(name) ? [full] : []
  })
}

// Everything a reader copies a command from: the site's pages and components,
// both message files, and the READMEs.
const files = [
  ...["app", "components", "lib", "messages"].flatMap((dir) => sourceFiles(path.join(docsRoot, dir))),
  path.join(repoRoot, "README.md"),
  path.join(repoRoot, "packages/fasla-ui/README.md"),
]

// npx, pnpm dlx, yarn dlx or bunx, then the package.
const RUNNER = String.raw`(?:npx(?:\s+(?:-y|--yes))?|pnpm\s+dlx|yarn\s+dlx|bunx(?:\s+--bun)?)\s+`
const OLD_CLI = new RegExp(`${RUNNER}@smicolon/cli\\b`, "g")
// `@latest` must end the token. Only whitespace, the end of the line, or what
// closes a command in the sources (a backtick, quote, `<`, `)`, `]`, `}`) may
// follow it, so `@latest-extra`, `@latest.1` or `@latest@0.4.2` fail.
const UNTAGGED = new RegExp(`${RUNNER}@smicolon/fasla-ui(?!@latest(?=[\\s\`'"<)\\]}]|$))`, "gm")

function offenders(pattern) {
  return files.flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .flatMap((line, i) => (line.match(pattern) ? [`${path.relative(repoRoot, file)}:${i + 1}: ${line.trim()}`] : []))
  )
}

describe("Install commands", () => {
  test("never run the retired @smicolon/cli", () => {
    expect(offenders(OLD_CLI)).toEqual([])
  })

  test("always run @smicolon/fasla-ui@latest, never the bare package", () => {
    expect(offenders(UNTAGGED)).toEqual([])
  })

  test("catch both mistakes, in every runner", () => {
    for (const line of ["npx @smicolon/cli init", "pnpm dlx @smicolon/cli add button", "bunx --bun @smicolon/cli list"]) {
      expect(line.match(OLD_CLI), line).not.toBeNull()
    }
    for (const line of ["npx @smicolon/fasla-ui init", "npx -y @smicolon/fasla-ui add", "npx @smicolon/fasla-ui@0.5.0 init", "npx @smicolon/fasla-ui@latest-extra init", "npx @smicolon/fasla-ui@latest.1 init", "npx @smicolon/fasla-ui@latest@0.4.2 init", "npx @smicolon/fasla-ui@latest/x", "npx @smicolon/fasla-ui@latest+1", "npx @smicolon/fasla-ui@latest:", "yarn dlx @smicolon/fasla-ui"]) {
      expect(line.match(UNTAGGED), line).not.toBeNull()
    }
    for (const line of ["npx @smicolon/fasla-ui@latest init", "npx @smicolon/fasla-ui@latest", "`npx @smicolon/fasla-ui@latest`", "\"npx @smicolon/fasla-ui@latest\"", "<code>npx @smicolon/fasla-ui@latest init</code>", "(npx @smicolon/fasla-ui@latest)", "npm install @smicolon/fasla-ui", "Set up with <code>@smicolon/cli</code>?"]) {
      expect(line.match(OLD_CLI) ?? line.match(UNTAGGED), line).toBeNull()
    }
  })

  test("show the new command on every component page and on Installation", () => {
    const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
    expect(read("components/install-command.tsx")).toContain("npx @smicolon/fasla-ui@latest add ${name}")
    const page = read("app/[locale]/docs/installation/page.tsx")
    for (const command of ["init", "add button", "add card input badge", "list"]) {
      expect(page).toContain(`npx @smicolon/fasla-ui@latest ${command}`)
    }
  })

  test("tell people who used @smicolon/cli what to do, both cases in one notice, in both languages", () => {
    const page = readFileSync(path.join(docsRoot, "app/[locale]/docs/installation/page.tsx"), "utf8")
    // One notice under the init command: 0.4 and later carry on, 0.3 and
    // earlier run init once to repair. Two separate notes let one be read alone.
    expect(page.indexOf('i.rich("cliPrevious", rich)')).toBeGreaterThan(page.indexOf("npx @smicolon/fasla-ui@latest init"))
    expect(page).not.toContain("cliLegacy")
    for (const lang of ["en", "ar"]) {
      const t = JSON.parse(readFileSync(path.join(docsRoot, `messages/${lang}.json`), "utf8")).docs.installation
      expect(t.cliLegacy).toBeUndefined()
      expect(t.cliPrevious).toContain("<code>@smicolon/cli</code>")
      expect(t.cliPrevious).toContain("0.4")
      expect(t.cliPrevious).toContain("0.3")
      expect(t.cliPrevious).toContain("<code>npx @smicolon/fasla-ui@latest init</code>")
      expect(t.cliPrevious.indexOf("0.4")).toBeLessThan(t.cliPrevious.indexOf("0.3"))
      expect(t.cliBody).toContain("<code>@smicolon/fasla-ui</code>")
    }
  })
})
