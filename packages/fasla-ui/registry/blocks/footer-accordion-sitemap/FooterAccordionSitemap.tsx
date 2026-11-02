"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import type { SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_COMMON,
  FooterColumnTitle,
  FooterCopyright,
  FooterLinkItem,
  FooterSection,
  FooterSocial,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Accordion Sitemap.
 *
 * The sitemap folded into the Accordion atom: a header (the logo, a tagline and
 * four social marks), five groups (Product, Resources, Company, Developers,
 * Legal & Trust), and a legal bar. One group is open at a time and the first
 * is open by default, as Figma draws it. The open panel is three columns on
 * Desktop (Figma 1440), two on Tablet (768) and one on Mobile (360).
 *
 * Motion: the Accordion atom owns its own open and close (the height, the
 * chevron turn, the keyboard and focus). Figma's chip asks for 240ms with a
 * content fade delayed 60ms; the atom does 180ms and no fade, so those two
 * numbers are not built. Reduced motion is the atom's.
 *
 * Figma draws only the Product panel. The other four groups' columns here are
 * generic stand-in links of the same shape (stand-in content, not drawn).
 */

export interface FooterSitemapGroup {
  /** The value that names the group to the Accordion. */
  id: string
  title: string
  /** The panel's columns. */
  columns: FooterColumn[]
}

export interface FooterAccordionSitemapCopy {
  /** The line beside the logo. Hidden when empty. */
  tagline: string
  groups: FooterSitemapGroup[]
  copyright: string
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (...labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterAccordionSitemapCopy> = {
  en: {
    tagline: "Documentation & product sitemap",
    groups: [
      {
        id: "product",
        title: "Product",
        columns: [
          { title: "Components", links: links("Buttons", "Inputs", "Navigation", "Overlays") },
          { title: "Blocks", links: links("Hero", "Pricing", "Blog", "Footer") },
          { title: "Tokens", links: links("Color", "Spacing", "Radius", "Motion") },
        ],
      },
      {
        id: "resources",
        title: "Resources",
        columns: [
          { title: "Learn", links: links("Documentation", "Guides", "Tutorials", "Playground") },
          { title: "Explore", links: links("Showcase", "Blog", "Templates", "Release notes") },
        ],
      },
      {
        id: "company",
        title: "Company",
        columns: [
          { title: "Team", links: links("About", "Careers", "Customers", "Partners") },
          { title: "Reach us", links: links("Press kit", "Brand", "Contact", "Support") },
        ],
      },
      {
        id: "developers",
        title: "Developers",
        columns: [
          { title: "Build", links: links("API reference", "Code repo", "Command line", "Playground") },
          { title: "Stay current", links: links("Release notes", "Roadmap", "Status", "Changelog") },
        ],
      },
      {
        id: "legal-trust",
        title: "Legal & Trust",
        columns: [
          { title: "Legal", links: links("Privacy", "Terms", "Cookies", "Licenses") },
          { title: "Trust", links: links("Security", "Accessibility", "Status", "Contact") },
        ],
      },
    ],
    copyright: FOOTER_COMMON.en.copyright,
    legal: links("Privacy", "Terms", "Cookies", "Licenses"),
    legalLabel: "Legal",
  },
  ar: {
    tagline: "التوثيق وخريطة المنتج",
    groups: [
      {
        id: "product",
        title: "المنتج",
        columns: [
          { title: "المكوّنات", links: links("الأزرار", "الحقول", "التنقّل", "الطبقات") },
          { title: "الكتل", links: links("الهيرو", "الأسعار", "المدونة", "التذييل") },
          { title: "الرموز", links: links("الألوان", "المسافات", "الاستدارة", "الحركة") },
        ],
      },
      {
        id: "resources",
        title: "الموارد",
        columns: [
          { title: "التعلّم", links: links("التوثيق", "الأدلة", "الدروس", "ساحة التجربة") },
          { title: "الاستكشاف", links: links("المعرض", "المدونة", "القوالب", "ملاحظات الإصدار") },
        ],
      },
      {
        id: "company",
        title: "الشركة",
        columns: [
          { title: "الفريق", links: links("من نحن", "الوظائف", "العملاء", "الشركاء") },
          { title: "التواصل", links: links("الملف الصحفي", "الهوية", "اتصل بنا", "الدعم") },
        ],
      },
      {
        id: "developers",
        title: "المطوّرون",
        columns: [
          { title: "البناء", links: links("مرجع الواجهة البرمجية", "مستودع الشيفرة", "سطر الأوامر", "ساحة التجربة") },
          { title: "المستجدات", links: links("ملاحظات الإصدار", "خارطة الطريق", "الحالة", "سجل التغييرات") },
        ],
      },
      {
        id: "legal-trust",
        title: "القانون والثقة",
        columns: [
          { title: "قانوني", links: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط", "التراخيص") },
          { title: "الثقة", links: links("الأمان", "إمكانية الوصول", "الحالة", "اتصل بنا") },
        ],
      },
    ],
    copyright: FOOTER_COMMON.ar.copyright,
    legal: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط", "التراخيص"),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerAccordionSitemapCopy = COPY

/** Numbers and Latin words inside an Arabic line keep their own direction. */
function bidi(text: string, locale: FooterLocale): React.ReactNode {
  if (locale !== "ar") return text
  return text.split(/([A-Za-z0-9][A-Za-z0-9@./:–-]*)/).map((part, index) => (index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part))
}

function PanelColumn({ column }: { column: FooterColumn }) {
  const id = React.useId()
  return (
    <nav aria-labelledby={id} className="flex min-w-0 flex-col gap-2 [@container(min-width:40rem)]:gap-3">
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

export interface FooterAccordionSitemapProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterAccordionSitemapCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
  /** The group open at the start. The first by default; "" opens none. */
  defaultOpen?: string
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["github", "x", "linkedin", "discord"]

export function FooterAccordionSitemap({
  locale = "en",
  tagline,
  groups,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  defaultOpen,
  className,
  ...props
}: FooterAccordionSitemapProps) {
  const copy = COPY[locale]
  const tag = tagline ?? copy.tagline
  const list = (groups ?? copy.groups).filter((group) => group.columns.some((column) => column.links.length > 0))
  const legalLinks = legal ?? copy.legal
  const open = defaultOpen ?? list[0]?.id
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8", className)}
      contentClassName="gap-4 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-8"
      {...props}
    >
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex items-center gap-2 [@container(min-width:40rem)]:gap-3">
          <FaslaLogo className="h-7" title="" />
          {tag ? <p className="text-sm text-muted-foreground">{tag}</p> : null}
        </div>
        {socials.length ? <FooterSocial platforms={socials} className="[@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:gap-4" /> : null}
      </div>
      {list.length ? (
        <Accordion defaultValue={open ? [open] : []}>
          {list.map((group) => (
            <AccordionItem key={group.id} value={group.id} className="last:border-b">
              <AccordionTrigger>{group.title}</AccordionTrigger>
              <AccordionContent className="pt-1 pb-4 [@container(min-width:40rem)]:pb-6 [@container(min-width:64rem)]:pb-8">
                <div className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-x-8 [@container(min-width:40rem)]:gap-y-6 [@container(min-width:64rem)]:grid-cols-3 [@container(min-width:64rem)]:gap-x-16">
                  {group.columns
                    .filter((column) => column.links.length > 0)
                    .map((column) => (
                      <PanelColumn key={column.title} column={column} />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : null}
      <div className="flex flex-col [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-4">
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
    </FooterSection>
  )
}
