"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Editorial Triptych Hero.
 *
 * A studio introduction in three panels. The copy column holds the headline,
 * a paragraph and a button at its top, and a figure with a row of four faces
 * at its foot; a tall photo stands in the middle; the third column holds a
 * small gallery (a rating, a line, two photos side by side and a pager) and,
 * at its foot, a closing title, a dashed line and a short paragraph.
 *
 * Desktop sets the three panels side by side at the block's full height: the
 * copy column at 400px, the photo at 440 and the third column filling the
 * rest, its gallery halfway down. Tablet puts the copy column beside a
 * 320 × 560 photo, and the gallery beside the closing words in a row below.
 * Mobile stacks everything in reading order: copy, photo, figure, gallery,
 * closing words.
 *
 * In Arabic the panels mirror: the copy sits on the right and the gallery on
 * the left, the faces and the two gallery photos run from the right, and the
 * pager's arrows point the other way. Numbers stay left to right. The photos
 * are never flipped.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container and everything inside, its padding included, follows it. Mobile
 * is the base; `[@container(min-width:48rem)]:` is Figma's Tablet (768) and
 * `[@container(min-width:90rem)]:` its Desktop, from 1440px, the width Figma
 * draws it at. Narrower, the three panels squeeze, so Tablet's layout covers
 * 768 to 1439.
 */

export interface HeroEditorialTriptychAction {
  label: React.ReactNode
  href: string
}

export interface HeroEditorialTriptychPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroEditorialTriptychPerson {
  /** The face. Without it the avatar shows the name's initials. */
  src?: string
  /** The person's name: the photo's `alt` and the source of the initials. */
  name: string
}

export interface HeroEditorialTriptychCopy {
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  action: HeroEditorialTriptychAction
  /** The figure at the foot of the copy column. Shown left to right in either language. */
  statValue: React.ReactNode
  /** The line under the figure. */
  statLabel: React.ReactNode
  /** The gallery's title, an `h2`. */
  galleryTitle: React.ReactNode
  /** The line under the gallery's title. */
  galleryDescription: React.ReactNode
  /** The count beside the pager's arrows. Hidden, with the arrows, when empty. */
  galleryCount: React.ReactNode
  /** The closing title, an `h2`. A line break in the string breaks the line. */
  closingTitle: React.ReactNode
  /** The paragraph under the dashed line. */
  closingDescription: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroEditorialTriptychCopy> = {
  en: {
    headline: "Room to\nbreathe",
    description: "Architecture that feels warm and lasting, pairing bold ideas with careful craft.",
    action: { label: "Start your project", href: "#start" },
    statValue: "340",
    statLabel: "Homes completed along the coast.",
    galleryTitle: (
      <>
        Rated <bdi dir="ltr">4.9</bdi>
      </>
    ),
    galleryDescription: "By the families who live in them",
    galleryCount: <bdi dir="ltr">1–8</bdi>,
    closingTitle: "Made to\noutlast us",
    closingDescription: "Natural materials, honest details and spaces designed for decades, not seasons.",
  },
  ar: {
    headline: "مساحة\nللتنفّس",
    description: "عمارة دافئة تدوم، تجمع بين الأفكار الجريئة والصنعة المتأنية.",
    action: { label: "ابدأ مشروعك", href: "#start" },
    statValue: "340",
    statLabel: "بيتًا أنجزناه على طول الساحل.",
    galleryTitle: (
      <>
        تقييم <bdi dir="ltr">4.9</bdi>
      </>
    ),
    galleryDescription: "من العائلات التي تسكنها",
    galleryCount: <bdi dir="ltr">1–8</bdi>,
    closingTitle: "صُممت\nلتدوم بعدنا",
    closingDescription: "مواد طبيعية وتفاصيل صادقة ومساحات صُممت لعقود، لا لمواسم.",
  },
}

export interface HeroEditorialTriptychProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroEditorialTriptychCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The three photos, in Figma's order: the tall one in the middle, then the
   * gallery's two, from the start side. Photos past the third are not shown.
   * None by default: `muted` placeholders of the same size.
   * @default none: `muted` placeholders
   */
  photos?: HeroEditorialTriptychPhoto[]
  /**
   * The faces under the figure. Figma shows four. None by default: the row
   * is left out.
   * @default none
   */
  people?: HeroEditorialTriptychPerson[]
}

