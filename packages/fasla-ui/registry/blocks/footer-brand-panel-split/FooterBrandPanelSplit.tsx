import * as React from "react"
import { Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import type { SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_COMMON,
  FOOTER_LINK,
  FooterLegalBar,
  FooterLinkColumn,
  FooterLogo,
  FooterRule,
  FooterSection,
  FooterSocial,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Brand Panel Split.
 *
 * A `secondary` panel beside four link columns. The panel holds the logo, a
 * two-line pitch, the email and four social marks; the other side holds the
 * columns (Product, Learn, Company, Support, six links each), a hairline and
 * the legal bar. No motion: Figma has no chip for this Type.
 *
 * Desktop (1440) sets the panel 440 wide (24 radius, 40 padding) with the four
 * columns across, 32 apart. Tablet (768) stacks the panel over the links, the
 * columns two across. Mobile (360) is the same stack, the panel tighter (20)
 * and its headline XL. In Arabic everything mirrors by the page's `dir`; the
 * logo and the social marks are never flipped.
 */

export interface FooterBrandPanelSplitCopy {
  /** The panel's headline. */
  headline: string
  /** The panel's body. Hidden when empty. */
  body: string
  /** The email under the pitch. */
  email: string
  /** The link columns, in reading order. */
  columns: FooterColumn[]
  /** The copyright line. */
  copyright: string
  /** The legal links. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterBrandPanelSplitCopy> = {
  en: {
    headline: "Build it once. Ship it in two languages.",
    body: "Fasla gives product teams a single source of truth for components, tokens and RTL behaviour — so English and Arabic never drift apart.",
    email: "you@company.com",
    columns: [
      { title: "Product", links: links(["Components", "Blocks", "Templates", "Design tokens", "Changelog", "Design library"]) },
      { title: "Learn", links: links(["Documentation", "Guides", "Playground", "Showcase", "Blog", "Tutorials"]) },
      { title: "Company", links: links(["About", "Careers", "Customers", "Press", "Contact", "Partners"]) },
      { title: "Support", links: links(["Help center", "Community", "Status", "Security", "Report a bug", "Contact support"]) },
    ],
    copyright: FOOTER_COMMON.en.copyright,
    legal: links(["Privacy", "Terms", "Cookies", "Accessibility"]),
    legalLabel: "Legal links",
  },
  ar: {
    headline: "ابنِه مرة واحدة. أطلقه بلغتين.",
    body: "تمنح فاصلة فرق المنتج مصدر حقيقة واحدًا للمكوّنات والرموز وسلوك RTL، فلا تفترق العربية عن الإنجليزية أبدًا.",
    email: "you@company.com",
    columns: [
      { title: "المنتج", links: links(["المكوّنات", "الكتل", "القوالب", "رموز التصميم", "سجل التغييرات", "مكتبة التصميم"]) },
      { title: "تعلّم", links: links(["التوثيق", "الأدلة", "ساحة التجربة", "المعرض", "المدونة", "الدروس"]) },
      { title: "الشركة", links: links(["من نحن", "الوظائف", "العملاء", "الصحافة", "اتصل بنا", "الشركاء"]) },
      { title: "الدعم", links: links(["مركز المساعدة", "المجتمع", "الحالة", "الأمان", "الإبلاغ عن خطأ", "تواصل مع الدعم"]) },
    ],
    copyright: FOOTER_COMMON.ar.copyright,
    legal: links(["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول"]),
    legalLabel: "روابط قانونية",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerBrandPanelSplitCopy = COPY

export interface FooterBrandPanelSplitProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterBrandPanelSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "youtube"]

/** The copyright's year is a number inside Arabic text: Latin digits, kept left to right. */
function Digits({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d+)/).map((part, index) =>
        index % 2 ? (
          <bdi key={index} dir="ltr">
            {part}
          </bdi>
        ) : (
          part
        )
      )}
    </>
  )
}

export function FooterBrandPanelSplit({
  locale = "en",
  headline,
  body,
  email,
  columns,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  className,
  ...props
}: FooterBrandPanelSplitProps) {
  const copy = COPY[locale]
  const text = body ?? copy.body
  const address = email ?? copy.email
  return (
    <FooterSection className={cn("py-8 md:py-16 lg:pb-10 lg:pt-16", className)} {...props}>
      <div className="flex flex-col gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:gap-10">
        <div className="flex flex-col justify-between gap-5 rounded-3xl bg-secondary p-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:w-[440px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:gap-10 [@container(min-width:64rem)]:p-10">
          <div className="flex flex-col gap-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:gap-5">
            <FooterLogo />
            <h2 className="text-xl font-semibold text-secondary-foreground [@container(min-width:40rem)]:text-2xl">{headline ?? copy.headline}</h2>
            {text ? <p className="text-sm text-muted-foreground">{text}</p> : null}
          </div>
          <div className="flex flex-col gap-3 [@container(min-width:64rem)]:gap-4">
            {address ? (
              <a href={`mailto:${address}`} className={cn(FOOTER_LINK, "w-fit gap-2 font-medium text-secondary-foreground hover:text-secondary-foreground focus-visible:text-secondary-foreground active:text-secondary-foreground")}>
                <Mail aria-hidden="true" className="size-4 shrink-0" />
                <bdi dir="ltr">{address}</bdi>
              </a>
            ) : null}
            {socials.length ? <FooterSocial platforms={socials} className="gap-3 [@container(min-width:64rem)]:gap-4" /> : null}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 pt-2 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10">
          {(columns ?? copy.columns).length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-4">
              {(columns ?? copy.columns).map((column) => (
                <FooterLinkColumn key={column.title} title={column.title} links={column.links} className="[@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:gap-4" />
              ))}
            </div>
          ) : null}
          <FooterRule />
          <FooterLegalBar copyright={<Digits text={copyright ?? copy.copyright} />} links={legal ?? copy.legal} label={legalLabel ?? copy.legalLabel} />
        </div>
      </div>
    </FooterSection>
  )
}
