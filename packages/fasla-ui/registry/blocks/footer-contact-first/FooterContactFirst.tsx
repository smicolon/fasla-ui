import * as React from "react"
import { ArrowUpRightIcon, MailIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { FooterCopyright, FooterLinkItem, FooterLogo, FooterRule, FooterSection, type FooterLink, type FooterLocale, type FooterPhoto } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Contact-First. Motion chip: 47356:8524.
 *
 * The footer opens with how to reach the company: a small label, the address
 * to write to set very large in Light with an arrow-up-right after it, and one
 * sentence. Under it the offices (a photo, the city, the address and an email
 * each), a hairline, and the legal bar (logo, copyright, three legal links, five
 * social marks).
 *
 * Motion (the chip): on hover and on keyboard focus the arrow moves 6px up and
 * towards the end of the line while its opacity goes .6 to 1, and an underline
 * draws under the address, both 220ms ease-out; in Arabic the arrow is mirrored
 * (up and to the left) and the underline draws from right to left. On touch,
 * hover is replaced by active:: the address tints `muted-foreground` for 120ms.
 * Reduced motion keeps only the colour change. The office photos do not animate.
 *
 * Desktop (1440) sets the address at 5XL, the offices side by side, a 400x200
 * photo above each, 80px above and 32px below. Tablet (768) sets it at 3XL (30px: the style is 4XL, its size follows the responsive variable) with
 * the offices 2-up and the photo filling its column. Mobile (360) stacks the
 * offices 1-up and the legal bar. In Arabic everything mirrors by the page's `dir`.
 */

export interface FooterOffice {
  /** The city, as the office's heading. */
  city: string
  /** The address, one line per entry. */
  address: string[]
  /** The office's email address. */
  email: string
  /** The office's photo. Without one the slot shows the muted ground at the same size. */
  image?: FooterPhoto
}

export interface FooterContactFirstCopy {
  /** The small label above the address. */
  label: string
  /** The address to write to, set large. Hidden when empty. */
  email: string
  /** The sentence under it. Hidden when empty. */
  sub: string
  /** The offices, in reading order. */
  offices: FooterOffice[]
  /** The copyright line. */
  copyright: string
  /** The legal links. Hidden when empty. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
  /** The accessible name of the social marks. */
  socialLabel: string
  /** The accessible name of the list of offices. */
  officesLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterContactFirstCopy> = {
  en: {
    label: "Start a conversation",
    email: "you@company.com",
    sub: "Or book time directly with a design engineer — we answer within one business day.",
    offices: [
      { city: "Example City", address: ["123 Example Street", "12345 Example City"], email: "you@company.com" },
      { city: "Sample Town", address: ["456 Sample Road", "54321 Sample Town"], email: "you@company.com" },
    ],
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Cookies"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal",
    socialLabel: "Social",
    officesLabel: "Offices",
  },
  ar: {
    label: "ابدأ محادثة",
    email: "you@company.com",
    sub: "أو احجز وقتًا مباشرة مع مهندس تصميم، ونجيب خلال يوم عمل واحد.",
    offices: [
      { city: "مدينة المثال", address: ["123 شارع المثال", "12345 مدينة المثال"], email: "you@company.com" },
      { city: "بلدة النموذج", address: ["456 شارع النموذج", "54321 بلدة النموذج"], email: "you@company.com" },
    ],
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "ملفات تعريف الارتباط"].map((label) => ({ label, href: "#" })),
    legalLabel: "قانوني",
    socialLabel: "التواصل الاجتماعي",
    officesLabel: "المكاتب",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerContactFirstCopy = COPY

export interface FooterContactFirstProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterContactFirstCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "instagram", "youtube"]

/** Latin and digit runs inside Arabic text keep their own direction. */
const LATIN = /([A-Za-z0-9][A-Za-z0-9@.:/+_–-]*(?:\s[A-Za-z0-9][A-Za-z0-9@.:/+_–-]*)*)/g
function bidi(text: string, on: boolean): React.ReactNode {
  if (!on) return text
  return text.split(LATIN).map((part, index) =>
    index % 2 ? (
      <bdi key={index} dir="ltr">
        {part}
      </bdi>
    ) : (
      part
    )
  )
}

/**
 * The address to write to: 5XL Light with an arrow-up-right. Hover and focus move
 * the arrow 6px up and towards the end (mirrored in Arabic) and draw the underline,
 * 220ms ease-out, only where a pointer can hover and motion is allowed.
 */
const LEAD_LINK =
  "group relative inline-flex items-center gap-3 rounded-sm text-foreground transition-colors duration-[120ms] [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:text-muted-foreground hover:motion-reduce:text-muted-foreground focus-visible:motion-reduce:text-muted-foreground [@container(min-width:64rem)]:gap-4"
const LEAD_TEXT =
  "inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat text-2xl font-light transition-[background-size] duration-[220ms] ease-out motion-reduce:transition-none rtl:bg-[position:100%_100%] group-hover:motion-safe:[@container(min-width:40rem)]:bg-[length:100%_1px] motion-safe:group-focus-visible:bg-[length:100%_1px] [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-5xl"
const LEAD_ARROW =
  "inline-flex shrink-0 opacity-60 transition-[transform,opacity] duration-[220ms] ease-out motion-reduce:transition-none group-hover:[@container(min-width:40rem)]:opacity-100 group-focus-visible:opacity-100 group-hover:motion-safe:[@container(min-width:40rem)]:-translate-y-1.5 group-hover:motion-safe:[@container(min-width:40rem)]:translate-x-1.5 group-hover:motion-safe:rtl:[@container(min-width:40rem)]:-translate-x-1.5 motion-safe:group-focus-visible:-translate-y-1.5 motion-safe:group-focus-visible:translate-x-1.5 motion-safe:rtl:group-focus-visible:-translate-x-1.5"

export function FooterContactFirst({
  locale = "en",
  label,
  email,
  sub,
  offices,
  copyright,
  legal,
  legalLabel,
  socialLabel,
  officesLabel,
  socials = DEFAULT_SOCIALS,
  className,
  ...props
}: FooterContactFirstProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const lead = email ?? copy.email
  const text = label ?? copy.label
  const subline = sub ?? copy.sub
  const places = offices ?? copy.offices
  const links = legal ?? copy.legal
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-20", className)}
      contentClassName="gap-8 [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:gap-16"
      {...props}
    >
      {text || lead || subline ? (
        <div className="flex flex-col items-start gap-3 [@container(min-width:64rem)]:gap-4">
          {text ? <p className="text-list-header font-medium uppercase text-muted-foreground">{text}</p> : null}
          {lead ? (
            <a href={`mailto:${lead}`} className={LEAD_LINK}>
              <span className={LEAD_TEXT}>
                <bdi dir="ltr">{lead}</bdi>
              </span>
              <span aria-hidden="true" className={LEAD_ARROW}>
                <ArrowUpRightIcon className="size-8 rtl:-scale-x-100" strokeWidth={1.5} />
              </span>
            </a>
          ) : null}
          {subline ? <p className="text-base text-muted-foreground">{bidi(subline, ar)}</p> : null}
        </div>
      ) : null}
      {places.length ? (
        <ul aria-label={officesLabel ?? copy.officesLabel} className="grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2">
          {places.map((office) => (
            <li key={`${office.city}-${office.email}`} className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
              <div className="h-[170px] w-full overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:h-[180px] [@container(min-width:64rem)]:h-[200px] [@container(min-width:64rem)]:w-[400px] [@container(min-width:64rem)]:max-w-full">
                {office.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={office.image.src} alt={office.image.alt} loading="lazy" className="size-full object-cover" />
                ) : null}
              </div>
              <h3 className="text-xl font-semibold text-foreground">{office.city}</h3>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                {office.address.map((line) => (
                  <p key={line}>{bidi(line, ar)}</p>
                ))}
              </div>
              {office.email ? (
                <a
                  href={`mailto:${office.email}`}
                  className="relative inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-foreground transition-colors duration-[120ms] motion-reduce:transition-none [outline:none] hover:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:text-muted-foreground after:absolute after:-inset-x-1 after:-inset-y-3 after:content-['']"
                >
                  <MailIcon aria-hidden="true" className="size-3.5 shrink-0" />
                  <bdi dir="ltr">{office.email}</bdi>
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      <FooterRule />
      <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterLogo className="h-6" />
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
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
        {socials.length ? (
          <nav aria-label={socialLabel ?? copy.socialLabel}>
            <ul className="flex items-center gap-3 [@container(min-width:64rem)]:gap-4">
              {socials.map((platform) => (
                <li key={platform} className="flex">
                  <a
                    href="#"
                    aria-label={SOCIAL_PLATFORM_NAMES[platform]}
                    className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3.5 after:content-['']"
                  >
                    <SocialIcon platform={platform} color="negative" className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </FooterSection>
  )
}
