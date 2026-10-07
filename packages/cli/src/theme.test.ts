import { describe, expect, it, vi } from "vitest"
import { applyTheme, childEnv, hasColourTokens, themeCommand, themeItems, themeWithoutAsking } from "./theme"

describe("themeWithoutAsking", () => {
  it("follows --theme whatever the project has", () => {
    expect(themeWithoutAsking({ flag: "fasla", yes: true, hasColours: true })).toBe("fasla")
    expect(themeWithoutAsking({ flag: "brand", yes: false, hasColours: false })).toBe("brand")
  })

  it("with --yes, keeps colours a project has and gives Fasla's only to one with none", () => {
    expect(themeWithoutAsking({ yes: true, hasColours: true })).toBe("brand")
    expect(themeWithoutAsking({ yes: true, hasColours: false })).toBe("fasla")
  })

  it("asks otherwise", () => {
    expect(themeWithoutAsking({ yes: false, hasColours: true })).toBeUndefined()
  })
})

describe("hasColourTokens", () => {
  it("sees shadcn's colour tokens, not other variables", () => {
    expect(hasColourTokens(":root {\n  --primary: oklch(0.2 0 0);\n}")).toBe(true)
    expect(hasColourTokens("@layer base { :root { --background: 0 0% 100%; } }")).toBe(true)
    expect(hasColourTokens(':root { --font-sans: "Geist"; --success: #0a0; }')).toBe(false)
    expect(hasColourTokens('@import "tailwindcss";')).toBe(false)
  })
})

describe("applyTheme", () => {
  it("runs the command the docs show, unattended", async () => {
    const run = vi.fn(async () => ({ ok: true as const }))
    await applyTheme("/app", "brand", {}, run)
    expect(run.mock.calls[0]!.slice(0, 3)).toEqual(["npx", ["-y", "shadcn@latest", "add", "@fasla/theme-base", "--yes"], "/app"])
    expect(themeCommand("fasla")).toBe("npx shadcn@latest add @fasla/theme @fasla/font-geist")
    expect(themeCommand("brand")).toBe("npx shadcn@latest add @fasla/theme-base")
  })

  it("leaves Geist out on Next.js 14 and older, whose next/font/google has none", () => {
    expect(themeItems("fasla", { nextMajor: 16 })).toEqual(["theme", "font-geist"])
    expect(themeItems("fasla", { nextMajor: 15 })).toEqual(["theme", "font-geist"])
    expect(themeItems("fasla", { nextMajor: 14 })).toEqual(["theme"])
    expect(themeItems("fasla", {})).toEqual(["theme", "font-geist"])
    expect(themeItems("brand", { nextMajor: 14 })).toEqual(["theme-base"])
  })

  it("doesn't pass down the outer npx's own package, which made the inner one fail", () => {
    const env = childEnv({ PATH: "/bin", npm_config_package: "/tmp/cli.tgz", npm_config_call: "x", npm_config_yes: "true" })
    expect(env).toEqual({ PATH: "/bin", npm_config_yes: "true" })
  })
})
