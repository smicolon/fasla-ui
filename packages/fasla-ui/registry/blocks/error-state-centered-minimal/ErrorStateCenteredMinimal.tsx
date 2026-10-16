"use client"

import * as React from "react"
import { Compass } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Centered Minimal.
 *
 * One centred column: a tinted icon badge, the error code in display type,
 * a heading, a line of help and two ways out. Mobile first: the base classes
 * are Figma's Mobile (360), `md:` its Tablet (768) and `lg:` its Desktop
 * (1440). Direction is the page's `dir`; every side is a logical one, so the
 * buttons swap ends in Arabic on their own.
 */

export interface ErrorStateCenteredMinimalAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateCenteredMinimalCopy {
  /** The status code in display type. Hidden when empty. */
  code: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStateCenteredMinimalAction
  /** The outline button beside it: the quieter escape. Hidden when null. */
  secondaryAction: ErrorStateCenteredMinimalAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateCenteredMinimalCopy> = {
  en: {
    code: "404",
    heading: "This page took a wrong turn",
    description:
      "The page you were looking for has moved, been renamed, or never existed. Let’s get you back on the map.",
    primaryAction: { label: "Back to home", href: "/" },
    secondaryAction: { label: "Contact support", href: "#support" },
  },
  ar: {
    code: "404",
    heading: "هذه الصفحة سلكت منعطفًا خاطئًا",
    description: "الصفحة التي تبحث عنها نُقلت أو أُعيدت تسميتها أو لم تكن موجودة أصلًا. دعنا نعيدك إلى المسار الصحيح.",
    primaryAction: { label: "العودة إلى الرئيسية", href: "/" },
    secondaryAction: { label: "تواصل مع الدعم", href: "#support" },
  },
}

export interface ErrorStateCenteredMinimalProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateCenteredMinimalCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The glyph in the badge. Pass `null` to drop the badge.
   * @default a compass
   */
  icon?: React.ReactNode
}

export function ErrorStateCenteredMinimal({
  locale = "en",
  code,
  heading,
  description,
  primaryAction,
  secondaryAction,
  icon,
  className,
  ...props
}: ErrorStateCenteredMinimalProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const status = code ?? copy.code
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const glyph = icon === undefined ? <Compass size={32} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-8" /> : icon

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-5 text-center md:max-w-none md:gap-6 lg:max-w-[600px]">
        {glyph ? (
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/5 text-destructive md:size-[72px]">
            {glyph}
          </div>
        ) : null}
        {status ? <p className="text-6xl font-semibold text-destructive md:text-7xl lg:text-8xl">{status}</p> : null}
        <div className="flex w-full flex-col gap-3">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>
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
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateCenteredMinimalCopy = COPY
