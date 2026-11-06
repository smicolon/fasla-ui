import { describe, expect, it } from "vitest"
import { componentsAliasFromPath, effectiveComponentsAlias } from "./paths"

describe("componentsAliasFromPath", () => {
  it("keeps the folder the prompt offers", () => {
    expect(componentsAliasFromPath("src/components", "src")).toBe("@/components")
  })
  it("does not append ui again when the path already ends in the ui folder", () => {
    expect(componentsAliasFromPath("src/components/ui", "src")).toBe("@/components")
    expect(componentsAliasFromPath("src/components/ui/", "src")).toBe("@/components")
    expect(componentsAliasFromPath("./src/components/ui", "src")).toBe("@/components")
  })
  it("reads an alias the same way", () => {
    expect(componentsAliasFromPath("@/components/ui", "src")).toBe("@/components")
    expect(componentsAliasFromPath("@/components", "src")).toBe("@/components")
  })
  it("works when @/ is the project root", () => {
    expect(componentsAliasFromPath("components/ui", "")).toBe("@/components")
  })
  it("strips only a trailing ui folder", () => {
    expect(componentsAliasFromPath("src/ui/widgets", "src")).toBe("@/ui/widgets")
    expect(componentsAliasFromPath("src/components/ui-kit", "src")).toBe("@/components/ui-kit")
  })
  it("keeps a bare ui folder, which has no parent to name", () => {
    expect(componentsAliasFromPath("src/ui", "src")).toBe("@/ui")
  })
  it("gives nothing for a folder outside @/", () => {
    expect(componentsAliasFromPath("lib/components", "src")).toBeUndefined()
  })
})

describe("effectiveComponentsAlias", () => {
  it("reads the loop an earlier build wrote as the parent folder", () => {
    expect(effectiveComponentsAlias({ components: "@/components/ui", ui: "@/components/ui/ui" })).toBe("@/components")
  })
  it("reads a normal config as it is", () => {
    expect(effectiveComponentsAlias({ components: "@/components", ui: "@/components/ui" })).toBe("@/components")
  })
  it("keeps a deliberate components alias ending in ui when ui says otherwise", () => {
    expect(effectiveComponentsAlias({ components: "@/components/ui", ui: "@/components/primitives" })).toBe("@/components/ui")
  })
  it("defaults to @/components", () => {
    expect(effectiveComponentsAlias(undefined)).toBe("@/components")
  })
})
