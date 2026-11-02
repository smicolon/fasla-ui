"use client"

import * as React from "react"
import {
  ContactUsField,
  ContactUsForm,
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
 * Figma: `Contact Us` (42334:293941), Type=Dark Statement.
 *
 * A statement and a form, side by side and with no card. On the start side:
 * an eyebrow, a large headline, a paragraph, three facts (the studio, the
 * hours, a direct address) and a row of social marks. On the end side: the
 * form, with first and last name side by side, email, company, the project
 * and a privacy checkbox above a large Submit button.
 *
 * It is called Dark Statement in Figma, but its ground is `background`: it
 * reads light in Light and dark in Dark, as the frames do.
 *
 * Desktop sets the statement 560px wide beside the form. Tablet and Mobile
 * stack them, 80px apart; the headline steps from 5XL to 3XL, the
 * facts become label over value on Mobile, and the button spans the width.
 *
 * The form is real. It calls `onSubmit(values)` with firstName, lastName,
 * email, company, project and consent. The headline rises into place once.
 *
 * Content limits: the heading up to 54 characters, the paragraph up to 150,
 * a fact's value up to 52. The other limits are in the block's documentation
 * page, which the default copy stays inside.
 */

export interface ContactUsDarkStatementFact {
  /** The fact's name, such as "Hours". */
  label: string
  /** What it says. */
  value: string
  /** Makes the value a link, such as `mailto:hello@fasla.com`. */
  href?: string
}

export interface ContactUsDarkStatementCopy extends ContactUsFormMessages {
  /** The small line above the headline. */
  eyebrow: string
  /** The headline, an `h2`. */
  heading: string
  /** The paragraph under the headline. */
  description: string
  /** The three facts under the paragraph. */
  facts: ContactUsDarkStatementFact[]
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
  /** The company field's label. */
  company: string
  /** The company field's placeholder. */
  companyPlaceholder: string
  /** The project field's label. */
  project: string
  /** The project field's placeholder. */
  projectPlaceholder: string
  /** The checkbox's label. */
  consent: string
  /** The button's label. */
  submit: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsDarkStatementCopy> = {
  en: {
    ...contactUsFormMessages.en,
    eyebrow: "CONTACT",
    heading: "Let us make something worth talking about.",
    description: "Fasla partners with product teams who care about craft. Tell us where you are and we will tell you honestly whether we are the right fit.",
    facts: [
      { label: "Studio", value: "Dubai · Riyadh · remote" },
      { label: "Hours", value: "Sun–Thu, 09:00–18:00 GST" },
      { label: "Direct", value: "hello@fasla.com", href: "mailto:hello@fasla.com" },
    ],
    firstName: "First name",
    firstNamePlaceholder: "Sara",
    lastName: "Last name",
    lastNamePlaceholder: "Al Mansouri",
    email: "Email",
    emailPlaceholder: "sara@company.com",
    company: "Company",
    companyPlaceholder: "Where do you work?",
    project: "Tell us about the project",
    projectPlaceholder: "Scope, timeline, budget range — whatever you have so far.",
    consent: "I have read the privacy statement.",
    submit: "Submit",
  },
  ar: {
    ...contactUsFormMessages.ar,
    eyebrow: "تواصل",
    heading: "لنصنع شيئًا يستحق الحديث عنه.",
    description: "تعمل فاصلة مع فرق المنتجات التي تهتم بالحِرفية. أخبرنا أين أنت وسنخبرك بصراحة إن كنّا الخيار المناسب.",
    facts: [
      { label: "الاستوديو", value: "دبي والرياض وعن بُعد" },
      { label: "ساعات العمل", value: "من الأحد إلى الخميس، من 09:00 إلى 18:00 بتوقيت الخليج" },
      { label: "مباشر", value: "hello@fasla.com", href: "mailto:hello@fasla.com" },
    ],
    firstName: "الاسم الأول",
    firstNamePlaceholder: "سارة",
    lastName: "اسم العائلة",
    lastNamePlaceholder: "المنصوري",
    email: "البريد الإلكتروني",
    emailPlaceholder: "sara@company.com",
    company: "الشركة",
    companyPlaceholder: "أين تعمل؟",
    project: "أخبرنا عن المشروع",
    projectPlaceholder: "النطاق والجدول والميزانية: كل ما لديك حتى الآن.",
    consent: "قرأت بيان الخصوصية.",
    submit: "إرسال",
  },
}

export interface ContactUsDarkStatementProps extends ContactUsFormBlockProps, Partial<ContactUsDarkStatementCopy> {
  /** The marks under the facts. Each goes to `href`; the defaults go nowhere, so pass your own. */
  socialLinks?: ContactUsSocialLink[]
}

const DEFAULT_SOCIAL: ContactUsSocialLink[] = [
  { platform: "linkedin", href: "#" },
  { platform: "x", href: "#" },
  { platform: "dribbble", href: "#" },
]

export function ContactUsDarkStatement({ locale = "en", ...given }: ContactUsDarkStatementProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, socialLinks = DEFAULT_SOCIAL, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    firstName: { name: "firstName", kind: "text", label: copy.firstName, placeholder: copy.firstNamePlaceholder, autoComplete: "given-name" },
    lastName: { name: "lastName", kind: "text", label: copy.lastName, placeholder: copy.lastNamePlaceholder, autoComplete: "family-name" },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    company: { name: "company", kind: "text", label: copy.company, placeholder: copy.companyPlaceholder, autoComplete: "organization" },
    project: { name: "project", kind: "textarea", label: copy.project, placeholder: copy.projectPlaceholder, required: true },
    consent: { name: "consent", kind: "checkbox", label: copy.consent, size: "sm", required: true },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  return (
    <ContactUsSection labelledBy={headingId} className={className} {...html}>
      <div ref={reveal} className="grid grid-cols-1 gap-20 [@container(min-width:64rem)]:grid-cols-[35rem_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col items-start gap-8">
          <p className="text-sm font-semibold text-muted-foreground">{copy.eyebrow}</p>
          <h2 id={headingId} data-reveal="rise" className="text-3xl font-semibold text-foreground [@container(min-width:64rem)]:text-5xl">
            {copy.heading}
          </h2>
          <p className="text-base text-muted-foreground [@container(min-width:40rem)]:text-lg">{copy.description}</p>
          <dl className="flex w-full flex-col gap-4">
            {copy.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-4 text-sm font-medium [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:justify-between">
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="text-end text-foreground">
                  {fact.href ? (
                    <a href={fact.href} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                      <bdi dir="ltr">{fact.value}</bdi>
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <ContactUsSocialLinks links={socialLinks} />
        </div>

        <ContactUsForm form={form} className="flex min-w-0 flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2">
            <ContactUsField field={f.firstName} />
            <ContactUsField field={f.lastName} />
          </div>
          <ContactUsField field={f.email} />
          <ContactUsField field={f.company} />
          <ContactUsField field={f.project} />
          <ContactUsField field={f.consent} />
          <div className="flex justify-end">
            <ContactUsSubmit size="lg" className="w-full [@container(min-width:40rem)]:w-auto">
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
export const contactUsDarkStatementCopy = COPY
