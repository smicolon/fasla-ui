"use client"

import * as React from "react"
import { Mail, Wrench } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { Progress } from "../../ui/progress/progress"

/*
 * Figma: `Error State` (42556:548), Type=Maintenance Mode.
 *
 * A planned-downtime page on a muted field: a wrench card, a status pill,
 * the expected return time, the upgrade's progress and a sign-up to hear
 * when it is back. It has no status code.
 *
 * `progress` sets the bar; pass a new value as the job reports it. The form
 * is real: it checks the address itself, the button shows its spinner while
 * `onSubscribe` runs, and then the form gives way to `success`, or keeps
 * what was typed and shows `error`.
 *
 * Mobile first: the base classes are Figma's Mobile (360), where the field
 * and button stack; `md:` is its Tablet (768) and `lg:` its Desktop (1440).
 * Direction is the page's `dir`: the bar fills from the inline start, so it
 * runs right to left in Arabic.
 */

export interface ErrorStateMaintenanceModeCopy {
  /** The pill above the heading. Hidden when empty. */
  badge: React.ReactNode
  /** The page's heading, an `h1`. Name what is happening. */
  heading: React.ReactNode
  /** The line under the heading: when it will be back. */
  description: React.ReactNode
  /** What the upgrade is doing now, under the bar's start. */
  stage: React.ReactNode
  /** The percentage under the bar's end, from `progress`. */
  complete: (percent: number) => React.ReactNode
  /** The email field's placeholder, and its accessible name. */
  emailPlaceholder: string
  /** Under the field when it is empty or not an address. */
  emailError: React.ReactNode
  /** The submit button. */
  submitLabel: React.ReactNode
  /** Read out while `onSubscribe` runs. */
  pendingLabel: string
  /** Replaces the form once `onSubscribe` resolves. */
  success: React.ReactNode
  /** Shown under the form when `onSubscribe` rejects. */
  error: React.ReactNode
  /** The small print at the foot. Hidden when empty. */
  note: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateMaintenanceModeCopy> = {
  en: {
    badge: "Scheduled maintenance",
    heading: "We’ll be back shortly",
    description:
      "Fasla is being upgraded. Everything will be back online at around 03:40 UTC — roughly 20 minutes from now.",
    stage: "Migrating workspace data",
    complete: (percent) => `${percent}% complete`,
    emailPlaceholder: "you@company.com",
    emailError: "Enter an email address, like you@company.com.",
    submitLabel: "Notify me",
    pendingLabel: "Signing you up",
    success: "Done. We’ll email you as soon as Fasla is back.",
    error: "That didn’t go through. Try again in a moment.",
    note: "Follow live progress on the Fasla status page.",
  },
  ar: {
    badge: "أعمال صيانة",
    heading: "سنعود قريبًا",
    description: (
      <>
        يجري تحديث فاصلة. سيعود كل شيء للعمل عند الساعة <bdi dir="ltr">03:40</bdi> بالتوقيت العالمي، أي بعد نحو{" "}
        <bdi dir="ltr">20</bdi> دقيقة من الآن.
      </>
    ),
    stage: "نقل بيانات مساحة العمل",
    complete: (percent) => (
      <>
        اكتمل <bdi dir="ltr">{percent}%</bdi>
      </>
    ),
    emailPlaceholder: "you@company.com",
    emailError: (
      <>
        أدخل بريدًا إلكترونيًا، مثل <bdi dir="ltr">you@company.com</bdi>.
      </>
    ),
    submitLabel: "أعلمني",
    pendingLabel: "جارٍ التسجيل",
    success: "تم. سنراسلك فور عودة فاصلة.",
    error: "لم يكتمل الطلب. حاول مجددًا بعد قليل.",
    note: "تابع التقدم المباشر على صفحة حالة فاصلة.",
  },
}

type Status = "idle" | "pending" | "success" | "error"

export interface ErrorStateMaintenanceModeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateMaintenanceModeCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * How far the upgrade has got, from 0 to 100.
   * @default 65
   */
  progress?: number
  /**
   * The glyph in the card. Pass `null` to drop the card.
   * @default a wrench
   */
  icon?: React.ReactNode
  /**
   * Sends the sign-up. The button shows its spinner until the promise
   * settles; then the form gives way to `success`, or shows `error`.
   */
  onSubscribe?: (email: string) => Promise<void> | void
  /**
   * Turns the sign-up off: the field and the button are disabled.
   * @default false
   */
  disabled?: boolean
}

export function ErrorStateMaintenanceMode({
  locale = "en",
  badge,
  heading,
  description,
  stage,
  complete,
  emailPlaceholder,
  emailError,
  submitLabel,
  pendingLabel,
  success,
  error,
  note,
  progress = 65,
  icon,
  onSubscribe,
  disabled,
  className,
  ...props
}: ErrorStateMaintenanceModeProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const stageId = React.useId()
  const [status, setStatus] = React.useState<Status>("idle")
  const [emailInvalid, setEmailInvalid] = React.useState(false)
  const pending = status === "pending"
  const pill = badge ?? copy.badge
  const small = note ?? copy.note
  const percent = Math.round(Math.min(100, Math.max(0, progress)))
  const placeholder = emailPlaceholder ?? copy.emailPlaceholder
  const glyph = icon === undefined ? <Wrench size={30} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[30px]" /> : icon

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = event.currentTarget.elements.namedItem("email") as HTMLInputElement
    if (!email.checkValidity()) {
      setEmailInvalid(true)
      email.focus()
      return
    }
    setEmailInvalid(false)
    setStatus("pending")
    try {
      await onSubscribe?.(email.value.trim())
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-6 text-center md:max-w-none md:gap-7 lg:max-w-[620px]">
        {glyph ? (
          <div className="flex size-14 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm md:size-[72px]">
            {glyph}
          </div>
        ) : null}
        <div className="flex w-full flex-col items-center gap-3">
          {pill ? (
            <Badge variant="soft" tone="warning">
              {pill}
            </Badge>
          ) : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>
        <div className="flex w-full flex-col gap-2.5">
          <Progress value={percent} showPercentage={false} aria-labelledby={stageId} />
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span id={stageId}>{stage ?? copy.stage}</span>
            <span className="font-medium">{(complete ?? copy.complete)(percent)}</span>
          </div>
        </div>
        {status === "success" ? (
          <p role="status" className="text-sm text-foreground">
            {success ?? copy.success}
          </p>
        ) : (
          <div className="flex w-full flex-col items-center gap-2 md:w-[460px]">
            <form
              noValidate
              onSubmit={handleSubmit}
              className="flex w-full flex-col items-stretch gap-2.5 text-start md:flex-row md:items-start md:gap-3"
            >
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={placeholder}
                aria-label={placeholder}
                startIcon={<Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
                invalid={emailInvalid}
                error={emailError ?? copy.emailError}
                disabled={disabled || pending}
                onChange={() => emailInvalid && setEmailInvalid(false)}
                className="md:flex-1"
              />
              <Button type="submit" loading={pending} loadingLabel={pendingLabel ?? copy.pendingLabel} disabled={disabled}>
                {submitLabel ?? copy.submitLabel}
              </Button>
            </form>
            <p role="status" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </div>
        )}
        {small ? <p className="text-xs text-muted-foreground">{small}</p> : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateMaintenanceModeCopy = COPY
