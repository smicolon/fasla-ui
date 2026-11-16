#!/usr/bin/env node
/**
 * The free-only check: this repository is the open-source part of Fasla, the
 * 35 UI primitives and 7 effects, the CLI, the docs and the tokens. Fasla
 * Pro's blocks and templates live elsewhere. The check fails when any of them
 * comes back:
 *
 *   1. registry.json lists exactly the free items, each with files that exist
 *      under registry/ui or registry/effects;
 *   2. no tracked path is one of the folders the blocks and templates used,
 *      and no script or stylesheet comes from their paths or imports their code;
 *   3. no tracked text file carries the premium marker or a Figma link;
 *   4. with --built, the built registry in apps/docs/public/r and the npm
 *      tarball hold only free items (run it after `bun run build`).
 *
 *   node scripts/check-free-only.mjs [--built]
 */
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const PKG = path.join(ROOT, "packages/fasla-ui")
const FREE = { primitives: 35, effects: 7 }

const failures = []
const fail = (message) => failures.push(message)
const ok = (message) => console.log(`ok    ${message}`)

// ── 1. The registry ─────────────────────────────────────────────────────────
const registry = JSON.parse(readFileSync(path.join(PKG, "registry.json"), "utf8"))
const items = registry.items
const effects = items.filter((item) => item.categories?.includes("effects"))
const primitives = items.filter((item) => !item.categories?.includes("effects"))
if (items.length !== FREE.primitives + FREE.effects) fail(`registry.json lists ${items.length} items, not ${FREE.primitives + FREE.effects}`)
if (primitives.length !== FREE.primitives) fail(`registry.json lists ${primitives.length} UI primitives, not ${FREE.primitives}`)
if (effects.length !== FREE.effects) fail(`registry.json lists ${effects.length} effects, not ${FREE.effects}`)
for (const item of items) {
  if (item.type !== "registry:ui") fail(`${item.name} is ${item.type}, not registry:ui`)
  for (const file of item.files ?? []) {
    if (!/^registry\/(ui|effects)\//.test(file.path)) fail(`${item.name}: ${file.path} is outside registry/ui and registry/effects`)
    else if (!existsSync(path.join(PKG, file.path))) fail(`${item.name}: ${file.path} does not exist`)
  }
}
ok(`registry.json: ${primitives.length} UI primitives and ${effects.length} effects, every file present`)

// ── 2. Tracked paths ────────────────────────────────────────────────────────
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
  .split("\0")
  .filter(Boolean)
const PRO_PATHS =
  /^(packages\/fasla-ui\/registry\/(blocks|templates)\/|apps\/storybook\/stories\/(blocks|templates)\/|apps\/docs\/app\/\[locale\]\/(docs\/(blocks|templates)|blocks-preview|templates-preview)\/|apps\/docs\/components\/blocks\/|apps\/docs\/public\/(blocks|images)\/|apps\/docs\/public\/landing\/img\/blocks\/|design\/)/
const proPaths = tracked.filter((file) => PRO_PATHS.test(file))
if (proPaths.length) fail(`${proPaths.length} tracked paths belong to Fasla Pro, first: ${proPaths.slice(0, 5).join(", ")}`)
else ok(`${tracked.length} tracked paths, none in a Pro folder`)

// ── 2b. Code files from a premium path ──────────────────────────────────────
// The home page shows Fasla Pro as pictures (public/landing/pro/), drawn by
// its own section files. No script or stylesheet may come back from where the
// blocks and templates lived: not by path, and not by importing their code.
const CODE = /\.(c?[jt]sx?|mjs|mts|css)$/
const PRO_CODE_PATHS = [
  /^premium\//,
  /(^|\/)landing-premium\.css$/,
  /^apps\/docs\/lib\/(blocks|templates)\.ts$/,
  /^apps\/docs\/app\/\[locale\]\/\(home\)\/_components\/(block-library|blocks-grid|blocks-data|templates-section|templates-carousel)\.tsx?$/,
]
const PRO_IMPORT = /from\s+["'][^"']*(@fasla-ui\/blocks\/|registry\/(blocks|templates)\/|\/block-library|\/blocks-data|\/templates-carousel|\/templates-section|\/blocks-grid|@free\/)[^"']*["']/
const codeFiles = tracked.filter((file) => CODE.test(file) && existsSync(path.join(ROOT, file)))
const proCode = codeFiles.filter((file) => PRO_PATHS.test(file) || PRO_CODE_PATHS.some((rx) => rx.test(file)))
const proImports = codeFiles.filter((file) => PRO_IMPORT.test(readFileSync(path.join(ROOT, file), "utf8")))
if (proCode.length) fail(`${proCode.length} script or style files come from a Pro path: ${proCode.slice(0, 5).join(", ")}`)
if (proImports.length) fail(`${proImports.length} files import block or template code: ${proImports.slice(0, 5).join(", ")}`)
if (!proCode.length && !proImports.length) ok(`${codeFiles.length} script and style files, none from a Pro path or importing Pro code`)

// ── 3. Tracked text ─────────────────────────────────────────────────────────
// Spelled in parts, so this file does not carry what it looks for.
const MARKER = ["@fasla", "premium"].join("-")
const FIGMA_LINK = ["figma", "com/"].join(".")
const TEXT = /\.(c?[jt]sx?|mjs|mts|json|md|mdx|css|html|ya?ml|sh|txt)$/
const textHits = []
for (const file of tracked) {
  if (!TEXT.test(file) || file === "bun.lock") continue
  const full = path.join(ROOT, file)
  if (!existsSync(full)) continue
  const text = readFileSync(full, "utf8")
  if (text.includes(MARKER)) textHits.push(`${file} (premium marker)`)
  if (text.includes(FIGMA_LINK)) textHits.push(`${file} (Figma link)`)
}
if (textHits.length) fail(`text files carry Pro or Figma traces: ${textHits.slice(0, 5).join("; ")}`)
else ok("no tracked text file carries the premium marker or a Figma link")

// ── 4. Built output (--built) ───────────────────────────────────────────────
if (process.argv.includes("--built")) {
  const out = path.join(ROOT, "apps/docs/public/r")
  if (!existsSync(path.join(out, "index.json"))) {
    fail("apps/docs/public/r/index.json is missing: run the registry build first")
  } else {
    const index = JSON.parse(readFileSync(path.join(out, "index.json"), "utf8"))
    const names = new Set(items.map((item) => item.name))
    const extra = index.items.filter((item) => !names.has(item.name)).map((item) => item.name)
    if (index.items.length !== items.length || extra.length) fail(`the built index lists ${index.items.length} items; not free: ${extra.join(", ")}`)
    else ok(`the built index lists the ${index.items.length} free items`)
    const blocks = readdirSync(out).filter((file) => file.endsWith(".json")).filter((file) => {
      const item = JSON.parse(readFileSync(path.join(out, file), "utf8"))
      return item.type === "registry:block"
    })
    if (blocks.length) fail(`the built registry has block items: ${blocks.slice(0, 5).join(", ")}`)
    else ok("the built registry has no block items")
  }
  const packed = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json", "--silent"], { cwd: PKG, encoding: "utf8" }))[0].files.map((file) => file.path)
  const proFiles = packed.filter((file) => /registry\/(blocks|templates)\//.test(file))
  if (proFiles.length) fail(`the npm tarball has Pro files: ${proFiles.slice(0, 5).join(", ")}`)
  else ok(`the npm tarball's ${packed.length} files hold no blocks or templates`)
}

if (failures.length) {
  for (const message of failures) console.error(`FAIL  ${message}`)
  process.exit(1)
}
console.log("The free-only check passed.")
