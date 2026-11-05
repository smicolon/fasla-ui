"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import {
  ContactUsHeader,
  ContactUsPhotoSlot,
  ContactUsRule,
  ContactUsSection,
  splitCopy,
  useReveal,
  type ContactUsLocale,
  type ContactUsPhoto,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Office Cards.
 *
 * A centred header (eyebrow, h2 at 36, 30 and 24px, a line, in a 720px column)
 * over three office cards 24px apart: Desktop three across, Tablet two-up with
 * the third wrapping, Mobile one per row. A card is a `card` surface with a 1px
 * border, 10px corners and an extra-small shadow; at its top a 200px photo,
 * under it 24px of padding around: the city (an h3, 20px) with a Soft
 * Secondary small Rounded Badge at the end, the address, a 1px divider, and a
 * row with the phone (a `tel:` link) and a "Directions" link with an up-right
 * arrow in `primary`. In Arabic the card mirrors in order and the arrow flips
 * to point up-left; on Tablet and Mobile Figma's Arabic frames also stack the
 * phone over Directions (its English frames keep them in one row).
 *
 * Real vs static: `offices` is the data (city, badge, address, phone and the
 * `directionsHref` of each), `photos` the photos, aligned to the cards: an
 * entry may be undefined, which leaves a quiet `muted` slot. Figma's motion card
 * also describes a live local-time chip on each card: no frame draws one, so
 * there is none.
 *
 * Motion: the cards rise 12px and fade in once, 80ms apart, when the block is
 * in view. On a pointer (hover only, not reduced motion) the photo scales to
 * 1.06 inside its clipped box over 260ms, the card lifts 4px while its shadow
 * goes from extra small to medium, and the arrow slides 4px along the reading
 * direction. Reduced motion: only fades.
 *
 * Content limits: heading up to 28 characters, the line up to 70, a city up to
 * 16, a badge up to 18, an address up to 56.
 */

export interface ContactUsOffice {
  /** The city, the card's h3. */
  city: string
  /** The badge beside the city. */
  badge: string
  /** The address, one line of up to about 56 characters. */
  address: string
  /** The phone, as shown. The link is made from its digits. */
  phone: string
  /** Where "Directions" goes. */
  directionsHref?: string
}

export interface ContactUsOfficeCardsCopy {
  /** The small line above the heading. */
  eyebrow: string
  /** The heading, an `h2`. */
  heading: string
  /** The line under the heading. */
  description: string
  /** Each card's link. Its accessible name adds the city. */
  directionsLabel: string
  /** The cards, in order. */
  offices: ContactUsOffice[]
}

/** Figma's copy, English and Arabic (Western digits). */
const COPY: Record<ContactUsLocale, ContactUsOfficeCardsCopy> = {
  en: {
    eyebrow: "OUR STUDIOS",
    heading: "Three places to find us",
    description: "Drop in, or write ahead so someone is expecting you.",
    directionsLabel: "Directions",
    offices: [
      {
        city: "Dubai",
        badge: "Headquarters",
        address: "Level 12, Boulevard Plaza Tower 1, Downtown Dubai",
        phone: "+971 4 512 8800",
        directionsHref: "https://www.google.com/maps/search/?api=1&query=Boulevard+Plaza+Tower+1+Downtown+Dubai",
      },
      {
        city: "Riyadh",
        badge: "Client studio",
        address: "King Fahd Road, Olaya District, Riyadh 12333",
        phone: "+966 11 288 4100",
        directionsHref: "https://www.google.com/maps/search/?api=1&query=King+Fahd+Road+Olaya+District+Riyadh",
      },
      {
        city: "Amman",
        badge: "Engineering",
        address: "Zahran Street, Abdoun, Amman 11183",
        phone: "+962 6 592 7700",
        directionsHref: "https://www.google.com/maps/search/?api=1&query=Zahran+Street+Abdoun+Amman",
      },
    ],
  },
  ar: {
    eyebrow: "استوديوهاتنا",
    heading: "ثلاثة أماكن تجدنا فيها",
    description: "مرّ علينا، أو راسلنا مسبقًا ليكون أحدهم بانتظارك.",
    directionsLabel: "الاتجاهات",
    offices: [
      {
        city: "دبي",
        badge: "المقر الرئيسي",
        address: "الطابق 12، برج بوليفارد بلازا 1، وسط مدينة دبي",
        phone: "+971 4 512 8800",
        directionsHref: "https://www.google.com/maps/search/?api=1&query=Boulevard+Plaza+Tower+1+Downtown+Dubai",
      },
      {
        city: "الرياض",
        badge: "استوديو العملاء",
        address: "طريق الملك فهد، حي العليا، الرياض 12333",
        phone: "+966 11 288 4100",
        directionsHref: "https://www.google.com/maps/search/?api=1&query=King+Fahd+Road+Olaya+District+Riyadh",
      },
      {
        city: "عمّان",
        badge: "الهندسة",
        address: "شارع زهران، عبدون، عمّان 11183",
        phone: "+962 6 592 7700",
        directionsHref: "https://www.google.com/maps/search/?api=1&query=Zahran+Street+Abdoun+Amman",
      },
    ],
  },
}

export interface ContactUsOfficeCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof ContactUsOfficeCardsCopy>, Partial<ContactUsOfficeCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /** One photo per card, in the cards' order. An undefined entry leaves that card's quiet `muted` slot. */
  photos?: (ContactUsPhoto | undefined)[]
}

export function ContactUsOfficeCards({ locale = "en", ...given }: ContactUsOfficeCardsProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { photos, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  return (
    <ContactUsSection labelledBy={headingId} className={className} {...html}>
      <div ref={reveal} className="flex flex-col gap-12">
        <ContactUsHeader
          headingId={headingId}
          align="center"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          description={copy.description}
          className="mx-auto max-w-[45rem]"
          eyebrowClassName="text-sm font-semibold text-primary"
          headingClassName={cn(
            "text-2xl leading-8 rtl:leading-10",
            `[@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem]`,
            `[@container(min-width:64rem)]:text-4xl [@container(min-width:64rem)]:leading-[2.75rem] [@container(min-width:64rem)]:rtl:leading-[3.75rem]`
          )}
        />
        <ul className={cn("grid grid-cols-1 gap-6", `[@container(min-width:40rem)]:grid-cols-2`, `[@container(min-width:64rem)]:grid-cols-3`)}>
          {copy.offices.map((office, index) => (
            <li
              key={office.city}
              data-reveal="rise"
              data-reveal-delay={index * 80}
              className={cn(
                "group/card flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-border bg-card shadow-sm",
                "motion-safe:transition-[transform,box-shadow] motion-safe:duration-[260ms] motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
                "hover:motion-safe:-translate-y-1 hover:motion-safe:shadow-md"
              )}
            >
              <ContactUsPhotoSlot
                photo={photos?.[index]}
                className={cn(
                  "h-[12.5rem] w-full shrink-0",
                  "[&_img]:motion-safe:transition-transform [&_img]:motion-safe:duration-[260ms] [&_img]:motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
                  "group-hover/card:motion-safe:[&_img]:scale-[1.06]"
                )}
              />
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <h3 className="min-w-0 flex-1 text-xl font-semibold text-foreground">{office.city}</h3>
                  <Badge variant="soft" tone="secondary" size="sm" radius="rounded">
                    {office.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{office.address}</p>
                <ContactUsRule />
                <div
                  className={cn(
                    "mt-auto flex items-center justify-between gap-3",
                    "rtl:flex-col rtl:items-start rtl:justify-start",
                    `[@container(min-width:64rem)]:rtl:flex-row [@container(min-width:64rem)]:rtl:items-center [@container(min-width:64rem)]:rtl:justify-between`
                  )}
                >
                  <a
                    href={`tel:${office.phone.replace(/[^\d+]/g, "")}`}
                    className="rounded-sm text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <bdi dir="ltr">{office.phone}</bdi>
                  </a>
                  <a
                    href={office.directionsHref ?? "#"}
                    aria-label={`${copy.directionsLabel}${locale === "ar" ? "،" : ","} ${office.city}`}
                    className="group/dir inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {copy.directionsLabel}
                    <span
                      aria-hidden
                      className="inline-flex motion-safe:transition-transform motion-safe:duration-[180ms] motion-safe:ease-[cubic-bezier(0.2,0,0,1)] group-hover/dir:motion-safe:ltr:translate-x-1 group-hover/dir:motion-safe:rtl:-translate-x-1"
                    >
                      <ArrowUpRight size={16} strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />
                    </span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsOfficeCardsCopy = COPY
