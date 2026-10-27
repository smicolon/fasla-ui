"use client"

import * as React from "react"
import { ArrowRight, Mail, Phone, Shield, Smartphone } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { Input } from "../../ui/input/input"
import { Select } from "../../ui/select/select"
import { SocialIcon } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Phone Number Sign In.
 *
 * Sign in with a text message: a phone tile and heading, the country and the
 * number side by side, Send verification code, a remember-this-device box,
 * then email and WhatsApp as the other ways to get a code, over a privacy
 * note.
 *
 * The number groups itself as it is typed, in the selected country's pattern
 * (7 9012 3456 for Jordan), without moving the caret, and Send stays off
 * until the number is complete. The number and the dial code stay
 * left-to-right in Arabic, as dial strings must.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 448px from Tablet up and
 * fills the width on a phone, where the country sits over the number.
 * Direction is the page's `dir`; every side is a logical one.
 */

export interface AuthPhoneNumberSignInCountry {
  /** The ISO code, shown with the dial code: "JO". */
  code: string
  /** The dial code, with its plus: "+962". */
  dialCode: string
  /** How the national number groups, in digits: Jordan's 7 9012 3456 is [1, 4, 4]. */
  groups: number[]
}

export interface AuthPhoneNumberSignInValues {
  country: string
  dialCode: string
  /** The national number, digits only. */
  phone: string
  remember: boolean
}

export type AuthPhoneNumberSignInAlternative = "email" | "whatsapp"

export interface AuthPhoneNumberSignInCopy {
  /** The card's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  countryLabel: React.ReactNode
  phoneLabel: React.ReactNode
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  rememberLabel: string
  /** The word between the two rules over the other ways in. */
  dividerLabel: React.ReactNode
  emailLabel: React.ReactNode
  whatsappLabel: React.ReactNode
  /** The note at the foot of the card, after a shield. Hidden when empty. */
  note: React.ReactNode
}

/** The countries the select offers, Jordan first as in Figma. */
const COUNTRIES: AuthPhoneNumberSignInCountry[] = [
  { code: "JO", dialCode: "+962", groups: [1, 4, 4] },
  { code: "SA", dialCode: "+966", groups: [2, 3, 4] },
  { code: "AE", dialCode: "+971", groups: [2, 3, 4] },
  { code: "KW", dialCode: "+965", groups: [4, 4] },
  { code: "QA", dialCode: "+974", groups: [4, 4] },
  { code: "BH", dialCode: "+973", groups: [4, 4] },
  { code: "OM", dialCode: "+968", groups: [4, 4] },
  { code: "EG", dialCode: "+20", groups: [3, 3, 4] },
  { code: "GB", dialCode: "+44", groups: [4, 6] },
  { code: "US", dialCode: "+1", groups: [3, 3, 4] },
]

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthPhoneNumberSignInCopy> = {
  en: {
    heading: "Sign in with your phone",
    description: "We will text you a 6-digit code. Standard message rates may apply.",
    countryLabel: "Country",
    phoneLabel: "Phone number",
    submitLabel: "Send verification code",
    pendingLabel: "Sending the code",
    error: "We couldn’t send the code. Check the number and try again.",
    rememberLabel: "Remember my device so I don’t need a code next time",
    dividerLabel: "or",
    emailLabel: "Continue with email",
    whatsappLabel: "Get the code on WhatsApp",
    note: "Your number is only used to verify your identity and is never shown to other members.",
  },
  ar: {
    heading: "سجّل الدخول برقم هاتفك",
    description: (
      <>
        سنرسل إليك رمزًا من <bdi dir="ltr">6</bdi> أرقام في رسالة نصية، وقد تُطبَّق رسوم الرسائل المعتادة.
      </>
    ),
    countryLabel: "الدولة",
    phoneLabel: "رقم الهاتف",
    submitLabel: "إرسال رمز التحقق",
    pendingLabel: "جارٍ إرسال الرمز",
    error: "تعذّر إرسال الرمز. تحقّق من الرقم ثم حاول مجددًا.",
    rememberLabel: "تذكّر هذا الجهاز كي لا أحتاج إلى رمز في المرة القادمة",
    dividerLabel: "أو",
    emailLabel: "المتابعة بالبريد الإلكتروني",
    whatsappLabel: (
      <>
        استلام الرمز عبر <bdi dir="ltr">WhatsApp</bdi>
      </>
    ),
    note: "لا نستخدم رقمك إلا للتحقق من هويتك، ولا يظهر لأي عضو آخر.",
  },
}

export interface AuthPhoneNumberSignInProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthPhoneNumberSignInCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The countries the select offers. */
  countries?: AuthPhoneNumberSignInCountry[]
  /**
   * The country chosen on first render, by its code.
   * @default the first country
   */
  defaultCountry?: string
  /**
   * Runs when Send verification code is pressed with a complete number.
   * While its promise is pending the button shows its spinner and the form
   * is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthPhoneNumberSignInValues) => Promise<void> | void
  /** Runs when one of the other ways in is pressed. That button shows its spinner while the promise is pending. */
  onAlternativeSelect?: (method: AuthPhoneNumberSignInAlternative) => Promise<void> | void
}

/**
 * Figma's entrance: the card's parts fade in and rise, one after another.
 * Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>, { rise = 12, duration = 320, stagger = 50 } = {}) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const parts = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance]"))
    const animations = parts.map((part, index) =>
      part.animate(
        [{ opacity: 0, transform: `translateY(${rise}px)` }, { opacity: 1, transform: "none" }],
        { duration, delay: index * stagger, easing: "cubic-bezier(0, 0, 0.2, 1)", fill: "backwards" }
      )
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref, rise, duration, stagger])
}

/** The digits, grouped by `groups` with spaces; digits past the pattern are dropped. */
function formatNumber(digits: string, groups: number[]) {
  const parts: string[] = []
  let rest = digits.slice(0, groups.reduce((sum, size) => sum + size, 0))
  for (const size of groups) {
    if (!rest) break
    parts.push(rest.slice(0, size))
    rest = rest.slice(size)
  }
  return parts.join(" ")
}

/** Western digits from any input, Arabic-Indic ones included. */
const toDigits = (text: string) =>
  text
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/\D/g, "")

/**
 * The dial string as one left-to-right run, so an Arabic page never shows
 * "962+ JO". Left-to-right marks rather than an isolate, which WebKit ignores
 * in the select's value.
 */
const ltrRun = (text: string) => `\u200E${text}\u200E`

