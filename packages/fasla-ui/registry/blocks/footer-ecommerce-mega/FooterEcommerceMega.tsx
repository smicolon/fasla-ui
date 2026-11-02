"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Select, type SelectOption } from "../../ui/select/select"
import type { SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_FORM_COPY,
  FooterCopyright,
  FooterLegalLinks,
  FooterLinkColumn,
  FooterLogo,
  FooterNewsletterForm,
  FooterRule,
  FooterSection,
  FooterSocial,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Ecommerce Mega.
 *
 * A full-width band on `secondary` (a welcome-offer title and line, and the
 * shared newsletter form at size md), then the body on the page background:
 * the brand block (logo, one line, five social marks) beside four link columns,
 * a hairline, a utility row (a region Select and a currency Select, six
 * payment names as small text pills) and the legal bar.
 *
 * Desktop (Figma 1440): the band is one row, copy at the start and the 410px
 * form at the end; the brand is 280 wide with the four columns filling the
 * rest, 40px apart; the selects and the pills share one row. Tablet (768): the
 * band copy stacks above the form; the brand has its own row, then the columns
 * three across (3 + 1); the selects share a row and the pills wrap under them.
 * Mobile (360): the form stacks (field over button), the columns go two across
 * and the selects stack.
 *
 * Motion: Sign up shows the button's own spinner and disables the field
 * (150ms), then the form cross-fades to the confirmation (200ms ease-out)
 * without changing the band's height (the shared form holds it). The field's
 * focus ring is the Input atom's. The Selects keep their own menus. The payment
 * pills do not animate. Reduced motion swaps at once.
 *
 * The payment names are text pills drawn here, since the library has no payment
 * marks: VISA, Mastercard, Amex, PayPal, Apple Pay and Klarna stay as words.
 */

export interface FooterEcommerceMegaCopy {
  /** The band title. */
  bandTitle: string
  /** The line under the band title. */
  bandSub: string
  /** The one line under the logo. */
  blurb: string
  /** The four link columns. */
  columns: FooterColumn[]
  /** Accessible name of the region Select. */
  regionLabel: string
  /** Accessible name of the currency Select. */
  currencyLabel: string
  regions: SelectOption[]
  currencies: SelectOption[]
  /** Accessible name of the payment list. */
  paymentLabel: string
  payments: string[]
  copyright: string
  legal: FooterLink[]
  legalLabel: string
  form: {
    placeholder: string
    emailLabel: string
    submit: string
    sent: string
    error: string
    invalid: string
  }
}

const COPY: Record<FooterLocale, FooterEcommerceMegaCopy> = {
  en: {
    bandTitle: "A welcome offer on your first order",
    bandSub: "Join our members for early access to drops and restocks.",
    blurb: "Design tools and studio goods, shipped worldwide.",
    columns: [
      { title: "Shop", links: ["New arrivals", "Best sellers", "Desk & tools", "Print & paper", "Gift cards"].map((label) => ({ label, href: "#" })) },
      { title: "Collections", links: ["Studio essentials", "Type specimens", "Limited editions", "Collaborations", "Sale"].map((label) => ({ label, href: "#" })) },
      { title: "Help", links: ["Shipping & delivery", "Returns & exchanges", "Size guide", "Order tracking", "Contact us"].map((label) => ({ label, href: "#" })) },
      { title: "About", links: ["Our story", "Sustainability", "Stockists", "Press", "Careers"].map((label) => ({ label, href: "#" })) },
    ],
    regionLabel: "Region",
    currencyLabel: "Currency",
    regions: [
      { value: "europe", label: "Europe" },
      { value: "north-america", label: "North America" },
      { value: "mena", label: "Middle East & North Africa" },
      { value: "asia-pacific", label: "Asia Pacific" },
    ],
    currencies: [
      { value: "eur", label: "EUR — Euro" },
      { value: "usd", label: "USD — US dollar" },
      { value: "gbp", label: "GBP — Pound sterling" },
      { value: "aed", label: "AED — Dirham" },
    ],
    paymentLabel: "Accepted payment methods",
    payments: ["VISA", "Mastercard", "Amex", "PayPal", "Apple Pay", "Klarna"],
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Cookies", "Accessibility"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal",
    form: {
      placeholder: "you@company.com",
      emailLabel: "Email address",
      submit: "Sign up",
      sent: FOOTER_FORM_COPY.en.ecommerceSent,
      error: FOOTER_FORM_COPY.en.ecommerceError,
      invalid: FOOTER_FORM_COPY.en.invalid,
    },
  },
  ar: {
    bandTitle: "عرض ترحيبي على طلبك الأول",
    bandSub: "انضم إلى أعضائنا للوصول المبكر إلى الإصدارات وإعادة التوفر.",
    blurb: "أدوات تصميم ومنتجات استوديو، تُشحن إلى جميع أنحاء العالم.",
    columns: [
      { title: "المتجر", links: ["وصل حديثًا", "الأكثر مبيعًا", "المكتب والأدوات", "مطبوعات وورق", "بطاقات هدايا"].map((label) => ({ label, href: "#" })) },
      { title: "التشكيلات", links: ["أساسيات الاستوديو", "نماذج الخطوط", "إصدارات محدودة", "تعاونات", "التخفيضات"].map((label) => ({ label, href: "#" })) },
      { title: "المساعدة", links: ["الشحن والتوصيل", "الإرجاع والاستبدال", "دليل المقاسات", "تتبع الطلب", "اتصل بنا"].map((label) => ({ label, href: "#" })) },
      { title: "من نحن", links: ["قصتنا", "الاستدامة", "نقاط البيع", "الصحافة", "الوظائف"].map((label) => ({ label, href: "#" })) },
    ],
    regionLabel: "المنطقة",
    currencyLabel: "العملة",
    regions: [
      { value: "europe", label: "أوروبا" },
      { value: "north-america", label: "أمريكا الشمالية" },
      { value: "mena", label: "الشرق الأوسط وشمال أفريقيا" },
      { value: "asia-pacific", label: "آسيا والمحيط الهادئ" },
    ],
    currencies: [
      { value: "eur", label: "EUR، يورو" },
      { value: "usd", label: "USD، دولار أمريكي" },
      { value: "gbp", label: "GBP، جنيه إسترليني" },
      { value: "aed", label: "AED، درهم" },
    ],
    paymentLabel: "طرق الدفع المقبولة",
    payments: ["VISA", "Mastercard", "Amex", "PayPal", "Apple Pay", "Klarna"],
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول"].map((label) => ({ label, href: "#" })),
    legalLabel: "قانوني",
    form: {
      placeholder: "you@company.com",
      emailLabel: "البريد الإلكتروني",
      submit: "سجّل",
      sent: FOOTER_FORM_COPY.ar.ecommerceSent,
      error: FOOTER_FORM_COPY.ar.ecommerceError,
      invalid: FOOTER_FORM_COPY.ar.invalid,
    },
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerEcommerceMegaCopy = COPY

export interface FooterEcommerceMegaProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<Omit<FooterEcommerceMegaCopy, "form">> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** Overrides for the band form's words. */
  form?: Partial<FooterEcommerceMegaCopy["form"]>
  /** The social marks, in order. */
  socials?: SocialPlatform[]
  /** Called with the address when Sign up is pressed. Return a promise to show the spinner until it settles. */
  onSubscribe?: (email: string) => void | Promise<void>
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["instagram", "tiktok", "pinterest", "x", "youtube"]

const COLUMN_GAP = "[@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:gap-4"

export function FooterEcommerceMega({
  locale = "en",
  bandTitle,
  bandSub,
  blurb,
  columns,
  regionLabel,
  currencyLabel,
  regions,
  currencies,
  paymentLabel,
  payments,
  copyright,
  legal,
  legalLabel,
  form,
  socials = DEFAULT_SOCIALS,
  onSubscribe,
  className,
  ...props
}: FooterEcommerceMegaProps) {
  const copy = COPY[locale]
  const formCopy = { ...copy.form, ...form }
  const cols = columns ?? copy.columns
  const regionItems = regions ?? copy.regions
  const currencyItems = currencies ?? copy.currencies
  const pills = payments ?? copy.payments
  const links = legal ?? copy.legal
  const title = bandTitle ?? copy.bandTitle
  const sub = bandSub ?? copy.bandSub
  const text = blurb ?? copy.blurb
  const hasUtility = regionItems.length > 0 || currencyItems.length > 0 || pills.length > 0
  return (
    <FooterSection className={cn("px-0 md:px-0 lg:px-0", className)} contentClassName="max-w-none" {...props}>
      <div className="bg-secondary px-4 py-4 md:px-6 md:py-6 lg:px-20 lg:py-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-10">
          <div className="flex min-w-0 flex-col gap-1 [@container(min-width:64rem)]:max-w-[680px]">
            <h2 className="text-xl font-semibold text-secondary-foreground">{title}</h2>
            {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
          </div>
          <FooterNewsletterForm
            placeholder={formCopy.placeholder}
            emailLabel={formCopy.emailLabel}
            submitLabel={formCopy.submit}
            sentMessage={formCopy.sent}
            errorMessage={formCopy.error}
            invalidMessage={formCopy.invalid}
            size="md"
            onSubscribe={onSubscribe}
            className="w-full [@container(min-width:64rem)]:w-[410px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:40rem)_and_(max-width:63.99rem)]:[&_form_button]:grow [@container(min-width:40rem)_and_(max-width:63.99rem)]:[&_form_button]:basis-0"
          />
        </div>
      </div>
      <div className="px-4 pb-4 pt-8 md:px-6 md:pb-16 md:pt-16 lg:px-20 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-[280px_repeat(4,minmax(0,1fr))] [@container(min-width:64rem)]:gap-x-10">
            <div className="col-span-2 flex flex-col items-start gap-3 [@container(min-width:40rem)]:col-span-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:col-span-1 [@container(min-width:64rem)]:gap-5">
              <FooterLogo />
              {text ? <p className="text-sm text-muted-foreground">{text}</p> : null}
              {socials.length ? <FooterSocial platforms={socials} /> : null}
            </div>
            {cols.map((column) => (
              <FooterLinkColumn key={column.title} title={column.title} links={column.links} className={COLUMN_GAP} />
            ))}
          </div>
          <FooterRule />
          {hasUtility ? (
            <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-6">
              {regionItems.length > 0 || currencyItems.length > 0 ? (
                <div className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-3">
                  {regionItems.length > 0 ? (
                    <Select
                      size="sm"
                      aria-label={regionLabel ?? copy.regionLabel}
                      items={regionItems}
                      defaultValue={regionItems[0]?.value}
                      className="w-full [@container(min-width:40rem)]:flex-1 [@container(min-width:64rem)]:w-[190px] [@container(min-width:64rem)]:flex-none"
                    />
                  ) : null}
                  {currencyItems.length > 0 ? (
                    <Select
                      size="sm"
                      aria-label={currencyLabel ?? copy.currencyLabel}
                      items={currencyItems}
                      defaultValue={currencyItems[0]?.value}
                      className="w-full [@container(min-width:40rem)]:flex-1 [@container(min-width:64rem)]:w-[150px] [@container(min-width:64rem)]:flex-none"
                    />
                  ) : null}
                </div>
              ) : null}
              {pills.length > 0 ? (
                <ul aria-label={paymentLabel ?? copy.paymentLabel} className="flex flex-wrap items-center gap-2">
                  {pills.map((name) => (
                    <li
                      key={name}
                      className="inline-flex h-8 items-center justify-center rounded-sm border border-border bg-card px-2 text-xs font-semibold text-muted-foreground [@container(min-width:40rem)]:px-3"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-start [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
            <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
            {links.length ? <FooterLegalLinks links={links} label={legalLabel ?? copy.legalLabel} /> : null}
          </div>
        </div>
      </div>
    </FooterSection>
  )
}
