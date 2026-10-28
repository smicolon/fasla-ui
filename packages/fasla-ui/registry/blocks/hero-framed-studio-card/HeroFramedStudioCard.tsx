"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Framed Studio Card Hero.
 *
 * A studio's pitch on one white card set on a `muted` ground, like a print
 * proof: an outline badge, the headline, a client's word on the work (the
 * client's name, a "read the story" link, the quote and who said it, with
 * their face), two buttons and a photo. A thin line closes the card off from
 * a strip of client wordmarks, set as text.
 *
 * Desktop sets the copy and the photo side by side and the wordmarks in one
 * row; thin guide lines run along the card's edges out to the block's, and a
 * small crop mark sits on each corner. Both are decoration and Desktop only.
 * Tablet and Mobile stack the copy over the photo and wrap the wordmarks;
 * Mobile also stacks the buttons at full width and puts the strip's label on
 * a line of its own.
 *
 * Figma draws a nav row at the top of the card (the studio's wordmark, links
 * and a "Contact us" button). It is left out: a hero is not a navbar.
 *
 * In Arabic the copy moves to the right and the photo to the left, the
 * strip's label leads from the right and the link's arrow points up and to
 * the left. The photo is never flipped.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroFramedStudioCardAction {
  label: React.ReactNode
  href: string
}

