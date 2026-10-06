"use client"

import { useCallback, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { locales, type Locale } from "@/i18n/routing"

/**
 * Switching language on the landing page moves between /en/ and /ar/, two
 * static pages, but should feel like the page flipping in place, as it does
 * in the reference.
 *
 * The flip is a client-side navigation wrapped in a view transition: the old
 * page is captured, the router renders the other locale, and the browser
 * cross-fades and slides the named parts (title, product window, its sidebar)
 * from their LTR places to their RTL ones. Without view transitions, or with
 * reduced motion, it is a plain client navigation, still with no reload.
 *
 * This state lives at module level on purpose: the module survives the
 * navigation, so the new page can finish what the old one started.
 */
let settle: (() => void) | null = null

/** Longest the page may stay frozen waiting for the other locale to render. */
const SETTLE_TIMEOUT = 1500

function swapLocale(pathname: string, target: Locale) {
  const segments = pathname.split("/")
  if (locales.includes(segments[1] as Locale)) segments[1] = target
  else segments.splice(1, 0, target)
  return segments.join("/") || `/${target}/`
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function useLocaleFlip() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as Locale
  const target = locales.find((l) => l !== locale) ?? locale
  const href = swapLocale(pathname, target)

  // Fetched ahead, so the flip does not wait on the network.
  useEffect(() => {
    router.prefetch(href)
  }, [router, href])

  /** Flip to the other locale, after `delay` ms (to let a control animate first). */
  const flip = useCallback(
    (delay = 0) => {
      const navigate = () => router.push(href, { scroll: false })

      if (prefersReducedMotion() || !("startViewTransition" in document)) {
        navigate()
        return
      }

      const run = () =>
        document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              settle = resolve
              // Never hold the page frozen if the render is slow.
              window.setTimeout(resolve, SETTLE_TIMEOUT)
              navigate()
            })
        )

      if (delay > 0) window.setTimeout(run, delay)
      else run()
    },
    [router, href]
  )

  return { target, href, flip }
}

/**
 * Mounted once on the landing page. When the other locale has rendered, it
 * releases the view transition, after this round of effects, so the theme
 * provider has re-applied the theme class and the new page is captured in the
 * right mode.
 */
export function FlipSettled() {
  const locale = useLocale()

  useEffect(() => {
    if (!settle) return
    const done = settle
    settle = null
    // A task, not requestAnimationFrame: the browser suspends rendering while
    // a view transition waits for its update, so a frame would never come.
    // Not cancelled on cleanup: Strict Mode re-runs this effect at once, and a
    // cancelled task would leave the page frozen until the timeout.
    window.setTimeout(done, 0)
  }, [locale])

  return null
}
