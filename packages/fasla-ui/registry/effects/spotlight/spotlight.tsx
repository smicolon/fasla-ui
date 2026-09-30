"use client"

import * as React from "react"
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { cn } from "../../../src/lib/utils"

/** A layout effect in the browser, a plain effect on the server (where neither runs). */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

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
  color = "color-mix(in oklch, var(--primary) 15%, transparent)",
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

  // Rest at the centre, not the top-left corner, until the pointer moves, and
  // follow the centre while the container resizes (a sidebar opening, say).
  const pointerMoved = React.useRef(false)
  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const centre = () => {
      if (pointerMoved.current) return
      const x = el.offsetWidth / 2 - size / 2
      const y = el.offsetHeight / 2 - size / 2
      mouseX.jump(x)
      mouseY.jump(y)
      springX.jump(x)
      springY.jump(y)
    }
    centre()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(centre)
    observer.observe(el)
    return () => observer.disconnect()
  }, [mouseX, mouseY, springX, springY, size, prefersReducedMotion])

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || prefersReducedMotion) return

      pointerMoved.current = true
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
      className={cn("relative isolate overflow-hidden", className)}
      {...props}
    >
      {/* Spotlight. Pinned to the top-left corner: without it, a flex parent that
          centres its content would move the origin the pointer offsets start from. */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 -z-10 rounded-full"
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
  spotlightColor = "color-mix(in oklch, var(--primary) 10%, transparent)",
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
        "relative isolate overflow-hidden rounded-xl border bg-card p-6 shadow",
        className
      )}
      {...props}
    >
      {/*
        Spotlight. Centred on the pointer by offsetting half its size: a CSS
        translate(-50%, -50%) is overwritten by the x and y motion values.
      */}
      <AnimatePresence>
        {!prefersReducedMotion && isHovered && (
          <motion.div
            className="pointer-events-none absolute -z-10 rounded-full"
            style={{
              x: mouseX,
              y: mouseY,
              left: -spotlightSize / 2,
              top: -spotlightSize / 2,
              width: spotlightSize,
              height: spotlightSize,
              background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      {children}
    </div>
  )
}
