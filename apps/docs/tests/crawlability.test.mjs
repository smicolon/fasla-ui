import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")

describe("static crawlability", () => {
  test("publishes every canonical route in the sitemap", async () => {
    const [{ default: sitemap }, { routes, SITE_URL, localisedPath }] = await Promise.all([
      import("../app/sitemap"),
      import("../lib/seo-routes"),
    ])
    // Every canonical route is published once per locale.
    const localeCodes = ["en", "ar"]
    const expectedUrls = [
      ...localeCodes.flatMap((locale) =>
        routes.map((route) => new URL(localisedPath(route.path, locale), SITE_URL).toString()),
      ),
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
    const landingSource = readFileSync(path.join(docsRoot, "app/[locale]/docs/page.tsx"), "utf8")
    const sidebarSource = readFileSync(
      path.join(docsRoot, "components/docs-sidebar.tsx"),
      "utf8"
    )

    for (const source of [landingSource, sidebarSource]) {
      expect(source).toContain("componentRouteGroups")
      expect(source).toContain("<Link")

      // Catalogue paths are locale-agnostic, so a link must add the prefix.
      // `href={route.path}` shipped once and 404'd every Arabic docs link.
      expect(source).toContain("href={p(route.path)}")
      expect(source).not.toContain("href={route.path}")
    }
  })

  test("never links to an internal route without a locale prefix", () => {
    const files = [
      "app/[locale]/docs/page.tsx",
      "components/docs-sidebar.tsx",
      "components/site-header.tsx",
      "app/[locale]/(home)/page.tsx",
    ]

    for (const file of files) {
      const source = readFileSync(path.join(docsRoot, file), "utf8")
      const literal = [...source.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1])

      // /components/ is Storybook, copied in at build time outside the locale
      // tree, so it is the one internal path that carries no prefix.
      const unprefixed = literal.filter((href) => href !== "/components")

      expect(unprefixed).toEqual([])
    }
  })
})
