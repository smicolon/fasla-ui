"use client"

import * as React from "react"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Error State` (42556:548), Type=Display Numeral Split.
 *
 * A label and a Go back link over a hairline, then the error code in the
 * largest display size with a short aside beside it. Mobile first: the base
 * classes are Figma's Mobile (360), `md:` its Tablet (768) and `lg:` its
 * Desktop (1440); on Mobile the aside drops under the numeral. Direction is
 * the page's `dir`; every side is a logical one. The Go back arrow mirrors in
 * Arabic, as in Figma; the aside links' up-right arrows do not.
 */

export interface ErrorStateDisplayNumeralSplitLink {
  label: React.ReactNode
  href: string
}

export interface ErrorStateDisplayNumeralSplitBack {
  label: React.ReactNode
  /** Where the link goes. Without it, it's a button that goes back in the browser's history. */
  href?: string
}

export interface ErrorStateDisplayNumeralSplitCopy {
  /** The small label at the start of the top row. Hidden when empty. */
  label: React.ReactNode
  /** The link at the end of the top row. Hidden when null. */
  backAction: ErrorStateDisplayNumeralSplitBack | null
  /** The status code in display type. Hidden when empty. */
  code: React.ReactNode
  /** The page's heading, an `h1`, in the aside: what happened and the way back. */
  heading: React.ReactNode
  /** The links under the aside's text, in order. Each has a `label` and an `href`. */
  links: ErrorStateDisplayNumeralSplitLink[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateDisplayNumeralSplitCopy> = {
  en: {
    label: "FASLA — ERROR 404",
    backAction: { label: "Go back" },
    code: "404",
    heading: "The page you are looking for cannot be found, or no longer exists. No matter — here is the way back.",
    links: [
      { label: "Back to home", href: "/" },
      { label: "Sitemap", href: "#sitemap" },
    ],
  },
  ar: {
    label: (
      <>
        خطأ <bdi dir="ltr">404</bdi> في فاصلة
      </>
    ),
    backAction: { label: "رجوع" },
    code: "404",
    heading: "الصفحة التي تبحث عنها غير موجودة أو لم تعد متاحة. لا بأس، إليك طريق العودة.",
    links: [
      { label: "العودة إلى الرئيسية", href: "/" },
      { label: "خريطة الموقع", href: "#sitemap" },
    ],
  },
}

export interface ErrorStateDisplayNumeralSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateDisplayNumeralSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called by the Go back button, in place of going back in the browser's history. Unused when `backAction` has an `href`. */
  onBack?: () => void
}

const LINK =
  "inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function ErrorStateDisplayNumeralSplit({
  locale = "en",
  label,
  backAction,
  code,
  heading,
  links,
  onBack,
  className,
  ...props
}: ErrorStateDisplayNumeralSplitProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const eyebrow = label ?? copy.label
  const back = backAction === undefined ? copy.backAction : backAction
  const status = code ?? copy.code
  const list = links ?? copy.links

  const backContent = back ? (
    <>
      <ArrowLeft size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0 [&:dir(rtl)]:-scale-x-100" />
      {back.label}
    </>
  ) : null

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          {eyebrow ? <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p> : <span />}
          {back ? (
            back.href ? (
              <a href={back.href} className={LINK}>
                {backContent}
              </a>
            ) : (
              <button type="button" onClick={() => (onBack ? onBack() : window.history.back())} className={LINK}>
                {backContent}
              </button>
            )
          ) : null}
        </div>

        <hr className="border-border" />

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16">
          {status ? <p className="text-7xl font-bold text-foreground md:text-8xl lg:text-9xl">{status}</p> : null}
          <div className="flex w-full flex-col items-start gap-5 md:w-[280px] md:shrink-0 lg:w-[340px]">
            <h1 id={headingId} className="text-base font-normal text-muted-foreground">
              {heading ?? copy.heading}
            </h1>
            {list.length > 0 ? (
              <ul className="flex flex-wrap gap-4 md:gap-6">
                {list.map((link, index) => (
                  <li key={index} className="flex">
                    <a href={link.href} className={LINK}>
                      {link.label}
                      <ArrowUpRight size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
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
export const errorStateDisplayNumeralSplitCopy = COPY