export function AuthPhoneNumberSignIn({
  locale = "en",
  heading,
  description,
  countryLabel,
  phoneLabel,
  submitLabel,
  pendingLabel,
  error,
  rememberLabel,
  dividerLabel,
  emailLabel,
  whatsappLabel,
  note,
  countries = COUNTRIES,
  defaultCountry,
  onSubmit,
  onAlternativeSelect,
  className,
  ...props
}: AuthPhoneNumberSignInProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const phoneRef = React.useRef<HTMLInputElement>(null)
  const caret = React.useRef<number | null>(null)
  const [countryCode, setCountryCode] = React.useState(defaultCountry ?? countries[0]?.code ?? "")
  const [digits, setDigits] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [pendingAlternative, setPendingAlternative] = React.useState<AuthPhoneNumberSignInAlternative | null>(null)
  const country = countries.find((entry) => entry.code === countryCode) ?? countries[0]
  const groups = country?.groups ?? [10]
  const length = groups.reduce((sum, size) => sum + size, 0)
  const formatted = formatNumber(digits, groups)
  const complete = digits.length === length
  const busy = status === "pending" || pendingAlternative !== null
  const subline = description ?? copy.description
  const footnote = note ?? copy.note
  useEntrance(cardRef)

  // Put the caret back after the same number of digits once the grouping
  // has changed, so typing or deleting mid-number never jumps to the end.
  React.useLayoutEffect(() => {
    const input = phoneRef.current
    if (!input || caret.current === null || document.activeElement !== input) return
    let seen = 0
    let position = formatted.length
    for (let index = 0; index < formatted.length; index++) {
      if (seen === caret.current) {
        position = index
        break
      }
      if (/\d/.test(formatted[index] ?? "")) seen++
    }
    if (caret.current === 0) position = 0
    input.setSelectionRange(position, position)
    caret.current = null
  }, [formatted])

  const changeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = event.target
    caret.current = toDigits(value.slice(0, selectionStart ?? value.length)).length
    setDigits(toDigits(value).slice(0, length))
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!complete || !country || !onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({ country: country.code, dialCode: country.dialCode, phone: digits, remember: data.get("remember") === "on" })
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  const chooseAlternative = async (method: AuthPhoneNumberSignInAlternative) => {
    if (!onAlternativeSelect) return
    setPendingAlternative(method)
    try {
      await onAlternativeSelect(method)
    } finally {
      setPendingAlternative(null)
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex justify-center bg-muted p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div
        ref={cardRef}
        className="flex w-full flex-col items-start gap-7 rounded-xl border border-border bg-card p-8 text-card-foreground shadow-md md:max-w-[448px]"
      >
        <div data-entrance="" className="flex w-full flex-col items-start gap-2">
          <div aria-hidden="true" className="flex size-12 items-center justify-center rounded-md bg-muted text-foreground">
            <Smartphone size={22} strokeWidth={1.5} absoluteStrokeWidth className="size-[22px]" />
          </div>
          <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <form data-entrance="" onSubmit={submit} className="w-full">
          <fieldset disabled={busy} className="flex w-full min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-end">
              <Select
                name="country"
                label={countryLabel ?? copy.countryLabel}
                value={countryCode}
                onValueChange={(value) => {
                  if (!value) return
                  setCountryCode(value)
                  const next = countries.find((entry) => entry.code === value)
                  const nextLength = next ? next.groups.reduce((sum, size) => sum + size, 0) : length
                  setDigits((current) => current.slice(0, nextLength))
                }}
                items={countries.map((entry) => ({ value: entry.code, label: ltrRun(`${entry.code} ${entry.dialCode}`) }))}
                className="w-full md:w-[132px] md:shrink-0"
              />
              <Input
                ref={phoneRef}
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel-national"
                dir="ltr"
                required
                label={phoneLabel ?? copy.phoneLabel}
                placeholder={formatNumber("7901234567890123".slice(0, length), groups)}
                value={formatted}
                onChange={changeNumber}
                startIcon={<Phone size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
                className="min-w-0 flex-1 rtl:[&_input]:text-right"
              />
            </div>
            <Button
              type="submit"
              disabled={!complete}
              loading={status === "pending"}
              loadingLabel={pendingLabel ?? copy.pendingLabel}
              className="w-full transition-opacity duration-150 motion-reduce:transition-none"
            >
              {submitLabel ?? copy.submitLabel}
              <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
            </Button>
            <Checkbox name="remember" size="sm" label={rememberLabel ?? copy.rememberLabel} />
            <p role="alert" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>

        <div data-entrance="" className="flex w-full items-center gap-3">
          <div aria-hidden="true" className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">{dividerLabel ?? copy.dividerLabel}</span>
          <div aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>

        <div data-entrance="" className="flex w-full flex-col gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={busy && pendingAlternative !== "email"}
            loading={pendingAlternative === "email"}
            onClick={() => chooseAlternative("email")}
            className="w-full"
          >
            <Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
            {emailLabel ?? copy.emailLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy && pendingAlternative !== "whatsapp"}
            loading={pendingAlternative === "whatsapp"}
            onClick={() => chooseAlternative("whatsapp")}
            className="w-full"
          >
            <SocialIcon platform="whatsapp" className="size-4" />
            {whatsappLabel ?? copy.whatsappLabel}
          </Button>
        </div>

        {footnote ? (
          <p data-entrance="" className="flex w-full items-start gap-2 text-xs text-muted-foreground">
            <span aria-hidden="true" className="flex h-[1lh] shrink-0 items-center">
              <Shield size={14} strokeWidth={1.5} absoluteStrokeWidth className="size-3.5" />
            </span>
            <span>{footnote}</span>
          </p>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authPhoneNumberSignInCopy = COPY

/** The default countries, with their dial codes and number patterns. */
export const authPhoneNumberSignInCountries = COUNTRIES