export interface HeroFramedStudioCardPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroFramedStudioCardCopy {
  /** The outline badge above the headline, after its dot. Hidden when empty. */
  badge: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The client whose words follow, set as a wordmark. */
  client: React.ReactNode
  /** The link beside the client's name, with an arrow. Hidden when null. */
  storyAction: HeroFramedStudioCardAction | null
  /** The client's words, quotation marks included. */
  quote: React.ReactNode
  /** Who said it. */
  authorName: React.ReactNode
  /** Their role, under the name. */
  authorRole: React.ReactNode
  /** The solid button. */
  primaryAction: HeroFramedStudioCardAction
  /** The soft button beside it. Hidden when null. */
  secondaryAction: HeroFramedStudioCardAction | null
  /** The label that leads the strip. A line break in the string breaks the line, from Tablet up. */
  clientsLabel: React.ReactNode
  /** The client wordmarks in the strip, set as text. Figma shows five. */
  clients: React.ReactNode[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroFramedStudioCardCopy> = {
  en: {
    badge: "Full-service digital studio",
    headline: "Designing digital products people return to",
    client: "Tessaro",
    storyAction: { label: "Read story", href: "#story" },
    quote: "“Our new site launched on time, and sign-ups doubled in the first month.”",
    authorName: "Lina K.",
    authorRole: "Founder, Tessaro",
    primaryAction: { label: "Book a call", href: "#call" },
    secondaryAction: { label: "See our work", href: "#work" },
    clientsLabel: "TRUSTED BY STARTUPS AND\nGROWING TEAMS",
    clients: ["Corvane", "Halcyn", "Nuvra", "Oblique", "Marloe"],
  },
  ar: {
    badge: "استوديو رقمي متكامل",
    headline: "نصمم منتجات رقمية يعود إليها الناس",
    client: "رواق",
    storyAction: { label: "اقرأ القصة", href: "#story" },
    quote: "«أُطلق موقعنا الجديد في موعده، وتضاعفت التسجيلات في الشهر الأول.»",
    authorName: "لينا خالد",
    authorRole: "مؤسسة رواق",
    primaryAction: { label: "احجز مكالمة", href: "#call" },
    secondaryAction: { label: "شاهد أعمالنا", href: "#work" },
    clientsLabel: "تثق بنا الشركات الناشئة\nوالفرق النامية",
    clients: ["كروان", "سراج", "وهج", "مرآة", "أفق"],
  },
}

export interface HeroFramedStudioCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroFramedStudioCardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo beside the copy. None by default: a `muted` placeholder of the
   * same size.
   * @default none: a `muted` placeholder
   */
  photo?: HeroFramedStudioCardPhoto
  /**
   * The face beside the quote's author. Its `alt` can be "": the name
   * beside it already says who it is. None by default: the avatar shows its
   * icon.
   * @default none: the avatar's icon
   */
  authorPhoto?: HeroFramedStudioCardPhoto
}

export function HeroFramedStudioCard({
  locale = "en",
  badge,
  headline,
  client,
  storyAction,
  quote,
  authorName,
  authorRole,
  primaryAction,
  secondaryAction,
  clientsLabel,
  clients,
  photo,
  authorPhoto,
  className,
  ...props
}: HeroFramedStudioCardProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = badge ?? copy.badge
  const story = storyAction === undefined ? copy.storyAction : storyAction
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const marks = clients ?? copy.clients

  return (
    <section aria-labelledby={headingId} className={cn("relative isolate [container-type:inline-size] bg-muted", className)} {...props}>
      {/* Figma's guides along the card's top and bottom edges, out to the block's sides. Desktop only. */}
      <span aria-hidden className="absolute inset-x-0 top-12 -z-10 hidden h-px bg-border [@container(min-width:90rem)]:block" />
      <span aria-hidden className="absolute inset-x-0 bottom-12 -z-10 hidden h-px bg-border [@container(min-width:90rem)]:block" />

      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] p-4 [@container(min-width:48rem)]:p-6 [@container(min-width:90rem)]:px-16 [@container(min-width:90rem)]:py-12">
        {/*
           * On Desktop Figma pads the card 56px at the start and 48 at the
           * end: the photo runs to 48, the strip stops at 56 (its `me-2`).
           */}
        <div className="relative flex flex-col gap-8 bg-background p-5 [@container(min-width:48rem)]:gap-10 [@container(min-width:48rem)]:p-10 [@container(min-width:90rem)]:gap-8 [@container(min-width:90rem)]:pb-16 [@container(min-width:90rem)]:pe-12 [@container(min-width:90rem)]:ps-14 [@container(min-width:90rem)]:pt-10">
          {/* The guides down the card's sides, behind it, and a crop mark on each corner. Desktop only. */}
          <span aria-hidden className="absolute -inset-y-12 start-0 -z-10 hidden w-px bg-border [@container(min-width:90rem)]:block" />
          <span aria-hidden className="absolute -inset-y-12 end-0 -z-10 hidden w-px bg-border [@container(min-width:90rem)]:block" />
          <span aria-hidden className="absolute -start-1 -top-1 hidden size-[9px] bg-ring [@container(min-width:90rem)]:block" />
          <span aria-hidden className="absolute -end-1 -top-1 hidden size-[9px] bg-ring [@container(min-width:90rem)]:block" />
          <span aria-hidden className="absolute -bottom-1 -start-1 hidden size-[9px] bg-ring [@container(min-width:90rem)]:block" />
          <span aria-hidden className="absolute -bottom-1 -end-1 hidden size-[9px] bg-ring [@container(min-width:90rem)]:block" />

          <div className="flex flex-col gap-8 [@container(min-width:48rem)]:gap-10 [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-center [@container(min-width:90rem)]:gap-12">
            <div className="flex w-full flex-col items-start gap-8 [@container(min-width:90rem)]:w-[560px] [@container(min-width:90rem)]:shrink-0">
              {label ? (
                <Badge variant="outline" tone="secondary" size="md" radius="rounded">
                  <span aria-hidden>●</span> {label}
                </Badge>
              ) : null}
              <h1
                id={headingId}
                className="whitespace-pre-line text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl"
              >
                {headline ?? copy.headline}
              </h1>

              <figure className="flex w-full flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-base font-semibold text-foreground [@container(min-width:48rem)]:text-lg">{client ?? copy.client}</p>
                  {story ? (
                    <a
                      href={story.href}
                      className="relative inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-sm before:absolute before:-inset-x-1 before:-inset-y-3 text-sm font-medium text-foreground [outline:none] hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {story.label}
                      <ArrowUpRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
                    </a>
                  ) : null}
                </div>
                <blockquote className="text-pretty text-base text-muted-foreground">{quote ?? copy.quote}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <Avatar variant="image" size="32" radius="rounded" src={authorPhoto?.src} name={authorPhoto?.alt ?? ""} />
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{authorName ?? copy.authorName}</span>
                    <span className="text-xs text-muted-foreground">{authorRole ?? copy.authorRole}</span>
                  </span>
                </figcaption>
              </figure>

              <div className="flex w-full flex-col gap-3 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row">
                <a href={primary.href} className={buttonVariants({ size: "lg" })}>
                  {primary.label}
                </a>
                {secondary ? (
                  <a href={secondary.href} className={buttonVariants({ variant: "soft", size: "lg" })}>
                    {secondary.label}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="relative h-60 w-full overflow-hidden rounded-3xl bg-muted [@container(min-width:48rem)]:h-[360px] [@container(min-width:90rem)]:h-[596px] [@container(min-width:90rem)]:min-w-0 [@container(min-width:90rem)]:flex-1">
              {photo ? (
                <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
              ) : null}
            </div>
          </div>

          {/*
             * A plain 1px line where Figma draws its Separator. Swap in
             * Separator once it is built. On Desktop it runs edge to edge
             * across the card, 40px under the photo.
             */}
          <div aria-hidden className="h-px bg-border [@container(min-width:90rem)]:-me-12 [@container(min-width:90rem)]:-ms-14 [@container(min-width:90rem)]:mt-2" />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-muted-foreground [@container(min-width:48rem)]:gap-x-10 [@container(min-width:90rem)]:me-2 [@container(min-width:90rem)]:flex-nowrap [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-x-6">
            <p className="w-full text-xs font-medium [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:whitespace-pre-line">
              {clientsLabel ?? copy.clientsLabel}
            </p>
            {/* `contents` lets the wordmarks wrap in one flow with the label, as Figma's strip does. */}
            <ul role="list" className="contents">
              {marks.map((mark, index) => (
                <li key={index} className="whitespace-nowrap text-lg font-semibold [@container(min-width:48rem)]:text-2xl">
                  {mark}
                </li>
              ))}
            </ul>
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
export const heroFramedStudioCardCopy = COPY
