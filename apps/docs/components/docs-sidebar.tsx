"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { componentRouteGroups } from "@/lib/seo-routes"

/** Category keys as they appear in seo-routes, mapped to message keys. */
const categoryKeys: Record<string, string> = {
  "UI Primitives": "primitives",
  Blocks: "blocks",
  Effects: "effects",
}

export function DocsSidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("docs.sidebar")

  // Every route in the catalogue is locale-agnostic, so the prefix is added
  // here. Without it each link drops the locale and 404s.
  const p = (path: string) => `/${locale}${path}`.replace(/\/{2,}/g, "/")

  const isActive = (path: string) => {
    const href = p(path)
    return pathname === href || `${pathname}/` === href || pathname === href.replace(/\/$/, "")
  }

  const linkClass = (active: boolean) =>
    cn(
      "block rounded-md px-2 py-1.5 text-sm transition-colors",
      active
        ? "bg-fasla-red/10 text-fasla-red font-medium"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    )

  const gettingStarted = [
    { title: t("introduction"), path: "/docs/" },
    { title: t("installation"), path: "/docs/installation/" },
  ]

  return (
    <aside className="fixed top-20 z-30 hidden h-[calc(100vh-5rem)] w-64 shrink-0 border-e border-border/40 md:sticky md:block">
      <div className="h-full overflow-y-auto px-6 pb-6 pt-4">
        <nav className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">{t("gettingStarted")}</h4>
            <ul className="space-y-1">
              {gettingStarted.map((item) => (
                <li key={item.path}>
                  <Link href={p(item.path)} className={linkClass(isActive(item.path))}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {componentRouteGroups.map((group) => (
            <div key={group.category} className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                {categoryKeys[group.category] ? t(categoryKeys[group.category]) : group.category}
              </h4>
              <ul className="space-y-1">
                {group.routes.map((route) => (
                  <li key={route.path}>
                    {/* Component names are technical terms and stay Latin (§15). */}
                    <Link href={p(route.path)} className={linkClass(isActive(route.path))}>
                      {route.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Storybook is copied in at build time and sits outside the locale tree. */}
        <div className="mt-8 border-t border-border/40 pt-6">
          <Link
            href="/components"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("playground")}
          </Link>
        </div>
      </div>
    </aside>
  )
}
