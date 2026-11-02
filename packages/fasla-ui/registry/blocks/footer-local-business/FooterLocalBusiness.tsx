import * as React from "react"
import { MailIcon, MapPinIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { FooterColumnTitle, FooterCopyright, FooterDot, FooterLinkItem, FooterLogo, FooterRule, FooterSection, type FooterLink, type FooterLocale, type FooterPhoto } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Local Business. Figma has no motion chip
 * for this Type, so nothing here is animated beyond the shared link colour change
 * and the Button atom's own states.
 *
 * A map beside the business's details: a map photo with a pin in its centre and a
 * small pill at its top corner naming the place; then the logo, the business name,
 * the address, three rows of opening hours and two buttons (Solid Primary "Get
 * directions" with a map-pin, Outline Secondary with the email and a mail icon);
 * a hairline; the legal bar (copyright, three legal links, four social marks).
 *
 * Desktop (1440) sets the map 660x360 beside the details, 64px above and 32px
 * below. Tablet (768) stacks them, the map 300px tall and full width. Mobile
 * (360) shrinks the map to 200px, stacks the buttons and the legal bar. Without
 * `map` the panel shows the muted ground at the same size. In Arabic everything
 * mirrors by the page's `dir`; the map and the logo are never flipped.
 */

export interface FooterOpeningHours {
  day: string
  /** The hours, or a word such as "Closed". */
  time: string
}

export interface FooterLocalBusinessCopy {
  /** The business's name, as the heading. */
  businessName: string
  /** The address, one line per entry. */
  address: string[]
  /** The title of the opening hours. Hidden with the hours when they are empty. */
  hoursTitle: string
  /** The opening hours, a row each. */
  hours: FooterOpeningHours[]
  /** The pill's parts on the map. English draws a dot between them; Arabic is one phrase. */
  mapLabel: string[]
  /** The Solid Primary button's label. */
  directionsLabel: string
  /** Where "Get directions" goes. */
  directionsHref: string
  /** The address on the Outline button, which is also where it writes to. */
  email: string
  /** The copyright line. */
  copyright: string
  /** The legal links. Hidden when empty. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
  /** The accessible name of the social marks. */
  socialLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterLocalBusinessCopy> = {
  en: {
    businessName: "Fasla Studio",
    address: ["123 Example Street", "12345 Example City"],
    hoursTitle: "Opening hours",
    hours: [
      { day: "Monday – Friday", time: "09:00 – 18:00" },
      { day: "Saturday", time: "Closed" },
      { day: "Sunday", time: "Closed" },
    ],
    mapLabel: ["Fasla Studio", "Example City"],
    directionsLabel: "Get directions",
    directionsHref: "#",
    email: "you@company.com",
    copyright: "© 2026 Fasla Studio. All rights reserved.",
    legal: ["Privacy", "Terms", "Accessibility"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal links",
    socialLabel: "Social",
  },
  ar: {
    businessName: "استوديو فاصلة",
    address: ["123 شارع المثال", "12345 مدينة المثال"],
    hoursTitle: "ساعات العمل",
    hours: [
      { day: "الاثنين إلى الجمعة", time: "09:00 – 18:00" },
      { day: "السبت", time: "مغلق" },
      { day: "الأحد", time: "مغلق" },
    ],
    mapLabel: ["استوديو فاصلة، مدينة المثال"],
    directionsLabel: "الاتجاهات",
    directionsHref: "#",
    email: "you@company.com",
    copyright: "© 2026 استوديو فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "إمكانية الوصول"].map((label) => ({ label, href: "#" })),
    legalLabel: "روابط قانونية",
    socialLabel: "التواصل الاجتماعي",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerLocalBusinessCopy = COPY

export interface FooterLocalBusinessProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterLocalBusinessCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The map photo. Without one the panel shows the muted ground at the same size. */
  map?: FooterPhoto
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["instagram", "linkedin", "whatsapp", "x"]

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

export function FooterLocalBusiness({
  locale = "en",
  map,
  businessName,
  address,
  hoursTitle,
  hours,
  mapLabel,
  directionsLabel,
  directionsHref,
  email,
  copyright,
  legal,
  legalLabel,
  socialLabel,
  socials = DEFAULT_SOCIALS,
  className,
  ...props
}: FooterLocalBusinessProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const name = businessName ?? copy.businessName
  const lines = address ?? copy.address
  const rows = hours ?? copy.hours
  const pill = mapLabel ?? copy.mapLabel
  const mail = email ?? copy.email
  const links = legal ?? copy.legal
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-16", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center">
        <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-xl bg-muted [@container(min-width:40rem)]:h-[300px] [@container(min-width:64rem)]:h-[360px] [@container(min-width:64rem)]:w-[660px]">
          {map ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={map.src} alt={map.alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
          ) : null}
          <span aria-hidden="true" className="absolute inset-0 m-auto flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <MapPinIcon className="size-5" />
          </span>
          {pill.length ? (
            <div className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-full bg-background p-2 text-xs font-medium text-foreground shadow-md [@container(min-width:40rem)]:px-3">
              <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="inline-flex items-center gap-2">
                {pill.map((part, index) => (
                  <React.Fragment key={part}>
                    {index > 0 ? <FooterDot /> : null}
                    <span>{part}</span>
                  </React.Fragment>
                ))}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4 [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterLogo className="h-7" />
          <h2 className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">{name}</h2>
          {lines.length ? (
            <address className="flex flex-col text-sm not-italic text-muted-foreground">
              {lines.map((line) => (
                <span key={line}>{bidi(line, ar)}</span>
              ))}
            </address>
          ) : null}
          {rows.length ? (
            <div className="flex w-full flex-col">
              {hoursTitle ?? copy.hoursTitle ? <FooterColumnTitle as="h3">{hoursTitle ?? copy.hoursTitle}</FooterColumnTitle> : null}
              <ul className="flex w-full flex-col">
                {rows.map((row) => (
                  <li key={row.day} className="flex items-center justify-between gap-4 border-b border-border py-2 text-sm">
                    <span className="text-muted-foreground">{row.day}</span>
                    <span className="font-medium text-foreground">{bidi(row.time, ar)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex w-fit max-w-full flex-col gap-2 [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-3">
            <a href={directionsHref ?? copy.directionsHref} className={buttonVariants({ variant: "default", size: "md" })}>
                <MapPinIcon aria-hidden="true" />
                {directionsLabel ?? copy.directionsLabel}
              </a>
            {mail ? (
              <a href={`mailto:${mail}`} className={buttonVariants({ variant: "outline", size: "md", className: "min-w-0 max-w-full" })}>
                  <MailIcon aria-hidden="true" />
                  {/* A long address shortens with an ellipsis inside the button instead of pushing the page sideways. */}
                  <bdi dir="ltr" className="min-w-0 truncate">{mail}</bdi>
                </a>
            ) : null}
          </div>
        </div>
      </div>
      <FooterRule />
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
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
