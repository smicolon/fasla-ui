"use client"

import * as React from "react"
import { Check, Clock5, Lock, Mail, Send } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Alert, AlertTitle } from "../../ui/alert/alert"
import { Button, buttonVariants } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Magic Link Request.
 *
 * Passwordless sign-in on a plain page: an open-envelope drawing, a heading,
 * one email field and the button that sends the link, a note on how long the
 * link lasts, then "or" and two other ways in: a password, or a provider.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 440px from Tablet up
 * and fills the width on a phone, where the drawing and the heading step
 * down. Direction is the page's `dir`; every side is a logical one. The
 * drawing is never mirrored.
 */

export interface AuthMagicLinkRequestLink {
  label: React.ReactNode
  href: string
}

export interface AuthMagicLinkRequestProvider {
  platform: SocialPlatform
  /** The button's text: name the provider. */
  label: React.ReactNode
}

export interface AuthMagicLinkRequestCopy {
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  emailLabel: React.ReactNode
  emailPlaceholder: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** The button's text once the link is on its way. */
  sentLabel: React.ReactNode
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The note under the form: how long the link lasts. Hidden when empty. */
  note: React.ReactNode
  /** The word between the two rules over the other ways in. */
  dividerLabel: React.ReactNode
  /** The outline link to sign in with a password instead. Hidden when null. */
  passwordLink: AuthMagicLinkRequestLink | null
  /** The provider buttons under it. */
  providers: AuthMagicLinkRequestProvider[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthMagicLinkRequestCopy> = {
  en: {
    heading: "Sign in without a password",
    description: "We will email you a secure link that signs you in instantly. No password to remember.",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    submitLabel: "Email me a magic link",
    pendingLabel: "Sending the link",
    sentLabel: "Link sent",
    error: "We couldn’t send the link. Check the address and try again.",
    note: "Links expire after 15 minutes and can only be used once.",
    dividerLabel: "or",
    passwordLink: { label: "Sign in with a password", href: "#sign-in" },
    providers: [{ platform: "google", label: "Continue with Google" }],
  },
  ar: {
    heading: "سجّل الدخول دون كلمة مرور",
    description: "سنرسل إلى بريدك رابطًا آمنًا يسجّل دخولك فورًا، دون كلمة مرور تحفظها.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    submitLabel: "أرسل لي رابط الدخول",
    pendingLabel: "جارٍ إرسال الرابط",
    sentLabel: "أُرسل الرابط",
    error: "تعذّر إرسال الرابط. تحقّق من العنوان وحاول مجددًا.",
    note: "تنتهي صلاحية الرابط بعد 15 دقيقة، ولا يُستخدم إلا مرة واحدة.",
    dividerLabel: "أو",
    passwordLink: { label: "سجّل الدخول بكلمة المرور", href: "#sign-in" },
    providers: [
      {
        platform: "google",
        label: (
          <>
            المتابعة باستخدام <bdi dir="ltr">Google</bdi>
          </>
        ),
      },
    ],
  },
}

export interface AuthMagicLinkRequestProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthMagicLinkRequestCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Runs when the form is sent, with the address. While its promise is
   * pending the button shows its spinner; once it settles the button says
   * `sentLabel`, and a rejection shows `error` instead.
   */
  onSubmit?: (values: { email: string }) => Promise<void> | void
  /** Runs when a provider button is pressed. That button shows its spinner while the promise is pending. */
  onProviderSelect?: (platform: SocialPlatform) => Promise<void> | void
}

/**
 * Figma's entrance: the parts fade in and rise one after another, the note
 * last. Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const parts = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance]"))
    const animations = parts.map((part, index) =>
      part.animate(
        [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
        { duration: 320, delay: index * 60, easing: "cubic-bezier(0, 0, 0.2, 1)", fill: "backwards" }
      )
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

export function AuthMagicLinkRequest({
  locale = "en",
  heading,
  description,
  emailLabel,
  emailPlaceholder,
  submitLabel,
  pendingLabel,
  sentLabel,
  error,
  note,
  dividerLabel,
  passwordLink,
  providers,
  onSubmit,
  onProviderSelect,
  className,
  ...props
}: AuthMagicLinkRequestProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const columnRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "sent" | "error">("idle")
  const [pendingProvider, setPendingProvider] = React.useState<SocialPlatform | null>(null)
  const subline = description ?? copy.description
  const noteText = note ?? copy.note
  const password = passwordLink === undefined ? copy.passwordLink : passwordLink
  const providerList = providers ?? copy.providers
  const busy = status === "pending" || pendingProvider !== null
  useEntrance(columnRef)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({ email: String(data.get("email") ?? "") })
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  const selectProvider = async (platform: SocialPlatform) => {
    if (!onProviderSelect) return
    setPendingProvider(platform)
    try {
      await onProviderSelect(platform)
    } finally {
      setPendingProvider(null)
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div ref={columnRef} className="flex w-full flex-col items-center gap-8 md:max-w-[440px]">
        <div data-entrance="" className="flex h-40 w-56 items-center justify-center md:h-[200px] md:w-[280px]">
          <OpenEnvelope className="h-full w-auto" />
        </div>

        <div data-entrance="" className="flex w-full flex-col items-center gap-2 text-center">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <form data-entrance="" onSubmit={submit} className="w-full">
          <fieldset disabled={busy || status === "sent"} className="flex w-full min-w-0 flex-col gap-3">
            <Input
              type="email"
              name="email"
              autoComplete="email"
              required
              label={emailLabel ?? copy.emailLabel}
              placeholder={emailPlaceholder ?? copy.emailPlaceholder}
              startIcon={<Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
            />
            <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
              {/* The label and the sent state share one cell, so the swap is a crossfade and the button never resizes. */}
              <span className="grid [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:transition-opacity [&>*]:duration-[250ms] motion-reduce:[&>*]:transition-none">
                <span aria-hidden={status === "sent"} className={cn("flex items-center justify-center gap-2", status === "sent" && "opacity-0")}>
                  {submitLabel ?? copy.submitLabel}
                  <Send size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
                </span>
                <span aria-hidden={status !== "sent"} className={cn("flex items-center justify-center gap-2", status !== "sent" && "opacity-0")}>
                  <Check size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  {sentLabel ?? copy.sentLabel}
                </span>
              </span>
            </Button>
            <p role="status" className="sr-only">
              {status === "sent" ? (sentLabel ?? copy.sentLabel) : null}
            </p>
            <p role="alert" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>

        {noteText ? (
          <Alert
            data-entrance=""
            type="soft"
            role="note"
            icon={<Clock5 strokeWidth={1.5} />}
          >
            <AlertTitle>{noteText}</AlertTitle>
          </Alert>
        ) : null}

        {password || providerList.length > 0 ? (
          <>
            <div data-entrance="" className="flex w-full items-center gap-3">
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">{dividerLabel ?? copy.dividerLabel}</span>
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
            <div data-entrance="" className="flex w-full flex-col gap-2.5">
              {password ? (
                <a href={password.href} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  <Lock size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  {password.label}
                </a>
              ) : null}
              {providerList.map((provider) => (
                <Button
                  key={provider.platform}
                  type="button"
                  variant="outline"
                  disabled={busy && pendingProvider !== provider.platform}
                  loading={pendingProvider === provider.platform}
                  onClick={() => selectProvider(provider.platform)}
                  className="w-full min-w-0"
                >
                  <SocialIcon platform={provider.platform} className="size-4" />
                  {provider.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

/** Figma's "Opened" drawing: a letter rising out of an open envelope. Decorative. */
function OpenEnvelope({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 228 200" fill="none" aria-hidden="true" className={className}>
      <path
        className="fill-success"
        d="M225.773 197.14C225.375 197.696 224.974 198.247 224.576 198.795C223.433 199.582 222.078 200.003 220.69 200H6.8966C5.57068 200.001 4.27287 199.618 3.1603 198.897C2.79106 198.41 2.426 197.919 2.05676 197.428L2.42599 197.225L110.657 137.233C111.618 136.702 112.697 136.423 113.794 136.421C114.892 136.42 115.972 136.696 116.933 137.225L225.408 196.937L225.773 197.14Z"
      />
      <path
        className="fill-foreground"
        d="M220.69 70.9941L126.889 16.8235C122.944 14.5451 118.469 13.3445 113.913 13.3423C109.357 13.34 104.881 14.5362 100.933 16.8107L6.89661 70.9941C5.06833 70.9966 3.31567 71.7241 2.02288 73.0169C0.730081 74.3097 0.0026474 76.0623 6.10352e-05 77.8906V193.104C0.00219119 194.932 0.729475 196.685 2.02237 197.978C3.31526 199.271 5.06819 199.998 6.89661 200H220.69C222.518 199.997 224.27 199.269 225.563 197.977C226.856 196.684 227.583 194.932 227.586 193.104V77.8906C227.584 76.0623 226.856 74.3097 225.563 73.0169C224.271 71.7241 222.518 70.9966 220.69 70.9941ZM226.775 193.104C226.771 194.716 226.129 196.262 224.988 197.402C223.848 198.542 222.302 199.185 220.69 199.189H6.89661C5.28361 199.186 3.73751 198.544 2.59694 197.403C1.45637 196.263 0.814322 194.717 0.81142 193.104V77.8906C0.813383 76.2773 1.45513 74.7307 2.5959 73.5899C3.73667 72.4491 5.28332 71.8074 6.89661 71.8054L100.933 17.6221C104.881 15.3476 109.357 14.1514 113.913 14.1536C118.469 14.1559 122.944 15.3565 126.889 17.6349L220.69 71.8054C222.303 71.8074 223.85 72.4491 224.99 73.5899C226.131 74.7307 226.773 76.2773 226.775 77.8906V193.104Z"
      />
      <path
        className="fill-background"
        d="M113.915 136.178C113.208 136.181 112.507 136.063 111.839 135.83L111.717 135.787L111.692 135.514C111.615 135.552 111.538 135.588 111.461 135.622L111.379 135.658L111.298 135.622C111.127 135.546 110.957 135.462 110.793 135.369L36.1057 93.4004V7.70771C36.1079 5.71792 36.8993 3.81028 38.3063 2.40329C39.7133 0.996298 41.6209 0.20487 43.6107 0.202637H183.976C185.966 0.20487 187.873 0.996298 189.28 2.40329C190.687 3.81028 191.479 5.71792 191.481 7.70771V93.5099L191.378 93.5682L117.037 135.369C116.082 135.901 115.008 136.18 113.915 136.178Z"
      />
      <path
        className="fill-foreground"
        d="M113.915 136.381C113.185 136.384 112.461 136.262 111.772 136.022L111.526 135.935L111.516 135.819L111.379 135.879L111.216 135.808C111.039 135.73 110.863 135.642 110.694 135.546L35.9028 93.5194V7.70791C35.9051 5.66436 36.7179 3.70516 38.1629 2.26015C39.6079 0.815139 41.5671 0.00231282 43.6107 0H183.976C186.019 0.00232139 187.979 0.815147 189.424 2.26016C190.869 3.70517 191.681 5.66436 191.684 7.70791V93.6288L117.136 135.546C116.151 136.095 115.042 136.383 113.915 136.381ZM112.287 135.336C113.778 135.764 115.379 135.586 116.739 134.839L190.872 93.1542V7.70791C190.87 5.87946 190.143 4.12649 188.85 2.83358C187.557 1.54068 185.804 0.813417 183.976 0.811359H43.6107C41.7822 0.813409 40.0293 1.54067 38.7363 2.83358C37.4434 4.12649 36.7162 5.87946 36.7141 7.70791V93.0444L41.5781 95.776L111.091 134.839C111.186 134.892 111.282 134.943 111.379 134.989C111.477 134.943 111.573 134.892 111.667 134.839L112.214 134.531L112.287 135.336Z"
      />
      <path
        className="fill-foreground"
        d="M225.789 73.9875L196.349 90.5392L191.278 93.3911L116.937 135.192C116.013 135.708 114.973 135.977 113.915 135.975C113.231 135.977 112.552 135.863 111.907 135.639C111.727 135.581 111.551 135.513 111.379 135.436C111.213 135.363 111.051 135.282 110.893 135.192L41.3793 96.1295L36.3083 93.2816L1.85807 73.9226C1.7644 73.8689 1.69568 73.7804 1.66683 73.6763C1.63798 73.5723 1.65132 73.4611 1.70396 73.3668C1.75675 73.2733 1.84449 73.2045 1.94792 73.1756C2.05134 73.1467 2.16201 73.16 2.25563 73.2126L36.3083 92.3485L41.3793 95.1964L111.29 134.482C111.522 134.613 111.763 134.725 112.012 134.819C112.118 134.86 112.227 134.896 112.337 134.929C113.031 135.142 113.762 135.212 114.484 135.135C115.206 135.059 115.905 134.837 116.54 134.482L191.278 92.4621L196.349 89.6102L225.391 73.2816C225.438 73.2555 225.489 73.2388 225.542 73.2324C225.594 73.226 225.648 73.2301 225.699 73.2444C225.75 73.2587 225.798 73.283 225.84 73.3158C225.882 73.3487 225.917 73.3894 225.943 73.4358C225.969 73.4821 225.986 73.5331 225.992 73.5859C225.999 73.6388 225.995 73.6923 225.98 73.7435C225.966 73.7948 225.942 73.8427 225.909 73.8845C225.876 73.9264 225.835 73.9614 225.789 73.9875Z"
      />
      <path
        className="fill-success"
        d="M66.5619 26.7751H55.2029C54.3422 26.7751 53.5167 26.4331 52.908 25.8245C52.2994 25.2159 51.9575 24.3904 51.9575 23.5296C51.9575 22.6689 52.2994 21.8434 52.908 21.2347C53.5167 20.6261 54.3422 20.2842 55.2029 20.2842H66.5619C67.4227 20.2842 68.2482 20.6261 68.8568 21.2347C69.4654 21.8434 69.8074 22.6689 69.8074 23.5296C69.8074 24.3904 69.4654 25.2159 68.8568 25.8245C68.2482 26.4331 67.4227 26.7751 66.5619 26.7751Z"
      />
      <path
        className="fill-border"
        d="M79.9494 37.7282H55.2029C54.3422 37.7282 53.5167 37.3863 52.908 36.7776C52.2994 36.169 51.9575 35.3435 51.9575 34.4827C51.9575 33.622 52.2994 32.7965 52.908 32.1879C53.5167 31.5792 54.3422 31.2373 55.2029 31.2373H79.9494C80.8101 31.2373 81.6356 31.5792 82.2442 32.1879C82.8528 32.7965 83.1948 33.622 83.1948 34.4827C83.1948 35.3435 82.8528 36.169 82.2442 36.7776C81.6356 37.3863 80.8101 37.7282 79.9494 37.7282Z"
      />
      <path
        className="fill-success"
        d="M149.087 66.9372H78.9047C78.0439 66.9372 77.2184 66.5952 76.6098 65.9866C76.0012 65.378 75.6592 64.5525 75.6592 63.6917C75.6592 62.831 76.0012 62.0055 76.6098 61.3969C77.2184 60.7882 78.0439 60.4463 78.9047 60.4463H149.087C149.948 60.4463 150.773 60.7882 151.382 61.3969C151.991 62.0055 152.333 62.831 152.333 63.6917C152.333 64.5525 151.991 65.378 151.382 65.9866C150.773 66.5952 149.948 66.9372 149.087 66.9372Z"
      />
      <path
        className="fill-border"
        d="M155.578 79.5133H72.0081C71.1474 79.5133 70.3219 79.1714 69.7133 78.5628C69.1046 77.9541 68.7627 77.1286 68.7627 76.2679C68.7627 75.4072 69.1046 74.5817 69.7133 73.973C70.3219 73.3644 71.1474 73.0225 72.0081 73.0225H155.578C156.439 73.0225 157.264 73.3644 157.873 73.973C158.482 74.5817 158.824 75.4072 158.824 76.2679C158.824 77.1286 158.482 77.9541 157.873 78.5628C157.264 79.1714 156.439 79.5133 155.578 79.5133Z"
      />
      <path
        className="fill-border"
        d="M155.578 91.6837H72.0081C71.1474 91.6837 70.3219 91.3418 69.7133 90.7332C69.1046 90.1245 68.7627 89.2991 68.7627 88.4383C68.7627 87.5776 69.1046 86.7521 69.7133 86.1434C70.3219 85.5348 71.1474 85.1929 72.0081 85.1929H155.578C156.439 85.1929 157.264 85.5348 157.873 86.1434C158.482 86.7521 158.824 87.5776 158.824 88.4383C158.824 89.2991 158.482 90.1245 157.873 90.7332C157.264 91.3418 156.439 91.6837 155.578 91.6837Z"
      />
    </svg>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authMagicLinkRequestCopy = COPY
