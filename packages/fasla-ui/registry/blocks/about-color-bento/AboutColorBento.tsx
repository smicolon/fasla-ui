"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Color Bento.
 *
 * Three soft-tinted tiles with the `3xl` radius and a row of shapes. A
 * 440px start column holds the intro tile (`info` at 10%, 220px tall) over
 * the shapes row; the belief tile (`warning` at 20%) fills the rest of the
 * row, its big sentence at the top and the muted supporting text (held to
 * 520px) at the bottom. The mission tile (`success` at 10%) runs the full
 * width under them with a 60px sentence.
 *
 * The shapes are spread across the column: a cross of two rounded bars
 * (`chart-2`), a square with a round hole through it (`chart-1`, the hole on
 * `background`) and a circle (`chart-4`), 136px each.
 *
 * Tablet and Mobile stack the tiles: intro, shapes, belief, mission. Tablet
 * sets the belief at 24px and the mission at 48px; Mobile at 20px and 36px,
 * with the tiles' padding at 24px and the shapes at 96px.
 *
 * In Arabic the start column moves to the right and the shapes run circle,
 * square, cross from the left, all through flex order.
 *
 * There is no visible heading in Figma, so the section is named by a
 * visually hidden `h2`.
 *
 * Motion: once, when the block scrolls into view, the tiles fade in from a
 * 0.96 scale 100ms apart in reading order (the mission tile last); the
 * three shapes then drop in with an exponential ease-out, and the cross turns 45° into
 * place (the other way in Arabic). Under reduced motion nothing moves.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutColorBentoCopy {
  /** The section's name, a visually hidden `h2`. */
  heading: React.ReactNode
  /** The intro tile's paragraph. */
  intro: React.ReactNode
  /** The belief tile's big sentence. */
  belief: React.ReactNode
  /** The belief tile's supporting text. Hidden when empty. */
  supporting: React.ReactNode
  /** The mission tile's sentence. */
  mission: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutColorBentoCopy> = {
  en: {
    heading: "About Fasla",
    intro:
      "Fasla is a small studio that designs and builds every product in-house, from the first sketch to the final release.",
    belief: "We believe good software should be useful and kind: at work, at school and at home.",
    supporting:
      "That future will not arrive on its own. It takes patient teams, honest testing and the humility to start again when something does not help.",
    mission: "We exist to make everyday work feel lighter, one careful tool at a time.",
  },
  ar: {
    heading: "عن فاصلة",
    intro: "فاصلة استوديو صغير يصمم كل منتجاته ويبنيها بنفسه، من الرسم الأول حتى الإصدار النهائي.",
    belief: "نؤمن بأن البرمجيات الجيدة يجب أن تكون نافعة ولطيفة: في العمل وفي المدرسة وفي البيت.",
    supporting:
      "هذا المستقبل لن يأتي وحده. إنه يحتاج إلى فرق صبورة واختبارات صادقة وتواضع يسمح بالبدء من جديد حين لا يجدي شيء نفعًا.",
    mission: "وُجدنا لنجعل العمل اليومي أخف، بأداة متقنة تلو الأخرى.",
  },
}

/** A shape's box: 96px on a phone, 136px from Tablet up. */
const SHAPE = "size-24 shrink-0 [@container(min-width:40rem)]:size-[136px]"
/** One bar of the cross: 106 × 26 on a phone, 150 × 36 from Tablet up, a pill. */
const BAR = "col-start-1 row-start-1 h-[26px] w-[106px] rounded-full bg-chart-2 [@container(min-width:40rem)]:h-9 [@container(min-width:40rem)]:w-[150px]"

/**
 * Once, when the block scrolls into view: the `[data-reveal-tile]` tiles
 * scale in from 0.96 and fade, 100ms apart; the `[data-reveal-shape]` shapes
 * then drop in with an exponential ease-out, and the `[data-reveal-cross]` turns 45°
 * into place, the other way in a right-to-left page.
 */
function useReveal(scope: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = scope.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const ease = "cubic-bezier(0, 0, 0.2, 1)"
        const settle = "cubic-bezier(0.16, 1, 0.3, 1)"
        const rtl = getComputedStyle(node).direction === "rtl"
        const tiles = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-tile]"))
        tiles.forEach((tile, index) =>
          animations.push(
            tile.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }], {
              duration: 500,
              delay: index * 100,
              easing: ease,
              fill: "backwards",
            })
          )
        )
        // The shapes follow the intro tile, the first.
        const after = 200
        Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-shape]")).forEach((shape, index) =>
          animations.push(
            shape.animate([{ opacity: 0, transform: "translateY(-24px) scale(0.8)" }, { opacity: 1, transform: "none" }], {
              duration: 600,
              delay: after + index * 100,
              easing: settle,
              fill: "backwards",
            })
          )
        )
        const cross = node.querySelector<HTMLElement>("[data-reveal-cross]")
        if (cross)
          animations.push(
            cross.animate([{ transform: `rotate(${rtl ? 45 : -45}deg)` }, { transform: "none" }], {
              duration: 700,
              delay: after,
              easing: settle,
              fill: "backwards",
            })
          )
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [scope])
}

export interface AboutColorBentoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutColorBentoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function AboutColorBento({
  locale = "en",
  heading,
  intro,
  belief,
  supporting,
  mission,
  className,
  ...props
}: AboutColorBentoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const root = React.useRef<HTMLDivElement>(null)
  const supportingText = supporting ?? copy.supporting

  useReveal(root)

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <h2 id={headingId} className="sr-only">
        {heading ?? copy.heading}
      </h2>
      <div ref={root} className="mx-auto flex w-full max-w-[1248px] flex-col gap-6">
        <div className="flex flex-col gap-6 [@container(min-width:64rem)]:flex-row">
          <div className="flex flex-col gap-6 [@container(min-width:64rem)]:w-[440px] [@container(min-width:64rem)]:shrink-0">
            <div
              data-reveal-tile=""
              className="rounded-3xl bg-info/10 p-6 [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:h-[220px]"
            >
              <p className="text-base text-foreground">{intro ?? copy.intro}</p>
            </div>
            <div aria-hidden="true" className="flex items-center justify-between">
              <div data-reveal-shape="" className={SHAPE}>
                <div data-reveal-cross="" className="grid size-full place-items-center">
                  <span className={cn(BAR, "rotate-45")} />
                  <span className={cn(BAR, "-rotate-45")} />
                </div>
              </div>
              <div
                data-reveal-shape=""
                className={cn(SHAPE, "flex items-center justify-center rounded-xl bg-chart-1")}
              >
                <span className="size-[34px] rounded-full bg-background [@container(min-width:40rem)]:size-12" />
              </div>
              <div data-reveal-shape="" className={cn(SHAPE, "rounded-full bg-chart-4")} />
            </div>
          </div>

          <div
            data-reveal-tile=""
            className="flex min-w-0 flex-1 flex-col justify-between gap-8 rounded-3xl bg-warning/20 p-6 [@container(min-width:40rem)]:gap-10 [@container(min-width:40rem)]:p-10"
          >
            <p className="text-xl font-medium text-foreground [@container(min-width:40rem)]:text-2xl [@container(min-width:64rem)]:text-3xl">
              {belief ?? copy.belief}
            </p>
            {supportingText ? (
              <p className="text-base text-muted-foreground [@container(min-width:64rem)]:max-w-[520px]">
                {supportingText}
              </p>
            ) : null}
          </div>
        </div>

        <div
          data-reveal-tile=""
          className="rounded-3xl bg-success/10 p-6 [@container(min-width:40rem)]:p-10 [@container(min-width:64rem)]:p-12"
        >
          <p className="text-4xl font-medium text-foreground [@container(min-width:40rem)]:text-5xl [@container(min-width:64rem)]:text-6xl">
            {mission ?? copy.mission}
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutColorBentoCopy = COPY
