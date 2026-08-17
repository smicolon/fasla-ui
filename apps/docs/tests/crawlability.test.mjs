import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")

describe("static crawlability", () => {
  test("publishes every canonical route in the sitemap", async () => {
    const [{ default: sitemap }, { routes, SITE_URL }] = await Promise.all([
      import("../app/sitemap"),
      import("../lib/seo-routes"),
    ])
    const expectedUrls = [
      ...routes.map((route) => new URL(route.path, SITE_URL).toString()),
      `${SITE_URL}/components/`,
    ]

    expect(sitemap().map((entry) => entry.url).sort()).toEqual(expectedUrls.sort())
  })

  test("allows crawling and advertises the sitemap", async () => {
    const [{ default: robots }, { SITE_URL }] = await Promise.all([
      import("../app/robots"),
      import("../lib/seo-routes"),
    ])

    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
    })
  })

  test("uses catalog routes as ordinary links on the landing and sidebar", () => {
    const landingSource = readFileSync(path.join(docsRoot, "app/docs/page.tsx"), "utf8")
    const sidebarSource = readFileSync(
      path.join(docsRoot, "components/docs-sidebar.tsx"),
      "utf8"
    )

    for (const source of [landingSource, sidebarSource]) {
      expect(source).toContain("componentRouteGroups")
      expect(source).toContain("href={route.path}")
      expect(source).toContain("<Link")
    }
  })
})
