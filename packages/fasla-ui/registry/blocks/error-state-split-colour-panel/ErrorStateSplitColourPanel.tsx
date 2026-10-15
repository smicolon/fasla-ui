"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Split Colour Panel.
 *
 * An inverted panel holding the error code, beside the message: a heading,
 * a line of help, a rule, a short list of reassurances and two ways out. The
 * panel is painted with the inverse tokens, the only way Fasla inverts a
 * surface: dark in Light, light in Dark. The theme-inverse registry item maps
 * them, falling back to the page colours swapped in a theme without them.
 *
 * The panel is a square at the start on Desktop and a full-width band above
 * the message on Tablet and Mobile. Mobile first: the base classes are
 * Figma's Mobile (360), `md:` its Tablet (768) and `lg:` its Desktop (1440).
 * Every side is a logical one, so in Arabic the panel moves to the right.
 */

export interface ErrorStateSplitColourPanelAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateSplitColourPanelCopy {
  /** The status code on the panel. Hidden when empty. */
  code: React.ReactNode
  /** The line under the code on the panel. Hidden when empty. */
  codeLabel: React.ReactNode
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The reassurances under the rule, each with a check. The rule and list are hidden when empty. */
  checks: React.ReactNode[]
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStateSplitColourPanelAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: ErrorStateSplitColourPanelAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateSplitColourPanelCopy> = {
  en: {
    code: "404",
    codeLabel: "PAGE NOT FOUND",
    eyebrow: "ERROR 404",
    heading: "That link has expired",
    description:
      "Pages get retired when the product moves on. Nothing is broken — we just need to point you somewhere newer.",
    checks: ["Your account and data are untouched", "Bookmarks to the new page still work"],
    primaryAction: { label: "Back to home", href: "/" },
    secondaryAction: { label: "See what changed", href: "#changelog" },
  },
  ar: {
    code: "404",
    codeLabel: "الصفحة غير موجودة",
    eyebrow: (
      <>
        خطأ <bdi dir="ltr">404</bdi>
      </>
    ),
    heading: "انتهت صلاحية هذا الرابط",
    description: "تُوقف الصفحات عندما يتطور المنتج. لا يوجد عطل. علينا فقط توجيهك إلى مكان أحدث.",
    checks: ["حسابك وبياناتك لم تُمس", "الإشارات المرجعية للصفحة الجديدة لا تزال تعمل"],
    primaryAction: { label: "العودة إلى الرئيسية", href: "/" },
    secondaryAction: { label: "اطّلع على التغييرات", href: "#changelog" },
  },
}

export interface ErrorStateSplitColourPanelProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateSplitColourPanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function ErrorStateSplitColourPanel({
  locale = "en",
  code,
  codeLabel,
  eyebrow,
  heading,
  description,
  checks,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: ErrorStateSplitColourPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const status = code ?? copy.code
  const statusLabel = codeLabel ?? copy.codeLabel
  const label = eyebrow ?? copy.eyebrow
  const list = checks ?? copy.checks
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex flex-col bg-background lg:min-h-[620px] lg:flex-row", className)}
      {...props}
    >
      <div className="flex h-60 shrink-0 flex-col items-center justify-center gap-4 bg-background-inverse p-8 text-center md:h-80 lg:h-auto lg:w-[620px] lg:p-12">
        {status ? <p className="text-7xl font-bold text-foreground-inverse md:text-8xl lg:text-9xl">{status}</p> : null}
        {statusLabel ? <p className="text-base font-medium text-muted-foreground-inverse">{statusLabel}</p> : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center p-8 md:p-16 lg:py-0 lg:pe-0 lg:ps-16">
        <div className="flex flex-col gap-6">
          {label ? <p className="text-xs font-medium text-destructive">{label}</p> : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          {list.length > 0 ? (
            <>
              <div aria-hidden="true" className="h-px bg-border" />
              <ul className="flex flex-col gap-3">
                {list.map((item, index) => (
                  <li key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateSplitColourPanelCopy = COPY
