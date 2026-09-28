import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import { LEADING, SIZE_PX } from "../../tailwind-preset"

/**
 * Guards the type contract: Figma's `Tailwind En/*` and `Tailwind AR/*` styles
 * → design/tokens/typography.json → tailwind-preset.ts, which both apps load.
 * Figma is the source of truth; the snapshot is the committed record of it.
 */
const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..")
type Script = { lineHeight: number; rung: string }
const snap: {
  lineHeights: Record<string, number>
  ramp: Record<string, { figma: string; size: number; en: Script; ar: Script }>
} = JSON.parse(readFileSync(resolve(REPO, "design/tokens/typography.json"), "utf8"))

const rungs = Object.keys(snap.ramp)

describe("Figma typography snapshot", () => {
  it("binds every rung to a line-height on the ladder, at the value it states", () => {
    for (const [name, r] of Object.entries(snap.ramp)) {
      expect(snap.lineHeights[r.en.rung], `${name} En ${r.en.rung}`).toBe(r.en.lineHeight)
      expect(snap.lineHeights[r.ar.rung], `${name} AR ${r.ar.rung}`).toBe(r.ar.lineHeight)
    }
  })

  it("holds the 14px line-height Figma added for XXS", () => {
    expect(snap.lineHeights["L-neg-0,5"]).toBe(14)
  })

  it("keeps XXS at 10px: 10/14 in English, 10/16 in Arabic", () => {
    expect(snap.ramp.xxs).toMatchObject({
      figma: "XXS",
      size: 10,
      en: { lineHeight: 14, rung: "L-neg-0,5" },
      ar: { lineHeight: 16, rung: "L-0" },
    })
  })
})

describe("tailwind-preset.ts", () => {
  it("declares exactly the snapshot's rungs", () => {
    expect(Object.keys(LEADING).sort()).toEqual([...rungs].sort())
    expect(Object.keys(SIZE_PX).sort()).toEqual([...rungs].sort())
  })

  it.each(rungs)("%s matches Figma's size and both line-heights", (rung) => {
    const r = snap.ramp[rung]!
    expect(SIZE_PX[rung as keyof typeof SIZE_PX]).toBe(r.size)
    expect(LEADING[rung as keyof typeof LEADING]).toEqual([r.en.lineHeight, r.ar.lineHeight])
  })
})
