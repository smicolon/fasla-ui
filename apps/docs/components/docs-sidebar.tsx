"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { componentRouteGroups } from "@/lib/seo-routes"

const gettingStarted = [
  { title: "Introduction", href: "/docs/" },
  { title: "Installation", href: "/docs/installation/" },
]

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-20 z-30 hidden h-[calc(100vh-5rem)] w-64 shrink-0 border-r border-border/40 md:sticky md:block">
      <div className="h-full overflow-y-auto pt-4 pb-6 pr-6 pl-6">
        <nav className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground">
              Getting Started
            </h4>
            <ul className="space-y-1">
              {gettingStarted.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors",
                      pathname === item.href || pathname + "/" === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {componentRouteGroups.map((group) => (
            <div key={group.category} className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">
                {group.category}
              </h4>
              <ul className="space-y-1">
                {group.routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      href={route.path}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors",
                        pathname === route.path || pathname + "/" === route.path
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {route.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Storybook link */}
        <div className="mt-8 pt-6 border-t border-border/40">
          <Link
            href="/components"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Component Playground
          </Link>
        </div>
      </div>
    </aside>
  )
}
