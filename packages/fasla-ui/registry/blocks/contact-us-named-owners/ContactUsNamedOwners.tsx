"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { Avatar } from "../../ui/avatar/avatar"
import {
  ContactUsField,
  ContactUsForm,
  ContactUsInverseBand,
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
  type ContactUsOption,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Named Owners.
 *
 * Left (the start side): an owners directory, 664px wide on Desktop, two
 * columns 40px apart: four owner blocks (a muted role label, a 32px initials
 * Avatar, the owner's first name and email) and two text columns, "Find us"
 * and "Talk to us". Right: a dark form card, 520px wide with 32px of padding
 * and 10px corners, on the page's opposite theme (`ContactUsInverseBand`), so
 * its fields are dark with no colour of ours. In Arabic the two swap sides
 * because the page's `dir` flips the row.
 *
 * Tablet: the form card drops below the directory at full width; the owners
 * stay two-up and the form rows stay two-up. Mobile: one column everywhere,
 * the heading steps from 24px to 20px and the submit button spans the card.
 *
 * Real: every owner block is a `mailto:` link. The form validates on the
 * client and calls `onSubmit(values)` with fullName, email, company, enquiry,
 * message and privacy. Email and the privacy checkbox are required (neither
 * shows the word: no field here has a label row). The other fields
 * are optional. On success the card crossfades to a confirmation that names
 * the owner most likely to reply: `enquiryOwners` maps each enquiry type
 * (its `value`) to an owner `id`.
 *
 * Static: the "Find us" and "Talk to us" lines are plain copy. The Select's
 * popup is portalled by the atom, so it is drawn on the page's theme, not the
 * card's.
 *
 * Motion: once, when the block is in view, the directory rises and the form
 * card slides 16px in from its side (fade only with reduced motion). Owner
 * blocks: hover (motion-safe) scales the avatar to 1.06, underlines the email
 * and lifts the block 2px in 120ms; a press settles the block to 0.98. The
 * card's content crossfades (180ms) to the confirmation.
 *
 * Content limits: heading up to 46 characters, owner role label up to 24,
 * first name up to 14, email up to 24, each text column line up to 40.
 */

export interface ContactUsOwner {
  /** What `enquiryOwners` points at. */
  id: string
  /** The muted line above the owner: what they handle. */
  roleLabel: string
  /** The owner's first name, shown, and used in the confirmation. */
  name: string
  email: string
  /** Two letters for the avatar. Defaults to the first two letters of `name`. */
  initials?: string
}

export interface ContactUsNamedOwnersCopy extends ContactUsFormMessages {
  /** The form card's heading, an `h2`. */
  heading: string
  /** The heading once the form is sent. */
  thanksHeading: string
  /** The owners, in reading order. */
  owners: ContactUsOwner[]
  /** "Find us" label. */
  findLabel: string
  /** The address, one line per item. */
  findLines: string[]
  /** "Talk to us" label. */
  talkLabel: string
  /** The phone and hours, one line per item. */
  talkLines: string[]
  fullName: string
  fullNamePlaceholder: string
  email: string
  emailPlaceholder: string
  company: string
  companyPlaceholder: string
  enquiry: string
  enquiryPlaceholder: string
  /** The enquiry types. Each `value` is a key of `enquiryOwners`. */
  enquiryOptions: ContactUsOption[]
  message: string
  messagePlaceholder: string
  privacy: string
  submit: string
  /** The confirmation. `{name}` is replaced with the owner's first name. */
  replyTemplate: string
  /** The confirmation when no owner matches. */
  replyFallback: string
}

const COPY: Record<ContactUsLocale, ContactUsNamedOwnersCopy> = {
  en: {
    ...contactUsFormMessages.en,
    heading: "Or fill in this form and we will reach out",
    thanksHeading: "Thank you",
    owners: [
      { id: "general", roleLabel: "General enquiries", name: "Marj", email: "hello@fasla.com", initials: "MA" },
      { id: "business", roleLabel: "New business", name: "Ben", email: "ben@fasla.com", initials: "BE" },
      { id: "press", roleLabel: "Press and partnerships", name: "Charlotte", email: "charlotte@fasla.com", initials: "CH" },
      { id: "work", roleLabel: "Work with us", name: "Hannah", email: "work@fasla.com", initials: "HA" },
    ],
    findLabel: "Find us",
    findLines: ["The Old Fire Station, Level 12", "Boulevard Plaza, Dubai"],
    talkLabel: "Talk to us",
    talkLines: ["+971 4 512 8800 · 09:00 – 18:00 ·", "Sun to Thu"],
    fullName: "Full name",
    fullNamePlaceholder: "Full name",
    email: "Email",
    emailPlaceholder: "Email",
    company: "Company name",
    companyPlaceholder: "Company name",
    enquiry: "Type of enquiry",
    enquiryPlaceholder: "Type of enquiry",
    enquiryOptions: [
      { value: "general", label: "General enquiries" },
      { value: "business", label: "New business" },
      { value: "press", label: "Press and partnerships" },
      { value: "work", label: "Work with us" },
    ],
    message: "Message (optional)",
    messagePlaceholder: "Message (optional)",
    privacy: "I have read and agree to the privacy policy.",
    submit: "Submit",
    replyTemplate: "{name} will reply to you.",
    replyFallback: "Someone from the team will reply to you.",
    success: "",
  },
  ar: {
    ...contactUsFormMessages.ar,
    heading: "أو املأ هذا النموذج وسنتواصل معك",
    thanksHeading: "شكرًا لك",
    owners: [
      { id: "general", roleLabel: "استفسارات عامة", name: "منى", email: "hello@fasla.com", initials: "من" },
      { id: "business", roleLabel: "أعمال جديدة", name: "بسّام", email: "ben@fasla.com", initials: "بس" },
      { id: "press", roleLabel: "الصحافة والشراكات", name: "لمى", email: "charlotte@fasla.com", initials: "لم" },
      { id: "work", roleLabel: "اعمل معنا", name: "هناء", email: "work@fasla.com", initials: "هن" },
    ],
    findLabel: "موقعنا",
    findLines: ["محطة الإطفاء القديمة، الطابق 12", "بوليفارد بلازا، دبي"],
    talkLabel: "تحدّث إلينا",
    talkLines: ["\u2066+971 4 512 8800\u2069، \u206609:00 – 18:00\u2069،", "الأحد إلى الخميس"],
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "الاسم الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "البريد الإلكتروني",
    company: "اسم الشركة",
    companyPlaceholder: "اسم الشركة",
    enquiry: "نوع الاستفسار",
    enquiryPlaceholder: "نوع الاستفسار",
    enquiryOptions: [
      { value: "general", label: "استفسارات عامة" },
      { value: "business", label: "أعمال جديدة" },
      { value: "press", label: "الصحافة والشراكات" },
      { value: "work", label: "اعمل معنا" },
    ],
    message: "الرسالة (اختياري)",
    messagePlaceholder: "الرسالة (اختياري)",
    privacy: "قرأت سياسة الخصوصية وأوافق عليها.",
    submit: "إرسال",
    replyTemplate: "سيرد عليك {name}.",
    replyFallback: "سيرد عليك أحد أعضاء الفريق.",
    success: "",
  },
}

export interface ContactUsNamedOwnersProps extends ContactUsFormBlockProps, Partial<ContactUsNamedOwnersCopy> {
  /**
   * Which owner answers each enquiry type: the type's `value` to an owner's
   * `id`. The default pairs each type with the owner of the same id.
   */
  enquiryOwners?: Record<string, string>
}

const DEFAULT_ENQUIRY_OWNERS: Record<string, string> = { general: "general", business: "business", press: "press", work: "work" }

/** Fades `ref`'s element in each time `key` changes after the first render: the card's crossfade. */
function useCrossfade<T extends HTMLElement>(key: unknown) {
  const ref = React.useRef<T>(null)
  const first = React.useRef(true)
  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const node = ref.current
    if (node && typeof node.animate === "function") node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" })
  }, [key])
  return ref
}

export function ContactUsNamedOwners({ locale = "en", ...given }: ContactUsNamedOwnersProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, enquiryOwners = DEFAULT_ENQUIRY_OWNERS, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const [sentEnquiry, setSentEnquiry] = React.useState("")

  const f = {
    fullName: { name: "fullName", kind: "text", label: copy.fullName, hideLabel: true, placeholder: copy.fullNamePlaceholder, autoComplete: "name" },
    email: { name: "email", kind: "email", label: copy.email, hideLabel: true, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    company: { name: "company", kind: "text", label: copy.company, hideLabel: true, placeholder: copy.companyPlaceholder, autoComplete: "organization" },
    enquiry: { name: "enquiry", kind: "select", label: copy.enquiry, hideLabel: true, placeholder: copy.enquiryPlaceholder, options: copy.enquiryOptions },
    message: { name: "message", kind: "textarea", label: copy.message, hideLabel: true, placeholder: copy.messagePlaceholder },
    privacy: { name: "privacy", kind: "checkbox", label: copy.privacy, size: "sm", required: true },
  } satisfies Record<string, ContactUsFieldDef>

  const owner = copy.owners.find((item) => item.id === enquiryOwners[sentEnquiry])
  const messages: ContactUsFormMessages = { ...copy, success: owner ? copy.replyTemplate.replace("{name}", owner.name) : copy.replyFallback }
  const form = useContactUsForm({
    fields: Object.values(f),
    messages,
    disabled,
    onSubmit: async (values) => {
      setSentEnquiry(String(values.enquiry ?? ""))
      await onSubmit?.(values)
    },
  })
  const fade = useCrossfade<HTMLDivElement>(form.status === "success")
  const row = "grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2"

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...html}>
      <div ref={reveal} className="flex flex-col gap-16 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center">
        <div data-reveal="rise" className="grid min-w-0 grid-cols-1 gap-10 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:flex-1">
          {copy.owners.map((owner) => {
            const letters = Array.from(owner.initials ?? owner.name).slice(0, 2).join(" ")
            return (
              <a
                key={owner.id}
                href={`mailto:${owner.email}`}
                className="group/owner flex min-w-0 flex-col gap-3 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-safe:transition-transform motion-safe:duration-[120ms] motion-safe:ease-[cubic-bezier(0.2,0,0,1)] hover:motion-safe:-translate-y-0.5 active:motion-safe:scale-[0.98]"
              >
                <span className="text-sm font-medium text-muted-foreground rtl:leading-6">{owner.roleLabel}</span>
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex shrink-0 motion-safe:transition-transform motion-safe:duration-[120ms] motion-safe:ease-[cubic-bezier(0.2,0,0,1)] group-hover/owner:motion-safe:scale-[1.06]"
                  >
                    <Avatar variant="initials" radius="rounded" size="32" name={letters} />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-base font-medium text-foreground rtl:leading-7">{owner.name}</span>
                    <bdi dir="ltr" className="truncate text-start text-sm text-muted-foreground rtl:text-right rtl:leading-6 group-hover/owner:underline">
                      {owner.email}
                    </bdi>
                  </span>
                </span>
              </a>
            )
          })}
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground rtl:leading-6">{copy.findLabel}</p>
            <p className="text-base font-medium text-foreground rtl:leading-7">
              {copy.findLines.map((line, index) => (
                <React.Fragment key={index}>
                  {index > 0 ? <br /> : null}
                  {line}
                </React.Fragment>
              ))}
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground rtl:leading-6">{copy.talkLabel}</p>
            <p className="text-base font-medium text-foreground rtl:leading-7">
              {copy.talkLines.map((line, index) => (
                <React.Fragment key={index}>
                  {index > 0 ? <br /> : null}
                  {line}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        <ContactUsInverseBand data-reveal="slide" data-reveal-from="end" className="flex min-w-0 shrink-0 flex-col gap-5 rounded-[10px] p-8 [@container(min-width:64rem)]:w-[32.5rem]">
          <div ref={fade} className="flex flex-col gap-5">
            <h2 id={headingId} className="text-xl font-semibold text-foreground rtl:leading-9 [@container(min-width:40rem)]:text-2xl [@container(min-width:40rem)]:rtl:leading-10">
              {form.status === "success" ? copy.thanksHeading : copy.heading}
            </h2>
            <ContactUsForm form={form} className="flex flex-col gap-5">
              <div className={row}>
                <ContactUsField field={f.fullName} />
                <ContactUsField field={f.email} />
              </div>
              <div className={row}>
                <ContactUsField field={f.company} />
                <ContactUsField field={f.enquiry} />
              </div>
              <ContactUsField field={f.message} />
              <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center">
                <ContactUsField field={f.privacy} className="[@container(min-width:40rem)]:flex-1" />
                <ContactUsSubmit variant="secondary" size="md" className="w-full [@container(min-width:40rem)]:w-auto">
                  {copy.submit}
                  <ArrowRight aria-hidden className="rtl:-scale-x-100" />
                </ContactUsSubmit>
              </div>
            </ContactUsForm>
          </div>
        </ContactUsInverseBand>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsNamedOwnersCopy = COPY
