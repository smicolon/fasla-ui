import { describe, expect, it } from "vitest"
import { describeChanges } from "./init-summary"

const input = {
  components: "@/components",
  utilsAlias: "@/lib/utils",
  utils: "src/lib/utils.ts",
  css: "src/app/globals.css",
  layout: "src/app/layout.tsx",
  fontFixes: [],
}

describe("describeChanges", () => {
  it("lists what was created and changed, and what shadcn did to the layout and stylesheet", () => {
    const lines = describeChanges({
      ...input,
      before: {
        "components.json": undefined,
        "src/lib/utils.ts": undefined,
        "src/app/globals.css": ":root { --background: white; --foreground: black; }",
        "src/app/layout.tsx": '<html className={`${a.variable}`}>',
        "package.json": JSON.stringify({ dependencies: { next: "16" } }),
      },
      after: {
        "components.json": "{}",
        "src/lib/utils.ts": "x",
        "src/app/globals.css": ":root { --background: #fff; --foreground: #111; }",
        "src/app/layout.tsx": "const c = Cairo({}); <html className={cn(a.variable)}>",
        "package.json": JSON.stringify({ dependencies: { next: "16", clsx: "^2", "tailwind-merge": "^3" } }),
      },
      fontFixes: [{ name: "--font-sans", to: "var(--font-geist-sans)" }],
    }).join("\n")
    expect(lines).toMatch(/created\s+components\.json — components alias @\/components, utils alias @\/lib\/utils/)
    expect(lines).toMatch(/created\s+src\/lib\/utils\.ts/)
    expect(lines).toMatch(/changed\s+src\/app\/globals\.css.*--background and --foreground changed to Fasla's values.*--font-sans set to var\(--font-geist-sans\)/)
    expect(lines).toMatch(/changed\s+src\/app\/layout\.tsx.*adds the Cairo font.*cn\(\)/)
    expect(lines).toMatch(/changed\s+package\.json — adds clsx, tailwind-merge/)
  })

  it("says a utils file that was already there is kept, and lists no layout that did not change", () => {
    const same = { "components.json": undefined, "src/lib/utils.ts": "mine", "src/app/globals.css": "a", "src/app/layout.tsx": "l", "package.json": "{}" }
    const lines = describeChanges({ ...input, before: same, after: { ...same, "components.json": "{}" } }).join("\n")
    expect(lines).toMatch(/unchanged\s+src\/lib\/utils\.ts — yours was already there/)
    expect(lines).not.toContain("layout.tsx")
  })

  it("says the theme is not installed yet when it was left to the user", () => {
    const same = { "components.json": undefined, "src/lib/utils.ts": undefined, "src/app/globals.css": "a", "package.json": "{}" }
    const lines = describeChanges({ ...input, layout: undefined, before: same, after: same, themeCommand: "npx shadcn …" }).join("\n")
    expect(lines).toMatch(/unchanged\s+src\/app\/globals\.css — the theme is not installed yet/)
  })
})
