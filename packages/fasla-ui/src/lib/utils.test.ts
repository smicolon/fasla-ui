import { describe, expect, it } from "vitest"

import { loadSources } from "../../theme/theme-items.mjs"
import { cn } from "./utils"

const rungs = Object.keys(loadSources().typography.ramp)

describe("cn", () => {
  // Every size in the Figma ramp, so a new rung tailwind-merge doesn't know
  // fails here rather than in a component's colour.
  it.each(rungs)("keeps a text colour beside text-%s", (rung) => {
    expect(cn("text-foreground", `text-${rung}`)).toBe(`text-foreground text-${rung}`)
    expect(cn(`text-${rung}`, "text-muted-foreground")).toBe(`text-${rung} text-muted-foreground`)
  })

  it.each(rungs)("lets a later size replace text-%s", (rung) => {
    const other = rung === "sm" ? "base" : "sm"
    expect(cn(`text-${rung}`, `text-${other}`)).toBe(`text-${other}`)
    expect(cn(`text-${other}`, `text-${rung}`)).toBe(`text-${rung}`)
  })

  it("still merges colours with colours", () => {
    expect(cn("text-foreground text-xxs", "text-primary")).toBe("text-xxs text-primary")
  })
})
