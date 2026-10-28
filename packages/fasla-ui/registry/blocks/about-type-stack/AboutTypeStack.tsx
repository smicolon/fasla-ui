"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Type Stack.
 *
 * A statement set as three huge lines on the muted surface, ruled apart by
 * two hairlines: "We are", centred, above the first rule; then a row holding
 * a short intro paragraph at the start and "quiet" at the end; a second
 * rule; then "makers." at the start. The second and third lines are in the
 * accent colour. A footer row closes it: a greeting in the accent colour at
 * the start and a page counter at the end. The lines are 9XL on Desktop, 7XL
 * on Tablet and 5XL on Mobile, where the intro moves above the second word.
 *
 * The three lines read as one heading. They are drawn for the eye and hidden
 * from screen readers, which read the same words as one `h2` instead.
 *
 * In Arabic the lines read «نحن», «صنّاع», «الهدوء.»: the intro sits at
 * the right of its row and the second word at the left, as Figma's RTL
 * variants draw it. The counter stays left to right.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutTypeStackCopy {
  /** The first line, centred above the first rule. */
  firstLine: React.ReactNode
  /** The second line, in the accent colour, at the end of the intro's row. */
  secondLine: React.ReactNode
  /** The third line, in the accent colour, under the second rule. */
  thirdLine: React.ReactNode
  /** The short paragraph beside the second line. */
  intro: React.ReactNode
  /** The accent word at the start of the footer. Hidden when empty. */
  greeting: React.ReactNode
  /** The counter at the end of the footer, always left to right. Hidden when empty. */
  counter: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutTypeStackCopy> = {
  en: {
    firstLine: "We are",
    secondLine: "quiet",
    thirdLine: "makers.",
    intro: "We plan, design and ship careful digital products for teams who value calm over noise.",
    greeting: "(Hello)",
    counter: "01 / 02",
  },
  ar: {
    firstLine: "نحن",
    secondLine: "صنّاع",
    thirdLine: "الهدوء.",
    intro: "نخطط ونصمم ونطلق منتجات رقمية متأنية لفرق تفضّل الهدوء على الضجيج.",
    greeting: "(مرحبًا)",
    counter: "01 / 02",
  },
}

const LINE = "text-5xl font-medium [@container(min-width:40rem)]:text-7xl [@container(min-width:64rem)]:text-9xl"
const RULE = "h-px bg-muted-foreground origin-left [&:dir(rtl)]:origin-right"

/**
 * Figma's motion: when the block scrolls into view the hairlines draw across
 * from the start side (300ms), then each line slides up from beneath its
 * rule, clipped as it rises (500ms ease-out, 150ms apart, top to bottom).
 * The intro and the footer fade in last. Runs once; skipped under
 * prefers-reduced-motion, which leaves everything in its final state.
 */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animations: Animation[] = []
    const reveal = () => {
      const ease = "cubic-bezier(0, 0, 0.2, 1)"
      const draw = 300
      const rise = 500
      const stagger = 150
      node.querySelectorAll<HTMLElement>("[data-reveal-rule]").forEach((rule) =>
        animations.push(rule.animate([{ transform: "scaleX(0)" }, { transform: "none" }], { duration: draw, easing: ease, fill: "backwards" }))
      )
      const lines = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-line]"))
      // The clip moves with the line, so its bottom edge stays where the
      // line's resting bottom edge is: the line rises out of its rule.
      lines.forEach((line, index) =>
        animations.push(
          line.animate(
            [
              { transform: "translateY(100%)", clipPath: "inset(-20% -20% 100% -20%)" },
              { transform: "none", clipPath: "inset(-20% -20% 0% -20%)" },
            ],
            { duration: rise, delay: draw + index * stagger, easing: ease, fill: "backwards" }
          )
        )
      )
      const last = draw + Math.max(0, lines.length - 1) * stagger + rise
      node.querySelectorAll<HTMLElement>("[data-reveal-fade]").forEach((part) =>
        animations.push(part.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: last, easing: ease, fill: "backwards" }))
      )
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        reveal()
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root])
}

export interface AboutTypeStackProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutTypeStackCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function AboutTypeStack({
  locale = "en",
  firstLine,
  secondLine,
  thirdLine,
  intro,
  greeting,
  counter,
  className,
  ...props
}: AboutTypeStackProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  useReveal(rootRef)
  const first = firstLine ?? copy.firstLine
  const second = secondLine ?? copy.secondLine
  const third = thirdLine ?? copy.thirdLine
  const hello = greeting ?? copy.greeting
  const count = counter ?? copy.counter

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-muted px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <h2 id={headingId} className="sr-only">
        {first} {second} {third}
      </h2>
      <div ref={rootRef} className="mx-auto flex w-full max-w-[1248px] flex-col">
        <div className="flex justify-center pb-4">
          <p aria-hidden="true" data-reveal-line className={cn(LINE, "text-foreground")}>
            {first}
          </p>
        </div>
        <div data-reveal-rule className={RULE} />
        <div className="flex flex-col gap-4 py-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
          <p
            data-reveal-fade
            className="text-base font-medium text-foreground [@container(min-width:40rem)]:max-w-[280px] [@container(min-width:64rem)]:max-w-[320px]"
          >
            {intro ?? copy.intro}
          </p>
          <p aria-hidden="true" data-reveal-line className={cn(LINE, "text-chart-1")}>
            {second}
          </p>
        </div>
        <div data-reveal-rule className={RULE} />
        <div className="flex pt-4">
          <p aria-hidden="true" data-reveal-line className={cn(LINE, "text-chart-1")}>
            {third}
          </p>
        </div>
        {hello || count ? (
          <div data-reveal-fade className="flex items-center justify-between gap-4 pt-10 text-sm">
            <p className="text-chart-1">{hello}</p>
            {count ? (
              <p className="font-medium text-foreground">
                <bdi dir="ltr">{count}</bdi>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutTypeStackCopy = COPY
