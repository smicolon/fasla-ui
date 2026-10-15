"use client"

import * as React from "react"
import { ArrowUpRight, Telescope } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Dark Spotlight.
 *
 * The message on an inverted surface, beside a glyph in two soft halo rings.
 * The surface is painted with the inverse tokens, the only way Fasla inverts
 * one: dark in Light, light in Dark, without forcing a `.dark` class. The
 * theme-inverse registry item maps the tokens, falling back to the page
 * colours swapped in a theme that doesn't define them. The Button is the
 * library's; only its focus ring is set here, in the inverse foreground, so
 * it shows on the inverted surface.
 *
 * The halo sits beside the copy on Desktop and above it on Tablet and Mobile.
 * The telescope is a pictogram, so it is never mirrored; in Arabic only its
 * place changes. Mobile first: the base classes are Figma's Mobile (360),
 * `md:` its Tablet (768) and `lg:` its Desktop (1440).
 */

export interface ErrorStateDarkSpotlightAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateDarkSpotlightCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStateDarkSpotlightAction
  /** The text link beside it, with an outward arrow. Hidden when null. */
  secondaryAction: ErrorStateDarkSpotlightAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateDarkSpotlightCopy> = {
  en: {
    eyebrow: "ERROR 404",
    heading: (
      <>
        <span className="text-destructive">Oops</span> — this page is off the grid.
      </>
    ),
    description:
      "We cannot find what you asked for. It may have been retired, or the link that brought you here may be out of date.",
    primaryAction: { label: "Take me home", href: "/" },
    secondaryAction: { label: "Report a problem", href: "#report" },
  },
  ar: {
    eyebrow: (
      <>
        خطأ <bdi dir="ltr">404</bdi>
      </>
    ),
    heading: "عذرًا، هذه الصفحة خارج التغطية.",
    description: "لا يمكننا العثور على ما طلبته. ربما تم إيقافها، أو أن الرابط الذي أوصلك إلى هنا لم يعد صالحًا.",
    primaryAction: { label: "خذني إلى الرئيسية", href: "/" },
    secondaryAction: { label: "أبلغ عن مشكلة", href: "#report" },
  },
}

export interface ErrorStateDarkSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateDarkSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The glyph in the halo. Pass `null` to drop the halo.
   * @default a telescope
   */
  icon?: React.ReactNode
}

export function ErrorStateDarkSpotlight({
  locale = "en",
  eyebrow,
  heading,
  description,
  primaryAction,
  secondaryAction,
  icon,
  className,
  ...props
}: ErrorStateDarkSpotlightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const glyph =
    icon === undefined ? (
      <Telescope aria-hidden="true" strokeWidth={1.5} className="size-[62px] md:size-[84px] lg:size-28" />
    ) : (
      icon
    )

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background-inverse p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-8 md:gap-10 lg:min-h-[400px] lg:flex-row lg:justify-between lg:gap-16">
        {glyph ? (
          <div
            aria-hidden="true"
            className="flex size-[220px] shrink-0 items-center justify-center rounded-full bg-muted-foreground-inverse/10 md:size-[300px] lg:order-last lg:size-[400px]"
          >
            <div className="flex size-[145px] items-center justify-center rounded-full bg-muted-foreground-inverse/[0.18] text-foreground-inverse md:size-[198px] lg:size-[264px]">
              {glyph}
            </div>
          </div>
        ) : null}

        <div className="flex w-full flex-col gap-6 lg:w-[560px]">
          {label ? <p className="text-xs font-medium text-muted-foreground-inverse">{label}</p> : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground-inverse lg:text-5xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground-inverse">{description ?? copy.description}</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <a
              href={primary.href}
              className={buttonVariants({ variant: "secondary", className: "after:ring-foreground-inverse" })}
            >
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                className="inline-flex items-center justify-center gap-1.5 self-center rounded-sm text-sm font-medium text-foreground-inverse underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-foreground-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse md:self-auto"
              >
                {secondary.label}
                <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-3.5 shrink-0" />
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
export const errorStateDarkSpotlightCopy = COPY
