"use client"

import { useEffect, useId, useRef, useState } from "react"
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

function DocsNav() {
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
    <>
      <nav className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">{t("gettingStarted")}</h4>
          <ul className="space-y-1">
            {gettingStarted.map((item) => (
              <li key={item.path}>
                <Link
                  href={p(item.path)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={linkClass(isActive(item.path))}
                >
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
                  <Link
                    href={p(route.path)}
                    aria-current={isActive(route.path) ? "page" : undefined}
                    className={linkClass(isActive(route.path))}
                  >
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
    </>
  )
}

/**
 * The docs navigation. From lg it is the sticky first column of the docs grid
 * (the start side, so the right in Arabic); below lg it collapses into a
 * disclosure button above the page content.
 */
export function DocsSidebar() {
  const pathname = usePathname()
  const t = useTranslations("docs.sidebar")
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  // A link inside the panel navigates; close it once the new page is in.
  useEffect(() => setOpen(false), [pathname])

  // Esc closes the panel and hands focus back to its button.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      <div className="border-b border-border/40 py-3 lg:hidden">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fasla-red"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          {t("menu")}
        </button>
        {open && (
          <div id={panelId} className="max-h-[60vh] overflow-y-auto pb-2 pt-4">
            <DocsNav />
          </div>
        )}
      </div>

      <aside className="sticky top-20 hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-e border-border/40 py-8 pe-6 lg:block">
        <DocsNav />
      </aside>
    </>
  )
}
