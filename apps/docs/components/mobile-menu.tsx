"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale } from "next-intl"

/**
 * The phone menu both headers use: the docs' floating SiteHeader and the home
 * page's LandingNav. The button and the panel are separate pieces sharing one
 * state, so each header puts them where its own layout needs them.
 *
 * It closes on Escape (focus goes back to the button), on a click or tap
 * outside it, on choosing a link, and when the page or the language changes.
 */
export function useMobileMenu(id: string) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const locale = useLocale()

  // A new page or the other language: the menu has done its job.
  useEffect(() => setOpen(false), [pathname, locale])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      setOpen(false)
      buttonRef.current?.focus()
    }
    // pointerdown, not click: it closes before whatever was tapped outside acts.
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  return { id, open, setOpen, buttonRef, panelRef }
}

export type MobileMenuState = ReturnType<typeof useMobileMenu>

export function MobileMenuButton({ menu, label, className }: { menu: MobileMenuState; label: string; className: string }) {
  return (
    <button
      ref={menu.buttonRef}
      type="button"
      onClick={() => menu.setOpen(!menu.open)}
      aria-expanded={menu.open}
      aria-controls={menu.id}
      aria-label={label}
      className={className}
    >
      {menu.open ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  )
}

export interface MobileMenuLink {
  href: string
  label: string
  /** Opens in a new tab, as the header's own desktop link does. */
  newTab?: boolean
}

/**
 * The links, then the call to action. The background is solid: nothing behind
 * the panel shows through it.
 */
export function MobileMenuPanel({
  menu,
  links,
  cta,
  className,
}: {
  menu: MobileMenuState
  links: MobileMenuLink[]
  cta: MobileMenuLink
  className: string
}) {
  if (!menu.open) return null
  const close = () => menu.setOpen(false)
  return (
    <div id={menu.id} ref={menu.panelRef} className={className}>
      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            {...(link.newTab ? { target: "_blank", rel: "noreferrer" } : {})}
            onClick={close}
            className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {link.label}
          </Link>
        ))}
        <div className="border-t border-border/40 mt-2 pt-2">
          <Link
            href={cta.href}
            onClick={close}
            className="flex items-center justify-center gap-2 rounded-xl border border-foreground px-4 py-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {cta.label}
            <svg className="h-4 w-4 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
