import * as React from "react"
import { ArrowRightIcon, BookOpenIcon, LanguagesIcon, SparklesIcon, ZapIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import type { SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FooterLegalBar,
  FooterLinkItem,
  FooterLogo,
  FooterRule,
  FooterSection,
  FooterSocial,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Product Family Switcher.
 *
 * A product switcher: a title and line with a ghost "Compare products" button,
 * four product tiles (an icon, a name, a line and an "Explore" link with an
 * arrow), a hairline, a company row (the logo with six links, and four social
 * marks) and the legal bar (the copyright and four legal links).
 *
 * Desktop (Figma 1440, container 1024 and up): the title and line at the start
 * of a row and the button at the opposite end, centred on it; the tiles four
 * across, 16px apart. Tablet (768) and Mobile: the button sits under the line
 * at the start edge of the title (left in English, right in Arabic) and at its
 * own width, not centred or stretched. Tablet: the tiles are 2 x 2; the company row stacks the logo and links over the marks.
 * Mobile (360): the tiles are one across; the links wrap under the logo.
 *
 * Each tile is one link named by its product. Product names are kept as Figma
 * has them, in both languages.
 *
 * Motion: a tile's border goes `border` to `foreground` and the tile lifts 2px
 * (160ms), and its Explore arrow slides 4px toward its direction (mirrored in
 * Arabic, so it points and slides left). "Compare products" keeps the Button's
 * own states. On touch the tile tints `secondary` for 120ms while pressed and
 * the arrow does not slide. Reduced motion keeps the border change only.
 */

export interface FooterProduct {
  name: string
  line: string
  /** Which icon the tile shows. */
  icon: "sparkles" | "book-open" | "zap" | "languages"
  href?: string
}

export interface FooterProductFamilySwitcherCopy {
  title: string
  sub: string
  compare: FooterLink
  /** The word on each tile's link. */
  explore: string
  /** Accessible name of the tiles. */
  productsLabel: string
  products: FooterProduct[]
  companyLabel: string
  company: FooterLink[]
  copyright: string
  legal: FooterLink[]
  legalLabel: string
}

const COPY: Record<FooterLocale, FooterProductFamilySwitcherCopy> = {
  en: {
    title: "One system. Many products.",
    sub: "Every product shares the same tokens, so switching between them costs nothing.",
    compare: { label: "Compare products", href: "#" },
    explore: "Explore",
    productsLabel: "Products",
    products: [
      { name: "Fasla Core", line: "Components with bilingual variants.", icon: "sparkles" },
      { name: "Fasla Blocks", line: "Page sections ready to compose.", icon: "book-open" },
      { name: "Fasla Tokens", line: "One token layer for design tools, CSS and native.", icon: "zap" },
      { name: "Fasla Arabic", line: "Type, numerals and RTL rules, solved.", icon: "languages" },
    ],
    companyLabel: "Company",
    company: ["About", "Careers", "Customers", "Partners", "Press", "Contact"].map((label) => ({ label, href: "#" })),
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Cookies", "Accessibility"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal links",
  },
  ar: {
    title: "نظام واحد. منتجات متعددة.",
    sub: "كل المنتجات تتشارك الرموز نفسها، فالتنقل بينها لا يكلّف شيئًا.",
    compare: { label: "قارن المنتجات", href: "#" },
    explore: "استكشف",
    productsLabel: "المنتجات",
    products: [
      { name: "فاصلة كور", line: "مكوّنات بنسخ ثنائية اللغة.", icon: "sparkles" },
      { name: "فاصلة بلوكس", line: "أقسام صفحات جاهزة للتركيب.", icon: "book-open" },
      { name: "فاصلة توكنز", line: "طبقة رموز واحدة لأدوات التصميم وأكواد الأنماط والتطبيقات الأصلية.", icon: "zap" },
      { name: "فاصلة العربية", line: "الخطوط والأرقام وقواعد RTL، محلولة.", icon: "languages" },
    ],
    companyLabel: "الشركة",
    company: ["من نحن", "الوظائف", "العملاء", "الشركاء", "الصحافة", "اتصل بنا"].map((label) => ({ label, href: "#" })),
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول"].map((label) => ({ label, href: "#" })),
    legalLabel: "روابط قانونية",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerProductFamilySwitcherCopy = COPY

export interface FooterProductFamilySwitcherProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterProductFamilySwitcherCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "youtube"]

const ICONS = { sparkles: SparklesIcon, "book-open": BookOpenIcon, zap: ZapIcon, languages: LanguagesIcon } as const

/** Latin runs (RTL, CSS) keep their own order inside Arabic text. */
function Bidi({ text, active }: { text: string; active: boolean }) {
  if (!active) return <>{text}</>
  return (
    <>
      {text.split(/([A-Za-z][A-Za-z0-9:.–@+/]*)/).map((part, i) =>
        i % 2 ? (
          <bdi key={i} dir="ltr">
            {part}
          </bdi>
        ) : (
          part
        )
      )}
    </>
  )
}

export function FooterProductFamilySwitcher({
  locale = "en",
  title,
  sub,
  compare,
  explore,
  productsLabel,
  products,
  companyLabel,
  company,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  className,
  ...props
}: FooterProductFamilySwitcherProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const tiles = products ?? copy.products
  const companyLinks = company ?? copy.company
  const cta = compare ?? copy.compare
  const exploreLabel = explore ?? copy.explore
  const heading = title ?? copy.title
  const line = sub ?? copy.sub
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-16", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      <div className="flex flex-col items-start gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-10">
        <div className="flex min-w-0 flex-col gap-2 [@container(min-width:64rem)]:max-w-[620px]">
          <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
          {line ? <p className="text-sm text-muted-foreground">{line}</p> : null}
        </div>
        {cta.label ? (
          <a href={cta.href} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {cta.label}
              <ArrowRightIcon aria-hidden="true" className="rtl:-scale-x-100" />
            </a>
        ) : null}
      </div>
      {tiles.length > 0 ? (
        <nav aria-label={productsLabel ?? copy.productsLabel}>
          <ul className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
            {tiles.map((product) => {
              const Icon = ICONS[product.icon]
              return (
                <li key={product.name} className="flex">
                  <a
                    href={product.href ?? "#"}
                    className={cn(
                      "group/tile flex min-w-0 flex-1 flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm [@container(min-width:40rem)]:p-5 [@container(min-width:64rem)]:p-6",
                      "transition-[border-color,transform,background-color] duration-[160ms] motion-reduce:transition-none",
                      "[outline:none] focus-visible:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      "hover:[@container(min-width:40rem)]:border-foreground hover:motion-safe:[@container(min-width:40rem)]:-translate-y-0.5",
                      "[@media(hover:none)]:duration-[120ms] active:[@media(hover:none)]:bg-secondary"
                    )}
                  >
                    <span className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3">
                      <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                        <Icon aria-hidden="true" className="size-[18px]" />
                      </span>
                      <span className="text-base font-semibold text-card-foreground">{product.name}</span>
                      <span className="text-sm text-muted-foreground">
                        <Bidi text={product.line} active={ar} />
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                      {exploreLabel}
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="size-3.5 shrink-0 transition-transform duration-[160ms] motion-reduce:transition-none rtl:-scale-x-100 group-hover/tile:motion-safe:[@container(min-width:40rem)]:translate-x-1 group-hover/tile:motion-safe:rtl:[@container(min-width:40rem)]:-translate-x-1"
                      />
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : null}
      <FooterRule />
      <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-8">
        <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterLogo className="h-[26px]" />
          {companyLinks.length ? (
            <nav aria-label={companyLabel ?? copy.companyLabel}>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-5 [@container(min-width:64rem)]:gap-x-6">
                {companyLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} className="text-foreground" />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        {socials.length ? <FooterSocial platforms={socials} /> : null}
      </div>
      <FooterLegalBar copyright={copyright ?? copy.copyright} links={legal ?? copy.legal} label={legalLabel ?? copy.legalLabel} />
    </FooterSection>
  )
}
