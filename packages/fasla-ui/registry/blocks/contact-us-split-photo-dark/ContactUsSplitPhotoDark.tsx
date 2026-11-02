"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import {
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
 * Figma: `Contact Us` (42334:293941), Type=Split Photo Dark.
 *
 * Two boxes 16px apart inside 16px of padding: a form side and a photo, both
 * 731px tall on Desktop. The form side is 48px of padding around a 400px
 * column, centred, with the Fasla logo at the foot: a small heading ("Book a
 * demo" and a line under it), five pill fields (name, work email, role,
 * company, team size), a full-width Request demo button and a 12px privacy
 * note. The photo sits at the end, so in Arabic it moves to the left.
 *
 * Tablet puts the form side above the photo, the column filling it, the
 * photo a 360px band; Mobile does the same with the photo 280px. The padding
 * stays 48px, so on a phone the column is 232px wide, as Figma draws it.
 *
 * "Dark" is the Type's name, not its colour: the surfaces are the page's
 * own, so the block is light in Light mode and dark in Dark mode.
 *
 * The form is real. It calls `onSubmit(values)` with name, email, role,
 * company and teamSize. The work email is the one required field and its
 * label ends in " *" (Figma does not draw that asterisk yet).
 *
 * Motion: once, when the block is in view, the photo settles from 1.04 scale
 * to 1 and the form column rises 12px and fades. Reduced motion: both only
 * fade.
 *
 * Content limits: the heading up to 24 characters, its line up to 40, the
 * privacy note up to 170.
 */

export interface ContactUsSplitPhotoDarkCopy extends ContactUsFormMessages {
  /** The form's heading, an `h2`. */
  heading: string
  /** The line under the heading. */
  description: string
  /** The name field's label. */
  name: string
  /** The name field's placeholder. */
  namePlaceholder: string
  /** The email field's label. */
  email: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The role field's label. Not `role`, which is an HTML attribute. */
  jobTitle: string
  /** The role field's placeholder. */
  jobTitlePlaceholder: string
  /** The company field's label. */
  company: string
  /** The company field's placeholder. */
  companyPlaceholder: string
  /** The team size select's label. */
  teamSize: string
  /** The team size select's placeholder. */
  teamSizePlaceholder: string
  /** The team sizes to choose from. */
  teamSizes: string[]
  /** The button's label. */
  submit: string
  /** The note under the button. */
  note: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsSplitPhotoDarkCopy> = {
  en: {
    ...contactUsFormMessages.en,
    heading: "Book a demo",
    description: "See how Fasla fits your team.",
    name: "Your name",
    namePlaceholder: "Sara Al Mansouri",
    email: "Work email",
    emailPlaceholder: "you@company.com",
    jobTitle: "Your role",
    jobTitlePlaceholder: "e.g. Founder, CTO, Design lead",
    company: "Company",
    companyPlaceholder: "Fasla Studio",
    teamSize: "Team size",
    teamSizePlaceholder: "Team size",
    teamSizes: ["1–10 people", "11–50 people", "51–200 people", "More than 200 people"],
    submit: "Request demo",
    note: "By submitting, you consent to receive product updates and invitations to events from Fasla. You can unsubscribe at any time. See our Privacy Policy for details.",
  },
  ar: {
    ...contactUsFormMessages.ar,
    heading: "احجز عرضًا تجريبيًا",
    description: "اكتشف كيف تناسب فاصلة فريقك.",
    name: "اسمك",
    namePlaceholder: "سارة المنصوري",
    email: "بريد العمل",
    emailPlaceholder: "you@company.com",
    jobTitle: "دورك الوظيفي",
    jobTitlePlaceholder: "مثال: مؤسس، مدير تقني، قائد تصميم",
    company: "الشركة",
    companyPlaceholder: "استوديو فاصلة",
    teamSize: "حجم الفريق",
    teamSizePlaceholder: "حجم الفريق",
    teamSizes: ["من 1 إلى 10 أشخاص", "من 11 إلى 50 شخصًا", "من 51 إلى 200 شخص", "أكثر من 200 شخص"],
    submit: "اطلب العرض",
    note: "بإرسالك هذا النموذج، توافق على استلام تحديثات المنتج ودعوات الفعاليات من فاصلة. يمكنك إلغاء الاشتراك في أي وقت. اطّلع على سياسة الخصوصية لمزيد من التفاصيل.",
  },
}

export interface ContactUsSplitPhotoDarkProps extends ContactUsFormBlockProps, Partial<ContactUsSplitPhotoDarkCopy> {
  /** The photo beside (or under) the form side. A `muted` ground shows without one. */
  photo?: ContactUsPhoto
}

export function ContactUsSplitPhotoDark({ locale = "en", ...given }: ContactUsSplitPhotoDarkProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, photo, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    name: { name: "name", kind: "text", label: copy.name, placeholder: copy.namePlaceholder, autoComplete: "name", radius: "rounded" },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", radius: "rounded", required: true },
    role: { name: "role", kind: "text", label: copy.jobTitle, placeholder: copy.jobTitlePlaceholder, autoComplete: "organization-title", radius: "rounded" },
    company: { name: "company", kind: "text", label: copy.company, placeholder: copy.companyPlaceholder, autoComplete: "organization", radius: "rounded" },
    teamSize: { name: "teamSize", kind: "select", label: copy.teamSize, placeholder: copy.teamSizePlaceholder, options: copy.teamSizes.map((item) => ({ value: item, label: item })), radius: "rounded" },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={cn("p-4 md:p-4 lg:p-4", className)} contentClassName="max-w-none" {...html}>
      <div ref={reveal} className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row">
        <div className="flex flex-col items-center gap-8 p-12 [@container(min-width:64rem)]:w-[43.25rem] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-0">
          <div data-reveal="rise" data-reveal-delay="100" className="flex w-full flex-col gap-5 [@container(min-width:64rem)]:w-[25rem]">
            <div className="flex flex-col gap-1 text-center">
              <h2 id={headingId} className="text-lg font-medium text-foreground">
                {copy.heading}
              </h2>
              <p className="text-sm text-muted-foreground">{copy.description}</p>
            </div>
            <ContactUsForm form={form} className="flex flex-col gap-5">
              <ContactUsField field={f.name} />
              <ContactUsField field={f.email} />
              <ContactUsField field={f.role} />
              <ContactUsField field={f.company} />
              <ContactUsField field={f.teamSize} />
              <ContactUsSubmit variant="soft" tone="secondary" radius="rounded" size="lg" className="w-full">
                {copy.submit}
              </ContactUsSubmit>
              <p className="text-center text-xs text-muted-foreground">{copy.note}</p>
            </ContactUsForm>
          </div>
          <FaslaLogo title="Fasla" className="h-[2.1875rem] w-auto shrink-0" />
        </div>

        <ContactUsPhotoSlot
          photo={photo}
          photoReveal="settle"
          className="h-[17.5rem] shrink-0 rounded-[14px] [@container(min-width:40rem)]:h-[22.5rem] [@container(min-width:64rem)]:h-auto [@container(min-width:64rem)]:min-w-0 [@container(min-width:64rem)]:flex-1"
        />
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsSplitPhotoDarkCopy = COPY
