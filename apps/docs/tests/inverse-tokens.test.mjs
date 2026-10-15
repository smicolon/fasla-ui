import { describe, expect, test } from "bun:test"
import { buildThemeItems } from "../../../packages/fasla-ui/theme/theme-items.mjs"
import { INVERSE_CONFIG, INVERSE_CSS } from "../lib/inverse-tokens"

const item = buildThemeItems({ registryUrl: "https://registry.example/r" }).find((i) => i.name === "theme-inverse")

// The docs show the lines a developer adds by hand; the CLI installs the
// registry item. Both must be the same mapping.
describe("Inverse tokens on the docs", () => {
  test("show exactly the Tailwind 4 mapping theme-inverse installs", () => {
    const lines = Object.entries(item.cssVars.theme).map(([key, value]) => `--${key}: ${value};`)
    expect(INVERSE_CSS).toBe(lines.join("\n"))
  })

  test("show exactly the Tailwind 3 mapping theme-inverse installs", () => {
    const lines = Object.entries(item.tailwind.config.theme.extend.colors).map(([key, value]) => `"${key}": "${value}",`)
    expect(INVERSE_CONFIG).toBe(lines.join("\n"))
  })
})
