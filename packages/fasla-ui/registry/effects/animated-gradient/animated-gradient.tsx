"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../../../src/lib/utils"

/**
 * The colours, without blank entries (a cleared control, say); the fallback
 * when none are left, since an empty list would draw nothing.
 */
const filledList = (colors: string[] | undefined, fallback: string[]) => {
  const usable = (colors ?? []).filter((color) => typeof color === "string" && color.trim())
  return usable.length ? usable : fallback
}

const GRADIENT_COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "hsl(280 100% 70%)",
  "hsl(200 100% 70%)",
]

const TEXT_COLORS = ["var(--primary)", "hsl(280 100% 70%)", "var(--primary)"]

export interface AnimatedGradientProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Gradient colors */
  colors?: string[]
  /** Animation speed in seconds */
  speed?: number
  /** Blur amount */
  blur?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
}

const blurValues = {
  sm: "blur-sm",
  md: "blur-md",
  lg: "blur-lg",
  xl: "blur-xl",
  "2xl": "blur-2xl",
  "3xl": "blur-3xl",
}

/**
 * Animated gradient background with moving color blobs.
 * Respects prefers-reduced-motion by stopping animation.
 */
export function AnimatedGradient({
  colors: colorsProp,
  speed = 10,
  blur = "3xl",
  className,
  children,
  ...props
}: AnimatedGradientProps) {
  const prefersReducedMotion = useReducedMotion()
  const colors = filledList(colorsProp, GRADIENT_COLORS)

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      {...props}
    >
      {/* Gradient blobs */}
      <div className="absolute inset-0 -z-10">
        {colors.map((color, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute h-[50%] w-[50%] rounded-full opacity-60",
              blurValues[blur]
            )}
            style={{
              background: color,
              left: `${(i % 2) * 50}%`,
              top: `${Math.floor(i / 2) * 50}%`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: [0, 30, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.1, 0.9, 1],
                  }
            }
            transition={{
              duration: speed + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      {children}
    </div>
  )
}

/**
 * Animated gradient text effect.
 */
export interface AnimatedGradientTextProps {
  /** Gradient colors for text */
  colors?: string[]
  /** Animation speed in seconds */
  speed?: number
  /** Additional class names */
  className?: string
  /** Text content */
  children: React.ReactNode
}

export function AnimatedGradientText({
  colors: colorsProp,
  speed = 3,
  className,
  children,
}: AnimatedGradientTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const colors = filledList(colorsProp, TEXT_COLORS)

  return (
    <motion.span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "200% auto",
      }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              backgroundPosition: ["0% center", "200% center"],
            }
      }
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  )
}
