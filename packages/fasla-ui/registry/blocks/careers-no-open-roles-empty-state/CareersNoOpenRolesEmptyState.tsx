"use client"

import * as React from "react"
import { ArrowUpRight, Check, Link2, Mail, Search, Send } from "lucide-react"
import { Button, buttonVariants } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { CareersRule, CareersSection, useControllableValue, type CareersLocale } from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=No Open Roles — Empty State.
 *
 * What a careers page says when it has no roles. On the start side: a `muted`
 * square with a search mark, the heading, what is going on, a one-line email
 * form with a solid Notify me button, and under it "What would you want to
 * hear about?" with a row of topic chips. On the end side, a photo. Under a
 * hairline, two cards: send a speculative application, and follow the team.
 *
 * Desktop sets the text beside a 480 × 400 photo and the cards two across.
 * Tablet puts the photo under the chips at full width, the cards still two
 * across. Mobile is one column. In Arabic the photo sits at the left.
 *
 * The form is real. It checks the address, calls `onSubmit(email, interests)`
 * and shows the three things that can happen: the address is wrong, the send
 * fails, or it worked. The chips are a multiple choice; each press calls
 * `onInterestsChange` with everything chosen so far. The block holds no list
 * of addresses and sends nothing itself: that is the page's `onSubmit`.
 *
 * Content limits: the heading up to 32 characters and a card's title up to
 * 32. The other limits are in the block's documentation page, which the
 * default copy stays inside.
 */

export interface CareersEmptyStateCard {
  /** The card's title. */
  title: React.ReactNode
  /** What it is for. */
  description: React.ReactNode
  /** The card's ghost button label. */
  action: string
}

export interface CareersNoOpenRolesEmptyStateCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** What is going on, and what the form does. */
  description: React.ReactNode
  /** Names the email field for assistive technology. */
  emailLabel: string
  /** The email field's placeholder. */
  emailPlaceholder: string
  /** The solid button's label. */
  notify: string
  /** Shown on the button while the address is sending. */
  pendingLabel: string
  /** The line over the topic chips. */
  interestsLabel: React.ReactNode
  /** The topics, one chip each. */
  topics: string[]
  /** Said once the address is in. */
  success: React.ReactNode
  /** Said when the address is not one. */
  emailError: React.ReactNode
  /** Said when sending failed. */
  sendError: React.ReactNode
  /** The speculative application card. */
  speculative: CareersEmptyStateCard
  /** The follow card. */
  follow: CareersEmptyStateCard
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersNoOpenRolesEmptyStateCopy> = {
  en: {
    heading: "No open roles right now",
    description: "We hire in waves, and the next one opens in October. Leave an email and we will write to you before the roles go public: one message, no newsletter.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    notify: "Notify me",
    pendingLabel: "Sending",
    interestsLabel: "What would you want to hear about?",
    topics: ["Design", "Engineering", "Product", "Go-to-market", "People", "Internships"],
    success: "Thank you. We will write before the roles go public.",
    emailError: "Enter a valid email address.",
    sendError: "We could not send that. Please try again.",
    speculative: {
      title: "Send a speculative application",
      description: "Tell us what you do and where you would fit. We read every one and keep it on file for a year.",
      action: "Apply speculatively",
    },
    follow: {
      title: "Follow the team",
      description: "We post new roles on LinkedIn the morning they open, along with the work behind them.",
      action: "Follow on LinkedIn",
    },
  },
  ar: {
    heading: "لا توجد وظائف متاحة حاليًا",
    description: "نوظّف على دفعات، والدفعة القادمة تبدأ في أكتوبر. اترك بريدك وسنكتب إليك قبل نشر الوظائف: رسالة واحدة، بلا نشرة بريدية.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "اكتب بريدك الإلكتروني",
    notify: "أخبرني",
    pendingLabel: "جارٍ الإرسال",
    interestsLabel: "عمّا تريد أن تسمع؟",
    topics: ["التصميم", "الهندسة", "المنتج", "التسويق والنمو", "الموارد البشرية", "التدريب العملي"],
    success: "شكرًا لك. سنكتب إليك قبل نشر الوظائف.",
    emailError: "اكتب بريدًا إلكترونيًا صحيحًا.",
    sendError: "تعذّر الإرسال. حاول مرة أخرى.",
    speculative: {
      title: "أرسل طلبًا بمبادرتك",
      description: "أخبرنا بما تفعله وأين تناسب. نقرأ كل طلب ونحفظه لمدة عام.",
      action: "قدّم بمبادرتك",
    },
    follow: {
      title: "تابع الفريق",
      description: "ننشر الوظائف الجديدة على لينكدإن صباح إتاحتها، مع العمل الذي يقف خلفها.",
      action: "تابعنا على لينكدإن",
    },
  },
}

export interface CareersNoOpenRolesEmptyStatePhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface CareersNoOpenRolesEmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<CareersNoOpenRolesEmptyStateCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** The photo beside the text. A `muted` placeholder shows without it. */
  photo?: CareersNoOpenRolesEmptyStatePhoto
  /**
   * Called with the checked address and the topics chosen. Resolve to show the
   * thank-you line; reject, or throw, to show the send error.
   */
  onSubmit?: (email: string, interests: string[]) => void | Promise<void>
  /** The topics chosen. Pass it to control the chips. */
  interests?: string[]
  /** The topics chosen on first render. */
  defaultInterests?: string[]
  /** Called with every topic chosen after a chip is pressed. */
  onInterestsChange?: (interests: string[]) => void
  /** Where the speculative application card goes. Without it, the card's button calls `onSpeculative`. */
  speculativeHref?: string
  /** Called when the speculative application button is pressed and has no `speculativeHref`. */
  onSpeculative?: () => void
  /** Where the follow card goes. Without it, the card's button calls `onFollow`. */
  followHref?: string
  /** Called when the follow button is pressed and has no `followHref`. */
  onFollow?: () => void
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = "idle" | "invalid" | "sending" | "done" | "error"

