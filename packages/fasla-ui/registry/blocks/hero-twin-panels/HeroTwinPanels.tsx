"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Hero` (46552:249264), Type=Twin Panels Hero.
 *
 * Two offers side by side, each on its own rounded `muted` panel: a loose
 * cluster of photo tiles at the top, some running off the panel's edges, and
 * the copy underneath, a two-line title whose second line is muted and a
 * short paragraph. A round `background` button with a plus sits in a corner
 * of each panel. The first panel shows five tiles, the second three.
 *
 * Desktop sets the two panels side by side, each 684 × 852, with the plus at
 * the bottom end. Tablet and Mobile stack them, 720 × 620 and 328 × 520, with
 * the plus at the top end; the tiles shrink with the panel and the titles step
 * down from 5XL to 4XL and 3XL.
 *
 * In Arabic the panels swap sides and each cluster mirrors, the tiles placed
 * from the right edge; the plus moves to the other corner. The photographs
 * themselves are never flipped.
 *
 * Each tile's place is Figma's, in px from the panel's top and inline start,
 * held in the tile's own `--hero-twin-*` variables. The tiles are drawn on a
 * layer of Figma's panel width, centred in the panel, so a wider Mobile panel
 * shows more `muted` around the same cluster rather than a stretched one.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container and everything inside, its padding included, follows it. Mobile
 * is the base; `[@container(min-width:48rem)]:` is Figma's Tablet (768) and
 * `[@container(min-width:90rem)]:` its Desktop, from 1440px, the width Figma
 * draws it at. Narrower, the two panels squeeze their clusters, so Tablet's
 * layout covers 768 to 1439.
 */

export interface HeroTwinPanelsAction {
  /** The link's accessible name: the button shows only a plus. */
  label: string
  href: string
}

export interface HeroTwinPanelsPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroTwinPanelsPanel {
  /** The panel's title in its two lines: the second is set muted. */
  title: { start: React.ReactNode; accent: React.ReactNode }
  /** The paragraph under the title. */
  description: React.ReactNode
  /** The round plus button in the panel's corner. */
  action: HeroTwinPanelsAction
}

export interface HeroTwinPanelsCopy {
  /**
   * The two panels, in order from the start side. The first title is the
   * block's `h1`, the second an `h2`.
   */
  panels: [HeroTwinPanelsPanel, HeroTwinPanelsPanel]
}

/**
 * Figma's copy, English and Arabic. The plus buttons draw no text: their
 * names are the two offers as Figma's menu names them, Photos and Video.
 */
const COPY: Record<"en" | "ar", HeroTwinPanelsCopy> = {
  en: {
    panels: [
      {
        title: { start: "Your product,", accent: "in any setting." },
        description: "Upload one photo and place it in studio, home or outdoor scenes that match your brand.",
        action: { label: "Photos", href: "#photos" },
      },
      {
        title: { start: "Motion,", accent: "without a shoot." },
        description: "Turn still images into short clips for ads, stories and product pages.",
        action: { label: "Video", href: "#video" },
      },
    ],
  },
  ar: {
    panels: [
      {
        title: { start: "منتجك،", accent: "في أي مكان." },
        description: "ارفع صورة واحدة وضعها في مشاهد استوديو أو منزل أو طبيعة تناسب علامتك.",
        action: { label: "الصور", href: "#photos" },
      },
      {
        title: { start: "حركة،", accent: "من دون تصوير." },
        description: "حوّل الصور الثابتة إلى مقاطع قصيرة للإعلانات والقصص وصفحات المنتجات.",
        action: { label: "الفيديو", href: "#video" },
      },
    ],
  },
}

/** A tile's box in px: its start and top offsets in the panel, then its size. */
type Box = readonly [x: number, y: number, width: number, height: number]

/**
 * Each panel's tiles in Figma's order, measured on its 328 (Mobile), 720
 * (Tablet) and 684px (Desktop) panels. A negative start, or a box past the
 * panel's width, runs off the edge, as Figma's do.
 */
const TILES: { mobile: Box; tablet: Box; desktop: Box }[][] = [
  [
    { mobile: [-29, 99, 82, 143], tablet: [-63, 128, 179, 184], desktop: [-60, 160, 170, 230] },
    { mobile: [62, 55, 144, 161], tablet: [137, 70, 316, 208], desktop: [130, 88, 300, 260] },
    { mobile: [62, 226, 68, 112], tablet: [137, 291, 149, 144], desktop: [130, 364, 142, 180] },
    { mobile: [138, 226, 68, 112], tablet: [303, 291, 149, 144], desktop: [288, 364, 142, 180] },
    { mobile: [214, 99, 134, 143], tablet: [469, 128, 295, 184], desktop: [446, 160, 280, 230] },
  ],
  [
    { mobile: [-24, 99, 72, 143], tablet: [-53, 128, 158, 184], desktop: [-50, 160, 150, 230] },
    { mobile: [58, 55, 144, 283], tablet: [126, 70, 316, 365], desktop: [120, 88, 300, 456] },
    { mobile: [211, 99, 134, 143], tablet: [463, 128, 295, 184], desktop: [440, 160, 280, 230] },
  ],
]

