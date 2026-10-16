"use client"

import * as React from "react"
import { ArrowUpRight, Search } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Error State` (42556:548), Type=Search Recovery.
 *
 * A centred message over a search field and a row of quick links: the way
 * out is a search, not a button. Mobile first: the base classes are Figma's
 * Mobile (360), `md:` its Tablet (768) and `lg:` its Desktop (1440). The
 * quick links stack on Mobile. Direction is the page's `dir`; every side is
 * a logical one, so the field's icon and the links' order mirror in Arabic.
 * The links' up-right arrows are not mirrored, as in Figma's RTL variants.
 */

export interface ErrorStateSearchRecoveryLink {
  label: React.ReactNode
  href: string
}

export interface ErrorStateSearchRecoveryCopy {
  /** The small line above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The search field's placeholder. */
  placeholder: string
  /** The search field's accessible name, read by screen readers in place of a visible label. */
  searchLabel: string
  /** The links under the field, in order. Each has a `label` and an `href`. Hidden when empty. */
  links: ErrorStateSearchRecoveryLink[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateSearchRecoveryCopy> = {
  en: {
    eyebrow: "ERROR 404",
    heading: "The page you’re looking for can’t be found.",
    description: "Try searching for it instead — most pages are one keyword away.",
    placeholder: "Search Fasla…",
    searchLabel: "Search Fasla",
    links: [
      { label: "Sitemap", href: "#sitemap" },
      { label: "Help centre", href: "#help" },
      { label: "Contact us", href: "#contact" },
    ],
  },
  ar: {
    eyebrow: (
      <>
        خطأ <bdi dir="ltr">404</bdi>
      </>
    ),
    heading: "الصفحة التي تبحث عنها غير موجودة.",
    description: "جرّب البحث عنها بدلًا من ذلك. أغلب الصفحات على بُعد كلمة واحدة.",
    placeholder: "ابحث في فاصلة…",
    searchLabel: "ابحث في فاصلة",
    links: [
      { label: "خريطة الموقع", href: "#sitemap" },
      { label: "مركز المساعدة", href: "#help" },
      { label: "تواصل معنا", href: "#contact" },
    ],
  },
}

export interface ErrorStateSearchRecoveryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateSearchRecoveryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Called with the query when the search is submitted (Enter). Without it,
   * the form submits the usual way: a GET to the current page with the query
   * as `name`.
   */
  onSearch?: (query: string) => void
  /**
   * The query's name in the submitted form.
   * @default "q"
   */
  name?: string
  /** The text already in the field. */
  defaultQuery?: string
  /**
   * Moves the focus to the field when the block mounts. Off by default, so a
   * screen reader starts at the heading.
   * @default false
   */
  autoFocus?: boolean
}

export function ErrorStateSearchRecovery({
  locale = "en",
  eyebrow,
  heading,
  description,
  placeholder,
  searchLabel,
  links,
  onSearch,
  name = "q",
  defaultQuery,
  autoFocus = false,
  className,
  ...props
}: ErrorStateSearchRecoveryProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const list = links ?? copy.links

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!onSearch) return
    event.preventDefault()
    const query = new FormData(event.currentTarget).get(name)
    onSearch(typeof query === "string" ? query.trim() : "")
  }

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-6 text-center md:gap-8">
        <div className="flex w-full flex-col gap-3">
          {label ? <p className="text-xs font-medium text-destructive">{label}</p> : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground lg:text-5xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>

        <form role="search" onSubmit={submit} className="w-full lg:max-w-[520px]">
          <Input
            type="search"
            name={name}
            size="lg"
            radius="rounded"
            defaultValue={defaultQuery}
            autoFocus={autoFocus}
            placeholder={placeholder ?? copy.placeholder}
            aria-label={searchLabel ?? copy.searchLabel}
            startIcon={<Search size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
          />
        </form>

        {list.length > 0 ? (
          <ul className="flex flex-col items-center gap-3 md:flex-row md:gap-5 lg:gap-6">
            {list.map((link, index) => (
              <li key={index} className="flex">
                <a
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                  <ArrowUpRight size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0" />
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
export const errorStateSearchRecoveryCopy = COPY
