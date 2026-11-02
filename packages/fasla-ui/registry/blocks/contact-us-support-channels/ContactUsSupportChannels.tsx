"use client"

import * as React from "react"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"
import {
  ContactUsHeader,
  ContactUsSection,
  prefersReducedMotion,
  splitCopy,
  useReveal,
  type ContactUsLocale,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Support Channels.
 *
 * A warning-tinted section (`soft-warning-5`), a centred heading in regular
 * weight, and a 760px column of three cards, 16px apart. The chat card is
 * framed in `chart-1` (2px) on the same tint: a title and a line, then two
 * options side by side with a 1px `chart-1` divider between them: "Already a
 * customer?" with a "Get customer support" button and "Not a customer yet?"
 * with "Start live chat". Both buttons are the Button atom, Outline Primary,
 * Rounded, as the instance is drawn. The "FASTEST RESPONSE TIME" Badge (Solid
 * Primary, md) sits centred on the card's top border. Under it, "Send an
 * email" and "Leave a voicemail" are `soft-warning` cards with a
 * `soft-warning-30` stroke: a title, a line and a muted note. The email and
 * the phone number are links (`mailto:`, `tel:`), set left to right in both
 * languages.
 *
 * Desktop: cards 32px inside, the options side by side, headings 48px and
 * card titles 30px. Tablet: the heading is 30px. Mobile: cards are 24px
 * inside, the options stack with a horizontal divider between them, the
 * heading is 30px and the card titles 24px. In Arabic the options keep their
 * order in the markup, so the existing-customer option leads at the start
 * side (the right).
 *
 * Real: the links and buttons (`customerSupportHref`, `chatHref`, or
 * `onStartChat` for a chat widget), `email` and `phone`. There is no form,
 * so no required field. The cards as a whole are not clickable.
 *
 * Motion: the three cards rise 12px and fade, 80ms apart, once, when the
 * block is in view; the badge then scales from 0.9 to 1 and fades in, once
 * (a Web Animations transition, 260ms, after the cards). Reduced motion: only
 * fades.
 *
 * Content limits: the heading up to 28 characters, a card title up to 24, an
 * option's text up to 110, a card's line up to 70.
 */

export interface ContactUsSupportChannelsCopy {
  /** The heading, an `h2`. */
  heading: string
  /** The chat card's title. */
  chatTitle: string
  /** The chat card's line. */
  chatText: string
  /** The badge on the chat card's top border. */
  badge: string
  /** The first option's title. */
  customerTitle: string
  /** The first option's text. */
  customerText: string
  /** The first option's button. */
  customerCta: string
  /** The second option's title. */
  prospectTitle: string
  /** The second option's text. */
  prospectText: string
  /** The second option's button. */
  prospectCta: string
  /** The email card's title. */
  emailTitle: string
  /** The email card's line. */
  emailText: string
  /** The words before the address in the email card's note. */
  emailNote: string
  /** The voicemail card's title. */
  voicemailTitle: string
  /** The words before the number in the voicemail card's line. */
  voicemailBefore: string
  /** The words after the number in the voicemail card's line. */
  voicemailAfter: string
  /** The voicemail card's note. */
  voicemailNote: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<ContactUsLocale, ContactUsSupportChannelsCopy> = {
  en: {
    heading: "We are here to help",
    chatTitle: "Chat with us",
    chatText: "The best option for quick questions, plan details, or support.",
    badge: "FASTEST RESPONSE TIME",
    customerTitle: "Already a customer?",
    customerText: "Log in to your account and open Support from the menu for the most personal and secure help.",
    customerCta: "Get customer support",
    prospectTitle: "Not a customer yet?",
    prospectText: "Use our live chat to get quick answers to all your questions. No account needed.",
    prospectCta: "Start live chat",
    emailTitle: "Send an email",
    emailText: "The best option for documents, formal requests, or follow-ups.",
    emailNote: "General inquiries:",
    voicemailTitle: "Leave a voicemail",
    voicemailBefore: "Call us at",
    voicemailAfter: "if you prefer a callback from our team.",
    voicemailNote: "Note: for the fastest response, please use chat or email.",
  },
  ar: {
    heading: "نحن هنا لمساعدتك",
    chatTitle: "تحدّث معنا",
    chatText: "الخيار الأفضل للأسئلة السريعة أو تفاصيل الخطة أو الدعم.",
    badge: "أسرع وقت للرد",
    customerTitle: "هل أنت عميل بالفعل؟",
    customerText: "سجّل الدخول إلى حسابك وافتح الدعم من القائمة للحصول على مساعدة شخصية وآمنة.",
    customerCta: "احصل على دعم العملاء",
    prospectTitle: "لست عميلًا بعد؟",
    prospectText: "استخدم الدردشة المباشرة للحصول على إجابات سريعة عن كل أسئلتك. لا حاجة إلى حساب.",
    prospectCta: "ابدأ الدردشة المباشرة",
    emailTitle: "أرسل بريدًا إلكترونيًا",
    emailText: "الخيار الأفضل للمستندات والطلبات الرسمية والمتابعات.",
    emailNote: "الاستفسارات العامة:",
    voicemailTitle: "اترك رسالة صوتية",
    voicemailBefore: "اتصل بنا على",
    voicemailAfter: "إن فضّلت أن يتصل بك فريقنا.",
    voicemailNote: "ملاحظة: للحصول على أسرع رد، يُرجى استخدام الدردشة أو البريد الإلكتروني.",
  },
}

export interface ContactUsSupportChannelsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<ContactUsSupportChannelsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /** Where "Get customer support" goes. */
  customerSupportHref?: string
  /** Where "Start live chat" goes. Without it, and with `onStartChat`, the button is a button. */
  chatHref?: string
  /** Opens a chat widget: makes "Start live chat" a button, when `chatHref` is not given. */
  onStartChat?: () => void
  /** The address in the email card's note. */
  email?: string
  /** The number in the voicemail card's line, as it is dialled. */
  phone?: string
}

const STANDARD = "cubic-bezier(0.2, 0, 0, 1)"

const CARD_TITLE = `text-2xl font-normal leading-8 rtl:leading-10 text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-10 [@container(min-width:40rem)]:rtl:leading-[3.125rem]`
const CARD_TEXT = "text-base leading-6 rtl:leading-7 text-foreground"
const CARD_NOTE = "text-sm leading-5 rtl:leading-6 text-muted-foreground"
const OPTION_TITLE = "text-base font-semibold leading-6 rtl:leading-7 text-foreground"
const LINK = "rounded-sm underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

/** The badge scales 0.9 to 1 and fades in once, after the cards have risen. */
function useBadgePop() {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined" || typeof node.animate !== "function") return
    let animation: Animation | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const reduced = prefersReducedMotion()
        animation = node.animate(reduced ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: "scale(0.9)" }, { opacity: 1, transform: "none" }], {
          duration: reduced ? 120 : 260,
          delay: reduced ? 0 : 240,
          easing: STANDARD,
          fill: "backwards",
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animation?.cancel()
    }
  }, [])
  return ref
}

export function ContactUsSupportChannels({ locale = "en", ...given }: ContactUsSupportChannelsProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { customerSupportHref = "/support", chatHref, onStartChat, email = "hello@fasla.com", phone = "+971 4 512 8800", className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const badge = useBadgePop()
  // Figma sets the heading's last word in chart-1.
  const cut = copy.heading.lastIndexOf(" ") + 1
  const [head, tail] = [copy.heading.slice(0, cut), copy.heading.slice(cut)]

  return (
    <ContactUsSection labelledBy={headingId} className={`bg-soft-warning-5 ${className ?? ""}`} {...html}>
      <ContactUsHeader
        headingId={headingId}
        heading={<>{head}<span className="text-chart-1">{tail}</span></>}
        align="center"
        headingClassName={`text-3xl font-normal leading-10 rtl:leading-[3.125rem] [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem] [@container(min-width:64rem)]:text-5xl [@container(min-width:64rem)]:leading-[3.625rem] [@container(min-width:64rem)]:rtl:leading-[4.5rem]`}
      />

      <div ref={reveal} className="mx-auto flex w-full max-w-[47.5rem] flex-col gap-4">
        <div data-reveal="rise" data-reveal-delay={0} className={`relative flex flex-col gap-4 rounded-[14px] border-2 border-chart-1 bg-soft-warning-5 p-6 [@container(min-width:40rem)]:p-8`}>
          <span ref={badge} className="absolute start-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2">
            <Badge variant="solid" tone="primary" size="md" radius="standard" className="whitespace-nowrap">
              {copy.badge}
            </Badge>
          </span>
          <h3 className={CARD_TITLE}>{copy.chatTitle}</h3>
          <p className={CARD_TEXT}>{copy.chatText}</p>
          <div className={`flex flex-col gap-8 [@container(min-width:40rem)]:flex-row`}>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
              <h4 className={OPTION_TITLE}>{copy.customerTitle}</h4>
              <p className={CARD_NOTE}>{copy.customerText}</p>
              <a href={customerSupportHref} className={buttonVariants({ variant: "outline", tone: "primary", size: "md", radius: "rounded" })}>
                {copy.customerCta}
              </a>
            </div>
            <div aria-hidden className={`h-px w-full shrink-0 bg-chart-1 [@container(min-width:40rem)]:h-auto [@container(min-width:40rem)]:w-px`} />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
              <h4 className={OPTION_TITLE}>{copy.prospectTitle}</h4>
              <p className={CARD_NOTE}>{copy.prospectText}</p>
              {chatHref === undefined && onStartChat ? (
                <Button type="button" variant="outline" tone="primary" size="md" radius="rounded" onClick={onStartChat}>
                  {copy.prospectCta}
                </Button>
              ) : (
                <a href={chatHref ?? "#chat"} className={buttonVariants({ variant: "outline", tone: "primary", size: "md", radius: "rounded" })}>
                  {copy.prospectCta}
                </a>
              )}
            </div>
          </div>
        </div>

        <div data-reveal="rise" data-reveal-delay={80} className="flex flex-col gap-3 rounded-[14px] border border-soft-warning-30 bg-soft-warning p-6 [@container(min-width:40rem)]:p-8">
          <h3 className={CARD_TITLE}>{copy.emailTitle}</h3>
          <p className={CARD_TEXT}>{copy.emailText}</p>
          <p className={CARD_NOTE}>
            {copy.emailNote}{" "}
            <a href={`mailto:${email}`} className={LINK}>
              <bdi dir="ltr">{email}</bdi>
            </a>
          </p>
        </div>

        <div data-reveal="rise" data-reveal-delay={160} className="flex flex-col gap-3 rounded-[14px] border border-soft-warning-30 bg-soft-warning p-6 [@container(min-width:40rem)]:p-8">
          <h3 className={CARD_TITLE}>{copy.voicemailTitle}</h3>
          <p className={CARD_TEXT}>
            {copy.voicemailBefore}{" "}
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className={LINK}>
              <bdi dir="ltr">{phone}</bdi>
            </a>{" "}
            {copy.voicemailAfter}
          </p>
          <p className={CARD_NOTE}>{copy.voicemailNote}</p>
        </div>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsSupportChannelsCopy = COPY
