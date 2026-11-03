import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { FooterDot, FooterLinkItem, FooterLogo, FooterRule, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Legal-First Slim. Figma has no motion
 * chip for this Type; the links keep the shared 120ms colour change and the
 * Button keeps its own states.
 *
 * The legal footer: six policy links in `foreground` at the start and an
 * Outline xs Button ("Cookie preferences") at the end; a row of four soft
 * Badges (privacy, security, process, accessibility); a hairline; then the
 * logo, the entity line (name, address, tax and registration numbers, four facts
 * with a dot drawn between them) and two social marks.
 *
 * Desktop (1440) is one row for the policies and the button, one for the entity,
 * 40px above and 32px below. Tablet (768) lets the links and badges wrap and
 * puts the social marks under the entity line. Mobile (360) stacks everything and
 * the button fills the width; Figma draws that button 24px tall, which is not a
 * Button size: it is the standard xs, 26px. In Arabic everything mirrors by the
 * page's `dir`; the marks and the logo are never flipped.
 */

export interface FooterLegalFirstSlimCopy {
  /** The policy links. Hidden when empty. */
  policies: FooterLink[]
  /** The accessible name of the policy links. */
  policiesLabel: string
  /** The label of the Outline button. Hidden when empty. */
  cookieLabel: string
  /** The compliance badges. Hidden when empty. */
  badges: string[]
  /** The accessible name of the badges. */
  badgesLabel: string
  /** The entity line, one fact per entry; a dot is drawn between them. */
  entity: string[]
  /** The accessible name of the social marks. */
  socialLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterLegalFirstSlimCopy> = {
  en: {
    policies: ["Privacy Policy", "Terms of Service", "Data Processing Addendum", "Subprocessors", "Security", "Accessibility Statement"].map((label) => ({ label, href: "#" })),
    policiesLabel: "Policies",
    cookieLabel: "Cookie preferences",
    badges: ["Privacy compliance", "Security certified", "Process certified", "Accessibility statement"],
    badgesLabel: "Compliance",
    entity: ["© 2026 Fasla", "123 Example Street, 12345 Example City", "VAT 000000000", "Reg. 000000, Example Court"],
    socialLabel: "Social",
  },
  ar: {
    policies: ["سياسة الخصوصية", "شروط الخدمة", "ملحق معالجة البيانات", "المعالجون الفرعيون", "الأمان", "بيان إمكانية الوصول"].map((label) => ({ label, href: "#" })),
    policiesLabel: "السياسات",
    cookieLabel: "تفضيلات ملفات تعريف الارتباط",
    badges: ["الامتثال للخصوصية", "معتمد للأمان", "معتمد للعمليات", "بيان إمكانية الوصول"],
    badgesLabel: "الامتثال",
    entity: ["© 2026 فاصلة", "123 شارع المثال، 12345 مدينة المثال", "الرقم الضريبي 000000000", "السجل 000000، محكمة المثال"],
    socialLabel: "التواصل الاجتماعي",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerLegalFirstSlimCopy = COPY

export interface FooterLegalFirstSlimProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterLegalFirstSlimCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
  /** Called when the cookie preferences button is pressed. */
  onCookiePreferences?: () => void
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x"]

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

export function FooterLegalFirstSlim({ locale = "en", policies, policiesLabel, cookieLabel, badges, badgesLabel, entity, socialLabel, socials = DEFAULT_SOCIALS, onCookiePreferences, className, ...props }: FooterLegalFirstSlimProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const links = policies ?? copy.policies
  const cookie = cookieLabel ?? copy.cookieLabel
  const chips = badges ?? copy.badges
  const facts = entity ?? copy.entity
  return (
    <FooterSection
      className={cn("border-t border-border pb-4 pt-5 md:pb-6 md:pt-8 lg:pb-8 lg:pt-10", className)}
      contentClassName="gap-4 [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6"
      {...props}
    >
      {links.length || cookie ? (
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-8">
          {links.length ? (
            <nav aria-label={policiesLabel ?? copy.policiesLabel}>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-5 [@container(min-width:64rem)]:gap-x-6">
                {links.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} className="text-xs text-foreground hover:text-muted-foreground focus-visible:text-muted-foreground active:text-muted-foreground" />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {cookie ? (
            <Button type="button" variant="outline" size="xs" onClick={onCookiePreferences} className="w-full shrink-0 [@container(min-width:40rem)]:w-auto">
              {cookie}
            </Button>
          ) : null}
        </div>
      ) : null}
      {chips.length ? (
        <ul aria-label={badgesLabel ?? copy.badgesLabel} className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <li key={chip} className="flex">
              <Badge variant="soft" tone="secondary" size="sm" radius="standard">
                {chip}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}
      <FooterRule />
      <div className="flex flex-col gap-3 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between">
        <div className="flex flex-col items-start gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:flex-wrap [@container(min-width:40rem)]:items-center [@container(min-width:64rem)]:gap-4">
          <FooterLogo className="h-[22px]" />
          {facts.length ? (
            <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              {facts.map((fact, index) => (
                <React.Fragment key={fact}>
                  {index > 0 ? <FooterDot /> : null}
                  <span>{bidi(fact, ar)}</span>
                </React.Fragment>
              ))}
            </p>
          ) : null}
        </div>
        {socials.length ? (
          <nav aria-label={socialLabel ?? copy.socialLabel}>
            <ul className="flex items-center gap-2 [@container(min-width:40rem)]:gap-3">
              {socials.map((platform) => (
                <li key={platform} className="flex">
                  <a
                    href="#"
                    aria-label={SOCIAL_PLATFORM_NAMES[platform]}
                    className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3.5 after:content-['']"
                  >
                    <SocialIcon platform={platform} color="negative" className="size-4" />
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
