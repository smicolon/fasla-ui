"use client"

import * as React from "react"
import { ArrowRight, MapPin, Send } from "lucide-react"
import { buttonVariants } from "../../ui/button/button"
import { SOCIAL_PLATFORM_NAMES, SocialIcon } from "../../ui/social-icons/social-icons"
import {
  CONTACT_US_TEXTAREA_88,
  ContactUsField,
  ContactUsForm,
  ContactUsHeader,
  ContactUsInverseBand,
  ContactUsSection,
  ContactUsSubmit,
  contactUsFormMessages,
  splitCopy,
  useContactUsForm,
  useCountUp,
  useReveal,
  type ContactUsFieldDef,
  type ContactUsFormBlockProps,
  type ContactUsFormMessages,
  type ContactUsLocale,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Bento Grid.
 *
 * A header (the eyebrow CONTACT over the heading), then a bento of five
 * tiles. The message tile is a form on `card` with a `border` stroke: a
 * "Send a message" title, name and email side by side, a message box, a
 * muted note ("No bots. A person replies.") and the Send button. Beside it
 * four side tiles: the response tile, a dark panel with the median first reply
 * ("2 m", counted up in minutes) and what it is based on; the studio tile (a
 * map pin on a `card` square, the name and the address); the social tile (the
 * handle and four marks, Instagram, LinkedIn, X and Dribbble, as links); and
 * the hiring tile (a `card` tile with a green dot, "HIRING NOW", a line and a
 * "See roles" button).
 *
 * Desktop: the message tile (704 wide, level with the top of the side tiles) beside a 520px
 * column of side tiles: the response tile, a row of studio and social
 * tiles, and the hiring tile. The heading is 36px. Tablet: the message tile
 * takes the full row and the side tiles follow under it, studio and social
 * two to a row; the heading is 30px. Mobile: one column in the order message,
 * response, studio, social, hiring; the name and email stack, Send and the
 * hiring button run the full width, and the heading is 24px.
 *
 * Real: the form (`onSubmit(values)` with name, email and message; email is
 * the one required field, shown with the word "Required" by the atom's own
 * label slot, no asterisk), the count-up (`replyMinutes`), the social links
 * (`socialLinks`) and the roles link (`rolesHref`). Static: the studio
 * address, the handle and every other line of copy: pass them as props.
 *
 * Motion: the five tiles rise 12px and fade, 80ms apart, once, when the block
 * is in view. The reply figure counts its minutes up from 0 once, when half
 * of it is in view. The green dot pulses twice, as a ring that grows and
 * fades, then rests; it never loops. A tile lifts 4px with the shadow going
 * from `xs` to `md` on hover, on pointers that hover. Reduced motion: the
 * tiles only fade, the figure and the dot are still.
 *
 * Content limits: the heading up to 40 characters, a tile's title up to 24,
 * the address up to 40, the hiring line up to 48.
 */

export interface ContactUsBentoGridCopy extends ContactUsFormMessages {
  /** The small line above the heading. */
  eyebrow: string
  /** The heading, an `h2`. */
  heading: string
  /** The message tile's title. */
  formTitle: string
  /** The name field's label. */
  name: string
  /** The name field's placeholder. */
  namePlaceholder: string
  /** The email field's label. */
  email: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The message field's label. */
  message: string
  /** The message field's placeholder. */
  messagePlaceholder: string
  /** The muted note beside the button. */
  note: string
  /** The button's label. */
  send: string
  /** The response tile's label. */
  replyLabel: string
  /** The unit after the figure ("m", "د"). */
  replyUnit: string
  /** What the figure is based on. */
  replyDetail: string
  /** The studio tile's name. */
  studioName: string
  /** The studio tile's address. */
  studioAddress: string
  /** The social tile's title. */
  socialTitle: string
  /** The social handle. */
  socialHandle: string
  /** The small caps line on the hiring tile. */
  hiringLabel: string
  /** The hiring tile's line. */
  hiringText: string
  /** The hiring button's label. */
  rolesCta: string
}

/** Figma's copy, English and Arabic. Arabic keeps Western digits. */
const COPY: Record<ContactUsLocale, ContactUsBentoGridCopy> = {
  en: {
    ...contactUsFormMessages.en,
    eyebrow: "CONTACT",
    heading: "Everything you need to reach us",
    formTitle: "Send a message",
    name: "Name",
    namePlaceholder: "Sara",
    email: "Email",
    emailPlaceholder: "sara@company.com",
    message: "Message",
    messagePlaceholder: "What can we help with?",
    note: "No bots. A person replies.",
    send: "Send",
    replyLabel: "MEDIAN FIRST REPLY",
    replyUnit: "m",
    replyDetail: "Across 1,842 conversations in the last 90 days.",
    studioName: "Dubai studio",
    studioAddress: "Level 12, Boulevard Plaza Tower 1",
    socialTitle: "Say hello socially",
    socialHandle: "@fasla.design",
    hiringLabel: "HIRING NOW",
    hiringText: "Four open roles in design and engineering",
    rolesCta: "See roles",
  },
  ar: {
    ...contactUsFormMessages.ar,
    eyebrow: "تواصل",
    heading: "كل ما تحتاجه للوصول إلينا",
    formTitle: "أرسل رسالة",
    name: "الاسم",
    namePlaceholder: "سارة",
    email: "البريد الإلكتروني",
    emailPlaceholder: "sara@company.com",
    message: "الرسالة",
    messagePlaceholder: "بماذا يمكننا المساعدة؟",
    note: "لا روبوتات. شخص حقيقي يردّ.",
    send: "إرسال",
    replyLabel: "متوسط أول ردّ",
    replyUnit: "د",
    replyDetail: "عبر 1,842 محادثة خلال آخر 90 يومًا.",
    studioName: "استوديو دبي",
    studioAddress: "الطابق 12، برج بوليفارد بلازا 1",
    socialTitle: "سلّم علينا عبر الشبكات",
    socialHandle: "@fasla.design",
    hiringLabel: "نوظّف الآن",
    hiringText: "أربع وظائف شاغرة في التصميم والهندسة",
    rolesCta: "اعرض الوظائف",
  },
}

export type ContactUsBentoSocial = "instagram" | "linkedin" | "x" | "dribbble"

export interface ContactUsBentoGridProps extends ContactUsFormBlockProps, Partial<ContactUsBentoGridCopy> {
  /** Where each of the four marks goes. A mark without an address links to "#". */
  socialLinks?: Partial<Record<ContactUsBentoSocial, string>>
  /** Where the "See roles" button goes. */
  rolesHref?: string
  /** The median first reply the figure counts up to, in minutes. */
  replyMinutes?: number
}

const SOCIAL: ContactUsBentoSocial[] = ["instagram", "linkedin", "x", "dribbble"]


/** The lift every tile takes on a pointer that hovers. */
const LIFT =
  "transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:motion-safe:-translate-y-1 hover:motion-safe:shadow-md"
const CARD_TILE = `rounded-[10px] border border-border bg-card shadow-sm ${LIFT}`
const MUTED_TILE = `rounded-[10px] bg-muted ${LIFT}`

const TITLE = "text-base font-semibold leading-6 rtl:leading-7 text-foreground"
const TEXT_SM = "text-sm leading-5 rtl:leading-6 text-muted-foreground"
const FOCUS = "rounded-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

export function ContactUsBentoGrid({ locale = "en", ...given }: ContactUsBentoGridProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubmit, disabled, socialLinks, rolesHref = "#", replyMinutes = 2, className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const [figureRef, minutes] = useCountUp<HTMLParagraphElement>(replyMinutes)

  const f = {
    name: { name: "name", kind: "text", label: copy.name, placeholder: copy.namePlaceholder, autoComplete: "name" },
    email: { name: "email", kind: "email", label: copy.email, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    message: { name: "message", kind: "textarea", label: copy.message, placeholder: copy.messagePlaceholder, groupClassName: CONTACT_US_TEXTAREA_88 },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit, disabled })

  return (
    <ContactUsSection labelledBy={headingId} className={className} {...html}>
      <ContactUsHeader
        headingId={headingId}
        eyebrow={copy.eyebrow}
        eyebrowClassName="text-sm font-semibold leading-5 rtl:leading-6 text-primary"
        heading={copy.heading}
        headingClassName={`text-2xl font-semibold leading-8 rtl:leading-10 [@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem] [@container(min-width:64rem)]:text-4xl`}
      />

      <div ref={reveal} className={`flex flex-col gap-6 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start`}>
        <ContactUsForm
          form={form}
          data-reveal="rise"
          data-reveal-delay={0}
          className={`flex min-w-0 flex-col gap-5 p-8 [@container(min-width:64rem)]:flex-1 ${CARD_TILE}`}
        >
          <h3 className="text-xl font-semibold leading-7 rtl:leading-9 text-foreground">{copy.formTitle}</h3>
          <div className={`grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2`}>
            <ContactUsField field={f.name} />
            <ContactUsField field={f.email} />
          </div>
          <ContactUsField field={f.message} />
          <div className={`flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-3`}>
            <p className={`text-xs leading-4 rtl:leading-5 text-muted-foreground [@container(min-width:40rem)]:flex-1`}>{copy.note}</p>
            <ContactUsSubmit className="w-full [@container(min-width:40rem)]:w-auto">
              {copy.send}
              <Send aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
            </ContactUsSubmit>
          </div>
        </ContactUsForm>

        <div className={`flex flex-col gap-6 [@container(min-width:64rem)]:w-[32.5rem] [@container(min-width:64rem)]:shrink-0`}>
          <ContactUsInverseBand data-reveal="rise" data-reveal-delay={80} className={`flex flex-col gap-3 p-6 ${LIFT} rounded-[10px]`}>
            <p className="text-xs font-semibold leading-4 rtl:leading-5 text-muted-foreground">{copy.replyLabel}</p>
            <p
              ref={figureRef}
              className={`text-3xl font-semibold leading-10 rtl:leading-[3.125rem] text-foreground [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem] [@container(min-width:64rem)]:text-5xl [@container(min-width:64rem)]:leading-[3.625rem] [@container(min-width:64rem)]:rtl:leading-[4.5rem]`}
            >
              <span aria-hidden>
                {minutes} {copy.replyUnit}
              </span>
              <span className="sr-only">
                {replyMinutes} {copy.replyUnit}
              </span>
            </p>
            <p className="text-sm leading-5 rtl:leading-6 text-muted-foreground">{copy.replyDetail}</p>
          </ContactUsInverseBand>

          <div className={`grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2`}>
            <div data-reveal="rise" data-reveal-delay={160} className={`flex flex-col gap-3 p-6 ${MUTED_TILE}`}>
              <span className="flex size-10 items-center justify-center rounded-lg bg-card">
                <MapPin aria-hidden size={20} strokeWidth={1.5} className="text-foreground" />
              </span>
              <h3 className={TITLE}>{copy.studioName}</h3>
              <p className={TEXT_SM}>{copy.studioAddress}</p>
            </div>
            <div data-reveal="rise" data-reveal-delay={240} className={`flex flex-col gap-3 p-6 ${MUTED_TILE}`}>
              <h3 className={TITLE}>{copy.socialTitle}</h3>
              <p className={TEXT_SM}>
                <bdi dir="ltr">{copy.socialHandle}</bdi>
              </p>
              <ul className="flex items-center gap-3">
                {SOCIAL.map((platform) => (
                  <li key={platform} className="flex">
                    <a href={socialLinks?.[platform] ?? "#"} aria-label={SOCIAL_PLATFORM_NAMES[platform]} className={`inline-flex ${FOCUS}`}>
                      <SocialIcon platform={platform} color="negative" className="size-6" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            data-reveal="rise"
            data-reveal-delay={320}
            className={`flex flex-col gap-4 p-6 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between ${CARD_TILE}`}
          >
            <div className="flex min-w-0 flex-col gap-1">
              <p className="flex items-center gap-2 text-xs font-semibold leading-4 rtl:leading-5 text-muted-foreground">
                <span aria-hidden className="relative flex size-2 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-success motion-safe:animate-[ping_1200ms_cubic-bezier(0,0,0.2,1)_2_both]" />
                  <span className="relative size-2 rounded-full bg-success" />
                </span>
                {copy.hiringLabel}
              </p>
              <p className="text-base font-medium leading-6 rtl:leading-7 text-foreground">{copy.hiringText}</p>
            </div>
            <a href={rolesHref} className={buttonVariants({ variant: "outline", size: "sm", className: "w-full shrink-0 [@container(min-width:40rem)]:w-auto" })}>
              {copy.rolesCta}
              <ArrowRight aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
            </a>
          </div>
        </div>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsBentoGridCopy = COPY
