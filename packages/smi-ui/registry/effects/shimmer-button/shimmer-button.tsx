"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../../../src/lib/utils"

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shimmer color */
  shimmerColor?: string
  /** Shimmer size in pixels */
  shimmerSize?: string
  /** Border radius */
  borderRadius?: string
  /** Shimmer duration in seconds */
  shimmerDuration?: string
  /** Background color */
  background?: string
}

/**
 * A button with an animated shimmer effect.
 * The shimmer respects prefers-reduced-motion.
 */
export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "hsl(var(--primary) / 0.2)",
      shimmerSize = "0.1em",
      shimmerDuration = "2s",
      borderRadius = "0.5rem",
      background = "hsl(var(--primary))",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()

    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex h-10 items-center justify-center overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
            borderRadius: "var(--border-radius)",
            background: "var(--background)",
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Shimmer effect */}
        {!prefersReducedMotion && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: "var(--border-radius)" }}
          >
            <div
              className="animate-shimmer absolute inset-0 -translate-x-full"
              style={{
                background: `linear-gradient(
                  90deg,
                  transparent 0%,
                  var(--shimmer-color) 50%,
                  transparent 100%
                )`,
                animationDuration: "var(--shimmer-duration)",
              }}
            />
          </div>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    )
  }
)
ShimmerButton.displayName = "ShimmerButton"
