import * as React from "react"
import { ArrowRightIcon, QuoteIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Pull-Quote Feature.
 *
 * One essay set as a quote, on the page background. A `muted` panel, centred:
 * a quotation mark, the pull quote in a large light weight, an attribution
 * (the author's initials, their name and role) and a solid "Read the full
 * essay" button with an arrow. Under the panel, three related articles as
 * bordered cards: a 72 by 72 thumbnail, a category and a title. The panel is
 * static and the button is its link; each related card is one link named by
 * its title.
 *
 * Desktop (Figma 1440) puts the three related cards in one row, each 411 wide.
 * Tablet (768) puts two in a row and the third across the full width, with
 * the panel padded tighter. Mobile (360) stacks the cards, the title a size
 * down, the attribution stacked (avatar, name, role, with no dot between) and
 * the button across the full width.
 *
 * Hovering a related card scales its thumbnail from 1.00 to 1.06 inside its
 * clip and turns its title `info` (180ms). Keyboard focus does the same. There
 * is no hover on Mobile; pressing a card dims it to 92%. The panel does not
 * move and the button has its own hover and press states. Reduced motion
 * turns the scale off. Nothing plays on load or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the related cards run right to left and
 * the arrow is mirrored. The quotation mark, the quote and the attribution stay
 * centred in the panel, as in Figma. The photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsPullQuoteFeatureQuote {
  /** The pull quote. */
  quote: React.ReactNode
  /** The author's name. Their initials fill the avatar. */
  author: string
  /** The author's role, shown after the name. */
  role: React.ReactNode
  /** The button's label. */
  actionLabel: React.ReactNode
  /** Where the button goes. */
  href: string
}

export interface BlogCardsPullQuoteFeatureRelated {
  /** The thumbnail. Without one the thumbnail is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category. */
  category: React.ReactNode
  /** The title, an `h2` (the block has no other heading), and the card's accessible name. */
  title: React.ReactNode
  /** Where the card goes. */
  href: string
}

export interface BlogCardsPullQuoteFeatureCopy {
  /** The quote panel. Without one the related cards stand alone. */
  panel: BlogCardsPullQuoteFeatureQuote | null
  /** The related articles, in reading order. */
  related: BlogCardsPullQuoteFeatureRelated[]
  /** Shown instead of the block when there is neither a panel nor a card. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsPullQuoteFeatureCopy> = {
  en: {
    panel: {
      quote:
        "A design system is not a library of components. It is an agreement about how decisions get made — and the components are just where you can see it.",
      author: "Karim Nasser",
      role: "Design Systems Lead, Fasla",
      actionLabel: "Read the full essay",
      href: "#",
    },
    related: [
      { category: "DESIGN SYSTEMS", title: "The case for fewer button variants", href: "#" },
      { category: "DESIGN SYSTEMS", title: "Density modes without forking your components", href: "#" },
      { category: "FOUNDATIONS", title: "Semantic colour, one layer at a time", href: "#" },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    panel: {
      quote:
        "نظام التصميم ليس مكتبة مكوّنات. إنه اتفاق على كيفية اتخاذ القرارات، والمكوّنات ليست إلا المكان الذي يظهر فيه هذا الاتفاق.",
      author: "كريم ناصر",
      role: "قائد أنظمة التصميم، فاصلة",
      actionLabel: "اقرأ المقال كاملاً",
      href: "#",
    },
    related: [
      { category: "أنظمة التصميم", title: "مرافعة لصالح متغيرات أزرار أقل", href: "#" },
      { category: "أنظمة التصميم", title: "أوضاع كثافة دون تفريع مكوّناتك", href: "#" },
      { category: "الأساسيات", title: "الألوان الدلالية، طبقة تلو طبقة", href: "#" },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsPullQuoteFeatureCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const CARD =
  "group/card flex items-center gap-4 rounded-md border p-4 transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.92]"
const THUMB_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:motion-safe:scale-[1.06] group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:scale-[1.06]"
const CARD_TITLE_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:text-info group-focus-visible/card:[@container(min-width:40rem)]:text-info"

export interface BlogCardsPullQuoteFeatureProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsPullQuoteFeatureCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsPullQuoteFeature({
  locale = "en",
  panel,
  related,
  emptyLabel,
  className,
  ...props
}: BlogCardsPullQuoteFeatureProps) {
  const copy = COPY[locale]
  const quoteId = React.useId()
  const cardId = React.useId()
  const feature = panel === undefined ? copy.panel : panel
  const list = related ?? copy.related
  // On Tablet the cards sit two to a row, so an odd last one takes the full
  // width; on Desktop all of them share one row of three.
  const spanLast = list.length % 2 === 1

  return (
    <section
      aria-labelledby={feature ? quoteId : undefined}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
        {!feature && list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <>
            {feature ? (
              <figure className="flex flex-col items-center gap-5 rounded-xl bg-muted px-5 py-10 [@container(min-width:40rem)]:gap-6 [@container(min-width:40rem)]:px-10 [@container(min-width:40rem)]:py-12 [@container(min-width:64rem)]:px-20 [@container(min-width:64rem)]:py-16">
                <QuoteIcon aria-hidden="true" className="size-8 text-border" />
                <blockquote className="w-full">
                  <p
                    id={quoteId}
                    className="text-center text-3xl font-light text-foreground [@container(min-width:40rem)]:text-4xl"
                  >
                    {feature.quote}
                  </p>
                </blockquote>
                <figcaption className="flex flex-col items-center gap-1 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-3">
                  <Avatar variant="initials" size="32" radius="rounded" border name={feature.author} aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">{feature.author}</span>
                  <span
                    aria-hidden="true"
                    className="hidden size-[3px] rounded-full bg-muted-foreground [@container(min-width:40rem)]:block"
                  />
                  <span className="text-sm text-muted-foreground">{feature.role}</span>
                </figcaption>
                <a
                  href={feature.href}
                  className={cn(
                    buttonVariants({ variant: "default", size: "md" }),
                    "w-full [@container(min-width:40rem)]:w-auto"
                  )}
                >
                  {feature.actionLabel}
                  <ArrowRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                </a>
              </figure>
            ) : null}

            {list.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-3">
                {list.map((card, index) => (
                  <li
                    key={index}
                    className={cn(
                      "flex",
                      spanLast &&
                        index === list.length - 1 &&
                        "[@container(min-width:40rem)]:col-span-2 [@container(min-width:64rem)]:col-span-1"
                    )}
                  >
                    <a href={card.href} aria-labelledby={`${cardId}-${index}`} className={cn(CARD, "w-full")}>
                      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-sm bg-muted">
                        {card.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={card.image.src}
                            alt={card.image.alt}
                            loading="lazy"
                            className={cn(
                              "absolute inset-0 size-full object-cover transition-transform duration-[180ms] ease-out motion-reduce:transition-none",
                              THUMB_HOVER
                            )}
                          />
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-xs font-medium uppercase text-muted-foreground">{card.category}</span>
                        <h2
                          id={`${cardId}-${index}`}
                          className={cn(
                            "text-sm font-semibold text-foreground transition-colors duration-[180ms] motion-reduce:transition-none",
                            CARD_TITLE_HOVER
                          )}
                        >
                          {card.title}
                        </h2>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
