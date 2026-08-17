import type { MetadataRoute } from "next"
import { routes, SITE_URL } from "@/lib/seo-routes"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((route) => ({
      url: new URL(route.path, SITE_URL).toString(),
    })),
    { url: new URL("/components/", SITE_URL).toString() },
  ]
}
