import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"
import { FAQ_TYPES, addCommand, blockRequirements } from "../lib/blocks"

const docsRoot = path.resolve(import.meta.dir, "..")
const registry = JSON.parse(readFileSync(path.join(docsRoot, "../../packages/fasla-ui/registry.json"), "utf8"))
const names = new Set(registry.items.map((item) => item.name))

// Every command the FAQ page shows has to install something: the block's own
// `add`, and on the Manual tab the components and packages it needs.
describe("Commands on the block pages", () => {
  test("install each block by a name the registry has", () => {
    for (const { slug } of FAQ_TYPES) expect(names.has(slug), slug).toBe(true)
  })

  test("add only components the registry has, and nothing when a block uses none", () => {
    for (const { slug } of FAQ_TYPES) {
      const { components } = blockRequirements(slug, registry.items)
      for (const name of components) expect(names.has(name), `${slug} → ${name}`).toBe(true)
      const command = addCommand(components)
      if (components.length === 0) expect(command, slug).toBeNull()
      else expect(command).toBe(`npx @smicolon/fasla-ui@latest add ${components.join(" ")}`)
    }
  })

  test("never show a bare add", () => {
    expect(addCommand([])).toBeNull()
  })

  test("install only npm packages with npm, never a Fasla component", () => {
    for (const { slug } of FAQ_TYPES) {
      for (const pkg of blockRequirements(slug, registry.items).packages) {
        expect(names.has(pkg), `${slug} → ${pkg}`).toBe(false)
        expect(pkg).toMatch(/^(@[a-z0-9-]+\/)?[a-z0-9.-]+$/)
      }
    }
  })
})
