import * as React from "react"
import { MailIcon, QuoteIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Bento Editorial Grid.
 *
 * A heading over two rows of tiles of different kinds. The first row is a
 * large photo tile (a category and read time over a title, on a dark scrim)
 * beside a stack of a pull-quote tile and an article tile. The second row is a
 * statistic tile, a second photo tile and a subscribe tile with a full-width
 * button. The photo tiles and the article tile are links: the title carries
 * each. The quote, the statistic and the subscribe tile are static.
 *
 * Desktop (Figma 1440): the photo tile is 840 by 440 with a 416 stack beside
 * it; the second row has three equal tiles, 260 tall. Tablet (768): the photo
 * tile spans the width above a row of the quote and article tiles; the second
 * row has the statistic and the photo side by side and the subscribe tile
 * across the full width. Mobile (360): one column of seven tiles.
 *
 * Hover and keyboard focus scale a photo from 1.00 to 1.04 behind its clip
 * (320ms) and darken its scrim from 55% to 65% so the caption stays readable;
 * on the article tile the title turns `info`. The subscribe button has the
 * Button's own hover and press states. On Mobile there is no hover; pressing a
 * photo or article tile dims it to 96%. Reduced motion turns it all off. Nothing
 * plays on load, on scroll or on a timer.
 *
 * The scrim is dark and the text light in both modes, as Figma draws them: a
 * photograph does not change with the theme. In light mode that is the
 * inverse tokens, `background-inverse` and `foreground-inverse`; in dark mode
 * the page's own `background` and `foreground` hold the same two colours, so
 * `dark:` switches to them. The quote tile is the inverse band itself. The
 * block needs the `theme-inverse` item.
 *
 * Arabic mirrors by the page's `dir`: the tiles swap sides and the captions
 * align to the end. Photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsBentoEditorialGridPhotoTile {
  /** The photo filling the tile. Without one the tile is a `muted` placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category, shown in capitals in English. */
  category: React.ReactNode
  /** The read time, as written: "5 min read". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the tile's link. */
  title: React.ReactNode
  /** Where the tile goes. */
  href: string
}

export interface BlogCardsBentoEditorialGridCopy {
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The two photo tiles: the large one first, then the one in the second row. */
  photoTiles: BlogCardsBentoEditorialGridPhotoTile[]
  /** The pull-quote tile. Hidden when there is no text. */
  quote: { text: React.ReactNode; author: React.ReactNode; role: React.ReactNode }
  /** The article tile next to the quote. Hidden when there is no title. */
  post: { category: React.ReactNode; title: React.ReactNode; summary: React.ReactNode; href: string }
  /** The statistic tile. Hidden when there is no value. */
  stat: { label: React.ReactNode; value: React.ReactNode; note: React.ReactNode }
  /** The subscribe tile. Hidden when there is no label. */
  subscribe: { title: React.ReactNode; note: React.ReactNode; label: React.ReactNode; href: string }
  /** Shown instead of the tiles when there are no photo tiles and no quote, article or statistic. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsBentoEditorialGridCopy> = {
  en: {
    heading: "Selected reading",
    photoTiles: [
      { category: "Design Systems", readTime: "5 min read", title: "The case for fewer button variants", href: "#" },
      { category: "Product", readTime: "8 min read", title: "Designing tables nobody dreads", href: "#" },
    ],
    quote: {
      text: "We had 96 button variants. We shipped 24, and nothing broke.",
      author: "Karim Nasser",
      role: "Design Systems Lead",
    },
    post: {
      category: "RTL & Arabic",
      title: "Kashida, ligatures, and line height",
      summary: "Three Arabic typesetting features that most component libraries silently disable.",
      href: "#",
    },
    stat: {
      label: "PUBLISHED IN 2026",
      value: "32",
      note: "Long reads, field notes and release posts from the Fasla team.",
    },
    subscribe: {
      title: "One email a month",
      note: "New posts, plus what changed in the system.",
      label: "Subscribe",
      href: "#",
    },
    emptyLabel: "No articles yet.",
  },
  ar: {
    heading: "قراءات مختارة",
    photoTiles: [
      { category: "أنظمة التصميم", readTime: "قراءة 5 دقائق", title: "مرافعة لصالح متغيرات أزرار أقل", href: "#" },
      { category: "المنتج", readTime: "قراءة 8 دقائق", title: "تصميم جداول لا يخشاها أحد", href: "#" },
    ],
    quote: {
      text: "كان لدينا 96 متغيّر زر. أطلقنا 24، ولم ينكسر شيء.",
      author: "كريم ناصر",
      role: "قائد أنظمة التصميم",
    },
    post: {
      category: "العربية وRTL",
      title: "الكشيدة والوصلات وارتفاع السطر",
      summary: "ثلاث خصائص لتنضيد العربية تعطّلها معظم مكتبات المكوّنات بصمت.",
      href: "#",
    },
    stat: {
      label: "نُشر في 2026",
      value: "32",
      note: "قراءات طويلة وملاحظات ميدانية ومقالات إصدارات من فريق فاصلة.",
    },
    subscribe: {
      title: "بريد واحد في الشهر",
      note: "مقالات جديدة، وما تغيّر في النظام.",
      label: "اشترك",
      href: "#",
    },
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsBentoEditorialGridCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const TILE_LINK =
  "group/tile [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-opacity duration-[120ms] motion-reduce:transition-none active:[@container(max-width:39.99rem)]:opacity-[0.96]"
const SCRIM = "bg-background-inverse/[0.55] dark:bg-background/[0.55]"
const SCRIM_DARKER =
  "group-hover/tile:[@container(min-width:40rem)]:bg-background-inverse/[0.65] group-hover/tile:[@container(min-width:40rem)]:dark:bg-background/[0.65] group-focus-visible/tile:[@container(min-width:40rem)]:bg-background-inverse/[0.65] group-focus-visible/tile:[@container(min-width:40rem)]:dark:bg-background/[0.65]"
const PHOTO_HOVER =
  "group-hover/tile:[@container(min-width:40rem)]:motion-safe:scale-[1.04] group-focus-visible/tile:[@container(min-width:40rem)]:motion-safe:scale-[1.04]"
const TITLE_HOVER =
  "group-hover/tile:[@container(min-width:40rem)]:text-info group-focus-visible/tile:[@container(min-width:40rem)]:text-info"

function PhotoTile({
  tile,
  size,
  titleId,
  className,
}: {
  tile: BlogCardsBentoEditorialGridPhotoTile
  size: "large" | "small"
  titleId: string
  className?: string
}) {
  return (
    <a
      href={tile.href}
      aria-labelledby={titleId}
      className={cn("relative isolate flex flex-col justify-end overflow-hidden rounded-lg bg-muted", TILE_LINK, className)}
    >
      {tile.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tile.image.src}
          alt={tile.image.alt}
          loading="lazy"
          className={cn(
            "absolute inset-0 -z-10 size-full object-cover transition-transform duration-[320ms] ease-out motion-reduce:transition-none",
            PHOTO_HOVER
          )}
        />
      ) : null}
      <div className="relative">
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 transition-colors duration-[320ms] ease-out motion-reduce:transition-none",
            SCRIM,
            SCRIM_DARKER
          )}
        />
        <div
          className={cn(
            "relative flex flex-col gap-2 text-foreground-inverse dark:text-foreground",
            size === "large" ? "p-6" : "p-5"
          )}
        >
          <p className="flex items-center gap-2 text-xs">
            <span className="font-medium uppercase">{tile.category}</span>
            <span aria-hidden="true" className="size-[3px] rounded-full bg-current" />
            <span>{tile.readTime}</span>
          </p>
          <h3
            id={titleId}
            className={cn("font-semibold", size === "large" ? "text-xl [@container(min-width:40rem)]:text-2xl" : "text-lg")}
          >
            {tile.title}
          </h3>
        </div>
      </div>
    </a>
  )
}

export interface BlogCardsBentoEditorialGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsBentoEditorialGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsBentoEditorialGrid({
  locale = "en",
  heading,
  photoTiles,
  quote,
  post,
  stat,
  subscribe,
  emptyLabel,
  className,
  ...props
}: BlogCardsBentoEditorialGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const photos = photoTiles ?? copy.photoTiles
  const tiles = {
    quote: quote ?? copy.quote,
    post: post ?? copy.post,
    stat: stat ?? copy.stat,
    subscribe: subscribe ?? copy.subscribe,
  }
  const [large, small] = photos
  const empty = !large && !small && !tiles.quote.text && !tiles.post.title && !tiles.stat.value

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12">
        <h2
          id={headingId}
          className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl"
        >
          {heading ?? copy.heading}
        </h2>

        {empty ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <>
            <div className="flex flex-col gap-5 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:flex-row">
              {large ? (
                <PhotoTile
                  tile={large}
                  size="large"
                  titleId={`${titleId}-large`}
                  className="h-[300px] [@container(min-width:40rem)]:h-[340px] [@container(min-width:64rem)]:h-[440px] [@container(min-width:64rem)]:flex-1"
                />
              ) : null}
              <div className="flex flex-col gap-5 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:w-[416px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:flex-col">
                {tiles.quote.text ? (
                  <figure className="flex flex-col gap-3 rounded-lg bg-background-inverse p-6 [@container(min-width:40rem)]:flex-1">
                    <QuoteIcon aria-hidden="true" className="size-6 shrink-0 text-foreground-inverse" />
                    <blockquote className="text-xl font-medium text-foreground-inverse">{tiles.quote.text}</blockquote>
                    <figcaption className="flex items-center gap-2 text-xs text-muted-foreground-inverse">
                      <span>{tiles.quote.author}</span>
                      <span aria-hidden="true" className="size-[3px] rounded-full bg-current" />
                      <span>{tiles.quote.role}</span>
                    </figcaption>
                  </figure>
                ) : null}
                {tiles.post.title ? (
                  <a
                    href={tiles.post.href}
                    aria-labelledby={`${titleId}-post`}
                    className={cn("flex flex-col gap-2 rounded-lg bg-muted p-6 [@container(min-width:40rem)]:flex-1", TILE_LINK)}
                  >
                    <p className="text-xs font-medium uppercase text-muted-foreground">{tiles.post.category}</p>
                    <h3 id={`${titleId}-post`} className={cn("text-lg font-semibold text-foreground", TITLE_HOVER)}>
                      {tiles.post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{tiles.post.summary}</p>
                  </a>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-3">
              {tiles.stat.value ? (
                <div className="flex flex-col justify-between gap-2 rounded-lg bg-muted p-6 [@container(min-width:40rem)]:h-[240px] [@container(min-width:64rem)]:h-[260px]">
                  <p className="text-xs font-medium uppercase text-muted-foreground">{tiles.stat.label}</p>
                  <p className="text-5xl font-semibold text-foreground [@container(min-width:40rem)]:text-7xl">
                    {tiles.stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{tiles.stat.note}</p>
                </div>
              ) : null}
              {small ? (
                <PhotoTile
                  tile={small}
                  size="small"
                  titleId={`${titleId}-small`}
                  className="h-[220px] [@container(min-width:40rem)]:h-[240px] [@container(min-width:64rem)]:h-[260px]"
                />
              ) : null}
              {tiles.subscribe.label ? (
                <div className="flex flex-col justify-between gap-3 rounded-lg border bg-card p-6 [@container(min-width:40rem)_and_(max-width:63.99rem)]:col-span-2 [@container(min-width:64rem)]:h-[260px]">
                  <div className="flex flex-col gap-2">
                    <MailIcon aria-hidden="true" className="size-6 shrink-0 text-foreground" />
                    <p className="text-xl font-semibold text-foreground">{tiles.subscribe.title}</p>
                    <p className="text-sm text-muted-foreground">{tiles.subscribe.note}</p>
                  </div>
                  <a href={tiles.subscribe.href} className={cn(buttonVariants({ variant: "default", size: "md" }), "w-full")}>
                    {tiles.subscribe.label}
                  </a>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
