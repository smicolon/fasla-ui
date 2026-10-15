"use client"

import * as React from "react"
import { CircleHelp } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Editorial Photo Split.
 *
 * A status badge, heading, help text, two ways out and a quiet note on one
 * side; a photograph on the other. The photo sits at the end on Desktop and
 * under the copy on Tablet and Mobile. No photo comes with the block: pass
 * `image`, and until then the frame is a `muted` placeholder of the same
 * size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side is a logical one, so copy and photo swap sides in Arabic on their own.
 * The photo itself is never mirrored.
 */

export interface ErrorStateEditorialPhotoSplitAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateEditorialPhotoSplitImage {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface ErrorStateEditorialPhotoSplitCopy {
  /** The status badge above the heading. Hidden when empty. */
  badge: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The text under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStateEditorialPhotoSplitAction
  /** The outline button beside it: the quieter escape. Hidden when null. */
  secondaryAction: ErrorStateEditorialPhotoSplitAction | null
  /** The line under the divider, after a help icon. Hidden, with the divider, when empty. */
  note: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateEditorialPhotoSplitCopy> = {
  en: {
    badge: "404 error",
    heading: "We looked everywhere. It’s not here.",
    description:
      "This link may be broken, or the page may have been moved during our last release. Everything else is exactly where you left it.",
    primaryAction: { label: "Back to home", href: "/" },
    secondaryAction: { label: "Browse the help centre", href: "#help" },
    note: "Think this is a mistake? Report the broken link.",
  },
  ar: {
    badge: (
      <>
        خطأ <bdi dir="ltr">404</bdi>
      </>
    ),
    heading: "بحثنا في كل مكان. إنها ليست هنا.",
    description: "قد يكون هذا الرابط معطلًا، أو نُقلت الصفحة خلال آخر إصدار لنا. كل شيء آخر في مكانه تمامًا كما تركته.",
    primaryAction: { label: "العودة إلى الرئيسية", href: "/" },
    secondaryAction: { label: "تصفّح مركز المساعدة", href: "#help" },
    note: "تعتقد أن هناك خطأ؟ أبلغ عن الرابط المعطل.",
  },
}

export interface ErrorStateEditorialPhotoSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateEditorialPhotoSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo. None by default: the frame shows a `muted` placeholder.
   * @default none: a `muted` placeholder
   */
  image?: ErrorStateEditorialPhotoSplitImage
}

export function ErrorStateEditorialPhotoSplit({
  locale = "en",
  badge,
  heading,
  description,
  primaryAction,
  secondaryAction,
  note,
  image,
  className,
  ...props
}: ErrorStateEditorialPhotoSplitProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const status = badge ?? copy.badge
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const footnote = note ?? copy.note

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-5 md:gap-6">
          {status ? (
            <Badge variant="soft" tone="destructive" size="sm">
              {status}
            </Badge>
          ) : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
          {footnote ? (
            <>
              <hr className="w-full border-border" />
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CircleHelp aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
                <span>{footnote}</span>
              </p>
            </>
          ) : null}
        </div>

        <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-[10px] bg-muted md:h-[380px] lg:h-[480px] lg:w-[560px]">
          {image ? (
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
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
export const errorStateEditorialPhotoSplitCopy = COPY
