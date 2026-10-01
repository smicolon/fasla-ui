"use client"

import * as React from "react"
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { cn } from "../../../src/lib/utils"

/** A layout effect in the browser, a plain effect on the server (where neither runs). */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/** The value, or the fallback when it is missing or blank (a cleared control, say). */
const filled = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value : fallback

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
  color: colorProp,
  size = 400,
  blur = 80,
  opacity = 1,
  className,
  children,
  ...props
}: SpotlightProps) {
  const color = filled(colorProp, "color-mix(in oklch, var(--primary) 15%, transparent)")
  const prefersReducedMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 200 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // The motion values hold the light's centre, and the light is offset by half
  // its size through left and top, so a change of size keeps it centred on the
  // same point instead of drifting away from the pointer.
  //
  // Rest at the container's centre, not its top-left corner, until the pointer
  // moves, and follow that centre while the container resizes (a sidebar
  // opening, say).
  const pointerMoved = React.useRef(false)
  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const centre = () => {
      if (pointerMoved.current) return
      const x = el.offsetWidth / 2
      const y = el.offsetHeight / 2
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
  }, [mouseX, mouseY, springX, springY, prefersReducedMotion])

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || prefersReducedMotion) return

      pointerMoved.current = true
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY, prefersReducedMotion]
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
      {/* Spotlight. Placed from the top-left corner (a flex parent that centres
          its content would otherwise move the origin), then pulled back by half
          its size so x and y are its centre. */}
      <motion.div
        className="pointer-events-none absolute -z-10 rounded-full"
        style={{
          x: springX,
          y: springY,
          left: -size / 2,
          top: -size / 2,
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
  spotlightColor: spotlightColorProp,
  spotlightSize = 300,
  className,
  children,
  ...props
}: SpotlightCardProps) {
  const spotlightColor = filled(spotlightColorProp, "color-mix(in oklch, var(--primary) 10%, transparent)")
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
