"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { cn } from "../../../src/lib/utils"

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spotlight color */
  color?: string
  /** Spotlight size in pixels */
  size?: number
  /** Spotlight blur in pixels */
  blur?: number
  /** Opacity of the spotlight */
  opacity?: number
}

/**
 * Cursor-following spotlight effect.
 * Respects prefers-reduced-motion by disabling the effect.
 */
export function Spotlight({
  color = "hsl(var(--primary) / 0.15)",
  size = 400,
  blur = 80,
  opacity = 1,
  className,
  children,
  ...props
}: SpotlightProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 200 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || prefersReducedMotion) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      mouseX.set(x)
      mouseY.set(y)
    },
    [mouseX, mouseY, size, prefersReducedMotion]
  )

  if (prefersReducedMotion) {
    return (
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {/* Spotlight */}
      <motion.div
        className="pointer-events-none absolute -z-10 rounded-full"
        style={{
          x: springX,
          y: springY,
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      />

      {/* Content */}
      {children}
    </div>
  )
}

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spotlight color */
  spotlightColor?: string
  /** Spotlight size */
  spotlightSize?: number
}

/**
 * Card with spotlight effect on hover.
 */
export function SpotlightCard({
  spotlightColor = "hsl(var(--primary) / 0.1)",
  spotlightSize = 300,
  className,
  children,
  ...props
}: SpotlightCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || prefersReducedMotion) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mouseX.set(x)
      mouseY.set(y)
    },
    [mouseX, mouseY, prefersReducedMotion]
  )

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 shadow",
        className
      )}
      {...props}
    >
      {/* Spotlight */}
      {!prefersReducedMotion && isHovered && (
        <motion.div
          className="pointer-events-none absolute -z-10 rounded-full"
          style={{
            x: mouseX,
            y: mouseY,
            width: spotlightSize,
            height: spotlightSize,
            background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Content */}
      {children}
    </div>
  )
}
