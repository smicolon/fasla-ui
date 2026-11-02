import * as React from "react"
import { ArrowRightIcon, BadgeCheckIcon, CreditCardIcon, LockIcon, ShieldIcon, UsersIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { FooterCopyright, FooterLinkItem, FooterLogo, FooterRule, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Trust & Compliance. Motion chip: 47356:8539.
 *
 * A trust footer: a title and a sentence with an Outline sm Button beside them,
 * four certification cards (a shield, a lock, a badge-check and a users icon,
 * each with a title, a line and a link with an arrow), a payments note with five
 * payment names as text pills, a hairline, and the legal bar (logo, copyright,
 * six legal links).
 *
 * Motion (the chip): a card lifts on hover: its border goes `border` to
 * `foreground` and it rises 2px, 160ms, while the link's arrow slides 4px towards
 * the end of the line (mirrored in Arabic: it points left and slides left). On
 * touch, hover is replaced by active:: the card tints `secondary` for 120ms and
 * the arrow does not slide. Reduced motion keeps the border change only. The
 * Button and the links keep their own states.
 *
 * Desktop (1440) sets the cards four across, the head in one row. Tablet (768)
 * sets the cards 2-up and the head in a column. Mobile (360) stacks the cards and
 * tightens the cards' padding to 12px. In Arabic everything mirrors by the
 * page's `dir`.
 */

export interface FooterCertification {
  /** Which icon the card shows. */
  icon: "shield" | "lock" | "badge-check" | "users"
  title: string
  line: string
  /** The link's label. */
  link: string
  href: string
}

export interface FooterTrustComplianceCopy {
  title: string
  /** The sentence under the title. Hidden when empty. */
  sub: string
  /** The Outline button's label. Hidden when empty. */
  trustLabel: string
  /** Where the button goes. */
  trustHref: string
  /** The certification cards. */
  certifications: FooterCertification[]
  /** The accessible name of the cards. */
  certificationsLabel: string
  /** The payments note. Hidden with the marks when both are empty. */
  paymentNote: string
  /** The payment names, drawn as text pills. */
  payments: string[]
  /** The accessible name of the payment names. */
  paymentsLabel: string
  /** The copyright line. */
  copyright: string
  /** The legal links. Hidden when empty. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterTrustComplianceCopy> = {
  en: {
    title: "Built to pass your security review.",
    sub: "Audit reports, subprocessor lists and our accessibility conformance statement are available without an NDA.",
    trustLabel: "Visit the trust centre",
    trustHref: "#",
    certifications: [
      { icon: "shield", title: "Security certification", line: "Audited annually by an independent CPA firm.", link: "Request the report", href: "#" },
      { icon: "lock", title: "Management certification", line: "Information security management, certified.", link: "View certificate", href: "#" },
      { icon: "badge-check", title: "Privacy compliance", line: "Standard contractual clauses and EU data residency.", link: "Read the data terms", href: "#" },
      { icon: "users", title: "Accessibility statement", line: "Every component tested with screen readers and keyboard only.", link: "See the accessibility report", href: "#" },
    ],
    certificationsLabel: "Certifications",
    paymentNote: "Payments processed by a certified provider — card details never touch our servers.",
    payments: ["VISA", "Mastercard", "Amex", "PayPal", "Apple Pay"],
    paymentsLabel: "Accepted payments",
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Data terms", "Subprocessors", "Security", "Responsible disclosure"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal links",
  },
  ar: {
    title: "مبني ليجتاز مراجعتك الأمنية.",
    sub: "تقارير التدقيق وقوائم المعالجين الفرعيين وبيان مطابقة إمكانية الوصول متاحة دون اتفاقية سرية.",
    trustLabel: "زيارة مركز الثقة",
    trustHref: "#",
    certifications: [
      { icon: "shield", title: "شهادة الأمان", line: "يُدقَّق سنويًا من قبل شركة محاسبة مستقلة.", link: "اطلب التقرير", href: "#" },
      { icon: "lock", title: "شهادة الإدارة", line: "إدارة أمن المعلومات، معتمدة.", link: "عرض الشهادة", href: "#" },
      { icon: "badge-check", title: "الامتثال للخصوصية", line: "بنود تعاقدية قياسية وإقامة البيانات في الاتحاد الأوروبي.", link: "اقرأ شروط البيانات", href: "#" },
      { icon: "users", title: "بيان إمكانية الوصول", line: "كل مكوّن مُختبَر بقارئات الشاشة وبلوحة المفاتيح فقط.", link: "اطّلع على تقرير إمكانية الوصول", href: "#" },
    ],
    certificationsLabel: "الشهادات",
    paymentNote: "تُعالج المدفوعات عبر مزوّد معتمد، وبيانات البطاقات لا تمر بخوادمنا أبدًا.",
    payments: ["VISA", "Mastercard", "Amex", "PayPal", "Apple Pay"],
    paymentsLabel: "وسائل الدفع المقبولة",
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "شروط البيانات", "المعالجون الفرعيون", "الأمان", "الإفصاح المسؤول"].map((label) => ({ label, href: "#" })),
    legalLabel: "روابط قانونية",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerTrustComplianceCopy = COPY

export interface FooterTrustComplianceProps extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "title">, Partial<FooterTrustComplianceCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
}

const ICONS = { shield: ShieldIcon, lock: LockIcon, "badge-check": BadgeCheckIcon, users: UsersIcon }

export function FooterTrustCompliance({
  locale = "en",
  title,
  sub,
  trustLabel,
  trustHref,
  certifications,
  certificationsLabel,
  paymentNote,
  payments,
  paymentsLabel,
  copyright,
  legal,
  legalLabel,
  className,
  ...props
}: FooterTrustComplianceProps) {
  const copy = COPY[locale]
  const heading = title ?? copy.title
  const text = sub ?? copy.sub
  const button = trustLabel ?? copy.trustLabel
  const cards = certifications ?? copy.certifications
  const note = paymentNote ?? copy.paymentNote
  const marks = payments ?? copy.payments
  const links = legal ?? copy.legal
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-16", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      {heading || text || button ? (
        <div className="flex flex-col gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-10">
          <div className="flex max-w-[620px] flex-col gap-2">
            {heading ? <h2 className="text-xl font-semibold text-foreground">{heading}</h2> : null}
            {text ? <p className="text-sm text-muted-foreground">{text}</p> : null}
          </div>
          {button ? (
            <div className="flex shrink-0">
              <a href={trustHref ?? copy.trustHref} className={buttonVariants({ variant: "outline", size: "sm" })}>{button}</a>
            </div>
          ) : null}
        </div>
      ) : null}
      {cards.length ? (
        <ul aria-label={certificationsLabel ?? copy.certificationsLabel} className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
          {cards.map((card) => {
            const Icon = ICONS[card.icon]
            return (
              <li key={`${card.title}-${card.href}`} className="flex">
                <div className="group/card relative flex w-full flex-col justify-between gap-2 rounded-lg border border-border bg-card p-3 text-card-foreground transition-[border-color,transform,background-color] duration-[160ms] ease-out motion-reduce:transition-none motion-reduce:transform-none active:bg-secondary [@container(min-width:40rem)]:gap-3 [@container(min-width:40rem)]:p-4 [@container(min-width:64rem)]:p-5 hover:[@container(min-width:40rem)]:border-foreground hover:motion-safe:[@container(min-width:40rem)]:-translate-y-0.5">
                  <div className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3">
                    <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-[var(--radius-md)] bg-secondary text-secondary-foreground">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="text-sm font-semibold text-card-foreground">{card.title}</h3>
                    <p className="text-xs text-muted-foreground">{card.line}</p>
                  </div>
                  <a
                    href={card.href}
                    className="inline-flex w-fit items-center gap-2 rounded-sm text-xs font-medium text-card-foreground [outline:none] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring after:absolute after:inset-0 after:rounded-lg after:content-['']"
                  >
                    <span>{card.link}</span>
                    <span
                      aria-hidden="true"
                      className="inline-flex shrink-0 transition-transform duration-[160ms] ease-out motion-reduce:transition-none group-hover/card:motion-safe:[@container(min-width:40rem)]:translate-x-1 group-hover/card:motion-safe:rtl:[@container(min-width:40rem)]:-translate-x-1"
                    >
                      <ArrowRightIcon className="size-3 rtl:-scale-x-100" />
                    </span>
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      ) : null}
      {note || marks.length ? (
        <div className="flex flex-col gap-4 pt-2 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-6">
          {note ? (
            <p className="flex items-start gap-2 text-sm text-muted-foreground [@container(min-width:64rem)]:items-center">
              <CreditCardIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 [@container(min-width:64rem)]:mt-0" />
              <span>{note}</span>
            </p>
          ) : null}
          {marks.length ? (
            <ul aria-label={paymentsLabel ?? copy.paymentsLabel} className="flex flex-wrap items-center gap-2">
              {marks.map((mark) => (
                <li key={mark} className="flex">
                  <span dir="ltr" className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-border bg-card px-2 py-2 text-xs font-semibold text-muted-foreground [@container(min-width:40rem)]:px-3">
                    {mark}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <FooterRule />
      <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-5">
        <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterLogo className="h-6" />
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
        </div>
        {links.length ? (
          <nav aria-label={legalLabel ?? copy.legalLabel}>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
              {links.map((link) => (
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
