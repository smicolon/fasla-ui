"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Annotated Object Hero.
 *
 * A product shown like a drawing on a workbench: a centred headline over one
 * round object photo inside a dashed orbit ring, two dashed annotation boxes
 * (a transaction id, a location) joined to the object by leader lines, and a
 * floating "live card" with an avatar, a name, a time and a status badge.
 * Ruler ticks run down both side edges; a paragraph and two buttons close it.
 *
 * Desktop sets the annotations on the start side of the object, each with a
 * line reaching into it, and the live card on the end side with a short line
 * of its own; two thin guide lines run the full height 40px in from the
 * edges. Tablet draws the same scene smaller, the lines touching the boxes
 * and the live card overlapping the object without a line. Mobile stacks
 * the annotations and the live card under the object at full width, drops
 * the lines and stacks the buttons full width.
 *
 * In Arabic the scene mirrors: the annotations move to the right, the live
 * card to the left. The transaction id, the unit number and the time stay
 * left to right. The photos are never flipped.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the width the annotations are placed on.
 * Narrower, they crowd the object, so Tablet's layout covers 768 to 1439.
 */

export interface HeroAnnotatedObjectAction {
  label: React.ReactNode
  href: string
}

export interface HeroAnnotatedObjectPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroAnnotatedObjectPerson {
  /** The photo. Without it the avatar shows the name's initials. */
  src?: string
  /** The name the initials come from. The live card's title names it aloud. */
  name: string
}

export interface HeroAnnotatedObjectAnnotation {
  /** The small label, after a `+` marker. */
  label: React.ReactNode
  /** The value under it. Wrap codes and numbers in `<bdi dir="ltr">`. */
  value: React.ReactNode
}

export interface HeroAnnotatedObjectCopy {
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the object. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroAnnotatedObjectAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: HeroAnnotatedObjectAction | null
  /**
   * The dashed boxes joined to the object. Figma shows two, and the wide
   * layouts place two beside the object: any after the second are left out.
   */
  annotations: HeroAnnotatedObjectAnnotation[]
  /** The live card's name. */
  cardTitle: React.ReactNode
  /** The line under it. Wrap times and numbers in `<bdi dir="ltr">`. */
  cardMeta: React.ReactNode
  /** The live card's success badge. Hidden when empty. */
  cardBadge: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroAnnotatedObjectCopy> = {
  en: {
    headline: "The data platform\nfor modern finance.",
    description: "We turn messy transaction data into clean, verified records your team can use everywhere.",
    primaryAction: { label: "Contact sales", href: "#contact" },
    secondaryAction: { label: "See the API", href: "#api" },
    annotations: [
      { label: "TRANSACTION ID", value: <bdi dir="ltr">TX-20481-7731</bdi> },
      {
        label: "LOCATION",
        value: (
          <>
            Riverside, Unit <bdi dir="ltr">14</bdi>
          </>
        ),
      },
    ],
    cardTitle: "Daybreak Café",
    cardMeta: (
      <>
        Card payment · <bdi dir="ltr">09:23</bdi>
      </>
    ),
    cardBadge: "Verified",
  },
  ar: {
    headline: "منصة البيانات\nللتمويل الحديث.",
    description: "نحوّل بيانات المعاملات المبعثرة إلى سجلات نظيفة وموثّقة يستخدمها فريقك في كل مكان.",
    primaryAction: { label: "تواصل مع المبيعات", href: "#contact" },
    secondaryAction: { label: "الواجهة البرمجية", href: "#api" },
    annotations: [
      { label: "رقم العملية", value: <bdi dir="ltr">TX-20481-7731</bdi> },
      {
        label: "الموقع",
        value: (
          <>
            حي النهر، الوحدة <bdi dir="ltr">14</bdi>
          </>
        ),
      },
    ],
    cardTitle: "مقهى الفجر",
    cardMeta: (
      <>
        دفع بالبطاقة، <bdi dir="ltr">09:23</bdi>
      </>
    ),
    cardBadge: "موثّق",
  },
}

/**
 * Where each annotation sits from Tablet up: its top, in px from the top of
 * the object's stage. Its start edge is the stage's on Tablet and 470px
 * before the object's centre on Desktop, and its leader line runs on to the
 * object's centre, under the photo, so it meets the circle's edge wherever
 * the box ends.
 */
const ANNOTATION_PLACE = [
  "[@container(min-width:48rem)]:top-20",
  "[@container(min-width:48rem)]:top-[230px] [@container(min-width:90rem)]:top-60",
]

/**
 * Figma's ruler: a 1px tick every 24px from 24px down, every fifth one twice
 * as long. Drawn as `ring` through a repeating mask, so it runs the block's
 * whole height whatever that is.
 */
const MINOR_TICKS =
  "absolute bottom-0 top-6 w-1.5 bg-ring [mask-image:repeating-linear-gradient(black_0_1px,transparent_1px_24px)] [@container(min-width:90rem)]:w-2"
const MAJOR_TICKS =
  "absolute bottom-0 top-6 w-3 bg-ring [mask-image:repeating-linear-gradient(black_0_1px,transparent_1px_120px)] [@container(min-width:90rem)]:w-4"

export interface HeroAnnotatedObjectProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroAnnotatedObjectCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The object in the circle. None by default: a `muted` circle of the same
   * size.
   * @default none: a `muted` placeholder
   */
  photo?: HeroAnnotatedObjectPhoto
  /**
   * The avatar on the live card. None by default: the avatar is left out.
   * It is hidden from screen readers, as the card's title already names it.
   * @default none
   */
  cardAvatar?: HeroAnnotatedObjectPerson
}