/** A photo filling its sized, rounded box; the box keeps its `muted` colour when there is none. */
function Frame({ photo, className }: { photo?: HeroEditorialTriptychPhoto; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {photo ? <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" /> : null}
    </div>
  )
}

export function HeroEditorialTriptych({
  locale = "en",
  headline,
  description,
  action,
  statValue,
  statLabel,
  galleryTitle,
  galleryDescription,
  galleryCount,
  closingTitle,
  closingDescription,
  photos,
  people,
  className,
  ...props
}: HeroEditorialTriptychProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const button = action ?? copy.action
  const count = galleryCount ?? copy.galleryCount

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         *
         * Mobile is one column in reading order, so its parts are ordered
         * here and the two wrappers below step aside (`contents`); from
         * Tablet up the wrappers make the rows and the order resets.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:grid [@container(min-width:90rem)]:min-h-[900px] [@container(min-width:90rem)]:grid-cols-[25rem_27.5rem_minmax(0,1fr)] [@container(min-width:90rem)]:gap-x-9 [@container(min-width:90rem)]:px-16 [@container(min-width:90rem)]:py-12">
        {/* `contents` on Desktop lets the copy column and the photo take their own grid columns. */}
        <div className="contents [@container(min-width:48rem)]:flex [@container(min-width:48rem)]:gap-8 [@container(min-width:90rem)]:contents">
          <div className="contents [@container(min-width:48rem)]:flex [@container(min-width:48rem)]:min-w-0 [@container(min-width:48rem)]:flex-1 [@container(min-width:48rem)]:flex-col [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-10 [@container(min-width:90rem)]:py-2">
            <div className="order-1 flex flex-col items-start gap-6 [@container(min-width:48rem)]:order-none">
              <h1
                id={headingId}
                className="whitespace-pre-line text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl"
              >
                {headline ?? copy.headline}
              </h1>
              <p className="text-pretty text-base text-muted-foreground [@container(min-width:48rem)]:text-lg">{description ?? copy.description}</p>
              <a href={button.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
                {button.label}
              </a>
            </div>

            <div className="order-3 flex flex-col items-start gap-2 [@container(min-width:48rem)]:order-none">
              <p className="text-3xl font-medium text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl">
                <bdi dir="ltr">{statValue ?? copy.statValue}</bdi>
              </p>
              <p className="text-pretty text-sm text-muted-foreground">{statLabel ?? copy.statLabel}</p>
              {people && people.length > 0 ? (
                <div className="flex gap-1">
                  {people.map((person, index) => (
                    <Avatar key={index} variant="image" size="32" radius="rounded" border src={person.src} name={person.name} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <Frame
            photo={photos?.[0]}
            className="order-2 h-[420px] rounded-3xl [@container(min-width:48rem)]:order-none [@container(min-width:48rem)]:h-[560px] [@container(min-width:48rem)]:w-80 [@container(min-width:48rem)]:shrink-0 [@container(min-width:90rem)]:h-auto [@container(min-width:90rem)]:w-auto"
          />
        </div>

        <div className="contents [@container(min-width:48rem)]:flex [@container(min-width:48rem)]:items-start [@container(min-width:48rem)]:gap-8 [@container(min-width:90rem)]:flex-col [@container(min-width:90rem)]:items-stretch [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-10 [@container(min-width:90rem)]:py-2 [@container(min-width:90rem)]:ps-3">
          {/* Figma sets the gallery halfway down the column on Desktop. */}
          <div className="order-4 flex min-w-0 flex-col gap-3 [@container(min-width:48rem)]:order-none [@container(min-width:48rem)]:flex-1 [@container(min-width:90rem)]:my-auto [@container(min-width:90rem)]:flex-none">
            <h2 className="text-lg font-semibold text-foreground [@container(min-width:48rem)]:text-xl">{galleryTitle ?? copy.galleryTitle}</h2>
            <p className="text-sm text-muted-foreground">{galleryDescription ?? copy.galleryDescription}</p>
            <div className="flex gap-2">
              <Frame photo={photos?.[1]} className="h-[140px] min-w-0 flex-1 rounded-xl" />
              <Frame photo={photos?.[2]} className="h-[140px] min-w-0 flex-1 rounded-xl" />
            </div>
            {count ? (
              <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <ArrowLeft size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
                <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
                <span>{count}</span>
              </p>
            ) : null}
          </div>

          <div className="order-5 flex min-w-0 flex-col gap-4 [@container(min-width:48rem)]:order-none [@container(min-width:48rem)]:flex-1 [@container(min-width:90rem)]:flex-none">
            <h2 className="whitespace-pre-line text-3xl font-medium text-foreground [@container(min-width:48rem)]:text-4xl">
              {closingTitle ?? copy.closingTitle}
            </h2>
            {/* A dashed 1px line where Figma draws its Dashed Divider. Swap in Separator once it is built. */}
            <div aria-hidden className="border-t border-dashed border-border" />
            <p className="text-pretty text-sm text-muted-foreground">{closingDescription ?? copy.closingDescription}</p>
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
export const heroEditorialTriptychCopy = COPY
