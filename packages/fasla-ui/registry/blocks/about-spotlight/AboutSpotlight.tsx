"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Spotlight.
 *
 * A lamp hangs from the top of an inverted section and throws a cone of
 * light down to its bottom edge. The lamp is a 72px cord, a triangular shade
 * and a round bulb, centred. The cone is a triangle 1600px wide at its base,
 * its apex in the bulb (126px from the top) and its base on the section's
 * bottom edge, centred, so it runs past both sides of anything narrower and
 * is clipped there. It is filled with the page's background colour, so the
 * copy inside it uses the ordinary foreground colours.
 *
 * Inside the cone, centred: a short heading over a paragraph (560px wide on
 * Desktop, 440 on Tablet, 280 on Mobile), then a row of section links, the
 * current one in the foreground colour and the rest muted. A huge closing
 * word sits on the bottom edge and is cut off there: only the top 78% of
 * its line shows (9XL on Desktop, 6XL on Tablet, 4XL on Mobile).
 *
 * The section's padding is Figma's: 384px above the copy on Desktop, 320 on
 * Tablet and 256 on Mobile, room for the lamp, and none below, so the word
 * meets the edge. The sides follow the house padding.
 *
 * In Arabic nothing mirrors: the lamp and the cone are symmetric. Cairo sits
 * lower in its line than Geist, so the clip shows 85% of the Arabic line
 * rather than 78%, as Figma's RTL variants do; the shorter cut would slice
 * through the letters.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutSpotlightLink {
  label: React.ReactNode
  href: string
}

export interface AboutSpotlightCopy {
  /** The short heading at the top of the cone, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under it. */
  description: React.ReactNode
  /** The section links under the copy. The row is hidden when empty. */
  links: AboutSpotlightLink[]
  /** The links row's accessible name, read by screen readers. */
  linksLabel: string
  /** The huge word cut off by the bottom edge. Hidden when empty. */
  closingWord: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutSpotlightCopy> = {
  en: {
    heading: "CRAFTING SINCE 2016",
    description:
      "For ten years Fasla has designed and built software for schools, clinics and small public offices. We stay with every project from the first sketch to the last release, and we answer for the outcome, not only the files.",
    links: [
      { label: "STORY", href: "#story" },
      { label: "WORK", href: "#work" },
      { label: "APPROACH", href: "#approach" },
      { label: "TEAM", href: "#team" },
      { label: "CONTACT", href: "#contact" },
    ],
    linksLabel: "About sections",
    closingWord: "CRAFTSMANSHIP",
  },
  ar: {
    heading: "نتقن الصنعة منذ 2016",
    description:
      "منذ عشر سنوات تصمم فاصلة البرمجيات وتبنيها للمدارس والعيادات والمكاتب الحكومية الصغيرة. نرافق كل مشروع من الرسم الأول حتى الإصدار الأخير، ونتحمل مسؤولية النتيجة لا الملفات وحدها.",
    links: [
      { label: "القصة", href: "#story" },
      { label: "أعمالنا", href: "#work" },
      { label: "منهجنا", href: "#approach" },
      { label: "الفريق", href: "#team" },
      { label: "تواصل", href: "#contact" },
    ],
    linksLabel: "أقسام صفحة من نحن",
    closingWord: "الإتقان",
  },
}

/** A triangle with its apex at the top centre: the shade and the cone. */
const TRIANGLE = "[clip-path:polygon(50%_0,100%_100%,0_100%)]"

/**
 * Figma's motion: when the section scrolls into view the bulb fades in over
 * 200ms, then the cone grows down from it (scaleY 0 to 1 from the apex,
 * 600ms ease-out; 400ms on a narrow block, where the cone fills most of the
 * frame). The copy and the links fade in as the cone reaches them, and the
 * closing word slides up 24px last. Runs once; skipped under
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
      const bulbTime = 200
      const grow = node.clientWidth < 640 ? 400 : 600
      const bulb = node.querySelector<HTMLElement>("[data-reveal-bulb]")
      if (bulb)
        animations.push(bulb.animate([{ opacity: 0 }, { opacity: 1 }], { duration: bulbTime, easing: ease, fill: "backwards" }))
      const cone = node.querySelector<HTMLElement>("[data-reveal-cone]")
      if (!cone) return
      const coneBox = cone.getBoundingClientRect()
      animations.push(
        cone.animate([{ transform: "scaleY(0)" }, { transform: "none" }], {
          duration: grow,
          delay: bulbTime,
          easing: ease,
          fill: "backwards",
        })
      )
      // Each part fades in when the cone's edge reaches its top.
      node.querySelectorAll<HTMLElement>("[data-reveal-part]").forEach((part) => {
        const reach = Math.min(1, Math.max(0, (part.getBoundingClientRect().top - coneBox.top) / coneBox.height))
        animations.push(
          part.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 300,
            delay: bulbTime + grow * reach,
            easing: ease,
            fill: "backwards",
          })
        )
      })
      const word = node.querySelector<HTMLElement>("[data-reveal-word]")
      if (word)
        animations.push(
          word.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], {
            duration: 500,
            delay: bulbTime + grow,
            easing: ease,
            fill: "backwards",
          })
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

export interface AboutSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Which link is the current one, by its place in `links`: it is drawn in
   * the foreground colour and marked `aria-current`. Pass -1 for none.
   * @default 0
   */
  current?: number
}

