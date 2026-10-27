"use client"

import * as React from "react"
import { ArrowRight, ShieldAlert } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Authentications` (42586:4669), Type=Password Changed.
 *
 * The screen after a reset: Figma's Security On illustration, the heading, a
 * summary of the change (account, when and where, other sessions), Continue
 * to sign in, and a quiet link for someone who did not ask for the change.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 416px from Tablet up
 * and fills the width on a phone, where the illustration and the heading step
 * down. Direction is the page's `dir`; the summary's labels and values swap
 * sides on their own and the arrow mirrors. The illustration never mirrors.
 */

export interface AuthPasswordChangedLink {
  label: React.ReactNode
  href: string
}

export interface AuthPasswordChangedRow {
  label: React.ReactNode
  value: React.ReactNode
}

export interface AuthPasswordChangedCopy {
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The summary card's rows: a label at the start, its value at the end. The card is hidden when empty. */
  summary: AuthPasswordChangedRow[]
  /** The solid button, on to sign in. */
  continueAction: AuthPasswordChangedLink
  /** The quiet link under the button, for a change nobody asked for. Hidden when null. */
  secureLink: AuthPasswordChangedLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthPasswordChangedCopy> = {
  en: {
    heading: "Your password is updated",
    description: "You can now sign in to Fasla with your new password.",
    summary: [
      { label: "Account", value: "alex@northwind.co" },
      { label: "Changed", value: "Just now, from Amman, JO" },
      { label: "Other sessions", value: "3 devices signed out" },
    ],
    continueAction: { label: "Continue to sign in", href: "#sign-in" },
    secureLink: { label: "Did not request this? Secure your account now.", href: "#secure-account" },
  },
  ar: {
    heading: "تم تحديث كلمة مرورك",
    description: "يمكنك الآن تسجيل الدخول إلى فاصلة بكلمة مرورك الجديدة.",
    summary: [
      { label: "الحساب", value: <bdi dir="ltr">alex@northwind.co</bdi> },
      { label: "وقت التغيير", value: "الآن، من عمّان، الأردن" },
      {
        label: "الجلسات الأخرى",
        value: (
          <>
            تم تسجيل الخروج من <bdi dir="ltr">3</bdi> أجهزة
          </>
        ),
      },
    ],
    continueAction: { label: "المتابعة إلى تسجيل الدخول", href: "#sign-in" },
    secureLink: { label: "لم تطلب ذلك؟ أمّن حسابك الآن.", href: "#secure-account" },
  },
}

export interface AuthPasswordChangedProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<AuthPasswordChangedCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

const LINK =
  "rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * Figma's celebration, once: the shield springs up from 0.7 and the check
 * comes in over 400ms; 150ms later the heading and text fade in and rise 8px;
 * then the summary rows fade in 60ms apart. Skipped under
 * prefers-reduced-motion.
 */
function useCelebration(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ease = "cubic-bezier(0, 0, 0.2, 1)"
    // Stiffness 220, damping 18: a short overshoot, then rest.
    const spring = "cubic-bezier(0.34, 1.56, 0.64, 1)"
    const animations: Animation[] = []
    const shield = root.querySelector<SVGElement>("[data-shield]")
    const check = root.querySelector<SVGElement>("[data-check]")
    if (shield) {
      animations.push(
        shield.animate([{ opacity: 0, transform: "scale(0.7)" }, { opacity: 1, transform: "none" }], {
          duration: 500,
          easing: spring,
          fill: "backwards",
        })
      )
    }
    if (check) {
      animations.push(
        check.animate([{ opacity: 0, transform: "scale(0.6)" }, { opacity: 1, transform: "none" }], {
          duration: 400,
          delay: 100,
          easing: ease,
          fill: "backwards",
        })
      )
    }
    root.querySelectorAll<HTMLElement>("[data-entrance]").forEach((part) => {
      animations.push(
        part.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
          duration: 320,
          delay: 150,
          easing: ease,
          fill: "backwards",
        })
      )
    })
    root.querySelectorAll<HTMLElement>("[data-row]").forEach((row, index) => {
      animations.push(row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: 300 + index * 60, easing: ease, fill: "backwards" }))
    })
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

/** Figma's Security On: a screen with a checked shield and a switch turned on, in theme tokens. */
function SecurityOn({ className }: { className?: string }) {
  // The shield's paths scale from their own centre.
  const part = "[transform-box:fill-box] [transform-origin:center]"
  return (
    <svg viewBox="0 0 280 194" fill="none" aria-hidden="true" className={className}>
      <path
        className="fill-foreground"
        d="M275.232 -0.000976562H4.76738C3.49245 0.0114166 2.2745 0.528997 1.38069 1.43823C0.486892 2.34746 -0.0097841 3.5741 -0.000356481 4.84905V188.602C-0.00773234 189.876 0.48993 191.1 1.38358 192.007C2.27723 192.914 3.49402 193.43 4.76738 193.442H275.232C276.505 193.43 277.722 192.914 278.615 192.007C279.509 191.1 280.007 189.876 279.999 188.602V4.84905C280.009 3.57422 279.512 2.34769 278.618 1.43848C277.725 0.529263 276.507 0.0116009 275.232 -0.000976562H275.232Z"
      />
      <path
        className="fill-background"
        d="M267.414 1.10645H5.22946C4.00266 1.10876 2.8269 1.59769 1.96018 2.46592C1.09346 3.33416 0.606568 4.51077 0.606384 5.73757V181.207C0.608145 182.432 1.09579 183.607 1.9624 184.474C2.82902 185.34 4.00389 185.828 5.22946 185.83H267.414C268.639 185.828 269.814 185.34 270.681 184.474C271.547 183.607 272.035 182.432 272.037 181.207V5.73793C272.037 4.51152 271.55 3.33522 270.684 2.46703C269.818 1.59885 268.643 1.10967 267.416 1.10679L267.414 1.10645Z"
      />
      <g data-shield="" className={part}>
        <path
          className="fill-foreground"
          d="M140.257 125.921C138.793 125.917 137.335 125.728 135.918 125.361L135.638 125.283L135.378 125.154C126.011 120.457 118.109 114.254 111.89 106.715C106.743 100.439 102.729 93.3125 100.031 85.6567C96.8038 76.4908 95.2512 66.8193 95.4474 57.1039C95.4512 56.9001 95.4547 56.7425 95.4547 56.6339C95.4547 51.9114 98.0762 47.7674 102.133 46.0769C105.238 44.7831 133.43 33.2034 135.467 32.3666C139.304 30.4446 143.396 32.049 144.051 32.3295C145.52 32.9302 171.582 43.5899 177.214 46.2716C183.018 49.0356 184.567 54.0009 184.567 56.4984C184.567 67.8081 182.608 78.3781 178.745 87.9143C175.625 95.6334 171.203 102.76 165.672 108.983C155 120.992 144.326 125.249 144.223 125.287C142.947 125.726 141.605 125.94 140.255 125.921L140.257 125.921ZM137.746 119.703C138.671 119.911 140.802 120.222 142.191 119.715C143.955 119.072 152.889 114.439 161.239 105.043C172.774 92.0607 178.626 75.743 178.636 56.5404C178.615 56.1513 178.339 53.3768 174.664 51.627C169.142 48.9971 142.053 37.9203 141.78 37.8089L141.705 37.777C141.137 37.5392 139.33 37.0381 138.085 37.6905L137.836 37.8068C137.534 37.9308 107.607 50.2222 104.416 51.5521C102.183 52.4823 101.388 54.7868 101.388 56.6336C101.388 56.7684 101.384 56.9649 101.379 57.2185C101.124 70.3578 104.164 102.689 137.746 119.703V119.703Z"
        />
        <path
          className="fill-success"
          d="M136.636 34.9815C136.636 34.9815 106.438 47.3847 103.203 48.7331C99.9667 50.0815 98.3494 53.3166 98.3494 56.5524C98.3494 59.7882 95.9226 102.007 136.636 122.42C136.636 122.42 140.332 123.443 143.135 122.42C145.938 121.398 181.529 104.14 181.529 56.4172C181.529 56.4172 181.529 51.564 175.867 48.8676C170.205 46.1711 142.829 34.9819 142.829 34.9819C142.829 34.9819 139.468 33.498 136.636 34.9815Z"
        />
        <path className="fill-foreground" opacity="0.1" d="M139.944 44.7686V110.932C139.944 110.932 109.477 96.2664 109.746 57.7097L139.944 44.7686Z" />
        <path
          data-check=""
          className={cn("fill-background", part)}
          d="M136.017 94.5735C135.074 94.5753 134.156 94.2703 133.401 93.7046L133.354 93.6696L123.502 86.127C123.031 85.7829 122.633 85.3482 122.333 84.8483C122.032 84.3484 121.834 83.7934 121.751 83.2159C121.667 82.6385 121.7 82.0502 121.848 81.4857C121.995 80.9211 122.254 80.3917 122.609 79.9286C122.963 79.4654 123.407 79.0779 123.914 78.7887C124.421 78.4996 124.98 78.3146 125.559 78.2447C126.139 78.1748 126.726 78.2214 127.287 78.3817C127.848 78.5421 128.371 78.8129 128.826 79.1783L135.207 84.0714L150.287 64.4055C150.993 63.4846 152.037 62.882 153.187 62.7301C154.338 62.5781 155.502 62.8894 156.423 63.5954L156.329 63.7229L156.426 63.5975C157.346 64.3047 157.948 65.3478 158.1 66.4982C158.251 67.6486 157.941 68.8123 157.236 69.734L139.499 92.8658C139.088 93.3989 138.561 93.8302 137.957 94.1265C137.353 94.4227 136.689 94.5758 136.017 94.5739L136.017 94.5735Z"
        />
      </g>
      <path className="fill-border" d="M145.954 146.047H131.944C129.623 146.047 127.742 147.929 127.742 150.25C127.742 152.571 129.623 154.452 131.944 154.452H145.954C148.275 154.452 150.157 152.571 150.157 150.25C150.157 147.929 148.275 146.047 145.954 146.047Z" />
      <path className="fill-success" d="M147.53 155.503C150.335 155.503 152.608 153.23 152.608 150.425C152.608 147.62 150.335 145.347 147.53 145.347C144.725 145.347 142.451 147.62 142.451 150.425C142.451 153.23 144.725 155.503 147.53 155.503Z" />
    </svg>
  )
}

export function AuthPasswordChanged({
  locale = "en",
  heading,
  description,
  summary,
  continueAction,
  secureLink,
  className,
  ...props
}: AuthPasswordChangedProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const columnRef = React.useRef<HTMLDivElement>(null)
  const subline = description ?? copy.description
  const rows = summary ?? copy.summary
  const action = continueAction ?? copy.continueAction
  const secure = secureLink === undefined ? copy.secureLink : secureLink
  useCelebration(columnRef)

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div ref={columnRef} className="flex w-full flex-col items-center gap-8 md:max-w-[416px]">
        <div className="flex h-40 w-56 items-center justify-center md:h-[200px] md:w-[280px]">
          <SecurityOn className="h-auto w-full" />
        </div>

        <div data-entrance="" className="flex w-full flex-col items-center gap-2 text-center">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        {rows.length > 0 ? (
          <dl className="flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-5 text-card-foreground">
            {rows.map((row, index) => (
              <div key={index} data-row="" className="flex items-center justify-between gap-3 text-xs">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="min-w-0 text-end font-medium text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <a href={action.href} className={buttonVariants({ className: "w-full" })}>
          {action.label}
          <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
        </a>

        {secure ? (
          <a href={secure.href} className={cn("flex items-start gap-2 text-xs text-muted-foreground hover:text-foreground", LINK)}>
            <ShieldAlert size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0" />
            <span>{secure.label}</span>
          </a>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authPasswordChangedCopy = COPY
