"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

type TocItem = { id: string; text: string; level: 2 | 3 }

/** Headings sit this far below the fixed header when scrolled to (matches globals.css). */
const HEADER_OFFSET = 96

/** Keys that scroll the page; pressing one hands the highlight back to scroll position. */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "])

/**
 * Unicode-aware, so Arabic headings get readable ids too. Ids are only
 * written onto headings that don't already have one.
 */
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
}

/**
 * Reads the page's own h2 and h3 headings, so every docs page gets a table of
 * contents without writing one. Headings inside a live component preview
 * ([data-toc-ignore]) belong to the demo, not to the page, and are skipped.
 */
function collectHeadings(root: Element): TocItem[] {
  const used = new Set<string>()
  const items: TocItem[] = []

  root.querySelectorAll<HTMLHeadingElement>("h2, h3").forEach((heading) => {
    if (heading.closest("[data-toc-ignore]")) return
    const text = heading.textContent?.trim()
    if (!text) return

    if (!heading.id) {
      const base = slugify(text) || "section"
      let id = base
      for (let n = 2; used.has(id) || document.getElementById(id); n++) id = `${base}-${n}`
      heading.id = id
    }
    used.add(heading.id)
    items.push({ id: heading.id, text, level: heading.tagName === "H3" ? 3 : 2 })
  })

  return items
}

export function DocsToc() {
  const pathname = usePathname()
  const t = useTranslations("docs")
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  // A clicked entry stays highlighted until the reader scrolls on their own:
  // a section near the end of the page can't reach the top, and the scroll
  // position alone would highlight a later one.
  const clickedRef = useRef<string | null>(null)

  // Re-read the headings on every page change: the layout, and this
  // component with it, persists across client navigations.
  useEffect(() => {
    const root = document.querySelector("[data-docs-content]")
    if (!root) return
    const found = collectHeadings(root)
    clickedRef.current = null
    setItems(found)
    setActiveId(found[0]?.id ?? null)

    // Ids are written after hydration, so the browser could not honour a
    // #hash on first load. Scroll to it now, instantly.
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "auto" })
  }, [pathname])

  // The section being read is the last heading that has scrolled up past the
  // header; at the bottom of the page it is the last heading.
  useEffect(() => {
    if (items.length < 2) return

    function update() {
      if (clickedRef.current) {
        setActiveId(clickedRef.current)
        return
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActiveId(items[items.length - 1].id)
        return
      }
      let current = items[0].id
      for (const item of items) {
        const heading = document.getElementById(item.id)
        if (heading && heading.getBoundingClientRect().top <= HEADER_OFFSET + 8) current = item.id
        else break
      }
      setActiveId(current)
    }

    function release() {
      clickedRef.current = null
    }
    function onKeyDown(event: KeyboardEvent) {
      if (SCROLL_KEYS.has(event.key)) release()
    }

    // Scroll events already arrive at most once per frame, and seven rect
    // reads are cheap, so there is no extra throttle to go stale.
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    window.addEventListener("wheel", release, { passive: true })
    window.addEventListener("touchstart", release, { passive: true })
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      window.removeEventListener("wheel", release)
      window.removeEventListener("touchstart", release)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [items])

  if (items.length < 2) return null

  // Plain in-page links: the browser scrolls (smoothly, or instantly under
  // prefers-reduced-motion, per globals.css), updates the URL hash and moves
  // the keyboard's focus start point to the section.
  return (
    <nav aria-labelledby="docs-toc-title" className="sticky top-20 hidden max-h-[calc(100vh-5rem)] overflow-y-auto py-8 xl:block">
      <h2 id="docs-toc-title" className="mb-3 text-sm font-semibold text-foreground">
        {t("onThisPage")}
      </h2>
      <ul className="border-s border-border">
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => {
                  clickedRef.current = item.id
                  setActiveId(item.id)
                }}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ms-px block border-s py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fasla-red",
                  item.level === 3 ? "ps-6" : "ps-3",
                  active
                    ? "border-fasla-red font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
