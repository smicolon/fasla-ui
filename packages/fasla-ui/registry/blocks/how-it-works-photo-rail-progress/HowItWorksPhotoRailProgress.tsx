"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "../../ui/carousel/carousel"
import { Progress } from "../../ui/progress/progress"
import {
  enter,
  HowItWorksHeader,
  HowItWorksImage,
  HowItWorksLtr,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Photo Rail + Progress.
 *
 * A header (an eyebrow, the heading) with two round arrow buttons at its end,
 * a rail of four step cards (a 380 × 264 photo with a number badge, a title and
 * a line), and a progress bar under it with a "01 / 04" count. The rail is the
 * Carousel atom: a real scroll-snap scroller, so touch, trackpad and the arrow
 * keys all move it. The rail runs out to the edge of the block, so the next card
 * peeks past the content, which is the only cue that it scrolls.
 *
 * Desktop shows about three and a third cards (380px), Tablet 300px cards and
 * Mobile 260px, the arrows moving under the heading on Tablet and going away on
 * Mobile, where swiping is the control. The progress bar and the count follow
 * where the rail is scrolled, continuously, from the first card to the last.
 * The page's `dir` mirrors the rail, the bar (it fills from the start) and the
 * arrows, whose glyphs turn with it, so Next is on the left in Arabic.
 *
 * Motion: the cards rise 12px and fade in once, 90ms apart, when the block comes
 * into view. The browser's own scroll-snap moves the rail: Figma's card has a
 * spring with momentum, and it dims cards outside the view to 55% and lifts
 * them as they enter; the code has neither, so cards stay full strength.
 * Under reduced motion the block is its finished state and the rail jumps.
 *
 * Content limits: the heading up to 46 characters. A card's title up to 18
 * characters and its line up to 56.
 */

export interface HowItWorksRailStep {
  /** Keys the card. */
  id: string
  title: React.ReactNode
  description: React.ReactNode
}

export interface HowItWorksPhotoRailProgressCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The cards, in order. The numbers are drawn from 01. */
  steps: HowItWorksRailStep[]
  /** The rail's accessible name, such as "Steps". */
  railLabel: string
  /** The two arrows' accessible names. */
  previousLabel: string
  nextLabel: string
  /** The progress bar's accessible name. */
  progressLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksPhotoRailProgressCopy> = {
  en: {
    eyebrow: "Step by step",
    heading: "Walk the whole process, one step at a time",
    steps: [
      { id: "align", title: "Align", description: "One room, one hour, every assumption written down." },
      { id: "cluster", title: "Cluster", description: "Research notes grouped until the themes appear." },
      { id: "design", title: "Design", description: "Screens built in the open on a shared board." },
      { id: "build", title: "Build", description: "Handover straight into the codebase." },
    ],
    railLabel: "Steps",
    previousLabel: "Previous step",
    nextLabel: "Next step",
    progressLabel: "Progress through the steps",
  },
  ar: {
    eyebrow: "خطوة بخطوة",
    heading: "اسلك العملية كاملة، خطوة بعد خطوة",
    steps: [
      { id: "align", title: "المواءمة", description: "غرفة واحدة، ساعة واحدة، وكل افتراض مكتوب." },
      { id: "cluster", title: "التجميع", description: "ملاحظات البحث مجمّعة حتى تظهر المحاور." },
      { id: "design", title: "التصميم", description: "شاشات تُبنى على المكشوف على لوح مشترك." },
      { id: "build", title: "البناء", description: "تسليم مباشر إلى قاعدة الكود." },
    ],
    railLabel: "الخطوات",
    previousLabel: "الخطوة السابقة",
    nextLabel: "الخطوة التالية",
    progressLabel: "التقدّم عبر الخطوات",
  },
}

/** The two arrows. They sit inside the Carousel, which owns where the rail is. */
function RailArrows({ previousLabel, nextLabel, className }: { previousLabel: string; nextLabel: string; className?: string }) {
  const { activeIndex, lastIndex, scrollTo } = useCarousel()
  const arrow = "[&:dir(rtl)]:-scale-x-100"
  return (
    <div className={className}>
      <Button type="button" variant="outline" tone="secondary" size="icon-md" radius="rounded" aria-label={previousLabel} disabled={activeIndex <= 0} onClick={() => scrollTo(activeIndex - 1)}>
        <ArrowLeft aria-hidden className={arrow} />
      </Button>
      <Button type="button" variant="outline" tone="secondary" size="icon-md" radius="rounded" aria-label={nextLabel} disabled={activeIndex >= lastIndex} onClick={() => scrollTo(activeIndex + 1)}>
        <ArrowRight aria-hidden className={arrow} />
      </Button>
    </div>
  )
}

/**
 * How far the rail is scrolled, from 0 at the first card to 1 at the last, read
 * from the scroller itself so a swipe, a key press and a button all move it. In
 * Arabic the scroll position runs negative, so its size is what counts.
 */
function useRailFraction(track: React.RefObject<HTMLDivElement | null>) {
  const [fraction, setFraction] = React.useState(0)
  React.useEffect(() => {
    const node = track.current
    if (!node) return
    let frame = 0
    const read = () => {
      const max = node.scrollWidth - node.clientWidth
      setFraction(max > 0 ? Math.min(1, Math.abs(node.scrollLeft) / max) : 0)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }
    read()
    node.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      node.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [track])
  return fraction
}

export interface HowItWorksPhotoRailProgressProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksPhotoRailProgressCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * One photo per card, in order. A card without one shows a `muted` box.
   * @default none: `muted` placeholders
   */
  photos?: HowItWorksPhoto[]
}

export function HowItWorksPhotoRailProgress({ locale = "en", eyebrow, heading, steps, railLabel, previousLabel, nextLabel, progressLabel, photos, className, ...props }: HowItWorksPhotoRailProgressProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const list = steps ?? copy.steps
  const fraction = useRailFraction(trackRef)
  const count = list.length
  const current = Math.round(1 + fraction * (count - 1))
  const value = ((1 + fraction * (count - 1)) / count) * 100

  useRevealOnEnter(rootRef, (node) =>
    revealTargets(node, "card").map((card, index) =>
      enter(card, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 450, delay: index * 90 })
    )
  )

  const arrows = (
    <RailArrows previousLabel={previousLabel ?? copy.previousLabel} nextLabel={nextLabel ?? copy.nextLabel} className="hidden shrink-0 gap-2 [@container(min-width:40rem)]:flex" />
  )
  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <Carousel aria-label={railLabel ?? copy.railLabel} className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-24">
          <HowItWorksHeader
            headingId={headingId}
            eyebrow={eyebrow ?? copy.eyebrow}
            heading={heading ?? copy.heading}
            headingClassName="text-2xl [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
          />
          {arrows}
        </div>

        <CarouselContent
          ref={trackRef}
          className="-me-8 gap-6 pe-8 md:-me-16 md:pe-16 lg:-me-24 lg:pe-24 [scroll-padding-inline-end:0]"
        >
          {list.map((step, index) => (
            <CarouselItem key={step.id} data-reveal="card" className="flex basis-[260px] flex-col gap-4 [@container(min-width:40rem)]:basis-[300px] [@container(min-width:64rem)]:basis-[380px]">
              <div className="relative h-[220px] overflow-hidden rounded-[10px] bg-muted [@container(min-width:64rem)]:h-[264px]">
                <HowItWorksImage photo={photos?.[index]} />
                <span className="absolute start-3 top-3">
                  <Badge variant="solid" tone="primary" size="md" radius="rounded">
                    <HowItWorksLtr>{String(index + 1).padStart(2, "0")}</HowItWorksLtr>
                  </Badge>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <Progress value={value} size="sm" showPercentage={false} aria-label={progressLabel ?? copy.progressLabel} />
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            <HowItWorksLtr>{`${String(current).padStart(2, "0")} / ${String(count).padStart(2, "0")}`}</HowItWorksLtr>
          </span>
        </div>
      </Carousel>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksPhotoRailProgressCopy = COPY
