"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Error State` (42556:548), Type=Light Editorial.
 *
 * A quiet, centred page in light weights: the code as a small label, a large
 * light heading whose last words are in the destructive colour, and a row of
 * underlined links in place of buttons. Mobile first: the base classes are
 * Figma's Mobile (360), `md:` its Tablet (768) and `lg:` its Desktop (1440);
 * the links wrap on Mobile. Direction is the page's `dir`; the block is
 * centred, so only the order of the links mirrors in Arabic.
 */

export interface ErrorStateLightEditorialLink {
  label: React.ReactNode
  href: string
}

export interface ErrorStateLightEditorialCopy {
  /** The small label above the heading: the status code. Hidden when empty. */
  code: React.ReactNode
  /**
   * The page's heading, an `h1`. Figma colours its last words with the
   * destructive colour: wrap them in `<span className="text-destructive">`.
   */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The underlined links under the copy, in order. Each has a `label` and an `href`. Hidden when empty. */
  links: ErrorStateLightEditorialLink[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateLightEditorialCopy> = {
  en: {
    code: "404",
    heading: (
      <>
        Page <span className="text-destructive">not found</span>
      </>
    ),
    description: "The page you were looking for moved, or it never existed at all. Try one of these instead.",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "#pricing" },
      { label: "Docs", href: "#docs" },
      { label: "Journal", href: "#journal" },
      { label: "Contact", href: "#contact" },
    ],
  },
  ar: {
    code: "404",
    heading: (
      <>
        الصفحة <span className="text-destructive">غير موجودة</span>
      </>
    ),
    description: "الصفحة التي تبحث عنها انتقلت، أو لم تكن موجودة أصلًا. جرّب أحد هذه بدلًا منها.",
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "الأسعار", href: "#pricing" },
      { label: "التوثيق", href: "#docs" },
      { label: "المدونة", href: "#journal" },
      { label: "تواصل", href: "#contact" },
    ],
  },
}

export interface ErrorStateLightEditorialProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateLightEditorialCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function ErrorStateLightEditorial({
  locale = "en",
  code,
  heading,
  description,
  links,
  className,
  ...props
}: ErrorStateLightEditorialProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const status = code ?? copy.code
  const list = links ?? copy.links

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-4 py-8 text-center md:max-w-none md:py-12 lg:max-w-[620px] lg:py-16">
        {status ? <p className="text-xs text-destructive">{status}</p> : null}
        <div className="flex w-full flex-col gap-4">
          <h1 id={headingId} className="text-2xl font-light text-foreground md:text-5xl lg:text-6xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-lg font-light text-muted-foreground">{description ?? copy.description}</p>
        </div>
        {list.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-3 md:gap-x-6">
            {list.map((link, index) => (
              <li key={index} className="flex">
                <a
                  href={link.href}
                  className="rounded-sm text-sm text-foreground underline hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateLightEditorialCopy = COPY
