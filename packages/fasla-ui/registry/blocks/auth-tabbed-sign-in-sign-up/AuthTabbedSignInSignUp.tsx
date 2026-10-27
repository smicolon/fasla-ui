"use client"

import * as React from "react"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"

/*
 * Figma: `Authentications` (42586:4669), Type=Tabbed Sign In / Sign Up.
 *
 * One card for both ways in: the logo and a heading over a Sign in / Sign up
 * tab pair, the chosen form, then "or continue with" and a row of provider
 * icon buttons. Figma draws the Sign in panel; the Sign up panel follows the
 * same fields and spacing.
 *
 * Switching tabs crossfades the panels and eases the card between their
 * heights, so the page never jumps, then puts focus in the new panel's first
 * field.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 456px from Tablet up and
 * fills the width on a phone. Direction is the page's `dir`; the tabs mirror
 * through the Tabs component.
 */

export type AuthTabbedSignInSignUpTab = "sign-in" | "sign-up"

export interface AuthTabbedSignInSignUpLink {
  label: React.ReactNode
  href: string
}

export interface AuthTabbedSignInSignUpProvider {
  platform: SocialPlatform
  /** The icon button's accessible name: name the provider. */
  label: string
}

export interface AuthTabbedSignInSignUpSignInValues {
  email: string
  password: string
  remember: boolean
}

export interface AuthTabbedSignInSignUpSignUpValues {
  name: string
  email: string
  password: string
}

