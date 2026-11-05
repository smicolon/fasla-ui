"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"

/*
 * Figma: `Mahaam Template` (47694:6712), the `Pause control` in each section
 * that loops: Figma's Icon Button, Outline, Secondary, sm, Rounded, with the
 * `pause` icon (`play` while paused).
 *
 * The template's loops play on their own (see `mahaam-motion.ts`), so a
 * visitor can stop them (WCAG 2.2.2). It is the same pattern as the Velocity
 * Marquee Hero's: the icon is Pause while the section plays and Play while it
 * is paused, and the name says the same. Neither icon is mirrored in RTL.
 *
 * It does not place itself: each section puts it where Figma does, by the
 * `className` it gives it, and does not draw it under reduced motion.
 */

type Locale = "en" | "ar"

export interface MahaamPauseButtonLabels {
  /** The name while the section plays. */
  pause: string
  /** The name while the section is paused. */
  play: string
}

/** Figma's names, English and Arabic. */
export const mahaamPauseLabels: Record<Locale, MahaamPauseButtonLabels> = {
  en: { pause: "Pause animation", play: "Play animation" },
  ar: { pause: "إيقاف الحركة مؤقتًا", play: "تشغيل الحركة" },
}

export interface MahaamPauseButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Whether the section is paused. The icon and the name follow it. */
  paused: boolean
  /** Which language the default names are in. */
  locale?: Locale
  /** The names, in place of `locale`'s. */
  labels?: Partial<MahaamPauseButtonLabels>
}

export function MahaamPauseButton({ paused, locale = "en", labels, className, ...props }: MahaamPauseButtonProps) {
  const names = { ...mahaamPauseLabels[locale], ...labels }
  const Icon = paused ? Play : Pause
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      radius="rounded"
      aria-label={paused ? names.play : names.pause}
      className={cn("bg-background", className)}
      {...props}
    >
      <Icon aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth />
    </Button>
  )
}

/**
 * The state of a section's pause control: controlled by `paused`, or its own,
 * starting from `defaultPaused`. `toggle` flips it and says so to
 * `onPausedChange`.
 */
export function usePausedState({
  paused,
  defaultPaused = false,
  onPausedChange,
}: {
  paused?: boolean
  defaultPaused?: boolean
  onPausedChange?: (paused: boolean) => void
}) {
  const [own, setOwn] = React.useState(defaultPaused)
  const isPaused = paused ?? own
  const toggle = () => {
    const next = !isPaused
    if (paused === undefined) setOwn(next)
    onPausedChange?.(next)
  }
  return { paused: isPaused, toggle }
}
