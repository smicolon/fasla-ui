"use client"

import * as React from "react"
import { CircleCheck } from "lucide-react"
import { Button, buttonVariants } from "../../ui/button/button"
import {
  CONTACT_US_TEXTAREA_88,
  ContactUsChoiceGroup,
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
 * Figma: `Contact Us` (42334:293941), Type=Pitch & Inquiry.
 *
 * One bordered card in two halves. The start half is a pitch on a
 * `soft-success-30` tint: the heading, three promises each after a check,
 * and at the bottom the email, a question and a Success Book a free call button.
 * The end half is an inquiry form: a Service choice and a Budget choice as
 * chips, full name and email side by side, the project details and a
 * full-width Submit inquiry button (pill-shaped, as the chips).
 *
 * Desktop sets the halves side by side, 48px padded. Tablet and Mobile stack
 * them, pitch first; the heading steps from 4XL to 3XL, and the call button
 * spans the card. The form keeps its 48px padding at every size.
 *
 * The chips are a single choice (Success when chosen): pressing the chosen one clears it.
 * The form is real: it calls `onSubmit(values)` with service, budget, name,
 * email, details. The three promises fade in one after the
 * other, once, when the card comes into view.
 *
 * Content limits: the heading up to 30 characters, a promise up to 48, a chip
 * up to 20. The other limits are in the block's documentation page, which
 * the default copy stays inside.
 */

export interface ContactUsPitchAndInquiryCopy extends ContactUsFormMessages {
  /** The pitch's heading, an `h2`. */
  heading: string
  /** The three promises, each after a check. */
  promises: string[]
  /** The question over the call button. */
  callPrompt: string
  /** The call button's label. */
  callLabel: string
  /** The Service group's label. */
  serviceLabel: string
  /** The services, one chip each. */
  services: string[]
  /** The Budget group's label. */
  budgetLabel: string
  /** The budgets, one chip each. */
  budgets: string[]
  /** The name field's label. */
  name: string
  /** The name field's placeholder. */
  namePlaceholder: string
  /** The email field's label. */
  email: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The details field's label. */
  details: string
  /** The details field's placeholder. */
  detailsPlaceholder: string
  /** The button's label. */
  submit: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsPitchAndInquiryCopy> = {
  en: {
    ...contactUsFormMessages.en,
    heading: "Tell us about your project",
    promises: ["We will respond to you within 12 hours", "We will sign an NDA if requested", "Access to dedicated design-system specialists"],
    callPrompt: "Always busy and want to book an exact time to call?",
    callLabel: "Book a free call",
    serviceLabel: "Service",
    services: ["Design system", "Product design", "Brand identity", "Audit"],
    budgetLabel: "Budget",
    budgets: ["Less than $10K", "$10K – $50K", "More than $50K"],
    name: "Full name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "you@company.com",
    details: "Project details",
    detailsPlaceholder: "Tell us about your goals and timeline",
    submit: "Submit inquiry",
  },
  ar: {
    ...contactUsFormMessages.ar,
    heading: "حدّثنا عن مشروعك",
    promises: ["سنردّ عليك خلال 12 ساعة", "سنوقّع اتفاقية سرّية عند الطلب", "وصول إلى متخصصين في أنظمة التصميم"],
    callPrompt: "مشغول دائمًا وتريد حجز موعد محدد للمكالمة؟",
    callLabel: "احجز مكالمة مجانية",
    serviceLabel: "الخدمة",
    services: ["نظام تصميم", "تصميم المنتجات", "الهوية البصرية", "مراجعة"],
    budgetLabel: "الميزانية",
    budgets: ["أقل من 10 آلاف دولار", "من 10 إلى 50 ألف دولار", "أكثر من 50 ألف دولار"],
    name: "الاسم الكامل",
    namePlaceholder: "اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    details: "تفاصيل المشروع",
    detailsPlaceholder: "أخبرنا عن أهدافك والجدول الزمني",
    submit: "أرسل الاستفسار",
  },
}

export interface ContactUsPitchAndInquiryProps extends ContactUsFormBlockProps, Partial<ContactUsPitchAndInquiryCopy> {
  /** The address in the pitch. */
  emailAddress?: string
  /** Where the call button goes. Without it, the button calls `onBookCall`. */
  bookCallHref?: string
  /** Called when the call button is pressed and has no `bookCallHref`. */
  onBookCall?: () => void
}

export function ContactUsPitchAndInquiry({ locale = "en", ...given }: ContactUsPitchAndInquiryProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, emailAddress: address = "hello@fasla.com", bookCallHref, onBookCall, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const options = (list: string[]) => list.map((item) => ({ value: item, label: item }))

  const f = {
    service: { name: "service", kind: "select", label: copy.serviceLabel, options: options(copy.services) },
    budget: { name: "budget", kind: "select", label: copy.budgetLabel, options: options(copy.budgets) },
    name: { name: "name", kind: "text", label: copy.name, placeholder: copy.namePlaceholder, autoComplete: "name", required: true },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    details: { name: "details", kind: "textarea", label: copy.details, placeholder: copy.detailsPlaceholder, required: true, groupClassName: CONTACT_US_TEXTAREA_88 },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  const callClass = "w-full [@container(min-width:64rem)]:w-auto"

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...html}>
      <div ref={reveal} className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground [@container(min-width:64rem)]:grid-cols-2">
        <div className="flex flex-col justify-between gap-8 bg-soft-success-30 p-12">
          <div className="flex flex-col gap-8">
            <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:64rem)]:text-4xl">
              {copy.heading}
            </h2>
            <ul className="flex flex-col gap-3">
              {copy.promises.map((promise, index) => (
                <li key={promise} data-reveal="fade" data-reveal-delay={index * 60} className="flex items-start gap-3 text-base text-foreground">
                  <CircleCheck aria-hidden size={24} strokeWidth={1.5} className="shrink-0" />
                  <span>{promise}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4">
            <a href={`mailto:${address}`} className="rounded-sm text-base font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <bdi dir="ltr">{address}</bdi>
            </a>
            <p className="text-base font-semibold text-foreground">{copy.callPrompt}</p>
            {bookCallHref ? (
              <a href={bookCallHref} className={buttonVariants({ variant: "soft", tone: "secondary", radius: "rounded", size: "md", className: callClass })}>
                {copy.callLabel}
              </a>
            ) : (
              <Button type="button" variant="soft" tone="secondary" radius="rounded" size="md" onClick={onBookCall} className={callClass}>
                {copy.callLabel}
              </Button>
            )}
          </div>
        </div>

        <ContactUsForm form={form} className="flex min-w-0 flex-col gap-5 p-12">
          <ContactUsChoiceGroup name="service" label={copy.serviceLabel} options={options(copy.services)} />
          <ContactUsChoiceGroup name="budget" label={copy.budgetLabel} options={options(copy.budgets)} />
          <div className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2">
            <ContactUsField field={f.name} />
            <ContactUsField field={f.email} />
          </div>
          <ContactUsField field={f.details} />
          <ContactUsSubmit size="lg" radius="rounded" className="w-full">
            {copy.submit}
          </ContactUsSubmit>
        </ContactUsForm>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsPitchAndInquiryCopy = COPY
