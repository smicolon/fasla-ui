"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { Button } from "@fasla-ui/ui/button/button"
import { Switch } from "@fasla-ui/ui/switch/switch"
import { cn } from "@/lib/utils"
import { FaslaMark } from "./fasla-mark"
import { ArrowRightIcon, ChevronRightIcon, FileIcon, LockIcon, MirrorIcon, PlayIcon } from "./icons"
import { prefersReducedMotion } from "./locale-flip"
import { SectionHead, Stroked } from "./section-head"
import { visibleOffSwitch } from "./switch-style"

/** The rules, in the reference's order: three that mirror, three that stay. */
const RULES = [
  { k: "r1", mirrors: true },
  { k: "r2", mirrors: true },
  { k: "r3", mirrors: true },
  { k: "r6", mirrors: false },
  { k: "r8", mirrors: false },
  { k: "r4", mirrors: false },
] as const
type RuleKey = (typeof RULES)[number]["k"]

/** How long a rule stays open before the next one, in ms. */
const DWELL = 4400
/** The line's path while a rule is open: [ms, position %]. It starts on English (right), sweeps to Arabic, holds, and sweeps back. */
const SWEEP: [number, number][] = [[0, 100], [400, 100], [1700, 0], [2500, 0], [3800, 100]]
/** After someone drags the line or uses the keys, the sequence picks up again this much later. */
const RESUME = 6000

/** Cubic ease-in-out for the handle's sweep. */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type Call = { x: number; y: number; below: boolean } | null

/**
 * "What mirrors, what doesn't": the same product moment twice, English (LTR)
 * on the left and Arabic (RTL) on the right of one stage, split by a line.
 * When a rule opens, the line sweeps from English to Arabic and back; rules
 * advance on their own while the section is on screen. People can pick a
 * rule, drag the line or move it with the keys; the sequence then holds and
 * resumes a few seconds later. With reduced motion nothing moves and the
 * Arabic side shows.
 *
 * The stage is always laid out left to right, whatever the page direction: it
 * is a picture of the two directions side by side.
 */
