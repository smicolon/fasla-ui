"use client"

import * as React from "react"
import { Check, ChevronRight, LockKeyhole, Loader2, Send, UserX } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Access Denied 403.
 *
 * A 403 page: a lock badge, the code and the message on one side, and an
 * account panel on the other: who is signed in, a "No access" pill, and two
 * ways forward, ask for access or switch accounts. The panel sits beside the
 * copy on Desktop and under it on Tablet and Mobile.
 *
 * Request access is real: while `onRequestAccess` runs, its row shows a
 * spinner, and then the row becomes a confirmation, or says it failed.
 * No photo comes with the block: pass `account.avatar`, and until then the
 * avatar shows the person's initials.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side is a logical one, and the send glyph and chevrons mirror in Arabic.
 */

export interface ErrorStateAccessDenied403Account {
  /** The line naming who is signed in. */
  label: React.ReactNode
  /** Their email, under it. */
  email: React.ReactNode
  /** Their name, for the avatar's initials and the photo's description. */
  name: string
  /**
   * Their photo. None by default: the avatar shows `name`'s initials.
   * @default none: initials
   */
  avatar?: string
}

export interface ErrorStateAccessDenied403Option {
  /** The row's title. */
  title: React.ReactNode
  /** The line under it. */
  description: React.ReactNode
}

export interface ErrorStateAccessDenied403Link extends ErrorStateAccessDenied403Option {
  href: string
}

export interface ErrorStateAccessDenied403Action {
  label: React.ReactNode
  href: string
}

export interface ErrorStateAccessDenied403Copy {
  /** The status code above the heading. Hidden when empty. */
  code: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The outline button under the copy. Hidden when null. */
  backAction: ErrorStateAccessDenied403Action | null
  /** Who is signed in: `label`, `email`, `name` and an optional `avatar` photo. */
  account: ErrorStateAccessDenied403Account
  /** The pill at the account row's end. Hidden when empty. */
  noAccess: React.ReactNode
  /** The row that runs `onRequestAccess`. */
  requestAccess: ErrorStateAccessDenied403Option
  /** Replaces the request row once `onRequestAccess` resolves. */
  requestSent: ErrorStateAccessDenied403Option
  /** Replaces the request row's description when `onRequestAccess` rejects. */
  requestError: React.ReactNode
  /** The row that links to another sign-in. Hidden when null. */
  switchAccount: ErrorStateAccessDenied403Link | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateAccessDenied403Copy> = {
  en: {
    code: "403",
    heading: "You don’t have access to this page",
    description: "This workspace is private. Ask an admin for access, or sign in with the account that was invited.",
    backAction: { label: "Back to Fasla", href: "/" },
    account: { label: "Signed in as Layla Mansour", email: "layla@studio-north.com", name: "Layla Mansour" },
    noAccess: "No access",
    requestAccess: { title: "Request access", description: "The workspace admin is notified straight away" },
    requestSent: { title: "Request sent", description: "You’ll get an email when an admin answers" },
    requestError: "The request didn’t go through. Try again.",
    switchAccount: {
      title: "Use a different account",
      description: "Sign out and continue with another sign-in",
      href: "#sign-in",
    },
  },
  ar: {
    code: "403",
    heading: "ليس لديك صلاحية الوصول إلى هذه الصفحة",
    description: "مساحة العمل هذه خاصة. اطلب الصلاحية من المسؤول، أو سجّل الدخول بالحساب الذي تمت دعوته.",
    backAction: { label: "العودة إلى فاصلة", href: "/" },
    account: {
      label: "مسجّل الدخول باسم ليلى منصور",
      email: <bdi dir="ltr">layla@studio-north.com</bdi>,
      name: "ليلى منصور",
    },
    noAccess: "لا تملك صلاحية الوصول",
    requestAccess: { title: "طلب صلاحية", description: "يتم إشعار مسؤول مساحة العمل فورًا" },
    requestSent: { title: "تم إرسال الطلب", description: "ستصلك رسالة عندما يرد المسؤول" },
    requestError: "لم يُرسل الطلب. حاول مجددًا.",
    switchAccount: {
      title: "استخدم حسابًا آخر",
      description: "سجّل الخروج وتابع بتسجيل دخول آخر",
      href: "#sign-in",
    },
  },
}

/** An option row: a bordered card with an icon tile, two lines and a chevron. */
const ROW =
  "flex w-full items-center justify-between gap-3 rounded-[10px] p-4 text-start ring-1 ring-inset ring-border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

function OptionBody({
  icon,
  title,
  description,
  trailing,
}: {
  icon: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-muted text-muted-foreground">
          {icon}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </span>
      </span>
      {trailing}
    </>
  )
}

const chevron = <ChevronRight strokeWidth={1.5} aria-hidden="true" className="size-4 shrink-0 text-muted-foreground [&:dir(rtl)]:-scale-x-100" />

export interface ErrorStateAccessDenied403Props
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateAccessDenied403Copy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The glyph in the badge. Pass `null` to drop the badge.
   * @default a keyhole lock
   */
  icon?: React.ReactNode
  /**
   * Sends the access request. The row shows a spinner until the promise
   * settles; then it becomes `requestSent`, or shows `requestError`.
   */
  onRequestAccess?: () => Promise<void> | void
}

