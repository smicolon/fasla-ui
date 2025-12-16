"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glow color (any CSS color) */
  glowColor?: string
  /** Glow intensity (blur radius in pixels) */
  glowIntensity?: number
  /** Whether glow follows mouse */
  followMouse?: boolean
  /** Whether to show glow on hover only */
  hoverOnly?: boolean
  children: React.ReactNode
}

export function GlowCard({
  glowColor = "hsl(var(--primary))",
  glowIntensity = 60,
  followMouse = false,
  hoverOnly = true,
  className,
  children,
  ...props
}: GlowCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = React.useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = React.useState(false)

  // Check for reduced motion preference
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!followMouse || !cardRef.current || prefersReducedMotion) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })
    },
    [followMouse, prefersReducedMotion]
  )

  const showGlow = prefersReducedMotion ? false : hoverOnly ? isHovering : true

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn("relative overflow-hidden rounded-xl", className)}
      {...props}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300",
          showGlow && "opacity-100"
        )}
        style={{
          background: followMouse
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${glowColor}, transparent 70%)`
            : `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* Border glow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
          showGlow && "opacity-50"
        )}
        style={{
          background: followMouse
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${glowColor}, transparent 50%)`
            : undefined,
          padding: "1px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Card content */}
      <div className="relative z-10 rounded-xl border bg-card">
        {children}
      </div>
    </div>
  )
}

export interface GlowContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glow color */
  glowColor?: string
  /** Animation duration in seconds */
  duration?: number
  children: React.ReactNode
}

export function GlowContainer({
  glowColor = "hsl(var(--primary))",
  duration = 3,
  className,
  children,
  ...props
}: GlowContainerProps) {
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl p-px", className)}
      style={
        !prefersReducedMotion
          ? {
              background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})`,
              backgroundSize: "200% 100%",
              animation: `glow-slide ${duration}s linear infinite`,
            }
          : { background: glowColor }
      }
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-slide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      ` }} />
      <div className="relative z-10 rounded-[11px] bg-background">
        {children}
      </div>
    </div>
  )
}
