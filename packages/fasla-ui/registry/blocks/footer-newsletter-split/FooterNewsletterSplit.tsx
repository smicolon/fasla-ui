"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_COMMON,
  FOOTER_FORM_COPY,
  FooterColumnTitle,
  FooterCopyright,
  FooterLinkItem,
  FooterNewsletterForm,
  FooterRule,
  FooterSection,
  type FooterColumn,
  type FooterFormStatus,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Newsletter Split.
 *
 * A split: the newsletter on one side (the logo, a headline, a sentence, the
 * email field with its Subscribe Button, and a line of small print) and three
 * link columns of five links on the other, then a hairline and a legal bar
 * (the copyright and three legal links, and five 18px social marks).
 *
 * Desktop (Figma 1440): the newsletter is 520 wide, 80px from the columns.
 * Tablet (768): the split stacks, the newsletter above the columns (three
 * across); the form stays one row. Mobile (360): the field and the Button
 * stack and the columns go two across. In Arabic the field and Button swap
 * sides with the page's `dir`.
 *
 * The form is the shared `FooterNewsletterForm`: a size md field and a size md
 * Solid Primary Button. Figma has no chip for the entrance, only for the form:
 * pressing Subscribe disables the field and shows the Button's spinner, a
 * success cross-fades to one line that holds the block's height, a failure
 * turns the field invalid and fades a line in under it. The sent, error and
 * invalid lines are the shared placeholder copy.
 */

export interface FooterNewsletterSplitCopy {
  headline: string
  sub: string
  /** The email field's placeholder. */
  placeholder: string
  /** The email field's accessible name. */
  emailLabel: string
  submitLabel: string
  /** The small print under the form. Hidden when empty. */
  microcopy: string
  /** What replaces the form after it is sent. */
  sentMessage: string
  /** The line under the field when sending failed. */
  errorMessage: string
  /** The line under the field when the address isn't an address. */
  invalidMessage: string
  /** The link columns, in reading order. */
  columns: FooterColumn[]
  copyright: string
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (...labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterNewsletterSplitCopy> = {
  en: {
    headline: "Every release, in your inbox.",
    sub: "Component drops, token changes and breaking-change notices — once a month, nothing else.",
    placeholder: "you@company.com",
    emailLabel: "Email address",
    submitLabel: "Subscribe",
    microcopy: "No spam. Unsubscribe in one click.",
    sentMessage: FOOTER_FORM_COPY.en.sent,
    errorMessage: FOOTER_FORM_COPY.en.error,
    invalidMessage: FOOTER_FORM_COPY.en.invalid,
    columns: [
      { title: "Product", links: links("Components", "Blocks", "Templates", "Pricing", "Changelog") },
      { title: "Resources", links: links("Documentation", "Guides", "Blog", "Showcase", "Status") },
      { title: "Company", links: links("About", "Careers", "Press", "Partners", "Contact") },
    ],
    copyright: FOOTER_COMMON.en.copyright,
    legal: links("Privacy", "Terms", "Cookies"),
    legalLabel: "Legal",
  },
  ar: {
    headline: "كل إصدار، في بريدك.",
    sub: "مكوّنات جديدة وتغييرات الرموز وتنبيهات التغييرات الجذرية: مرة واحدة شهريًا، لا أكثر.",
    placeholder: "you@company.com",
    emailLabel: "البريد الإلكتروني",
    submitLabel: "اشترك",
    microcopy: "لا رسائل مزعجة. ألغِ الاشتراك بنقرة واحدة.",
    sentMessage: FOOTER_FORM_COPY.ar.sent,
    errorMessage: FOOTER_FORM_COPY.ar.error,
    invalidMessage: FOOTER_FORM_COPY.ar.invalid,
    columns: [
      { title: "المنتج", links: links("المكوّنات", "الكتل", "القوالب", "الأسعار", "سجل التغييرات") },
      { title: "الموارد", links: links("التوثيق", "الأدلة", "المدونة", "المعرض", "الحالة") },
      { title: "الشركة", links: links("من نحن", "الوظائف", "الصحافة", "الشركاء", "اتصل بنا") },
    ],
    copyright: FOOTER_COMMON.ar.copyright,
    legal: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط"),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerNewsletterSplitCopy = COPY

/** Numbers and Latin words inside an Arabic line keep their own direction. */
function bidi(text: string, locale: FooterLocale): React.ReactNode {
  if (locale !== "ar") return text
  return text.split(/([A-Za-z0-9][A-Za-z0-9@./:–-]*)/).map((part, index) => (index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part))
}

function SplitColumn({ column }: { column: FooterColumn }) {
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

/** The social marks at Figma's 18px for this Type. Marks are never mirrored. */
function SocialMarks({ platforms }: { platforms: SocialPlatform[] }) {
  return (
    <ul className="flex items-center gap-3 [@container(min-width:64rem)]:gap-4">
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

export interface FooterNewsletterSplitProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterNewsletterSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
  /** Holds the form in a state, for a story or a test. */
  status?: FooterFormStatus
  /** Called with the address. Return a promise: the form shows its spinner until it settles, and its error line if it throws. */
  onSubscribe?: (email: string) => void | Promise<void>
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "instagram", "youtube"]

export function FooterNewsletterSplit({
  locale = "en",
  headline,
  sub,
  placeholder,
  emailLabel,
  submitLabel,
  microcopy,
  sentMessage,
  errorMessage,
  invalidMessage,
  columns,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  status,
  onSubscribe,
  className,
  ...props
}: FooterNewsletterSplitProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const text = headline ?? copy.headline
  const subText = sub ?? copy.sub
  const small = microcopy ?? copy.microcopy
  const cols = (columns ?? copy.columns).filter((column) => column.links.length > 0)
  const legalLinks = legal ?? copy.legal
  return (
    <FooterSection
      labelledBy={text ? headingId : undefined}
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8", className)}
      contentClassName="gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-12"
      {...props}
    >
      <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:grid [@container(min-width:64rem)]:grid-cols-[520px_minmax(0,1fr)] [@container(min-width:64rem)]:gap-20">
        <div className="flex min-w-0 flex-col items-stretch gap-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:gap-5">
          <FaslaLogo className="h-[30px] self-start" title="" />
          {text ? (
            <h2 id={headingId} className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">
              {text}
            </h2>
          ) : null}
          {subText ? <p className="text-sm text-muted-foreground">{subText}</p> : null}
          <FooterNewsletterForm
            className="pt-2"
            placeholder={placeholder ?? copy.placeholder}
            emailLabel={emailLabel ?? copy.emailLabel}
            submitLabel={submitLabel ?? copy.submitLabel}
            sentMessage={sentMessage ?? copy.sentMessage}
            errorMessage={errorMessage ?? copy.errorMessage}
            invalidMessage={invalidMessage ?? copy.invalidMessage}
            size="md"
            status={status}
            onSubscribe={onSubscribe}
          />
          {small ? <p className="text-xs text-muted-foreground">{small}</p> : null}
        </div>
        {cols.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-x-10">
            {cols.map((column) => (
              <SplitColumn key={column.title} column={column} />
            ))}
          </div>
        ) : null}
      </div>
      <FooterRule />
      <div className="flex flex-col [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
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
        {socials.length ? <SocialMarks platforms={socials} /> : null}
      </div>
    </FooterSection>
  )
}
