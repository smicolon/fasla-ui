"use client"

import * as React from "react"
import { ArrowRight, Fingerprint, KeyRound, Mail, MessageSquare, ShieldCheck } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { Radio } from "../../ui/radio/radio"

/*
 * Figma: `Authentications` (42586:4669), Type=Two-Factor Method Chooser.
 *
 * Where someone picks their second step: the logo, a heading, then one row
 * per method (an icon tile, the method and a line about it, a radio) and
 * Continue and Cancel. The chosen row is filled `accent` with a 2px
 * `foreground` ring; the ring moves to whichever row is picked.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The list keeps 520px from Tablet up; on
 * a phone it fills the width and the two buttons stack, Continue on top.
 * Direction is the page's `dir`; every side is a logical one.
 */

export interface AuthTwoFactorMethodChooserMethod {
  /** The radio's value, passed to `onSubmit`. */
  value: string
  label: React.ReactNode
  /** The line under the label. */
  description: React.ReactNode
  /** The glyph in the row's tile, 20px. */
  icon?: React.ReactNode
}

export interface AuthTwoFactorMethodChooserLink {
  label: React.ReactNode
  href: string
}

export interface AuthTwoFactorMethodChooserCopy {
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** One row per method, in order. */
  methods: AuthTwoFactorMethodChooserMethod[]
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the buttons when `onSubmit` rejects. */
  error: React.ReactNode
  /** The outline link beside Continue. Hidden when null. */
  cancelLink: AuthTwoFactorMethodChooserLink | null
}

const tile = (Icon: typeof KeyRound) => <Icon size={19} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthTwoFactorMethodChooserCopy> = {
  en: {
    heading: "How would you like to verify?",
    description: "Choose a second step to confirm it is really you. You can change this later in security settings.",
    methods: [
      { value: "authenticator", label: "Authenticator app", description: "Enter a 6-digit code from Fasla Authenticator.", icon: tile(ShieldCheck) },
      { value: "sms", label: "Text message", description: <>Send a code to <bdi dir="ltr">+962 7•• ••• 418</bdi>.</>, icon: tile(MessageSquare) },
      { value: "email", label: "Email", description: <>Send a code to <bdi dir="ltr">a•••@northwind.co</bdi>.</>, icon: tile(Mail) },
      { value: "backup-code", label: "Backup code", description: "Use one of your 10 single-use recovery codes.", icon: tile(KeyRound) },
      { value: "passkey", label: "Passkey", description: "Use Touch ID, Face ID or a security key.", icon: tile(Fingerprint) },
    ],
    submitLabel: "Continue",
    pendingLabel: "Continuing",
    error: "We couldn’t continue with that method. Try again or choose another.",
    cancelLink: { label: "Cancel", href: "#sign-in" },
  },
  ar: {
    heading: "كيف تودّ التحقق؟",
    description: "اختر خطوة ثانية لتأكيد هويتك. يمكنك تغيير ذلك لاحقًا من إعدادات الأمان.",
    methods: [
      {
        value: "authenticator",
        label: "تطبيق المصادقة",
        description: "أدخل رمزًا من 6 أرقام من تطبيق المصادقة في فاصلة.",
        icon: tile(ShieldCheck),
      },
      { value: "sms", label: "رسالة نصية", description: <>إرسال رمز إلى <bdi dir="ltr">+962 7•• ••• 418</bdi>.</>, icon: tile(MessageSquare) },
      { value: "email", label: "البريد الإلكتروني", description: <>إرسال رمز إلى <bdi dir="ltr">a•••@northwind.co</bdi>.</>, icon: tile(Mail) },
      { value: "backup-code", label: "رمز احتياطي", description: "استخدم أحد رموز الاسترداد العشرة، وكلٌّ منها يُستخدم مرة واحدة.", icon: tile(KeyRound) },
      {
        value: "passkey",
        label: "مفتاح المرور",
        description: (
          <>
            استخدم <bdi dir="ltr">Touch ID</bdi> أو <bdi dir="ltr">Face ID</bdi> أو مفتاح أمان.
          </>
        ),
        icon: tile(Fingerprint),
      },
    ],
    submitLabel: "متابعة",
    pendingLabel: "جارٍ المتابعة",
    error: "تعذّرت المتابعة بهذه الطريقة. حاول مجددًا أو اختر طريقة أخرى.",
    cancelLink: { label: "إلغاء", href: "#sign-in" },
  },
}

export interface AuthTwoFactorMethodChooserProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthTwoFactorMethodChooserCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 40px icon-only Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * The method picked at first, as Figma draws it. `null` starts with none,
   * and Continue waits until one is picked.
   * @default "authenticator"
   */
  defaultMethod?: string | null
  /**
   * Runs when Continue is pressed, with the picked method's `value`. While
   * its promise is pending the button shows its spinner; a rejection shows
   * `error`.
   */
  onSubmit?: (values: { method: string }) => Promise<void> | void
}

/** Whether the visitor asks for reduced motion. False on the server. */
const reducedMotion = () => typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Figma's entrance: the heading, the rows and the buttons fade in and rise,
 * one after another. Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function" || reducedMotion()) return
    const parts = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance]"))
    const animations = parts.map((part, index) =>
      part.animate(
        [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
        { duration: 320, delay: index * 50, easing: "cubic-bezier(0, 0, 0.2, 1)", fill: "backwards" }
      )
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

export function AuthTwoFactorMethodChooser({
  locale = "en",
  heading,
  description,
  methods,
  submitLabel,
  pendingLabel,
  error,
  cancelLink,
  logo,
  defaultMethod = "authenticator",
  onSubmit,
  className,
  ...props
}: AuthTwoFactorMethodChooserProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rowsId = React.useId()
  const columnRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const [method, setMethod] = React.useState<string | null>(defaultMethod)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const list = methods ?? copy.methods
  const subline = description ?? copy.description
  const cancel = cancelLink === undefined ? copy.cancelLink : cancelLink
  useEntrance(columnRef)

  const choose = (value: string) => {
    if (value === method) return
    setMethod(value)
    if (status === "error") setStatus("idle")
    // The rows not picked recede to 85% for 200ms, so the eye lands on the choice.
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-method]")
    if (!rows || reducedMotion()) return
    rows.forEach((row) => {
      if (row.dataset.method === value || typeof row.animate !== "function") return
      row.animate([{ opacity: 1 }, { opacity: 0.85 }, { opacity: 1 }], { duration: 400, easing: "ease-in-out" })
    })
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!method || !onSubmit) return
    setStatus("pending")
    try {
      await onSubmit({ method })
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div ref={columnRef} className="flex w-full flex-col gap-7 md:max-w-[520px]">
        <div data-entrance="" className="flex w-full flex-col items-start gap-2">
          {logo ? <div className="flex size-10 items-center justify-center [&>svg]:size-full">{logo}</div> : null}
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <form onSubmit={submit} className="w-full">
          <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col gap-7">
            <div ref={listRef} data-entrance="" role="radiogroup" aria-labelledby={headingId} className="flex w-full flex-col gap-3">
              {list.map((item) => {
                const selected = item.value === method
                const labelId = `${rowsId}-${item.value}-label`
                const descriptionId = `${rowsId}-${item.value}-description`
                return (
                  <div
                    key={item.value}
                    data-method={item.value}
                    onClick={() => choose(item.value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3.5 rounded-lg p-4 ring-inset transition-[background-color,box-shadow] duration-[140ms] motion-reduce:transition-none md:duration-[180ms]",
                      selected ? "bg-accent ring-2 ring-foreground" : "bg-card ring-1 ring-border"
                    )}
                  >
                    {item.icon ? (
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-md text-foreground transition-colors motion-reduce:transition-none",
                          selected ? "bg-card" : "bg-muted"
                        )}
                      >
                        {item.icon}
                      </div>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span id={labelId} className="text-sm font-semibold text-foreground">
                        {item.label}
                      </span>
                      <span id={descriptionId} className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                    <Radio
                      name="method"
                      value={item.value}
                      checked={selected}
                      onChange={() => choose(item.value)}
                      aria-labelledby={labelId}
                      aria-describedby={descriptionId}
                      className="shrink-0"
                    />
                  </div>
                )
              })}
            </div>

            <div data-entrance="" className="flex w-full flex-col gap-3 md:flex-row">
              <Button
                type="submit"
                disabled={!method}
                loading={status === "pending"}
                loadingLabel={pendingLabel ?? copy.pendingLabel}
                className="w-full md:flex-1"
              >
                {submitLabel ?? copy.submitLabel}
                <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
              </Button>
              {cancel ? (
                <a href={cancel.href} className={buttonVariants({ variant: "outline", className: "w-full md:flex-1" })}>
                  {cancel.label}
                </a>
              ) : null}
            </div>
            <p role="alert" className="-mt-4 text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authTwoFactorMethodChooserCopy = COPY
