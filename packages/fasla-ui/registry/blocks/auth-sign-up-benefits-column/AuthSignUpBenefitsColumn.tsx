"use client"

import * as React from "react"
import { Eye, EyeOff, Layers, Lock, Mail, ShieldCheck, User, Users } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Sign Up + Benefits Column.
 *
 * What the product gives you on one side (the logo, a heading, three
 * benefits with icon tiles, and a row of member faces) and a sign-up card on
 * the other: two providers, then name, work email and password.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The benefits and the card sit side by
 * side on Desktop and stack, benefits first, below it. Direction is the
 * page's `dir`: in Arabic the benefits sit on the right.
 */

export interface AuthSignUpBenefitsColumnProvider {
  platform: SocialPlatform
  /** The button's text: name the provider. */
  label: React.ReactNode
}

export interface AuthSignUpBenefitsColumnBenefit {
  /** The glyph in the tile, usually a lucide icon. Sized to 18px. */
  icon: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
}

export interface AuthSignUpBenefitsColumnMember {
  /** The avatar's accessible name, and its initials when there is no photo. */
  name: string
  /** Their photo. */
  avatar?: string
}

export interface AuthSignUpBenefitsColumnValues {
  name: string
  email: string
  password: string
}

export interface AuthSignUpBenefitsColumnCopy {
  /** The page's heading, an `h1`, over the benefits. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The benefits, each an icon tile with a title and a line. Hidden when empty. */
  benefits: AuthSignUpBenefitsColumnBenefit[]
  /** The faces under the benefits. The row is hidden when both this and `proofText` are empty. */
  members: AuthSignUpBenefitsColumnMember[]
  /** The line beside the faces. */
  proofText: React.ReactNode
  /** The card's heading, an `h2`. */
  cardHeading: React.ReactNode
  /** The line under the card's heading. Hidden when empty. */
  cardDescription: React.ReactNode
  /** The provider buttons, at the top of the card. They and the divider are hidden when empty. */
  providers: AuthSignUpBenefitsColumnProvider[]
  /** The word between the two rules under the providers. */
  dividerLabel: React.ReactNode
  nameLabel: React.ReactNode
  namePlaceholder: string
  emailLabel: React.ReactNode
  emailPlaceholder: string
  passwordLabel: React.ReactNode
  passwordPlaceholder: string
  /** The eye button's name while the password is hidden. */
  showPassword: string
  /** The eye button's name while the password shows. */
  hidePassword: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The small print at the foot of the card. Hidden when empty. */
  legal: React.ReactNode
}

const TILE_ICON = { size: 18, strokeWidth: 1.5, absoluteStrokeWidth: true, "aria-hidden": true } as const
const ICON = { size: 16, strokeWidth: 1.5, absoluteStrokeWidth: true, "aria-hidden": true } as const

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthSignUpBenefitsColumnCopy> = {
  en: {
    heading: "Start building with Fasla",
    description: "Everything your team needs to design, document and ship a product — in one workspace.",
    benefits: [
      {
        icon: <Layers {...TILE_ICON} />,
        title: "A component library that stays in sync",
        description: "Tokens, variants and docs generated from one source.",
      },
      {
        icon: <Users {...TILE_ICON} />,
        title: "Built for teams of any size",
        description: "Real-time collaboration with roles and approvals.",
      },
      {
        icon: <ShieldCheck {...TILE_ICON} />,
        title: "Ship pages in hours, not sprints",
        description: "Prebuilt blocks for every common layout.",
      },
    ],
    members: [{ name: "Layla Haddad" }, { name: "Karim Nasser" }, { name: "Mariam Saleh" }, { name: "Yusuf Amin" }],
    proofText: "Joined by 12,000+ product teams this year",
    cardHeading: "Create your free account",
    cardDescription: "No credit card required.",
    providers: [
      { platform: "google", label: "Sign up with Google" },
      { platform: "github", label: "Sign up with GitHub" },
    ],
    dividerLabel: "or",
    nameLabel: "Full name",
    namePlaceholder: "Alex Rahman",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 10 characters",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submitLabel: "Get started free",
    pendingLabel: "Creating your account",
    error: "We couldn’t create your account. Check your details and try again.",
    legal: "By signing up you agree to the Terms of Service and Privacy Policy.",
  },
  ar: {
    heading: "ابدأ البناء مع فاصلة",
    description: "كل ما يحتاجه فريقك لتصميم منتج وتوثيقه وإطلاقه، في مساحة عمل واحدة.",
    benefits: [
      {
        icon: <Layers {...TILE_ICON} />,
        title: "مكتبة مكوّنات تبقى متزامنة",
        description: "الرموز التصميمية والأشكال والتوثيق تُولَّد من مصدر واحد.",
      },
      {
        icon: <Users {...TILE_ICON} />,
        title: "مصمّمة لفرق بأي حجم",
        description: "تعاون لحظي مع الأدوار والموافقات.",
      },
      {
        icon: <ShieldCheck {...TILE_ICON} />,
        title: "أنجز صفحاتك في ساعات لا في أسابيع",
        description: "كتل جاهزة لكل التخطيطات الشائعة.",
      },
    ],
    members: [{ name: "ليلى حداد" }, { name: "كريم ناصر" }, { name: "مريم صالح" }, { name: "يوسف أمين" }],
    proofText: (
      <>
        انضم إليها أكثر من <bdi dir="ltr">12,000</bdi> فريق منتج هذا العام
      </>
    ),
    cardHeading: "أنشئ حسابك المجاني",
    cardDescription: "لا حاجة إلى بطاقة ائتمان.",
    providers: [
      { platform: "google", label: <>أنشئ حسابًا باستخدام <bdi dir="ltr">Google</bdi></> },
      { platform: "github", label: <>أنشئ حسابًا باستخدام <bdi dir="ltr">GitHub</bdi></> },
    ],
    dividerLabel: "أو",
    nameLabel: "الاسم الكامل",
    namePlaceholder: "أليكس رحمن",
    emailLabel: "بريد العمل",
    emailPlaceholder: "you@company.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "10 أحرف على الأقل",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    submitLabel: "ابدأ مجانًا",
    pendingLabel: "جارٍ إنشاء حسابك",
    error: "تعذّر إنشاء حسابك. تحقّق من بياناتك ثم حاول مجددًا.",
    legal: "بإنشائك حسابًا فإنك توافق على شروط الخدمة وسياسة الخصوصية.",
  },
}

export interface AuthSignUpBenefitsColumnProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthSignUpBenefitsColumnCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 30px-high Fasla Logo lockup. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * Runs when the form is sent. While its promise is pending the button shows
   * its spinner and the form is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthSignUpBenefitsColumnValues) => Promise<void> | void
  /** Runs when a provider button is pressed. That button shows its spinner while the promise is pending. */
  onProviderSelect?: (platform: SocialPlatform) => Promise<void> | void
}

/**
 * Figma's motion: when the benefits scroll into view, their rows rise 14px
 * 90ms apart, each tile settling from 0.9, and the faces pop in last, 40ms
 * apart. The card stays put. Runs once; skipped under prefers-reduced-motion.
 */
function useScrollReveal(list: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = list.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animations: Animation[] = []
    const reveal = () => {
      const ease = "cubic-bezier(0, 0, 0.2, 1)"
      const rows = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-row]"))
      rows.forEach((row, index) => {
        animations.push(
          row.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], {
            duration: 400,
            delay: index * 90,
            easing: ease,
            fill: "backwards",
          })
        )
        const tile = row.querySelector<HTMLElement>("[data-reveal-tile]")
        if (tile)
          animations.push(
            tile.animate([{ transform: "scale(0.9)" }, { transform: "none" }], {
              duration: 500,
              delay: index * 90,
              // A soft spring: a little overshoot, then rest.
              easing: "cubic-bezier(0.34, 1.4, 0.64, 1)",
              fill: "backwards",
            })
          )
      })
      Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-face]")).forEach((face, index) =>
        animations.push(
          face.animate([{ opacity: 0, transform: "scale(0.8)" }, { opacity: 1, transform: "none" }], {
            duration: 300,
            delay: rows.length * 90 + index * 40,
            easing: ease,
            fill: "backwards",
          })
        )
      )
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        reveal()
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [list])
}

export function AuthSignUpBenefitsColumn({
  locale = "en",
  heading,
  description,
  benefits,
  members,
  proofText,
  cardHeading,
  cardDescription,
  providers,
  dividerLabel,
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  showPassword,
  hidePassword,
  submitLabel,
  pendingLabel,
  error,
  legal,
  logo,
  onSubmit,
  onProviderSelect,
  className,
  ...props
}: AuthSignUpBenefitsColumnProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardHeadingId = React.useId()
  const benefitsRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [pendingProvider, setPendingProvider] = React.useState<SocialPlatform | null>(null)
  const [visible, setVisible] = React.useState(false)
  const subline = description ?? copy.description
  const list = benefits ?? copy.benefits
  const faces = members ?? copy.members
  const proof = proofText ?? copy.proofText
  const cardSubline = cardDescription ?? copy.cardDescription
  const providerList = providers ?? copy.providers
  const smallPrint = legal ?? copy.legal
  const busy = status === "pending" || pendingProvider !== null
  useScrollReveal(benefitsRef)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
      })
      setStatus("idle")
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
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-20 lg:flex-row lg:items-center">
        <div ref={benefitsRef} className="flex min-w-0 flex-col gap-8 lg:flex-1">
          {logo ? <div className="flex h-[30px] items-center [&>svg]:h-full [&>svg]:w-auto">{logo}</div> : null}
          <div className="flex flex-col gap-3">
            <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-4xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-base text-muted-foreground">{subline}</p> : null}
          </div>
          {list.length > 0 ? (
            <ul className="flex flex-col gap-5">
              {list.map((benefit, index) => (
                <li key={index} data-reveal-row="" className="flex items-start gap-3">
                  <span
                    data-reveal-tile=""
                    className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-foreground [&_svg]:size-[18px]"
                  >
                    {benefit.icon}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">{benefit.title}</span>
                    <span className="text-xs text-muted-foreground">{benefit.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {faces.length > 0 || proof ? (
            <>
              {/* Separator: swap for the Separator component once it ships. */}
              <div data-separator="" aria-hidden="true" className="h-px w-full shrink-0 bg-border" />
              <div className="flex items-center gap-4">
                {faces.length > 0 ? (
                  <span className="flex shrink-0 items-center [&>*:not(:first-child)]:-ms-2">
                    {faces.map((member, index) => (
                      <span key={index} data-reveal-face="" className="flex rounded-full">
                        <Avatar size="32" radius="rounded" border src={member.avatar} name={member.name} />
                      </span>
                    ))}
                  </span>
                ) : null}
                {proof ? <p className="min-w-0 text-xs text-muted-foreground">{proof}</p> : null}
              </div>
            </>
          ) : null}
        </div>

        <div
          role="group"
          aria-labelledby={cardHeadingId}
          className="flex w-full min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-8 text-card-foreground shadow-lg lg:w-[440px] lg:shrink-0"
        >
          <div className="flex flex-col gap-1.5">
            <h2 id={cardHeadingId} className="text-lg font-semibold text-foreground md:text-xl">
              {cardHeading ?? copy.cardHeading}
            </h2>
            {cardSubline ? <p className="text-sm text-muted-foreground">{cardSubline}</p> : null}
          </div>

          {providerList.length > 0 ? (
            <>
              <div className="flex w-full flex-col gap-2.5">
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
              <div className="flex w-full items-center gap-3">
                <div aria-hidden="true" className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">{dividerLabel ?? copy.dividerLabel}</span>
                <div aria-hidden="true" className="h-px flex-1 bg-border" />
              </div>
            </>
          ) : null}

          <form onSubmit={submit} className="w-full">
            <fieldset disabled={busy} className="flex w-full min-w-0 flex-col gap-4">
              <Input
                name="name"
                autoComplete="name"
                required
                label={nameLabel ?? copy.nameLabel}
                placeholder={namePlaceholder ?? copy.namePlaceholder}
                startIcon={<User {...ICON} />}
              />
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
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                minLength={10}
                label={passwordLabel ?? copy.passwordLabel}
                placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
                startIcon={<Lock {...ICON} />}
                endIcon={
                  <button
                    type="button"
                    aria-label={visible ? (hidePassword ?? copy.hidePassword) : (showPassword ?? copy.showPassword)}
                    aria-pressed={visible}
                    onClick={() => setVisible((shown) => !shown)}
                    className="-m-1 flex rounded-sm p-1 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {visible ? <Eye {...ICON} /> : <EyeOff {...ICON} />}
                  </button>
                }
              />
              <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
                {submitLabel ?? copy.submitLabel}
              </Button>
              <p role="alert" className="text-sm text-destructive empty:hidden">
                {status === "error" ? (error ?? copy.error) : null}
              </p>
            </fieldset>
          </form>

          {smallPrint ? <p className="text-xs text-muted-foreground">{smallPrint}</p> : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authSignUpBenefitsColumnCopy = COPY
