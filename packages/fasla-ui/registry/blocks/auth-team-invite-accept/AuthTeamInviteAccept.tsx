"use client"

import * as React from "react"
import { ArrowRight, Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"

/*
 * Figma: `Authentications` (42586:4669), Type=Team Invite Accept.
 *
 * An invitation card on a muted page: a banner photo, the faces of the
 * people already in the workspace, who invited you and to what, a panel of
 * details, Accept and Decline, and a note saying where the invitation went.
 * Decline asks once before it acts.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 520px from Tablet up and
 * fills the width on a phone. Direction is the page's `dir`; every side is a
 * logical one, so the faces overlap the other way in Arabic. The banner photo
 * is never mirrored.
 */

export interface AuthTeamInviteAcceptPerson {
  name: string
  /** The person's photo. Without it the avatar shows their initials. */
  avatar?: string
}

export interface AuthTeamInviteAcceptDetail {
  label: React.ReactNode
  value: React.ReactNode
  /** A shorter value for a phone, where the panel is narrow. Falls back to `value`. */
  shortValue?: React.ReactNode
}

export interface AuthTeamInviteAcceptImage {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AuthTeamInviteAcceptCopy {
  /** The card's heading, an `h1`: who invited you, and to what. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The faces over the heading: the inviter and teammates. Hidden when empty. */
  members: AuthTeamInviteAcceptPerson[]
  /** The rows of the details panel. The panel is hidden when empty. */
  details: AuthTeamInviteAcceptDetail[]
  acceptLabel: React.ReactNode
  /** Read out while `onAccept` runs. */
  pendingLabel: string
  /** Shown under the actions when `onAccept` or `onDecline` rejects. */
  error: React.ReactNode
  declineLabel: React.ReactNode
  /** The question Decline asks before it acts. */
  declineQuestion: React.ReactNode
  /** The button that keeps the invitation and closes the question. */
  keepLabel: React.ReactNode
  /** The button that declines for good. */
  confirmDeclineLabel: React.ReactNode
  /** Read out while `onDecline` runs. */
  decliningLabel: string
  /** The note at the foot of the card, after a mail icon. Hidden when empty. */
  note: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthTeamInviteAcceptCopy> = {
  en: {
    heading: "Nadia invited you to Northwind",
    description: "You have been invited to join the Northwind design workspace on Fasla as an Editor.",
    members: [{ name: "Nadia Rahman" }, { name: "Sara Malik" }, { name: "Karim Saleh" }],
    details: [
      { label: "Workspace", value: "Northwind" },
      { label: "Your role", value: "Editor — can create and edit files", shortValue: "Editor" },
      { label: "Members", value: "24 people, 6 teams" },
      { label: "Invitation expires", value: "In 6 days" },
    ],
    acceptLabel: "Accept invitation",
    pendingLabel: "Joining the workspace",
    error: "We couldn’t update your invitation. Try again in a moment.",
    declineLabel: "Decline",
    declineQuestion: "Decline this invitation? You’ll need a new one to join later.",
    keepLabel: "Keep invitation",
    confirmDeclineLabel: "Yes, decline",
    decliningLabel: "Declining the invitation",
    note: "Invitation sent to alex@northwind.co. Signing in creates your Fasla account.",
  },
  ar: {
    heading: (
      <>
        دعتك نادية للانضمام إلى <bdi dir="ltr">Northwind</bdi>
      </>
    ),
    description: (
      <>
        تلقّيت دعوة للانضمام إلى مساحة التصميم <bdi dir="ltr">Northwind</bdi> على فاصلة بدور محرّر.
      </>
    ),
    members: [{ name: "نادية رحمن" }, { name: "سارة مالك" }, { name: "كريم صالح" }],
    details: [
      { label: "مساحة العمل", value: <bdi dir="ltr">Northwind</bdi> },
      { label: "دورك", value: "محرّر، يُنشئ الملفات ويعدّلها", shortValue: "محرّر" },
      { label: "الأعضاء", value: "24 شخصًا، 6 فرق" },
      { label: "تنتهي الدعوة", value: "خلال 6 أيام" },
    ],
    acceptLabel: "قبول الدعوة",
    pendingLabel: "جارٍ الانضمام إلى مساحة العمل",
    error: "تعذّر تحديث دعوتك. حاول مجددًا بعد قليل.",
    declineLabel: "رفض",
    declineQuestion: "هل تريد رفض هذه الدعوة؟ ستحتاج إلى دعوة جديدة للانضمام لاحقًا.",
    keepLabel: "الإبقاء على الدعوة",
    confirmDeclineLabel: "نعم، ارفضها",
    decliningLabel: "جارٍ رفض الدعوة",
    note: (
      <>
        أُرسلت الدعوة إلى <bdi dir="ltr">alex@northwind.co</bdi>. تسجيل الدخول ينشئ حسابك في فاصلة.
      </>
    ),
  },
}

export interface AuthTeamInviteAcceptProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AuthTeamInviteAcceptCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The banner photo across the top of the card. None by default: the banner
   * is a `muted` placeholder of the same size.
   * @default none: a `muted` placeholder
   */
  image?: AuthTeamInviteAcceptImage
  /**
   * Runs when Accept is pressed. While its promise is pending the button
   * shows its spinner; a rejection shows `error`.
   */
  onAccept?: () => Promise<void> | void
  /** Runs once Decline is confirmed. Pending and rejected the same way as `onAccept`. */
  onDecline?: () => Promise<void> | void
}

/** Whether the visitor asks for reduced motion, read when an animation would start. */
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Figma's entrance: the banner fades in, the faces scale in from 0.8 70ms
 * apart, then the detail rows fade in 60ms apart. Runs once; skipped under
 * prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function" || reducedMotion()) return
    const ease = "cubic-bezier(0, 0, 0.2, 1)"
    const animations: Animation[] = []
    root.querySelectorAll<HTMLElement>("[data-entrance=banner]").forEach((part) =>
      animations.push(part.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: ease, fill: "backwards" }))
    )
    root.querySelectorAll<HTMLElement>("[data-entrance=face]").forEach((part, index) =>
      animations.push(
        part.animate([{ opacity: 0, transform: "scale(0.8)" }, { opacity: 1, transform: "none" }], {
          duration: 260,
          delay: 200 + index * 70,
          easing: ease,
          fill: "backwards",
        })
      )
    )
    root.querySelectorAll<HTMLElement>("[data-entrance=row]").forEach((part, index) =>
      animations.push(
        part.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: 400 + index * 60, easing: ease, fill: "backwards" })
      )
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

