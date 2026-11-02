"use client"

import * as React from "react"
import {
  ContactUsField,
  ContactUsForm,
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
 * Figma: `Contact Us` (42334:293941), Type=Grand Headline Form.
 *
 * A centred, shouting headline over a bordered form, on a page of faint grid
 * lines. An eyebrow in `foreground` and a headline in `info`, both set in capitals (the
 * headline at 6XL, bold), then a frame with an `info` border: first name and
 * email side by side, phone, a line of consent in XS, an optional checkbox
 * and a large SUBMIT button. The fields are the large size (40px).
 *
 * The grid is 72px squares drawn in `border` at 60%, from the section's top
 * and start corner, across the whole section. This Type's padding is 64px on
 * Desktop (the others use 96).
 *
 * Desktop sets the frame 720px wide with 48px of padding; Tablet 560px with
 * 24px; Mobile spans the section with 16px, the headline steps from 6XL to
 * 5XL to 3XL, and first name and email stack.
 *
 * The form is real. It calls `onSubmit(values)` with firstName, email, phone
 * and updates. On first view the eyebrow and the grid fade in, the headline
 * rises, and the frame and its fields follow.
 *
 * Content limits: the eyebrow up to 30 characters, the headline up to 28
 * (it is set at 6XL), the consent line up to 200. The other limits are in
 * the block's documentation page, which the default copy stays inside.
 */

export interface ContactUsGrandHeadlineFormCopy extends ContactUsFormMessages {
  /** The line above the headline. */
  eyebrow: string
  /** The headline, an `h2`. */
  heading: string
  /** The first name field's label. */
  firstName: string
  /** The first name field's placeholder. */
  firstNamePlaceholder: string
  /** The email field's label. */
  email: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The phone field's label. */
  phone: string
  /** The phone field's placeholder. */
  phonePlaceholder: string
  /** The line of consent over the checkbox. */
  consentNote: string
  /** The optional checkbox's label. */
  updates: string
  /** The button's label. */
  submit: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsGrandHeadlineFormCopy> = {
  en: {
    ...contactUsFormMessages.en,
    eyebrow: "WANT TO TALK ABOUT FASLA?",
    heading: "FILL OUT THE FORM BELOW!",
    firstName: "First name",
    firstNamePlaceholder: "First name",
    email: "Email",
    emailPlaceholder: "you@company.com",
    phone: "Phone number",
    phonePlaceholder: "+971 50 123 4567",
    consentNote:
      "By clicking submit, you give Fasla your consent to contact you by email or phone about your request. You can opt out at any time by replying STOP. See the privacy policy and terms on the website.",
    updates: "I agree to receive other communications from Fasla.",
    submit: "SUBMIT",
  },
  ar: {
    ...contactUsFormMessages.ar,
    eyebrow: "هل تريد التحدث عن فاصلة؟",
    heading: "املأ النموذج أدناه!",
    firstName: "الاسم الأول",
    firstNamePlaceholder: "الاسم الأول",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    phone: "رقم الهاتف",
    phonePlaceholder: "+971 50 123 4567",
    consentNote:
      "بالضغط على إرسال، تمنح فاصلة موافقتك على التواصل معك عبر البريد الإلكتروني أو الهاتف بخصوص طلبك. يمكنك إلغاء الاشتراك في أي وقت بالرد بكلمة STOP. اطّلع على سياسة الخصوصية والشروط في الموقع.",
    updates: "أوافق على تلقي رسائل أخرى من فاصلة.",
    submit: "إرسال",
  },
}

export type ContactUsGrandHeadlineFormProps = ContactUsFormBlockProps & Partial<ContactUsGrandHeadlineFormCopy>

/**
 * Figma's grid: 72px squares in `border` at 60%, one 1px line along each
 * square's start and top. Written out whole, as Tailwind reads classes as
 * they are written.
 */
const GRID_CLASS =
  "pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px)] [background-size:72px_72px]"

export function ContactUsGrandHeadlineForm({ locale = "en", ...given }: ContactUsGrandHeadlineFormProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    firstName: { name: "firstName", kind: "text", label: copy.firstName, placeholder: copy.firstNamePlaceholder, autoComplete: "given-name", required: true, size: "lg" },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true, size: "lg" },
    phone: { name: "phone", kind: "tel", label: copy.phone, placeholder: copy.phonePlaceholder, autoComplete: "tel", size: "lg" },
    updates: { name: "updates", kind: "checkbox", label: copy.updates, size: "md" },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  return (
    <ContactUsSection
      labelledBy={headingId}
      padding="md"
      gap="md"
      backdrop={<div aria-hidden data-reveal="fade" data-reveal-delay="0" className={GRID_CLASS} />}
      className={className}
      {...html}
    >
      <div ref={reveal} className="flex flex-col items-center gap-10">
        <div className="flex w-full max-w-[47.5rem] flex-col items-center gap-4 text-center">
          <p data-reveal="fade" data-reveal-delay="0" className="text-sm font-semibold text-foreground">
            {copy.eyebrow}
          </p>
          <h2
            id={headingId}
            data-reveal="rise"
            data-reveal-delay="60"
            className="text-3xl font-bold text-info [@container(min-width:40rem)]:text-5xl [@container(min-width:64rem)]:text-6xl"
          >
            {copy.heading}
          </h2>
        </div>

        <ContactUsForm
          form={form}
          data-reveal="fade"
          data-reveal-delay="140"
          className="flex w-full flex-col gap-5 border border-info bg-background p-4 [@container(min-width:40rem)]:max-w-[35rem] [@container(min-width:40rem)]:p-6 [@container(min-width:64rem)]:max-w-[45rem] [@container(min-width:64rem)]:p-12"
        >
          <div className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2">
            <ContactUsField field={f.firstName} reveal />
            <ContactUsField field={f.email} reveal />
          </div>
          <ContactUsField field={f.phone} reveal />
          <p className="text-xs text-muted-foreground">{copy.consentNote}</p>
          <ContactUsField field={f.updates} reveal />
          <div className="flex">
            <ContactUsSubmit size="lg">
              {copy.submit}
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
export const contactUsGrandHeadlineFormCopy = COPY
