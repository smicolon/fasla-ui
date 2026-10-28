"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `About` (46368:243915), Type=Mission Statement Hero.
 *
 * A centred mission statement. The headline is one wrapping line of text
 * runs with a small pill-shaped photo set between them ("We build [photo]
 * tools that make [photo] teamwork feel [photo] effortless."), then a
 * supporting paragraph (720px at most) and two buttons, solid then outline.
 *
 * Desktop sets the headline at 60px with 112×72 photo chips; Tablet at 48px
 * with 96×60 chips. Mobile uses Figma's 4XL style, which its responsive
 * size variable resolves to 24px there, on the 4XL line height (44px, 60
 * in Arabic), with 64×40 chips; the paragraph drops to 16px and the buttons
 * stack at full width. The runs keep Figma's 16px gap between them (8px
 * between lines on Mobile).
 *
 * Figma draws the Arabic headline as explicit "Headline Line" rows only
 * because Figma has no right-to-left flow. Here it is the same single
 * flex-wrap line, so `dir="rtl"` on the page starts it on the right, first
 * run first, with no manual reversal. The photographs are never flipped.
 *
 * Motion: when the block scrolls into view the headline's words and chips
 * rise 12px and fade in, 40ms apart (25ms in a phone-width block), then the
 * paragraph and buttons. Each chip's photo grows by a quarter on hover, on
 * keyboard focus, and on tap (it is a toggle button). It grows with a
 * transform and sits above the words, so the chip keeps its place in the
 * line and nothing around it moves; a quarter keeps it inside the 16px gap
 * to the next word. Under prefers-reduced-motion the entrance is skipped and
 * the chips change size without a transition.
 *
 * Mobile first, and sized by the block's own width: the section is a query
 * container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * follows the window, since an element can't query itself.
 */

export interface AboutMissionStatementHeroAction {
  label: React.ReactNode
  href: string
}

export interface AboutMissionStatementHeroPhoto {
  src: string
  /** Describes the photo. It also names the chip's toggle button. */
  alt: string
}

export interface AboutMissionStatementHeroCopy {
  /**
   * The headline, an `h2`, as text runs. A photo chip sits between each run
   * and the next, so four runs take the three chips. Runs past the fourth
   * follow the last chip without one.
   */
  headline: string[]
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: AboutMissionStatementHeroAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: AboutMissionStatementHeroAction | null
  /** Names a chip's toggle button when its photo has no `alt`. */
  expandLabel: string
  /** Shown under the headline when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutMissionStatementHeroCopy> = {
  en: {
    headline: ["We build", "tools that make", "teamwork feel", "effortless."],
    description: "Since 2019, we've helped 8,000+ teams turn scattered work into clear, calm progress.",
    primaryAction: { label: "Join the team", href: "#careers" },
    secondaryAction: { label: "Read our story", href: "#story" },
    expandLabel: "Enlarge photo",
    empty: "No photos yet.",
  },
  ar: {
    headline: ["نبني", "أدوات تجعل", "العمل الجماعي", "سهلًا بلا جهد."],
    description: "منذ عام 2019، ساعدنا أكثر من 8,000 فريق على تحويل العمل المتفرق إلى تقدّم واضح وهادئ.",
    primaryAction: { label: "انضم إلى الفريق", href: "#careers" },
    secondaryAction: { label: "اقرأ قصتنا", href: "#story" },
    expandLabel: "تكبير الصورة",
    empty: "لا توجد صور بعد.",
  },
}

const CHIPS = 3

/**
 * The chip holds its size at rest in the line, per breakpoint. A pointer that
 * can't hover (touch) gets the pressed state only, so a tap never leaves a
 * chip stuck open. `z-10` lifts an open chip over its neighbours.
 */
const CHIP = cn(
  "group relative inline-flex shrink-0 rounded-full align-middle [outline:none]",
  "h-10 w-16 [@container(min-width:40rem)]:h-[60px] [@container(min-width:40rem)]:w-24 [@container(min-width:64rem)]:h-[72px] [@container(min-width:64rem)]:w-28",
  "aria-pressed:z-10 focus-visible:z-10 hover:[@media(pointer:fine)]:z-10"
)

/**
 * The photo, a layer over the chip. It grows with a transform, so the line
 * never reflows, and carries the focus ring so the ring grows with it.
 */
const CHIP_PHOTO = cn(
  "absolute inset-0 overflow-hidden rounded-full bg-muted",
  "group-aria-pressed:scale-125 group-focus-visible:scale-125 group-hover:[@media(pointer:fine)]:scale-125",
  "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
  "group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring"
)

/**
 * Figma's motion: words rise 12px and fade in, 40ms apart (25ms in a
 * phone-width block), the paragraph and buttons last. Runs once, when the
 * block scrolls into view; skipped under prefers-reduced-motion, so the
 * content is in its final state before and without it.
 */
function playEntrance(node: HTMLElement): Animation[] {
  const ease = "cubic-bezier(0, 0, 0.2, 1)"
  const step = node.clientWidth < 640 ? 25 : 40
  const parts = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]"))
  return parts.map((part, index) =>
    part.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
      duration: 400,
      delay: index * step,
      easing: ease,
      fill: "backwards",
    })
  )
}

function useInViewEntrance(root: React.RefObject<HTMLElement | null>, play: (node: HTMLElement) => Animation[]) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        animations = play(node)
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root, play])
}

export interface AboutMissionStatementHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutMissionStatementHeroCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The three chip photos, in Figma's order: after the first run, after the
   * second, after the third. Photos past the third are not shown. None by
   * default: `muted` placeholder chips. An empty list drops the chips and
   * shows the `empty` line under the headline.
   * @default none: `muted` placeholders
   */
  photos?: AboutMissionStatementHeroPhoto[]
}

export function AboutMissionStatementHero({
  locale = "en",
  headline,
  description,
  primaryAction,
  secondaryAction,
  expandLabel,
  empty,
  photos,
  className,
  ...props
}: AboutMissionStatementHeroProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const [pressed, setPressed] = React.useState<number | null>(null)
  useInViewEntrance(rootRef, playEntrance)

  const runs = headline ?? copy.headline
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const noPhotos = photos !== undefined && photos.length === 0

  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-10 text-center">
        <div className="flex w-full flex-col items-center gap-4">
          {/* The chips are buttons inside the heading, so the heading is named by its words alone. */}
          <h2
            id={headingId}
            aria-label={runs.join(" ")}
            className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-2xl font-semibold leading-[calc(var(--leading-4xl)*2.25rem)] text-foreground [@container(min-width:40rem)]:gap-y-4 [@container(min-width:40rem)]:text-5xl [@container(min-width:64rem)]:text-6xl"
          >
            {runs.map((run, runIndex) => {
              const chip = runIndex < Math.min(CHIPS, runs.length - 1) && !noPhotos
              const photo = photos?.[runIndex]
              return (
                <React.Fragment key={runIndex}>
                  <span>
                    {run.split(" ").map((word, wordIndex) => (
                      <React.Fragment key={wordIndex}>
                        {wordIndex > 0 ? " " : null}
                        <span data-reveal className="inline-block">
                          {word}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                  {chip ? (
                    <button
                      type="button"
                      data-reveal
                      aria-pressed={pressed === runIndex}
                      aria-label={photo?.alt || expandLabel || copy.expandLabel}
                      onClick={() => setPressed((current) => (current === runIndex ? null : runIndex))}
                      className={CHIP}
                    >
                      <span className={CHIP_PHOTO}>
                        {photo ? (
                          <img
                            src={photo.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 size-full object-cover"
                          />
                        ) : null}
                      </span>
                    </button>
                  ) : null}
                </React.Fragment>
              )
            })}
          </h2>
          {noPhotos ? <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p> : null}
        </div>

        <p data-reveal className="max-w-[720px] text-base text-muted-foreground [@container(min-width:40rem)]:text-lg">
          {description ?? copy.description}
        </p>

        <div
          data-reveal
          className="flex w-full flex-col gap-3 [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:justify-center"
        >
          <a href={primary.href} className={buttonVariants()}>
            {primary.label}
          </a>
          {secondary ? (
            <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutMissionStatementHeroCopy = COPY
