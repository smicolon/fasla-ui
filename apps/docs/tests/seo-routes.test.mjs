import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

const docsRoot = path.resolve(import.meta.dir, "..")
const componentsRoot = path.join(docsRoot, "app/[locale]/docs/components")

describe("Blocks section", () => {
  test("has a page for every block family route, and lists every FAQ, Error State, Logo Cloud, Authentications, Gallery, Navbar, Pricing, Hero, About, Careers, Team, Social Proof and Blog Cards item in the registry", async () => {
    const { blockRoutes } = await import("../lib/seo-routes")
    const { FAQ_TYPES, ERROR_STATE_TYPES, LOGO_CLOUD_TYPES, AUTHENTICATIONS_TYPES, GALLERY_TYPES, NAVBAR_TYPES, PRICING_TYPES, HERO_TYPES, ABOUT_TYPES, CAREERS_TYPES, HOW_IT_WORKS_TYPES, TEAM_TYPES, SOCIAL_PROOF_TYPES, BLOG_CARDS_TYPES } = await import(
      "../lib/blocks"
    )
    const blocksRoot = path.join(docsRoot, "app/[locale]/docs/blocks")
    // installation/ is the section's own page, not a family.
    const families = readdirSync(blocksRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== "installation")
      .map((entry) => `/docs/blocks/${entry.name}/`)
    expect(blockRoutes.map((route) => route.path).sort()).toEqual(families.sort())

    const registry = JSON.parse(readFileSync(path.join(docsRoot, "../../packages/fasla-ui/registry.json"), "utf8"))
    const faqItems = registry.items.filter((item) => item.name.startsWith("faq-")).map((item) => item.name)
    expect(FAQ_TYPES.map((type) => type.slug).sort()).toEqual(faqItems.sort())
    const errorStateItems = registry.items.filter((item) => item.name.startsWith("error-state-")).map((item) => item.name)
    expect(ERROR_STATE_TYPES.map((type) => type.slug).sort()).toEqual(errorStateItems.sort())
    const logoCloudItems = registry.items.filter((item) => item.name.startsWith("logo-cloud-")).map((item) => item.name)
    expect(LOGO_CLOUD_TYPES.map((type) => type.slug).sort()).toEqual(logoCloudItems.sort())
    const authItems = registry.items.filter((item) => item.name.startsWith("auth-")).map((item) => item.name)
    expect(AUTHENTICATIONS_TYPES.map((type) => type.slug).sort()).toEqual(authItems.sort())
    const galleryItems = registry.items.filter((item) => item.name.startsWith("gallery-")).map((item) => item.name)
    expect(GALLERY_TYPES.map((type) => type.slug).sort()).toEqual(galleryItems.sort())
    // `navbar` itself is the parts every Navbar block shares, not a Type.
    const navbarItems = registry.items.filter((item) => item.name.startsWith("navbar-")).map((item) => item.name)
    expect(NAVBAR_TYPES.map((type) => type.slug).sort()).toEqual(navbarItems.sort())
    // `pricing` itself is the parts every Pricing block shares, not a Type.
    const pricingItems = registry.items.filter((item) => item.name.startsWith("pricing-")).map((item) => item.name)
    expect(PRICING_TYPES.map((type) => type.slug).sort()).toEqual(pricingItems.sort())
    const heroItems = registry.items.filter((item) => item.name.startsWith("hero-")).map((item) => item.name)
    expect(HERO_TYPES.map((type) => type.slug).sort()).toEqual(heroItems.sort())
    const aboutItems = registry.items.filter((item) => item.name.startsWith("about-")).map((item) => item.name)
    expect(ABOUT_TYPES.map((type) => type.slug).sort()).toEqual(aboutItems.sort())
    // `careers` itself is the parts every Careers block shares, not a Type.
    const careersItems = registry.items.filter((item) => item.name.startsWith("careers-")).map((item) => item.name)
    expect(CAREERS_TYPES.map((type) => type.slug).sort()).toEqual(careersItems.sort())
    // `team` itself is the parts every Team block shares, not a Type.
    const teamItems = registry.items.filter((item) => item.name.startsWith("team-")).map((item) => item.name)
    expect(TEAM_TYPES.map((type) => type.slug).sort()).toEqual(teamItems.sort())
    const socialProofItems = registry.items.filter((item) => item.name.startsWith("social-proof-")).map((item) => item.name)
    expect(SOCIAL_PROOF_TYPES.map((type) => type.slug).sort()).toEqual(socialProofItems.sort())
    const blogCardsItems = registry.items.filter((item) => item.name.startsWith("blog-cards-")).map((item) => item.name)
    expect(BLOG_CARDS_TYPES.map((type) => type.slug).sort()).toEqual(blogCardsItems.sort())
    // `how-it-works` itself is the parts every How it Works block shares, not a Type.
    const howItWorksItems = registry.items.filter((item) => item.name.startsWith("how-it-works-")).map((item) => item.name)
    expect(HOW_IT_WORKS_TYPES.map((type) => type.slug).sort()).toEqual(howItWorksItems.sort())
  })

  test("marks exactly the blocks that depend on theme-inverse as inverse", async () => {
    const { ALL_BLOCK_TYPES } = await import("../lib/blocks")
    const registry = JSON.parse(readFileSync(path.join(docsRoot, "../../packages/fasla-ui/registry.json"), "utf8"))
    const inverse = registry.items
      .filter((item) => item.registryDependencies?.includes("theme-inverse"))
      .map((item) => item.name)
    expect(ALL_BLOCK_TYPES.filter((type) => type.inverse).map((type) => type.slug).sort()).toEqual(inverse.sort())
  })

  test("keeps the block previews out of the catalogue, and so out of the sitemap", async () => {
    const { routes } = await import("../lib/seo-routes")
    expect(routes.some((route) => route.path.includes("blocks-preview"))).toBe(false)
    const page = readFileSync(path.join(docsRoot, "app/[locale]/blocks-preview/[slug]/page.tsx"), "utf8")
    expect(page).toContain("robots: { index: false")
  })
})

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
    const { blockRoutes, componentRoutes } = await import("../lib/seo-routes")
    const coreAdapters = [
      ["/", "app/[locale]/(home)/layout.tsx"],
      ["/docs/", "app/[locale]/docs/layout.tsx"],
      ["/docs/installation/", "app/[locale]/docs/installation/page.tsx"],
      ["/docs/blocks/", "app/[locale]/docs/blocks/layout.tsx"],
      ["/docs/blocks/installation/", "app/[locale]/docs/blocks/installation/layout.tsx"],
      ...blockRoutes.map((route) => [route.path, `app/[locale]/docs${route.path.slice("/docs".length)}layout.tsx`]),
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
    const { blockRoutes, componentRoutes } = await import("../lib/seo-routes")
    const pageFiles = [
      "app/[locale]/(home)/page.tsx",
      "app/[locale]/docs/page.tsx",
      "app/[locale]/docs/installation/page.tsx",
      "app/[locale]/docs/blocks/page.tsx",
      "app/[locale]/docs/blocks/installation/page.tsx",
      ...blockRoutes.map((route) => `app/[locale]/docs${route.path.slice("/docs".length)}page.tsx`),
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

    // The rendered H1 is the hero title with its rich-text tags removed.
    const rendered = en.landing.hero.title.replace(/<\/?[a-z0-9]+>/g, "")

    expect(homeRoute?.h1).toBe(rendered)
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

describe("Arabic route metadata", () => {
  test("serves Arabic metadata on /ar for the pages whose body is Arabic", async () => {
    const { metadataForRoute } = await import("../lib/seo-routes")
    const arabic = /[؀-ۿ]/

    for (const route of ["/", "/docs/", "/docs/installation/", "/docs/components/radio/"]) {
      const en = metadataForRoute(route, "en")
      const ar = metadataForRoute(route, "ar")
      expect(ar.title).toMatch(arabic)
      expect(ar.description).toMatch(arabic)
      expect(en.title).not.toMatch(arabic)
      expect(ar.openGraph).toMatchObject({ title: ar.title, locale: "ar_AR" })
      expect(ar.twitter).toMatchObject({ title: ar.title })
      expect(ar.description).not.toMatch(/React/)
    }
  })

  // design/content/arabic-glossary.md: on /ar a component is named in Arabic
  // with the English in parentheses, in the H1, the sidebar and its card.
  test("names every component in Arabic with the English in parentheses", async () => {
    const { componentRoutes } = await import("../lib/seo-routes")
    const arabic = /[؀-ۿ]/

    for (const route of componentRoutes) {
      expect(route.ar, route.path).toBeDefined()
      expect(route.ar.h1).toMatch(arabic)
      expect(route.ar.h1.endsWith(` (${route.h1})`)).toBe(true)
      expect(route.ar.description).toMatch(arabic)
      // Readers know Fasla is a React library; only the <title> says so.
      expect(route.ar.description).not.toMatch(/React/)
      expect(route.ar.title.startsWith(route.ar.h1)).toBe(true)

      // The page's H1 takes its name from the catalogue, never a literal.
      const slug = route.path.split("/").at(-2)
      const source = readFileSync(path.join(componentsRoot, slug, "page.tsx"), "utf8")
      expect(/<h1\b[^>]*>\s*(<ComponentName path="[^"]+" \/>|\{routeText\(route, locale\)\.h1\})\s*<\/h1>/.test(source)).toBe(true)
    }
  })
})
