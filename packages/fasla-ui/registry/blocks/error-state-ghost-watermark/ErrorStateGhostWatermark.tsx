"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Ghost Watermark.
 *
 * The error code as a faint watermark in the destructive colour, behind a
 * centred heading, a line of help and two ways out. The stage keeps Figma's
 * fixed height at each breakpoint and centres the message in it. Mobile
 * first: the base classes are Figma's Mobile (360), `md:` its Tablet (768)
 * and `lg:` its Desktop (1440). Direction is the page's `dir`; the block is
 * centred, so only the buttons swap ends in Arabic.
 */

export interface ErrorStateGhostWatermarkAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateGhostWatermarkCopy {
  /** The watermark: the status code, faint, behind the message. Hidden when empty. Decorative, so screen readers skip it. */
  code: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStateGhostWatermarkAction
  /** The outline button beside it: the quieter escape. Hidden when null. */
  secondaryAction: ErrorStateGhostWatermarkAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateGhostWatermarkCopy> = {
  en: {
    code: "404",
    heading: "The requested URL was not found on this server.",
    description:
      "Check the address for typos, or start again from the homepage. If you followed a link from Fasla, let us know so we can fix it.",
    primaryAction: { label: "Return home", href: "/" },
    secondaryAction: { label: "Report broken link", href: "#report" },
  },
  ar: {
    code: "404",
    heading: "لم يتم العثور على الرابط المطلوب على هذا الخادم.",
    description:
      "تحقق من العنوان بحثًا عن أخطاء إملائية، أو ابدأ من جديد من الصفحة الرئيسية. إذا وصلت عبر رابط من فاصلة، فأخبرنا لنصلحه.",
    primaryAction: { label: "العودة إلى الرئيسية", href: "/" },
    secondaryAction: { label: "أبلغ عن رابط معطل", href: "#report" },
  },
}

export interface ErrorStateGhostWatermarkProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateGhostWatermarkCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function ErrorStateGhostWatermark({
  locale = "en",
  code,
  heading,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: ErrorStateGhostWatermarkProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const watermark = code ?? copy.code
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="relative mx-auto flex h-[400px] w-full max-w-[1248px] items-center justify-center overflow-hidden md:h-[420px] lg:h-[520px]">
        {watermark ? (
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-7 select-none text-center text-7xl font-bold text-destructive/10 md:top-9 md:text-8xl lg:top-11 lg:text-9xl"
          >
            {watermark}
          </p>
        ) : null}
        <div className="relative flex w-full flex-col items-center gap-5 text-center md:gap-6 lg:max-w-[560px]">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
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
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateGhostWatermarkCopy = COPY
