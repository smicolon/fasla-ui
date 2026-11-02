"use client"

import * as React from "react"
import { Clock, MapPin, Phone } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import {
  ContactUsPhotoSlot,
  ContactUsSection,
  splitCopy,
  useReveal,
  type ContactUsLocale,
  type ContactUsPhoto,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Map Split.
 *
 * Two columns 48px apart on Desktop (1248px wide, 96px of padding): a photo
 * slot 720px wide that holds a "Map Pin Card" (a card with a border, 8px
 * corners and a medium shadow, "Fasla HQ" and its address) 24px in from the
 * bottom start corner, and a 480px details column: eyebrow, h2 (36px), a line,
 * three address rows (a 40px `muted` tile with a 20px icon, a small label and its
 * value) and two buttons. Tablet and Mobile stack the photo over the details;
 * the photo band is 126px tall on Tablet and Mobile (Figma's frames draw it as a
 * hug of the pin card: 78px plus 24px above and below), the
 * headline steps 36, 30, 24px, and on Mobile the address rows stack their value
 * lines and both buttons go full width.
 *
 * Real vs static: there is NO map library. The "map" is a photo slot (`photo`),
 * a muted ground without one, with the Map Pin Card over it. "Get directions" is a
 * link (`directionsHref`) and "Email the studio" is a `mailto:` link
 * (`emailAddress`), both styled with `buttonVariants`, as Figma's Solid Primary
 * and Outline Secondary Buttons. The phone is a `tel:` link. Figma draws no pin
 * marker on the photo, so none is drawn.
 *
 * Motion: once, when the block is a fifth in view, the photo pans (scale 1.08 to
 * 1, 260ms) and the Map Pin Card rises 12px and fades in 200ms later. Reduced
 * motion: only fades.
 *
 * Content limits: heading up to 28 characters, the line up to 160, an address
 * value up to 70, the card's address up to 40.
 */

export interface ContactUsMapSplitCopy {
  /** The Map Pin Card's name. */
  pinName: string
  /** The Map Pin Card's address line. */
  pinAddress: string
  /** The small line above the heading. */
  eyebrow: string
  /** The heading, an `h2`. */
  heading: string
  /** The line under the heading. */
  description: string
  /** The address row's label. */
  addressLabel: string
  /** The address row's value. */
  addressValue: string
  /** The hours row's label. */
  hoursLabel: string
  /** The hours row's value. */
  hoursValue: string
  /** The phone row's label. */
  phoneLabel: string
  /** The phone row's value, as shown. */
  phoneValue: string
  /** "Get directions". */
  directionsLabel: string
  /** "Email the studio". */
  emailLabel: string
}

/** Figma's copy, English and Arabic (Western digits). */
const COPY: Record<ContactUsLocale, ContactUsMapSplitCopy> = {
  en: {
    pinName: "Fasla HQ",
    pinAddress: "Level 12, Boulevard Plaza Tower 1",
    eyebrow: "VISIT US",
    heading: "Come by the studio",
    description: "We are on the twelfth floor, opposite the fountain side of Boulevard Plaza. Ring the bell at reception and ask for the Fasla desk.",
    addressLabel: "Address",
    addressValue: "Level 12, Boulevard Plaza Tower 1, Downtown Dubai, UAE",
    hoursLabel: "Opening hours",
    hoursValue: "Sunday to Thursday, 09:00 – 18:00 GST",
    phoneLabel: "Reception",
    phoneValue: "+971 4 512 8800",
    directionsLabel: "Get directions",
    emailLabel: "Email the studio",
  },
  ar: {
    pinName: "مقر فاصلة",
    pinAddress: "الطابق 12، برج بوليفارد بلازا 1",
    eyebrow: "زُرنا",
    heading: "مرّ على الاستوديو",
    description: "نحن في الطابق الثاني عشر، في الجهة المقابلة للنافورة من بوليفارد بلازا. اضغط الجرس عند الاستقبال واسأل عن مكتب فاصلة.",
    addressLabel: "العنوان",
    addressValue: "الطابق 12، برج بوليفارد بلازا 1، وسط مدينة دبي، الإمارات",
    hoursLabel: "ساعات العمل",
    hoursValue: "الأحد إلى الخميس، 09:00 – 18:00 بتوقيت الخليج",
    phoneLabel: "الاستقبال",
    phoneValue: "+971 4 512 8800",
    directionsLabel: "احصل على الاتجاهات",
    emailLabel: "راسل الاستوديو",
  },
}

export interface ContactUsMapSplitProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof ContactUsMapSplitCopy>, Partial<ContactUsMapSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /** The photo in the map slot. A `muted` ground shows without one. */
  photo?: ContactUsPhoto
  /** Where "Get directions" goes. */
  directionsHref?: string
  /** The address "Email the studio" writes to. */
  emailAddress?: string
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-muted text-foreground">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-base font-medium text-foreground">{children}</span>
      </div>
    </div>
  )
}

export function ContactUsMapSplit({ locale = "en", ...given }: ContactUsMapSplitProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const {
    photo,
    directionsHref = "https://www.google.com/maps/search/?api=1&query=Boulevard+Plaza+Tower+1+Downtown+Dubai",
    emailAddress = "hello@fasla.com",
    className,
    ...html
  } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const phoneHref = `tel:${copy.phoneValue.replace(/[^\d+]/g, "")}`

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...html}>
      <div ref={reveal} className={cn("flex flex-col gap-12", `[@container(min-width:64rem)]:flex-row`)}>
        <ContactUsPhotoSlot
          photo={photo}
          photoReveal="pan"
          className={cn(
            "h-[7.875rem] w-full rounded-[10px]",
            `[@container(min-width:64rem)]:h-auto [@container(min-width:64rem)]:min-h-[28.75rem] [@container(min-width:64rem)]:min-w-0 [@container(min-width:64rem)]:flex-1`
          )}
        >
          <div
            data-reveal="rise"
            data-reveal-delay="200"
            className="absolute bottom-6 start-6 flex w-max max-w-[calc(100%-3rem)] flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-4 shadow-md"
          >
            <span className="text-sm font-semibold text-foreground">{copy.pinName}</span>
            <span className="text-xs text-muted-foreground">{copy.pinAddress}</span>
          </div>
        </ContactUsPhotoSlot>

        <div className={cn("flex min-w-0 flex-col gap-8", `[@container(min-width:64rem)]:w-[30rem] [@container(min-width:64rem)]:shrink-0`)}>
          <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
          <h2
            id={headingId}
            className={cn(
              "text-2xl font-semibold leading-8 text-foreground rtl:leading-10",
              `[@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem]`,
              `[@container(min-width:64rem)]:text-4xl [@container(min-width:64rem)]:leading-[2.75rem] [@container(min-width:64rem)]:rtl:leading-[3.75rem]`
            )}
          >
            {copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{copy.description}</p>
          <div className="flex flex-col gap-5">
            <Row icon={<MapPin size={20} strokeWidth={1.5} />} label={copy.addressLabel}>
              {copy.addressValue}
            </Row>
            <Row icon={<Clock size={20} strokeWidth={1.5} />} label={copy.hoursLabel}>
              {copy.hoursValue}
            </Row>
            <Row icon={<Phone size={20} strokeWidth={1.5} />} label={copy.phoneLabel}>
              <a href={phoneHref} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <bdi dir="ltr">{copy.phoneValue}</bdi>
              </a>
            </Row>
          </div>
          <div className={cn("flex flex-col gap-3", `[@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center`)}>
            <a href={directionsHref} className={buttonVariants({ variant: "default", size: "md", className: cn("w-full", `[@container(min-width:40rem)]:w-auto`) })}>
              {copy.directionsLabel}
            </a>
            <a href={`mailto:${emailAddress}`} className={buttonVariants({ variant: "outline", size: "md", className: cn("w-full", `[@container(min-width:40rem)]:w-auto`) })}>
              {copy.emailLabel}
            </a>
          </div>
        </div>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsMapSplitCopy = COPY
