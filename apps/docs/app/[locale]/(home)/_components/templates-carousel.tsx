"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@fasla-ui/ui/button/button"
import { cn } from "@/lib/utils"
import { Block } from "./block-library"
import { DARK_BLOCKS, type BlockKey } from "./blocks-data"
import { ArrowEndIcon } from "./icons"
import { landingLinks } from "./links"
import { prefersReducedMotion } from "./locale-flip"
import { useNearView } from "./use-near-view"

/** Each template is a page stacked from blocks: [block, height at 880px wide]. Brands are fictional. */
const TEMPLATES: { id: string; stack: [BlockKey, number][] }[] = [
  { id: "rihla", stack: [["hero", 560], ["feat", 380], ["gallery", 470], ["cal", 420], ["chat", 430], ["faq", 380]] },
  { id: "qahwahouse", stack: [["app", 470], ["prod", 430], ["order", 470], ["checkout", 500], ["news", 300]] },
  { id: "sanad", stack: [["dash", 560], ["stats", 330], ["price", 440], ["toast", 360], ["faq", 380]] },
  { id: "dar", stack: [["dhero", 560], ["gallery", 470], ["feat", 380], ["chat", 420], ["cal", 420]] },
  { id: "mahaam", stack: [["ai", 560], ["feat", 380], ["price", 440], ["toast", 360], ["faq", 380]] },
  { id: "majalla", stack: [["mag", 620], ["read", 400], ["ban", 330], ["gallery", 470], ["news", 300]] },
]

const WIDTH = 880
/** Gap between cards, in px, for one arrow step. */
const GAP = 20

/**
 * One template: its stacked page, which scrolls through on hover at the same
 * calm speed whatever its length, then its name, kind and stack chips.
 */
function TemplateCard({ id, stack }: (typeof TEMPLATES)[number]) {
  const t = useTranslations("landing.templates.items")
  const locale = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const [z, setZ] = useState<number | null>(null)
  const [scroll, setScroll] = useState({ by: 0, dur: 2.8 })
  const near = useNearView(box)
  const total = stack.reduce((sum, [, h]) => sum + h, 0)

  // A picture, not a form: its buttons and fields are never focusable.
  useEffect(() => {
    if (box.current) box.current.inert = true
  }, [])

  useEffect(() => {
    const el = box.current
    if (!el) return
    /** Scales the page to the card's width and works out how far, and how long, the hover scroll runs. */
    const measure = () => {
      const scale = el.clientWidth / WIDTH
      const by = Math.max(0, total * scale - el.clientHeight)
      setZ(scale)
      setScroll({ by, dur: Math.min(9, Math.max(2.8, by / 260)) })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [total])

  const name = t(`${id}.name`)
  const kind = t(`${id}.kind`)

  return (
    <Link
      href={landingLinks.templates(locale)}
      aria-label={locale === "ar" ? `${name}، ${kind}` : `${name}, ${kind}`}
      className="group flex w-[clamp(260px,22vw,320px)] shrink-0 snap-start flex-col gap-3.5 rounded-2xl border bg-[color:var(--l-bg-2)] px-3 pb-[18px] pt-3 transition-[border-color,box-shadow] duration-300 hover:border-foreground/15 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
    >
      <div ref={box} aria-hidden="true" className="relative aspect-[5/7] overflow-hidden rounded-[10px] bg-background ring-1 ring-border">
        <div
          className={cn(
            "absolute inset-0 transition-transform ease-[cubic-bezier(.45,0,.25,1)] motion-reduce:transition-none group-hover:[transform:translateY(var(--scroll))] motion-reduce:group-hover:transform-none",
            z === null && "invisible"
          )}
          style={{ ["--scroll" as string]: `${-scroll.by}px`, transitionDuration: `${scroll.dur}s` }}
        >
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: WIDTH, transform: z ? `scale(${z})` : undefined }}>
            {near && stack.map(([k, h], i) => (
              <div key={`${k}-${i}`} className={cn("relative", DARK_BLOCKS.includes(k) && "dark")} style={{ height: h }}>
                <Block k={k} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2.5 px-1.5">
        <b className="text-lg font-semibold tracking-[-0.01em] rtl:font-bold rtl:tracking-normal">{name}</b>
        <span className="whitespace-nowrap text-[13px] text-muted-foreground">{kind}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 px-1.5">
        {["LTR · RTL", "React", "Tailwind CSS"].map((chip) => (
          <span key={chip} dir="ltr" className="inline-flex h-6 items-center rounded-[7px] border bg-background px-2 font-mono text-[11px] text-[color:var(--l-fg-2)]">
            {chip}
          </span>
        ))}
      </div>
    </Link>
  )
}

/**
 * The carousel: a rail that starts on the content edge and runs past the
 * page edge, arrows above it and a progress bar below. In Arabic it starts
 * from the right.
 */
export function TemplatesRail() {
  const t = useTranslations("landing.templates")
  const locale = useLocale()
  const rtl = locale === "ar"
  const rail = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ atStart: true, atEnd: false, width: 30, offset: 0 })

  const update = useCallback(() => {
    const el = rail.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const x = Math.abs(el.scrollLeft)
    const visible = el.scrollWidth ? Math.min(1, el.clientWidth / el.scrollWidth) : 1
    setState({
      atStart: x < 4,
      atEnd: x > max - 4,
      width: visible * 100,
      offset: (max > 0 ? x / max : 0) * (1 / visible - 1) * 100,
    })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [update])

  /** Scrolls the rail one card forward or back, in the page's reading direction. */
  const go = (direction: 1 | -1) => {
    const el = rail.current
    const card = el?.querySelector("a")
    if (!el || !card) return
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * (card.getBoundingClientRect().width + GAP), behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  return (
    <>
      <div className="l-wrap -mt-6 mb-8 flex justify-center gap-2.5">
        <Button variant="outline" size="icon" className="size-10 rounded-full" aria-label={t("prev")} disabled={state.atStart} onClick={() => go(-1)}>
          <ArrowEndIcon className="size-[18px] rotate-180" />
        </Button>
        <Button variant="outline" size="icon" className="size-10 rounded-full" aria-label={t("next")} disabled={state.atEnd} onClick={() => go(1)}>
          <ArrowEndIcon className="size-[18px]" />
        </Button>
      </div>

      <div
        ref={rail}
        onScroll={() => requestAnimationFrame(update)}
        className="l-tp-rail flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-3 pt-1 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {TEMPLATES.map((template) => (
          <TemplateCard key={template.id} {...template} />
        ))}
      </div>

      <div className="l-wrap">
        <div aria-hidden="true" className="mx-auto mt-7 h-0.5 w-[min(220px,50%)] overflow-hidden rounded-full bg-border">
          <i
            className="block h-full rounded-full bg-foreground transition-transform duration-300"
            style={{ width: `${state.width}%`, transform: `translateX(${(rtl ? -1 : 1) * state.offset}%)` }}
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
