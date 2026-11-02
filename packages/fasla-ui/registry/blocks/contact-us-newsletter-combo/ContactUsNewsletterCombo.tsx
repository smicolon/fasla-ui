"use client"

import * as React from "react"
import { Check, Megaphone, MessageSquare, Send } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import {
  ContactUsField,
  ContactUsForm,
  ContactUsInverseBand,
  ContactUsSection,
  ContactUsSubmit,
  contactUsFormMessages,
  prefersReducedMotion,
  splitCopy,
  useContactUsForm,
  type ContactUsFieldDef,
  type ContactUsFormMessages,
  type ContactUsLocale,
  type ContactUsValues,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Newsletter Combo.
 *
 * Two panels in a 1248px column on the page's own ground, 10px corners and 40px
 * of padding, 24px between them (and between a panel's parts). Newsletter is
 * the page's opposite (a dark band on a light page, `background-inverse` in
 * Figma): a 32px tile with the megaphone, the title, a line, the subscribe row
 * (an Input with no label and a Subscribe Button, Solid Secondary) and a proof
 * line with an initials Avatar. Contact is `card` with a 1px `border`: a 32px
 * `muted` tile with the message icon, the title, a line, two label-less fields
 * (name, email) side by side, a label-less Textarea, and "Replies within one
 * business day" beside a Send message Button (Solid Primary).
 *
 * Sizes. Desktop (1024px of content and up): the panels sit side by side,
 * 611 + 613 wide, the subscribe row and the name/email pair are rows, the send
 * row is one line. Tablet (640px): the panels are still side by side, narrower
 * (347 + 349, Figma's Tablet frame), the subscribe row, the pair and the send
 * row stack, the buttons full width. Mobile: the panels stack, newsletter
 * first. Titles are 30px / 40 (Arabic 50) from Tablet and 20px / 28 (Arabic
 * 36) on Mobile; lines are 16px / 24 (Arabic 28).
 *
 * Two real forms, apart. Subscribing calls `onSubscribe(values)` with `email`,
 * which is required; messaging calls `onSubmit(values)` with `name`, `email`
 * (required) and `message`. No field has a visible label, so none shows the
 * word "Required"; the emails are still required in behaviour.
 * The Subscribe, like the Send, shows a pending state, an error line, and
 * refuses an invalid address. Resolve to succeed, reject (or throw) to fail.
 * Static: the proof line and its initials.
 *
 * Motion: an invalid email shakes the field 4px twice (120ms in all) and its
 * error line slides in 4px. A successful subscribe swaps the row, at its
 * measured height so nothing jumps, for a pill with a check scaling in from
 * 0.6 and "You are in", and 2s later for a quieter confirmation line. Each
 * panel rises 4px on hover, with its shadow stepping up one level (a pointer
 * only). Reduced motion: no shake, no raise, no slide, and the success swaps
 * at once.
 *
 * Content limits: a title up to 28 characters, a line up to 110, the proof
 * line up to 48.
 */

export interface ContactUsNewsletterComboCopy extends ContactUsFormMessages {
  /** The newsletter panel's title, an `h2`. */
  subscribeTitle: string
  /** The newsletter panel's line. */
  subscribeText: string
  /** Names the subscribe field for assistive technology (it has no visible label). */
  subscribeEmailLabel: string
  /** The subscribe field's placeholder. */
  subscribeEmailPlaceholder: string
  /** The subscribe button's label. */
  subscribe: string
  /** Shown on the subscribe button while it sends. */
  subscribing: string
  /** Said in the pill once subscribed. */
  subscribed: string
  /** The quieter line the pill settles into. */
  subscribedNote: string
  /** Said when subscribing failed. */
  subscribeError: string
  /** The proof avatar's name, which gives its initials. */
  proofName: string
  /** The proof line. */
  proof: string
  /** The contact panel's title, an `h2`. */
  contactTitle: string
  /** The contact panel's line. */
  contactText: string
  /** The name field's placeholder, and its accessible name. */
  namePlaceholder: string
  /** The email field's placeholder, and its accessible name. */
  emailPlaceholder: string
  /** The message field's placeholder, and its accessible name. */
  messagePlaceholder: string
  /** The line beside the send button. */
  reply: string
  /** The send button's label. */
  send: string
}

/** Figma's copy, English and Arabic. Western digits in both. */
const COPY: Record<ContactUsLocale, ContactUsNewsletterComboCopy> = {
  en: {
    ...contactUsFormMessages.en,
    subscribeTitle: "The Fasla dispatch",
    subscribeText: "One email a month: new blocks, tokens we changed, and the reasoning behind them. No product news, no sales.",
    subscribeEmailLabel: "Email for the dispatch",
    subscribeEmailPlaceholder: "you@company.com",
    subscribe: "Subscribe",
    subscribing: "Subscribing",
    subscribed: "You are in",
    subscribedNote: "Watch your inbox for the next issue.",
    subscribeError: "We could not subscribe you. Please try again.",
    proofName: "Amal Rahman",
    proof: "Joined by 4,200 designers and engineers",
    contactTitle: "Something on your mind?",
    contactText: "Questions, feedback or a project you would like to talk through — this reaches the whole studio.",
    namePlaceholder: "Your name",
    emailPlaceholder: "Email address",
    messagePlaceholder: "Write your message",
    reply: "Replies within one business day",
    send: "Send message",
  },
  ar: {
    ...contactUsFormMessages.ar,
    subscribeTitle: "نشرة فاصلة",
    subscribeText: "بريد واحد شهريًا: كتل جديدة، ورموز غيّرناها، والسبب وراءها. لا أخبار منتجات ولا مبيعات.",
    subscribeEmailLabel: "البريد الإلكتروني للنشرة",
    subscribeEmailPlaceholder: "you@company.com",
    subscribe: "اشترك",
    subscribing: "جارٍ الاشتراك",
    subscribed: "أنت معنا",
    subscribedNote: "ترقّب العدد القادم في بريدك.",
    subscribeError: "تعذّر الاشتراك. حاول مرة أخرى.",
    proofName: "دينا أحمد",
    proof: "انضم إليها 4,200 مصمم ومهندس",
    contactTitle: "لديك ما تودّ قوله؟",
    contactText: "أسئلة أو ملاحظات أو مشروع تودّ مناقشته. تصل هذه الرسالة إلى الاستوديو بأكمله.",
    namePlaceholder: "اسمك",
    emailPlaceholder: "البريد الإلكتروني",
    messagePlaceholder: "اكتب رسالتك",
    reply: "الردّ خلال يوم عمل واحد",
    send: "أرسل الرسالة",
  },
}

export interface ContactUsNewsletterComboProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">, Partial<ContactUsNewsletterComboCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /**
   * Called with `{ email }` when the reader subscribes. Resolve to show the
   * success pill; reject, or throw, to show the error. The block sends nothing.
   */
  onSubscribe?: (values: ContactUsValues) => void | Promise<void>
  /**
   * Called with `{ name, email, message }` when the reader sends a message.
   * Resolve to show the thank-you; reject, or throw, to show the send error.
   */
  onSubmit?: (values: ContactUsValues) => void | Promise<void>
}

const EASE = "ease-[cubic-bezier(0.2,0,0,1)]"
const SETTLE_MS = 2000

/** Plays `frames` on the node once, on mount, unless the reader asked for less motion. */
function useEntrance<T extends HTMLElement>(frames: Keyframe[], duration: number) {
  const ref = React.useRef<T>(null)
  React.useEffect(() => {
    const node = ref.current
    if (!node || typeof node.animate !== "function" || prefersReducedMotion()) return
    const animation = node.animate(frames, { duration, easing: "cubic-bezier(0.2, 0, 0, 1)" })
    return () => animation.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}

/** The pill: a check scaling in from 0.6 and the line "You are in". */
function SubscribedPill({ children }: { children: React.ReactNode }) {
  const pill = useEntrance<HTMLDivElement>([{ opacity: 0 }, { opacity: 1 }], 120)
  const check = useEntrance<HTMLSpanElement>([{ transform: "scale(0.6)" }, { transform: "scale(1)" }], 180)
  return (
    <div ref={pill} role="status" className="flex min-h-9 w-full items-center gap-2 rounded-[var(--radius-md)] bg-soft-success px-4 text-sm font-medium text-success">
      <span ref={check} className="flex shrink-0">
        <Check aria-hidden size={16} strokeWidth={2} />
      </span>
      {children}
    </div>
  )
}

/** The quiet line the pill settles into. */
function SubscribedLine({ children }: { children: React.ReactNode }) {
  const line = useEntrance<HTMLParagraphElement>([{ opacity: 0 }, { opacity: 1 }], 180)
  return (
    <p ref={line} role="status" className="flex min-h-9 items-center gap-2 text-sm text-muted-foreground">
      <Check aria-hidden size={16} strokeWidth={2} className="shrink-0 text-success" />
      {children}
    </p>
  )
}

/** An error line that slides in 4px. */
function ErrorLine({ id, children }: { id: string; children: React.ReactNode }) {
  const line = useEntrance<HTMLParagraphElement>([{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "none" }], 180)
  return (
    <p ref={line} id={id} role="alert" className="text-sm text-destructive">
      {children}
    </p>
  )
}

/** Figma's panel hover: raises 4px and steps its shadow up one level, for a pointer, when motion is welcome. */
const RAISE = cn("motion-safe:transition-[transform,box-shadow] motion-safe:duration-[180ms]", EASE, "hover:motion-safe:-translate-y-1 hover:motion-safe:shadow-md")

const TITLE =
  "text-xl font-semibold leading-7 text-foreground rtl:leading-9 [@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-10 [@container(min-width:40rem)]:rtl:leading-[3.125rem]"
const TEXT = "text-base leading-6 text-muted-foreground rtl:leading-7"
const ROW = "flex flex-col gap-3 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end"

function Subscribe({ copy, onSubscribe }: { copy: ContactUsNewsletterComboCopy; onSubscribe?: ContactUsNewsletterComboProps["onSubscribe"] }) {
  const fields: ContactUsFieldDef[] = [{ name: "email", kind: "email", label: copy.subscribeEmailLabel, required: true }]
  const form = useContactUsForm({ fields, messages: { ...copy, pendingLabel: copy.subscribing, error: copy.subscribeError }, onSubmit: onSubscribe })
  const errorId = React.useId()
  const field = React.useRef<HTMLDivElement>(null)
  const row = React.useRef<HTMLDivElement>(null)
  const rowHeight = React.useRef(0)
  const [settled, setSettled] = React.useState(false)
  const email = typeof form.values.email === "string" ? form.values.email : ""
  const message = form.errors.email ?? (form.status === "error" ? copy.subscribeError : undefined)

  // An invalid address shakes the field: 4px each way, twice, in 120ms.
  React.useEffect(() => {
    if (!form.errors.email || !field.current || typeof field.current.animate !== "function" || prefersReducedMotion()) return
    const shake = field.current.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }],
      { duration: 120, easing: "linear" }
    )
    return () => shake.cancel()
  }, [form.errors])

  // The pill settles into the quiet line after 2s.
  React.useEffect(() => {
    if (form.status !== "success") return
    setSettled(false)
    const timer = setTimeout(() => setSettled(true), SETTLE_MS)
    return () => clearTimeout(timer)
  }, [form.status])

  return (
    <form
      ref={form.formRef}
      noValidate
      aria-busy={form.status === "pending" || undefined}
      onSubmit={(event) => {
        // The success states take the row's place, at the height it had.
        rowHeight.current = row.current?.offsetHeight ?? 0
        form.submit(event)
      }}
      className="flex flex-col gap-3"
    >
      {form.status === "success" ? (
        <div className="flex items-stretch" style={{ minHeight: rowHeight.current || undefined }}>
          {settled ? <SubscribedLine>{copy.subscribedNote}</SubscribedLine> : <SubscribedPill>{copy.subscribed}</SubscribedPill>}
        </div>
      ) : (
        <>
          <div ref={row} className={ROW}>
            <div ref={field} data-contact-field="email" data-invalid={form.errors.email ? "" : undefined} className="min-w-0 flex-1">
              <Input
                name="email"
                type="email"
                size="md"
                label={undefined}
                placeholder={copy.subscribeEmailPlaceholder}
                autoComplete="email"
                aria-label={copy.subscribeEmailLabel}
                aria-required
                aria-describedby={message ? errorId : undefined}
                disabled={form.disabled}
                value={email}
                onChange={(event) => form.setValue("email", event.target.value)}
                invalid={Boolean(form.errors.email)}
              />
            </div>
            <Button type="submit" variant="secondary" size="md" loading={form.status === "pending"} loadingLabel={copy.subscribing} disabled={form.disabled && form.status !== "pending"} className="w-full shrink-0 [@container(min-width:64rem)]:w-auto">
              {copy.subscribe}
            </Button>
          </div>
          {message ? <ErrorLine id={errorId}>{message}</ErrorLine> : null}
        </>
      )}
    </form>
  )
}

export function ContactUsNewsletterCombo({ locale = "en", ...given }: ContactUsNewsletterComboProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { onSubscribe, onSubmit, className, ...html } = rest
  const subscribeTitleId = React.useId()

  const f = {
    name: { name: "name", kind: "text", label: copy.namePlaceholder, hideLabel: true, placeholder: copy.namePlaceholder, autoComplete: "name" },
    email: { name: "email", kind: "email", label: copy.emailPlaceholder, hideLabel: true, placeholder: copy.emailPlaceholder, autoComplete: "email", required: true },
    message: { name: "message", kind: "textarea", label: copy.messagePlaceholder, hideLabel: true, placeholder: copy.messagePlaceholder },
  } satisfies Record<string, ContactUsFieldDef>
  const form = useContactUsForm({ fields: Object.values(f), messages: copy, onSubmit })

  return (
    <ContactUsSection labelledBy={subscribeTitleId} gap="none" className={className} {...html}>
      <div className="flex flex-col gap-6 [@container(min-width:40rem)]:flex-row">
        <ContactUsInverseBand className={cn("flex min-w-0 flex-col gap-6 rounded-[10px] p-10 [@container(min-width:40rem)]:flex-[611_611_0%]", RAISE)}>
          <span className="flex size-8 items-center justify-center rounded-lg text-foreground">
            <Megaphone aria-hidden size={24} strokeWidth={1.5} className="rtl:-scale-x-100" />
          </span>
          <h2 id={subscribeTitleId} className={TITLE}>
            {copy.subscribeTitle}
          </h2>
          <p className={TEXT}>{copy.subscribeText}</p>
          <Subscribe copy={copy} onSubscribe={onSubscribe} />
          <div className="flex items-center gap-3">
            <Avatar variant="initials" size="32" radius="rounded" name={copy.proofName} aria-hidden="true" />
            <p className="text-xs leading-4 text-muted-foreground rtl:leading-5">{copy.proof}</p>
          </div>
        </ContactUsInverseBand>

        <div className={cn("flex min-w-0 flex-col gap-6 rounded-[10px] border border-border bg-card p-10 [@container(min-width:40rem)]:flex-[613_613_0%]", RAISE)}>
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
            <MessageSquare aria-hidden size={24} strokeWidth={1.5} />
          </span>
          <h2 className={TITLE}>{copy.contactTitle}</h2>
          <p className={TEXT}>{copy.contactText}</p>
          <ContactUsForm form={form} className="contents">
            <div className="flex flex-col gap-4">
              <div className={cn(ROW, "[@container(min-width:64rem)]:gap-4 [&>*]:flex-1")}>
                <ContactUsField field={f.name} />
                <ContactUsField field={f.email} />
              </div>
              <ContactUsField field={f.message} />
            </div>
            <div className="flex flex-col items-start gap-3 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between">
              <p className="text-xs leading-4 text-muted-foreground rtl:leading-5">{copy.reply}</p>
              <ContactUsSubmit variant="default" size="md" className="w-full shrink-0 [@container(min-width:64rem)]:w-auto">
                {copy.send}
                <Send aria-hidden strokeWidth={1.5} className="rtl:-scale-x-100" />
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
export const contactUsNewsletterComboCopy = COPY
