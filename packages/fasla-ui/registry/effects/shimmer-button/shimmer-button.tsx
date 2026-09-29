"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "../../../src/lib/utils"

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shimmer color */
  shimmerColor?: string
  /** Width of the sheen, as any CSS length or percentage of the button */
  shimmerSize?: string
  /** Border radius */
  borderRadius?: string
  /** Shimmer duration in seconds */
  shimmerDuration?: string
  /** Background color */
  background?: string
}

const SHIMMER_KEYFRAMES = `
  @keyframes fasla-shimmer {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }
`

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
      // primary-foreground, not primary: a primary sheen on the primary background is invisible
      shimmerColor = "color-mix(in oklch, var(--primary-foreground) 35%, transparent)",
      shimmerSize = "100%",
      shimmerDuration = "2s",
      borderRadius = "0.5rem",
      background = "var(--primary)",
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
          "group relative inline-flex h-10 items-center justify-center overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-medium text-primary-foreground transition-all motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
        {/* Shimmer effect: mirrored in RTL so it sweeps in the reading direction */}
        {!prefersReducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rtl:-scale-x-100"
            style={{ borderRadius: "var(--border-radius)" }}
          >
            {/*
              The keyframes ship with the component, so it animates without any
              Tailwind config. The track is the button's width and travels from
              fully before it to fully after it; the sheen sits at its centre.
            */}
            <style dangerouslySetInnerHTML={{ __html: SHIMMER_KEYFRAMES }} />
            <div
              className="absolute inset-0 flex justify-center"
              style={{
                transform: "translateX(-100%)",
                animation: "fasla-shimmer var(--shimmer-duration) ease-in-out infinite",
              }}
            >
              <div
                className="h-full shrink-0"
                style={{
                  width: "var(--shimmer-size)",
                  background:
                    "linear-gradient(90deg, transparent 0%, var(--shimmer-color) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    )
  }
)
ShimmerButton.displayName = "ShimmerButton"