export function MirrorCompare() {
  const t = useTranslations("landing.rules")
  const rtlPage = useLocale() === "ar"

  const [cur, setCur] = useState(0)
  const [epoch, setEpoch] = useState(0)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const [calls, setCalls] = useState<[Call, Call]>([null, null])

  const curRef = useRef(0)
  const started = useRef(false)
  const still = useRef(false)
  const frame = useRef(0)
  const resumeTimer = useRef(0)
  const stage = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLButtonElement>(null)
  const layerL = useRef<HTMLDivElement>(null)
  const layerR = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const dragging = useRef(false)

  const setPos = useCallback((p: number) => {
    const v = Math.max(0, Math.min(100, p))
    stage.current?.style.setProperty("--pos", `${v}%`)
    handle.current?.setAttribute("aria-valuenow", String(Math.round(v)))
  }, [])

  const show = useCallback((i: number) => {
    /** Wraps the index so the list loops. */
    const next = (i + RULES.length) % RULES.length
    curRef.current = next
    setCur(next)
    setEpoch((e) => e + 1)
  }, [])

  // The specimens are pictures: never focusable, never announced. The panel
  // carries the rule in words instead.
  useEffect(() => {
    if (layerL.current) layerL.current.inert = true
    if (layerR.current) layerR.current.inert = true
    still.current = prefersReducedMotion()
    if (still.current) {
      setAuto(false)
      setPos(0)
    }
  }, [setPos])

  // Start on the first rule when the section scrolls in; pause off screen.
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (!entry.isIntersecting) return
        if (!started.current) {
          started.current = true
          show(0)
        } else if (!still.current) {
          show(curRef.current + 1)
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [show])

  // Sweep the line each time a rule opens.
  useEffect(() => {
    if (!started.current) return
    cancelAnimationFrame(frame.current)
    if (still.current) {
      setPos(0)
      return
    }
    const t0 = performance.now()
    const end = SWEEP[SWEEP.length - 1][0]
    /** One frame of the sweep: eases the handle between the keyframes in SWEEP. */
    const step = (now: number) => {
      const t = now - t0
      let i = 0
      while (i < SWEEP.length - 2 && t > SWEEP[i + 1][0]) i++
      const [a, pa] = SWEEP[i]
      const [b, pb] = SWEEP[i + 1]
      const k = Math.min(1, Math.max(0, (t - a) / (b - a)))
      setPos(pa + (pb - pa) * easeInOut(k))
      if (t < end) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [epoch, setPos])

  // Advance while on screen and not held.
  useEffect(() => {
    if (!auto || !inView || !started.current) return
    const timer = window.setTimeout(() => show(curRef.current + 1), DWELL)
    return () => window.clearTimeout(timer)
  }, [auto, inView, epoch, show])

  useEffect(() => () => window.clearTimeout(resumeTimer.current), [])

  /** A manual move holds the sequence; it resumes by itself, from the next rule. */
  const hold = useCallback(() => {
    if (still.current) return
    cancelAnimationFrame(frame.current)
    setAuto(false)
    window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      setAuto(true)
      show(curRef.current + 1)
    }, RESUME)
  }, [show])

  // Pin each half's callout above or below the specimen, in line with its key part.
  const placeCalls = useCallback(() => {
    /** Where one half's callout goes: above or below the specimen, in line with its key part. */
    const place = (layer: HTMLDivElement | null): Call => {
      if (!layer) return null
      const key = layer.querySelector("[data-key] [data-slot=track]") ?? layer.querySelector("[data-key]")
      const card = layer.querySelector("[data-spc]")
      if (!key || !card) return null
      const lb = layer.getBoundingClientRect()
      const kb = key.getBoundingClientRect()
      const cb = card.getBoundingClientRect()
      const above = kb.top + kb.height / 2 < cb.top + cb.height / 2
      return { x: kb.left + kb.width / 2 - lb.left, y: (above ? cb.top - 4 : cb.bottom + 4) - lb.top, below: !above }
    }
    setCalls([place(layerL.current), place(layerR.current)])
  }, [])

  useLayoutEffect(() => {
    placeCalls()
  }, [cur, rtlPage, placeCalls])

  useEffect(() => {
    window.addEventListener("resize", placeCalls)
    document.fonts?.ready.then(placeCalls)
    return () => window.removeEventListener("resize", placeCalls)
  }, [placeCalls])

  /** A pointer's x as a percentage of the stage width. */
  const posFrom = (x: number) => {
    const box = stage.current!.getBoundingClientRect()
    return ((x - box.left) / box.width) * 100
  }

  const rule = RULES[cur]

  return (
    <section aria-labelledby="rules-h" className="pb-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead id="rules-h" title={<Stroked text={t("title")} />} lede={t("lede")} />

        <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-[clamp(32px,5vw,72px)] max-[900px]:grid-cols-1">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label={t("title")}
            className={cn("flex flex-col gap-1", auto && inView && "l-cmp-auto")}
            style={{ ["--dwell" as string]: `${DWELL}ms` }}
            onKeyDown={(event) => {
              const keys: Record<string, number> = { ArrowDown: cur + 1, ArrowUp: cur - 1, Home: 0, End: RULES.length - 1 }
              if (!(event.key in keys)) return
              event.preventDefault()
              hold()
              /** Arrow keys and Home/End move between rules, looping at the ends. */
              const next = (keys[event.key] + RULES.length) % RULES.length
              show(next)
              tabs.current[next]?.focus()
            }}
          >
            {RULES.map((r, i) => {
              const selected = i === cur
              return (
                <div key={r.k} className="contents">
                  {(i === 0 || i === 3) && (
                    <div
                      aria-hidden="true"
                      className={cn(
                        "px-4 pb-1.5 pt-3.5 text-muted-foreground",
                        rtlPage ? "font-arabic text-[13px]" : "font-mono text-[11.5px] tracking-[.02em]"
                      )}
                    >
                      {t(i === 0 ? "mirrors" : "stays")}
                    </div>
                  )}
                  <button
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`cmp-tab-${i}`}
                    aria-selected={selected}
                    aria-controls="cmp-stage"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => {
                      window.clearTimeout(resumeTimer.current)
                      if (!still.current) setAuto(true)
                      show(i)
                    }}
                    className={cn(
                      "l-cmp-tab relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 overflow-hidden rounded-xl px-4 py-3.5 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
                      selected
                        ? "bg-[color:var(--l-bg-2)] text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                        : "text-[color:var(--l-fg-2)] hover:bg-[color:var(--l-bg-2)] hover:text-foreground"
                    )}
                  >
                    <span className="text-base font-semibold leading-[1.35] rtl:leading-[1.6]">{t(`${r.k}.h`)}</span>
                    <Badge
                      variant={r.mirrors ? "solid" : "outline"}
                      tone={r.mirrors ? "primary" : "secondary"}
                      size="md"
                      radius="standard"
                      icon={r.mirrors ? <MirrorIcon /> : <LockIcon />}
                    >
                      {t(r.mirrors ? "mirrors" : "stays")}
                    </Badge>
                    <span
                      className={cn(
                        "l-cmp-desc col-span-2 overflow-hidden text-sm text-[color:var(--l-fg-2)] rtl:leading-[1.75]",
                        selected ? "max-h-[4em] opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      {t(`${r.k}.p`)}
                    </span>
                    {/* How long until the next rule opens. Remounted per rule, so it
                        starts from empty each time; landing.css fills it. */}
                    <span key={selected ? `on-${epoch}` : "off"} aria-hidden="true" className="l-cmp-tm" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="relative min-w-0 pt-[34px] max-[900px]:pt-0">
            <Arc className="-left-[54px] -top-6" path="M18 96 A 70 70 0 0 1 96 18" id="arc-en" label={t("arcEn")} />
            <Arc className="-bottom-[58px] -right-[54px]" path="M24 102 A 70 70 0 0 0 102 24" id="arc-ar" label={t("arcAr")} />
            <div
              ref={stage}
              id="cmp-stage"
              role="tabpanel"
              aria-labelledby={`cmp-tab-${cur}`}
              dir="ltr"
              className="l-cmp"
              style={{ ["--pos" as string]: "100%" }}
              onPointerDown={(event) => {
                dragging.current = true
                hold()
                stage.current?.setPointerCapture(event.pointerId)
                setPos(posFrom(event.clientX))
              }}
              onPointerMove={(event) => {
                if (dragging.current) setPos(posFrom(event.clientX))
              }}
              onPointerUp={() => (dragging.current = false)}
              onPointerCancel={() => (dragging.current = false)}
            >
              <p className="sr-only">
                {t(`${rule.k}.h`)}. {t(`${rule.k}.p`)}
              </p>
              <div ref={layerR} dir="rtl" lang="ar" aria-hidden="true" className="l-cmp-layer l-cmp-ar font-arabic">
                <Specimen k={rule.k} lang="ar" />
                <Callout call={calls[1]} text={t(`spec.ar.call${rule.k.slice(1)}`)} arabic />
              </div>
              <div ref={layerL} dir="ltr" lang="en" aria-hidden="true" className="l-cmp-layer l-cmp-en font-sans">
                <Specimen k={rule.k} lang="en" />
                <Callout call={calls[0]} text={t(`spec.en.call${rule.k.slice(1)}`)} />
              </div>
              <div aria-hidden="true" className="l-cmp-line" />
              <button
                ref={handle}
                type="button"
                role="slider"
                aria-label={t("drag")}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={100}
                className="l-cmp-handle"
                onKeyDown={(event) => {
                  const step: Record<string, number> = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 }
                  if (!(event.key in step)) return
                  event.preventDefault()
                  hold()
                  const now = parseFloat(stage.current?.style.getPropertyValue("--pos") || "50")
                  setPos(now + step[event.key])
                }}
              >
                <span aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** A curved label outside a stage corner. Decorative; hidden on narrow screens. */
function Arc({ className, path, id, label }: { className: string; path: string; id: string; label: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={cn("pointer-events-none absolute size-28 overflow-visible max-[900px]:hidden", className)}>
      <defs>
        <path id={id} d={path} />
      </defs>
      <text className="fill-muted-foreground font-mono text-[11px] font-medium tracking-[.28em]">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {label}
        </textPath>
      </text>
    </svg>
  )
}

/** The red label pinned to the part that does, or does not, change. */
function Callout({ call, text, arabic = false }: { call: Call; text: string; arabic?: boolean }) {
  if (!call) return null
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-[3] flex items-center",
        call.below ? "flex-col-reverse" : "flex-col"
      )}
      style={{ left: call.x, top: call.y, transform: call.below ? "translate(-50%, 0)" : "translate(-50%, -100%)" }}
    >
      <b
        className={cn(
          "whitespace-nowrap rounded-md bg-fasla-red text-fasla-white",
          arabic ? "px-[9px] pb-1.5 pt-[5px] font-arabic text-[12.5px] font-semibold leading-[1.2]" : "px-2 py-1.5 font-mono text-[11.5px] font-medium leading-none"
        )}
      >
        {text}
      </b>
      <i className="h-3.5 w-px bg-fasla-red" />
    </span>
  )
}

/**
 * One rule's product moment, in one language. Fasla components where they
 * exist (Button, Switch); the breadcrumb, progress bar, player and code boxes
 * are drawn here. Icons take the specimen's direction explicitly, because the
 * English half sits inside an Arabic page, and the reverse.
 */
function Specimen({ k, lang }: { k: RuleKey; lang: "en" | "ar" }) {
  const t = useTranslations(`landing.rules.spec.${lang}`)
  const rtl = lang === "ar"
  const flip = rtl ? "-scale-x-100" : undefined
  /** Keeps numbers left to right inside Arabic copy. */
  const num = (chunks: React.ReactNode) => <bdi dir="ltr">{chunks}</bdi>
  const card = "grid w-[min(430px,88%)] gap-4 rounded-2xl border bg-card p-6 text-[15px] text-card-foreground shadow-sm max-[560px]:p-4"
  const caption = "text-xs text-muted-foreground"
  const ltrBox = "justify-self-start rounded-lg border bg-[color:var(--l-bg-2)] px-2.5 py-1.5 font-mono text-[13px] [direction:ltr] [unicode-bidi:isolate]"

  switch (k) {
    case "r1":
      return (
        <div data-spc className={card}>
          <div className="flex items-center justify-center gap-1.5 text-sm text-[color:var(--l-fg-2)]">
            <span>{t("accounts")}</span>
            <ChevronRightIcon className={cn("size-3.5", flip)} />
            <span>{t("cards")}</span>
            <ChevronRightIcon className={cn("size-3.5", flip)} />
            <b className="font-medium text-foreground">{t("platinum")}</b>
          </div>
          <div className="flex justify-between gap-2.5">
            <Button variant="outline" className="h-10">
              {t("back")}
            </Button>
            <Button data-key className="h-10">
              {t("next")}
              <ArrowRightIcon className={flip} />
            </Button>
          </div>
        </div>
      )
    case "r2":
      return (
        <div data-spc className={card}>
          <div className="flex items-center gap-2.5">
            <span className="grid size-[34px] shrink-0 place-items-center rounded-[9px] bg-muted text-[color:var(--l-fg-2)]">
              <FileIcon className="size-[17px]" />
            </span>
            <div>
              <b className="block font-medium">{t("uploading")}</b>
              <bdi dir="ltr" className="font-mono text-xs text-muted-foreground">
                statement-2025.pdf
              </bdi>
            </div>
          </div>
          <div className={cn("flex items-center justify-between gap-3", caption)}>
            <span>{t.rich("size", { n: num })}</span>
            <bdi dir="ltr">62%</bdi>
          </div>
          {/* A block fills from the start edge on its own: left here in English, right in Arabic. */}
          <div data-key className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[62%] rounded-full bg-foreground" />
          </div>
        </div>
      )
    case "r3":
      return (
        <div data-spc className={card}>
          <div className={caption}>{t("settings")}</div>
          <div data-key>
            <Switch layout="label-first" label={t("notifications")} checked readOnly className={cn(visibleOffSwitch, "w-full")} />
          </div>
          <Switch layout="label-first" label={t("weekly")} checked={false} readOnly className={cn(visibleOffSwitch, "w-full")} />
        </div>
      )
    case "r6":
      return (
        <div data-spc className={card}>
          <div>
            <b className="block font-medium">{t.rich("tour", { n: num })}</b>
            <div className={caption}>{t("tourK")}</div>
          </div>
          {/* Time runs left to right in both languages, so the player never mirrors. */}
          <div dir="ltr" className="flex items-center gap-3">
            <span data-key className="grid size-[38px] shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <PlayIcon className="size-[15px]" />
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[22%] rounded-full bg-foreground" />
            </div>
            <span className="font-mono text-xs text-muted-foreground">0:42 / 3:15</span>
          </div>
        </div>
      )
    case "r8":
      return (
        <div data-spc className={card}>
          <div className={caption}>{t("phone")}</div>
          <span data-key className={ltrBox}>
            +966 50 000 1234
          </span>
          <div className={caption}>{t("install")}</div>
          <span className={ltrBox}>npx @smicolon/cli add button</span>
        </div>
      )
    case "r4":
      return (
        <div data-spc className={card}>
          <div data-key className="flex items-center justify-center gap-3 py-2">
            <FaslaMark className="size-11" />
            <span className={cn("text-[34px] font-bold tracking-[-0.03em]", rtl && "font-arabic font-extrabold tracking-normal")}>
              {t("word")}
            </span>
          </div>
          <div className={cn(caption, "text-center")}>{t("builtWith")}</div>
        </div>
      )
  }
}
