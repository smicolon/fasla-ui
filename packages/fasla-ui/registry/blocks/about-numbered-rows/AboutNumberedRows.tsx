"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Numbered Rows.
 *
 * A large statement over three numbered principles, on an inverted
 * surface. The statement is one paragraph with one sentence in semibold,
 * then a closing paragraph, a blank line below, in the inverse muted
 * colour. Each principle is a row under a 1px hairline: a large title at
 * the start, and at the end a short description and a counter ("01 / 03").
 *
 * Desktop sets the statement and titles at 36px, with the description
 * 300px wide; Tablet drops them to 30px and the description to 240. Mobile
 * drops them to 24px and stacks each title over its description and
 * counter, which share the line. The section has no visible heading; an
 * `h2` for screen readers names it.
 *
 * The surface is painted with the inverse tokens, the only way Fasla
 * inverts one: dark in Light, light in Dark, without forcing a `.dark`
 * class. The theme-inverse registry item maps the tokens.
 *
 * Motion, once each, as it scrolls into view: the statement fades up 16px;
 * then each row, as it enters, draws its hairline across from the start
 * edge (400ms), fades in its title and description, and ticks its counter
 * up to its number. Under reduced motion everything is shown at once.
 *
 * In Arabic the titles move to the right and the hairlines draw from the
 * right, as Figma's RTL variants draw them. The counters stay
 * left-to-right in Western digits.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutNumberedRowsRow {
  /** The principle's name, an `h3`. */
  title: React.ReactNode
  /** The short description beside it. */
  description: React.ReactNode
}

export interface AboutNumberedRowsCopy {
  /** The section's heading, an `h2` for screen readers only: Figma shows none. */
  heading: React.ReactNode
  /** The statement paragraph. Wrap the sentence to stress in a `font-semibold` span, as the default does. */
  statement: React.ReactNode
  /** The closing paragraph under the statement, in the muted colour. Hidden when empty. */
  closing: React.ReactNode
  /** The principles, in order. Each row's counter is its place and the count, such as "01 / 03". */
  rows: AboutNumberedRowsRow[]
  /** Shown in place of the rows when `rows` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutNumberedRowsCopy> = {
  en: {
    heading: "Why we started",
    statement: (
      <>
        Most teams we met were not short of software. <span className="font-semibold">They were short of quiet.</span> Tabs
        multiplied, alerts piled up and the real work slipped into the evening.
      </>
    ),
    closing: "So we started Fasla to give people their afternoons back.",
    rows: [
      {
        title: "Focus",
        description: "Fasla shows one clear next step instead of fifty open tabs, so attention goes where it counts.",
      },
      {
        title: "Rest",
        description: "Quiet hours, gentle reminders and no badge counts after work. Teams finish the day and actually stop.",
      },
      {
        title: "Trust",
        description: "Every feature is tested with real teams before release, and every change is explained in plain words.",
      },
    ],
    empty: "No principles yet.",
  },
  ar: {
    heading: "لماذا بدأنا",
    statement: (
      <>
        معظم الفرق التي التقيناها لم تكن تنقصها البرمجيات، <span className="font-semibold">بل كان ينقصها الهدوء.</span>{" "}
        تكاثرت علامات التبويب، وتراكمت التنبيهات، وانزلق العمل الحقيقي إلى المساء.
      </>
    ),
    closing: "لذلك أسسنا فاصلة لنعيد إلى الناس فترات ما بعد الظهر.",
    rows: [
      {
        title: "التركيز",
        description: "تعرض فاصلة خطوة تالية واضحة بدل خمسين تبويبًا مفتوحًا، فيذهب الانتباه إلى ما يستحقه.",
      },
      {
        title: "الراحة",
        description: "ساعات هادئة وتذكيرات لطيفة ولا عدّادات إشعارات بعد الدوام. تنهي الفرق يومها وتتوقف فعلًا.",
      },
      {
        title: "الثقة",
        description: "نختبر كل ميزة مع فرق حقيقية قبل إطلاقها، ونشرح كل تغيير بكلمات واضحة.",
      },
    ],
    empty: "لا توجد مبادئ بعد.",
  },
}

const pad = (n: number) => String(n).padStart(2, "0")

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Runs the entrances, once each: the statement fades up when it scrolls
 * into view, and each row draws its hairline, fades in its content and
 * ticks its counter when it does. The counter's real value is always in
 * the DOM for screen readers; only a hidden copy of it ticks.
 */
function useReveal(root: React.RefObject<HTMLElement | null>, count: number) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (reducedMotion()) return
    const ease = "cubic-bezier(0, 0, 0.2, 1)"
    const animations: Animation[] = []
    const frames: number[] = []
    const rtl = getComputedStyle(node).direction === "rtl"

