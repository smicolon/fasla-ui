"use client"

import * as React from "react"
import { Send } from "lucide-react"
import {
  ContactUsField,
  ContactUsForm,
  ContactUsHeader,
  ContactUsSection,
  ContactUsSubmit,
  contactUsFormMessages,
  splitCopy,
  useContactUsForm,
  type ContactUsFieldDef,
  type ContactUsFormBlockProps,
  type ContactUsFormMessages,
  type ContactUsLocale,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Classic Centered.
 *
 * The plain contact page. A centred header (an eyebrow, the heading, one line
 * of what to expect), then a 768px card holding the form: first and last
 * name side by side, work email, a topic select, the message, the privacy
 * checkbox, and under them a one-line reply promise beside the Send message
 * button. A line below the card offers the email address instead.
 *
 * Desktop and Tablet set the names side by side and the promise beside the
 * button; Mobile stacks both, the heading drops from 4XL to 2XL and the
 * button spans the card. The card is 32px padded at every size.
 *
 * The form is real. It checks the email and the required fields, calls
 * `onSubmit(values)` with firstName, lastName, email, topic, message and
 * consent, and shows the three things that can happen: a field is wrong, the
 * send fails, or it worked. Fields marked `*` are required; the privacy
 * checkbox is too.
 *
 * Content limits: the heading up to 31 characters, the description up to
 * 90, a label up to 20 and the button label up to 25. The other limits are
 * in the block's documentation page, which the default copy stays inside.
 */

export interface ContactUsClassicCenteredCopy extends ContactUsFormMessages {
  /** The small line above the heading. */
  eyebrow: string
  /** The section's heading, an `h2`. */
  heading: string
  /** What happens after sending. */
  description: string
  /** The first name field's label. */
  firstName: string
  /** The first name field's placeholder. */
  firstNamePlaceholder: string
  /** The last name field's label. */
  lastName: string
  /** The last name field's placeholder. */
  lastNamePlaceholder: string
  /** The email field's label. */
  email: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The topic select's label. */
  topic: string
  /** The topic select's placeholder. */
  topicPlaceholder: string
  /** The topics to choose from. */
  topics: string[]
  /** The message field's label. */
  message: string
  /** The message field's placeholder. */
  messagePlaceholder: string
  /** The checkbox's label. */
  consent: string
  /** The reply promise beside the button. */
  replyNote: string
  /** The button's label. */
  send: string
  /** The line under the card, before the address. */
  alternative: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsClassicCenteredCopy> = {
  en: {
    ...contactUsFormMessages.en,
    eyebrow: "CONTACT",
    heading: "Talk to the Fasla team",
    description: "Tell us what you need and the right person will get back to you within one business day.",
    firstName: "First name",
    firstNamePlaceholder: "Sara",
    lastName: "Last name",
    lastNamePlaceholder: "Al Mansouri",
    email: "Work email",
    emailPlaceholder: "sara@company.com",
    topic: "What is this about?",
    topicPlaceholder: "Choose a topic",
    topics: ["A project", "A partnership", "Support", "Something else"],
    message: "Message",
    messagePlaceholder: "Tell us a little about your project, timeline and budget.",
    consent: "I agree to the Fasla privacy policy.",
    replyNote: "We reply in under 24 hours.",
    send: "Send message",
    alternative: "Prefer email?",
  },
  ar: {
    ...contactUsFormMessages.ar,
    eyebrow: "تواصل",
    heading: "تحدّث إلى فريق فاصلة",
    description: "أخبرنا بما تحتاجه وسيعود إليك الشخص المناسب خلال يوم عمل واحد.",
    firstName: "الاسم الأول",
    firstNamePlaceholder: "سارة",
    lastName: "اسم العائلة",
    lastNamePlaceholder: "المنصوري",
    email: "بريد العمل",
    emailPlaceholder: "sara@company.com",
    topic: "عن ماذا تريد التحدث؟",
    topicPlaceholder: "اختر موضوعًا",
    topics: ["مشروع", "شراكة", "دعم", "موضوع آخر"],
    message: "الرسالة",
    messagePlaceholder: "أخبرنا قليلًا عن مشروعك وجدولك وميزانيتك.",
    consent: "أوافق على سياسة الخصوصية في فاصلة.",
    replyNote: "نردّ خلال أقل من 24 ساعة.",
    send: "أرسل الرسالة",
    alternative: "تفضّل البريد؟",
  },
}

export interface ContactUsClassicCenteredProps extends ContactUsFormBlockProps, Partial<ContactUsClassicCenteredCopy> {
  /** The address offered under the card. */
  emailAddress?: string
}

const EMAIL_LINK =
  "font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-sm"

export function ContactUsClassicCentered({ locale = "en", ...given }: ContactUsClassicCenteredProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, emailAddress: address = "hello@fasla.com", className, ...html } = rest
  const headingId = React.useId()

  const f = {
    firstName: { name: "firstName", kind: "text", label: copy.firstName, placeholder: copy.firstNamePlaceholder, autoComplete: "given-name" },
    lastName: { name: "lastName", kind: "text", label: copy.lastName, placeholder: copy.lastNamePlaceholder, autoComplete: "family-name" },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    topic: { name: "topic", kind: "select", label: copy.topic, placeholder: copy.topicPlaceholder, options: copy.topics.map((topic) => ({ value: topic, label: topic })) },
    message: { name: "message", kind: "textarea", label: copy.message, placeholder: copy.messagePlaceholder, required: true },
    consent: { name: "consent", kind: "checkbox", label: copy.consent, size: "sm", required: true },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  return (
    <ContactUsSection labelledBy={headingId} className={className} contentClassName="items-center" {...html}>
      <ContactUsHeader
        headingId={headingId}
        align="center"
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        description={copy.description}
        className="max-w-3xl"
        headingClassName="text-2xl [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
        eyebrowClassName="text-sm font-semibold text-primary"
      />

      <ContactUsForm form={form} className="w-full max-w-3xl rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2">
            <ContactUsField field={f.firstName} />
            <ContactUsField field={f.lastName} />
          </div>
          <ContactUsField field={f.email} />
          <ContactUsField field={f.topic} />
          <ContactUsField field={f.message} />
          <ContactUsField field={f.consent} />
          <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
            <p className="text-xs text-muted-foreground">{copy.replyNote}</p>
            <ContactUsSubmit size="md" className="w-full [@container(min-width:40rem)]:w-auto">
              <span>{copy.send}</span>
              <Send aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
            </ContactUsSubmit>
          </div>
        </div>
      </ContactUsForm>

      <p className="text-sm text-muted-foreground">
        {copy.alternative}{" "}
        <a href={`mailto:${address}`} className={EMAIL_LINK}>
          <bdi dir="ltr">{address}</bdi>
        </a>
      </p>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsClassicCenteredCopy = COPY
