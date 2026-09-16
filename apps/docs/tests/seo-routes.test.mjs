import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

const docsRoot = path.resolve(import.meta.dir, "..")
const componentsRoot = path.join(docsRoot, "app/[locale]/docs/components")

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
      const canonical = new URL(`/en${route.path === "/" ? "/" : route.path}`.replace(/\/{2,}/g, "/"), SITE_URL).toString()
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
      ["/", "app/[locale]/(home)/layout.tsx"],
      ["/docs/", "app/[locale]/docs/layout.tsx"],
      ["/docs/installation/", "app/[locale]/docs/installation/page.tsx"],
    ]

    for (const [route, relativeFile] of coreAdapters) {
      const source = readFileSync(path.join(docsRoot, relativeFile), "utf8")
      expect(source).toContain(`metadataForRoute("${route}"`)
    }

    for (const route of componentRoutes) {
      const slug = route.path.split("/").at(-2)
      const source = readFileSync(
        path.join(componentsRoot, slug, "layout.tsx"),
        "utf8"
      )
      expect(source).toContain(`metadataForRoute("${route.path}"`)
    }
  })

  test("keeps exactly one page-level H1 on every canonical docs route", async () => {
    const { componentRoutes } = await import("../lib/seo-routes")
    const pageFiles = [
      "app/[locale]/(home)/page.tsx",
      "app/[locale]/docs/page.tsx",
      "app/[locale]/docs/installation/page.tsx",
      ...componentRoutes.map((route) => {
        const slug = route.path.split("/").at(-2)
        return `app/[locale]/docs/components/${slug}/page.tsx`
      }),
    ]

    for (const relativeFile of pageFiles) {
      const source = readFileSync(path.join(docsRoot, relativeFile), "utf8")
      expect(source.match(/<h1\b/g)?.length ?? 0).toBe(1)
    }
  })

  test("keeps the catalog H1 aligned with the home message catalogue", async () => {
    const { routes } = await import("../lib/seo-routes")
    const en = JSON.parse(readFileSync(path.join(docsRoot, "messages/en.json"), "utf8"))
    const homeRoute = routes.find((route) => route.path === "/")

    // The rendered H1 is headlineLead + the Arabic comma + headlineTail.
    const composed = `${en.home.headlineLead}\u060C${en.home.headlineTail}`

    expect(homeRoute?.h1).toBe(composed)
  })

  test("keeps every message key present in both locales", async () => {
    const read = (file) =>
      JSON.parse(readFileSync(path.join(docsRoot, "messages", file), "utf8"))
    const flatten = (obj, prefix = "") =>
      Object.entries(obj).flatMap(([k, v]) =>
        typeof v === "object" && v !== null
          ? flatten(v, `${prefix}${k}.`)
          : [`${prefix}${k}`],
      )

    const en = flatten(read("en.json")).sort()
    const ar = flatten(read("ar.json")).sort()

    // A key present in one locale and missing in the other renders as the raw
    // key path to the reader, so the two files must stay in lockstep.
    expect(ar).toEqual(en)
  })

  test("scopes homepage metadata below the root layout", () => {
    const rootLayout = readFileSync(path.join(docsRoot, "app/layout.tsx"), "utf8")
    const homeLayout = readFileSync(
      path.join(docsRoot, "app/[locale]/(home)/layout.tsx"),
      "utf8"
    )

    expect(rootLayout).not.toContain("metadataForRoute(")
    expect(homeLayout).toContain('metadataForRoute("/"')
  })

  test("allows PageHeader previews to use a subordinate heading", async () => {
    const { PageHeader } = await import(
      "../../../packages/fasla-ui/registry/blocks/page-header/PageHeader"
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
