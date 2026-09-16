import type { MetadataRoute } from "next"
import { routes, SITE_URL, localisedPath } from "@/lib/seo-routes"
import { locales } from "@/i18n/routing"

export default function sitemap(): MetadataRoute.Sitemap {
  // Every canonical route exists once per locale, so each gets its own entry.
  const localised = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: new URL(localisedPath(route.path, locale), SITE_URL).toString(),
    })),
  )

  return [
    ...localised,
    // Storybook is copied in at build time and is not part of the locale tree.
    { url: new URL("/components/", SITE_URL).toString() },
  ]
}
