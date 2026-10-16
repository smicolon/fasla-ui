"use client"

import * as React from "react"
import { Undo2 } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Support Escalation Band.
 *
 * One card on a muted field that hands the visitor to a person: a status
 * badge, the heading and a line of help, the support team's avatars with
 * their reply time, and a column of ways to reach them, with a quiet link
 * home under it.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The copy and the actions sit side by
 * side on Desktop and stack below it; on Mobile the team row moves above the
 * badge. Direction is the page's `dir`; every side is a logical one, so the
 * avatar stack overlaps the other way in Arabic, and the back glyph turns
 * into its redo twin.
 */

export interface ErrorStateSupportEscalationBandAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateSupportEscalationBandPerson {
  /** The person's name: the photo's `alt`, and the initials when there is no photo. */
  name: string
  /** Their photo. Without one, the avatar shows their initials. */
  src?: string
}

export interface ErrorStateSupportEscalationBandCopy {
  /** The pill above the heading. Hidden when empty. */
  badge: React.ReactNode
  /** The band's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The support team, shown as an overlapping avatar stack, each marked online. */
  people: ErrorStateSupportEscalationBandPerson[]
  /** Beside the avatars: who answers and how fast. */
  teamNote: React.ReactNode
  /** The solid button. */
  primaryAction: ErrorStateSupportEscalationBandAction
  /** The outline button under it. Hidden when null. */
  secondaryAction: ErrorStateSupportEscalationBandAction | null
  /** The quiet link under the buttons. Hidden when null. */
  homeLink: ErrorStateSupportEscalationBandAction | null
}

/** The team's names. Figma shows two photos and the initials "VB". */
const PEOPLE: ErrorStateSupportEscalationBandPerson[] = [
  { name: "Hana Malik" },
  { name: "Sami Rahman" },
  { name: "Vera Bauer" },
]

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateSupportEscalationBandCopy> = {
  en: {
    badge: "Error 404",
    heading: "Still can’t find it? Talk to a human.",
    description:
      "Tell us what you were looking for and we will send you the right link — or fix the broken one for everybody.",
    people: PEOPLE,
    teamNote: "Fasla support — usually replies within an hour",
    primaryAction: { label: "Start a live chat", href: "#chat" },
    secondaryAction: { label: "Email support", href: "mailto:support@fasla.com" },
    homeLink: { label: "or go back to the homepage", href: "/" },
  },
  ar: {
    badge: (
      <>
        خطأ <bdi dir="ltr">404</bdi>
      </>
    ),
    heading: "ما زلت لا تجدها؟ تحدث إلى إنسان.",
    description: "أخبرنا بما كنت تبحث عنه. سنرسل لك الرابط الصحيح، أو نصلح الرابط المعطل للجميع.",
    people: PEOPLE,
    teamNote: "دعم فاصلة يرد عادةً خلال ساعة",
    primaryAction: { label: "ابدأ محادثة مباشرة", href: "#chat" },
    secondaryAction: { label: "راسل الدعم", href: "mailto:support@fasla.com" },
    homeLink: { label: "أو عد إلى الصفحة الرئيسية", href: "/" },
  },
}

export interface ErrorStateSupportEscalationBandProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateSupportEscalationBandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function ErrorStateSupportEscalationBand({
  locale = "en",
  badge,
  heading,
  description,
  people,
  teamNote,
  primaryAction,
  secondaryAction,
  homeLink,
  className,
  ...props
}: ErrorStateSupportEscalationBandProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const pill = badge ?? copy.badge
  const team = people ?? copy.people
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const home = homeLink === undefined ? copy.homeLink : homeLink

  return (
    <section aria-labelledby={headingId} className={cn("bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8 rounded-2xl bg-card p-6 shadow-md ring-1 ring-inset ring-border md:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:p-10">
        <div className="flex min-w-0 flex-col items-start gap-4 lg:max-w-[600px] lg:flex-1">
          {pill ? (
            <Badge variant="soft" tone="destructive" size="sm" radius="rounded">
              {pill}
            </Badge>
          ) : null}
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          {team.length > 0 || teamNote !== null ? (
            <div className="flex flex-col gap-2.5 max-md:order-first md:flex-row md:items-center md:gap-3">
              {team.length > 0 ? (
                <ul className="flex shrink-0 items-center">
                  {team.map((person, index) => (
                    <li key={index} className={index > 0 ? "-ms-1" : undefined}>
                      <Avatar
                        variant={person.src ? "image" : "initials"}
                        src={person.src}
                        name={person.name}
                        radius="rounded"
                        border
                        status="online"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="max-w-[140px] text-sm text-muted-foreground md:max-w-none">{teamNote ?? copy.teamNote}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-3 lg:w-[280px] lg:shrink-0 lg:flex-col lg:items-stretch">
          <a href={primary.href} className={buttonVariants({ size: "lg" })}>
            {primary.label}
          </a>
          {secondary ? (
            <a href={secondary.href} className={buttonVariants({ variant: "outline", size: "lg" })}>
              {secondary.label}
            </a>
          ) : null}
          {home ? (
            <a
              href={home.href}
              className="flex items-center justify-center gap-2 self-center rounded-sm text-xs text-muted-foreground [outline:none] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Undo2 aria-hidden="true" className="size-3.5 shrink-0 [&:dir(rtl)]:-scale-x-100" size={14} strokeWidth={1.5} absoluteStrokeWidth />
              {home.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateSupportEscalationBandCopy = COPY
