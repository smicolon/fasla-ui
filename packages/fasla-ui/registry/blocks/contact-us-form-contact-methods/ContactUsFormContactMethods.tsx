"use client"

import * as React from "react"
import { Clock, Mail, Phone } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
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
 * Figma: `Contact Us` (42334:293941), Type=Form + Contact Methods.
 *
 * A header (a "Plan a visit" badge over the heading, a line of intro at the
 * end of the row), then a form card beside a photo, then three contact
 * methods: call, working hours and write. The form card is `muted`, 32px of
 * padding, with fields two to a row: name and email, phone and the kind of
 * meeting, preferred date and team size, then a message and the Reserve
 * your spot button. The photo carries a "Your
 * visit" soft badge (Badge, Soft, Secondary) in its top end corner.
 *
 * Desktop sets the card beside a 440px photo. Tablet drops the photo under
 * the card as a 320px band and keeps the two-up rows and the three methods in
 * one row. Mobile makes every row one field, the band 240px and stacks the
 * methods. The heading is 60px on Desktop and Tablet and 24px on Mobile.
 *
 * The form is real. It calls `onSubmit(values)` with fullName, email, phone,
 * meetingType, date, teamSize and message. The email is the one required
 * field and shows the word "Required" on its label row, with no asterisk.
 * The date is the Date Picker atom: a click or tap on the field, or Enter or Space
 * on it, opens a calendar; Escape closes it. The chosen day shows in the page's
 * language and `onSubmit` gets it as `yyyy-mm-dd`.
 *
 * Motion: the three methods rise 12px and fade, 80ms apart, once, when the
 * row is in view. The form and the photo never move. The primary button lifts 2px
 * on hover (about 120ms). Reduced motion: the methods only fade.
 *
 * Content limits: the heading up to 24 characters, the intro up to 120, a
 * method's title up to 24 and each of its two lines up to 32.
 */

export interface ContactUsFormContactMethodsCopy extends ContactUsFormMessages {
  /** The badge over the heading. */
  badge: string
  /** The heading, an `h2`. */
  heading: string
  /** The line at the end of the header. */
  intro: string
  /** The name field's label. */
  fullName: string
  /** The name field's placeholder. */
  fullNamePlaceholder: string
  /** The email field's label. */
  email: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The phone field's label. */
  phone: string
  /** The phone field's placeholder. */
  phonePlaceholder: string
  /** The meeting type select's label. */
  meetingType: string
  /** The meeting type select's placeholder. */
  meetingTypePlaceholder: string
  /** The kinds of meeting to choose from. */
  meetingTypes: string[]
  /** The date field's label. */
  date: string
  /** The date field's placeholder. */
  datePlaceholder: string
  /** The team size field's label. */
  teamSize: string
  /** The team size field's placeholder. */
  teamSizePlaceholder: string
  /** The message field's label. */
  message: string
  /** The message field's placeholder. */
  messagePlaceholder: string
  /** The button's label. */
  submit: string
  /** The badge on the photo. */
  photoBadge: string
  /** The call method's title. */
  callTitle: string
  /** The working hours method's title. */
  hoursTitle: string
  /** The two lines under the working hours title. */
  hours: string[]
  /** The write method's title. */
  writeTitle: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsFormContactMethodsCopy> = {
  en: {
    ...contactUsFormMessages.en,
    badge: "Plan a visit",
    heading: "Contact us",
    intro: "Tell us when and where you would like to meet and we will confirm availability within 24 hours.",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    phone: "Phone number",
    phonePlaceholder: "+971 50 123 4567",
    meetingType: "Meeting type",
    meetingTypePlaceholder: "Choose a topic",
    meetingTypes: ["Studio visit", "Video call", "Phone call"],
    date: "Preferred date",
    datePlaceholder: "dd/mm/yyyy",
    teamSize: "Team size",
    teamSizePlaceholder: "e.g. 12 people",
    message: "Message / Special requests",
    messagePlaceholder: "Anything else we should know?",
    submit: "Reserve your spot",
    photoBadge: "Your visit",
    callTitle: "Call & WhatsApp",
    hoursTitle: "Working hours",
    hours: ["Daily: 8am – 5pm", "Friday: Closed"],
    writeTitle: "Write to us",
  },
  ar: {
    ...contactUsFormMessages.ar,
    badge: "خطّط لزيارتك",
    heading: "تواصل معنا",
    intro: "أخبرنا بموعد ومكان اللقاء الذي يناسبك، وسنؤكد التوفّر خلال 24 ساعة.",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    phone: "رقم الهاتف",
    phonePlaceholder: "+971 50 123 4567",
    meetingType: "نوع الاجتماع",
    meetingTypePlaceholder: "اختر موضوعًا",
    meetingTypes: ["زيارة الاستوديو", "مكالمة فيديو", "مكالمة هاتفية"],
    date: "التاريخ المفضّل",
    datePlaceholder: "يوم/شهر/سنة",
    teamSize: "حجم الفريق",
    teamSizePlaceholder: "مثال: 12 شخصًا",
    message: "الرسالة / طلبات خاصة",
    messagePlaceholder: "هل هناك ما تودّ إخبارنا به؟",
    submit: "احجز مكانك",
    photoBadge: "زيارتك",
    callTitle: "اتصال وواتساب",
    hoursTitle: "ساعات العمل",
    hours: ["يوميًا: من 8 ص إلى 5 م", "الجمعة: مغلق"],
    writeTitle: "راسلنا",
  },
}

export interface ContactUsFormContactMethodsProps extends ContactUsFormBlockProps, Partial<ContactUsFormContactMethodsCopy> {
  /** The photo beside (or under) the form card. A `muted` ground shows without one. */
  photo?: ContactUsPhoto
  /** The two numbers in the call method. */
  phoneNumbers?: [string, string]
  /** The two addresses in the write method. */
  emailAddresses?: [string, string]
}

const METHOD_LINK = "rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
const LIFT = "hover:motion-safe:-translate-y-0.5 motion-safe:transition-transform motion-safe:duration-[120ms]"

export function ContactUsFormContactMethods({ locale = "en", ...given }: ContactUsFormContactMethodsProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, photo, phoneNumbers = ["+971 4 512 8800", "+971 50 123 4567"], emailAddresses = ["hello@fasla.com", "support@fasla.com"], className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()

  const f = {
    fullName: { name: "fullName", kind: "text", label: copy.fullName, placeholder: copy.fullNamePlaceholder, autoComplete: "name" },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    phone: { name: "phone", kind: "tel", label: copy.phone, placeholder: copy.phonePlaceholder, autoComplete: "tel" },
    meetingType: { name: "meetingType", kind: "select", label: copy.meetingType, placeholder: copy.meetingTypePlaceholder, options: copy.meetingTypes.map((item) => ({ value: item, label: item })) },
    date: { name: "date", kind: "date", label: copy.date, placeholder: copy.datePlaceholder },
    teamSize: { name: "teamSize", kind: "text", label: copy.teamSize, placeholder: copy.teamSizePlaceholder },
    message: { name: "message", kind: "textarea", label: copy.message, placeholder: copy.messagePlaceholder, groupClassName: CONTACT_US_TEXTAREA_88 },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  const methods = [
    { icon: Phone, title: copy.callTitle, lines: phoneNumbers.map((text) => ({ text, href: `tel:${text.replace(/\s+/g, "")}`, latin: true })) },
    { icon: Clock, title: copy.hoursTitle, lines: copy.hours.map((text) => ({ text, href: undefined, latin: false })) },
    { icon: Mail, title: copy.writeTitle, lines: emailAddresses.map((text) => ({ text, href: `mailto:${text}`, latin: true })) },
  ]
  const rowClass = "grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2"

  return (
    <ContactUsSection labelledBy={headingId} className={className} {...html}>
      <header className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-end [@container(min-width:40rem)]:justify-between">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="soft" tone="secondary" radius="rounded" size="md">
            {copy.badge}
          </Badge>
          <h2 id={headingId} className="text-2xl font-semibold leading-[2.75rem] rtl:leading-[3.75rem] text-foreground [@container(min-width:40rem)]:text-6xl">
            {copy.heading}
          </h2>
        </div>
        <p className="text-base text-muted-foreground [@container(min-width:40rem)]:w-[21.25rem] [@container(min-width:40rem)]:shrink-0 [@container(min-width:40rem)]:text-end">{copy.intro}</p>
      </header>

      <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row">
        <ContactUsForm form={form} className="flex min-w-0 flex-1 flex-col gap-5 rounded-[14px] bg-muted p-8">
          <div className={rowClass}>
            <ContactUsField field={f.fullName} />
            <ContactUsField field={f.email} />
          </div>
          <div className={rowClass}>
            <ContactUsField field={f.phone} />
            <ContactUsField field={f.meetingType} />
          </div>
          <div className={rowClass}>
            <ContactUsField field={f.date} />
            <ContactUsField field={f.teamSize} />
          </div>
          <ContactUsField field={f.message} />
          <div className="flex items-center">
            <ContactUsSubmit size="lg" radius="rounded" className={LIFT}>
              <span>{copy.submit}</span>
            </ContactUsSubmit>
          </div>
        </ContactUsForm>

        <ContactUsPhotoSlot photo={photo} className="h-60 shrink-0 rounded-[14px] [@container(min-width:40rem)]:h-80 [@container(min-width:64rem)]:h-auto [@container(min-width:64rem)]:w-[27.5rem]">
          <Badge variant="soft" tone="secondary" radius="rounded" size="md" className="absolute end-4 top-4">
            {copy.photoBadge}
          </Badge>
        </ContactUsPhotoSlot>
      </div>

      <div ref={reveal} className="grid grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-3">
        {methods.map(({ icon: Icon, title, lines }, index) => (
          <div key={title} data-reveal="rise" data-reveal-delay={index * 80} className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-soft-warning text-foreground">
              <Icon aria-hidden size={24} strokeWidth={1.5} />
            </span>
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            <div className="flex flex-col gap-3 text-base text-muted-foreground">
              {lines.map(({ text, href, latin }) =>
                href ? (
                  <a key={text} href={href} className={METHOD_LINK}>
                    <bdi dir={latin ? "ltr" : undefined}>{text}</bdi>
                  </a>
                ) : (
                  <p key={text}>{text}</p>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsFormContactMethodsCopy = COPY
