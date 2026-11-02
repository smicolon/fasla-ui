"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import {
  CONTACT_US_TEXTAREA_88,
  ContactUsField,
  ContactUsForm,
  ContactUsPhotoSlot,
  ContactUsRule,
  ContactUsSection,
  ContactUsSubmit,
  ContactUsWords,
  contactUsFormMessages,
  splitCopy,
  useContactUsForm,
  useReveal,
  type ContactUsFieldDef,
  type ContactUsFormBlockProps,
  type ContactUsFormMessages,
  type ContactUsLocale,
  type ContactUsPhoto,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Editorial & Address Card.
 *
 * The section's ground is a tint of `success` (`soft-success`), 16px of
 * padding all round. On it, two columns 16px apart: a white form card and, 520px
 * wide on Desktop, a photo over an info card. The form card (48px of padding
 * on Desktop, 32 on Tablet, 24 on Mobile) holds a large bold headline, a line
 * in the foreground colour, a form (name, mail, a message, a terms checkbox,
 * then Send) and a note for people who are not robots. The
 * info card is a white card with three 1px lines and, between them, an
 * ADDRESS row (three lines) and a MAIL row, each led by a soft badge.
 *
 * Tablet and Mobile stack the form card over the photo (300px on Tablet,
 * 220px on Mobile) and the info card. The headline is 60px on Desktop, 48px
 * on Tablet and 24px on Mobile. The field labels are capitals in English, as
 * Figma writes them.
 *
 * The form is real. It calls `onSubmit(values)` with name, mail, message and
 * terms. The mail field is required (the attribute, `aria-required` and the
 * error on submit) and shows no asterisk anywhere: Figma's field has no label to
 * carry one. The terms checkbox is required, with no asterisk, like the other
 * checkboxes. No other field is required. The "leave this field blank" note is text only: the block adds no
 * hidden field.
 *
 * Motion: once, when the block is in view, the headline reveals word by word,
 * each field rises with its label, the info rows slide 16px in from the end
 * 80ms apart and the three lines draw across. The Send button lifts 2px on
 * hover. Reduced motion: only fades.
 *
 * Content limits: the headline up to 24 characters, the line up to 140, an
 * address line up to 36.
 */

export interface ContactUsEditorialAndAddressCardCopy extends ContactUsFormMessages {
  /** The headline, an `h2`. */
  heading: string
  /** The line under the headline. */
  description: string
  /** The name field's label. */
  name: string
  /** The name field's placeholder. */
  namePlaceholder: string
  /** The mail field's label. */
  mail: string
  /** The mail field's placeholder. */
  mailPlaceholder: string
  /** The message field's label. */
  message: string
  /** The message field's placeholder. */
  messagePlaceholder: string
  /** The terms checkbox's label. */
  terms: string
  /** The button's label. */
  submit: string
  /** The note under the form. */
  note: string
  /** The badge that leads the address row. */
  addressTag: string
  /** The badge that leads the mail row. */
  mailTag: string
  /** The three lines of the address. */
  addressLines: string[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsEditorialAndAddressCardCopy> = {
  en: {
    ...contactUsFormMessages.en,
    heading: "Have a seat!",
    description: "We would love to hear from you! Whether you are a partner, a founder or a researcher, drop us a line and have a seat at our table!",
    name: "NAME",
    namePlaceholder: "Your name",
    mail: "MAIL",
    mailPlaceholder: "you@company.com",
    message: "MESSAGE",
    messagePlaceholder: "Tell us what you have in mind",
    terms: "I ACCEPT THE TERMS OF USE",
    submit: "Send",
    note: "If you are human, leave this field blank.",
    addressTag: "ADDRESS",
    mailTag: "MAIL",
    addressLines: ["Level 12, Boulevard Plaza", "Sheikh Mohammed Bin Rashid Blvd", "Dubai, UAE"],
  },
  ar: {
    ...contactUsFormMessages.ar,
    heading: "لك مقعد معنا!",
    description: "يسعدنا أن نسمع منك! سواء كنت شريكًا أو مؤسسًا أو باحثًا، راسلنا وتفضّل بمقعدك على طاولتنا!",
    name: "الاسم",
    namePlaceholder: "اسمك",
    mail: "البريد",
    mailPlaceholder: "you@company.com",
    message: "الرسالة",
    messagePlaceholder: "أخبرنا بما يدور في ذهنك",
    terms: "أوافق على شروط الاستخدام",
    submit: "إرسال",
    note: "إذا كنت إنسانًا فاترك هذا الحقل فارغًا.",
    addressTag: "العنوان",
    mailTag: "البريد",
    addressLines: ["الطابق 12، بوليفارد بلازا", "شارع الشيخ محمد بن راشد", "دبي، الإمارات"],
  },
}

export interface ContactUsEditorialAndAddressCardProps extends ContactUsFormBlockProps, Partial<ContactUsEditorialAndAddressCardCopy> {
  /** The photo over the info card. A `muted` ground shows without one. */
  photo?: ContactUsPhoto
  /** The address in the mail row. */
  emailAddress?: string
}

const SEND = "from-soft-success-20 to-soft-success-20 hover:from-soft-success-30 hover:to-soft-success-30 active:from-soft-success-30 active:to-soft-success-30 hover:motion-safe:-translate-y-0.5"

export function ContactUsEditorialAndAddressCard({ locale = "en", ...given }: ContactUsEditorialAndAddressCardProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, photo, emailAddress: address = "hello@fasla.com", className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    name: { name: "name", kind: "text", label: copy.name, placeholder: copy.namePlaceholder, autoComplete: "name" },
    mail: { name: "mail", kind: "email", label: copy.mail, placeholder: copy.mailPlaceholder, autoComplete: "email", required: true },
    message: { name: "message", kind: "textarea", label: copy.message, placeholder: copy.messagePlaceholder, groupClassName: CONTACT_US_TEXTAREA_88 },
    terms: { name: "terms", kind: "checkbox", label: copy.terms, required: true },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  const line = <ContactUsRule data-reveal="draw-x" className="-mb-px ltr:origin-left rtl:origin-right" />

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={cn("bg-soft-success p-4 md:p-4 lg:p-4", className)} contentClassName="max-w-none" {...html}>
      <div ref={reveal} className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-8 rounded-[14px] bg-background p-6 [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:p-12">
          <div className="flex flex-col gap-4">
            <h2 id={headingId} className="text-2xl font-bold leading-[2.75rem] rtl:leading-[3.75rem] text-foreground [@container(min-width:40rem)]:text-5xl [@container(min-width:64rem)]:text-6xl">
              <ContactUsWords>{copy.heading}</ContactUsWords>
            </h2>
            <p className="text-xl text-foreground">{copy.description}</p>
          </div>
          <ContactUsForm form={form} className="flex flex-col gap-3">
            <ContactUsField field={f.name} reveal />
            <ContactUsField field={f.mail} reveal />
            <ContactUsField field={f.message} reveal />
            <ContactUsField field={f.terms} className="flex flex-col items-start" />
            <div className="flex items-center">
              <ContactUsSubmit variant="soft" tone="secondary" radius="rounded" size="md" className={SEND}>
                {copy.submit}
              </ContactUsSubmit>
            </div>
          </ContactUsForm>
          <p className="text-sm text-muted-foreground">{copy.note}</p>
        </div>

        <div className="flex flex-col gap-4 [@container(min-width:64rem)]:w-[32.5rem] [@container(min-width:64rem)]:shrink-0">
          <ContactUsPhotoSlot photo={photo} className="h-[13.75rem] rounded-[14px] [@container(min-width:40rem)]:h-[18.75rem] [@container(min-width:64rem)]:h-[25.125rem]" />
          <div className="flex flex-col gap-4 rounded-[14px] bg-background p-8">
            {line}
            <div data-reveal="slide" data-reveal-delay="0" className="flex items-start justify-between gap-4">
              <Badge variant="soft" tone="secondary" radius="standard" size="lg" className="shrink-0">
                {copy.addressTag}
              </Badge>
              <address className="flex min-w-0 flex-col text-end text-base not-italic text-foreground">
                {copy.addressLines.map((text) => (
                  <span key={text}>{text}</span>
                ))}
              </address>
            </div>
            {line}
            <div data-reveal="slide" data-reveal-delay="80" className="flex items-start justify-between gap-4">
              <Badge variant="soft" tone="secondary" radius="standard" size="lg" className="shrink-0">
                {copy.mailTag}
              </Badge>
              <a href={`mailto:${address}`} className="min-w-0 rounded-sm text-end text-base text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <bdi dir="ltr">{address}</bdi>
              </a>
            </div>
            {line}
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
export const contactUsEditorialAndAddressCardCopy = COPY
