import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { PRICING_URL, isProName, proNotice } from "./pro"

const REGISTRY = resolve(dirname(fileURLToPath(import.meta.url)), "../../registry.json")
const freeNames: string[] = JSON.parse(readFileSync(REGISTRY, "utf8")).items.map((item: { name: string }) => item.name)

describe("Fasla Pro names", () => {
  it("never claims a free item", () => {
    expect(freeNames).toHaveLength(42)
    expect(freeNames.filter(isProName)).toEqual([])
  })

  it("knows a family Type, a family's shared parts, a former application block and a template", () => {
    for (const name of ["hero-split-image", "faq-dark-panel", "navbar", "data-table", "mahaam"]) {
      expect(isProName(name), name).toBe(true)
    }
    for (const name of ["button", "card", "sidebar", "buton", "heroic"]) {
      expect(isProName(name), name).toBe(false)
    }
  })

  it("says coming soon and links the pricing", () => {
    expect(proNotice(["hero-split-image"])).toContain("hero-split-image is part of Fasla Pro, coming soon.")
    expect(proNotice(["a", "b"])).toContain("a, b are part of Fasla Pro")
    expect(proNotice(["a"])).toContain(PRICING_URL)
  })
})

describe("CLI help", () => {
  it("states the registry's component counts", async () => {
    const { createProgram } = await import("./program")
    const items: { categories: string[] }[] = JSON.parse(readFileSync(REGISTRY, "utf8")).items
    const effects = items.filter((item) => item.categories.includes("effects")).length
    expect(createProgram().description()).toBe(
      `CLI for installing the ${items.length} Fasla UI components: ${items.length - effects} UI primitives and ${effects} effects`
    )
  })
})