/** A 40px `muted` square holding a 16px mark, as the cards use. */
function Tile({ children, size = "sm" }: { children: React.ReactNode; size?: "sm" | "lg" }) {
  return (
    <span className={size === "lg" ? "flex size-14 items-center justify-center rounded-xl bg-muted text-muted-foreground" : "flex size-9 items-center justify-center rounded-lg bg-muted text-foreground"}>
      {children}
    </span>
  )
}

export function CareersNoOpenRolesEmptyState({
  locale = "en",
  heading,
  description,
  emailLabel,
  emailPlaceholder,
  notify,
  pendingLabel,
  interestsLabel,
  topics,
  success,
  emailError,
  sendError,
  speculative,
  follow,
  photo,
  onSubmit,
  interests: interestsProp,
  defaultInterests,
  onInterestsChange,
  speculativeHref,
  onSpeculative,
  followHref,
  onFollow,
  className,
  ...props
}: CareersNoOpenRolesEmptyStateProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [chosen, setChosen] = useControllableValue<string[]>(interestsProp, defaultInterests ?? [], onInterestsChange)
  const list = topics ?? copy.topics
  const cards = [
    { card: speculative ?? copy.speculative, icon: Send, href: speculativeHref, onPress: onSpeculative },
    { card: follow ?? copy.follow, icon: Link2, href: followHref, onPress: onFollow },
  ]
  const arrow = <ArrowUpRight aria-hidden strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />

  const toggle = (topic: string) => setChosen(chosen.includes(topic) ? chosen.filter((item) => item !== topic) : [...chosen, topic])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL.test(value)) {
      setStatus("invalid")
      return
    }
    setStatus("sending")
    try {
      await onSubmit?.(value, chosen)
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  const message = status === "invalid" ? (emailError ?? copy.emailError) : status === "error" ? (sendError ?? copy.sendError) : undefined

  return (
    <CareersSection labelledBy={headingId} className={className} {...props}>
      <div className="grid grid-cols-1 gap-8 [@container(min-width:64rem)]:grid-cols-[minmax(0,1fr)_30rem] [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <Tile size="lg">
            <Search size={20} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
          </Tile>
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
            {heading ?? copy.heading}
          </h2>
          <p className="max-w-[560px] text-base text-muted-foreground">{description ?? copy.description}</p>

          {status === "done" ? (
            <p role="status" className="inline-flex items-center gap-2 text-sm font-medium text-success">
              <Check aria-hidden size={16} strokeWidth={1.5} />
              <span>{success ?? copy.success}</span>
            </p>
          ) : (
            <form noValidate onSubmit={submit} className="flex w-full flex-col items-start gap-3 [@container(min-width:40rem)]:flex-row">
              <Input
                type="email"
                size="md"
                autoComplete="email"
                aria-label={emailLabel ?? copy.emailLabel}
                placeholder={emailPlaceholder ?? copy.emailPlaceholder}
                startIcon={<Mail aria-hidden strokeWidth={1.5} />}
                value={email}
                invalid={status === "invalid" || status === "error"}
                error={message}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (status === "invalid" || status === "error") setStatus("idle")
                }}
                className="w-full [@container(min-width:40rem)]:max-w-[22rem]"
              />
              <Button type="submit" variant="default" size="md" loading={status === "sending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full [@container(min-width:40rem)]:w-auto">
                <span>{notify ?? copy.notify}</span>
                {arrow}
              </Button>
            </form>
          )}

          <div role="group" aria-labelledby={`${headingId}-interests`} className="flex flex-col items-start gap-3">
            <p id={`${headingId}-interests`} className="text-sm font-medium text-foreground">
              {interestsLabel ?? copy.interestsLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {list.map((topic) => (
                <Button
                  key={topic}
                  type="button"
                  size="sm"
                  radius="rounded"
                  variant={chosen.includes(topic) ? "secondary" : "outline"}
                  aria-pressed={chosen.includes(topic)}
                  onClick={() => toggle(topic)}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative h-60 overflow-hidden rounded-2xl bg-muted [@container(min-width:40rem)]:h-[15.75rem] [@container(min-width:64rem)]:h-[25rem]">
          {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" /> : null}
        </div>
      </div>

      <CareersRule />

      <ul className="grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2">
        {cards.map(({ card, icon: Icon, href, onPress }) => (
          <li key={String(card.title)} className="flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground">
            <Tile>
              <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
            </Tile>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
            {href ? (
              <a href={href} className={buttonVariants({ variant: "ghost", size: "md" })}>
                <span>{card.action}</span>
                {arrow}
              </a>
            ) : (
              <Button type="button" variant="ghost" size="md" onClick={onPress}>
                <span>{card.action}</span>
                {arrow}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersNoOpenRolesEmptyStateCopy = COPY
