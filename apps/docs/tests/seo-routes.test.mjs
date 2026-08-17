import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

const docsRoot = path.resolve(import.meta.dir, "..")
const componentsRoot = path.join(docsRoot, "app/docs/components")

describe("SEO route catalog", () => {
  test("covers the filesystem component routes and core pages", async () => {
    const { componentRoutes, routes } = await import("../lib/seo-routes")
    const filesystemPaths = readdirSync(componentsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `/docs/components/${entry.name}/`)
      .sort()

    expect(componentRoutes.map((route) => route.path).sort()).toEqual(filesystemPaths)
    const routePaths = routes.map((route) => route.path)
    expect(routePaths).toContain("/")
    expect(routePaths).toContain("/docs/")
    expect(routePaths).toContain("/docs/installation/")
  })

  test("provides unique metadata and absolute self-canonicals", async () => {
    const { metadataForRoute, routes, SITE_URL } = await import("../lib/seo-routes")
    const titles = new Set(routes.map((route) => route.title))
    const descriptions = new Set(routes.map((route) => route.description))

    expect(titles.size).toBe(routes.length)
    expect(descriptions.size).toBe(routes.length)

    for (const route of routes) {
      const canonical = new URL(route.path, SITE_URL).toString()
      const metadata = metadataForRoute(route.path)

      expect(metadata.title).toBe(route.title)
      expect(metadata.description).toBe(route.description)
      expect(metadata.alternates?.canonical).toBe(canonical)
      expect(metadata.openGraph).toMatchObject({
        title: route.title,
        description: route.description,
        type: "website",
        url: canonical,
      })
      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        title: route.title,
        description: route.description,
      })
    }
  })

  test("wires every route to the shared metadata catalog", async () => {
    const { componentRoutes } = await import("../lib/seo-routes")
    const coreAdapters = [
      ["/", "app/(home)/layout.tsx"],
      ["/docs/", "app/docs/layout.tsx"],
      ["/docs/installation/", "app/docs/installation/page.tsx"],
    ]

    for (const [route, relativeFile] of coreAdapters) {
      const source = readFileSync(path.join(docsRoot, relativeFile), "utf8")
      expect(source).toContain(`metadataForRoute("${route}")`)
    }

    for (const route of componentRoutes) {
      const slug = route.path.split("/").at(-2)
      const source = readFileSync(
        path.join(componentsRoot, slug, "layout.tsx"),
        "utf8"
      )
      expect(source).toContain(`metadataForRoute("${route.path}")`)
    }
  })

  test("keeps exactly one page-level H1 on every canonical docs route", async () => {
    const { componentRoutes } = await import("../lib/seo-routes")
    const pageFiles = [
      "app/(home)/page.tsx",
      "app/docs/page.tsx",
      "app/docs/installation/page.tsx",
      ...componentRoutes.map((route) => {
        const slug = route.path.split("/").at(-2)
        return `app/docs/components/${slug}/page.tsx`
      }),
    ]

    for (const relativeFile of pageFiles) {
      const source = readFileSync(path.join(docsRoot, relativeFile), "utf8")
      expect(source.match(/<h1\b/g)?.length ?? 0).toBe(1)
    }
  })

  test("keeps the catalog H1 aligned with the rendered home heading", async () => {
    const [{ routes }, { default: HomePage }] = await Promise.all([
      import("../lib/seo-routes"),
      import("../app/(home)/page"),
    ])
    const html = renderToStaticMarkup(React.createElement(HomePage))
    const homeRoute = routes.find((route) => route.path === "/")
    const h1Text = html
      .match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim()

    expect(h1Text).toBe(homeRoute?.h1)
  })

  test("scopes homepage metadata below the root layout", () => {
    const rootLayout = readFileSync(path.join(docsRoot, "app/layout.tsx"), "utf8")
    const homeLayout = readFileSync(
      path.join(docsRoot, "app/(home)/layout.tsx"),
      "utf8"
    )

    expect(rootLayout).not.toContain('metadataForRoute("/")')
    expect(homeLayout).toContain('metadataForRoute("/")')
  })

  test("allows PageHeader previews to use a subordinate heading", async () => {
    const { PageHeader } = await import(
      "../../../packages/smi-ui/registry/blocks/page-header/PageHeader"
    )
    const html = renderToStaticMarkup(
      React.createElement(PageHeader, {
        title: "Preview heading",
        headingLevel: 2,
      })
    )

    expect(html).toContain("<h2")
    expect(html).not.toContain("<h1")
  })
})