export interface AuthTabbedSignInSignUpCopy {
  /** The card's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The tab names. */
  signInTab: React.ReactNode
  signUpTab: React.ReactNode
  /** Names the tab pair for screen readers. */
  tabsLabel: string
  nameLabel: React.ReactNode
  namePlaceholder: string
  emailLabel: React.ReactNode
  emailPlaceholder: string
  passwordLabel: React.ReactNode
  passwordPlaceholder: string
  /** The Sign up panel's password placeholder: what the password needs. */
  newPasswordPlaceholder: string
  /** The eye button's name while the password is hidden. */
  showPassword: string
  /** The eye button's name while the password shows. */
  hidePassword: string
  rememberLabel: string
  /** The link at the end of the remember-me row. Hidden when null. */
  forgotPassword: AuthTabbedSignInSignUpLink | null
  signInLabel: React.ReactNode
  signUpLabel: React.ReactNode
  /** Read out while a form's callback runs. */
  pendingLabel: string
  /** Shown under a form's button when its callback rejects. */
  error: React.ReactNode
  /** The words between the two rules over the providers. */
  dividerLabel: React.ReactNode
  /** The provider icon buttons. The divider and the row are hidden when empty. */
  providers: AuthTabbedSignInSignUpProvider[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthTabbedSignInSignUpCopy> = {
  en: {
    heading: "Fasla account",
    description: "Sign in, or create an account in seconds.",
    signInTab: "Sign in",
    signUpTab: "Sign up",
    tabsLabel: "Sign in or sign up",
    nameLabel: "Full name",
    namePlaceholder: "Your full name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    newPasswordPlaceholder: "At least 10 characters",
    showPassword: "Show password",
    hidePassword: "Hide password",
    rememberLabel: "Remember me",
    forgotPassword: { label: "Forgot password?", href: "#forgot-password" },
    signInLabel: "Sign in",
    signUpLabel: "Create account",
    pendingLabel: "Please wait",
    error: "Something went wrong. Check your details and try again.",
    dividerLabel: "or continue with",
    providers: [
      { platform: "google", label: "Continue with Google" },
      { platform: "apple", label: "Continue with Apple" },
      { platform: "github", label: "Continue with GitHub" },
      { platform: "figma", label: "Continue with Figma" },
    ],
  },
  ar: {
    heading: "حساب فاصلة",
    description: "سجّل الدخول أو أنشئ حسابًا في ثوانٍ.",
    signInTab: "تسجيل الدخول",
    signUpTab: "إنشاء حساب",
    tabsLabel: "تسجيل الدخول أو إنشاء حساب",
    nameLabel: "الاسم الكامل",
    namePlaceholder: "اسمك الكامل",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    newPasswordPlaceholder: "10 أحرف على الأقل",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    rememberLabel: "تذكّرني",
    forgotPassword: { label: "نسيت كلمة المرور؟", href: "#forgot-password" },
    signInLabel: "تسجيل الدخول",
    signUpLabel: "إنشاء الحساب",
    pendingLabel: "يُرجى الانتظار",
    error: "حدث خطأ ما. تحقّق من بياناتك ثم حاول مجددًا.",
    dividerLabel: "أو تابع باستخدام",
    providers: [
      { platform: "google", label: "المتابعة باستخدام Google" },
      { platform: "apple", label: "المتابعة باستخدام Apple" },
      { platform: "github", label: "المتابعة باستخدام GitHub" },
      { platform: "figma", label: "المتابعة باستخدام Figma" },
    ],
  },
}

export interface AuthTabbedSignInSignUpProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthTabbedSignInSignUpCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 40px icon-only Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * The tab open on first render.
   * @default "sign-in"
   */
  defaultTab?: AuthTabbedSignInSignUpTab
  /** Runs when a tab is chosen. */
  onTabChange?: (tab: AuthTabbedSignInSignUpTab) => void
  /**
   * Runs when the Sign in form is sent. While its promise is pending the
   * button shows its spinner and the form is disabled; a rejection shows `error`.
   */
  onSignIn?: (values: AuthTabbedSignInSignUpSignInValues) => Promise<void> | void
  /** Runs when the Sign up form is sent, the same way. */
  onSignUp?: (values: AuthTabbedSignInSignUpSignUpValues) => Promise<void> | void
  /** Runs when a provider button is pressed. That button shows its spinner while the promise is pending. */
  onProviderSelect?: (platform: SocialPlatform) => Promise<void> | void
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Figma's entrance: the card's parts fade in and rise, one after another.
 * Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>, { rise = 12, duration = 320, stagger = 50 } = {}) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (reducedMotion()) return
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

/** Sends a form's values to its callback, holding the pending state and catching a rejection. */
function useSubmit<Values>(callback: ((values: Values) => Promise<void> | void) | undefined) {
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const run = async (values: Values) => {
    if (!callback) return
    setStatus("pending")
    try {
      await callback(values)
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }
  return [status, run] as const
}

const LINK =
  "rounded-sm text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function AuthTabbedSignInSignUp({
  locale = "en",
  heading,
  description,
  signInTab,
  signUpTab,
  tabsLabel,
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  newPasswordPlaceholder,
  showPassword,
  hidePassword,
  rememberLabel,
  forgotPassword,
  signInLabel,
  signUpLabel,
  pendingLabel,
  error,
  dividerLabel,
  providers,
  logo,
  defaultTab = "sign-in",
  onTabChange,
  onSignIn,
  onSignUp,
  onProviderSelect,
  className,
  ...props
}: AuthTabbedSignInSignUpProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const panelsRef = React.useRef<HTMLDivElement>(null)
  const lastHeight = React.useRef<number | null>(null)
  // Set while a pointer chooses the tab. The arrow keys keep focus on the
  // tabs, so a keyboard user can keep moving between them.
  const pointerChoice = React.useRef(false)
  const [tab, setTab] = React.useState<AuthTabbedSignInSignUpTab>(defaultTab)
  const [signInStatus, signIn] = useSubmit(onSignIn)
  const [signUpStatus, signUp] = useSubmit(onSignUp)
  const [pendingProvider, setPendingProvider] = React.useState<SocialPlatform | null>(null)
  const forgot = forgotPassword === undefined ? copy.forgotPassword : forgotPassword
  const providerList = providers ?? copy.providers
  const subline = description ?? copy.description
  const busy = signInStatus === "pending" || signUpStatus === "pending" || pendingProvider !== null
  const showPasswordLabel = showPassword ?? copy.showPassword
  const hidePasswordLabel = hidePassword ?? copy.hidePassword
  useEntrance(cardRef)

