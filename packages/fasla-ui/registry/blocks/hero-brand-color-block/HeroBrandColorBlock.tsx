"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Brand Color-Block Hero.
 *
 * A brand introduction in two rows. On top, the brand's name set huge as a
 * wordmark, with a short tagline column beside it: a small line about the
 * company and a sentence about what it makes. Below, two blocks of colour:
 * an `info` panel holding the pitch (a small label, the headline, a
 * paragraph and two buttons), and a `warning` panel holding a round portrait
 * ringed by four tilted pill stickers, each a short brand promise.
 *
 * Desktop sets the wordmark and the tagline on one line, the tagline at the
 * end, both on the wordmark's baseline, and the two panels side by side,
 * 420px tall. Tablet stacks the tagline under a smaller wordmark and the
 * sticker panel under the copy panel, 380px each. Mobile shrinks the
 * wordmark again, sets the headline smaller, stacks the buttons at full
 * width and draws the stickers smaller in a 340px panel; there the portrait
 * runs 11px past the panel's end edge and is cropped by it, as Figma draws it.
 *
 * The wordmark row and the copy panel grow with their content: a longer
 * tagline, paragraph or button never gets cut off, and the panels only
 * keep Figma's height as a minimum. Each sticker is pinned to the panel
 * corner it sits nearest, so a longer sticker grows inward and stays inside
 * the panel.
 *
 * In Arabic the rows mirror: the wordmark sits on the right and the tagline
 * on the left, the copy panel on the right and the sticker panel on the
 * left. The stickers swap sides and tilt the other way, and the portrait
 * moves to the mirrored spot. Numbers stay left to right. The portrait is
 * never flipped.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container and everything inside, its padding included, follows it. Mobile
 * is the base; `[@container(min-width:48rem)]:` is Figma's Tablet (768) and
 * `[@container(min-width:90rem)]:` its Desktop, from 1440px, the width Figma
 * draws it at. Narrower, the two panels are too narrow for the stickers to
 * ring the portrait, so Tablet's layout covers 768 to 1439.
 */

export interface HeroBrandColorBlockAction {
  label: React.ReactNode
  href: string
}

