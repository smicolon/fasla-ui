import { describe, expect, it } from "vitest"
import { getTargetDirectory } from "./registry"

describe("getTargetDirectory", () => {
  it("keeps primitives, blocks and effects where they were", () => {
    expect(getTargetDirectory("registry:ui", "src/components")).toBe("src/components/ui")
    expect(getTargetDirectory("registry:block", "src/components")).toBe("src/components/blocks")
    expect(getTargetDirectory("registry:effect", "src/components")).toBe("src/components/effects")
  })

  it("puts a template, a block item with the template category, in templates, as its registry target says", () => {
    expect(getTargetDirectory("registry:block", "src/components", ["template"])).toBe("src/components/templates")
    expect(getTargetDirectory("registry:block", "src/components", ["marketing"])).toBe("src/components/blocks")
    expect(getTargetDirectory("registry:ui", "src/components", ["template"])).toBe("src/components/ui")
  })
})
