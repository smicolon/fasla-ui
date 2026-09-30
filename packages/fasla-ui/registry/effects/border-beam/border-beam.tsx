"use client"

import * as React from "react"
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion"
import { cn } from "../../../src/lib/utils"

/** The value, or the fallback when it is missing or blank (a cleared control, say). */
const filled = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value : fallback

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Duration of the animation in seconds */
  duration?: number
  /** Border width */
  borderWidth?: number
  /** Color of the beam */
  colorFrom?: string
  /** End color of the beam */
  colorTo?: string
  /** Delay before animation starts */
  delay?: number
}

/**
 * Animated border beam effect that travels around the element.
 * Respects prefers-reduced-motion.
 */
export function BorderBeam({
  duration = 4,
  borderWidth = 2,
  colorFrom: colorFromProp,
  colorTo: colorToProp,
  delay = 0,
  className,
  children,
  ...props
}: BorderBeamProps) {
  const colorFrom = filled(colorFromProp, "var(--primary)")
  const colorTo = filled(colorToProp, "transparent")
  const prefersReducedMotion = useReducedMotion()

  // The beam is a conic gradient whose start angle turns, so it runs round
  // the border of any shape; rotating a layer only works for a square.
  const angle = useMotionValue(0)
  React.useEffect(() => {
    if (prefersReducedMotion) return
    const controls = animate(angle, 360, {
      duration,
      delay,
      ease: "linear",
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [angle, duration, delay, prefersReducedMotion])
  const background = useTransform(
    angle,
    (a) => `conic-gradient(from ${a}deg, transparent 0deg 270deg, ${colorTo} 270deg, ${colorFrom} 360deg)`
  )

  /** Paints only a borderWidth ring: the content box is masked out. */
  const ring: React.CSSProperties = {
    padding: borderWidth,
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
  }

  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-lg", className)}
      {...props}
    >
      {/* Content */}
      <div className="relative rounded-[inherit] bg-background">
        {children}
      </div>

      {/* The ring sits above the content, over its outer edge, so the content cannot cover it */}
      {prefersReducedMotion ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{ ...ring, background: colorFrom, opacity: 0.5 }}
        />
      ) : (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{ ...ring, background }}
        />
      )}
    </div>
  )
}

export interface GlowingBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glow color */
  glowColor?: string
  /** Border radius */
  borderRadius?: string
  /** Glow intensity */
  intensity?: "sm" | "md" | "lg"
}

/**
 * The ring's width and the blur of the glow that hugs it, in px. The glow has
 * no spread, so it stays close to the edge instead of casting a shadow.
 */
const intensityValues = {
  sm: { ring: 1, glow: 4 },
  md: { ring: 1, glow: 8 },
  lg: { ring: 2, glow: 12 },
}

/**
 * Static glowing border: a coloured ring on the element's edge with a soft,
 * tight glow around it. The ring is the border, so the content needs none.
 */
export function GlowingBorder({
  glowColor: glowColorProp,
  borderRadius: borderRadiusProp,
  intensity = "md",
  className,
  children,
  ...props
}: GlowingBorderProps) {
  const glowColor = filled(glowColorProp, "color-mix(in oklch, var(--primary) 50%, transparent)")
  const borderRadius = filled(borderRadiusProp, "0.5rem")
  const { ring, glow } = intensityValues[intensity]
  return (
    <div
      className={cn("relative isolate", className)}
      style={{
        borderRadius,
      }}
      {...props}
    >
      {children}
      {/*
        Above the content, so a card's own background cannot cover it. The inset
        shadow draws the ring just inside the edge, over any neutral border the
        content has; the outer ones are the glow.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          borderRadius,
          // Two stacked blurs, no spread: a denser glow at the edge that fades fast.
          boxShadow: `inset 0 0 0 ${ring}px ${glowColor}, 0 0 ${glow / 2}px 0 ${glowColor}, 0 0 ${glow}px 0 ${glowColor}`,
        }}
      />
    </div>
  )
}
