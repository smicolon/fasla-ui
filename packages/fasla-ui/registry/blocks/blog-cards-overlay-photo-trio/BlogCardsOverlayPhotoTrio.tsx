import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Overlay Photo Trio.
 *
 * A section header (an eyebrow and a heading, with a ghost "All stories"
 * button at the end) over three tall photo cards. Each card is one photo
 * filling its frame, with a caption plate along the bottom: the category and
 * the read time in small capitals, a title and a summary, all in white on a
 * dark scrim. The summary is on show at rest. The whole card is the link,
 * named by its title.
 *
 * Desktop (Figma 1440) puts the three cards in a row, 520 tall. Tablet (768)
 * puts two portrait cards, 460 tall, side by side and a landscape third across
 * the full width, 380 tall, with a shorter caption. Mobile (360) is one column
 * of three cards, 420 tall.
 *
 * Hover and keyboard focus scale the photo from 1.00 to 1.06 behind its clip
 * (400ms), darken the scrim from 62% to 72% and lift the caption's text 8px (6px on
 * the wide Tablet card, whose caption is shorter). Nothing fades in or out and
 * nothing staggers or reveals on scroll. On Mobile there is no hover;
 * pressing a card darkens the scrim to 72% and the photo stays still. Reduced
 * motion turns all of it off.
 *
 * The scrim is dark and the text light in both modes, as Figma draws them: a
 * photograph does not change with the theme. In light mode that is the
 * inverse tokens, `background-inverse` and `foreground-inverse`; in dark mode
 * the page's own `background` and `foreground` hold the same two colours, so
 * `dark:` switches to them. The block needs the `theme-inverse` item.
 *
 * Arabic mirrors by the page's `dir`: the card order, the header and the
 * caption. Photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsOverlayPhotoTrioPost {
  /** The photo filling the card. Without one the card is a `muted` placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category, shown in capitals in English. */
  category: React.ReactNode
  /** The read time, as written: "10 min". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the card's link. */
  title: React.ReactNode
  /** The summary, on show at rest. */
  summary: React.ReactNode
  /** Where the card goes. */
  href: string
}

export interface BlogCardsOverlayPhotoTrioCopy {
  /** The small line over the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The ghost button at the end of the header. Hidden when there is no label. */
  action: { label: React.ReactNode; href: string }
  /** The cards, in reading order. */
  posts: BlogCardsOverlayPhotoTrioPost[]
  /** Shown instead of the cards when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsOverlayPhotoTrioCopy> = {
  en: {
    eyebrow: "STORIES",
    heading: "Deep dives from the studio",
    action: { label: "All stories", href: "#" },
    posts: [
      {
        category: "RTL & Arabic",
        readTime: "10 min",
        title: "Mirroring is not flipping",
        summary: "The layout rules that actually change in RTL — and the ones designers keep mirroring by mistake.",
        href: "#",
      },
      {
        category: "Foundations",
        readTime: "5 min",
        title: "Motion tokens: duration, easing, restraint",
        summary:
          "Three durations and two curves cover almost everything. Everything else is a special case that needs a reason.",
        href: "#",
      },
      {
        category: "Typography",
        readTime: "7 min",
        title: "Type specimens are for arguing with",
        summary: "A specimen that only flatters the typeface is useless. Build the one that shows where it fails.",
        href: "#",
      },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "قصص",
    heading: "غوص عميق من الاستوديو",
    action: { label: "كل القصص", href: "#" },
    posts: [
      {
        category: "العربية وRTL",
        readTime: "10 دقائق",
        title: "الانعكاس ليس مجرد قلب",
        summary: "قواعد التخطيط التي تتغير فعلًا في RTL، وتلك التي يعكسها المصممون بالخطأ.",
        href: "#",
      },
      {
        category: "الأساسيات",
        readTime: "5 دقائق",
        title: "رموز الحركة: المدة والتسارع وضبط النفس",
        summary: "ثلاث مدد ومنحنيان يغطيان كل شيء تقريبًا. وما عدا ذلك حالة خاصة تحتاج مبررًا.",
        href: "#",
      },
      {
        category: "التايبوغرافيا",
        readTime: "7 دقائق",
        title: "عيّنات الخطوط وُجدت لنجادلها",
        summary: "العينة التي تجامل الخط بلا فائدة. ابنِ العينة التي تكشف مواضع فشله.",
        href: "#",
      },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsOverlayPhotoTrioCopy = COPY

/*
 * The scrim is dark in both modes: the inverse tokens in light, the page's own
 * in dark. Every class below is written out whole: Tailwind finds a class by
 * reading the source, so none is built from pieces. The hover and focus ones
 * are from Tablet up (Mobile has none); Mobile's press darkens the scrim.
 */
const SCRIM = "bg-background-inverse/[0.62] dark:bg-background/[0.62]"
const SCRIM_DARKER =
  "group-hover/card:[@container(min-width:40rem)]:bg-background-inverse/[0.72] group-hover/card:[@container(min-width:40rem)]:dark:bg-background/[0.72] group-focus-visible/card:[@container(min-width:40rem)]:bg-background-inverse/[0.72] group-focus-visible/card:[@container(min-width:40rem)]:dark:bg-background/[0.72] group-active/card:[@container(max-width:39.99rem)]:bg-background-inverse/[0.72] group-active/card:[@container(max-width:39.99rem)]:dark:bg-background/[0.72]"
const PHOTO_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:motion-safe:scale-[1.06] group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:scale-[1.06]"
const CAPTION_LIFT =
  "group-hover/card:[@container(min-width:40rem)]:motion-safe:-translate-y-2 group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:-translate-y-2"
/** The wide card's caption is shorter on Tablet, so it lifts 6px there and 8px elsewhere. */
const WIDE_CAPTION_LIFT =
  "group-hover/card:[@container(min-width:40rem)_and_(max-width:63.99rem)]:motion-safe:-translate-y-1.5 group-focus-visible/card:[@container(min-width:40rem)_and_(max-width:63.99rem)]:motion-safe:-translate-y-1.5 group-hover/card:[@container(min-width:64rem)]:motion-safe:-translate-y-2 group-focus-visible/card:[@container(min-width:64rem)]:motion-safe:-translate-y-2"

export interface BlogCardsOverlayPhotoTrioProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsOverlayPhotoTrioCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsOverlayPhotoTrio({
  locale = "en",
  eyebrow,
  heading,
  action,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsOverlayPhotoTrioProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const header = { eyebrow: eyebrow ?? copy.eyebrow, action: action ?? copy.action }

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
        <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
          <div className="flex min-w-0 flex-col gap-2">
            {header.eyebrow ? (
              <p className="text-xs font-medium uppercase text-muted-foreground">{header.eyebrow}</p>
            ) : null}
            <h2
              id={headingId}
              className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl"
            >
              {heading ?? copy.heading}
            </h2>
          </div>
          {header.action.label ? (
            <a
              href={header.action.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "w-full shrink-0 [@container(min-width:40rem)]:w-auto"
              )}
            >
              {header.action.label}
              <ArrowRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </a>
          ) : null}
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3">
            {list.map((post, index) => {
              // An odd last card spans the row on Tablet, landscape and with a shorter caption.
              const wide = list.length % 2 === 1 && index === list.length - 1
              return (
                <li key={index} className={cn("flex", wide && "[@container(min-width:40rem)_and_(max-width:63.99rem)]:col-span-2")}>
                  <a
                    href={post.href}
                    aria-labelledby={`${titleId}-${index}`}
                    className={cn(
                      "group/card relative isolate flex h-[420px] w-full flex-col justify-end overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:h-[460px] [@container(min-width:64rem)]:h-[520px]",
                      wide && "[@container(min-width:40rem)_and_(max-width:63.99rem)]:h-[380px]",
                      "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    )}
                  >
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image.src}
                        alt={post.image.alt}
                        loading="lazy"
                        className={cn(
                          "absolute inset-0 -z-10 size-full object-cover transition-transform duration-[400ms] ease-out motion-reduce:transition-none",
                          PHOTO_HOVER
                        )}
                      />
                    ) : null}
                    <div className="relative">
                      <div
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-0 transition-colors duration-[400ms] ease-out motion-reduce:transition-none",
                          SCRIM,
                          SCRIM_DARKER
                        )}
                      />
                      <div
                        className={cn(
                          "relative flex flex-col gap-3 p-6 text-foreground-inverse transition-transform duration-[400ms] ease-out dark:text-foreground motion-reduce:transition-none",
                          wide ? WIDE_CAPTION_LIFT : CAPTION_LIFT
                        )}
                      >
                        <p className="flex items-center gap-2 text-xs font-medium uppercase">
                          <span>{post.category}</span>
                          <span aria-hidden="true" className="size-[3px] rounded-full bg-current" />
                          <span>{post.readTime}</span>
                        </p>
                        <h3 id={`${titleId}-${index}`} className="text-xl font-semibold [@container(min-width:40rem)]:text-2xl">
                          {post.title}
                        </h3>
                        <p className="text-sm">{post.summary}</p>
                      </div>
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
