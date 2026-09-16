"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
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
  colorFrom = "hsl(var(--primary))",
  colorTo = "transparent",
  delay = 0,
  className,
  children,
  ...props
}: BorderBeamProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      {...props}
    >
      {/* Border beam */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            padding: borderWidth,
            background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Static border fallback for reduced motion */}
      {prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            padding: borderWidth,
            background: colorFrom,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            opacity: 0.5,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 rounded-[inherit] bg-background">
        {children}
      </div>
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
  glowColor = "hsl(var(--primary) / 0.5)",
  borderRadius = "0.5rem",
  intensity = "md",
  className,
  children,
  ...props
}: GlowingBorderProps) {
  return (
    <div
      className={cn("relative", className)}
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