export interface HeroBrandColorBlockPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroBrandColorBlockCopy {
  /** The brand's name, set huge across the top. Keep it to a word or two. */
  wordmark: React.ReactNode
  /** The small line at the top of the tagline column. Hidden when empty. */
  established: React.ReactNode
  /** The sentence under it. Hidden when empty. */
  tagline: React.ReactNode
  /** The small label above the headline. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroBrandColorBlockAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: HeroBrandColorBlockAction | null
  /**
   * The pill stickers around the portrait, short promises of a few words.
   * Figma shows four, and has a place for four: any after the fourth are
   * left out.
   */
  stickers: React.ReactNode[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroBrandColorBlockCopy> = {
  en: {
    wordmark: "northfield",
    established: (
      <>
        EST. <bdi dir="ltr">2019</bdi> · REMOTE-FIRST
      </>
    ),
    tagline: "A studio-built platform for teams that would rather ship than sit in meetings.",
    eyebrow: "WHAT WE MAKE",
    headline: "Software with a point of view",
    description: "One platform, opinionated defaults, and no settings page that takes an afternoon to read.",
    primaryAction: { label: "See the work", href: "#work" },
    secondaryAction: { label: "Read our principles", href: "#principles" },
    stickers: [
      "no dashboards for dashboards",
      "ship on Fridays",
      "calm by default",
      <>
        <bdi dir="ltr">140</bdi> humans
      </>,
    ],
  },
  ar: {
    wordmark: "شمال",
    established: (
      <>
        تأسست <bdi dir="ltr">2019</bdi>، العمل عن بُعد أولًا
      </>
    ),
    tagline: "منصة بناها استوديو، لفرق تفضّل الإنجاز على الجلوس في الاجتماعات.",
    eyebrow: "ما نصنعه",
    headline: "برمجيات لها وجهة نظر",
    description: "منصة واحدة، وإعدادات افتراضية مدروسة، ولا صفحة إعدادات تستغرق قراءتها ساعات.",
    primaryAction: { label: "شاهد الأعمال", href: "#work" },
    secondaryAction: { label: "اقرأ مبادئنا", href: "#principles" },
    stickers: [
      "لا لوحات من أجل اللوحات",
      "نطلق كل أسبوع",
      "هادئ افتراضيًا",
      <>
        <bdi dir="ltr">140</bdi> إنسانًا
      </>,
    ],
  },
}

/*
 * Where each sticker sits, in Figma's order: pinned to its nearest corner of
 * the panel, at Figma's offsets for each breakpoint, and tilted as Figma
 * tilts it. `start`/`end` swap sides in Arabic and the tilt is reversed, so
 * the stickers mirror as the Arabic variants draw them.
 */
const STICKER_PLACES = [
  "start-[18px] top-[50px] rotate-[6deg] [&:dir(rtl)]:-rotate-[6deg] [@container(min-width:48rem)]:start-[42px] [@container(min-width:48rem)]:top-[55px] [@container(min-width:90rem)]:start-[38px] [@container(min-width:90rem)]:top-[60px]",
  // Figma moved this one inward on Mobile so the panel doesn't cut it off.
  "end-[10px] top-[89px] -rotate-[8deg] [&:dir(rtl)]:rotate-[8deg] [@container(min-width:48rem)]:end-[72px] [@container(min-width:48rem)]:top-[100px] [@container(min-width:90rem)]:end-[55px] [@container(min-width:90rem)]:top-[111px]",
  "start-[29px] bottom-[71px] -rotate-[4deg] [&:dir(rtl)]:rotate-[4deg] [@container(min-width:48rem)]:start-[62px] [@container(min-width:48rem)]:bottom-[78px] [@container(min-width:90rem)]:start-[57px] [@container(min-width:90rem)]:bottom-[89px]",
  "end-[19px] bottom-[38px] rotate-[7deg] [&:dir(rtl)]:-rotate-[7deg] [@container(min-width:48rem)]:end-[141px] [@container(min-width:48rem)]:bottom-[38px] [@container(min-width:90rem)]:end-[120px] [@container(min-width:90rem)]:bottom-[47px]",
]

export interface HeroBrandColorBlockProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroBrandColorBlockCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The round portrait in the sticker panel. None by default: the circle
   * shows the `muted` colour in its place.
   * @default none: a `muted` placeholder
   */
  photo?: HeroBrandColorBlockPhoto
}

export function HeroBrandColorBlock({
  locale = "en",
  wordmark,
  established,
  tagline,
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  stickers,
  photo,
  className,
  ...props
}: HeroBrandColorBlockProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const since = established ?? copy.established
  const line = tagline ?? copy.tagline
  const label = eyebrow ?? copy.eyebrow
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const promises = (stickers ?? copy.stickers).slice(0, STICKER_PLACES.length)

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 p-4 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:p-6 [@container(min-width:90rem)]:gap-8 [@container(min-width:90rem)]:p-12">
        <div className="flex flex-col gap-6 [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-end [@container(min-width:90rem)]:justify-between">
          <p className="min-w-0 break-words text-6xl font-semibold text-foreground [@container(min-width:48rem)]:text-8xl [@container(min-width:90rem)]:text-9xl">
            {wordmark ?? copy.wordmark}
          </p>
          {since || line ? (
            <div className="flex flex-col gap-1.5 [@container(min-width:90rem)]:w-[300px] [@container(min-width:90rem)]:shrink-0">
              {since ? <p className="text-xs font-medium text-muted-foreground">{since}</p> : null}
              {line ? <p className="text-pretty text-sm text-muted-foreground">{line}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 [@container(min-width:90rem)]:grid [@container(min-width:90rem)]:grid-cols-2">
          <div className="flex min-h-[340px] min-w-0 flex-col justify-between gap-8 rounded-xl bg-info/20 p-10 [@container(min-width:48rem)]:min-h-[380px] [@container(min-width:90rem)]:min-h-[420px]">
            <div className="flex flex-col gap-4">
              {label ? <p className="text-sm font-medium text-foreground">{label}</p> : null}
              <h1 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-4xl">
                {headline ?? copy.headline}
              </h1>
              <p className="text-pretty text-base text-foreground">{description ?? copy.description}</p>
            </div>
            <div className="flex flex-col gap-3 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:flex-wrap">
              <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
                {primary.label}
              </a>
              {secondary ? (
                <a href={secondary.href} className={buttonVariants({ variant: "outline", size: "lg", radius: "rounded" })}>
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>

          <div className="relative h-[340px] min-w-0 overflow-hidden rounded-xl bg-warning/30 [@container(min-width:48rem)]:h-[380px] [@container(min-width:90rem)]:h-auto [@container(min-width:90rem)]:min-h-[420px]">
            {/*
               * The portrait is 240px at every width, set off the panel's
               * centre by Figma's offsets. A negative `ms` from `start-1/2`
               * places it, so it mirrors in Arabic without a transform.
               */}
            <div className="absolute start-1/2 top-1/2 -ms-[65px] -mt-[97px] size-60 overflow-hidden rounded-full border-[6px] border-background bg-muted [@container(min-width:48rem)]:-ms-[142px] [@container(min-width:48rem)]:-mt-[109px] [@container(min-width:90rem)]:-ms-[130px] [@container(min-width:90rem)]:-mt-[120px]">
              {photo ? (
                <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
              ) : null}
            </div>
            {promises.length > 0 ? (
              <ul>
                {promises.map((sticker, index) => (
                  <li
                    key={index}
                    className={cn(
                      "absolute whitespace-nowrap rounded-full bg-background px-[13px] py-1.5 text-xs font-semibold text-foreground shadow-sm ring-1 ring-inset ring-foreground [@container(min-width:48rem)]:px-4 [@container(min-width:48rem)]:py-2 [@container(min-width:48rem)]:text-sm [@container(min-width:48rem)]:ring-[1.5px]",
                      STICKER_PLACES[index]
                    )}
                  >
                    {sticker}
                  </li>
                ))}
              </ul>
            ) : null}
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
export const heroBrandColorBlockCopy = COPY
