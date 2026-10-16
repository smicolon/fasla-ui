"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Popular Pages Grid.
 *
 * A header with the error, a heading and a way home, over three cards of the
 * pages people look for most, each with a photo. The cards sit three across
 * on Desktop, two across on Tablet and stack on Mobile. No photos come with
 * the block: give each page an `image`, and until then its frame is a
 * `muted` placeholder of the same size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side is a logical one, and each card's arrow turns to point the way the
 * text reads. Photos are never mirrored.
 */

export interface ErrorStatePopularPagesGridAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStatePopularPagesGridImage {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface ErrorStatePopularPagesGridPage {
  /** The card's title, an `h2`. */
  title: React.ReactNode
  /** One line about the page. */
  description: React.ReactNode
  /** Where the card goes. The whole card is the link. */
  href: string
  /** The card's photo. None by default: a `muted` placeholder. */
  image?: ErrorStatePopularPagesGridImage
}

export interface ErrorStatePopularPagesGridCopy {
  /** The short label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The text under the heading. */
  description: React.ReactNode
  /** The outline button beside the header: the way out, usually home. Hidden when null. */
  action: ErrorStatePopularPagesGridAction | null
  /** The pages, in order. Each has a `title`, a `description`, an `href` and an optional `image`. The grid is left out when empty. */
  pages: ErrorStatePopularPagesGridPage[]
  /** The label at the foot of each card, before its arrow. */
  openLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStatePopularPagesGridCopy> = {
  en: {
    eyebrow: "ERROR 404",
    heading: "That page has moved on",
    description:
      "While you are here, these are the pages most people were looking for when they landed on a broken link.",
    action: { label: "Back to home", href: "/" },
    pages: [
      {
        title: "Getting started",
        description: "Set up your first workspace in under ten minutes.",
        href: "#getting-started",
      },
      {
        title: "Guides & docs",
        description: "Every API reference, walkthrough and integration note.",
        href: "#guides",
      },
      {
        title: "Help centre",
        description: "Answers to the questions our support team hears most.",
        href: "#help",
      },
    ],
    openLabel: "Open",
  },
  ar: {
    eyebrow: (
      <>
        خطأ <bdi dir="ltr">404</bdi>
      </>
    ),
    heading: "تلك الصفحة انتقلت",
    description: "ما دمت هنا، هذه هي الصفحات التي يبحث عنها معظم الناس عند وصولهم إلى رابط معطل.",
    action: { label: "العودة إلى الرئيسية", href: "/" },
    pages: [
      { title: "البدء", description: "أنشئ مساحة عملك الأولى في أقل من عشر دقائق.", href: "#getting-started" },
      { title: "الأدلة والتوثيق", description: "كل مراجع الواجهات البرمجية والشروحات وملاحظات التكامل.", href: "#guides" },
      { title: "مركز المساعدة", description: "إجابات عن الأسئلة الأكثر تكرارًا لدى فريق الدعم لدينا.", href: "#help" },
    ],
    openLabel: "افتح",
  },
}

export interface ErrorStatePopularPagesGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStatePopularPagesGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function ErrorStatePopularPagesGrid({
  locale = "en",
  eyebrow,
  heading,
  description,
  action,
  pages,
  openLabel,
  className,
  ...props
}: ErrorStatePopularPagesGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const cta = action === undefined ? copy.action : action
  const list = pages ?? copy.pages
  const open = openLabel ?? copy.openLabel

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <header className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {label ? <p className="text-xs font-medium text-destructive">{label}</p> : null}
            <h1 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
              {heading ?? copy.heading}
            </h1>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </div>
          {cta ? (
            <a href={cta.href} className={buttonVariants({ variant: "outline", className: "shrink-0" })}>
              {cta.label}
            </a>
          ) : null}
        </header>

        {list.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {list.map((page, index) => (
              <li key={index}>
                <a
                  href={page.href}
                  // Figma's 1px stroke is inside the card, so it is drawn over
                  // the photo and adds nothing to the card's size.
                  className="relative flex h-full flex-col overflow-hidden rounded-xl bg-card transition-shadow [outline:none] after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:ring-1 after:ring-inset after:ring-border hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <div className="relative h-40 w-full shrink-0 bg-muted md:h-[184px]">
                    {page.image ? (
                      <img
                        src={page.image.src}
                        alt={page.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-2 p-5">
                    <h2 className="text-lg font-semibold text-foreground">{page.title}</h2>
                    <p className="text-sm text-muted-foreground">{page.description}</p>
                    <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-foreground">
                      {open}
                      <ArrowRight
                        aria-hidden="true"
                        size={14} strokeWidth={1.5} absoluteStrokeWidth
                        className="size-3.5 shrink-0 text-muted-foreground [&:dir(rtl)]:-scale-x-100"
                      />
                    </span>
                  </div>
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
export const errorStatePopularPagesGridCopy = COPY
