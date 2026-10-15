"use client"

import * as React from "react"
import { SendIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `FAQ` (42359:9029), Type=Chat Thread.
 *
 * Questions and answers set as a conversation: the reader's questions in
 * `primary` bubbles at the end of the line, support's answers in `muted`
 * bubbles at the start beside its avatar, and a composer to ask another.
 *
 * The thread is an ordered list, and each message names its author for
 * screen readers. The composer calls `onSend` and clears itself; the send
 * button is disabled while the field is empty and shows its loading state
 * while a returned promise runs. The block does not add the message to the
 * thread: pass the new `messages` when your answer is ready.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side here is a logical one, and the send glyph turns to face the way the
 * text reads.
 */

export interface FaqChatThreadMessage {
  /** Who sent it: the reader asking, or support answering. */
  from: "visitor" | "support"
  text: React.ReactNode
  /** A small line under an answer: who replied, how fast they usually do. */
  meta?: React.ReactNode
}

export interface FaqChatThreadCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The conversation, oldest first. Each message has `from` (`"visitor"` or `"support"`), its `text` and an optional `meta` line, such as the time. */
  messages: FaqChatThreadMessage[]
  /** Shown in place of the thread when `messages` is empty. */
  empty: React.ReactNode
  /** Support's name: the avatar's initials and what a screen reader hears before each answer. */
  supportName: string
  /** What a screen reader hears before each question. */
  visitorLabel: string
  /** The placeholder of the message field. */
  placeholder: string
  /** The send button's accessible name. */
  sendLabel: string
  /** Shown when `onSend` throws or rejects. */
  sendError: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqChatThreadCopy> = {
  en: {
    heading: "Ask us like you would ask a colleague",
    description: "The questions people actually send us, answered the way we answer them.",
    messages: [
      { from: "visitor", text: "Is Fasla overkill for a two-person team?" },
      {
        from: "support",
        text: "Honestly, no — small teams get the most from it, because you skip the part where you build primitives before you build product. Start with one page and grow into it.",
        meta: "Fasla support · usually replies in minutes",
      },
      { from: "visitor", text: "We already have a component library. What then?" },
      {
        from: "support",
        text: "Then use Fasla for the tokens and the blocks. Point your existing components at the variable collections and take only the sections you have not built yet.",
      },
      { from: "visitor", text: "How do you handle Arabic properly, not just mirrored?" },
      {
        from: "support",
        text: "Every RTL variant uses the Cairo type styles rather than a flipped Latin layout, numerals follow the block’s convention, and we mirror only the icons whose meaning depends on direction.",
      },
      { from: "visitor", text: "What happens when Figma changes something?" },
      {
        from: "support",
        text: "We track the releases and patch the library. Because your file references our components rather than copying them, a fix reaches you as a library update you can review before accepting.",
      },
    ],
    empty: "No questions yet. Ask the first one.",
    supportName: "Fasla support",
    visitorLabel: "Question",
    placeholder: "Ask your own question…",
    sendLabel: "Send",
    sendError: "Your question wasn’t sent. Try again.",
  },
  ar: {
    heading: "اسألنا كما تسأل زميلًا",
    description: "الأسئلة التي يرسلها الناس فعلًا، بإجاباتنا كما نكتبها.",
    messages: [
      { from: "visitor", text: "هل فاصلة مبالغ فيها لفريق من شخصين؟" },
      {
        from: "support",
        text: "بصراحة لا، فالفرق الصغيرة هي الأكثر استفادة، لأنك تتجاوز مرحلة بناء الأساسيات قبل بناء المنتج. ابدأ بصفحة واحدة وتوسّع تدريجيًا.",
        meta: "دعم فاصلة، يردّ عادةً خلال دقائق",
      },
      { from: "visitor", text: "لدينا مكتبة مكوّنات بالفعل. ماذا إذن؟" },
      {
        from: "support",
        text: "استخدم فاصلة للرموز والكتل. وجّه مكوّناتك الحالية إلى مجموعات المتغيّرات وخذ فقط الأقسام التي لم تبنِها بعد.",
      },
      { from: "visitor", text: "كيف تعالجون العربية بشكل صحيح لا مجرّد انعكاس؟" },
      {
        from: "support",
        text: "تستخدم كل نسخة عربية أنماط خط Cairo بدل تخطيط لاتيني معكوس، وتتبع الأرقام عرف الكتلة، ولا نعكس إلا الأيقونات التي يعتمد معناها على الاتجاه.",
      },
      { from: "visitor", text: "ماذا يحدث عندما يغيّر Figma شيئًا؟" },
      {
        from: "support",
        text: "نتابع الإصدارات ونصلح المكتبة. ولأن ملفك يشير إلى مكوّناتنا بدل نسخها، يصلك الإصلاح كتحديث للمكتبة يمكنك مراجعته قبل قبوله.",
      },
    ],
    empty: "لا توجد أسئلة بعد. اطرح السؤال الأول.",
    supportName: "دعم فاصلة",
    visitorLabel: "سؤال",
    placeholder: "اطرح سؤالك…",
    sendLabel: "إرسال",
    sendError: "لم يُرسَل سؤالك. حاول مرة أخرى.",
  },
}

export interface FaqChatThreadProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqChatThreadCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Support's photo. Without one, the avatar shows the initials of `supportName`.
   * @default none: the initials of `supportName`
   */
  supportAvatar?: string
  /** Sends the reader's question. The composer clears once it resolves. */
  onSend?: (message: string) => Promise<void> | void
  /**
   * Turns the composer off.
   * @default false
   */
  disabled?: boolean
}

