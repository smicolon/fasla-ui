"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarNav = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "UI Primitives",
    items: [
      { title: "Button", href: "/docs/components/button" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Card", href: "/docs/components/card" },
      { title: "Badge", href: "/docs/components/badge" },
      { title: "Skeleton", href: "/docs/components/skeleton" },
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "Checkbox", href: "/docs/components/checkbox" },
      { title: "Switch", href: "/docs/components/switch" },
      { title: "Select", href: "/docs/components/select" },
      { title: "Textarea", href: "/docs/components/textarea" },
      { title: "Tabs", href: "/docs/components/tabs" },
      { title: "Combobox", href: "/docs/components/combobox" },
    ],
  },
  {
    title: "Blocks",
    items: [
      { title: "App Shell", href: "/docs/components/app-shell" },
      { title: "Page Header", href: "/docs/components/page-header" },
      { title: "Empty State", href: "/docs/components/empty-state" },
      { title: "Form Section", href: "/docs/components/form-section" },
      { title: "Data Table", href: "/docs/components/data-table" },
      { title: "Sidebar", href: "/docs/components/sidebar" },
      { title: "Navbar", href: "/docs/components/navbar" },
      { title: "Stats Card", href: "/docs/components/stats-card" },
    ],
  },
  {
    title: "Effects",
    items: [
      { title: "Shimmer Button", href: "/docs/components/shimmer-button" },
      { title: "Animated Gradient", href: "/docs/components/animated-gradient" },
      { title: "Text Reveal", href: "/docs/components/text-reveal" },
      { title: "Border Beam", href: "/docs/components/border-beam" },
      { title: "Spotlight", href: "/docs/components/spotlight" },
      { title: "Typewriter Text", href: "/docs/components/typewriter-text" },
      { title: "Glow Card", href: "/docs/components/glow-card" },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border/40 md:sticky md:block">
      <div className="h-full overflow-y-auto py-6 pr-6 pl-4">
        <nav className="space-y-6">
          {sidebarNav.map((section) => (
            <div key={section.title} className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === item.href || pathname === item.href + "/"
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
