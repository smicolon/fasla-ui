import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const storybookRoot = path.resolve(import.meta.dir, "../../storybook")
const title = "SMI-UI Component Explorer | Smicolon"
const canonical = "https://ui.smicolon.com/components/"

describe("Storybook product identity", () => {
  test("brands the manager and canonical landing head", async () => {
    const [{ default: config }, { brandManagerHtml }] = await Promise.all([
      import("../../storybook/.storybook/main"),
      import("../../storybook/scripts/brand-built-head.mjs"),
    ])
    const managerHtml = brandManagerHtml(
      `<html><head>${await config.managerHead(
        "<title>@storybook/core - Storybook</title>"
      )}</head></html>`
    )
    const managerSource = existsSync(path.join(storybookRoot, ".storybook/manager.ts"))
      ? readFileSync(path.join(storybookRoot, ".storybook/manager.ts"), "utf8")
      : ""

    expect(managerHtml.match(/<title>/g)?.length).toBe(1)
    expect(managerHtml).toContain(`<title>${title}</title>`)
    expect(managerHtml).not.toContain("@storybook/core - Storybook")
    expect(managerHtml).toContain(`rel="canonical" href="${canonical}"`)
    expect(managerHtml).toContain("SMI-UI component explorer")
    expect(managerHtml).toContain('property="og:title"')
    expect(managerHtml).toContain('name="twitter:card"')
    expect(managerSource).toContain('brandTitle: "SMI-UI Component Explorer"')
    expect(managerSource).toContain(`brandUrl: "${canonical}"`)
  })

  test("keeps previews public without a competing canonical", async () => {
    const { default: config } = await import("../../storybook/.storybook/main")
    const previewHead = await config.previewHead("")

    expect(previewHead).toContain('name="robots" content="noindex,follow"')
    expect(previewHead).not.toContain('rel="canonical"')
  })

  test("verifies the generated manager and preview HTML contract", async () => {
    const { verifyBuiltHead } = await import(
      "../../storybook/scripts/verify-built-head.mjs"
    )
    const managerHtml = `
      <html><head>
        <title>${title}</title>
        <meta name="description" content="Explore SMI-UI component explorer previews.">
        <link rel="canonical" href="${canonical}">
        <meta property="og:title" content="${title}">
        <meta name="twitter:card" content="summary_large_image">
      </head></html>
    `
    const previewHtml = `
      <html><head><meta name="robots" content="noindex,follow"></head></html>
    `

    expect(() => verifyBuiltHead(managerHtml, previewHtml)).not.toThrow()
    expect(() => verifyBuiltHead(managerHtml, "<html><head></head></html>")).toThrow(
      "preview robots"
    )
  })
})
