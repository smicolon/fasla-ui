// @vitest-environment node
import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

/**
 * What `npm pack` puts in the published package, as the release job packs it:
 * every file the CLI and the registry need, and none of the tests.
 */

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const pkg = JSON.parse(readFileSync(path.join(PKG, "package.json"), "utf8"))
const packed: string[] = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--json", "--silent"], { cwd: PKG, encoding: "utf8" })
)[0].files.map((file: { path: string }) => file.path)

/** Every file under `dir`, relative to the package. */
function filesUnder(dir: string): string[] {
  const full = path.join(PKG, dir)
  if (!existsSync(full)) return []
  return readdirSync(full, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(PKG, path.join(entry.parentPath, entry.name)).split(path.sep).join("/"))
}

describe("the npm package", () => {
  it("has no test files", () => {
    expect(packed.filter((file) => /\.test\.tsx?$/.test(file))).toEqual([])
    // They are still in the repository, where the tests run.
    expect(filesUnder("registry").filter((file) => /\.test\.tsx?$/.test(file)).length).toBeGreaterThan(0)
  })

  it("has every file of every registry item", () => {
    const registry = JSON.parse(readFileSync(path.join(PKG, "registry.json"), "utf8"))
    const files: string[] = registry.items.flatMap((item: { files?: { path: string }[] }) => (item.files ?? []).map((file) => file.path))
    expect(files.length).toBeGreaterThan(0)
    expect(files.filter((file) => !packed.includes(file))).toEqual([])
  })

  it("has every other file under registry/, the README, the registry index and the preset", () => {
    const other = filesUnder("registry").filter((file) => !/\.test\.tsx?$/.test(file) && !file.endsWith(".npmignore"))
    expect(other.filter((file) => !packed.includes(file))).toEqual([])
    for (const file of ["package.json", "README.md", "registry.json", "tailwind-preset.ts"]) expect(packed, file).toContain(file)
  })

  it("has all of dist, with the CLI the bin points at", () => {
    // dist is built output: the release job builds before it packs.
    expect(pkg.files).toContain("dist")
    expect(pkg.bin["fasla-ui"]).toBe("dist/cli/index.js")
    expect(filesUnder("dist").filter((file) => !packed.includes(file))).toEqual([])
  })
})
