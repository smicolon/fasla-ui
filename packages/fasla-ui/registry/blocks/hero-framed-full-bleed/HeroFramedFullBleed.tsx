"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Framed Full-Bleed Hero.
 *
 * One large photo in a rounded frame, darkened by the backdrop overlay, with
 * the pitch laid over its lower half: a pill, the headline, a
 * paragraph, a light button and a text link. A frosted card on the end side
 * holds the proof: a row of faces, a figure and a line about it.
 *
 * Desktop sets the copy at the bottom start of the frame and the card at the
 * bottom end. Tablet and Mobile stack the card under the copy at full width,
 * both at the foot of the frame; Mobile also stacks the button over the link.
 *
 * The photo spans the frame at every width. From Tablet up to Desktop the
 * copy and the card keep Figma's Tablet width, 640px inside the frame's
 * 40px padding, and centre in it, so a wide frame isn't a stretched one.
 *
 * The scrim is dark and the text light in both modes, as Figma draws them:
 * a photograph does not change with the theme. In light mode that is the
 * inverse tokens; in dark mode the page's own `foreground` and
 * `muted-foreground` hold the same colours, so `dark:` switches to them, as
 * Gallery's Full-Bleed Slider and Error State's Full-Bleed Photo do.
 *
 * The frame is Figma's height at each width, 852px on Desktop, 820 on
 * Tablet and 640 on Mobile, and grows past it only for longer copy. The photo fills it and is cropped,
 * never flipped. In Arabic the copy and the card swap sides and the link's
 * arrow points left; figures stay left to right.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroFramedFullBleedAction {
  label: React.ReactNode
  href: string
}

export interface HeroFramedFullBleedPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroFramedFullBleedPerson {
  /** The face. Without it the avatar shows the name's initials. */
  src?: string
  /** The person's name: the photo's `alt` and the source of the initials. */
  name: string
}

export interface HeroFramedFullBleedCopy {
  /** The pill above the headline, on the backdrop overlay. Hidden when empty. */
  label: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The light button. */
  primaryAction: HeroFramedFullBleedAction
  /** The text link beside it, with an arrow. Hidden when null. */
  secondaryAction: HeroFramedFullBleedAction | null
  /** The card's figure. Shown left to right in either language. */
  statValue: React.ReactNode
  /** The line under the figure. */
  statLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroFramedFullBleedCopy> = {
  en: {
    label: (
      <>
        New collection · Autumn <bdi dir="ltr">2026</bdi>
      </>
    ),
    headline: "Spaces that feel\nlike home.",
    description: "Interior design and furnishing for homes that are calm, warm and made to be lived in.",
    primaryAction: { label: "Book a consultation", href: "#consultation" },
    secondaryAction: { label: "See our projects", href: "#projects" },
    statValue: "1,200+",
    statLabel: "Homes designed and furnished since we opened our doors.",
  },
  ar: {
    label: (
      <>
        مجموعة جديدة، خريف <bdi dir="ltr">2026</bdi>
      </>
    ),
    headline: "مساحات تشعرك\nبأنك في بيتك.",
    description: "تصميم داخلي وتأثيث لبيوت هادئة ودافئة، صُممت لتُعاش.",
    primaryAction: { label: "احجز استشارة", href: "#consultation" },
    secondaryAction: { label: "شاهد مشاريعنا", href: "#projects" },
    statValue: "1,200+",
    statLabel: "بيت صممناه وأثثناه منذ أن فتحنا أبوابنا.",
  },
}

/**
 * The frosted surface Figma lays under the card: the light foreground at 20%,
 * light in both modes. Figma lays it under the pill too; there it lit the
 * pill over a bright sky until white type failed, so the pill sits on the
 * backdrop overlay instead.
 */
const GLASS = "bg-primary-foreground/20 dark:bg-primary/20"

export interface HeroFramedFullBleedProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroFramedFullBleedCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo that fills the frame. None by default: the frame shows the
   * inverse background under the overlay, so the copy stays readable.
   * @default none: an inverse placeholder
   */
  photo?: HeroFramedFullBleedPhoto
  /**
   * The faces on the card. Figma shows three. None by default: the row is
   * left out.
   * @default none
   */
  people?: HeroFramedFullBleedPerson[]
}

export function HeroFramedFullBleed({
  locale = "en",
  label,
  headline,
  description,
  primaryAction,
  secondaryAction,
  statValue,
  statLabel,
  photo,
  people,
  className,
  ...props
}: HeroFramedFullBleedProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const pill = label ?? copy.label
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      <div className="mx-auto w-full max-w-[1440px] p-4 [@container(min-width:48rem)]:p-6">
        <div className="relative isolate flex min-h-[640px] flex-col justify-end gap-8 overflow-hidden rounded-[2rem] bg-background-inverse p-6 dark:bg-muted [@container(min-width:48rem)]:min-h-[820px] [@container(min-width:48rem)]:p-10 [@container(min-width:90rem)]:min-h-[852px] [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-end [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:p-[72px]">
          {photo ? (
            <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 -z-10 size-full object-cover" />
          ) : null}
          {/*
           * The scrim: the backdrop overlay over the whole photo, at the
           * token's own strength (60% light, 80% dark). Weaker, white type
           * fails over a bright window.
           */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-backdrop-overlay" />

          <div className="flex w-full min-w-0 flex-col items-start gap-6 [@container(min-width:48rem)]:mx-auto [@container(min-width:48rem)]:max-w-[40rem] [@container(min-width:90rem)]:mx-0 [@container(min-width:90rem)]:max-w-[760px]">
            {pill ? (
              <p className="rounded-full bg-backdrop-overlay px-3 text-xs font-medium text-foreground-inverse dark:text-foreground">{pill}</p>
            ) : null}
            <h1
              id={headingId}
              className="whitespace-pre-line text-3xl font-semibold text-foreground-inverse dark:text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl"
            >
              {headline ?? copy.headline}
            </h1>
            <p className="text-pretty text-base text-muted-foreground-inverse dark:text-muted-foreground [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[480px]">
              {description ?? copy.description}
            </p>
            <div className="flex w-full flex-col gap-5 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center">
              <a href={primary.href} className={buttonVariants({ variant: "secondary", size: "lg", radius: "rounded", className: "dark:bg-primary dark:text-primary-foreground" })}>
                {primary.label}
              </a>
              {secondary ? (
                <a
                  href={secondary.href}
                  className="relative inline-flex items-center gap-1 self-start rounded-sm before:absolute before:-inset-x-1 before:-inset-y-3 text-sm font-medium text-foreground-inverse [outline:none] dark:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse focus-visible:dark:outline-foreground [@container(min-width:48rem)]:self-auto"
                >
                  {secondary.label}
                  <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
                </a>
              ) : null}
            </div>
          </div>

          <div
            className={cn(
              "flex w-full shrink-0 flex-col gap-3 rounded-3xl p-6 backdrop-blur-xl [@container(min-width:48rem)]:mx-auto [@container(min-width:48rem)]:max-w-[40rem] [@container(min-width:90rem)]:mx-0 [@container(min-width:90rem)]:w-[280px] [@container(min-width:90rem)]:max-w-none",
              GLASS
            )}
          >
            {people && people.length > 0 ? (
              <div className="flex gap-1">
                {people.map((person, index) => (
                  <Avatar key={index} variant="image" size="32" radius="rounded" border src={person.src} name={person.name} />
                ))}
              </div>
            ) : null}
            <p className="text-3xl font-semibold text-foreground-inverse dark:text-foreground [@container(min-width:48rem)]:text-4xl">
              <bdi dir="ltr">{statValue ?? copy.statValue}</bdi>
            </p>
            <p className="text-sm text-foreground-inverse dark:text-foreground">{statLabel ?? copy.statLabel}</p>
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
export const heroFramedFullBleedCopy = COPY