export function FaqChatThread({
  locale = "en",
  heading,
  description,
  messages,
  empty,
  supportName,
  visitorLabel,
  placeholder,
  sendLabel,
  sendError,
  supportAvatar,
  onSend,
  disabled,
  className,
  ...props
}: FaqChatThreadProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const thread = messages ?? copy.messages
  const support = supportName ?? copy.supportName
  const [draft, setDraft] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [failed, setFailed] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message || pending) return
    setPending(true)
    setFailed(false)
    try {
      await onSend?.(message)
      setDraft("")
    } catch {
      setFailed(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <header className="flex w-full max-w-[720px] flex-col gap-2 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {thread.length === 0 ? (
          <p className="w-full max-w-[760px] text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ol className="flex w-full max-w-[760px] flex-col gap-5">
            {thread.map((message, index) =>
              message.from === "visitor" ? (
                <li key={index} className="flex justify-end">
                  <p className="max-w-[299px] rounded-2xl rounded-ee bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground md:max-w-[80%]">
                    <span className="sr-only">{visitorLabel ?? copy.visitorLabel}: </span>
                    {message.text}
                  </p>
                </li>
              ) : (
                <li key={index} className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex">
                    <Avatar src={supportAvatar} name={support} radius="rounded" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <p className="rounded-2xl rounded-ss bg-muted px-5 py-3.5 text-sm text-foreground">
                      <span className="sr-only">{support}: </span>
                      {message.text}
                    </p>
                    {message.meta && <p className="text-xs text-muted-foreground">{message.meta}</p>}
                  </div>
                </li>
              )
            )}
          </ol>
        )}

        <form onSubmit={handleSubmit} className="flex w-full max-w-[760px] flex-col gap-2">
          <Input
            radius="rounded"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              if (failed) setFailed(false)
            }}
            placeholder={placeholder ?? copy.placeholder}
            aria-label={placeholder ?? copy.placeholder}
            disabled={disabled}
            className="[&_[data-slot=input-box]]:h-[54px] [&_[data-slot=input-box]]:gap-3 [&_[data-slot=input-box]]:border-border [&_[data-slot=input-box]]:bg-card [&_[data-slot=input-box]]:pe-2 [&_[data-slot=input-box]]:ps-5 [&_[data-slot=input-box]]:shadow-none dark:[&_[data-slot=input-box]]:bg-card"
            endIcon={
              <Button
                type="submit"
                size="icon-md"
                radius="rounded"
                aria-label={sendLabel ?? copy.sendLabel}
                loading={pending}
                loadingLabel={sendLabel ?? copy.sendLabel}
                disabled={disabled || draft.trim() === ""}
              >
                <SendIcon aria-hidden="true" className="[&:dir(rtl)]:-scale-x-100" />
              </Button>
            }
          />
          {failed && (
            <p role="alert" className="px-5 text-xs text-destructive">
              {sendError ?? copy.sendError}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqChatThreadCopy = COPY
