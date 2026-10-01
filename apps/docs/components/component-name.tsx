"use client"

import { useLocale } from "next-intl"
import { componentRoutes, routeText, type RoutePath } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"

/**
 * A component page's name for its H1, from the route catalogue: on /ar the
 * glossary name with the English in parentheses, "زر (Button)"; on /en the
 * English. The page keeps its own <h1> element and puts this inside it.
 */
export function ComponentName({ path }: { path: RoutePath }) {
  const locale = useLocale() as Locale
  const route = componentRoutes.find((candidate) => candidate.path === path)
  if (!route) throw new Error(`Unknown component route: ${path}`)
  return <>{routeText(route, locale).h1}</>
}
