"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocale } from "next-intl"
import { localeDirection, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { prefersReducedMotion, useLocaleFlip } from "./locale-flip"

type Dir = "ltr" | "rtl"

/** The thumb slides first; the page starts flipping this many ms into the slide. */
const FLIP_DELAY = 50
const SLIDE = { duration: 450, easing: "cubic-bezier(.34, 1.36, .64, 1)" }
const OFFSET: Record<Dir, string> = { ltr: "translateX(0)", rtl: "translateX(100%)" }

/**
 * A slide in progress. The page re-renders in the other locale halfway
 * through, so the new switch picks the slide up at the same moment instead of
 * snapping the thumb to the end. Module state survives that navigation.
 */
let slide: { from: Dir; to: Dir; startedAt: number } | null = null

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

function animate(thumb: HTMLElement, from: Dir, to: Dir, elapsed: number) {
  const run = thumb.animate([{ transform: OFFSET[from] }, { transform: OFFSET[to] }], SLIDE)
  run.currentTime = elapsed
}

/**
 * The hero's `dir = "ltr" | "rtl"` switch. It reads as code, so the control
 * itself never mirrors: ltr stays on the left in both languages.
 */
export function DirectionSwitch({ label }: { label: string }) {
  const dir = localeDirection[useLocale() as Locale]
  const { flip } = useLocaleFlip()
  const thumb = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState<Dir>(dir)

  useEffect(() => setShown(dir), [dir])

  // Continue a slide the other locale's page began, before the first paint.
  useIsomorphicLayoutEffect(() => {
    if (!slide || slide.to !== dir || !thumb.current) return
    const elapsed = performance.now() - slide.startedAt
    if (elapsed < SLIDE.duration) animate(thumb.current, slide.from, slide.to, elapsed)
    slide = null
  }, [dir])

  function choose(next: Dir) {
    if (next === shown) return
    setShown(next)
    const still = prefersReducedMotion()
    if (!still && thumb.current) {
      slide = { from: shown, to: next, startedAt: performance.now() }
      animate(thumb.current, shown, next, 0)
    }
    flip(still ? 0 : FLIP_DELAY)
  }

  return (
    <div
      role="group"
      aria-label={label}
      dir="ltr"
      className="relative inline-grid h-16 w-[min(440px,100%)] grid-cols-2 rounded-full border bg-muted p-1.5 shadow-inner [view-transition-name:dir-switch] max-[560px]:h-[58px]"
    >
      <span
        ref={thumb}
        aria-hidden="true"
        style={{ transform: OFFSET[shown] }}
        className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-full bg-fasla-red shadow-sm"
      />
      {(["ltr", "rtl"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={shown === value}
          onClick={() => choose(value)}
          className={cn(
            "relative z-10 flex items-center justify-center whitespace-nowrap rounded-full font-mono text-base transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-foreground max-[560px]:text-sm",
            shown === value ? "text-fasla-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {/* Flex centres the label: globals.css starts .font-mono text in RTL. */}
          <span>
            dir = <span className="opacity-60">&quot;</span>
            {value}
            <span className="opacity-60">&quot;</span>
          </span>
        </button>
      ))}
    </div>
  )
}
