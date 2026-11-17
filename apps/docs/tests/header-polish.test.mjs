import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

// The two headers, the docs' SiteHeader and the home page's LandingNav, behave
// and look the same where they share a control.
const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
const toggle = read("components/theme-toggle.tsx")

describe("The theme toggle", () => {
  test("switches from the theme in effect, so a system theme flips on the first click", () => {
    expect(toggle).toContain('setTheme(resolvedTheme === "dark" ? "light" : "dark")')
    expect(toggle).not.toMatch(/\btheme === "(light|dark)"/)
  })
})
