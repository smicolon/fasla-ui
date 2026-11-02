"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import {
  FooterCopyright,
  FooterLinkItem,
  FooterRule,
  FooterSection,
  usePrefersReducedMotion,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Index-Numbered Columns.
 *
 * An editorial index: a masthead (the logo over a light statement, with an
 * INDEX label at the far end), four columns each headed by its number (01 to
 * 04) and a title with five links, a hairline, and a legal bar with the
 * copyright, three legal links and a Back to top link. A 1px hairline marks
 * the inline start of each column (the left in English, the right in Arabic).
 *
 * Desktop (Figma 1440): four columns across. Tablet (768): two across. Mobile
 * (360): one, and the hairlines read as one continuous line.
 *
 * Motion (Figma's chip), once, when 35% of the index is on screen: each hairline
 * draws down from its top (scale Y 0 to 1, 320ms ease-out), 60ms apart in
 * reading order, so Arabic runs from the right with no extra code; its links
 * fade and rise 8px (220ms, 25ms apart) starting 120ms after the hairline. On a
 * phone every hairline draws at once. Link hover is the shared 120ms colour
 * change, and `:active` stands in on touch. The Back to top arrow lifts 3px on
 * hover and on press. Reduced motion plays nothing: everything is drawn in
 * place.
 */

export interface FooterIndexColumn extends FooterColumn {
  /** The index number shown above the title. Defaults to 01, 02, 03 by position. */
  number?: string
}

export interface FooterIndexNumberedColumnsCopy {
  /** The statement under the logo. Hidden when empty. */
  statement: string
  /** The label at the masthead's far end. */
  indexLabel: string
  columns: FooterIndexColumn[]
  copyright: string
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
  /** The link at the end of the legal bar. */
  backToTop: string
}

const links = (...labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterIndexNumberedColumnsCopy> = {
  en: {
    statement: "A design system built in two directions — every component, token and pattern verified in English and Arabic before it ships.",
    indexLabel: "INDEX",
    columns: [
      { number: "01", title: "Product", links: links("Components", "Blocks", "Templates", "Design tokens", "Changelog") },
      { number: "02", title: "Learn", links: links("Documentation", "Guides", "Playground", "Showcase", "Blog") },
      { number: "03", title: "Company", links: links("About", "Careers", "Customers", "Press", "Contact") },
      { number: "04", title: "Support", links: links("Help center", "Community", "Status", "Security", "Accessibility") },
    ],
    copyright: "© 2026 Fasla",
    legal: links("Privacy", "Terms", "Cookies"),
    legalLabel: "Legal",
    backToTop: "Back to top",
  },
  ar: {
    statement: "نظام تصميم مبني في اتجاهين: كل مكوّن ورمز ونمط يُتحقق منه بالعربية والإنجليزية قبل إطلاقه.",
    indexLabel: "الفهرس",
    columns: [
      { number: "01", title: "المنتج", links: links("المكوّنات", "الكتل", "القوالب", "رموز التصميم", "سجل التغييرات") },
      { number: "02", title: "تعلّم", links: links("التوثيق", "الأدلة", "ساحة التجربة", "المعرض", "المدونة") },
      { number: "03", title: "الشركة", links: links("من نحن", "الوظائف", "العملاء", "الصحافة", "اتصل بنا") },
      { number: "04", title: "الدعم", links: links("مركز المساعدة", "المجتمع", "الحالة", "الأمان", "إمكانية الوصول") },
    ],
    copyright: "© 2026 فاصلة",
    legal: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط"),
    legalLabel: "قانوني",
    backToTop: "العودة إلى الأعلى",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerIndexNumberedColumnsCopy = COPY

/** Numbers and Latin words inside an Arabic line keep their own direction. */
function bidi(text: string, locale: FooterLocale): React.ReactNode {
  if (locale !== "ar") return text
  return text.split(/([A-Za-z0-9][A-Za-z0-9@./:–-]*)/).map((part, index) => (index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part))
}

/**
 * Plays the index's entrance once, at 35% visible. Hairlines draw from the top
 * in document order; each column's links follow 120ms behind its own hairline.
 * Reduced motion plays nothing, so everything stays drawn in place.
 */
function useIndexReveal(ref: React.RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion()
  React.useEffect(() => {
    const root = ref.current
    if (!root || reduced || typeof IntersectionObserver === "undefined" || typeof root.animate !== "function") return
    const play = () => {
      // One column on a phone: the hairlines read as one line, drawn together.
      const single = root.getBoundingClientRect().width < 640
      root.querySelectorAll<HTMLElement>("[data-index-column]").forEach((column, index) => {
        const start = single ? 0 : index * 60
        column.querySelector<HTMLElement>("[data-hairline]")?.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 320, delay: start, easing: "ease-out", fill: "backwards" })
        column.querySelectorAll<HTMLElement>("[data-link]").forEach((link, order) => {
          link.animate(
            [
              { opacity: 0, transform: "translateY(8px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 220, delay: index * 60 + 120 + order * 25, easing: "ease-out", fill: "backwards" }
          )
        })
      })
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          play()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [ref, reduced])
}

function IndexColumn({ column, position }: { column: FooterIndexColumn; position: number }) {
  const id = React.useId()
  const number = column.number ?? String(position + 1).padStart(2, "0")
  return (
    <nav
      aria-labelledby={id}
      data-index-column=""
      className="relative flex min-w-0 flex-col gap-3 px-4 [@container(min-width:40rem)]:gap-4 [@container(min-width:40rem)]:px-5 [@container(min-width:64rem)]:gap-5 [@container(min-width:64rem)]:px-6"
    >
      <span aria-hidden="true" data-hairline="" className="absolute inset-y-0 start-0 w-px origin-top bg-border" />
      <div className="flex flex-col gap-1">
        <span aria-hidden="true" className="text-sm font-medium text-muted-foreground">
          {number}
        </span>
        <h3 id={id} className="text-base font-semibold text-foreground">
          {column.title}
        </h3>
      </div>
      <ul className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3">
        {column.links.map((link) => (
          <li key={`${link.label}-${link.href}`} data-link="" className="flex">
            <FooterLinkItem link={link} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export interface FooterIndexNumberedColumnsProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterIndexNumberedColumnsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
}

export function FooterIndexNumberedColumns({ locale = "en", statement, indexLabel, columns, copyright, legal, legalLabel, backToTop, className, ...props }: FooterIndexNumberedColumnsProps) {
  const copy = COPY[locale]
  const rootRef = React.useRef<HTMLElement | null>(null)
  useIndexReveal(rootRef)
  const text = statement ?? copy.statement
  const cols = (columns ?? copy.columns).filter((column) => column.links.length > 0)
  const legalLinks = legal ?? copy.legal
  const label = indexLabel ?? copy.indexLabel
  return (
    <FooterSection
      ref={rootRef}
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-20", className)}
      contentClassName="gap-8 [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:gap-16"
      {...props}
    >
      <div className="flex flex-col gap-6 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-start [@container(min-width:40rem)]:justify-between">
        <div className="flex max-w-[560px] flex-col items-start gap-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:gap-5">
          <FaslaLogo className="h-8" title="" />
          {text ? <p className="text-lg font-light text-muted-foreground">{text}</p> : null}
        </div>
        {label ? <p className="text-list-header font-medium uppercase text-muted-foreground">{label}</p> : null}
      </div>
      {cols.length ? (
        <div className="grid grid-cols-1 gap-y-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-y-8 [@container(min-width:64rem)]:grid-cols-4">
          {cols.map((column, index) => (
            <IndexColumn key={column.title} column={column} position={index} />
          ))}
        </div>
      ) : null}
      <FooterRule />
      <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterCopyright>{bidi(copyright ?? copy.copyright, locale)}</FooterCopyright>
          {legalLinks.length ? (
            <nav aria-label={legalLabel ?? copy.legalLabel}>
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
                {legalLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} className="text-xs" />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        <a
          href="#"
          className="group/top relative inline-flex items-center gap-2 self-start rounded-sm text-xs font-medium text-foreground [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] [@container(min-width:40rem)]:self-auto"
        >
          {backToTop ?? copy.backToTop}
          {/* A vertical arrow: never mirrored. */}
          <ArrowUpIcon
            aria-hidden="true"
            className="size-3.5 transition-transform duration-150 ease-out motion-reduce:transition-none group-active/top:-translate-y-[3px] group-hover/top:[@container(min-width:40rem)]:-translate-y-[3px]"
          />
        </a>
      </div>
    </FooterSection>
  )
}
