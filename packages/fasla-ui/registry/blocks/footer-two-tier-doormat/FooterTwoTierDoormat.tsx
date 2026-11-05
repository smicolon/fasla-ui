"use client"

import * as React from "react"
import { LifeBuoyIcon, MailIcon, MapPinIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_COMMON,
  FooterColumnTitle,
  FooterCopyright,
  FooterLinkItem,
  FooterRule,
  FooterSection,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Two-Tier Doormat.
 *
 * Two tiers. The doormat is five link columns of five links (Platform,
 * Solutions, Resources, Community, Company). Under a hairline, the contact
 * tier is four small cards (Head office, Talk to sales, Product support, Press
 * & partnerships) with a Lucide icon in a 32px box, a title and two lines.
 * Then a hairline and a legal bar: the logo and the copyright, the legal links
 * and four 18px social marks. No motion: Figma has no chip for this Type.
 *
 * Desktop (Figma 1440): five columns 40px apart; four cards across. Tablet
 * (768): three columns across, then two cards across. Mobile (360): two
 * columns across and the cards stacked, the legal bar stacked. In Arabic
 * everything mirrors by the page's `dir`; digits and addresses keep their own
 * direction inside the Arabic lines.
 *
 * STAND-INS (temporary):
 *  - `FooterContactCard` is a plain card (`card` surface, 1px `border`, 10px
 *    radius, `shadow-sm`, which is Figma's `xs` on Tailwind 3). The library's
 *    Card atom is 14px-rounded with a heavier shadow, and a block does not
 *    restyle an atom.
 */

export type FooterContactIcon = "map-pin" | "mail" | "life-buoy"

export interface FooterContact {
  icon: FooterContactIcon
  title: string
  /** The lines under the title; the two Figma shows. */
  lines: string[]
}

export interface FooterTwoTierDoormatCopy {
  /** The doormat's link columns, in reading order. */
  columns: FooterColumn[]
  /** The contact cards, in reading order. */
  contacts: FooterContact[]
  copyright: string
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (...labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterTwoTierDoormatCopy> = {
  en: {
    columns: [
      { title: "Platform", links: links("Overview", "Components", "Blocks", "Templates", "Integrations") },
      { title: "Solutions", links: links("Design teams", "Engineering", "Agencies", "Enterprise", "Startups") },
      { title: "Resources", links: links("Documentation", "Guides", "Blog", "Webinars", "Case studies") },
      { title: "Community", links: links("Community chat", "Code repo", "Showcase", "Contributors", "Events") },
      { title: "Company", links: links("About", "Careers", "Press", "Partners", "Contact") },
    ],
    contacts: [
      { icon: "map-pin", title: "Head office", lines: ["123 Example Street", "12345 Example City"] },
      { icon: "mail", title: "Talk to sales", lines: ["you@company.com", "company.com/contact"] },
      { icon: "life-buoy", title: "Product support", lines: ["help.fasla.design", "Mon–Fri, 09:00–18:00 CET"] },
      { icon: "mail", title: "Press & partnerships", lines: ["you@company.com", "Media kit and brand assets"] },
    ],
    copyright: FOOTER_COMMON.en.copyright,
    legal: links("Privacy", "Terms", "Cookies"),
    legalLabel: "Legal links",
  },
  ar: {
    columns: [
      { title: "المنصة", links: links("نظرة عامة", "المكوّنات", "الكتل", "القوالب", "التكاملات") },
      { title: "الحلول", links: links("فرق التصميم", "الهندسة", "الوكالات", "المؤسسات", "الشركات الناشئة") },
      { title: "الموارد", links: links("التوثيق", "الأدلة", "المدونة", "الندوات", "دراسات الحالة") },
      { title: "المجتمع", links: links("دردشة المجتمع", "مستودع الشيفرة", "المعرض", "المساهمون", "الفعاليات") },
      { title: "الشركة", links: links("من نحن", "الوظائف", "الصحافة", "الشركاء", "اتصل بنا") },
    ],
    contacts: [
      { icon: "map-pin", title: "المقر الرئيسي", lines: ["123 شارع المثال", "12345 مدينة المثال"] },
      { icon: "mail", title: "تحدّث إلى المبيعات", lines: ["you@company.com", "company.com/contact"] },
      { icon: "life-buoy", title: "دعم المنتج", lines: ["help.fasla.design", "الاثنين–الجمعة، 09:00–18:00 CET"] },
      { icon: "mail", title: "الصحافة والشراكات", lines: ["you@company.com", "الملف الإعلامي وأصول الهوية"] },
    ],
    copyright: FOOTER_COMMON.ar.copyright,
    legal: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط"),
    legalLabel: "روابط قانونية",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerTwoTierDoormatCopy = COPY

/** Numbers, emails, addresses and Latin words inside an Arabic line keep their own direction. */
function bidi(text: string, locale: FooterLocale): React.ReactNode {
  if (locale !== "ar") return text
  return text.split(/([A-Za-z0-9][A-Za-z0-9@./:–-]*(?:\s[A-Z]{2,4}\b)?)/).map((part, index) => (index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part))
}

const ICONS = { "map-pin": MapPinIcon, mail: MailIcon, "life-buoy": LifeBuoyIcon } as const

function FooterContactCard({ contact, locale }: { contact: FooterContact; locale: FooterLocale }) {
  const Icon = ICONS[contact.icon]
  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm [@container(min-width:40rem)]:gap-3 [@container(min-width:40rem)]:p-5 [@container(min-width:64rem)]:p-6">
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
        <Icon className="size-4" strokeWidth={1.5} />
      </span>
      <h3 className="text-sm font-semibold">{contact.title}</h3>
      {contact.lines.length ? (
        <div className="flex flex-col gap-1">
          {contact.lines.map((line) => (
            <p key={line} className="text-xs text-muted-foreground">
              {bidi(line, locale)}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function DoormatColumn({ column }: { column: FooterColumn }) {
  const id = React.useId()
  return (
    <nav aria-labelledby={id} className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
      <FooterColumnTitle id={id}>{column.title}</FooterColumnTitle>
      <ul className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3">
        {column.links.map((link) => (
          <li key={`${link.label}-${link.href}`} className="flex">
            <FooterLinkItem link={link} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** The social marks at Figma's 18px for this Type: 12px apart (8 on phones). Marks are never mirrored. */
function SocialMarks({ platforms }: { platforms: SocialPlatform[] }) {
  return (
    <ul className="flex items-center gap-2 [@container(min-width:40rem)]:gap-3">
      {platforms.map((platform) => (
        <li key={platform} className="flex">
          <a
            href="#"
            aria-label={SOCIAL_PLATFORM_NAMES[platform]}
            className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3 after:content-['']"
          >
            <SocialIcon platform={platform} color="negative" className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export interface FooterTwoTierDoormatProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterTwoTierDoormatCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "instagram"]

export function FooterTwoTierDoormat({ locale = "en", columns, contacts, copyright, legal, legalLabel, socials = DEFAULT_SOCIALS, className, ...props }: FooterTwoTierDoormatProps) {
  const copy = COPY[locale]
  const cols = (columns ?? copy.columns).filter((column) => column.links.length > 0)
  const cards = contacts ?? copy.contacts
  const legalLinks = legal ?? copy.legal
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      {cols.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-5 [@container(min-width:64rem)]:gap-x-10">
          {cols.map((column) => (
            <DoormatColumn key={column.title} column={column} />
          ))}
        </div>
      ) : null}
      {cols.length && cards.length ? <FooterRule /> : null}
      {cards.length ? (
        <ul className="grid auto-rows-fr grid-cols-[minmax(0,1fr)] gap-4 [@container(min-width:40rem)]:grid-cols-[repeat(2,minmax(0,1fr))] [@container(min-width:64rem)]:grid-cols-[repeat(4,minmax(0,1fr))]">
          {cards.map((contact) => (
            <li key={contact.title} className="flex min-w-0">
              <FooterContactCard contact={contact} locale={locale} />
            </li>
          ))}
        </ul>
      ) : null}
      <FooterRule />
      <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex items-center gap-3 [@container(min-width:64rem)]:gap-4">
          <FaslaLogo className="h-6" title="" />
          <FooterCopyright>{bidi(copyright ?? copy.copyright, locale)}</FooterCopyright>
        </div>
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
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
          {socials.length ? <SocialMarks platforms={socials} /> : null}
        </div>
      </div>
    </FooterSection>
  )
}
