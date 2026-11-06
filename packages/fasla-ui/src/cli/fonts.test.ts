import { describe, expect, it } from "vitest"
import { fixSelfReferencingFonts, layoutFontVariables, projectFontVariable, SYSTEM_FONT_STACKS } from "./fonts"

const NEXT_LAYOUT = `
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ["latin"],
});
`

describe("layoutFontVariables", () => {
  it("reads the variables next/font sets, in either quote style", () => {
    expect(layoutFontVariables(NEXT_LAYOUT)).toEqual(["--font-geist-sans", "--font-geist-mono"])
  })
  it("finds none in a layout without next/font", () => {
    expect(layoutFontVariables("export default function Layout() { return null }")).toEqual([])
  })
})

describe("projectFontVariable", () => {
  it("picks the sans and mono variables by name", () => {
    const vars = ["--font-geist-mono", "--font-geist-sans"]
    expect(projectFontVariable("sans", vars)).toBe("--font-geist-sans")
    expect(projectFontVariable("mono", vars)).toBe("--font-geist-mono")
  })
  it("takes the only font left as the sans one, as with --font-inter", () => {
    expect(projectFontVariable("sans", ["--font-inter", "--font-geist-mono"])).toBe("--font-inter")
  })
  it("won't guess between several unnamed fonts", () => {
    expect(projectFontVariable("sans", ["--font-a", "--font-b"])).toBeUndefined()
  })
  it("gives nothing when the layout sets no font", () => {
    expect(projectFontVariable("sans", [])).toBeUndefined()
  })
})

describe("fixSelfReferencingFonts", () => {
  const css = `@theme inline {\n  --font-sans: var(--font-sans);\n  --font-mono: var(--font-geist-mono);\n}\n`

  it("points --font-sans at the project's real variable", () => {
    const { css: out, fixed } = fixSelfReferencingFonts(css, ["--font-geist-sans", "--font-geist-mono"])
    expect(out).toContain("--font-sans: var(--font-geist-sans);")
    expect(out).not.toContain("--font-sans: var(--font-sans)")
    expect(fixed).toEqual([{ name: "--font-sans", to: "var(--font-geist-sans)" }])
  })

  it("falls back to a system font stack when the project loads no font", () => {
    const { css: out } = fixSelfReferencingFonts(css, [])
    expect(out).toContain(`--font-sans: ${SYSTEM_FONT_STACKS.sans};`)
    expect(out).not.toMatch(/--font-sans:\s*var\(--font-sans\)/)
  })

  it("leaves a variable the layout sets itself, which is no loop", () => {
    const { css: out, fixed } = fixSelfReferencingFonts(css, ["--font-sans"])
    expect(out).toBe(css)
    expect(fixed).toEqual([])
  })

  it("leaves a variable the stylesheet declares elsewhere", () => {
    const withValue = `:root { --font-sans: "Inter"; }\n${css}`
    expect(fixSelfReferencingFonts(withValue, []).css).toBe(withValue)
  })

  it("leaves a stylesheet with no loop untouched", () => {
    const clean = "@theme inline {\n  --font-sans: var(--font-geist-sans);\n}\n"
    expect(fixSelfReferencingFonts(clean, []).css).toBe(clean)
  })

  it("fixes more than one, each to its own kind", () => {
    const both = "  --font-sans: var(--font-sans);\n  --font-mono: var(--font-mono);\n"
    const { css: out } = fixSelfReferencingFonts(both, ["--font-geist-sans"])
    expect(out).toContain("--font-sans: var(--font-geist-sans);")
    expect(out).toContain(`--font-mono: ${SYSTEM_FONT_STACKS.mono};`)
  })
})
