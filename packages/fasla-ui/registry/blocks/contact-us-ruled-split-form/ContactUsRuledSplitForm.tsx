"use client"

import * as React from "react"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"
import {
  CONTACT_US_TEXTAREA_104,
  ContactUsField,
  ContactUsForm,
  ContactUsRule,
  ContactUsSection,
  ContactUsSocialLinks,
  ContactUsSubmit,
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
 * Figma: `Contact Us` (42334:293941), Type=Ruled Split Form.
 *
 * Two columns divided by a 1px vertical rule. On the start side: an eyebrow,
 * the heading, a paragraph that points to the FAQ, three contact rows (email,
 * phone, place, each after a 18px mark) and the social marks. On the end
 * side: a form with name, subject, email and a message, above a SUBMIT
 * button with an arrow. The message field's group is 104px tall, as Figma's
 * fixed Textarea is, and its box grows with the text.
 *
 * Desktop and Tablet keep the two columns (the aside 420px, 48px of padding
 * on its end and on the form's start; the form is 299px on Tablet and its
 * button spans it). Mobile stacks them with a horizontal rule between, the
 * heading steps from 4XL to 3XL on Tablet and 2XL and the button spans the width.
 *
 * The form is real. The Subject select starts on its first choice. It calls
 * `onSubmit(values)` with name, subject, email and message. The message is
 * limited to 500 characters: a counter appears from 400, turns `warning`
 * from 450 and `destructive` at the limit. On first view the rule draws and
 * the two columns fade in, one after the other.
 *
 * Content limits: the heading up to 40 characters, the paragraph up to 170,
 * a contact row up to 36. The other limits are in the block's documentation
 * page, which the default copy stays inside.
 */

export interface ContactUsRuledSplitFormCopy extends ContactUsFormMessages {
  /** The small line above the heading. */
  eyebrow: string
  /** The heading, an `h2`. */
  heading: string
  /** The paragraph under the heading. */
  description: string
  /** The place, in the third contact row. */
  place: string
  /** The name field's label. */
  name: string
  /** The name field's placeholder. */
  namePlaceholder: string
  /** The subject select's label. */
  subject: string
  /** The subjects to choose from. The first is chosen at first. */
  subjects: string[]
  /** The email field's label. */
  email: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The message field's label. */
  message: string
  /** The message field's placeholder. */
  messagePlaceholder: string
  /** The button's label. */
  submit: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsRuledSplitFormCopy> = {
  en: {
    ...contactUsFormMessages.en,
    eyebrow: "CONTACT US",
    heading: "You have questions. We have answers.",
    description: "Before you hit submit, take a look at the FAQ — a faster answer may already be waiting for you. Otherwise, fill in the form and it lands with the studio directly.",
    place: "Downtown Dubai, UAE",
    name: "Name",
    namePlaceholder: "First and last name",
    subject: "Subject",
    subjects: ["General", "Sales", "Support", "Press"],
    email: "Email",
    emailPlaceholder: "you@company.com",
    message: "Message",
    messagePlaceholder: "Tell us what is on your mind.",
    submit: "SUBMIT",
  },
  ar: {
    ...contactUsFormMessages.ar,
    eyebrow: "تواصل معنا",
    heading: "لديك أسئلة. ولدينا إجابات.",
    description: "قبل الإرسال، ألقِ نظرة على الأسئلة الشائعة؛ قد تكون هناك إجابة أسرع بانتظارك. وإلا فاملأ النموذج وسيصل إلى الاستوديو مباشرة.",
    place: "وسط مدينة دبي، الإمارات",
    name: "الاسم",
    namePlaceholder: "الاسم الأول والأخير",
    subject: "الموضوع",
    subjects: ["عام", "المبيعات", "الدعم", "الصحافة"],
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    message: "الرسالة",
    messagePlaceholder: "أخبرنا بما يدور في ذهنك.",
    submit: "إرسال",
  },
}

export interface ContactUsRuledSplitFormProps extends ContactUsFormBlockProps, Partial<ContactUsRuledSplitFormCopy> {
  /** The address in the first contact row. */
  emailAddress?: string
  /** The number in the second contact row. */
  phoneNumber?: string
  /** The marks under the rows. Each goes to `href`; the defaults go nowhere, so pass your own. */
  socialLinks?: ContactUsSocialLink[]
  /** The most the message can hold. */
  messageLimit?: number
}

const DEFAULT_SOCIAL: ContactUsSocialLink[] = [
  { platform: "linkedin", href: "#" },
  { platform: "instagram", href: "#" },
  { platform: "x", href: "#" },
]

const ROW_LINK = "rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

export function ContactUsRuledSplitForm({ locale = "en", ...given }: ContactUsRuledSplitFormProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, emailAddress: address = "hello@fasla.com", phoneNumber: phone = "+971 4 512 8800", socialLinks = DEFAULT_SOCIAL, messageLimit = 500, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    name: { name: "name", kind: "text", label: copy.name, placeholder: copy.namePlaceholder, autoComplete: "name", required: true },
    subject: { name: "subject", kind: "select", label: copy.subject, options: copy.subjects.map((item) => ({ value: item, label: item })), required: true },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    message: {
      name: "message",
      kind: "textarea",
      label: copy.message,
      placeholder: copy.messagePlaceholder,
      required: true,
      maxLength: messageLimit,
      groupClassName: CONTACT_US_TEXTAREA_104,
    },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled, defaultValues: { subject: copy.subjects[0] ?? "" } })

  const rows = [
    { icon: Mail, text: address, href: `mailto:${address}`, latin: true },
    { icon: Phone, text: phone, href: `tel:${phone.replace(/\s+/g, "")}`, latin: true },
    { icon: MapPin, text: copy.place, href: undefined, latin: false },
  ]

  return (
    <ContactUsSection labelledBy={headingId} className={className} {...html}>
      <div ref={reveal} className="flex flex-col gap-6 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-0">
        <div data-reveal="fade" data-reveal-delay="100" className="flex shrink-0 flex-col gap-8 [@container(min-width:40rem)]:w-[26.25rem] [@container(min-width:40rem)]:pe-12">
          <div className="flex flex-col gap-8">
            <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {copy.heading}
            </h2>
            <p className="text-base text-muted-foreground">{copy.description}</p>
          </div>
          <ul className="flex flex-col gap-3">
            {rows.map(({ icon: Icon, text, href, latin }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium text-foreground">
                <Icon aria-hidden size={18} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                {href ? (
                  <a href={href} className={ROW_LINK}>
                    <bdi dir={latin ? "ltr" : undefined}>{text}</bdi>
                  </a>
                ) : (
                  <span>{text}</span>
                )}
              </li>
            ))}
          </ul>
          <ContactUsSocialLinks links={socialLinks} />
        </div>

        <ContactUsRule orientation="vertical" data-reveal="draw-y" className="hidden origin-top [@container(min-width:40rem)]:block" />
        <ContactUsRule data-reveal="draw-x" className="ltr:origin-left rtl:origin-right [@container(min-width:40rem)]:hidden" />

        <ContactUsForm form={form} data-reveal="fade" data-reveal-delay="250" className="flex min-w-0 flex-1 flex-col gap-6 [@container(min-width:40rem)]:ps-12">
          <ContactUsField field={f.name} />
          <ContactUsField field={f.subject} />
          <ContactUsField field={f.email} />
          <ContactUsField field={f.message} />
          <div className="flex justify-end">
            <ContactUsSubmit size="lg" className="w-full [@container(min-width:64rem)]:w-auto">
              <span>{copy.submit}</span>
              <ArrowRight aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
            </ContactUsSubmit>
          </div>
        </ContactUsForm>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsRuledSplitFormCopy = COPY
