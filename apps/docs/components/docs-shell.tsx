"use client"

import { usePathname } from "next/navigation"
import { DocsSidebar } from "@/components/docs-sidebar"
import { DocsToc } from "@/components/docs-toc"
import { cn } from "@/lib/utils"

/**
 * The docs page frame: the sidebar, the content and, from xl, the "On this
 * page" column, inside the centred container (1200px, 1440px from 2xl).
 *
 * The Templates pages (/docs/templates/ and /docs/templates/mahaam/) are wide:
 * a template card, its thumbnails and the full-page preview need the room. They
 * drop the "On this page" column and let the container follow the window, so
 * the content fills the space to the right of the sidebar. Every other docs
 * page keeps the frame it had.
 *
 * The grid follows the document direction: the sidebar is the start column
 * (right in Arabic) and the contents the end column (left in Arabic). As the
 * screen narrows the gutters shrink first, the contents hide below xl, the
 * sidebar below lg.
 */
export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const wide = /\/docs\/templates(\/|$)/.test(pathname)
  return (
    <main className={cn("site-container flex-1 pt-20", wide && "max-w-none 2xl:max-w-none")}>
      <div
        className={cn(
          "items-start lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10",
          !wide && "xl:grid-cols-[220px_minmax(0,1fr)_200px]"
        )}
      >
        <DocsSidebar />
        <div data-docs-content className="min-w-0 py-6 lg:py-8">
          {children}
        </div>
        {wide ? null : <DocsToc />}
      </div>
    </main>
  )
}
