"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import {
  ContactUsField,
  ContactUsForm,
  ContactUsSection,
  ContactUsSocialLinks,
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
  type ContactUsSocialLink,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Editorial Statement.
 *
 * A muted band, set like a page of a magazine. On the start side a narrow
 * rail of three small facts (the address to write to, where to find the
 * studio, the social handle) and the social marks. On the end side a large,
 * light statement and under it a form with no visible labels: first and last
 * name, email, who you are, the message, a line of consent and a Send message
 * button with an arrow.
 *
 * Desktop sets the rail 280px wide beside an 888px statement. Tablet keeps
 * them side by side (the statement is then 360px). Mobile stacks the rail
 * over the statement and the statement steps from 4XL to 3XL on Tablet and 2XL.
 *
 * The form is real. Its fields have no drawn label, so each is named for
 * assistive technology by its placeholder; required ones show no word, as no field
 * has a label row. It calls
 * `onSubmit(values)` with firstName, lastName, email, identity and message. The
 * statement sets itself word by word, once, when the block comes into view.
 *
 * Content limits: the statement up to 130 characters, a rail value up to 40
 * (the address up to three lines). The other limits are in the block's
 * documentation page, which the default copy stays inside.
 */

export interface ContactUsEditorialStatementCopy extends ContactUsFormMessages {
  /** The rail's first label, naming the address to write to. */
  contactLabel: string
  /** The rail's second label. */
  addressLabel: string
  /** The address, up to three lines. A line break starts a new line. */
  address: string
  /** The rail's third label. */
  socialLabel: string
  /** The social handle. */
  handle: string
  /** The statement beside the rail. */
  statement: string
  /** The first name field's placeholder, and its name for assistive technology. */
  firstName: string
  /** The last name field's placeholder. */
  lastName: string
  /** The email field's placeholder. */
  email: string
  /** The select's placeholder. */
  identity: string
  /** The choices of who you are. */
  identities: string[]
  /** The message field's placeholder. */
  message: string
  /** The line of consent over the button. */
  consent: string
  /** The button's label. */
  send: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsEditorialStatementCopy> = {
  en: {
    ...contactUsFormMessages.en,
    contactLabel: "CONTACT",
    addressLabel: "ADDRESS",
    address: "Fasla Studio\nLevel 12, Boulevard Plaza\nDowntown Dubai, UAE",
    socialLabel: "SOCIAL",
    handle: "@fasla.design",
    statement: "Send us a message if you would like to work together, join the studio, or simply say hello. We would love to hear from you.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    identity: "I am a…",
    identities: ["Founder", "Product lead", "Designer", "Journalist", "Something else"],
    message: "Your message",
    consent: "By messaging us you agree to the Fasla privacy policy and terms of service. Your data always stays confidential.",
    send: "Send message",
  },
  ar: {
    ...contactUsFormMessages.ar,
    contactLabel: "تواصل",
    addressLabel: "العنوان",
    address: "استوديو فاصلة\nالطابق 12، بوليفارد بلازا\nوسط مدينة دبي، الإمارات",
    socialLabel: "التواصل الاجتماعي",
    handle: "@fasla.design",
    statement: "أرسل لنا رسالة إن أردت العمل معنا أو الانضمام إلى الاستوديو أو مجرد إلقاء التحية. يسعدنا أن نسمع منك.",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    identity: "أنا…",
    identities: ["مؤسس", "مسؤول منتج", "مصمم", "صحفي", "شيء آخر"],
    message: "رسالتك",
    consent: "بمراسلتنا فإنك توافق على سياسة الخصوصية وشروط الخدمة في فاصلة. تبقى بياناتك سرية دائمًا.",
    send: "أرسل الرسالة",
  },
}

export interface ContactUsEditorialStatementProps extends ContactUsFormBlockProps, Partial<ContactUsEditorialStatementCopy> {
  /** The address the rail shows first. */
  emailAddress?: string
  /** The marks under the rail. Each goes to `href`; the defaults go nowhere, so pass your own. */
  socialLinks?: ContactUsSocialLink[]
}

const DEFAULT_SOCIAL: ContactUsSocialLink[] = [
  { platform: "instagram", href: "#" },
  { platform: "linkedin", href: "#" },
  { platform: "dribbble", href: "#" },
]

export function ContactUsEditorialStatement({ locale = "en", ...given }: ContactUsEditorialStatementProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, emailAddress: address = "hello@fasla.com", socialLinks = DEFAULT_SOCIAL, className, ...html } = rest
  const labelId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    firstName: { name: "firstName", kind: "text", label: copy.firstName, hideLabel: true, placeholder: copy.firstName, autoComplete: "given-name" },
    lastName: { name: "lastName", kind: "text", label: copy.lastName, hideLabel: true, placeholder: copy.lastName, autoComplete: "family-name" },
    email: { name: "email", kind: "email", label: copy.email, hideLabel: true, placeholder: copy.email, autoComplete: "email", required: true },
    identity: { name: "identity", kind: "select", label: copy.identity, hideLabel: true, placeholder: copy.identity, options: copy.identities.map((item) => ({ value: item, label: item })) },
    message: { name: "message", kind: "textarea", label: copy.message, hideLabel: true, placeholder: copy.message, required: true },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  const labelClass = "text-xs font-semibold text-muted-foreground"
  const valueClass = "text-sm text-foreground"

  return (
    <ContactUsSection labelledBy={labelId} tone="muted" className={className} {...html}>
      <div ref={reveal} className="flex flex-col gap-20 [@container(min-width:40rem)]:flex-row">
        <div className="flex shrink-0 flex-col gap-10 [@container(min-width:40rem)]:w-[17.5rem]">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <p id={labelId} className={labelClass}>
                {copy.contactLabel}
              </p>
              <a href={`mailto:${address}`} className={`${valueClass} w-fit rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`}>
                <bdi dir="ltr">{address}</bdi>
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <p className={labelClass}>{copy.addressLabel}</p>
              <p className={`${valueClass} whitespace-pre-line`}>{copy.address}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className={labelClass}>{copy.socialLabel}</p>
              <p className={valueClass}>
                <bdi dir="ltr">{copy.handle}</bdi>
              </p>
            </div>
          </div>
          <ContactUsSocialLinks links={socialLinks} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <p className="text-2xl font-light text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
            <ContactUsWords>{copy.statement}</ContactUsWords>
          </p>
          <ContactUsForm form={form} className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 [@container(min-width:64rem)]:flex-row">
              <ContactUsField field={f.firstName} className="[@container(min-width:64rem)]:flex-1" />
              <ContactUsField field={f.lastName} className="[@container(min-width:64rem)]:flex-1" />
            </div>
            <ContactUsField field={f.email} />
            <ContactUsField field={f.identity} />
            <ContactUsField field={f.message} />
            <p className="text-xs text-muted-foreground">{copy.consent}</p>
            <div className="flex">
              <ContactUsSubmit size="lg">
                <span>{copy.send}</span>
                <ArrowRight aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
              </ContactUsSubmit>
            </div>
          </ContactUsForm>
        </div>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsEditorialStatementCopy = COPY