export function HeroAnnotatedObject({
  locale = "en",
  headline,
  description,
  primaryAction,
  secondaryAction,
  annotations,
  cardTitle,
  cardMeta,
  cardBadge,
  photo,
  cardAvatar,
  className,
  ...props
}: HeroAnnotatedObjectProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const notes = (annotations ?? copy.annotations).slice(0, ANNOTATION_PLACE.length)
  const badge = cardBadge ?? copy.cardBadge

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative overflow-hidden [container-type:inline-size] bg-background", className)}
      {...props}
    >
      {/* The rulers along both edges, and Desktop's two guide lines. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className={cn(MINOR_TICKS, "start-0")} />
        <div className={cn(MAJOR_TICKS, "start-0")} />
        <div className={cn(MINOR_TICKS, "end-0")} />
        <div className={cn(MAJOR_TICKS, "end-0")} />
        <div className="absolute inset-y-0 start-10 hidden w-px bg-border [@container(min-width:90rem)]:block" />
        <div className="absolute inset-y-0 end-10 hidden w-px bg-border [@container(min-width:90rem)]:block" />
      </div>

      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="relative mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col items-center gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-2 [@container(min-width:90rem)]:px-20 [@container(min-width:90rem)]:pb-28 [@container(min-width:90rem)]:pt-[72px]">
        <h1
          id={headingId}
          className="w-full max-w-[1000px] whitespace-pre-line text-center text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl"
        >
          {headline ?? copy.headline}
        </h1>

        {/*
         * The object's stage. On Mobile it stacks the object over the
         * annotations and the live card; from Tablet it is a fixed-height
         * scene with them placed around the object's centre.
         */}
        <div className="relative flex w-full flex-col gap-10 [@container(min-width:48rem)]:block [@container(min-width:48rem)]:h-[380px] [@container(min-width:90rem)]:h-[400px]">
          {/* The dashed orbit ring, with the object inset in it. It sits over the leader lines, so they end under the photo. */}
          <div className="relative mx-auto size-[260px] shrink-0 rounded-full border border-dashed border-border [@container(min-width:48rem)]:z-10 [@container(min-width:48rem)]:mt-[30px] [@container(min-width:48rem)]:size-80 [@container(min-width:90rem)]:mt-0 [@container(min-width:90rem)]:size-[400px]">
            <div className="absolute inset-[29px] overflow-hidden rounded-full bg-muted [@container(min-width:90rem)]:inset-[39px]">
              {photo ? (
                <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <ul className="flex flex-col gap-3">
              {notes.map((note, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex [@container(min-width:48rem)]:absolute [@container(min-width:48rem)]:end-1/2 [@container(min-width:48rem)]:start-0 [@container(min-width:48rem)]:items-center [@container(min-width:90rem)]:start-[calc(50%-470px)]",
                    ANNOTATION_PLACE[index]
                  )}
                >
                  <div className="flex w-full flex-col gap-1 border border-dashed border-foreground bg-background px-4 py-3 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:shrink-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      <span aria-hidden>+ </span>
                      {note.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{note.value}</p>
                  </div>
                  {/* The leader line: flush with the box on Tablet, 16px clear of it on Desktop. */}
                  <span aria-hidden className="hidden h-px min-w-0 flex-1 bg-foreground [@container(min-width:48rem)]:block [@container(min-width:90rem)]:ms-4" />
                </li>
              ))}
            </ul>

            {/* The live card: over the object's end edge on Tablet, joined to it by a 50px line on Desktop. */}
            <div className="relative z-20 flex w-full items-center [@container(min-width:48rem)]:absolute [@container(min-width:48rem)]:start-[calc(50%+95px)] [@container(min-width:48rem)]:top-[150px] [@container(min-width:48rem)]:w-auto [@container(min-width:90rem)]:start-[calc(50%+160px)]">
              <span aria-hidden className="hidden h-px w-[50px] shrink-0 bg-foreground [@container(min-width:90rem)]:block" />
              <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-lg [@container(min-width:48rem)]:w-auto">
                {cardAvatar ? (
                  <Avatar aria-hidden variant="image" size="32" radius="rounded" src={cardAvatar.src} name={cardAvatar.name} />
                ) : null}
                <div className="flex min-w-0 flex-col">
                  <p className="text-sm font-semibold text-foreground">{cardTitle ?? copy.cardTitle}</p>
                  <p className="text-xs text-muted-foreground">{cardMeta ?? copy.cardMeta}</p>
                </div>
                {badge ? (
                  <Badge variant="soft" tone="success" size="sm" radius="rounded">
                    {badge}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-6 [@container(min-width:90rem)]:mt-2 [@container(min-width:90rem)]:max-w-[600px]">
          <p className="text-balance text-center text-base text-muted-foreground">{description ?? copy.description}</p>
          <div className="flex w-full flex-col gap-3 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row">
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
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroAnnotatedObjectCopy = COPY
