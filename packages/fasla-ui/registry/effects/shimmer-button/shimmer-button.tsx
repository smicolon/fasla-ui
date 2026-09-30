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

/** The value, or the fallback when it is missing or blank (a cleared control, say). */
const filled = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value : fallback

const DEFAULTS = {
  // primary-foreground, not primary: a primary sheen on the primary background is invisible
  shimmerColor: "color-mix(in oklch, var(--primary-foreground) 35%, transparent)",
  shimmerSize: "100%",
  shimmerDuration: "2s",
  borderRadius: "0.5rem",
  background: "var(--primary)",
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
      shimmerColor,
      shimmerSize,
      shimmerDuration,
      borderRadius,
      background,
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
          "group relative inline-flex h-10 items-center justify-center overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-medium text-primary-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Plain hover, gated in JS rather than with a stacked motion-safe
          // hover variant: Storybook's pseudo-states addon rewrites that
          // stacked rule into invalid CSS and throws. Tailwind reads comments
          // too, so the stacked class name must not appear here either.
          !prefersReducedMotion && "hover:scale-105",
          className
        )}
        style={
          {
            // A blank value (a cleared control, say) falls back to the default
            // rather than emptying the variable, which would hide the sheen,
            // stop it, square the corners or clear the background.
            "--shimmer-color": filled(shimmerColor, DEFAULTS.shimmerColor),
            "--shimmer-size": filled(shimmerSize, DEFAULTS.shimmerSize),
            "--shimmer-duration": filled(shimmerDuration, DEFAULTS.shimmerDuration),
            "--border-radius": filled(borderRadius, DEFAULTS.borderRadius),
            "--background": filled(background, DEFAULTS.background),
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