export function AuthTeamInviteAccept({
  locale = "en",
  heading,
  description,
  members,
  details,
  acceptLabel,
  pendingLabel,
  error,
  declineLabel,
  declineQuestion,
  keepLabel,
  confirmDeclineLabel,
  decliningLabel,
  note,
  image,
  onAccept,
  onDecline,
  className,
  ...props
}: AuthTeamInviteAcceptProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const questionId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const keepRef = React.useRef<HTMLButtonElement>(null)
  const declineRef = React.useRef<HTMLButtonElement>(null)
  const [status, setStatus] = React.useState<"idle" | "accepting" | "confirm" | "declining" | "error">("idle")
  const faces = members ?? copy.members
  const rows = details ?? copy.details
  const subline = description ?? copy.description
  const footnote = note ?? copy.note
  const busy = status === "accepting" || status === "declining"
  useEntrance(cardRef)

  // Moving between Decline and its question keeps focus on the action in view.
  const previous = React.useRef(status)
  React.useEffect(() => {
    if (status === "confirm") keepRef.current?.focus()
    else if (previous.current === "confirm" && status === "idle") declineRef.current?.focus()
    previous.current = status
  }, [status])

  /** Figma's press: Accept scales to 0.98 and back. Skipped under prefers-reduced-motion. */
  const press = (event: React.PointerEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    if (typeof button.animate !== "function" || reducedMotion()) return
    button.animate([{ transform: "none" }, { transform: "scale(0.98)" }, { transform: "none" }], { duration: 200, easing: "ease-out" })
  }

  const run = async (action: (() => Promise<void> | void) | undefined, pending: "accepting" | "declining") => {
    if (!action) return
    setStatus(pending)
    try {
      await action()
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
        className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg md:max-w-[520px]"
      >
        <div data-entrance="banner" className="relative h-[132px] w-full shrink-0 overflow-hidden bg-muted">
          {image ? (
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
          ) : null}
        </div>

        <div className="flex flex-col gap-6 px-4 py-8 md:p-8">
          {faces.length > 0 ? (
            <ul className="flex items-center">
              {faces.map((person, index) => (
                <li key={index} data-entrance="face" className={cn("relative", index > 0 && "-ms-2.5")}>
                  <Avatar size="32" radius="rounded" border src={person.avatar} name={person.name} className="size-14 text-xl" />
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-col gap-2">
            <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
          </div>

          {rows.length > 0 ? (
            <dl className="flex flex-col gap-3 rounded-lg bg-muted p-4">
              {rows.map((row, index) => (
                <div key={index} data-entrance="row" className="flex items-center justify-between gap-3 text-xs">
                  <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
                  <dd className="min-w-0 text-end font-semibold text-foreground">
                    {row.shortValue !== undefined ? (
                      <>
                        <span className="md:hidden">{row.shortValue}</span>
                        <span className="hidden md:inline">{row.value}</span>
                      </>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              loading={status === "accepting"}
              loadingLabel={pendingLabel ?? copy.pendingLabel}
              disabled={busy && status !== "accepting"}
              onClick={() => run(onAccept, "accepting")}
              onPointerDown={press}
              className="w-full"
            >
              {acceptLabel ?? copy.acceptLabel}
              <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
            </Button>
            {status === "confirm" || status === "declining" ? (
              <div role="group" aria-labelledby={questionId} className="flex flex-col gap-2.5 rounded-lg border border-border p-3">
                <p id={questionId} className="text-sm text-foreground">
                  {declineQuestion ?? copy.declineQuestion}
                </p>
                <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                  <Button
                    ref={keepRef}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={status === "declining"}
                    onClick={() => setStatus("idle")}
                  >
                    {keepLabel ?? copy.keepLabel}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    tone="destructive"
                    size="sm"
                    loading={status === "declining"}
                    loadingLabel={decliningLabel ?? copy.decliningLabel}
                    onClick={() => run(onDecline, "declining")}
                  >
                    {confirmDeclineLabel ?? copy.confirmDeclineLabel}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                ref={declineRef}
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setStatus("confirm")}
                className="w-full"
              >
                {declineLabel ?? copy.declineLabel}
              </Button>
            )}
            <p role="alert" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </div>

          {footnote ? (
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Mail size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="mt-px size-3.5 shrink-0" />
              <span>{footnote}</span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authTeamInviteAcceptCopy = COPY
