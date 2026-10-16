"use client"

import * as React from "react"
import { ArrowUpRight, BookOpen, LayoutGrid, LifeBuoy, Mail, Map as MapIcon, Sparkles, Users } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Helpful Links List.
 *
 * A centred 404 message over a card of popular destinations, two to a row
 * from Tablet up and one per row on Mobile, then two ways out. Mobile first:
 * the base classes are Figma's Mobile (360), `md:` its Tablet (768) and `lg:`
 * its Desktop (1440). Direction is the page's `dir`; every side is a logical
 * one, so the rows mirror in Arabic and each arrow turns to point up-left.
 */

export interface ErrorStateHelpfulLinksListAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateHelpfulLinksListDestination {
  label: React.ReactNode
  href: string
  /** The glyph before the label, a 16px lucide icon. */
  icon?: React.ReactNode
}

export interface ErrorStateHelpfulLinksListCopy {
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The label over the destinations, an `h2`. */
  destinationsLabel: React.ReactNode
  /** The links in the card, in reading order. The card is hidden when the list is empty. */
  destinations: ErrorStateHelpfulLinksListDestination[]
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStateHelpfulLinksListAction
  /** The ghost button beside it: the quieter escape. Hidden when null. */
  secondaryAction: ErrorStateHelpfulLinksListAction | null
}

const icon = "size-4"

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateHelpfulLinksListCopy> = {
  en: {
    heading: "404 — we can’t find that page",
    description: "Searching for something in particular? One of these is probably what you were after.",
    destinationsLabel: "POPULAR DESTINATIONS",
    destinations: [
      { label: "Product overview", href: "#product", icon: <LayoutGrid size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "Documentation", href: "#docs", icon: <BookOpen size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "What’s new", href: "#changelog", icon: <Sparkles size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "Customer stories", href: "#customers", icon: <Users size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "Help centre", href: "#help", icon: <LifeBuoy size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "Contact sales", href: "#sales", icon: <Mail size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
    ],
    primaryAction: { label: "Go back home", href: "/" },
    secondaryAction: { label: "Search instead", href: "#search" },
  },
  ar: {
    heading: (
      <>
        خطأ <bdi dir="ltr">404</bdi>: لا يمكننا العثور على تلك الصفحة
      </>
    ),
    description: "تبحث عن شيء محدد؟ ربما يكون أحد هذه الروابط ما تريده.",
    destinationsLabel: "الوجهات الأكثر زيارة",
    destinations: [
      { label: "نظرة عامة على المنتج", href: "#product", icon: <LayoutGrid size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "التوثيق", href: "#docs", icon: <BookOpen size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "ما الجديد", href: "#changelog", icon: <Sparkles size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "قصص العملاء", href: "#customers", icon: <Users size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "مركز المساعدة", href: "#help", icon: <LifeBuoy size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
      { label: "تواصل مع المبيعات", href: "#sales", icon: <Mail size={16} strokeWidth={1.5} absoluteStrokeWidth className={icon} /> },
    ],
    primaryAction: { label: "العودة إلى الرئيسية", href: "/" },
    secondaryAction: { label: "ابحث بدلًا من ذلك", href: "#search" },
  },
}

export interface ErrorStateHelpfulLinksListProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateHelpfulLinksListCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The glyph in the badge. Pass `null` to drop the badge.
   * @default a folded map
   */
  icon?: React.ReactNode
}

export function ErrorStateHelpfulLinksList({
  locale = "en",
  heading,
  description,
  destinationsLabel,
  destinations,
  primaryAction,
  secondaryAction,
  icon: glyphProp,
  className,
  ...props
}: ErrorStateHelpfulLinksListProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const labelId = React.useId()
  const list = destinations ?? copy.destinations
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const glyph = glyphProp === undefined ? <MapIcon aria-hidden="true" className="size-7" size={28} strokeWidth={1.5} absoluteStrokeWidth /> : glyphProp

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[664px] flex-col items-center gap-6 text-center md:max-w-none md:gap-8 lg:max-w-[664px]">
        {glyph ? (
          <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">{glyph}</div>
        ) : null}
        <div className="flex w-full flex-col gap-3">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>

        {list.length > 0 ? (
          <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-[15px] text-start md:p-[19px]">
            <h2 id={labelId} className="text-xs font-medium text-muted-foreground">
              {destinationsLabel ?? copy.destinationsLabel}
            </h2>
            <ul aria-labelledby={labelId} className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
              {list.map((destination, index) => (
                <li key={index} className="flex">
                  <a
                    href={destination.href}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 [outline:none]",
                      "transition-colors hover:bg-muted motion-reduce:transition-none",
                      "focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      {destination.icon ? (
                        <span aria-hidden="true" className="flex shrink-0 text-muted-foreground [&_svg]:size-4">
                          {destination.icon}
                        </span>
                      ) : null}
                      <span className="text-sm font-medium text-foreground">{destination.label}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={14} strokeWidth={1.5} absoluteStrokeWidth
                      className="size-3.5 shrink-0 text-muted-foreground [&:dir(rtl)]:-scale-x-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
          <a href={primary.href} className={buttonVariants()}>
            {primary.label}
          </a>
          {secondary ? (
            <a href={secondary.href} className={buttonVariants({ variant: "ghost" })}>
              {secondary.label}
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
export const errorStateHelpfulLinksListCopy = COPY
