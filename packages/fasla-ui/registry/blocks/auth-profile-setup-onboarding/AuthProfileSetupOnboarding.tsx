"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Camera, MapPin } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { Select, type SelectOption } from "../../ui/select/select"
import { Steps, StepsItem } from "../../ui/steps/steps"

/*
 * Figma: `Authentications` (42586:4669), Type=Profile Setup Onboarding.
 *
 * The second step of a sign-up: the logo, a three-step progress row, a
 * heading, a profile photo with Upload and Remove, the name, role, team size
 * and location fields, then Back, Skip and Continue.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 560px from Tablet up;
 * on a phone every field takes the full width and the actions stack, Back
 * first. Direction is the page's `dir`; every side is a logical one, so the
 * steps run right to left in Arabic and the arrows turn round.
 */

export interface AuthProfileSetupOnboardingValues {
  /** The photo picked with Upload, or null when there is none or it was removed. */
  photo: File | null
  fullName: string
  displayName: string
  role: string
  teamSize: string
  location: string
}

export interface AuthProfileSetupOnboardingCopy {
  /** The three steps' names, in order. */
  steps: React.ReactNode[]
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  photoLabel: React.ReactNode
  /** The line under the photo label: what files fit. */
  photoHint: React.ReactNode
  uploadLabel: React.ReactNode
  removeLabel: React.ReactNode
  fullNameLabel: React.ReactNode
  fullNamePlaceholder: string
  displayNameLabel: React.ReactNode
  displayNamePlaceholder: string
  roleLabel: React.ReactNode
  rolePlaceholder: string
  /** The role menu's options. */
  roles: SelectOption[]
  teamSizeLabel: React.ReactNode
  teamSizePlaceholder: string
  /** The team size menu's options. */
  teamSizes: SelectOption[]
  locationLabel: React.ReactNode
  locationPlaceholder: string
  backLabel: React.ReactNode
  skipLabel: React.ReactNode
  continueLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown over the actions when `onSubmit` rejects. */
  error: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthProfileSetupOnboardingCopy> = {
  en: {
    steps: ["Account", "Profile", "Invite team"],
    heading: "Tell us about you",
    description: "This is how teammates will see you across Fasla. You can change it any time.",
    photoLabel: "Profile photo",
    photoHint: "PNG or JPG, at least 256×256px.",
    uploadLabel: "Upload",
    removeLabel: "Remove",
    fullNameLabel: "Full name",
    fullNamePlaceholder: "Alex Rahman",
    displayNameLabel: "Display name",
    displayNamePlaceholder: "Alex",
    roleLabel: "Your role",
    rolePlaceholder: "Product designer",
    roles: [
      { value: "designer", label: "Product designer" },
      { value: "engineer", label: "Engineer" },
      { value: "product-manager", label: "Product manager" },
      { value: "founder", label: "Founder" },
      { value: "other", label: "Something else" },
    ],
    teamSizeLabel: "Team size",
    teamSizePlaceholder: "11–50 people",
    teamSizes: [
      { value: "1", label: "Just me" },
      { value: "2-10", label: "2–10 people" },
      { value: "11-50", label: "11–50 people" },
      { value: "51-200", label: "51–200 people" },
      { value: "201+", label: "More than 200 people" },
    ],
    locationLabel: "Where are you based?",
    locationPlaceholder: "Amman, Jordan",
    backLabel: "Back",
    skipLabel: "Skip",
    continueLabel: "Continue",
    pendingLabel: "Saving your profile",
    error: "We couldn’t save your profile. Try again in a moment.",
  },
  ar: {
    steps: ["الحساب", "الملف الشخصي", "دعوة الفريق"],
    heading: "عرّفنا بنفسك",
    description: "هكذا سيراك زملاؤك في فاصلة. يمكنك تغيير ذلك في أي وقت.",
    photoLabel: "صورة الملف الشخصي",
    photoHint: (
      <>
        <bdi dir="ltr">PNG</bdi> أو <bdi dir="ltr">JPG</bdi>، بحجم <bdi dir="ltr">256×256</bdi> بكسل على الأقل.
      </>
    ),
    uploadLabel: "رفع",
    removeLabel: "إزالة",
    fullNameLabel: "الاسم الكامل",
    fullNamePlaceholder: "أليكس رحمن",
    displayNameLabel: "الاسم المعروض",
    displayNamePlaceholder: "أليكس",
    roleLabel: "دورك",
    rolePlaceholder: "مصمّم منتجات",
    roles: [
      { value: "designer", label: "مصمّم منتجات" },
      { value: "engineer", label: "مهندس برمجيات" },
      { value: "product-manager", label: "مدير منتج" },
      { value: "founder", label: "مؤسّس" },
      { value: "other", label: "دور آخر" },
    ],
    teamSizeLabel: "حجم الفريق",
    teamSizePlaceholder: "11–50 شخصًا",
    teamSizes: [
      { value: "1", label: "أنا فقط" },
      { value: "2-10", label: "2–10 أشخاص" },
      { value: "11-50", label: "11–50 شخصًا" },
      { value: "51-200", label: "51–200 شخص" },
      { value: "201+", label: "أكثر من 200 شخص" },
    ],
    locationLabel: "أين تقيم؟",
    locationPlaceholder: "عمّان، الأردن",
    backLabel: "رجوع",
    skipLabel: "تخطٍّ",
    continueLabel: "متابعة",
    pendingLabel: "جارٍ حفظ ملفك الشخصي",
    error: "تعذّر حفظ ملفك الشخصي. حاول مجددًا بعد قليل.",
  },
}

export interface AuthProfileSetupOnboardingProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthProfileSetupOnboardingCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the steps: Figma shows the 28px-tall Fasla Logo lockup. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * Which step is current, counting from 0: the ones before it show as done.
   * @default 1
   */
  currentStep?: number
  /** The photo the avatar shows before one is uploaded. Without it, the avatar shows its placeholder. */
  avatar?: string
  /** Runs with the file when a photo is picked, and with null when it is removed. */
  onPhotoChange?: (file: File | null) => void
  /**
   * Runs when Continue sends the form. While its promise is pending the
   * button shows its spinner and the form is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthProfileSetupOnboardingValues) => Promise<void> | void
  /** Runs when Skip is pressed. */
  onSkip?: () => void
  /** Runs when Back is pressed. */
  onBack?: () => void
}

/**
 * Figma draws the step names smaller than the Steps atom's own: XS Medium in
 * `muted-foreground`, the current one XS SemiBold in `foreground`.
 */
const STEP_LABELS = [
  "[&_[data-slot=step-label]]:text-xs [&_[data-slot=step-label]]:font-medium [&_[data-slot=step-label]]:text-muted-foreground",
  "[&_[data-status=current]_[data-slot=step-label]]:font-semibold [&_[data-status=current]_[data-slot=step-label]]:text-foreground",
].join(" ")

export function AuthProfileSetupOnboarding({
  locale = "en",
  steps,
  heading,
  description,
  photoLabel,
  photoHint,
  uploadLabel,
  removeLabel,
  fullNameLabel,
  fullNamePlaceholder,
  displayNameLabel,
  displayNamePlaceholder,
  roleLabel,
  rolePlaceholder,
  roles,
  teamSizeLabel,
  teamSizePlaceholder,
  teamSizes,
  locationLabel,
  locationPlaceholder,
  backLabel,
  skipLabel,
  continueLabel,
  pendingLabel,
  error,
  logo,
  currentStep = 1,
  avatar,
  onPhotoChange,
  onSubmit,
  onSkip,
  onBack,
  className,
  ...props
}: AuthProfileSetupOnboardingProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const fileRef = React.useRef<HTMLInputElement>(null)
  const photoRef = React.useRef<HTMLDivElement>(null)
  const [photo, setPhoto] = React.useState<{ file: File; url: string } | null>(null)
  const [removed, setRemoved] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const stepNames = steps ?? copy.steps
  const subline = description ?? copy.description
  const shown = photo?.url ?? (removed ? undefined : avatar)

  // The object URL lives as long as the photo it shows.
  React.useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo.url)
  }, [photo])

  /** Figma's 250ms crossfade on the avatar when the photo changes. */
  const crossfade = () => {
    const node = photoRef.current
    if (!node || typeof node.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    node.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 250, easing: "cubic-bezier(0, 0, 0.2, 1)" })
  }

  const pick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setPhoto({ file, url: URL.createObjectURL(file) })
    setRemoved(false)
    crossfade()
    onPhotoChange?.(file)
  }

  const remove = () => {
    setPhoto(null)
    setRemoved(true)
    crossfade()
    onPhotoChange?.(null)
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({
        photo: photo?.file ?? null,
        fullName: String(data.get("fullName") ?? ""),
        displayName: String(data.get("displayName") ?? ""),
        role: String(data.get("role") ?? ""),
        teamSize: String(data.get("teamSize") ?? ""),
        location: String(data.get("location") ?? ""),
      })
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("bg-background px-4 py-8 md:p-16 lg:p-24", className)} {...props}>
      <form onSubmit={submit} className="mx-auto w-full md:max-w-[560px]">
        <fieldset disabled={status === "pending"} className="flex min-w-0 flex-col gap-9">
          <div className="flex flex-col gap-3">
            {logo ? <div className="flex h-7 items-center [&>svg]:h-full [&>svg]:w-auto">{logo}</div> : null}
            <Steps className={STEP_LABELS}>
              {stepNames.map((name, index) => (
                <StepsItem
                  key={index}
                  label={name}
                  status={index < currentStep ? "done" : index === currentStep ? "current" : "upcoming"}
                />
              ))}
            </Steps>
          </div>

          <div className="flex flex-col gap-2">
            <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
          </div>

          <div className="flex items-start gap-4 md:items-center">
            <div ref={photoRef} className="shrink-0">
              <Avatar size="32" radius="rounded" border src={shown} name="" className="size-[72px] text-2xl" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">{photoLabel ?? copy.photoLabel}</p>
              <p className="text-xs text-muted-foreground">{photoHint ?? copy.photoHint}</p>
              <div className="flex gap-2.5">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  tabIndex={-1}
                  aria-hidden="true"
                  onChange={pick}
                  className="sr-only"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 md:flex-none"
                >
                  <Camera size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  {uploadLabel ?? copy.uploadLabel}
                </Button>
                <Button type="button" variant="ghost" size="sm" disabled={!shown} onClick={remove} className="flex-1 md:flex-none">
                  {removeLabel ?? copy.removeLabel}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                name="fullName"
                autoComplete="name"
                required
                label={fullNameLabel ?? copy.fullNameLabel}
                placeholder={fullNamePlaceholder ?? copy.fullNamePlaceholder}
              />
              <Input
                name="displayName"
                autoComplete="nickname"
                label={displayNameLabel ?? copy.displayNameLabel}
                placeholder={displayNamePlaceholder ?? copy.displayNamePlaceholder}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Select
                name="role"
                label={roleLabel ?? copy.roleLabel}
                placeholder={rolePlaceholder ?? copy.rolePlaceholder}
                items={roles ?? copy.roles}
              />
              <Select
                name="teamSize"
                label={teamSizeLabel ?? copy.teamSizeLabel}
                placeholder={teamSizePlaceholder ?? copy.teamSizePlaceholder}
                items={teamSizes ?? copy.teamSizes}
              />
            </div>
            <Input
              name="location"
              autoComplete="address-level2"
              label={locationLabel ?? copy.locationLabel}
              placeholder={locationPlaceholder ?? copy.locationPlaceholder}
              startIcon={<MapPin size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p role="alert" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button type="button" variant="ghost" onClick={onBack} className="w-full md:w-auto">
                <ArrowLeft size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
                {backLabel ?? copy.backLabel}
              </Button>
              <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
                <Button type="button" variant="outline" onClick={onSkip} className="w-full md:w-auto">
                  {skipLabel ?? copy.skipLabel}
                </Button>
                <Button
                  type="submit"
                  loading={status === "pending"}
                  loadingLabel={pendingLabel ?? copy.pendingLabel}
                  className="w-full md:w-auto"
                >
                  {continueLabel ?? copy.continueLabel}
                  <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
                </Button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authProfileSetupOnboardingCopy = COPY
