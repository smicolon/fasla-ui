"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"

/*
 * Figma: `Mahaam Template` (47694:6712), the `Pause control` instance: Figma's
 * Icon Button, Outline, Secondary, sm, Rounded, with the `pause` icon (`play`
 * while paused).
 *
 * The template's sections play on their own (see `mahaam-motion.ts`) and draw
 * no pause button, so the page stays as Figma draws it. A site that ships the
 * template places this toggle itself, anywhere (its navbar, its footer), and
 * passes the same `paused` to `MahaamTemplate`. Autoplay longer than 5 seconds
 * needs a way to stop it (WCAG 2.2.2, Level A).
 *
 * The icon is Pause while the page plays and Play while it is paused, and the
 * name changes with it (the HeroVelocityMarquee pattern). It sets no
 * `aria-pressed`: a changing name plus a pressed state would announce the state
 * twice. Neither icon is mirrored in RTL.
 */

type Locale = "en" | "ar"

export interface MahaamMotionToggleLabels {
  /** The name while the page plays. */
  pause: string
  /** The name while the page is paused. */
  play: string
}

/** Figma's names, English and Arabic. */
export const mahaamMotionToggleLabels: Record<Locale, MahaamMotionToggleLabels> = {
  en: { pause: "Pause animation", play: "Play animation" },
  ar: { pause: "إيقاف الحركة مؤقتًا", play: "تشغيل الحركة" },
}

export interface MahaamMotionToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Whether the page is paused. The icon and the name follow it. */
  paused: boolean
  /** Called with the new state when the toggle is pressed. Set `paused` from it. */
  onPausedChange?: (paused: boolean) => void
  /** Which language the default names are in. */
  locale?: Locale
  /** The names, in place of `locale`'s. */
  labels?: Partial<MahaamMotionToggleLabels>
}

export function MahaamMotionToggle({ paused, onPausedChange, locale = "en", labels, className, onClick, ...props }: MahaamMotionToggleProps) {
  const names = { ...mahaamMotionToggleLabels[locale], ...labels }
  const Icon = paused ? Play : Pause
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      radius="rounded"
      aria-label={paused ? names.play : names.pause}
      className={cn("bg-background", className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) onPausedChange?.(!paused)
      }}
      {...props}
    >
      <Icon aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth />
    </Button>
  )
}
