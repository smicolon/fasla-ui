"use client"

import * as React from "react"
import { MapPin } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Illustration Split Hero.
 *
 * A friendly poster for a small place, a cat café and shelter in Figma's
 * copy: an eyebrow in `primary` capitals, a three-line headline set big and
 * bold, a paragraph, a solid and an outline button, and a large line
 * drawing beside them. A visit note closes the block under a thin line: a
 * map pin with the opening hours, and a sign-off in `primary`.
 *
 * Desktop sets the copy and the drawing side by side, the drawing 620px wide
 * at the end edge, and the visit note in one row, the hours at the start and
 * the sign-off at the end. Tablet stacks the copy, the drawing (520px, at the
 * start) and the visit note, its two lines one above the other. Mobile does
 * the same with a 300px drawing, and the buttons stack at full width.
 *
 * Figma draws a nav row at the top (the café's emblem and wordmark, five
 * links and an "Adopt a cat" button). It is left out: a hero is not a navbar.
 *
 * The drawing is artwork, passed in as `illustration`; it is not drawn here.
 * In Arabic everything mirrors, the drawing included: Figma's RTL variant
 * turns the cat to face the other way, so the image is flipped. The hours'
 * digits stay left to right.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroIllustrationSplitAction {
  label: React.ReactNode
  href: string
}

export interface HeroIllustrationSplitIllustration {
  src: string
  /** Describes the drawing. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroIllustrationSplitCopy {
  /** The line above the headline. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroIllustrationSplitAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: HeroIllustrationSplitAction | null
  /** The visit note's first line, after the map pin: where and when. Hidden when empty. */
  hours: React.ReactNode
  /** The visit note's sign-off, in `primary`. Hidden when empty. */
  note: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroIllustrationSplitCopy> = {
  en: {
    eyebrow: "GOOD COFFEE. WARM BISCUITS. SECOND CHANCES.",
    headline: "Bake it\ntill you\nmake it.",
    description:
      "A cat café & shelter where every cat has a chance, every biscuit is made with love, and every visit makes a difference.",
    primaryAction: { label: "Visit the café", href: "#visit" },
    secondaryAction: { label: "Meet your new friend", href: "#cats" },
    hours: (
      <>
        Your happy place around the corner · Open daily, <bdi dir="ltr">9am–6pm</bdi>
      </>
    ),
    note: "A little dough can do a lot of good.",
  },
  ar: {
    eyebrow: "قهوة طيبة، وبسكويت دافئ، وفرص جديدة.",
    headline: "اخبزها\nحتى\nتنجح.",
    description: "مقهى وملجأ للقطط، لكل قطة فيه فرصة، وكل بسكويتة تُصنع بحب، وكل زيارة تصنع فرقًا.",
    primaryAction: { label: "زر المقهى", href: "#visit" },
    secondaryAction: { label: "تعرّف على صديقك الجديد", href: "#cats" },
    hours: (
      <>
        مكانك السعيد قريب منك، مفتوح يوميًا من <bdi dir="ltr">9</bdi> صباحًا حتى <bdi dir="ltr">6</bdi> مساءً
      </>
    ),
    note: "القليل من العجين يصنع الكثير من الخير.",
  },
}

export interface HeroIllustrationSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroIllustrationSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The line drawing beside the copy, drawn for a 620 × 650 box. None by
   * default: a `muted` placeholder of the same size. It is mirrored in
   * Arabic, as Figma's RTL variant mirrors it.
   * @default none: a `muted` placeholder
   */
  illustration?: HeroIllustrationSplitIllustration
}

export function HeroIllustrationSplit({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  hours,
  note,
  illustration,
  className,
  ...props
}: HeroIllustrationSplitProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const where = hours ?? copy.hours
  const signOff = note ?? copy.note

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-1.5 [@container(min-width:90rem)]:px-16 [@container(min-width:90rem)]:pb-[30px] [@container(min-width:90rem)]:pt-11">
        <div className="flex flex-col items-start gap-10 [@container(min-width:48rem)]:gap-12 [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-8">
          <div className="flex w-full min-w-0 flex-col gap-[26px] [@container(min-width:90rem)]:max-w-[660px]">
            {label ? <p className="text-xs font-medium text-primary">{label}</p> : null}
            <h1 id={headingId} className="whitespace-pre-line text-5xl font-bold text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-8xl">
              {headline ?? copy.headline}
            </h1>
            <p className="text-pretty text-base text-foreground [@container(min-width:90rem)]:max-w-[510px]">{description ?? copy.description}</p>
            {/* Figma sets the buttons 5px further down than the rest of the column. */}
            <div className="mt-[5px] flex flex-col gap-3 [@container(min-width:48rem)]:flex-row">
              <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
                {primary.label}
              </a>
              {secondary ? (
                <a href={secondary.href} className={buttonVariants({ variant: "outline", tone: "primary", size: "lg", radius: "rounded" })}>
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>

          {/* The drawing's own box, 620 × 650 as Figma draws it, scaled down on Tablet and Mobile. */}
          <div className="relative aspect-[620/650] w-[300px] max-w-full shrink-0 overflow-hidden bg-muted [@container(min-width:48rem)]:w-[520px] [@container(min-width:90rem)]:w-[620px]">
            {illustration ? (
              // `contain`, not `cover`: a drawing is never cropped. A drawing
              // file keeps the colours it was drawn in, black line work on a
              // light ground, so in dark mode it sits on a light card rather
              // than vanishing into the dark page.
              <img
                src={illustration.src}
                alt={illustration.alt}
                decoding="async"
                className="absolute inset-0 size-full bg-background object-contain dark:rounded-3xl dark:bg-foreground [&:dir(rtl)]:-scale-x-100"
              />
            ) : null}
          </div>
        </div>

        {where || signOff ? (
          // Hugs its content and wraps rather than clipping: Figma fixed a
          // clipped visit note once, and long hours must never cut off.
          <div className="flex flex-col items-start border-t border-border pt-5 [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:flex-wrap [@container(min-width:90rem)]:items-center [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-x-8 [@container(min-width:90rem)]:gap-y-2">
            {where ? (
              <p className="flex items-center gap-2 text-base text-foreground">
                <MapPin aria-hidden className="size-4 shrink-0" />
                <span>{where}</span>
              </p>
            ) : null}
            {signOff ? <p className="text-lg font-medium text-primary [@container(min-width:48rem)]:text-xl">{signOff}</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroIllustrationSplitCopy = COPY
