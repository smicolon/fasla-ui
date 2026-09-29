"use client"

import * as React from "react"
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion"
import { cn } from "../../../src/lib/utils"

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
  colorFrom = "var(--primary)",
  colorTo = "transparent",
  delay = 0,
  className,
  children,
  ...props
}: BorderBeamProps) {
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

const intensityValues = {
  sm: "0 0 10px 2px",
  md: "0 0 20px 4px",
  lg: "0 0 30px 6px",
}

/**
 * Static glowing border effect.
 */
export function GlowingBorder({
  glowColor = "color-mix(in oklch, var(--primary) 50%, transparent)",
  borderRadius = "0.5rem",
  intensity = "md",
  className,
  children,
  ...props
}: GlowingBorderProps) {
  return (
    <div
      className={cn("relative isolate", className)}
      style={{
        borderRadius,
      }}
      {...props}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          borderRadius,
          boxShadow: `${intensityValues[intensity]} ${glowColor}`,
        }}
      />
      {children}
    </div>
  )
}
