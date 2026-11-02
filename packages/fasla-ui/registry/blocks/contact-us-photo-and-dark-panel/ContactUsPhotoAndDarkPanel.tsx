"use client"

import * as React from "react"
import {
  CONTACT_US_TEXTAREA_88,
  ContactUsField,
  ContactUsForm,
  ContactUsPhotoSlot,
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
  type ContactUsPhoto,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Photo & Dark Panel.
 *
 * A 14px frame in `chart-4`, 8px thick, holding a photo and a panel 8px
 * apart, both with 10px corners. The photo is 580px wide on Desktop. The
 * panel is the page's own surface (`background`) with 32px of padding: a
 * heading and a line, then first and last name, email and phone, a subject, a
 * message and a full-width Submit button.
 *
 * Tablet and Mobile stack them inside the same frame, the photo a 300px band
 * on Tablet and 220px on Mobile. The name and email/phone rows become one
 * field each on Mobile. The heading is 48px on Desktop and Tablet and 24px on
 * Mobile.
 *
 * "Dark" is the Type's name, not its colour: the panel is mode-reactive, so it
 * is light in Light mode and dark in Dark mode. The `chart-4` frame stays.
 *
 * The form is real. It calls `onSubmit(values)` with firstName, lastName,
 * email, phone, subject and message. First name, last name, email and
 * message are required, and their labels end in " *". The phone is optional.
 *
 * Motion: once, when the block is in view, the photo fades in and the panel
 * slides 16px from the photo's side while it fades. Reduced motion: both
 * only fade. The outer frame never moves.
 *
 * Content limits: the heading up to 24 characters, the line up to 110.
 */

export interface ContactUsPhotoAndDarkPanelCopy extends ContactUsFormMessages {
  /** The panel's heading, an `h2`. */
  heading: string
  /** The line under the heading. */
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
  /** The phone field's label. */
  phone: string
  /** The phone field's placeholder. */
  phonePlaceholder: string
  /** The subject field's label. */
  subject: string
  /** The subject field's placeholder. */
  subjectPlaceholder: string
  /** The message field's label. */
  message: string
  /** The message field's placeholder. */
  messagePlaceholder: string
  /** The button's label. */
  submit: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsPhotoAndDarkPanelCopy> = {
  en: {
    ...contactUsFormMessages.en,
    heading: "Contact us",
    description: "Questions about Fasla, a partnership, or press? Send us a note and the right team will get back to you.",
    firstName: "First name",
    firstNamePlaceholder: "Jane",
    lastName: "Last name",
    lastNamePlaceholder: "Doe",
    email: "Email",
    emailPlaceholder: "jane@company.com",
    phone: "Phone (optional)",
    phonePlaceholder: "+971 50 123 4567",
    subject: "Subject",
    subjectPlaceholder: "What is this about?",
    message: "Message",
    messagePlaceholder: "Tell us a little more…",
    submit: "Submit",
  },
  ar: {
    ...contactUsFormMessages.ar,
    heading: "تواصل معنا",
    description: "أسئلة عن فاصلة أو شراكة أو الصحافة؟ أرسل لنا رسالة وسيعود إليك الفريق المناسب.",
    firstName: "الاسم الأول",
    firstNamePlaceholder: "سارة",
    lastName: "اسم العائلة",
    lastNamePlaceholder: "المنصوري",
    email: "البريد الإلكتروني",
    emailPlaceholder: "jane@company.com",
    phone: "الهاتف (اختياري)",
    phonePlaceholder: "+971 50 123 4567",
    subject: "الموضوع",
    subjectPlaceholder: "ما موضوع رسالتك؟",
    message: "الرسالة",
    messagePlaceholder: "أخبرنا بالمزيد…",
    submit: "إرسال",
  },
}

export interface ContactUsPhotoAndDarkPanelProps extends ContactUsFormBlockProps, Partial<ContactUsPhotoAndDarkPanelCopy> {
  /** The photo beside (or above) the panel. A `muted` ground shows without one. */
  photo?: ContactUsPhoto
}

export function ContactUsPhotoAndDarkPanel({ locale = "en", ...given }: ContactUsPhotoAndDarkPanelProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, photo, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    firstName: { name: "firstName", kind: "text", label: copy.firstName, placeholder: copy.firstNamePlaceholder, autoComplete: "given-name", required: true },
    lastName: { name: "lastName", kind: "text", label: copy.lastName, placeholder: copy.lastNamePlaceholder, autoComplete: "family-name", required: true },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    phone: { name: "phone", kind: "tel", label: copy.phone, placeholder: copy.phonePlaceholder, autoComplete: "tel" },
    subject: { name: "subject", kind: "text", label: copy.subject, placeholder: copy.subjectPlaceholder },
    message: { name: "message", kind: "textarea", label: copy.message, placeholder: copy.messagePlaceholder, required: true, groupClassName: CONTACT_US_TEXTAREA_88 },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })
  const rowClass = "grid grid-cols-1 gap-3 [@container(min-width:40rem)]:grid-cols-2"

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...html}>
      <div ref={reveal} className="flex flex-col gap-2 rounded-[14px] bg-chart-4 p-2 [@container(min-width:64rem)]:flex-row">
        <ContactUsPhotoSlot
          photo={photo}
          data-reveal="fade"
          className="h-[13.75rem] shrink-0 rounded-[10px] [@container(min-width:40rem)]:h-[18.75rem] [@container(min-width:64rem)]:h-auto [@container(min-width:64rem)]:w-[36.25rem]"
        />
        <div data-reveal="slide" data-reveal-from="start" className="flex min-w-0 flex-1 flex-col gap-4 rounded-[10px] bg-background p-8">
          <div className="flex flex-col gap-2">
            <h2 id={headingId} className="text-2xl font-medium leading-[2.75rem] rtl:leading-[3.75rem] text-foreground [@container(min-width:40rem)]:text-5xl">
              {copy.heading}
            </h2>
            <p className="text-sm text-muted-foreground">{copy.description}</p>
          </div>
          <ContactUsForm form={form} className="flex flex-col gap-4">
            <div className={rowClass}>
              <ContactUsField field={f.firstName} />
              <ContactUsField field={f.lastName} />
            </div>
            <div className={rowClass}>
              <ContactUsField field={f.email} />
              <ContactUsField field={f.phone} />
            </div>
            <ContactUsField field={f.subject} />
            <ContactUsField field={f.message} />
            <ContactUsSubmit size="lg" className="w-full">
              {copy.submit}
            </ContactUsSubmit>
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
export const contactUsPhotoAndDarkPanelCopy = COPY