  // Figma's tab change: the card eases between the two panels' heights over
  // 240ms while the new panel fades in, coming 8px from the side the tab
  // order points to (start for Sign in, end for Sign up), and a pointer
  // choice moves focus into its first field. It runs when the new panel's
  // form mounts, since the Tabs swap their panels a render after the value.
  const panelShown = React.useCallback((form: HTMLElement) => {
    const panels = panelsRef.current
    const from = lastHeight.current
    lastHeight.current = null
    if (!panels || from === null) return
    if (pointerChoice.current) form.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true })
    pointerChoice.current = false
    if (typeof panels.animate !== "function" || reducedMotion()) return
    const height = panels.getBoundingClientRect().height
    const rtl = getComputedStyle(panels).direction === "rtl"
    const forward = form.dataset.panel === "sign-up"
    const shift = (forward ? 8 : -8) * (rtl ? -1 : 1)
    const options = { duration: 240, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
    form.animate([{ opacity: 0, transform: `translateX(${shift}px)` }, { opacity: 1, transform: "none" }], options)
    if (from !== height) {
      panels.animate([{ height: `${from}px`, overflow: "hidden" }, { height: `${height}px`, overflow: "hidden" }], options)
    }
  }, [])

  const selectProvider = async (platform: SocialPlatform) => {
    if (!onProviderSelect) return
    setPendingProvider(platform)
    try {
      await onProviderSelect(platform)
    } finally {
      setPendingProvider(null)
    }
  }

  const changeTab = (value: unknown) => {
    const next = value === "sign-up" ? "sign-up" : "sign-in"
    lastHeight.current = panelsRef.current?.getBoundingClientRect().height ?? null
    setTab(next)
    onTabChange?.(next)
  }

  const errorLine = (status: string) => (
    <p role="alert" className="text-sm text-destructive empty:hidden">
      {status === "error" ? (error ?? copy.error) : null}
    </p>
  )

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex justify-center bg-muted p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div
        ref={cardRef}
        className="flex w-full flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg md:max-w-[456px]"
      >
        <div data-entrance="" className="flex w-full flex-col items-center gap-2 px-2 pt-2">
          {logo ? <div className="flex size-10 items-center justify-center [&>svg]:size-full">{logo}</div> : null}
          <h1 id={headingId} className="text-center text-lg font-semibold text-foreground md:text-xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-center text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <Tabs
          data-entrance=""
          value={tab}
          onValueChange={changeTab}
          onPointerDownCapture={() => {
            pointerChoice.current = true
          }}
          onKeyDownCapture={() => {
            pointerChoice.current = false
          }}
          className="flex flex-col gap-6"
        >
          <TabsList
            variant="bordered"
            size="sm"
            aria-label={tabsLabel ?? copy.tabsLabel}
            className="flex w-full"
          >
            <TabsTrigger value="sign-in" className="flex-1">
              {signInTab ?? copy.signInTab}
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="flex-1">
              {signUpTab ?? copy.signUpTab}
            </TabsTrigger>
          </TabsList>

          <div ref={panelsRef}>
            <TabsContent value="sign-in" className="mt-0 focus-visible:ring-0">
              <PanelForm
                panel="sign-in"
                onShown={panelShown}
                onSubmit={(event) => {
                  event.preventDefault()
                  const data = new FormData(event.currentTarget)
                  signIn({
                    email: String(data.get("email") ?? ""),
                    password: String(data.get("password") ?? ""),
                    remember: data.get("remember") === "on",
                  })
                }}
              >
                <fieldset disabled={busy} className="flex w-full min-w-0 flex-col gap-4">
                  <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    label={emailLabel ?? copy.emailLabel}
                    placeholder={emailPlaceholder ?? copy.emailPlaceholder}
                    startIcon={<Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
                  />
                  <PasswordInput
                    autoComplete="current-password"
                    label={passwordLabel ?? copy.passwordLabel}
                    placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
                    showLabel={showPasswordLabel}
                    hideLabel={hidePasswordLabel}
                  />
                  <div className="flex items-center justify-between gap-4">
                    <Checkbox name="remember" size="sm" label={rememberLabel ?? copy.rememberLabel} />
                    {forgot ? (
                      <a href={forgot.href} className={cn(LINK, "shrink-0")}>
                        {forgot.label}
                      </a>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    loading={signInStatus === "pending"}
                    loadingLabel={pendingLabel ?? copy.pendingLabel}
                    className="w-full"
                  >
                    {signInLabel ?? copy.signInLabel}
                  </Button>
                  {errorLine(signInStatus)}
                </fieldset>
              </PanelForm>
            </TabsContent>

            <TabsContent value="sign-up" className="mt-0 focus-visible:ring-0">
              <PanelForm
                panel="sign-up"
                onShown={panelShown}
                onSubmit={(event) => {
                  event.preventDefault()
                  const data = new FormData(event.currentTarget)
                  signUp({
                    name: String(data.get("name") ?? ""),
                    email: String(data.get("email") ?? ""),
                    password: String(data.get("password") ?? ""),
                  })
                }}
              >
                <fieldset disabled={busy} className="flex w-full min-w-0 flex-col gap-4">
                  <Input
                    name="name"
                    autoComplete="name"
                    required
                    label={nameLabel ?? copy.nameLabel}
                    placeholder={namePlaceholder ?? copy.namePlaceholder}
                    startIcon={<User size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
                  />
                  <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    label={emailLabel ?? copy.emailLabel}
                    placeholder={emailPlaceholder ?? copy.emailPlaceholder}
                    startIcon={<Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
                  />
                  <PasswordInput
                    autoComplete="new-password"
                    label={passwordLabel ?? copy.passwordLabel}
                    placeholder={newPasswordPlaceholder ?? copy.newPasswordPlaceholder}
                    showLabel={showPasswordLabel}
                    hideLabel={hidePasswordLabel}
                  />
                  <Button
                    type="submit"
                    loading={signUpStatus === "pending"}
                    loadingLabel={pendingLabel ?? copy.pendingLabel}
                    className="w-full"
                  >
                    {signUpLabel ?? copy.signUpLabel}
                  </Button>
                  {errorLine(signUpStatus)}
                </fieldset>
              </PanelForm>
            </TabsContent>
          </div>
        </Tabs>

        {providerList.length > 0 ? (
          <>
            <div data-entrance="" className="flex w-full items-center gap-3">
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">{dividerLabel ?? copy.dividerLabel}</span>
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
            <div data-entrance="" className="flex w-full flex-wrap justify-center gap-2.5">
              {providerList.map((provider) => (
                <Button
                  key={provider.platform}
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  aria-label={provider.label}
                  disabled={busy && pendingProvider !== provider.platform}
                  loading={pendingProvider === provider.platform}
                  loadingLabel={provider.label}
                  onClick={() => selectProvider(provider.platform)}
                >
                  <SocialIcon platform={provider.platform} className="size-4" />
                </Button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

/** A panel's form, telling the card when it has mounted so the switch can animate. */
function PanelForm({
  panel,
  onShown,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement> & { panel: AuthTabbedSignInSignUpTab; onShown: (form: HTMLElement) => void }) {
  const ref = React.useRef<HTMLFormElement>(null)
  React.useLayoutEffect(() => {
    if (ref.current) onShown(ref.current)
  }, [onShown])
  return <form ref={ref} data-panel={panel} {...props} />
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
  autoComplete,
}: {
  label: React.ReactNode
  placeholder: string
  showLabel: string
  hideLabel: string
  autoComplete: string
}) {
  const [visible, setVisible] = React.useState(false)
  return (
    <Input
      type={visible ? "text" : "password"}
      name="password"
      autoComplete={autoComplete}
      required
      label={label}
      placeholder={placeholder}
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
export const authTabbedSignInSignUpCopy = COPY
