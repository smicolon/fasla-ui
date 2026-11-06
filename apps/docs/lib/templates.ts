import { templateRoutes } from "@/lib/seo-routes"

/**
 * The templates the docs offer, from one place: the route catalogue
 * (`templateRoutes` in seo-routes.ts), which every template needs anyway for
 * its metadata and the sitemap. The sidebar of the Templates section and the
 * index page's cards both read it, so a second template appears in both once it
 * has a route, its messages (`docs.templates.<slug>`) and an entry in
 * `templateThumbs`.
 */
export const templatesIndexPath = "/docs/templates/"

/** One entry per template, without the index page itself. */
export const templates = templateRoutes
  .filter((route) => route.path !== templatesIndexPath)
  .map((route) => ({ route, slug: route.path.replace(/^\/docs\/templates\/|\/$/g, "") }))

/** The preview thumbnails of each template, by slug: sections of the real template, from its Desktop LTR final stories. */
export const templateThumbs: Record<string, { key: string; src: string }[]> = {
  mahaam: [
    { key: "hero", src: "/images/templates/mahaam/hero.webp" },
    { key: "features", src: "/images/templates/mahaam/features.webp" },
  ],
}
