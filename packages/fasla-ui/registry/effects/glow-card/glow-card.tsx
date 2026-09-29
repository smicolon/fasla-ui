"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/**
 * Whether the user asks for reduced motion. It starts false, so the server and
 * the first client render agree, then follows the setting as it changes.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])
  return reduced
}

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
  glowColor = "var(--primary)",
  glowIntensity = 60,
  followMouse = false,
  hoverOnly = true,
  className,
  children,
  ...props
}: GlowCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  // Pointer position in px from the card's top-left; null keeps the glow centred.
  const [mousePosition, setMousePosition] = React.useState<{ x: number; y: number } | null>(null)
  const [isHovering, setIsHovering] = React.useState(false)

  const prefersReducedMotion = usePrefersReducedMotion()

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!followMouse || !cardRef.current || prefersReducedMotion) return

      const rect = cardRef.current.getBoundingClientRect()
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [followMouse, prefersReducedMotion]
  )

  const showGlow = prefersReducedMotion ? false : hoverOnly ? isHovering : true
  // The glow layer overhangs the card by the blur radius on every side, so the
  // blur has colour to spread instead of fading into the card's clipped edge.
  const overhang = glowIntensity
  const glowAt = mousePosition ? `${mousePosition.x + overhang}px ${mousePosition.y + overhang}px` : "50% 50%"
  const edgeAt = mousePosition ? `${mousePosition.x}px ${mousePosition.y}px` : "50% 50%"

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn("relative isolate overflow-hidden rounded-xl border bg-card", className)}
      {...props}
    >
      {/*
        Glow: above the card surface and below the content, so it shows through
        it. The colour is softened so text on top keeps its contrast.
      */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute opacity-0 transition-opacity duration-300",
          showGlow && "opacity-100"
        )}
        style={{
          inset: -overhang,
          background: `radial-gradient(circle at ${glowAt}, color-mix(in oklch, ${glowColor} 60%, transparent), transparent 40%)`,
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* Card content */}
      <div className="relative">{children}</div>

      {/* Edge glow: a 1px ring above the content, just inside the border */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
          showGlow && "opacity-100"
        )}
        style={{
          background: `radial-gradient(circle at ${edgeAt}, ${glowColor}, transparent 50%)`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
        }}
      />
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
  glowColor = "var(--primary)",
  duration = 3,
  className,
  children,
  ...props
}: GlowContainerProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl p-px", className)}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-slide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      ` }} />
      {/* The glow is its own layer so it can mirror in RTL and slide in the reading direction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rtl:-scale-x-100"
        style={
          !prefersReducedMotion
            ? {
                background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})`,
                backgroundSize: "200% 100%",
                animation: `glow-slide ${duration}s linear infinite`,
              }
            : { background: glowColor }
        }
      />
      <div className="relative z-10 rounded-[11px] bg-background">
        {children}
      </div>
    </div>
  )
}
