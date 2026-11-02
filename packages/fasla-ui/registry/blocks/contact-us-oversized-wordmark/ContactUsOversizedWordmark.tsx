"use client"

import * as React from "react"
import {
  ContactUsField,
  ContactUsForm,
  ContactUsRule,
  ContactUsSection,
  ContactUsSubmit,
  contactUsFormMessages,
  splitCopy,
  useContactUsForm,
  useReveal,
  type ContactUsFieldDef,
  type ContactUsFormBlockProps,
  type ContactUsFormMessages,
  type ContactUsLocale,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Oversized Wordmark.
 *
 * The word "Contact" set as large as the page allows (9XL on Desktop), a
 * hairline under it, then a narrow intro beside a long form. The intro is a
 * line of invitation over the direct details: the address in `primary`, the
 * phone and the hours in `muted-foreground`. The form has eight fields:
 * name and email, phone and company, two selects, the message and a terms
 * checkbox, above a Send your message button.
 *
 * Desktop sets the intro 360px wide beside the form, the paired fields two
 * across. Tablet keeps them side by side (the form is then 296px, so its
 * pairs stack) and the wordmark steps to 7XL. Mobile stacks intro over form
 * and the wordmark is 5XL; the button spans the width.
 *
 * The form is real. It calls `onSubmit(values)` with name, email, phone,
 * company, interest, source, message and terms. On first view the wordmark
 * scales in as it opens from its start edge, the rule draws, and the fields
 * rise one after another.
 *
 * Content limits: the wordmark up to 9 characters (it is set at 9XL), the
 * intro up to 105 characters, a label up to 32. The other limits are in the
 * block's documentation page, which the default copy stays inside.
 */

export interface ContactUsOversizedWordmarkCopy extends ContactUsFormMessages {
  /** The wordmark, an `h2`. Keep it to one short word. */
  heading: string
  /** The invitation beside the form. */
  intro: string
  /** The hours, under the address and phone. */
  hours: string
  /** The name field's label. */
  name: string
  /** The name field's placeholder. */
  namePlaceholder: string
  /** The email field's label. */
  email: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The phone field's label. */
  phone: string
  /** The phone field's placeholder. */
  phonePlaceholder: string
  /** The company field's label. */
  company: string
  /** The company field's placeholder. */
  companyPlaceholder: string
  /** The area of interest select's label. */
  interest: string
  /** The area of interest select's placeholder. */
  interestPlaceholder: string
  /** The areas to choose from. */
  interests: string[]
  /** The source select's label. */
  source: string
  /** The source select's placeholder. */
  sourcePlaceholder: string
  /** The ways to have found you. */
  sources: string[]
  /** The message field's label. */
  message: string
  /** The message field's placeholder. */
  messagePlaceholder: string
  /** The terms checkbox's label. */
  terms: string
  /** The button's label. */
  send: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsOversizedWordmarkCopy> = {
  en: {
    ...contactUsFormMessages.en,
    heading: "CONTACT",
    intro: "Ready for change? Contact Fasla today and together we will take your product from vision to reality.",
    hours: "Sun–Thu · 09:00–18:00 GST",
    name: "Name",
    namePlaceholder: "Your name",
    email: "E-mail",
    emailPlaceholder: "Corporate email",
    phone: "Phone number",
    phonePlaceholder: "Your phone number",
    company: "Company",
    companyPlaceholder: "Company name",
    interest: "Area of interest",
    interestPlaceholder: "I want to know more about…",
    interests: ["Design systems", "Product design", "Brand identity", "Something else"],
    source: "How did you find out about us?",
    sourcePlaceholder: "Choose an alternative",
    sources: ["A search", "A friend or colleague", "Social media", "An event", "Other"],
    message: "Message",
    messagePlaceholder: "Write your message here",
    terms: "I accept the Fasla terms.",
    send: "Send your message",
  },
  ar: {
    ...contactUsFormMessages.ar,
    heading: "تواصل",
    intro: "مستعد للتغيير؟ تواصل مع فاصلة اليوم ولننقل منتجك معًا من الرؤية إلى الواقع.",
    hours: "من الأحد إلى الخميس، من 09:00 إلى 18:00 بتوقيت الخليج",
    name: "الاسم",
    namePlaceholder: "اسمك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "البريد المؤسسي",
    phone: "رقم الهاتف",
    phonePlaceholder: "رقم هاتفك",
    company: "الشركة",
    companyPlaceholder: "اسم الشركة",
    interest: "مجال الاهتمام",
    interestPlaceholder: "أريد معرفة المزيد عن…",
    interests: ["أنظمة التصميم", "تصميم المنتجات", "الهوية البصرية", "موضوع آخر"],
    source: "كيف عرفت عنّا؟",
    sourcePlaceholder: "اختر خيارًا",
    sources: ["بحث على الإنترنت", "صديق أو زميل", "وسائل التواصل الاجتماعي", "فعالية", "غير ذلك"],
    message: "الرسالة",
    messagePlaceholder: "اكتب رسالتك هنا",
    terms: "أوافق على شروط فاصلة.",
    send: "أرسل رسالتك",
  },
}

export interface ContactUsOversizedWordmarkProps extends ContactUsFormBlockProps, Partial<ContactUsOversizedWordmarkCopy> {
  /** The address under the intro. */
  emailAddress?: string
  /** The phone number under the address. */
  phoneNumber?: string
}

export function ContactUsOversizedWordmark({ locale = "en", ...given }: ContactUsOversizedWordmarkProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, emailAddress: address = "hello@fasla.com", phoneNumber: phone = "+971 4 512 8800", className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const options = (list: string[]) => list.map((item) => ({ value: item, label: item }))

  const f = {
    name: { name: "name", kind: "text", label: copy.name, placeholder: copy.namePlaceholder, autoComplete: "name", required: true },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    phone: { name: "phone", kind: "tel", label: copy.phone, placeholder: copy.phonePlaceholder, autoComplete: "tel" },
    company: { name: "company", kind: "text", label: copy.company, placeholder: copy.companyPlaceholder, autoComplete: "organization", required: true },
    interest: { name: "interest", kind: "select", label: copy.interest, placeholder: copy.interestPlaceholder, options: options(copy.interests) },
    source: { name: "source", kind: "select", label: copy.source, placeholder: copy.sourcePlaceholder, options: options(copy.sources), required: true },
    message: { name: "message", kind: "textarea", label: copy.message, placeholder: copy.messagePlaceholder, required: true },
    terms: { name: "terms", kind: "checkbox", label: copy.terms, size: "sm", required: true },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  return (
    <ContactUsSection labelledBy={headingId} className={className} {...html}>
      <div ref={reveal} className="flex flex-col gap-12">
        <h2
          id={headingId}
          data-reveal="wipe"
          className="text-center text-5xl font-semibold text-foreground [@container(min-width:40rem)]:text-7xl [@container(min-width:64rem)]:text-9xl"
        >
          {copy.heading}
        </h2>
        <ContactUsRule data-reveal="draw-x" className="ltr:origin-left rtl:origin-right" />
        <div className="flex flex-col gap-16 [@container(min-width:40rem)]:flex-row">
          <div className="flex shrink-0 flex-col gap-6 [@container(min-width:40rem)]:w-[22.5rem]">
            <p className="text-lg font-medium text-foreground">{copy.intro}</p>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${address}`} className="w-fit rounded-sm text-base font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <bdi dir="ltr">{address}</bdi>
              </a>
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="w-fit rounded-sm text-base font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <bdi dir="ltr">{phone}</bdi>
              </a>
              <p className="text-sm text-muted-foreground">{copy.hours}</p>
            </div>
          </div>

          <ContactUsForm form={form} className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 [@container(min-width:64rem)]:grid-cols-2">
              <ContactUsField field={f.name} reveal />
              <ContactUsField field={f.email} reveal />
            </div>
            <div className="grid grid-cols-1 gap-4 [@container(min-width:64rem)]:grid-cols-2">
              <ContactUsField field={f.phone} reveal />
              <ContactUsField field={f.company} reveal />
            </div>
            <ContactUsField field={f.interest} reveal />
            <ContactUsField field={f.source} reveal />
            <ContactUsField field={f.message} reveal />
            <ContactUsField field={f.terms} reveal />
            <div className="flex justify-end">
              <ContactUsSubmit size="md" className="w-full [@container(min-width:64rem)]:w-auto">
                {copy.send}
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
export const contactUsOversizedWordmarkCopy = COPY
