"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { MahaamMark } from "./mahaam-navbar"

/*
 * Figma: `Mahaam Template` (47694:6712), the Footer section of each of its six
 * variants.
 *
 * Under a hairline: the brand (wordmark, a line, three store buttons) and four
 * columns of links, then a legal row (the template note, and the credits for
 * the artwork and the photographs), then a giant faint wordmark across the
 * foot. Desktop sets the brand over two columns' width and the four columns
 * beside it; Tablet puts the columns under the brand in one row; Mobile puts
 * them two by two. The legal row's two texts sit apart on Desktop and stack on
 * Tablet and Mobile.
 *
 * Nothing moves, so the section has no pause control. The credits are the
 * template's: the painting is public domain, the photograph of Faisal is
 * Unsplash's, and "Image by Freepik" for Noura and Khalid is credited here.
 *
 * Sized by the section's own width: Mobile is the base,
 * `[@container(min-width:48rem)]:` is Figma's Tablet and
 * `[@container(min-width:90rem)]:` its Desktop.
 */

type Locale = "en" | "ar"

export interface MahaamFooterColumn {
  title: string
  links: { label: string; href: string }[]
}

export interface MahaamFooterCopy {
  /** The wordmark's text, in the brand and, faint, at the foot. */
  brand: string
  tagline: string
  /** The store buttons. Their names are the stores', so they are not translated. */
  stores: { label: string; href: string }[]
  /** Product, Company, Resources and Legal. */
  columns: MahaamFooterColumn[]
  note: string
  /** The credits for the artwork and the photographs. */
  credits: React.ReactNode
}

const links = (labels: string[], hrefs: string[]) => labels.map((label, i) => ({ label, href: hrefs[i] ?? "#" }))
const STORES = [
  { label: "App Store", href: "#app-store" },
  { label: "Google Play", href: "#google-play" },
  { label: "macOS", href: "#macos" },
]

/** Figma's copy, English and Arabic. «مهام» is masculine. */
const COPY: Record<Locale, MahaamFooterCopy> = {
  en: {
    brand: "mahaam",
    tagline: "Speak your day. Mahaam sorts the rest.",
    stores: STORES,
    columns: [
      { title: "Product", links: links(["Features", "Pricing", "Changelog", "Download"], ["#product", "#pricing", "#changelog", "#download"]) },
      { title: "Company", links: links(["About", "Careers", "Blog", "Contact"], ["#about", "#careers", "#blog", "#contact"]) },
      { title: "Resources", links: links(["Help center", "Guides", "Security", "Status"], ["#help", "#guides", "#security", "#status"]) },
      { title: "Legal", links: links(["Privacy", "Terms", "Cookies"], ["#privacy", "#terms", "#cookies"]) },
    ],
    note: "A Fasla template. Mahaam, its customers and reviews are fictional.",
    credits:
      "Artwork, public domain: Paul Signac, The Harbour at Marseilles, State Hermitage Museum. Photo of Faisal: Christoph Aigner on Unsplash. Photos of Noura and Khalid: Freepik.",
  },
  ar: {
    brand: "مهام",
    tagline: "تحدّث عن يومك، ومهام يرتّب الباقي.",
    stores: STORES,
    columns: [
      { title: "المنتج", links: links(["الميزات", "الأسعار", "سجل التحديثات", "التنزيل"], ["#product", "#pricing", "#changelog", "#download"]) },
      { title: "الشركة", links: links(["من نحن", "الوظائف", "المدونة", "تواصل معنا"], ["#about", "#careers", "#blog", "#contact"]) },
      { title: "المصادر", links: links(["مركز المساعدة", "الأدلة", "الأمان", "الحالة"], ["#help", "#guides", "#security", "#status"]) },
      { title: "قانوني", links: links(["الخصوصية", "الشروط", "ملفات الارتباط"], ["#privacy", "#terms", "#cookies"]) },
    ],
    note: "قالب من فاصلة. مهام وعملاؤه ومراجعاته خيالية.",
    // The Latin name is isolated, so the full stop stays at the end of the line.
    credits: (
      <>
        العمل الفني من الملكية العامة: بول سينياك، «ميناء مرسيليا»، متحف الإرميتاج. صورة فيصل من تصوير كريستوف إيغنر عبر <bdi dir="ltr">Unsplash</bdi> وفق رخصتها. صورتا نورة وخالد من <bdi dir="ltr">Freepik</bdi>.
      </>
    ),
  },
}

export interface MahaamFooterProps extends React.HTMLAttributes<HTMLElement>, Partial<MahaamFooterCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
}

export function MahaamFooter({ locale = "en", brand, tagline, stores, columns, note, credits, className, ...props }: MahaamFooterProps) {
  const copy = COPY[locale]
  const name = brand ?? copy.brand
  return (
    <footer className={cn("[container-type:inline-size]", className)} {...props}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 overflow-hidden border-t border-border px-8 pt-12 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pt-16 [@container(min-width:90rem)]:gap-14 [@container(min-width:90rem)]:px-28">
        <div className="flex flex-col gap-8 [@container(min-width:48rem)]:gap-10 [@container(min-width:90rem)]:grid [@container(min-width:90rem)]:grid-cols-[2fr_1fr_1fr_1fr_1fr] [@container(min-width:90rem)]:items-start [@container(min-width:90rem)]:gap-8">
          <div className="flex flex-col items-start gap-4">
            <span className="flex items-center gap-2.5 text-xl font-medium text-foreground">
              <MahaamMark />
              {name}
            </span>
            <p className="text-sm text-muted-foreground">{tagline ?? copy.tagline}</p>
            <ul className="flex flex-wrap gap-2">
              {(stores ?? copy.stores).map((store) => (
                <li key={store.label}>
                  <a href={store.href} dir="ltr" className={buttonVariants({ variant: "outline", tone: "primary", size: "sm" })}>
                    {store.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8 [@container(min-width:48rem)]:grid-cols-4 [@container(min-width:90rem)]:col-span-4 [@container(min-width:90rem)]:grid-cols-4">
            {(columns ?? copy.columns).map((column) => (
              <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3 text-sm">
                <p className="text-muted-foreground">{column.title}</p>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-foreground outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 text-xs text-muted-foreground [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-4">
          <p>{note ?? copy.note}</p>
          <p className="[@container(min-width:90rem)]:max-w-[560px] [@container(min-width:90rem)]:text-right">{credits ?? copy.credits}</p>
        </div>
        {/* The faint wordmark runs across the foot and is not read aloud. */}
        <p aria-hidden="true" className="text-center text-7xl font-medium text-muted [@container(min-width:48rem)]:text-9xl">
          {name}
        </p>
      </div>
    </footer>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamFooterCopy = COPY
