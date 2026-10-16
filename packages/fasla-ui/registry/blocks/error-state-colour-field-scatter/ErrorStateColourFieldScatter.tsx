"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Error State` (42556:548), Type=Colour Field Scatter.
 *
 * A field of `destructive` with the error code's digits scattered across it
 * in display type, the brand and a way home in its corners, and a short
 * message at the bottom. Everything on the field is placed absolutely, as in
 * Figma, with logical insets: in Arabic the scatter mirrors across the
 * field's centre and the brand and back link swap corners on their own. The
 * digits' insets are fractions of the field's width, so the scatter keeps its
 * shape between breakpoints and lands on Figma's pixels at 360, 768 and 1440.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface ErrorStateColourFieldScatterAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateColourFieldScatterCopy {
  /** The status code. Its first three characters are scattered across the field. Hidden when empty. */
  code: string
  /** The brand in the top corner. Hidden when empty. */
  brand: React.ReactNode
  /** The way home, a link in the opposite corner. Hidden when null. */
  backAction: ErrorStateColourFieldScatterAction | null
  /** The page's heading, an `h1`: the small label above the message. */
  heading: React.ReactNode
  /** The message under the heading: what happened and what to do. */
  description: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateColourFieldScatterCopy> = {
  en: {
    code: "404",
    brand: "Fasla",
    backAction: { label: "Back to home", href: "/" },
    heading: "Error 404",
    description:
      "The page you were looking for does not exist. You may have mistyped the address, or the page may have moved.",
  },
  ar: {
    code: "404",
    brand: "فاصلة",
    backAction: { label: "العودة إلى الرئيسية", href: "/" },
    heading: (
      <>
        خطأ <bdi dir="ltr">404</bdi>
      </>
    ),
    description: "الصفحة التي تبحث عنها غير موجودة. ربما أخطأت في كتابة العنوان، أو تم نقل الصفحة.",
  },
}

/**
 * Where each digit sits: its inline-start inset as a fraction of the field's
 * width (Figma's x over the frame's width) and its top, at each breakpoint.
 */
const DIGITS = [
  "start-[6.6667%] top-[150px] md:start-[6.25%] md:top-[236px] lg:start-[6.6667%] lg:top-[300px]",
  "start-[38.8889%] top-[54px] md:start-[38.5417%] md:top-[72px] lg:start-[41.6667%] lg:top-[90px]",
  "start-[54.4444%] top-[268px] md:start-[70.3125%] md:top-[352px] lg:start-[75.6944%] lg:top-[430px]",
]

export interface ErrorStateColourFieldScatterProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateColourFieldScatterCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function ErrorStateColourFieldScatter({
  locale = "en",
  code,
  brand,
  backAction,
  heading,
  description,
  className,
  ...props
}: ErrorStateColourFieldScatterProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const digits = Array.from(code ?? copy.code).slice(0, DIGITS.length)
  const mark = brand ?? copy.brand
  const back = backAction === undefined ? copy.backAction : backAction

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative h-[600px] overflow-hidden bg-destructive text-destructive-foreground md:h-[620px] lg:h-[700px]",
        className
      )}
      {...props}
    >
      {/* The heading names the code; the scattered digits are its picture. */}
      {digits.map((digit, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn("absolute text-7xl font-bold md:text-8xl lg:text-9xl", DIGITS[index])}
        >
          {digit}
        </span>
      ))}

      {mark ? (
        <p className="absolute start-6 top-7 text-sm font-semibold md:start-12 md:top-12 lg:start-24 lg:top-16">{mark}</p>
      ) : null}

      {back ? (
        <a
          href={back.href}
          className="absolute start-6 top-[540px] inline-flex items-center gap-1.5 rounded-sm text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-destructive-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-destructive md:start-auto md:end-[101px] md:top-12 lg:end-[149px] lg:top-16"
        >
          {back.label}
          <ArrowRight aria-hidden="true" size={14} strokeWidth={1.5} absoluteStrokeWidth className="size-3.5 shrink-0 [&:dir(rtl)]:-scale-x-100" />
        </a>
      ) : null}

      <div className="absolute start-6 top-[392px] flex w-[300px] max-w-[calc(100%-3rem)] flex-col gap-3 md:start-12 md:top-[462px] lg:start-24 lg:top-[520px] lg:w-[340px]">
        <h1 id={headingId} className="text-sm font-semibold">
          {heading ?? copy.heading}
        </h1>
        <p className="text-sm">{description ?? copy.description}</p>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateColourFieldScatterCopy = COPY
