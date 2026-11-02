"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Portrait Photo Cards + Link Row.
 *
 * A header row, a 48px heading at the start and a 14px description at the end
 * (a few of its phrases set heavier or underlined), then a link row (an 18px
 * Explore all templates link with an arrow) and four tall photo cards. A card
 * is the photo under a 45% `background-inverse` scrim with a 30px
 * two-line title in the inverse tokens at its bottom start corner.
 *
 * Desktop sets the four across at 297 × 400. Tablet sets them two across at
 * 310 × 360. Mobile makes a rail of 240 × 340 cards that scroll sideways and
 * snap. A card's photo grows 3% and its title rises 4px on hover, and the link's
 * arrow moves along the reading direction.
 *
 * Content limits: the heading up to 50 characters, a card's two title lines
 * up to 24 characters each. The other limits are in the block's documentation page.
 */

export interface FeaturesPortraitCard {
  /** Keys the card. */
  id: string
  /** The title's first line. */
  title: React.ReactNode
  /** The title's second line. */
  subtitle: React.ReactNode
  /** The card's photo. */
  image?: FeaturesPhoto
  /** Where the card goes. A card without one is not a link. */
  href?: string
}

export interface FeaturesPortraitPhotoCardsLinkRowCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The description beside the heading. */
  description: React.ReactNode
  /** The link's label. */
  linkLabel: React.ReactNode
  /** The cards, in order. */
  cards: FeaturesPortraitCard[]
  /** Names the scrolling rail on Mobile for assistive technology. */
  railLabel: string
}

const EMPHASIS = "font-semibold text-foreground"
const UNDERLINE = "text-foreground underline underline-offset-2"

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesPortraitPhotoCardsLinkRowCopy> = {
  en: {
    heading: "The largest library of ready-made workflows",
    description: (
      <>
        Choose from <span className={EMPHASIS}>production-ready</span> templates for planning, reporting and review. Build products using <span className={UNDERLINE}>Fasla templates</span>. Scale
        custom flows with <span className={UNDERLINE}>Fasla automation</span>. Connect your tools with <span className={UNDERLINE}>Fasla connectors</span>.
      </>
    ),
    linkLabel: "Explore all templates",
    railLabel: "Templates",
    cards: [
      { id: "quiet-hours", title: "Quiet Hours Planner", subtitle: "Goals to Daily Plan" },
      { id: "slow-morning", title: "Slow Morning Brief", subtitle: "Notes to Summary" },
      { id: "low-mist", title: "Low Mist Review", subtitle: "Files to Report" },
      { id: "window-light", title: "Window Light Handover", subtitle: "Chat to Brief" },
    ],
  },
  ar: {
    heading: "أكبر مكتبة لمسارات العمل الجاهزة",
    description: (
      <>
        اختر من قوالب <span className={EMPHASIS}>جاهزة للإنتاج</span> للتخطيط والتقارير والمراجعة. ابنِ منتجاتك <span className={UNDERLINE}>بقوالب فاصلة</span>. ووسّع مساراتك المخصصة{" "}
        <span className={UNDERLINE}>بأتمتة فاصلة</span>. واربط أدواتك <span className={UNDERLINE}>بموصّلات فاصلة</span>.
      </>
    ),
    linkLabel: "استكشف كل القوالب",
    railLabel: "القوالب",
    cards: [
      { id: "quiet-hours", title: "مخطِّط الساعات الهادئة", subtitle: "من الأهداف إلى خطة يومية" },
      { id: "slow-morning", title: "إيجاز الصباح الهادئ", subtitle: "من الملاحظات إلى ملخص" },
      { id: "low-mist", title: "مراجعة الضباب المنخفض", subtitle: "من الملفات إلى تقرير" },
      { id: "window-light", title: "تسليم ضوء النافذة", subtitle: "من المحادثة إلى إيجاز" },
    ],
  },
}

export interface FeaturesPortraitPhotoCardsLinkRowProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesPortraitPhotoCardsLinkRowCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** Where the Explore all templates link goes. Without it, the link calls `onExplore`. */
  linkHref?: string
  /** Called when the link is pressed and has no `linkHref`. */
  onExplore?: () => void
}

export function FeaturesPortraitPhotoCardsLinkRow({
  locale = "en",
  heading,
  description,
  linkLabel,
  cards,
  railLabel,
  linkHref,
  onExplore,
  className,
  ...props
}: FeaturesPortraitPhotoCardsLinkRowProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = cards ?? copy.cards
  const linkClass =
    "group/link inline-flex items-center gap-3 self-start text-lg font-medium text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  const arrow = (
    <ArrowRight
      size={18}
      strokeWidth={1.5}
      absoluteStrokeWidth
      aria-hidden
      className="[&:dir(rtl)]:-scale-x-100 motion-safe:transition-transform motion-safe:group-hover/link:translate-x-1 motion-safe:rtl:group-hover/link:-translate-x-1"
    />
  )

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <div className="flex flex-col gap-6 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-start [@container(min-width:72rem)]:justify-between [@container(min-width:72rem)]:gap-16">
        <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:72rem)]:max-w-[540px] [@container(min-width:72rem)]:text-5xl">
          {heading ?? copy.heading}
        </h2>
        <p className="text-sm text-muted-foreground [@container(min-width:72rem)]:max-w-[470px]">{description ?? copy.description}</p>
      </div>
      {linkHref ? (
        <a href={linkHref} className={linkClass}>
          {linkLabel ?? copy.linkLabel}
          {arrow}
        </a>
      ) : (
        <button type="button" onClick={onExplore} className={linkClass}>
          {linkLabel ?? copy.linkLabel}
          {arrow}
        </button>
      )}
      {list.length > 0 ? (
        <ul
          role="list"
          tabIndex={0}
          aria-label={railLabel ?? copy.railLabel}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain [touch-action:pan-x_pan-y] focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [@container(min-width:48rem)]:grid [@container(min-width:48rem)]:snap-none [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:48rem)]:overflow-visible [@container(min-width:72rem)]:grid-cols-4"
        >
          {list.map((card) => {
            const body = (
              <>
                <div aria-hidden="true" className="absolute inset-0 bg-background-inverse/[0.45]" />
                <p className="relative text-2xl font-semibold text-foreground-inverse motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 [@container(min-width:72rem)]:text-3xl">
                  {card.title}
                  <br />
                  {card.subtitle}
                </p>
              </>
            )
            const frame =
              "group relative isolate flex h-[340px] w-[240px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-lg bg-background-inverse p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [@container(min-width:48rem)]:h-auto [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:aspect-[310/360] [@container(min-width:72rem)]:aspect-[297/400]"
            const photo = card.image ? (
              <img
                src={card.image.src}
                alt={card.image.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-10 size-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
              />
            ) : null
            return (
              <li key={card.id} className="contents">
                {card.href ? (
                  <a href={card.href} className={frame}>
                    {photo}
                    {body}
                  </a>
                ) : (
                  <div className={frame}>
                    {photo}
                    {body}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresPortraitPhotoCardsLinkRowCopy = COPY
