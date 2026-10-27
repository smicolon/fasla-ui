"use client"

import * as React from "react"
import { ArrowRight, Check, Mail, Sparkles, Ticket } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Authentications` (42586:4669), Type=Waitlist Early Access.
 *
 * A waitlist sign-up beside an art panel: a "Private beta" badge, the
 * heading, work email and an optional referral code, Join the waitlist, a row
 * of faces with the queue, and a card on the art listing what members get on
 * day one. Sending the form turns it into a confirmation that counts up to
 * the visitor's place in the queue.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). On a phone the art becomes a 180px band
 * above the form and the card is dropped. Direction is the page's `dir`: in
 * Arabic the form sits on the right. The art is never mirrored.
 */

export interface AuthWaitlistEarlyAccessLink {
  label: React.ReactNode
  href: string
}

export interface AuthWaitlistEarlyAccessImage {
  src: string
  /** Describes the art. Pass "" for a purely decorative one. */
  alt: string
}

export interface AuthWaitlistEarlyAccessMember {
  /** The avatar's accessible name, and its initials when there is no photo. */
  name: string
  /** Their photo. */
  avatar?: string
}

export interface AuthWaitlistEarlyAccessValues {
  email: string
  referralCode: string
}

/** What `onSubmit` may resolve with: the visitor's place in the queue. */
export interface AuthWaitlistEarlyAccessResult {
  position?: number
}

export interface AuthWaitlistEarlyAccessCopy {
  /** The badge over the heading. Hidden when empty. */
  badge: React.ReactNode
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  emailLabel: React.ReactNode
  emailPlaceholder: string
  referralLabel: React.ReactNode
  referralPlaceholder: string
  /** The line under the referral field. */
  referralHint: React.ReactNode
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The faces under the form. The row is hidden when both this and `queueText` are empty. */
  members: AuthWaitlistEarlyAccessMember[]
  /** The line beside the faces. */
  queueText: React.ReactNode
  /** The heading that replaces the form once `onSubmit` resolves. */
  successHeading: React.ReactNode
  /** The words over the queue number, once `onSubmit` resolves with a `position`. */
  successPositionLabel: React.ReactNode
  /** The question before the closing link. */
  footerText: React.ReactNode
  /** The closing link, to sign in. Hidden, with `footerText`, when null. */
  footerLink: AuthWaitlistEarlyAccessLink | null
  /** The card's title on the art, from Tablet up. The card is hidden when this and `perks` are empty. */
  perksTitle: React.ReactNode
  /** What members get, as ticked lines in the card. */
  perks: React.ReactNode[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthWaitlistEarlyAccessCopy> = {
  en: {
    badge: "Private beta",
    heading: "Get early access to Fasla",
    description: "We are onboarding teams in small batches so every workspace gets a proper setup call.",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    referralLabel: "Referral code",
    referralPlaceholder: "Optional",
    referralHint: "A code from an existing member moves you up the list.",
    submitLabel: "Join the waitlist",
    pendingLabel: "Joining the waitlist",
    error: "We couldn’t add you to the waitlist. Check your email and try again.",
    members: [{ name: "Hana Malik" }, { name: "Sami Rahman" }, { name: "Noor Aziz" }, { name: "Adam Khalil" }],
    queueText: "2,480 teams ahead of you · average wait 9 days",
    successHeading: "You’re on the list",
    successPositionLabel: "Your place in the queue",
    footerText: "Already invited?",
    footerLink: { label: "Sign in", href: "#sign-in" },
    perksTitle: "What you get on day one",
    perks: ["A guided workspace setup call", "Your component library migrated for you", "Founder pricing locked for 12 months"],
  },
  ar: {
    badge: "إصدار تجريبي خاص",
    heading: "احصل على وصول مبكر إلى فاصلة",
    description: "نضمّ الفرق على دفعات صغيرة، لتحظى كل مساحة عمل بمكالمة إعداد وافية.",
    emailLabel: "بريد العمل",
    emailPlaceholder: "you@company.com",
    referralLabel: "رمز الإحالة",
    referralPlaceholder: "اختياري",
    referralHint: "رمز من عضو حالي يقدّمك في القائمة.",
    submitLabel: "انضم إلى قائمة الانتظار",
    pendingLabel: "جارٍ ضمّك إلى قائمة الانتظار",
    error: "تعذّرت إضافتك إلى قائمة الانتظار. تحقّق من بريدك الإلكتروني ثم حاول مجددًا.",
    members: [{ name: "هناء مالك" }, { name: "سامي رحمن" }, { name: "نور عزيز" }, { name: "آدم خليل" }],
    queueText: (
      <>
        <bdi dir="ltr">2,480</bdi> فريقًا قبلك · متوسط الانتظار <bdi dir="ltr">9</bdi> أيام
      </>
    ),
    successHeading: "أنت في القائمة الآن",
    successPositionLabel: "ترتيبك في قائمة الانتظار",
    footerText: "مدعوّ بالفعل؟",
    footerLink: { label: "تسجيل الدخول", href: "#sign-in" },
    perksTitle: "ما تحصل عليه من اليوم الأول",
    perks: [
      "مكالمة إعداد موجّهة لمساحة العمل",
      "ننقل مكتبة مكوّناتك نيابةً عنك",
      <>
        تثبيت سعر المؤسِّسين لمدة <bdi dir="ltr">12</bdi> شهرًا
      </>,
    ],
  },
}

export interface AuthWaitlistEarlyAccessProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthWaitlistEarlyAccessCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the badge: Figma shows the 30px-high Fasla Logo lockup. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * The art panel's picture. None by default: the panel shows a `muted`
   * placeholder of the same size.
   * @default none: a `muted` placeholder
   */
  image?: AuthWaitlistEarlyAccessImage
  /**
   * Runs when the form is sent. While its promise is pending the button shows
   * its spinner and the form is disabled; a rejection shows `error`. When it
   * resolves the form gives way to `successHeading`, and to the queue number
   * when it resolves with a `position`.
   */
  onSubmit?: (values: AuthWaitlistEarlyAccessValues) => Promise<AuthWaitlistEarlyAccessResult | void> | AuthWaitlistEarlyAccessResult | void
}

const ICON = { size: 16, strokeWidth: 1.5, absoluteStrokeWidth: true, "aria-hidden": true } as const

const LINK =
  "rounded-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Figma's art drift: a slow 24s scale and hue drift on an alternating loop,
 * from Tablet up. Held still on a phone and under prefers-reduced-motion.
 */
function useArtDrift(art: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const node = art.current
    if (!node || typeof node.animate !== "function") return
    const wide = window.matchMedia("(min-width: 768px)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    let animation: Animation | null = null
    const play = () => {
      animation?.cancel()
      animation = null
      if (!wide.matches || reduce.matches) return
      animation = node.animate(
        [
          { transform: "scale(1)", filter: "hue-rotate(0deg)" },
          { transform: "scale(1.08)", filter: "hue-rotate(24deg)" },
        ],
        { duration: 24000, iterations: Infinity, direction: "alternate", easing: "ease-in-out" }
      )
    }
    play()
    wide.addEventListener("change", play)
    reduce.addEventListener("change", play)
    return () => {
      wide.removeEventListener("change", play)
      reduce.removeEventListener("change", play)
      animation?.cancel()
    }
  }, [art])
}

/** The queue number, counting up from zero over 800ms; set at once under reduced motion. */
function QueueNumber({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const final = value.toLocaleString("en-US")
  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node || reducedMotion()) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 800)
      node.textContent = Math.round(value * (1 - Math.pow(1 - t, 3))).toLocaleString("en-US")
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    node.textContent = "0"
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      node.textContent = final
    }
  }, [value, final])
  return (
    <>
      <span ref={ref} aria-hidden="true" dir="ltr">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </>
  )
}

export function AuthWaitlistEarlyAccess({
  locale = "en",
  badge,
  heading,
  description,
  emailLabel,
  emailPlaceholder,
  referralLabel,
  referralPlaceholder,
  referralHint,
  submitLabel,
  pendingLabel,
  error,
  members,
  queueText,
  successHeading,
  successPositionLabel,
  footerText,
  footerLink,
  perksTitle,
  perks,
  logo,
  image,
  onSubmit,
  className,
  ...props
}: AuthWaitlistEarlyAccessProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const artRef = React.useRef<HTMLImageElement>(null)
  const doneRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error" | "done">("idle")
  const [position, setPosition] = React.useState<number | null>(null)
  const label = badge ?? copy.badge
  const subline = description ?? copy.description
  const faces = members ?? copy.members
  const queue = queueText ?? copy.queueText
  const signIn = footerLink === undefined ? copy.footerLink : footerLink
  const cardTitle = perksTitle ?? copy.perksTitle
  const perkList = perks ?? copy.perks
  useArtDrift(artRef)

  React.useLayoutEffect(() => {
    const node = doneRef.current
    if (status !== "done" || !node || typeof node.animate !== "function" || reducedMotion()) return
    const animation = node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" })
    return () => animation.cancel()
  }, [status])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      const result = await onSubmit({
        email: String(data.get("email") ?? ""),
        referralCode: String(data.get("referralCode") ?? ""),
      })
      setPosition(result && typeof result.position === "number" ? result.position : null)
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex flex-col bg-background md:min-h-[720px] md:flex-row lg:min-h-[840px]", className)}
      {...props}
    >
      <div className="flex items-center justify-center bg-background px-8 py-16 md:flex-[400_1_0%] md:p-16 lg:flex-[752_1_0%] lg:px-20">
        <div className="flex w-full min-w-0 flex-col gap-7 lg:max-w-[408px]">
          {logo ? <div className="flex h-[30px] items-center [&>svg]:h-full [&>svg]:w-auto">{logo}</div> : null}
          <div className="flex flex-col items-start gap-3">
            {label ? (
              <Badge variant="soft" tone="secondary" size="sm" radius="rounded">
                {label}
              </Badge>
            ) : null}
            <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-4xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-base text-muted-foreground">{subline}</p> : null}
          </div>

          {status === "done" ? (
            <div ref={doneRef} role="status" className="flex flex-col gap-2 rounded-lg border border-border p-6">
              <p className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Check {...ICON} className="text-success" />
                {successHeading ?? copy.successHeading}
              </p>
              {position !== null ? (
                <p className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">{successPositionLabel ?? copy.successPositionLabel}</span>
                  <span className="text-4xl font-semibold tabular-nums text-foreground">
                    <QueueNumber value={position} />
                  </span>
                </p>
              ) : null}
            </div>
          ) : (
            <form onSubmit={submit} className="w-full">
              <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col gap-4">
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  label={emailLabel ?? copy.emailLabel}
                  placeholder={emailPlaceholder ?? copy.emailPlaceholder}
                  startIcon={<Mail {...ICON} />}
                />
                <Input
                  name="referralCode"
                  autoComplete="off"
                  label={referralLabel ?? copy.referralLabel}
                  placeholder={referralPlaceholder ?? copy.referralPlaceholder}
                  description={referralHint ?? copy.referralHint}
                  startIcon={<Ticket {...ICON} />}
                />
                <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
                  {submitLabel ?? copy.submitLabel}
                  <ArrowRight {...ICON} className="rtl:-scale-x-100" />
                </Button>
                <p role="alert" className="text-sm text-destructive empty:hidden">
                  {status === "error" ? (error ?? copy.error) : null}
                </p>
              </fieldset>
            </form>
          )}

          {faces.length > 0 || queue ? (
            <div className="flex items-center gap-4">
              {faces.length > 0 ? (
                <span className="flex shrink-0 items-center [&>*:not(:first-child)]:-ms-2.5">
                  {faces.map((member, index) => (
                    <Avatar key={index} size="32" radius="rounded" border src={member.avatar} name={member.name} />
                  ))}
                </span>
              ) : null}
              {queue ? <p className="min-w-0 text-xs text-muted-foreground">{queue}</p> : null}
            </div>
          ) : null}

          {signIn ? (
            <p className="flex flex-wrap items-center justify-center gap-1 text-sm">
              <span className="text-muted-foreground">{footerText ?? copy.footerText}</span>
              <a href={signIn.href} className={LINK}>
                {signIn.label}
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative order-first flex h-[180px] shrink-0 flex-col justify-end overflow-hidden bg-muted p-4 md:order-none md:h-auto md:flex-[368_1_0%] md:p-12 lg:flex-[688_1_0%]">
        {image ? (
          <img ref={artRef} src={image.src} alt={image.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
        ) : null}
        {cardTitle || perkList.length > 0 ? (
          <div className="relative hidden flex-col gap-3 rounded-lg bg-card p-6 text-card-foreground shadow-xl md:flex">
            {cardTitle ? (
              <p className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                <Sparkles {...ICON} className="shrink-0" />
                {cardTitle}
              </p>
            ) : null}
            {perkList.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {perkList.map((perk, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check size={13} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="mt-px size-[13px] shrink-0 text-foreground" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authWaitlistEarlyAccessCopy = COPY