export function ErrorStateAccessDenied403({
  locale = "en",
  code,
  heading,
  description,
  backAction,
  account,
  noAccess,
  requestAccess,
  requestSent,
  requestError,
  switchAccount,
  icon,
  onRequestAccess,
  className,
  ...props
}: ErrorStateAccessDenied403Props) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const [status, setStatus] = React.useState<"idle" | "pending" | "success" | "error">("idle")
  const status403 = code ?? copy.code
  const back = backAction === undefined ? copy.backAction : backAction
  const person = account ?? copy.account
  const pill = noAccess ?? copy.noAccess
  const request = requestAccess ?? copy.requestAccess
  const sent = requestSent ?? copy.requestSent
  const other = switchAccount === undefined ? copy.switchAccount : switchAccount
  const glyph = icon === undefined ? <LockKeyhole strokeWidth={1.5} aria-hidden="true" className="size-7" /> : icon
  const send = <Send strokeWidth={1.5} aria-hidden="true" className="size-4 [&:dir(rtl)]:-scale-x-100" />

  const ask = async () => {
    setStatus("pending")
    try {
      await onRequestAccess?.()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex flex-col items-start gap-6 lg:w-[540px]">
          {glyph ? (
            <div className="flex size-14 items-center justify-center rounded-[10px] bg-destructive/10 text-destructive md:size-16">
              {glyph}
            </div>
          ) : null}
          <div className="flex w-full flex-col gap-3">
            {status403 ? <p className="text-xs font-medium text-muted-foreground">{status403}</p> : null}
            <h1 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
              {heading ?? copy.heading}
            </h1>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </div>
          {back ? (
            <a href={back.href} className={buttonVariants({ variant: "outline" })}>
              {back.label}
            </a>
          ) : null}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-5 rounded-[14px] bg-card p-5 shadow-md ring-1 ring-inset ring-border md:p-7 lg:w-[480px]">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
            <div className="flex min-w-0 items-center gap-3 md:flex-1">
              <Avatar
                src={person.avatar}
                name={person.name}
                variant={person.avatar ? "image" : "initials"}
                radius="rounded"
                status="online"
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">{person.label}</p>
                <p className="break-words text-xs text-muted-foreground">{person.email}</p>
              </div>
            </div>
            {pill ? (
              <Badge variant="outline" tone="destructive">
                {pill}
              </Badge>
            ) : null}
          </div>
          <hr className="border-border" />
          <ul className="flex flex-col gap-3">
            <li>
              {status === "success" ? (
                <div className={ROW}>
                  <OptionBody
                    icon={<Check strokeWidth={1.5} aria-hidden="true" className="size-4 text-success" />}
                    title={sent.title}
                    description={sent.description}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={ask}
                  disabled={status === "pending"}
                  aria-busy={status === "pending" || undefined}
                  className={cn(ROW, "cursor-pointer hover:bg-muted disabled:cursor-default")}
                >
                  <OptionBody
                    icon={send}
                    title={request.title}
                    description={
                      status === "error" ? (
                        <span className="text-destructive">{requestError ?? copy.requestError}</span>
                      ) : (
                        request.description
                      )
                    }
                    trailing={
                      status === "pending" ? (
                        <Loader2 aria-hidden="true" className="size-4 shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none" />
                      ) : (
                        chevron
                      )
                    }
                  />
                </button>
              )}
            </li>
            {other ? (
              <li>
                <a href={other.href} className={cn(ROW, "hover:bg-muted")}>
                  <OptionBody
                    icon={<UserX strokeWidth={1.5} aria-hidden="true" className="size-4" />}
                    title={other.title}
                    description={other.description}
                    trailing={chevron}
                  />
                </a>
              </li>
            ) : null}
          </ul>
          <p role="status" className="sr-only">
            {status === "success" ? sent.title : status === "error" ? (requestError ?? copy.requestError) : null}
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateAccessDenied403Copy = COPY
