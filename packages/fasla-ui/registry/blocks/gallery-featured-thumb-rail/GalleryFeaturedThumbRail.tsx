"use client"

import * as React from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Featured + Thumb Rail.
 *
 * A header (eyebrow and heading at the start, a chevron pair at the end)
 * over a large featured stage and a rail of four story rows. The stage shows
 * the selected story's photo under a scrim, with its category badge, its
 * headline, a meta line and a "Read the story" button at the bottom. Each
 * row is a thumbnail, a title, the category and a chevron; the selected row
 * has the `muted` fill and a darker chevron. On Desktop the rail stands at
 * the stage's end, 400px wide, its rows spread over the stage's height; from
 * Tablet down it drops under the stage as a list. No photos come with the
 * block: pass each story's `image`, and until then the stage and the
 * thumbnails are `muted` placeholders of the same size.
 *
 * Selecting is the block's one interaction. A row is a button (the selected
 * one is `aria-current`), the chevrons step back and forward and wrap round
 * the ends, which is why Figma's back chevron is live on the first story, and
 * the arrow keys move between rows (up and down, or back and forward along
 * the reading direction), as do Home and End. The stage's photos crossfade;
 * its caption is a polite live region, so the new headline is announced.
 * Nothing advances on its own: no autoplay, as Figma's motion note says.
 *
 * Figma writes stage copy for the first story only. The others' stage falls
 * back to the row's title for the headline and leaves out the meta line,
 * until you pass `headline` and `meta` with them. The button shows when a
 * story has an `href`.
 *
 * The stage is dark and its text light in both modes, as Figma draws it: a
 * photograph does not change with the theme. In light mode that is the
 * inverse tokens, `background-inverse` at 40% and `foreground-inverse`; in
 * dark mode the page's own `background` and `foreground` hold the same two
 * colours, so `dark:` switches to them, as Error State Full-Bleed Photo
 * does. The badge and button keep Figma's light secondary look the same
 * way.
 *
 * In Arabic the rail moves to the left of the stage and the caption to the
 * right; the chevrons and the button's arrow point the other way. The
 * photographs are never flipped, and the numerals stay left to right.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content (Figma's Tablet, 768 less its padding), and
 * `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element
 * can't query itself.
 */

export interface GalleryFeaturedThumbRailPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryFeaturedThumbRailItem {
  /** The row's title, beside its thumbnail. */
  title: React.ReactNode
  /** The row's second line, and the badge on the stage. */
  category: React.ReactNode
  /** The stage's heading, an `h3`, when this story is selected. Defaults to `title`. */
  headline?: React.ReactNode
  /** The stage's meta line, in parts. A middle dot goes between each part. Hidden when missing. */
  meta?: React.ReactNode[]
  /** Where the stage's button goes. The button is hidden when missing. */
  href?: string
  /** The story's photo: its thumbnail, and the stage when selected. A `muted` placeholder when missing. */
  image?: GalleryFeaturedThumbRailPhoto
}

export interface GalleryFeaturedThumbRailCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The stories, in rail order. Figma draws four. */
  items: GalleryFeaturedThumbRailItem[]
  /** The stage button's label. */
  actionLabel: React.ReactNode
  /** The accessible name of the back chevron. */
  previousLabel: string
  /** The accessible name of the forward chevron. */
  nextLabel: string
  /** Shown in place of the stage and rail when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryFeaturedThumbRailCopy> = {
  en: {
    eyebrow: "CUSTOMER STORIES",
    heading: "See how teams use the platform",
    items: [
      {
        title: "Cutting reporting time in half",
        category: "Financial services",
        headline: "How a 400-person bank cut reporting time in half",
        meta: ["Case study", "6 min read"],
        href: "#",
      },
      { title: "Dashboards for a logistics fleet", category: "Transport", href: "#" },
      { title: "Onboarding 2,000 new hires", category: "Retail", href: "#" },
      { title: "One workspace across three offices", category: "Architecture", href: "#" },
    ],
    actionLabel: "Read the story",
    previousLabel: "Previous story",
    nextLabel: "Next story",
    empty: "No stories yet.",
  },
  ar: {
    eyebrow: "قصص العملاء",
    heading: "اطّلع على كيفية استخدام الفرق للمنصة",
    items: [
      {
        title: "تقليص زمن التقارير إلى النصف",
        category: "خدمات مالية",
        headline: (
          <>
            كيف قلّص بنك من <bdi dir="ltr">400</bdi> موظف زمن التقارير إلى النصف
          </>
        ),
        meta: [
          "دراسة حالة",
          <>
            قراءة <bdi dir="ltr">6</bdi> دقائق
          </>,
        ],
        href: "#",
      },
      { title: "لوحات معلومات لأسطول لوجستي", category: "نقل", href: "#" },
      {
        title: (
          <>
            تهيئة <bdi dir="ltr">2,000</bdi> موظف جديد
          </>
        ),
        category: "تجزئة",
        href: "#",
      },
      { title: "مساحة عمل واحدة في ثلاثة مكاتب", category: "معمار", href: "#" },
    ],
    actionLabel: "اقرأ القصة",
    previousLabel: "القصة السابقة",
    nextLabel: "القصة التالية",
    empty: "لا توجد قصص بعد.",
  },
}

/** A line made of parts, each isolated, with a middle dot between them that never flips. */
function Parts({ parts }: { parts: React.ReactNode[] }) {
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          <bdi>{part}</bdi>
        </React.Fragment>
      ))}
    </>
  )
}

const ICON = "[&:dir(rtl)]:-scale-x-100"
const FOCUS_RING =
  "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
/** Figma's light secondary look on the stage, kept in dark mode, with a light focus ring. */
const ON_STAGE = "dark:bg-primary dark:text-primary-foreground"
const ON_STAGE_RING = "after:ring-foreground-inverse dark:after:ring-foreground"

export interface GalleryFeaturedThumbRailProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryFeaturedThumbRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The selected story, controlled. */
  activeIndex?: number
  /**
   * The story selected at first, uncontrolled.
   * @default 0
   */
  defaultActiveIndex?: number
  /** Called with a story's index when it is selected. */
  onActiveIndexChange?: (index: number) => void
}

export function GalleryFeaturedThumbRail({
  locale = "en",
  eyebrow,
  heading,
  items,
  actionLabel,
  previousLabel,
  nextLabel,
  empty,
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  className,
  ...props
}: GalleryFeaturedThumbRailProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const stageId = React.useId()
  const list = items ?? copy.items
  const count = list.length

  const [internalIndex, setInternalIndex] = React.useState(defaultActiveIndex)
  const given = controlledIndex ?? internalIndex
  const active = count === 0 ? 0 : Math.max(0, Math.min(count - 1, given))
  const current = list[active]

  const rowRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number, focus = false) => {
    if (count === 0) return
    const next = ((index % count) + count) % count
    if (controlledIndex === undefined) setInternalIndex(next)
    if (next !== active) onActiveIndexChange?.(next)
    if (focus) rowRefs.current[next]?.focus()
  }

  const onRailKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const isRtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const back = isRtl ? "ArrowRight" : "ArrowLeft"
    const forward = isRtl ? "ArrowLeft" : "ArrowRight"
    let to: number | null = null
    if (event.key === "ArrowUp" || event.key === back) to = active - 1
    else if (event.key === "ArrowDown" || event.key === forward) to = active + 1
    else if (event.key === "Home") to = 0
    else if (event.key === "End") to = count - 1
    if (to === null) return
    event.preventDefault()
    select(to, true)
  }

  const header = (
    <div className="flex min-w-0 flex-col gap-4 text-start">
      <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
      <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
        {heading ?? copy.heading}
      </h2>
    </div>
  )

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-16">
          {header}
          {count > 0 ? (
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="icon-md"
                radius="rounded"
                aria-label={previousLabel ?? copy.previousLabel}
                aria-controls={stageId}
                onClick={() => select(active - 1)}
              >
                <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
              </Button>
              <Button
                variant="outline"
                size="icon-md"
                radius="rounded"
                aria-label={nextLabel ?? copy.nextLabel}
                aria-controls={stageId}
                onClick={() => select(active + 1)}
              >
                <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
              </Button>
            </div>
          ) : null}
        </div>

        {current === undefined ? (
          <p className="py-12 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="flex flex-col gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:flex-row">
            <div
              id={stageId}
              className="relative isolate flex h-[246px] min-w-0 flex-col justify-end overflow-hidden rounded-lg bg-muted p-4 [@container(min-width:40rem)]:h-[420px] [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:h-[520px] [@container(min-width:64rem)]:flex-1"
            >
              {list.map((item, index) =>
                item.image ? (
                  <img
                    key={index}
                    src={item.image.src}
                    alt={index === active ? item.image.alt : ""}
                    aria-hidden={index === active ? undefined : true}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 -z-10 size-full object-cover transition-opacity duration-[350ms] ease-in-out motion-reduce:transition-none",
                      index === active ? "opacity-100" : "opacity-0"
                    )}
                  />
                ) : null
              )}
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background-inverse/40 dark:bg-background/40" />

              <div aria-live="polite" aria-atomic="true" className="flex flex-col items-start gap-3 text-start">
                <Badge variant="solid" tone="secondary" size="sm" radius="rounded" className={cn("whitespace-nowrap", ON_STAGE)}>
                  {current.category}
                </Badge>
                <h3 className="text-xl font-semibold text-foreground-inverse [@container(min-width:40rem)]:text-3xl dark:text-foreground">
                  {current.headline ?? current.title}
                </h3>
                {current.meta || current.href ? (
                  <div className="flex w-full flex-col items-start gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
                    {current.meta ? (
                      <p className="whitespace-nowrap text-sm text-muted dark:text-muted-foreground">
                        <Parts parts={current.meta} />
                      </p>
                    ) : (
                      <span aria-hidden="true" />
                    )}
                    {current.href ? (
                      <a
                        href={current.href}
                        className={buttonVariants({ variant: "secondary", size: "sm", className: cn(ON_STAGE, ON_STAGE_RING) })}
                      >
                        {actionLabel ?? copy.actionLabel}
                        <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <ul onKeyDown={onRailKeyDown} className="flex flex-col gap-2 [@container(min-width:64rem)]:w-[400px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:justify-between">
              {list.map((item, index) => {
                const isActive = index === active
                return (
                  <li key={index}>
                    <button
                      ref={(node) => {
                        rowRefs.current[index] = node
                      }}
                      type="button"
                      aria-current={isActive ? "true" : undefined}
                      aria-controls={stageId}
                      onClick={() => select(index)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md p-3 text-start transition-[transform,background-color] duration-200 hover:-translate-y-0.5 motion-reduce:transition-none [@container(min-width:40rem)]:gap-4",
                        FOCUS_RING,
                        isActive && "bg-muted"
                      )}
                    >
                      <span className="relative h-16 w-[92px] shrink-0 overflow-hidden rounded-md bg-muted [@container(min-width:40rem)]:h-20 [@container(min-width:40rem)]:w-[120px]">
                        {item.image ? (
                          <img
                            src={item.image.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 size-full object-cover"
                          />
                        ) : null}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-sm font-semibold text-foreground [@container(min-width:40rem)]:text-base">{item.title}</span>
                        <span className="truncate text-sm text-muted-foreground">{item.category}</span>
                      </span>
                      <ChevronRight
                        aria-hidden="true"
                        size={20}
                        strokeWidth={1.5}
                        absoluteStrokeWidth
                        className={cn("shrink-0", ICON, isActive ? "text-foreground" : "text-muted-foreground")}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryFeaturedThumbRailCopy = COPY
