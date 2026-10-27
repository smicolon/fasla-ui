"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"

/*
 * Figma: `Gallery` (42478:479), Type=Contact Sheet Wall.
 *
 * An archive laid out like a photographer's contact sheet: a header with a
 * row of Bordered tabs at its end, a dense grid of small frames, each with
 * its reference number under it (RC-101…), and a footer with a running count
 * and an Outline "Load 24 more" button.
 *
 * The tabs filter the sheet. Figma's motion note says so ("Tabs filter with a
 * FLIP re-flow, see Filter Tabs + Grid"); Figma gives the frames no category
 * of their own, so each frame here carries a `category`, and the default
 * frames are dealt round the three disciplines in turn, six each. "All" shows
 * every frame. The re-flow itself is not animated: motion here is CSS
 * transitions only, and nothing plays on scroll.
 *
 * The count reads "shown of total": the frames the active tab shows, out of
 * `total` (the archive's full size; the frames on the sheet when it is left
 * out). It sits in a polite live region, so a tab change is announced. The
 * button calls `onLoadMore`; appending the next frames is the page's job.
 * Hover a frame and it lifts (scale 1.06, the md shadow) and its number
 * darkens to `foreground`. The frames are not links in Figma, so they are
 * not focusable here either.
 *
 * Desktop puts the tabs at the end of the header, on the heading's last line;
 * Tablet and Mobile stack them under it. The sheet is six frames a row on
 * Desktop and Tablet and three on Mobile, each breakpoint at Figma's own
 * frame shape. On a phone the footer stacks, centred.
 *
 * RTL: the tabs mirror themselves, the sheet fills from the right and the
 * count and button swap sides, all from the page's `dir`. Reference numbers
 * stay Latin and read left to right inside their own cell, as Figma's note
 * asks. The photographs are never flipped.
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

export interface GalleryContactSheetWallPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryContactSheetWallCategory {
  /** Identifies the category: a tab's value and a frame's `category`. */
  value: string
  /** The tab's label. */
  label: React.ReactNode
}

export interface GalleryContactSheetWallFrame {
  /** The reference number under the frame, such as "RC-101". Always read left to right. */
  id: string
  /** The `value` of the category it belongs to. */
  category: string
}

export interface GalleryContactSheetWallCopy {
  /** The small line above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The first tab's label: the tab that shows every frame. */
  all: React.ReactNode
  /** The other tabs, in order. Each has a `value` and a `label`. */
  categories: GalleryContactSheetWallCategory[]
  /** The frames, in order: an `id` and its `category`. */
  frames: GalleryContactSheetWallFrame[]
  /** The count in the footer, from the frames the active tab shows and the archive's total. */
  count: (shown: number, total: number) => React.ReactNode
  /** The button's label. Pass `null` to hide the button. */
  loadMore: React.ReactNode | null
  /** Shown in place of the sheet when there are no frames, or none in the active tab. */
  empty: React.ReactNode
}

/** Figma's reference numbers, in its order. */
const IDS = [101, 104, 112, 118, 121, 127, 134, 141, 155, 164, 172, 176, 184, 188, 189, 193, 197, 204]
/** Figma gives the frames no categories; the defaults deal them round the three tabs in turn. */
const DEALT = ["creative-direction", "identity", "motion"]
const FRAMES: GalleryContactSheetWallFrame[] = IDS.map((n, index) => ({
  id: `RC-${n}`,
  category: DEALT[index % DEALT.length] ?? "identity",
}))

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryContactSheetWallCopy> = {
  en: {
    eyebrow: "ARCHIVE",
    heading: "Where theory meets practice. Explore the archive.",
    all: "All",
    categories: [
      { value: "creative-direction", label: "Creative direction" },
      { value: "identity", label: "Identity" },
      { value: "motion", label: "Motion" },
    ],
    frames: FRAMES,
    count: (shown, total) => `${shown} of ${total}`,
    loadMore: "Load 24 more",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "الأرشيف",
    heading: "حيث تلتقي النظرية بالتطبيق. استكشف الأرشيف.",
    all: "الكل",
    categories: [
      { value: "creative-direction", label: "إدارة إبداعية" },
      { value: "identity", label: "هوية بصرية" },
      { value: "motion", label: "رسوم متحركة" },
    ],
    frames: FRAMES,
    count: (shown, total) => (
      <>
        <bdi dir="ltr">{shown}</bdi> من <bdi dir="ltr">{total}</bdi>
      </>
    ),
    loadMore: (
      <>
        تحميل <bdi dir="ltr">24</bdi> أخرى
      </>
    ),
    empty: "لا توجد صور بعد.",
  },
}

/** The tab that shows every frame. */
const ALL = "all"

