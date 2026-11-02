"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import { Select, type SelectOption } from "../../ui/select/select"
import { StatusIndicator } from "../../ui/status-indicator/status-indicator"
import {
  FooterColumnTitle,
  FooterCopyright,
  FooterDot,
  FooterLinkItem,
  FooterRule,
  FooterSection,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Wide Sitemap Mega.
 *
 * The big sitemap: a utility bar (the logo and a tagline on one side, the
 * language and region Selects on the other), a hairline, six link columns of
 * seven links each, a hairline, and a legal bar that starts with the Status
 * Indicator and "System status". No motion: Figma has no chip for this Type.
 *
 * Desktop (Figma 1440) sets the six columns 40px apart in one row. Tablet (768)
 * sets them three across. Mobile (360) sets them two across, and stacks the
 * utility bar (the Selects go full width) and the legal bar. In Arabic
 * everything mirrors by the page's `dir`.
 */

export interface FooterWideSitemapMegaCopy {
  /** The line beside the logo. Hidden when empty. */
  tagline: string
  /** The language Select's accessible name. */
  languageLabel: string
  /** The region Select's accessible name. */
  regionLabel: string
  languages: SelectOption[]
  regions: SelectOption[]
  /** The chosen language and region to start with. */
  defaultLanguage: string
  defaultRegion: string
  /** The sitemap's columns, in reading order. */
  columns: FooterColumn[]
  /** The words beside the status dot. */
  status: string
  /** The copyright line. */
  copyright: string
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (...labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterWideSitemapMegaCopy> = {
  en: {
    tagline: "Design system for bilingual products",
    languageLabel: "Language",
    regionLabel: "Region",
    languages: [
      { value: "en", label: "English (US)" },
      { value: "ar", label: "العربية" },
    ],
    regions: [
      { value: "europe", label: "Europe" },
      { value: "middle-east", label: "Middle East" },
      { value: "north-america", label: "North America" },
      { value: "asia-pacific", label: "Asia Pacific" },
    ],
    defaultLanguage: "en",
    defaultRegion: "europe",
    columns: [
      { title: "Components", links: links("Buttons", "Inputs", "Navigation", "Overlays", "Data display", "Feedback", "Charts") },
      { title: "Patterns", links: links("Onboarding", "Pricing", "Testimonials", "Blog", "Careers", "Checkout", "Empty states") },
      { title: "Foundations", links: links("Color", "Typography", "Spacing", "Radius", "Elevation", "Motion", "Iconography") },
      { title: "Resources", links: links("Documentation", "Design library", "Code repo", "Release notes", "Roadmap", "Playground", "Templates") },
      { title: "Company", links: links("About", "Careers", "Customers", "Partners", "Press kit", "Brand", "Contact") },
      { title: "Support", links: links("Help center", "Community", "Report a bug", "Request a feature", "Status", "Security", "Accessibility") },
    ],
    status: "System status",
    copyright: "© 2026 Fasla",
    legal: links("Privacy", "Terms", "Cookies", "Sitemap"),
    legalLabel: "Legal",
  },
  ar: {
    tagline: "نظام تصميم للمنتجات ثنائية اللغة",
    languageLabel: "اللغة",
    regionLabel: "المنطقة",
    languages: [
      { value: "en", label: "English (US)" },
      { value: "ar", label: "العربية" },
    ],
    regions: [
      { value: "europe", label: "أوروبا" },
      { value: "middle-east", label: "الشرق الأوسط" },
      { value: "north-america", label: "أمريكا الشمالية" },
      { value: "asia-pacific", label: "آسيا والمحيط الهادئ" },
    ],
    defaultLanguage: "ar",
    defaultRegion: "europe",
    columns: [
      { title: "المكوّنات", links: links("الأزرار", "الحقول", "التنقّل", "الطبقات", "عرض البيانات", "التنبيهات", "المخططات") },
      { title: "الأنماط", links: links("التهيئة", "الأسعار", "آراء العملاء", "المدونة", "الوظائف", "الدفع", "الحالات الفارغة") },
      { title: "الأساسيات", links: links("الألوان", "الخطوط", "المسافات", "الاستدارة", "الارتفاع", "الحركة", "الأيقونات") },
      { title: "الموارد", links: links("التوثيق", "مكتبة التصميم", "مستودع الشيفرة", "ملاحظات الإصدار", "خارطة الطريق", "ساحة التجربة", "القوالب") },
      { title: "الشركة", links: links("من نحن", "الوظائف", "العملاء", "الشركاء", "الملف الصحفي", "الهوية", "اتصل بنا") },
      { title: "الدعم", links: links("مركز المساعدة", "المجتمع", "الإبلاغ عن خطأ", "اطلب ميزة", "الحالة", "الأمان", "إمكانية الوصول") },
    ],
    status: "حالة النظام",
    copyright: "© 2026 فاصلة",
    legal: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط", "خريطة الموقع"),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerWideSitemapMegaCopy = COPY

/** Numbers and Latin words inside an Arabic line keep their own direction. */
function bidi(text: string, locale: FooterLocale): React.ReactNode {
  if (locale !== "ar") return text
  return text.split(/([A-Za-z0-9][A-Za-z0-9@./:–-]*)/).map((part, index) => (index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part))
}

function SitemapColumn({ column }: { column: FooterColumn }) {
  const id = React.useId()
  return (
    <nav aria-labelledby={id} className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
      <FooterColumnTitle id={id}>{column.title}</FooterColumnTitle>
      <ul className="flex flex-col gap-2">
        {column.links.map((link) => (
          <li key={`${link.label}-${link.href}`} className="flex">
            <FooterLinkItem link={link} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export interface FooterWideSitemapMegaProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterWideSitemapMegaCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
}

export function FooterWideSitemapMega({
  locale = "en",
  tagline,
  languageLabel,
  regionLabel,
  languages,
  regions,
  defaultLanguage,
  defaultRegion,
  columns,
  status,
  copyright,
  legal,
  legalLabel,
  className,
  ...props
}: FooterWideSitemapMegaProps) {
  const copy = COPY[locale]
  const tag = tagline ?? copy.tagline
  const langs = languages ?? copy.languages
  const regs = regions ?? copy.regions
  const cols = (columns ?? copy.columns).filter((column) => column.links.length > 0)
  const legalLinks = legal ?? copy.legal
  const statusText = status ?? copy.status
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex flex-col items-start gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-3">
          <FaslaLogo className="h-7" title="" />
          {tag ? <p className="text-sm text-muted-foreground">{tag}</p> : null}
        </div>
        <div className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-3">
          {langs.length ? (
            <Select size="sm" aria-label={languageLabel ?? copy.languageLabel} items={langs} defaultValue={defaultLanguage ?? copy.defaultLanguage} className="w-full [@container(min-width:40rem)]:w-[168px]" />
          ) : null}
          {regs.length ? (
            <Select size="sm" aria-label={regionLabel ?? copy.regionLabel} items={regs} defaultValue={defaultRegion ?? copy.defaultRegion} className="w-full [@container(min-width:40rem)]:w-[208px]" />
          ) : null}
        </div>
      </div>
      <FooterRule />
      {cols.length ? (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 py-4 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-8 [@container(min-width:40rem)]:py-5 [@container(min-width:64rem)]:grid-cols-6 [@container(min-width:64rem)]:gap-x-10 [@container(min-width:64rem)]:py-6">
            {cols.map((column) => (
              <SitemapColumn key={column.title} column={column} />
            ))}
          </div>
          <FooterRule />
        </>
      ) : null}
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex items-center gap-2 [@container(min-width:40rem)]:gap-3">
          <StatusIndicator status="online" size="8" label="" />
          <span className="text-xs text-muted-foreground">{statusText}</span>
          <FooterDot className="text-border opacity-100" />
          <FooterCopyright>{bidi(copyright ?? copy.copyright, locale)}</FooterCopyright>
        </div>
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
    </FooterSection>
  )
}
