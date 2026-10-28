"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `About` (46368:243915), Type=Split Panel.
 *
 * One rounded card on the inverted surface, set on the page's background: a
 * tall photograph beside a story panel. The panel holds its copy at both
 * ends. At the top, a row of three tags over the headline, one word of which
 * is set in the softer inverse colour; at the foot, a lead sentence and a
 * smaller paragraph. On Desktop the card is 640px tall and the photo 560px
 * wide; the panel takes the rest.
 *
 * Tablet and Mobile stack the photo over the panel, 360px and 260px tall,
 * and the panel's two groups close up to a 40px (Tablet) or 32px (Mobile)
 * gap. The headline drops from 48px to 36 and 30, the lead from 24px to 20
 * and 18.
 *
 * The card is painted with the inverse tokens, the only way Fasla inverts a
 * surface: dark in Light, light in Dark. The theme-inverse registry item maps
 * them. A missing photo is a placeholder in the inverse muted colour, not
 * `muted`, which would show as a pale tile on the dark card.
 *
 * In Arabic the photo moves to the right and the panel to the left, as
 * Figma's RTL variants draw it, and the panel's text runs from the right.
 * The photograph is never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutSplitPanelPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutSplitPanelHeading {
  /** The words before the emphasised one. */
  before: React.ReactNode
  /** The emphasised word, in the softer inverse colour. */
  emphasis: React.ReactNode
  /** The words after it. */
  after: React.ReactNode
}

export interface AboutSplitPanelCopy {
  /** The small tags above the headline. The row is hidden when empty. */
  tags: React.ReactNode[]
  /** The headline, an `h2`, in three parts around the emphasised word. */
  heading: AboutSplitPanelHeading
  /** The large sentence at the foot of the panel. */
  lead: React.ReactNode
  /** The smaller paragraph under it. */
  body: React.ReactNode
  /** Shown in the photo's place when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutSplitPanelCopy> = {
  en: {
    tags: ["Since 2016", "Calm by design", "Built to last"],
    heading: { before: "We build ", emphasis: "quiet", after: " tools for busy teams" },
    lead: "Fasla is a small product studio where careful design meets dependable engineering, making software that stays out of the way.",
    body: "We work with a handful of teams at a time. We listen first, plan in the open and ship in small steps, so every release is easy to understand and easy to trust.",
    empty: "No photo yet.",
  },
  ar: {
    tags: ["منذ 2016", "هادئ بطبيعته", "مصمَّم ليدوم"],
    heading: { before: "نصنع أدوات ", emphasis: "هادئة", after: " للفرق المشغولة" },
    lead: "فاصلة استوديو منتجات صغير يلتقي فيه التصميم المتأني بالهندسة الموثوقة، لنصنع برمجيات لا تعترض طريقك.",
    body: "نعمل مع عدد قليل من الفرق في كل مرة. نصغي أولًا، ونخطط بشفافية، ونطلق العمل على خطوات صغيرة، ليبقى كل إصدار سهل الفهم وجديرًا بالثقة.",
    empty: "لا توجد صورة بعد.",
  },
}

/**
 * Figma's motion: when the card scrolls into view the photo settles from
 * 1.06 to 1 over 900ms, while the tags, headline and paragraphs rise 12px,
 * 60ms apart, top to bottom. The emphasised word dims to its colour last,
 * over 300ms. Runs once; skipped under prefers-reduced-motion, which leaves
 * everything in its final state.
 */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animations: Animation[] = []
    const reveal = () => {
      const ease = "cubic-bezier(0, 0, 0.2, 1)"
      const photo = node.querySelector<HTMLElement>("[data-reveal-photo]")
      if (photo)
        animations.push(
          photo.animate([{ transform: "scale(1.06)" }, { transform: "none" }], { duration: 900, easing: ease, fill: "backwards" })
        )
      const parts = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-part]"))
      parts.forEach((part, index) =>
        animations.push(
          part.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
            duration: 400,
            delay: index * 60,
            easing: ease,
            fill: "backwards",
          })
        )
      )
      const emphasis = node.querySelector<HTMLElement>("[data-reveal-emphasis]")
      const heading = emphasis?.parentElement
      if (emphasis && heading) {
        const from = getComputedStyle(heading).color
        const to = getComputedStyle(emphasis).color
        animations.push(
          emphasis.animate([{ color: from }, { color: to }], {
            duration: 300,
            delay: (parts.length - 1) * 60 + 400,
            easing: ease,
            fill: "backwards",
          })
        )
      }
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

export interface AboutSplitPanelProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutSplitPanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo, Figma's one slot: the tall frame at the card's start (above
   * the panel on Tablet and Mobile). Photos past the first are not shown.
   * None by default: a placeholder in the inverse muted colour. An empty
   * list shows the `empty` line in the frame instead.
   * @default none: a placeholder
   */
  photos?: AboutSplitPanelPhoto[]
}

export function AboutSplitPanel({
  locale = "en",
  tags,
  heading,
  lead,
  body,
  empty,
  photos,
  className,
  ...props
}: AboutSplitPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  useReveal(cardRef)
  const tagList = tags ?? copy.tags
  const title = heading ?? copy.heading
  const photo = photos?.[0]

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div
        ref={cardRef}
        className="mx-auto flex w-full max-w-[1248px] flex-col overflow-hidden rounded-2xl bg-background-inverse [@container(min-width:64rem)]:min-h-[640px] [@container(min-width:64rem)]:flex-row"
      >
        <div className="relative h-[260px] shrink-0 overflow-hidden bg-muted-foreground-inverse/20 [@container(min-width:40rem)]:h-[360px] [@container(min-width:64rem)]:h-auto [@container(min-width:64rem)]:w-[560px]">
          {photos && photos.length === 0 ? (
            <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground-inverse">
              {empty ?? copy.empty}
            </p>
          ) : (
            <div data-reveal-photo className="absolute inset-0">
              {photo ? (
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="size-full object-cover" />
              ) : null}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8 p-6 [@container(min-width:40rem)]:gap-10 [@container(min-width:40rem)]:p-10 [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:p-14">
          <div className="flex flex-col gap-6">
            {tagList.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {tagList.map((tag, index) => (
                  <li key={index} data-reveal-part>
                    <Badge variant="solid" tone="secondary" size="sm" radius="standard">
                      {tag}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            <h2
              id={headingId}
              data-reveal-part
              className="text-3xl font-semibold text-foreground-inverse [@container(min-width:40rem)]:text-4xl [@container(min-width:64rem)]:text-5xl"
            >
              {title.before}
              <span data-reveal-emphasis className="text-muted-foreground-inverse">
                {title.emphasis}
              </span>
              {title.after}
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p data-reveal-part className="text-lg text-foreground-inverse [@container(min-width:40rem)]:text-xl [@container(min-width:64rem)]:text-2xl">
              {lead ?? copy.lead}
            </p>
            <p data-reveal-part className="text-sm text-muted-foreground-inverse">
              {body ?? copy.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutSplitPanelCopy = COPY
