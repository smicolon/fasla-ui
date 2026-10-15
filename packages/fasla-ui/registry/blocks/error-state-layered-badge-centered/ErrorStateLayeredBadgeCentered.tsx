"use client"

import * as React from "react"
import { Headset, SearchX } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Layered Badge Centered.
 *
 * A centred message under a small still life: an icon badge resting on two
 * cards fanned out behind it. Then a retry, a way back to the start and a
 * line about support. Mobile first: the base classes are Figma's Mobile
 * (360), `md:` its Tablet (768) and `lg:` its Desktop (1440); on Mobile the
 * badge group is drawn at 80%. Direction is the page's `dir`; every side is
 * a logical one. In Arabic the cards swap sides but keep their tilt, so the
 * fan opens the other way, as in Figma.
 */

export interface ErrorStateLayeredBadgeCenteredAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateLayeredBadgeCenteredCopy {
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button's label. It calls `onRetry`. */
  retryLabel: React.ReactNode
  /** The outline button beside it: back to the start. Hidden when null. */
  secondaryAction: ErrorStateLayeredBadgeCenteredAction | null
  /** The small line at the foot, beside a headset. Hidden when empty. */
  supportNote: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateLayeredBadgeCenteredCopy> = {
  en: {
    heading: "Sorry, we couldn’t find that page",
    description:
      "The address may be mistyped, or the page may have been retired. Try again, or start from the beginning.",
    retryLabel: "Try again",
    secondaryAction: { label: "Start over", href: "/" },
    supportNote: "Still stuck? Fasla support replies within an hour.",
  },
  ar: {
    heading: "عذرًا، لم نتمكن من العثور على تلك الصفحة",
    description: "قد يكون العنوان مكتوبًا بشكل خاطئ، أو تم إيقاف الصفحة. حاول مجددًا، أو ابدأ من البداية.",
    retryLabel: "حاول مجددًا",
    secondaryAction: { label: "ابدأ من جديد", href: "/" },
    supportNote: "ما زلت عالقًا؟ دعم فاصلة يرد خلال ساعة.",
  },
}

export interface ErrorStateLayeredBadgeCenteredProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateLayeredBadgeCenteredCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The glyph on the badge. Pass `null` to drop the whole badge group.
   * @default a magnifier with a cross
   */
  icon?: React.ReactNode
  /**
   * Called by the solid button. Without it, the button reloads the page.
   * @default reloads the page
   */
  onRetry?: () => void
}

export function ErrorStateLayeredBadgeCentered({
  locale = "en",
  heading,
  description,
  retryLabel,
  secondaryAction,
  supportNote,
  icon,
  onRetry,
  className,
  ...props
}: ErrorStateLayeredBadgeCenteredProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const note = supportNote ?? copy.supportNote
  const glyph = icon === undefined ? <SearchX className="size-[30px]" strokeWidth={1.5} /> : icon

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-6 text-center md:max-w-none md:gap-7 lg:max-w-[560px]">
        {glyph ? (
          <div aria-hidden="true" className="flex h-24 w-40 shrink-0 items-center justify-center md:h-[120px] md:w-[200px]">
            {/* Drawn at Desktop size and scaled down on Mobile, about its centre. */}
            <div className="relative h-[120px] w-[200px] shrink-0 scale-[0.8] md:scale-100">
              <div className="absolute start-[10.5px] top-[19px] h-[72px] w-24 -rotate-[8deg] rounded-[10px] border border-border bg-muted" />
              <div className="absolute start-[92.5px] top-[32.3px] h-[72px] w-24 rotate-[8deg] rounded-[10px] border border-border bg-muted" />
              <div className="absolute start-16 top-6 flex size-[72px] items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md">
                {glyph}
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex w-full flex-col gap-2.5">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>
        <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
          <Button type="button" onClick={onRetry ?? (() => window.location.reload())}>
            {retryLabel ?? copy.retryLabel}
          </Button>
          {secondary ? (
            <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
              {secondary.label}
            </a>
          ) : null}
        </div>
        {note ? (
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Headset aria-hidden="true" strokeWidth={1.5} className="size-3.5 shrink-0" />
            {note}
          </p>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateLayeredBadgeCenteredCopy = COPY
