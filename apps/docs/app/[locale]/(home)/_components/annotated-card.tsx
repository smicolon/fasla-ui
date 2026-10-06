"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { Avatar } from "@fasla-ui/ui/avatar/avatar"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { Button } from "@fasla-ui/ui/button/button"
import { Input } from "@fasla-ui/ui/input/input"
import { cn } from "@/lib/utils"
import { BI } from "./block-icons"
import { ArrowRightIcon, DotIcon, MoonIcon, SunIcon } from "./icons"
import { prefersReducedMotion } from "./locale-flip"
import { SectionHead, Stroked } from "./section-head"

/** How long each property stays shown before the next, while the reader is not pointing at one. */
const CYCLE = 3200
const STATES = ["default", "loading", "disabled", "error"] as const

/**
 * "What you get": six properties around one component, each pointing at the
 * part that proves it. The active one draws a red leader to the card,
 * outlines its part with a mono tag, and demonstrates itself: 01 flips the
 * card to the other direction and language, 03 cycles the button's states,
 * 04 shows the compact density in the other theme.
 *
 * They cycle while the section is on screen; hovering, focusing or clicking
 * one holds it until the pointer leaves. Reduced motion never cycles.
 *
 * The card is built on tokens and follows the page theme; 04 scopes the
 * other theme to the card alone (a `.light` or `.dark` class on its wrapper),
 * so it turns dark on a light page and light on a dark one.
 */
