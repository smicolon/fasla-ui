"use client"

import * as React from "react"
import { CircleCheck, CircleDot, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { Progress } from "../../ui/progress/progress"

/*
 * Figma: `Authentications` (42586:4669), Type=Sign Up + Password Strength.
 *
 * The last step of a sign-up: a card with the logo, a heading, the password
 * field, a strength meter, the checklist of rules, the confirm field and
 * Create account, over a note that the password is encrypted.
 *
 * The meter and the checklist follow what is typed: each rule ticks as it is
 * met, and the field turns Success once the required rules pass. That is
 * presentation, not validation a server can rely on.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 472px from Tablet up and
 * fills the width on a phone. Direction is the page's `dir`; the meter fills
 * from the inline start, so it fills from the right in Arabic.
 */

export interface AuthSignUpPasswordStrengthRule {
  /** What the rule asks for. */
  label: React.ReactNode
  /** Whether the password meets it. */
  test: (password: string) => boolean
  /** A required rule must pass before the form sends and before the field turns Success. */
  required?: boolean
}

export interface AuthSignUpPasswordStrengthValues {
  password: string
}

export interface AuthSignUpPasswordStrengthCopy {
  /** The card's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  passwordLabel: React.ReactNode
  passwordPlaceholder: string
  /** The eye button's name while the password is hidden. */
  showPassword: string
  /** The eye button's name while the password shows. */
  hidePassword: string
  /** The label over the meter. */
  strengthLabel: string
  /** The meter's verdict, by how many rules pass. */
  strengthLevels: { weak: React.ReactNode; fair: React.ReactNode; strong: React.ReactNode }
  /** The checklist, in order. */
  rules: AuthSignUpPasswordStrengthRule[]
  /** Read after a rule that is met; the check alone can't say it. */
  ruleMetLabel: string
  /** Read after a rule that is not met yet. */
  ruleUnmetLabel: string
  confirmLabel: React.ReactNode
  confirmPlaceholder: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Under the password field when a required rule fails on send. */
  rulesError: React.ReactNode
  /** Under the confirm field when the two passwords differ on send. */
  mismatchError: React.ReactNode
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The note under the card's button, after a shield. Hidden when empty. */
  note: React.ReactNode
}

/** A short list of passwords too common to accept. */
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "123456789",
  "1234567890",
  "qwerty123",
  "qwertyuiop",
  "iloveyou",
  "welcome123",
  "letmein123",
  "admin12345",
])

const RULE_TESTS = {
  length: (password: string) => password.length >= 10,
  // Has both an upper- and a lower-case letter, in any script that has case.
  cases: (password: string) => password !== password.toLowerCase() && password !== password.toUpperCase(),
  number: (password: string) => /\d/.test(password),
  // Anything but a Latin or Arabic letter, a digit or a space.
  special: (password: string) => /[^\w\s\u0600-\u06FF]|_/.test(password),
  common: (password: string) => password.length > 0 && !COMMON_PASSWORDS.has(password.toLowerCase()),
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthSignUpPasswordStrengthCopy> = {
  en: {
    heading: "Set up your password",
    description: "One last step — choose a password for alex@northwind.co.",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    showPassword: "Show password",
    hidePassword: "Hide password",
    strengthLabel: "Password strength",
    strengthLevels: { weak: "Weak", fair: "Fair", strong: "Strong" },
    rules: [
      { label: "At least 10 characters", test: RULE_TESTS.length, required: true },
      { label: "One uppercase and one lowercase letter", test: RULE_TESTS.cases, required: true },
      { label: "One number", test: RULE_TESTS.number, required: true },
      { label: "One special character (!@#$)", test: RULE_TESTS.special },
      { label: "Not a commonly used password", test: RULE_TESTS.common },
    ],
    ruleMetLabel: ", met",
    ruleUnmetLabel: ", not met yet",
    confirmLabel: "Confirm password",
    confirmPlaceholder: "Re-enter your password",
    submitLabel: "Create account",
    pendingLabel: "Creating your account",
    rulesError: "Meet the first three rules to continue.",
    mismatchError: "The passwords don’t match.",
    error: "We couldn’t create your account. Try again in a moment.",
    note: "Your password is encrypted and never shared.",
  },
  ar: {
    heading: "اختر كلمة المرور",
    description: (
      <>
        خطوة أخيرة: اختر كلمة مرور لحساب <bdi dir="ltr">alex@northwind.co</bdi>.
      </>
    ),
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    strengthLabel: "قوة كلمة المرور",
    strengthLevels: { weak: "ضعيفة", fair: "متوسطة", strong: "قوية" },
    rules: [
      { label: "10 أحرف على الأقل", test: RULE_TESTS.length, required: true },
      { label: "حرف لاتيني كبير وآخر صغير", test: RULE_TESTS.cases, required: true },
      { label: "رقم واحد على الأقل", test: RULE_TESTS.number, required: true },
      {
        label: (
          <>
            رمز خاص واحد (<bdi dir="ltr">!@#$</bdi>)
          </>
        ),
        test: RULE_TESTS.special,
      },
      { label: "ليست من كلمات المرور الشائعة", test: RULE_TESTS.common },
    ],
    ruleMetLabel: "، مستوفى",
    ruleUnmetLabel: "، غير مستوفى بعد",
    confirmLabel: "تأكيد كلمة المرور",
    confirmPlaceholder: "أعد إدخال كلمة المرور",
    submitLabel: "إنشاء الحساب",
    pendingLabel: "جارٍ إنشاء حسابك",
    rulesError: "استوفِ الشروط الثلاثة الأولى للمتابعة.",
    mismatchError: "كلمتا المرور غير متطابقتين.",
    error: "تعذّر إنشاء حسابك. حاول مجددًا بعد قليل.",
    note: "كلمة مرورك مشفّرة ولا نشاركها مع أحد.",
  },
}

export interface AuthSignUpPasswordStrengthProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthSignUpPasswordStrengthCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 40px icon-only Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * Runs when the form is sent with the required rules met and both fields
   * matching. While its promise is pending the button shows its spinner and
   * the form is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthSignUpPasswordStrengthValues) => Promise<void> | void
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

/** Figma's tick pop: a rule that turns true scales up from 0.8 over 200ms. */
function popIn(node: HTMLElement | null) {
  if (!node || typeof node.animate !== "function") return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  node.animate([{ transform: "scale(0.8)" }, { transform: "scale(1)" }], {
    duration: 200,
    easing: "cubic-bezier(0, 0, 0.2, 1)",
  })
}

export function AuthSignUpPasswordStrength({
  locale = "en",
  heading,
  description,
  passwordLabel,
  passwordPlaceholder,
  showPassword,
  hidePassword,
  strengthLabel,
  strengthLevels,
  rules,
  ruleMetLabel,
  ruleUnmetLabel,
  confirmLabel,
  confirmPlaceholder,
  submitLabel,
  pendingLabel,
  rulesError,
  mismatchError,
  error,
  note,
  logo,
  onSubmit,
  className,
  ...props
}: AuthSignUpPasswordStrengthProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const strengthId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [problem, setProblem] = React.useState<"rules" | "mismatch" | null>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const ruleList = rules ?? copy.rules
  const levels = strengthLevels ?? copy.strengthLevels
  const subline = description ?? copy.description
  const footnote = note ?? copy.note
  useEntrance(cardRef)

  const met = ruleList.map((rule) => rule.test(password))
  const requiredMet = ruleList.every((rule, index) => !rule.required || met[index])
  const requiredCount = ruleList.filter((rule) => rule.required).length
  const requiredPassed = ruleList.filter((rule, index) => rule.required && met[index]).length
  const passed = met.filter(Boolean).length
  // Strong once every required rule passes, with the optional ones filling
  // the rest of the bar; Fair one short of that; Weak below.
  const level: keyof typeof levels | null =
    password.length === 0 ? null : requiredMet ? "strong" : requiredPassed >= requiredCount - 1 ? "fair" : "weak"
  const optionalCount = ruleList.length - requiredCount
  const value =
    level === "strong"
      ? 85 + (optionalCount > 0 ? ((passed - requiredCount) / optionalCount) * 15 : 15)
      : (passed / Math.max(ruleList.length, 1)) * 100
  const levelColour = { weak: "text-destructive", fair: "text-warning", strong: "text-success" }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!requiredMet) return setProblem("rules")
    if (confirm !== password) return setProblem("mismatch")
    setProblem(null)
    if (!onSubmit) return
    setStatus("pending")
    try {
      await onSubmit({ password })
      setStatus("idle")
    } catch {
      setStatus("error")
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
        className="flex w-full flex-col items-start gap-7 rounded-xl border border-border bg-card p-8 text-card-foreground shadow-md md:max-w-[472px]"
      >
        <div data-entrance="" className="flex w-full flex-col items-start gap-2">
          {logo ? <div className="flex size-10 items-center justify-center [&>svg]:size-full">{logo}</div> : null}
          <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <form data-entrance="" noValidate onSubmit={submit} className="w-full">
          <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col gap-4">
            <PasswordInput
              name="password"
              autoComplete="new-password"
              label={passwordLabel ?? copy.passwordLabel}
              placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
              showLabel={showPassword ?? copy.showPassword}
              hideLabel={hidePassword ?? copy.hidePassword}
              value={password}
              onChange={(next) => {
                setPassword(next)
                if (problem === "rules") setProblem(null)
              }}
              status={requiredMet ? "success" : "default"}
              invalid={problem === "rules"}
              error={rulesError ?? copy.rulesError}
            />

            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span id={strengthId} className="font-medium text-muted-foreground">
                  {strengthLabel ?? copy.strengthLabel}
                </span>
                <span aria-live="polite" className="font-semibold">
                  {level ? <LevelLabel key={level} className={levelColour[level]}>{levels[level]}</LevelLabel> : null}
                </span>
              </div>
              <Progress
                size="sm"
                value={value}
                showPercentage={false}
                aria-labelledby={strengthId}
                className="[&_[data-slot=indicator]]:duration-200 [&_[data-slot=indicator]]:ease-out"
              />
            </div>

            <ul className="flex w-full flex-col gap-2 rounded-md bg-muted p-4">
              {ruleList.map((rule, index) => (
                <RuleRow
                  key={index}
                  met={met[index] ?? false}
                  metLabel={ruleMetLabel ?? copy.ruleMetLabel}
                  unmetLabel={ruleUnmetLabel ?? copy.ruleUnmetLabel}
                >
                  {rule.label}
                </RuleRow>
              ))}
            </ul>

            <PasswordInput
              name="confirm"
              autoComplete="new-password"
              label={confirmLabel ?? copy.confirmLabel}
              placeholder={confirmPlaceholder ?? copy.confirmPlaceholder}
              showLabel={showPassword ?? copy.showPassword}
              hideLabel={hidePassword ?? copy.hidePassword}
              value={confirm}
              onChange={(next) => {
                setConfirm(next)
                if (problem === "mismatch") setProblem(null)
              }}
              invalid={problem === "mismatch"}
              error={mismatchError ?? copy.mismatchError}
            />

            <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
              {submitLabel ?? copy.submitLabel}
            </Button>
            <p role="alert" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>

        {footnote ? (
          <p data-entrance="" className="flex w-full items-start justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            <span>{footnote}</span>
          </p>
        ) : null}
      </div>
    </section>
  )
}

/** The verdict, crossfading in as it changes (Figma: 150ms). */
function LevelLabel({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const node = ref.current
    if (!node || typeof node.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "ease-out" })
  }, [])
  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {children}
    </span>
  )
}

/** One checklist row: a check once the rule is met, a dot until then. */
function RuleRow({
  met,
  metLabel,
  unmetLabel,
  children,
}: {
  met: boolean
  metLabel: string
  unmetLabel: string
  children: React.ReactNode
}) {
  const iconRef = React.useRef<HTMLSpanElement>(null)
  const wasMet = React.useRef(met)
  React.useEffect(() => {
    if (met && !wasMet.current) popIn(iconRef.current)
    wasMet.current = met
  }, [met])
  return (
    <li
      className={cn(
        "flex items-start gap-2 text-xs transition-colors duration-200 motion-reduce:transition-none",
        met ? "text-foreground" : "text-muted-foreground"
      )}
    >
      <span ref={iconRef} aria-hidden="true" className="flex h-[1lh] shrink-0 items-center">
        {met ? (
          <CircleCheck size={14} strokeWidth={1.5} absoluteStrokeWidth className="size-3.5 text-success" />
        ) : (
          <CircleDot size={14} strokeWidth={1.5} absoluteStrokeWidth className="size-3.5 text-muted-foreground" />
        )}
      </span>
      <span>{children}</span>
      <span className="sr-only">{met ? metLabel : unmetLabel}</span>
    </li>
  )
}

/**
 * A password field with Figma's eye: a real toggle that shows the password
 * as plain text and back.
 */
function PasswordInput({
  label,
  placeholder,
  showLabel,
  hideLabel,
  value,
  onChange,
  name,
  autoComplete,
  status,
  invalid,
  error,
}: {
  label: React.ReactNode
  placeholder: string
  showLabel: string
  hideLabel: string
  value: string
  onChange: (value: string) => void
  name: string
  autoComplete: string
  status?: "default" | "success"
  invalid?: boolean
  error?: React.ReactNode
}) {
  const [visible, setVisible] = React.useState(false)
  return (
    <Input
      type={visible ? "text" : "password"}
      name={name}
      autoComplete={autoComplete}
      required
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      status={status}
      invalid={invalid}
      error={invalid ? error : undefined}
      startIcon={<Lock size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
      endIcon={
        <button
          type="button"
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          onClick={() => setVisible((shown) => !shown)}
          className="-m-1 flex rounded-sm p-1 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {visible ? (
            <Eye size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
          ) : (
            <EyeOff size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
          )}
        </button>
      }
    />
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authSignUpPasswordStrengthCopy = COPY
