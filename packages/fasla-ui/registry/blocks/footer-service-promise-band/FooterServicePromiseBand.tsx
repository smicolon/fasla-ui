import * as React from "react"
import { AwardIcon, CornerDownRightIcon, HeadphonesIcon, MailIcon, PhoneIcon, TruckIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  FOOTER_LINK,
  FooterCopyright,
  FooterLegalLinks,
  FooterLinkColumn,
  FooterLogo,
  FooterRule,
  FooterSection,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Service Promise Band.
 *
 * A row of four service promises (an icon, a title and one line each) over a
 * hairline, then the directory (the logo with a phone and an email line, and
 * three link columns), another hairline, and the legal bar with the copyright,
 * three legal links and three payment names as text pills. The whole footer has
 * a top border. No motion: Figma has no chip for this Type.
 *
 * Desktop (Figma 1440): four promises across, 24px inside, a hairline between
 * them; the brand is 300 wide with three columns filling the rest, 48px apart;
 * the legal bar is one row with the pills at the end. Tablet (768): the
 * promises are 2 x 2, the brand has its own row and the three columns follow.
 * Mobile (360): the promises stack, the columns go two across.
 */

export interface FooterServicePromise {
  title: string
  line: string
}

export interface FooterServicePromiseBandCopy {
  /** Free delivery, easy returns, warranty and human support, in that order. */
  promises: FooterServicePromise[]
  /** Accessible name of the promises list. */
  promisesLabel: string
  phone: string
  email: string
  columns: FooterColumn[]
  copyright: string
  legal: FooterLink[]
  legalLabel: string
  /** Accessible name of the payment list. */
  paymentLabel: string
  payments: string[]
}

const COPY: Record<FooterLocale, FooterServicePromiseBandCopy> = {
  en: {
    promises: [
      { title: "Free delivery", line: "On qualifying orders, worldwide." },
      { title: "Easy returns", line: "Unused and unopened, no questions asked." },
      { title: "Warranty included", line: "Covers manufacturing defects on all hardware." },
      { title: "Human support", line: "Mon–Fri, 09:00–18:00 CET, from a real person." },
    ],
    promisesLabel: "Our promises",
    phone: "+00 000 000 000",
    email: "you@company.com",
    columns: [
      { title: "Shop", links: ["New arrivals", "Desk & tools", "Print & paper", "Gift cards"].map((label) => ({ label, href: "#" })) },
      { title: "Customer care", links: ["Track my order", "Shipping", "Returns", "Warranty claim"].map((label) => ({ label, href: "#" })) },
      { title: "Company", links: ["Our story", "Stockists", "Careers", "Press"].map((label) => ({ label, href: "#" })) },
    ],
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Cookies"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal links",
    paymentLabel: "Accepted payment methods",
    payments: ["VISA", "Mastercard", "Apple Pay"],
  },
  ar: {
    promises: [
      { title: "توصيل مجاني", line: "على الطلبات المؤهلة، حول العالم." },
      { title: "إرجاع سهل", line: "غير مستخدم وغير مفتوح، دون أسئلة." },
      { title: "الضمان مشمول", line: "يغطي عيوب التصنيع في جميع الأجهزة." },
      { title: "دعم بشري", line: "الاثنين–الجمعة، 09:00–18:00 CET، من شخص حقيقي." },
    ],
    promisesLabel: "وعودنا",
    phone: "+00 000 000 000",
    email: "you@company.com",
    columns: [
      { title: "المتجر", links: ["وصل حديثًا", "المكتب والأدوات", "مطبوعات وورق", "بطاقات هدايا"].map((label) => ({ label, href: "#" })) },
      { title: "خدمة العملاء", links: ["تتبع طلبي", "الشحن", "الإرجاع", "مطالبة ضمان"].map((label) => ({ label, href: "#" })) },
      { title: "الشركة", links: ["قصتنا", "نقاط البيع", "الوظائف", "الصحافة"].map((label) => ({ label, href: "#" })) },
    ],
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "ملفات تعريف الارتباط"].map((label) => ({ label, href: "#" })),
    legalLabel: "روابط قانونية",
    paymentLabel: "طرق الدفع المقبولة",
    payments: ["VISA", "Mastercard", "Apple Pay"],
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerServicePromiseBandCopy = COPY

export interface FooterServicePromiseBandProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterServicePromiseBandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
}

const ICONS = [TruckIcon, CornerDownRightIcon, AwardIcon, HeadphonesIcon]

/** Latin runs (hours, zones, numbers) keep their own order inside Arabic text. */
function Bidi({ text, active }: { text: string; active: boolean }) {
  if (!active) return <>{text}</>
  return (
    <>
      {text.split(/([A-Za-z0-9+][A-Za-z0-9:.–@+/ ]*[A-Za-z0-9]|[A-Za-z0-9])/).map((part, i) =>
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

/** Promise padding and hairlines by place: 2 across from Tablet, 4 across from Desktop. */
function promiseClass(index: number) {
  return cn(
    "flex items-center gap-2 [@container(min-width:40rem)]:gap-3",
    index % 2 === 0 ? "[@container(min-width:40rem)]:pe-6" : "[@container(min-width:40rem)]:border-s [@container(min-width:40rem)]:border-border [@container(min-width:40rem)]:ps-6",
    index > 0 && index % 2 === 0 && "[@container(min-width:64rem)]:border-s [@container(min-width:64rem)]:border-border",
    "[@container(min-width:64rem)]:ps-6 [@container(min-width:64rem)]:pe-6"
  )
}

export function FooterServicePromiseBand({
  locale = "en",
  promises,
  promisesLabel,
  phone,
  email,
  columns,
  copyright,
  legal,
  legalLabel,
  paymentLabel,
  payments,
  className,
  ...props
}: FooterServicePromiseBandProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const items = promises ?? copy.promises
  const cols = columns ?? copy.columns
  const links = legal ?? copy.legal
  const pills = payments ?? copy.payments
  const phoneText = phone ?? copy.phone
  const emailText = email ?? copy.email
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-12", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      {items.length > 0 ? (
        <>
          <ul
            aria-label={promisesLabel ?? copy.promisesLabel}
            className="grid grid-cols-1 gap-y-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4 [@container(min-width:64rem)]:gap-y-0"
          >
            {items.map((promise, index) => {
              const Icon = ICONS[index % ICONS.length] ?? TruckIcon
              return (
                <li key={promise.title} className={promiseClass(index)}>
                  <Icon aria-hidden="true" className="size-[22px] shrink-0 text-foreground" strokeWidth={1.5} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">{promise.title}</p>
                    <p className="text-xs text-muted-foreground">
                      <Bidi text={promise.line} active={ar} />
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
          <FooterRule />
        </>
      ) : null}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-[300px_repeat(3,minmax(0,1fr))] [@container(min-width:64rem)]:gap-x-12">
        <div className="col-span-2 flex flex-col items-start gap-3 [@container(min-width:40rem)]:col-span-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:col-span-1 [@container(min-width:64rem)]:gap-5">
          <FooterLogo />
          <ul className="flex flex-col gap-2">
            {phoneText ? (
              <li className="flex">
                <a href={`tel:${phoneText.replace(/[^+\d]/g, "")}`} className={cn(FOOTER_LINK, "gap-2")}>
                  <PhoneIcon aria-hidden="true" className="size-3.5 shrink-0" />
                  <bdi dir="ltr">{phoneText}</bdi>
                </a>
              </li>
            ) : null}
            {emailText ? (
              <li className="flex">
                <a href={`mailto:${emailText}`} className={cn(FOOTER_LINK, "gap-2")}>
                  <MailIcon aria-hidden="true" className="size-3.5 shrink-0" />
                  <bdi dir="ltr">{emailText}</bdi>
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        {cols.map((column) => (
          <FooterLinkColumn key={column.title} title={column.title} links={column.links} className="[@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:gap-4" />
        ))}
      </div>
      <FooterRule />
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
          {links.length ? <FooterLegalLinks links={links} label={legalLabel ?? copy.legalLabel} /> : null}
        </div>
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
    </FooterSection>
  )
}