/** A breakpoint's box as the tile's custom properties. */
function boxVars(prefix: string, [x, y, width, height]: Box): Record<string, string> {
  return {
    [`--hero-twin-${prefix}x`]: `${x}px`,
    [`--hero-twin-${prefix}y`]: `${y}px`,
    [`--hero-twin-${prefix}w`]: `${width}px`,
    [`--hero-twin-${prefix}h`]: `${height}px`,
  }
}

export interface HeroTwinPanelsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroTwinPanelsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The eight tile photos in Figma's order: the first panel's five, then the
   * second panel's three. Photos past the eighth are not shown. None by
   * default: `background` tiles on the `muted` panels.
   * @default none: `background` placeholders
   */
  photos?: HeroTwinPanelsPhoto[]
}

export function HeroTwinPanels({ locale = "en", panels, photos, className, ...props }: HeroTwinPanelsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const items = panels ?? copy.panels

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-4 p-4 [@container(min-width:48rem)]:gap-6 [@container(min-width:48rem)]:p-6 [@container(min-width:90rem)]:flex-row">
        {items.map((panel, panelIndex) => {
          const Heading = panelIndex === 0 ? "h1" : "h2"
          // The first panel's tiles take the first five photos, the second's the next three.
          const offset = TILES.slice(0, panelIndex).reduce((sum, tiles) => sum + tiles.length, 0)
          return (
            <div
              key={panelIndex}
              // Figma's panel height is a minimum: the copy sits where Figma puts it, and longer copy grows the panel.
              className="relative flex min-h-[520px] min-w-0 flex-col overflow-hidden rounded-[2rem] bg-muted [@container(min-width:48rem)]:min-h-[620px] [@container(min-width:90rem)]:min-h-[852px] [@container(min-width:90rem)]:flex-1"
            >
              <div className="flex flex-col gap-1 px-5 pb-4 [@container(min-width:48rem)]:px-10 [@container(min-width:48rem)]:pb-9 [@container(min-width:90rem)]:pb-8 [@container(min-width:90rem)]:pe-7 [@container(min-width:90rem)]:ps-14">
                <Heading
                  id={panelIndex === 0 ? headingId : undefined}
                  className="flex flex-col gap-1 text-3xl font-medium text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl"
                >
                  <span>{panel.title.start}</span>
                  <span className="text-muted-foreground">{panel.title.accent}</span>
                </Heading>
                <p className="text-pretty text-sm text-muted-foreground [@container(min-width:90rem)]:max-w-80">{panel.description}</p>
              </div>

              {/*
               * The tiles: a layer of Figma's panel width, centred. It comes
               * after the copy in the source, so a screen reader reaches the
               * title before the photos, and `order-first` draws it on top.
               */}
              <div className="relative order-first mx-auto h-[356px] w-[328px] shrink-0 [@container(min-width:48rem)]:h-[468px] [@container(min-width:48rem)]:w-[720px] [@container(min-width:90rem)]:h-[616px] [@container(min-width:90rem)]:w-[684px]">
                {(TILES[panelIndex] ?? []).map((tile, tileIndex) => {
                  const photo = photos?.[offset + tileIndex]
                  return (
                    <div
                      key={tileIndex}
                      style={{ ...boxVars("m", tile.mobile), ...boxVars("t", tile.tablet), ...boxVars("d", tile.desktop) } as React.CSSProperties}
                      className={cn(
                        "absolute overflow-hidden rounded-3xl bg-background",
                        "start-[var(--hero-twin-mx)] top-[var(--hero-twin-my)] h-[var(--hero-twin-mh)] w-[var(--hero-twin-mw)]",
                        "[@container(min-width:48rem)]:start-[var(--hero-twin-tx)] [@container(min-width:48rem)]:top-[var(--hero-twin-ty)] [@container(min-width:48rem)]:h-[var(--hero-twin-th)] [@container(min-width:48rem)]:w-[var(--hero-twin-tw)]",
                        "[@container(min-width:90rem)]:start-[var(--hero-twin-dx)] [@container(min-width:90rem)]:top-[var(--hero-twin-dy)] [@container(min-width:90rem)]:h-[var(--hero-twin-dh)] [@container(min-width:90rem)]:w-[var(--hero-twin-dw)]"
                      )}
                    >
                      {photo ? (
                        <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
                      ) : null}
                    </div>
                  )
                })}
              </div>

              {/* Figma draws a 48px `background` circle with a plus: top end on Mobile and Tablet, bottom end on Desktop. */}
              <a
                href={panel.action.href}
                aria-label={panel.action.label}
                className="absolute end-4 top-4 inline-flex size-12 items-center justify-center rounded-full bg-background text-foreground [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [@container(min-width:48rem)]:end-6 [@container(min-width:48rem)]:top-6 [@container(min-width:90rem)]:bottom-8 [@container(min-width:90rem)]:end-8 [@container(min-width:90rem)]:top-auto"
              >
                <Plus size={20} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroTwinPanelsCopy = COPY