    const reveal = (target: HTMLElement) => {
      if (target.hasAttribute("data-reveal-statement")) {
        animations.push(
          target.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], {
            duration: 500,
            easing: ease,
            fill: "backwards",
          })
        )
        return
      }
      const hairline = target.querySelector<HTMLElement>("[data-hairline]")
      if (hairline) {
        hairline.style.transformOrigin = rtl ? "right" : "left"
        animations.push(
          hairline.animate([{ transform: "scaleX(0)" }, { transform: "none" }], { duration: 400, easing: ease, fill: "backwards" })
        )
      }
      target.querySelectorAll<HTMLElement>("[data-row-part]").forEach((part, index) =>
        animations.push(
          part.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
            duration: 300,
            delay: 300 + index * 80,
            easing: ease,
            fill: "backwards",
          })
        )
      )
      const tick = target.querySelector<HTMLElement>("[data-counter-tick]")
      const to = Number(tick?.dataset.counterTick)
      if (tick && to > 0) {
        const start = performance.now() + 300
        const duration = 400
        const step = (now: number) => {
          const progress = Math.min(1, Math.max(0, (now - start) / duration))
          tick.textContent = pad(Math.round((1 - (1 - progress) ** 3) * to))
          if (progress < 1) frames.push(requestAnimationFrame(step))
        }
        tick.textContent = pad(0)
        frames.push(requestAnimationFrame(step))
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          reveal(entry.target as HTMLElement)
        })
      },
      { threshold: 0.3 }
    )
    node.querySelectorAll<HTMLElement>("[data-reveal-statement], [data-reveal-row]").forEach((target) => observer.observe(target))
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
      frames.forEach((frame) => cancelAnimationFrame(frame))
      node.querySelectorAll<HTMLElement>("[data-counter-tick]").forEach((tick) => {
        tick.textContent = pad(Number(tick.dataset.counterTick))
      })
    }
  }, [root, count])
}

export interface AboutNumberedRowsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutNumberedRowsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function AboutNumberedRows({
  locale = "en",
  heading,
  statement,
  closing,
  rows,
  empty,
  className,
  ...props
}: AboutNumberedRowsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const items = rows ?? copy.rows
  const close = closing === undefined ? copy.closing : closing
  const root = React.useRef<HTMLDivElement>(null)
  useReveal(root, items.length)

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-background-inverse px-4 py-8 text-foreground-inverse md:px-6 md:py-16 lg:p-24",
        className
      )}
      {...props}
    >
      <div
        ref={root}
        className="mx-auto flex w-full max-w-[1248px] flex-col gap-12 [@container(min-width:40rem)]:gap-16 [@container(min-width:64rem)]:gap-20"
      >
        <h2 id={headingId} className="sr-only">
          {heading ?? copy.heading}
        </h2>
        <p data-reveal-statement className="text-2xl [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
          {statement ?? copy.statement}
          {close ? <span className="mt-[1lh] block text-muted-foreground-inverse">{close}</span> : null}
        </p>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground-inverse">{empty ?? copy.empty}</p>
        ) : (
          <ul className="flex flex-col">
            {items.map((row, index) => {
              const counter = `${pad(index + 1)} / ${pad(items.length)}`
              return (
                <li key={index} data-reveal-row>
                  <span data-hairline aria-hidden className="block h-px bg-muted-foreground-inverse" />
                  <div className="flex flex-col gap-4 pb-10 pt-6 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-10 [@container(min-width:40rem)]:pb-16 [@container(min-width:40rem)]:pt-8 [@container(min-width:64rem)]:gap-16">
                    <h3
                      data-row-part
                      className="min-w-0 flex-1 text-2xl text-foreground-inverse [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
                    >
                      {row.title}
                    </h3>
                    <div data-row-part className="flex gap-6 [@container(min-width:40rem)]:gap-10">
                      <p className="min-w-0 flex-1 text-sm text-muted-foreground-inverse [@container(min-width:40rem)]:w-[240px] [@container(min-width:40rem)]:flex-none [@container(min-width:64rem)]:w-[300px]">
                        {row.description}
                      </p>
                      <bdi dir="ltr" className="shrink-0 text-xs font-medium tabular-nums text-foreground-inverse">
                        <span className="sr-only">{counter}</span>
                        <span aria-hidden>
                          <span data-counter-tick={index + 1}>{pad(index + 1)}</span> / {pad(items.length)}
                        </span>
                      </bdi>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutNumberedRowsCopy = COPY
