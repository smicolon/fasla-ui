"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@fasla-ui/ui/button/button"
import { ArrowEndIcon } from "./icons"
import { landingLinks } from "./links"

/** The templates in order: [message key, picture height at 582px wide]. Brands are fictional. */
const TEMPLATES: [string, number][] = [
  ["rihla", 1746],
  ["qahwahouse", 1435],
  ["sanad", 1369],
  ["dar", 1488],
  ["mahaam", 1402],
  ["majalla", 1402],
]

/** Space between cards, in px. */
const GAP = 20

const CHIPS = ["LTR · RTL", "React", "Tailwind CSS"]

/**
 * The templates rail: arrows above, cards that run past the page edge, a
 * progress bar and "See all templates" below. In Arabic it starts from the
 * right. Each card is a picture of the template's page; on hover the picture
 * scrolls from its top to its bottom (CSS only, and not at all with reduced
 * motion).
 */
export function ProTemplateRail() {
  const t = useTranslations("landing.templates")
  const locale = useLocale()
  const rtl = locale === "ar"
  const rail = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ start: true, end: false, size: 30, at: 0 })

  /** Reads where the rail is: at its start, at its end, and how much of it shows. */
  const measure = useCallback(() => {
    const el = rail.current
    if (!el) return
    const room = el.scrollWidth - el.clientWidth
    const x = Math.abs(el.scrollLeft)
    const shown = el.scrollWidth ? Math.min(1, el.clientWidth / el.scrollWidth) : 1
    setPos({ start: x < 4, end: x > room - 4, size: shown * 100, at: (room > 0 ? x / room : 0) * (1 / shown - 1) * 100 })
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  /** One card forward or back, in the reading direction. */
  const step = (direction: 1 | -1) => {
    const el = rail.current
    const card = el?.querySelector("a")
    if (!el || !card) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * (card.getBoundingClientRect().width + GAP), behavior: still ? "auto" : "smooth" })
  }

  return (
    <>
      <div className="l-wrap -mt-6 mb-8 flex justify-center gap-2.5">
        <Button variant="outline" size="icon" className="size-10 rounded-full" aria-label={t("prev")} disabled={pos.start} onClick={() => step(-1)}>
          <ArrowEndIcon className="size-[18px] rotate-180" />
        </Button>
        <Button variant="outline" size="icon" className="size-10 rounded-full" aria-label={t("next")} disabled={pos.end} onClick={() => step(1)}>
          <ArrowEndIcon className="size-[18px]" />
        </Button>
      </div>

      <div
        ref={rail}
        onScroll={() => requestAnimationFrame(measure)}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-[var(--rail-pad)] pb-3 pt-1 [--rail-pad:max(var(--l-gutter),calc((100vw-1248px)/2))] [scroll-padding-inline:var(--rail-pad)] [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {TEMPLATES.map(([key, height], i) => {
          const name = t(`items.${key}.name`)
          const kind = t(`items.${key}.kind`)
          const base = `templates-${String(i + 1).padStart(2, "0")}-${locale}`
          const picture = "absolute inset-x-0 top-0 h-auto w-full transition-transform duration-[2800ms] ease-[cubic-bezier(.45,0,.25,1)] group-hover:[transform:translateY(calc(-100%+var(--tp-box)))] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          return (
            <Link
              key={key}
              href={landingLinks.templates(locale)}
              aria-label={rtl ? `${name}، ${kind}` : `${name}, ${kind}`}
              className="group flex w-[var(--tp-w)] shrink-0 snap-start flex-col gap-3.5 rounded-2xl border bg-[color:var(--l-bg-2)] px-3 pb-[18px] pt-3 transition-[border-color,box-shadow] duration-300 [--tp-box:calc((var(--tp-w)-26px)*1.4)] [--tp-w:clamp(260px,22vw,320px)] hover:border-foreground/15 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <div aria-hidden="true" className="relative h-[var(--tp-box)] overflow-hidden rounded-[10px] bg-background ring-1 ring-border">
                {/* Static export: plain pictures, sized by their width and height. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/landing/pro/${base}-light.webp`} alt="" width={582} height={height} loading="lazy" decoding="async" className={`${picture} dark:hidden`} />
                {/* Static export: plain pictures, sized by their width and height. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/landing/pro/${base}-dark.webp`} alt="" width={582} height={height} loading="lazy" decoding="async" className={`${picture} hidden dark:block`} />
              </div>
              <div className="flex items-baseline justify-between gap-2.5 px-1.5">
                <b className="text-lg font-semibold tracking-[-0.01em] rtl:font-bold rtl:tracking-normal">{name}</b>
                <span className="whitespace-nowrap text-[13px] text-muted-foreground">{kind}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 px-1.5">
                {CHIPS.map((chip) => (
                  <span key={chip} dir="ltr" className="inline-flex h-6 items-center rounded-[7px] border bg-background px-2 font-mono text-[11px] text-[color:var(--l-fg-2)]">
                    {chip}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="l-wrap">
        <div aria-hidden="true" className="mx-auto mt-7 h-0.5 w-[min(220px,50%)] overflow-hidden rounded-full bg-border">
          <i
            className="block h-full rounded-full bg-foreground transition-transform duration-300"
            style={{ width: `${pos.size}%`, transform: `translateX(${(rtl ? -1 : 1) * pos.at}%)` }}
          />
        </div>
        <div className="mt-7 flex justify-center">
          <Button asChild>
            <Link href={landingLinks.templates(locale)}>{t("all")}</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