export interface GalleryContactSheetWallProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryContactSheetWallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * One photo per frame, in the order of `frames` (Figma's RC-101 to RC-204,
   * row by row from the start): a photo stays with its frame when the tabs
   * filter the sheet. None by default: each frame shows a `muted`
   * placeholder.
   * @default none: `muted` placeholders
   */
  photos?: GalleryContactSheetWallPhoto[]
  /**
   * The tab shown at first, by category `value`; `"all"` is the tab that
   * shows every frame.
   * @default "all"
   */
  defaultCategory?: string
  /**
   * The archive's full size, the second number in the count. Pass your
   * archive's size; the default is Figma's "18 of 212".
   * @default 212
   */
  total?: number
  /** Called when the load-more button is pressed. Append the next frames to `frames` and `photos`. */
  onLoadMore?: () => void
}

export function GalleryContactSheetWall({
  locale = "en",
  eyebrow,
  heading,
  all,
  categories,
  frames,
  count,
  loadMore,
  empty,
  photos = [],
  defaultCategory = ALL,
  total = 212,
  onLoadMore,
  className,
  ...props
}: GalleryContactSheetWallProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const kicker = eyebrow ?? copy.eyebrow
  const tabs = categories ?? copy.categories
  const sheet = frames ?? copy.frames
  const countLabel = count ?? copy.count
  const button = loadMore === undefined ? copy.loadMore : loadMore
  const emptyLabel = empty ?? copy.empty
  const [active, setActive] = React.useState(defaultCategory)

  // Each frame keeps its index in `frames`, so its photo follows it through the filter.
  const indexed = sheet.map((frame, index) => ({ frame, index }))
  const inTab = (value: string) => (value === ALL ? indexed : indexed.filter(({ frame }) => frame.category === value))

  const header = (tabStrip: React.ReactNode) => (
    <div className="flex flex-col gap-4 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:justify-between">
      <div className="flex flex-col gap-4 [@container(min-width:64rem)]:w-[560px] [@container(min-width:64rem)]:shrink-0">
        {kicker ? <p className="text-xs font-medium text-primary">{kicker}</p> : null}
        <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
          {heading ?? copy.heading}
        </h2>
      </div>
      {tabStrip}
    </div>
  )

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto w-full max-w-[1248px]">
        {sheet.length === 0 ? (
          <div className="flex flex-col gap-10">
            {header(null)}
            <p className="py-16 text-center text-sm text-muted-foreground">{emptyLabel}</p>
          </div>
        ) : (
          <Tabs value={active} onValueChange={(value) => setActive(String(value))} className="flex flex-col gap-10">
            {header(
              // Scrolls on its own if the tabs outgrow the screen; the padding keeps the focus halo inside the scroll box.
              <div className="relative -m-1 max-w-[calc(100%+0.5rem)] self-start overflow-x-auto p-1 [@container(min-width:64rem)]:self-auto">
                <TabsList variant="bordered" size="sm">
                  <TabsTrigger value={ALL}>{all ?? copy.all}</TabsTrigger>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            )}

            {[ALL].concat(tabs.map((tab) => tab.value)).map((value) => {
              const list = inTab(value)
              return (
                <TabsContent key={value} value={value} className="mt-0">
                  {list.length === 0 ? (
                    <p className="py-16 text-center text-sm text-muted-foreground">{emptyLabel}</p>
                  ) : (
                    <ul className="grid grid-cols-3 gap-x-4 gap-y-6 [@container(min-width:40rem)]:grid-cols-6">
                      {list.map(({ frame, index }) => {
                        const photo = photos[index]
                        return (
                          <li key={index} className="group/cell">
                            <figure className="flex flex-col gap-2">
                              <div className="relative aspect-[88/64] overflow-hidden rounded-[var(--radius-sm)] bg-muted transition-[transform,box-shadow] duration-200 ease-out group-hover/cell:z-10 group-hover/cell:scale-[1.06] group-hover/cell:shadow-md motion-reduce:transition-none [@container(min-width:40rem)]:aspect-[93/68] [@container(min-width:64rem)]:aspect-[195/132]">
                                {photo ? (
                                  <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="absolute inset-0 size-full object-cover"
                                  />
                                ) : null}
                              </div>
                              <figcaption
                                dir="ltr"
                                className="truncate text-center text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover/cell:text-foreground motion-reduce:transition-none"
                              >
                                {frame.id}
                              </figcaption>
                            </figure>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </TabsContent>
              )
            })}

            <div className="flex flex-col items-center gap-3 text-center [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:text-start">
              <p aria-live="polite" className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                {countLabel(inTab(active).length, total)}
              </p>
              {button ? (
                <Button variant="outline" size="sm" onClick={onLoadMore}>
                  {button}
                </Button>
              ) : null}
            </div>
          </Tabs>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryContactSheetWallCopy = COPY