export function AnnotatedCard({ components }: { components: number }) {
  const t = useTranslations("landing.props")
  const page = useLocale() === "ar" ? "ar" : "en"
  const section = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [state, setState] = useState<(typeof STATES)[number]>("default")
  const heldRef = useRef(false)
  heldRef.current = held

  // The demo card is a picture: its button and field are never focusable.
  useEffect(() => {
    if (stage.current) stage.current.inert = true
  }, [])

  // Cycle while visible and not held.
  useEffect(() => {
    const el = section.current
    if (!el || prefersReducedMotion()) return
    let timer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer)
        if (entry.isIntersecting) timer = window.setInterval(() => !heldRef.current && setActive((i) => (i + 1) % 6), CYCLE)
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [])

  // 03: walk the button through its states.
  useEffect(() => {
    if (active !== 2) {
      setState("default")
      return
    }
    let k = 0
    setState(STATES[0])
    const timer = window.setInterval(() => {
      k = (k + 1) % STATES.length
      setState(STATES[k])
    }, 900)
    return () => window.clearInterval(timer)
  }, [active])

  const lang = active === 0 ? (page === "ar" ? "en" : "ar") : page
  const dir = lang === "ar" ? "rtl" : "ltr"
  const { resolvedTheme } = useTheme()
  // The server cannot know the theme, so it is read only after mount; reading
  // it during the first render would not match the server's HTML.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const pageDark = mounted && resolvedTheme === "dark"
  // 04 shows the theme the page is not in.
  const flipTheme = active === 3
  const dark = flipTheme ? !pageDark : pageDark
  const compact = active === 3
  const c = (key: string) => t(`card.${lang}.${key}`)

  const callout = (i: number, side: "start" | "end") => {
    const n = i + 1
    const on = active === i
    const pick = () => {
      setHeld(true)
      setActive(i)
    }
    return (
      <button
        key={n}
        type="button"
        onMouseEnter={pick}
        onFocus={pick}
        onClick={pick}
        aria-pressed={on}
        className={cn(
          "relative grid gap-1 rounded-[14px] border bg-card px-[18px] py-4 text-start transition-[border-color,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
          // The leader: a line to the stage ending in a dot, hidden when the stage stacks on top.
          "after:absolute after:top-1/2 after:h-px after:w-11 after:bg-foreground/15 after:transition-colors after:content-[''] before:absolute before:top-[calc(50%-3.5px)] before:z-[1] before:size-[7px] before:rounded-full before:bg-foreground/15 before:transition-colors before:content-[''] max-[1080px]:after:hidden max-[1080px]:before:hidden",
          side === "start" ? "after:start-full before:start-[calc(100%+40px)]" : "after:end-full before:end-[calc(100%+40px)]",
          on && "border-foreground shadow-lg after:bg-fasla-red before:bg-fasla-red"
        )}
      >
        <span className={cn("font-mono text-[11.5px] font-medium", on ? "text-fasla-red" : "text-muted-foreground")}>0{n}</span>
        <b className="text-base font-semibold rtl:font-bold">{t(`p${n}.t`)}</b>
        <span className="text-sm leading-[1.55] text-[color:var(--l-fg-2)] rtl:leading-[1.8]">{t(`p${n}.d`, { count: String(components) })}</span>
      </button>
    )
  }

  /** A part of the card the callouts point at; the active one is outlined and tagged. */
  const part = (n: number, tag: string, className: string, children: React.ReactNode) => (
    <div
      className={cn(
        "relative rounded-[10px] outline-dashed outline-[1.5px] outline-offset-[5px] transition-[outline-color] duration-300",
        active === n - 1 ? "outline-fasla-red" : "outline-transparent",
        className
      )}
    >
      {children}
      <span
        dir="ltr"
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+9px)] start-[-4px] z-[3] whitespace-nowrap rounded-md bg-fasla-red px-[7px] py-[5px] font-mono text-[11px] font-medium leading-none text-fasla-white transition-[opacity,transform] duration-300",
          active === n - 1 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        )}
      >
        {tag}
      </span>
    </div>
  )

  return (
    <section aria-labelledby="props-h" className="pb-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead id="props-h" title={<Stroked text={t("title")} />} lede={t("lede")} />

        <div
          ref={section}
          onMouseLeave={() => setHeld(false)}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)_minmax(0,1fr)] items-center gap-11 max-[1080px]:grid-cols-2 max-[1080px]:gap-5 max-[620px]:grid-cols-1"
        >
          <div className="grid gap-3.5">{[0, 1, 2].map((i) => callout(i, "start"))}</div>

          <div
            ref={stage}
            aria-hidden="true"
            className="relative rounded-[22px] border bg-[color:var(--l-bg-2)] p-[clamp(22px,3vw,40px)] [background-image:radial-gradient(color-mix(in_oklch,var(--foreground)_18%,transparent)_1px,transparent_1.2px)] [background-size:16px_16px] max-[1080px]:order-first max-[1080px]:col-span-2 max-[620px]:col-span-1"
          >
            <div className={cn(flipTheme && (pageDark ? "light" : "dark"))}>
              <div
                dir={dir}
                lang={lang}
                className={cn(
                  "grid rounded-[18px] border bg-card text-card-foreground shadow-2xl transition-[padding,gap,background-color,color] duration-500",
                  lang === "ar" ? "font-arabic" : "font-sans",
                  compact ? "gap-2.5 p-3.5" : "gap-4 p-[22px]"
                )}
              >
                <div className="flex items-center justify-between gap-2.5">
                  {part(
                    1,
                    `dir="${dir}"`,
                    "",
                    <span dir="ltr" className="inline-flex rounded-[9px] bg-muted p-[3px] font-mono text-xs font-medium">
                      {(["LTR", "RTL"] as const).map((x) => (
                        <span key={x} className={cn("rounded-[7px] px-2.5 py-1 transition-colors", (x === "RTL") === (dir === "rtl") ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>
                          {x}
                        </span>
                      ))}
                    </span>
                  )}
                  {part(
                    4,
                    "light · dark · S M L",
                    "",
                    <span dir="ltr" className="inline-flex items-center gap-2">
                      <span className="grid size-[30px] place-items-center rounded-lg border">
                        {dark ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
                      </span>
                      <span className="inline-flex overflow-hidden rounded-lg border">
                        {["S", "M", "L"].map((d) => (
                          <i key={d} className={cn("grid h-7 w-[26px] place-items-center font-mono text-[11.5px] not-italic", (compact ? "S" : "M") === d ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
                            {d}
                          </i>
                        ))}
                      </span>
                    </span>
                  )}
                </div>

                {part(
                  2,
                  "Geist ↔ Cairo · 1:1",
                  "flex items-center gap-3",
                  <>
                    <Avatar src="/landing/img/p-noura.webp" name="" radius="rounded" className="size-11" />
                    <div className="grid min-w-0 flex-1">
                      <b className="text-[16.5px] font-semibold rtl:font-bold">{c("name")}</b>
                      <span className="text-[13px] text-muted-foreground">{c("role")}</span>
                    </div>
                    <Badge variant="soft" tone="success" size="md" icon={<DotIcon />}>
                      {c("active")}
                    </Badge>
                  </>
                )}

                {part(
                  5,
                  "bg-card · border-input · ring",
                  "grid gap-1.5",
                  <>
                    <span className="text-[12.5px] font-medium text-muted-foreground">{c("label")}</span>
                    <Input readOnly value="noura@sanad.example" startIcon={<BI n="mail" className="size-4" />} className="h-10 rounded-[9px] text-sm" />
                  </>
                )}

                {part(
                  3,
                  "default · loading · disabled · error",
                  "flex items-center justify-between gap-2.5",
                  <>
                    <Button
                      loading={state === "loading"}
                      disabled={state === "disabled"}
                      variant={state === "error" ? "outline" : "default"}
                      className={cn("h-10 rounded-[10px]", state === "error" && "border-destructive text-destructive", state === "disabled" && "opacity-100 bg-muted text-muted-foreground")}
                    >
                      {c("button")}
                      {state !== "loading" && <ArrowRightIcon className={cn(dir === "rtl" && "-scale-x-100")} />}
                    </Button>
                    <span dir="ltr" className="font-mono text-[11.5px] font-medium text-muted-foreground">
                      {state}
                    </span>
                  </>
                )}

                {part(
                  6,
                  "content contract",
                  "",
                  <div dir="ltr" className="flex flex-wrap items-center gap-1.5 rounded-[10px] bg-muted/70 px-3 py-2.5 font-mono text-xs">
                    <span>name</span>
                    <em className="me-2 not-italic text-muted-foreground">≤ 24</em>
                    <span>role</span>
                    <em className="me-2 not-italic text-muted-foreground">≤ 32</em>
                    <span>cta</span>
                    <em className="not-italic text-muted-foreground">verb first</em>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-3.5">{[3, 4, 5].map((i) => callout(i, "end"))}</div>
        </div>
      </div>
    </section>
  )
}
