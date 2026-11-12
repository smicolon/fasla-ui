import { describe, expect, it, vi } from "vitest"
import { applyTheme, childEnv, hasPalette, themeCommand, themeItems, themeWithoutAsking } from "./theme"

describe("themeWithoutAsking", () => {
  it("follows --theme whatever the project has", () => {
    expect(themeWithoutAsking({ flag: "fasla", yes: true, hasPalette: true })).toBe("fasla")
    expect(themeWithoutAsking({ flag: "brand", yes: false, hasPalette: false })).toBe("brand")
  })

  it("with --yes, keeps a palette the project has and gives Fasla's to one without", () => {
    expect(themeWithoutAsking({ yes: true, hasPalette: true })).toBe("brand")
    expect(themeWithoutAsking({ yes: true, hasPalette: false })).toBe("fasla")
  })

  it("asks otherwise", () => {
    expect(themeWithoutAsking({ yes: false, hasPalette: true })).toBeUndefined()
  })
})

// The stylesheets init meets, as the templates write them.
const CREATE_NEXT_APP = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
`
const CREATE_NEXT_APP_14 = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  --background: #ffffff;\n  --foreground: #171717;\n}\n`
const VITE_TEMPLATE = `@import "tailwindcss";\n:root {\n  --text: #6b6375;\n  --border: #e5e4e7;\n  --accent: #aa3bff;\n}\n`
const SHADCN_V4 = `:root {\n  --background: oklch(1 0 0);\n  --primary: oklch(0.205 0 0);\n  --primary-foreground: oklch(0.985 0 0);\n}\n`
const SHADCN_V3 = `@layer base {\n  :root {\n    --background: 0 0% 100%;\n    --primary: 222.2 47.4% 11.2%;\n  }\n}\n`

describe("hasPalette", () => {
  it("is false for the stylesheets fresh projects start with", () => {
    expect(hasPalette(CREATE_NEXT_APP)).toBe(false)
    expect(hasPalette(CREATE_NEXT_APP_14)).toBe(false)
    expect(hasPalette(VITE_TEMPLATE)).toBe(false)
    expect(hasPalette('@import "tailwindcss";')).toBe(false)
  })

  it("is true for a shadcn theme or a brand palette, on either Tailwind", () => {
    expect(hasPalette(SHADCN_V4)).toBe(true)
    expect(hasPalette(SHADCN_V3)).toBe(true)
    expect(hasPalette(":root{--primary:#ff0066}")).toBe(true)
  })

  it("ignores other names that end in primary, and comments", () => {
    expect(hasPalette("@theme inline {\n  --color-primary: var(--primary);\n}")).toBe(false)
    expect(hasPalette(":root { --primary-foreground: #fff; }")).toBe(false)
    expect(hasPalette("/* :root { --primary: red; } */\n:root { --background: #fff; }")).toBe(false)
  })
})

describe("themeWithoutAsking on real stylesheets", () => {
  it("gives a fresh create-next-app or Vite project Fasla's colours under --yes", () => {
    for (const css of [CREATE_NEXT_APP, CREATE_NEXT_APP_14, VITE_TEMPLATE]) {
      expect(themeWithoutAsking({ yes: true, hasPalette: hasPalette(css) })).toBe("fasla")
    }
  })

  it("keeps a shadcn project's colours under --yes", () => {
    for (const css of [SHADCN_V4, SHADCN_V3]) {
      expect(themeWithoutAsking({ yes: true, hasPalette: hasPalette(css) })).toBe("brand")
    }
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