export function AboutSpotlight({
  locale = "en",
  heading,
  description,
  links,
  linksLabel,
  closingWord,
  current = 0,
  className,
  ...props
}: AboutSpotlightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const sectionRef = React.useRef<HTMLElement>(null)
  useReveal(sectionRef)
  const linkList = links ?? copy.links
  const word = closingWord ?? copy.closingWord

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] relative overflow-hidden bg-background-inverse px-4 pt-64 md:px-6 md:pt-80 lg:px-24 lg:pt-96",
        className
      )}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 top-[126px] flex justify-center">
          <div data-reveal-cone className={cn("h-full w-[1600px] shrink-0 origin-top bg-background", TRIANGLE)} />
        </div>
        <div className="absolute inset-x-0 top-0 mx-auto h-[72px] w-[2px] bg-muted-foreground-inverse" />
        <div className={cn("absolute inset-x-0 top-16 mx-auto h-14 w-[120px] bg-muted-foreground-inverse", TRIANGLE)} />
        <div data-reveal-bulb className="absolute inset-x-0 top-[108px] mx-auto size-7 rounded-full bg-background" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1248px] flex-col items-center gap-10 [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:gap-16">
        <div className="flex w-full max-w-[280px] flex-col gap-6 text-center [@container(min-width:40rem)]:max-w-[440px] [@container(min-width:64rem)]:max-w-[560px]">
          <h2 id={headingId} data-reveal-part className="text-base font-semibold text-foreground [@container(min-width:40rem)]:text-lg">
            {heading ?? copy.heading}
          </h2>
          <p data-reveal-part className="text-base text-foreground">
            {description ?? copy.description}
          </p>
        </div>

        {linkList.length > 0 ? (
          <nav aria-label={linksLabel ?? copy.linksLabel} data-reveal-part>
            <ul className="flex flex-wrap justify-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-6">
              {linkList.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    aria-current={index === current ? "true" : undefined}
                    className={cn(
                      "-my-2 inline-block rounded-sm py-2 text-xs font-medium transition-colors motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      index === current ? "text-foreground" : "text-muted-foreground hover:text-foreground focus-visible:text-foreground"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {word ? (
          <div className="flex h-[0.78lh] w-full justify-center overflow-hidden text-4xl font-semibold [@container(min-width:40rem)]:text-6xl [@container(min-width:64rem)]:text-9xl [&:dir(rtl)]:h-[0.85lh]">
            <p data-reveal-word className="whitespace-nowrap text-muted-foreground">
              {word}
            </p>
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
export const aboutSpotlightCopy = COPY
