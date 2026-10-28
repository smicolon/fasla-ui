"use client"

import * as React from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Wave Band Hero.
 *
 * A centred pitch over a band of colour: a pill announcing the project is
 * open source, with a link to its code, the headline, a paragraph and two
 * buttons. Under them two `success` sleeves sweep in from the edges and meet
 * at a handshake, a cut-out photo, each sleeve ending in a `foreground` cuff
 * with two buttons. A short caption rides each sleeve, tilted with it. A
 * trust strip closes the block: a line about the customers and a row of
 * text wordmarks, under a 1px rule.
 *
 * Desktop draws the band 1440 × 480 across the block's full width, starting
 * 24px above the foot of the buttons, with the strip laid over its lower
 * part. Tablet draws it at half that size, 720 × 240, between the copy and
 * the strip. Mobile scales the same drawing to about 39%, centred and cut at
 * the content's edges, drops the captions, stacks the buttons at full width
 * and puts the wordmarks under the line, wrapping.
 *
 * The navigation row Figma draws above the copy (the Weavely wordmark, five
 * links, "Sign in" and "Talk to sales") is left out: a hero is not a navbar.
 * The 152px Figma leaves above the pill is mostly that row; without it the
 * copy starts 96px down on Desktop, 64 on Tablet and 32 on Mobile.
 *
 * Wider than Figma's 1440, the band keeps its drawing at 1440 and its two
 * sleeves run on, flat, to the block's edges, so they never stop mid-page.
 *
 * In Arabic the drawing mirrors: the sleeves, the cuffs and the captions
 * swap sides, and the captions tilt the other way. The photo moves with the
 * drawing but is never flipped. The arrows point left; numbers stay left to
 * right.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroWaveBandAction {
  label: React.ReactNode
  href: string
}

export interface HeroWaveBandPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroWaveBandCopy {
  /** The pill's first part, in `success`. The pill is hidden when this is empty. */
  announcement: React.ReactNode
  /** The link at the pill's end, with an arrow. Hidden when null. */
  announcementAction: HeroWaveBandAction | null
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroWaveBandAction
  /** The outline button beside it, with an arrow. Hidden when null. */
  secondaryAction: HeroWaveBandAction | null
  /**
   * The captions on the sleeves, start side first. Figma shows two. Tablet
   * and Desktop only.
   */
  captions: [React.ReactNode, React.ReactNode]
  /** The line at the start of the trust strip. */
  trustStatement: React.ReactNode
  /** The customer names set as wordmarks at its end. Figma shows four. */
  wordmarks: React.ReactNode[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroWaveBandCopy> = {
  en: {
    announcement: "WE’RE OPEN SOURCE",
    announcementAction: { label: "See the source", href: "#source" },
    headline: "Project management,\nmade for working together.",
    description:
      "From the first idea to the finish line. Bring issues, sprints, and roadmaps into one calm workspace your whole team can call home.",
    primaryAction: {
      label: (
        <>
          Get started in <bdi dir="ltr">30</bdi> seconds
        </>
      ),
      href: "#get-started",
    },
    secondaryAction: { label: "Book a demo", href: "#demo" },
    captions: ["No credit card. No chaos.", "Great things take a team."],
    trustStatement: (
      <>
        A shared workspace for <bdi dir="ltr">1,000+</bdi> ambitious teams.
      </>
    ),
    wordmarks: ["Corvane", "Tessaro", "Oblique", "Marloe"],
  },
  ar: {
    announcement: "مفتوح المصدر",
    announcementAction: { label: "اطّلع على الشيفرة", href: "#source" },
    headline: "إدارة المشاريع\nصُممت للعمل معًا.",
    description:
      "من الفكرة الأولى حتى خط النهاية. اجمع المهام والدورات وخطط الطريق في مساحة عمل هادئة يعتبرها فريقك كله بيته.",
    primaryAction: {
      label: (
        <>
          ابدأ في <bdi dir="ltr">30</bdi> ثانية
        </>
      ),
      href: "#get-started",
    },
    secondaryAction: { label: "احجز عرضًا", href: "#demo" },
    captions: ["بلا بطاقة ائتمان، وبلا فوضى.", "الأشياء العظيمة تحتاج إلى فريق."],
    trustStatement: (
      <>
        مساحة عمل مشتركة لأكثر من <bdi dir="ltr">1,000</bdi> فريق طموح.
      </>
    ),
    wordmarks: ["كروان", "رواق", "مرآة", "أفق"],
  },
}

/*
 * Figma's sleeves and cuffs, in the band's own 1440 × 480 frame (Desktop's
 * size; Tablet and Mobile scale it). Each sleeve ends in a straight cut at
 * the block's edge; `RUN_ON` carries that cut on, flat, past 1440.
 */
const START_SLEEVE =
  "M 0 1.0926 C 150 -8.9389 330 51.2502 570 134.5117 L 515 290 C 322 217.7732 132 219.7795 0 249.874 L 0 1.0926 Z"
const END_SLEEVE =
  "M 0 180.7385 C 207 152.3077 366 37.5692 570 0 L 570 264 C 365 349.2923 185 314.7692 40 330 L 0 180.7385 Z"
const START_CUFF = "M 3.9335 0 L 50.1085 0.3422 L 50.1085 151.3421 L 0.0001 151.7607 L 3.9335 0 Z"
const END_CUFF = "M 0 0 L 52.0847 0.1416 L 52.4019 145.5595 L 0 144.982 L 0 0 Z"
const RUN_ON = 4000

export interface HeroWaveBandProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroWaveBandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The handshake where the sleeves meet: a cut-out on a transparent
   * background, so the band shows around it. None by default: a `muted`
   * box of the same size holds its place.
   * @default none: a `muted` placeholder
   */
  photo?: HeroWaveBandPhoto
}

export function HeroWaveBand({
  locale = "en",
  announcement,
  announcementAction,
  headline,
  description,
  primaryAction,
  secondaryAction,
  captions,
  trustStatement,
  wordmarks,
  photo,
  className,
  ...props
}: HeroWaveBandProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const pill = announcement ?? copy.announcement
  const pillAction = announcementAction === undefined ? copy.announcementAction : announcementAction
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const [startCaption, endCaption] = captions ?? copy.captions
  const names = wordmarks ?? copy.wordmarks

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] overflow-hidden bg-background", className)}
      {...props}
    >
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-0 [@container(min-width:90rem)]:px-16 [@container(min-width:90rem)]:pb-[30px] [@container(min-width:90rem)]:pt-24">
        <div className="flex w-full flex-col items-center gap-[22px] text-center [@container(min-width:90rem)]:mx-auto [@container(min-width:90rem)]:max-w-[1040px]">
          {pill ? (
            <p className="inline-flex items-center gap-4 rounded-full px-[15px] py-2 text-xxs font-medium ring-1 ring-inset ring-success">
              <span className="whitespace-nowrap text-foreground">{pill}</span>
              {pillAction ? (
                <a
                  href={pillAction.href}
                  className="relative inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm text-foreground before:absolute before:-inset-x-1 before:-inset-y-3 [outline:none] hover:underline hover:underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {pillAction.label}
                  <ArrowUpRight size={10} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
                </a>
              ) : null}
            </p>
          ) : null}
          <h1
            id={headingId}
            className="whitespace-pre-line text-balance text-3xl font-medium text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="text-balance text-base text-muted-foreground [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[650px]">
            {description ?? copy.description}
          </p>
          {/* Figma pads the buttons 3px further down than the rest of the column. */}
          <div className="flex w-full flex-col gap-3 pt-[3px] [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row">
            <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline", tone: "primary", size: "lg", radius: "rounded" })}>
                {secondary.label}
                <ArrowRight aria-hidden strokeWidth={1.5} absoluteStrokeWidth className="[&:dir(rtl)]:-scale-x-100" />
              </a>
            ) : null}
          </div>
        </div>

        {/*
         * The band. Its drawing is one 1440 × 480 frame (3:1) that scales
         * with its width: the content's full width on Tablet, 171% of it on
         * Mobile, centred and cut at the content's edges as Figma cuts it,
         * and a fixed 1440px on Desktop. There the band starts 24px above
         * the buttons' foot and takes only 377px of the column, so the trust
         * strip lies over its lower part; the section crops what runs past
         * its bottom edge, as Figma does.
         */}
        <div className="pointer-events-none relative flex items-start justify-center overflow-hidden [@container(min-width:90rem)]:-mt-6 [@container(min-width:90rem)]:h-[377px] [@container(min-width:90rem)]:overflow-visible">
          <div className="relative aspect-[3/1] w-[171.43%] shrink-0 [@container(min-width:48rem)]:w-full [@container(min-width:90rem)]:w-[1440px]">
            <div className="absolute start-[29.375%] top-[22.708%] h-[75.833%] w-[40.417%] overflow-hidden bg-muted">
              {photo ? (
                <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
              ) : null}
            </div>

            <svg
              aria-hidden
              viewBox="0 0 1440 480"
              className="absolute inset-0 size-full overflow-visible [&:dir(rtl)]:-scale-x-100"
            >
              <g className="fill-success">
                <g transform="translate(-20 42)">
                  <path d={START_SLEEVE} />
                  <rect x={-RUN_ON} y={1.0926} width={RUN_ON + 1} height={248.7814} />
                </g>
                <g transform="translate(900 0)">
                  <path d={END_SLEEVE} />
                  <rect x={569} y={0} width={RUN_ON} height={264} />
                </g>
              </g>
              <g className="fill-foreground">
                <path d={START_CUFF} transform="translate(543.896 181.668) rotate(18)" />
                <path d={END_CUFF} transform="translate(851.167 199.146) rotate(-14.8)" />
              </g>
              <g className="fill-background">
                <circle cx={530} cy={306} r={6} />
                <circle cx={524} cy={322} r={6} />
                <circle cx={878.485} cy={205.344} r={6} />
                <circle cx={883.485} cy={220.344} r={6} />
              </g>
            </svg>

            {/*
             * Tilted with their sleeves, from the start corner of each line.
             * In Arabic they swap sides and tilt the other way.
             */}
            <p className="absolute start-[6.667%] top-[38.542%] hidden origin-top-left -rotate-[9deg] whitespace-nowrap text-xs text-foreground dark:text-success-foreground [&:dir(rtl)]:origin-top-right [&:dir(rtl)]:rotate-[9deg] [@container(min-width:48rem)]:block [@container(min-width:90rem)]:text-2xl">
              {startCaption}
            </p>
            <p className="absolute start-[75.694%] top-[33.542%] hidden origin-top-left rotate-[10deg] whitespace-nowrap text-xs text-foreground dark:text-success-foreground [&:dir(rtl)]:origin-top-right [&:dir(rtl)]:-rotate-[10deg] [@container(min-width:48rem)]:block [@container(min-width:90rem)]:text-2xl">
              {endCaption}
            </p>
          </div>
        </div>

        <div className="relative flex flex-col border-t border-border pt-5 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-6">
          <p className="text-pretty text-xs text-muted-foreground">{trustStatement ?? copy.trustStatement}</p>
          <ul className="flex flex-wrap items-center gap-x-[46px] gap-y-3 [@container(min-width:48rem)]:shrink-0 [@container(min-width:48rem)]:flex-nowrap">
            {names.map((name, index) => (
              <li key={index} className="whitespace-nowrap text-lg font-semibold text-muted-foreground [@container(min-width:48rem)]:text-xl">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroWaveBandCopy = COPY
